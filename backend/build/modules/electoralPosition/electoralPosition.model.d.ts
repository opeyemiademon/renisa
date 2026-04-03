import mongoose from 'mongoose';
declare const ElectoralPosition: mongoose.Model<{
    title: string;
    electionId: mongoose.Types.ObjectId;
    formFee: number;
    maxVotesPerVoter: number;
    description?: string | null | undefined;
    maxCandidates?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
    electionId: mongoose.Types.ObjectId;
    formFee: number;
    maxVotesPerVoter: number;
    description?: string | null | undefined;
    maxCandidates?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    electionId: mongoose.Types.ObjectId;
    formFee: number;
    maxVotesPerVoter: number;
    description?: string | null | undefined;
    maxCandidates?: number | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    electionId: mongoose.Types.ObjectId;
    formFee: number;
    maxVotesPerVoter: number;
    description?: string | null | undefined;
    maxCandidates?: number | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    electionId: mongoose.Types.ObjectId;
    formFee: number;
    maxVotesPerVoter: number;
    description?: string | null | undefined;
    maxCandidates?: number | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    title: string;
    electionId: mongoose.Types.ObjectId;
    formFee: number;
    maxVotesPerVoter: number;
    description?: string | null | undefined;
    maxCandidates?: number | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default ElectoralPosition;
//# sourceMappingURL=electoralPosition.model.d.ts.map