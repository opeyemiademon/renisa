import mongoose from 'mongoose';
declare const Video: mongoose.Model<{
    title: string;
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    videoUrl: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    videoUrl: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    videoUrl: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    videoUrl: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    videoUrl: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    title: string;
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    videoUrl: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Video;
//# sourceMappingURL=video.model.d.ts.map