import { AuthContext } from '../../middleware/auth.js';
declare const notificationResolvers: {
    Query: {
        getNotifications: (_: any, { limit, onlyUnread }: any, context: AuthContext) => Promise<{
            notifications: any[];
            unreadCount: number;
        }>;
    };
    Mutation: {
        markNotificationRead: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            id: string;
            type: "new_member" | "new_payment" | "id_card_request" | "support_ticket";
            message: string;
            title: string;
            isRead: boolean;
            refId?: import("mongoose").Types.ObjectId | null | undefined;
            refModel?: string | null | undefined;
            createdAt: NativeDate;
            updatedAt: NativeDate;
            _id: import("mongoose").Types.ObjectId;
            __v: number;
        }>;
        markAllNotificationsRead: (_: any, __: any, context: AuthContext) => Promise<boolean>;
    };
};
export default notificationResolvers;
//# sourceMappingURL=notification.resolvers.d.ts.map