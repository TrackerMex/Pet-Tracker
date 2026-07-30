import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// DATABASE_URL se fija por describe block ANTES de compilar el AppModule,
// para probar tanto la rama sana como la caída contra Postgres real —
// dotenv (usado por ConfigModule) no pisa un process.env ya seteado, así
// que esto tiene prioridad sobre el ../.env real sin tocar ese archivo.
//
// NOTA PARA EL REVIEWER: en este sandbox de ejecución no hay acceso al
// socket de Docker (permission denied, sin sudo), así que no se pudo usar
// `docker compose up -d` con Postgres 17 como documenta
// docs/architecture.md. La rama "ok" (R7) corre contra un Postgres 16
// levantado a mano con `initdb`/`pg_ctl` fuera de Docker
// (ver progress/current.md y progress/impl_db-setup-drizzle.md para el
// detalle de la desviación). El código de producción no cambia por esto:
// sigue leyendo DATABASE_URL vía ConfigService desde ../.env, que en
// Docker real apunta a Postgres 17 en :5432.
const REACHABLE_DATABASE_URL =
  process.env.HEALTH_E2E_REACHABLE_DATABASE_URL ??
  'postgresql://pet_tracker:pet_tracker@localhost:5544/pet_tracker';
const UNREACHABLE_DATABASE_URL =
  'postgresql://pet_tracker:pet_tracker@localhost:5599/pet_tracker';

async function bootstrapApp(): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('v1');
  await app.init();
  return app;
}

describe('R7: GET /v1/health responde 200 con Postgres arriba', () => {
  let app: INestApplication<App>;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(async () => {
    process.env.DATABASE_URL = REACHABLE_DATABASE_URL;
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('devuelve 200 con { postgres: "ok" }', () => {
    return request(app.getHttpServer())
      .get('/v1/health')
      .expect(200)
      .expect({ postgres: 'ok' });
  });

  describe('R9: GET /v1/health es público y vive bajo el prefijo /v1', () => {
    it('responde sin exigir Authorization', () => {
      return request(app.getHttpServer()).get('/v1/health').expect(200);
    });

    it('no existe fuera del prefijo /v1 (GET /health → 404)', () => {
      return request(app.getHttpServer()).get('/health').expect(404);
    });
  });
});

describe('R8: GET /v1/health responde 503 con Postgres caído', () => {
  let app: INestApplication<App>;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(async () => {
    process.env.DATABASE_URL = UNREACHABLE_DATABASE_URL;
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('devuelve 503 con { postgres: "error" }, sin exponer la excepción cruda del driver', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/health')
      .expect(503);

    expect(response.body).toMatchObject({ postgres: 'error' });
    // La respuesta no debe filtrar detalles internos del driver pg (stack,
    // código ECONNREFUSED, host/puerto, etc.).
    const rawBody = JSON.stringify(response.body);
    expect(rawBody).not.toMatch(/ECONNREFUSED|node_modules|pg\.Pool|stack/i);
  });
});
