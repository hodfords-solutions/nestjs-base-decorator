import { getDataSource } from '@hodfords/typeorm-helper';
import { DataSource } from 'typeorm';

export function requireDataSource(dataSourceName?: string): DataSource {
    const dataSource = getDataSource(dataSourceName);
    if (!dataSource) {
        throw new Error('No data source has been registered. Make sure the TypeORM data source is initialized.');
    }

    return dataSource;
}
