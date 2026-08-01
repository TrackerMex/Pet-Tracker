import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Mismo prefijo global que main.ts (R9) — sin esto, /v1/* devolvería 404
    // en este árbol de test aunque funcione en producción.
    app.setGlobalPrefix('v1');
    await app.init();
  });

  // Desde auth-login-me (#4) el AuthGuard global protege toda ruta que no
  // esté marcada @Public() (R5); la raíz /v1 no está en la lista pública de
  // R7, así que sin Authorization debe responder 401 antes del handler.
  it('/v1 (GET) sin token responde 401 (R5: guard global por defecto)', () => {
    return request(app.getHttpServer()).get('/v1').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
