import mongoose from 'mongoose';
declare const AwardVote: mongoose.Model<{
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
    awardId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
    awardId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
    awardId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
    awardId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
    awardId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    voterId: mongoose.Types.ObjectId;
    votedAt: NativeDate;
    awardId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default AwardVote;
//# sourceMappingURL=awardVote.model.d.ts.map