import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Donation from './donation.model.js';
import DonationInvoice from '../donationInvoice/donationInvoice.model.js';
import DonationType from '../donationType/donationType.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { sendEmail, donationInvoiceTemplate } from '../../utils/emailService.js';
import { generateDonationInvoice } from '../../utils/invoiceGenerator.js';
import { UPLOAD_FOLDERS } from '../../utils/constants.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payment/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `RENISA-INV-${year}-${rand}`;
};

const donationResolvers = {
  Donation: {
    member: (parent: any) => parent.memberId,
    donationType: (parent: any) => parent.donationTypeId,
    invoice: (parent: any) => parent.invoiceId,
    isAcknowledged: (parent: any) => parent.status === 'acknowledged',
    isMonetary: (parent: any) => parent.donationMode === 'monetary',
    items: (parent: any) => parent.physicalItems,
    description: (parent: any) => parent.notes,
    acknowledgedAt: (parent: any) => parent.updatedAt,
  },

  Query: {
    getAllDonations: async (_: any, { status, donationMode }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const filter: any = {};
      if (status) filter.status = status;
      if (donationMode) filter.donationMode = donationMode;
      return await Donation.find(filter)
        .populate('donationTypeId', 'name donationMode')
        .populate('memberId', 'firstName lastName memberNumber')
        .populate('acknowledgedBy', 'name')
        .sort({ createdAt: -1 });
    },

    getDonation: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      return await Donation.findById(id)
        .populate('donationTypeId', 'name donationMode')
        .populate('invoiceId');
    },
  },

  Mutation: {
    submitPhysicalDonation: async (_: any, { data }: { data: any }) => {
      const donation = await Donation.create({ ...data, donationMode: 'physical', status: 'pending', paymentStatus: 'pending' });
      return { success: true, message: 'Physical donation submitted. We will contact you soon.', data: donation };
    },

    initiateMonetaryDonation: async (_: any, { data }: { data: any }) => {
      const donationType = await DonationType.findById(data.donationTypeId);
      if (!donationType) throw new Error('Donation type not found');

      const invoiceNumber = generateInvoiceNumber();
      const paystackRef = `RENISA-DON-${uuidv4().slice(0, 8).toUpperCase()}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const donation = await Donation.create({
        ...data,
        donationMode: 'monetary',
        paymentMethod: 'paystack',
        paymentStatus: 'pending',
        paystackRef,
      });

      const outputPath = path.join(process.cwd(), 'uploads', UPLOAD_FOLDERS.INVOICES, `${invoiceNumber}.pdf`);
      let pdfUrl: string | undefined;
      try {
        await generateDonationInvoice({
          invoiceNumber,
          donorName: data.donorName,
          donorEmail: data.donorEmail,
          donationTypeName: donationType.name,
          amount: data.amount,
          currency: data.currency || 'NGN',
          dueDate,
          paymentLink: `${FRONTEND_URL}/donate/pay/${paystackRef}`,
        }, outputPath);
        pdfUrl = `/uploads/${UPLOAD_FOLDERS.INVOICES}/${invoiceNumber}.pdf`;
      } catch (err) {
        console.error('Invoice generation error:', err);
      }

      const invoice = await DonationInvoice.create({
        invoiceNumber,
        donationId: donation._id,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        donationTypeName: donationType.name,
        amount: data.amount,
        currency: data.currency || 'NGN',
        dueDate,
        status: 'unpaid',
        pdfUrl,
      });

      await Donation.findByIdAndUpdate(donation._id, { invoiceId: invoice._id });

      let authorizationUrl: string | undefined;
      if (data.donorEmail) {
        try {
          const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
              email: data.donorEmail,
              amount: data.amount * 100,
              reference: paystackRef,
              callback_url: PAYSTACK_CALLBACK_URL,
              metadata: { donationId: donation._id.toString(), invoiceNumber, type: 'donation' },
            },
            { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
          );
          authorizationUrl = response.data.data.authorization_url;

          sendEmail(
            data.donorEmail,
            `Donation Invoice #${invoiceNumber} - RENISA`,
            donationInvoiceTemplate(data.donorName, invoiceNumber, data.amount, authorizationUrl || `${FRONTEND_URL}/donate`)
          ).catch(console.error);
        } catch (err) {
          console.error('Paystack init error:', err);
        }
      }

      return {
        success: true,
        message: 'Donation invoice generated',
        data: donation,
        authorizationUrl,
        invoiceNumber,
      };
    },

    verifyDonationPayment: async (_: any, { reference }: any) => {
      const paystackRef = reference;
      const donation = await Donation.findOne({ paystackRef });
      if (!donation) throw new Error('Donation not found');

      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${paystackRef}`,
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );
        const isSuccessful = response.data.data.status === 'success';

        const updated = await Donation.findByIdAndUpdate(
          donation._id,
          { paymentStatus: isSuccessful ? 'successful' : 'failed', paidAt: isSuccessful ? new Date() : undefined, status: isSuccessful ? 'received' : 'pending' },
          { new: true }
        );

        if (isSuccessful && donation.invoiceId) {
          await DonationInvoice.findByIdAndUpdate(donation.invoiceId, { status: 'paid' });
        }

        return { success: isSuccessful, message: isSuccessful ? 'Payment verified' : 'Payment failed', data: updated };
      } catch {
        throw new Error('Failed to verify payment');
      }
    },

    acknowledgeDonation: async (_: any, { id, adminNotes }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const updated = await Donation.findByIdAndUpdate(
        id,
        { status: 'acknowledged', acknowledgedBy: context.admin!.id, adminNotes },
        { new: true }
      );
      if (!updated) throw new Error('Donation not found');
      return { success: true, message: 'Donation acknowledged', data: updated };
    },
  },
};

export default donationResolvers;
