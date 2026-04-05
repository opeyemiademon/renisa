import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLScalarType, Kind } from 'graphql';
import userTypeDefs from './modules/user/user.typeDefs.js';
import userResolvers from './modules/user/user.resolvers.js';
import memberTypeDefs from './modules/member/member.typeDefs.js';
import memberResolvers from './modules/member/member.resolvers.js';
import memberCodeTypeDefs from './modules/memberCode/memberCode.typeDefs.js';
import memberCodeResolvers from './modules/memberCode/memberCode.resolvers.js';
import paymentTypeTypeDefs from './modules/paymentType/paymentType.typeDefs.js';
import paymentTypeResolvers from './modules/paymentType/paymentType.resolvers.js';
import paymentTypeDefs from './modules/payment/payment.typeDefs.js';
import paymentResolvers from './modules/payment/payment.resolvers.js';
import electionTypeDefs from './modules/election/election.typeDefs.js';
import electionResolvers from './modules/election/election.resolvers.js';
import electoralPositionTypeDefs from './modules/electoralPosition/electoralPosition.typeDefs.js';
import electoralPositionResolvers from './modules/electoralPosition/electoralPosition.resolvers.js';
import candidateTypeDefs from './modules/candidate/candidate.typeDefs.js';
import candidateResolvers from './modules/candidate/candidate.resolvers.js';
import voteTypeDefs from './modules/vote/vote.typeDefs.js';
import voteResolvers from './modules/vote/vote.resolvers.js';
import electionApplicationTypeDefs from './modules/electionApplication/electionApplication.typeDefs.js';
import electionApplicationResolvers from './modules/electionApplication/electionApplication.resolvers.js';
import leadershipGroupTypeDefs from './modules/leadershipGroup/leadershipGroup.typeDefs.js';
import leadershipGroupResolvers from './modules/leadershipGroup/leadershipGroup.resolvers.js';
import leadershipTypeDefs from './modules/leadership/leadership.typeDefs.js';
import leadershipResolvers from './modules/leadership/leadership.resolvers.js';
import executiveTypeDefs from './modules/executive/executive.typeDefs.js';
import executiveResolvers from './modules/executive/executive.resolvers.js';
import awardCategoryTypeDefs from './modules/awardCategory/awardCategory.typeDefs.js';
import awardCategoryResolvers from './modules/awardCategory/awardCategory.resolvers.js';
import awardTypeDefs from './modules/award/award.typeDefs.js';
import awardResolvers from './modules/award/award.resolvers.js';
import awardVoteTypeDefs from './modules/awardVote/awardVote.typeDefs.js';
import awardVoteResolvers from './modules/awardVote/awardVote.resolvers.js';
import idCardSettingsTypeDefs from './modules/idCardSettings/idCardSettings.typeDefs.js';
import idCardSettingsResolvers from './modules/idCardSettings/idCardSettings.resolvers.js';
import idCardRequestTypeDefs from './modules/idCardRequest/idCardRequest.typeDefs.js';
import idCardRequestResolvers from './modules/idCardRequest/idCardRequest.resolvers.js';
import eventTypeDefs from './modules/event/event.typeDefs.js';
import eventResolvers from './modules/event/event.resolvers.js';
import galleryTypeDefs from './modules/gallery/gallery.typeDefs.js';
import galleryResolvers from './modules/gallery/gallery.resolvers.js';
import communicationTypeDefs from './modules/communication/communication.typeDefs.js';
import communicationResolvers from './modules/communication/communication.resolvers.js';
import donationTypeTypeDefs from './modules/donationType/donationType.typeDefs.js';
import donationTypeResolvers from './modules/donationType/donationType.resolvers.js';
import donationTypeDefs from './modules/donation/donation.typeDefs.js';
import donationResolvers from './modules/donation/donation.resolvers.js';
import donationInvoiceTypeDefs from './modules/donationInvoice/donationInvoice.typeDefs.js';
import donationInvoiceResolvers from './modules/donationInvoice/donationInvoice.resolvers.js';
import siteContentTypeDefs from './modules/siteContent/siteContent.typeDefs.js';
import siteContentResolvers from './modules/siteContent/siteContent.resolvers.js';
import heroSlideTypeDefs from './modules/heroSlide/heroSlide.typeDefs.js';
import heroSlideResolvers from './modules/heroSlide/heroSlide.resolvers.js';
import dashboardTypeDefs from './modules/dashboard/dashboard.typeDefs.js';
import dashboardResolvers from './modules/dashboard/dashboard.resolvers.js';
import notificationTypeDefs from './modules/notification/notification.typeDefs.js';
import notificationResolvers from './modules/notification/notification.resolvers.js';
import memberNotificationTypeDefs from './modules/memberNotification/memberNotification.typeDefs.js';
import memberNotificationResolvers from './modules/memberNotification/memberNotification.resolvers.js';
import ticketTypeDefs from './modules/ticket/ticket.typeDefs.js';
import ticketResolvers from './modules/ticket/ticket.resolvers.js';
const JSONScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'The JSON scalar type represents JSON objects',
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => {
        if (ast.kind === Kind.STRING) {
            try {
                return JSON.parse(ast.value);
            }
            catch {
                return ast.value;
            }
        }
        return null;
    },
});
export const schema = makeExecutableSchema({
    typeDefs: [
        userTypeDefs,
        memberTypeDefs,
        memberCodeTypeDefs,
        paymentTypeTypeDefs,
        paymentTypeDefs,
        electionTypeDefs,
        electoralPositionTypeDefs,
        candidateTypeDefs,
        voteTypeDefs,
        electionApplicationTypeDefs,
        leadershipGroupTypeDefs,
        leadershipTypeDefs,
        executiveTypeDefs,
        awardCategoryTypeDefs,
        awardTypeDefs,
        awardVoteTypeDefs,
        idCardSettingsTypeDefs,
        idCardRequestTypeDefs,
        eventTypeDefs,
        galleryTypeDefs,
        communicationTypeDefs,
        donationTypeTypeDefs,
        donationTypeDefs,
        donationInvoiceTypeDefs,
        siteContentTypeDefs,
        heroSlideTypeDefs,
        dashboardTypeDefs,
        notificationTypeDefs,
        memberNotificationTypeDefs,
        ticketTypeDefs,
    ],
    resolvers: [
        { JSON: JSONScalar },
        userResolvers,
        memberResolvers,
        memberCodeResolvers,
        paymentTypeResolvers,
        paymentResolvers,
        electionResolvers,
        electoralPositionResolvers,
        candidateResolvers,
        voteResolvers,
        electionApplicationResolvers,
        leadershipGroupResolvers,
        leadershipResolvers,
        executiveResolvers,
        awardCategoryResolvers,
        awardResolvers,
        awardVoteResolvers,
        idCardSettingsResolvers,
        idCardRequestResolvers,
        eventResolvers,
        galleryResolvers,
        communicationResolvers,
        donationTypeResolvers,
        donationResolvers,
        donationInvoiceResolvers,
        siteContentResolvers,
        heroSlideResolvers,
        dashboardResolvers,
        notificationResolvers,
        memberNotificationResolvers,
        ticketResolvers,
    ],
});
//# sourceMappingURL=schema.js.map