import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Storage from '../models/Storage';
import {
  uploadFile,
  getFiles,
  deleteFile,
  downloadFile
} from '../controllers/fileController';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Storage.getUploadsDir());
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Routes
router.post('/:token/upload', upload.single('file'), uploadFile);
router.get('/:token/files', getFiles);
router.delete('/:token/files/:fileId', deleteFile);
router.get('/:token/files/:fileId/download', downloadFile);

export default router;
