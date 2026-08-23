import { Uniwind, useUniwind } from 'uniwind';

type ResolvedThemeColors<T extends readonly string[]> = {
  -readonly [Index in keyof T]: string;
};

function asColor(value: string | number | undefined): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

export function useThemeColors<const T extends readonly string[]>(
  tokens: T,
): ResolvedThemeColors<T> {
  const { theme } = useUniwind();
  const foreground =
    asColor(Uniwind.getCSSVariable('--color-foreground')) ??
    (theme === 'dark' ? '#F7F8FA' : '#0D1117');

  return tokens.map(
    (token) =>
      asColor(Uniwind.getCSSVariable(`--color-${token}`)) ??
      asColor(Uniwind.getCSSVariable(`--${token}`)) ??
      foreground,
  ) as ResolvedThemeColors<T>;
}
