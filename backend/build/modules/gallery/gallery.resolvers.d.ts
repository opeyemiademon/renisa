import { AuthContext } from '../../middleware/auth.js';
declare const galleryResolvers: {
    GalleryItem: {
        caption: (parent: any) => any;
        album: (parent: any) => any;
    };
    Query: {
        getAllGallery: (_: any, { albumName, year }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getGallery: (_: any, { albumName, year }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getGalleryItem: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getGalleryAlbums: () => Promise<string[]>;
        getGalleryYears: () => Promise<number[]>;
        getFeaturedGallery: (_: any, { limit }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            title: string;
            isFeatured: boolean;
            imageUrl: string;
            description?: string | null | undefined;
            thumbnailUrl?: string | null | undefined;
            albumName?: string | null | undefined;
            eventDate?: NativeDate | null | undefined;
            uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
    };
    Mutation: {
        createGalleryItem: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                year: number;
                title: string;
                isFeatured: boolean;
                imageUrl: string;
                description?: string | null | undefined;
                thumbnailUrl?: string | null | undefined;
                albumName?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                year: number;
                title: string;
                isFeatured: boolean;
                imageUrl: string;
                description?: string | null | undefined;
                thumbnailUrl?: string | null | undefined;
                albumName?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        addGalleryItem: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                year: number;
                title: string;
                isFeatured: boolean;
                imageUrl: string;
                description?: string | null | undefined;
                thumbnailUrl?: string | null | undefined;
                albumName?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                year: number;
                title: string;
                isFeatured: boolean;
                imageUrl: string;
                description?: string | null | undefined;
                thumbnailUrl?: string | null | undefined;
                albumName?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateGalleryItem: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                year: number;
                title: string;
                isFeatured: boolean;
                imageUrl: string;
                description?: string | null | undefined;
                thumbnailUrl?: string | null | undefined;
                albumName?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                year: number;
                title: string;
                isFeatured: boolean;
                imageUrl: string;
                description?: string | null | undefined;
                thumbnailUrl?: string | null | undefined;
                albumName?: string | null | undefined;
                eventDate?: NativeDate | null | undefined;
                uploadedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteGalleryItem: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default galleryResolvers;
//# sourceMappingURL=gallery.resolvers.d.ts.map