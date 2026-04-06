import mongoose from 'mongoose';
declare const HeroSlide: mongoose.Model<{
    isActive: boolean;
    title: string;
    imageUrl: string;
    order: number;
    ctaText: string;
    ctaLink: string;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    subtitle?: string | null | undefined;
    caption?: string | null | undefined;
    tag?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    isActive: boolean;
    title: string;
    imageUrl: string;
    order: number;
    ctaText: string;
    ctaLink: string;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    subtitle?: string | null | undefined;
    caption?: string | null | undefined;
    tag?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    isActive: boolean;
    title: string;
    imageUrl: string;
    order: number;
    ctaText: string;
    ctaLink: string;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    subtitle?: string | null | undefined;
    caption?: string | null | undefined;
    tag?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isActive: boolean;
    title: string;
    imageUrl: string;
    order: number;
    ctaText: string;
    ctaLink: string;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    subtitle?: string | null | undefined;
    caption?: string | null | undefined;
    tag?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    isActive: boolean;
    title: string;
    imageUrl: string;
    order: number;
    ctaText: string;
    ctaLink: string;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    subtitle?: string | null | undefined;
    caption?: string | null | undefined;
    tag?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    isActive: boolean;
    title: string;
    imageUrl: string;
    order: number;
    ctaText: string;
    ctaLink: string;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    subtitle?: string | null | undefined;
    caption?: string | null | undefined;
    tag?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default HeroSlide;
//# sourceMappingURL=heroSlide.model.d.ts.map