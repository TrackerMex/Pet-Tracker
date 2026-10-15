import { InputGroup } from 'heroui-native';
import { useState, type ComponentProps } from 'react';
import { Pressable } from 'react-native';
import { Eye, EyeOff } from 'reicon-react-native';

import { useTranslate } from '../providers/language-provider';
import { useThemeColors } from '../theme/use-theme-colors';

type PasswordInputProps = { testID: string } & Omit<
  ComponentProps<typeof InputGroup.Input>, 'testID' | 'secureTextEntry' | 'className'
>;

export function PasswordInput({ testID, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [muted] = useThemeColors(['muted']);
  const t = useTranslate();

  return (
    <InputGroup testID={`${testID}-group`}>
      <InputGroup.Input
        {...props}
        testID={testID}
        className="h-13 rounded-xl bg-default"
        secureTextEntry={!visible}
      />
      <InputGroup.Suffix>
        <Pressable
          testID={`${testID}-toggle`}
          className="size-11 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={visible ? t('common.hidePassword') : t('common.showPassword')}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          onPress={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={20} color={muted} /> : <Eye size={20} color={muted} />}
        </Pressable>
      </InputGroup.Suffix>
    </InputGroup>
  );
}
