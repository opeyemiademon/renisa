import { Router } from 'express';
import upload from '../middleware/upload.js';
import { getAuthContext } from '../middleware/auth.js';
import path from 'path';

const router = Router();

router.post('/', (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization || '';
  getAuthContext(authHeader)
    .then(ctx => {
      if (!ctx.isAuthenticated) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      next();
    })
    .catch(() => res.status(401).json({ success: false, message: 'Invalid or expired token' }));
}, upload.single('file'), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const folder = (req.query.folder as string) || 'temp';
  const filename = req.file.filename;
  const url = `/uploads/${folder}/${filename}`;
  return res.json({ success: true, url, filename });
});

export default router;
