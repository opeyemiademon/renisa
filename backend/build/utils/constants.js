import dotenv from 'dotenv';
dotenv.config();
const normalizeExpiresIn = (value) => {
    if (typeof value === 'number')
        return value;
    if (!value)
        return '7d';
    if (/^\d+$/.test(value))
        return Number(value);
    return value;
};
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const MONGO_URL = process.env.MONGO_URL || '';
export const TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'renisa-secret-key';
export const TOKEN_EXPIRY = normalizeExpiresIn(process.env.TOKEN_EXPIRY);
export const ADMIN_TOKEN_EXPIRY = normalizeExpiresIn(process.env.ADMIN_TOKEN_EXPIRY || '24h');
export const STATIC_BASE_URL = process.env.STATIC_BASE_URL || 'http://localhost:4000';
export const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];
export const UPLOAD_FOLDERS = {
    MEMBERS: 'members',
    EVENTS: 'events',
    GALLERY: 'gallery',
    AWARDS: 'awards',
    LEADERSHIP: 'leadership',
    ID_CARD_PHOTOS: 'id-card-photos',
    ID_CARDS: 'id-cards',
    INVOICES: 'invoices',
    TICKETS: 'tickets',
    TEMP: 'temp',
};
//# sourceMappingURL=constants.js.map