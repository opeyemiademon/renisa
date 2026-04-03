import mongoose from 'mongoose';
declare const Election: mongoose.Model<{
    status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
    title: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    nominationStartDate?: NativeDate | null | undefined;
    nominationEndDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    eligibilityCriteria?: {
        minimumMembershipYears: number;
        paymentYears: number[];
        mustBeActive: boolean;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
    title: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    nominationStartDate?: NativeDate | null | undefined;
    nominationEndDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    eligibilityCriteria?: {
        minimumMembershipYears: number;
        paymentYears: number[];
        mustBeActive: boolean;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
    title: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    nominationStartDate?: NativeDate | null | undefined;
    nominationEndDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    eligibilityCriteria?: {
        minimumMembershipYears: number;
        paymentYears: number[];
        mustBeActive: boolean;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
    title: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    nominationStartDate?: NativeDate | null | undefined;
    nominationEndDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    eligibilityCriteria?: {
        minimumMembershipYears: number;
        paymentYears: number[];
        mustBeActive: boolean;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
    title: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    nominationStartDate?: NativeDate | null | undefined;
    nominationEndDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    eligibilityCriteria?: {
        minimumMembershipYears: number;
        paymentYears: number[];
        mustBeActive: boolean;
    } | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
    title: string;
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    nominationStartDate?: NativeDate | null | undefined;
    nominationEndDate?: NativeDate | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    eligibilityCriteria?: {
        minimumMembershipYears: number;
        paymentYears: number[];
        mustBeActive: boolean;
    } | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Election;
//# sourceMappingURL=election.model.d.ts.map