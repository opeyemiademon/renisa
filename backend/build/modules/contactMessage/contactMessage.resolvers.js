import ContactMessage from './contactMessage.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const CAPTCHA_MIN = 1;
const CAPTCHA_MAX = 20;
const contactMessageResolvers = {
    Query: {
        getContactMessages: async (_, __, context) => {
            requireAdminAuth(context);
            return await ContactMessage.find().sort({ createdAt: -1 });
        },
        getContactMessage: async (_, { id }, context) => {
            requireAdminAuth(context);
            return await ContactMessage.findById(id);
        },
    },
    Mutation: {
        submitContactMessage: async (_, { data }) => {
            const { name, email, subject, message, captchaA, captchaB, captchaAnswer } = data;
            if (typeof captchaA !== 'number' ||
                typeof captchaB !== 'number' ||
                typeof captchaAnswer !== 'number') {
                throw new Error('Invalid verification');
            }
            if (captchaA < CAPTCHA_MIN ||
                captchaA > CAPTCHA_MAX ||
                captchaB < CAPTCHA_MIN ||
                captchaB > CAPTCHA_MAX) {
                throw new Error('Invalid verification');
            }
            if (captchaAnswer !== captchaA + captchaB) {
                throw new Error('Incorrect answer to the math question. Please try again.');
            }
            if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
                throw new Error('Please fill in all fields');
            }
            const doc = await ContactMessage.create({
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim(),
                read: false,
            });
            return { success: true, message: 'Your message has been sent. We will get back to you soon.', data: doc };
        },
        markContactMessageRead: async (_, { id }, context) => {
            requireAdminAuth(context);
            const updated = await ContactMessage.findByIdAndUpdate(id, { read: true }, { new: true });
            if (!updated)
                throw new Error('Message not found');
            return { success: true, message: 'Updated', data: updated };
        },
    },
};
export default contactMessageResolvers;
//# sourceMappingURL=contactMessage.resolvers.js.map