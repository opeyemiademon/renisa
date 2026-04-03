import mongoose from 'mongoose';
declare const AdminUser: mongoose.Model<{
    name: string;
    email: string;
    password: string;
    role: "superadmin" | "admin" | "content_manager";
    isActive: boolean;
    lastLogin?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    role: "superadmin" | "admin" | "content_manager";
    isActive: boolean;
    lastLogin?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    email: string;
    password: string;
    role: "superadmin" | "admin" | "content_manager";
    isActive: boolean;
    lastLogin?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    password: string;
    role: "superadmin" | "admin" | "content_manager";
    isActive: boolean;
    lastLogin?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    email: string;
    password: string;
    role: "superadmin" | "admin" | "content_manager";
    isActive: boolean;
    lastLogin?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    email: string;
    password: string;
    role: "superadmin" | "admin" | "content_manager";
    isActive: boolean;
    lastLogin?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default AdminUser;
//# sourceMappingURL=user.model.d.ts.map