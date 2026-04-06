import Event from './event.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { processBase64Upload, ALLOWED_IMAGE_TYPES } from '../../utils/fileUpload.js';
import { STATIC_BASE_URL } from '../../utils/constants.js';
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
const newsTypeFilter = () => ({
    $or: [
        { eventType: 'news' },
        { eventType: { $exists: false } },
        { eventType: null },
    ],
});
const normalizeEventDates = (data) => {
    const out = { ...data };
    if (out.eventDate === '' || out.eventDate === undefined)
        delete out.eventDate;
    else if (typeof out.eventDate === 'string')
        out.eventDate = new Date(out.eventDate);
    return out;
};
const eventResolvers = {
    Event: {
        eventType: (parent) => parent.eventType || 'news',
        eventDate: (parent) => parent.eventDate ? new Date(parent.eventDate).toISOString() : null,
    },
    Query: {
        getAllEvents: async (_, { status }) => {
            return await Event.find().sort({ createdAt: -1 });
        },
        getEvent: async (_, { id }) => {
            return await Event.findById(id);
        },
        getEventBySlug: async (_, { slug }) => {
            const doc = await Event.findOne({ slug });
            if (doc && doc.status === 'published') {
                await Event.findOneAndUpdate({ slug, status: 'published' }, { $inc: { views: 1 } });
                return await Event.findOne({ slug });
            }
            return doc;
        },
        getFeaturedEvents: async (_) => {
            return await Event.find({ isFeatured: true, status: 'published' }).sort({ publishedAt: -1 });
        },
        getPublishedEvents: async (_, { limit, skip, monthYear }) => {
            const safeLimit = Math.min(Math.max(limit || 9, 1), 50);
            const safeSkip = Math.max(skip || 0, 0);
            const filter = { status: 'published' };
            if (monthYear && /^\d{4}-\d{2}$/.test(monthYear)) {
                const [y, m] = monthYear.split('-').map(Number);
                const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
                const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
                filter.$expr = {
                    $and: [
                        { $gte: [{ $ifNull: ['$publishedAt', '$createdAt'] }, start] },
                        { $lt: [{ $ifNull: ['$publishedAt', '$createdAt'] }, end] },
                    ],
                };
                Object.assign(filter, newsTypeFilter());
            }
            const [total, items] = await Promise.all([
                Event.countDocuments(filter),
                Event.find(filter)
                    .sort({ publishedAt: -1, createdAt: -1 })
                    .skip(safeSkip)
                    .limit(safeLimit)
                    .lean(),
            ]);
            return {
                items,
                total,
                hasMore: safeSkip + items.length < total,
            };
        },
        getNewsArchiveMonths: async () => {
            const rows = await Event.aggregate([
                { $match: { status: 'published', ...newsTypeFilter() } },
                {
                    $project: {
                        ref: { $ifNull: ['$publishedAt', '$createdAt'] },
                    },
                },
                {
                    $project: {
                        ym: {
                            $dateToString: { format: '%Y-%m', date: '$ref', timezone: 'UTC' },
                        },
                    },
                },
                { $match: { ym: { $ne: null } } },
                { $group: { _id: '$ym' } },
                { $sort: { _id: -1 } },
            ]);
            return rows.map((r) => r._id).filter(Boolean);
        },
    },
    Mutation: {
        createEvent: async (_, { data }, context) => {
            requireAdminAuth(context);
            const { photoBase64, ...rest } = data;
            let coverImage = rest.coverImage;
            if (photoBase64) {
                try {
                    const fileName = await processBase64Upload(photoBase64, 'events', ALLOWED_IMAGE_TYPES, 'event');
                    coverImage = `${STATIC_BASE_URL}/uploads/events/${fileName}`;
                }
                catch (uploadError) {
                    console.error('Photo upload error:', uploadError.message);
                }
            }
            const slug = await generateUniqueSlug(data.title);
            const payload = normalizeEventDates(rest);
            const event = await Event.create({ ...payload, coverImage, slug, createdBy: context.admin.id });
            return { success: true, message: 'Event created', data: event };
        },
        updateEvent: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const { photoBase64, ...rest } = data;
            let updateData = normalizeEventDates(rest);
            if (photoBase64) {
                try {
                    const fileName = await processBase64Upload(photoBase64, 'events', ALLOWED_IMAGE_TYPES, 'event');
                    updateData = { ...updateData, coverImage: `${STATIC_BASE_URL}/uploads/events/${fileName}` };
                }
                catch (uploadError) {
                    console.error('Photo upload error:', uploadError.message);
                }
            }
            const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
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