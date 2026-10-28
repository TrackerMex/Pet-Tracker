import type { MealsToday } from '../../api/types';
import type { TranslationKey } from '../../i18n/catalog';
import { fmtKm } from './format';

export function homeOrbitPhrase({ petName, distanceM, meals }: {
  petName: string;
  distanceM: number | null;
  meals: MealsToday | null;
}): { labelKey: TranslationKey; params: Record<string, string | number> } {
  const hasDistance = distanceM !== null && distanceM >= 100;
  const hasMeals = meals !== null && meals.total > 0;

  if (hasDistance && hasMeals) {
    return {
      labelKey: 'home.orbitPhraseWalkMeals',
      params: { petName, km: fmtKm(distanceM), served: meals.served, total: meals.total },
    };
  }
  if (hasDistance) {
    return { labelKey: 'home.orbitPhraseWalk', params: { petName, km: fmtKm(distanceM) } };
  }
  if (hasMeals) {
    return { labelKey: 'home.orbitPhraseMeals', params: { petName, served: meals.served, total: meals.total } };
  }
  return { labelKey: 'home.orbitPhraseCalm', params: { petName } };
}
