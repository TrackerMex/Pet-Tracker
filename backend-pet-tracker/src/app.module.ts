import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './aws/aws.module';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './db/drizzle.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [AppConfigModule.forRoot(), DrizzleModule, AwsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
