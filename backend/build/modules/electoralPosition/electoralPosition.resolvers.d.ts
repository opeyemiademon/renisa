import { AuthContext } from '../../middleware/auth.js';
declare const electoralPositionResolvers: {
    Query: {
        getElectionPositions: (_: any, { electionId }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            electionId: import("mongoose").Types.ObjectId;
            formFee: number;
            maxVotesPerVoter: number;
            description?: string | null | undefined;
            maxCandidates?: number | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            title: string;
            electionId: import("mongoose").Types.ObjectId;
            formFee: number;
            maxVotesPerVoter: number;
            description?: string | null | undefined;
            maxCandidates?: number | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getElectoralPosition: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            title: string;
            electionId: import("mongoose").Types.ObjectId;
            formFee: number;
            maxVotesPerVoter: number;
            description?: string | null | undefined;
            maxCandidates?: number | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            title: string;
            electionId: import("mongoose").Types.ObjectId;
            formFee: number;
            maxVotesPerVoter: number;
            description?: string | null | undefined;
            maxCandidates?: number | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createElectoralPosition: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                title: string;
                electionId: import("mongoose").Types.ObjectId;
                formFee: number;
                maxVotesPerVoter: number;
                description?: string | null | undefined;
                maxCandidates?: number | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                title: string;
                electionId: import("mongoose").Types.ObjectId;
                formFee: number;
                maxVotesPerVoter: number;
                description?: string | null | undefined;
                maxCandidates?: number | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateElectoralPosition: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                title: string;
                electionId: import("mongoose").Types.ObjectId;
                formFee: number;
                maxVotesPerVoter: number;
                description?: string | null | undefined;
                maxCandidates?: number | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                title: string;
                electionId: import("mongoose").Types.ObjectId;
                formFee: number;
                maxVotesPerVoter: number;
                description?: string | null | undefined;
                maxCandidates?: number | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteElectoralPosition: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default electoralPositionResolvers;
//# sourceMappingURL=electoralPosition.resolvers.d.ts.map