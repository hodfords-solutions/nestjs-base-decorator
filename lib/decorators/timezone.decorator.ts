import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getParamOptions, ParamOptions } from '../helpers/get-params.helper';

dayjs.extend(utc);
dayjs.extend(timezone);

export const Timezone = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    const paramOptions = getParamOptions(options);
    const request = ctx.switchToHttp().getRequest();
    const timezone = request.params[paramOptions.key] || request.query[paramOptions.key];
    if (!timezone && paramOptions.nullable) {
        return timezone;
    }

    try {
        const dayjsLocal = dayjs(new Date());
        if (dayjsLocal.tz(timezone)) {
            return timezone;
        }
        throw new BadRequestException({ translate: 'error.invalid_timezone' });
    } catch {
        throw new BadRequestException({ translate: 'error.invalid_timezone' });
    }
});
