import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

const queryBooleanDecorator = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.query[key] === 'true';
});

export function QueryBoolean(key: string, options: ApiQueryOptions = {}) {
    return (target: any, property: string, descriptor: any) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, property);
        if (propertyDescriptor) {
            ApiQuery({
                name: key,
                required: false,
                type: Boolean,
                ...options
            })(target, property, propertyDescriptor);
        }
        return queryBooleanDecorator(key)(target, property, descriptor);
    };
}
