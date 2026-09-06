import type { TranslationKey } from '../i18n/catalog';

export type UseRow = { file: string; key: TranslationKey };

export const R1_AUTH: UseRow[] = [
  { file: 'src/app/(auth)/login.tsx', key: 'login.invalidCredentials' },
  { file: 'src/app/(auth)/login.tsx', key: 'common.cannotReachServer' },
  { file: 'src/app/(auth)/login.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/app/(auth)/login.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/app/(auth)/login.tsx', key: 'login.signIn' },
  { file: 'src/app/(auth)/login.tsx', key: 'login.email' },
  { file: 'src/app/(auth)/login.tsx', key: 'login.password' },
  { file: 'src/app/(auth)/login.tsx', key: 'login.signIn' },
  { file: 'src/app/(auth)/login.tsx', key: 'login.createAccount' },
  { file: 'src/app/(auth)/login.tsx', key: 'login.forgotPassword' },
  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.forgotPassword' },
  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.comingSoon' },
  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.email' },
  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.sendRecoveryLink' },
  { file: 'src/app/(auth)/forgot.tsx', key: 'forgot.backToSignIn' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.emailAlreadyRegistered' },
  { file: 'src/app/(auth)/register.tsx', key: 'common.cannotReachServer' },
  { file: 'src/app/(auth)/register.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/app/(auth)/register.tsx', key: 'common.somethingWentWrong' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.createAccount' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.firstName' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.lastName' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.email' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.phone' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.password' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.confirmPassword' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.country' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.iAcceptTerms' },
  { file: 'src/app/(auth)/register.tsx', key: 'register.createAccount' },
];

export const R2_TABS: UseRow[] = [
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.home' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.map' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.health' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.food' },
  { file: 'src/components/floating-tab-bar.tsx', key: 'tabs.profile' },
];

export const ALL_USES: UseRow[] = [...R1_AUTH, ...R2_TABS];

describe('#65: la tabla de uso de copy está disponible al runner', () => {
  it('expone al menos el primer lote normativo', () => {
    expect(ALL_USES.length).toBeGreaterThan(0);
  });
});
