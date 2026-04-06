import mongoose from 'mongoose';
declare const Award: mongoose.Model<{
    year: number;
    status: "nominated" | "voting" | "awarded";
    memberId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    votingEnabled: boolean;
    image?: string | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    nominatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    year: number;
    status: "nominated" | "voting" | "awarded";
    memberId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    votingEnabled: boolean;
    image?: string | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    nominatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    year: number;
    status: "nominated" | "voting" | "awarded";
    memberId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    votingEnabled: boolean;
    image?: string | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    nominatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    year: number;
    status: "nominated" | "voting" | "awarded";
    memberId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    votingEnabled: boolean;
    image?: string | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    nominatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    year: number;
    status: "nominated" | "voting" | "awarded";
    memberId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    votingEnabled: boolean;
    image?: string | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    nominatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    year: number;
    status: "nominated" | "voting" | "awarded";
    memberId: mongoose.Types.ObjectId;
    categoryId: mongoose.Types.ObjectId;
    votingEnabled: boolean;
    image?: string | null | undefined;
    votingStartDate?: NativeDate | null | undefined;
    votingEndDate?: NativeDate | null | undefined;
    nominatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Award;
//# sourceMappingURL=award.model.d.ts.map