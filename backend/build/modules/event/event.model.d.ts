import mongoose from 'mongoose';
declare const Event: mongoose.Model<{
    title: string;
    status: "draft" | "published" | "archived";
    images: string[];
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    status: "draft" | "published" | "archived";
    images: string[];
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    status: "draft" | "published" | "archived";
    images: string[];
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    status: "draft" | "published" | "archived";
    images: string[];
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    status: "draft" | "published" | "archived";
    images: string[];
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    title: string;
    status: "draft" | "published" | "archived";
    images: string[];
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Event;
//# sourceMappingURL=event.model.d.ts.map