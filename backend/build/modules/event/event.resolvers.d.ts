import { AuthContext } from '../../middleware/auth.js';
declare const eventResolvers: {
    Event: {
        eventType: (parent: any) => any;
        eventDate: (parent: any) => string | null;
    };
    Query: {
        getAllEvents: (_: any, { status }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
        getFeaturedEvents: (_: any) => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
            title: string;
            images: string[];
            eventType: "news" | "event" | "announcement";
            status: "draft" | "published" | "archived";
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
        getPublishedEvents: (_: any, { limit, skip, monthYear }: {
            limit: number;
            skip: number;
            monthYear?: string | null;
        }) => Promise<{
            items: (import("mongoose").FlattenMaps<{
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                createdAt: NativeDate;
                updatedAt: NativeDate;
            }> & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            total: number;
            hasMore: boolean;
        }>;
        getNewsArchiveMonths: () => Promise<string[]>;
    };
    Mutation: {
        createEvent: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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
                title: string;
                images: string[];
                eventType: "news" | "event" | "announcement";
                status: "draft" | "published" | "archived";
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