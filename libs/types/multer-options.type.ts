import { FileUploadOptionsType } from './file-upload-options.type';

export type MulterOptionsType = Pick<FileUploadOptionsType, 'fileSize' | 'allowedMimeTypes' | 'storageEngine'>;
