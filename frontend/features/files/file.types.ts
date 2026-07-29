export type FileTag = {
  id: number;
  name: string;
};

export type DriveFile = {
  id: number;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  createdAt: string;
  updatedAt: string;
  tags: FileTag[];
};

export type FileListResponse = {
  files: DriveFile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
