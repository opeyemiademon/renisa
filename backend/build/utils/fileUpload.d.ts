import multer from 'multer';
export declare const ALLOWED_IMAGE_TYPES: string[];
export declare const MAX_FILE_SIZE: number;
export declare const ensureUploadDirs: () => void;
export declare const ensureDirectoriesExist: (customDir?: string) => void;
/**
 * Process and save a base64 file upload
 * @param base64Data The base64 encoded file data
 * @param uploadDir The directory to upload to (relative to uploads/)
 * @param allowedTypes Array of allowed MIME types
 * @param filePrefix Optional prefix for the filename
 * @returns The filename of the saved file
 */
export declare const processBase64Upload: (base64Data: string, uploadDir: string, allowedTypes: string[], filePrefix?: string) => Promise<string>;
export declare const upload: multer.Multer;
export default upload;
//# sourceMappingURL=fileUpload.d.ts.map