---
feature: "mobile-canvas-routine"
status: approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-canvas-routine]]

Feature #204 `mobile-canvas-routine`, ola 2 del plan
`progress/plan_canvas-parity-2026-10-23.md`. Lleva Recordatorios, Agregar
recordatorio y Documentos a los artboards `Recordatorios`,
`NuevoRecordatorio` y `Documentos` del canvas versión `1792777983-cd94`,
congelados en `specs/mobile-canvas-routine/canvas/`. Cubre la parte de
Recordatorios de C18. Base: `origin/dev` en `81cb6d6b` (incluye #197).

Precedencia: el canvas manda en lo visual y en el movimiento; el copy sigue
la Voz B de Pingo; lo que el canvas no dibuja (estados de carga, error,
vacío, sin mascotas, error de acción, opacidad de inactivos) se queda.
**Ninguna clave i18n nueva ni cambiada**: todo el copy que pintan las tres
pantallas ya está en `src/i18n/catalog.ts` (ver design.md P6), así que
`ui-copy-table.ts`, `SCREEN_FILES`, `ALL_USES` y la longitud del catálogo de
`#194 R1` no se mueven.

Rutas relativas a `mobile-pet-tracker/` salvo que digan otra cosa.

## Decisiones con defecto

Cada decisión está cerrada con su defecto. El leader la revisa al firmar; si
cambia alguna, enmienda el R afectado antes del handoff.

| # | Decisión | Defecto | Riesgo / alternativa |
|---|---|---|---|
| D1 | Cabecera de las tres rutas | `src/app/_layout.tsx`: `reminders`, `add-reminder` y `pets/[petId]/docs` pasan a `options={{ headerShown: false }}` (se quita el spread de `headerOptions` y el `title: ''`). `pets/[petId]/docs-upload` conserva la cabecera nativa. | Carta Enmienda #197 punto 7. D-H no se edita (`#197 R21: D-H sigue intacta` la canda). |
| D2 | `testID` de `ScreenHeader` | Recordatorios `testID="reminders"` (conserva `reminders-title`, nace `reminders-back`); Agregar `testID="add-reminder"` (conserva `add-reminder-title`, nace `add-reminder-back`); Documentos `testID="docs-header"` (nacen `docs-header-back`, `docs-header-eyebrow`, `docs-header-title`). Desaparece `reminders-actions`. | Ningún selector por regex existente atrapa los nuevos (ver § TestIDs). |
| D3 | Volver sin historial | `backFallback`: Recordatorios `/profile`, Agregar `/reminders`, Documentos `/profile` (el canvas enlaza Perfil, Recordatorios y Perfil). | Ninguno. |
| D4 | Marco superior | `paddingTop: insets.top + 12` en el `contentContainerStyle` de las tres, sin `contentInsetAdjustmentBehavior`. Es la convención de las specs paralelas que adoptan `ScreenHeader` (#199, #200, #202). Con el mock de los tests (`top: 40`) da 52. | El canvas pinta 56 con barra de estado de 44: 44 + 12 = 56. |
| D5 | Talla de los botones de la hoja de borrado | Los dos miden `h-14` con etiqueta `text-17 font-extrabold` (receta del punto 13 de la carta), no 54 y 16 como el canvas. «Cancelar» ya es así; «Eliminar» se iguala. | Desviación consciente de 2 px y 1 px. Alternativa: `h-13.5` y `text-base` en ambos, que mueve más candados de #177. |
| D6 | Labio del destructivo de la hoja | «Eliminar» de la hoja sale de «Sin labio»: `style={chunkyLip.danger}` (`#9F1F15`, 4 px, ya existe desde #197). Lo pide el canvas (`box-shadow: 0 4px 0 #9F1F15`) y lo fija la **Enmienda #204** de la carta. | La carta (§13 «Sin labio») y la Enmienda #177 («la hoja de eliminar recordatorio conserva el par asimétrico») dicen lo contrario: la Enmienda #204 las supera solo para este botón. |
| D7 | Entrada de filas fuera de Inicio | Recordatorios y Documentos dejan `HomeEntrance` y usan `RiseIn` (#197) con `delayMs = índice x paso`. Paso de Recordatorios: export nuevo `MOTION_REMINDERS_STAGGER_MS = 70` en `src/theme/motion.ts` (el canvas escalona 0/70/140). Paso de Documentos: `MOTION_STAGGER_MS` (60, el canvas escalona 0/60/120/180). Requiere la **Enmienda #204** (punto 4 de la Enmienda #197: «Otro elemento solo usa este timing con una enmienda»). | El inventario MT de `motion.test.ts` lo tocan también #199 (+7) y #200 (+2): conflicto de texto en la misma lista, se resuelve conservando todas las altas. Alternativa sin export: paso 60 en las dos (desviación de 10 ms por fila). |
| D8 | Esqueleto del título de Documentos | `ScreenHeader` gana una prop opcional `titlePlaceholder?: ReactNode` que se pinta en el hueco del título solo cuando `title` falta. Documentos le pasa el `Skeleton` actual (`docs-header-skeleton`, `h-8 w-36 rounded-xl`). | Cambio en componente compartido. Decisión cerrada por el leader: #204 es la dueña de la prop opcional `titlePlaceholder` de `ScreenHeader`; las demás specs de la ola solo consumen el componente y no tocan `screen-header.tsx`. Si una spec posterior añade otra prop, conflicto de texto en el tipo de props: rebasa detrás de #204. Alternativa: pintar `t('docs.pet')` mientras carga (destello de «Mascota»). |
| D9 | Sin mascotas en Recordatorios | Sin cabecera nativa el estado perdería volver. Se envuelve el contenedor actual (sin tocar su `className` ni sus hijos) en `reminders-no-pets-frame` con un `ScreenHeader` solo-volver `testID="reminders-no-pets-header"` encima. | El canvas no dibuja el estado; se conserva entero y solo gana volver. |
| D10 | Teclado sin cabecera | Agregar y Documentos dejan `HeaderHeightContext` y `keyboardVerticalOffset`: sin cabecera nativa el desplazamiento es 0. | El test de #148 R5 pasa de `paddingBottom: 291` a `200` (300 de teclado menos 100 que no tapa, sin restar 91 de cabecera). |
| D11 | «Eliminar» de fila | Receta del canvas: `h-11 rounded-14 px-2.5` sobre `CATEGORY_SLOTS.rose.surface`, `variant="danger-soft"` (se queda por el feedback de pulsado), sin `size="sm"`, etiqueta `Text` `text-13 font-extrabold text-danger`. Sin labio. | `text-13` no va en `Button.Label` (Enmienda #187). No se añade el `aria-label` «Eliminar <título>» del canvas: necesitaría clave nueva (Fuera de alcance). |
| D12 | Ámbar de la fila próxima | Borde `border-2 border-category-amber` y badge con `CATEGORY_SLOTS.amber.surface` / `.ink` (`#FFF7ED` / `#A55E07`, los literales `--amber` / `--amber-s` del canvas). Contraste `#A55E07` sobre `#FFF7ED`: 4.71:1 (AA). | Revierte `#61 R5` para Recordatorios (deja de usar `warning-soft` / `warning-strong`). Las clases se leen de `CATEGORY_SLOTS`, no como literal, para no mover el inventario de `#62` «centraliza las diez clases». |
| D13 | «Guardar» al pie | El contenedor de Agregar gana `flexGrow: 1` y el botón `mt-auto` delante de su receta: `className="mt-auto h-14 rounded-16 bg-accent"`. | Enmienda la fila de `add-reminder-submit` de `CTA_ROWS` en `chunky-cta-canvas-fidelity.test.ts`. |
| D14 | `PopIn` del badge | Se queda tal cual (fade 250 ms y spring de 0.9). El canvas dibuja `pop 500ms ease-out 400ms` de .6 a 1.08 a 1. | Desviación consciente: `PopIn` es compartido. |

## Base medida

Medida en `81cb6d6b` con `grep -cF -- '<ancla>' <fichero>` desde la raíz del
repo. «Antes» es la cifra de la base; «después» la que deja #204. Ninguna
ancla usa números de línea. Ninguna de estas anclas la mueve una feature
paralela medida (#196, #198 a #203, #205, #206): las de `_layout.tsx` son por
ruta y `headerShown: false` en bruto no se usa como ancla porque #199, #200 y
#202 añaden las suyas.

| Fichero (`mobile-pet-tracker/src/…`) | Ancla `grep -cF` | Antes | Después |
|---|---|---|---|
| `app/_layout.tsx` | `<Stack.Screen name="reminders" options={{ ...headerOptions, title: '' }} />` | 1 | 0 |
| `app/_layout.tsx` | `<Stack.Screen name="add-reminder" options={{ ...headerOptions, title: '' }} />` | 1 | 0 |
| `app/_layout.tsx` | `<Stack.Screen name="pets/[petId]/docs" options={{ ...headerOptions, title: '' }} />` | 1 | 0 |
| `app/_layout.tsx` | `<Stack.Screen name="reminders" options={{ headerShown: false }} />` | 0 | 1 |
| `app/_layout.tsx` | `<Stack.Screen name="add-reminder" options={{ headerShown: false }} />` | 0 | 1 |
| `app/_layout.tsx` | `<Stack.Screen name="pets/[petId]/docs" options={{ headerShown: false }} />` | 0 | 1 |
| `components/screen-header.tsx` | `titlePlaceholder` | 0 | ≥ 2 |
| `theme/motion.ts` | `export const MOTION_REMINDERS_STAGGER_MS = 70;` | 0 | 1 |
| `theme/motion.ts` | `export const MOTION_STAGGER_MS = 60;` | 1 | 1 |
| `screens/reminders/index.tsx` | `testID="reminders-actions"` | 1 | 0 |
| `screens/reminders/index.tsx` | `contentInsetAdjustmentBehavior="automatic"` | 1 | 0 |
| `screens/reminders/index.tsx` | `paddingTop: 24,` | 1 | 0 |
| `screens/reminders/index.tsx` | `paddingTop: insets.top + 12,` | 0 | 2 (lista y sin mascotas) |
| `screens/reminders/index.tsx` | `from '../home/home-entrance'` | 1 | 0 |
| `screens/reminders/index.tsx` | `MOTION_REMINDERS_STAGGER_MS` | 0 | 2 (import y uso) |
| `screens/reminders/index.tsx` | `border-2 border-warning-soft` | 1 | 0 |
| `screens/reminders/index.tsx` | `border-2 border-category-amber` | 0 | 1 |
| `screens/reminders/index.tsx` | `bg-warning-soft` | 1 | 0 |
| `screens/reminders/index.tsx` | `text-warning-strong` | 1 | 0 |
| `screens/reminders/index.tsx` | `className="rounded-xl bg-danger-soft"` | 1 | 0 |
| `screens/reminders/index.tsx` | `size="sm"` | 1 | 0 |
| `screens/reminders/index.tsx` | `<Button.Label className="font-semibold text-danger">` | 1 | 0 |
| `screens/reminders/index.tsx` | `<Text className="text-13 font-extrabold text-danger">` | 0 | 1 |
| `screens/reminders/index.tsx` | `className="w-full rounded-xl bg-danger"` | 1 | 0 |
| `screens/reminders/index.tsx` | `className="h-14 w-full rounded-16 bg-danger"` | 0 | 1 |
| `screens/reminders/index.tsx` | `<Button.Label className="font-bold text-danger-foreground">` | 1 | 0 |
| `screens/reminders/index.tsx` | `<Text className="text-17 font-extrabold text-danger-foreground">` | 0 | 1 |
| `screens/reminders/index.tsx` | `style={chunkyLip.danger}` | 0 | 1 |
| `screens/reminders/index.tsx` | `<Button.Label` | 4 | 2 |
| `screens/reminders/index.tsx` | `rounded-14` | 1 | 2 |
| `screens/reminders/index.tsx` | `rounded-16` | 4 | 5 |
| `screens/reminders/index.tsx` | `CATEGORY_SLOTS.rose` | 1 | 2 |
| `screens/add-reminder/index.tsx` | `HeaderHeightContext` | 2 | 0 |
| `screens/add-reminder/index.tsx` | `keyboardVerticalOffset={headerHeight}` | 1 | 0 |
| `screens/add-reminder/index.tsx` | `contentInsetAdjustmentBehavior="automatic"` | 1 | 0 |
| `screens/add-reminder/index.tsx` | `paddingTop: 24,` | 1 | 0 |
| `screens/add-reminder/index.tsx` | `testID="add-reminder-title"` | 1 | 0 (lo genera `ScreenHeader`) |
| `screens/add-reminder/index.tsx` | `className="h-14 rounded-16 bg-accent" style={chunkyLip.primary}` | 1 | 0 |
| `screens/add-reminder/index.tsx` | `className="mt-auto h-14 rounded-16 bg-accent" style={chunkyLip.primary}` | 0 | 1 |
| `screens/add-reminder/index.tsx` | `flexGrow: 1` | 0 | 1 |
| `screens/docs/index.tsx` | `HeaderHeightContext` | 2 | 0 |
| `screens/docs/index.tsx` | `keyboardVerticalOffset={headerHeight}` | 1 | 0 |
| `screens/docs/index.tsx` | `contentInsetAdjustmentBehavior="automatic"` | 1 | 0 |
| `screens/docs/index.tsx` | `paddingTop: 24,` | 1 | 0 |
| `screens/docs/index.tsx` | `from '../home/home-entrance'` | 1 | 0 |
| `screens/docs/index.tsx` | `testID="docs-header-skeleton"` | 1 | 1 |
| `theme/global.css` | `--color-category-amber: #FFF7ED` | 1 | 1 |
| `theme/global.css` | `--color-category-amber-strong: #A55E07` | 1 | 1 |
| `theme/global.css` | `--color-category-rose: #FFF0F3` | 1 | 1 |
| `theme/global.css` | `--color-lip-danger: #9F1F15` | 2 | 2 |
| `theme/chunky-lip.ts` | `danger: lipStyle({ offsetY: 4, color: lipDanger }),` | 1 | 1 |
| `__tests__/chunky-cta-canvas-fidelity.test.ts` | `literalId('add-reminder-submit'), 'h-14 rounded-16 bg-accent'` | 1 | 0 |
| `../docs/ui-guidelines.md` | `## Enmienda #204` | 0 | 1 |

Anclas del canvas congelado (`specs/mobile-canvas-routine/canvas/`), que no
cambian: `Recordatorios.dc.html` contiene una vez cada uno de
`animation: rise 400ms ease-out both`, `rise 400ms ease-out 70ms`,
`rise 400ms ease-out 140ms`, `border: 2px solid var(--amber)`,
`--amber:#FFF7ED`, `--amber-s:#A55E07`, `--rose:#FFF0F3`,
`box-shadow: 0 4px 0 #9F1F15` y `padding: 56px 20px 32px`, y tres veces
`height: 44px; padding: 0 10px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger)`.
`NuevoRecordatorio.dc.html` contiene una vez `margin-top: auto; height: 56px`
y `font-size: 24px; font-weight: 900; letter-spacing: -0.02em`.
`Documentos.dc.html` contiene una vez `rise 400ms ease-out 60ms` y
`rise 400ms ease-out 180ms`.

Al escribir la spec no se ejecutó nada (el leader instaló después `node_modules` con
`bun install --frozen-lockfile`). Las cifras de jest («N tests») las mide el implementador sobre su base.

## TestIDs

| testID | Estado | Dónde |
|---|---|---|
| `reminders` | nuevo (fila de `ScreenHeader`) | Recordatorios |
| `reminders-back` | nuevo (lo genera `ScreenHeader`) | Recordatorios |
| `reminders-title` | se conserva (ahora lo genera `ScreenHeader`) | Recordatorios |
| `reminders-add-link` | se conserva (accesorio de `ScreenHeader`) | Recordatorios |
| `reminders-actions` | **desaparece** | Recordatorios |
| `reminders-no-pets-frame` | nuevo | Recordatorios sin mascotas |
| `reminders-no-pets-header` | nuevo | Recordatorios sin mascotas |
| `reminders-no-pets-header-back` | nuevo (lo genera `ScreenHeader`) | Recordatorios sin mascotas |
| `reminders-entry-${id}` | se conserva (pasa de `HomeEntrance` a `RiseIn`) | Recordatorios |
| `add-reminder` | nuevo (fila de `ScreenHeader`) | Agregar |
| `add-reminder-back` | nuevo | Agregar |
| `add-reminder-title` | se conserva (ahora lo genera `ScreenHeader`) | Agregar |
| `docs-header` | nuevo | Documentos |
| `docs-header-back` | nuevo | Documentos |
| `docs-header-eyebrow` | nuevo (antes el eyebrow no tenía testID) | Documentos |
| `docs-header-title` | nuevo (antes el título no tenía testID) | Documentos |
| `docs-header-skeleton` | se conserva (pasa a `titlePlaceholder`) | Documentos |
| `docs-entry-${id}` | se conserva (pasa de `HomeEntrance` a `RiseIn`) | Documentos |

Selectores por regex medidos en la base y su veredicto:
`screens/reminders/index.test.tsx` usa `/^reminders-(title|add-link)$/`,
`/^reminder-row-skeleton-/` y `/^reminder-row-/`;
`screens/docs/index.test.tsx` usa `/^doc-/`;
`screens/add-reminder/index.test.tsx` usa `/^type-chip-/` y `/^advance-chip-/`;
`screens/home/index.test.tsx` usa `/^reminders-item-/`. Ningún testID nuevo
casa con ninguno (`docs-header` empieza por `docs`, no por `doc-`). El de
`/^reminders-(title|add-link)$/` vive en un `it` que se enmienda (inventario,
fila I3).

## Requisitos funcionales

Cada `it` nuevo empieza por `#204 R<n>`. Los ficheros de test son relativos a
`mobile-pet-tracker/src/`. El orden de los R es el orden de implementación
(tasks.md): ningún test rojo aserta nodos que cree un R posterior.

**R1 — Rutas sin cabecera nativa.** WHEN `RootLayout` monta el grupo
protegido, THE SYSTEM SHALL declarar `reminders`, `add-reminder` y
`pets/[petId]/docs` con `options` exactamente `{ headerShown: false }`, y
`pets/[petId]/docs-upload` SHALL conservar las opciones de cabecera nativa de
`#95 R4`.
- Test: `app/__tests__/layout.test.tsx`, describe `#204 R1: Rutina sin cabecera nativa`, `it.each([['reminders'], ['add-reminder'], ['pets/[petId]/docs']])('#204 R1: %s oculta la cabecera nativa')`: busca el hijo por `name` en el grupo protegido como los `it.each` vecinos y espera `options` `toEqual({ headerShown: false })`.
- La rama «las demás rutas de detalle conservan su cabecera» la candan las filas que quedan en `#95 R4` (`docs-upload` incluida) y `#114 R4` (`alerts`).
- En este mismo commit rojo se borra entero `describe('#197 R20: cimientos sin cablear')` de `__tests__/canvas-foundations.test.ts` (inventario, fila I1).

**R2 — `ScreenHeader` acepta un marcador de título.** WHEN `ScreenHeader`
recibe `titlePlaceholder` y no recibe `title`, THE SYSTEM SHALL pintar el
marcador en el hueco del título (dentro de la columna `flex-1`, después del
eyebrow); WHEN recibe `title`, THE SYSTEM SHALL ignorar el marcador. La prop
es opcional (`titlePlaceholder?: ReactNode`) y no cambia nada más del
componente.
- Test: `components/__tests__/screen-header.test.tsx`, describe `#204 R2: marcador de título`:
  - `it('#204 R2: sin título pinta el marcador en el hueco del título')`: con `eyebrow` y un `View testID="placeholder"` como marcador, el marcador es hijo de la misma columna que `${testID}-eyebrow`, va después de él y no existe `${testID}-title`.
  - `it('#204 R2: con título ignora el marcador')`: con `title` y marcador, existe `${testID}-title` y `placeholder` no existe.

**R3 — Paso de entrada de Recordatorios.** THE SYSTEM SHALL exportar
`MOTION_REMINDERS_STAGGER_MS = 70` desde `src/theme/motion.ts`, escrito como
`export const MOTION_REMINDERS_STAGGER_MS = 70;`.
- Test: `theme/__tests__/motion.test.ts`, `it('#204 R3: declara el paso de 70 ms de las filas de Recordatorios')` con `expect(MOTION_REMINDERS_STAGGER_MS).toBe(70)`. El inventario «no exporta nada más» se enmienda (fila I12).

**R4 — Cabecera y marco de Recordatorios.** WHILE la cuenta tiene al menos
una mascota, THE SYSTEM SHALL pintar como primer hijo del contenido de
`screen-reminders` un `ScreenHeader` con `testID="reminders"`,
`backFallback="/profile"`, `title={t('reminders.reminders')}`, talla 26 y
como `accessory` el botón `reminders-add-link` tal como está hoy (receta,
icono, etiqueta y `onPress`). El `contentContainerStyle` SHALL ser
`{ paddingHorizontal: 20, paddingTop: insets.top + 12, gap: 14, paddingBottom: insets.bottom + 24 }`
y el `ScrollView` SHALL no declarar `contentInsetAdjustmentBehavior`.
- Test: `screens/reminders/index.test.tsx`, describe `#204 R4: cabecera en contenido`:
  - `it('#204 R4: pinta volver, Recordatorios y Nuevo en la cabecera en contenido')`: `reminders-back` existe; `reminders-title` tiene el texto «Recordatorios», `accessibilityRole="header"` y `className` `text-26 font-black tracking-title text-foreground`; `reminders-add-link` está dentro de `reminders` y es su último hijo.
  - `it('#204 R4: volver sin historial lleva a Perfil')`: `BackButton` usa el `router` estático de `expo-router` (`router.canGoBack() ? router.back() : router.replace(fallback)`). Con `canGoBack` devolviendo `false` (si el fichero ya dobla `expo-router`, en su doble; si no, `jest.spyOn(router, 'canGoBack')` y `jest.spyOn(router, 'replace')` sobre el `router` importado de `expo-router`, restaurados en `afterEach`), pulsar `reminders-back` llama a `replace('/profile')` una vez. Mismo método en R5.2, R10 y R12.
  - `it('#204 R4: usa el marco del canvas sin cabecera nativa')`: `contentContainerStyle` `toEqual({ paddingHorizontal: 20, paddingTop: 52, gap: 14, paddingBottom: 48 })` con el mock de insets del fichero (`top: 40`, `bottom: 24`) y `props.contentInsetAdjustmentBehavior` `undefined`.

**R5 — Estados de Recordatorios bajo la cabecera.**
- R5.1 WHEN Recordatorios está cargando, en error, vacío o con error de acción, THE SYSTEM SHALL pintar `reminders` antes del nodo del estado (`reminders-loading`, `reminders-error`, `reminders-empty`, `reminders-action-error`) dentro del mismo contenido.
  - Test: `it.each` con una fila por estado, `'#204 R5: la cabecera encabeza el estado %s'`: en el árbol, `reminders` aparece antes que el nodo del estado (mismo padre o ancestro común `screen-reminders`). Una fila por rama: cuatro filas.
- R5.2 WHEN la cuenta no tiene mascotas, THE SYSTEM SHALL pintar `reminders-no-pets-frame` (`className="flex-1 bg-background"`, `style={{ paddingTop: insets.top + 12, paddingHorizontal: 20 }}`) con dos hijos en este orden: un `ScreenHeader` `testID="reminders-no-pets-header"` con `backFallback="/profile"` y sin `title`, `eyebrow` ni `accessory`; y el contenedor `reminders-no-pets-screen` sin ningún cambio (mismo `className`, sin `style`, mismo hijo).
  - Test: `it('#204 R5: sin mascotas conserva volver encima del vacío')`: hijos de `reminders-no-pets-frame` por `testID` `toEqual(['reminders-no-pets-header', 'reminders-no-pets-screen'])`, existe `reminders-no-pets-header-back` y no existe `reminders-no-pets-header-title`.

**R6 — Entrada de las filas de Recordatorios.** WHEN la lista tiene filas,
THE SYSTEM SHALL envolver cada fila en `RiseIn` (`src/components/rise-in.tsx`)
con `testID={`reminders-entry-${reminder.id}`}` y
`delayMs={i * MOTION_REMINDERS_STAGGER_MS}`, en el orden de la lista;
`screens/reminders/index.tsx` SHALL no importar `../home/home-entrance`.
- Test: `screens/reminders/index.test.tsx`, el fichero dobla `../../components/rise-in` con un `RiseIn` que registra sus props y pinta un `View` con su `testID` (mismo patrón que el doble actual de `HomeEntrance`), y `it('#204 R6: escalona las filas 0, 70 y 140 ms con RiseIn')` espera, para las tres filas del fixture en orden, `delayMs` 0, 70 y 140 con su `testID`.

**R7 — Fila próxima en el ámbar del canvas.** WHEN un recordatorio es próximo
(activo y a 0-10 días), THE SYSTEM SHALL pintar su fila con
`flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border-2 border-category-amber`
y su badge `reminder-upcoming-${id}` (dentro de `PopIn`) con
`rounded-full px-2 py-0.75 text-11 font-extrabold bg-category-amber text-category-amber-strong`,
leyendo `bg-category-amber` y `text-category-amber-strong` de
`CATEGORY_SLOTS.amber.surface` y `CATEGORY_SLOTS.amber.ink`. La fila no
próxima conserva `border border-border` y la inactiva su ` opacity-50`.
- Test: `it('#204 R7: la fila próxima y su badge usan el ámbar del canvas')`: `className` de la fila próxima y del badge con `toBe` a los literales de arriba. Las ramas lejana e inactiva las canda `#178 R6 › distingue las recetas de fila próxima, lejana e inactiva`, enmendado (fila I5).

**R8 — «Eliminar» de cada fila.** THE SYSTEM SHALL pintar
`reminder-delete-${id}` como `Button` con
`` className={`h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}`} ``,
`variant="danger-soft"`, sin `size`, conservando `isDisabled` y `onPress`, y
con un único hijo `<Text className="text-13 font-extrabold text-danger">` con
`t('reminders.delete')`. Sin `Button.Label` y sin labio.
- Test: `it('#204 R8: Eliminar de fila usa la receta rosa del canvas')`: el `className` resuelto del botón contiene `h-11 rounded-14 px-2.5 bg-category-rose`; dentro hay un `Text` «Eliminar» con `className` `text-13 font-extrabold text-danger`.

**R9 — «Eliminar» de la hoja con cuerpo y labio.** WHEN la hoja de borrado
está abierta, THE SYSTEM SHALL pintar `reminders-delete-confirm` con
`className="h-14 w-full rounded-16 bg-danger"`, `style={chunkyLip.danger}` y
`variant="danger"`, y con un único hijo
`<Text className="text-17 font-extrabold text-danger-foreground">` con
`t('reminders.delete')`. «Cancelar» (`reminders-delete-cancel`) no cambia.
- Test: `it('#204 R9: Eliminar de la hoja lleva cuerpo de 56 y labio danger')`: el `className` resuelto contiene `h-14 w-full rounded-16 bg-danger`; dentro hay un `Text` «Eliminar» con `className` `text-17 font-extrabold text-danger-foreground`; no hay `button__label` dentro del botón. El labio se canda por fuente en R15.

**R10 — Cabecera, marco y teclado de Agregar recordatorio.** WHEN hay una
mascota seleccionada, THE SYSTEM SHALL pintar como primer hijo de
`add-reminder-form` un `ScreenHeader` con `testID="add-reminder"`,
`backFallback="/reminders"`, `title={t('addReminder.addReminder')}` y
`size={24}`. El `contentContainerStyle` SHALL ser
`{ paddingHorizontal: 20, paddingTop: insets.top + 12, gap: 16, paddingBottom: insets.bottom + 24, flexGrow: 1 }`,
sin `contentInsetAdjustmentBehavior`. `screen-add-reminder` SHALL no declarar
`keyboardVerticalOffset` y el fichero SHALL no leer `HeaderHeightContext`.
- Test: `screens/add-reminder/index.test.tsx`, describe `#204 R10: cabecera en contenido`:
  - `it('#204 R10: pinta volver y Agregar recordatorio en la cabecera en contenido')`: `add-reminder-back` existe; `add-reminder-title` tiene «Agregar recordatorio», `accessibilityRole="header"` y `className` `text-24 font-black tracking-title text-foreground`.
  - `it('#204 R10: volver sin historial lleva a Recordatorios')`: con `canGoBack` falso (método de R4), pulsar `add-reminder-back` llama a `replace('/reminders')`.
  - `it('#204 R10: usa el marco del canvas sin cabecera nativa')`: `toEqual({ paddingHorizontal: 20, paddingTop: 52, gap: 16, paddingBottom: 48, flexGrow: 1 })` y `contentInsetAdjustmentBehavior` `undefined`.
  - `it('#204 R10: el teclado no descuenta una cabecera que ya no existe')`: `screen-add-reminder` tiene `props.keyboardVerticalOffset` `undefined` aunque el render siga envuelto en `HeaderHeightContext.Provider value={91}`.

**R11 — «Guardar recordatorio» al pie.** THE SYSTEM SHALL pintar
`add-reminder-submit` con `className="mt-auto h-14 rounded-16 bg-accent"` y
`style={chunkyLip.primary}`; etiqueta, `onPress` y deshabilitado no cambian.
- Test: `it('#204 R11: Guardar se apoya al pie del formulario')`: el `className` resuelto de `add-reminder-submit` contiene `mt-auto h-14 rounded-16 bg-accent`.

**R12 — Cabecera, marco y teclado de Documentos.** THE SYSTEM SHALL pintar
como primer hijo del contenido de `screen-docs` un `ScreenHeader` con
`testID="docs-header"`, `backFallback="/profile"`,
`eyebrow={t('docs.documentsOf')}` y talla 26. WHILE la mascota carga
(`pet.data === undefined`), THE SYSTEM SHALL pasarle
`titlePlaceholder={<Skeleton testID="docs-header-skeleton" className="h-8 w-36 rounded-xl" />}`
y ningún `title`; WHEN la mascota cargó, `title={petName ?? t('docs.pet')}`.
El `contentContainerStyle` SHALL ser
`{ paddingHorizontal: 20, paddingTop: insets.top + 12, gap: 14, paddingBottom: insets.bottom + 24 }`,
sin `contentInsetAdjustmentBehavior`; `docs-keyboard-avoider` SHALL no
declarar `keyboardVerticalOffset` y el fichero SHALL no leer
`HeaderHeightContext`.
- Test: `screens/docs/index.test.tsx`, describe `#204 R12: cabecera en contenido`:
  - `it('#204 R12: pinta volver, eyebrow y nombre en la cabecera en contenido')`: `docs-header-back` existe; `docs-header-eyebrow` tiene «Documentos de»; `docs-header-title` tiene el nombre del fixture, `accessibilityRole="header"` y `className` `text-26 font-black tracking-title text-foreground`.
  - `it('#204 R12: mientras carga la mascota el esqueleto ocupa el título')`: con la mascota pendiente, `docs-header-skeleton` está dentro de `docs-header` y no existe `docs-header-title`.
  - `it('#204 R12: sin nombre la cabecera dice Mascota')`: con una mascota sin nombre utilizable (la rama `petName` nula que ya ejercita el fichero), `docs-header-title` tiene `es['docs.pet']`.
  - `it('#204 R12: volver sin historial lleva a Perfil')`: con `canGoBack` falso (método de R4), pulsar `docs-header-back` llama a `replace('/profile')`.
  - `it('#204 R12: usa el marco del canvas sin cabecera nativa')`: `toEqual({ paddingHorizontal: 20, paddingTop: 52, gap: 14, paddingBottom: 48 })`, `contentInsetAdjustmentBehavior` `undefined` y `docs-keyboard-avoider` con `props.keyboardVerticalOffset` `undefined`.

**R13 — Estados de Documentos bajo la cabecera.** WHEN Documentos muestra la
lista cargando, vacía, en error o con filas, THE SYSTEM SHALL pintar
`docs-header` antes del nodo del estado (`docs-list-skeleton`, `docs-empty`,
`docs-error`, `doc-${id}`) dentro de `screen-docs`.
- Test: `it.each` con una fila por estado, `'#204 R13: la cabecera encabeza el estado %s'` (cuatro filas). La subida solo para el dueño y `docs-action-error` siguen candados por sus tests actuales sin cambios.

**R14 — Entrada de las filas de Documentos.** WHEN la lista tiene filas, THE
SYSTEM SHALL envolver cada fila en `RiseIn` con
`testID={`docs-entry-${document.id}`}` y
`delayMs={index * MOTION_STAGGER_MS}`; `screens/docs/index.tsx` SHALL no
importar `../home/home-entrance`.
- Test: el fichero dobla `../../components/rise-in` como en R6 y `it('#204 R14: escalona las filas 0, 60 y 120 ms con RiseIn')` espera `delayMs` 0, 60 y 120 (o tantos múltiplos de 60 como filas tenga el fixture) con su `testID`, en el orden del backend.

**R15 — Fidelidad al canvas congelado.** THE SYSTEM SHALL tener
`src/__tests__/routine-canvas-fidelity.test.ts` (nuevo), que lee cada artboard
con `readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-routine/canvas/<Artboard>.dc.html'), 'utf8')`
y, en cada fila, aserta el literal del canvas **y** el literal de producción
(fuente leída con `readFileSync` desde `src/`). Filas:

| Fila | Artboard: literal(es) | Producción: literal(es) |
|---|---|---|
| marco de Recordatorios | `padding: 56px 20px 32px` | `screens/reminders/index.tsx` contiene `paddingTop: insets.top + 12,` |
| marco de Agregar | `NuevoRecordatorio`: `padding: 56px 20px 32px` | `screens/add-reminder/index.tsx` contiene `paddingTop: insets.top + 12,` |
| marco de Documentos | `Documentos`: `padding: 56px 20px 32px` | `screens/docs/index.tsx` contiene `paddingTop: insets.top + 12,` |
| título de 24 | `NuevoRecordatorio`: `font-size: 24px; font-weight: 900; letter-spacing: -0.02em` | `screens/add-reminder/index.tsx` contiene `size={24}` |
| borde próximo | `border: 2px solid var(--amber)` y `--amber:#FFF7ED` | reminders contiene `border-2 border-category-amber`; `theme/global.css` contiene `--color-category-amber: #FFF7ED` |
| badge próximo | `background: var(--amber); color: var(--amber-s)` y `--amber-s:#A55E07` | reminders contiene `CATEGORY_SLOTS.amber.surface` y `CATEGORY_SLOTS.amber.ink` en la `className` de `reminder-upcoming-`; `theme/global.css` contiene `--color-category-amber-strong: #A55E07` |
| «Eliminar» de fila | `height: 44px; padding: 0 10px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger)` y `--rose:#FFF0F3` | reminders contiene `h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}` y `<Text className="text-13 font-extrabold text-danger">`; `theme/global.css` contiene `--color-category-rose: #FFF0F3` |
| labio del destructivo | `box-shadow: 0 4px 0 #9F1F15` | el tag de `reminders-delete-confirm` contiene `style={chunkyLip.danger}`; `theme/chunky-lip.ts` contiene `danger: lipStyle({ offsetY: 4, color: lipDanger }),`; `theme/global.css` contiene `--color-lip-danger: #9F1F15` |
| escalón de Recordatorios | `animation: rise 400ms ease-out both`, `rise 400ms ease-out 70ms`, `rise 400ms ease-out 140ms` | reminders contiene `delayMs={i * MOTION_REMINDERS_STAGGER_MS}`; `theme/motion.ts` contiene `export const MOTION_REMINDERS_STAGGER_MS = 70;` |
| escalón de Documentos | `rise 400ms ease-out 60ms`, `rise 400ms ease-out 180ms` | docs contiene `delayMs={index * MOTION_STAGGER_MS}`; `theme/motion.ts` contiene `export const MOTION_STAGGER_MS = 60;` |
| «Guardar» al pie | `margin-top: auto; height: 56px` | add-reminder contiene `className="mt-auto h-14 rounded-16 bg-accent" style={chunkyLip.primary}` y `flexGrow: 1` |

- Test: `it.each(rows)('#204 R15: %s sigue al canvas', …)`, una fila por línea de la tabla (once filas). El artboard se lee del disco en cada fila: no se copia el literal a una constante compartida con producción.

**R16 — Enmienda #204 de la carta.** THE SYSTEM SHALL añadir al final de
`docs/ui-guidelines.md` el bloque «Enmienda #204» exactamente como lo fija
`design.md` § Bloque «Enmienda #204» (texto canónico), una sola vez, con su
casilla `- [ ] Enmienda #204 aprobada por humano`.
- Test: en `routine-canvas-fidelity.test.ts`, `it('#204 R16: la carta lleva la Enmienda #204 una sola vez y con su casilla')`: lee el bloque canónico de `specs/mobile-canvas-routine/design.md` (entre la cabecera `### Bloque «Enmienda #204»` y su valla `markdown`), normaliza la casilla con `/- \[[ xX]\] Enmienda #204 aprobada por humano/g` y espera que la carta lo contenga una vez; `## Enmienda #204` aparece una vez; la casilla casa `/- \[[ xX]\] Enmienda #204 aprobada por humano/`.

**R17 — Fuentes limpias.** THE SYSTEM SHALL dejar
`screens/reminders/index.tsx`, `screens/add-reminder/index.tsx`,
`screens/docs/index.tsx` y `components/screen-header.tsx` sin hex fuera de
`#NNN R<n>`, sin `StyleSheet.create`, sin clases arbitrarias `-[…]`, sin emoji
y sin props de sombra de React Native.
- Test: en `routine-canvas-fidelity.test.ts`, `it.each(files)('#204 R17: %s es grep-limpio', …)` con las mismas cinco expresiones que `#197 R22`. Las dependencias las sigue candando `#197 R22: no añade dependencias` (44 y 8), sin cambio.

**R18 — Verificación en dispositivo (la cierra el humano).** WHEN el humano
abre Recordatorios, Agregar recordatorio y Documentos en el dev build Android,
THE SYSTEM SHALL mostrar lo de § Cierre del humano. No tiene test automático:
lo cierra su casilla en § Aprobación y no bloquea la implementación.

## Candados que esta feature revierte

Inventario cerrado de los `it` existentes que cambian. Cada uno se enmienda en
el **commit rojo** del R indicado, añadiendo al final de su título el sufijo
`(enmendado por #204 R<n>)` (en un `it.each`, al final de la plantilla). Un
`it` que enmiendan dos R lleva los dos sufijos, cada uno puesto en el commit
rojo de su R. Rutas relativas a `mobile-pet-tracker/src/`. «Hoy» es lo medido
en `81cb6d6b`; títulos y cifras re-medidos en `9ba176f1` (E3).

| # | Fichero › describe › it (título literal de hoy) | Hoy aserta | Después aserta | R |
|---|---|---|---|---|
| I1 | `__tests__/canvas-foundations.test.ts` › `#197 R20: cimientos sin cablear` (el `describe` entero: `'#197 R20: nadie monta todavía los cimientos %s'` y `'#197 R20: el layout raíz no cambia'`) | que ninguna pantalla monta `ScreenHeader`/`RiseIn`/`useChunkyLip` y que `app/_layout.tsx` sigue igual | **se borra entero, sin sufijo**, en el commit rojo de R1. Si al empezar ya no existe (lo borró otra feature de la ola), el paso no tiene efecto y se apunta en el informe | R1 |
| I2 | `app/__tests__/layout.test.tsx` › `#95 R4: cada pantalla de detalle declara su cabecera nativa` › `'#194 R4: %s usa exactamente las opciones de cabecera acordadas (enmendado por #200 R12) (enmendado por #199 R1)'` | filas `['add-reminder', '']` y `['pets/[petId]/docs', '']` con cabecera nativa | se quitan esas dos filas; `pets/[petId]/docs-upload` y las demás se quedan | R1 |
| I3 | `screens/reminders/index.test.tsx` › `#178 R4: marco y título en contenido` › `coloca título y Nuevo en ese orden dentro de la fila de acciones` | `reminders-actions` con `className` `flex-row items-center gap-2` y dos hijos (`reminders-title`, `reminders-add-link`) | la cabecera `reminders` (`flex-row items-center gap-2`, tres hijos): `reminders-back` dentro del primero (envoltorio `-ml-2.5`), `reminders-title` dentro del segundo (columna `flex-1`) y `reminders-add-link` es el tercero y último | R4 |
| I4 | `app/__tests__/layout.test.tsx` › `#114 R4: reminders y alerts declaran su cabecera nativa` › `'%s usa exactamente las opciones de cabecera acordadas'` | fila `['reminders', '']` con cabecera nativa | se quita la fila `reminders`; `alerts` se queda (si #203 ya la quitó, el `it.each` queda sin filas y se borra entero, sin sufijo) | R1 |
| I5 | `screens/reminders/index.test.tsx` › `#178 R6: fila del canvas` › `distingue las recetas de fila próxima, lejana e inactiva` | fila próxima con `border-2 border-warning-soft` | fila próxima con `border-2 border-category-amber`; lejana e inactiva igual que hoy | R7 |
| I6 | `screens/reminders/index.test.tsx` › `#114 R5 (revertido por #178 R4): el título vive en el contenido` › `deja Nuevo junto al título en carga y con filas` | `reminders-actions` contiene título y «Nuevo» | `reminders` contiene `reminders-title` y `reminders-add-link` | R4 |
| I7 | ídem › `uses the metrics under the native header, selects the first pet, and shows row skeletons (#114 R6)` | `paddingTop: 24` | `paddingTop: 52` (resto igual) | R4 |
| I8 | `screens/reminders/index.test.tsx` › `#178 R4: marco y título en contenido` › `usa el marco 20/24/14 bajo la cabecera nativa` | `{ paddingHorizontal: 20, paddingTop: 24, gap: 14, paddingBottom: 48 }` | `paddingTop: 52` | R4 |
| I9 | ídem › `pinta Recordatorios como título accesible con la receta del canvas` | `className` `flex-1 text-26 font-black tracking-title text-foreground` | `text-26 font-black tracking-title text-foreground` (sin `flex-1`: lo pone la columna de `ScreenHeader`) | R4 |
| I10 | `screens/reminders/index.test.tsx` › `#155 R6: sin recordatorios, Pingo sostiene su lista` › `queda en el sitio del vacío que sustituye` | dos listas de hijos que empiezan por `'reminders-actions'` | empiezan por `'reminders'` | R4 |
| I11 | `screens/reminders/index.test.tsx` › `#181 R4: Recordatorios distingue una cuenta sin mascotas` › `R4.2: centra solo el vacío y retira los controles que necesitan mascota` | `queryByTestId('reminders-actions')` nulo (entre otros), en el bucle `for (const id of ['screen-reminders', 'reminders-actions', 'reminders-empty', 'reminders-pills', 'reminders-delete-host'])` | **Enmienda opcional de higiene; nace verde, no cuenta como rojo de R4.** Tras R4 `reminders-actions` ya no existe y la aserción de nulo sigue pasando. Si el implementador la hace, en el commit rojo de R4 y con el sufijo `(enmendado por #204 R4)`: `'reminders-actions'` pasa a `'reminders-add-link'` en el bucle; si no la hace, no hay sufijo ni parada. El resto (contenedor intacto, `style` `undefined`) sigue igual y R5.2 lo mantiene verde | R4 (opcional) |
| I12 | `theme/__tests__/motion.test.ts` › `no exporta nada más (enmendado por #195 R13) (enmendado por #197 R11) (enmendado por #200 R4) (enmendado por #199 R27)` | lista cerrada de exports sin `MOTION_REMINDERS_STAGGER_MS` | la misma lista con `'MOTION_REMINDERS_STAGGER_MS'` en su posición de `.sort()`; si #199/#200 ya añadieron los suyos, se conservan | R3 |
| I13 | `screens/reminders/index.test.tsx` › `#178 R7: entrada escalonada y badge` › `asigna a cada entrada su índice en el orden del fixture` (y el `jest.mock('../home/home-entrance')`/`mockHomeEntrance` de cabecera del fichero) | `mockHomeEntrance` recibe `index` 0, 1, 2 | el doble de `../../components/rise-in` recibe `delayMs` 0, 70, 140 con `testID` `reminders-entry-<id>`; el doble de `home-entrance` se borra del fichero | R6 |
| I14 | ídem › `envuelve el badge próximo con PopIn y la receta del canvas` | badge `bg-warning-soft … text-warning-strong` | badge `rounded-full px-2 py-0.75 text-11 font-extrabold bg-category-amber text-category-amber-strong`; `PopIn` sigue envolviéndolo | R7 |
| I15 | `screens/reminders/index.test.tsx` › `#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol` › `pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` | `className` resuelto con `w-full rounded-xl bg-danger` y etiqueta `button__label … font-bold text-danger-foreground` | `h-14 w-full rounded-16 bg-danger` y un `Text` `text-17 font-extrabold text-danger-foreground`; `variant` sigue `danger` | R9 |
| I16 | `screens/add-reminder/index.test.tsx` › `#114 R7: sin mascota, add-reminder desapila hasta reminders` › `uses the metrics under the native header (#95 R6)` | `paddingTop: 24` | `paddingTop: 52` y `flexGrow: 1` | R10 |
| I17 | `screens/add-reminder/index.test.tsx` › `#178 R10: marco, título y chips de tipo del canvas` › `usa el marco 20/24/16 bajo la cabecera nativa` | `{ paddingHorizontal: 20, paddingTop: 24, gap: 16, paddingBottom: 48 }` | `{ paddingHorizontal: 20, paddingTop: 52, gap: 16, paddingBottom: 48, flexGrow: 1 }` | R10 |
| I18 | ídem › `abre el formulario con Agregar recordatorio como título accesible` | `className` `text-2xl font-black tracking-title text-foreground` | `text-24 font-black tracking-title text-foreground`; `title.parent?.children[0]` sigue siendo el título (sin eyebrow) | R10 |
| I19 | `screens/add-reminder/index.test.tsx` › `#148 R5: add-reminder se aparta del teclado en Android` › `el host screen-add-reminder añade paddingBottom 291 al abrir el teclado` | `paddingBottom` 291 = 700 − (500 − 91) | título nuevo `el host screen-add-reminder añade paddingBottom 200 al abrir el teclado (enmendado por #204 R10)`, `paddingBottom` 200 (offset 0) | R10 |
| I20 | `screens/docs/index.test.tsx` › `#95 R6: métricas bajo cabecera nativa` › `usa solo el inset inferior del dispositivo` | `paddingTop: 24` | `paddingTop: 52` | R12 |
| I21 | `screens/docs/index.test.tsx` › `#155 R7: sin documentos, Pingo los guarda` › `queda en el sitio del vacío que sustituye` | hijos `['View', 'docs-empty']` (el `View` es la cabecera sin `testID`) | `['docs-header', 'docs-empty']` (es una de las 10 apariciones de `'View'` que mide I35) | R12 |
| I22 | `screens/docs/index.test.tsx` › `#175 R6: fila del artboard` › `envuelve cada fila con su índice y conserva el orden del backend` (y el doble de `home-entrance` de cabecera) | `mockHomeEntrance` con `index` y `testID` `docs-entry-<id>` | el doble de `rise-in` con `delayMs = index * 60` y el mismo `testID`; el doble de `home-entrance` se borra del fichero | R14 |
| I23 | `__tests__/legibility-classnames.test.ts` › `#61 R1: la etiqueta destructiva usa el token de danger` › `resuelve el Button.Label con text-danger-foreground` | la fuente contiene `<Button.Label className="font-bold text-danger-foreground">` | contiene `<Text className="text-17 font-extrabold text-danger-foreground">` | R9 |
| I24 | `__tests__/legibility-classnames.test.ts` › `#61 R5: text-warning deja de usarse como color de texto` › `'%s pinta su texto con text-warning-strong (enmendado por #199 R14)'` | `warningSites` incluye `screens/reminders/index.tsx` (hoy 1 `text-warning-strong`, el del badge); en `9ba176f1` son dos filas, `home` y `reminders` | se quita esa fila de `warningSites`, que se queda solo con `home` (la constante solo la lee este `it.each`) | R7 |
| I25 | ídem › `conserva el ámbar puro como relleno de badge` | reminders contiene `bg-warning-soft` | reminders contiene `CATEGORY_SLOTS.amber.surface` | R7 |
| I26 | `__tests__/chunky-cta-canvas-fidelity.test.ts` › (raíz) › `'#177 R3.1: %s pinta la receta cta de %s (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por E4 R19) (enmendado por E4 R20)'` | fila `CTA_ROWS` de `add-reminder-submit` con clases `'h-14 rounded-16 bg-accent'` | `'mt-auto h-14 rounded-16 bg-accent'`. `CTA_ROWS` también lo leen `#177 R3.2` (solo `path` y `anchor`), `primaryIds` y `ctaFiles`: ninguno lee la columna de clases | R11 |
| I27 | ídem › `#177 R6.2: recuentos de etiquetas (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #200 R5) (enmendado por #199 R9)` | `<Button\.Label` = `35 - 15 - 1 - 1 - 1`; `Button\.Label` = `82 - 30 - 2 - 2 - 2`; `text-17` = `8 + 15 + 1 + 1 + 1 + 1 + 1 + 1` (29, E3) | R8: `<Button\.Label` `- 1`, `Button\.Label` `- 2`. R9: `<Button\.Label` `- 1`, `Button\.Label` `- 2`, `text-17` `+ 1` | R8, R9 |
| I28 | ídem › `#177 R7.3: inventario de los veintisiete radios de dieciséis (enmendado por #191 R11) (enmendado por #189 R7) (enmendado por #189 R13) (enmendado por #200 R9) (enmendado por #199 R14) (enmendado por #198 R9)` | `'screens/reminders/index.tsx': 4`; total `26 + 1 + 1 + 1 + 2 + 2 + 1 + 1` (35, E3) | `'screens/reminders/index.tsx': 5`; total `+ 1` | R9 |
| I29 | ídem › `#177 R8.4: destructivos, tonales y reintentos no reciben labio (enmendado por #189 R13)` | `'reminders-delete-confirm'` en la lista de sin labio | sale de la lista | R9 |
| I30 | `__tests__/design-drift.test.ts` › `#178 R13: Recordatorios sin deriva` › `reutiliza HomeEntrance y PopIn sin Card en Recordatorios` | reminders contiene `from '../home/home-entrance'` | contiene `from '../../components/rise-in'` y no contiene `home-entrance` | R6 |
| I31 | ídem › `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10) (enmendado por #200 R9) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #198 R9)` | `rounded-14` 1, `rounded-16` 4 | R8: `rounded-14` 2. R9: `rounded-16` 5 | R8, R9 |
| I32 | `__tests__/profile-canvas-fidelity.test.ts` › `#173 R2.4: inventario de tamaños nuevos` › `reserva text-26 al nombre de la mascota en Perfil (enmendado por #176 R8) (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #197 R19) (enmendado por #198 R15)` | `expect(filesMatching(/\btext-26\b/)).toEqual([…])` con diez ficheros en `9ba176f1` (#198 R15 añadió `screens/home/index.tsx`), entre ellos las líneas `'screens/docs/index.tsx', // #175 R5` y `'screens/reminders/index.tsx', // #178 R4` | la misma lista sin esas dos líneas (ocho ficheros; `components/screen-header.tsx` ya figura). R4 borra la de `reminders` y R12 la de `docs`: los dos títulos pasan a `ScreenHeader` y los ficheros dejan de contener `text-26`. Cada commit rojo añade su sufijo al final del título: `(enmendado por #204 R4)` y `(enmendado por #204 R12)`. Anclas: `grep -cF "'screens/reminders/index.tsx', // #178 R4"` y `grep -cF "'screens/docs/index.tsx', // #175 R5"` sobre ese fichero: 1 y 1 hoy, 0 y 0 después | R4, R12 |
| I33 | `__tests__/alerts-canvas-fidelity.test.ts` › `#174 R12: inventarios` › `it.each` `limita $token a su inventario de producción (enmendado por #189 R1) (enmendado por #189 R8) (enmendado por #189 R12) (enmendado por #197 R4) (enmendado por #197 R10) (enmendado por #197 R19) (enmendado por #200 R1 y #200 R3 y #200 R5 y #200 R12 y #200 R13) (enmendado por #199 R10) (enmendado por #199 R14) (enmendado por #199 R16) (enmendado por #198 R9, R15)`, fila `tracking-title` | `expect(filesMatching(pattern)).toEqual(files)` con las líneas `'screens/add-reminder/index.tsx', // #178 R10`, `'screens/docs/index.tsx', // #175 R5` y `'screens/reminders/index.tsx', // #178 R4` en la lista de `tracking-title` | la lista sin esas tres líneas (`components/screen-header.tsx` ya figura): R4 borra la de `reminders`, R10 la de `add-reminder` y R12 la de `docs`. El título del `it.each` es común a todas las filas (`$token`): cada commit rojo le añade su sufijo `(enmendado por #204 R4)`, `(enmendado por #204 R10)` o `(enmendado por #204 R12)`, como ya hacen #189 y #197 en esa línea. La fila `text-15` (que lista `'screens/docs/index.tsx', // #175 R6`) no cambia. Anclas, sobre ese fichero: `grep -cF "'screens/reminders/index.tsx', // #178 R4"`, `grep -cF "'screens/add-reminder/index.tsx', // #178 R10"` y `grep -cF "'screens/docs/index.tsx', // #175 R5"`, las tres 1 hoy y 0 después | R4, R10, R12 |
| I34 | `screens/docs/index.test.tsx` › `#175 R5: cabecera del artboard` › `pinta una columna sin gap con eyebrow y título exactos` | sobre `header` (`container.children[0]` del contenido de `screen-docs`): `header.props.className` `undefined`, `header.children` de longitud 2, `children[0]` con `text-11 font-extrabold uppercase tracking-eyebrow text-muted` y `children[1]` con `text-26 font-black tracking-title text-foreground` | estructural: tras R12 `header` es la fila `flex-row items-center gap-2` de `ScreenHeader` (envoltorio de volver y columna `flex-1`). El `it` se reescribe para leer `docs-header-eyebrow` y `docs-header-title` con esas mismas dos clases (`toHaveProperty('props.className', …)`), conserva los dos `within(header).getByText(…)` y borra las aserciones sobre `header.props.className` y `header.children` (la forma de la fila la candan R12 y `screen-header.test.tsx`). Sufijo `(enmendado por #204 R12)`. Anclas sobre ese fichero: `grep -cF "header.children"` 3 hoy y 0 después; `grep -cF "header.props.className"` 1 y 0 | R12 |
| I35 | `screens/docs/index.test.tsx` › todas las listas de hijos de `screen-docs` que arrancan con `'View'` (el `View` es la cabecera anónima; el helper `docsChildren()` mapea `child.props.testID ?? child.type`): `#158 R3: el owner ve la acción de subir` › `con documentos pinta el botón, sus clases y el orden exacto` (1 caso); `#158 R10: cualquier miembro abre un documento` › `mantiene la lista y sitúa el error del navegador para %s` (4); `#175 R9: filtrar por categoría` › `filtra %s, conserva el orden y renumera las entradas` (5), `incluye el sinónimo %s en %s` (7), `incluye Radiografía y Receta solo en Otros` (1, dos listas), `restaura con Todos las entradas y el orden del backend` (1) y `vuelve a Todos después de una subida correcta con Análisis seleccionado` (1). **I21 queda dentro de esta cifra** | `'View'` como primer hijo: 10 apariciones (la de I21 y nueve más) en 20 casos más el de I21 | las mismas listas con `'docs-header'` en lugar de `'View'`, y el sufijo `(enmendado por #204 R12)` en los siete títulos de arriba. Ancla: `grep -cF "'View'" mobile-pet-tracker/src/screens/docs/index.test.tsx` = 10 hoy (I21 incluida) y 0 tras el commit rojo de R12; ni los `it` de R12 ni los de R13 escriben `'View'` | R12 |
| I36 | `screens/docs-upload-form/index.test.tsx` › `#185 R9 (antes #158 R5): selector y formulario de subida` › `it.each([{ docs: [] }, { docs: [docOne] }])('ordena el error del selector con lista %j')` | `listChildren()` lee `screen-docs` de `DocsRoute` y compara `['View', 'docs-filters', 'docs-entry-doc-1', 'docs-upload', 'docs-action-error']` y `['View', 'docs-empty', 'docs-action-error']` | las dos listas con `'docs-header'` en lugar de `'View'` y el sufijo `(enmendado por #204 R12)`. Es la misma causa que I35 en un fichero que renderiza la pantalla real de Documentos. Ancla: `grep -cF "'View'" mobile-pet-tracker/src/screens/docs-upload-form/index.test.tsx` = 2 hoy y 0 tras R12 | R12 |
| I37 | `screens/docs/index.test.tsx` › `#175 R5: cabecera del artboard` › `conserva una sola cabecera nativa de Documentos con título vacío` | `layout.split("name=\"pets/[petId]/docs\" options={{ ...headerOptions, title: '' }}")` de longitud 2 sobre `_layout.tsx` | **se borra entero, sin sufijo**, en el commit rojo de R1: tras R1 ese literal ya no está en `_layout.tsx` y el `it` carece de objeto (lo reemplaza `#204 R1: %s oculta la cabecera nativa`, cuya fila `pets/[petId]/docs` candan lo contrario). El `describe` y su otro `it` (I34) se quedan. Ancla: `grep -cF "una sola cabecera nativa" mobile-pet-tracker/src/screens/docs/index.test.tsx` = 1 hoy y 0 tras R1 | R1 |
| I38 | `screens/add-reminder/index.test.tsx` › `#95 R5: la pantalla no dibuja cabecera propia` › `retira el botón; el título vive en el cuerpo (#178 R10)` | `expect(screen.queryByTestId('add-reminder-back')).toBeNull()`, seguido de que `add-reminder-title` tiene el texto de `addReminder.addReminder` | contradice R10 (`add-reminder-back` existe): se quita la aserción de nulo, el título pasa a `el título vive en el cuerpo (#178 R10) (enmendado por #204 R10)` (ya no retira ningún botón) y la aserción del texto del título se queda. Ancla: `grep -cF "queryByTestId('add-reminder-back')" mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` = 1 hoy y 0 tras R10 | R10 |
| I39 | `screens/docs/index.test.tsx` › `#95 R5: la pantalla no dibuja cabecera propia` › `retira el botón y conserva Documentos de` | `expect(screen.queryByTestId('docs-back')).toBeNull()` | **Enmienda de higiene decidida por el leader; nace verde, no cuenta como rojo de R12.** Tras R12 el id real es `docs-header-back`, así que la aserción de nulo pasa a ser vacía. Se quita esa aserción en el commit rojo de R12 y el título pasa a `conserva Documentos de (enmendado por #204 R12)` (ya no retira ningún botón, igual que I38); la espera de «Documentos de» visible se queda. Ancla: `grep -cF "queryByTestId('docs-back')" mobile-pet-tracker/src/screens/docs/index.test.tsx` = 1 hoy y 0 tras R12 | R12 |

Las filas I32 a I39 salen de la auditoría de inventario previa al handoff
(`progress/inventory-audit_mobile-canvas-routine.md`). I32 a I38 son rojos
**estructurales** (cambia una lista de ficheros o la forma de un árbol, no un
literal suelto): la «Enmienda mecánica permitida» no los cubre y por eso van
nombradas, cada una en el commit rojo de su R. I11 e I39 son las únicas filas
que nacen verdes.

Ningún otro `it` cambia. Los recuentos agregados se re-miden con los comandos
de tasks.md § Cuentas a re-medir.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada, salvo el caso de los recuentos agregados de § Erratas del leader.

## Candados agregados

Revisados uno a uno contra la base. **No se ponen rojos** con #204; si alguno
se pone rojo, es parada (salvo el caso de la enmienda mecánica de arriba y de
§ Erratas del leader). Los que mueven una cifra sin cruzar su suelo llevan su
delta por R en la fila.

| Candado | Por qué no se mueve |
|---|---|
| `i18n/language-provider.test.tsx` › `#194 R1` (longitud del catálogo) | Ninguna clave nueva ni borrada. |
| `ui-copy-table.ts` (`SCREEN_FILES`, `ALL_USES`, `R8_REMINDERS`) y las claves de sin mascotas | Ninguna fila nueva: las tres pantallas siguen leyendo las mismas claves. |
| `#181 R8.2` (recuento de `EmptyState`) | Recordatorios sigue con 2 `EmptyState` (vacío y sin mascotas): R5.2 envuelve, no duplica. |
| `#181 R8.3` y `HEX_LITERAL` de `design-drift` (#193 R11) | Prohíben `#\d+` no seguido de ` R\d` también en comentarios: todo comentario nuevo usa la forma `#204 R<n>`. |
| `consistency-classnames` › `#62 R14` (`CONTINUOUS_CORNER`: reminders `4 + 1`, add-reminder `3 + 1`, docs 1) | No se añade ni se quita ningún `CONTINUOUS_CORNER`. |
| `consistency-classnames` › `TABULAR_NUMS` (reminders 3) | Las cifras de las píldoras no cambian. |
| `consistency-classnames` › `#166 R3` (fila de `reminders-delete-cancel`) | «Cancelar» no cambia (R9). |
| `consistency-classnames` › recuento de `bg-accent-soft` | No se toca. |
| `consistency-classnames` › `#62` «centraliza las diez clases completas y prohíbe interpolarlas» (`filesMatching(/bg-category-\|text-category-/)`) | Las clases de categoría se leen de `CATEGORY_SLOTS` (R7, R8); `border-category-amber` no casa con la expresión. |
| `consistency-classnames` › receta de `reminder-row-skeleton` (`h-20 w-full rounded-card`) | No se toca. |
| `legibility-classnames` › `#61 R5` › `no deja ningún text-warning suelto en las fuentes` | R7 quita un `text-warning-strong`; no añade `text-warning` suelto. |
| `design-drift` › `#178 R13` (iconos `Plus`/`Trash` y `Bell`/`Calendar`/`Clock`) | Los iconos no cambian. |
| `design-drift` › `productionFilesMatching(/\btext-17\b/)` | Reminders ya está en la lista (por «Cancelar»). |
| `design-drift` › `#152 R9` (lista con `screens/home/home-entrance.tsx`) | `home-entrance.tsx` se queda: Inicio lo sigue usando (E2; vale en `9ba176f1`). |
| `chunky-cta` › `#177 R3.3` (inventario de `bg-accent`) | «Guardar» conserva `bg-accent`; el confirm usa `bg-danger`. |
| `chunky-cta` › `#177 R4.3` (inventario neutro) | El confirm lleva `variant="danger"`, no entra. |
| `chunky-cta` › `#177 R5.1` (`reminders-add-link`) | «Nuevo» no cambia: solo pasa a `accessory`. |
| `chunky-cta` › `#177 R7.4` (consumidores de `chunkyLip`) | Reminders ya es consumidor. |
| `chunky-cta` › `#177 R7.5` | No tiene expresión de `danger`. |
| `chunky-cta` › `#177 R8.3` (ancla de `SELECTED_CHIP`) | No se toca (design.md P1). |
| `chunky-cta` › `preservedLines` de la carta | La Enmienda #204 añade líneas; no edita la línea «Sin labio» de la regla 13 (R16). |
| `canvas-foundations` › `#197 R21: D-H sigue intacta` | D-H no se edita (D1). |
| `canvas-foundations` › `#197 R22` (grep-limpio de sus ficheros y dependencias 44/8) | `screen-header.tsx` sigue limpio (R17 lo canda también); ninguna dependencia nueva. |
| `detail-stack` › `#95 R7` (add-reminder sin `useFocusEffect`) | No se añade. |
| `forms-validation-global` (add-reminder: 3) | El formulario no cambia. |
| `layout.test.tsx` › recuentos de hijos de `#105 R8` y `#194 R4` | No se añade ni se quita ninguna ruta. |
| guarda de `heroui-text-size-merge` (`text-13/15/17` en `Button.Label`) | R8 y R9 usan `Text`, no `Button.Label`. |
| `heroui-text-size-merge` › `#187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) (enmendado por #189 R5, R10, R13) (enmendado por #200 R3, R5, R7, R8, R9) (enmendado por #199 R3) (enmendado por #199 R14) (enmendado por #199 R18) (enmendado por #199 R19)` (suelos en `9ba176f1`: 28 ficheros con hero, 197 `heroElements`, `35 - 1 - 1 - 1 + 1` = 33 `cardElements`, 163 `classNameElements`) | Medido en `9ba176f1` (E3) con una réplica del escáner (AST de TypeScript, mismo criterio): 32 ficheros, 223 hero, 33 card, 174 con `className`. R8 quita un `<Button.Label className=…>` y R9 otro, y los dos pasan a `Text` de `react-native`: **R8 −1 hero y −1 `className`; R9 −1 hero y −1 `className`**. Tras #204: 32 / 221 / 33 / 172. Ningún suelo se cruza (márgenes: hero 24, `className` 9, card 0) y ninguna R quita un `<Card` ni un fichero con hero: `cardElements` no se mueve (33, igual a su suelo). No se enmienda; si una feature de la ola lo baja bajo un suelo, aplica § Erratas del leader. |
| `screens/docs/index.test.tsx` › `R8: pantalla Docs` › `uses content-sized skeletons while pet and docs load` | `docs-header-skeleton` sigue visible (ahora dentro de `docs-header`, que lo canda R12). |
| `components/__tests__/rise-in.test.tsx` y `screen-header.test.tsx` existentes | `RiseIn` no cambia; la prop nueva de `ScreenHeader` es opcional y no altera los casos sin ella. |

## Erratas del leader (2026-10-24)

**E1. Casilla de la Enmienda #204 y formato de commits.** La casilla de R16 se escribe ya firmada por delegación, como la de #197: `- [X] Enmienda #204 aprobada por humano` seguida de la línea de firma delegada (mandato del humano del 2026-10-23); el test de R16 ya acepta `[ xX]`. Los commits llevan la forma `test(#204): R<n> …` / `feat(#204): R<n> …` en todos los R, también donde tasks.md escribe `test(#204 R13)` o `test(#204 R14): drop …`. El texto exacto está en el handoff (`progress/handoff_mobile-canvas-routine.md`).

**E2 (cifras tras #200), firmada.** En H0 `aa96dd46` (merge de `origin/dev` 6bbd0485 con #200) cambian las cifras de partida que la spec cita:

- `heroui-text-size-merge.test.ts` › `#187 R1`: universo 32 / 213 / 35 / 165 y suelos 28 / 197 / 35 / 163 (no 41 / 171 y suelo de card 41). Tras #204 queda en 32 / 211 / 35 / 163, con margen 0 en `cardElements` y en `classNameElements`. Sigue sin enmendarse: el suelo es `>=` y no se rompe. Si se pone rojo, PARA.
- `design-drift.test.ts` › `#152 R9`: la razón pasa a «`home-entrance.tsx` se queda: Inicio lo sigue usando». Agenda e Historial importan `RiseIn` desde #200 R15. La conclusión y las dos listas de ese `it` no cambian.
- `chunky-cta-canvas-fidelity.test.ts`: `text-17` parte de 28 (`… + 1 // #200 R5`) y cierra en 29; radios 16 parten de 33 (`26 + 1 + 1 + 1 + 2 + 2`) y cierran en 34. Esto sustituye el 28 y el 32 de tasks.md § Cuentas.
- Los `it` que ya llevan un sufijo ` (enmendado por #200 …)` (I2, I12, I27, I28, I31 e I33) se localizan por su prefijo hasta el primer ` (enmendado por` y el sufijo de #204 va al final del título real.
- I1 (`#197 R20`) ya no existe: no tiene efecto.

**E3 (cifras tras #198 y #199), firmada.** En H0 `9ba176f1` (merge de `origin/dev` 8bd88522 con #198, PR #245, y #199, PR #246) cambian las cifras de partida. Desde E3 cada cifra se escribe como **base medida en H0 + delta de #204**. Si llega otro merge de `dev`, solo hay que re-medir la base con su comando en el handoff, sin errata nueva; el delta de #204 no cambia. Comandos desde `mobile-pet-tracker/`. E3 sustituye las cifras de E2 y las de tasks.md § Cuentas.

- `chunky-cta-canvas-fidelity.test.ts` › `#177 R6.2`, `text-17`: base 29 (`8 + 15 + 1 + 1 + 1 + 1 + 1 + 1`, `// #200 R5; #199 R9`) + 1 (R9) = 30. Ancla de la base: `grep -cF 'toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts` = 1.
- Ídem › `#177 R7.3`, radios 16: base 35 (`26 + 1 + 1 + 1 + 2 + 2 + 1 + 1`, `#200 R9 (+2); #198 R9 (+1); #199 R14 (+1)`) + 1 (R9) = 36. Ancla de la base: `grep -cF '26 + 1 + 1 + 1 + 2 + 2 + 1 + 1)' src/__tests__/chunky-cta-canvas-fidelity.test.ts` = 1.
- `motion.test.ts` › `no exporta nada más`: base 46 (`grep -cE "^      'MOTION_" src/theme/__tests__/motion.test.ts`; #199 R27 añadió 7) + 1 (R3, `MOTION_REMINDERS_STAGGER_MS`) = 47. La lista sigue ordenada y la posición de R3 no cambia: entre `MOTION_POP_SPRING` y `MOTION_RING_DELAY_MS`.
- Carta: base 26 (`grep -c '^## Enmienda' ../docs/ui-guidelines.md`; la última es `## Enmienda #199: …`) + 1 (R16) = 27. La Enmienda #204 va detrás de la última línea de la carta, que en `9ba176f1` es `- **Fundido del toast de Peso (#199).** …`. R16 no fija esa línea por literal: se ancla por contenido.
- `heroui-text-size-merge.test.ts` › `#187 R1`: base 32 / 223 / 33 / 174 (ficheros con hero / hero / card / `className`), medida con la réplica del escáner. Los suelos son 28 / 197 / `35 - 1 - 1 - 1 + 1` (= 33) / 163. Delta de #204: R8 −1 hero y −1 `className`, R9 lo mismo. Tras #204 queda en 32 / 221 / 33 / 172, con márgenes hero 24, card 0 y `className` 9. Sigue sin enmendarse. Si se pone rojo, PARA.
- `profile-canvas-fidelity.test.ts` › I32: la lista `text-26` tiene base 10 ficheros (#198 R15 añadió `'screens/home/index.tsx', // #198 R15`). R4 y R12 quitan 2 y quedan 8. Las anclas de I32 e I33 siguen dando 1 en `9ba176f1`.
- `legibility-classnames.test.ts` › I24: `warningSites` tiene base 2 (`home`, `reminders`; #199 R14 sacó Salud). R7 quita 1 y queda 1.
- Títulos: I2, I12, I24, I27, I28, I31, I32, I33 y `#187 R1` llevan en `9ba176f1` sufijos de #200, #199 o #198; el inventario y § Candados agregados ya los citan al día. Vale la regla de E2: se localizan por su prefijo hasta el primer ` (enmendado por` y el sufijo de #204 va **al final del título real**, detrás del último sufijo que haya (hoy el de #199 o el de #198). I4, I23, I25, I26, I29 e I30 no cambian.
- Guardas de `git diff`: toda guarda contra el H0 viejo `aa96dd46` pasa a `9ba176f1`. #198 y #199 tocaron `catalog.ts`, `ui-copy-table.ts`, `global.css` y `_layout.tsx` (fila `weight-log`), así que contra `aa96dd46` esas guardas ya no salen vacías. En `9ba176f1` sí salen vacías: `git diff --stat 9ba176f1 -- <ficheros de no tocar>` (raíz). `git diff --numstat 9ba176f1 -- mobile-pet-tracker/src/app/_layout.tsx` sale vacío en H0 y `3	3` al cerrar.
- Siguen igual en `9ba176f1`: § Base medida (B01–B54), la razón de `#152 R9` en E2 (Inicio sigue importando `home-entrance`), `design-drift` › `text-17` (reminders sigue en la lista), I1 = 0 y `package.json`/`bun.lock`.
- Ningún requisito de comportamiento cambia. Tampoco cambia ningún fichero de producción ni la lista cerrada.

**E4 (cuenta final de tests), firmada.** La fórmula de `tasks.md` § Cuentas restaba cuatro tests (I2 2, I4 1, I37 1), pero son cinco: I24 (R7) saca `screens/reminders/index.tsx` de `warningSites` en `legibility-classnames.test.ts`, y cada sitio de esa lista es una fila de `it.each`. El implementer lo midió en `9bb99892`: 49 `it` nuevos, iguales a los de la spec por requisito, y 5 bajas. La cifra final de jest es **N + 44**, que con N = 5015 da 5059 tests en 147 suites, no N + 45 = 5060. La fila de § Cuentas de `tasks.md` se corrige con la baja de I24. Ningún requisito, ancla ni fichero de producción cambia.

**Regla de recuentos agregados.** Si al llegar a verde una R se pone rojo un `it` que no está en el inventario y ese `it` solo cuenta usos o ficheros de un literal o token, Codex lo enmienda sin parar. Son de este tipo los inventarios cerrados de radios, de `style={CONTINUOUS_CORNER}`, de `text-NN` o de `<Card`, las sumas de copy y los suelos del escáner HeroUI. La condición es que el delta medido sea exactamente el número de usos que el diff de esa R, tal como esta spec la prescribe, añade o retira. La enmienda:

- da a la cifra o a la entrada su término (`// #204 Rn`, o `; #204 Rn: ±k` dentro de un comentario que ya exista);
- da al título el sufijo ` (enmendado por #204 Rn)`, o añade `Rn` al paréntesis de #204 si ya existe;
- va en el commit rojo de esa R; si ese rojo ya está commiteado, en un commit propio `test(#204): Rn amend the <candado> inventory` antes del siguiente R;
- se apunta en la tabla «Enmiendas mecánicas» del reporte con candado, antes, después y R.

El fichero de test de ese candado entra en la lista cerrada solo para esa enmienda. Sigue siendo PARADA si el delta no coincide, si el `it` afirma comportamiento o estructura y no un recuento, o si la enmienda exigiría cambiar producción.

## Desviaciones conscientes del canvas

| Canvas | Producción tras #204 | Motivo |
|---|---|---|
| Botones de la hoja de 54 px con etiqueta 16/800 | 56 px (`h-14`) con 17/800 en los dos | Receta del punto 13 de la carta; «Cancelar» ya mide así (D5). |
| Badge con `pop 500ms ease-out 400ms` (.6, 1.08, 1) | `PopIn` actual (fundido 250 ms y muelle desde 0.9) | `PopIn` es compartido (D14). |
| Iconos de fila con `stroke-width` propio | Grosor por defecto de los iconos del proyecto | Sin cambio de iconos (`#178 R13` los canda). |
| Hoja con asa y velo dibujados, subida de 350 ms con 600 ms de espera y velo con fundido | Asa, velo y animación nativos del `BottomSheet` de `@expo/ui` | El componente nativo los pinta; no se reproduce la coreografía del prototipo. |
| Previa «Te avisaremos el 5 oct a las 09:00» | `addReminder.notifyPreview` = «Te aviso el {{date}} a las {{time}}.» | Voz B de Pingo (design.md P6). |
| Píldoras en rejilla de tres columnas | Tres `flex-1` en fila | Mismo resultado visual en 390 px; sin cambio. |
| `aria-label` «Eliminar <título>» en el botón de fila | Etiqueta accesible «Eliminar» | Necesitaría clave nueva (Fuera de alcance). |
| Estados de carga, error, vacío, sin mascotas y error de acción | Se conservan bajo la cabecera nueva (R5, R13) | El canvas no los dibuja. |

## Fuera de alcance

- Cabecera de `pets/[petId]/docs-upload`: conserva la nativa (no tiene artboard en esta feature).
- `aria-label` «Eliminar <título>» en las filas: requiere clave i18n nueva; queda como posible feature aparte.
- Cambios en `PopIn`, `HomeEntrance` o `EmptyState` (este último lo extiende #198).
- Cambios en el cuerpo de la hoja de borrado (icono, título, referencia, cuerpo, «Cancelar»).
- Cualquier otra pantalla, incluidas Alertas (la lleva #203) e Inicio.
- Deuda registrada que roce estas pantallas: ninguna medida en `progress/` para Recordatorios, Agregar o Documentos.

## Cierre del humano

R18. Smoke en dev build Android (PC del humano, no Expo Go), con al menos una
mascota, tres recordatorios (uno a menos de 10 días) y dos documentos. No es
gate de implementación: lo cierra la casilla «Smoke de R18» de § Aprobación.

1. Recordatorios desde Perfil: no hay cabecera nativa; volver, «Recordatorios» y «Nuevo» quedan en una fila bajo la barra de estado, sin solaparse con ella (safe area real).
2. Volver regresa a Perfil. Abriendo Recordatorios sin historial (enlace profundo o recarga en la ruta), volver lleva a Perfil.
3. Las filas entran subiendo, escalonadas a ojo unos 70 ms; con «Reducir movimiento» del sistema activado entran sin animación.
4. La fila próxima lleva borde ámbar claro y badge «¡Próximo!» en ámbar con texto legible.
5. «Eliminar» de fila: rosa, 44 px de alto, texto rojo 13/800. Al pulsarlo se abre la hoja; su «Eliminar» rojo lleva labio oscuro de 4 px y mide como «Cancelar».
6. Agregar recordatorio desde «Nuevo»: volver y título de 24 en contenido; «Guardar recordatorio» queda pegado al pie con la pantalla vacía. Al abrir el teclado en Título, el campo y el botón siguen visibles y no queda hueco extra encima del teclado.
7. Volver de Agregar regresa a Recordatorios; sin historial, también.
8. Documentos desde Perfil: volver, «DOCUMENTOS DE» y el nombre; mientras carga, un esqueleto ocupa el nombre. Las filas entran escalonadas unos 60 ms. Con el formulario de subida abierto, el teclado no tapa el campo enfocado.
9. Cuenta sin mascotas: Recordatorios muestra a Pingo centrado y un volver arriba a la izquierda que funciona.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-23)
  Firma delegada en el leader por mandato del humano del 2026-10-23
  (`progress/plan_canvas-parity-2026-10-23.md` §4, checklist de firma pasada). Firmada el 2026-10-24 tras la auditoría de inventario (337b9809, 572e8887).
  Errata E3 (cifras tras #198 y #199) firmada también por delegación el 2026-10-24 sobre `9ba176f1`.
  Errata E4 (cuenta final N + 44, baja de I24) firmada también por delegación el 2026-10-24 sobre `9bb99892`.
- [x] Enmienda #204 de la carta (texto canónico en design.md § Bloque «Enmienda #204») aprobada por humano (fecha: 2026-10-23)
  Firma delegada, mismo mandato.
- [ ] Smoke de R18 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
  Va en el lote `progress/smoke_canvas-parity.md` (plan §6); el `done` no espera al smoke.
