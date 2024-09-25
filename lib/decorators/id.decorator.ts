import { UuidException } from '@hodfords/nestjs-exception';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { validate } from 'uuid';
import { getParamOptions, ParamOptions } from '../helpers/get-params.helper';

export const Id = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    const paramOptions = getParamOptions(options, 'id');
    const request = ctx.switchToHttp().getRequest();
    const id = request.params[paramOptions.key] || request.query[paramOptions.key];
    if (!id && paramOptions.nullable) {
        return id;
    }
    if (!validate(id)) {
        throw new UuidException(paramOptions.key);
    }
    return id;
});

export const Ids = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    const paramOptions = getParamOptions(options, 'ids');
    const request = ctx.switchToHttp().getRequest();
    const ids = request.query[paramOptions.key];
    if (!ids) {
        return [];
    }
    return ids
        .split(',')
        .map((id: string) => {
            if (!id && paramOptions.nullable) {
                return id;
            }
            if (!validate(id)) {
                throw new UuidException(paramOptions.key);
            }
            return id;
        })
        .filter((id: string) => id);
});
