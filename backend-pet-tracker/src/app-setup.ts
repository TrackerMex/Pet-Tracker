import type { NestExpressApplication } from '@nestjs/platform-express';
export function configureApp(app: NestExpressApplication): void {
  app.setGlobalPrefix('v1');
  app.enableShutdownHooks();
  app.set('trust proxy', 1);
}
