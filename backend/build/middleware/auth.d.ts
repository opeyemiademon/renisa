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
export declare const getAuthContext: (authHeader: string) => Promise<AuthContext>;
export declare const requireMemberAuth: (context: AuthContext) => void;
export declare const requireAdminAuth: (context: AuthContext) => void;
export declare const requireRole: (context: AuthContext, roles: string[]) => void;
export declare const requireAuth: (context: AuthContext) => void;
//# sourceMappingURL=auth.d.ts.map