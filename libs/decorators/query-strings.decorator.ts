import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

const queryStringsDecorator = createParamDecorator((key: string, ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.query[key];
    if (value !== null && value !== undefined && typeof value === 'string') {
        return [...new Set(value.split(','))];
    }
    return [];
});

export function QueryStrings(key: string, options: ApiQueryOptions = {}) {
    return (target: any, property: string, descriptor: any) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, property);
        if (propertyDescriptor) {
            ApiQuery({
                name: key,
                required: false,
                type: Boolean,
                example: `?value=value1,value2`,
                ...options
            })(target, property, propertyDescriptor);
        }
        return queryStringsDecorator(key)(target, property, descriptor);
    };
}
