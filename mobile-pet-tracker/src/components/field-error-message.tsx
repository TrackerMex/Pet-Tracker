import { FieldError } from 'heroui-native';

import { useTranslate } from '../providers/language-provider';
import type { RuleIssue } from '../utils/account-rules';
import { FormError } from './form-error';

export function FieldErrorMessage({ testID, issue }: { testID: string; issue?: RuleIssue | null }) {
  const t = useTranslate();

  return (
    <FieldError testID={`${testID}-error`} isInvalid={issue != null}>
      {issue && <FormError testID={`${testID}-message`} message={t(issue.labelKey, issue.params)} />}
    </FieldError>
  );
}
