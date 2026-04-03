import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminUser from './user.model.js';
import { TOKEN_SECRET, ADMIN_TOKEN_EXPIRY } from '../../utils/constants.js';
import { requireAdminAuth, requireRole } from '../../middleware/auth.js';
const userResolvers = {
    Query: {
        getAllUsers: async (_, __, context) => {
            requireAdminAuth(context);
            return await AdminUser.find().select('-password');
        },
        getUser: async (_, { id }, context) => {
            requireAdminAuth(context);
            return await AdminUser.findById(id).select('-password');
        },
        meAdmin: async (_, __, context) => {
            requireAdminAuth(context);
            return await AdminUser.findById(context.admin.id).select('-password');
        },
    },
    Mutation: {
        createAdminUser: async (_, { data }, context) => {
            requireAdminAuth(context);
            requireRole(context, ['superadmin', 'admin']);
            const existing = await AdminUser.findOne({ email: data.email });
            if (existing)
                throw new Error('User with this email already exists');
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await AdminUser.create({ ...data, password: hashedPassword });
            return { success: true, message: 'Admin user created successfully', data: user };
        },
        loginAdmin: async (_, { data }) => {
            const { email, password } = data;
            const user = await AdminUser.findOne({ email });
            if (!user)
                throw new Error('Invalid email or password');
            if (!user.isActive)
                throw new Error('Account is deactivated');
            const valid = await bcrypt.compare(password, user.password);
            if (!valid)
                throw new Error('Invalid email or password');
            await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() });
            const signOptions = { expiresIn: ADMIN_TOKEN_EXPIRY };
            const token = jwt.sign({ id: user._id, email: user.email, role: user.role, type: 'admin' }, TOKEN_SECRET, signOptions);
            return { token, user };
        },
        updateAdminUser: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            requireRole(context, ['superadmin', 'admin']);
            const updateData = { ...data };
            if (updateData.password)
                updateData.password = await bcrypt.hash(updateData.password, 10);
            const user = await AdminUser.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
            if (!user)
                throw new Error('User not found');
            return { success: true, message: 'User updated successfully', data: user };
        },
        deleteAdminUser: async (_, { id }, context) => {
            requireAdminAuth(context);
            requireRole(context, ['superadmin']);
            const user = await AdminUser.findByIdAndDelete(id);
            if (!user)
                throw new Error('User not found');
            return { success: true, message: 'User deleted successfully' };
        },
    },
};
export default userResolvers;
//# sourceMappingURL=user.resolvers.js.map