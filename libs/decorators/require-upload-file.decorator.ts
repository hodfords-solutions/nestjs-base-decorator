import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { getFileUploadConfigurations } from '../helpers/file.helper';
import { RequireToUploadFileInterceptor } from '../interceptors/require-upload-file-interceptor';
import { RequireToUploadFilesInterceptor } from '../interceptors/require-upload-files-interceptor';
import { FileUploadParamsType } from '../types/file-upload-params.type';

export function RequireToUploadFile({ fieldName, options }: FileUploadParamsType) {
    const { maxCount, multerOptions } = getFileUploadConfigurations(options || {});
    const isArray = maxCount > 1;

    if (isArray) {
        return applyDecorators(
            UseInterceptors(FilesInterceptor(fieldName, maxCount, multerOptions)),
            UseInterceptors(RequireToUploadFilesInterceptor)
        );
    } else {
        return applyDecorators(
            UseInterceptors(FileInterceptor(fieldName, multerOptions)),
            UseInterceptors(RequireToUploadFileInterceptor)
        );
    }
}
