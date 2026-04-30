import Leadership from './leadership.model.js';
import LeadershipGroup from '../leadershipGroup/leadershipGroup.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { findLeadershipGroupBySlugParam } from '../../utils/leadershipGroupSlug.js';

const MEMBER_POPULATE = 'firstName lastName profilePicture memberNumber sport state bio';

const populate = (q: any) =>
  q
    .populate('groupId', 'name slug')
    .populate('memberId', MEMBER_POPULATE);

const leadershipResolvers = {
  Leadership: {
    // Derive name and photo from linked member or non-member fields
    name: (parent: any) => {
      const m = parent.memberId;
      if (m && typeof m === 'object') return `${m.firstName} ${m.lastName}`;
      return parent.nonMemberName || parent.name || '';
    },
    profilePicture: (parent: any) => {
      const m = parent.memberId;
      if (m && typeof m === 'object') return m.profilePicture || null;
      return parent.nonMemberPhoto || parent.profilePicture || null;
    },
    photo: (parent: any) => {
      const m = parent.memberId;
      if (m && typeof m === 'object') return m.profilePicture || null;
      return parent.nonMemberPhoto || parent.profilePicture || null;
    },
    title: (parent: any) => parent.position,
    group: (parent: any) => parent.groupId,
    member: (parent: any) => parent.memberId,
  },

  Query: {
    getAllLeadership: async (_: any, { groupId, groupSlug, isCurrent, state }: any) => {
      const filter: any = {};
      if (groupSlug) {
        const group = await findLeadershipGroupBySlugParam(groupSlug);
        if (group) filter.groupId = group._id;
      } else if (groupId) {
        filter.groupId = groupId;
      }
      if (isCurrent !== undefined) filter.isCurrent = isCurrent;
      if (state) filter.state = state;
      return populate(Leadership.find(filter)).sort({ order: 1, createdAt: -1 });
    },

    getLeadership: async (_: any, { id }: { id: string }) => {
      return populate(Leadership.findById(id));
    },

    getLeadershipBySlug: async (_: any, { slug }: { slug: string }) => {
      return populate(Leadership.findOne({ slug }));
    },
  },

  Mutation: {
    createLeadership: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      if (!data.memberId && !data.nonMemberName) {
        throw new Error('Either a member or a non-member name is required');
      }
      const doc = await Leadership.create({
        groupId: data.groupId,
        memberId: data.memberId || null,
        position: data.position,
        order: data.order ?? 0,
        tenure: data.tenure,
        state: data.state,
        isActive: data.isActive !== false,
        isCurrent: data.isCurrent !== false,
        nonMemberName: data.nonMemberName,
        nonMemberPhoto: data.nonMemberPhoto,
        nonMemberBio: data.nonMemberBio,
        createdBy: context.admin!.id,
      });
      const populated = await populate(Leadership.findById(doc._id));
      return { success: true, message: 'Leadership member created', data: populated };
    },

    updateLeadership: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const update: any = {};
      if (data.groupId !== undefined) update.groupId = data.groupId;
      if (data.position !== undefined) update.position = data.position;
      if (data.order !== undefined) update.order = data.order;
      if (data.tenure !== undefined) update.tenure = data.tenure;
      if (data.state !== undefined) update.state = data.state;
      if (data.isActive !== undefined) update.isActive = data.isActive;
      if (data.isCurrent !== undefined) update.isCurrent = data.isCurrent;
      if (data.nonMemberName !== undefined) update.nonMemberName = data.nonMemberName;
      if (data.nonMemberPhoto !== undefined) update.nonMemberPhoto = data.nonMemberPhoto;
      if (data.nonMemberBio !== undefined) update.nonMemberBio = data.nonMemberBio;
      const leadership = await populate(Leadership.findByIdAndUpdate(id, update, { new: true }));
      if (!leadership) throw new Error('Leadership member not found');
      return { success: true, message: 'Leadership member updated', data: leadership };
    },

    deleteLeadership: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const doc = await Leadership.findByIdAndDelete(id);
      if (!doc) throw new Error('Leadership member not found');
      return { success: true, message: 'Leadership member deleted' };
    },

    reorderLeadership: async (_: any, { items }: any, context: AuthContext) => {
      requireAdminAuth(context);
      await Promise.all(items.map((item: any) => Leadership.findByIdAndUpdate(item.id, { order: item.order })));
      return { success: true, message: 'Leadership order updated' };
    },

    markLeadershipInactive: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const doc = await populate(Leadership.findByIdAndUpdate(id, { isActive: false, isCurrent: false }, { new: true }));
      if (!doc) throw new Error('Leadership member not found');
      return { success: true, message: 'Marked as inactive', data: doc };
    },
  },
};

export default leadershipResolvers;
