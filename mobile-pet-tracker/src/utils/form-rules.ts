import type { FieldIssues, RuleIssue } from './account-rules';

const nameRequired: RuleIssue = { labelKey: 'addPet.nameIsRequired' };
const birthDateRequired: RuleIssue = { labelKey: 'addPet.chooseBirthDate' };
const ageRange: RuleIssue = { labelKey: 'addPet.errorAgeRange' };
const titleRequired: RuleIssue = { labelKey: 'addReminder.titleIsRequired' };
const dateRequired: RuleIssue = { labelKey: 'addReminder.pickDate' };
const futureDate: RuleIssue = { labelKey: 'addReminder.dateMustBeFuture' };
const required: RuleIssue = { labelKey: 'validation.required' };
const invalidDate: RuleIssue = { labelKey: 'validation.invalidDate' };
const invalidWeight: RuleIssue = { labelKey: 'weightLog.enterValidWeight' };
const weightRange: RuleIssue = { labelKey: 'validation.weightRange' };
const bodyConditionRange: RuleIssue = { labelKey: 'validation.bodyConditionRange' };
const DECIMAL = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateAddPetBasics(values: { name: string }): FieldIssues<'name'> {
  return values.name.trim() ? {} : { name: nameRequired };
}

export function validateAddPet(values: {
  name: string;
  ageMode: 'birthDate' | 'months';
  birthDate: Date | null;
  approxAgeMonths: string;
}): FieldIssues<'name' | 'birthDate' | 'approxAgeMonths'> {
  const issues: FieldIssues<'name' | 'birthDate' | 'approxAgeMonths'> = validateAddPetBasics(values);
  if (values.ageMode === 'birthDate' && values.birthDate === null) {
    issues.birthDate = birthDateRequired;
  }
  if (values.ageMode === 'months') {
    if (!/^\d+$/.test(values.approxAgeMonths) || Number(values.approxAgeMonths) > 480) {
      issues.approxAgeMonths = ageRange;
    }
  }
  return issues;
}

export function validateReminder(values: {
  title: string;
  dueAt: Date | null;
  nowMs: number;
}): FieldIssues<'title' | 'date'> {
  const issues: FieldIssues<'title' | 'date'> = {};
  if (!values.title.trim()) issues.title = titleRequired;
  if (values.dueAt === null) issues.date = dateRequired;
  else if (values.dueAt.getTime() <= values.nowMs) issues.date = futureDate;
  return issues;
}

export function validateDocument(values: {
  type: string;
  name: string;
  date: string;
}): FieldIssues<'type' | 'name' | 'date'> {
  const issues: FieldIssues<'type' | 'name' | 'date'> = {};
  if (!values.type.trim()) issues.type = required;
  if (!values.name.trim()) issues.name = required;
  if (!isIsoDate(values.date.trim())) issues.date = invalidDate;
  return issues;
}

export function parseDecimal(text: string): number {
  return Number(text.trim().replace(',', '.'));
}

export function validateWeight(values: {
  weight: string;
  measuredAt: string;
  bodyCondition: string;
}): FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'> {
  const issues: FieldIssues<'weight' | 'measuredAt' | 'bodyCondition'> = {};
  if (!DECIMAL.test(values.weight.trim().replace(',', '.'))) issues.weight = invalidWeight;
  else if (parseDecimal(values.weight) <= 0 || parseDecimal(values.weight) > 999.99) {
    issues.weight = weightRange;
  }
  if (!isIsoDate(values.measuredAt.trim())) issues.measuredAt = invalidDate;
  const bodyCondition = values.bodyCondition.trim();
  if (bodyCondition && (!/^\d+$/.test(bodyCondition) || Number(bodyCondition) < 1 || Number(bodyCondition) > 9)) {
    issues.bodyCondition = bodyConditionRange;
  }
  return issues;
}

export function validateVaccine(values: {
  mode: 'catalog' | 'other';
  name: string;
}): FieldIssues<'name'> {
  return values.mode === 'other' && !values.name.trim()
    ? { name: { labelKey: 'vaccineCreate.nameRequired' } }
    : {};
}
