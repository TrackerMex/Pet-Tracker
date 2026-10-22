import type { TranslationKey } from '../i18n/catalog';

export type RuleIssue = { labelKey: TranslationKey; params?: Record<string, number> };
export type FieldIssues<F extends string> = Partial<Record<F, RuleIssue>>;

// #183 R2: literal de zod 4.4.3, zod/v4/core/regexes.js (regexes.email).
export const EMAIL_PATTERN = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const COUNTRY_PATTERN = /^[A-Z]{2}$/;

const invalidEmail: RuleIssue = { labelKey: 'forgot.invalidEmail' };
const firstNameRequired: RuleIssue = { labelKey: 'validation.firstNameRequired' };
const lastNameRequired: RuleIssue = { labelKey: 'validation.lastNameRequired' };
const passwordRequired: RuleIssue = { labelKey: 'validation.passwordRequired' };
const passwordsDontMatch: RuleIssue = { labelKey: 'validation.passwordsDontMatch' };
const countryLength: RuleIssue = { labelKey: 'validation.countryLength' };
const countryLetters: RuleIssue = { labelKey: 'validation.countryLetters' };
const tooShort = (min: number): RuleIssue => ({ labelKey: 'validation.tooShort', params: { min } });
const tooLong = (max: number): RuleIssue => ({ labelKey: 'validation.tooLong', params: { max } });

export function validateLogin(values: { email: string; password: string }): FieldIssues<'email' | 'password'> {
  const issues: FieldIssues<'email' | 'password'> = {};
  if (!EMAIL_PATTERN.test(values.email)) issues.email = invalidEmail;
  if (values.password.length < 1) issues.password = passwordRequired;
  return issues;
}

export type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  passwordConfirmation: string;
};

export function validateRegister(values: RegisterValues): FieldIssues<keyof RegisterValues> {
  const issues: FieldIssues<keyof RegisterValues> = {
    ...validateForgot(values),
    ...validateResetPassword(values),
  };
  return { ...issues, ...validateProfile(values) };
}

export type ProfileValues = {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
};

export function validateProfile(values: ProfileValues): FieldIssues<keyof ProfileValues> {
  const issues: FieldIssues<keyof ProfileValues> = {};
  if (values.firstName.trim().length < 1) issues.firstName = firstNameRequired;
  else if (values.firstName.trim().length > 120) issues.firstName = tooLong(120);
  if (values.lastName.trim().length < 1) issues.lastName = lastNameRequired;
  else if (values.lastName.trim().length > 120) issues.lastName = tooLong(120);
  if (values.phone.trim().length < 7) issues.phone = tooShort(7);
  else if (values.phone.trim().length > 20) issues.phone = tooLong(20);
  if (values.country.length !== 2) issues.country = countryLength;
  else if (!COUNTRY_PATTERN.test(values.country)) issues.country = countryLetters;
  return issues;
}

export function validateForgot(values: { email: string }): FieldIssues<'email'> {
  const issues: FieldIssues<'email'> = {};
  if (!EMAIL_PATTERN.test(values.email)) issues.email = invalidEmail;
  else if (values.email.length > 320) issues.email = tooLong(320);
  return issues;
}

export function validateResetPassword(values: { password: string; passwordConfirmation: string }): FieldIssues<'password' | 'passwordConfirmation'> {
  const issues: FieldIssues<'password' | 'passwordConfirmation'> = {};
  if (values.password.length < 8) issues.password = tooShort(8);
  else if (values.password.length > 128) issues.password = tooLong(128);
  if (values.password !== values.passwordConfirmation) issues.passwordConfirmation = passwordsDontMatch;
  return issues;
}
