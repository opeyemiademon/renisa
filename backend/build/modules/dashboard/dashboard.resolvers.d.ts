import { AuthContext } from '../../middleware/auth.js';
declare const dashboardResolvers: {
    Query: {
        getDashboardStats: (_: any, __: any, context: AuthContext) => Promise<{
            totalMembers: number;
            activeMembers: number;
            newMembersThisMonth: number;
            totalPaymentsThisYear: any;
            activeElections: number;
            upcomingEvents: number;
            totalDonations: any;
            pendingIDCards: number;
            memberGrowth: {
                month: string;
                count: any;
            }[];
            paymentTypeDistribution: any[];
            recentMembers: {
                id: any;
                memberNumber: any;
                firstName: any;
                lastName: any;
                sport: any;
                status: any;
                profilePicture: any;
                createdAt: any;
            }[];
            recentPayments: {
                id: any;
                amount: any;
                year: any;
                method: any;
                status: any;
                reference: any;
                createdAt: any;
                member: {
                    id: any;
                    firstName: any;
                    lastName: any;
                    memberNumber: any;
                } | null;
                paymentType: {
                    id: any;
                    name: any;
                } | null;
            }[];
        }>;
    };
};
export default dashboardResolvers;
//# sourceMappingURL=dashboard.resolvers.d.ts.map