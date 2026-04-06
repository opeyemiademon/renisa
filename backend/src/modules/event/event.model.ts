import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String },
  excerpt: { type: String },
  coverImage: { type: String },
  images: [{ type: String }],
  eventType: {
    type: String,
    enum: ['news', 'event', 'announcement'],
    default: 'news',
  },
  eventDate: { type: Date },
  venue: { type: String, trim: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  publishedAt: { type: Date },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
