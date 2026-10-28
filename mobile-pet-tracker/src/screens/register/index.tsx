import { useChunkyLip } from '../../theme/chunky-lip';
import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import {
  Button,
  Checkbox,
  Input,
  Label,
  TextField,
} from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { login, register } from '../../api/auth';
import { BackButton } from '../../components/back-button';
import { useAuth } from '../../providers/auth-provider';
import { OrbitFloat } from '../../components/orbit-float';
import { PasswordInput } from '../../components/password-input';
import { FormError } from '../../components/form-error';
import { FieldErrorMessage } from '../../components/field-error-message';
import { useTranslate } from '../../providers/language-provider';
import { RiseIn } from '@/components/rise-in';

import { validateRegister, type FieldIssues, type RegisterValues } from '../../utils/account-rules';

type RegisterField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'password'
  | 'passwordConfirmation'
  | 'country';

function deviceTimezone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

export function RegisterScreen() {
  const chunkyLip = useChunkyLip();
  const headerHeight = useContext(HeaderHeightContext);
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [country, setCountry] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<RegisterField>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const t = useTranslate();

  async function handleSubmit() {
    setFieldErrors({});
    setGeneralError(null);
    const values: RegisterValues = {
      firstName, lastName, email: email.trim(), phone, country, password, passwordConfirmation,
    };
    const issues = validateRegister(values);
    if (Object.keys(issues).length > 0) {
      setFieldErrors(issues);
      return;
    }
    setSubmitting(true);

    try {
      const result = await register(process.env.EXPO_PUBLIC_API_URL, {
        ...values,
        timezone: deviceTimezone(),
        termsAccepted: true,
      });

      switch (result.kind) {
        case 'ok': {
          const loginResult = await login(process.env.EXPO_PUBLIC_API_URL, {
            email: values.email,
            password,
          });

          if (loginResult.kind === 'ok') {
            await signIn(loginResult.accessToken);
            router.replace('/home');
          } else {
            router.replace('/login');
          }
          return;
        }
        case 'email-taken':
          setGeneralError(t('register.emailAlreadyRegistered'));
          return;
        case 'validation':
          setGeneralError(t('validation.checkDetails'));
          return;
        case 'unreachable':
          setGeneralError(t('common.cannotReachServer'));
          return;
        case 'error':
        case 'missing-config':
          setGeneralError(t('common.somethingWentWrong'));
      }
    } catch {
      setGeneralError(t('common.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      testID="screen-register"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="register-form"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 96,
        }}
      >
        <View testID="register-header" className="gap-2">
          <View testID="register-top" className="-ml-2.5 flex-row items-center justify-between">
            <BackButton testID="register-back" fallback="/welcome" />
            <OrbitFloat testID="register-orbit-float">
              <Image
                testID="register-orbit"
                source={require('../../../assets/images/orbit-clipboard.webp')}
                style={{ width: 56, height: 56 }}
              />
            </OrbitFloat>
          </View>
          <Text className="text-3xl font-black tracking-display text-foreground">
            {t('register.createAccount')}
          </Text>
        </View>

        <RiseIn testID="register-body" delayMs={0} className="mt-4.5 gap-3">
          <View testID="register-names-row" className="flex-row gap-3">
            <TextField className="flex-1" isInvalid={Boolean(fieldErrors.firstName)}>
              <Label>
                <Text className="text-13 font-semibold text-muted">
                  {t('register.firstName')}
                </Text>
              </Label>
              <Input
                testID="register-first-name"
                className="h-13 rounded-xl bg-default"
                value={firstName}
                onChangeText={setFirstName}
              />
              <FieldErrorMessage testID="register-first-name" issue={fieldErrors.firstName} />
            </TextField>
            <TextField className="flex-1" isInvalid={Boolean(fieldErrors.lastName)}>
              <Label>
                <Text className="text-13 font-semibold text-muted">
                  {t('register.lastName')}
                </Text>
              </Label>
              <Input
                testID="register-last-name"
                className="h-13 rounded-xl bg-default"
                value={lastName}
                onChangeText={setLastName}
              />
              <FieldErrorMessage testID="register-last-name" issue={fieldErrors.lastName} />
            </TextField>
          </View>

          <TextField isInvalid={Boolean(fieldErrors.email)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('register.email')}
              </Text>
            </Label>
            <Input
              testID="register-email"
              className="h-13 rounded-xl bg-default"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <FieldErrorMessage testID="register-email" issue={fieldErrors.email} />
          </TextField>

          <View testID="register-contact-row" className="flex-row gap-3">
            <TextField className="flex-2" isInvalid={Boolean(fieldErrors.phone)}>
              <Label>
                <Text className="text-13 font-semibold text-muted">
                  {t('register.phone')}
                </Text>
              </Label>
              <Input
                testID="register-phone"
                className="h-13 rounded-xl bg-default"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <FieldErrorMessage testID="register-phone" issue={fieldErrors.phone} />
            </TextField>
            <TextField className="flex-1" isInvalid={Boolean(fieldErrors.country)}>
              <Label>
                <Text className="text-13 font-semibold text-muted">
                  {t('register.country')}
                </Text>
              </Label>
              <Input
                testID="register-country"
                className="h-13 rounded-xl bg-default"
                autoCapitalize="characters"
                maxLength={2}
                value={country}
                onChangeText={(value) => setCountry(value.toUpperCase())}
              />
              <FieldErrorMessage testID="register-country" issue={fieldErrors.country} />
            </TextField>
          </View>

          <TextField isInvalid={Boolean(fieldErrors.password)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('register.password')}
              </Text>
            </Label>
            <PasswordInput
              testID="register-password"
              value={password}
              onChangeText={setPassword}
            />
            <FieldErrorMessage testID="register-password" issue={fieldErrors.password} />
          </TextField>

          <TextField isInvalid={Boolean(fieldErrors.passwordConfirmation)}>
            <Label>
              <Text className="text-13 font-semibold text-muted">
                {t('register.confirmPassword')}
              </Text>
            </Label>
            <PasswordInput
              testID="register-password-confirmation"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
            />
            <FieldErrorMessage testID="register-password-confirmation" issue={fieldErrors.passwordConfirmation} />
          </TextField>

          <View className="min-h-11 flex-row items-center gap-3">
            <Checkbox
              testID="register-terms"
              isSelected={terms}
              onSelectedChange={setTerms}
            />
            <Text className="text-15 font-medium text-foreground">{t('register.iAcceptTerms')}</Text>
          </View>

          {generalError ? (
            <FormError testID="register-error" message={generalError} />
          ) : null}
        </RiseIn>

        <View testID="register-spacer" className="flex-1" />

        <Button
          testID="register-submit"
          className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary}
          isDisabled={!terms || submitting}
          onPress={() => void handleSubmit()}
        >
          <Text className="text-17 font-extrabold text-accent-foreground">
            {t('register.createAccount')}
          </Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
