import Member from '../member/member.model.js';
import Payment from '../payment/payment.model.js';
import Election from '../election/election.model.js';
import Event from '../event/event.model.js';
import Donation from '../donation/donation.model.js';
import IDCardRequest from '../idCardRequest/idCardRequest.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dashboardResolvers = {
    Query: {
        getDashboardStats: async (_, __, context) => {
            requireAdminAuth(context);
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const [totalMembers, activeMembers, newMembersThisMonth, paymentAgg, activeElections, upcomingEvents, donationAgg, pendingIDCards, growthAgg, distributionAgg, recentMembers, recentPaymentsRaw,] = await Promise.all([
                // Total members (non-deleted)
                Member.countDocuments({}),
                // Active members
                Member.countDocuments({ membershipStatus: 'active' }),
                // New this month
                Member.countDocuments({ createdAt: { $gte: startOfMonth } }),
                // Total successful payments this year
                Payment.aggregate([
                    { $match: { status: { $in: ['successful', 'success'] }, createdAt: { $gte: startOfYear } } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                ]),
                // Active elections
                Election.countDocuments({ status: 'active' }),
                // Upcoming published events
                Event.countDocuments({ status: 'published', eventDate: { $gte: now } }),
                // Total monetary donations (received/acknowledged/completed)
                Donation.aggregate([
                    { $match: { donationMode: 'monetary', status: { $in: ['received', 'acknowledged', 'completed'] } } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                ]),
                // Pending ID card requests
                IDCardRequest.countDocuments({ adminStatus: 'pending' }),
                // Member growth — count per month this year
                Member.aggregate([
                    { $match: { createdAt: { $gte: startOfYear } } },
                    {
                        $group: {
                            _id: { $month: '$createdAt' },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { '_id': 1 } },
                ]),
                // Payment type distribution
                Payment.aggregate([
                    { $match: { status: { $in: ['successful', 'success'] } } },
                    {
                        $lookup: {
                            from: 'paymenttypes',
                            localField: 'paymentTypeId',
                            foreignField: '_id',
                            as: 'pt',
                        },
                    },
                    { $unwind: { path: '$pt', preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: { $ifNull: ['$pt.name', 'Other'] },
                            total: { $sum: '$amount' },
                        },
                    },
                    { $project: { name: '$_id', total: 1, _id: 0 } },
                    { $sort: { total: -1 } },
                ]),
                // Recent 8 members
                Member.find({})
                    .sort({ createdAt: -1 })
                    .limit(8)
                    .select('-password')
                    .lean(),
                // Recent 8 payments with populated refs
                Payment.find({})
                    .sort({ createdAt: -1 })
                    .limit(8)
                    .populate('memberId', 'firstName lastName memberNumber')
                    .populate('paymentTypeId', 'name amount')
                    .lean(),
            ]);
            // Map month numbers to names
            const memberGrowth = growthAgg.map((g) => ({
                month: MONTH_NAMES[g._id - 1] || String(g._id),
                count: g.count,
            }));
            // Normalize recentPayments — map backend fields to frontend-expected names
            const recentPayments = recentPaymentsRaw.map((p) => ({
                id: p._id?.toString(),
                amount: p.amount,
                year: p.year,
                method: p.paymentMethod, // frontend calls this 'method'
                status: p.status,
                reference: p.transactionRef, // frontend calls this 'reference'
                createdAt: p.createdAt,
                member: p.memberId
                    ? {
                        id: p.memberId._id?.toString(),
                        firstName: p.memberId.firstName,
                        lastName: p.memberId.lastName,
                        memberNumber: p.memberId.memberNumber,
                    }
                    : null,
                paymentType: p.paymentTypeId
                    ? {
                        id: p.paymentTypeId._id?.toString(),
                        name: p.paymentTypeId.name,
                    }
                    : null,
            }));
            // Normalize recentMembers
            const recentMembersNorm = recentMembers.map((m) => ({
                id: m._id?.toString(),
                memberNumber: m.memberNumber,
                firstName: m.firstName,
                lastName: m.lastName,
                sport: m.sport,
                status: m.membershipStatus,
                profilePicture: m.profilePicture,
                createdAt: m.createdAt,
            }));
            return {
                totalMembers,
                activeMembers,
                newMembersThisMonth,
                totalPaymentsThisYear: paymentAgg[0]?.total || 0,
                activeElections,
                upcomingEvents,
                totalDonations: donationAgg[0]?.total || 0,
                pendingIDCards,
                memberGrowth,
                paymentTypeDistribution: distributionAgg,
                recentMembers: recentMembersNorm,
                recentPayments,
            };
        },
    },
};
export default dashboardResolvers;
//# sourceMappingURL=dashboard.resolvers.js.map