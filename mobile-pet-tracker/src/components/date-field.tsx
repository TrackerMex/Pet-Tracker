import { Host } from '@expo/ui';
import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';
import { InputGroup, Label } from 'heroui-native';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { Calendar, Clock, X } from 'reicon-react-native';
import { useUniwind } from 'uniwind';

import { useLocale, useTranslate } from '../providers/language-provider';
import { CONTINUOUS_CORNER } from '../theme/native-styles';
import { useThemeColors } from '../theme/use-theme-colors';
import { hhmmToLocalDate, isoToLocalDate, localDateToIso, timeToHhmm } from '../utils/civil-date';
import { fromPickerValue, toPickerValue } from '../utils/date-picker-value';

type DateFieldProps = {
  testID: string;
  pickerTestID?: string;
  mode?: 'date' | 'time';
  value: string | null;
  onChange: (next: string | null) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  isInvalid?: boolean;
  allowClear?: boolean;
};

function localNoon(iso: string | undefined): Date | undefined {
  const date = iso === undefined ? null : isoToLocalDate(iso);
  if (date === null) return undefined;
  date.setHours(12);
  return date;
}

export function DateField({
  testID, pickerTestID = `${testID}-picker`, mode = 'date', value, onChange,
  label, placeholder, minDate, maxDate, isInvalid = false, allowClear = false,
}: DateFieldProps) {
  const t = useTranslate();
  const locale = useLocale();
  const { theme } = useUniwind();
  const [muted, accent] = useThemeColors(['muted', 'accent']);
  const [pickerSeed, setPickerSeed] = useState<Date | null>(null);
  const date = value === null ? null : isoToLocalDate(value);
  const valid = mode === 'date' ? date !== null : value !== null && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const display = !valid ? '' : mode === 'time' ? value! : date!.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const emptyLabel = placeholder ?? (mode === 'date' ? t('dateField.placeholderDate') : t('dateField.placeholderTime'));
  const Icon = mode === 'date' ? Calendar : Clock;

  function openPicker() {
    if (mode === 'time') {
      setPickerSeed(value === null ? new Date() : hhmmToLocalDate(value) ?? new Date());
      return;
    }
    let seed = date;
    if (seed === null) {
      let day = localDateToIso(new Date());
      if (maxDate !== undefined && day > maxDate) day = maxDate;
      if (minDate !== undefined && day < minDate) day = minDate;
      seed = isoToLocalDate(day);
    }
    if (seed !== null) setPickerSeed(toPickerValue(seed));
  }

  return (
    <>
      {label !== undefined && <Label testID={`${testID}-label`}>
        <Label.Text className="text-sm font-extrabold text-foreground">{label}</Label.Text>
      </Label>}
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label ?? (display || emptyLabel)}
        className="h-12 rounded-xl bg-default"
        style={CONTINUOUS_CORNER}
        onPress={openPicker}
      >
        <InputGroup>
          <InputGroup.Prefix isDecorative><Icon size={18} color={muted} /></InputGroup.Prefix>
          <InputGroup.Input
            testID={`${testID}-value`}
            value={display}
            placeholder={emptyLabel}
            editable={false}
            pointerEvents="none"
            className="h-12 rounded-xl bg-default"
            isInvalid={isInvalid}
          />
          {allowClear && valid && <InputGroup.Suffix>
            <Pressable
              testID={`${testID}-clear`}
              accessibilityRole="button"
              accessibilityLabel={t('dateField.clear')}
              className="size-11 items-center justify-center"
              onPress={(event) => { event.stopPropagation(); onChange(null); }}
            ><X size={18} color={muted} /></Pressable>
          </InputGroup.Suffix>}
        </InputGroup>
      </Pressable>
      {pickerSeed !== null && <Host>
        <ExpoDateTimePicker
          testID={pickerTestID}
          value={pickerSeed}
          mode={mode}
          presentation="dialog"
          locale={locale}
          accentColor={accent}
          themeVariant={theme === 'dark' ? 'dark' : 'light'}
          positiveButton={{ label: t('dateField.ok') }}
          negativeButton={{ label: t('dateField.cancel') }}
          minimumDate={mode === 'date' ? localNoon(minDate) : undefined}
          maximumDate={mode === 'date' ? localNoon(maxDate) : undefined}
          onValueChange={(_event, pickedDate) => {
            onChange(mode === 'date' ? localDateToIso(fromPickerValue(pickedDate)) : timeToHhmm(pickedDate));
            setPickerSeed(null);
          }}
          onDismiss={() => setPickerSeed(null)}
        />
      </Host>}
    </>
  );
}
