import { ConsoleLogger } from '@nestjs/common';
import { isProduction } from '@/config/environment';
import type { NestExpressApplication } from '@nestjs/platform-express';
export function configureApp(app: NestExpressApplication): void {
  app.setGlobalPrefix('v1');
  app.enableShutdownHooks();
  app.set('trust proxy', 1);
}

export function createAppLogger(nodeEnv: string | undefined): ConsoleLogger {
  return new ConsoleLogger({ json: isProduction(nodeEnv) });
}
