import { Skeleton } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PetProfile } from '../api/types';
import { MOTION_CELEBRATION_EASE_OUT, MOTION_HERO_FADE_MS, MOTION_HERO_PING_MS } from '../theme/motion';
import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../theme/native-styles';
import { useThemeColors } from '../theme/use-theme-colors';
import { PetAvatar } from './pet-avatar';
import { PingRing } from './ping-ring';

/**
 * Alto visible de la fotografía. Valor de un solo uso y de un solo fichero: la
 * carta pide token a partir de la segunda repetición, y una clase arbitraria de
 * altura está prohibida. Se exporta para los tests, no para otros componentes.
 */
export const PET_HERO_MEDIA_HEIGHT = 330;

/** Alto de cada franja de degradado entre la imagen y una banda opaca. */
export const PET_HERO_FADE_HEIGHT = 160

export const PET_HERO_SCRIM_HEIGHT = 130;

const AnimatedView = Animated.createAnimatedComponent(View);

export interface PetHeroHighlight {
  value: string;
  label: string;
}

export type PetHeroStatusTone = 'success' | 'warning' | 'muted';

export interface PetHeroStatus {
  label: string;
  tone: PetHeroStatusTone;
}

export const STATUS_TONE_CLASSES: Record<
  PetHeroStatusTone,
  { surface: string; dot: string; text: string }
> = {
  success: {
    surface: 'bg-success-soft',
    dot: 'bg-success',
    text: 'text-accent-strong',
  },
  warning: {
    surface: 'bg-warning-soft',
    dot: 'bg-warning-strong',
    text: 'text-warning-strong',
  },
  muted: {
    surface: 'bg-default',
    dot: 'bg-muted',
    text: 'text-muted',
  },
};

const HERO_TONE_CLASSES = {
  ...STATUS_TONE_CLASSES,
  success: { ...STATUS_TONE_CLASSES.success, surface: 'bg-surface-secondary', dot: 'bg-accent' },
};

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
  /** Estado YA FORMATEADO por el llamante, misma regla que `highlight` (R7 de #67). */
  status?: PetHeroStatus;
  /** Slot de la zona superior. El hero NO conoce a su contenido (D2). */
  children?: ReactNode;
}

export function PetHeroHeader({
  pet,
  variant = 'card',
  highlight,
  status,
  children,
}: PetHeroHeaderProps) {
  const insets = useSafeAreaInsets();
  const [background, scrim] = useThemeColors(['background', 'scrim']);
  const reduceMotion = useReducedMotion();
  const petId = pet?.id;
  const photoOpacity = useSharedValue(reduceMotion || !pet ? 1 : 0);
  const photoStyle = useAnimatedStyle(() => ({ opacity: photoOpacity.get() }));



  const pulses = !reduceMotion && pet !== null && status?.tone === 'success';
  const tone = HERO_TONE_CLASSES[status?.tone ?? 'muted'];

  useEffect(() => {
    if (reduceMotion || !petId) {
      photoOpacity.set(1);
      return;
    }
    photoOpacity.set(0);
    photoOpacity.set(withTiming(1, { ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_HERO_FADE_MS }));
  }, [petId, photoOpacity, reduceMotion]);

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
      <View testID="pet-hero-frame" style={{ height: PET_HERO_MEDIA_HEIGHT }}>


        <AnimatedView testID="pet-hero-photo" className="absolute inset-0" style={photoStyle}>
        {pet ? (
          <PetAvatar
            name={pet.name}
            photoUrl={pet.photoUrl}
            cacheKey={pet.id}
            contentPosition="top"
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

        </AnimatedView>
        <View
          testID="pet-hero-dim"
          className="absolute inset-0 bg-photo-dim"
          pointerEvents="none"
        />

        {/*
          La parada transparente se escribe con el propio color de fondo y alfa
          0, nunca con `transparent`: `transparent` es negro con alfa cero y
          ensucia de gris el tramo intermedio. Y el prefijo `experimental_` es
          el único nombre que existe en RN 0.86.
        */}
        {children ? (
          <View
            testID="pet-hero-scrim-top"
            pointerEvents="none"
            className="absolute inset-x-0 top-0"
            style={{
              height: PET_HERO_SCRIM_HEIGHT,
              experimental_backgroundImage: `linear-gradient(to bottom, ${scrim}80 0%, ${scrim}00 100%)`,
            }}
          />
        ) : null}
        <View
          testID="pet-hero-fade-bottom"
          pointerEvents="none"
          className="absolute inset-x-0 bottom-0"
          style={{
            height: PET_HERO_FADE_HEIGHT,
            experimental_backgroundImage: `linear-gradient(to bottom, ${background}00 0%, ${background}59 35%, ${background}D9 65%, ${background} 100%)`,
          }}
        />

      {children ? (
        <View
          testID="pet-hero-slot"
          className="absolute inset-x-4"
          style={{ top: insets.top + 12 }}
        >
          {children}
        </View>
      ) : null}

      <View
        testID="pet-hero-caption"
        className="absolute inset-x-4 bottom-1.5 flex-row items-end justify-between gap-3"
      >
        <View className="min-w-0 flex-1 gap-1">
          {pet ? (
            <>
              {status ? (
                <View
                  testID="pet-hero-status"
                  accessible
                  accessibilityLabel={status.label}
                  className={`flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-0.75 ${tone.surface}`}
                >
                  <View
                    testID="pet-hero-status-dot"
                    className={`relative size-2 rounded-full ${tone.dot}`}
                  >
                    {pulses ? (
                      <PingRing
                        testID="pet-hero-status-ping"
                        className="inset-0 rounded-full bg-accent"
                        delay={0}
                        timing={{ ...MOTION_CELEBRATION_EASE_OUT, duration: MOTION_HERO_PING_MS }}
                      />
                    ) : null}
                  </View>
                  <Text
                    testID="pet-hero-status-text"
                    className={`text-xs font-bold ${tone.text}`}
                  >
                    {status.label}
                  </Text>
                </View>
              ) : null}
              <Text
                testID="pet-hero-name"
                className="text-3xl font-black leading-8.5 tracking-title text-foreground"
              >
                {pet.name}
              </Text>
              <Text testID="pet-hero-breed" className="text-sm font-normal text-muted">
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
          <View className="items-end">
            <Text
              testID="pet-hero-highlight-value"
              className="text-28 font-black leading-8 text-foreground"
              style={TABULAR_NUMS}
            >
              {highlight.value}
            </Text>
            <Text
              testID="pet-hero-highlight-label"
              className="text-xs font-semibold text-muted"
            >
              {highlight.label}
            </Text>
          </View>
        ) : null}
      </View>
      </View>
    </View>
  );
}
