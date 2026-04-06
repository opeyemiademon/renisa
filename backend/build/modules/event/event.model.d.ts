import mongoose from 'mongoose';
declare const Event: mongoose.Model<{
    title: string;
    images: string[];
    eventType: "news" | "event" | "announcement";
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    venue?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    images: string[];
    eventType: "news" | "event" | "announcement";
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    venue?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    images: string[];
    eventType: "news" | "event" | "announcement";
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    venue?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    images: string[];
    eventType: "news" | "event" | "announcement";
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    venue?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    images: string[];
    eventType: "news" | "event" | "announcement";
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    venue?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    title: string;
    images: string[];
    eventType: "news" | "event" | "announcement";
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    views: number;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    content?: string | null | undefined;
    excerpt?: string | null | undefined;
    coverImage?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    venue?: string | null | undefined;
    publishedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Event;
//# sourceMappingURL=event.model.d.ts.map