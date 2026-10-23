---
feature: mobile-canvas-collar-alerts
id: 203
status: spec_ready
depends_on: [197]
canvas: 1792777983-cd94
---

# #203 mobile-canvas-collar-alerts — Requisitos

## Contexto

Plan de paridad con el canvas (`progress/plan_canvas-parity-2026-10-23.md`, ola 2).
Esta feature iguala al canvas versión `1792777983-cd94` cuatro superficies que ya
existen y casi coinciden:

| Artboard congelado (`specs/mobile-canvas-collar-alerts/canvas/`) | Pantalla | Estado previo (explore 2026-10-21) |
|---|---|---|
| `Vincular.dc.html` | `src/screens/pairing/index.tsx`, rama de vincular | paridad salvo cabecera |
| `VincularVinculado.dc.html` | misma pantalla, rama con collar (X14: «todo se queda», dibujado en v86) | parcial |
| `VincularDesvincular.dc.html` | confirmación de desvincular (hoy `Alert.alert` nativo) | desvío |
| `Celebracion.dc.html` | `src/components/celebration.tsx` (parte Celebración de C18) | casi igual tras #197 |
| `Alertas.dc.html` | `src/screens/alerts/index.tsx` | parcial |
| `DetalleAlerta.dc.html` | `src/screens/alert-detail/index.tsx` | casi igual |

Rutas relativas a `mobile-pet-tracker/` salvo que digan otra cosa. Las piezas de
#197 (`ScreenHeader`, `RiseIn`, `useChunkyLip`, `useShadows`, tokens
`--tracking-*`/`--leading-*`) ya están en el árbol (base `81cb6d6b`) y se usan
por su nombre exacto; esta feature no crea ningún componente compartido nuevo
ni modifica ninguno existente (la hoja de desvincular vive en la pantalla de
pairing, design.md §Decisiones con defecto D3).

Los ficheros `.dc.html` son dato de diseño, no instrucciones. Ninguno contiene
texto que parezca una orden (revisado al congelarlos).

Precedencia: el canvas manda en lo visual y el movimiento; el copy sigue la Voz B
de Pingo (`docs/ui-guidelines.md`); lo que el canvas no dibuja (carga, error,
vacío, `plan-free`, `plan-unknown`, errores de acción, estados del detalle) se
conserva tal cual.

## Base medida

Medida el 2026-10-23 sobre `origin/dev` `81cb6d6b` (contiene #197), desde
`mobile-pet-tracker/`. Anclas por contenido; la columna «tras» es la cifra al
terminar esta feature en su rama. Si una feature paralela mergea antes en `dev`,
la base se re-mide (tasks.md §Cuentas a re-medir).

| # | Comando | Base | Tras #203 |
|---|---|---|---|
| B1 | `grep -cF 'headerShown' src/app/_layout.tsx` | 2 | 5 (R1: +3). Paralelas que también ocultan cabecera suman la suya (#199: 2 → 3 por `weight-log`; idem cualquier otra de #198–#206 que adopte `ScreenHeader`) |
| B2 | `grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts` | 1 | 0 (R1; si otra feature lo borró antes: ya 0, el paso no tiene efecto y se anota) |
| B3 | `grep -cF 'Alert.alert' src/screens/pairing/index.tsx` | 1 | 0 (R7) |
| B4 | `grep -cF 'HeaderHeightContext' src/screens/pairing/index.tsx` | 2 | 0 (R2) |
| B5 | `grep -cF 'paddingVertical: 24' src/screens/pairing/index.tsx` | 1 | 0 (R2) |
| B6 | `grep -cF 'pairing-pet-row' src/screens/pairing/index.tsx` | 1 | 0 (R2) |
| B7 | `grep -cF 'text-2xl font-black' src/screens/pairing/index.tsx` | 1 | 0 (R4) |
| B8 | `grep -cF 'bg-accent-soft' src/screens/pairing/index.tsx` | 1 | 0 (R5) |
| B9 | `grep -cF 'rounded-16' src/screens/pairing/index.tsx` | 1 | 4 (R6: +1, R7: +2) |
| B10 | `grep -cF 'rounded-22' src/screens/pairing/index.tsx` | 0 | 1 (R4) |
| B11 | `grep -cF "from '@expo/ui/community/bottom-sheet'" src/screens/pairing/index.tsx` | 0 | 1 (R7) |
| B12 | `grep -cF 'chunkyLip.danger' src/screens/pairing/index.tsx` | 0 | 2 (R6, R7) |
| B13 | `grep -cF 'RiseIn' src/screens/pairing/index.tsx` | 0 | ≥ 1 (R3) |
| B14 | `grep -cF 'HomeEntrance' src/screens/alerts/index.tsx` | 3 | 0 (R9) |
| B15 | `grep -cF 'HomeEntrance' src/screens/alert-detail/index.tsx` | 3 | 0 (R11) |
| B16 | `grep -cF 'paddingTop: 24' src/screens/alerts/index.tsx` | 1 | 0 (R8) |
| B17 | `grep -cF 'paddingTop: 24' src/screens/alert-detail/index.tsx` | 1 | 0 (R10) |
| B18 | `grep -cF 'tracking-' src/screens/alerts/index.tsx` | 2 | 1 (R8: el título pasa a `ScreenHeader`) |
| B19 | `grep -cF 'ScreenHeader' src/screens/alerts/index.tsx` | 0 | 2 (import y uso, R8) |
| B20 | `test ! -e src/__tests__/collar-alerts-canvas-fidelity.test.ts && echo ausente` | `ausente` | el fichero existe (R12) |
| B21 | `grep -rlF "@expo/ui/community/bottom-sheet" src --include='*.tsx' \| grep -v test` | `src/screens/reminders/index.tsx` | + `src/screens/pairing/index.tsx` |

`components/celebration.tsx`, `theme/motion.ts`, `i18n/catalog.ts` y
`src/__tests__/ui-copy-table.ts` no cambian (diff vacío al cerrar).

## TestIDs

Nuevos (ninguno lo captura un selector por regex del árbol; revisado con
`grep -rnE "TestId\(/" src`):

| testID | Nodo | R |
|---|---|---|
| `pairing-header`, `pairing-header-back` | `ScreenHeader` de pairing y su volver | R2 |
| `pairing-hero-rise`, `pairing-plan-rise`, `pairing-code-rise` | `RiseIn` de la vista de vincular | R3 |
| `device-title`, `device-title-rise` | título «Dispositivo GPS» y su `RiseIn` | R4 |
| `device-status-rise` | `RiseIn` de `device-status-card` | R4 |
| `device-plan-rise`, `plan-tracked-dot` | `RiseIn` del hueco del plan; punto de la píldora | R5 |
| `device-unpair-spacer` | espaciador antes de `device-unpair` | R6 |
| `pairing-unpair-host`, `pairing-unpair-sheet`, `pairing-unpair-icon`, `pairing-unpair-title`, `pairing-unpair-body`, `pairing-unpair-confirm`, `pairing-unpair-cancel` | hoja de desvincular | R7 |
| `alerts`, `alerts-back` | `ScreenHeader` de Alertas (`alerts-title` lo genera él) | R8 |
| `alert-detail`, `alert-detail-back` | `ScreenHeader` del detalle (`alert-detail-title` lo genera él) | R10 |

Conservados con otro nodo detrás: `alerts-title` y `alert-detail-title` (ahora
de `ScreenHeader`), `${rowId}-entrance`, `alert-detail-card-entrance` y
`alert-detail-map-entrance` (ahora `RiseIn`), `pairing-pet-avatar` (ahora
accesorio de la cabecera).

Retirados: `pairing-pet-row` (R2) y `alerts-title-row` (R8).

## Requisitos

Todo `it` nuevo empieza por `#203 R<n>`. Ficheros de test (relativos a
`mobile-pet-tracker/`): layout = `src/app/__tests__/layout.test.tsx`; pairing =
`src/screens/pairing/index.test.tsx`; alertas = `src/screens/alerts/index.test.tsx`;
detalle = `src/screens/alert-detail/index.test.tsx`; CF203 =
`src/__tests__/collar-alerts-canvas-fidelity.test.ts` (nuevo).

**Doble de `RiseIn`** (pairing, alertas, detalle): `jest.mock` del módulo
`rise-in` con la misma ruta que importa la pantalla. Intención: pinta un `View`
con el `testID` recibido y deja `delayMs` legible como prop de ese `View`
(igual que hoy `mockHomeEntrance` deja `index`). Si la pantalla no pasa
`testID`, el doble no pinta nodo identificable y el test falla: por eso cada
`RiseIn` de esta feature lleva `testID`.

### R1 — Cabeceras nativas fuera

**R1.** THE SYSTEM SHALL declarar en `src/app/_layout.tsx` las rutas `pairing` y
`alerts` con `options={{ headerShown: false }}` y la ruta `alerts/[alertId]` con
`options={{ headerShown: false, contentStyle: { backgroundColor: background } }}`
(conserva su `contentStyle` de hoy).

- Test (layout): `it.each` `'#203 R1: %s oculta la cabecera nativa'` con filas
  `pairing` → `{ headerShown: false }`, `alerts` → `{ headerShown: false }`,
  `alerts/[alertId]` → `{ headerShown: false, contentStyle: { backgroundColor: 'token:background' } }`;
  igualdad exacta (`toEqual`) contra las opciones del `Stack.Screen`, con el
  mismo lector que usan hoy `#194 R4` y `#100 R2`.
- En el mismo commit rojo se borra entero `describe('#197 R20: cimientos sin cablear')`
  de `src/__tests__/canvas-foundations.test.ts`, sin sufijo (esta feature toca
  `_layout.tsx` y monta `ScreenHeader`/`RiseIn`).

### R2 — Cabecera de pairing

**R2.1.** WHILE la pantalla de pairing muestra carga, error, «sin mascotas», la
vista de vincular o la vista con collar, THE SYSTEM SHALL pintar
`<ScreenHeader testID="pairing-header" backFallback="/profile" />` sin `title`
como primer hijo del contenido de `pairing-form`. WHILE se muestra la celebración
(`ready-*`), THE SYSTEM SHALL NOT pintar `pairing-header` (el artboard
`Celebracion` no dibuja cabecera).

- Test (pairing): `it.each` `'#203 R2.1: pinta la cabecera en %s'` con una fila
  por estado (`carga`, `error`, `sin mascotas`, `vincular`, `con collar`):
  `pairing-header` existe, es el hijo 0 del contenedor de contenido de
  `pairing-form` y `pairing-header-back` existe; y `it`
  `'#203 R2.1: la celebración no pinta la cabecera'`.

**R2.2.** WHILE se muestra la vista de vincular, THE SYSTEM SHALL pasar el avatar
`pairing-pet-avatar` (#188 R17) como `accessory` de `pairing-header`, sin la fila
`pairing-pet-row`.

- Test (pairing): `'#203 R2.2: el avatar de la mascota es el accesorio de la cabecera'`:
  `within(getByTestId('pairing-header')).getByTestId('pairing-pet-avatar')` existe
  y `queryByTestId('pairing-pet-row')` es `null`.

**R2.3.** WHILE se muestra la vista con collar, THE SYSTEM SHALL pintar
`pairing-header` sin accesorio y dejar el `PetSwitcher` donde está hoy (D1).

- Test (pairing): `'#203 R2.3: con collar la cabecera no lleva accesorio'`:
  `pairing-header` tiene exactamente 2 hijos (el envoltorio del volver y el
  `flex-1`) y `pairing-pet-avatar` no está dentro.

**R2.4.** THE SYSTEM SHALL dar al `contentContainerStyle` de `pairing-form`, en
todos los estados, exactamente
`{ paddingHorizontal: 20, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24, gap: 16, flexGrow: 1 }`
(D6), y al `KeyboardAvoidingView` `keyboardVerticalOffset={0}`, sin importar
`HeaderHeightContext`.

- Test (pairing): `it.each` `'#203 R2.4: métricas uniformes sin cabecera nativa en %s'`
  (mismas filas que R2.1) con insets de test `top: 40, bottom: 24` → estilo
  `{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 48, gap: 16, flexGrow: 1 }`;
  y `'#203 R2.4: con teclado de 200 el host añade paddingBottom 200'`, sin
  `HeaderHeightContext.Provider` en el envoltorio.

### R3 — Entrada de la vista de vincular

**R3.** WHILE se muestra la vista de vincular, THE SYSTEM SHALL envolver: el
grupo `pairing-hero-group` en `<RiseIn delayMs={0} testID="pairing-hero-rise">`;
el aviso de plan (el `View` `rounded-tile bg-default` con `pairing-plan-icon`) en
`<RiseIn delayMs={80} testID="pairing-plan-rise">`; y el bloque del código
(etiqueta `pairing-activation-code-label`, campo y `pairing-code-hint`) en
`<RiseIn delayMs={140} testID="pairing-code-rise">`. Canvas `Vincular`:
`rise 400ms ease-out both`, `…80ms both`, `…140ms both`.

- Test (pairing): `it.each` `'#203 R3: %s entra con RiseIn %i'` con filas
  `['pairing-hero-group', 0, 'pairing-hero-rise']`,
  `['pairing-plan-icon', 80, 'pairing-plan-rise']`,
  `['pairing-activation-code-label', 140, 'pairing-code-rise']`: el nodo está
  dentro del `RiseIn` de su fila y `delayMs` es el de la fila.

### R4 — Título y tarjeta de la vista con collar

**R4.1.** WHILE se muestra la vista con collar, THE SYSTEM SHALL pintar el título
`<Text testID="device-title" className="mt-2 text-28 font-black tracking-title text-foreground">`
con `t('pairing.gpsDevice')` («Dispositivo GPS»), dentro de
`<RiseIn delayMs={0} testID="device-title-rise">`.

**R4.2.** THE SYSTEM SHALL pintar `device-status-card` como
`<Card testID="device-status-card" className="rounded-22 px-4 py-4.5 shadow-none" style={shadows.card}>`
(`shadows = useShadows()`) dentro de `<RiseIn delayMs={80} testID="device-status-rise">`.
Canvas `VincularVinculado`: `font-size: 28px`, `border-radius: 22px`,
`box-shadow: var(--shadow)`.

**R4.3.** THE SYSTEM SHALL pintar cada `DeviceRow` con raíz
`className="flex-row items-baseline justify-between gap-3"`, etiqueta
`className="text-sm text-muted"` y valor
`className="shrink text-right text-15 font-extrabold <tono>"`; `device-esn`
añade `font-mono tracking-mono`. `<tono>` (D5):
- `device-battery`: `text-accent-strong` cuando `batteryPct !== null`; si no, `text-foreground`.
- `device-connectivity`: `text-accent-strong` cuando `connectivity === 'online'`; si no, `text-foreground`.
- `device-model`, `device-last-message`, `device-esn`: siempre `text-foreground`.

- Tests (pairing): `'#203 R4.1: el título de la vista con collar es 28/900 y entra en 0'`;
  `'#203 R4.2: la tarjeta de estado lleva radio 22, sombra card y entra en 80'`
  (className exacto y `style` que contiene `shadows.card` del módulo de
  producción); `it.each` `'#203 R4.3: %s pinta su valor en %s'` con una fila por
  rama: batería con número → `text-accent-strong`; batería `null` →
  `text-foreground`; conexión `online` → `text-accent-strong`; conexión
  `offline` → `text-foreground`; conexión desconocida → `text-foreground`;
  modelo → `text-foreground`; ESN → `font-mono tracking-mono text-foreground`.

### R5 — Píldora de rastreo

**R5.** WHILE `tracking.data` es `{ kind: 'ok', tracked: true }`, THE SYSTEM SHALL
pintar `plan-tracked` como
`<View testID="plan-tracked" className="h-9 flex-row items-center gap-2 self-start rounded-full bg-tab-pill px-3.5">`
con un punto `<View testID="plan-tracked-dot" className="size-2 rounded-full bg-accent" />`
y `<Text className="text-sm font-bold text-accent-strong">` con
`t('pairing.gpsTrackingActive')` («Rastreo GPS activo»). THE SYSTEM SHALL envolver
el hueco del plan (`plan-skeleton`, `plan-tracked`, `plan-free`, `plan-unknown`)
en `<RiseIn delayMs={140} testID="device-plan-rise">`; `plan-skeleton`,
`plan-free` y `plan-unknown` no cambian. Canvas: `height: 36px`,
`background: var(--pill)`, punto 8 px `var(--accent)`, `rise 400ms ease-out 140ms both`.

- Tests (pairing): `'#203 R5: la píldora de rastreo es 36 con punto y verde fuerte'`;
  `it.each` `'#203 R5: %s entra con RiseIn 140'` con filas `plan-skeleton`,
  `plan-tracked`, `plan-free`, `plan-unknown`.

### R6 — Botón de desvincular

**R6.** WHILE se muestra la vista con collar, THE SYSTEM SHALL pintar
`<View testID="device-unpair-spacer" className="flex-1" />` justo antes de
`device-unpair`, y `device-unpair` como
`<Button testID="device-unpair" className="h-13.5 w-full rounded-16 bg-danger" style={chunkyLip.danger} isDisabled={releasing} onPress={openUnpair}>`
con `<Button.Label className="text-base font-extrabold text-accent-foreground">`
y `t('pairing.unpairCollar')` (literal de hoy, sin cambio). WHEN se pulsa,
THE SYSTEM SHALL abrir la hoja de R7. Canvas: `height: 54px`,
`border-radius: 16px`, `box-shadow: 0 4px 0 #9F1F15`, `margin-top: auto`.

- Test (pairing): `'#203 R6: desvincular es 54, radio 16, labio rojo y va al fondo'`:
  className exacto, `style` igual a `chunkyLip.danger` del hook de producción y
  el hermano anterior es `device-unpair-spacer`.
- Si el literal del botón no es `t('pairing.unpairCollar')` en el árbol, se
  conserva la clave que use hoy `device-unpair` (no se toca copy).

### R7 — Hoja de desvincular

**R7.1.** THE SYSTEM SHALL montar, como último hijo del `KeyboardAvoidingView`,
`<View testID="pairing-unpair-host">` con
`<BottomSheet index={unpairOpen ? 0 : -1} enablePanDownToClose onClose={closeUnpair} snapPoints={['50%', '100%']}>`
› `<BottomSheetView>` ›
`<View testID="pairing-unpair-sheet" className="items-center gap-3 bg-surface px-5 pb-9 pt-3">`,
importados de `@expo/ui/community/bottom-sheet`. Por defecto la hoja está cerrada
(`pairing-unpair-sheet` ausente con el doble de test, igual que Recordatorios).

**R7.2.** WHEN se pulsa `device-unpair`, THE SYSTEM SHALL abrir la hoja con, en
orden: disco `<View testID="pairing-unpair-icon" className="size-14 items-center justify-center rounded-full">`
con fondo `CATEGORY_SLOTS.rose.surface` e icono `LinkBroken` `size={26}`
`strokeWidth={2.2}` color `danger`; título
`<Text testID="pairing-unpair-title" className="text-center text-xl font-black text-foreground">`
`t('pairing.unpairAlertTitle')` («¿Desvincular collar?»); cuerpo
`<Text testID="pairing-unpair-body" className="max-w-80 text-center text-sm leading-note text-muted">`
`t('pairing.unpairAlertBody')` («El historial de ubicaciones se conserva, pero el
rastreo en vivo se detiene hasta que vincules otro collar.»); confirmar
`<Button testID="pairing-unpair-confirm" className="w-full h-13.5 rounded-16 bg-danger" style={chunkyLip.danger} isDisabled={releasing} onPress={confirmUnpair}>`
con `<Text className="text-base font-extrabold text-danger-foreground">`
`t('pairing.unpair')` («Desvincular»); cancelar
`<Button testID="pairing-unpair-cancel" variant="outline" className="w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={closeUnpair}>`
con `<Text className="text-base font-extrabold text-foreground">`
`t('pairing.cancel')` («Cancelar»). THE SYSTEM SHALL NOT llamar a `Alert.alert`.
Las cuatro claves ya existen (cero claves nuevas).

**R7.3.** WHEN se pulsa `pairing-unpair-cancel` o la hoja se cierra con el
gesto (`onClose`), THE SYSTEM SHALL cerrar la hoja sin llamar a la liberación.

**R7.4.** WHEN se pulsa `pairing-unpair-confirm` y la liberación devuelve `ok` o
`not-assigned`, THE SYSTEM SHALL cerrar la hoja, refrescar las mascotas y volver
al formulario de vincular (lo mismo que hoy hace tras el `Alert.alert`).

**R7.5.** WHEN la liberación devuelve `forbidden`, `unreachable`, `error` o
`missing-config`, THE SYSTEM SHALL cerrar la hoja y pintar el error de acción de
hoy: «Solo el dueño puede desvincular el collar.», «No se pudo conectar con el
servidor», «Algo salió mal», «Algo salió mal».

**R7.6.** WHEN la liberación devuelve `unauthorized`, THE SYSTEM SHALL cerrar la
sesión sin error local (#72 R2).

**R7.7.** WHILE la liberación está en vuelo, THE SYSTEM SHALL deshabilitar
`device-unpair` y `pairing-unpair-confirm`.

**R7.8.** WHILE el idioma es inglés, THE SYSTEM SHALL pintar «Unpair collar?»,
«Location history stays, but live tracking stops until you pair a collar again.»,
«Unpair» y «Cancel».

- Tests (pairing), uno por rama:
  - `'#203 R7.1: la hoja de desvincular está cerrada por defecto'`
  - `'#203 R7.2: desvincular abre la hoja con su anatomía y sin diálogo nativo'` (orden de hijos, className exactos, `style` de los dos botones contra `chunkyLip` de producción, textos es, `Alert.alert` no llamado)
  - `'#203 R7.3: Cancelar cierra sin liberar'` y `'#203 R7.3: cerrar con el gesto no libera'`
  - `it.each` `'#203 R7.4: confirma, refresca y vuelve al formulario tras $kind'` (`ok`, `not-assigned`)
  - `it.each` `'#203 R7.5: muestra el error exacto para $kind'` (cuatro filas con su literal)
  - `'#203 R7.6: unauthorized cierra sesión sin error local'`
  - `'#203 R7.7: desvincular y confirmar quedan deshabilitados en vuelo'`
  - `'#203 R7.8: la hoja en inglés'`

### R8 — Cabecera de Alertas

**R8.** THE SYSTEM SHALL pintar como hijo 0 de `alerts-header`
`<ScreenHeader testID="alerts" backFallback="/" title={t('alerts.title')} accessory={…}>`,
donde `accessory` es la insignia «N nuevas» de #170 R4 (mismo nodo, testID y
anatomía; con su `PopIn`) cuando hay nuevas, y nada cuando son 0. El título
(`alerts-title`) sale de `ScreenHeader`. Se retira `alerts-title-row` (D10). El
`contentContainerStyle` de la lista pasa de `paddingTop: 24` a
`paddingTop: insets.top + 8`; el resto de métricas no cambia.

- Tests (alertas): `it.each` `'#203 R8: pinta la cabecera en %s'` (mismas filas
  que `#174 R3`): `alerts` es hijo 0 de `alerts-header` y `alerts-back` existe;
  `'#203 R8: la insignia de nuevas es el accesorio de la cabecera'`: la insignia
  es el último hijo de `alerts`; `'#203 R8: sin nuevas la cabecera no lleva accesorio'`;
  `'#203 R8: paddingTop es insets.top + 8'` (48 con el inset de test).

### R9 — Entrada escalonada de Alertas

**R9.** THE SYSTEM SHALL exportar desde `src/screens/alerts/index.tsx`
`export const ALERT_ROW_RISE_DELAYS = [0, 70, 140, 200, 260] as const;` y envolver
la fila de índice `i < 5` en
`<RiseIn delayMs={ALERT_ROW_RISE_DELAYS[i]} testID={`${rowId}-entrance`}>`; la
fila 6.ª y siguientes no llevan envoltorio. `HomeEntrance` deja de importarse.
Canvas `Alertas`: `rise 400ms ease-out 0ms` … `260ms`.

- Test (alertas): `'#203 R9: envuelve e0 a e4 con RiseIn y su retardo y deja e5 sin envoltorio'`
  (`delayMs` de cada fila = `ALERT_ROW_RISE_DELAYS[i]` importado de producción;
  `e5-entrance` ausente).

### R10 — Cabecera del detalle

**R10.** THE SYSTEM SHALL pintar
`<ScreenHeader testID="alert-detail" backFallback="/alerts" title={t('alerts.detailTitle')} />`
como hijo 0 del contenido del scroll, en el lugar donde hoy está
`alert-detail-title`, en cada estado que hoy lo pinta; y pasar
`paddingTop: 24` a `paddingTop: insets.top + 8`.

- Tests (detalle): `it.each` `'#203 R10: pinta la cabecera en %s'` (mismas filas
  que `#180 R1.2`): `alert-detail` es hijo 0 del contenido,
  `alert-detail-title` está dentro y `alert-detail-back` existe;
  `'#203 R10: paddingTop es insets.top + 8'`.

### R11 — Entrada del detalle

**R11.** THE SYSTEM SHALL envolver la tarjeta del detalle en
`<RiseIn delayMs={0} testID="alert-detail-card-entrance">` y el mapa en
`<RiseIn delayMs={80} testID="alert-detail-map-entrance">`; `HomeEntrance` deja
de importarse. Canvas `DetalleAlerta`: `rise 400ms ease-out both`, `…80ms both`.

- Test (detalle): `'#203 R11: la tarjeta entra en 0 y el mapa en 80 con RiseIn'`.

### R12 — Fidelidad contra los artboards congelados

**R12.** THE SYSTEM SHALL tener `src/__tests__/collar-alerts-canvas-fidelity.test.ts`
que lee cada artboard con
`readFileSync(join(process.cwd(), '..', 'specs/mobile-canvas-collar-alerts/canvas/<Artboard>.dc.html'), 'utf8')`
y la fuente de producción con `readFileSync`, y comprueba en cada fila el
literal del canvas **y** el valor de producción. `it.each`
`'#203 R12: %s'` con filas:

| Fila | Canvas (`toContain`) | Producción |
|---|---|---|
| título 28 | `VincularVinculado`: `font-size: 28px` | pairing contiene `text-28 font-black tracking-title` |
| radio 22 | `VincularVinculado`: `border-radius: 22px` | pairing contiene `rounded-22` |
| píldora | `VincularVinculado`: `height: 36px` y `var(--pill)` | pairing contiene `h-9` y `bg-tab-pill` |
| labio rojo | `VincularVinculado` y `VincularDesvincular`: `0 4px 0 ` + valor de `--color-lip-danger` leído de `src/global.css` | pairing contiene `style={chunkyLip.danger}` 2 veces |
| copy de la hoja | `VincularDesvincular`: `es.pairing.unpairAlertTitle` y el inicio de `es.pairing.unpairAlertBody` (importados del catálogo) | — (el símbolo es de producción) |
| retardos de Alertas | `Alertas`: `rise 400ms ease-out ${d}ms` por cada `d` | `ALERT_ROW_RISE_DELAYS` importado, longitud 5 |
| retardo del detalle | `DetalleAlerta`: `rise 400ms ease-out 80ms both` | alert-detail contiene `delayMs={80}` |
| retardos de Vincular | `Vincular`: `80ms both` y `140ms both` | pairing contiene `delayMs={80}` y `delayMs={140}` |
| margen superior | `VincularVinculado`, `Alertas`, `DetalleAlerta`: `padding: 56px 20px` | pairing, alerts y alert-detail contienen `insets.top + 8` |
| Celebración título | `Celebracion`: `font-size: 30px` | `components/celebration.tsx` contiene `text-3xl font-black tracking-title` |
| Celebración cuerpo | `Celebracion`: `max-width: 300px` | `components/celebration.tsx` contiene `max-w-75` |

El fichero no escribe ningún literal hexadecimal (la guarda HEX_LITERAL): el
color del labio se lee del token. Nace después de R1–R11 y por tanto verde; las
filas de Celebración nacen verdes por diseño (D7). Su rojo se demuestra con una
mutación plantada y revertida por fila de producción (p. ej. `rounded-22` →
`rounded-20`), apuntada en el informe.

## Candados que esta feature revierte

Inventario cerrado. Cada `it` se enmienda en el commit rojo del R indicado,
añadiendo `(enmendado por #203 R<n>)` al título, salvo los que se borran o
sustituyen. Títulos copiados literalmente.

| # | Fichero › describe › it | R | Cambio |
|---|---|---|---|
| F1 | `src/__tests__/canvas-foundations.test.ts` › `describe('#197 R20: cimientos sin cablear')` (its `'#197 R20: nadie monta todavía los cimientos %s'` y `'#197 R20: el layout raíz no cambia'`) | R1 | se borra el `describe` entero, sin sufijo |
| F2 | `src/app/__tests__/layout.test.tsx` › `describe('#95 R4: cada pantalla de detalle declara su cabecera nativa')` › `'#194 R4: %s usa exactamente las opciones de cabecera acordadas'` | R1 | se quita la fila `['pairing', ''],` (otras paralelas quitan las suyas: al mergear, conservar solo las filas que nadie quitó) |
| F3 | `src/app/__tests__/layout.test.tsx` › `describe('#114 R4: reminders y alerts declaran su cabecera nativa')` › `'%s usa exactamente las opciones de cabecera acordadas'` | R1 | se quita la fila `['alerts', ''], // #174 R3` |
| F4 | `src/app/__tests__/layout.test.tsx` › `describe('#100 R2: la guarda de RootStack declara el detalle de alerta tras alerts')` › `'le da la cabecera nativa de #95 R4 con título vacío (enmendado por #180 R1)'` | R1 | opciones esperadas `{ headerShown: false, contentStyle: { backgroundColor: 'token:background' } }` |
| F5 | `src/screens/pairing/index.test.tsx` › `describe('R4: /pairing monta en el Stack raíz con selector de mascota y estados de carga')` › `'renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)'` | R2 | `paddingVertical: 24` → `paddingTop: 48, paddingBottom: 48`, `flexGrow: 1` |
| F6 | `src/screens/pairing/index.test.tsx` › `describe('#95 R5: la pantalla no dibuja cabecera propia')` › `'retira el botón de volver del cuerpo'` | R2 | se borra (contradice R2.1) |
| F7 | `src/screens/pairing/index.test.tsx` › `describe('#148 R6: pairing se aparta del teclado en Android')` › `'el host screen-pairing añade paddingBottom 291 al abrir el teclado'` | R2 | 291 → 200; el envoltorio deja `HeaderHeightContext.Provider` |
| F8 | `src/screens/pairing/index.test.tsx` › `describe('#188 R1-R14: pairing canvas fidelity')` › `'#188 R17: shows only the selected pet avatar above the hero'` | R2 | el padre del avatar es el envoltorio de accesorio de `pairing-header`, no `pairing-pet-row` |
| F9 | `src/screens/pairing/index.test.tsx` › `describe('#188 R1-R14: pairing canvas fidelity')` › `'#188 R10: uses 20 px horizontal padding when %s'` | R2 | estilo esperado `{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 48, gap: 16, flexGrow: 1 }` |
| F10 | `src/screens/pairing/index.test.tsx` › `describe('R9: desvincular pide confirmación nativa, libera el collar y vuelve al formulario')` entero: `'opens the exact native confirmation and Cancel does not release'`, `'refreshes pets and returns to the form after $kind'`, `'shows the exact error for $kind'`, `'signs out for unauthorized without showing a local error (#72 R2)'`, `'disables unpair while the release request is in flight'`, con sus ayudantes `getAlertButton`/`openUnpairAlert` y el `jest.spyOn(Alert, 'alert')` | R7 | se sustituye por los `it` de `#203 R7` (se borra el `describe`) |
| F11 | `src/screens/alerts/index.test.tsx` › `describe('#174 R3: el título vive en el contenido')` › `'pinta el título en %s'` | R8 | className sin `flex-1`; su padre es el `flex-1` de `ScreenHeader`, el abuelo `alerts`, y este hijo de `alerts-header` |
| F12 | `src/screens/alerts/index.test.tsx` › `describe('#170 R4: cuenta las alertas nuevas')` › `'no pinta el contador con 0 nuevas: %s'` | R8 | cuenta hijos de `alerts`, no de `alerts-title-row` |
| F13 | `src/screens/alerts/index.test.tsx` › `describe('#170 R4: cuenta las alertas nuevas')` › `'pinta el contador junto al título con su anatomía (enmendado por #174 R4)'` | R8 | la fila es `alerts`; la insignia es su último hijo |
| F14 | `src/screens/alerts/index.test.tsx` › `describe('#78 R4: la pantalla pinta su esqueleto, su error, su vacío y sus filas')` › `'respeta las dimensiones bajo cabecera nativa, el inset automático y los safe areas (#114 R6, enmendado por #174 R5)'` | R8 | `paddingTop` 24 → 48 |
| F15 | `src/screens/alerts/index.test.tsx` › `describe('#174 R10: entrada escalonada de las cinco primeras filas')` › `'envuelve e0 a e4 con su índice y deja e5 sin envoltorio'` | R9 | se sustituye por `#203 R9`; desaparece el doble `mockHomeEntrance` |
| F16 | `src/__tests__/alerts-canvas-fidelity.test.ts` › `describe('#174 R12: grep-limpio')` › `'cada tracking-* va con su text-*'` | R8 | `toHaveLength(2)` → `toHaveLength(1)` (queda el de `text-13`) |
| F17 | `src/screens/alert-detail/index.test.tsx` › `describe('#100 R3: el detalle pinta la alerta de la caché (enmendado por #180 R3, E2)')` › `'respeta las métricas A11 bajo cabecera nativa (enmendado por #180 R2, E2)'` | R10 | `paddingTop` 24 → 48 |
| F18 | `src/screens/alert-detail/index.test.tsx` › `describe('#180 R1: título en el contenido')` › `'#180 R1.2: título en %s'` | R10 | el hijo 0 del contenido es `alert-detail`; el título está dentro |
| F19 | `src/screens/alert-detail/index.test.tsx` › `describe('#180 R2: marco y orden')` › `'#180 R2.1: inset inferior %i conserva la holgura de 40'` | R10 | `paddingTop` 48 |
| F20 | `src/screens/alert-detail/index.test.tsx` › `describe('#180 R2: marco y orden')` › `'#180 R2.3: ordena título, héroe, mapa, CTA, espaciador, error y ack: $scenario / error $error'` | R10 | primer id `'alert-detail-title'` → `'alert-detail'` |
| F21 | `src/screens/alert-detail/index.test.tsx` › `'#180 R9.1: el héroe y el mapa entran con HomeEntrance 0 y 1'` | R11 | se sustituye por `#203 R11`; desaparece el doble de `HomeEntrance` |
| F22 | `src/__tests__/design-drift.test.ts` › `describe('R11 (mobile-device-pairing): pairing usa el Card compartido y las dimensiones uniformes')` › `'keeps the uniform screen metric %s'` | R2 | fila `'paddingVertical: 24'` → `'insets.top + 8'` |
| F23 | `src/__tests__/design-drift.test.ts` › `'reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)'` | R4, R6, R7 | `rounded16['screens/pairing/index.tsx']` 1 → 2 (R6) → 4 (R7); `outsideReminders(/\brounded-22\b/)` `[]` → `['screens/pairing/index.tsx']` (R4) |
| F24 | `src/__tests__/consistency-classnames.test.ts` › `describe('#98 R10: los candados que esta feature no mueve')` › `'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)'` | R5 | cuenta de `bg-accent-soft` de pairing −1 |
| F25 | `src/__tests__/consistency-classnames.test.ts` › `'conserva los usos de bg-accent-soft que sí son acento'` | R5 | −1 (sale `plan-tracked`) |
| F26 | `src/__tests__/consistency-classnames.test.ts` › `'inventaría los cinco secundarios neutros de toda la app (enmendado por #177 R10) (enmendado por #189 R13) (enmendado por #197 R10)'` | R7 | añade `'pairing-unpair-cancel'` (orden de `.sort()`, tras `'meal-time-edit-${index}'`); `border-lip-gray` +1 |
| F27 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` › `'#177 R7.3: inventario de los veintisiete radios de dieciséis (enmendado por #191 R11) (enmendado por #189 R7) (enmendado por #189 R13)'` | R6, R7 | `'screens/pairing/index.tsx': 1` → 2 (R6) → 4 (R7); total +3 |
| F28 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` › `'#177 R8.4: destructivos, tonales y reintentos no reciben labio (enmendado por #189 R13)'` | R6 | sale `'device-unpair'` de `excluded` |
| F29 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` › `'#177 R4.3: conserva los nueve secundarios neutros (enmendado por #189 R13)'` y constante `NEUTRAL_ROWS` | R7 | `neutralInventory` añade `'pairing-unpair-cancel'`; `NEUTRAL_ROWS` gana `['screens/pairing/index.tsx', literalId('pairing-unpair-cancel'), 'w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface', 'outline', 'Text', 'text-base font-extrabold text-foreground', ['onPress={closeUnpair}']]` (los `it` R4.1/R4.2/R7.5/R8.1 que la recorren la siguen solos) |
| F30 | `src/__tests__/chunky-cta-canvas-fidelity.test.ts` › `'#177 R3.3: el inventario de Button con bg-accent está cerrado'` | R5 | **condicional**: solo si `idsWhere` recoge etiquetas que no son `Button` y por eso capta `plan-tracked-dot`; entonces añade `'plan-tracked-dot'` a lo esperado. Si sigue verde, no se toca |

**Regla de parada**: si se pone rojo un `it` que no está en esta tabla, el
implementador para y lo reporta.

**Enmienda mecánica permitida**: si un `it` no inventariado se pone rojo solo porque compara contra el literal exacto que el R-id quita o sustituye (directo o vía constante/helper del test), el implementador lo enmienda en el commit rojo de ese R con el sufijo y lo apunta en la tabla «Enmiendas mecánicas» de su informe. Cualquier otro rojo no inventariado sigue siendo motivo de parada.

## Candados agregados

Revisados uno a uno contra la base `81cb6d6b`:

| Candado | ¿Se mueve? | Por qué |
|---|---|---|
| #194 R1 (longitud del catálogo) | no | cero claves nuevas |
| `ui-language` `R3_HOME`, `SCREEN_FILES`, `ALL_USES` (`src/__tests__/ui-copy-table.ts`) | no | cada clave conserva su número de usos por fichero: las cuatro de la hoja pasan de `Alert.alert` a la hoja en el mismo fichero; `alerts.title` y `alerts.detailTitle` siguen una vez en el suyo |
| #177 R7.3 (radios 16) | sí | F27 |
| #178 R13 | no | no toca cabeceras de pestaña ni tiles |
| #62 R14 / `CONTINUOUS_CORNER` por fichero | no | ningún `style={CONTINUOUS_CORNER}` directo nuevo; `Card` lo pone dentro |
| #98 R10 | sí | F24–F26 |
| #166 R2 (inventario de primarios) | no | ningún `Button` nuevo con `bg-accent` (el punto de R5 es `View`; ver F30) |
| legibilidad (`legibility-classnames`) | no | ninguna clase vetada; ningún `text-xs` nuevo |
| LY (#105 R8 / #194 R4, hijos del `Stack`) | no | no se añaden ni quitan rutas, solo opciones |
| inventario MT de `theme/motion.ts` | no | `motion.ts` no cambia (#199 +7 y #200 +2 son suyos) |
| `tab-headers-canvas`, `hero-header-amendments` | no | no mencionan pairing ni alertas |
| `design-drift` cuenta de `signOut` en pairing (2) | no | la rama `unauthorized` se conserva |
| #180 R3.7 (vetos de alert-detail y `bg-default` = 1) | no | ninguna clase nueva en alert-detail salvo `ScreenHeader` |
| selectores por regex (`getAllByTestId(/…/)`) | no | ningún testID nuevo casa con `^pairing-content-skeleton-`, `^pet-chip-` ni `^pairing-(ring-0|ring-1|pingo)$` |

Guardas de la carta para todo className nuevo: sin `[…]`, sin
`StyleSheet.create`, sin literal hexadecimal (ni en comentarios; `#203 R<n>` es
la única forma `#NNN` admitida), y los tamaños 13/15/17 nunca en `Button.Label`
de HeroUI (`twMerge` los expulsa): el 15 de R4.3 va en `Text` de `react-native`.

## Enmienda #203 a la carta (R6 y R7)

El implementador añade este bloque literal al final de `docs/ui-guidelines.md`
en el commit verde de R6; su casilla está en §Aprobación:

> **Enmienda #203 — Labio rojo en los destructivos del canvas.** Los botones
> destructivos que el canvas dibuja con labio (`device-unpair` y
> `pairing-unpair-confirm`) llevan `style={chunkyLip.danger}` (`0 4px 0`
> `--color-lip-danger`). El resto de destructivos `bg-danger` sigue en «Sin
> labio» (§13) mientras su artboard no dibuje labio.

## Desviaciones del canvas

1. Mapa del detalle: ruta, círculo discontinuo y punto del SVG estático no se dibujan (D8).
2. Celebración: interlineado del cuerpo 22 frente a 22.5 (D7).
3. Hoja de desvincular: asa y velo los pinta `BottomSheet` (no el asa 40×5 `--lip-gray` ni el velo `rgba(13,17,23,0.4)` del artboard); la altura la fijan `snapPoints`.
4. iOS: `contentInsetAdjustmentBehavior` de alertas y detalle no se toca; el objetivo de paridad es Android.
5. Vista con collar: el `PetSwitcher` se queda (D1); el artboard no dibuja multi-mascota.

## Fuera de alcance

- #165 (reintento y guarda de salida del ack): sigue `pending` (D9).
- `components/empty-state.tsx` (lo amplía #198), `components/celebration.tsx` (D7), `theme/motion.ts`, `i18n/catalog.ts`: sin cambios.
- `PetSwitcher` (#196 le añade `trailing?`): no se toca.
- Recordatorios y su hoja de borrar: no se tocan (D3).
- Claves de copy nuevas: ninguna.

## Cierre del humano

Smoke en dev build Android (no Expo Go), tras el verde del reviewer. No es gate
de implementación.

1. Pairing, Alertas y Detalle: la cabecera queda a la altura del artboard bajo la barra de estado; el volver (y el gesto atrás) regresan a la pantalla previa o a Perfil / Inicio / Alertas sin historial (R2, R8, R10).
2. Vincular: hero, aviso de plan y código suben escalonados (R3).
3. Vista con collar: título 28, tarjeta con radio 22 y sombra suave, valores verdes en batería y conexión en línea, píldora con punto, botón rojo con labio pegado al fondo sin recortar (R4–R6).
4. Hoja: abre a media pantalla con todo visible; Cancelar y deslizar cierran sin desvincular; Desvincular libera y vuelve al formulario (R7).
5. Alertas: las cinco primeras filas suben escalonadas; la insignia de nuevas sale junto al título (R8, R9).
6. Detalle: tarjeta y mapa suben con 80 ms de diferencia (R11).
7. Celebración: igual que antes (D7).
8. Con «reducir movimiento» activado, nada sube (R3, R9, R11).

## Aprobación

- [ ] Aprobado por humano (fecha: ____)
- [ ] Enmienda #203 a la carta (`docs/ui-guidelines.md`) aprobada por humano (fecha: ____)
- [ ] Smoke de R2, R3, R4, R5, R6, R7, R8, R9, R10, R11 hecho y aprobado por el humano en dev build Android (cierre, no gate de implementación)
