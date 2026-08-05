export const PET_PHOTO_URL_RESOLVER = Symbol('PetPhotoUrlResolver');

/**
 * Puerto de pets hacia la resolucion de `photoUrl` (pet-photos-s3 #6 R6):
 * "dame una URL de descarga prefirmada para esta clave". Pets es dueño de
 * su necesidad; la implementacion vive en modules/media/ y llega via
 * PetPhotoReadModule — mismo patron exacto que PET_DEVICE_READER
 * (pet-device-reader.ts, #7).
 */
export interface PetPhotoUrlResolver {
  resolveDownloadUrl(
    photoKey: string,
    expiresInSeconds: number,
  ): Promise<string>;
}
