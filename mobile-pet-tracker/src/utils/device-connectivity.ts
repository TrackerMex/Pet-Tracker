import type { TranslationKey } from '../i18n/catalog';

export const DEVICE_CONNECTIVITY_META: Record<
  string,
  { labelKey: TranslationKey }
> = {};

export function connectivityLabelKey(
  value: string | null,
): TranslationKey | null {
  return value === null ? null : 'home.online';
}
