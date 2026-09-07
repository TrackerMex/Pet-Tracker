import { blobatar } from 'blobatar';
import { Image } from 'expo-image';
import { useState } from 'react';
import { SvgXml } from 'react-native-svg';

export interface PetAvatarProps {
  name: string;
  photoUrl: string | null;
  /**
   * Número: círculo de lado `size`. Objeto: rectángulo de ese ancho y alto,
   * sin radio, con el blobatar escalado al lado menor y centrado.
   */
  size: number | { width: number | '100%'; height: number };
  /**
   * Clave de caché estable. Sin ella `expo-image` usa la `uri`, y una URL
   * prefirmada cambia en cada firma: la caché de disco no acertaría nunca.
   */
  cacheKey?: string;
  testID?: string;
}

export function PetAvatar({
  name,
  photoUrl,
  size,
  cacheKey,
  testID = 'pet-avatar',
}: PetAvatarProps) {
  // Se guarda la URL que falló, no un booleano: así una URL recién firmada
  // vuelve a intentarse sola tras un refetch del detalle.
  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);

  if (photoUrl && photoUrl !== failedPhotoUrl) {
    return (
      <Image
        testID={testID}
        contentFit="cover"
        source={cacheKey ? { uri: photoUrl, cacheKey } : { uri: photoUrl }}
        style={
          typeof size === 'number'
            ? { width: size, height: size, borderRadius: size / 2 }
            : { width: size.width, height: size.height }
        }
        onError={() => setFailedPhotoUrl(photoUrl)}
      />
    );
  }

  return (
    <SvgXml
      testID={testID}
      height={typeof size === 'number' ? size : size.height}
      width={typeof size === 'number' ? size : size.width}
      xml={blobatar(name)}
    />
  );
}
