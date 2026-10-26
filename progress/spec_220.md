# Reporte de spec — #220 mobile-date-field

Spec: `specs/mobile-date-field/requirements.md` (R1..R18), `design.md`, `tasks.md`, `traceability.md`.
Estado en `feature_list.json`: `spec_ready`. No firmada: la casilla `## Aprobación` queda sin marcar.
Rama: `feature/220-mobile-date-field` (desde `origin/dev`, `fb1b2e67`).

## FLAGS y decisiones abiertas (arriba, para el leader)

No hay premisa falsa que cambie el alcance ni decisión abierta que lo cambie. Cuatro puntos que
el leader debe ver antes de firmar:

- **F1. Premisa corregida del explorador: `isInvalid`.** El explore da a entender que el borde de
  error se pasa a `InputGroup`. Verificado en heroui-native 1.0.8: `isInvalid` es prop de
  `InputGroup.Input`, no de `InputGroup`; el observable es el token `android:border-danger` en su
  `className`. R5 lo especifica así. No cambia el alcance.
- **F2. Efecto visible no cubierto por un artboard: alto de los campos del recordatorio.** Hoy
  `date-field` y `time-field` de Nuevo recordatorio miden `h-13` (igual que `title-input`).
  `DateField` usa `h-12` en los cuatro usos (como Peso, Documentos y Alta). Un `size` opcional
  obligaría a un `className` no literal en un elemento de heroui, que `heroui-text-size-merge`
  veta. Decisión cerrada: alto único `h-12`; en Recordatorio los campos quedan 4 px más bajos que
  el título. Si el humano lo rechaza en el smoke G2, la salida es un `size` con dos ramas
  literales (otra spec).
- **F3. Efecto visible: etiqueta de fecha en Alta de mascota.** Hoy muestra `'9/4/2024'`
  (`toLocaleDateString(locale)`); con el componente muestra `'9 abr 2024'` (formato que Recordatorio
  ya usa), y el color del texto lo da el `Input` de HeroUI. Los tests que leen `getByText('9/4/2024')`
  se reescriben sobre el nodo `birth-date-field-value`. Decisión cerrada; informativa.
- **F4. Verificación solo posible en dispositivo (gate G2 del plan).** Jest no puede probar que un
  toque atraviese `pointerEvents="none"` del `Input` hacia el `Pressable`, ni el diálogo nativo, ni
  el tema oscuro, ni iOS. `progress/smoke_ui.md` debe incluir las cuatro pantallas y los dos modos.
  Si en dispositivo el toque no llegara al `Pressable`, el plan B es mover `onPress` al `Input`
  (`editable={false}` con `onPressIn`): sería una enmienda, no un cambio de alcance.

Sin editar por quedar fuera del plan: `docs/ui-guidelines.md` no nombra `date-field.tsx` (la carta
no tiene casilla humana para ello en este plan). Seguimiento anotado en «Fuera de alcance».

## Contrato que #208 y #213 consumen

`components/date-field.tsx`, export nombrado `DateField`, con props `testID`, `pickerTestID`,
`mode` (`'date' | 'time'`), `value` (`string | null`), `onChange(next: string | null)`, `label`,
`placeholder`, `minDate`, `maxDate`, `isInvalid`, `allowClear`. Detalle en `requirements.md`
§Contrato público. Utilidades en `utils/civil-date.ts`: `localDateToIso`, `isoToLocalDate`,
`timeToHhmm`, `hhmmToLocalDate`.

Nota para el leader: #208 y #213 también añaden un bloque `R18_*`/`R19_*` a
`__tests__/ui-copy-table.ts`; si #220 no mergea primero, el nombre `R18_DATE_FIELD` choca por
posición, no por semántica (el nombre no es un candado; el handoff dice usar el siguiente libre).

## Premisas verificadas contra el árbol (`dev`, `fb1b2e67`)

- `meal-schedule/index.tsx`: 2 apariciones de `ExpoDateTimePicker`, 1 `style={CONTINUOUS_CORNER}`; sin cambio.
- `add-pet/index.tsx`: 6 `style={CONTINUOUS_CORNER}` (uno es `birth-date-field`); 2 de `ExpoDateTimePicker`.
- `add-reminder/index.tsx`: 4 `style={CONTINUOUS_CORNER}` (título, fecha, hora, uno más); 3 de `ExpoDateTimePicker`;
  `Bell`, `Calendar`, `Clock` importados; campos `h-13`.
- `weightLog.yyyyMmDd` aparece 4 veces en `src/` (catálogo x2, `ui-copy-table.ts`, pantalla);
  `docs.datePlaceholder` 5 (catálogo x2, tabla, pantalla, `language-provider.test.tsx`).
- `docs.datePlaceholder` vive en `R7_PROFILE`; `weightLog.yyyyMmDd` en `R5_HEALTH`.
- `utils/form-rules.test.ts` ya cubre `'2026-02-30'`, `' 2026-10-09 '`, `''`, `'2026-13-01'` para
  `validateWeight` y `validateDocument` (`#186 R2`): los `it` de pantalla que escriben texto inválido
  pueden retirarse sin perder cobertura.
- `heroui-text-size-merge`: `opaque` solo admite `password-input`; `date-field.tsx` cumple con
  `className` literales.
- `consistency-classnames`: tres sitios de recuento de `CONTINUOUS_CORNER` (`directUses`, total del
  `it` de Card, total global `count`), todos con neto `- 2` tras la cadena.
- `design-drift` #178 R13: lista de iconos de `add-reminder` `['Bell', 'Calendar', 'Clock']` pasa a `['Bell']`.
- `forms-validation-global`: sin cambio (las pantallas conservan `FieldErrorMessage`).

## Inventario cerrado de candados (resumen; detalle y anclas en `design.md` §Candados)

1. `__tests__/add-pet-two-steps.test.ts`: `6 -> 5`.
2. `__tests__/consistency-classnames.test.ts`: `directUses` add-pet `6 -> 5`, add-reminder `3 + 1 - 2`,
   fila nueva `components/date-field.tsx` 1; dos totales `- 2`.
3. `__tests__/design-drift.test.ts`: iconos de add-reminder `['Bell']`.
4. `__tests__/ui-copy-table.ts`: -2 filas, `R18_DATE_FIELD` (5 filas), `ALL_USES`, `blocks`.
5. `__tests__/ui-language.test.ts`: `R5_HEALTH - 1`, `R7_PROFILE - 1`, bloque nuevo de 5, `SCREEN_FILES + 1`.
6. `providers/__tests__/language-provider.test.tsx`: `+ 5 - 2 // #220`, #158 R1 de 13 a 12 pares.
7. Tests de las cuatro pantallas: weight-log (20 apariciones de `weight-date-input`), docs-upload-form (17),
   add-pet (className y etiqueta `9/4/2024`), add-reminder (className `h-13`, etiquetas, mediodía).

## Qué queda para el leader

1. Pasar la checklist de `plan_canvas-parity-2026-10-23.md` §4 y los tres puntos extra del plan (§4)
   y firmar con su propio commit, solo `requirements.md` (`commit --only`).
2. Antes del handoff, re-medir las anclas de `design.md` §Anclas (las cifras caducan si otra feature
   de la ola merge antes en `dev`).
3. Escribir el handoff a Codex citando `docs/conventions.md` §Esperas, nombres de skills de Codex,
   cadena C1..C13 de `tasks.md`, y la prohibición de `./init.sh` en las dos primeras líneas.
4. Decidir sobre F2 y F3 (informativas; cerradas en la spec con la opción de menor alcance).
5. Preparar el smoke G2 con los casos de F4.
6. Worktree nuevo: copiar `.env` y `bun install --frozen-lockfile` antes de Codex.
