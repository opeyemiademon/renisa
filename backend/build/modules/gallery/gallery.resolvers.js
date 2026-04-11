import Gallery from './gallery.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const galleryResolvers = {
    GalleryItem: {
        caption: (parent) => parent.description,
        album: (parent) => parent.albumName,
    },
    Query: {
        getAllGallery: async (_, { albumName, year }) => {
            const filter = {};
            if (albumName)
                filter.albumName = albumName;
            if (year)
                filter.year = year;
            return await Gallery.find(filter).sort({ createdAt: -1 });
        },
        getGallery: async (_, { albumName, year }) => {
            const filter = {};
            if (albumName)
                filter.albumName = albumName;
            if (year)
                filter.year = year;
            return await Gallery.find(filter).sort({ createdAt: -1 });
        },
        getGalleryItem: async (_, { id }) => {
            return await Gallery.findById(id);
        },
        getGalleryAlbums: async () => {
            const albums = await Gallery.distinct('albumName');
            return albums.filter(Boolean);
        },
        getGalleryYears: async () => {
            const years = await Gallery.distinct('year');
            return years.filter(Boolean).sort((a, b) => b - a);
        },
        getFeaturedGallery: async (_, { limit = 10 }) => {
            return await Gallery.find({ isFeatured: true }).limit(limit).sort({ createdAt: -1 });
        },
    },
    Mutation: {
        createGalleryItem: async (_, { data }, context) => {
            requireAdminAuth(context);
            const item = await Gallery.create({
                ...data,
                title: data.title || data.description || 'Untitled',
                uploadedBy: context.admin.id,
            });
            return { success: true, message: 'Gallery item created', data: item };
        },
        addGalleryItem: async (_, { data }, context) => {
            requireAdminAuth(context);
            const item = await Gallery.create({
                imageUrl: data.imageUrl,
                description: data.caption,
                albumName: data.album,
                year: data.year || new Date().getFullYear(),
                title: data.caption || data.album || 'Gallery Photo',
                isFeatured: false,
                uploadedBy: context.admin.id,
            });
            return { success: true, message: 'Photo added to gallery', data: item };
        },
        updateGalleryItem: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const update = { ...data };
            // Accept frontend-friendly fields while storing canonical model fields.
            if (data.caption !== undefined)
                update.description = data.caption;
            if (data.album !== undefined)
                update.albumName = data.album;
            // Remove non-model aliases to avoid strict schema rejection.
            delete update.caption;
            delete update.album;
            if (update.description && !update.title) {
                update.title = update.description;
            }
            else if (update.albumName && !update.title) {
                update.title = update.albumName;
            }
            const item = await Gallery.findByIdAndUpdate(id, update, { new: true });
            if (!item)
                throw new Error('Gallery item not found');
            return { success: true, message: 'Gallery item updated', data: item };
        },
        deleteGalleryItem: async (_, { id }, context) => {
            requireAdminAuth(context);
            const item = await Gallery.findByIdAndDelete(id);
            if (!item)
                throw new Error('Gallery item not found');
            return { success: true, message: 'Gallery item deleted' };
        },
    },
};
export default galleryResolvers;
//# sourceMappingURL=gallery.resolvers.js.map