import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('authentication');

  const config = new DocumentBuilder()
    .setTitle('NestJS Authentication API')
    .setDescription('API Rest for authentication @Printer do Brasil')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/authentication/swagger', app, document);

  app.use(
    '/authentication/docs',
    apiReference({
      theme: 'kepler',
      hideModels: true,
      spec: {
        content: document,
      },
    }),
  );

  const port = process.env.SERVER_PORT || 3000;

  await app.listen(port);
}
bootstrap();
