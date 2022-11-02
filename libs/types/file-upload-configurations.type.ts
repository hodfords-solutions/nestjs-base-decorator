import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export type FileUploadConfigurationsType = {
    maxCount: number;
    multerOptions: MulterOptions;
};
