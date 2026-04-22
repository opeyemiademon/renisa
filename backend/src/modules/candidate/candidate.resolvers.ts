import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Candidate from './candidate.model.js';
import Election from '../election/election.model.js';
import ElectoralPosition from '../electoralPosition/electoralPosition.model.js';
import Member from '../member/member.model.js';
import AdminUser from '../user/user.model.js';
import { requireMemberAuth, requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { createMemberNotification } from '../../utils/createMemberNotification.js';
import { createNotification } from '../../utils/createNotification.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

const populateCandidate = (q: any) =>
  q
    .populate('memberId', 'firstName lastName profilePicture memberNumber email')
    .populate('positionId', 'title formFee maxCandidates description')
    .populate('electionId', 'title status year')
    .populate('approvedBy', 'name email')
    .populate('reviewedBy', 'name email');

const candidateResolvers = {
  Candidate: {
    member: (parent: any) => parent.memberId,
    position: (parent: any) => parent.positionId,
    status: (parent: any) => {
      if (parent.isRejected) return 'rejected';
      if (parent.isApproved) return 'approved';
      if (parent.manifestoSubmitted) return 'submitted';
      if (parent.formPaymentStatus === 'paid') return 'paid';
      if (parent.formPaymentStatus === 'manual_pending') return 'manual_pending';
      return 'unpaid';
    },
  },

  Query: {
    getCandidates: async (_: any, { electionId, positionId }: any) => {
      const filter: any = { electionId };
      if (positionId) filter.positionId = positionId;
      return await populateCandidate(Candidate.find(filter).sort({ createdAt: 1 }));
    },

    getCandidate: async (_: any, { id }: { id: string }) => {
      return await populateCandidate(Candidate.findById(id));
    },

    getBallotCandidates: async (_: any, { electionId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      return await populateCandidate(
        Candidate.find({ electionId, isApproved: true }).sort({ createdAt: 1 })
      );
    },
  },

  Mutation: {
    // Member initiates application — creates record, returns candidateId + formFee
    
    applyForPosition: async (_: any, { electionId, positionId }: any, context: AuthContext) => {
      requireMemberAuth(context);

      const election = await Election.findById(electionId);
      if (!election || election.status !== 'active') throw new Error('Nominations are not open for this elections');

      const position = await ElectoralPosition.findById(positionId);
      if (!position) throw new Error('Position not found');

      // Cannot apply for same position
      const samePosition = await Candidate.findOne({ electionId, positionId, memberId: context.member!.id });
      if (samePosition && !samePosition.isRejected) {
        throw new Error('You have already applied for this position');
      }

      // Cannot have more than one non-rejected application per election
      const anyActive = await Candidate.findOne({
        electionId,
        memberId: context.member!.id,
        isRejected: { $ne: true },
      });
      if (anyActive) {
        throw new Error('You already have an active application in this election. You can only apply for one position at a time.');
      }

      const formPaymentRef = `RENISA-FORM-${uuidv4().slice(0, 8).toUpperCase()}`;
      const candidate = await Candidate.create({
        electionId,
        positionId,
        memberId: context.member!.id,
        formPaymentRef,
        formPaymentStatus: position.formFee > 0 ? 'pending' : 'paid',
        manifestoSubmitted: false,
      });

      await createNotification(
        'new_member' as any,
        'New Candidacy Application',
        `A member has applied for ${position.title} in ${election.title}`,
        String(candidate._id),
        'Candidate'
      );

      return {
        success: true,
        message: position.formFee > 0 ? 'Application created. Please pay the form fee.' : 'Application created.',
        data: await populateCandidate(Candidate.findById(candidate._id)),
        candidateId: String(candidate._id),
      };
    },

    confirmCandidateFormPayment: async (_: any, { candidateId, reference }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) throw new Error('Application not found');
      if (candidate.memberId.toString() !== context.member!.id) throw new Error('Unauthorized');
      if (candidate.formPaymentStatus === 'paid') throw new Error('Payment already confirmed');

      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );
        if (response.data.data.status !== 'success') throw new Error('Payment was not successful');

        const updated = await populateCandidate(
          Candidate.findByIdAndUpdate(
            candidateId,
            { formPaymentRef: reference, formPaymentStatus: 'paid' },
            { new: true }
          )
        );
        return { success: true, message: 'Form payment confirmed', data: updated };
      } catch (err: any) {
        throw new Error(err.message || 'Failed to verify payment');
      }
    },

    manualCandidateFormPayment: async (_: any, { candidateId, referenceNumber, notes }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) throw new Error('Application not found');
      if (candidate.memberId.toString() !== context.member!.id) throw new Error('Unauthorized');
      if (candidate.formPaymentStatus === 'paid') throw new Error('Payment already confirmed');

      const updated = await populateCandidate(
        Candidate.findByIdAndUpdate(
          candidateId,
          {
            formPaymentRef: `MANUAL-${referenceNumber.toUpperCase()}`,
            formPaymentStatus: 'manual_pending',
            ...(notes && { manifesto: notes }),
          },
          { new: true }
        )
      );
      return { success: true, message: 'Manual payment submitted. Admin will verify shortly.', data: updated };
    },

    submitCandidacy: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireMemberAuth(context);
      const candidate = await Candidate.findOne({
        electionId: data.electionId,
        positionId: data.positionId,
        memberId: context.member!.id,
        isRejected: { $ne: true },
      });
      if (!candidate) throw new Error('No active candidacy application found');
      if (candidate.formPaymentStatus !== 'paid') throw new Error('Form fee not yet confirmed');

      const updated = await populateCandidate(
        Candidate.findByIdAndUpdate(
          candidate._id,
          {
            manifesto: data.manifesto,
            ...(data.profilePicture && { profilePicture: data.profilePicture }),
            manifestoSubmitted: true,
          },
          { new: true }
        )
      );

      await createNotification(
        'new_member' as any,
        'Candidacy Manifesto Submitted',
        `A candidate has submitted their manifesto for review`,
        String(candidate._id),
        'Candidate'
      );

      return { success: true, message: 'Candidacy submitted for review', data: updated };
    },

    approveCandidate: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const candidate = await Candidate.findById(id).populate('memberId', 'firstName lastName');
      if (!candidate) throw new Error('Candidate not found');

      const updated = await populateCandidate(
        Candidate.findByIdAndUpdate(
          id,
          {
            isApproved: true,
            isRejected: false,
            rejectionReason: undefined,
            approvedBy: context.admin!.id,
            reviewedBy: context.admin!.id,
            reviewedAt: new Date(),
          },
          { new: true }
        )
      );

      const member = candidate.memberId as any;
      const position = await ElectoralPosition.findById(candidate.positionId).lean() as any;
      await createMemberNotification(
        String(member._id),
        'election',
        'Candidacy Approved',
        `Your application for ${position?.title || 'the position'} has been approved. You are now a candidate on the ballot.`,
        '/member/elections'
      );

      return { success: true, message: 'Candidate approved', data: updated };
    },

    rejectCandidate: async (_: any, { id, reason }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const candidate = await Candidate.findById(id).populate('memberId', 'firstName lastName');
      if (!candidate) throw new Error('Candidate not found');

      const updated = await populateCandidate(
        Candidate.findByIdAndUpdate(
          id,
          {
            isApproved: false,
            isRejected: true,
            rejectionReason: reason || 'Application did not meet requirements',
            reviewedBy: context.admin!.id,
            reviewedAt: new Date(),
          },
          { new: true }
        )
      );

      const member = candidate.memberId as any;
      const position = await ElectoralPosition.findById(candidate.positionId).lean() as any;
      await createMemberNotification(
        String(member._id),
        'election',
        'Candidacy Rejected',
        reason
          ? `Your application for ${position?.title || 'the position'} was rejected: ${reason}`
          : `Your application for ${position?.title || 'the position'} was not approved. You may apply for another position.`,
        '/member/elections'
      );

      return { success: true, message: 'Candidate rejected', data: updated };
    },
  },
};

export default candidateResolvers;
