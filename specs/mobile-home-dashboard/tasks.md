---
feature: "mobile-home-dashboard"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-home-dashboard]]

> Disciplina TDD por requisito de [[requirements]]. Commits test-primero
> explícitos: el commit del test rojo precede al commit que lo pone verde —
> no un solo commit con todo (lección de #19, CHECKPOINTS C4). Los retoques
> a `screens.test.tsx` y `(tabs)/_layout.tsx` van bajo la excepción C4 de
> [[requirements]].
> Convención de commit: `feat(mobile-home): <desc> (R<n>)`.

## R1/R2 — src/api/pets.ts

- [ ] (1) Escribir `src/api/__tests__/pets.test.ts`
      (`describe('R1: ...')` + `describe('R2: ...')`, tabla de kinds de
      design §D5, asserts de URL y header Authorization) y verlo ROJO
- [ ] (2) Ampliar `src/api/types.ts` (D3), crear `src/api/http.ts` (D4) e
      implementar `src/api/pets.ts` (D5) → verde
- [ ] (3) Refactor con tests verdes (cero imports de storage/React en
      `src/api/`)

## R3 — src/api/activity.ts

- [ ] (1) `src/api/__tests__/activity.test.ts`
      (`describe('R3: ...')`: ok / 402 no-tracking / 401 / error /
      unreachable / missing-config) y verlo ROJO
- [ ] (2) Implementar `src/api/activity.ts` (D6) → verde
- [ ] (3) Refactor

## R4 — useApi

- [ ] (1) `src/hooks/__tests__/use-api.test.tsx`
      (`describe('R4: ...')`: data undefined → resultado, refetch, guard
      de carrera, fn null, unauthorized → signOut) y verlo ROJO
- [ ] (2) Implementar `src/hooks/use-api.ts` (D7, ≤30 líneas de lógica) →
      verde
- [ ] (3) Refactor

## R5 — SelectedPetProvider + montaje

- [ ] (1) `src/providers/__tests__/selected-pet-provider.test.tsx`
      (`describe('R5: ...')`) + caso nuevo en
      `src/app/(tabs)/__tests__/layout.test.tsx` (provider envuelve Tabs)
      y verlos ROJOS
- [ ] (2) Implementar `src/providers/selected-pet-provider.tsx` (D8) y
      envolver `<Tabs>` en `src/app/(tabs)/_layout.tsx` → verde
- [ ] (3) Refactor (asserts R1 de #34 intactos)

## R6 — Home: carga de pets + selector

- [ ] (1) `src/app/(tabs)/__tests__/home.test.tsx`
      (`describe('R6: ...')`: loading, error+retry, empty, chips en orden,
      selección por defecto, selectPet al pulsar) y verlo ROJO
- [ ] (2) Reescribir `src/app/(tabs)/home.tsx` (estructura D9, wiring
      useApi) y quitar el caso home de `screens.test.tsx` (excepción C4)
      → verde
- [ ] (3) Refactor (cero StyleSheet/hex — grep del reviewer)

## R7 — Pet card

- [ ] (1) `describe('R7: ...')` en home.test.tsx (skeleton, foto/fallback,
      nombre, breed null → '—', error con Retry) y verlo ROJO
- [ ] (2) Implementar la card en home.tsx → verde
- [ ] (3) Refactor

## R8 — Collar card

- [ ] (1) `describe('R8: ...')` (device null → Free sin batería; online
      con batería; connectivity null → Offline; batteryPct null → '—') y
      verlo ROJO
- [ ] (2) Implementar → verde
- [ ] (3) Refactor

## R9 — Today's Summary

- [ ] (1) `describe('R9: ...')` (ok con métricas, métricas null → '—',
      402 → nota de collar, error → nota de error, skeleton) y verlo ROJO
- [ ] (2) Implementar (formateadores fmtMinutes/fmtKm de D9) → verde
- [ ] (3) Refactor

## R10 — Last position card

- [ ] (1) `describe('R10: ...')` (visible solo con device, push('/map'),
      Last seen / No location data yet) y verlo ROJO
- [ ] (2) Implementar → verde
- [ ] (3) Refactor

## R11 — Typecheck + lint

- [ ] `bun run typecheck` y `bun run lint` en `mobile-pet-tracker/` con
      exit 0; anotado en `progress/impl_mobile-home-dashboard.md`

## R12 — Contención + init.sh + suite completa

- [ ] `./init.sh` exit 0
- [ ] `bun run test` (suite móvil completa) verde
- [ ] `git diff --stat main...HEAD -- backend-pet-tracker/ infra/
      init.config.sh .github/` vacío

## R13 — Gate humano: smoke Expo Go en Android físico

- [ ] Humano: pasos 1–8 de requirements §R13 (`bunx expo start --go`;
      2 mascotas — con y sin collar —, selector, collar/batería, summary
      free y sin datos, Retry con backend caído). **No lo corre ninguna IA.**
