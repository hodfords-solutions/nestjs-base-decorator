import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { getFileUploadConfigurations } from '../helpers/file.helper';
import { RequireToUploadFilesInterceptor } from '../interceptors/require-upload-files-interceptor';
import { FilesUploadParamsType } from '../types/files-upload-params.type';

export function RequireToUploadFiles({ fieldNames, options }: FilesUploadParamsType) {
    const { maxCount: defaultMaxCount, multerOptions } = getFileUploadConfigurations(options || {});
    const uploadFields = fieldNames.map(({ name, maxCount }) => {
        return {
            name,
            maxCount: maxCount && maxCount > 0 ? maxCount : defaultMaxCount
        };
    });

    const names = uploadFields.map(({ name }) => name);
    return applyDecorators(
        SetMetadata('fieldNames', names),
        UseInterceptors(FileFieldsInterceptor(uploadFields, multerOptions)),
        UseInterceptors(RequireToUploadFilesInterceptor)
    );
}
