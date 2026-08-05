import { buildPhotoKey } from './photo-key';

describe('R1: buildPhotoKey genera la clave S3 pets/<petId>/photo-<ts>', () => {
  it('usa el epoch en milisegundos de `now`', () => {
    const now = new Date('2026-08-05T10:00:00.000Z');

    expect(buildPhotoKey('pet-123', now)).toBe(
      `pets/pet-123/photo-${now.getTime()}`,
    );
  });

  it('dos instantes distintos generan claves distintas', () => {
    const first = buildPhotoKey(
      'pet-123',
      new Date('2026-08-05T10:00:00.000Z'),
    );
    const second = buildPhotoKey(
      'pet-123',
      new Date('2026-08-05T10:00:00.001Z'),
    );

    expect(first).not.toBe(second);
  });
});
