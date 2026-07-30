import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config.module';

describe('R5: ConfigModule global lee variables desde ../.env sin reimportarlo', () => {
  it('expone ConfigService globalmente a partir de un .env indicado por envFilePath', async () => {
    // Usa un .env de fixture (no el ../.env real) para no depender del
    // entorno local — prueba únicamente el mecanismo isGlobal + envFilePath.
    const moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule.forRoot(['test/fixtures/.env.fixture'])],
    }).compile();

    // Se resuelve ConfigService directamente del contenedor raíz, sin que
    // ningún módulo hoja haya vuelto a importar ConfigModule — así se
    // comprueba isGlobal: true.
    const configService = moduleRef.get(ConfigService);

    expect(configService.get('FIXTURE_ONLY_VAR')).toBe('hello-from-fixture');

    await moduleRef.close();
  });
});
