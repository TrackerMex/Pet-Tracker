import type { MealsToday } from '../../api/types';
import type { TranslationKey } from '../../i18n/catalog';
import { fmtKm } from './format';

export function homePingoPhrase({ petName, distanceM, meals }: {
  petName: string;
  distanceM: number | null;
  meals: MealsToday | null;
}): { labelKey: TranslationKey; params: Record<string, string | number> } {
  const hasDistance = distanceM !== null && distanceM >= 100;
  const hasMeals = meals !== null && meals.total > 0;

  if (hasDistance && hasMeals) {
    return {
      labelKey: 'home.pingoPhraseWalkMeals',
      params: { petName, km: fmtKm(distanceM), served: meals.served, total: meals.total },
    };
  }
  if (hasDistance) {
    return { labelKey: 'home.pingoPhraseWalk', params: { petName, km: fmtKm(distanceM) } };
  }
  if (hasMeals) {
    return { labelKey: 'home.pingoPhraseMeals', params: { petName, served: meals.served, total: meals.total } };
  }
  return { labelKey: 'home.pingoPhraseCalm', params: { petName } };
}
