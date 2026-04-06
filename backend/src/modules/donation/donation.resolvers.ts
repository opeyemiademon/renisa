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

type MonetaryDonationData = {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorAddress?: string;
  donorCity?: string;
  donorState?: string;
  memberId?: string;
  donationTypeId: string;
  amount: number;
  currency?: string;
  notes?: string;
};

async function runMonetaryDonation(
  data: MonetaryDonationData,
  options: { paymentMethod: 'paystack' | 'bank_transfer'; manualTransferReference?: string }
) {
  const donationType = await DonationType.findById(data.donationTypeId);
  if (!donationType) throw new Error('Donation type not found');

  const invoiceNumber = generateInvoiceNumber();
  const paystackRef =
    options.paymentMethod === 'paystack'
      ? `RENISA-DON-${uuidv4().slice(0, 8).toUpperCase()}`
      : `RENISA-DON-M-${uuidv4().slice(0, 8).toUpperCase()}`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const donation = await Donation.create({
    ...data,
    donationMode: 'monetary',
    paymentMethod: options.paymentMethod,
    paymentStatus: 'pending',
    paystackRef,
    ...(options.manualTransferReference
      ? { manualTransferReference: options.manualTransferReference }
      : {}),
  });

  const outputPath = path.join(process.cwd(), 'uploads', UPLOAD_FOLDERS.INVOICES, `${invoiceNumber}.pdf`);
  let pdfUrl: string | undefined;
  const paymentLinkHint =
    options.paymentMethod === 'paystack'
      ? `${FRONTEND_URL}/donate/pay/${paystackRef}`
      : `${FRONTEND_URL}/contact`;

  try {
    await generateDonationInvoice(
      {
        invoiceNumber,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        donationTypeName: donationType.name,
        amount: data.amount,
        currency: data.currency || 'NGN',
        dueDate,
        paymentLink: paymentLinkHint,
      },
      outputPath
    );
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

  if (options.paymentMethod === 'paystack' && data.donorEmail && PAYSTACK_SECRET) {
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
        donationInvoiceTemplate(
          data.donorName,
          invoiceNumber,
          data.amount,
          authorizationUrl || `${FRONTEND_URL}/donation`
        )
      ).catch(console.error);
    } catch (err) {
      console.error('Paystack init error:', err);
    }
  } else if (options.paymentMethod === 'bank_transfer' && data.donorEmail) {
    const extra = options.manualTransferReference
      ? `<p>Your stated transfer reference: <strong>${options.manualTransferReference}</strong></p>`
      : '';
    sendEmail(
      data.donorEmail,
      `Donation received (pending verification) - RENISA`,
      `<p>Dear ${data.donorName},</p><p>Thank you. We recorded your pledge of <strong>NGN ${data.amount.toLocaleString()}</strong> and will verify your bank transfer shortly.</p>${extra}<p>Invoice: ${invoiceNumber}</p>`
    ).catch(console.error);
  }

  const populated = await Donation.findById(donation._id)
    .populate('donationTypeId', 'name donationMode')
    .populate('invoiceId');

  return {
    success: true,
    message:
      options.paymentMethod === 'paystack'
        ? authorizationUrl
          ? 'Donation invoice generated'
          : 'Donation recorded; Paystack could not be started. Use bank transfer or try again later.'
        : 'Donation submitted. We will verify your transfer shortly.',
    data: populated,
    authorizationUrl,
    invoiceNumber,
  };
}

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
    preferredDropoffDate: (parent: any) =>
      parent.preferredDropoffDate
        ? new Date(parent.preferredDropoffDate).toISOString()
        : null,
    currency: (parent: any) => parent.currency || 'NGN',
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
        .populate('invoiceId')
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
      const donation = await Donation.create({
        ...data,
        donationMode: 'physical',
        status: 'pending',
        paymentStatus: 'pending',
      });
      return { success: true, message: 'Physical donation submitted. We will contact you soon.', data: donation };
    },

    initiateMonetaryDonation: async (_: any, { data }: { data: any }) => {
      return runMonetaryDonation(data, { paymentMethod: 'paystack' });
    },

    submitManualMonetaryDonation: async (_: any, { data }: { data: any }) => {
      const ref = data.manualTransferReference?.trim();
      if (!ref) throw new Error('Bank transfer reference is required');
      const { manualTransferReference: _m, ...core } = data;
      return runMonetaryDonation(core, {
        paymentMethod: 'bank_transfer',
        manualTransferReference: ref,
      });
    },

    verifyDonationPayment: async (_: any, { reference }: any) => {
      const paystackRef = reference;
      const donation = await Donation.findOne({ paystackRef });
      if (!donation) throw new Error('Donation not found');

      try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${paystackRef}`, {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
        });
        const isSuccessful = response.data.data.status === 'success';

        const updated = await Donation.findByIdAndUpdate(
          donation._id,
          {
            paymentStatus: isSuccessful ? 'successful' : 'failed',
            paidAt: isSuccessful ? new Date() : undefined,
            status: isSuccessful ? 'received' : 'pending',
          },
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
