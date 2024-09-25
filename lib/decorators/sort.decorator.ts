import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { getAllowedFieldsEnums, validateDirection, validateField } from '../helpers/sort.helper';
import { SortDirection } from '../types/sort-direction.type';
import { SortParamsType } from '../types/sort-params.type';

export function Sort(sortParams: SortParamsType): any {
    return (target: any, key: string, descriptor: any) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);

        if (propertyDescriptor) {
            ApiQuery({
                name: 'sortField',
                enum: getAllowedFieldsEnums(sortParams),
                schema: { default: sortParams?.default?.sortField || 'createdAt', type: 'string' },
                required: false
            })(target, key, propertyDescriptor);
            ApiQuery({
                name: 'sortDirection',
                schema: { default: 'DESC', type: 'string' },
                enum: ['ASC', 'DESC'],
                required: false
            })(target, key, propertyDescriptor);
        }
        return sortDecorator(sortParams)(target, key, descriptor);
    };
}

const sortDecorator = createParamDecorator((sortParams: SortParamsType, ctx: ExecutionContext): SortParams => {
    if (!sortParams) {
        sortParams = { sortField: 'sortField', sortDirection: 'sortDirection' };
    }
    if (!sortParams.sortField) {
        sortParams.sortField = 'sortField';
    }
    if (!sortParams.sortDirection) {
        sortParams.sortDirection = 'sortDirection';
    }

    const request = ctx.switchToHttp().getRequest();
    const sortField: string = request.query[sortParams.sortField] || sortParams?.default?.sortField || 'createdAt';
    const sortDirection = (
        request.query[sortParams.sortDirection] ||
        sortParams?.default?.sortDirection ||
        'DESC'
    ).toUpperCase();

    validateField(getAllowedFieldsEnums(sortParams), sortField);
    validateDirection(sortDirection);

    return {
        sortField,
        sortDirection
    };
});

export type SortParams = {
    sortField: string;
    sortDirection: SortDirection;
};
