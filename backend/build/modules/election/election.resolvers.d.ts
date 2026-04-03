import { AuthContext } from '../../middleware/auth.js';
declare const electionResolvers: {
    Query: {
        getAllElections: (_: any, __: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
            title: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            nominationStartDate?: NativeDate | null | undefined;
            nominationEndDate?: NativeDate | null | undefined;
            votingStartDate?: NativeDate | null | undefined;
            votingEndDate?: NativeDate | null | undefined;
            eligibilityCriteria?: {
                minimumMembershipYears: number;
                paymentYears: number[];
                mustBeActive: boolean;
            } | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
            title: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            nominationStartDate?: NativeDate | null | undefined;
            nominationEndDate?: NativeDate | null | undefined;
            votingStartDate?: NativeDate | null | undefined;
            votingEndDate?: NativeDate | null | undefined;
            eligibilityCriteria?: {
                minimumMembershipYears: number;
                paymentYears: number[];
                mustBeActive: boolean;
            } | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getElection: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
            title: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            nominationStartDate?: NativeDate | null | undefined;
            nominationEndDate?: NativeDate | null | undefined;
            votingStartDate?: NativeDate | null | undefined;
            votingEndDate?: NativeDate | null | undefined;
            eligibilityCriteria?: {
                minimumMembershipYears: number;
                paymentYears: number[];
                mustBeActive: boolean;
            } | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
            title: string;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            nominationStartDate?: NativeDate | null | undefined;
            nominationEndDate?: NativeDate | null | undefined;
            votingStartDate?: NativeDate | null | undefined;
            votingEndDate?: NativeDate | null | undefined;
            eligibilityCriteria?: {
                minimumMembershipYears: number;
                paymentYears: number[];
                mustBeActive: boolean;
            } | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createElection: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
                title: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                nominationStartDate?: NativeDate | null | undefined;
                nominationEndDate?: NativeDate | null | undefined;
                votingStartDate?: NativeDate | null | undefined;
                votingEndDate?: NativeDate | null | undefined;
                eligibilityCriteria?: {
                    minimumMembershipYears: number;
                    paymentYears: number[];
                    mustBeActive: boolean;
                } | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
                title: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                nominationStartDate?: NativeDate | null | undefined;
                nominationEndDate?: NativeDate | null | undefined;
                votingStartDate?: NativeDate | null | undefined;
                votingEndDate?: NativeDate | null | undefined;
                eligibilityCriteria?: {
                    minimumMembershipYears: number;
                    paymentYears: number[];
                    mustBeActive: boolean;
                } | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateElection: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
                title: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                nominationStartDate?: NativeDate | null | undefined;
                nominationEndDate?: NativeDate | null | undefined;
                votingStartDate?: NativeDate | null | undefined;
                votingEndDate?: NativeDate | null | undefined;
                eligibilityCriteria?: {
                    minimumMembershipYears: number;
                    paymentYears: number[];
                    mustBeActive: boolean;
                } | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
                title: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                nominationStartDate?: NativeDate | null | undefined;
                nominationEndDate?: NativeDate | null | undefined;
                votingStartDate?: NativeDate | null | undefined;
                votingEndDate?: NativeDate | null | undefined;
                eligibilityCriteria?: {
                    minimumMembershipYears: number;
                    paymentYears: number[];
                    mustBeActive: boolean;
                } | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateElectionStatus: (_: any, { id, status }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
                title: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                nominationStartDate?: NativeDate | null | undefined;
                nominationEndDate?: NativeDate | null | undefined;
                votingStartDate?: NativeDate | null | undefined;
                votingEndDate?: NativeDate | null | undefined;
                eligibilityCriteria?: {
                    minimumMembershipYears: number;
                    paymentYears: number[];
                    mustBeActive: boolean;
                } | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "setup" | "nomination" | "voting" | "completed" | "cancelled";
                title: string;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                nominationStartDate?: NativeDate | null | undefined;
                nominationEndDate?: NativeDate | null | undefined;
                votingStartDate?: NativeDate | null | undefined;
                votingEndDate?: NativeDate | null | undefined;
                eligibilityCriteria?: {
                    minimumMembershipYears: number;
                    paymentYears: number[];
                    mustBeActive: boolean;
                } | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteElection: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default electionResolvers;
//# sourceMappingURL=election.resolvers.d.ts.map