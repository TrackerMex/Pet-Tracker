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

  it('/v1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1')
      .expect(200)
      .expect('Hello Pet Tracker!');
  });

  afterEach(async () => {
    await app.close();
  });
});
