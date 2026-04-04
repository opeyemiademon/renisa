import mongoose from 'mongoose';
declare const MemberNotification: mongoose.Model<{
    type: string;
    message: string;
    title: string;
    isRead: boolean;
    memberId: mongoose.Types.ObjectId;
    link?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    type: string;
    message: string;
    title: string;
    isRead: boolean;
    memberId: mongoose.Types.ObjectId;
    link?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    type: string;
    message: string;
    title: string;
    isRead: boolean;
    memberId: mongoose.Types.ObjectId;
    link?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: string;
    message: string;
    title: string;
    isRead: boolean;
    memberId: mongoose.Types.ObjectId;
    link?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    type: string;
    message: string;
    title: string;
    isRead: boolean;
    memberId: mongoose.Types.ObjectId;
    link?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    type: string;
    message: string;
    title: string;
    isRead: boolean;
    memberId: mongoose.Types.ObjectId;
    link?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default MemberNotification;
//# sourceMappingURL=memberNotification.model.d.ts.map