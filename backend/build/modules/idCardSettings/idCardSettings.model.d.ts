import mongoose from 'mongoose';
declare const IDCardSettings: mongoose.Model<{
    currency: string;
    onlineFee: number;
    physicalFee: number;
    isEnabled: boolean;
    requiresApproval: boolean;
    validityYears: number;
    updatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    currency: string;
    onlineFee: number;
    physicalFee: number;
    isEnabled: boolean;
    requiresApproval: boolean;
    validityYears: number;
    updatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    currency: string;
    onlineFee: number;
    physicalFee: number;
    isEnabled: boolean;
    requiresApproval: boolean;
    validityYears: number;
    updatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    currency: string;
    onlineFee: number;
    physicalFee: number;
    isEnabled: boolean;
    requiresApproval: boolean;
    validityYears: number;
    updatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    currency: string;
    onlineFee: number;
    physicalFee: number;
    isEnabled: boolean;
    requiresApproval: boolean;
    validityYears: number;
    updatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    currency: string;
    onlineFee: number;
    physicalFee: number;
    isEnabled: boolean;
    requiresApproval: boolean;
    validityYears: number;
    updatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default IDCardSettings;
//# sourceMappingURL=idCardSettings.model.d.ts.map