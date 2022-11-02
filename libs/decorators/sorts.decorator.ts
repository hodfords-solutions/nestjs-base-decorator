import { ApiQuery } from '@nestjs/swagger';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SortDirection } from '../types/sort-direction.type';
import { getAllowedFieldsEnums, validateDirection, validateField } from '../helpers/sort.helper';
import { SortsParamsType } from '../types/sorts-params.type';

export function Sorts(sortParams: SortsParamsType): any {
    return (target: any, key: string, descriptor: any) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
        if (propertyDescriptor) {
            ApiQuery({
                description: `Available values: ${getAllowedFieldsEnums(sortParams)}`,
                example: 'field1,field2:[ ASC(default) | DESC ],...',
                name: 'sortFields',
                schema: {
                    default:
                        `${sortParams?.default?.sortField}:${sortParams?.default?.sortDirection || 'DESC'}` ||
                        'createdAt:DESC',
                    type: 'string'
                },
                required: false
            })(target, key, propertyDescriptor);
        }
        return sortDecorator(sortParams)(target, key, descriptor);
    };
}

const sortDecorator = createParamDecorator(
    (sortParams: SortsParamsType, ctx: ExecutionContext): SortMultipleParams[] => {
        const request = ctx.switchToHttp().getRequest();

        if (!sortParams) {
            sortParams = { sortFields: 'sortFields' };
        }
        if (!sortParams.sortFields) {
            sortParams.sortFields = 'sortFields';
        }

        const fields: string = request.query[sortParams.sortFields] ? request.query[sortParams.sortFields].trim() : '';

        const sortFields =
            fields || `${sortParams?.default?.sortField}:${sortParams?.default?.sortDirection}` || 'createdAt:DESC';
        return sortFields
            .split(',')
            .filter((sort) => sort)
            .map((sort: string) => {
                const sortArr: string[] = sort.split(':', 2);
                let sortOrder: SortMultipleParams = {
                    field: sortArr[0].trim(),
                    direction: ((sortArr[1] ? sortArr[1].toUpperCase() : undefined) as any) || 'ASC'
                };
                validateField(getAllowedFieldsEnums(sortParams), sortOrder.field, true);
                validateDirection(sortOrder.direction);

                return sortOrder;
            });
    }
);

export type SortMultipleParams = {
    field: string;
    direction: SortDirection;
};
