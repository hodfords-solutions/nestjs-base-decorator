import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnprocessableEntityException
} from '@nestjs/common';

@Injectable()
export class RequireToUploadFileInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest();

        if (!request.file) {
            throw new UnprocessableEntityException({ translate: 'error.file_is_required' });
        }

        return next.handle();
    }
}
