import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnprocessableEntityException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isObject } from 'lodash';

@Injectable()
export class RequireToUploadFilesInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const fieldNames = this.reflector.get<string[]>('fieldNames', context.getHandler());

        if (!request.files) {
            throw new UnprocessableEntityException({ translate: 'error.files_are_required' });
        }

        if (Array.isArray(request.files) && !request.files.length) {
            throw new UnprocessableEntityException({ translate: 'error.files_are_required' });
        }

        if (fieldNames && isObject(request.files) && !Array.isArray(request.files)) {
            for (const filedName of fieldNames) {
                if (!request.files[filedName]?.length) {
                    throw new UnprocessableEntityException({ translate: 'error.files_are_required' });
                }
            }
        }

        return next.handle();
    }
}
