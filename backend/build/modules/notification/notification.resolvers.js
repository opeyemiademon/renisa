import Notification from './notification.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const notificationResolvers = {
    Query: {
        getNotifications: async (_, { limit = 30, onlyUnread = false }, context) => {
            requireAdminAuth(context);
            const filter = onlyUnread ? { isRead: false } : {};
            const [notifications, unreadCount] = await Promise.all([
                Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
                Notification.countDocuments({ isRead: false }),
            ]);
            return {
                notifications: notifications.map((n) => ({ ...n, id: n._id.toString() })),
                unreadCount,
            };
        },
    },
    Mutation: {
        markNotificationRead: async (_, { id }, context) => {
            requireAdminAuth(context);
            const n = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
            if (!n)
                throw new Error('Notification not found');
            return { ...n.toObject(), id: n._id.toString() };
        },
        markAllNotificationsRead: async (_, __, context) => {
            requireAdminAuth(context);
            await Notification.updateMany({ isRead: false }, { isRead: true });
            return true;
        },
    },
};
export default notificationResolvers;
//# sourceMappingURL=notification.resolvers.js.map