import { Global, Module } from '@nestjs/common';
import { InFlightTicks } from './in-flight-ticks';
@Global()
@Module({ providers: [InFlightTicks], exports: [InFlightTicks] })
export class LifecycleModule {}
