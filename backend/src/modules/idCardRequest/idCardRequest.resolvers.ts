import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import IDCardRequest from './idCardRequest.model.js';
import IDCardSettings from '../idCardSettings/idCardSettings.model.js';
import Member from '../member/member.model.js';
import { requireMemberAuth, requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { generateIDCard } from '../../utils/idCardGenerator.js';
import { sendEmail, idCardStatusTemplate } from '../../utils/emailService.js';
import { UPLOAD_FOLDERS } from '../../utils/constants.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payment/callback';

const idCardRequestResolvers = {
  IDCardRequest: {
    member: (parent: any) => parent.memberId,
    photo: (parent: any) => parent.uploadedPhoto,
    cardUrl: (parent: any) => parent.generatedCardFront,
  },

  Query: {
    getMyIDCardRequests: async (_: any, __: any, context: AuthContext) => {
      requireMemberAuth(context);
      return await IDCardRequest.find({ memberId: context.member!.id })
        .sort({ createdAt: -1 });
    },

    getAllIDCardRequests: async (_: any, { adminStatus, paymentStatus }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const filter: any = {};
      if (adminStatus) filter.adminStatus = adminStatus;
      if (paymentStatus) filter.paymentStatus = paymentStatus;
      return await IDCardRequest.find(filter)
        .populate('memberId', 'firstName lastName memberNumber email profilePicture sport state')
        .populate('reviewedBy', 'name email')
        .sort({ createdAt: -1 });
    },

    getIDCardRequest: async (_: any, { id }: { id: string }, context: AuthContext) => {
      if (!context.isAuthenticated) throw new Error('Authentication required');
      return await IDCardRequest.findById(id)
        .populate('memberId', 'firstName lastName memberNumber profilePicture')
        .populate('reviewedBy', 'name email');
    },
  },

  Mutation: {
    requestIDCard: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireMemberAuth(context);
      const settings = await IDCardSettings.findOne();
      if (!settings || !settings.isEnabled) throw new Error('ID card requests are currently disabled');
      const amount = data.requestType === 'online' ? settings.onlineFee : settings.physicalFee;
      const request = await IDCardRequest.create({
        memberId: context.member!.id,
        requestType: data.requestType,
        uploadedPhoto: data.uploadedPhoto || data.photo,
        deliveryAddress: data.deliveryAddress,
        amount,
        paymentStatus: 'pending',
        adminStatus: 'pending',
      });
      return { success: true, message: 'ID card request submitted', data: request };
    },

    initiateIDCardPayment: async (_: any, { requestId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const request = await IDCardRequest.findById(requestId);
      if (!request) throw new Error('ID card request not found');
      if (request.memberId.toString() !== context.member!.id) throw new Error('Unauthorized');
      if (request.paymentStatus === 'paid') throw new Error('Payment already completed');

      const member = await Member.findById(context.member!.id);
      if (!member) throw new Error('Member not found');

      const paymentRef = `RENISA-ID-${uuidv4().slice(0, 8).toUpperCase()}`;
      await IDCardRequest.findByIdAndUpdate(requestId, { paymentRef });

      try {
        const response = await axios.post(
          'https://api.paystack.co/transaction/initialize',
          {
            email: member.email,
            amount: request.amount * 100,
            reference: paymentRef,
            callback_url: PAYSTACK_CALLBACK_URL,
            metadata: { requestId: requestId, type: 'id_card' },
          },
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );
        return {
          success: true,
          message: 'Payment initiated',
          authorizationUrl: response.data.data.authorization_url,
          data: request,
        };
      } catch {
        throw new Error('Failed to initialize payment');
      }
    },

    verifyIDCardPayment: async (_: any, { reference }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const paystackRef = reference;
      const request = await IDCardRequest.findOne({ paymentRef: paystackRef });
      if (!request) throw new Error('Request not found');

      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${paystackRef}`,
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );
        const isSuccessful = response.data.data.status === 'success';
        const updated = await IDCardRequest.findByIdAndUpdate(
          request._id,
          { paymentStatus: isSuccessful ? 'paid' : 'failed', paidAt: isSuccessful ? new Date() : undefined },
          { new: true }
        );
        return { success: isSuccessful, message: isSuccessful ? 'Payment verified' : 'Payment failed', data: updated };
      } catch {
        throw new Error('Failed to verify payment');
      }
    },

    approveIDCardRequest: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const request = await IDCardRequest.findById(id).populate('memberId');
      if (!request) throw new Error('Request not found');

      const member = request.memberId as any;
      const settings = await IDCardSettings.findOne();
      const validityYears = settings?.validityYears || 1;
      const validUntil = String(new Date().getFullYear() + validityYears);

      const outputDir = path.join(process.cwd(), 'uploads', UPLOAD_FOLDERS.ID_CARDS);
      let generatedCardFront: string | undefined;
      let generatedCardBack: string | undefined;

      try {
        const profilePicPath = member.profilePicture
          ? path.join(process.cwd(), member.profilePicture.replace(/^\//, ''))
          : undefined;

        const result = await generateIDCard(
          {
            memberNumber: member.memberNumber,
            firstName: member.firstName,
            lastName: member.lastName,
            middleName: member.middleName,
            sport: member.sport,
            state: member.state,
            membershipYear: member.membershipYear,
            profilePicture: profilePicPath,
            validUntil,
          },
          outputDir
        );
        generatedCardFront = `/uploads/${UPLOAD_FOLDERS.ID_CARDS}/${path.basename(result.frontPath)}`;
        generatedCardBack = `/uploads/${UPLOAD_FOLDERS.ID_CARDS}/${path.basename(result.backPath)}`;
      } catch (err) {
        console.error('ID card generation error:', err);
      }

      const updated = await IDCardRequest.findByIdAndUpdate(
        id,
        {
          adminStatus: 'approved',
          reviewedBy: context.admin!.id,
          reviewedAt: new Date(),
          generatedCardFront,
          generatedCardBack,
        },
        { new: true }
      );

      sendEmail(
        member.email,
        'Your RENISA ID Card is Ready',
        idCardStatusTemplate(`${member.firstName} ${member.lastName}`, 'approved')
      ).catch(console.error);

      return { success: true, message: 'ID card request approved and card generated', data: updated };
    },

    rejectIDCardRequest: async (_: any, { id, reason }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const request = await IDCardRequest.findById(id).populate('memberId', 'firstName lastName email');
      if (!request) throw new Error('Request not found');
      const updated = await IDCardRequest.findByIdAndUpdate(
        id,
        { adminStatus: 'rejected', reviewedBy: context.admin!.id, reviewedAt: new Date(), rejectionReason: reason },
        { new: true }
      );
      const member = request.memberId as any;
      sendEmail(
        member.email,
        'RENISA ID Card Request Update',
        idCardStatusTemplate(`${member.firstName} ${member.lastName}`, 'rejected', reason)
      ).catch(console.error);
      return { success: true, message: 'ID card request rejected', data: updated };
    },

    updateIDCardDeliveryStatus: async (_: any, { id, deliveryStatus, trackingInfo }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const updated = await IDCardRequest.findByIdAndUpdate(
        id,
        { deliveryStatus, ...(trackingInfo && { trackingInfo }) },
        { new: true }
      );
      if (!updated) throw new Error('Request not found');
      return { success: true, message: 'Delivery status updated', data: updated };
    },
  },
};

export default idCardRequestResolvers;
