import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { Button, Input, Label, Skeleton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { userKeys } from '../../api/query-keys';
import { getMe, updateMe, type ProfileResponse, type UpdateProfileInput } from '../../api/users';
import { FieldErrorMessage } from '../../components/field-error-message';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { validateProfile, type FieldIssues, type ProfileValues } from '../../utils/account-rules';
import { useChunkyLip } from '../../theme/chunky-lip';

export function EditProfileScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const headerHeight = useContext(HeaderHeightContext);
  const { data } = useQuery({
    queryKey: userKeys.me(),
    queryFn: () => getMe(baseUrl, token ?? ''),
  });

  return (
    <KeyboardAvoidingView testID="edit-profile-keyboard-avoider" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>
      <ScrollView
        testID="screen-edit-profile"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
      >
        <Text testID="edit-profile-title" className="text-3xl font-black text-foreground">{t('profile.editProfile')}</Text>
        {data === undefined ? (
          <Skeleton testID="edit-profile-skeleton" className="h-13 w-full rounded-xl" />
        ) : data.kind !== 'ok' ? (
          <Text testID="edit-profile-state" className="font-normal text-muted">{t('profile.accountUnavailable')}</Text>
        ) : (
          <EditProfileForm me={data.me} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function EditProfileForm({ me }: { me: ProfileResponse }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const chunkyLip = useChunkyLip();
  const t = useTranslate();
  const [firstName, setFirstName] = useState(me.firstName);
  const [lastName, setLastName] = useState(me.lastName);
  const [phone, setPhone] = useState(me.phone);
  const [country, setCountry] = useState(me.country);
  const [fieldErrors, setFieldErrors] = useState<FieldIssues<keyof ProfileValues>>({});

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting) return;
    const issues = validateProfile({ firstName, lastName, phone, country });
    setFieldErrors(issues);
    if (Object.keys(issues).length > 0) return;

    const changes: UpdateProfileInput = {};
    if (firstName.trim() !== me.firstName) changes.firstName = firstName.trim();
    if (lastName.trim() !== me.lastName) changes.lastName = lastName.trim();
    if (phone.trim() !== me.phone) changes.phone = phone.trim();
    if (country !== me.country) changes.country = country;
    if (Object.keys(changes).length === 0) {
      router.back();
      return;
    }

    setSubmitting(true);
    try {
      const result = await updateMe(baseUrl, token ?? '', changes);
      if (result.kind === 'ok') {
        queryClient.setQueryData(userKeys.me(), { kind: 'ok', me: result.me });
        router.back();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View testID="edit-profile-form" className="gap-4">
      <TextField isInvalid={Boolean(fieldErrors.firstName)}>
        <Label><Text className="text-13 font-semibold text-muted">{t('register.firstName')}</Text></Label>
        <Input testID="edit-profile-first-name" className="h-13 rounded-xl bg-default" value={firstName} onChangeText={setFirstName} />
        <FieldErrorMessage testID="edit-profile-first-name" issue={fieldErrors.firstName} />
      </TextField>
      <TextField isInvalid={Boolean(fieldErrors.lastName)}>
        <Label><Text className="text-13 font-semibold text-muted">{t('register.lastName')}</Text></Label>
        <Input testID="edit-profile-last-name" className="h-13 rounded-xl bg-default" value={lastName} onChangeText={setLastName} />
        <FieldErrorMessage testID="edit-profile-last-name" issue={fieldErrors.lastName} />
      </TextField>
      <TextField isInvalid={Boolean(fieldErrors.phone)}>
        <Label><Text className="text-13 font-semibold text-muted">{t('register.phone')}</Text></Label>
        <Input testID="edit-profile-phone" className="h-13 rounded-xl bg-default" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <FieldErrorMessage testID="edit-profile-phone" issue={fieldErrors.phone} />
      </TextField>
      <TextField isInvalid={Boolean(fieldErrors.country)}>
        <Label><Text className="text-13 font-semibold text-muted">{t('register.country')}</Text></Label>
        <Input testID="edit-profile-country" className="h-13 rounded-xl bg-default" value={country} onChangeText={(value) => setCountry(value.toUpperCase())} autoCapitalize="characters" maxLength={2} />
        <FieldErrorMessage testID="edit-profile-country" issue={fieldErrors.country} />
      </TextField>
      <Button testID="edit-profile-save" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} isDisabled={submitting} onPress={() => void handleSubmit()}>
        <Text className="text-17 font-extrabold text-accent-foreground">{t('editProfile.save')}</Text>
      </Button>
    </View>
  );
}
