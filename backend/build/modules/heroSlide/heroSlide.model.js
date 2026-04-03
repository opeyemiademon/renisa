import mongoose from 'mongoose';
const { Schema } = mongoose;
const heroSlideSchema = new Schema({
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    caption: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    tag: { type: String, trim: true },
    ctaText: { type: String, trim: true, default: 'Become a Member' },
    ctaLink: { type: String, trim: true, default: '/registration' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });
const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);
export default HeroSlide;
//# sourceMappingURL=heroSlide.model.js.map