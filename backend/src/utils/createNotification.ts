import Notification from '../modules/notification/notification.model.js';

export const createNotification = async (
  type: 'new_member' | 'new_payment' | 'id_card_request',
  title: string,
  message: string,
  refId?: string,
  refModel?: string
): Promise<void> => {
  try {
    await Notification.create({ type, title, message, refId, refModel });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};
