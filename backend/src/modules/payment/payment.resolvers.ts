import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Payment from './payment.model.js';
import PaymentType from '../paymentType/paymentType.model.js';
import Member from '../member/member.model.js';
import { requireMemberAuth, requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { sendEmail, paymentReceiptTemplate } from '../../utils/emailService.js';
import { createNotification } from '../../utils/createNotification.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payment/callback';

const paymentResolvers = {
  Payment: {
    member: (parent: any) => parent.memberId,
    paymentType: (parent: any) => parent.paymentTypeId,
    reference: (parent: any) => parent.transactionRef,
    method: (parent: any) => parent.paymentMethod,
  },

  Query: {
    getAllPayments: async (_: any, { memberId, status, year, paymentTypeId, dateFrom, dateTo, reference }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const filter: any = {};
      if (memberId) filter.memberId = memberId;
      if (status) filter.status = status;
      if (year) filter.year = year;
      if (paymentTypeId) filter.paymentTypeId = paymentTypeId;
      if (reference) filter.transactionRef = { $regex: reference, $options: 'i' };
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) {
          const end = new Date(dateTo);
          end.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = end;
        }
      }
      return await Payment.find(filter)
        .populate('memberId', 'firstName lastName memberNumber email')
        .populate('paymentTypeId', 'name amount')
        .populate('processedBy', 'name email')
        .sort({ createdAt: -1 });
    },

    getMemberPayments: async (_: any, { memberId }: any, context: AuthContext) => {
      if (!context.isAuthenticated) throw new Error('Authentication required');
      return await Payment.find({ memberId })
        .populate('paymentTypeId', 'name amount frequency')
        .sort({ createdAt: -1 });
    },

    getPayment: async (_: any, { id }: { id: string }, context: AuthContext) => {
      if (!context.isAuthenticated) throw new Error('Authentication required');
      return await Payment.findById(id)
        .populate('memberId', 'firstName lastName memberNumber email')
        .populate('paymentTypeId', 'name amount');
    },
  },

  Mutation: {
    initiatePayment: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireMemberAuth(context);
      const member = await Member.findById(context.member!.id);
      if (!member) throw new Error('Member not found');
      const paymentType = await PaymentType.findById(data.paymentTypeId);
      if (!paymentType) throw new Error('Payment type not found');

      const transactionRef = `RENISA-${uuidv4().slice(0, 8).toUpperCase()}`;
      const payYear = data.year || new Date().getFullYear();
      const amount = data.amount || (paymentType as any).amount;

      const payment = await Payment.create({
        transactionRef,
        memberId: member._id,
        paymentTypeId: data.paymentTypeId,
        amount,
        year: payYear,
        paymentMethod: 'paystack',
        status: 'pending',
      });

      try {
        const response = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          {
            email: member.email,
            amount: amount * 100,
            reference: transactionRef,
            callback_url: PAYSTACK_CALLBACK_URL,
            metadata: {
              paymentId: payment._id.toString(),
              memberId: member._id.toString(),
              paymentTypeId: data.paymentTypeId,
              year: payYear,
            },
          },
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );
        return {
          success: true,
          message: 'Payment initiated',
          authorizationUrl: response.data.data.authorization_url,
          transactionRef,
          reference: transactionRef,
          paymentId: payment._id.toString(),
        };
      } catch (err) {
        await Payment.findByIdAndDelete(payment._id);
        throw new Error('Failed to initialize payment with Paystack');
      }
    },

    verifyPayment: async (_: any, { reference }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const payment = await Payment.findOne({ transactionRef: reference });
      if (!payment) throw new Error('Payment not found');

      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );
        const data = response.data.data;
        const isSuccessful = data.status === 'success';

        const updated = await Payment.findByIdAndUpdate(
          payment._id,
          {
            status: isSuccessful ? 'successful' : 'failed',
            paystackRef: data.reference,
            paystackData: data,
            paidAt: isSuccessful ? new Date() : undefined,
          },
          { new: true }
        ).populate('memberId', 'firstName lastName email memberNumber')
         .populate('paymentTypeId', 'name');

        if (isSuccessful && updated) {
          const member = updated.memberId as any;
          const type = updated.paymentTypeId as any;
          sendEmail(
            member.email,
            'Payment Receipt - RENISA',
            paymentReceiptTemplate(
              `${member.firstName} ${member.lastName}`,
              updated.amount,
              type?.name || 'Payment',
              reference
            )
          ).catch(console.error);
          createNotification('new_payment', 'New Payment Received', `${member.firstName} ${member.lastName} paid ₦${updated.amount.toLocaleString()} for ${type?.name || 'Payment'}.`, updated._id.toString(), 'Payment');
        }

        return { success: isSuccessful, message: isSuccessful ? 'Payment verified' : 'Payment failed', data: updated };
      } catch (err) {
        throw new Error('Failed to verify payment with Paystack');
      }
    },

    deletePayment: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const payment = await Payment.findByIdAndDelete(id);
      if (!payment) throw new Error('Payment not found');
      return { success: true, message: 'Payment deleted successfully', data: null };
    },

    adminRecordPayment: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const transactionRef = data.reference
        ? `RENISA-ADMIN-${data.reference}`
        : `RENISA-ADMIN-${uuidv4().slice(0, 8).toUpperCase()}`;
      const payment = await Payment.create({
        memberId: data.memberId,
        paymentTypeId: data.paymentTypeId,
        amount: data.amount,
        year: data.year || new Date().getFullYear(),
        paymentMethod: data.paymentMethod || 'admin_credit',
        notes: data.notes || data.reference,
        transactionRef,
        status: 'successful',
        paidAt: new Date(),
        processedBy: context.admin!.id,
      });
      const populated = await Payment.findById(payment._id)
        .populate('memberId', 'firstName lastName memberNumber email')
        .populate('paymentTypeId', 'name amount');
      const m = (populated?.memberId as any);
      const pt = (populated?.paymentTypeId as any);
      if (m) createNotification('new_payment', 'Payment Recorded', `Admin recorded ₦${data.amount.toLocaleString()} payment for ${m.firstName} ${m.lastName} — ${pt?.name || 'Payment'}.`, payment._id.toString(), 'Payment');
      return { success: true, message: 'Payment recorded successfully', data: populated };
    },
  },
};

export default paymentResolvers;
