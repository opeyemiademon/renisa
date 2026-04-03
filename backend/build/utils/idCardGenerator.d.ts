interface MemberData {
    memberNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    sport?: string;
    state?: string;
    membershipYear?: number;
    profilePicture?: string;
    validUntil?: string;
}
interface IDCardResult {
    frontPath: string;
    backPath: string;
}
export declare const generateIDCard: (memberData: MemberData, outputDir: string) => Promise<IDCardResult>;
export {};
//# sourceMappingURL=idCardGenerator.d.ts.map