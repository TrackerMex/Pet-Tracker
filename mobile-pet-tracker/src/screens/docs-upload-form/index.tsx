import { router, useLocalSearchParams } from 'expo-router';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { Button, Input, Label, TextField } from 'heroui-native';
import { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  confirmPetDocumentUpload,
  createPetDocument,
  uploadPhotoToUrl,
  type ConfirmPetDocumentUploadState,
  type CreatePetDocumentState,
  type DocumentContentType,
} from '../../api/media';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { civilTodayIso } from '../../utils/civil-today-iso';

type ActionError = 'file-too-large' | 'invalid-form' | 'upload-forbidden' | 'upload-failed' | 'unreachable' | 'unknown';

export function DocsUploadFormScreen({ petId }: { petId: string }) {
  const { uri, name: fileName, contentType } = useLocalSearchParams<{
    uri?: string;
    name?: string;
    contentType: DocumentContentType;
  }>();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, signOut } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const headerHeight = useContext(HeaderHeightContext);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(() => civilTodayIso(undefined));
  const [vet, setVet] = useState('');
  const [actionError, setActionError] = useState<ActionError | null>(null);
  const actionErrorText = actionError ? {
    'file-too-large': t('docs.errorFileTooLarge'),
    'invalid-form': t('docs.errorInvalidForm'),
    'upload-forbidden': t('docs.errorUploadForbidden'),
    'upload-failed': t('docs.errorUploadFailed'),
    unreachable: t('common.cannotReachServer'),
    unknown: t('common.somethingWentWrong'),
  }[actionError] : null;

  useEffect(() => {
    if (!uri || !fileName) router.back();
  }, [uri, fileName]);

  async function handleUploadError(
    kind: Exclude<CreatePetDocumentState['kind'] | ConfirmPetDocumentUploadState['kind'], 'ok'>,
  ) {
    switch (kind) {
      case 'unauthorized':
        await signOut();
        break;
      case 'invalid':
        setActionError('invalid-form');
        break;
      case 'forbidden':
        setActionError('upload-forbidden');
        break;
      case 'unreachable':
        setActionError('unreachable');
        break;
      case 'not-uploaded':
        setActionError('upload-failed');
        break;
      case 'too-large':
        setActionError('file-too-large');
        break;
      default:
        setActionError('unknown');
    }
  }

  async function submitDocument() {
    if (uploading || !uri || !fileName) return;
    setActionError(null);
    if (!type.trim() || !name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      setActionError('invalid-form');
      return;
    }
    setUploading(true);
    let readingAsset = true;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      readingAsset = false;
      const created = await createPetDocument(baseUrl, token ?? '', petId, {
        type: type.trim(),
        name: name.trim(),
        date: date.trim(),
        ...(vet.trim() ? { vet: vet.trim() } : {}),
      });
      if (created.kind !== 'ok') {
        await handleUploadError(created.kind);
        return;
      }
      const uploaded = await uploadPhotoToUrl(created.uploadUrl, blob, contentType);
      if (uploaded.kind !== 'ok') {
        setActionError('upload-failed');
        return;
      }
      const confirmed = await confirmPetDocumentUpload(baseUrl, token ?? '', petId, created.documentId);
      if (confirmed.kind !== 'ok') {
        await handleUploadError(confirmed.kind);
        return;
      }
      router.dismissTo({
        pathname: '/pets/[petId]/docs',
        params: { petId, uploaded: String(Date.now()) },
      });
    } catch {
      setActionError(readingAsset ? 'upload-failed' : 'unknown');
    } finally {
      setUploading(false);
    }
  }

  if (!uri || !fileName) return null;

  return (
    <KeyboardAvoidingView
      testID="docs-upload-keyboard-avoider"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="screen-docs-upload"
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}
      >
        <View testID="docs-upload-form" className="gap-4">
          <Text testID="docs-upload-file">{fileName}</Text>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              <Label.Text className="text-2xs font-semibold text-foreground">
                {t('docs.type')}
              </Label.Text>
            </Label>
            <Input
              testID="docs-type-input"
              className="rounded-xl bg-default"
              value={type}
              onChangeText={setType}
              maxLength={40}
            />
          </TextField>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              <Label.Text className="text-2xs font-semibold text-foreground">
                {t('docs.name')}
              </Label.Text>
            </Label>
            <Input
              testID="docs-name-input"
              className="rounded-xl bg-default"
              value={name}
              onChangeText={setName}
              maxLength={120}
            />
          </TextField>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              <Label.Text className="text-2xs font-semibold text-foreground">
                {t('docs.date')}
              </Label.Text>
            </Label>
            <Input
              testID="docs-date-input"
              className="rounded-xl bg-default"
              value={date}
              onChangeText={setDate}
              placeholder={t('docs.datePlaceholder')}
            />
          </TextField>
          <TextField>
            <Label className="text-2xs font-semibold text-foreground">
              <Label.Text className="text-2xs font-semibold text-foreground">
                {t('docs.vet')}
              </Label.Text>
            </Label>
            <Input
              testID="docs-vet-input"
              className="rounded-xl bg-default"
              value={vet}
              onChangeText={setVet}
              maxLength={120}
            />
          </TextField>
          <View testID="docs-upload-actions" className="gap-3">
            <Button
              testID="docs-upload-submit"
              className="rounded-xl bg-accent border-b-4 border-black/25"
              isDisabled={uploading}
              onPress={() => void submitDocument()}
            >
              <Button.Label className="font-bold text-accent-foreground">
                {t('docs.upload')}
              </Button.Label>
            </Button>
            <Button
              testID="docs-upload-cancel"
              className="rounded-xl border-2 border-b-6 border-lip-gray bg-surface"
              variant="outline"
              isDisabled={uploading}
              onPress={() => router.back()}
            >
              <Button.Label className="font-semibold">{t('docs.cancel')}</Button.Label>
            </Button>
          </View>
        </View>

        {actionErrorText ? (
          <Text testID="docs-action-error" selectable className="text-danger">
            {actionErrorText}
          </Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
