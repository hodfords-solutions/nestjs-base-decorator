import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { fileUploadFilter } from '../filters/file-upload.filter';
import { MulterOptionsType } from '../types/multer-options.type';
import {
    ALLOWED_FILE_UPLOAD_MIME_TYPES,
    FILE_UPLOAD_DESTINATION,
    FILE_UPLOAD_MAX_SIZE,
    FILES_UPLOAD_MAXIMUM
} from '../constants/upload-file.constant';
import { FileUploadOptionsType } from '../types/file-upload-options.type';
import { FileUploadConfigurationsType } from '../types/file-upload-configurations.type';

export function fileNameGenerator(
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, fileName: string) => void
): void {
    const fileExtName = extname(file.originalname);
    callback(null, `${uuidv4()}${fileExtName}`);
}

export function getMulterOptions(params: MulterOptionsType): MulterOptions {
    const {
        fileSize = FILE_UPLOAD_MAX_SIZE,
        allowedMimeTypes = ALLOWED_FILE_UPLOAD_MIME_TYPES,
        storageEngine
    } = params;
    const storage = storageEngine
        ? storageEngine
        : diskStorage({
              destination: FILE_UPLOAD_DESTINATION,
              filename: fileNameGenerator
          });

    return {
        limits: { fileSize },
        storage,
        fileFilter: (
            req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, acceptFile: boolean) => void
        ) => fileUploadFilter(req, file, allowedMimeTypes, callback)
    };
}

export function getFileUploadConfigurations(options: FileUploadOptionsType): FileUploadConfigurationsType {
    const maxCount = options?.maxCount || FILES_UPLOAD_MAXIMUM;
    const multerOptions = getMulterOptions({
        fileSize: options?.fileSize || FILE_UPLOAD_MAX_SIZE,
        allowedMimeTypes: options?.allowedMimeTypes || ALLOWED_FILE_UPLOAD_MIME_TYPES,
        storageEngine: options?.storageEngine
    });

    return {
        maxCount,
        multerOptions
    };
}
