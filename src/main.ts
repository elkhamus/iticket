import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('I-Ticket')
    .setDescription('API for a mock iticket')
    .setVersion('1.0')
    .addTag('iticket')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Serve Swagger UI at /api (optional, if you want both UIs)
  SwaggerModule.setup('api', app, document);

  // ✅ Serve Scalar UI at /reference
  app.use(
    '/scalar',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();