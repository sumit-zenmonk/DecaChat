process.env.TZ = 'Asia/Kolkata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CommonExceptionsFilter } from './common/infrastruture/filters/common-exceptions.filter';
import { createSchemas } from './common/infrastruture/db/bootstrap/db_schema.create';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  await createSchemas();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new CommonExceptionsFilter());

  await app.listen(process.env.PORT ?? 8090);
}
bootstrap();
