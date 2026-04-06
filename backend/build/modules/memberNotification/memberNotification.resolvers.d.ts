import { AuthContext } from '../../middleware/auth.js';
declare const memberNotificationResolvers: {
    Query: {
        getMemberNotifications: (_: any, { limit }: any, context: AuthContext) => Promise<{
            notifications: any[];
            unreadCount: number;
        }>;
    };
    Mutation: {
        markMemberNotificationRead: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            id: string;
            type: string;
            message: string;
            title: string;
            memberId: import("mongoose").Types.ObjectId;
            isRead: boolean;
            link?: string | null | undefined;
            createdAt: NativeDate;
            updatedAt: NativeDate;
            _id: import("mongoose").Types.ObjectId;
            __v: number;
        }>;
        markAllMemberNotificationsRead: (_: any, __: any, context: AuthContext) => Promise<boolean>;
    };
};
export default memberNotificationResolvers;
//# sourceMappingURL=memberNotification.resolvers.d.ts.map