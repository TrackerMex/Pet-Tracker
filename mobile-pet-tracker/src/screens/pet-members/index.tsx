import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Skeleton } from 'heroui-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InfoCircle, Key, Logout } from 'reicon-react-native';

import { listPetInvites, listPetMembers, removePetMember, revokePetInvite, type PetMember } from '../../api/pet-members';
import { getPet } from '../../api/pets';
import { inviteKeys, memberKeys, petKeys, userKeys } from '../../api/query-keys';
import { getMe } from '../../api/users';
import { ScreenHeader } from '../../components/screen-header';
import { useAuth } from '../../providers/auth-provider';
import { useLocale, useTranslate } from '../../providers/language-provider';
import { useSelectedPet } from '../../providers/selected-pet-provider';
import { useChunkyLip } from '../../theme/chunky-lip';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS, type CategorySlot } from '../../utils/category-palette';
import { inviteDateParts, memberInitials } from '../../utils/pet-members';

const MEMBER_AVATAR_SLOTS = ['blue', 'violet', 'amber', 'green', 'rose'] as const;

export default function PetMembersScreen({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token, signOut } = useAuth();
  const t = useTranslate();
  const locale = useLocale();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { clearPet } = useSelectedPet();
  const chunkyLip = useChunkyLip();
  const [surface] = useThemeColors(['surface']);
  const [amberStrong, foreground, danger] = useThemeColors(['category-amber-strong', 'foreground', 'danger']);
  const [removing, setRemoving] = useState<{ member: PetMember; slot: CategorySlot } | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [actionError, setActionError] = useState<string | null>(null);
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
  const owner = members?.find((member) => member.role === 'owner');
  const ownerName = owner ? `${owner.firstName} ${owner.lastName}`.trim() : null;
  const invitesQuery = useQuery({
    queryKey: inviteKeys.list(petId),
    queryFn: () => listPetInvites(baseUrl, token ?? '', petId),
    enabled: isOwner,
  });
  const invites = invitesQuery.data?.kind === 'ok' ? invitesQuery.data.invites : [];
  const loading = queries.some((query) => query.data === undefined);
  const hasError = queries.some((query) => query.data && ['error', 'missing-config', 'unreachable'].includes(query.data.kind));
  const unreachable = queries.some((query) => query.data?.kind === 'unreachable');

  function retryAll() {
    if (petQuery.data?.kind !== 'ok') void petQuery.refetch();
    if (membersQuery.data?.kind !== 'ok') void membersQuery.refetch();
    if (meQuery.data?.kind !== 'ok') void meQuery.refetch();
  }

  async function handleRemove() {
    if (!removing || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await removePetMember(baseUrl, token ?? '', petId, removing.member.userId);
      switch (result.kind) {
        case 'ok':
          setRemoving(null);
          await queryClient.invalidateQueries({ queryKey: memberKeys.list(petId) });
          break;
        case 'rejected':
          setRemoving(null);
          await queryClient.invalidateQueries({ queryKey: memberKeys.list(petId) });
          setActionError(t('common.somethingWentWrong'));
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError(t('common.cannotReachServer'));
          break;
        default:
          setActionError(t('common.somethingWentWrong'));
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function handleRevoke(inviteId: string) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await revokePetInvite(baseUrl, token ?? '', petId, inviteId);
      switch (result.kind) {
        case 'ok':
        case 'not-found':
          await queryClient.invalidateQueries({ queryKey: inviteKeys.list(petId) });
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError(t('common.cannotReachServer'));
          break;
        default:
          setActionError(t('common.somethingWentWrong'));
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  function openLeave() {
    setActionError(null);
    setLeaveOpen(true);
  }

  async function handleLeave() {
    if (!me || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const result = await removePetMember(baseUrl, token ?? '', petId, me.id);
      switch (result.kind) {
        case 'ok':
          queryClient.removeQueries({ queryKey: petKeys.detail(petId) });
          queryClient.removeQueries({ queryKey: memberKeys.list(petId) });
          clearPet();
          await queryClient.invalidateQueries({ queryKey: petKeys.list() });
          router.dismissTo('/home');
          break;
        case 'unauthorized':
          await signOut();
          break;
        case 'unreachable':
          setActionError(t('common.cannotReachServer'));
          break;
        default:
          setActionError(t('common.somethingWentWrong'));
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  let otherIndex = 0;
  return (
    <View testID="screen-pet-members" className="flex-1 bg-background">
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, gap: 12, flexGrow: 1 }}>
        <ScreenHeader
          testID="pet-members-header"
          backFallback="/profile"
          accessory={pet && !isOwner ? (
            <View testID="pet-members-pet-avatar" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className={`size-10 items-center justify-center rounded-full ${CATEGORY_SLOTS.amber.surface}`}>
              <Text className={`text-base font-black ${CATEGORY_SLOTS.amber.ink}`}>{pet.name.charAt(0).toUpperCase()}</Text>
            </View>
          ) : undefined}
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
        {actionError ? <Text testID="pet-members-action-error" accessibilityRole="alert" className="text-13 font-bold text-danger" selectable>{actionError}</Text> : null}
        {pet && members && me ? (
          <>
            <Text testID="pet-members-intro" className="text-sm leading-note text-muted">{isOwner ? t('members.ownerIntro', { petName: pet.name }) : t('members.familyIntro', { petName: pet.name })}</Text>
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
                      <Button testID={`member-row-${member.userId}-remove`} variant="danger-soft" className={`h-11 rounded-14 px-3 ${CATEGORY_SLOTS.rose.surface}`} accessibilityLabel={t('members.removeA11y', { name })} isDisabled={busy} onPress={() => setRemoving({ member, slot })}>
                        <Text className="text-13 font-extrabold text-danger">{t('members.remove')}</Text>
                      </Button>
                    ) : rolePill}
                  </View>
                );
              })}
            </View>
            {isOwner && invites.length > 0 ? (
              <>
                <Text testID="pet-invites-heading" accessibilityRole="header" className="text-sm font-extrabold text-foreground">{t('members.invitesHeading')}</Text>
                <View testID="pet-invites-list" className="rounded-card bg-surface border border-border px-3.5">
                  {invites.map((invite) => {
                    const created = inviteDateParts(invite.createdAt, locale);
                    const expires = inviteDateParts(invite.expiresAt, locale);
                    return (
                      <View key={invite.id} testID={`invite-row-${invite.id}`} className="flex-row items-center gap-2.5 py-3">
                        <View testID={`invite-row-${invite.id}-icon`} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className={`size-9.5 items-center justify-center rounded-10 ${CATEGORY_SLOTS.amber.surface}`}>
                          <Key size={18} color={amberStrong} />
                        </View>
                        <View className="flex-1 gap-1">
                          <Text testID={`invite-row-${invite.id}-created`} className="text-13 font-extrabold text-foreground">{t('members.inviteCreated', { date: created.date })}</Text>
                          <Text testID={`invite-row-${invite.id}-expires`} className="text-xs font-semibold text-muted">{t('members.inviteExpires', expires)}</Text>
                        </View>
                        <Button testID={`invite-row-${invite.id}-revoke`} variant="danger-soft" className={`h-11 rounded-14 px-3 ${CATEGORY_SLOTS.rose.surface}`} accessibilityLabel={t('members.revokeA11y', { date: created.date })} isDisabled={busy} onPress={() => void handleRevoke(invite.id)}>
                          <Text className="text-13 font-extrabold text-danger">{t('members.revoke')}</Text>
                        </Button>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : null}
            {!isOwner && ownerName ? (
              <View testID="pet-members-owner-note" className="flex-row items-center gap-2.5 rounded-tile bg-default px-3.5 py-3">
                <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><InfoCircle size={20} color={foreground} /></View>
                <Text className="flex-1 text-13 font-semibold leading-note text-foreground" selectable>{t('members.ownerNote', { ownerName, petName: pet.name })}</Text>
              </View>
            ) : null}
            {!isOwner ? (
              <>
                <View style={{ flexGrow: 1 }} />
                <Text testID="pet-members-leave-hint" className="text-center text-13 font-semibold text-muted">{t('members.leaveHint', { petName: pet.name })}</Text>
                <Button testID="pet-members-leave" variant="outline" className="w-full h-13.5 rounded-16 border-2 border-danger bg-surface" style={chunkyLip.neutral} onPress={openLeave}>
                  <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Logout size={20} color={danger} /></View>
                  <Text className="text-base font-extrabold text-danger">{t('members.leave')}</Text>
                </Button>
              </>
            ) : null}
          </>
        ) : null}
      </ScrollView>
      <BottomSheet index={removing ? 0 : -1} enablePanDownToClose onClose={() => setRemoving(null)} snapPoints={['50%', '100%']} backgroundStyle={{ backgroundColor: surface }}>
        <BottomSheetView>
          {removing && pet ? (
            <View testID="member-remove-sheet" className="items-center gap-3 bg-surface px-5 pb-9 pt-3">
              <View testID="member-remove-sheet-avatar" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className={`size-14 items-center justify-center rounded-full ${CATEGORY_SLOTS[removing.slot].surface}`}>
                <Text className={`text-xl font-black ${CATEGORY_SLOTS[removing.slot].ink}`}>{memberInitials(removing.member.firstName, removing.member.lastName)}</Text>
              </View>
              <Text testID="member-remove-sheet-title" accessibilityRole="header" className="text-center text-xl font-black text-foreground">
                {t('members.removeTitle', { name: `${removing.member.firstName} ${removing.member.lastName}`.trim() })}
              </Text>
              <Text testID="member-remove-sheet-body" className="max-w-80 text-center text-sm leading-note text-muted">
                {t('members.removeBody', { firstName: removing.member.firstName, petName: pet.name })}
              </Text>
              <Button testID="member-remove-sheet-confirm" className="w-full h-13.5 rounded-16 bg-danger" style={chunkyLip.danger} isDisabled={busy} onPress={() => void handleRemove()}>
                <Text className="text-base font-extrabold text-danger-foreground">{t('members.removeConfirm', { firstName: removing.member.firstName })}</Text>
              </Button>
              <Button testID="member-remove-sheet-cancel" variant="outline" className="w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => setRemoving(null)}>
                <Text className="text-base font-extrabold text-foreground">{t('members.cancel')}</Text>
              </Button>
            </View>
          ) : null}
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet index={leaveOpen ? 0 : -1} enablePanDownToClose onClose={() => setLeaveOpen(false)} snapPoints={['50%', '100%']} backgroundStyle={{ backgroundColor: surface }}>
        <BottomSheetView>
          {leaveOpen && pet ? (
            <View testID="member-leave-sheet" className="items-center gap-3 bg-surface px-5 pb-9 pt-3">
              <Text testID="member-leave-sheet-title" accessibilityRole="header" className="text-center text-xl font-black text-foreground">{t('members.leaveTitle', { petName: pet.name })}</Text>
              <Text testID="member-leave-sheet-body" className="max-w-80 text-center text-sm leading-note text-muted">
                {ownerName ? t('members.leaveBody', { petName: pet.name, ownerName }) : t('members.leaveBodyNoOwner', { petName: pet.name })}
              </Text>
              <Button testID="member-leave-sheet-confirm" className="w-full h-13.5 rounded-16 bg-danger" style={chunkyLip.danger} isDisabled={busy} onPress={() => void handleLeave()}>
                <Text className="text-base font-extrabold text-danger-foreground">{t('members.leaveConfirm')}</Text>
              </Button>
              <Button testID="member-leave-sheet-cancel" variant="outline" className="w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => setLeaveOpen(false)}>
                <Text className="text-base font-extrabold text-foreground">{t('members.cancel')}</Text>
              </Button>
            </View>
          ) : null}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
