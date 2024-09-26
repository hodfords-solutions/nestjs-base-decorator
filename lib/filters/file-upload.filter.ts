import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

function isValidFileType(file: Express.Multer.File, allowedMimeTypes: string[]): boolean {
    const splitFileName = file.originalname.split('.');

    return splitFileName.length >= 2 && allowedMimeTypes.includes(file.mimetype);
}

function isValidUploadMultipleFiles(files: Array<Express.Multer.File>, allowedMimeTypes: string[]): boolean {
    return !!files.length && files.every((file) => isValidFileType(file, allowedMimeTypes));
}

export function fileUploadFilter(
    req: Request,
    attachment: Express.Multer.File | Array<Express.Multer.File>,
    allowedMimeTypes: string[],
    callback: (error: Error | null, acceptFile: boolean) => void
) {
    const attachments = Array.isArray(attachment) ? attachment : [attachment];
    if (!isValidUploadMultipleFiles(attachments, allowedMimeTypes)) {
        callback(new BadRequestException({ translate: 'error.invalid_file_format' }), false);
    }

    callback(null, true);
}
