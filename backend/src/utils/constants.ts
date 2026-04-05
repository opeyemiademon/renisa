import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config();

const normalizeExpiresIn = (value: string | number | undefined): SignOptions['expiresIn'] => {
  if (typeof value === 'number') return value;
  if (!value) return '7d';
  if (/^\d+$/.test(value)) return Number(value);
  return value as SignOptions['expiresIn'];
};

export const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;
export const MONGO_URL: string = process.env.MONGO_URL || '';
export const TOKEN_SECRET: string = process.env.TOKEN_SECRET ?? 'renisa-secret-key';
export const TOKEN_EXPIRY: SignOptions['expiresIn'] = normalizeExpiresIn(process.env.TOKEN_EXPIRY);
export const ADMIN_TOKEN_EXPIRY: SignOptions['expiresIn'] = normalizeExpiresIn(process.env.ADMIN_TOKEN_EXPIRY || '24h');
export const STATIC_BASE_URL: string = process.env.STATIC_BASE_URL || 'http://localhost:4000';

/** Public member site (Next.js) — used in password-reset emails */
export const MEMBER_PORTAL_URL: string =
  process.env.MEMBER_PORTAL_URL || process.env.FRONTEND_URL || 'http://localhost:3000';

export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa',
  'Benue','Borno','Cross River','Delta','Ebonyi','Edo',
  'Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara',
  'Lagos','Nasarawa','Niger','Ogun','Ondo','Osun',
  'Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'
] as const;

export type NigerianState = typeof NIGERIAN_STATES[number];

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
} as const;
