import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const options = new DocumentBuilder()
    .setTitle('Sage Backend Assessment')
    .setDescription('API Documentation for Sage Backend Assessment API')
    .setVersion('1.0')
    .addServer('https://sage-backend-1v58.onrender.com/', 'Live environment')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('Sage Backend Assessment')
    .addBearerAuth()
    .build();

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
