import { AuthContext } from '../../middleware/auth.js';
declare const donationTypeResolvers: {
    Query: {
        getAllDonationTypes: (_: any, { isActive }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            donationMode: "physical" | "both" | "monetary";
            sortOrder: number;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            donationMode: "physical" | "both" | "monetary";
            sortOrder: number;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getDonationType: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            donationMode: "physical" | "both" | "monetary";
            sortOrder: number;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            donationMode: "physical" | "both" | "monetary";
            sortOrder: number;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createDonationType: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                donationMode: "physical" | "both" | "monetary";
                sortOrder: number;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                donationMode: "physical" | "both" | "monetary";
                sortOrder: number;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateDonationType: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                donationMode: "physical" | "both" | "monetary";
                sortOrder: number;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                donationMode: "physical" | "both" | "monetary";
                sortOrder: number;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteDonationType: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default donationTypeResolvers;
//# sourceMappingURL=donationType.resolvers.d.ts.map