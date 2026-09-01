import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { BaseEntity } from 'typeorm';
import { requireDataSource } from '../helpers/data-source.helper.js';
import { uniq } from 'es-toolkit';

@ValidatorConstraint({ async: true })
export class ExistIdsValidator implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        const data = args.constraints[0];
        const allowEmpty = data.allowEmpty;

        if (!value?.length && !allowEmpty) {
            return false;
        }

        if (!value?.length && allowEmpty) {
            return true;
        }

        const result = await requireDataSource()
            .createQueryBuilder()
            .from(data.table, data.table.name)
            .select('id')
            .where(` "${data.column}" IN (:...value)`, { value })
            .getRawMany();

        return result.length === uniq(value).length;
    }
}

export function ExistIds(
    table: { new (): BaseEntity },
    allowEmpty: boolean = false,
    validationOptions?: ValidationOptions
) {
    validationOptions = { ...validationOptions, each: false, message: 'each value in $property does not exist.' };

    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [
                {
                    table,
                    column: 'id',
                    allowEmpty
                }
            ],
            validator: ExistIdsValidator
        });
    };
}
