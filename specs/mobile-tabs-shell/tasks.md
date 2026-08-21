---
feature: "mobile-tabs-shell"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-tabs-shell]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]].
> Commits test-primero: el commit del test rojo precede (o acompaña con
> historial rojo→verde verificable) al de la implementación. R3 y R4 son la
> excepción documentada a C4 (§Excepción en [[requirements]]).

## R1 — Guard de sesión en (tabs)/_layout.tsx

- [ ] (1) Escribir test que falla para R1 (`src/app/(tabs)/__tests__/layout.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`(tabs)/_layout.tsx` con FloatingTabBar aún stub si hace falta)
- [ ] (3) Refactor con tests verdes

## R2 — Guard inverso en (auth)/_layout.tsx

- [ ] (1) Escribir test que falla para R2 (`src/app/(auth)/__tests__/layout.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Destino post-sesión /home (excepción C4)

- [ ] (1) Actualizar asserts `/health` → `/home` en las 3 suites de #33 (quedan rojas)
- [ ] (2) Cambiar los 3 hrefs en `index.tsx`, `login.tsx`, `register.tsx` (verdes)
- [ ] (3) Verificar con `git diff` que no cambió nada más

## R4 — Mudanza de health.tsx a (tabs)/ (excepción C4)

- [ ] (1) `git mv` de pantalla y suite a `(tabs)/`
- [ ] (2) Ajustar SOLO imports/paths; suite verde
- [ ] (3) Verificar con `git diff` que los asserts no cambian

## R5 — Placeholders home/map/food/profile

- [ ] (1) Escribir test que falla para R5 (`src/app/(tabs)/__tests__/screens.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (4 pantallas)
- [ ] (3) Refactor con tests verdes

## R6 — Sign out en Profile

- [ ] (1) Escribir test que falla para R6 (mismo archivo screens.test.tsx)
- [ ] (2) Implementación mínima que lo pasa (Button + signOut)
- [ ] (3) Refactor con tests verdes

## R7 — FloatingTabBar: render y navegación

- [ ] (1) Escribir test que falla para R7 (`src/components/__tests__/floating-tab-bar.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (D3 completo)
- [ ] (3) Refactor con tests verdes

## R8 — FloatingTabBar: flotante + safe area

- [ ] (1) Escribir test que falla para R8 (mismo archivo)
- [ ] (2) Implementación mínima que lo pasa (insets.bottom + 12)
- [ ] (3) Refactor con tests verdes

## R9 — Typecheck y lint

- [ ] `bun run typecheck` exit 0 (regenerar tipos con `bunx expo start` si hace falta)
- [ ] `bun run lint` exit 0
- [ ] Anotar resultados en `progress/impl_mobile-tabs-shell.md`

## R10 — Contención

- [ ] `./init.sh` exit 0
- [ ] `bun run test` (suite completa móvil) verde
- [ ] `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` vacío

## R11 — Smoke humano (Expo Go)

- [ ] Humano ejecuta los 7 pasos de R11 y marca el checkbox en [[requirements]]
