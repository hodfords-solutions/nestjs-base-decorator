import { ValidateFieldException } from '@hodfords/nestjs-exception';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { getParamOptions, ParamOptions } from '../helpers/get-params.helper';

type EnumsParamOptions = ParamOptions & {
    enum: SwaggerEnumType;
    separator?: string;
    description?: string;
    singleValue?: boolean;
    example?: string;
};

const enumsDecorator = createParamDecorator((options: EnumsParamOptions, ctx: ExecutionContext) => {
    const paramOptions = getParamOptions(options, 'id');
    const request = ctx.switchToHttp().getRequest();
    const { separator = ',' } = options;

    const values: string[] = (request.params[paramOptions.key] || request.query[paramOptions.key])?.split(separator);
    if (!values && paramOptions.nullable) {
        return values;
    }

    const enumValues = Object.values(options.enum).map((item) => String(item));
    if (options.singleValue) {
        if ((!values?.at(0) && !paramOptions.nullable) || (values?.at(0) && !enumValues.includes(values[0]))) {
            throw new ValidateFieldException(options.key, 'invalid_enum_value', 'invalidEnum');
        }

        return values[0];
    }

    const hasMismatched = values.some((item) => !enumValues.includes(item));
    if (hasMismatched) {
        throw new ValidateFieldException(options.key, 'invalid_enum_value', 'invalidEnum');
    }

    return values;
});

export function EnumQuery(options: EnumsParamOptions) {
    return (target: any, key: string, descriptor: any) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
        if (propertyDescriptor) {
            ApiQuery({
                description: options.description,
                name: options.key,
                enum: options.enum,
                required: !options.nullable
            })(target, key, propertyDescriptor);
        }
        return enumsDecorator({ ...options, singleValue: true })(target, key, descriptor);
    };
}

export function EnumsQuery(options: EnumsParamOptions) {
    return (target: any, key: string, descriptor: any) => {
        const enumKeys = Object.keys(options.enum).filter((item) => isNaN(+item));
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
        if (propertyDescriptor) {
            ApiQuery({
                description: options.description || `Available enums: ${enumKeys}`,
                example: options.example || 'value1,value2,...',
                name: options.key,
                required: !options.nullable
            })(target, key, propertyDescriptor);
        }
        return enumsDecorator(options)(target, key, descriptor);
    };
}
