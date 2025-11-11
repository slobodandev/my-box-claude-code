import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Storage, { FileInfo } from '../models/Storage';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const link = Storage.getLink(token);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const fileInfo: FileInfo = {
      id: uuidv4(),
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date().toISOString(),
      path: file.filename
    };

    Storage.addFileToLink(token, fileInfo);

    res.json({ message: 'File uploaded successfully', file: fileInfo });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const link = Storage.getLink(token);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ files: link.files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { token, fileId } = req.params;

    const success = Storage.deleteFileFromLink(token, fileId);
    if (!success) {
      return res.status(404).json({ error: 'File or link not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { token, fileId } = req.params;
    const link = Storage.getLink(token);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const file = link.files.find(f => f.id === fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = `${Storage.getUploadsDir()}/${file.path}`;
    res.download(filePath, file.name);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};
