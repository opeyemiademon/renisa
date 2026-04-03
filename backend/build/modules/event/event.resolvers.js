import Event from './event.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const slugify = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};
const generateUniqueSlug = async (title) => {
    let slug = slugify(title);
    let counter = 0;
    while (true) {
        const existing = await Event.findOne({ slug: counter === 0 ? slug : `${slug}-${counter}` });
        if (!existing)
            break;
        counter++;
    }
    return counter === 0 ? slug : `${slug}-${counter}`;
};
const eventResolvers = {
    Query: {
        getAllEvents: async (_, { eventType, status }) => {
            const filter = {};
            if (eventType)
                filter.eventType = eventType;
            if (status)
                filter.status = status;
            return await Event.find(filter).sort({ createdAt: -1 });
        },
        getEvent: async (_, { id }) => {
            await Event.findByIdAndUpdate(id, { $inc: { views: 1 } });
            return await Event.findById(id);
        },
        getEventBySlug: async (_, { slug }) => {
            await Event.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
            return await Event.findOne({ slug });
        },
        getFeaturedEvents: async (_, { limit = 5 }) => {
            return await Event.find({ isFeatured: true, status: 'published' }).limit(limit).sort({ publishedAt: -1 });
        },
    },
    Mutation: {
        createEvent: async (_, { data }, context) => {
            requireAdminAuth(context);
            const slug = await generateUniqueSlug(data.title);
            const event = await Event.create({ ...data, slug, createdBy: context.admin.id });
            return { success: true, message: 'Event created', data: event };
        },
        updateEvent: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const event = await Event.findByIdAndUpdate(id, data, { new: true });
            if (!event)
                throw new Error('Event not found');
            return { success: true, message: 'Event updated', data: event };
        },
        deleteEvent: async (_, { id }, context) => {
            requireAdminAuth(context);
            const event = await Event.findByIdAndDelete(id);
            if (!event)
                throw new Error('Event not found');
            return { success: true, message: 'Event deleted' };
        },
        publishEvent: async (_, { id }, context) => {
            requireAdminAuth(context);
            const event = await Event.findByIdAndUpdate(id, { status: 'published', publishedAt: new Date() }, { new: true });
            if (!event)
                throw new Error('Event not found');
            return { success: true, message: 'Event published', data: event };
        },
        archiveEvent: async (_, { id }, context) => {
            requireAdminAuth(context);
            const event = await Event.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
            if (!event)
                throw new Error('Event not found');
            return { success: true, message: 'Event archived', data: event };
        },
    },
};
export default eventResolvers;
//# sourceMappingURL=event.resolvers.js.map