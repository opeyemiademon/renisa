import mongoose from 'mongoose';
const { Schema } = mongoose;
const gallerySchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    albumName: { type: String, trim: true },
    eventDate: { type: Date },
    year: { type: Number, default: () => new Date().getFullYear() },
    isFeatured: { type: Boolean, default: false },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });
const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
//# sourceMappingURL=gallery.model.js.map