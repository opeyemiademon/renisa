import Executive from './executive.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const normalizeData = (data) => {
    const result = { ...data };
    if (result.title && !result.position) {
        result.position = result.title;
    }
    if (result.photo && !result.profilePicture) {
        result.profilePicture = result.photo;
    }
    if (result.displayOrder !== undefined && result.order === undefined) {
        result.order = result.displayOrder;
    }
    delete result.title;
    delete result.photo;
    delete result.displayOrder;
    return result;
};
const executiveResolvers = {
    Executive: {
        photo: (parent) => parent.profilePicture,
        title: (parent) => parent.position,
        displayOrder: (parent) => parent.order,
        member: (parent) => parent.memberId,
    },
    Query: {
        getAllExecutives: async (_, { isActive }) => {
            const filter = {};
            if (isActive !== undefined)
                filter.isActive = isActive;
            return await Executive.find(filter)
                .populate('memberId', 'firstName lastName profilePicture memberNumber bio')
                .sort({ order: 1 });
        },
        getExecutive: async (_, { id }) => {
            return await Executive.findById(id).populate('memberId', 'firstName lastName profilePicture memberNumber bio');
        },
    },
    Mutation: {
        createExecutive: async (_, { data }, context) => {
            requireAdminAuth(context);
            const normalized = normalizeData(data);
            const executive = await Executive.create(normalized);
            const populated = await Executive.findById(executive._id).populate('memberId', 'firstName lastName profilePicture memberNumber');
            return { success: true, message: 'Executive created', data: populated };
        },
        updateExecutive: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const normalized = normalizeData(data);
            const executive = await Executive.findByIdAndUpdate(id, normalized, { new: true })
                .populate('memberId', 'firstName lastName profilePicture memberNumber');
            if (!executive)
                throw new Error('Executive not found');
            return { success: true, message: 'Executive updated', data: executive };
        },
        deleteExecutive: async (_, { id }, context) => {
            requireAdminAuth(context);
            const executive = await Executive.findByIdAndDelete(id);
            if (!executive)
                throw new Error('Executive not found');
            return { success: true, message: 'Executive deleted' };
        },
        reorderExecutives: async (_, { items }, context) => {
            requireAdminAuth(context);
            await Promise.all(items.map((item) => Executive.findByIdAndUpdate(item.id, { order: item.order })));
            return { success: true, message: 'Executives reordered' };
        },
    },
};
export default executiveResolvers;
//# sourceMappingURL=executive.resolvers.js.map