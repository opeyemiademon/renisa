import Notification from '../modules/notification/notification.model.js';
export const createNotification = async (type, title, message, refId, refModel) => {
    try {
        await Notification.create({ type, title, message, refId, refModel });
    }
    catch (err) {
        console.error('Failed to create notification:', err);
    }
};
//# sourceMappingURL=createNotification.js.map