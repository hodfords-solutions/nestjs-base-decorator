import { ValidateException } from '@hodfords/nestjs-exception';
import { SortDirection } from '../types/sort-direction.type';
import { SortParamsType } from '../types/sort-params.type';

function getDefaultSortFields(sortParams: SortParamsType): string[] {
    const defaultSortField = sortParams?.default?.sortField;
    return defaultSortField ? [defaultSortField] : ['createdAt'];
}

export function getAllowedFieldsEnums(sortParams: SortParamsType): string[] {
    const defaultSortFieldEnums = getDefaultSortFields(sortParams);
    const allowedFields = sortParams?.allowedFields || [];

    return [...defaultSortFieldEnums, ...allowedFields];
}

export function validateDirection(direction: SortDirection): void {
    if (!['ASC', 'DESC'].includes(direction)) {
        throw new ValidateException([
            {
                property: 'sortDirection',
                constraints: {
                    invalidDirection: { message: 'The sort direction is invalid.', detail: { direction } }
                }
            }
        ]);
    }
}

export function validateField(allowedFields: string[], field: string, isSortMultiple: boolean = false) {
    if (!allowedFields.includes(field)) {
        throw new ValidateException([
            {
                property: `sortField${isSortMultiple ? 's' : ''}`,
                constraints: {
                    invalidField: { message: 'The sort field is invalid.', detail: { field } }
                }
            }
        ]);
    }
}
