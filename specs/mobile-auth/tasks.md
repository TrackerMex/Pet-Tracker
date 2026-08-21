---
feature: "mobile-auth"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-auth]]

> Disciplina TDD por requisito de [[requirements]]. Commits test-primero
> explícitos: el commit del test rojo precede al commit que lo pone verde —
> no un solo commit con todo (lección de #19, CHECKPOINTS C4). D1 (dep) y
> R6 (mudanza) van bajo la excepción C4 de [[requirements]].
> Convención de commit: `feat(mobile-auth): <desc> (R<n>)`.

## R1/R2 — src/api/auth.ts

- [x] (1) Escribir `src/api/__tests__/auth.test.ts`
      (`describe('R1: ...')` + `describe('R2: ...')`, tabla de kinds de
      design §D2) y verlo ROJO
- [x] (2) Ampliar `src/api/types.ts` (D3) e implementar `src/api/auth.ts`
      (D2) → verde
- [x] (3) Refactor con tests verdes (helper `apiUrl` compartido, cero
      imports de storage/React en `src/api/`)

## R3/R4 — AuthProvider

- [x] (1) Instalar `expo-secure-store` (D1, excepción C4) y escribir
      `src/providers/__tests__/auth-provider.test.tsx`
      (`describe('R3: ...')` + `describe('R4: ...')`, mock de
      expo-secure-store) y verlo ROJO
- [x] (2) Implementar `src/providers/auth-provider.tsx` (contrato D4) →
      verde
- [x] (3) Refactor; verificar `grep -r "expo-secure-store"
      mobile-pet-tracker/src/api/` vacío

## R6 — Mudanza pantalla health (antes que R5: libera index.tsx)

- [ ] (1) Red de seguridad: suite existente verde antes de mover
- [ ] (2) `git mv`-equivalente: `src/app/index.tsx` → `src/app/health.tsx`
      y `src/app/__tests__/index.test.tsx` → `health.test.tsx`, cambiando
      SOLO imports/paths (asserts intactos)
- [ ] (3) Suite `health.test.tsx` verde

## R5 — Splash + providers en _layout

- [ ] (1) Escribir el nuevo `src/app/__tests__/index.test.tsx`
      (`describe('R5: splash navega según sesión')`, mocks de useAuth y
      expo-router según D9) y verlo ROJO
- [ ] (2) Reescribir `src/app/index.tsx` como Splash (D5) y añadir
      `AuthProvider` + `screenOptions={{ headerShown: false }}` en
      `src/app/_layout.tsx` → verde
- [ ] (3) Refactor con toda la suite verde

## R7 — Pantalla Login

- [ ] (1) `src/app/(auth)/__tests__/login.test.tsx`
      (`describe('R7: ...')`: submit ok → signIn + replace('/health');
      cada kind de error → su mensaje; links) y verlo ROJO
- [ ] (2) Implementar `src/app/(auth)/login.tsx` (estructura/testIDs D6) →
      verde
- [ ] (3) Refactor (cero StyleSheet/hex — grep del reviewer)

## R8 — Pantalla Register

- [ ] (1) `src/app/(auth)/__tests__/register.test.tsx`
      (`describe('R8: ...')`: submit ok → login encadenado → signIn +
      replace; email-taken; validation por path; submit deshabilitado sin
      terms) y verlo ROJO
- [ ] (2) Implementar `src/app/(auth)/register.tsx` (campos/testIDs D7) →
      verde
- [ ] (3) Refactor

## R9 — Pantalla Forgot (stub)

- [ ] (1) `src/app/(auth)/__tests__/forgot.test.tsx`
      (`describe('R9: ...')`: texto visible, input no editable, botón
      deshabilitado, cero llamadas a api) y verlo ROJO
- [ ] (2) Implementar `src/app/(auth)/forgot.tsx` (D8) → verde
- [ ] (3) Refactor

## R10 — Contención + init.sh verde

- [ ] (1) N/A
- [ ] (2) `./init.sh` exit 0
- [ ] (3) `git diff --stat main...HEAD -- backend-pet-tracker/ infra/
      init.config.sh .github/` vacío

## R11 — Gate humano: smoke Expo Go en Android físico

- [ ] Humano: pasos 1–7 de requirements §R11 (`bunx expo start --go`;
      register→auto-login, reapertura con sesión, credenciales malas,
      forgot stub). **No lo corre ninguna IA.**
