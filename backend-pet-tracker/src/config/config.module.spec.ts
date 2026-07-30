import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config.module';

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
