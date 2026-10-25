---
feature: mobile-canvas-collar-alerts
id: 203
status: approved
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

Las filas F del inventario son las de requirements §Candados que esta feature
revierte; F6 es borrado editorial (no rojo) y F30 está cerrada (no se toca). Los
dobles de módulo (F31–F33, F39) van en el commit rojo del R que se indica.
Recuentos agregados que se muevan: requirements §Erratas del leader.

### R1
1. Rojo: `#203 R1` en layout; F2, F3, F4; borrar F1 entero.
2. Verde: tres `options` en `src/app/_layout.tsx`.
3. Refactor: ninguno previsto.

### R2
1. Rojo: `#203 R2.1`–`R2.4` en pairing; F5, F6 (borrado editorial, no rojo), F7, F8 (padre = `pairing-header`, último hijo), F9, F22, F38 (`#188 R19`: `not.toHaveProperty('flexGrow')` → `toHaveProperty('flexGrow', 1)`); F39 (el doble de `expo-router` de `pairing/index.test.tsx` gana `canGoBack: jest.fn(() => true)`).
2. Verde: `ScreenHeader` en pairing, avatar como `accessory`, fuera `pairing-pet-row` y `HeaderHeightContext`, `keyboardVerticalOffset={0}`, `contentContainerStyle` de R2.4; se quitan los imports muertos `HeaderHeightContext` y `useContext` (`grep -cF 'useContext'` 2 → 0).
3. Refactor: `PairingPetAvatar` deja de devolver la fila.

### R3
1. Rojo: doble de `RiseIn` en pairing (pinta un `View` con el `testID` recibido y deja `delayMs` legible) y `#203 R3`.
2. Verde: tres `RiseIn` de la vista de vincular que **envuelven** los nodos existentes (`View gap-1.5` del campo y `View` del aviso siguen siendo el mismo nodo con el mismo `className` y los mismos hijos: `#188 R18` y `#188 R20` siguen verdes).
3. Refactor: ninguno.

### R4
1. Rojo: `#203 R4.1`–`R4.3` (una fila por rama de D5); F23 (`rounded-22`); F35 (`'screens/pairing/index.tsx', // #203 R4` en la lista `text-15` de AC; título `… (enmendado por #203 R4)`).
2. Verde: título, `Card` con `rounded-22` y `shadows.card`, `DeviceRow` con tono.
3. Refactor: `DeviceRow` recibe `tone` o `className` del valor, sin abstracción nueva.

### R5
1. Rojo: `#203 R5` (píldora y `RiseIn` 140 por fila); F24, F25. F30 está cerrada: no se toca.
2. Verde: píldora y envoltorio del hueco del plan.
3. Refactor: ninguno.

### R6
1. Rojo: `#203 R6` (incluye `device-unpair-spacer.parent` con `className` exacto `gap-4` y `style` con `flexGrow: 1`); F23 y F27 (pairing 1 → 2); F28.
2. Verde: espaciador, contenedor de la vista con collar con `className="gap-4" style={{ flexGrow: 1 }}` (el `gap-4` de dentro de la tarjeta no cambia) y botón 54 con `chunkyLip.danger`; bloque Enmienda #203 en `docs/ui-guidelines.md`.
3. Refactor: ninguno.

### R7
1. Rojo: `#203 R7.1`–`R7.8`; borrar F10; F23 y F27 (pairing 2 → 4); F26; F29; F37 (`10 + 1` → `10 + 1 + 1`, comentario `; #203 R7: +1`, título `… (enmendado por #203 R7)`).
2. Verde: hoja con `BottomSheet`, estado `unpairOpen`, `openUnpair`/`closeUnpair`/`confirmUnpair`; fuera `Alert.alert` y `Alert` del import de `react-native` (`grep -cxF '  Alert,'` 1 → 0).
3. Refactor: la lógica de liberación de hoy se reutiliza tal cual desde `confirmUnpair`.

### R8
1. Rojo: `#203 R8` (cuatro `it`); F11–F14, F16; doble de `reicon-react-native` con `ChevronLeft: icon('ChevronLeft')` en `alerts/index.test.tsx` (F31) y con `ChevronLeft: icon()` en `alert-detail.navigation.test.tsx` (F33); F34 y F36: se quita `'screens/alerts/index.tsx'` de las listas `tracking-title` (AC) y `text-26` (PC); títulos `(enmendado por #203 R4, R8)` en AC y `(enmendado por #203 R8)` en PC.
2. Verde: `ScreenHeader` en Alertas con la insignia de accesorio; fuera `alerts-title-row`; `paddingTop: insets.top + 8`.
3. Refactor: ninguno.

### R9
1. Rojo: doble de `RiseIn` en alertas (conserva el `testID` `${rowId}-entrance` que recibe y expone `delayMs`; se borra `mockHomeEntrance`) y `#203 R9` con los retardos `[0, 70, 140, 200, 260]` escritos en el test (no importa `./rise-delays`: no existe hasta el verde); sustituir F15.
2. Verde: crear `src/screens/alerts/rise-delays.ts` (`export const ALERT_ROW_RISE_DELAYS = [0, 70, 140, 200, 260] as const;`), importarlo desde `screens/alerts/index.tsx` y envolver con `RiseIn` las filas `i < 5`; fuera `HomeEntrance`.
3. Refactor: ninguno.

### R10
1. Rojo: `#203 R10` (dos `it`); F17–F20; doble de `reicon-react-native` con `ChevronLeft: icon('ChevronLeft')` en `alert-detail/index.test.tsx` (F32); F34 y F36: se quita `'screens/alert-detail/index.tsx'` de las listas `tracking-title` y `text-26`; títulos `(enmendado por #203 R4, R8, R10)` en AC y `(enmendado por #203 R8, R10)` en PC.
2. Verde: `ScreenHeader` en el detalle; `paddingTop: insets.top + 8`.
3. Refactor: ninguno.

### R11
1. Rojo: doble de `RiseIn` en detalle (conserva `alert-detail-card-entrance` y `alert-detail-map-entrance`, expone `delayMs`; se borra el doble huérfano de `HomeEntrance`) y `#203 R11`; sustituir F21.
2. Verde: dos `RiseIn`; fuera `HomeEntrance`.
3. Refactor: ninguno.

### R12
1. Test: `src/__tests__/collar-alerts-canvas-fidelity.test.ts` con las filas de R12 (ancladas por tag con `tagOf`; el labio se lee de `src/theme/global.css`; los retardos de Alertas se importan de `../screens/alerts/rise-delays`, sin importar la pantalla). Nace verde (va después de R1–R11); por cada fila, plantar la mutación de la última columna de la tabla de R12, ver el rojo, revertir y apuntarlo en el informe; al final `git diff` de producción vacío.
2. Implementación: ninguna.
3. Refactor: ninguno.

## Cuentas a re-medir

Desde `mobile-pet-tracker/`. Antes del primer commit, re-medir la columna «base»;
si difiere (merge de una paralela en `dev`), esperado = base nueva + delta.
Re-medida entera en el H0 `435059b2` el 2026-10-24 (errata E5): respecto a
`81cb6d6b` solo cambian `headerShown` (2 → 5, por #200 y #199) y F1 (1 → 0, E4);
se añade la cuenta de enmiendas de la carta.

| Comando | Base (`435059b2`) | Delta | Esperado al cerrar |
|---|---|---|---|
| `grep -cF 'headerShown' src/app/_layout.tsx` | 5 | +3 | 8 |
| `grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts` | 0 | 0 | 0 |
| `grep -c '^## Enmienda' ../docs/ui-guidelines.md` | 26 | +1 | 27 |
| `grep -cF 'Alert.alert' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cxF '  Alert,' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'HeaderHeightContext' src/screens/pairing/index.tsx` | 2 | −2 | 0 |
| `grep -cF 'useContext' src/screens/pairing/index.tsx` | 2 | −2 | 0 |
| `grep -cF 'paddingVertical: 24' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'pairing-pet-row' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'text-2xl font-black' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'bg-accent-soft' src/screens/pairing/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'rounded-16' src/screens/pairing/index.tsx` | 1 | +3 | 4 |
| `grep -cF 'rounded-22' src/screens/pairing/index.tsx` | 0 | +1 | 1 |
| `grep -cF 'chunkyLip.danger' src/screens/pairing/index.tsx` | 0 | +2 | 2 |
| `grep -cF 'className="gap-4" style={{ flexGrow: 1 }}' src/screens/pairing/index.tsx` | 1 | +1 | 2 |
| `grep -cF "from '@expo/ui/community/bottom-sheet'" src/screens/pairing/index.tsx` | 0 | +1 | 1 |
| `grep -cF 'HomeEntrance' src/screens/alerts/index.tsx` | 3 | −3 | 0 |
| `grep -cF 'HomeEntrance' src/screens/alert-detail/index.tsx` | 3 | −3 | 0 |
| `grep -cF 'HomeEntrance' src/screens/alerts/index.test.tsx` | 4 | −4 | 0 |
| `grep -cF 'HomeEntrance' src/screens/alert-detail/index.test.tsx` | 2 | −2 | 0 |
| `grep -cF 'paddingTop: 24' src/screens/alerts/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'paddingTop: 24' src/screens/alert-detail/index.tsx` | 1 | −1 | 0 |
| `grep -cF 'tracking-' src/screens/alerts/index.tsx` | 2 | −1 | 1 |
| `grep -cF 'insets.top + 8' src/screens/pairing/index.tsx src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx` | 0 / 0 / 0 | +1 cada uno | 1 / 1 / 1 |
| `test -e src/screens/alerts/rise-delays.ts && echo existe` | (ausente) | — | `existe` |
| `test -e src/__tests__/collar-alerts-canvas-fidelity.test.ts && echo existe` | (ausente) | — | `existe` |
| `grep -cF 'ChevronLeft' src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx src/app/__tests__/alert-detail.navigation.test.tsx` | 0 / 0 / 0 | +1 cada uno | 1 / 1 / 1 |
| `grep -cF 'canGoBack' src/screens/pairing/index.test.tsx` | 0 | +1 | 1 |
| `grep -cF "not.toHaveProperty('flexGrow')" src/screens/pairing/index.test.tsx` | 1 | −1 | 0 |
| `grep -cF "'screens/pairing/index.tsx'" src/__tests__/alerts-canvas-fidelity.test.ts` | 1 | +1 | 2 |
| `grep -cF "'screens/alerts/index.tsx'" src/__tests__/alerts-canvas-fidelity.test.ts` | 7 | −1 | 6 |
| `grep -cF "'screens/alert-detail/index.tsx'" src/__tests__/alerts-canvas-fidelity.test.ts` | 2 | −1 | 1 |
| `grep -cF "'screens/alerts/index.tsx'" src/__tests__/profile-canvas-fidelity.test.ts` | 2 | −1 | 1 |
| `grep -cF "'screens/alert-detail/index.tsx'" src/__tests__/profile-canvas-fidelity.test.ts` | 4 | −1 | 3 |
| `grep -cF 'toBe(10 + 1)' src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 1 | −1 | 0 |
| `grep -cF 'toBe(10 + 1 + 1)' src/__tests__/chunky-cta-canvas-fidelity.test.ts` | 0 | +1 | 1 |
| `git diff --stat 435059b2 -- src/components/celebration.tsx src/theme/motion.ts src/i18n/catalog.ts src/__tests__/ui-copy-table.ts` (contra el H0, no contra `origin/dev`; E5) | vacío | — | vacío |

Las sumas de F27 (radios 16, base 35, cierra en 38) y de F24/F25 (`bg-accent-soft`,
base 4, cierra en 3) se re-miden con los comandos de la errata E5.

Suelos de `src/__tests__/heroui-text-size-merge.test.ts` (`#187 R1`: `cardElements`
≥ `35 - 1 - 1 - 1 + 1` = 33 en `435059b2` (E3, E5), `heroElements` ≥ 197, `classNameElements` ≥ 163, ficheros con hero ≥ 28): sin
delta en ningún R de #203 (ninguno quita un `<Card` ni un hero); no hay fila que
re-medir.
