import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../utils/constants.js';
import AdminUser from '../modules/user/user.model.js';
import Member from '../modules/member/member.model.js';
export const getAuthContext = async (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { isAuthenticated: false };
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        if (decoded.type === 'admin') {
            const user = await AdminUser.findById(decoded.id).select('-password');
            if (!user || !user.isActive)
                throw new Error('Admin user not found or inactive');
            return {
                isAuthenticated: true,
                admin: {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    type: 'admin',
                },
            };
        }
        else if (decoded.type === 'member') {
            const member = await Member.findById(decoded.id).select('-password');
            if (!member)
                throw new Error('Member not found');
            return {
                isAuthenticated: true,
                member: {
                    id: member._id.toString(),
                    email: member.email,
                    role: member.role,
                    type: 'member',
                },
            };
        }
        throw new Error('Invalid token type');
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
};
export const requireMemberAuth = (context) => {
    if (!context.isAuthenticated || !context.member) {
        throw new Error('Member authentication required');
    }
};
export const requireAdminAuth = (context) => {
    if (!context.isAuthenticated || !context.admin) {
        throw new Error('Admin authentication required');
    }
};
export const requireRole = (context, roles) => {
    if (context.admin) {
        if (!roles.includes(context.admin.role)) {
            throw new Error('Insufficient permissions');
        }
        return;
    }
    if (context.member) {
        if (!roles.includes(context.member.role)) {
            throw new Error('Insufficient permissions');
        }
        return;
    }
    throw new Error('Authentication required');
};
export const requireAuth = (context) => {
    if (!context.isAuthenticated || (!context.admin && !context.member)) {
        throw new Error('Authentication required');
    }
};
//# sourceMappingURL=auth.js.map