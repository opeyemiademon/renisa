import mongoose from 'mongoose';
declare const SiteContent: mongoose.Model<{
    section: string;
    title?: string | null | undefined;
    content?: string | null | undefined;
    metadata?: any;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    section: string;
    title?: string | null | undefined;
    content?: string | null | undefined;
    metadata?: any;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    section: string;
    title?: string | null | undefined;
    content?: string | null | undefined;
    metadata?: any;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    section: string;
    title?: string | null | undefined;
    content?: string | null | undefined;
    metadata?: any;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    section: string;
    title?: string | null | undefined;
    content?: string | null | undefined;
    metadata?: any;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    section: string;
    title?: string | null | undefined;
    content?: string | null | undefined;
    metadata?: any;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default SiteContent;
//# sourceMappingURL=siteContent.model.d.ts.map