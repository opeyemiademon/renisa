import MemberNotification from '../modules/memberNotification/memberNotification.model.js';
export const createMemberNotification = async (memberId, type, title, message, link) => {
    try {
        await MemberNotification.create({ memberId, type, title, message, link });
    }
    catch (err) {
        console.error('Failed to create member notification:', err);
    }
};
//# sourceMappingURL=createMemberNotification.js.map