import { Controller, Get, Req } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Request } from 'express';
import request from 'supertest';
import { configureApp } from './app-setup';
@Controller('probe')
class ProbeController {
  @Get() probe(@Req() req: Request) {
    return { ip: req.ip };
  }
}
describe('R9: configureApp fija prefijo v1, trust proxy de un salto y shutdown hooks', () => {
  let app: NestExpressApplication;
  let initial: number;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProbeController],
    }).compile();
    app = moduleRef.createNestApplication<NestExpressApplication>();
    initial = process.listenerCount('SIGTERM');
    configureApp(app);
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });
  it('R9: responde en /v1/probe y da 404 en /probe', async () => {
    await request(app.getHttpServer()).get('/v1/probe').expect(200);
    await request(app.getHttpServer()).get('/probe').expect(404);
  });
  it('R9: con X-Forwarded-For de una entrada, req.ip es esa entrada', async () => {
    await request(app.getHttpServer())
      .get('/v1/probe')
      .set('X-Forwarded-For', '203.0.113.7')
      .expect(200)
      .expect({ ip: '203.0.113.7' });
  });
  it('R9: con dos entradas, req.ip es la de la derecha', async () => {
    await request(app.getHttpServer())
      .get('/v1/probe')
      .set('X-Forwarded-For', '198.51.100.1, 203.0.113.7')
      .expect(200)
      .expect({ ip: '203.0.113.7' });
  });
  it('R9: añade un listener de SIGTERM y app.close lo quita', async () => {
    expect(process.listenerCount('SIGTERM')).toBe(initial + 1);
    await app.close();
    expect(process.listenerCount('SIGTERM')).toBe(initial);
  });
});
