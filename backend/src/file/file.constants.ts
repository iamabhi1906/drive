export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const STORAGE_DIRECTORY = 'public/uploads';
export const STORAGE_PATH_PREFIX = 'uploads';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/zip',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/csv',
  'text/plain',
] as const;
