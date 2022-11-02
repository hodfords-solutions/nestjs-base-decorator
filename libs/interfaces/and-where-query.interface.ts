import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { Brackets } from 'typeorm/query-builder/Brackets';

export interface AndWhereQuery {
    query: string | Brackets | ((qb: this) => string) | ObjectLiteral | ObjectLiteral[];
    parameters?: ObjectLiteral;
}
