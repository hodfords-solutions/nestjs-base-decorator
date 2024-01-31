import { Payload } from '@nestjs/microservices';

export function Value(): ParameterDecorator {
    return (target: any, key: string | symbol, descriptor: any): void => {
        return Payload('value')(target, key, descriptor);
    };
}
