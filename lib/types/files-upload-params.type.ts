import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileUploadOptionsType } from './file-upload-options.type';

export type FilesUploadParamsType = {
    fieldNames: MulterField[];
    options?: FileUploadOptionsType;
};
