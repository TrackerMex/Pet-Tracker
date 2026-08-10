import {
  BUCKET_MEDIA,
  BUCKET_MEDIA_BASE,
  resourceName,
} from './constants';

describe('R2: base y helper de composicion de nombres de recurso', () => {
  it('preserva el nombre local y compone sufijos opcionales', () => {
    expect(BUCKET_MEDIA_BASE).toBe('pet-tracker-media');
    expect(resourceName('positions-raw', '')).toBe('positions-raw');
    expect(resourceName('pet-tracker-media', 'dev-123')).toBe(
      'pet-tracker-media-dev-123',
    );
    expect(BUCKET_MEDIA).toBe('pet-tracker-media-local');
  });
});
