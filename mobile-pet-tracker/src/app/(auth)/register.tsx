import { router } from 'expo-router';
import {
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
  TextField,
} from 'heroui-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { login, register } from '../../api/auth';
import type { FieldError as ApiFieldError } from '../../api/types';
import { useAuth } from '../../providers/auth-provider';

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

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [country, setCountry] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { signIn } = useAuth();

  async function handleSubmit() {
    setSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      const result = await register(process.env.EXPO_PUBLIC_API_URL, {
        firstName,
        lastName,
        email,
        phone,
        password,
        passwordConfirmation,
        country,
        timezone: deviceTimezone(),
        termsAccepted: true,
      });

      switch (result.kind) {
        case 'ok': {
          const loginResult = await login(process.env.EXPO_PUBLIC_API_URL, {
            email,
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
          setGeneralError('Email already registered');
          return;
        case 'validation': {
          const validation = mapValidationErrors(result.errors);
          setFieldErrors(validation.fields);
          setGeneralError(validation.general);
          return;
        }
        case 'unreachable':
          setGeneralError('Cannot reach server');
          return;
        case 'error':
        case 'missing-config':
          setGeneralError('Something went wrong');
      }
    } catch {
      setGeneralError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-background" keyboardShouldPersistTaps="handled">
      <View className="gap-4 p-6">
        <Text className="text-center text-2xl font-black text-foreground">
          Create account
        </Text>

        <TextField isInvalid={Boolean(fieldErrors.firstName)}>
          <Label className="text-xs font-semibold text-foreground">
            First name
          </Label>
          <Input
            testID="register-first-name"
            className="rounded-xl bg-default"
            value={firstName}
            onChangeText={setFirstName}
          />
          <FieldError testID="register-first-name-error">
            {fieldErrors.firstName}
          </FieldError>
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.lastName)}>
          <Label className="text-xs font-semibold text-foreground">
            Last name
          </Label>
          <Input
            testID="register-last-name"
            className="rounded-xl bg-default"
            value={lastName}
            onChangeText={setLastName}
          />
          <FieldError testID="register-last-name-error">{fieldErrors.lastName}</FieldError>
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.email)}>
          <Label className="text-xs font-semibold text-foreground">Email</Label>
          <Input
            testID="register-email"
            className="rounded-xl bg-default"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <FieldError testID="register-email-error">{fieldErrors.email}</FieldError>
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.phone)}>
          <Label className="text-xs font-semibold text-foreground">Phone</Label>
          <Input
            testID="register-phone"
            className="rounded-xl bg-default"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <FieldError testID="register-phone-error">{fieldErrors.phone}</FieldError>
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.password)}>
          <Label className="text-xs font-semibold text-foreground">
            Password
          </Label>
          <Input
            testID="register-password"
            className="rounded-xl bg-default"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <FieldError testID="register-password-error">{fieldErrors.password}</FieldError>
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.passwordConfirmation)}>
          <Label className="text-xs font-semibold text-foreground">
            Confirm password
          </Label>
          <Input
            testID="register-password-confirmation"
            className="rounded-xl bg-default"
            secureTextEntry
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
          />
          <FieldError testID="register-password-confirmation-error">
            {fieldErrors.passwordConfirmation}
          </FieldError>
        </TextField>

        <TextField isInvalid={Boolean(fieldErrors.country)}>
          <Label className="text-xs font-semibold text-foreground">
            Country (2-letter code)
          </Label>
          <Input
            testID="register-country"
            className="rounded-xl bg-default"
            autoCapitalize="characters"
            maxLength={2}
            value={country}
            onChangeText={(value) => setCountry(value.toUpperCase())}
          />
          <FieldError testID="register-country-error">{fieldErrors.country}</FieldError>
        </TextField>

        <View className="flex-row items-center gap-3">
          <Checkbox
            testID="register-terms"
            isSelected={terms}
            onSelectedChange={setTerms}
          />
          <Text className="text-foreground">I accept the terms</Text>
        </View>

        {generalError ? (
          <Text testID="register-error" className="text-danger">
            {generalError}
          </Text>
        ) : null}

        <Button
          testID="register-submit"
          className="w-full rounded-2xl bg-accent"
          isDisabled={!terms || submitting}
          onPress={() => void handleSubmit()}
        >
          <Button.Label className="font-bold text-accent-foreground">
            Create account
          </Button.Label>
        </Button>
      </View>
    </ScrollView>
  );
}
