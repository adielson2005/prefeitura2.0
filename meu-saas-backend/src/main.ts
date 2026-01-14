import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para desenvolvimento
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:8081',
    ],
    credentials: true,
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefixo global da API
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Backend rodando em http://localhost:${port}/api`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
