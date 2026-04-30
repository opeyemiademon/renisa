import mongoose from 'mongoose';
const { Schema } = mongoose;
const videoSchema = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String },
    videoUrl: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    publishedAt: { type: Date },
}, { timestamps: true });
const Video = mongoose.model('Video', videoSchema);
export default Video;
//# sourceMappingURL=video.model.js.map