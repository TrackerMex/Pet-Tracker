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
  const fail = () => showError(t('common.somethingWentWrong'));
  try {
    const result = await request();

    switch (result.kind) {
      case 'ok':
        onAcked(result.alert);
        return;
      case 'already-closed':
        onAcked({ ...alert, status: 'closed' });
        return;
      case 'not-found':
        onNotFound();
        return;
      case 'unreachable':
        showError(t('common.cannotReachServer'));
        return;
      case 'unauthorized':
        void Promise.resolve(signOut()).catch(fail);
        return;
      case 'error':
      case 'missing-config':
        showError(t('common.somethingWentWrong'));
    }
  } catch {
    fail();
  }
}
