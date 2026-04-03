import mongoose from 'mongoose';
declare const AwardCategory: mongoose.Model<{
    name: string;
    isActive: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    isActive: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    isActive: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    icon?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default AwardCategory;
//# sourceMappingURL=awardCategory.model.d.ts.map