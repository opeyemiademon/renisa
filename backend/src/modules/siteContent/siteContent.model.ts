import mongoose from 'mongoose';
const { Schema } = mongoose;

const siteContentSchema = new Schema({
  section: { type: String, required: true, unique: true, trim: true },
  title: { type: String, trim: true },
  content: { type: String },
  metadata: { type: Schema.Types.Mixed },
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const SiteContent = mongoose.model('SiteContent', siteContentSchema);
export default SiteContent;
