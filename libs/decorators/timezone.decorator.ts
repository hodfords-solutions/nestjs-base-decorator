import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import momentTimezone from 'moment-timezone';
import { getParamOptions, ParamOptions } from '../helpers/get-params.helper';

export const Timezone = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    const paramOptions = getParamOptions(options);
    const request = ctx.switchToHttp().getRequest();
    const timezone = request.params[paramOptions.key] || request.query[paramOptions.key];
    if (!timezone && paramOptions.nullable) {
        return timezone;
    }
    if (!momentTimezone.tz.zone(timezone)) {
        throw new BadRequestException({ translate: 'error.invalid_timezone' });
    }

    return timezone;
});
