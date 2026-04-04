import mongoose from 'mongoose';
declare const Election: mongoose.Model<{
    year: number;
    title: string;
    status: "active" | "draft" | "completed" | "cancelled";
    positions: mongoose.Types.ObjectId[];
    eligibilityMinYears: number;
    requiresDuesPayment: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    startDate?: NativeDate | null | undefined;
    endDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    year: number;
    title: string;
    status: "active" | "draft" | "completed" | "cancelled";
    positions: mongoose.Types.ObjectId[];
    eligibilityMinYears: number;
    requiresDuesPayment: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    startDate?: NativeDate | null | undefined;
    endDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    year: number;
    title: string;
    status: "active" | "draft" | "completed" | "cancelled";
    positions: mongoose.Types.ObjectId[];
    eligibilityMinYears: number;
    requiresDuesPayment: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    startDate?: NativeDate | null | undefined;
    endDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    year: number;
    title: string;
    status: "active" | "draft" | "completed" | "cancelled";
    positions: mongoose.Types.ObjectId[];
    eligibilityMinYears: number;
    requiresDuesPayment: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    startDate?: NativeDate | null | undefined;
    endDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    year: number;
    title: string;
    status: "active" | "draft" | "completed" | "cancelled";
    positions: mongoose.Types.ObjectId[];
    eligibilityMinYears: number;
    requiresDuesPayment: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    startDate?: NativeDate | null | undefined;
    endDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    year: number;
    title: string;
    status: "active" | "draft" | "completed" | "cancelled";
    positions: mongoose.Types.ObjectId[];
    eligibilityMinYears: number;
    requiresDuesPayment: boolean;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    startDate?: NativeDate | null | undefined;
    endDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Election;
//# sourceMappingURL=election.model.d.ts.map