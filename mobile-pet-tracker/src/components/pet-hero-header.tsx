import { Skeleton } from 'heroui-native';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PetProfile } from '../api/types';
import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../theme/native-styles';
import { useThemeColors } from '../theme/use-theme-colors';
import { PetAvatar } from './pet-avatar';

/**
 * Alto visible de la fotografía. Valor de un solo uso y de un solo fichero: la
 * carta pide token a partir de la segunda repetición, y una clase arbitraria de
 * altura está prohibida. Se exporta para los tests, no para otros componentes.
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

export function PetHeroHeader({
  pet,
  variant = 'card',
  highlight,
  children,
}: PetHeroHeaderProps) {
  const insets = useSafeAreaInsets();
  const [background] = useThemeColors(['background']);

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
      {children ? (
        <View
          testID="pet-hero-slot"
          className="bg-background px-6 pb-3"
          style={{ paddingTop: insets.top + 12 }}
        >
          {children}
        </View>
      ) : null}

      <View style={{ height: PET_HERO_MEDIA_HEIGHT }}>
        {pet ? (
          <PetAvatar
            name={pet.name}
            photoUrl={pet.photoUrl}
            cacheKey={pet.id}
            size={{ width: '100%', height: PET_HERO_MEDIA_HEIGHT }}
            testID="pet-hero-media"
          />
        ) : (
          <Skeleton
            testID="pet-hero-skeleton"
            className="w-full"
            style={{ height: PET_HERO_MEDIA_HEIGHT }}
          />
        )}

        {/*
          La parada transparente se escribe con el propio color de fondo y alfa
          0, nunca con `transparent`: `transparent` es negro con alfa cero y
          ensucia de gris el tramo intermedio. Y el prefijo `experimental_` es
          el único nombre que existe en RN 0.86.
        */}
        {children ? (
          <View
            testID="pet-hero-fade-top"
            className="absolute inset-x-0 top-0"
            style={{
              height: PET_HERO_FADE_HEIGHT,
              experimental_backgroundImage: `linear-gradient(to bottom, ${background} 0%, ${background}00 100%)`,
            }}
          />
        ) : null}
        <View
          testID="pet-hero-fade-bottom"
          className="absolute inset-x-0 bottom-0"
          style={{
            height: PET_HERO_FADE_HEIGHT,
            experimental_backgroundImage: `linear-gradient(to bottom, ${background}00 0%, ${background} 100%)`,
          }}
        />
      </View>

      <View
        testID="pet-hero-caption"
        className="flex-row items-end justify-between gap-4 bg-background px-6 pb-4 pt-1"
      >
        <View className="flex-1 gap-1">
          {pet ? (
            <>
              <Text
                testID="pet-hero-name"
                className="text-3xl font-black text-foreground"
              >
                {pet.name}
              </Text>
              <Text testID="pet-hero-breed" className="font-normal text-muted">
                {pet.breed ?? '—'}
              </Text>
            </>
          ) : (
            <>
              <Skeleton className="h-9 w-40 rounded-xl" />
              <Skeleton className="h-6 w-24 rounded-xl" />
            </>
          )}
        </View>

        {highlight ? (
          <View className="items-end gap-1">
            <Text
              testID="pet-hero-highlight-value"
              className="text-3xl font-black text-foreground"
              style={TABULAR_NUMS}
            >
              {highlight.value}
            </Text>
            <Text
              testID="pet-hero-highlight-label"
              className="text-xs font-medium text-muted"
            >
              {highlight.label}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
