import { useQuery } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Button, Skeleton } from 'heroui-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, FileText, Upload } from 'reicon-react-native';

import {
  DOCUMENT_MAX_BYTES,
  listPetDocs,
  resolveDocumentContentType,
  type PetDocument,
} from '../../api/media';
import { getPet } from '../../api/pets';
import { mediaKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { EmptyState } from '../../components/empty-state';
import { ScreenHeader } from '../../components/screen-header';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import {
  CATEGORY_SLOTS,
  documentCategory,
  type CategorySlot,
} from '../../utils/category-palette';
import { fmtDate } from '../home/format';
import { HomeEntrance } from '../home/home-entrance';

const FILTER_SLOTS = [
  { slot: 'blue', labelKey: 'docs.categoryVaccination' },
  { slot: 'green', labelKey: 'docs.categoryCheckup' },
  { slot: 'amber', labelKey: 'docs.categoryDeworming' },
  { slot: 'violet', labelKey: 'docs.categoryAnalysis' },
  { slot: 'neutral', labelKey: 'docs.categoryOther' },
] as const;

const INK_TOKEN: Record<CategorySlot, string> = {
  blue: 'category-blue-strong',
  green: 'category-green-strong',
  amber: 'category-amber-strong',
  violet: 'category-violet-strong',
  rose: 'category-rose-strong',
  neutral: 'muted',
};

type ActionError = 'file-format' | 'file-too-large' | 'unknown';

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

export function DocsScreen({ petId, uploaded }: { petId: string; uploaded?: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const [uploadColor] = useThemeColors(['accent-strong']);
  const insets = useSafeAreaInsets();
  const [actionError, setActionError] = useState<ActionError | null>(null);
  const [filter, setFilter] = useState<'all' | CategorySlot>('all');
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const docs = useQuery({
    queryKey: mediaKeys.petDocs(petId),
    queryFn: () => listPetDocs(baseUrl, token ?? '', petId),
  });
  const { refetch: refetchDocs } = docs;
  useEffect(() => {
    if (!uploaded) return;
    void refetchDocs();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- #185 R2.3: el nonce confirma una subida y reinicia el filtro.
    setFilter('all');
  }, [uploaded, refetchDocs]);
  const petName = pet.data?.kind === 'ok' ? pet.data.pet.name : null;
  const presentSlots = FILTER_SLOTS.filter(({ slot }) =>
    docs.data?.kind === 'ok' && docs.data.docs.some((document) => documentCategory(document.type) === slot),
  );
  const visibleDocs = docs.data?.kind === 'ok'
    ? docs.data.docs.filter((document) => filter === 'all' || documentCategory(document.type) === filter)
    : [];
  const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';
  const actionErrorText = actionError ? {
    'file-format': t('docs.errorFileFormat'),
    'file-too-large': t('docs.errorFileTooLarge'),
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
      router.push({
        pathname: '/pets/[petId]/docs-upload',
        params: {
          petId, uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? '',
          size: String(asset.size ?? 0), contentType,
        },
      });
    }).catch(() => setActionError('unknown'));
  }

  function openDocument(document: PetDocument) {
    setActionError(null);
    void openBrowserAsync(document.downloadUrl).catch(() => setActionError('unknown'));
  }

  return (
    <KeyboardAvoidingView
      testID="docs-keyboard-avoider"
      className="flex-1"
      behavior="padding"
    >
      <ScrollView
        testID="screen-docs"
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 12,
          gap: 14,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <ScreenHeader
          testID="docs-header"
          backFallback="/profile"
          eyebrow={t('docs.documentsOf')}
          title={pet.data === undefined ? undefined : (petName ?? t('docs.pet'))}
          titlePlaceholder={pet.data === undefined
            ? <Skeleton testID="docs-header-skeleton" className="h-8 w-36 rounded-xl" />
            : undefined}
        />

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
            action={isOwner ? { label: t('docs.upload'), onPress: pickDocument } : undefined}
          />
        ) : null}

        {docs.data?.kind === 'ok' && docs.data.docs.length > 0 ? (
          <>
            <View testID="docs-filters" className="flex-row flex-wrap gap-1.5">
              {[{ slot: 'all', labelKey: 'docs.filterAll' } as const, ...presentSlots].map(({ slot, labelKey }) => {
                const selected = filter === slot;
                const palette = slot === 'all' ? null : CATEGORY_SLOTS[slot];
                const surface = selected ? 'bg-foreground' : palette?.surface ?? 'bg-default';
                const ink = selected ? 'text-background' : palette?.ink ?? 'text-foreground';
                return (
                  <Pressable
                    key={slot}
                    testID={`docs-filter-${slot}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setFilter(slot)}
                    hitSlop={TOUCH_SLOP}
                    className={`h-8.5 items-center justify-center rounded-full px-3 ${surface}`}
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                  >
                    <Text className={`text-13 font-extrabold ${ink}`}>{t(labelKey)}</Text>
                  </Pressable>
                );
              })}
            </View>
            {visibleDocs.map((document, index) => (
              <HomeEntrance key={document.id} index={index} testID={`docs-entry-${document.id}`}>
                <DocumentRow document={document} onPress={() => openDocument(document)} />
              </HomeEntrance>
            ))}
          </>
        ) : null}

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
        {isOwner && docs.data?.kind === 'ok' && docs.data.docs.length > 0 ? (
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

        {actionErrorText ? (
          <Text testID="docs-action-error" selectable className="text-danger">
            {actionErrorText}
          </Text>
        ) : null}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
