import MemberCode from './memberCode.model.js';
import { generateBatch } from '../../utils/memberCodeGenerator.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const memberCodeResolvers = {
  Query: {
    getAllMemberCodes: async (_: any, { batchName, isUsed }: any, context: AuthContext) => {
      requireAdminAuth(context);
      
      return await MemberCode.find()
        .populate('usedBy', 'firstName lastName memberNumber')
        .populate('generatedBy', 'name email')
        .sort({ createdAt: -1 });
    },

    getMemberCode: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      return await MemberCode.findById(id)
        .populate('usedBy', 'firstName lastName memberNumber')
        .populate('generatedBy', 'name email');
    },

    checkMemberCode: async (_: any, { code }: { code: string }) => {
      const memberCode = await MemberCode.findOne({ code: code.trim().toUpperCase() });

      if (!memberCode) {
        return { valid: false, message: 'This member code does not exist. Please check the code and try again, or contact the RENISA secretariat.' };
      }

      if (memberCode.isUsed) {
        return { valid: false, message: 'This member code has already been used. Each code can only be used once. Please contact the RENISA secretariat for a new code.' };
      }

      if (memberCode.expiresAt && new Date() > memberCode.expiresAt) {
        return { valid: false, message: 'This member code has expired. Please contact the RENISA secretariat to obtain a new code.' };
      }

      return { valid: true, message: 'Code verified successfully.' };
    },
  },

  Mutation: {
    generateMemberCodes: async (_: any, { count, batchName, expiresAt }: any, context: AuthContext) => {
      requireAdminAuth(context);
     
   
      if (count < 1 || count > 500) throw new Error('Count must be between 1 and 500');
      const codes = generateBatch(count);
      const docs = codes.map(code => ({
        code,
        batchName: batchName || `Batch-${Date.now()}`,
        generatedBy: context.admin!.id,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      }));
      await MemberCode.insertMany(docs);
      return { success: true, message: `${count} member codes generated`, codes };
    },

    deleteMemberCode: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const code = await MemberCode.findById(id);
      if (!code) throw new Error('Member code not found');
      if (code.isUsed) throw new Error('Cannot delete a used member code');
      await MemberCode.findByIdAndDelete(id);
      return { success: true, message: 'Member code deleted' };
    },
  },
};

export default memberCodeResolvers;
