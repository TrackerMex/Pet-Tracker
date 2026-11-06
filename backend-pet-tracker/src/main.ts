import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp, createAppLogger } from './app-setup';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createAppLogger(process.env.NODE_ENV),
  });
  configureApp(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
