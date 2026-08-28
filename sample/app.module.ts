import { RequestResolver, TranslationModule } from '@hodfords/nestjs-cls-translation';
import { HttpExceptionFilter } from '@hodfords/nestjs-exception';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HeaderResolver } from 'nestjs-i18n';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppController } from './app.controller.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const i18nConfig = TranslationModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
        // Read straight from the sample/i18n sources: Nest copies assets asynchronously,
        // so the app can boot before the files land in dist.
        path: path.join(currentDir, '../../sample/i18n/'),
        watch: true
    },
    resolvers: [new HeaderResolver(['language'])],
    defaultLanguageKey: 'language',
    clsResolvers: [new RequestResolver([{ key: 'language', type: 'headers' }])]
});

@Module({
    imports: [i18nConfig],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}
