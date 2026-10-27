---
feature: "mobile-tab-avatar-header"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Tareas — [[mobile-tab-avatar-header]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa.
>
> **Commits test-primero (C4 de `CHECKPOINTS.md`)**: por cada R, un commit rojo
> (solo tests, con los `it` reescritos y los nuevos) y luego un commit verde
> (producción y docs). Convención: `test(mobile): ... (R<n>)` y
> `feat(mobile): ... (R<n>)`. Nada de un commit único con todo.
>
> **Orden** (cada paso deja la suite verde): R2, R8, R1, R7, R3, R4, R5, R6,
> R10, R14, R9 (los candados L1 a L9 se reescriben en el commit rojo del R que
> los hace caer, no al final; R9 los recoge en `traceability.md`), R11, y por
> último R12 y R13, donde solo R12 **espera a su casilla** (G4).
>
> **Sin reindentar**: el móvil no tiene prettier. Al envolver el `ScrollView`
> de Nutrición en `food-root` (R4.2, R7) se añade la apertura y el cierre sin
> tocar la sangría del interior (R14.3).
>
> **Skills**: cargar `expo:expo-overview` al empezar. Para Codex, los nombres de
> skill son los de su catálogo (`.claude/agents/leader.md` §Catálogo real de
> skills de Codex), no los nuestros.
>
> **Esperas**: seguir `docs/conventions.md` §Esperas sobre el árbol renderizado;
> no esperar a contadores de mock.

## R2 — PetSwitcher avatars: fila sin gap, edgeInset y scrollHint

- [x] (1) Escribir test que falla para R2: reescribir `reparte los cinco colores y vuelve a ámbar en la sexta mascota` (`toBe('flex-row')`, sufijo `(enmendado por #222 R2)`) y añadir los cuatro `it` de R2 en `src/components/__tests__/pet-switcher.test.tsx`
- [x] (2) Implementación mínima que lo pasa: `src/components/pet-switcher.tsx`, rama `avatars` (`flex-row`, `testID="pet-switcher-scroll"`, `contentContainerStyle` solo si `edgeInset !== undefined`, `accessibilityLabel={scrollHint}`), props opcionales en `PetSwitcherProps`
- [x] (3) Refactor con tests verdes (comprobar que `default` y `glass` siguen byte a byte; ancla B11 = 0)

## R8 — Copy `tabHeader.petsScroll` y filas de la tabla

- [x] (1) Escribir test que falla para R8: `#222 R8` en `src/__tests__/ui-language.test.ts` (literales es/en), los dos `toHaveLength` con `+ 1 // #222 R8`, y las dos filas nuevas en `src/__tests__/ui-copy-table.ts` (el test de la tabla cae porque aún no hay `t('tabHeader.petsScroll')` en las pantallas)
- [x] (2) Implementación mínima que lo pasa: clave en `src/i18n/catalog.ts` (`en` y `es`, junto a `'tabs.bar'`). Las llamadas `t()` llegan con R3 y R4: el commit verde de R8 deja ese `it` en rojo hasta entonces, así que **R8 y R3/R4 comparten el verde**: añadir las filas de la tabla en el commit rojo de R3 (Salud) y R4 (Nutrición), no antes
- [x] (3) Refactor con tests verdes (B20 = 2, B21 = 2; `SCREEN_FILES` sin cambio)

## R1 — Componente TabPetHeader

- [x] (1) Escribir test que falla para R1: crear `src/components/__tests__/tab-pet-header.test.tsx` con los seis `it` de R1 (doble de insets `{ top: 40, bottom: 24 }`)
- [x] (2) Implementación mínima que lo pasa: crear `src/components/tab-pet-header.tsx` (`TabPetHeader`, `TAB_PET_HEADER_HEIGHT`, `TAB_PET_HEADER_SCROLL_MIN`); sin `expo-blur`, sin `StyleSheet`, sin `t()`
- [x] (3) Refactor con tests verdes (ancla B7 = 1)

## R7 — Encabezado solo para lectores de pantalla

- [x] (1) Escribir test que falla para R7: los cuatro `it` de R7 en cada `index.test.tsx` (`getByRole('header', { name })`, `absolute size-px`, sin hijos, todos los estados, primer hijo) y reescribir `it.each(...)('pinta el título grande ($name)...')` de las tres pantallas como `pinta el encabezado oculto ($name)`
- [x] (2) Implementación mínima que lo pasa: `health-heading` (primer hijo de `health-root`), `food-heading` dentro del nuevo `food-root` (envoltorio sin reindentar, R4.2) y `profile-heading` (primer hijo del contenido del scroll de Perfil), con `t('health.health')`, `t('food.food')`, `t('profile.profile')` **reutilizando** la llamada existente (una sola por fichero, B8 a B10 = 1). Los títulos visibles siguen hasta R3, R4 y R5
- [x] (3) Refactor con tests verdes

## R3 — Salud

- [x] (1) Escribir test que falla para R3: los seis `it` nuevos de `src/screens/health/index.test.tsx`; reescribir o eliminar los listados en R9.1 para Salud (incluidos los de `/^pet-chip-/` y `contentContainerStyle`); añadir en `ui-copy-table.ts` la fila de Salud de R8.2 y el `+ 1` de `R5_HEALTH`
- [x] (2) Implementación mínima que lo pasa: en `src/screens/health/index.tsx`, quitar `health-header`, `health-title` y el `PetSwitcher` suelto; `paddingTop` condicional (121 / 52); `<TabPetHeader testID="health-pet-header" horizontalInset={24} scrollHint={pets.length >= TAB_PET_HEADER_SCROLL_MIN ? t('tabHeader.petsScroll') : undefined} />` entre el `ScrollView` y `vaccine-reminder-notice`
- [x] (3) Refactor con tests verdes (B1 = 0, B5 = 0; R14.4 intacto)

## R4 — Nutrición

- [x] (1) Escribir test que falla para R4: los cinco `it` nuevos de `src/screens/food/index.test.tsx`; reescribir los listados en R9.1 para Nutrición; añadir la fila de Nutrición de R8.2 y el `+ 1` de `R6_FOOD`
- [x] (2) Implementación mínima que lo pasa: en `src/screens/food/index.tsx`, quitar `food-title-row`, `food-title` y el `PetSwitcher` suelto; `paddingTop` condicional (119 / 52); `food-pet-header` con `horizontalInset={20}` tras el `ScrollView` dentro de `food-root`; mismo cálculo de `scrollHint`
- [x] (3) Refactor con tests verdes (B2 = 0, B3 = 0, B6 = 0, B16 = 1)

## R5 — Perfil con hero

- [x] (1) Escribir test que falla para R5: los cuatro `it` nuevos de `src/screens/profile/index.test.tsx`; reescribir los listados en R9.1 para Perfil (con hero)
- [x] (2) Implementación mínima que lo pasa: en `src/screens/profile/index.tsx`, `addPetCapsule` en lugar de `titleRow`, `profile-hero-top` con `justify-between`, `profile-hero-selector` y la cápsula, sin `profile-title`
- [x] (3) Refactor con tests verdes (B4 = 0, B14 = 1, B15 = 1)

## R6 — Perfil sin hero

- [x] (1) Escribir test que falla para R6: los dos `it` nuevos y `#196 R5: ... el aviso va tras profile-top-row`
- [x] (2) Implementación mínima que lo pasa: `profile-top-row` como primer hijo de `profile-content` cuando `!showHero`
- [x] (3) Refactor con tests verdes

## R10 — Grep-clean

- [x] (1) Escribir test que falla para R10: describe `#222 R10: grep-limpio` en `src/__tests__/tab-headers-canvas.test.ts` (tres `it`); reescribir L1 y L2 en el mismo fichero, L4 en `canvas-foundations.test.ts`, L5 en `profile-canvas-fidelity.test.ts`, L6 en `profile-photo-hero-canvas.test.ts` (`FILAS` a 23) y L8 en `alerts-canvas-fidelity.test.ts`
- [x] (2) Implementación mínima que lo pasa: ya está hecha por R2 a R6; si algún fichero conserva un id viejo, quitarlo aquí
- [x] (3) Refactor con tests verdes (B1 a B6, B13 en 0)

## R14 — Reparto de ficheros

- [x] (1) Escribir test que falla para R14: los dos `it` de R14 en `tab-headers-canvas.test.ts`
- [x] (2) Implementación mínima que lo pasa: comprobar con `git diff dev -- src/screens/` que el diff de las tres pantallas queda dentro de la región de R14.1
- [x] (3) Refactor con tests verdes (B19 sin cambios)

## R9 — Candados que cambian

- [x] (1) Escribir test que falla para R9: cada L1 a L10 reescrito con el sufijo `(enmendado por #222 R9)` en el commit rojo del R que lo hace caer (R2, R3, R4, R5, R6, R10); este sub-item verifica que ninguna fila de la tabla R9 y R9.1 quedó sin tocar
- [x] (2) Implementación mínima que lo pasa: nada de producción; solo confirmar con `grep -rnP "(?<![\w-])(health-title|food-title-row|food-title|profile-title)(?![\w-])" src --include=*.tsx -P` que solo quedan aserciones negativas en tests
- [x] (3) Refactor con tests verdes

## R11 — Bloques de enmienda en las siete specs y documentos

- [x] (1) Escribir test que falla para R11: describe `#222 R11` en `src/__tests__/hero-header-amendments.test.ts` (`AMENDED_DOCS_222` de siete filas, `SIGNATURE_LINE_222`, `canonicalAmendment222`, tres `it`)
- [x] (2) Implementación mínima que lo pasa: insertar el bloque canónico de `design.md` §2 y el marcador en prosa en las **seis** specs de R11.1 (la séptima fila, la carta, espera a R12). Mientras la carta no se enmiende, el test tolera que `docs/ui-guidelines.md` esté pendiente: la fila de la carta se añade a `AMENDED_DOCS_222` en el commit de R12
- [x] (3) Refactor con tests verdes (líneas de firma sin marcar)

## R12 — Carta: regla N1 (espera a G4)

- [ ] (1) Antes de empezar: `grep -cE '^- \[[xX]\] G4 ' specs/mobile-tab-avatar-header/requirements.md` debe dar 1. Si da 0, **parar**, dejar R12 y R13 sin marcar y decirlo en `progress/impl_mobile-tab-avatar-header.md`. Con G4 marcada: escribir el test que falla (`#222 R12: la carta recoge la enmienda N1 de #222` y la reescritura de la fila marcador de `AMENDED_DOCS_168`)
- [ ] (2) Implementación mínima que lo pasa: reescribir la regla N1 en `docs/ui-guidelines.md` con el texto de R12.1 y añadir el bloque canónico (R12.2); fila séptima de `AMENDED_DOCS_222` y constante `CHARTER_N1_222`
- [ ] (3) Refactor con tests verdes (B17 = 0, B18 = 1)

## R13 — Convenciones: excepción de la cabecera fija

- [x] (1) Escribir el test `#222 R13` que falla
- [x] (2) Implementación mínima que lo pasa: añadir el párrafo de R13.1 a `docs/conventions.md`
- [x] (3) Refactor con tests verdes
