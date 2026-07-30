import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Namespace de versión para todos los endpoints, incluido /v1/health
  // (sirve a R9). Ver docs/architecture.md — el resto de módulos futuros
  // reutiliza el mismo prefijo sin repetirlo por controller.
  app.setGlobalPrefix('v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
