import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const Pagination = createParamDecorator(
    (paginationParams: PaginationInputParams | undefined, ctx: ExecutionContext) => {
        if (!paginationParams) {
            paginationParams = {
                page: 'page',
                perPage: 'perPage'
            };
        }
        if (!paginationParams.page) {
            paginationParams.page = 'page';
        }
        if (!paginationParams.perPage) {
            paginationParams.perPage = 'perPage';
        }

        const request = ctx.switchToHttp().getRequest();
        const defaultPerPage = 10;
        const maxPerPage = 1000;

        return {
            page: Math.max(request.query[paginationParams.page], 1) || 1,
            perPage: Math.min(request.query[paginationParams.perPage] || defaultPerPage, maxPerPage) || defaultPerPage
        };
    },
    [
        (target: any, key: string | symbol) => {
            const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
            if (propertyDescriptor) {
                ApiQuery({
                    name: 'page',
                    schema: { default: 1, type: 'number', minimum: 1 },
                    required: false
                })(target, key, propertyDescriptor);
                ApiQuery({
                    name: 'perPage',
                    schema: { default: 10, type: 'number', minimum: 1, maximum: 1000 },
                    required: false
                })(target, key, propertyDescriptor);
            }
        }
    ]
);

export interface PaginationParams {
    page: number;
    perPage: number;
}

export interface PaginationInputParams {
    page?: string;
    perPage?: string;
}
