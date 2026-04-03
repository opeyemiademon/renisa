import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_FOLDERS } from './constants.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ensureUploadDirs = (): void => {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  Object.values(UPLOAD_FOLDERS).forEach(folder => {
    const dir = path.join(UPLOAD_DIR, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
};

export const ensureDirectoriesExist = (customDir?: string): void => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  if (customDir) {
    const fullCustomDir = path.join(UPLOAD_DIR, customDir);
    if (!fs.existsSync(fullCustomDir)) {
      fs.mkdirSync(fullCustomDir, { recursive: true });
    }
  }
};

/**
 * Process and save a base64 file upload
 * @param base64Data The base64 encoded file data
 * @param uploadDir The directory to upload to (relative to uploads/)
 * @param allowedTypes Array of allowed MIME types
 * @param filePrefix Optional prefix for the filename
 * @returns The filename of the saved file
 */
export const processBase64Upload = async (
  base64Data: string,
  uploadDir: string,
  allowedTypes: string[],
  filePrefix?: string
): Promise<string> => {
  ensureDirectoriesExist(uploadDir);
  
  try {
    const mimeTypeMatch = base64Data.match(/^data:([^;]+);base64,/);
    if (!mimeTypeMatch) {
      throw new Error('Invalid base64 data format');
    }
    
    const mimeType = mimeTypeMatch[1];
    
    if (!allowedTypes.includes(mimeType)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    let extension = '';
    switch (mimeType) {
      case 'image/jpeg':
        extension = '.jpg';
        break;
      case 'image/png':
        extension = '.png';
        break;
      case 'image/gif':
        extension = '.gif';
        break;
      case 'image/webp':
        extension = '.webp';
        break;
      default:
        extension = '.bin';
    }
    
    const fileId = uuidv4();
    const fileName = filePrefix ? `${filePrefix}-${fileId}${extension}` : `${fileId}${extension}`;
    
    const uploadPath = path.join(UPLOAD_DIR, uploadDir);
    const filePath = path.join(uploadPath, fileName);
    
    const base64Content = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Content, 'base64');
    
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    fs.writeFileSync(filePath, buffer);
    
    return fileName;
    
  } catch (error) {
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = (req.query.folder as string) || UPLOAD_FOLDERS.TEMP;
    const dest = path.join(UPLOAD_DIR, folder);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP and PDF files are allowed'));
  }
};

const maxSizeMB = Number(process.env.UPLOAD_MAX_SIZE_MB) || 10;

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSizeMB * 1024 * 1024 },
});

export default upload;
