---
feature: "mobile-routine-canvas-fidelity"
status: draft
tags: [mobile, ui, spec]
---

# #178 mobile-routine-canvas-fidelity — Diseño

> Base congelada `fb5b209f`. Requisitos en
> [[requirements|requirements.md]]; este documento no baja a código.

## Capas

Todo el cambio es de presentación en `mobile-pet-tracker/`. No toca
`domain/` ni `application/` del backend, ni la API, ni los tipos de
`src/api/`. `src/utils/reminder-meta.ts` es una tabla de presentación (tipo
→ etiqueta, icono, hueco de paleta): cambia `emoji` por `Icon`, y su único
otro consumidor (`src/screens/home/index.tsx`) solo lee `category`, que no
cambia.

## Ficheros por requisito

| Fichero | R |
|---|---|
| `mobile-pet-tracker/src/theme/global.css` | R1 |
| `docs/ui-guidelines.md` | R2 |
| `mobile-pet-tracker/src/i18n/catalog.ts`, `specs/mobile-ui-language/design.md` | R3 |
| `mobile-pet-tracker/src/app/_layout.tsx` | R4, R10 |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | R4 a R9 |
| `mobile-pet-tracker/src/utils/reminder-meta.ts` | R6 |
| `mobile-pet-tracker/src/screens/add-reminder/index.tsx` | R10 a R12 |

Tests: `src/theme/__tests__/global-css.test.ts` (R1),
`src/__tests__/design-drift.test.ts` (R2, R13),
`src/providers/__tests__/language-provider.test.tsx` (R3),
`src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts`
(filas de R4, R6, R9, R10, R12), `src/screens/reminders/index.test.tsx`
(R4 a R9), `src/screens/add-reminder/index.test.tsx` (R10 a R12),
`src/utils/__tests__/category-palette.test.ts` (R6),
`src/app/__tests__/layout.test.tsx` (R4, R10) y
`src/__tests__/consistency-classnames.test.ts` (deltas). Ningún fichero
nuevo.

## Decisiones

- **Tokens por valor** (`rounded-14/16/22`, `text-11`, `tracking-title`): la
  directiva «píxel exacto» manda sobre el redondeo a la escala. Se
  reutilizan los de #173 (`text-13`, `text-26`, `rounded-tile`,
  `font-extrabold`) y los compartidos con #174/#175 se declaran una vez (S1,
  S2).
- **La fila deja de ser `Card`**: `Card` mezcla clases con `twMerge`, que no
  reconoce `rounded-22` como radio y deja `rounded-card` y `rounded-22`
  juntos. Un `View` con `CONTINUOUS_CORNER` y sus clases da el radio exacto
  y quita la sombra (P4).
- **Un solo `useThemeColors` por pantalla**: los iconos se colorean con
  tokens (D-I). En Recordatorios, la llamada lleva los cinco
  `category-<slot>-strong`, `muted`, `accent-foreground` y `danger`, y cada
  fila elige el suyo por hueco; ningún hook dentro del `map`.
- **Animación reutilizada**: `HomeEntrance` (entrada escalonada por índice,
  con reducir movimiento) y `PopIn` (badge). Sin componentes nuevos.
- **Título en contenido** (D-H): `Text` con rol `header` dentro de
  `reminders-actions` (Recordatorios) o como primer hijo del formulario
  (Nuevo recordatorio); la cabecera nativa queda con `title: ''`. Así la
  lista de hijos del `ScrollView` de Recordatorios no cambia.
- **Chip seleccionado con labio**: una constante de módulo en add-reminder
  (`SELECTED_CHIP`) para tipo y aviso; un solo literal suma `+ 1` al
  inventario de `border-black/25`.
- **Vista previa calculada en la pantalla**: `notifyAt` sale de
  `pickedDueAt` y del aviso efectivo que ya calcula la pantalla
  (`effectiveAdvance`), así que la vista previa siempre dice lo que se va a
  guardar.
- **Formatos inline**: `toLocaleDateString`/`toLocaleTimeString` con
  opciones en la pantalla; tres llamadas no justifican un util.
- **Hora en 24 h** (`hourCycle: 'h23'`): el artboard pinta «09:00»; sin la
  opción, es-MX da «09:00 a.m.» (P18).

## Alternativas descartadas

- `Card` con `className` que lleve `rounded-22`: `twMerge` no lo deduplica.
- `rounded-card` (20) para la fila y `rounded-xl` (12) para mosaico y
  píldoras: contradice «píxel exacto».
- Mantener el emoji en los chips de tipo: el artboard no lo dibuja (D-I).
- Componente `ReminderRow` o `NotifyPreview` aparte: un solo uso cada uno.
- Título vía `headerTitle` personalizado: D-H lo descarta.
- Borde de foco en los seis `TextInput` (D-F, opción b): fuera de las dos
  pantallas de esta feature (P5).
