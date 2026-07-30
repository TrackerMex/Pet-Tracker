import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './db/drizzle.module';

@Module({
  imports: [AppConfigModule.forRoot(), DrizzleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
