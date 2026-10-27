---
feature: "mobile-theme-flash-statusbar"
status: approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-theme-flash-statusbar]]

Rutas relativas a `mobile-pet-tracker/src/`. Cada fila enlaza el commit primario de test y el de implementación; el implementer la rellena al cerrar.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `theme/__tests__/navigation-theme.test.tsx::#217 R1` | Test `bcfd8c0c` — `test(#217): R1 navigation theme from tokens`; implementación `605bee5a` — `feat(#217): R1 add useNavigationTheme` |
| R2 | `app/__tests__/layout.test.tsx::#217 R2` | Test `9f4a96ac` — `test(#217): R2-R4 root theme provider and status bar`; implementación `930ab8c4` — `feat(#217): R2-R4 wire ThemeProvider and StatusBar in RootLayout` |
| R3 | `app/__tests__/theme-scene.test.tsx::#217 R3` | Test `9f4a96ac` — `test(#217): R2-R4 root theme provider and status bar`; implementación `930ab8c4` — `feat(#217): R2-R4 wire ThemeProvider and StatusBar in RootLayout` |
| R4 | `app/__tests__/layout.test.tsx::#217 R4` | Test `9f4a96ac` — `test(#217): R2-R4 root theme provider and status bar`; implementación `930ab8c4` — `feat(#217): R2-R4 wire ThemeProvider and StatusBar in RootLayout` |
| R5 | `components/__tests__/hero-status-bar.test.tsx::#217 R5` | Test `a3fe0e60` — `test(#217): R5 hero status bar focus gate`; implementación `c696ba1a` — `feat(#217): R5 add HeroStatusBar` |
| R6 | `screens/home/index.test.tsx::#217 R6; screens/profile/index.test.tsx::#217 R6` | Test `3fc59121` — `test(#217): R6 hero status bar in home and profile`; implementación `1cba79d9` — `feat(#217): R6 request the light status bar on hero screens` |
| R7 | `app/(tabs)/__tests__/layout.test.tsx` y `app/__tests__/tabs-layout.test.tsx`, existentes y sin editar; diff de `(tabs)/_layout.tsx` vacío | Test existente `4abb8bc5` — `test(mobile-auth): #149 R1 red, tabs layout redirects to welcome`; implementación `930ab8c4` — `feat(#217): R2-R4 wire ThemeProvider and StatusBar in RootLayout` (solo raíz; conserva el layout de tabs) |
| R8 | `__tests__/design-drift.test.ts::#217 R8`; diff de bun.lock: 4 líneas eliminadas, 0 añadidas | Test `1c246d47` — `test(#217): R8-R12 lock the removal of nitro`; implementación `f0b81e59` — `feat(#217): R8 remove the nitro dependencies` |
| R9 | `__tests__/design-drift.test.ts::#217 R9` y sonda de import reintroducido en Perfil | Test `1c246d47` — `test(#217): R8-R12 lock the removal of nitro`; implementación `d0f09b8f` — `feat(#217): R9-R11 instant theme switch and drop the transition files` |
| R10 | `screens/profile/index.test.tsx::#217 R10; R4: toggle persiste; #196 R7` | Test `1c246d47` — `test(#217): R8-R12 lock the removal of nitro`; implementación `d0f09b8f` — `feat(#217): R9-R11 instant theme switch and drop the transition files` |
| R11 | `__tests__/design-drift.test.ts::#217 R11` | Test `1c246d47` — `test(#217): R8-R12 lock the removal of nitro`; implementación `d0f09b8f` — `feat(#217): R9-R11 instant theme switch and drop the transition files` |
| R12 | `__tests__/design-drift.test.ts::#217 R12`, mutación StyleSheet, guard de legibilidad enmendado, contadores de dependencias actualizados y suite completa; copy/clases protegidos salvo enmiendas autorizadas | Test `1c246d47` — `test(#217): R8-R12 lock the removal of nitro`; implementación `c696ba1a` — `feat(#217): R5 add HeroStatusBar` (desde C4 existen ambos ficheros nuevos sin escapes de estilo) |

## Enmiendas y verificación

- `b8dc3c03` y `916c279b`: aislamiento de temporizadores y captura de la sonda R3 en un efecto, conservando sus aserciones.
- `29c28fc2` (C6b): doble global de expo-status-bar autorizado en la enmienda del leader `48085402`; los seis tests renderRouter siguen sin editarse.
- `f41f93f3` (C9b): única ampliación de la lista de accent y sufijo del título en legibility-classnames, autorizados por `3051367d`.
- `27950bb3` (C11b): contadores de dependencias 44→42 y sufijos de los títulos en canvas-foundations y zones-canvas-fidelity, autorizados expresamente por el humano en la conversación; ninguna otra aserción se modifica.
- R12 nace verde porque los ficheros de producción ya existen desde C2/C4; su sensibilidad se probó plantando StyleSheet y revirtiéndolo.
- Resultados completos, aritmética por commit y sondas R1/R3/R4/R5/R9/R12: `../../progress/impl_mobile-theme-flash-statusbar.md`.
- Los gates G2 y G3 se reservan al humano; sus casillas de requirements.md no se han modificado.
