import { AuthContext } from '../../middleware/auth.js';
declare const memberResolvers: {
    Member: {
        status: (parent: any) => any;
    };
    Query: {
        getAllMembers: (_: any, { search, status, memberNumber, memberCode, email, gender, state, dateFrom, dateTo, name }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getMember: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getMemberByNumber: (_: any, { memberNumber }: {
            memberNumber: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        checkMemberCode: (_: any, { code }: {
            code: string;
        }) => Promise<false | {
            valid: boolean;
        }>;
        getAlumni: (_: any, __: any) => Promise<(import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getNewMembers: (_: any, { limit }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        me: (_: any, __: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            email: string;
            password: string;
            role: "admin" | "member" | "executive";
            firstName: string;
            lastName: string;
            membershipYear: number;
            isAlumni: boolean;
            membershipStatus: "active" | "inactive" | "suspended" | "deceased";
            isEmailVerified: boolean;
            lastLogin?: NativeDate | null | undefined;
            memberNumber?: string | null | undefined;
            memberCode?: string | null | undefined;
            middleName?: string | null | undefined;
            phone?: string | null | undefined;
            alternatePhone?: string | null | undefined;
            dateOfBirth?: NativeDate | null | undefined;
            gender?: "male" | "female" | "other" | null | undefined;
            sport?: string | null | undefined;
            stateOfOrigin?: string | null | undefined;
            lga?: string | null | undefined;
            address?: string | null | undefined;
            city?: string | null | undefined;
            state?: string | null | undefined;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            socialLinks?: {
                twitter?: string | null | undefined;
                linkedin?: string | null | undefined;
                facebook?: string | null | undefined;
                instagram?: string | null | undefined;
                website?: string | null | undefined;
            } | null | undefined;
            alumniYear?: number | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        loginMember: (_: any, { data }: {
            data: any;
        }) => Promise<{
            token: string;
            member: import("mongoose").Document<unknown, {}, {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
    Mutation: {
        registerMember: (_: any, { data }: {
            data: any;
        }) => Promise<{
            token: string;
            member: import("mongoose").Document<unknown, {}, {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        adminRegisterMember: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateMember: (_: any, { id, data }: {
            id: string;
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateMemberStatus: (_: any, { id, status }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteMember: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        markMemberAsAlumni: (_: any, { id, alumniYear }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        loginAsMember: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            token: string;
            member: import("mongoose").Document<unknown, {}, {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                email: string;
                password: string;
                role: "admin" | "member" | "executive";
                firstName: string;
                lastName: string;
                membershipYear: number;
                isAlumni: boolean;
                membershipStatus: "active" | "inactive" | "suspended" | "deceased";
                isEmailVerified: boolean;
                lastLogin?: NativeDate | null | undefined;
                memberNumber?: string | null | undefined;
                memberCode?: string | null | undefined;
                middleName?: string | null | undefined;
                phone?: string | null | undefined;
                alternatePhone?: string | null | undefined;
                dateOfBirth?: NativeDate | null | undefined;
                gender?: "male" | "female" | "other" | null | undefined;
                sport?: string | null | undefined;
                stateOfOrigin?: string | null | undefined;
                lga?: string | null | undefined;
                address?: string | null | undefined;
                city?: string | null | undefined;
                state?: string | null | undefined;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                socialLinks?: {
                    twitter?: string | null | undefined;
                    linkedin?: string | null | undefined;
                    facebook?: string | null | undefined;
                    instagram?: string | null | undefined;
                    website?: string | null | undefined;
                } | null | undefined;
                alumniYear?: number | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default memberResolvers;
//# sourceMappingURL=member.resolvers.d.ts.map