---
feature: mobile-canvas-collar-alerts
id: 203
status: spec_ready
---

# #203 mobile-canvas-collar-alerts — Tareas (TDD)

## Orden

R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9 → R10 → R11 → R12.

- R1 va primero: borra `#197 R20` y quita las cabeceras nativas que R2, R8 y R10 sustituyen.
- R2 antes de R3 (el `RiseIn` del hero vive bajo la cabecera nueva).
- R4–R6 antes de R7 (la hoja la abre el `device-unpair` de R6).
- R8 antes de R9; R10 antes de R11.
- R12 al final: lee producción que crean R2–R11.

Ningún test rojo de un R asierta nodos que crea un R posterior: R2 solo mira
`pairing-header`, su accesorio y métricas; R3 envuelve nodos que ya existen
(`pairing-hero-group`, `pairing-plan-icon`, `pairing-activation-code-label`);
R6 no abre la hoja (eso es R7.2); R8 no mira `RiseIn`.

Cada R son al menos dos commits: **(1) test rojo** (tests nuevos + candados del
inventario de ese R), **(2) implementación mínima**; (3) refactor opcional. Nunca
test e implementación en el mismo commit.

## Bloques por requisito

### R1
1. Rojo: `#203 R1` en layout; F2, F3, F4; borrar F1 entero.
2. Verde: tres `options` en `src/app/_layout.tsx`.
3. Refactor: ninguno previsto.

### R2
1. Rojo: `#203 R2.1`–`R2.4` en pairing; F5, F6 (borrar), F7, F8, F9, F22.
2. Verde: `ScreenHeader` en pairing, avatar como `accessory`, fuera `pairing-pet-row` y `HeaderHeightContext`, `keyboardVerticalOffset={0}`, `contentContainerStyle` de R2.4.
3. Refactor: `PairingPetAvatar` deja de devolver la fila.

### R3
1. Rojo: doble de `RiseIn` en pairing y `#203 R3`.
2. Verde: tres `RiseIn` de la vista de vincular.
3. Refactor: ninguno.

### R4
1. Rojo: `#203 R4.1`–`R4.3` (una fila por rama de D5); F23 (`rounded-22`).
2. Verde: título, `Card` con `rounded-22` y `shadows.card`, `DeviceRow` con tono.
3. Refactor: `DeviceRow` recibe `tone` o `className` del valor, sin abstracción nueva.

### R5
1. Rojo: `#203 R5` (píldora y `RiseIn` 140 por fila); F24, F25; F30 solo si se pone rojo.
2. Verde: píldora y envoltorio del hueco del plan.
3. Refactor: ninguno.

### R6
1. Rojo: `#203 R6`; F23 y F27 (pairing 1 → 2); F28.
2. Verde: espaciador y botón 54 con `chunkyLip.danger`; bloque Enmienda #203 en `docs/ui-guidelines.md`.
3. Refactor: ninguno.

### R7
1. Rojo: `#203 R7.1`–`R7.8`; borrar F10; F23 y F27 (pairing 2 → 4); F26; F29.
2. Verde: hoja con `BottomSheet`, estado `unpairOpen`, `openUnpair`/`closeUnpair`/`confirmUnpair`; fuera `Alert.alert`.
3. Refactor: la lógica de liberación de hoy se reutiliza tal cual desde `confirmUnpair`.

### R8
1. Rojo: `#203 R8` (cuatro `it`); F11–F14, F16.
2. Verde: `ScreenHeader` en Alertas con la insignia de accesorio; fuera `alerts-title-row`; `paddingTop: insets.top + 8`.
3. Refactor: ninguno.

### R9
1. Rojo: doble de `RiseIn` en alertas y `#203 R9`; sustituir F15.
2. Verde: `ALERT_ROW_RISE_DELAYS` y `RiseIn` en filas; fuera `HomeEntrance`.
3. Refactor: ninguno.

### R10
1. Rojo: `#203 R10` (dos `it`); F17–F20.
2. Verde: `ScreenHeader` en el detalle; `paddingTop: insets.top + 8`.
3. Refactor: ninguno.

### R11
1. Rojo: doble de `RiseIn` en detalle y `#203 R11`; sustituir F21.
2. Verde: dos `RiseIn`; fuera `HomeEntrance`.
3. Refactor: ninguno.

### R12
1. Test: `src/__tests__/collar-alerts-canvas-fidelity.test.ts` con las filas de R12. Nace verde (va después de R1–R11); por cada fila de producción, plantar la mutación, ver el rojo, revertir y apuntarlo en el informe.
2. Implementación: ninguna.
3. Refactor: ninguno.

## Cuentas a re-medir

Desde `mobile-pet-tracker/`. Antes del primer commit, re-medir la columna «base»;
si difiere (merge de una paralela en `dev`), esperado = base nueva + delta.

| Comando | Base (`81cb6d6b`) | Delta | Esperado al cerrar |
|---|---|---|---|
| `grep -cF 'headerShown' src/app/_layout.tsx` | 2 | +3 | 5 |
| `grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts` | 1 | −1 | 0 |
| `grep -cF 'Alert.alert' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'HeaderHeightContext' src/screens/pairing/index.tsx` | 2 | −2 | 0 |
| `grep -cF 'paddingVertical: 24' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'pairing-pet-row' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'text-2xl font-black' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'bg-accent-soft' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'rounded-16' src/screens/pairing/index.tsx` | 1 | +3 | 4 |
| `grep -cF 'rounded-22' src/screens/pairing/index.tsx` | 0 | +1 | 1 |
| `grep -cF 'chunkyLip.danger' src/screens/pairing/index.tsx` | 0 | +2 | 2 |
| `grep -cF "from '@expo/ui/community/bottom-sheet'" src/screens/pairing/index.tsx` | 0 | +1 | 1 |
| `grep -cF 'HomeEntrance' src/screens/alerts/index.tsx` | 3 | −3 | 0 |
| `grep -cF 'HomeEntrance' src/screens/alert-detail/index.tsx` | 3 | −3 | 0 |
| `grep -cF 'paddingTop: 24' src/screens/alerts/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'paddingTop: 24' src/screens/alert-detail/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'tracking-' src/screens/alerts/index.tsx` | 2 | −1 | 1 |
| `grep -cF 'insets.top + 8' src/screens/pairing/index.tsx src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx` | 0 / 0 / 0 | +1 cada uno | 1 / 1 / 1 (o más si el fichero ya lo usaba) |
| `test -e src/__tests__/collar-alerts-canvas-fidelity.test.ts && echo existe` | (ausente) | — | `existe` |
| `git diff --stat origin/dev -- src/components/celebration.tsx src/theme/motion.ts src/i18n/catalog.ts src/__tests__/ui-copy-table.ts` | — | — | vacío |
