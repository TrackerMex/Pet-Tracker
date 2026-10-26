---
feature: "mobile-theme-flash-statusbar"
status: draft
tags: [harness, spec]
---

# Tareas — [[mobile-theme-flash-statusbar]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y tiene
> siempre los mismos 3 sub-items, en este orden. El inventario de candados está en [[design]].

## Cadena de commits (test primero, historial rojo a verde)

Cada par es un commit `test(...)` que deja un test rojo por la razón correcta y un
commit `feat(...)` que lo pone verde. Ningún commit mezcla tests, implementación y docs.
Cada commit corre `bun run typecheck`, el jest de su alcance (`bun run test <fichero>`; las rutas con paréntesis `(tabs)` no se
pasan posicionales porque jest las toma por regex y salta el fichero con exit 0: usar el
fichero sin paréntesis o el jest completo) y, antes de
C10, C11 y C12, el jest completo **sin pipe**. Los dobles que `RootLayout` necesita en
`layout.test.tsx` van en el commit `test` (C5): son inofensivos para el código viejo.

| Commit | Tipo | Contenido | R |
|---|---|---|---|
| C1 | test | `theme/__tests__/navigation-theme.test.tsx` rojo (el módulo no existe) | R1 |
| C2 | feat | `theme/navigation-theme.ts` | R1 |
| C3 | test | `components/__tests__/hero-status-bar.test.tsx` rojo (el componente no existe) | R5 |
| C4 | feat | `components/hero-status-bar.tsx` | R5 |
| C5 | test | `app/__tests__/layout.test.tsx`: dobles nuevos (`ThemeProvider`, `navigation-theme`, `expo-status-bar`) y los `it` R2 y R4; `app/__tests__/theme-scene.test.tsx` nuevo con los `it` R3. Todos rojos | R2, R3, R4 |
| C6 | feat | `app/_layout.tsx`: `useNavigationTheme()`, `<ThemeProvider>`, `<StatusBar style="auto" />` | R2, R3, R4 |
| C7 | test | `screens/home/index.test.tsx` y `screens/profile/index.test.tsx`: doble de `expo-status-bar` y los `it` R6, rojos | R6 |
| C8 | feat | `<HeroStatusBar />` condicional en Inicio y Perfil | R6 |
| C9 | test | `design-drift.test.ts`: `describe` de R8, R9, R11 (rojos: los ficheros, el paquete y los mocks aún existen) y de R12 (nace verde: los dos ficheros existen desde C2 y C4; se anota en el reporte); `profile/index.test.tsx`: `it` R10 rojo (el interruptor aún usa el hook) | R8-R12 |
| C10 | feat | Perfil: interruptor `Uniwind.setTheme` + `setStoredTheme` e imports; borrar `theme-transition.ts`, `nitro-availability.ts` y sus dos tests; quitar de `profile/index.test.tsx` el import, los dos `jest.mock` nitro y el `it('R2: …')`; quitar de `screens.test.tsx` el `jest.mock` nitro | R9, R10, R11 |
| C11 | feat | `bun remove react-native-nitro-theme-transition react-native-nitro-modules` desde `mobile-pet-tracker/`, más la edición manual de `transformIgnorePatterns` | R8 |
| C12 | docs | `traceability.md` con hashes y `progress/impl_mobile-theme-flash-statusbar.md` (incluye el diff de `bun.lock` de R8 y el diff vacío de `(tabs)/_layout.tsx` de R7) | todos |

Cuentas encadenadas (delta de `it` esperado por commit, a medir y escribir en el reporte
como `total anterior + añadidos - eliminados`): C1 `+2`; C3 `+2`; C5 `+5` (`layout.test.tsx`
R2 x2 y R4 x1, `theme-scene.test.tsx` R3 x2); C7 `+4` (R6 x4); C9 `+7` (`design-drift`
R8 x2, R9 x2, R11 x1, R12 x1, y `profile/index.test.tsx` R10 x1); C10 `-8` (6 + 1 `it`
de los dos ficheros `theme-transition` y el `R2: el toggle dispara el fade` de Perfil);
C2, C4, C6, C8, C11 y C12 `+0`. Candados de copy y de clases: delta `+0` en **todos** los
commits.

Prohibido para Codex: `./init.sh` (lo corre el leader), crear recursos AWS, `eas build`,
cualquier reconstrucción del dev build (G3), tocar `app/(tabs)/_layout.tsx`, `app.json`,
`global.css`, `docs/`. Skills: nombres del catálogo de Codex del handoff, no los de
Claude Code. Esperas sobre el árbol: `docs/conventions.md` §Esperas sobre el árbol
renderizado (`await` en `fireEvent`, `renderRouter` y `act`; sin contadores de mock).
Los candados con una ancla negativa (R8, R9, R11, R12) se prueban contra una cadena
plantada **antes** de aplicarse a los ficheros reales, y el reporte cita la mutación
plantada y el rojo obtenido.

## R1 — `useNavigationTheme` (`theme/navigation-theme.ts`)

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — `ThemeProvider` raíz

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — las pestañas leen los tokens

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — `StatusBar` automática global

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — `HeroStatusBar` con puerta de foco

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — `HeroStatusBar` solo en las ramas con hero

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — `(tabs)/_layout.tsx` sin cambio

- [ ] (1) Confirmar que los dos candados existentes (`layout.test.tsx` de `(tabs)` y `tabs-layout.test.tsx`) siguen verdes sin editarlos
- [ ] (2) Confirmar `git diff --stat origin/dev -- 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx'` vacío
- [ ] (3) Refactor con tests verdes

## R8 — dependencias nitro fuera de `package.json` y `bun.lock`

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — ficheros de la transición borrados y grep-clean de producción

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — interruptor de tema instantáneo

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — ningún test nombra nitro

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — sin copy, sin clases, sin escapes de estilo

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes
