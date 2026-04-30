import { AuthContext } from '../../middleware/auth.js';
declare const videoResolvers: {
    Query: {
        getAllVideos: (_: any, { status, category }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getVideo: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getVideoBySlug: (_: any, { slug }: {
            slug: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getFeaturedVideos: () => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            title: string;
            status: "draft" | "published" | "archived";
            isFeatured: boolean;
            views: number;
            videoUrl: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
            thumbnailUrl?: string | null | undefined;
            category?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getVideoCategories: () => Promise<string[]>;
    };
    Mutation: {
        createVideo: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateVideo: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteVideo: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        publishVideo: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        archiveVideo: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                title: string;
                status: "draft" | "published" | "archived";
                isFeatured: boolean;
                views: number;
                videoUrl: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
                thumbnailUrl?: string | null | undefined;
                category?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default videoResolvers;
//# sourceMappingURL=video.resolvers.d.ts.map