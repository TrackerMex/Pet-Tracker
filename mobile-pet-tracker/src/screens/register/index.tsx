import { Image } from 'expo-image';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { router } from 'expo-router';
import {
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
  TextField,
} from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { login, register } from '../../api/auth';
import type { FieldError as ApiFieldError } from '../../api/types';
import { BackButton } from '../../components/back-button';
import { useAuth } from '../../providers/auth-provider';
import { PingoFloat } from '../../components/pingo-float';
import { PasswordInput } from '../../components/password-input';
import { FormError } from '../../components/form-error';
import { useTranslate } from '../../providers/language-provider';
import { HomeEntrance } from '../home/home-entrance';

import { validateRegister, type FieldIssues, type RegisterValues } from '../../utils/account-rules';

type RegisterField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'password'
  | 'passwordConfirmation'
  | 'country';

type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

const registerFields = new Set<RegisterField>([
  'firstName',
  'lastName',
  'email',
  'phone',
  'password',
  'passwordConfirmation',
  'country',
]);

function isRegisterField(path: string): path is RegisterField {
  return registerFields.has(path as RegisterField);
}

function mapValidationErrors(errors: ApiFieldError[]): {
  fields: RegisterFieldErrors;
  general: string | null;
} {
  const fields: RegisterFieldErrors = {};
  const general: string[] = [];

  for (const error of errors) {
    if (isRegisterField(error.path)) {
      fields[error.path] = fields[error.path]
        ? `${fields[error.path]}\n${error.message}`
        : error.message;
    } else {
      general.push(error.message);
    }
  }

  return { fields, general: general.length > 0 ? general.join('\n') : null };
}

function deviceTimezone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

export function RegisterScreen() {
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
  // #183 R4: transición, la borra R7
  const [serverFieldErrors, setServerFieldErrors] = useState<Partial<Record<RegisterField, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const t = useTranslate();

  async function handleSubmit() {
    setFieldErrors({});
    setServerFieldErrors({});
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
        case 'validation': {
          const validation = mapValidationErrors(result.errors);
          setServerFieldErrors(validation.fields);
          setGeneralError(validation.general);
          return;
        }
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
          padding: 24,
          gap: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 96,
        }}
      >
        <HomeEntrance testID="register-header" index={0} className="gap-2">
          <View testID="register-top" className="flex-row items-center justify-between">
            <BackButton testID="register-back" fallback="/welcome" />
            <PingoFloat testID="register-pingo-float">
              <Image
                testID="register-pingo"
                source={require('../../../assets/images/pingo-clipboard.webp')}
                style={{ width: 56, height: 56 }}
              />
            </PingoFloat>
          </View>
          <Text className="text-3xl font-black text-foreground">
            {t('register.createAccount')}
          </Text>
        </HomeEntrance>

        <View testID="register-names-row" className="flex-row gap-3">
          <TextField className="flex-1" isInvalid={Boolean(fieldErrors.firstName ?? serverFieldErrors.firstName)}>
            <Label>
              <Label.Text className="text-13 font-semibold text-muted">
                {t('register.firstName')}
              </Label.Text>
            </Label>
            <Input
              testID="register-first-name"
              className="h-13 rounded-xl bg-default"
              value={firstName}
              onChangeText={setFirstName}
            />
            <FieldError testID="register-first-name-error">
              {fieldErrors.firstName || serverFieldErrors.firstName ? <FormError testID="register-first-name-message" message={fieldErrors.firstName ? t(fieldErrors.firstName.labelKey, fieldErrors.firstName.params) : serverFieldErrors.firstName ?? ''} /> : null}
            </FieldError>
          </TextField>
          <TextField className="flex-1" isInvalid={Boolean(fieldErrors.lastName ?? serverFieldErrors.lastName)}>
            <Label>
              <Label.Text className="text-13 font-semibold text-muted">
                {t('register.lastName')}
              </Label.Text>
            </Label>
            <Input
              testID="register-last-name"
              className="h-13 rounded-xl bg-default"
              value={lastName}
              onChangeText={setLastName}
            />
            <FieldError testID="register-last-name-error">
              {fieldErrors.lastName || serverFieldErrors.lastName ? <FormError testID="register-last-name-message" message={fieldErrors.lastName ? t(fieldErrors.lastName.labelKey, fieldErrors.lastName.params) : serverFieldErrors.lastName ?? ''} /> : null}
            </FieldError>
          </TextField>
        </View>

        <TextField isInvalid={Boolean(fieldErrors.email ?? serverFieldErrors.email)}>
          <Label>
            <Label.Text className="text-13 font-semibold text-muted">
              {t('register.email')}
            </Label.Text>
          </Label>
          <Input
            testID="register-email"
            className="h-13 rounded-xl bg-default"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <FieldError testID="register-email-error">
            {fieldErrors.email || serverFieldErrors.email ? <FormError testID="register-email-message" message={fieldErrors.email ? t(fieldErrors.email.labelKey, fieldErrors.email.params) : serverFieldErrors.email ?? ''} /> : null}
          </FieldError>
        </TextField>

        <View testID="register-contact-row" className="flex-row gap-3">
          <TextField className="flex-2" isInvalid={Boolean(fieldErrors.phone ?? serverFieldErrors.phone)}>
            <Label>
              <Label.Text className="text-13 font-semibold text-muted">
                {t('register.phone')}
              </Label.Text>
            </Label>
            <Input
              testID="register-phone"
              className="h-13 rounded-xl bg-default"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <FieldError testID="register-phone-error">
              {fieldErrors.phone || serverFieldErrors.phone ? <FormError testID="register-phone-message" message={fieldErrors.phone ? t(fieldErrors.phone.labelKey, fieldErrors.phone.params) : serverFieldErrors.phone ?? ''} /> : null}
            </FieldError>
          </TextField>
          <TextField className="flex-1" isInvalid={Boolean(fieldErrors.country ?? serverFieldErrors.country)}>
            <Label>
              <Label.Text className="text-13 font-semibold text-muted">
                {t('register.country')}
              </Label.Text>
            </Label>
            <Input
              testID="register-country"
              className="h-13 rounded-xl bg-default"
              autoCapitalize="characters"
              maxLength={2}
              value={country}
              onChangeText={(value) => setCountry(value.toUpperCase())}
            />
            <FieldError testID="register-country-error">
              {fieldErrors.country || serverFieldErrors.country ? <FormError testID="register-country-message" message={fieldErrors.country ? t(fieldErrors.country.labelKey, fieldErrors.country.params) : serverFieldErrors.country ?? ''} /> : null}
            </FieldError>
          </TextField>
        </View>

        <TextField isInvalid={Boolean(fieldErrors.password ?? serverFieldErrors.password)}>
          <Label>
            <Label.Text className="text-13 font-semibold text-muted">
              {t('register.password')}
            </Label.Text>
          </Label>
          <PasswordInput
            testID="register-password"
            value={password}
            onChangeText={setPassword}
          />
          <FieldError testID="register-password-error">
            {fieldErrors.password || serverFieldErrors.password ? <FormError testID="register-password-message" message={fieldErrors.password ? t(fieldErrors.password.labelKey, fieldErrors.password.params) : serverFieldErrors.password ?? ''} /> : null}
          </FieldError>
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.passwordConfirmation ?? serverFieldErrors.passwordConfirmation)}>
          <Label>
            <Label.Text className="text-13 font-semibold text-muted">
              {t('register.confirmPassword')}
            </Label.Text>
          </Label>
          <PasswordInput
            testID="register-password-confirmation"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
          />
          <FieldError testID="register-password-confirmation-error">
            {fieldErrors.passwordConfirmation || serverFieldErrors.passwordConfirmation ? <FormError testID="register-password-confirmation-message" message={fieldErrors.passwordConfirmation ? t(fieldErrors.passwordConfirmation.labelKey, fieldErrors.passwordConfirmation.params) : serverFieldErrors.passwordConfirmation ?? ''} /> : null}
          </FieldError>
        </TextField>

        <View className="flex-row items-center gap-3">
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

        <View testID="register-spacer" className="flex-1" />

        <Button
          testID="register-submit"
          className="w-full h-14 rounded-xl bg-accent border-b-4 border-black/25"
          isDisabled={!terms || submitting}
          onPress={() => void handleSubmit()}
        >
          <Button.Label className="text-17 font-extrabold text-accent-foreground">
            {t('register.createAccount')}
          </Button.Label>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
