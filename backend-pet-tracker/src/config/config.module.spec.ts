import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config.module';
import { EnvValidationError } from './env.validation';

describe('R5: ConfigModule global lee variables desde ../.env sin reimportarlo', () => {
  it('expone ConfigService globalmente a partir de un .env indicado por envFilePath', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule.forRoot(['test/fixtures/.env.fixture'])],
    }).compile();

    const configService = moduleRef.get(ConfigService);

    expect(configService.get('FIXTURE_ONLY_VAR')).toBe('hello-from-fixture');

    await moduleRef.close();
  });
});

describe('#245 R13: AppConfigModule valida el entorno con validateEnv', () => {
  let originalNodeEnv: string | undefined;
  let originalSimMode: string | undefined;
  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    originalSimMode = process.env.SIM_MODE;
  });
  afterEach(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalSimMode === undefined) delete process.env.SIM_MODE;
    else process.env.SIM_MODE = originalSimMode;
  });
  it('#245 R13: con NODE_ENV=production y sin SIM_MODE la compilación se rechaza nombrando SIM_MODE', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.SIM_MODE;
    const compiled = Test.createTestingModule({
      imports: [AppConfigModule.forRoot([])],
    }).compile();
    await expect(compiled).rejects.toThrow(/SIM_MODE/);
    await expect(compiled).rejects.toBeInstanceOf(EnvValidationError);
  });
});
