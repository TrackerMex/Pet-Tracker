import type { AckAlertState } from '../api/alerts';
import type { Alert } from '../api/types';
import type { TranslationKey } from '../i18n/catalog';

export type AlertAckHandlers = {
  t: (key: TranslationKey) => string;
  signOut: () => Promise<void>;
  showError: (message: string) => void;
  onAcked: (next: Alert) => void;
  onNotFound: () => void;
};

export async function settleAlertAck(
  request: () => Promise<AckAlertState>,
  alert: Alert,
  { t, signOut, showError, onAcked, onNotFound }: AlertAckHandlers,
): Promise<void> {
  await request();
}
