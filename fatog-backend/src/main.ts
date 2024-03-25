import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './utils/globalExceptionFilter';
import { BadRequestExceptionFilter } from './utils/badRequestExceptionFilter';
import * as cors from 'cors';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      exceptionFactory: (errors) => {
        throw new BadRequestException(errors);
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new BadRequestExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('FATOG Inventory System')
    .setDescription('The FATOG API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cors());
  await app.listen(3000);
}
bootstrap();
