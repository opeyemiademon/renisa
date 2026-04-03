import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../utils/constants.js';
import AdminUser from '../modules/user/user.model.js';
import Member from '../modules/member/member.model.js';

export interface AuthContext {
  isAuthenticated: boolean;
  admin?: {
    id: string;
    email: string;
    role: string;
    type: 'admin';
  };
  member?: {
    id: string;
    email: string;
    role: string;
    type: 'member';
  };
  authError?: string;
  req?: any;
}

export const getAuthContext = async (authHeader: string): Promise<AuthContext> => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuthenticated: false };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as any;

    if (decoded.type === 'admin') {
      const user = await AdminUser.findById(decoded.id).select('-password');
      if (!user || !user.isActive) throw new Error('Admin user not found or inactive');
      return {
        isAuthenticated: true,
        admin: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          type: 'admin',
        },
      };
    } else if (decoded.type === 'member') {
      const member = await Member.findById(decoded.id).select('-password');
      if (!member) throw new Error('Member not found');
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
  } catch (error: any) {
    throw new Error('Invalid or expired token');
  }
};

export const requireMemberAuth = (context: AuthContext): void => {
  if (!context.isAuthenticated || !context.member) {
    throw new Error('Member authentication required');
  }
};

export const requireAdminAuth = (context: AuthContext): void => {
  if (!context.isAuthenticated || !context.admin) {
    throw new Error('Admin authentication required');
  }
};

export const requireRole = (context: AuthContext, roles: string[]): void => {
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

export const requireAuth = (context: AuthContext): void => {
  if (!context.isAuthenticated || (!context.admin && !context.member)) {
    throw new Error('Authentication required');
  }
};
