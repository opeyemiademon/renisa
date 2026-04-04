import MemberNotification from '../modules/memberNotification/memberNotification.model.js';

export const createMemberNotification = async (
  memberId: string,
  type: string,
  title: string,
  message: string,
  link?: string
): Promise<void> => {
  try {
    await MemberNotification.create({ memberId, type, title, message, link });
  } catch (err) {
    console.error('Failed to create member notification:', err);
  }
};
