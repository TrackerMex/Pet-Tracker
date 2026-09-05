import { router } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'reicon-react-native';

import { listPetDocs, type PetDocument } from '../../api/media';
import { getPet } from '../../api/pets';
import { Card } from '../../components/card';
import { useApi } from '../../hooks/use-api';
import { useAuth } from '../../providers/auth-provider';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';

function DocumentRow({ document }: { document: PetDocument }) {
  return (
    <Card testID={`doc-${document.id}`} className="flex-row items-center gap-3">
      <View
        className="size-10 items-center justify-center rounded-xl bg-accent-soft"
        style={CONTINUOUS_CORNER}
      >
        <Text className="text-lg">📄</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="self-start rounded-full bg-default px-2 py-0.5 text-2xs font-bold text-muted">
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
  const insets = useSafeAreaInsets();
  const [foreground] = useThemeColors(['foreground']);
  const petFn = useCallback(
    () => getPet(baseUrl, token ?? '', petId),
    [baseUrl, petId, token],
  );
  const docsFn = useCallback(
    () => listPetDocs(baseUrl, token ?? '', petId),
    [baseUrl, petId, token],
  );
  const pet = useApi(petFn);
  const docs = useApi(docsFn);
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
          accessibilityLabel="Back to profile"
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
            Documentos de
          </Text>
          {pet.data === undefined ? (
            <Skeleton testID="docs-header-skeleton" className="h-8 w-36 rounded-xl" />
          ) : (
            <Text className="text-2xl font-black text-foreground">
              {petName ?? 'Pet'}
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
          <Text className="text-lg font-bold text-foreground">No documents yet</Text>
          <Text className="text-center font-normal text-muted">
            Medical documents will appear here.
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
          <Text className="font-normal text-danger">Could not load documents</Text>
          <Button testID="docs-retry" onPress={docs.refetch}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </Card>
      ) : null}
    </ScrollView>
  );
}
