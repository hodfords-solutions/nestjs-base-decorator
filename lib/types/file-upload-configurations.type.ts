import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';

export type FileUploadConfigurationsType = {
    maxCount: number;
    multerOptions: MulterOptions;
};
