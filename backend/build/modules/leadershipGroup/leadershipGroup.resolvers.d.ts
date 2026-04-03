import { AuthContext } from '../../middleware/auth.js';
export declare const seedLeadershipGroups: () => Promise<void>;
declare const leadershipGroupResolvers: {
    Query: {
        getAllLeadershipGroups: () => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            slug: "bot" | "nec" | "state-executives" | "directorate";
            order: number;
            description?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            slug: "bot" | "nec" | "state-executives" | "directorate";
            order: number;
            description?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getLeadershipGroup: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            slug: "bot" | "nec" | "state-executives" | "directorate";
            order: number;
            description?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            slug: "bot" | "nec" | "state-executives" | "directorate";
            order: number;
            description?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getLeadershipGroupBySlug: (_: any, { slug }: {
            slug: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            slug: "bot" | "nec" | "state-executives" | "directorate";
            order: number;
            description?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            slug: "bot" | "nec" | "state-executives" | "directorate";
            order: number;
            description?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        updateLeadershipGroup: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                slug: "bot" | "nec" | "state-executives" | "directorate";
                order: number;
                description?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                slug: "bot" | "nec" | "state-executives" | "directorate";
                order: number;
                description?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default leadershipGroupResolvers;
//# sourceMappingURL=leadershipGroup.resolvers.d.ts.map