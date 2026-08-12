import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import {ConfigService} from '@nestjs/config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use('/productos', express.static(join(__dirname, '..', 'public', 'productos')));
  /*
  const config = new DocumentBuilder()
    .setTitle('SARCO\'S API')
    .setDescription('Documentación API Sarco')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SARCO\'S API')
    .setDescription('Documentación API Sarco')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  const port = configService.get<number>('PORT') ?? 4000;
  const host = configService.get<string>('HOST') ?? '0.0.0.0';
  await app.listen(port, host);
  Logger.log(`Nest app listening on http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`, 'Bootstrap');
}
bootstrap();
