import axios from 'axios';
import ElectionApplication from './electionApplication.model.js';
import Election from '../election/election.model.js';
import ElectoralPosition from '../electoralPosition/electoralPosition.model.js';
import Candidate from '../candidate/candidate.model.js';
import { requireMemberAuth, requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { processBase64Upload, ALLOWED_IMAGE_TYPES } from '../../utils/fileUpload.js';
import { STATIC_BASE_URL } from '../../utils/constants.js';
import { createMemberNotification } from '../../utils/createMemberNotification.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

const populate = (q: any) =>
  q.populate('electionId')
   .populate('positionId')
   .populate('memberId')
   .populate('approvedBy')
   .populate('rejectedBy');

const electionApplicationResolvers = {
  Query: {
    getElectionApplications: async (_: any, { electionId }: any, context: AuthContext) => {
      requireAdminAuth(context);
      return await populate(
        ElectionApplication.find({ electionId }).sort({ createdAt: -1 })
      );
    },

    getMyApplications: async (_: any, __: any, context: AuthContext) => {
      requireMemberAuth(context);
      return await populate(
        ElectionApplication.find({ memberId: context.member!.id }).sort({ createdAt: -1 })
      );
    },

    getMyApplicationForElection: async (_: any, { electionId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      return await populate(
        ElectionApplication.findOne({ electionId, memberId: context.member!.id })
      );
    },

    getApplicationsByPosition: async (_: any, { positionId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      return await populate(
        ElectionApplication.find({ positionId, status: 'approved' }).sort({ createdAt: -1 })
      );
    },

    getPendingApplications: async (_: any, { electionId }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const filter: any = { status: 'pending', paymentStatus: 'paid' };
      if (electionId) filter.electionId = electionId;
      return await populate(
        ElectionApplication.find(filter).sort({ createdAt: -1 })
      );
    },
  },

  Mutation: {
    submitApplication: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireMemberAuth(context);
      const memberId = context.member!.id;
      const { electionId, positionId, manifesto, photoBase64 } = data;

      // Check if election exists and is active
      const election = await Election.findById(electionId);
      if (!election) throw new Error('Election not found');
      if (election.status !== 'active') throw new Error('This election is not accepting applications');

      // Check if position exists
      const position = await ElectoralPosition.findById(positionId);
      if (!position) throw new Error('Position not found');

      // Check if member already has an application for this election
      const existingApp = await ElectionApplication.findOne({ electionId, memberId });
      if (existingApp) {
        // Only allow reapplication if previous was rejected
        if (existingApp.status !== 'rejected') {
          throw new Error('You already have an application for this election');
        }
        // Delete the rejected application to allow new one
        await ElectionApplication.findByIdAndDelete(existingApp._id);
      }

      // Handle photo upload
      let photoUrl = '';
      if (photoBase64) {
        try {
          const fileName = await processBase64Upload(
            photoBase64,
            'election-applications',
            ALLOWED_IMAGE_TYPES,
            'application'
          );
          photoUrl = `${STATIC_BASE_URL}/uploads/election-applications/${fileName}`;
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError.message);
        }
      }

      const application = await ElectionApplication.create({
        electionId,
        positionId,
        memberId,
        manifesto,
        photoUrl,
        paymentAmount: position.formFee || 0,
        paymentStatus: position.formFee > 0 ? 'pending' : 'paid',
        status: 'pending',
      });

      const populated = await populate(ElectionApplication.findById(application._id));
      return { 
        success: true, 
        message: position.formFee > 0 
          ? 'Application submitted. Please complete payment to proceed.' 
          : 'Application submitted successfully',
        data: populated 
      };
    },

    updateApplicationPayment: async (_: any, { applicationId, data }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const { paymentReference, paymentAmount } = data;

      const application = await ElectionApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');
      if (application.memberId.toString() !== context.member!.id) {
        throw new Error('Unauthorized');
      }

      application.paymentStatus = 'paid';
      application.paymentReference = paymentReference;
      application.paymentAmount = paymentAmount;
      application.paymentDate = new Date();
      await application.save();

      const populated = await populate(ElectionApplication.findById(applicationId));
      return { success: true, message: 'Payment recorded successfully', data: populated };
    },

    confirmApplicationPaystackPayment: async (
      _: any,
      { applicationId, reference, amount }: { applicationId: string; reference: string; amount: number },
      context: AuthContext
    ) => {
      requireMemberAuth(context);
      const application = await ElectionApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');
      if (application.memberId.toString() !== context.member!.id) {
        throw new Error('Unauthorized');
      }
      if (application.paymentStatus === 'paid') throw new Error('Payment already completed');

      try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
        });
        const ps = response.data.data;
        if (ps.status !== 'success') throw new Error('Payment was not successful');

        const expectedKobo = Math.round(Number(amount) * 100);
        const paidKobo = Number(ps.amount);
        if (expectedKobo > 0 && paidKobo !== expectedKobo) {
          throw new Error('Payment amount does not match the form fee');
        }

        application.paymentStatus = 'paid';
        application.paymentReference = reference;
        application.paymentAmount = amount;
        application.paymentDate = new Date();
        await application.save();

        const populated = await populate(ElectionApplication.findById(applicationId));
        return { success: true, message: 'Payment confirmed', data: populated };
      } catch (err: any) {
        throw new Error(err.message || 'Failed to verify payment');
      }
    },

    approveApplication: async (_: any, { data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const { applicationId } = data;

      const application = await ElectionApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');
      if (application.paymentStatus !== 'paid') {
        throw new Error('Payment must be completed before approval');
      }

      application.status = 'approved';
      application.approvedBy = context.admin!.id as any;
      application.approvedAt = new Date();
      await application.save();

      await Candidate.findOneAndUpdate(
        {
          electionId: application.electionId,
          positionId: application.positionId,
          memberId: application.memberId,
        },
        {
          $set: {
            manifesto: application.manifesto,
            ...(application.photoUrl ? { profilePicture: application.photoUrl } : {}),
            formPaymentRef: application.paymentReference || `APP-${String(application._id).slice(-8)}`,
            formPaymentStatus: 'paid',
            isApproved: true,
            isRejected: false,
            rejectionReason: undefined,
            manifestoSubmitted: true,
            approvedBy: context.admin!.id,
            reviewedBy: context.admin!.id,
            reviewedAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      const positionDoc = await ElectoralPosition.findById(application.positionId).lean() as { title?: string } | null;
      await createMemberNotification(
        String(application.memberId),
        'election',
        'Candidacy approved',
        `Your application for ${positionDoc?.title || 'the position'} has been approved. You are now on the ballot.`,
        '/member/elections'
      );

      const populated = await populate(ElectionApplication.findById(applicationId));
      return { success: true, message: 'Application approved successfully', data: populated };
    },

    rejectApplication: async (_: any, { data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const { applicationId, rejectionReason } = data;

      const application = await ElectionApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');

      application.status = 'rejected';
      application.rejectionReason = rejectionReason;
      application.rejectedBy = context.admin!.id as any;
      application.rejectedAt = new Date();
      await application.save();

      await Candidate.findOneAndUpdate(
        {
          electionId: application.electionId,
          positionId: application.positionId,
          memberId: application.memberId,
        },
        {
          $set: {
            isApproved: false,
            isRejected: true,
            rejectionReason: rejectionReason || 'Application did not meet requirements',
            reviewedBy: context.admin!.id,
            reviewedAt: new Date(),
          },
        }
      );

      const positionDoc = await ElectoralPosition.findById(application.positionId).lean() as { title?: string } | null;
      await createMemberNotification(
        String(application.memberId),
        'election',
        'Candidacy not approved',
        rejectionReason
          ? `Your application for ${positionDoc?.title || 'the position'} was rejected: ${rejectionReason}`
          : `Your application for ${positionDoc?.title || 'the position'} was not approved. You may apply for another position in this election.`,
        '/member/elections'
      );

      const populated = await populate(ElectionApplication.findById(applicationId));
      return { success: true, message: 'Application rejected', data: populated };
    },

    deleteApplication: async (_: any, { applicationId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      
      const application = await ElectionApplication.findById(applicationId);
      if (!application) throw new Error('Application not found');
      if (application.memberId.toString() !== context.member!.id) {
        throw new Error('Unauthorized');
      }
      if (application.status === 'approved') {
        throw new Error('Cannot delete an approved application');
      }

      await ElectionApplication.findByIdAndDelete(applicationId);
      return { success: true, message: 'Application deleted successfully' };
    },
  },
};

export default electionApplicationResolvers;
