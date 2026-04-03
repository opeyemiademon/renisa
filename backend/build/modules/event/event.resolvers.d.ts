import { AuthContext } from '../../middleware/auth.js';
declare const eventResolvers: {
    Query: {
        getAllEvents: (_: any, { eventType, status }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getEvent: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getEventBySlug: (_: any, { slug }: {
            slug: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getFeaturedEvents: (_: any, { limit }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "draft" | "published" | "archived";
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            isFeatured: boolean;
            views: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            slug?: string | null | undefined;
            content?: string | null | undefined;
            excerpt?: string | null | undefined;
            coverImage?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            venue?: string | null | undefined;
            publishedAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
    };
    Mutation: {
        createEvent: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateEvent: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteEvent: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        publishEvent: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        archiveEvent: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "draft" | "published" | "archived";
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                isFeatured: boolean;
                views: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                slug?: string | null | undefined;
                content?: string | null | undefined;
                excerpt?: string | null | undefined;
                coverImage?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                venue?: string | null | undefined;
                publishedAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default eventResolvers;
//# sourceMappingURL=event.resolvers.d.ts.map