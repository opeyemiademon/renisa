import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Candidate from './candidate.model.js';
import Election from '../election/election.model.js';
import ElectoralPosition from '../electoralPosition/electoralPosition.model.js';
import Member from '../member/member.model.js';
import { requireMemberAuth, requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payment/callback';

const populateCandidate = (q: any) =>
  q
    .populate('memberId', 'firstName lastName profilePicture memberNumber')
    .populate('positionId', 'title formFee maxCandidates')
    .populate('electionId', 'title status');

const candidateResolvers = {
  Candidate: {
    member: (parent: any) => parent.memberId,
    position: (parent: any) => parent.positionId,
    status: (parent: any) => {
      if (parent.isApproved) return 'approved'
      if (parent.formPaymentStatus === 'paid') return 'pending'
      return 'unpaid'
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
  },

  Mutation: {
    purchaseCandidateForm: async (_: any, { electionId, positionId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const member = await Member.findById(context.member!.id);
      if (!member) throw new Error('Member not found');
      const position = await ElectoralPosition.findById(positionId);
      if (!position) throw new Error('Position not found');
      const election = await Election.findById(electionId);
      if (!election || election.status !== 'active') throw new Error('Nominations are not open');

      const existing = await Candidate.findOne({ electionId, positionId, memberId: member._id });
      if (existing) throw new Error('You have already applied for this position');

      const formPaymentRef = `RENISA-FORM-${uuidv4().slice(0, 8).toUpperCase()}`;
      const candidate = await Candidate.create({
        electionId,
        positionId,
        memberId: member._id,
        formPaymentRef,
        formPaymentStatus: 'pending',
      });

      if (position.formFee > 0) {
        try {
          const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
              email: member.email,
              amount: position.formFee * 100,
              reference: formPaymentRef,
              callback_url: PAYSTACK_CALLBACK_URL,
              metadata: { candidateId: candidate._id.toString(), type: 'candidate_form' },
            },
            { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
          );
          return {
            success: true,
            message: 'Form fee payment initiated',
            data: candidate,
            authorizationUrl: response.data.data.authorization_url,
          };
        } catch {
          await Candidate.findByIdAndDelete(candidate._id);
          throw new Error('Failed to initialize form payment');
        }
      }

      await Candidate.findByIdAndUpdate(candidate._id, { formPaymentStatus: 'paid' });
      return { success: true, message: 'Candidacy form obtained', data: candidate };
    },

    verifyCandidateFormPayment: async (_: any, { paystackRef }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const candidate = await Candidate.findOne({ formPaymentRef: paystackRef });
      if (!candidate) throw new Error('Candidate record not found');
      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${paystackRef}`,
          { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
        );
        if (response.data.data.status === 'success') {
          const updated = await Candidate.findByIdAndUpdate(
            candidate._id,
            { formPaymentStatus: 'paid' },
            { new: true }
          );
          return { success: true, message: 'Form payment verified', data: updated };
        }
        return { success: false, message: 'Payment not successful' };
      } catch {
        throw new Error('Failed to verify form payment');
      }
    },

    submitCandidacy: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireMemberAuth(context);
      const candidate = await Candidate.findOne({
        electionId: data.electionId,
        positionId: data.positionId,
        memberId: context.member!.id,
      });
      if (!candidate) throw new Error('No active candidacy application found');
      if (candidate.formPaymentStatus !== 'paid') throw new Error('Form fee not paid');
      const updated = await populateCandidate(
        Candidate.findByIdAndUpdate(
          candidate._id,
          { manifesto: data.manifesto, profilePicture: data.profilePicture },
          { new: true }
        )
      );
      return { success: true, message: 'Candidacy submitted', data: updated };
    },

    approveCandidate: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const candidate = await populateCandidate(
        Candidate.findByIdAndUpdate(
          id,
          { isApproved: true, approvedBy: context.admin!.id },
          { new: true }
        )
      );
      if (!candidate) throw new Error('Candidate not found');
      return { success: true, message: 'Candidate approved', data: candidate };
    },

    rejectCandidate: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const candidate = await populateCandidate(
        Candidate.findByIdAndUpdate(id, { isApproved: false }, { new: true })
      );
      if (!candidate) throw new Error('Candidate not found');
      return { success: true, message: 'Candidate rejected', data: candidate };
    },
  },
};

export default candidateResolvers;
