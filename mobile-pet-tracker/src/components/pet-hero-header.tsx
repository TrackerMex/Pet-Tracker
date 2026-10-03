import { Skeleton } from 'heroui-native';
import { useEffect, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
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

/**
 * Pulso del punto 'en línea' (#73 E2): animate-pulse de Tailwind traducido a
 * Reanimated; misma cadencia que el pulse del Skeleton de heroui que ya vive
 * en este hero.
 */
export const STATUS_DOT_PULSE = {
  duration: 1000,
  easing: Easing.bezier(0.4, 0, 0.6, 1),
  reduceMotion: ReduceMotion.System,
} as const;

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

const STATUS_TONE_CLASSES: Record<
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
  const [background] = useThemeColors(['background']);
  const reduceMotion = useReducedMotion();
  const dotOpacity = useSharedValue(1);
  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.get() }));
  const pulses = !reduceMotion && pet !== null && status?.tone === 'success';
  const tone = STATUS_TONE_CLASSES[status?.tone ?? 'muted'];

  useEffect(() => {
    if (!pulses) return;

    dotOpacity.set(
      withRepeat(
        withSequence(
          withTiming(0.5, STATUS_DOT_PULSE),
          withTiming(1, STATUS_DOT_PULSE),
        ),
        -1,
        false,
      ),
    );

    return () => {
      cancelAnimation(dotOpacity);
      dotOpacity.set(1);
    };
  }, [pulses, dotOpacity]);

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
              {status ? (
                <View
                  testID="pet-hero-status"
                  accessible
                  accessibilityLabel={status.label}
                  className={`flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5 ${tone.surface}`}
                >
                  {pulses ? (
                    <AnimatedView
                      testID="pet-hero-status-dot"
                      className={`size-1.5 rounded-full ${tone.dot}`}
                      style={dotStyle}
                    />
                  ) : (
                    <View
                      testID="pet-hero-status-dot"
                      className={`size-1.5 rounded-full ${tone.dot}`}
                    />
                  )}
                  <Text
                    testID="pet-hero-status-text"
                    className={`text-2xs font-semibold ${tone.text}`}
                  >
                    {status.label}
                  </Text>
                </View>
              ) : null}
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
