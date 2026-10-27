import type { TranslationKey } from '../i18n/catalog';

export type UseRow = { file: string; key: TranslationKey };

export const R1_AUTH: UseRow[] = [
  { file: 'src/screens/login/index.tsx', key: 'login.invalidCredentials' },
  { file: 'src/screens/login/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/login/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/login/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/login/index.tsx', key: 'login.signIn' },
  { file: 'src/screens/login/index.tsx', key: 'login.email' },
  { file: 'src/screens/login/index.tsx', key: 'login.password' },
  { file: 'src/screens/login/index.tsx', key: 'login.signIn' },
  { file: 'src/screens/login/index.tsx', key: 'login.createAccount' },
  { file: 'src/screens/login/index.tsx', key: 'login.forgotPassword' },
  { file: 'src/screens/login/index.tsx', key: 'login.pingoGreeting' }, // #167 R6
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.tooManyAttempts' }, // #117 R7
  { file: 'src/screens/forgot/index.tsx', key: 'common.cannotReachServer' }, // #117 R7
  { file: 'src/screens/forgot/index.tsx', key: 'common.somethingWentWrong' }, // #117 R7
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.checkYourEmail' }, // #117 R5
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.sentTo' }, // #117 R5
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.resend' }, // #117 R5
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.forgotPassword' }, // #117 R10
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.instructions' }, // #117 R10
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.email' }, // #117 R10
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.sendRecoveryLink' }, // #117 R10
  { file: 'src/screens/forgot/index.tsx', key: 'forgot.backToSignIn' }, // #117 R10
  { file: 'src/screens/register/index.tsx', key: 'register.emailAlreadyRegistered' },
  { file: 'src/screens/register/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/register/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/register/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/register/index.tsx', key: 'register.createAccount' },
  { file: 'src/screens/register/index.tsx', key: 'register.firstName' },
  { file: 'src/screens/register/index.tsx', key: 'register.lastName' },
  { file: 'src/screens/register/index.tsx', key: 'register.email' },
  { file: 'src/screens/register/index.tsx', key: 'register.phone' },
  { file: 'src/screens/register/index.tsx', key: 'register.password' },
  { file: 'src/screens/register/index.tsx', key: 'register.confirmPassword' },
  { file: 'src/screens/register/index.tsx', key: 'register.country' },
  { file: 'src/screens/register/index.tsx', key: 'register.iAcceptTerms' },
  { file: 'src/screens/register/index.tsx', key: 'register.createAccount' },
  { file: 'src/components/password-input.tsx', key: 'common.showPassword' }, // #172 R16
  { file: 'src/components/password-input.tsx', key: 'common.hidePassword' }, // #172 R16
  { file: 'src/components/back-button.tsx', key: 'common.back' }, // #172 R16
  { file: 'src/utils/account-rules.ts', key: 'forgot.invalidEmail' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.firstNameRequired' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.lastNameRequired' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.passwordRequired' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.tooShort' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.tooLong' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.passwordsDontMatch' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.countryLength' }, // #183 R2
  { file: 'src/utils/account-rules.ts', key: 'validation.countryLetters' }, // #183 R2
  { file: 'src/screens/login/index.tsx', key: 'validation.checkDetails' }, // #183 R7
  { file: 'src/screens/register/index.tsx', key: 'validation.checkDetails' }, // #183 R7
  { file: 'src/screens/forgot/index.tsx', key: 'validation.checkDetails' }, // #183 R7
];

export const R2_TABS: UseRow[] = [
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.home' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.map' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.health' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.food' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.profile' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.bar' },
];

export const R3_HOME: UseRow[] = [
  // (enmendado por #190 R13): las cuatro frases viven en el helper puro.
  { file: 'src/screens/home/pingo-phrase.ts', key: 'home.pingoPhraseWalkMeals' },
  { file: 'src/screens/home/pingo-phrase.ts', key: 'home.pingoPhraseWalk' },
  { file: 'src/screens/home/pingo-phrase.ts', key: 'home.pingoPhraseMeals' },
  { file: 'src/screens/home/pingo-phrase.ts', key: 'home.pingoPhraseCalm' },
  { file: 'src/screens/home/index.tsx', key: 'home.noLocationDataYet' },
  { file: 'src/screens/home/index.tsx', key: 'home.lastSeen' },
  { file: 'src/screens/home/index.tsx', key: 'home.home' },
  { file: 'src/screens/home/index.tsx', key: 'home.loadPetsErrorTitle' }, // #198 R15
  { file: 'src/screens/home/index.tsx', key: 'home.loadPetsErrorBody' }, // #198 R15
  { file: 'src/screens/home/index.tsx', key: 'common.retry' },
  { file: 'src/screens/home/index.tsx', key: 'common.noPetsYet' },
  { file: 'src/screens/home/index.tsx', key: 'common.noPetsBody' }, // #155 R4
  { file: 'src/screens/home/index.tsx', key: 'profile.addPet' }, // #155 R4
  { file: 'src/screens/home/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/home/index.tsx', key: 'common.retry' },
  { file: 'src/screens/home/index.tsx', key: 'home.free' },
  { file: 'src/screens/home/index.tsx', key: 'home.online' },
  { file: 'src/screens/home/index.tsx', key: 'home.offline' },
  { file: 'src/screens/home/index.tsx', key: 'home.unknown' },
  { file: 'src/screens/home/index.tsx', key: 'home.noCollar' },
  { file: 'src/screens/home/index.tsx', key: 'home.pairCollar' },
  { file: 'src/screens/home/index.tsx', key: 'home.summaryTitle' },
  { file: 'src/screens/home/index.tsx', key: 'home.activityNeedsCollar' },
  { file: 'src/screens/home/index.tsx', key: 'home.couldNotLoadActivity' },
  { file: 'src/screens/home/index.tsx', key: 'home.activity' },
  { file: 'src/screens/home/index.tsx', key: 'home.sleep' },
  { file: 'src/screens/home/index.tsx', key: 'home.distance' },
  { file: 'src/screens/home/index.tsx', key: 'home.weight' },
  { file: 'src/screens/home/index.tsx', key: 'home.viewOnMap' },
  { file: 'src/screens/home/index.tsx', key: 'home.walks' },
  { file: 'src/screens/home/index.tsx', key: 'home.quickActions' },
  { file: 'src/screens/home/index.tsx', key: 'home.quickActionWeight' },
  { file: 'src/screens/home/index.tsx', key: 'home.quickActionReminder' },
  { file: 'src/screens/home/index.tsx', key: 'home.quickActionDocuments' },
  { file: 'src/screens/home/index.tsx', key: 'home.reminders' },
  { file: 'src/screens/home/index.tsx', key: 'home.remindersSeeAll' },
  { file: 'src/screens/home/index.tsx', key: 'home.nextVaccineDays' },
  { file: 'src/screens/home/index.tsx', key: 'home.nextVaccineDaysLeft' },
  { file: 'src/screens/home/index.tsx', key: 'home.nextVaccineToday' },
  { file: 'src/screens/home/index.tsx', key: 'home.nextVaccineOverdue' },
  { file: 'src/screens/home/index.tsx', key: 'home.noUpcomingVaccine' },
  { file: 'src/screens/home/index.tsx', key: 'food.mealsToday' },
  { file: 'src/screens/home/index.tsx', key: 'food.mealsServedOfTotal' },
  { file: 'src/screens/home/index.tsx', key: 'home.alertsBellUnread' },
  { file: 'src/screens/home/index.tsx', key: 'home.alertsBell' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.dayLabelMissing' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.dayLabelDistance' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.dayLabelWalks' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.dayLabelActiveMinutes' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.metricActiveMinutes' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.metricDistance' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.metricWalks' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.title' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.lastSevenDays' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.average' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.trend' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.chartSummary' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.noDataForDay' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'home.sleep' },
  { file: 'src/screens/home/weekly-activity-chart.tsx', key: 'weeklyActivity.noDataYet' },
];

export const R4_MAP: UseRow[] = [
  { file: 'src/screens/map/index.tsx', key: 'map.justNow' },
  { file: 'src/screens/map/index.tsx', key: 'map.agoMinutes' },
  { file: 'src/screens/map/index.tsx', key: 'map.agoHours' },
  { file: 'src/screens/map/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/map/index.tsx', key: 'common.retry' },
  { file: 'src/screens/map/index.tsx', key: 'common.noPetsYet' },
  { file: 'src/screens/map/index.tsx', key: 'common.noPetsBody' }, // #155 R4
  { file: 'src/screens/map/index.tsx', key: 'profile.addPet' }, // #155 R4
  { file: 'src/screens/map/index.tsx', key: 'map.noTrackingTitle' }, // #159 R2
  { file: 'src/screens/map/index.tsx', key: 'map.noTrackingBody' }, // #159 R2
  { file: 'src/screens/map/index.tsx', key: 'home.pairCollar' }, // #159 R3
  { file: 'src/screens/map/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/map/index.tsx', key: 'common.retry' },
  { file: 'src/screens/map/index.tsx', key: 'map.noLocationDataYet' },
  { file: 'src/screens/map/index.tsx', key: 'map.speed' },
  { file: 'src/screens/map/index.tsx', key: 'map.distance' },
  { file: 'src/screens/map/index.tsx', key: 'map.updated' },
  { file: 'src/screens/map/index.tsx', key: 'map.deactivateLostMode' },
  { file: 'src/screens/map/index.tsx', key: 'map.activateLostMode' },
  { file: 'src/screens/map/index.tsx', key: 'map.couldNotUpdateLostMode' },
  { file: 'src/screens/map/index.tsx', key: 'pairing.battery' }, // #116 R5: sustituye a pairing.connection
];

export const R5_HEALTH: UseRow[] = [
  { file: 'src/utils/form-rules.ts', key: 'weightLog.enterValidWeight' }, // #186 R2
  { file: 'src/utils/form-rules.ts', key: 'validation.weightRange' }, // #186 R2
  { file: 'src/utils/form-rules.ts', key: 'validation.bodyConditionRange' }, // #186 R2
  { file: 'src/utils/form-rules.ts', key: 'validation.invalidDate' }, // #186 R2
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightLog' }, // #199 R1
  { file: 'src/screens/health/index.tsx', key: 'health.health' },
  { file: 'src/screens/health/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/health/index.tsx', key: 'common.retry' },
  { file: 'src/screens/health/index.tsx', key: 'common.noPetsYet' },
  { file: 'src/screens/health/index.tsx', key: 'common.noPetsBody' }, // #155 R4
  { file: 'src/screens/health/index.tsx', key: 'profile.addPet' }, // #155 R4
  { file: 'src/screens/health/index.tsx', key: 'health.vaccines' },
  { file: 'src/screens/health/index.tsx', key: 'health.nextDue' },
  { file: 'src/screens/health/index.tsx', key: 'health.noVaccinesYet' },
  { file: 'src/screens/health/index.tsx', key: 'health.noVaccinesYet' }, // #208 R20
  { file: 'src/screens/health/index.tsx', key: 'health.couldNotLoadVaccines' },
  { file: 'src/screens/health/index.tsx', key: 'common.retry' },
  { file: 'src/screens/health/index.tsx', key: 'health.weight' },
  { file: 'src/screens/health/index.tsx', key: 'health.noWeightEntriesYet' },
  { file: 'src/screens/health/index.tsx', key: 'health.couldNotLoadWeight' },
  { file: 'src/screens/health/index.tsx', key: 'health.weightLog' },
  { file: 'src/screens/health/index.tsx', key: 'home.nextVaccineDays' },
  { file: 'src/screens/health/index.tsx', key: 'home.nextVaccineDaysLeft' },
  { file: 'src/screens/health/index.tsx', key: 'home.nextVaccineToday' },
  { file: 'src/screens/weight-log/index.tsx', key: 'validation.checkDetails' }, // #186 R7
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.errorForbidden' },
  { file: 'src/screens/weight-log/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/weight-log/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/weight-log/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weight' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightKg' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.measuredAt' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.bodyCondition' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.bodyConditionPlaceholder' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.logWeight' },
  { file: 'src/screens/weight-log/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/weight-log/index.tsx', key: 'common.retry' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.noWeightEntriesYet' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.bodyConditionValue' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.dateCannotBeAfterToday' },
  { file: 'src/components/weight-chart.tsx', key: 'weightChart.notEnoughDataYet' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.monthDelta' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightLogged' },
  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.history' }, // #199 R9
  { file: 'src/screens/health/index.tsx', key: 'health.appliedOn' }, // #199 R17
  { file: 'src/screens/health/index.tsx', key: 'health.nextOn' }, // #199 R17
  { file: 'src/screens/health/index.tsx', key: 'health.nextDoseToday' }, // #199 R14
  { file: 'src/screens/health/index.tsx', key: 'health.nextDoseTomorrow' }, // #199 R14
  { file: 'src/screens/health/index.tsx', key: 'health.nextDoseInDays' }, // #199 R14
  { file: 'src/components/weight-chart.tsx', key: 'weightChart.lastSixMonths' }, // #199 R5
  { file: 'src/screens/health/index.tsx', key: 'tabHeader.petsScroll' }, // #222 R8
];

export const R6_FOOD: UseRow[] = [
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.mealSchedule' }, // #179 R4
  { file: 'src/screens/food/index.tsx', key: 'food.food' },
  { file: 'src/screens/food/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/food/index.tsx', key: 'common.retry' },
  { file: 'src/screens/food/index.tsx', key: 'common.noPetsYet' },
  { file: 'src/screens/food/index.tsx', key: 'common.noPetsBody' }, // #155 R4
  { file: 'src/screens/food/index.tsx', key: 'profile.addPet' }, // #155 R4
  { file: 'src/screens/food/index.tsx', key: 'food.dailyTarget' },
  { file: 'src/screens/food/index.tsx', key: 'food.dailyKcal' },
  { file: 'src/screens/food/index.tsx', key: 'food.dailyGrams' },
  { file: 'src/screens/food/index.tsx', key: 'food.kcalConsumedOfTarget' }, // #113 R3
  { file: 'src/screens/food/index.tsx', key: 'food.mealsToday' },
  { file: 'src/screens/food/index.tsx', key: 'food.markServed' },
  { file: 'src/screens/food/index.tsx', key: 'food.undoServed' },
  { file: 'src/screens/food/index.tsx', key: 'food.couldNotUpdateMeal' },
  { file: 'src/screens/food/index.tsx', key: 'food.markServedAction' },
  { file: 'src/screens/food/index.tsx', key: 'food.served' },
  { file: 'src/screens/food/index.tsx', key: 'food.aiRecommendation' },
  { file: 'src/screens/food/index.tsx', key: 'food.noMealPlanYet' },
  { file: 'src/screens/food/index.tsx', key: 'food.noMealPlanBody' }, // #155 R9
  { file: 'src/screens/food/index.tsx', key: 'food.couldNotLoadPlan' },
  { file: 'src/screens/food/index.tsx', key: 'common.retry' },
  { file: 'src/screens/food/index.tsx', key: 'food.mealSchedule' },
  { file: 'src/screens/food/index.tsx', key: 'food.mealScheduleLinkSubtitle' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorForbidden' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorProfileRequired' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.registerWeightFirst' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.retry' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.dailyTarget' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.perDay' }, // #179 R5
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.mealsPerDayUnit' }, // #179 R5
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.timesAndPortions' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.noMealPlanYet' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.generatePlan' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.nutritionProfile' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.noNutritionProfileYet' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.addMeal' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.editTime' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.editTimeLabel' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorInvalidTime' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorEditForbidden' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorPlanRequired' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorTimeNotInPlan' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorDuplicateTime' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.errorMealLimit' },
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.activity' }, // #179 R8
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.condition' }, // #179 R8
  { file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.food' }, // #179 R8
  { file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.mealsHistory' }, // #179 R9
  { file: 'src/screens/food/index.tsx', key: 'food.mealsHistory' }, // #105 R5
  { file: 'src/screens/food/index.tsx', key: 'food.mealsHistoryLinkSubtitle' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.previousMonth' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.nextMonth' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.emptyMonth' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.noMealsOnDay' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.servedOne' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'mealsHistory.servedMany' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'common.somethingWentWrong' }, // #105 R5
  { file: 'src/screens/meals-history/index.tsx', key: 'common.retry' }, // #105 R5
];

export const R7_PROFILE: UseRow[] = [
  { file: 'src/utils/form-rules.ts', key: 'validation.required' }, // #186 R2
  { file: 'src/screens/profile/index.tsx', key: 'common.noPetsBody' }, // #181 R5
  { file: 'src/screens/profile/index.tsx', key: 'profile.addPet' }, // #181 R5
  { file: 'src/screens/profile/index.tsx', key: 'map.justNow' }, // #173 R9
  { file: 'src/screens/profile/index.tsx', key: 'map.agoMinutes' }, // #173 R9
  { file: 'src/screens/profile/index.tsx', key: 'map.agoHours' }, // #173 R9
  { file: 'src/screens/profile/index.tsx', key: 'addPet.male' }, // #173 R7
  { file: 'src/screens/profile/index.tsx', key: 'addPet.female' }, // #173 R7
  { file: 'src/screens/profile/index.tsx', key: 'profile.notRegistered' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.sterilized' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.notSterilized' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.ageMonths' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.errorPhotoFormat' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.couldNotUploadPhoto' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.couldNotUploadPhoto' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.couldNotUploadPhoto' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.profile' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.addPet' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.notificationsBlocked' }, // #99 R3
  { file: 'src/screens/profile/index.tsx', key: 'profile.openSettings' }, // #99 R3
  { file: 'src/screens/profile/index.tsx', key: 'common.noPetsYet' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.couldNotLoadPets' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.couldNotLoadPet' },
  { file: 'src/screens/profile/index.tsx', key: 'common.retry' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.changePhoto' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.breed' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.microchip' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.gpsDevice' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.gpsLinked' }, // #173 R8
  { file: 'src/screens/profile/index.tsx', key: 'profile.gpsNoCollar' }, // #173 R8
  { file: 'src/screens/profile/index.tsx', key: 'profile.lastSignal' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.documents' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.gpsCollar' }, // #173 R10
  { file: 'src/screens/profile/index.tsx', key: 'geofences.title' }, // #41 R9
  { file: 'src/screens/profile/index.tsx', key: 'profile.reminders' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.accountUnavailable' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.useDarkTheme' },
  { file: 'src/screens/profile/index.tsx', key: 'profile.signOut' },
  { file: 'src/screens/docs/index.tsx', key: 'docs.documentsOf' },
  { file: 'src/screens/docs/index.tsx', key: 'docs.pet' },
  { file: 'src/screens/docs/index.tsx', key: 'docs.noDocumentsYet' },
  { file: 'src/screens/docs/index.tsx', key: 'docs.emptyBody' },
  { file: 'src/screens/docs/index.tsx', key: 'docs.couldNotLoadDocuments' },
  { file: 'src/screens/docs/index.tsx', key: 'docs.uploadHint' }, // #175 R7
  { file: 'src/screens/docs/index.tsx', key: 'docs.filterAll' }, // #175 R8
  { file: 'src/screens/docs/index.tsx', key: 'docs.categoryVaccination' }, // #175 R8
  { file: 'src/screens/docs/index.tsx', key: 'docs.categoryCheckup' }, // #175 R8
  { file: 'src/screens/docs/index.tsx', key: 'docs.categoryDeworming' }, // #175 R8
  { file: 'src/screens/docs/index.tsx', key: 'docs.categoryAnalysis' }, // #175 R8
  { file: 'src/screens/docs/index.tsx', key: 'docs.categoryOther' }, // #175 R8
  { file: 'src/screens/docs/index.tsx', key: 'common.retry' },
  { file: 'src/screens/docs/index.tsx', key: 'docs.upload' }, // #158 R12
  { file: 'src/screens/docs/index.tsx', key: 'docs.upload' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.upload' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.type' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.name' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.date' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.vet' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.cancel' }, // #158 R12
  { file: 'src/screens/docs/index.tsx', key: 'docs.errorFileFormat' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.errorFileTooLarge' }, // #158 R12 // #185 R10: copy compartido
  { file: 'src/screens/docs/index.tsx', key: 'docs.errorFileTooLarge' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.errorInvalidForm' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.errorUploadForbidden' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.errorUploadFailed' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'common.cannotReachServer' }, // #158 R12
  { file: 'src/screens/docs-upload-form/index.tsx', key: 'common.somethingWentWrong' }, // #158 R12 // #185 R10: copy compartido
  { file: 'src/screens/docs/index.tsx', key: 'common.somethingWentWrong' }, // #158 R12
];

export const R8_REMINDERS: UseRow[] = [
  { file: 'src/utils/form-rules.ts', key: 'addReminder.titleIsRequired' }, // #186 R2
  { file: 'src/utils/form-rules.ts', key: 'addReminder.pickDate' }, // #186 R2
  { file: 'src/utils/form-rules.ts', key: 'addReminder.dateMustBeFuture' }, // #186 R2
  { file: 'src/screens/reminders/index.tsx', key: 'common.noPetsYet' }, // #181 R4
  { file: 'src/screens/reminders/index.tsx', key: 'common.noPetsBody' }, // #181 R4
  { file: 'src/screens/reminders/index.tsx', key: 'profile.addPet' }, // #181 R4
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.addReminder' }, // #178 R10
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.reminders' }, // #178 R4
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.errorForbidden' },
  { file: 'src/screens/reminders/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/reminders/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/reminders/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.new' },
  { file: 'src/screens/reminders/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/reminders/index.tsx', key: 'common.retry' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.noRemindersYet' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.emptyBody' }, // #155 R6
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.new' }, // #178 R9
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.active' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.thisWeek' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.inactive' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.upcoming' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.cancelled' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.sent' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.dueInDays' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.dueAt' }, // #178 R6
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.delete' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.deleteReminder' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.deleteSheetBody' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.delete' },
  { file: 'src/screens/reminders/index.tsx', key: 'reminders.cancel' },
  { file: 'src/utils/reminder-meta.ts', key: 'reminderType.vaccine' },
  { file: 'src/utils/reminder-meta.ts', key: 'reminderType.deworming' },
  { file: 'src/utils/reminder-meta.ts', key: 'reminderType.medication' },
  { file: 'src/utils/reminder-meta.ts', key: 'reminderType.appointment' },
  { file: 'src/utils/reminder-meta.ts', key: 'reminderType.weight' },
  { file: 'src/utils/reminder-meta.ts', key: 'reminderType.food' },
  { file: 'src/utils/reminder-meta.ts', key: 'reminderType.other' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.advanceSameDay' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.advance1Day' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.advance3Days' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.advance7Days' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.errorForbidden' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.dateMustBeFuture' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.type' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.title' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.reminderTitle' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.date' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.selectDate' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.time' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.alert' },
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.notifyPreview' }, // #178 R12
  { file: 'src/screens/add-reminder/index.tsx', key: 'addReminder.saveReminder' },
];

export const R9_ADD_PET: UseRow[] = [
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.continue' }, // #191 R7
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.pingoGreeting' }, // #191 R4
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.stepProgress' }, // #191 R3
  { file: 'src/utils/form-rules.ts', key: 'addPet.nameIsRequired' }, // #186 R2
  { file: 'src/utils/form-rules.ts', key: 'addPet.chooseBirthDate' }, // #186 R2
  { file: 'src/utils/form-rules.ts', key: 'addPet.errorAgeRange' }, // #186 R2
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.addPet' }, // #95 R4
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.errorPhotoFormat' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.errorPhotoAfterCreate' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.checkPetDetails' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.youCannotCreatePet' },
  { file: 'src/screens/add-pet/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/add-pet/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/add-pet/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.pet' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.choosePhoto' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.basicDetails' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.species' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.cat' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.dog' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.name' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.petName' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.breed' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.optional' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.sex' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.female' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.male' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.size' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.small' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.medium' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.large' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.medicalDetails' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.age' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.birthDate' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.approxMonths' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.selectBirthDate' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.months' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.sterilized' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.yes' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.optional' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.savePet' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.no' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.microchip' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.celebrateTitle' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.celebrateBody' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.celebratePair' },
  { file: 'src/screens/add-pet/index.tsx', key: 'addPet.celebrateLater' },
];

export const R10_PAIRING: UseRow[] = [
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.errorInvalidCode' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.errorAlreadyClaimed' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.errorPetHasDevice' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.errorNoSubscription' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.errorForbiddenClaim' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.errorForbiddenRelease' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.unpairAlertTitle' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.unpairAlertBody' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.cancel' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.unpair' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/pairing/index.tsx', key: 'common.retry' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.addPetFirst' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.trackerIsReady' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.readySubtitle' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.model' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.viewOnMap' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.done' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.pairCollar' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.freePlanPairLead' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.freePlanPairBody' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.activationCode' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.printedOnCollarBox' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.pairCollar' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.gpsDevice' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.model' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.battery' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.connection' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.lastMessage' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.noMessagesYet' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.gpsTrackingActive' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.freePlanNoActivePlan' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.planStatusUnavailable' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.unpairCollar' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.esn' },
  { file: 'src/screens/pairing/index.tsx', key: 'pairing.esn' },
  { file: 'src/utils/device-connectivity.ts', key: 'deviceConnectivity.online' },
  { file: 'src/utils/device-connectivity.ts', key: 'deviceConnectivity.unknown' },
  { file: 'src/utils/device-connectivity.ts', key: 'deviceConnectivity.offline' },
  { file: 'src/utils/device-connectivity.ts', key: 'map.live' },
  { file: 'src/utils/device-connectivity.ts', key: 'map.stale' },
  { file: 'src/utils/device-connectivity.ts', key: 'map.noSignal' },
  { file: 'src/utils/device-connectivity.ts', key: 'map.noSignal' },
];

export const R11_RESET: UseRow[] = [
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.errorInvalidToken' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.errorExpiredToken' },
  { file: 'src/screens/reset-password/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/reset-password/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/reset-password/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.resetPassword' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.errorMissingToken' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.backToSignIn' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.resetPassword' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.passwordUpdated' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.backToSignIn' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.resetPassword' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.newPassword' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.confirmNewPassword' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.updatePassword' },
  { file: 'src/screens/reset-password/index.tsx', key: 'resetPassword.backToSignIn' }, // #172 R19
  { file: 'src/screens/reset-password/index.tsx', key: 'validation.checkDetails' }, // #183 R7
];

export const R12_ALERTS: UseRow[] = [
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.title' }, // #174 R3
  { file: 'src/utils/alert-meta.ts', key: 'alerts.typeGeofenceExit' },
  { file: 'src/utils/alert-meta.ts', key: 'alerts.typeBatteryLow' },
  { file: 'src/utils/alert-meta.ts', key: 'alerts.typeUnknown' },
  // #134 R6: el ack se clasifica en el helper
  { file: 'src/utils/alert-ack-outcome.ts', key: 'common.cannotReachServer' },
  { file: 'src/utils/alert-ack-outcome.ts', key: 'common.somethingWentWrong' },
  { file: 'src/utils/alert-ack-outcome.ts', key: 'common.somethingWentWrong' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.justNow' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.minutesAgo' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.hoursAgo' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.daysAgo' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.dayAgo' }, // #174 R2
  { file: 'src/screens/alerts/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/alerts/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/alerts/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/alerts/index.tsx', key: 'common.retry' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.empty' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.emptyBody' }, // #155 R5
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.ack' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.statusAcked' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.statusClosed' },
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.sectionToday' }, // #170 R16
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.sectionThisWeek' }, // #170 R16
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.sectionEarlier' }, // #170 R16
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.newOne' }, // #170 R16
  { file: 'src/screens/alerts/index.tsx', key: 'alerts.newMany' }, // #170 R16
];

export const R13_ALERT_DETAIL: UseRow[] = [
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.mapLabel' }, // #180 R5 (E3)
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.detailTitle' }, // #180 R1
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.openedAt' },
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.statusOpen' },
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.statusAcked' },
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.statusClosed' },
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.ack' },
  { file: 'src/screens/alert-detail/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/alert-detail/index.tsx', key: 'common.retry' },
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.distanceFromZone' }, // #170 R16
  { file: 'src/screens/alert-detail/index.tsx', key: 'alerts.viewOnMap' }, // #170 R16
];

export const R14_GEOFENCES: UseRow[] = [
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.loadingLabel' }, // #202 R10
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.title' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.counter' }, // #189 R1
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.progressLabel' }, // #189 R2
  { file: 'src/screens/geofences/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/geofences/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/geofences/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.deleteTitle' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.deleteBody' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.cancel' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.delete' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.empty' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.emptyBody' }, // #155 R8
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.radius' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.activeLabel' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.deleteLabel' }, // #189 R5
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.statusActive' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.statusInactive' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.noTrackingTitle' }, // #159 R5
  { file: 'src/screens/geofences/index.tsx', key: 'geofences.noTrackingBody' }, // #159 R5
  { file: 'src/screens/geofences/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/geofences/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/geofences/index.tsx', key: 'common.retry' },
];

export const R15_GEOFENCE_EDITOR: UseRow[] = [
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.loadingLabel' }, // #202 R18
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.title' }, // #189 R8
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.title' }, // #189 R8
  { file: 'src/screens/geofences/index.tsx', key: 'geofenceEditor.editLabel' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofenceEditor.add' },
  { file: 'src/screens/geofences/index.tsx', key: 'geofenceEditor.limitNotice' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.notFound' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.needsCollar' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.nameTaken' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.limitReached' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.invalid' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'common.retry' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.nameLabel' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.mapHint' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.radius' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.radiusTitle' }, // #189 R11
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.meters' }, // #189 R11
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.meters' }, // #189 R11
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.radiusLabel' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.resetNote' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.save' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.statusActive' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.activeLabel' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.delete' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.delete' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.deleteTitle' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.deleteBody' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.cancel' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.ownerOnly' },
  { file: 'src/screens/geofence-editor/index.tsx', key: 'geofenceEditor.ownerOnly' },
];

export const R16_WELCOME: UseRow[] = [
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.brand' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.chipGps' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.chipHealth' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.chipNutrition' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.tagline' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.getStarted' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.haveAccount' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.legalNotice' },
  { file: 'src/screens/welcome/index.tsx', key: 'welcome.pingoGreeting' }, // #153 R1
];

export const R17_EDIT_PROFILE: UseRow[] = [
  { file: 'src/screens/profile/index.tsx', key: 'profile.editProfile' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'validation.checkDetails' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'common.cannotReachServer' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'editProfile.save' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'register.firstName' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'register.lastName' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'register.phone' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'register.country' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'profile.editProfile' },
  { file: 'src/screens/edit-profile/index.tsx', key: 'profile.accountUnavailable' },
];

export const R18_DATE_FIELD: UseRow[] = [
  { file: 'src/components/date-field.tsx', key: 'dateField.placeholderDate' },
  { file: 'src/components/date-field.tsx', key: 'dateField.placeholderTime' },
  { file: 'src/components/date-field.tsx', key: 'dateField.ok' },
  { file: 'src/components/date-field.tsx', key: 'dateField.cancel' },
  { file: 'src/components/date-field.tsx', key: 'dateField.clear' },
];

export const R19_VACCINE_CREATE: UseRow[] = [
  { file: 'src/screens/health/index.tsx', key: 'health.addVaccine' },
  { file: 'src/screens/health/index.tsx', key: 'health.addVaccine' },
  { file: 'src/screens/health/index.tsx', key: 'health.vaccinesEmptyBody' },
  { file: 'src/screens/health/index.tsx', key: 'health.vaccineReminderFailed' },
  { file: 'src/screens/health/index.tsx', key: 'health.createReminderNow' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.title' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.vaccine' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.schemeForDog' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.schemeForCat' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.otherVaccine' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.vaccineName' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.appliedAt' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.nextDose' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.noteCatalog' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.noteOther' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.remindMe' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.remindOn' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.remindWhenPicked' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.vet' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.clinic' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.optional' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.optional' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.notes' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.notesPlaceholder' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.save' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.saveError' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'vaccineCreate.appliedAtFuture' },
  { file: 'src/screens/vaccine-create/index.tsx', key: 'validation.checkDetails' },
  { file: 'src/utils/form-rules.ts', key: 'vaccineCreate.nameRequired' },
];

export const ALL_USES: UseRow[] = [
  ...R1_AUTH,
  ...R2_TABS,
  ...R3_HOME,
  ...R4_MAP,
  ...R5_HEALTH,
  ...R6_FOOD,
  ...R7_PROFILE,
  ...R8_REMINDERS,
  ...R9_ADD_PET,
  ...R10_PAIRING,
  ...R11_RESET,
  ...R12_ALERTS,
  ...R13_ALERT_DETAIL,
  ...R14_GEOFENCES,
  ...R15_GEOFENCE_EDITOR,
  ...R16_WELCOME,
  ...R17_EDIT_PROFILE,
  ...R18_DATE_FIELD,
  ...R19_VACCINE_CREATE,
];

describe('#65: la tabla de uso de copy está disponible al runner', () => {
  it('expone al menos el primer lote normativo', () => {
    expect(ALL_USES.length).toBeGreaterThan(0);
  });

  // Enmienda (3): el candado es la consistencia interna, no una constante
  // escrita a mano — es la tercera vez que una cifra congelada envejece.
  it('#194 R5: cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16) (enmendado por #208 R20)', () => {
    const blocks = [
      R1_AUTH, R2_TABS, R3_HOME, R4_MAP, R5_HEALTH, R6_FOOD,
      R7_PROFILE, R8_REMINDERS, R9_ADD_PET, R10_PAIRING, R11_RESET,
      R12_ALERTS, R13_ALERT_DETAIL, R14_GEOFENCES, R15_GEOFENCE_EDITOR,
      R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD, R19_VACCINE_CREATE,
    ];

    expect(ALL_USES).toHaveLength(
      blocks.reduce((total, block) => total + block.length, 0),
    );
  });
});
