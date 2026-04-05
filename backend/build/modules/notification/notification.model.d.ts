import mongoose from 'mongoose';
declare const Notification: mongoose.Model<{
    type: "new_member" | "new_payment" | "id_card_request" | "support_ticket";
    message: string;
    title: string;
    isRead: boolean;
    refId?: mongoose.Types.ObjectId | null | undefined;
    refModel?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    type: "new_member" | "new_payment" | "id_card_request" | "support_ticket";
    message: string;
    title: string;
    isRead: boolean;
    refId?: mongoose.Types.ObjectId | null | undefined;
    refModel?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    type: "new_member" | "new_payment" | "id_card_request" | "support_ticket";
    message: string;
    title: string;
    isRead: boolean;
    refId?: mongoose.Types.ObjectId | null | undefined;
    refModel?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "new_member" | "new_payment" | "id_card_request" | "support_ticket";
    message: string;
    title: string;
    isRead: boolean;
    refId?: mongoose.Types.ObjectId | null | undefined;
    refModel?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    type: "new_member" | "new_payment" | "id_card_request" | "support_ticket";
    message: string;
    title: string;
    isRead: boolean;
    refId?: mongoose.Types.ObjectId | null | undefined;
    refModel?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    type: "new_member" | "new_payment" | "id_card_request" | "support_ticket";
    message: string;
    title: string;
    isRead: boolean;
    refId?: mongoose.Types.ObjectId | null | undefined;
    refModel?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Notification;
//# sourceMappingURL=notification.model.d.ts.map