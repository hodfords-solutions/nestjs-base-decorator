import { ValidateFieldException } from '@hodfords/nestjs-exception';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import dayjs from 'dayjs';
import { getParamOptions, ParamOptions } from '../helpers/get-params.helper';

export const Timestamp = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    const paramOptions = getParamOptions(options);
    const request = ctx.switchToHttp().getRequest();
    const timestamp = request.params[paramOptions.key] || request.query[paramOptions.key];

    if (!timestamp && paramOptions.nullable) {
        return timestamp;
    }

    if (!dayjs.unix(timestamp).isValid()) {
        throw new ValidateFieldException(paramOptions.key, 'invalid_timestamp', 'invalidTimestamp');
    }

    return timestamp;
});
