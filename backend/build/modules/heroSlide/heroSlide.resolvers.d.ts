import { AuthContext } from '../../middleware/auth.js';
declare const heroSlideResolvers: {
    Query: {
        getHeroSlides: (_: any, { activeOnly }: {
            activeOnly?: boolean;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            isActive: boolean;
            title: string;
            imageUrl: string;
            order: number;
            ctaText: string;
            ctaLink: string;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            subtitle?: string | null | undefined;
            caption?: string | null | undefined;
            tag?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            isActive: boolean;
            title: string;
            imageUrl: string;
            order: number;
            ctaText: string;
            ctaLink: string;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            subtitle?: string | null | undefined;
            caption?: string | null | undefined;
            tag?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getHeroSlide: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            isActive: boolean;
            title: string;
            imageUrl: string;
            order: number;
            ctaText: string;
            ctaLink: string;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            subtitle?: string | null | undefined;
            caption?: string | null | undefined;
            tag?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            isActive: boolean;
            title: string;
            imageUrl: string;
            order: number;
            ctaText: string;
            ctaLink: string;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            subtitle?: string | null | undefined;
            caption?: string | null | undefined;
            tag?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createHeroSlide: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                isActive: boolean;
                title: string;
                imageUrl: string;
                order: number;
                ctaText: string;
                ctaLink: string;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                subtitle?: string | null | undefined;
                caption?: string | null | undefined;
                tag?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                isActive: boolean;
                title: string;
                imageUrl: string;
                order: number;
                ctaText: string;
                ctaLink: string;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                subtitle?: string | null | undefined;
                caption?: string | null | undefined;
                tag?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateHeroSlide: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                isActive: boolean;
                title: string;
                imageUrl: string;
                order: number;
                ctaText: string;
                ctaLink: string;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                subtitle?: string | null | undefined;
                caption?: string | null | undefined;
                tag?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                isActive: boolean;
                title: string;
                imageUrl: string;
                order: number;
                ctaText: string;
                ctaLink: string;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                subtitle?: string | null | undefined;
                caption?: string | null | undefined;
                tag?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteHeroSlide: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        reorderHeroSlides: (_: any, { ids }: {
            ids: string[];
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default heroSlideResolvers;
//# sourceMappingURL=heroSlide.resolvers.d.ts.map