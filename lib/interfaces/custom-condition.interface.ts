import { ColumnTypes } from '../types/column-type.type.js';

export interface CustomCondition {
    value: ((...args: any[]) => ColumnTypes) | ColumnTypes;
    exclude?: boolean;
    column: string;
}
