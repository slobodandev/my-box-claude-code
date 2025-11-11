import fs from 'fs';
import path from 'path';

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  path: string;
}

export interface SharedLink {
  id: string;
  token: string;
  files: FileInfo[];
  createdAt: string;
  email?: string;
}

class Storage {
  private dataFile: string;
  private uploadsDir: string;
  private data: {
    links: SharedLink[];
  };

  constructor() {
    this.dataFile = path.join(__dirname, '../../data.json');
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.ensureDirectories();
    this.loadData();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private loadData() {
    if (fs.existsSync(this.dataFile)) {
      const rawData = fs.readFileSync(this.dataFile, 'utf-8');
      this.data = JSON.parse(rawData);
    } else {
      this.data = { links: [] };
      this.saveData();
    }
  }

  private saveData() {
    fs.writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2));
  }

  createLink(email?: string): SharedLink {
    const token = this.generateToken();
    const link: SharedLink = {
      id: token,
      token,
      files: [],
      createdAt: new Date().toISOString(),
      email
    };
    this.data.links.push(link);
    this.saveData();
    return link;
  }

  getLink(token: string): SharedLink | undefined {
    return this.data.links.find(link => link.token === token);
  }

  addFileToLink(token: string, fileInfo: FileInfo): boolean {
    const link = this.getLink(token);
    if (!link) return false;

    link.files.push(fileInfo);
    this.saveData();
    return true;
  }

  deleteFileFromLink(token: string, fileId: string): boolean {
    const link = this.getLink(token);
    if (!link) return false;

    const fileIndex = link.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return false;

    const file = link.files[fileIndex];

    // Delete physical file
    const filePath = path.join(this.uploadsDir, file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    link.files.splice(fileIndex, 1);
    this.saveData();
    return true;
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  getUploadsDir(): string {
    return this.uploadsDir;
  }
}

export default new Storage();
