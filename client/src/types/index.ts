export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  path: string;
}

export interface LinkInfo {
  token: string;
  url?: string;
  createdAt: string;
  filesCount?: number;
}
