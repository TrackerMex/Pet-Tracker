import { useQuery } from '@tanstack/react-query';
import { Button } from 'heroui-native';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listPets } from '../../api/pets';
import { petKeys } from '../../api/query-keys';
import { ScreenHeader } from '../../components/screen-header';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

export function VaccineCreateScreen({ petId }: { petId: string }) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const { token } = useAuth();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const pets = useQuery({ queryKey: petKeys.list(), queryFn: () => listPets(baseUrl, token ?? '') });
  const pet = pets.data?.kind === 'ok' ? pets.data.pets.find(p => p.id === petId) : undefined;
  const species = pet?.species === 'cat' ? 'cat' : 'dog';

  return (
    <KeyboardAvoidingView testID="screen-vaccine-create" behavior="padding" className="flex-1 bg-background">
      <ScrollView testID="vaccine-create-form" className="flex-1" keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 24, gap: 16 }}>
        <ScreenHeader testID="vaccine-create-header" size={24} backFallback="/health" title={t('vaccineCreate.title')} />
        <Text testID="vaccine-create-legend" className="text-sm font-extrabold text-foreground">
          {t('vaccineCreate.vaccine')}<Text testID="vaccine-create-legend-species" className="font-semibold text-muted">{species === 'cat' ? t('vaccineCreate.schemeForCat') : t('vaccineCreate.schemeForDog')}</Text>
        </Text>
      </ScrollView>
      <View testID="vaccine-create-bar" style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16), gap: 12 }}>
        <Button testID="vaccine-create-submit" />
      </View>
    </KeyboardAvoidingView>
  );
}
