import { readFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import type { LastPositionReader } from '@/modules/positions/domain/repositories/last-position.reader';
import { GetLastPositionUseCase } from './get-last-position.use-case';

const CACHED = {
  lat: 19.4326,
  lng: -99.1332,
  ts: Date.UTC(2026, 7, 2, 11, 58, 30),
  accuracy: 12,
  battery: 88,
};

function readerReturning(value: unknown): LastPositionReader {
  return { findLastPosition: jest.fn().mockResolvedValue(value) };
}

describe('R3: GET .../positions/last devuelve exactamente las 6 claves de la cache, sin DynamoDB', () => {
  const now = new Date('2026-08-02T12:00:00.000Z');

  it('copia lat/lng/ts/accuracy/battery sin transformar y añade staleSeconds', async () => {
    const useCase = new GetLastPositionUseCase(readerReturning(CACHED));

    const view = await useCase.execute('pet-1', now);

    expect(view).toEqual({
      lat: 19.4326,
      lng: -99.1332,
      ts: CACHED.ts,
      accuracy: 12,
      battery: 88,
      staleSeconds: 90,
    });
  });

  it('el cuerpo no tiene ninguna clave fuera del contrato', async () => {
    const useCase = new GetLastPositionUseCase(readerReturning(CACHED));

    const view = await useCase.execute('pet-1', now);

    expect(Object.keys(view ?? {}).sort()).toEqual([
      'accuracy',
      'battery',
      'lat',
      'lng',
      'staleSeconds',
      'ts',
    ]);
  });

  it('conserva accuracy y battery nulas tal cual las escribio el pipeline', async () => {
    const useCase = new GetLastPositionUseCase(
      readerReturning({ ...CACHED, accuracy: null, battery: null }),
    );

    const view = await useCase.execute('pet-1', now);

    expect(view?.accuracy).toBeNull();
    expect(view?.battery).toBeNull();
  });

  it('lee la cache por el petId recibido y una sola vez', async () => {
    const reader = readerReturning(CACHED);
    const useCase = new GetLastPositionUseCase(reader);

    await useCase.execute('pet-42', now);

    expect(reader.findLastPosition).toHaveBeenCalledTimes(1);
    expect(reader.findLastPosition).toHaveBeenCalledWith('pet-42');
  });

  it('el caso de uso no recibe cliente DynamoDB: una sola dependencia y cero imports del SDK', () => {
    // R3 exige que esta ruta no toque DynamoDB. Se verifica por la firma del
    // constructor (una unica dependencia, el puerto de la cache) y por la
    // ausencia de cualquier import de @aws-sdk en el archivo.
    expect(GetLastPositionUseCase.length).toBe(1);

    // Los comentarios se eliminan antes de mirar: el archivo explica la
    // regla, lo que no puede es ejecutar nada de DynamoDB.
    const code = readFileSync(
      join(__dirname, 'get-last-position.use-case.ts'),
      'utf-8',
    )
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    expect(code).not.toMatch(/@aws-sdk/);
    expect(code).not.toMatch(/DynamoDB/);
  });
});

describe('R5: last_position NULL o corrupta => null (200 con body null), con warn en el caso corrupto', () => {
  const now = new Date('2026-08-02T12:00:00.000Z');

  it('cache NULL (mascota sin collar o sin posiciones aun) => null', async () => {
    const useCase = new GetLastPositionUseCase(readerReturning(null));

    await expect(useCase.execute('pet-1', now)).resolves.toBeNull();
  });

  it('cache con jsonb que no valida contra el shape de R3 => null y warn con el petId', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const useCase = new GetLastPositionUseCase(
      readerReturning({ lat: 'no-soy-un-numero', lng: -99.1 }),
    );

    await expect(useCase.execute('pet-corrupta', now)).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({ petId: 'pet-corrupta' }),
    );

    warn.mockRestore();
  });

  it('un jsonb corrupto no propaga el error al llamador', async () => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const useCase = new GetLastPositionUseCase(readerReturning('cadena suelta'));

    await expect(useCase.execute('pet-1', now)).resolves.toBeNull();

    jest.restoreAllMocks();
  });

  it('una cache NULL no emite warn: es estado normal, no corrupcion', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const useCase = new GetLastPositionUseCase(readerReturning(null));

    await useCase.execute('pet-1', now);

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
