import 'reflect-metadata';
import { GLOBAL_MODULE_METADATA } from '@nestjs/common/constants';
import { AppModule } from '@/app.module';
import { InFlightTicks } from './in-flight-ticks';
import { LifecycleModule } from './lifecycle.module';
describe('R6: LifecycleModule es global y AppModule lo importa', () => {
  it('R6: LifecycleModule es @Global y provee y exporta InFlightTicks', () => {
    expect(Reflect.getMetadata(GLOBAL_MODULE_METADATA, LifecycleModule)).toBe(
      true,
    );
    expect(Reflect.getMetadata('providers', LifecycleModule)).toEqual(
      expect.arrayContaining([InFlightTicks]),
    );
    expect(Reflect.getMetadata('exports', LifecycleModule)).toEqual(
      expect.arrayContaining([InFlightTicks]),
    );
  });
  it('R6: AppModule importa LifecycleModule', () => {
    expect(Reflect.getMetadata('imports', AppModule)).toEqual(
      expect.arrayContaining([LifecycleModule]),
    );
  });
});
