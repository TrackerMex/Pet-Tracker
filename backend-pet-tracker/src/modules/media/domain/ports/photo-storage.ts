export const PHOTO_STORAGE = Symbol('PhotoStorage');

/**
 * Puerto de `media` hacia el almacenamiento de fotos (R1, R6): URLs S3
 * prefirmadas de subida y descarga, nunca acceso directo/publico (R8). La
 * implementacion (`photo-storage.s3.adapter.ts`) firma contra el bucket
 * `pet-tracker-media-local` con `S3_CLIENT` + `getSignedUrl`.
 */
export interface PhotoStorage {
  createUploadUrl(key: string, expiresInSeconds: number): Promise<string>;
  createDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;
}
