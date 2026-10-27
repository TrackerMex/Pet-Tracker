import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Button, Skeleton } from 'heroui-native';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getNutritionProfile } from '../../api/nutrition';
import { getPet } from '../../api/pets';
import { nutritionKeys, petKeys } from '../../api/query-keys';
import type { NutritionProfile, PetProfile } from '../../api/types';
import { ScreenHeader } from '../../components/screen-header';
import { useChunkyLip } from '../../theme/chunky-lip';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

type Step = 'activity' | 'condition' | 'target' | 'food' | 'health';

function QuestionnaireForm({ pet }: { initial: NutritionProfile | null; pet: PetProfile }) {
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const chunkyLip = useChunkyLip();
  const [step] = useState<Step>('activity');
  const n = 1;
  const canContinue = false;
  function handleNext() {}

  return (
    <KeyboardAvoidingView testID="screen-nutrition-questionnaire" className="flex-1" behavior="padding" keyboardVerticalOffset={0}>
      <View className="bg-background px-5 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <ScreenHeader testID="nutrition-questionnaire" size={24} backFallback="/food" title={t('mealSchedule.nutritionProfile')}
          accessory={<Text testID="nutrition-questionnaire-step-label" className="text-13 font-extrabold text-muted">{t('addPet.stepProgress', { current: n, total: 4 })}</Text>} />
      </View>
      <View testID="nutrition-questionnaire-step-bar" className="flex-row gap-1.5 px-5" accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: 4, now: n }}>
        {[1, 2, 3, 4].map(index => <View key={index} className={index <= n ? 'h-1.5 flex-1 rounded-full bg-accent' : 'h-1.5 flex-1 rounded-full bg-lip-gray'} />)}
      </View>
      <ScrollView key={step} className="flex-1 bg-background" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: step === 'condition' ? 14 : 16 }}>
        <View className="flex-row items-center gap-3">
          <Image source={require('../../../assets/images/pingo-food.webp')} className={step === 'condition' ? 'size-11' : 'size-13'} />
          <View testID="nutrition-questionnaire-bubble" className="flex-1 rounded-tile bg-surface-secondary px-3 py-2.5" style={CONTINUOUS_CORNER}>
            <View className={step === 'condition' ? 'absolute -left-1.5 top-4.5 size-3 rotate-45 bg-surface-secondary' : 'absolute -left-1.5 top-5.5 size-3 rotate-45 bg-surface-secondary'} />
            <Text className="text-13 font-semibold leading-body text-foreground">{t('nutritionQuestionnaire.bubbleActivity', { name: pet.name })}</Text>
          </View>
        </View>
      </ScrollView>
      <View className="bg-background px-5 pt-4" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button testID="nutrition-questionnaire-next" className="h-14 rounded-16 bg-accent" style={chunkyLip.primary} isDisabled={!canContinue} onPress={() => void handleNext()}>
          <Text className="text-17 font-extrabold text-accent-foreground">{step === 'health' ? t('nutritionQuestionnaire.saveAndGenerate') : t('nutritionQuestionnaire.next')}</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
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
