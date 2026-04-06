export declare function findLeadershipGroupBySlugParam(slug: string): Promise<(import("mongoose").Document<unknown, {}, {
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    isActive: boolean;
    slug: "bot" | "nec" | "state-executives" | "directorate";
    order: number;
    description?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
//# sourceMappingURL=leadershipGroupSlug.d.ts.map