import { RequestPhotoUploadUrlSchema } from './request-photo-upload-url.dto';

describe('R1: RequestPhotoUploadUrlSchema acepta los 3 content types de imagen soportados', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'])(
    'acepta %s',
    (contentType) => {
      const result = RequestPhotoUploadUrlSchema.safeParse({ contentType });

      expect(result.success).toBe(true);
    },
  );
});

describe('R2: RequestPhotoUploadUrlSchema rechaza contentType ausente o no soportado', () => {
  it('rechaza body sin contentType', () => {
    expect(RequestPhotoUploadUrlSchema.safeParse({}).success).toBe(false);
  });

  it('rechaza contentType vacio', () => {
    expect(
      RequestPhotoUploadUrlSchema.safeParse({ contentType: '' }).success,
    ).toBe(false);
  });

  it.each(['application/pdf', 'image/gif', 'text/plain'])(
    'rechaza %s',
    (contentType) => {
      const result = RequestPhotoUploadUrlSchema.safeParse({ contentType });

      expect(result.success).toBe(false);
    },
  );
});
