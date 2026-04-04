import { AuthContext } from '../../middleware/auth.js';
declare const idCardSettingsResolvers: {
    Query: {
        getIDCardSettings: () => Promise<import("mongoose").Document<unknown, {}, {
            currency: string;
            onlineFee: number;
            physicalFee: number;
            isEnabled: boolean;
            requiresApproval: boolean;
            validityYears: number;
            headerText?: string | null | undefined;
            footerText?: string | null | undefined;
            updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            currency: string;
            onlineFee: number;
            physicalFee: number;
            isEnabled: boolean;
            requiresApproval: boolean;
            validityYears: number;
            headerText?: string | null | undefined;
            footerText?: string | null | undefined;
            updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }>;
    };
    Mutation: {
        updateIDCardSettings: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                currency: string;
                onlineFee: number;
                physicalFee: number;
                isEnabled: boolean;
                requiresApproval: boolean;
                validityYears: number;
                headerText?: string | null | undefined;
                footerText?: string | null | undefined;
                updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                currency: string;
                onlineFee: number;
                physicalFee: number;
                isEnabled: boolean;
                requiresApproval: boolean;
                validityYears: number;
                headerText?: string | null | undefined;
                footerText?: string | null | undefined;
                updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default idCardSettingsResolvers;
//# sourceMappingURL=idCardSettings.resolvers.d.ts.map