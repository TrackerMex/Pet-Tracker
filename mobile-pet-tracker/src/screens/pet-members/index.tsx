import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listPetMembers } from '../../api/pet-members';
import { getPet } from '../../api/pets';
import { memberKeys, petKeys, userKeys } from '../../api/query-keys';
import { getMe } from '../../api/users';
import { ScreenHeader } from '../../components/screen-header';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

export default function PetMembersScreen({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const petQuery = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const membersQuery = useQuery({
    queryKey: memberKeys.list(petId),
    queryFn: () => listPetMembers(baseUrl, token ?? '', petId),
  });
  const meQuery = useQuery({
    queryKey: userKeys.me(),
    queryFn: () => getMe(baseUrl, token ?? ''),
  });
  const queries = [petQuery, membersQuery, meQuery];
  const pet = petQuery.data?.kind === 'ok' ? petQuery.data.pet : null;
  const loading = queries.some((query) => query.data === undefined);
  const hasError = queries.some((query) => query.data && ['error', 'missing-config', 'unreachable'].includes(query.data.kind));
  const unreachable = queries.some((query) => query.data?.kind === 'unreachable');

  function retryAll() {
    if (petQuery.data?.kind !== 'ok') void petQuery.refetch();
    if (membersQuery.data?.kind !== 'ok') void membersQuery.refetch();
    if (meQuery.data?.kind !== 'ok') void meQuery.refetch();
  }

  return (
    <View testID="screen-pet-members" className="flex-1 bg-background">
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, gap: 12, flexGrow: 1 }}>
        <ScreenHeader
          testID="pet-members-header"
          backFallback="/profile"
          title={pet ? t('members.titleOf', { petName: pet.name }) : undefined}
          titlePlaceholder={pet === null ? <Skeleton testID="pet-members-header-skeleton" className="h-8 w-36 rounded-xl" /> : undefined}
        />
        {loading ? (
          <Skeleton testID="pet-members-loading" className="h-40 w-full rounded-card" />
        ) : hasError ? (
          <View testID="pet-members-error" className="items-start gap-3">
            <Text testID="pet-members-error-text" className="text-sm font-semibold text-danger" selectable>
              {unreachable ? t('common.cannotReachServer') : t('common.somethingWentWrong')}
            </Text>
            <Button testID="pet-members-retry" onPress={retryAll}>
              {t('common.retry')}
            </Button>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
