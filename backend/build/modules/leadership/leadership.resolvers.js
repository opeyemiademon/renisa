import Leadership from './leadership.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { findLeadershipGroupBySlugParam } from '../../utils/leadershipGroupSlug.js';
const MEMBER_POPULATE = 'firstName lastName profilePicture memberNumber sport state bio';
const populate = (q) => q
    .populate('groupId', 'name slug')
    .populate('memberId', MEMBER_POPULATE);
const leadershipResolvers = {
    Leadership: {
        // Derive name and photo from linked member at resolve time
        name: (parent) => {
            const m = parent.memberId;
            if (m && typeof m === 'object')
                return `${m.firstName} ${m.lastName}`;
            return parent.name || '';
        },
        profilePicture: (parent) => {
            const m = parent.memberId;
            if (m && typeof m === 'object')
                return m.profilePicture || null;
            return parent.profilePicture || null;
        },
        photo: (parent) => {
            const m = parent.memberId;
            if (m && typeof m === 'object')
                return m.profilePicture || null;
            return parent.profilePicture || null;
        },
        title: (parent) => parent.position,
        group: (parent) => parent.groupId,
        member: (parent) => parent.memberId,
    },
    Query: {
        getAllLeadership: async (_, { groupId, groupSlug, isCurrent, state }) => {
            const filter = {};
            if (groupSlug) {
                const group = await findLeadershipGroupBySlugParam(groupSlug);
                if (group)
                    filter.groupId = group._id;
            }
            else if (groupId) {
                filter.groupId = groupId;
            }
            if (isCurrent !== undefined)
                filter.isCurrent = isCurrent;
            if (state)
                filter.state = state;
            return populate(Leadership.find(filter)).sort({ order: 1, createdAt: -1 });
        },
        getLeadership: async (_, { id }) => {
            return populate(Leadership.findById(id));
        },
        getLeadershipBySlug: async (_, { slug }) => {
            return populate(Leadership.findOne({ slug }));
        },
    },
    Mutation: {
        createLeadership: async (_, { data }, context) => {
            requireAdminAuth(context);
            const doc = await Leadership.create({
                groupId: data.groupId,
                memberId: data.memberId,
                position: data.position,
                order: data.order ?? 0,
                tenure: data.tenure,
                state: data.state,
                isActive: data.isActive !== false,
                isCurrent: data.isCurrent !== false,
                createdBy: context.admin.id,
            });
            const populated = await populate(Leadership.findById(doc._id));
            return { success: true, message: 'Leadership member created', data: populated };
        },
        updateLeadership: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const update = {};
            if (data.groupId !== undefined)
                update.groupId = data.groupId;
            if (data.position !== undefined)
                update.position = data.position;
            if (data.order !== undefined)
                update.order = data.order;
            if (data.tenure !== undefined)
                update.tenure = data.tenure;
            if (data.state !== undefined)
                update.state = data.state;
            if (data.isActive !== undefined)
                update.isActive = data.isActive;
            if (data.isCurrent !== undefined)
                update.isCurrent = data.isCurrent;
            const leadership = await populate(Leadership.findByIdAndUpdate(id, update, { new: true }));
            if (!leadership)
                throw new Error('Leadership member not found');
            return { success: true, message: 'Leadership member updated', data: leadership };
        },
        deleteLeadership: async (_, { id }, context) => {
            requireAdminAuth(context);
            const doc = await Leadership.findByIdAndDelete(id);
            if (!doc)
                throw new Error('Leadership member not found');
            return { success: true, message: 'Leadership member deleted' };
        },
        reorderLeadership: async (_, { items }, context) => {
            requireAdminAuth(context);
            await Promise.all(items.map((item) => Leadership.findByIdAndUpdate(item.id, { order: item.order })));
            return { success: true, message: 'Leadership order updated' };
        },
        markLeadershipInactive: async (_, { id }, context) => {
            requireAdminAuth(context);
            const doc = await populate(Leadership.findByIdAndUpdate(id, { isActive: false, isCurrent: false }, { new: true }));
            if (!doc)
                throw new Error('Leadership member not found');
            return { success: true, message: 'Marked as inactive', data: doc };
        },
    },
};
export default leadershipResolvers;
//# sourceMappingURL=leadership.resolvers.js.map