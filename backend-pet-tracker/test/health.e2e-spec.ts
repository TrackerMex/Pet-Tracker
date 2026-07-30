import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// El escenario "Postgres caído" (R8) fuerza un DATABASE_URL a un puerto que
// nadie escucha, sin importar el entorno — dotenv (usado por ConfigModule)
// nunca pisa un process.env ya seteado, así que esto tiene prioridad sobre
// el ../.env real sin tocar ese archivo.
const UNREACHABLE_DATABASE_URL =
  'postgresql://pet_tracker:pet_tracker@localhost:5599/pet_tracker';

// NOTA PARA EL REVIEWER: el escenario "Postgres arriba" (R7) NO fuerza
// ningún DATABASE_URL — usa el que ya resuelva ../.env / el entorno, igual
// que en producción, así que en cualquier máquina con
// `docker compose up -d` corriendo (Postgres 17 en :5432, ver
// docker-compose.yml) este archivo pasa tal cual. Este sandbox de
// ejecución no tiene acceso al socket de Docker (permission denied, sin
// sudo) y no puede levantar ese contenedor, así que para verificar R7 acá
// se corrió `pnpm run test:e2e` con DATABASE_URL exportado a mano en el
// shell apuntando a un Postgres 16 propio (initdb/pg_ctl, sin Docker) —
// ver progress/current.md y progress/impl_db-setup-drizzle.md. Ningún
// archivo de código ni de test quedó con ese valor hardcodeado.
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

  beforeAll(async () => {
    app = await bootstrapApp();
  });

  afterAll(async () => {
    await app.close();
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
