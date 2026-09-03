---
feature: "mobile-ui-legibility-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-ui-legibility-polish]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Los sitios exactos,
> valores hex y clases están en [[design]] §4 y §3 — esta lista no los repite.

## Reglas de commit (C4 de [[../../CHECKPOINTS|CHECKPOINTS]]) — NO negociables

Codex CLI **debe** dejar historial rojo→verde por requisito. En la feature #19
se entregó implementación + tests + docs en un solo commit, sin historial, y se
incumplió C4. Aquí no se repite:

1. **Commit rojo**: solo el test nuevo, fallando. El mensaje nombra su R-id.
   `test(mobile-ui-legibility): R<n> <qué afirma> (rojo)`
2. **Commit verde**: la implementación mínima que lo pasa.
   `feat(mobile-ui-legibility): R<n> <qué cambia>`
3. **Commit de refactor** (solo si hace falta): con la suite verde.
   `refactor(mobile-ui-legibility): R<n> <qué se limpia>`

Un commit que mezcle test rojo e implementación es un incumplimiento de C4 y el
`reviewer` lo rechaza aunque la suite esté verde. Cada commit corre
`bun test` en `mobile-pet-tracker/` antes de existir.

Orden obligatorio: **R1 primero** (dependencia declarada del hallazgo 21, ver
[[design]] §D2 y §9), luego R2→R3, luego el resto.

Skills a cargar antes de escribir código (carta §Skills):
`appllama-app-design-skill`, `expo:expo-overview` → `expo:expo-native-ui` y
`expo:expo-design-system`. De appllama se toma el patrón, **nunca** su sistema
de estilos.

Branch: `feature/61-mobile-ui-legibility-polish` (ya creada). No se commitea a
`main`. Nada bajo `backend-pet-tracker/` ni `infra/` se toca.

---

## R1 — La etiqueta destructiva de reminders usa el token de danger

- [ ] (1) Escribir test que falla para R1
      (`src/__tests__/legibility-classnames.test.ts`, `describe('#61 R1: …')`:
      `reminders/index.tsx` no contiene `text-accent-foreground` en el
      `Button.Label` de `reminders-delete-confirm` y sí `text-danger-foreground`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Token `--accent-contrast: #0B402A` con AA sobre el relleno de acento

- [ ] (1) Escribir test que falla para R2
      (`src/theme/__tests__/global-css.test.ts`, `describe('#61 R2: …')`: el
      token existe con `#0B402A` en light y dark, la utilidad está registrada,
      el ratio contra `#2AB87C` es ≥ 4,5 con la fórmula sRGB, y `--accent`,
      `--color-accent`, `--accent-foreground`, `--color-accent-foreground`
      conservan sus valores)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Todo texto sobre `bg-accent` usa `text-accent-contrast`, sin opacidad

- [ ] (1) Escribir test que falla para R3
      (`src/__tests__/legibility-classnames.test.ts`, `describe('#61 R3: …')`:
      cero ocurrencias de `text-accent-foreground` en `src/`, 17 de
      `text-accent-contrast` en los archivos enumerados, y cero `opacity-70` /
      `opacity-80` en `food.tsx` y `meal-schedule.tsx`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Token `--accent-strong` y los 12 enlaces/valores de acento

- [ ] (1) Escribir test que falla para R4
      (`global-css.test.ts`, `describe('#61 R4: …')`: `#167A50` light /
      `#2AB87C` dark y los cuatro ratios de light y los tres de dark;
      `legibility-classnames.test.ts`, `describe('#61 R4: …')`: los 12 sitios
      usan `text-accent-strong` y `floating-tab-bar.tsx` conserva `text-accent`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Token `--warning-strong` y el fin de `text-warning` como color de texto

- [ ] (1) Escribir test que falla para R5
      (`global-css.test.ts`, `describe('#61 R5: …')`: `#92610A` light /
      `#FBBF24` dark y sus ratios sobre `bg-surface` y `bg-warning-soft`
      compuesto; `legibility-classnames.test.ts`, `describe('#61 R5: …')`: cero
      ocurrencias de `text-warning` como color de texto en `src/**/*.tsx` y
      `--warning`/`--color-warning` intactos)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — `--muted` light pasa AA sobre `bg-default` sin tocar dark

- [ ] (1) Escribir test que falla para R6
      (`global-css.test.ts`, `describe('#61 R6: …')`: `--muted` y
      `--color-muted` valen `#667085` en light, siguen valiendo `#9CA3AF` en
      dark, y el ratio sobre `#F5F6F8` es ≥ 4,5)
- [ ] (2) Implementación mínima que lo pasa. **Incluye la excepción declarada
      E1** de [[design]] §6: sustituir los dos literales `'#6B7280'` de
      `global-css.test.ts` (líneas 75 y 95, asserts de #46 R1/R2) por
      `'#667085'`. Nada más de ese archivo se reescribe
- [ ] (3) Refactor con tests verdes

## R7 — Register con las métricas de pantalla uniformes

- [ ] (1) Escribir test que falla para R7
      (`src/app/(auth)/__tests__/register.test.tsx`, `describe('#61 R7: …')`:
      con el mock de insets estándar,
      `getByTestId('screen-register').props.contentContainerStyle` es
      `{ padding: 24, gap: 16, paddingTop: 52, paddingBottom: 120 }` y el
      `ScrollView` declara `contentInsetAdjustmentBehavior="automatic"`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Login, Forgot y Reset con contenedor de scroll y safe areas

- [ ] (1) Escribir test que falla para R8
      (`login.test.tsx`, `forgot.test.tsx` y
      `src/screens/reset-password/index.test.tsx`, `describe('#61 R8: …')`: el
      `contentContainerStyle` de `screen-login` / `screen-forgot` /
      `screen-reset-password` es el de [[requirements]] R8, con `paddingTop: 52`
      y `paddingBottom: 48`, `alignItems: 'center'` solo donde corresponde, y
      `keyboardShouldPersistTaps === 'handled'`; reset se prueba en sus **tres**
      ramas)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — El label de sección de `pet-info-card` vuelve a #46 R10

- [ ] (1) Escribir test que falla para R9
      (`src/screens/profile/index.test.tsx`, `describe('#61 R9: …')`:
      `getByText('Información').props.className` es exactamente
      `pb-2 text-xs font-semibold uppercase tracking-widest text-muted` y el
      texto no cambia)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — 44 pt de objetivo táctil en los 13 controles, vía `TOUCH_SLOP`

- [ ] (1) Escribir test que falla para R10 (en los **siete** archivos de
      [[requirements]] R10, `describe('#61 R10: …')`:
      `getByTestId(<id>).props.hitSlop` es igual a `TOUCH_SLOP` importado de
      `src/theme/touch-target.ts`, y la constante vale
      `{ top: 6, bottom: 6, left: 6, right: 6 }`)
- [ ] (2) Implementación mínima que lo pasa (crear
      `src/theme/touch-target.ts` y añadir la prop en los 13 `Pressable`;
      **no** tocar `pet-switcher.tsx`, ver [[design]] §D4)
- [ ] (3) Refactor con tests verdes

## R11 — Overlay de stats del mapa en 2×2 sin envolver

- [ ] (1) Escribir test que falla para R11
      (`src/app/(tabs)/__tests__/map.test.tsx`, `describe('#61 R11: …')`: los
      cuatro `stat-*` declaran `numberOfLines === 1`, los cuatro siguen
      presentes con su texto de hoy, y el `style` de `map-stats` no cambia)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Invariante verificable (gate mecánico, sin test de jest)

- [ ] (1) Ejecutar `bun test` en `mobile-pet-tracker/`: suite completa verde
- [ ] (2) Ejecutar `git diff origin/main...HEAD --stat` y comprobar: cero
      archivos bajo `backend-pet-tracker/` e `infra/`; ningún `*.test.tsx`
      preexistente con asserts reescritos (solo bloques `describe('#61 R…')`
      añadidos); el único test preexistente con contenido previo modificado es
      `src/theme/__tests__/global-css.test.ts`, y solo en dos literales
- [ ] (3) Rehacer los conteos anti-slop del audit sobre `src/`: cero hex fuera
      de `src/theme/`, cero clases arbitrarias `[...]`, cero `StyleSheet.create`,
      cero `shadow*`/`elevation` legacy, cero `text-accent-foreground`, cero
      `text-warning` como color de texto. Dejarlos en
      `progress/impl_mobile-ui-legibility-polish.md`

---

## Cierre

- [ ] Actualizar [[traceability]]: ninguna fila puede quedar en "pendiente"
- [ ] Escribir `progress/impl_mobile-ui-legibility-polish.md` (reporte por
      disco; nada de contenido por chat entre agentes)
- [ ] `gh pr create` desde `feature/61-mobile-ui-legibility-polish`. El humano
      mergea; ninguna IA mergea a `main`
- [ ] **Gate humano, no delegable**: smoke en **dev build de Android**, lado a
      lado con el Figma, en tema **claro Y oscuro**, confirmando que ningún
      relleno cambió de color y que las etiquetas se leen. Guion de la prueba:
      los 10 botones primarios, las 2 cards de acento (Food y Meal schedule),
      los enlaces de acento de Login/Forgot/Reset/Home/Profile, el badge
      "Upcoming!" de Reminders, el "Next due" de Health, el overlay del mapa
      con datos reales, y los 13 controles del R10 tocados con el pulgar
