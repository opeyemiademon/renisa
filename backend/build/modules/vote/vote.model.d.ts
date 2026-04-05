import mongoose from 'mongoose';
declare const Vote: mongoose.Model<{
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    candidateId: mongoose.Types.ObjectId;
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Vote;
//# sourceMappingURL=vote.model.d.ts.map