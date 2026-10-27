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
import { CATEGORY_SLOTS } from '../../utils/category-palette';
import { memberInitials } from '../../utils/pet-members';

const MEMBER_AVATAR_SLOTS = ['blue', 'violet', 'amber', 'green', 'rose'] as const;

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
  const members = membersQuery.data?.kind === 'ok' ? membersQuery.data.members : null;
  const me = meQuery.data?.kind === 'ok' ? meQuery.data.me : null;
  const isOwner = pet?.myRole === 'owner';
  const loading = queries.some((query) => query.data === undefined);
  const hasError = queries.some((query) => query.data && ['error', 'missing-config', 'unreachable'].includes(query.data.kind));
  const unreachable = queries.some((query) => query.data?.kind === 'unreachable');

  function retryAll() {
    if (petQuery.data?.kind !== 'ok') void petQuery.refetch();
    if (membersQuery.data?.kind !== 'ok') void membersQuery.refetch();
    if (meQuery.data?.kind !== 'ok') void meQuery.refetch();
  }

  let otherIndex = 0;
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
        {pet && members && me ? (
          <>
            {isOwner ? <Text testID="pet-members-intro" className="text-sm leading-note text-muted">{t('members.ownerIntro', { petName: pet.name })}</Text> : null}
            <Text testID="pet-members-heading" accessibilityRole="header" className="text-sm font-extrabold text-foreground">
              {t('members.membersHeading')}
            </Text>
            <View testID="pet-members-list" className="rounded-card bg-surface border border-border px-3.5">
              {members.map((member) => {
                const slot = member.userId === me.id ? 'neutral' : MEMBER_AVATAR_SLOTS[otherIndex++ % MEMBER_AVATAR_SLOTS.length];
                const name = `${member.firstName} ${member.lastName}`.trim();
                const canRemove = isOwner && member.userId !== me.id && member.role !== 'owner';
                const rolePill = (
                  <View testID={`member-row-${member.userId}-role`} className={`rounded-full px-2 py-0.75 ${CATEGORY_SLOTS[member.role === 'owner' ? 'green' : 'rose'].surface}`}>
                    <Text className={`text-xs font-extrabold ${CATEGORY_SLOTS[member.role === 'owner' ? 'green' : 'rose'].ink}`}>
                      {member.role === 'owner' ? t('members.roleOwner') : t('members.roleFamily')}
                    </Text>
                  </View>
                );
                return (
                  <View key={member.userId} testID={`member-row-${member.userId}`} className="flex-row items-center gap-2.5 py-3">
                    <View testID={`member-row-${member.userId}-avatar`} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className={`size-9.5 items-center justify-center rounded-full ${CATEGORY_SLOTS[slot].surface}`}>
                      <Text className={`text-sm font-black ${CATEGORY_SLOTS[slot].ink}`}>{memberInitials(member.firstName, member.lastName)}</Text>
                    </View>
                    <View className="flex-1 gap-1">
                      <Text testID={`member-row-${member.userId}-name`} className="text-sm font-extrabold text-foreground">{name}</Text>
                      {member.userId === me.id ? <Text testID={`member-row-${member.userId}-you`} className="text-xs font-semibold text-muted">{t('members.you')}</Text> : null}
                      {canRemove ? rolePill : null}
                    </View>
                    {canRemove ? (
                      <Button testID={`member-row-${member.userId}-remove`} variant="danger-soft" className={`h-11 rounded-14 px-3 ${CATEGORY_SLOTS.rose.surface}`} accessibilityLabel={t('members.removeA11y', { name })}>
                        <Text className="text-13 font-extrabold text-danger">{t('members.remove')}</Text>
                      </Button>
                    ) : rolePill}
                  </View>
                );
              })}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
