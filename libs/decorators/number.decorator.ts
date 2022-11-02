import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UuidException } from '@hodfords/nestjs-exception';

export const Int = createParamDecorator((key: string, ctx: ExecutionContext) => {
    if (!key) {
        key = 'id';
    }
    const request = ctx.switchToHttp().getRequest();
    const id = request.params[key] || request.query[key];

    const value = parseInt(id);
    if (isNaN(value)) {
        throw new UuidException(key);
    }
    return value;
});

export const Ints = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ids = request.query[key || 'ids'];

    if (!ids) {
        return [];
    }

    return ids.split(',').map((id: string) => {
        const value = parseInt(id);
        if (isNaN(value)) {
            throw new UuidException(key);
        }
        return value;
    });
});
