import { AuthContext } from '../../middleware/auth.js';
declare const siteContentResolvers: {
    Query: {
        getSiteContent: (_: any, { section }: {
            section: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            section: string;
            title?: string | null | undefined;
            content?: string | null | undefined;
            metadata?: any;
            lastUpdatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            section: string;
            title?: string | null | undefined;
            content?: string | null | undefined;
            metadata?: any;
            lastUpdatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getAllSiteContent: (_: any, __: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            section: string;
            title?: string | null | undefined;
            content?: string | null | undefined;
            metadata?: any;
            lastUpdatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            section: string;
            title?: string | null | undefined;
            content?: string | null | undefined;
            metadata?: any;
            lastUpdatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
    };
    Mutation: {
        updateSiteContent: (_: any, { section, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                section: string;
                title?: string | null | undefined;
                content?: string | null | undefined;
                metadata?: any;
                lastUpdatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                section: string;
                title?: string | null | undefined;
                content?: string | null | undefined;
                metadata?: any;
                lastUpdatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default siteContentResolvers;
//# sourceMappingURL=siteContent.resolvers.d.ts.map