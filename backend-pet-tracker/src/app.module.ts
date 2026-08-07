import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AwsModule } from './aws/aws.module';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './db/drizzle.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevicesModule } from './modules/devices/devices.module';
import { GeofencesModule } from './modules/geofences/geofences.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { PetsModule } from './modules/pets/pets.module';
import { PositionsModule } from './modules/positions/positions.module';
import { UsersModule } from './modules/users/users.module';
import { AlertsEngineModule } from './workers/alerts-engine/alerts-engine.module';
import { IngestionModule } from './workers/ingestion.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    // Primer cron del repo (#8); #10/#16 heredan este forRoot (design.md).
    ScheduleModule.forRoot(),
    DrizzleModule,
    AwsModule,
    AuditModule,
    HealthModule,
    AuthModule,
    UsersModule,
    PetsModule,
    MediaModule,
    DevicesModule,
    GeofencesModule,
    PositionsModule,
    ActivityModule,
    IngestionModule,
    AlertsEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
