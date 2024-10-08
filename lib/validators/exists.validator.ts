import { getDataSource } from '@hodfords/typeorm-helper';
import { isFunction, isNil, isUndefined } from '@nestjs/common/utils/shared.utils';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { BaseEntity, SelectQueryBuilder } from 'typeorm';
import { AndWhereQuery } from '../interfaces/and-where-query.interface';
import { CustomCondition } from '../interfaces/custom-condition.interface';
import { ColumnTypes } from '../types/column-type.type';

// TODO Upgrade typeorm
@ValidatorConstraint({ async: true })
export class ExistsValidator implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        const body = args.object as any;
        const data = args.constraints[0];
        const customs = data.customs || [];
        const query = getDataSource().createQueryBuilder().from(data.table, data.table.name).select('id');
        if (data.caseInsensitive) {
            query.where(` "${data.column}" ILIKE :value`, { value });
        } else {
            query.where(` "${data.column}" = :value`, { value });
        }

        this.buildCustomQuery(query, body, customs);

        return !!(await query.limit(1).getRawOne());
    }

    private buildCustomQuery(query: SelectQueryBuilder<any>, body: any, customs: any[]) {
        for (const custom of customs) {
            const customValue: ColumnTypes = isFunction(custom.value) ? custom.value(body) : custom.value;
            const columnName = custom.column;

            if (custom.exclude) {
                const excludeQueryBuilder: AndWhereQuery = {
                    query: ` "${columnName}" != :${columnName}`,
                    parameters: {
                        [columnName]: customValue
                    }
                };

                if (isUndefined(customValue) || isNil(customValue)) {
                    excludeQueryBuilder.query = ` "${columnName}" IS NOT NULL`;
                    delete excludeQueryBuilder.parameters;
                }

                query.andWhere(excludeQueryBuilder.query, excludeQueryBuilder.parameters);
            } else {
                const queryBuilder: AndWhereQuery = {
                    query: ` "${columnName}" = :${columnName}`,
                    parameters: {
                        [columnName]: customValue
                    }
                };

                if (isUndefined(customValue) || isNil(customValue)) {
                    queryBuilder.query = ` "${columnName}" IS NULL`;
                    delete queryBuilder.parameters;
                }

                query.andWhere(queryBuilder.query, queryBuilder.parameters);
            }
        }
    }
}

export function Exists(
    table: { new (): BaseEntity },
    column: string,
    caseInsensitive: boolean = false,
    customs?: CustomCondition[],
    validationOptions?: ValidationOptions
) {
    const message = { message: 'The $property does not exist.' };
    if (validationOptions && validationOptions.each) {
        message.message = 'each value in $property does not exist.';
    }
    validationOptions = { ...message, ...validationOptions } as any;
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [
                {
                    table,
                    column,
                    caseInsensitive,
                    customs
                }
            ],
            validator: ExistsValidator
        });
    };
}
