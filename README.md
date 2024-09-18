<p align="center">
  <a href="http://opensource.hodfords.uk" target="blank"><img src="https://opensource.hodfords.uk/img/logo.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">
Nestjs-Base-Decorator provides a collection of useful, ready-to-use custom decorators for NestJS, designed to enhance and simplify common functionality in your applications. These decorators will help you write cleaner and more maintainable code, reducing the need for repetitive boilerplate.
</p>

## Installation 🤖

To begin using it, we first install the required dependencies.

```
npm install @hodfords/nestjs-base-decorator
```

## Table of Contents

- [Installation 🤖](#installation-)
- [Table of Contents](#table-of-contents)
- [Usage 🚀](#usage-)
  - [@EnumQuery()](#enumquery)
  - [@EnumsQuery()](#enumsquery)
  - [@Id()](#id)
  - [@Ids()](#ids)
  - [@Int()](#int)
  - [@Ints()](#ints)
  - [@Pagination()](#pagination)
  - [@QueryBoolean()](#queryboolean)
  - [@QueryStrings()](#querystrings)
  - [@RealIp()](#realip)
  - [@RequireToUploadFile()](#requiretouploadfile)
  - [@RequireToUploadFiles()](#requiretouploadfiles)
  - [@Sort()](#sort)
  - [@Sorts()](#sorts)
  - [@Timestamp()](#timestamp)
  - [@Timezone()](#timezone)
  - [@UserAgent()](#useragent)
  - [@Value()](#value)

## Usage 🚀

### @EnumQuery()

Use the `EnumQuery` decorator when you expect a single enum value as a query parameter. This will validate the query parameter against a predefined enum and generate Swagger documentation for it.

Parameters:

- `options`:
  - `key`: The name of the query parameter (required).
  - `enum`: The enum to validate against (required).
  - `separator`: The delimiter for multiple values (optional, default: `,`).
  - `description`: A description for Swagger documentation (optional).
  - `nullable`: If true, the query parameter is allowed to be `null` (optional, default: `false`).
  - `singleValue`: Only used internally for `EnumQuery` to indicate a single value (you don't need to set this manually).

Example for usage:

```typescript

import { Controller, Get } from '@nestjs/common';
import { EnumQuery } from '@hodfords/nestjs-base-decorator';

enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Controller()
export class ItemController {
  @Get('items')
  getItemByStatus(
    @EnumQuery({
      key: 'status',
      enum: StatusEnum,
      description: 'Status of the item',
      nullable: false,
    })
    status: StatusEnum,
  ) {
    return status;
  }
}

/*
  Request: GET /items?status=active
  Response: active
*/
```

### @EnumsQuery()

Use the `EnumsQuery` decorator when you expect multiple enum values as query parameters, separated by a custom delimiter (default is `,`). This will validate the query parameters against a predefined enum and generate Swagger documentation for them.

Parameters:

- `options`:

  - `key`: The name of the query parameter (required).
  - `enum`: The enum to validate against (required).
  - `separator`: The delimiter for multiple values (optional, default: `,`).
  - `description`: A description for Swagger documentation (optional).
  - `nullable`: If true, the query parameter is allowed to be `null` (optional, default: `false`).
  - `singleValue`: Only used internally for `EnumQuery` to indicate a single value (you don't need to set this manually).

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { EnumsQuery } from '@hodfords/nestjs-base-decorator';

enum CategoryEnum {
  ELECTRONICS = 'electronics',
  FASHION = 'fashion',
  BOOKS = 'books',
}

@Controller()
export class ProductController {
  @Get('products')
  getProductsByCategories(
    @EnumsQuery({
      key: 'categories',
      enum: CategoryEnum,
      description: 'Categories of the product',
      separator: ',',
      nullable: false,
    })
    categories: CategoryEnum[],
  ) {
    return categories;
  }
}

/*
  Request: GET /products?categories=books,fashion
  Response: ["books", "fashion"]
*/
```

### @Id()

Use the `Id` decorator to validate a single UUID, either from the route parameters or query parameters. If the provided value is not a valid UUID, it will throw a `UuidException` from the `@hodfords/nestjs-exception` package.

Parameters:

- `options` (`string` | `ParamOptions`):

  - `key`: The name of the parameter in the request (required).
  - `nullable`: If `true`, the parameter is allowed to be null (optional, default: `false`).

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Id } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {
  @Get(':id')
  getUserById(@Id('id') id: string) {
    return id;
  }
}

/*
  Request: GET users/8be26127-c0ed-4cad-bd45-7f40dcf53e89
  Response: 8be26127-c0ed-4cad-bd45-7f40dcf53e89
*/
```

### @Ids()

Use the `Ids` decorator when you need to validate multiple UUIDs passed as a comma-separated list in the `query` parameters. If any value in the list is not a valid UUID, it throws a `UuidException` from the `@hodfords/nestjs-exception` package.

Parameters:

- `options` (`string` | `ParamOptions`):

  - `key`: The name of the parameter in the request (required).
  - `nullable`: If `true`, the parameter is allowed to be null (optional, default: `false`).

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Ids } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {
  @Get()
  getUsersByIds(@Ids('ids') ids: string[]) {
    return ids;
  }
}

/*
  Request: GET users?ids=8be26127-c0ed-4cad-bd45-7f40dcf53e89,1b3a0d50-2695-49e7-9498-c4cb1cada6e9
  Response: ["8be26127-c0ed-4cad-bd45-7f40dcf53e89","1b3a0d50-2695-49e7-9498-c4cb1cada6e9"]
*/
```

### @Int()

The `Int` decorator is used to validate a single integer, either from route parameters or query parameters.

Parameters: `key` (default: `'id'`)

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Int } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {
  @Get(':id')
  getUserById(@Int('id') id: number) {
    return id;
  }
}

/*
  Request: GET /users/123
  Response: 123
*/
```

### @Ints()

The `Ints` decorator is used to validate multiple integers passed as a comma-separated list in query parameters.

Parameters: `key` (default: `'ids'`)

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Ints } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {
  @Get()
  getUsersByIds(@Ints('ids') ids: number[]) {
    return ids;
  }
}

/*
  Request: GET /users?ids=123,456
  Response: [123,456]
*/
```

### @Pagination()

The `Pagination` decorator is used to handle pagination logic by extracting the `page` and `perPage` parameters from the query string of an incoming request. The decorator also includes automatic Swagger documentation using `nestjs/swagger`.

Parameters:

- `paginationParams`:
  - `page`: The current page number (optional, default: 1).
  - `perPage`: The number of items per page (optional, default: 10, max: 1000).

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { Pagination, PaginationParams } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {
  @Get()
  getUsers(
    @Pagination() pagination: PaginationParams
  ) {
    return `Page: ${pagination.page}, Per Page: ${pagination.perPage}`;
  }
}

/*
  Request: GET /users?page=1&perPage=10
  Response: Page: 1, Per Page: 10
*/
```

### @QueryBoolean()

The `QueryBoolean` decorator allows you to extract and validate boolean values from the query parameters in a NestJS route. It checks if the query parameter is `'true'` and returns `true`, otherwise it returns `false`.

Parameters: `key`, `options` (`ApiQueryOptions`)

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { QueryBoolean } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UsersController {
  @Get()
  getUsers(@QueryBoolean('isActive') isActive: boolean) {
    return isActive;
  }
}

/*
  Request: GET /users?isActive=true
  Response: true

  Request: GET /users?isActive=123
  Response: false
*/
```

### @QueryStrings()

The `QueryStrings` decorator extracts query parameters from HTTP requests, parses them as comma-separated strings, and ensures uniqueness by eliminating duplicates. Additionally, it integrates with `@nestjs/swagger` to automatically document the query parameters in the Swagger UI.

Parameters: `key`, `options` (`ApiQueryOptions`)

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { QueryStrings } from '@hodfords/nestjs-base-decorator';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    findTags(@QueryStrings('tags') tags: string[]): string[] {
        return tags;
    }
}

/*
  Request: GET ?tags=name,age
  Response: ["name, "age"]
*/
```

### @RealIp()

The `RealIp` decorator is a custom NestJS decorator that retrieves the client's real IP address from an incoming HTTP request. It leverages the `@supercharge/request-ip` library to accurately identify the IP address, even if the client is behind a proxy or using a load balancer.

Example for usage:

```typescript
import { Controller, Get } from '@nestjs/common';
import { RealIp } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {

    @Get('ip')
    getClientIp(@RealIp() ip: string): string {
        return `Client IP: ${ip}`;
    }
}

/*
  Request: GET /ip
  Response: "Client IP": "203.0.113.195"
*/
```

### @RequireToUploadFile()

The `RequireToUploadFile` decorator is a custom NestJS decorator that simplifies file upload handling for single and multiple file uploads. It leverages NestJS `Interceptors` and custom interceptors to validate file uploads. The decorator allows developers to specify file upload configurations like file size limits, allowed MIME types, and custom storage engines.

Parameters:

- `fieldName`: Specifies the form field name used to upload the file(s).
- `options`: An object that configures the file upload behavior. It includes:
  - `fileSize`: Maximum file size (in bytes) for the upload. Default is set to `10 * 1024 * 1024`.
  - `allowedMimeTypes`: Array of allowed MIME types for the uploaded files. Default is `['image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml',
    'image/bmp',
    'image/heic',
    'image/heif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel']`.
  - `maxCount`: Maximum number of files that can be uploaded in a single request.
  - `storageEngine`: Custom storage engine for handling uploaded files (e.g., disk storage or cloud storage).

Example for usage:

```typescript
import { Controller, Post, UploadedFiles } from '@nestjs/common';
import { RequireToUploadFile } from '@hodfords/nestjs-base-decorator';

@Controller('files')
export class FileController {
    @Post('upload')
    @RequireToUploadFile({ fieldName: 'file' })
    uploadFile(@UploadedFiles() file: Express.Multer.File[]) {
        return file;
    }
}
```

If you want only upload with one file and present it as a object, you can follow below:

```typescript
import { Controller, Post, UploadedFile } from '@nestjs/common';
import { RequireToUploadFile } from '@hodfords/nestjs-base-decorator';

@Controller('files')
export class FileController {
    @Post('upload')
    @RequireToUploadFile({ fieldName: 'file', options: { maxCount: 1 } })
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return file;
    }
}
```

### @RequireToUploadFiles()

The `RequireToUploadFiles` decorator simplifies the process of uploading multiple files with different field names in NestJS. It uses the `FileFieldsInterceptor` from `@nestjs/platform-express` to manage multiple file uploads from distinct form fields and allows customization through file upload options. The decorator integrates with custom interceptors for additional validation and handling of the uploaded files.

Parameters:

- `fieldNames`:
  - `name`: The name of the form field.
  - `maxCount`: (Optional) Maximum number of files allowed for this field. If not provided, defaults to the global `maxCount` value.
- `options`:
  - `fileSize`: Maximum file size (in bytes).
  - `allowedMimeTypes`: Array of allowed MIME types for uploaded files.
  - `maxCount`: Default maximum number of files allowed per field.
  - `storageEngine`: Custom storage engine to handle file uploads.

Example for usage:

```typescript
import { Controller, Post, UploadedFile } from '@nestjs/common';
import { RequireToUploadFile } from '@hodfords/nestjs-base-decorator';

@Controller('files')
export class FileController {
    @Post('upload')
    @RequireToUploadFiles({
        fieldNames: [
            { name: 'profile', maxCount: 1 },
            { name: 'documents', maxCount: 5 }
        ]
    })
    uploadUserFiles(@UploadedFiles() files: { profile: Express.Multer.File[]; documents: Express.Multer.File[] }) {
        return files;
    }
}
```

### @Sort()

The `Sort` decorator simplifies handling sorting parameters in NestJS controllers. It defines two query parameters, `sortField` and `sortDirection`, allowing API clients to specify how to sort data in their requests. The decorator integrates with Swagger for automatic API documentation and validates the sorting fields and directions against predefined sets of allowed values.

Parameters:

- `sortParams`:
  - `allowedFields`: An array of allowed fields for sorting (e.g., `['name', 'createdAt']`).
  - `default`: An object with default sorting parameters:
    - `sortField`: The default field to sort by.
    - `sortDirection`: The default sorting direction (`ASC` or `DESC`).

Example for usage:

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { Sort, SortParams } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {

    @Get()
    getUsers(@Sort({ allowedFields: ['name', 'createdAt'], default: { sortField: 'createdAt', sortDirection: 'DESC' } }) query: SortParams) {
        const { sortField, sortDirection } = query;
        return `Sorted by ${sortField} in ${sortDirection} order`;
    }
}

/*
  Request: GET ?sortField=createdAt&sortDirection=DESC
  Response: Sorted by createdAt in DESC order
*/
```

### @Sorts()

The `Sorts` decorator provides an elegant solution for handling multiple sorting fields in NestJS controllers. It allows clients to specify multiple fields and their respective sort directions. The decorator automatically generates Swagger documentation for these parameters and ensures proper validation of both fields and directions.

Parameters:

- `sortParams`:
  - `allowedFields`: An array of allowed fields for sorting (e.g., `['name', 'createdAt']`).
  - `default`: An object with default sorting parameters:
    - `sortField`: The default field to sort by.
    - `sortDirection`: The default sorting direction (`ASC` or `DESC`).

Example for usage:

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { Sorts, SortMultipleParams } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {

    @Get()
    getUsers(
        @Sorts({ allowedFields: ['name', 'createdAt'], default: { sortField: 'createdAt', sortDirection: 'DESC' } })
        query: SortMultipleParams[]
    ) {
        return query;
    }
}

/*
  Request: GET ?sortFields=createdAt,name:DESC
  Response: [
  {
    "field": "createdAt",
    "direction": "ASC"
  },
  {
    "field": "name",
    "direction": "DESC"
  }
]
*/
```

### @Timestamp()

The `Timestamp` decorator is used to extract and validate a timestamp from the request parameters or query in a NestJS controller. It ensures the timestamp is valid and handles optional or nullable parameters.

Parameters:

- `options`:
  - `key`: The name of the parameter to extract (required).
  - `nullable`: Indicates if the timestamp can be nullable (optional, default: `false`).

Example for usage:

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { Timestamp } from '@hodfords/nestjs-base-decorator';

@Controller('events')
export class EventController {

    @Get()
    getEvents(@Timestamp('timestamp') timestamp: number) {
        return timestamp;
    }
}

/*
  Request: GET /events?timestamp=1581739337
  Response: 1581739337
*/
```

### @Timezone()

The `Timezone` decorator is designed to validate and extract a timezone string from request parameters or query in a NestJS controller. It leverages the `dayjs` library along with the `timezone` and `utc` plugins to ensure that the provided timezone is valid.

Parameters:

- `options`:
  - `key`: The name of the parameter to extract (required).
  - `nullable`: Indicates if the timestamp can be nullable (optional, default: `false`).

Example for usage:

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { Timezone } from '@hodfords/nestjs-base-decorator';

@Controller('events')
export class EventController {

    @Get()
    getEvents(@Timezone('timezone') timezone: string) {
        return timezone;
    }
}

/*
  Request: GET ?timezone=America/New_York
  Response: America/New_York
*/
```

### @UserAgent()

The `UserAgent` decorator is a simple utility that extracts the `User-Agent` header from incoming requests in a NestJS application. This header typically contains information about the client's browser, operating system, and device.

Example for usage:

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { UserAgent } from '@hodfords/nestjs-base-decorator';

@Controller('users')
export class UserController {

    @Get('user-agent')
    getUserAgent(@UserAgent() userAgent: string) {
        return userAgent;
    }
}
```

### @Value()

The `Value` decorator is used to extract the `value` property from the payload of a microservice request in NestJS. It is a wrapper around the `Payload` decorator provided by `@nestjs/microservices`, allowing you to directly access the `value` property in microservice message handlers.

Example for usage:

```typescript
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Value } from '@hodfords/nestjs-base-decorator';

@Controller()
export class MathController {

    @EventPattern('math.add')
    handleAddition(@Value() value: number) {
        return `Value received: ${value}`;
    }
}

```
