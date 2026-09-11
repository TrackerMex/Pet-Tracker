import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'reicon-react-native';

import { listPetDocs, type PetDocument } from '../../api/media';
import { getPet } from '../../api/pets';
import { mediaKeys, petKeys } from '../../api/query-keys';
import { Card } from '../../components/card';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import {
  CATEGORY_SLOTS,
  documentCategory,
} from '../../utils/category-palette';

function DocumentRow({ document }: { document: PetDocument }) {
  const slot = CATEGORY_SLOTS[documentCategory(document.type)];

  return (
    <Card testID={`doc-${document.id}`} className="flex-row items-center gap-3">
      <View
        className={`size-10 items-center justify-center rounded-xl ${slot.surface}`}
        style={CONTINUOUS_CORNER}
      >
        <Text className="text-lg">📄</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text
          className={`self-start rounded-full px-2 py-0.5 text-2xs font-bold ${slot.surface} ${slot.ink}`}
        >
          {document.type}
        </Text>
        <Text className="font-bold text-foreground">{document.name}</Text>
        <Text className="text-sm font-normal text-muted">{document.date}</Text>
      </View>
    </Card>
  );
}

export function DocsScreen({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [foreground] = useThemeColors(['foreground']);
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const docs = useQuery({
    queryKey: mediaKeys.petDocs(petId),
    queryFn: () => listPetDocs(baseUrl, token ?? '', petId),
  });
  const petName = pet.data?.kind === 'ok' ? pet.data.pet.name : null;

  return (
    <ScrollView
      testID="screen-docs"
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 96,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel={t('docs.backToProfile')}
          accessibilityRole="button"
          testID="docs-back"
          hitSlop={TOUCH_SLOP}
          className="size-10 items-center justify-center rounded-full bg-default"
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={foreground} />
        </Pressable>
        <View className="flex-1 gap-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t('docs.documentsOf')}
          </Text>
          {pet.data === undefined ? (
            <Skeleton testID="docs-header-skeleton" className="h-8 w-36 rounded-xl" />
          ) : (
            <Text className="text-2xl font-black text-foreground">
              {petName ?? t('docs.pet')}
            </Text>
          )}
        </View>
      </View>

      {docs.data === undefined ? (
        <View testID="docs-list-skeleton" className="gap-3">
          <Skeleton className="h-24 w-full rounded-card" />
          <Skeleton className="h-24 w-full rounded-card" />
          <Skeleton className="h-24 w-full rounded-card" />
        </View>
      ) : null}

      {docs.data?.kind === 'ok' && docs.data.docs.length === 0 ? (
        <Card testID="docs-empty" className="items-center gap-2 py-8">
          <Text className="text-lg font-bold text-foreground">
            {t('docs.noDocumentsYet')}
          </Text>
          <Text className="text-center font-normal text-muted">
            {t('docs.emptyBody')}
          </Text>
        </Card>
      ) : null}

      {docs.data?.kind === 'ok'
        ? docs.data.docs.map((document) => (
            <DocumentRow key={document.id} document={document} />
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
    </ScrollView>
  );
}
