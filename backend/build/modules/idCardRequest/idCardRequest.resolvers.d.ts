import { AuthContext } from '../../middleware/auth.js';
declare const idCardRequestResolvers: {
    IDCardRequest: {
        member: (parent: any) => any;
        photo: (parent: any) => any;
        cardUrl: (parent: any) => any;
    };
    Query: {
        getMyIDCardRequests: (_: any, __: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            requestType: "online" | "physical";
            paymentStatus: "pending" | "failed" | "paid";
            adminStatus: "approved" | "rejected" | "pending";
            downloadCount: number;
            paidAt?: NativeDate | null | undefined;
            uploadedPhoto?: string | null | undefined;
            paymentRef?: string | null | undefined;
            reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
            reviewedAt?: NativeDate | null | undefined;
            rejectionReason?: string | null | undefined;
            generatedCardFront?: string | null | undefined;
            generatedCardBack?: string | null | undefined;
            deliveryAddress?: string | null | undefined;
            deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
            trackingInfo?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            requestType: "online" | "physical";
            paymentStatus: "pending" | "failed" | "paid";
            adminStatus: "approved" | "rejected" | "pending";
            downloadCount: number;
            paidAt?: NativeDate | null | undefined;
            uploadedPhoto?: string | null | undefined;
            paymentRef?: string | null | undefined;
            reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
            reviewedAt?: NativeDate | null | undefined;
            rejectionReason?: string | null | undefined;
            generatedCardFront?: string | null | undefined;
            generatedCardBack?: string | null | undefined;
            deliveryAddress?: string | null | undefined;
            deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
            trackingInfo?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getAllIDCardRequests: (_: any, { adminStatus, paymentStatus }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            requestType: "online" | "physical";
            paymentStatus: "pending" | "failed" | "paid";
            adminStatus: "approved" | "rejected" | "pending";
            downloadCount: number;
            paidAt?: NativeDate | null | undefined;
            uploadedPhoto?: string | null | undefined;
            paymentRef?: string | null | undefined;
            reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
            reviewedAt?: NativeDate | null | undefined;
            rejectionReason?: string | null | undefined;
            generatedCardFront?: string | null | undefined;
            generatedCardBack?: string | null | undefined;
            deliveryAddress?: string | null | undefined;
            deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
            trackingInfo?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            requestType: "online" | "physical";
            paymentStatus: "pending" | "failed" | "paid";
            adminStatus: "approved" | "rejected" | "pending";
            downloadCount: number;
            paidAt?: NativeDate | null | undefined;
            uploadedPhoto?: string | null | undefined;
            paymentRef?: string | null | undefined;
            reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
            reviewedAt?: NativeDate | null | undefined;
            rejectionReason?: string | null | undefined;
            generatedCardFront?: string | null | undefined;
            generatedCardBack?: string | null | undefined;
            deliveryAddress?: string | null | undefined;
            deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
            trackingInfo?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getIDCardRequest: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            requestType: "online" | "physical";
            paymentStatus: "pending" | "failed" | "paid";
            adminStatus: "approved" | "rejected" | "pending";
            downloadCount: number;
            paidAt?: NativeDate | null | undefined;
            uploadedPhoto?: string | null | undefined;
            paymentRef?: string | null | undefined;
            reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
            reviewedAt?: NativeDate | null | undefined;
            rejectionReason?: string | null | undefined;
            generatedCardFront?: string | null | undefined;
            generatedCardBack?: string | null | undefined;
            deliveryAddress?: string | null | undefined;
            deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
            trackingInfo?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            requestType: "online" | "physical";
            paymentStatus: "pending" | "failed" | "paid";
            adminStatus: "approved" | "rejected" | "pending";
            downloadCount: number;
            paidAt?: NativeDate | null | undefined;
            uploadedPhoto?: string | null | undefined;
            paymentRef?: string | null | undefined;
            reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
            reviewedAt?: NativeDate | null | undefined;
            rejectionReason?: string | null | undefined;
            generatedCardFront?: string | null | undefined;
            generatedCardBack?: string | null | undefined;
            deliveryAddress?: string | null | undefined;
            deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
            trackingInfo?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        requestIDCard: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        initiateIDCardPayment: (_: any, { requestId }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            authorizationUrl: any;
            reference: string;
            data: import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        verifyIDCardPayment: (_: any, { reference }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        approveIDCardRequest: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        rejectIDCardRequest: (_: any, { id, reason }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        updateIDCardDeliveryStatus: (_: any, { id, deliveryStatus, trackingInfo }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        confirmIDCardPaystackPayment: (_: any, { requestId, reference, amount }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        manualIDCardPayment: (_: any, { requestId, referenceNumber, notes }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                requestType: "online" | "physical";
                paymentStatus: "pending" | "failed" | "paid";
                adminStatus: "approved" | "rejected" | "pending";
                downloadCount: number;
                paidAt?: NativeDate | null | undefined;
                uploadedPhoto?: string | null | undefined;
                paymentRef?: string | null | undefined;
                reviewedBy?: import("mongoose").Types.ObjectId | null | undefined;
                reviewedAt?: NativeDate | null | undefined;
                rejectionReason?: string | null | undefined;
                generatedCardFront?: string | null | undefined;
                generatedCardBack?: string | null | undefined;
                deliveryAddress?: string | null | undefined;
                deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
                trackingInfo?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
    };
};
export default idCardRequestResolvers;
//# sourceMappingURL=idCardRequest.resolvers.d.ts.map