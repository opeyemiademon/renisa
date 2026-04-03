import { AuthContext } from '../../middleware/auth.js';
declare const candidateResolvers: {
    Query: {
        getCandidates: (_: any, { electionId, positionId }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            memberId: import("mongoose").Types.ObjectId;
            electionId: import("mongoose").Types.ObjectId;
            positionId: import("mongoose").Types.ObjectId;
            formPaymentStatus: "pending" | "paid";
            isApproved: boolean;
            profilePicture?: string | null | undefined;
            manifesto?: string | null | undefined;
            formPaymentRef?: string | null | undefined;
            approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            memberId: import("mongoose").Types.ObjectId;
            electionId: import("mongoose").Types.ObjectId;
            positionId: import("mongoose").Types.ObjectId;
            formPaymentStatus: "pending" | "paid";
            isApproved: boolean;
            profilePicture?: string | null | undefined;
            manifesto?: string | null | undefined;
            formPaymentRef?: string | null | undefined;
            approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getCandidate: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            memberId: import("mongoose").Types.ObjectId;
            electionId: import("mongoose").Types.ObjectId;
            positionId: import("mongoose").Types.ObjectId;
            formPaymentStatus: "pending" | "paid";
            isApproved: boolean;
            profilePicture?: string | null | undefined;
            manifesto?: string | null | undefined;
            formPaymentRef?: string | null | undefined;
            approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            memberId: import("mongoose").Types.ObjectId;
            electionId: import("mongoose").Types.ObjectId;
            positionId: import("mongoose").Types.ObjectId;
            formPaymentStatus: "pending" | "paid";
            isApproved: boolean;
            profilePicture?: string | null | undefined;
            manifesto?: string | null | undefined;
            formPaymentRef?: string | null | undefined;
            approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        purchaseCandidateForm: (_: any, { electionId, positionId }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
            authorizationUrl: any;
        } | {
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
            authorizationUrl?: undefined;
        }>;
        verifyCandidateFormPayment: (_: any, { paystackRef }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        } | {
            success: boolean;
            message: string;
            data?: undefined;
        }>;
        submitCandidacy: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        approveCandidate: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        rejectCandidate: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                memberId: import("mongoose").Types.ObjectId;
                electionId: import("mongoose").Types.ObjectId;
                positionId: import("mongoose").Types.ObjectId;
                formPaymentStatus: "pending" | "paid";
                isApproved: boolean;
                profilePicture?: string | null | undefined;
                manifesto?: string | null | undefined;
                formPaymentRef?: string | null | undefined;
                approvedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default candidateResolvers;
//# sourceMappingURL=candidate.resolvers.d.ts.map