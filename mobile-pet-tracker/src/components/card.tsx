import { Pressable, View, type ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

const variantClassNames = {
  surface: 'rounded-card border border-border bg-surface p-4 shadow-sm',
  accent: 'rounded-card bg-accent p-5 shadow-sm',
  secondary:
    'rounded-card border border-border bg-surface-secondary p-4',
} as const;

export type CardVariant = keyof typeof variantClassNames;

export type CardProps = ViewProps & {
  variant?: CardVariant;
  onPress?: () => void;
  className?: string;
};

export function Card({
  variant = 'surface',
  onPress,
  className,
  ...rest
}: CardProps) {
  const mergedClassName = twMerge(variantClassNames[variant], className);

  if (onPress) {
    return (
      <Pressable
        {...rest}
        accessibilityRole="button"
        className={mergedClassName}
        onPress={onPress}
      />
    );
  }

  return <View {...rest} className={mergedClassName} />;
}
