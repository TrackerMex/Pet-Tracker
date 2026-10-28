import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { Button, Skeleton } from 'heroui-native';
import { Image } from 'expo-image';
import { Check, InfoCircle, Location, TrendDown, TrendUp } from 'reicon-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { generateNutritionPlan, getNutritionProfile, upsertNutritionProfile } from '../../api/nutrition';
import { getPet } from '../../api/pets';
import { nutritionKeys, petKeys } from '../../api/query-keys';
import type { NutritionProfile, NutritionProfileInput, PetProfile } from '../../api/types';
import { PingRing } from '../../components/ping-ring';
import { OrbitFloat } from '../../components/orbit-float';
import { ScreenHeader } from '../../components/screen-header';
import { useChunkyLip } from '../../theme/chunky-lip';
import { CONTINUOUS_CORNER } from '../../theme/native-styles';
import { TOUCH_SLOP } from '../../theme/touch-target';
import { useThemeColors } from '../../theme/use-theme-colors';
import { CATEGORY_SLOTS, type CategorySlot } from '../../utils/category-palette';
import { useAuth } from '../../providers/auth-provider';
import { useTranslate } from '../../providers/language-provider';

const ACTIVITY_OPTIONS = [
  { value: 'low', slot: 'blue', icon: TrendDown, title: { labelKey: 'nutritionQuestionnaire.activityLow' }, description: { labelKey: 'nutritionQuestionnaire.activityLowDescription' } },
  { value: 'medium', slot: 'green', icon: Location, title: { labelKey: 'nutritionQuestionnaire.activityMedium' }, description: { labelKey: 'nutritionQuestionnaire.activityMediumDescription' } },
  { value: 'high', slot: 'amber', icon: TrendUp, title: { labelKey: 'nutritionQuestionnaire.activityHigh' }, description: { labelKey: 'nutritionQuestionnaire.activityHighDescription' } },
] as const;

const BCS_ROWS = [
  { n: 1, slot: 'blue', title: { labelKey: 'nutritionQuestionnaire.bcs1' }, description: { labelKey: 'nutritionQuestionnaire.bcs1Description' } },
  { n: 2, slot: 'blue', title: { labelKey: 'nutritionQuestionnaire.bcs2' }, description: { labelKey: 'nutritionQuestionnaire.bcs2Description' } },
  { n: 3, slot: 'blue', title: { labelKey: 'nutritionQuestionnaire.bcs3' }, description: { labelKey: 'nutritionQuestionnaire.bcs3Description' } },
  { n: 4, slot: 'green', title: { labelKey: 'nutritionQuestionnaire.bcs4' }, description: { labelKey: 'nutritionQuestionnaire.bcs4Description' } },
  { n: 5, slot: 'green', title: { labelKey: 'nutritionQuestionnaire.bcs5' }, description: { labelKey: 'nutritionQuestionnaire.bcs5Description' } },
  { n: 6, slot: 'amber', title: { labelKey: 'nutritionQuestionnaire.bcs6' }, description: { labelKey: 'nutritionQuestionnaire.bcs6Description' } },
  { n: 7, slot: 'amber', title: { labelKey: 'nutritionQuestionnaire.bcs7' }, description: { labelKey: 'nutritionQuestionnaire.bcs7Description' } },
  { n: 8, slot: 'rose', title: { labelKey: 'nutritionQuestionnaire.bcs8' }, description: { labelKey: 'nutritionQuestionnaire.bcs8Description' } },
  { n: 9, slot: 'rose', title: { labelKey: 'nutritionQuestionnaire.bcs9' }, description: { labelKey: 'nutritionQuestionnaire.bcs9Description' } },
] as const;

const FOOD_TYPES = [
  { value: 'dry', kcal: '350', labelKey: 'nutritionQuestionnaire.foodDry', note: { labelKey: 'nutritionQuestionnaire.kcalNoteDry' } },
  { value: 'wet', kcal: '90', labelKey: 'nutritionQuestionnaire.foodWet', note: { labelKey: 'nutritionQuestionnaire.kcalNoteWet' } },
  { value: 'mixed', kcal: '220', labelKey: 'nutritionQuestionnaire.foodMixed', note: { labelKey: 'nutritionQuestionnaire.kcalNoteMixed' } },
  { value: 'homemade', kcal: '130', labelKey: 'nutritionQuestionnaire.foodHomemade', note: { labelKey: 'nutritionQuestionnaire.kcalNoteHomemade' } },
] as const;

const ALLERGIES = [
  { slug: 'pollo', labelKey: 'nutritionQuestionnaire.allergyChicken' },
  { slug: 'carne-de-res', labelKey: 'nutritionQuestionnaire.allergyBeef' },
  { slug: 'lacteos', labelKey: 'nutritionQuestionnaire.allergyDairy' },
  { slug: 'trigo', labelKey: 'nutritionQuestionnaire.allergyWheat' },
  { slug: 'huevo', labelKey: 'nutritionQuestionnaire.allergyEgg' },
  { slug: 'soya', labelKey: 'nutritionQuestionnaire.allergySoy' },
  { slug: 'pescado', labelKey: 'nutritionQuestionnaire.allergyFish' },
  { slug: 'otra', labelKey: 'nutritionQuestionnaire.other' },
] as const;

const DISEASES = [
  { slug: 'diabetes', labelKey: 'nutritionQuestionnaire.diseaseDiabetes' },
  { slug: 'enfermedad-renal', labelKey: 'nutritionQuestionnaire.diseaseKidney' },
  { slug: 'pancreatitis', labelKey: 'nutritionQuestionnaire.diseasePancreatitis' },
  { slug: 'enfermedad-hepatica', labelKey: 'nutritionQuestionnaire.diseaseLiver' },
  { slug: 'problemas-digestivos', labelKey: 'nutritionQuestionnaire.diseaseDigestive' },
  { slug: 'problemas-articulares', labelKey: 'nutritionQuestionnaire.diseaseJoints' },
  { slug: 'otra', labelKey: 'nutritionQuestionnaire.other' },
] as const;

const GENERATING_ROWS = [
  { labelKey: 'nutritionQuestionnaire.generatingSaved' },
  { labelKey: 'nutritionQuestionnaire.generatingCalories' },
  { labelKey: 'nutritionQuestionnaire.generatingMeals' },
] as const;

const SAVE_ERRORS = {
  forbidden: { labelKey: 'mealSchedule.errorForbidden' },
  unreachable: { labelKey: 'common.cannotReachServer' },
  weightRequired: { labelKey: 'mealSchedule.registerWeightFirst' },
  generic: { labelKey: 'common.somethingWentWrong' },
} as const;

type HealthList = 'allergy' | 'disease';
type HealthOption = (typeof ALLERGIES)[number] | (typeof DISEASES)[number];
type ChunkyLip = ReturnType<typeof useChunkyLip>;

type Step = 'activity' | 'condition' | 'target' | 'food' | 'health';

function stepNumber(step: Step) {
  return { activity: 1, condition: 2, target: 2, food: 3, health: 4 }[step];
}

function nextStep(step: Step, bcs: number | null): Step {
  if (step === 'activity') return 'condition';
  if (step === 'condition') return bcs !== null && bcs >= 7 ? 'target' : 'food';
  if (step === 'target') return 'food';
  return 'health';
}

function prevStep(step: Step, bcs: number | null): Step {
  if (step === 'health') return 'food';
  if (step === 'food') return bcs !== null && bcs >= 7 ? 'target' : 'condition';
  if (step === 'target') return 'condition';
  return 'activity';
}

function isWeight(value: string) {
  const normalized = value.replace(',', '.');
  return /^\d*\.?\d{0,2}$/.test(normalized) && Number(normalized) > 0 && Number(normalized) <= 999.99;
}

function isKcal(value: string) {
  return /^\d+$/.test(value) && Number(value) >= 80 && Number(value) <= 600;
}

type Label = (key: HealthOption['labelKey']) => string;
type Form = {
  activity: NutritionProfileInput['activityLevel'];
  bcs: number | null;
  target: string;
  food: NutritionProfileInput['foodType'];
  kcal: string;
  allergies: string[];
  allergyOther: string;
  diseases: string[];
  diseaseOther: string;
  kept: { allergies: string[]; diseases: string[] };
};

function healthItems(options: readonly HealthOption[], checked: string[], other: string, kept: string[], label: Label) {
  const items = options.filter(option => option.slug !== 'otra' && checked.includes(option.slug)).map(option => label(option.labelKey));
  if (checked.includes('otra') && other.trim() !== '') items.push(other.trim());
  return [...new Set([...items, ...kept])].slice(0, 20).map(item => item.slice(0, 100));
}

function buildInput(form: Form, label: Label): NutritionProfileInput {
  return {
    activityLevel: form.activity,
    ...(form.bcs !== null ? { bodyCondition: form.bcs } : {}),
    ...(form.bcs !== null && form.bcs >= 7 && form.target !== '' ? { targetWeightKg: Number(form.target.replace(',', '.')) } : {}),
    foodType: form.food,
    kcalPer100g: Number(form.kcal),
    allergies: healthItems(ALLERGIES, form.allergies, form.allergyOther, form.kept.allergies, label),
    diseases: healthItems(DISEASES, form.diseases, form.diseaseOther, form.kept.diseases, label),
  };
}

function initialHealth(options: readonly HealthOption[], texts: string[], label: Label) {
  const checked: string[] = [];
  const kept: string[] = [];
  let other = '';
  for (const text of texts) {
    const option = options.find(item => item.slug !== 'otra' && label(item.labelKey) === text);
    if (option) {
      if (!checked.includes(option.slug)) checked.push(option.slug);
    } else if (!checked.includes('otra') && text.length <= 40) {
      checked.push('otra');
      other = text;
    } else {
      kept.push(text);
    }
  }
  return { checked, other, kept };
}

function initialFromProfile(profile: NutritionProfile | null, label: Label) {
  const allergies = initialHealth(ALLERGIES, profile?.allergies ?? [], label);
  const diseases = initialHealth(DISEASES, profile?.diseases ?? [], label);
  return {
    activity: ACTIVITY_OPTIONS.find(option => option.value === profile?.activityLevel)?.value ?? null,
    bcs: profile?.bodyCondition ?? null,
    target: String(profile?.targetWeightKg ?? ''),
    food: FOOD_TYPES.find(option => option.value === profile?.foodType)?.value ?? null,
    kcal: profile ? String(profile.kcalPer100g) : '',
    allergies, diseases,
  };
}

function NumberField({ kind, testID, unit, value, onChangeText }: { kind: 'weight' | 'kcal'; testID: string; unit: string; value: string; onChangeText: (value: string) => void }) {
  const [focused, setFocused] = useState(false);
  return <View className={focused ? 'h-16 flex-row items-center gap-2 rounded-14 border-2 border-accent bg-default px-4' : 'h-16 flex-row items-center gap-2 rounded-14 border-2 border-transparent bg-default px-4'} style={CONTINUOUS_CORNER}>
    <TextInput testID={testID} className="flex-1 text-28 font-black text-foreground" keyboardType={kind === 'weight' ? 'decimal-pad' : 'number-pad'} maxLength={kind === 'weight' ? 6 : 3}
      value={value} onChangeText={onChangeText} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    <Text className={kind === 'weight' ? 'text-lg font-extrabold text-muted' : 'text-15 font-extrabold text-muted'}>{unit}</Text>
  </View>;
}

function NoteRow({ testID, text, color }: { testID: string; text: string; color: string }) {
  return <View testID={testID} className="flex-row gap-2.5 rounded-tile bg-default px-3.5 py-3" style={CONTINUOUS_CORNER}>
    <InfoCircle size={20} color={color} />
    <Text className="flex-1 text-13 font-semibold leading-body text-foreground">{text}</Text>
  </View>;
}

function toggle(items: string[], slug: string) {
  return items.includes(slug) ? items.filter(item => item !== slug) : [...items, slug];
}

function HealthChips({ list, options, checked, onToggle, chunkyLip }: { list: HealthList; options: readonly HealthOption[]; checked: string[]; onToggle: (slug: string) => void; chunkyLip: ChunkyLip }) {
  const t = useTranslate();
  return <View className="flex-row flex-wrap gap-2">
    {options.map(option => {
      const isChecked = checked.includes(option.slug);
      return <Pressable key={option.slug} testID={`${list}-chip-${option.slug}`} accessibilityRole="checkbox" accessibilityState={{ checked: isChecked }} hitSlop={TOUCH_SLOP}
        className={isChecked ? 'h-9 justify-center rounded-full bg-accent px-3' : 'h-9 justify-center rounded-full bg-default px-3'}
        style={isChecked ? chunkyLip.primaryCompact : undefined} onPress={() => onToggle(option.slug)}>
        <Text className={isChecked ? 'text-sm font-extrabold text-accent-foreground' : 'text-sm font-extrabold text-foreground'}>{t(option.labelKey)}</Text>
      </Pressable>;
    })}
  </View>;
}

function OtherField({ list, value, onChangeText }: { list: HealthList; value: string; onChangeText: (value: string) => void }) {
  const t = useTranslate();
  const [focused, setFocused] = useState(false);
  return <View className="gap-1.5">
    <View className="flex-row justify-between">
      <Text className="text-13 font-semibold text-muted">{t('nutritionQuestionnaire.otherLabel')}</Text>
      <Text testID={`${list}-other-count`} className="text-13 font-semibold text-muted">{t('nutritionQuestionnaire.otherCount', { count: value.length })}</Text>
    </View>
    <TextInput testID={`${list}-other-input`} maxLength={40} value={value} onChangeText={onChangeText} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className={focused ? 'h-12 rounded-xl border-2 border-accent bg-default px-3.5 text-15 font-semibold text-foreground' : 'h-12 rounded-xl border-2 border-transparent bg-default px-3.5 text-15 font-semibold text-foreground'}
      style={CONTINUOUS_CORNER} />
  </View>;
}

function BcsBadge({ n, slot, testID }: { n: number; slot: CategorySlot; testID: string }) {
  return <View testID={testID} className={`size-7.5 items-center justify-center rounded-10 ${CATEGORY_SLOTS[slot].surface}`}>
    <Text className={`text-sm font-black ${CATEGORY_SLOTS[slot].ink}`}>{n}</Text>
  </View>;
}

function Generating({ phase, name, checkColor }: { phase: 'saving' | 'generating'; name: string; checkColor: string }) {
  const t = useTranslate();
  const reduceMotion = useReducedMotion();
  const active = phase === 'saving' ? 0 : 1;
  return <View testID="nutrition-generating" className="flex-1 items-center justify-center gap-5 bg-background px-5">
    <View className="size-45 items-center justify-center">
      {reduceMotion ? null : [0, 1000].map((delay, index) => <PingRing key={delay} testID={`nutrition-generating-ring-${index}`} delay={delay} className="size-45 rounded-full border-3 border-accent" />)}
      <OrbitFloat testID="nutrition-generating-orbit">
        <Image testID="nutrition-generating-orbit-image" source={require('../../../assets/images/orbit-food.webp')} style={{ width: 112, height: 112 }} />
      </OrbitFloat>
    </View>
    <View className="gap-2">
      <Text className="text-center text-24 font-black tracking-title text-foreground">{t('nutritionQuestionnaire.generatingTitle', { name })}</Text>
      <Text className="text-center text-15 font-semibold leading-note text-muted">{t('nutritionQuestionnaire.generatingBody')}</Text>
    </View>
    <View testID="nutrition-generating-steps" accessibilityLiveRegion="polite" className="gap-3 self-stretch rounded-tile bg-default px-4 py-3.5" style={CONTINUOUS_CORNER}>
      {GENERATING_ROWS.map((row, index) => <View key={row.labelKey} className="flex-row items-center gap-3">
        {index < active
          ? <View className="size-6.5 items-center justify-center rounded-full bg-accent"><Check size={16} color={checkColor} /></View>
          : <View className={index === active ? 'size-6.5 rounded-full border-3 border-lip-gray border-t-accent' : 'size-6.5 rounded-full border-2 border-lip-gray'} />}
        <Text className={index < active ? 'text-15 font-bold text-foreground' : index === active ? 'text-15 font-extrabold text-foreground' : 'text-15 font-semibold text-muted'}>{t(row.labelKey)}</Text>
      </View>)}
    </View>
  </View>;
}

function QuestionnaireForm({ initial, pet }: { initial: NutritionProfile | null; pet: PetProfile }) {
  const t = useTranslate();
  const [init] = useState(() => initialFromProfile(initial, t));
  const insets = useSafeAreaInsets();
  const chunkyLip = useChunkyLip();
  const { token, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<'form' | 'saving' | 'generating'>('form');
  const [saveError, setSaveError] = useState<keyof typeof SAVE_ERRORS | null>(null);
  const [step, setStep] = useState<Step>('activity');
  const colors = useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'accent-foreground', 'muted']);
  const [activity, setActivity] = useState<NutritionProfileInput['activityLevel'] | null>(init.activity);
  const [bcs, setBcs] = useState<number | null>(init.bcs);
  const [target, setTarget] = useState(init.target);
  const [food, setFood] = useState<NutritionProfileInput['foodType'] | null>(init.food);
  const [kcal, setKcal] = useState(init.kcal);
  const [allergies, setAllergies] = useState(init.allergies.checked);
  const [allergyOther, setAllergyOther] = useState(init.allergies.other);
  const [diseases, setDiseases] = useState(init.diseases.checked);
  const [diseaseOther, setDiseaseOther] = useState(init.diseases.other);
  const bcsRow = BCS_ROWS.find(row => row.n === bcs);
  const foodRow = FOOD_TYPES.find(option => option.value === food);
  const n = stepNumber(step);
  const canContinue = step === 'activity' ? activity !== null : step === 'condition' ? bcs !== null : step === 'target' ? target === '' || isWeight(target) : step === 'food' ? food !== null && isKcal(kcal) : true;
  usePreventRemove(phase === 'form' && step !== 'activity', () => setStep(prevStep(step, bcs)));
  async function handleNext() {
    if (step !== 'health') {
      setStep(nextStep(step, bcs));
      return;
    }
    if (activity === null || food === null) return;
    setPhase('saving');
    setSaveError(null);
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    // Step stays 'health' while saving, so returning to the form only resets the phase.
    function backToHealth(error: keyof typeof SAVE_ERRORS | null) {
      setPhase('form');
      setSaveError(error);
    }
    try {
      const saved = await upsertNutritionProfile(baseUrl, token ?? '', pet.id, buildInput({
        activity, bcs, target, food, kcal, allergies, allergyOther, diseases, diseaseOther, kept: { allergies: init.allergies.kept, diseases: init.diseases.kept },
      }, t));
      switch (saved.kind) {
        case 'ok':
          break;
        case 'forbidden':
          backToHealth('forbidden');
          return;
        case 'unreachable':
          backToHealth('unreachable');
          return;
        case 'unauthorized':
          backToHealth(null);
          await signOut();
          return;
        case 'invalid':
        case 'not-found':
        case 'error':
        case 'missing-config':
          backToHealth('generic');
          return;
      }
      void queryClient.invalidateQueries({ queryKey: nutritionKeys.profile(pet.id) });
      setPhase('generating');
      const generated = await generateNutritionPlan(baseUrl, token ?? '', pet.id);
      switch (generated.kind) {
        case 'ok':
          void queryClient.invalidateQueries({ queryKey: nutritionKeys.plan(pet.id) });
          router.back();
          return;
        case 'forbidden':
          backToHealth('forbidden');
          return;
        case 'unprocessable':
          backToHealth(generated.code === 'PET_WEIGHT_REQUIRED' ? 'weightRequired' : 'generic');
          return;
        case 'unreachable':
          backToHealth('unreachable');
          return;
        case 'unauthorized':
          backToHealth(null);
          await signOut();
          return;
        case 'error':
        case 'missing-config':
          backToHealth('generic');
      }
    } catch {
      backToHealth('generic');
    }
  }

  if (phase !== 'form') return <Generating phase={phase} name={pet.name} checkColor={colors[3]} />;

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
          <Image testID="nutrition-questionnaire-orbit" source={require('../../../assets/images/orbit-food.webp')} style={step === 'condition' ? { width: 44, height: 44 } : { width: 52, height: 52 }} />
          <View testID="nutrition-questionnaire-bubble" className="flex-1 rounded-tile bg-surface-secondary px-3 py-2.5" style={CONTINUOUS_CORNER}>
            <View className={step === 'condition' ? 'absolute -left-1.5 top-4.5 size-3 rotate-45 bg-surface-secondary' : 'absolute -left-1.5 top-5.5 size-3 rotate-45 bg-surface-secondary'} />
            <Text className="text-13 font-semibold leading-body text-foreground">{step === 'condition' ? t('nutritionQuestionnaire.bubbleCondition', { name: pet.name }) : step === 'target' ? t('nutritionQuestionnaire.bubbleTargetWeight', { bcs: String(bcs), name: pet.name }) : step === 'food' ? t('nutritionQuestionnaire.bubbleFood', { name: pet.name }) : step === 'health' ? t('nutritionQuestionnaire.bubbleHealth', { name: pet.name }) : t('nutritionQuestionnaire.bubbleActivity', { name: pet.name })}</Text>
          </View>
        </View>
        {step === 'activity' ? <>
        <Text className="text-lg font-black text-foreground">{t('nutritionQuestionnaire.activityLegend', { name: pet.name })}</Text>
        <View className="gap-3">
          {ACTIVITY_OPTIONS.map((option, index) => {
            const selected = activity === option.value;
            const Icon = option.icon;
            return <Pressable key={option.value} testID={`activity-option-${option.value}`} accessibilityRole="radio" accessibilityState={{ checked: selected }}
              className={selected ? 'flex-row items-center gap-3 rounded-tile border-2 p-3.5 border-accent bg-tab-pill' : 'flex-row items-center gap-3 rounded-tile border-2 p-3.5 border-border bg-surface'}
              style={CONTINUOUS_CORNER} onPress={() => setActivity(option.value)}>
              <View className={selected ? 'size-11 items-center justify-center rounded-14 bg-surface' : `size-11 items-center justify-center rounded-14 ${CATEGORY_SLOTS[option.slot].surface}`}>
                <Icon size={24} color={colors[index]} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-base font-extrabold text-foreground">{t(option.title.labelKey)}</Text>
                <Text className="text-13 text-muted">{t(option.description.labelKey)}</Text>
              </View>
              <View className={selected ? 'size-6 rounded-full items-center justify-center bg-accent' : 'size-6 rounded-full border-2 border-lip-gray'}>
                {selected ? <Check size={16} color={colors[3]} /> : null}
              </View>
            </Pressable>;
          })}
        </View>
        </> : null}
        {step === 'condition' ? <>
          <Text className="text-lg font-black text-foreground">{t('nutritionQuestionnaire.conditionLegend')}</Text>
          <View className="gap-1.5">
            {BCS_ROWS.map(row => {
              const selected = bcs === row.n;
              return <Pressable key={row.n} testID={`bcs-option-${row.n}`} accessibilityRole="radio" accessibilityState={{ checked: selected }}
                className={selected ? 'flex-row items-center gap-2.5 rounded-14 border-2 px-2.5 py-1.25 border-accent bg-tab-pill' : 'flex-row items-center gap-2.5 rounded-14 border-2 px-2.5 py-1.25 border-transparent bg-default'}
                onPress={() => setBcs(row.n)}>
                <BcsBadge n={row.n} slot={row.slot} testID={`bcs-badge-${row.n}`} />
                <View className="flex-1">
                  <Text className="text-sm font-extrabold leading-tight text-foreground">{t(row.title.labelKey)}</Text>
                  <Text className="text-xs leading-tight text-muted">{t(row.description.labelKey)}</Text>
                </View>
              </Pressable>;
            })}
          </View>
        </> : null}
        {step === 'target' && bcsRow ? <>
          <View testID="target-weight-summary" className="flex-row items-center gap-2.5 rounded-16 bg-default px-3 py-2.5">
            <BcsBadge n={bcsRow.n} slot={bcsRow.slot} testID="bcs-badge-summary" />
            <Text className="flex-1 text-sm font-extrabold text-foreground">{t('nutritionQuestionnaire.conditionSummary', { bcs: bcsRow.n, label: t(bcsRow.title.labelKey) })}</Text>
            <Pressable testID="target-weight-change" accessibilityRole="button" hitSlop={TOUCH_SLOP} className="h-11 justify-center" onPress={() => setStep('condition')}>
              <Text className="text-13 font-extrabold text-accent-strong">{t('nutritionQuestionnaire.change')}</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-black text-foreground">{t('nutritionQuestionnaire.targetWeightTitle')}</Text>
            <Text className="text-13 font-semibold text-muted">{t('addPet.optional')}</Text>
          </View>
          <NumberField kind="weight" testID="target-weight-input" unit="kg" value={target} onChangeText={setTarget} />
          {pet.currentWeightKg !== null ? <Text testID="target-weight-current" className="text-13 font-semibold text-muted">{t('nutritionQuestionnaire.currentWeight', { name: pet.name, weight: pet.currentWeightKg })}</Text> : null}
          <NoteRow testID="target-weight-note" text={t('nutritionQuestionnaire.targetWeightNote')} color={colors[4]} />
        </> : null}
        {step === 'food' ? <>
          <Text className="text-lg font-black text-foreground">{t('nutritionQuestionnaire.foodLegend')}</Text>
          <View className="flex-row flex-wrap gap-2">
            {FOOD_TYPES.map(option => {
              const selected = food === option.value;
              return <Pressable key={option.value} testID={`food-type-${option.value}`} accessibilityRole="radio" accessibilityState={{ checked: selected }} hitSlop={TOUCH_SLOP}
                className={selected ? 'h-11 justify-center rounded-full border border-accent bg-tab-pill px-4' : 'h-11 justify-center rounded-full border border-border bg-default px-4'}
                onPress={() => { setFood(option.value); setKcal(option.kcal); }}>
                <Text className={selected ? 'text-sm font-bold text-foreground' : 'text-sm font-semibold text-foreground'}>{t(option.labelKey)}</Text>
              </Pressable>;
            })}
          </View>
          <Text className="text-lg font-black text-foreground">{t('nutritionQuestionnaire.kcalLabel')}</Text>
          <NumberField kind="kcal" testID="kcal-input" unit={t('nutritionQuestionnaire.unitKcal')} value={kcal} onChangeText={setKcal} />
          <Text className="text-13 font-semibold text-muted">{t('nutritionQuestionnaire.kcalHelp')}</Text>
          {foodRow ? <NoteRow testID="kcal-note" text={t(foodRow.note.labelKey)} color={colors[4]} /> : null}
        </> : null}
        {step === 'health' ? <>
          <Text className="text-lg font-black text-foreground">{t('nutritionQuestionnaire.allergiesLegend')}</Text>
          <HealthChips list="allergy" options={ALLERGIES} checked={allergies} onToggle={slug => setAllergies(items => toggle(items, slug))} chunkyLip={chunkyLip} />
          {allergies.includes('otra') ? <OtherField list="allergy" value={allergyOther} onChangeText={setAllergyOther} /> : null}
          <Text className="text-lg font-black text-foreground">{t('nutritionQuestionnaire.diseasesLegend')}</Text>
          <HealthChips list="disease" options={DISEASES} checked={diseases} onToggle={slug => setDiseases(items => toggle(items, slug))} chunkyLip={chunkyLip} />
          {diseases.includes('otra') ? <OtherField list="disease" value={diseaseOther} onChangeText={setDiseaseOther} /> : null}
          {saveError ? <Text testID="nutrition-questionnaire-error" className="text-danger">{t(SAVE_ERRORS[saveError].labelKey)}</Text> : null}
        </> : null}
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
  const insets = useSafeAreaInsets();

  if (pet.isPending || profile.isPending) {
    return <View testID="nutrition-questionnaire-skeleton" className="flex-1 gap-4 bg-background px-5 pb-5" style={{ paddingTop: insets.top + 12 }}>
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-card" />
    </View>;
  }
  if (pet.data?.kind !== 'ok' || profile.data?.kind === 'error' || profile.data?.kind === 'unreachable') {
    return <View testID="nutrition-questionnaire-load-error-screen" className="flex-1 gap-4 bg-background px-5 pb-5" style={{ paddingTop: insets.top + 12 }}>
      <ScreenHeader testID="nutrition-questionnaire" size={24} backFallback="/food" />
      <Text testID="nutrition-questionnaire-load-error" className="text-danger">{t('common.somethingWentWrong')}</Text>
    </View>;
  }
  return <QuestionnaireForm initial={profile.data?.kind === 'ok' ? profile.data.profile : null} pet={pet.data.pet} />;
}
