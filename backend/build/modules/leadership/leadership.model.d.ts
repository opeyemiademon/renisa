import mongoose from 'mongoose';
declare const Leadership: mongoose.Model<{
    isActive: boolean;
    order: number;
    groupId: mongoose.Types.ObjectId;
    position: string;
    isCurrent: boolean;
    state?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
    nonMemberName?: string | null | undefined;
    nonMemberPhoto?: string | null | undefined;
    nonMemberBio?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    isActive: boolean;
    order: number;
    groupId: mongoose.Types.ObjectId;
    position: string;
    isCurrent: boolean;
    state?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
    nonMemberName?: string | null | undefined;
    nonMemberPhoto?: string | null | undefined;
    nonMemberBio?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    isActive: boolean;
    order: number;
    groupId: mongoose.Types.ObjectId;
    position: string;
    isCurrent: boolean;
    state?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
    nonMemberName?: string | null | undefined;
    nonMemberPhoto?: string | null | undefined;
    nonMemberBio?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isActive: boolean;
    order: number;
    groupId: mongoose.Types.ObjectId;
    position: string;
    isCurrent: boolean;
    state?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
    nonMemberName?: string | null | undefined;
    nonMemberPhoto?: string | null | undefined;
    nonMemberBio?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    isActive: boolean;
    order: number;
    groupId: mongoose.Types.ObjectId;
    position: string;
    isCurrent: boolean;
    state?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
    nonMemberName?: string | null | undefined;
    nonMemberPhoto?: string | null | undefined;
    nonMemberBio?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    isActive: boolean;
    order: number;
    groupId: mongoose.Types.ObjectId;
    position: string;
    isCurrent: boolean;
    state?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    slug?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
    nonMemberName?: string | null | undefined;
    nonMemberPhoto?: string | null | undefined;
    nonMemberBio?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Leadership;
//# sourceMappingURL=leadership.model.d.ts.map