import { blobatar } from 'blobatar';
import { Image } from 'expo-image';
import { SvgXml } from 'react-native-svg';

export interface PetAvatarProps {
  name: string;
  photoUrl: string | null;
  size: number;
  testID?: string;
}

export function PetAvatar({
  name,
  photoUrl,
  size,
  testID = 'pet-avatar',
}: PetAvatarProps) {
  if (photoUrl) {
    return (
      <Image
        testID={testID}
        contentFit="cover"
        source={photoUrl}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <SvgXml
      testID={testID}
      height={size}
      width={size}
      xml={blobatar(name)}
    />
  );
}
