import mongoose from 'mongoose';
declare const Executive: mongoose.Model<{
    name: string;
    isActive: boolean;
    order: number;
    position: string;
    profilePicture?: string | null | undefined;
    bio?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    order: number;
    position: string;
    profilePicture?: string | null | undefined;
    bio?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    isActive: boolean;
    order: number;
    position: string;
    profilePicture?: string | null | undefined;
    bio?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    isActive: boolean;
    order: number;
    position: string;
    profilePicture?: string | null | undefined;
    bio?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    order: number;
    position: string;
    profilePicture?: string | null | undefined;
    bio?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    order: number;
    position: string;
    profilePicture?: string | null | undefined;
    bio?: string | null | undefined;
    memberId?: mongoose.Types.ObjectId | null | undefined;
    tenure?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Executive;
//# sourceMappingURL=executive.model.d.ts.map