import mongoose from 'mongoose';
declare const LeadershipGroup: mongoose.Model<{
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default LeadershipGroup;
//# sourceMappingURL=leadershipGroup.model.d.ts.map