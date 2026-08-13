import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AwsModule } from './aws/aws.module';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './db/drizzle.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevicesModule } from './modules/devices/devices.module';
import { GeofencesModule } from './modules/geofences/geofences.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { PetsModule } from './modules/pets/pets.module';
import { PositionsModule } from './modules/positions/positions.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { UsersModule } from './modules/users/users.module';
import { AlertsEngineModule } from './workers/alerts-engine/alerts-engine.module';
import { IngestionModule } from './workers/ingestion.module';
import { NotifierModule } from './workers/notifier/notifier.module';

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
    RemindersModule,
    ActivityModule,
    AlertsModule,
    IngestionModule,
    AlertsEngineModule,
    NotifierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
