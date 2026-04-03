import mongoose from 'mongoose';
const { Schema } = mongoose;
const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'content_manager'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, { timestamps: true });
const AdminUser = mongoose.model('AdminUser', userSchema);
export default AdminUser;
//# sourceMappingURL=user.model.js.map