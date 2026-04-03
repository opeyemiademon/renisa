import mongoose from 'mongoose';
declare const Gallery: mongoose.Model<{
    year: number;
    title: string;
    isFeatured: boolean;
    imageUrl: string;
    description?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    albumName?: string | null | undefined;
    uploadedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    year: number;
    title: string;
    isFeatured: boolean;
    imageUrl: string;
    description?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    albumName?: string | null | undefined;
    uploadedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    year: number;
    title: string;
    isFeatured: boolean;
    imageUrl: string;
    description?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    albumName?: string | null | undefined;
    uploadedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    year: number;
    title: string;
    isFeatured: boolean;
    imageUrl: string;
    description?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    albumName?: string | null | undefined;
    uploadedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    year: number;
    title: string;
    isFeatured: boolean;
    imageUrl: string;
    description?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    albumName?: string | null | undefined;
    uploadedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    year: number;
    title: string;
    isFeatured: boolean;
    imageUrl: string;
    description?: string | null | undefined;
    eventDate?: NativeDate | null | undefined;
    thumbnailUrl?: string | null | undefined;
    albumName?: string | null | undefined;
    uploadedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Gallery;
//# sourceMappingURL=gallery.model.d.ts.map