import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';
import { FileUploadOptionsType } from './file-upload-options.type.js';

export type FilesUploadParamsType = {
    fieldNames: MulterField[];
    options?: FileUploadOptionsType;
};
