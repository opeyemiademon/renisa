import MemberNotification from './memberNotification.model.js';
import { requireMemberAuth } from '../../middleware/auth.js';
const memberNotificationResolvers = {
    Query: {
        getMemberNotifications: async (_, { limit = 30 }, context) => {
            requireMemberAuth(context);
            const memberId = context.member.id;
            const [notifications, unreadCount] = await Promise.all([
                MemberNotification.find({ memberId }).sort({ createdAt: -1 }).limit(limit).lean(),
                MemberNotification.countDocuments({ memberId, isRead: false }),
            ]);
            return {
                notifications: notifications.map((n) => ({ ...n, id: n._id.toString() })),
                unreadCount,
            };
        },
    },
    Mutation: {
        markMemberNotificationRead: async (_, { id }, context) => {
            requireMemberAuth(context);
            const n = await MemberNotification.findOneAndUpdate({ _id: id, memberId: context.member.id }, { isRead: true }, { new: true });
            if (!n)
                throw new Error('Notification not found');
            return { ...n.toObject(), id: n._id.toString() };
        },
        markAllMemberNotificationsRead: async (_, __, context) => {
            requireMemberAuth(context);
            await MemberNotification.updateMany({ memberId: context.member.id, isRead: false }, { isRead: true });
            return true;
        },
    },
};
export default memberNotificationResolvers;
//# sourceMappingURL=memberNotification.resolvers.js.map