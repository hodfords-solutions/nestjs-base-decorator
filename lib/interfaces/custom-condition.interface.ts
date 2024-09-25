import { ColumnTypes } from '../types/column-type.type';

export interface CustomCondition {
    value: ((...args: any[]) => ColumnTypes) | ColumnTypes;
    exclude?: boolean;
    column: string;
}
