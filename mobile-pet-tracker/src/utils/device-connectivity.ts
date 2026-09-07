import type { TranslationKey } from '../i18n/catalog';

export const DEVICE_CONNECTIVITY_META: Record<
  string,
  { labelKey: TranslationKey }
> = {
  online: { labelKey: 'deviceConnectivity.online' },
};

export function connectivityLabelKey(
  value: string | null,
): TranslationKey | null {
  if (value === null) return null;

  return (
    DEVICE_CONNECTIVITY_META[value]?.labelKey ??
    'deviceConnectivity.unknown'
  );
}
