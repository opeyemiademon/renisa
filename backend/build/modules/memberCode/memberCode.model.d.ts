import mongoose from 'mongoose';
declare const MemberCode: mongoose.Model<{
    code: string;
    isUsed: boolean;
    usedBy?: mongoose.Types.ObjectId | null | undefined;
    usedAt?: NativeDate | null | undefined;
    generatedBy?: mongoose.Types.ObjectId | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    batchName?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    code: string;
    isUsed: boolean;
    usedBy?: mongoose.Types.ObjectId | null | undefined;
    usedAt?: NativeDate | null | undefined;
    generatedBy?: mongoose.Types.ObjectId | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    batchName?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    code: string;
    isUsed: boolean;
    usedBy?: mongoose.Types.ObjectId | null | undefined;
    usedAt?: NativeDate | null | undefined;
    generatedBy?: mongoose.Types.ObjectId | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    batchName?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    code: string;
    isUsed: boolean;
    usedBy?: mongoose.Types.ObjectId | null | undefined;
    usedAt?: NativeDate | null | undefined;
    generatedBy?: mongoose.Types.ObjectId | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    batchName?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    code: string;
    isUsed: boolean;
    usedBy?: mongoose.Types.ObjectId | null | undefined;
    usedAt?: NativeDate | null | undefined;
    generatedBy?: mongoose.Types.ObjectId | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    batchName?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    code: string;
    isUsed: boolean;
    usedBy?: mongoose.Types.ObjectId | null | undefined;
    usedAt?: NativeDate | null | undefined;
    generatedBy?: mongoose.Types.ObjectId | null | undefined;
    expiresAt?: NativeDate | null | undefined;
    batchName?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default MemberCode;
//# sourceMappingURL=memberCode.model.d.ts.map