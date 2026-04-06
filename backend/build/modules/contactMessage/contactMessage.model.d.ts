import mongoose from 'mongoose';
declare const ContactMessage: mongoose.Model<{
    name: string;
    email: string;
    message: string;
    subject: string;
    read: boolean;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    message: string;
    subject: string;
    read: boolean;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    email: string;
    message: string;
    subject: string;
    read: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    message: string;
    subject: string;
    read: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    email: string;
    message: string;
    subject: string;
    read: boolean;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    email: string;
    message: string;
    subject: string;
    read: boolean;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default ContactMessage;
//# sourceMappingURL=contactMessage.model.d.ts.map