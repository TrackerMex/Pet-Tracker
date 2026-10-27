import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Skeleton } from 'heroui-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { getNutritionProfile } from '../../api/nutrition';
import { getPet } from '../../api/pets';
import { nutritionKeys, petKeys } from '../../api/query-keys';
import type { NutritionProfile, PetProfile } from '../../api/types';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

function QuestionnaireForm(_props: { initial: NutritionProfile | null; pet: PetProfile }) {
  return null;
}

export function NutritionQuestionnaireScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { token, signOut } = useAuth();
  const t = useTranslate();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const pet = useQuery({
    queryKey: petKeys.detail(petId),
    queryFn: () => getPet(baseUrl, token ?? '', petId),
  });
  const profile = useQuery({
    queryKey: nutritionKeys.profile(petId),
    queryFn: () => getNutritionProfile(baseUrl, token ?? '', petId),
  });
  useEffect(() => {
    if (pet.data?.kind === 'unauthorized' || profile.data?.kind === 'unauthorized') void signOut();
  }, [pet.data?.kind, profile.data?.kind, signOut]);

  if (pet.isPending || profile.isPending) {
    return <View testID="nutrition-questionnaire-skeleton" className="flex-1 gap-4 bg-background p-5">
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-card" />
    </View>;
  }
  if (pet.data?.kind !== 'ok' || profile.data?.kind === 'error' || profile.data?.kind === 'unreachable') {
    return <Text testID="nutrition-questionnaire-load-error" className="text-danger">{t('common.somethingWentWrong')}</Text>;
  }
  return <QuestionnaireForm initial={profile.data?.kind === 'ok' ? profile.data.profile : null} pet={pet.data.pet} />;
}
