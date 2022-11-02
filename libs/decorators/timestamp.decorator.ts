import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import moment from 'moment';
import { ValidateFieldException } from '@hodfords/nestjs-exception';
import { getParamOptions, ParamOptions } from '../helpers/get-params.helper';

export const Timestamp = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    const paramOptions = getParamOptions(options);
    const request = ctx.switchToHttp().getRequest();
    const timestamp = request.params[paramOptions.key] || request.query[paramOptions.key];

    if (!timestamp && paramOptions.nullable) {
        return timestamp;
    }
    if (!moment.unix(timestamp).isValid()) {
        throw new ValidateFieldException(paramOptions.key, 'invalid_timestamp', 'invalidTimestamp');
    }

    return timestamp;
});
