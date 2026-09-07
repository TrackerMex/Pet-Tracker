import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import type { PetProfile } from '../api/types';
import { CONTINUOUS_CORNER } from '../theme/native-styles';

/**
 * Alto visible de la fotografía. Valor de un solo uso y de un solo fichero: la
 * carta pide token a partir de la segunda repetición, y `h-[260px]` está
 * prohibido. Se exporta para los tests, no para otros componentes.
 */
export const PET_HERO_MEDIA_HEIGHT = 260;

/** Alto de cada franja de degradado entre la imagen y una banda opaca. */
export const PET_HERO_FADE_HEIGHT = 64;

export interface PetHeroHighlight {
  value: string;
  label: string;
}

export interface PetHeroHeaderProps {
  /** null mientras el detalle de la mascota no ha resuelto (R8). */
  pet: PetProfile | null;
  /**
   * 'bleed' = a sangre, sin radio (Home). 'card' = dentro del ancho con
   * `rounded-card` (Profile). Default 'card'.
   */
  variant?: 'bleed' | 'card';
  /** Dato destacado YA FORMATEADO por el llamante (R7). */
  highlight?: PetHeroHighlight;
  /** Slot de la zona superior. El hero NO conoce a su contenido (D2). */
  children?: ReactNode;
}

export function PetHeroHeader({ pet, variant = 'card' }: PetHeroHeaderProps) {
  return (
    <View
      testID="pet-hero"
      className={
        variant === 'card'
          ? 'overflow-hidden rounded-card bg-default'
          : 'overflow-hidden bg-default'
      }
      style={CONTINUOUS_CORNER}
    >
      <View testID="pet-hero-caption" className="gap-1 px-6 pb-4 pt-1">
        <Text
          testID="pet-hero-name"
          className="text-3xl font-black text-foreground"
        >
          {pet?.name}
        </Text>
        <Text testID="pet-hero-breed" className="font-normal text-muted">
          {pet?.breed ?? '—'}
        </Text>
      </View>
    </View>
  );
}
