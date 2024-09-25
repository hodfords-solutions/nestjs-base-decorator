import { Controller, Get, Post, UploadedFiles } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
    EnumQuery,
    EnumsQuery,
    Id,
    Ids,
    Int,
    Ints,
    Pagination,
    PaginationParams,
    QueryStrings,
    RealIp,
    RequireToUploadFile,
    RequireToUploadFiles,
    Sort,
    SortMultipleParams,
    SortParams,
    Sorts,
    Timestamp,
    Timezone,
    UserAgent
} from 'lib';
import { CategoryEnum, StatusEnum } from './app.enum';

@Controller()
export class AppController {
    @Get('enum-query')
    getEnumQuery(
        @EnumQuery({
            key: 'status',
            enum: StatusEnum,
            description: 'Status of the item',
            nullable: false
        })
        status: StatusEnum
    ) {
        return status;
    }

    @Get('enums-query')
    getEnumsQuery(
        @EnumsQuery({
            key: 'categories',
            enum: CategoryEnum,
            description: 'Categories of the product',
            separator: ',',
            nullable: false
        })
        categories: CategoryEnum[]
    ): CategoryEnum[] {
        return categories;
    }

    @Get('id/:id')
    @ApiParam({
        name: 'id',
        type: String
    })
    getId(@Id() id: string): string {
        return id;
    }

    @Get('ids')
    @ApiQuery({
        name: 'ids',
        type: String
    })
    getIds(@Ids() ids: string[]): string[] {
        return ids;
    }

    @Get('int/:id')
    @ApiParam({
        name: 'id',
        type: Number
    })
    getInt(@Int() id: number): number {
        return id;
    }

    @Get('ints')
    @ApiQuery({
        name: 'ids',
        type: String
    })
    getInts(@Ints() ids: number[]): number[] {
        return ids;
    }

    @Get('pagination')
    getPagination(@Pagination() pagination: PaginationParams): PaginationParams {
        return pagination;
    }

    @Get('query-strings')
    getQueryStrings(@QueryStrings('tags') tags: string[]): string[] {
        return tags;
    }

    @Get('ip')
    getClientIp(@RealIp() ip: string): string {
        return ip;
    }

    @Post('upload')
    @RequireToUploadFile({ fieldName: 'file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        required: true,
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    uploadFile(@UploadedFiles() file: Express.Multer.File[]): Express.Multer.File[] {
        return file;
    }

    @Post('uploads')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        required: true,
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                profile: {
                    type: 'string',
                    format: 'binary'
                },
                documents: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @RequireToUploadFiles({
        fieldNames: [
            { name: 'profile', maxCount: 1 },
            { name: 'documents', maxCount: 5 }
        ]
    })
    uploadUserFiles(@UploadedFiles() files: { profile: Express.Multer.File[]; documents: Express.Multer.File[] }) {
        return files;
    }

    @Get('sort')
    getSort(
        @Sort({ allowedFields: ['name', 'createdAt'], default: { sortField: 'createdAt', sortDirection: 'DESC' } })
        query: SortParams
    ): SortParams {
        return query;
    }

    @Get('sorts')
    getUsers(
        @Sorts({ allowedFields: ['name', 'createdAt'], default: { sortField: 'createdAt', sortDirection: 'DESC' } })
        query: SortMultipleParams[]
    ): SortMultipleParams[] {
        return query;
    }

    @Get('timestamp')
    @ApiQuery({
        name: 'timestamp',
        type: Number
    })
    getEvents(@Timestamp('timestamp') timestamp: number): number {
        return timestamp;
    }

    @Get('timezone')
    @ApiQuery({
        name: 'timezone',
        type: String
    })
    getTimezone(@Timezone('timezone') timezone: string): string {
        return timezone;
    }

    @Get('user-agent')
    getUserAgent(@UserAgent() userAgent: string): string {
        return userAgent;
    }
}
