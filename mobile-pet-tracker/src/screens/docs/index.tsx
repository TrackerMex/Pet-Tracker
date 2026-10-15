import { useQuery } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { openBrowserAsync } from 'expo-web-browser';
import { Button, Input, Label, Skeleton, TextField } from 'heroui-native';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, FileText, Upload } from 'reicon-react-native';

import {
  confirmPetDocumentUpload,
  createPetDocument,
  DOCUMENT_MAX_BYTES,
  listPetDocs,
  resolveDocumentContentType,
  uploadPhotoToUrl,
  type ConfirmPetDocumentUploadState,
  type CreatePetDocumentState,
  type DocumentContentType,
  type PetDocument,
} from '../../api/media';
import { getPet } from '../../api/pets';
import { mediaKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useThemeColors } from '../../theme/use-theme-colors';
import {
  CATEGORY_SLOTS,
  documentCategory,
  type CategorySlot,
} from '../../utils/category-palette';
import { civilTodayIso } from '../../utils/civil-today-iso';
import { fmtDate } from '../home/format';
import { HomeEntrance } from '../home/home-entrance';

const INK_TOKEN: Record<CategorySlot, string> = {
  blue: 'category-blue-strong',
  green: 'category-green-strong',
  amber: 'category-amber-strong',
  violet: 'category-violet-strong',
  rose: 'category-rose-strong',
  neutral: 'muted',
};

type ActionError =
  | 'file-format'
  | 'file-too-large'
  | 'invalid-form'
  | 'upload-forbidden'
  | 'upload-failed'
  | 'unreachable'
  | 'unknown';
type SelectedDocument = {
  asset: DocumentPicker.DocumentPickerAsset;
  contentType: DocumentContentType;
};

function DocumentRow({ document, onPress }: { document: PetDocument; onPress: () => void }) {
  const slotName = documentCategory(document.type);
  const slot = CATEGORY_SLOTS[slotName];
  const [iconColor, muted] = useThemeColors([INK_TOKEN[slotName], 'muted']);
  const locale = useLocale();

  return (
    <Card testID={`doc-${document.id}`} className="flex-row items-center gap-3 px-3.5 py-3 shadow-none" onPress={onPress}>
      <View
        testID={`docs-mosaic-${document.id}`}
        className={`h-14 w-12 items-center justify-center rounded-xl ${slot.surface}`}
        style={CONTINUOUS_CORNER}
      >
        <FileText size={24} color={iconColor} />
      </View>
      <View className="min-w-0 flex-1 gap-0.75">
        <Text
          className={`self-start rounded-full px-2 py-0.5 text-11 font-extrabold ${slot.surface} ${slot.ink}`}
        >
          {document.type}
        </Text>
        <Text className="text-15 font-extrabold text-foreground" numberOfLines={1}>{document.name}</Text>
        <Text className="text-xs font-normal text-muted">{fmtDate(document.date, locale)}</Text>
      </View>
      <ChevronRight size={18} color={muted} />
    </Card>
  );
}

export function DocsScreen({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, signOut } = useAuth();
  const t = useTranslate();
  const [uploadColor] = useThemeColors(['accent-strong']);
  const insets = useSafeAreaInsets();
  const headerHeight = useContext(HeaderHeightContext);
  const [selectedDocument, setSelectedDocument] = useState<SelectedDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(() => civilTodayIso(undefined));
  const [vet, setVet] = useState('');
  const [actionError, setActionError] = useState<ActionError | null>(null);
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const docs = useQuery({
    queryKey: mediaKeys.petDocs(petId),
    queryFn: () => listPetDocs(baseUrl, token ?? '', petId),
  });
  const petName = pet.data?.kind === 'ok' ? pet.data.pet.name : null;
  const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';
  const actionErrorText = actionError ? {
    'file-format': t('docs.errorFileFormat'),
    'file-too-large': t('docs.errorFileTooLarge'),
    'invalid-form': t('docs.errorInvalidForm'),
    'upload-forbidden': t('docs.errorUploadForbidden'),
    'upload-failed': t('docs.errorUploadFailed'),
    unreachable: t('common.cannotReachServer'),
    unknown: t('common.somethingWentWrong'),
  }[actionError] : null;

  function pickDocument() {
    setActionError(null);
    void DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      copyToCacheDirectory: true,
      multiple: false,
    }).then((result) => {
      if (result.canceled) return;
      const asset = result.assets[0];
      const contentType = resolveDocumentContentType(asset.mimeType, asset.name);
      if (!contentType) {
        setActionError('file-format');
        return;
      }
      if (asset.size !== undefined && asset.size > DOCUMENT_MAX_BYTES) {
        setActionError('file-too-large');
        return;
      }
      setSelectedDocument({ asset, contentType });
    }).catch(() => setActionError('unknown'));
  }

  function cancelUpload() {
    setSelectedDocument(null);
    setType('');
    setName('');
    setDate(civilTodayIso(undefined));
    setVet('');
    setActionError(null);
  }

  function openDocument(document: PetDocument) {
    setActionError(null);
    void openBrowserAsync(document.downloadUrl).catch(() => setActionError('unknown'));
  }

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
    if (uploading || !selectedDocument) return;
    setActionError(null);
    if (!type.trim() || !name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      setActionError('invalid-form');
      return;
    }
    setUploading(true);
    let readingAsset = true;
    try {
      const response = await fetch(selectedDocument.asset.uri);
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
      const uploaded = await uploadPhotoToUrl(created.uploadUrl, blob, selectedDocument.contentType);
      if (uploaded.kind !== 'ok') {
        setActionError('upload-failed');
        return;
      }
      const confirmed = await confirmPetDocumentUpload(baseUrl, token ?? '', petId, created.documentId);
      if (confirmed.kind !== 'ok') {
        await handleUploadError(confirmed.kind);
        return;
      }
      await docs.refetch();
      cancelUpload();
    } catch {
      setActionError(readingAsset ? 'upload-failed' : 'unknown');
    } finally {
      setUploading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      testID="docs-keyboard-avoider"
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        testID="screen-docs"
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          gap: 14,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View>
          <Text className="text-11 font-extrabold uppercase tracking-eyebrow text-muted">
            {t('docs.documentsOf')}
          </Text>
          {pet.data === undefined ? (
            <Skeleton testID="docs-header-skeleton" className="h-8 w-36 rounded-xl" />
          ) : (
            <Text className="text-26 font-black tracking-title text-foreground">
              {petName ?? t('docs.pet')}
            </Text>
          )}
        </View>

        {docs.data === undefined ? (
          <View testID="docs-list-skeleton" className="gap-3.5">
            <Skeleton className="h-20 w-full rounded-card" />
            <Skeleton className="h-20 w-full rounded-card" />
            <Skeleton className="h-20 w-full rounded-card" />
          </View>
        ) : null}

        {docs.data?.kind === 'ok' && docs.data.docs.length === 0 ? (
          <EmptyState
            testID="docs-empty"
            pose="health"
            title={t('docs.noDocumentsYet')}
            body={t('docs.emptyBody')}
            action={isOwner && !selectedDocument ? { label: t('docs.upload'), onPress: pickDocument } : undefined}
          />
        ) : null}

        {docs.data?.kind === 'ok'
          ? docs.data.docs.map((document, index) => (
              <HomeEntrance key={document.id} index={index} testID={`docs-entry-${document.id}`}>
                <DocumentRow document={document} onPress={() => openDocument(document)} />
              </HomeEntrance>
            ))
          : null}

        {docs.data && docs.data.kind !== 'ok' ? (
          <Card testID="docs-error" className="items-start gap-3">
            <Text className="font-normal text-danger">
              {t('docs.couldNotLoadDocuments')}
            </Text>
            <Button testID="docs-retry" onPress={() => void docs.refetch()}>
              <Button.Label>{t('common.retry')}</Button.Label>
            </Button>
          </Card>
        ) : null}
        {isOwner && !selectedDocument && docs.data?.kind === 'ok' && docs.data.docs.length > 0 ? (
          <Pressable
            testID="docs-upload"
            accessibilityRole="button"
            className="mt-1.5 items-center gap-1.5 rounded-24 border-2 border-dashed border-lip-gray p-4.5"
            style={({ pressed }) => ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.8 : 1 })}
            onPress={pickDocument}
          >
            <View className="size-12 items-center justify-center rounded-full bg-surface-secondary">
              <Upload size={22} color={uploadColor} />
            </View>
            <Text className="text-15 font-extrabold text-foreground">{t('docs.upload')}</Text>
            <Text className="text-center text-xs font-normal text-muted">{t('docs.uploadHint')}</Text>
          </Pressable>
        ) : null}

        {selectedDocument ? (
          <View testID="docs-upload-form">
            <Text testID="docs-upload-file">{selectedDocument.asset.name}</Text>
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
              onPress={cancelUpload}
            >
              <Button.Label className="font-semibold">{t('docs.cancel')}</Button.Label>
            </Button>
          </View>
        ) : null}

        {actionErrorText ? (
          <Text testID="docs-action-error" selectable className="text-danger">
            {actionErrorText}
          </Text>
        ) : null}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
