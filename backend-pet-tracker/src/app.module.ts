import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AwsModule } from './aws/aws.module';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './db/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    DrizzleModule,
    AwsModule,
    AuditModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
