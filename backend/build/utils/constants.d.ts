import type { SignOptions } from 'jsonwebtoken';
export declare const PORT: number;
export declare const MONGO_URL: string;
export declare const TOKEN_SECRET: string;
export declare const TOKEN_EXPIRY: SignOptions['expiresIn'];
export declare const ADMIN_TOKEN_EXPIRY: SignOptions['expiresIn'];
export declare const STATIC_BASE_URL: string;
export declare const NIGERIAN_STATES: readonly ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"];
export type NigerianState = typeof NIGERIAN_STATES[number];
export declare const UPLOAD_FOLDERS: {
    readonly MEMBERS: "members";
    readonly EVENTS: "events";
    readonly GALLERY: "gallery";
    readonly AWARDS: "awards";
    readonly LEADERSHIP: "leadership";
    readonly ID_CARD_PHOTOS: "id-card-photos";
    readonly ID_CARDS: "id-cards";
    readonly INVOICES: "invoices";
    readonly TICKETS: "tickets";
    readonly TEMP: "temp";
};
//# sourceMappingURL=constants.d.ts.map