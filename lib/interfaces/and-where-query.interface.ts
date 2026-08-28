import { Brackets, ObjectLiteral } from 'typeorm';

export interface AndWhereQuery {
    query: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[];
    parameters?: ObjectLiteral;
}
