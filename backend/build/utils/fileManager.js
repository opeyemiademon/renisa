import fs from 'fs';
import path from 'path';
import { STATIC_BASE_URL } from './constants.js';
export const deleteFile = (filepath) => {
    try {
        const fullPath = filepath.startsWith('/')
            ? path.join(process.cwd(), filepath.replace(/^\//, ''))
            : path.join(process.cwd(), filepath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
    catch (err) {
        console.error('Error deleting file:', err);
    }
};
export const getPublicUrl = (relativePath) => {
    if (!relativePath)
        return '';
    const normalized = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${STATIC_BASE_URL}${normalized}`;
};
//# sourceMappingURL=fileManager.js.map