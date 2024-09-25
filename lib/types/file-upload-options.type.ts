import { StorageEngine } from 'multer';

export type FileUploadOptionsType = {
    maxCount?: number;
    fileSize?: number;
    allowedMimeTypes?: string[];
    storageEngine?: StorageEngine;
};
