import mongoose from 'mongoose';
const { Schema } = mongoose;

const memberSchema = new Schema({
  memberNumber: { type: String, unique: true },
  memberCode: { type: String },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  alternatePhone: { type: String, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  sport: { type: String, trim: true },
  stateOfOrigin: { type: String, trim: true },
  lga: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  profilePicture: { type: String },
  bio: { type: String, trim: true },
  socialLinks: {
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  membershipYear: { type: Number, default: () => new Date().getFullYear() },
  isAlumni: { type: Boolean, default: false },
  alumniYear: { type: Number },
  membershipStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'deceased'],
    default: 'active',
  },
  role: { type: String, enum: ['member', 'executive', 'admin'], default: 'member' },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);
export default Member;
