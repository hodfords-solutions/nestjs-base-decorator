import { FileUploadOptionsType } from './file-upload-options.type.js';

export type MulterOptionsType = Pick<FileUploadOptionsType, 'fileSize' | 'allowedMimeTypes' | 'storageEngine'>;
