---
feature: "mobile-chunky-cta-canvas-fidelity"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos: receta global de botones del canvas (#177)

> Pedido (decisión del humano): que todo botón con cuerpo de la app pinte la
> receta del canvas aprobado: 56 px de alto, radio 16, etiqueta 17 px / peso 800
> y un labio en `--lip` que ya no es un borde inferior. Revierte la receta de
> #166 (`rounded-xl bg-accent border-b-4 border-black/25`). Desbloquea #188,
> #189 y #191: esas features heredan la receta y no la redefinen.
>
> Ver [[design]] para las decisiones y alternativas, [[tasks]] para la cadena de
> commits con sus rojos esperados y [[traceability]] para la trazabilidad.
>
> Esta spec la lee Codex CLI sin acceso a la conversación: rutas, símbolos,
> clases, `it` y cifras son literales. Los nombres de skills de Codex NO son los
> nuestros (deuda B5); esta spec no nombra ninguna y el leader traduce los
> nombres en el handoff.

## Base medida

Medido sobre `d799d714` (HEAD de `origin/main` al escribir esta spec; ya incluye
#187, #180, #181, #172, #173, #178, #179, #183 y #185). **H0 es el commit del
handoff**, no este hash: Codex arranca con `git rev-parse HEAD` (= H0) y
re-mide las anclas de abajo. Si una no da su valor, **para y avisa**. Toda cifra
de este documento es «base + delta» y dice su base. Ninguna ancla usa números de
línea. Los recuentos del informe `progress/explore_canvas-parity-2026-10-16.md`
caducaron: no se usan.

Comandos desde `mobile-pet-tracker/` (en el handoff, cada uno lleva `cd`
explícito). Cuentan ocurrencias en código de producción (`*.ts` y `*.tsx` bajo
`src/`, sin `*.test.*` ni `src/__tests__/`); un fichero nuevo cuenta tras
`git add`.

```bash
cnt()  { git grep -hoF -e "$1" -- 'src/*.ts' 'src/*.tsx' ':(exclude)*.test.ts' ':(exclude)*.test.tsx' ':(exclude)src/__tests__' | wc -l; }
cntp() { git grep -hoP -e "$1" -- 'src/*.ts' 'src/*.tsx' ':(exclude)*.test.ts' ':(exclude)*.test.tsx' ':(exclude)src/__tests__' | wc -l; }
# A1  primarios sólidos con la receta de #166                -> 16
cntp "rounded-xl bg-accent(?=[\s'\"\`])"
# A2  border-b-4 en producción                               -> 18
cnt 'border-b-4'
# A3  border-black/25                                        -> 20
cnt 'border-black/25'
# A4  border-b-6                                             -> 7
cntp '\bborder-b-6\b'
# A5  border-lip-gray                                        -> 10
cnt 'border-lip-gray'
# A6  <Button.Label (etiquetas de HeroUI abiertas)           -> 35
cnt '<Button.Label'
# A7  Button.Label en total (apertura y cierre)              -> 82
cnt 'Button.Label'
# A8  text-17                                                -> 8
cnt 'text-17'
# A9  Text 17/800 sobre acento (sin cambio de #187)          -> 5
cnt '<Text className="text-17 font-extrabold text-accent-foreground">'
# A10 text-17 font-extrabold text-foreground                 -> 3
cnt 'text-17 font-extrabold text-foreground'
# A11 rounded-16                                             -> 5
cntp '\brounded-16\b'
# A12 nada de la mecánica nueva todavía                      -> 0 y 0
cnt 'chunkyLip'; git ls-files src/theme/chunky-lip.ts | wc -l
# A13 tokens del labio en global.css                         -> 0 (--color-lip:) y 2 (--color-lip-gray:)
git grep -cF -e '--color-lip:' -- src/theme/global.css; git grep -cF -e '--color-lip-gray:' -- src/theme/global.css
# A14 pisos de #187 (cada uno una vez)                       -> 1 y 1
git grep -cF -e 'toBeGreaterThanOrEqual(226)' -- src/__tests__/heroui-text-size-merge.test.ts
git grep -cF -e 'toBeGreaterThanOrEqual(182)' -- src/__tests__/heroui-text-size-merge.test.ts
```

Universo del escáner de `src/__tests__/heroui-text-size-merge.test.ts` (medido
con su propio AST, no con grep): ficheros con elemento HeroUI **29** (piso 28),
elementos HeroUI **226** (piso 226), elementos `Card` **42** (piso 42), elementos
con `className` **182** (piso 182). Codex lo confirma con
`bunx jest src/__tests__/heroui-text-size-merge.test.ts` en verde en H0.

Inventario de `Button` de producción que esta spec toca, medido en `d799d714`
(`id` es el `testID` literal tal como aparece en el fichero):

| Grupo | ids |
|---|---|
| Primario (`bg-accent`, 16) | `login-submit`, `register-submit`, `forgot-submit`, `reset-submit`, `alert-detail-ack`, `welcome-get-started`, `pairing-submit`, `weekly-activity-day-map`, `primary.testID` (celebration), `${testID}-action` (empty-state), `add-pet-submit`, `add-reminder-submit`, `docs-upload-submit`, `geofence-editor-save`, `geofences-add`, `weight-submit` |
| Compacto (1) | `reminders-add-link` |
| Secundario neutro (6) | `welcome-have-account`, `forgot-resend`, `secondary.testID` (celebration), `docs-upload-cancel`, `reminders-delete-cancel`, `alert-detail-view-map` |
| Tile (no es `Button`) | `forgot-lock-tile` (un `PopIn`) |

## Decisiones abiertas para el humano

Las decide el humano en Notion. Cada una trae mi recomendación y lo que cambia si
elige la otra rama. La spec está escrita con la recomendación de cada una; si el
humano elige otra, el leader enmienda antes del handoff.

### D1. Cómo se pinta el labio

El canvas dibuja el labio como una sombra externa sólida (`box-shadow: 0 4px 0
var(--lip)`): el cuerpo mide 56 y el labio cuelga fuera. Hoy es un `border-b-4`
dentro del `Button`, que come 4 px del cuerpo.

- **(a) recomendada.** Hook `useChunkyLip()` en `src/theme/chunky-lip.ts` que
  devuelve objetos de estilo `boxShadow` con el color leído de los tokens
  `--color-lip` y `--color-lip-gray`; cada pantalla pasa `style={chunkyLip.primary}`.
  Es fiel al canvas (cuerpo 56 + labio 4 por fuera), respeta el tema claro y
  oscuro y se prueba en Jest solo por la forma del estilo.
- (b) `border-b-4 border-lip` dentro del botón: no es fiel (cuerpo de 52 más 4)
  y deja `border-b-4` vivo en 18 sitios. Descartada.
- (c) clase de tema `shadow-lip` en `global.css`: uniwind 1.11 trae un parser de
  `boxShadow`, pero no se puede comprobar en Jest que la clase pinte, y un
  sombreado de tema que no pinta falla en silencio. Descartada.

Si el humano elige (b): se reescriben R2 a R5 y R7; el número de cambios se
mantiene, la fidelidad baja. Lo que Jest no ve en (a) (4 px de aire bajo el botón
sin recorte, tema oscuro, escala al pulsar) lo cubre R14.

### D2. Una sola altura de 56

El artboard dibuja botones de 54, 52 y radio 14 en pantallas sueltas. La receta
global es **una sola**: 56 de alto, radio 16. Excepciones: «Ver en el mapa» del
detalle conserva `h-13` (52, #180/#170 R15) y el compacto de Recordatorios
conserva `h-10` (40, #178). Recomendación: una sola altura. Si el humano quiere
respetar 54 o 52 donde el artboard los dibuja, cada uno es una excepción más con
su fila en la tabla de R3/R4.

### D3. Bajar los pisos de #187

La receta pinta 17/800 con `Text` plano de react-native como hijo del botón,
exactamente como #187 hizo con las cuatro pantallas de cuenta. Pasar
`text-17` a `Button.Label` está vetado: `tailwind-merge` 3.6 expulsa
`text-13/15/17` delante de una clase de color. Convertir 15 `Button.Label` en
`Text` baja el universo HeroUI de 226 a 211 y el de elementos con `className` de
182 a 167 (ficheros 29 → 29, `Card` 42 → 42, sin cambio). **Bajar un piso exige
decisión humana** (precedente: E1 y E2 de #187). Recomendación: sí, a 211 y 167,
en un commit solo de test (c3 de [[tasks]]), declarado como aflojamiento que nace
verde. Si el humano dice no: los 15 botones quedan con `Button.Label` a 16 px y la
receta pierde su 17; la alternativa es un componente propio (`ChunkyLabel`) que
envuelva `Text`, que la spec no define.

### D4. Compacto y tile dentro

`reminders-add-link` (compacto de 40, #178) y `forgot-lock-tile` (tile de 52,
#172) llevan hoy `border-b-4 border-black/25`. Recomendación: entran. El
compacto conserva `rounded-xl` y su `h-10` y pasa a un labio de 3 px; el tile pasa
a `rounded-16` con el mismo labio que el primario. Con ambos dentro, `border-b-4`
queda en **0** en producción y `border-black/25` en **2** (el chip y la tarjeta
de resumen, que quedan fuera). Si el humano los saca: `border-b-4` queda en 2
(exactamente esos dos ids), `border-black/25` en 4, y el candado universal «cero»
de R7 pasa a «exactamente esos dos».

### D5. Quedan fuera: chip, ack compacto, Horario, tarjeta de resumen

Siguen con su labio de borde, sin tocar: el chip seleccionado de Nuevo
recordatorio (`border-b-3 border-black/25`, #178), el ack de fila de Alertas
(`border-b-5`, #174 R8.1), «Editar» y «Añadir comida» de Horario (`border-b-5`,
`border-b-6`, #179), «Generar plan» (tonal violeta) y la tarjeta de resumen de
Horario (`border-b-5 border-black/25`). Son superficies compactas con radios
propios de #174/#178/#179. Recomendación: fuera, y registrar una feature
posterior que las pase a la misma mecánica. Mientras tanto conviven dos
mecánicas del labio; R7 y R8 las candan por separado.

### D6. Empty-state sin `w-full` ni icono

`components/empty-state.tsx` recibe solo la receta (`h-14 rounded-16 bg-accent`,
labio, etiqueta `Text`). Su disposición (`items-center gap-3 py-8`), su copy y la
ausencia de icono no se tocan: eso es #181 y ya está en `main`. Recomendación: así.

### D7. Etiqueta de «Ya tengo cuenta»: 17/700

El canvas dibuja la etiqueta del secundario de Bienvenida a 17 con peso 700
(`font-bold`), no 800, y color `accent-strong`. Recomendación: seguir el canvas
(`text-17 font-bold text-accent-strong`). Alternativa: 800 como los demás
secundarios. El cambio es una cadena en un test.

### D8. Variante deshabilitada y «Eliminar»

El canvas dibuja un botón deshabilitado («Añadir zona» de Zonas) con
`h-14 rounded-16 bg-default`, etiqueta `text-17 font-extrabold text-muted` y sin
labio. Recomendación: la carta lo **define** (R11) y lo aplica #189; #177 no
cambia ningún botón a esa variante, porque hoy ningún `Button` de producción es
así. «Eliminar» del canvas lleva una sombra con un color sin token (`#9F1F15`):
sigue como destructivo sin labio (carta §13 «Sin labio»).

### D9. Valores del token `--color-lip`

`--color-lip`: `#0E5E3C` en claro y `#0B4D31` en oscuro, junto a `--color-lip-gray`
en `src/theme/global.css`. Son los del canvas. Contraste no aplica (es un borde
decorativo; el texto va sobre `bg-accent`, no sobre el labio).

### D10. Hoja de «Eliminar recordatorio»: el par queda asimétrico

`reminders-delete-cancel` (secundario neutro) sube a `h-14 rounded-16`. Su par
`reminders-delete-confirm` es destructivo («Sin labio») y no cambia, así que en
la hoja se verán uno de 56 y otro de la altura por defecto de HeroUI (`size-md`).
Recomendación: dejarlo y que el humano lo mire en el smoke (R14). Alternativa:
dar a `confirm` `h-14 rounded-16` sin labio (una fila más en R5). Sale gratis si
el humano lo pide, pero ensancha el alcance a un destructivo.

## Solapes resueltos

Qué entra, qué queda fuera y por qué. Cada fila nombra la feature, el elemento y
el candado que lo fija.

| Feature | Elemento | Decisión | Por qué |
|---|---|---|---|
| #178 | chip seleccionado `border-b-3 border-black/25` (Nuevo recordatorio) | Fuera | cápsula con labio de 3 px propio; línea de la carta fijada por `design-drift` («Chip seleccionado») |
| #178 | `reminders-add-link` (compacto, `h-10`) | Dentro (R5) | su único candado es la etiqueta `text-sm font-extrabold text-accent-foreground`, que no se mueve (`design-drift` #178 R13) y los radios de #178 R13 |
| #179 | «Editar», «Añadir comida», «Generar plan», tarjeta de resumen | Fuera (D5) | radios 10/14/24 y labios `border-b-5/6` propios, y «Generar plan» no tiene token de labio; `add-meal-time-button` es el único `border-b-6` que queda (R7) |
| #174 R8.1 | ack de fila `${rowId}-ack` (`h-8.5 rounded-10 border-b-5`) | Fuera | única excepción nombrada a la receta del secundario; sigue en el inventario de #166 R3 |
| #180 | `alert-detail-ack` | Dentro (R3) | ya es `h-14 rounded-16` con etiqueta `Text` 17/800; solo pierde `border-b-4 border-black/25` y gana el estilo del labio |
| #180 | `alert-detail-view-map` | Dentro (R4), solo el labio | conserva `h-13 rounded-16`, `Button.Label className="text-base font-extrabold text-foreground"` y el icono `Map size={18}`; pierde `border-b-6` y gana `style={chunkyLip.neutral}` |
| #180 | tonales, destructivos y reintentos «Sin labio» | Fuera | §13 «Sin labio» no cambia; el BULLET «Primario del detalle de alerta (#180)» de la carta queda literal |
| #181 | `components/empty-state.tsx` | Dentro (R3), solo receta (D6) | la disposición y el copy ya están en `main` |
| #186 | validación global de formularios | Sin solape de clases | toca campos y errores, no la receta del botón; si #186 fusiona antes, quien fusiona después re-mide las anclas de H0 y los `keeps` de R13 |
| #188 | `pairing-submit` | Dentro (R3) como botón | #188 conserva su entorno (Pingo, anillos, copy) y hereda la receta |
| #189 | Editor de zona y «Añadir zona» deshabilitado | Heredan; la variante deshabilitada la define R11 | #189 aplica la variante; sus botones nuevos suman fila a R3/R4 en su propio commit |
| #191 | «Continuar» y «Guardar mascota» de Añadir mascota | Heredan la receta cta | `add-pet-submit` ya está en la tabla; sus botones nuevos suman fila en su commit |

## Receta (cerrada aquí)

Una fila por elemento; el requisito que la cubre está entre paréntesis.

**Primario cta (R3).** Todo ítem lleva `style={chunkyLip.primary}` y, como hijo,
`<Text className="text-17 font-extrabold text-accent-foreground">`.

| # | Fichero (bajo `src/`) | Ancla (literal) | className nuevo | Etiqueta | `keeps` (se conservan en el tag) |
|---|---|---|---|---|---|
| 1 | `screens/login/index.tsx` | `testID="login-submit"` | `w-full h-14 rounded-16 bg-accent` | ya es `Text` | `isDisabled={submitting}`, `onPress={() => void handleSubmit()}` |
| 2 | `screens/register/index.tsx` | `testID="register-submit"` | `w-full h-14 rounded-16 bg-accent` | ya es `Text` | `isDisabled={!terms \|\| submitting}`, `onPress={() => void handleSubmit()}` |
| 3 | `screens/forgot/index.tsx` | `testID="forgot-submit"` | `w-full h-14 rounded-16 bg-accent` | ya es `Text` | `isDisabled={email.trim() === '' \|\| submitting}`, `onPress={() => void submit()}` |
| 4 | `screens/reset-password/index.tsx` | `testID="reset-submit"` | `w-full h-14 rounded-16 bg-accent` | ya es `Text` | `isDisabled={submitting}`, `onPress={() => void handleSubmit()}` |
| 5 | `screens/alert-detail/index.tsx` | `testID="alert-detail-ack"` | `w-full h-14 rounded-16 bg-accent` | ya es `Text` | `accessibilityRole="button"`, `isDisabled={acking}`, `onPress={() => void handleAck()}` |
| 6 | `screens/welcome/index.tsx` | `testID="welcome-get-started"` | `w-full h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `onPress={() => router.push('/register')}` |
| 7 | `screens/pairing/index.tsx` | `testID="pairing-submit"` | `w-full h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `isDisabled={code.trim() === '' \|\| claiming}`, `onPress={() => void handleClaim()}` |
| 8 | `screens/home/index.tsx` | `testID="weekly-activity-day-map"` | `w-full h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `onPress={() => router.push('/map')}` |
| 9 | `components/celebration.tsx` | `testID={primary.testID}` | `w-full h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `onPress={primary.onPress}` |
| 10 | `components/empty-state.tsx` | ``testID={`${testID}-action`}`` | `h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `onPress={action.onPress}` |
| 11 | `screens/add-pet/index.tsx` | `testID="add-pet-submit"` | `h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `isDisabled={submitting}`, `onPress={() => void handleSubmit()}` |
| 12 | `screens/add-reminder/index.tsx` | `testID="add-reminder-submit"` | `h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `isDisabled={submitting}`, `onPress={() => void handleSubmit()}` |
| 13 | `screens/docs-upload-form/index.tsx` | `testID="docs-upload-submit"` | `h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `isDisabled={uploading}`, `onPress={() => void submitDocument()}` |
| 14 | `screens/geofence-editor/index.tsx` | `testID="geofence-editor-save"` | `h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `isDisabled={busy \|\| name.trim() === ''}`, `onPress={() => void save()}` |
| 15 | `screens/geofences/index.tsx` | `testID="geofences-add"` | `h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `isDisabled={busy \|\| atLimit}` |
| 16 | `screens/weight-log/index.tsx` | `testID="weight-submit"` | `h-14 rounded-16 bg-accent` | `Button.Label` → `Text` | `isDisabled={submitting}`, `onPress={() => void handleSubmit()}` |

Los antiguos `min-h-11` de las filas 7, 8 y 9 desaparecen (el alto es `h-14`).
Las filas 1 a 5 ya traen la etiqueta correcta de #187/#180: no se tocan.

**Secundario neutro (R4).** Todo ítem lleva `style={chunkyLip.neutral}`.

| # | Fichero | Ancla | className nuevo | `variant` | Etiqueta | `keeps` |
|---|---|---|---|---|---|---|
| N1 | `screens/welcome/index.tsx` | `testID="welcome-have-account"` | `w-full h-14 rounded-16 border-2 border-lip-gray bg-surface` | ninguno | `Button.Label` → `<Text className="text-17 font-bold text-accent-strong">` (D7) | `onPress={() => router.push('/login')}` |
| N2 | `screens/forgot/index.tsx` | `testID="forgot-resend"` | `w-full h-14 rounded-16 border-2 border-lip-gray bg-surface` | `secondary` | ya es `<Text className="text-17 font-extrabold text-foreground">` | `isDisabled={submitting}`, `onPress={() => void send(submittedEmail)}` |
| N3 | `components/celebration.tsx` | `testID={secondary.testID}` | `w-full h-14 rounded-16 border-2 border-lip-gray bg-surface` | ninguno | `Button.Label` → `<Text className="text-17 font-extrabold text-foreground">` | `onPress={secondary.onPress}` |
| N4 | `screens/docs-upload-form/index.tsx` | `testID="docs-upload-cancel"` | `h-14 rounded-16 border-2 border-lip-gray bg-surface` | `outline` | `Button.Label` → `<Text className="text-17 font-extrabold text-foreground">` | `isDisabled={uploading}`, `onPress={() => router.back()}` |
| N5 | `screens/reminders/index.tsx` | `testID="reminders-delete-cancel"` | `w-full h-14 rounded-16 border-2 border-lip-gray bg-surface` | `outline` | `Button.Label` → `<Text className="text-17 font-extrabold text-foreground">` | `onPress={dismissDeleteSheet}` |
| N6 | `screens/alert-detail/index.tsx` | `testID="alert-detail-view-map"` | `h-13 rounded-16 border-2 border-lip-gray bg-surface` | `secondary` | **sin cambio**: `Button.Label className="text-base font-extrabold text-foreground"` | `accessibilityRole="button"`, el icono `<Map size={18} color={foreground} />` |

**Compacto y tile (R5).**

| # | Fichero | Ancla | className nuevo | Estilo | Etiqueta |
|---|---|---|---|---|---|
| C1 | `screens/reminders/index.tsx` | `testID="reminders-add-link"` | `rounded-xl bg-accent h-10 gap-1.5 px-3.5` | `style={chunkyLip.primaryCompact}` | **sin cambio**: `Button.Label className="text-sm font-extrabold text-accent-foreground"`; icono `<Plus size={16} color={accentForeground} />` |
| T1 | `screens/forgot/index.tsx` | `testID="forgot-lock-tile"` (un `PopIn`) | `size-13 items-center justify-center bg-accent rounded-16` | `style={[CONTINUOUS_CORNER, chunkyLip.primary]}` | no aplica |

En T1 `bg-accent` va **antes** de `rounded-16`: así el tile no cuenta como
primario en el inventario `rounded-16 bg-accent(?=[\s'"\`])` de R7 (misma
razón que la carta daba para poner el labio delante de `bg-accent`).

**Cuentas de decisiones por elemento repetido.** Cada fila de R3 son cuatro
decisiones (className exacto, `style`, etiqueta, `keeps`); cada fila de R4,
cuatro (className, `style`, `variant`, etiqueta); C1 son cuatro (className,
`style`, etiqueta intacta, icono intacto); T1 son dos (className, `style`). Cada
decisión tiene un `it` propio o una aserción nombrada en un `it.each` de las filas.

## Requisitos funcionales

**R1. Token del labio.**
- **R1.1**: WHEN `src/theme/global.css` se lee en el tema claro THE SYSTEM SHALL declarar `--color-lip: #0E5E3C`; en el tema oscuro, `--color-lip: #0B4D31`. Los dos valores están junto a `--color-lip-gray`, que no cambia (`#E4E7EC` claro, `#0A0D12` oscuro).
- **R1.2**: THE SYSTEM SHALL NOT declarar `--lip` sin prefijo: `useThemeColors` lee `--color-<token>` primero.

Test: `src/theme/__tests__/global-css.test.ts`, `describe` nuevo `#177 R1: global.css declara el labio del primario en los dos temas`, con `it.each([['light','#0E5E3C'],['dark','#0B4D31']])` título `declara --color-lip exacto en %s`, usando `parseVariables(extractVariant(theme))` y `toMatchObject({ 'color-lip': value })`, igual que el `describe` de #166 R1.

**R2. Hook `useChunkyLip`.**
- **R2.1**: THE SYSTEM SHALL exportar `useChunkyLip` y el tipo `ChunkyLip` desde `src/theme/chunky-lip.ts`. El hook llama a `useThemeColors(['lip', 'lip-gray'])` (import `./use-theme-colors`).
- **R2.2**: THE hook SHALL devolver un objeto con tres claves, cada una `{ boxShadow: [{ offsetX: 0, offsetY: N, blurRadius: 0, spreadDistance: 0, color }] }`: `primary` con `offsetY: 4` y el color de `lip`; `primaryCompact` con `offsetY: 3` y el color de `lip`; `neutral` con `offsetY: 4` y el color de `lip-gray`.
- **R2.3**: WHILE los dos colores no cambian entre renders THE hook SHALL devolver el mismo objeto (misma referencia, `useMemo` por `[lip, lipGray]`); WHEN el tema cambia y `useThemeColors` devuelve otros colores THE hook SHALL devolver objetos con los colores nuevos.
- **R2.4**: IF `useThemeColors` está sustituido por un doble que devuelve una lista más corta THEN THE hook SHALL NOT lanzar: el `color` queda `undefined`. (Las pruebas de pantalla que sustituyen `useThemeColors`, como la de `alert-detail`, deben seguir montando.)
- **R2.5**: THE module SHALL NOT contener `StyleSheet`, `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation:` ni un literal hexadecimal; solo `boxShadow`.

Test: fichero nuevo `src/theme/__tests__/chunky-lip.test.tsx`. Doble de `./../use-theme-colors` como el de `alert-detail` (`tokens.map((token) => \`--color-${token}\`)`) para las formas; la referencia estable y el cambio de color con una sonda `renderHook`-equivalente (`render` de un componente sonda, como `use-theme-colors.test.tsx`). Siete `it`, títulos que empiezan por `#177 R2.n:`: (1) pide `['lip','lip-gray']`; (2) forma de `primary`; (3) forma de `primaryCompact`; (4) forma de `neutral`; (5) referencia estable; (6) se re-resuelve con otro color; (7) tolera una lista corta. R2.5 lo prueba R12.

**R3. Primario cta.**
- **R3.1**: WHEN se renderiza cada uno de los 16 `Button` de la tabla cta THE SYSTEM SHALL pintar en su tag de apertura el `className` exacto de la tabla (entre comillas dobles, en `className="..."`), `style={chunkyLip.primary}` y los `keeps` de su fila, y NOT contener `border-b-4`, `border-black`, `rounded-xl` ni `min-h-11`.
- **R3.2**: THE SYSTEM SHALL pintar la etiqueta de cada uno de esos 16 como `<Text className="text-17 font-extrabold text-accent-foreground">` (un `Text` de `react-native` hijo del botón) y NOT usar `Button.Label` dentro de ese botón.
- **R3.3**: THE SYSTEM SHALL tener en producción exactamente 17 `Button` cuyo tag de apertura contiene el token `bg-accent` (coincidencia por token completo, no `bg-accent-soft`): los 16 de la tabla cta y `reminders-add-link`. (Candado universal: un `Button` nuevo con `bg-accent` sin fila en la tabla hace caer este `it`.)

Tests (todos en `src/__tests__/chunky-cta-canvas-fidelity.test.ts`, fichero nuevo; copia local de `openingTagWithTestId` de `consistency-classnames.test.ts`, que no está exportada, y un `elementWithTestId` que devuelve del `<Button` al `</Button>`): `it.each(CTA_ROWS)('#177 R3.1: %s pinta la receta cta de %s', …)` (16); `it.each(CTA_ROWS)('#177 R3.2: %s pinta la etiqueta Text 17/800 de %s', …)` (16); `it('#177 R3.3: el inventario de Button con bg-accent está cerrado', …)` (1). Las anclas dinámicas son las tres literales de la tabla (`testID={primary.testID}`, ``testID={`${testID}-action`}``, `testID={secondary.testID}`); para ellas el helper busca la cadena y exige una sola aparición en el fichero.

**R4. Secundario neutro.**
- **R4.1**: WHEN se renderiza cada uno de los 6 `Button` de la tabla neutra THE SYSTEM SHALL pintar el `className` exacto, `style={chunkyLip.neutral}`, el `variant` de su fila (ausente en N1 y N3) y los `keeps`, y NOT contener `border-b-6`, `border-b-4`, `border-black`, `border-accent`, `bg-transparent` ni `rounded-xl`.
- **R4.2**: THE SYSTEM SHALL pintar la etiqueta de cada fila como dice la tabla (N1 `text-17 font-bold text-accent-strong`; N2 a N5 `text-17 font-extrabold text-foreground` como `Text`; N6 `Button.Label` sin cambio).
- **R4.3**: THE SYSTEM SHALL conservar el inventario de #166 R3: el conjunto de `testID` de los `Button` neutros (con `variant="outline"` o `"secondary"` sin fondo tonal, o con `border-lip-gray`) sigue siendo los nueve que ya lista `consistency-classnames.test.ts` (`${rowId}-ack`, `add-meal-time-button`, `alert-detail-view-map`, `docs-upload-cancel`, `forgot-resend`, `meal-time-edit-${index}`, `reminders-delete-cancel`, `secondary.testID`, `welcome-have-account`).

Tests: `it.each(NEUTRAL_ROWS)` para R4.1 (6) y R4.2 (6), y un `it` para R4.3 (1) en el fichero nuevo. R4.3 además queda en `consistency-classnames.test.ts` (R10).

**R5. Compacto y tile.**
- **R5.1**: WHEN se renderiza `reminders-add-link` THE SYSTEM SHALL pintar `rounded-xl bg-accent h-10 gap-1.5 px-3.5`, `style={chunkyLip.primaryCompact}`, la etiqueta `Button.Label className="text-sm font-extrabold text-accent-foreground"` y el icono `Plus size={16}`, sin `border-b-4` ni `border-black/25`.
- **R5.2**: WHEN se renderiza `forgot-lock-tile` THE SYSTEM SHALL pintar `size-13 items-center justify-center bg-accent rounded-16` y `style={[CONTINUOUS_CORNER, chunkyLip.primary]}`, sin `border-b-4` ni `border-black/25`.

Tests: dos `it` en el fichero nuevo (`#177 R5.1`, `#177 R5.2`); más los colocados que R10 reescribe (`screens/forgot/index.test.tsx`, bloque `#167 R9`, con `StyleSheet.flatten` y las dos claves `borderCurve: 'continuous'` y `boxShadow`).

**R6. Etiquetas: 15 conversiones y recuentos.**
- **R6.1**: THE SYSTEM SHALL convertir exactamente 15 `Button.Label` en `Text` de `react-native` (once acento sobre filas 6 a 16 de R3, tres `text-foreground` en N3, N4, N5 y uno `accent-strong` en N1), sin cambiar el texto que pintan ni su clave de traducción.
- **R6.2**: THE SYSTEM SHALL dejar en producción, sobre la base medida: `<Button.Label` **20** (35 − 15); `Button.Label` en total **52** (82 − 30); `text-17` **23** (8 + 15); `<Text className="text-17 font-extrabold text-accent-foreground">` **16** (5 + 11); `text-17 font-extrabold text-foreground` **6** (3 + 3); `<Text className="text-17 font-bold text-accent-strong">` **1** (0 + 1).

Test: un `it` en el fichero nuevo, `#177 R6.2: recuentos de etiquetas`, con los seis recuentos como constantes `BASE + DELTA` y un comentario con la base. Codex re-mide la base en H0 (A6 a A10) antes de escribir la aritmética.

**R7. Inventarios cerrados.**
- **R7.1**: THE SYSTEM SHALL tener en producción: `border-b-4` **0**; `border-black/25` **2** (el chip de `add-reminder` y la tarjeta de resumen de `meal-schedule`, un caso cada uno); `\bborder-b-6\b` **1** (`add-meal-time-button`); `border-lip-gray` **10** (sin cambio).
- **R7.2**: THE SYSTEM SHALL tener `rounded-xl bg-accent(?=[\s'"\`])` solo en `screens/reminders/index.tsx` (1), y `rounded-16 bg-accent(?=[\s'"\`])` en exactamente 16 ficheros, uno cada uno: `components/celebration.tsx`, `components/empty-state.tsx`, `screens/add-pet`, `screens/add-reminder`, `screens/alert-detail`, `screens/docs-upload-form`, `screens/forgot`, `screens/geofence-editor`, `screens/geofences`, `screens/home`, `screens/login`, `screens/pairing`, `screens/register`, `screens/reset-password`, `screens/weight-log` y `screens/welcome` (los de pantalla, con `/index.tsx`).
- **R7.3**: THE SYSTEM SHALL tener `\brounded-16\b` **26** en producción, repartidos así: `components/celebration.tsx` 2, `components/empty-state.tsx` 1, `screens/add-pet` 1, `screens/add-reminder` 1, `screens/alert-detail` 2, `screens/docs-upload-form` 2, `screens/forgot` 3, `screens/geofence-editor` 1, `screens/geofences` 1, `screens/home` 1, `screens/login` 1, `screens/pairing` 1, `screens/register` 1, `screens/reminders` 4, `screens/reset-password` 1, `screens/weight-log` 1, `screens/welcome` 2 (base 5: `alert-detail` 2 y `reminders` 3).
- **R7.4**: THE SYSTEM SHALL contener `useChunkyLip` en exactamente 18 ficheros de producción: `theme/chunky-lip.ts` (la definición) y los 17 consumidores (los 16 ficheros de R7.2 más `screens/reminders/index.tsx`, y sin duplicados). Cada consumidor lo llama una vez (`const chunkyLip = useChunkyLip();`) en el componente que renderiza el `Button` o el tile, nunca dentro de una rama condicional.
- **R7.5**: THE SYSTEM SHALL tener en producción `style={chunkyLip.primary}` **16**, `style={chunkyLip.neutral}` **6**, `style={chunkyLip.primaryCompact}` **1** y `chunkyLip.primary` **17** (los 16 anteriores más el tile T1, donde va dentro de un array).

Tests: cinco `it` en el fichero nuevo, uno por apartado, títulos `#177 R7.1` a `#177 R7.5`, con inventarios por fichero y mapas literales (no solo totales). El orden de las claves del mapa de R7.2/R7.3 es el orden de `.sort()` de las rutas completas (`components/…` antes de `screens/…`); Codex lo verifica con `node` antes de escribirlo (`O` < `_` en los nombres con guion).

**R8. Lo que queda fuera no se toca.**
- **R8.1**: THE SYSTEM SHALL NOT dar `chunkyLip` a ningún `Button` que no esté en las tablas de R3, R4 y R5: los `Button` cuyo tag de apertura contiene `style={chunkyLip.primary}` son exactamente los 16 ids de la tabla cta, los que contienen `style={chunkyLip.neutral}` son exactamente N1 a N6 y el que contiene `style={chunkyLip.primaryCompact}` es exactamente C1. (Un `it` por rama.)
- **R8.2**: THE SYSTEM SHALL NOT contener `chunkyLip` ni `useChunkyLip` en `screens/alerts/index.tsx` ni en `screens/meal-schedule/index.tsx`.
- **R8.3**: THE SYSTEM SHALL conservar, como anclas positivas: el ack de fila de Alertas con `className="h-8.5 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3"`; `add-meal-time-button` con `h-13.5 flex-1 rounded-14 border-2 border-b-6 border-lip-gray bg-surface`; `meal-time-edit-${index}` con `h-9.75 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3.5`; el chip seleccionado de `add-reminder` con `border-b-3 border-black/25` (una vez); la tarjeta de resumen de `meal-schedule` con `border-b-5 border-black/25` (una vez); `generate-plan-button` con `variant="tertiary"`.
- **R8.4**: THE SYSTEM SHALL NOT cambiar los destructivos, tonales ni reintentos: `device-unpair`, `reminders-delete-confirm`, `profile-sign-out`, `add-pet-photo`, `geofence-editor-delete`, `lost-mode-button` y todo `*-retry` no llevan `chunkyLip` ni `border-b-`.

Tests en el fichero nuevo: `it.each` de 3 filas para R8.1 (primary, neutral, primaryCompact); un `it` para R8.2; `it.each` de 6 filas para R8.3; un `it` para R8.4. Los de R8.2, R8.3 y R8.4 nacen en verde (anclas positivas); se declaran así en [[tasks]] y se prueban con la mutación S4 y S12 de la tabla de sondas.

**R9. Pisos de #187.**
- **R9.1**: THE SYSTEM SHALL bajar en `src/__tests__/heroui-text-size-merge.test.ts`, en el `it` `'#187 R1: el escáner cubre al menos el universo medido'`, el piso de elementos HeroUI de 226 a **211** y el de elementos con `className` de 182 a **167**, y dejar los de ficheros (28) y `Card` (42). El título del `it` termina en `(enmendado por #177 R9)`. La medida tras las 15 conversiones es 211 y 167 exactos (HeroUI 226 − 15; `className` 182 − 15).
- **R9.2**: THE SYSTEM SHALL NOT reintroducir `text-<n>` de la escala propia en un `Button.Label` ni `Label.Text`: el `it` 1 de #187 R1 sigue verde sin tocarse.

Prueba de piso exacto (parte de la cadena, no un `it`): tras c10, con los pisos puestos a 212 y 168, el `it` cae; con 211 y 167, pasa. Se revierte con `git checkout HEAD --` y `git diff --cached --quiet`.

**R10. Candados enmendados.** Cada `it` o constante que describe la receta vieja se reescribe **en su sitio** con el sufijo `(enmendado por #177 R10)` en el título o en un comentario de la línea. Ninguno se borra y ninguno afloja un valor sin que esté en esta lista.

`src/__tests__/consistency-classnames.test.ts`:

1. `#62 R1`, `it.each(primaryButtons)` («aplica rounded-xl a %s …»): ahora exige `rounded-16 bg-accent` en `login-submit`, `forgot-submit`, `register-submit` y `reset-submit`; el título pasa a «aplica rounded-16».
2. `#62 R1`, «deja todos los botones primarios sólidos en un único radio»: el recuento de `rounded-xl bg-accent(?=[\s'"\`])` pasa a **1**, y se añade el de `rounded-16 bg-accent(?=[\s'"\`])` = **16**; `rounded-2xl bg-accent` sigue en `[]`.
3. El `it` de recuentos globales que hoy cuenta `rounded-xl bg-accent(?=…)` (cadena `13 + 1 + …`): pasa a **1**; y `style={CONTINUOUS_CORNER}` baja **1** (el tile T1 pasa a `style={[CONTINUOUS_CORNER, chunkyLip.primary]}`; la aritmética gana `- 1 // #177 R5`).
4. `#62`, «lleva los tres tiles restantes a rounded-xl»: la literal del tile de `forgot` pasa a `size-13 items-center justify-center bg-accent rounded-16`; la de `weight-log` no cambia.
5. `#166 R2` (`describe` «todo primario sólido lleva el labio detrás de bg-accent»): el mapa `expected` de 16 ficheros pasa a los 16 de R7.2 (sale `reminders`, entra `alert-detail`); el inventario de `rounded-xl bg-accent border-b-4 border-black/25` se sustituye por el de `rounded-16 bg-accent(?=[\s'"\`])` contra ese mapa; y el recuento de `rounded-xl bg-accent(?=…)` es `{ 'screens/reminders/index.tsx': 1 }`. Los recuentos `border-b-4` y `border-black/25` pasan a **0** y **2** (se sustituye la aritmética por la cifra y un comentario con la lista del apartado R7.1).
6. `#166 R3`: la `recipe` pasa a `rounded-16 border-2 border-lip-gray bg-surface`, con `w-full h-14` o `h-14` delante según la fila (`toContain` de la subcadena `h-14 rounded-16 border-2 border-lip-gray bg-surface`); las cuatro filas (N1, N2, N4, N5) y sus `variant` no cambian; el inventario de nueve `testID` no cambia; `border-lip-gray` sigue en 10 y `\bborder-b-6\b` baja a **1**.
7. `#166 R4`: las dos recetas de la carta se sustituyen por las nuevas (R11) y la frase «El labio va detrás de `bg-accent`, nunca delante» por la de R11; se conservan `13. **Botón con cuerpo** (feature #166, 2026-10-11)`, `--color-lip-gray`, `**Sin labio**` y el orden entre §12, §13 y «## Animación (decisiones por defecto)».
8. Los dos `#180 R7.5`: «Ver en el mapa» exige `rounded-16 border-2 border-lip-gray bg-surface` (sin `border-b-6`); el ack exige `rounded-16 bg-accent` y no contiene `border-b-4`.

`src/__tests__/design-drift.test.ts`:

9. `#178 R13`, «reserva los radios 14, 16 y 22 a Recordatorios …»: `rounded-16` en `screens/reminders/index.tsx` pasa de 3 a **4**; la comprobación `outsideReminders(/\brounded-(?:16|22)\b/)` se reduce a `rounded-22` y devuelve `[]`; el inventario de `rounded-16` fuera de Recordatorios pasa a R7.3. `rounded-14` fuera de Recordatorios no cambia.
10. `#179 R13`, «limita text-22 a Horario y text-17 al inventario de E1.2»: la lista ordenada de ficheros con `\btext-17\b` pasa de 6 a **18**: `components/celebration.tsx`, `components/empty-state.tsx`, `screens/add-pet/index.tsx`, `screens/add-reminder/index.tsx`, `screens/alert-detail/index.tsx`, `screens/docs-upload-form/index.tsx`, `screens/forgot/index.tsx`, `screens/geofence-editor/index.tsx`, `screens/geofences/index.tsx`, `screens/home/index.tsx`, `screens/login/index.tsx`, `screens/meal-schedule/index.tsx`, `screens/pairing/index.tsx`, `screens/register/index.tsx`, `screens/reminders/index.tsx`, `screens/reset-password/index.tsx`, `screens/weight-log/index.tsx`, `screens/welcome/index.tsx`. El `it` de `text-22` no cambia. Codex sustituye la lista por la que da `git grep -lP '\btext-17\b'` en el commit, ordenada con `.sort()`.
11. Líneas de la carta que `design-drift` fija por contenido y que **no cambian**: la del chip (#178), `actionRule` de los secundarios de Horario (#179) y la subcadena `**Sin labio**`. Un `it` de este requisito (en el fichero nuevo, R11) comprueba que siguen literales.

`src/__tests__/account-screens-polish.test.ts`:

12. `#172 R20`: la literal `w-full h-14 rounded-xl bg-accent border-b-4 border-black/25` (recuentos `[login 1, register 1, forgot 1, reset-password 1, password-input 0]`) pasa a `w-full h-14 rounded-16 bg-accent`, y `w-full h-14 rounded-xl border-2 border-b-6 border-lip-gray bg-surface` (forgot 1) pasa a `w-full h-14 rounded-16 border-2 border-lip-gray bg-surface`. El resto de literales de ese `it` y **toda** la tabla `textRecipes` (compartida con #187) **no se tocan**.

`src/__tests__/heroui-text-size-merge.test.ts`: R9.1.
`src/components/__tests__/empty-state.test.tsx` (Enmienda E1, 2026-10-19):
13. `#155 R11`, `describe` «los vacíos no traen movimiento ni dependencias», dos `it`: (a) «EmptyState solo importa de react, react-native, expo-image, heroui-native, Reanimated y el tema de movimiento»: la lista de especificadores admitidos gana `'../theme/chunky-lip'`; (b) «EmptyState importa exactamente lo de la flotación»: la lista de imports gana `"import { useChunkyLip } from '../theme/chunky-lip';"` **inmediatamente antes** de `"import { MOTION_FLOAT_OFFSET_Y, MOTION_FLOAT_TIMING } from '../theme/motion';"`, y `toHaveLength(6)` de `require(` no cambia. Los dos títulos pasan a terminar en `(enmendado por #177 R10)`. El tercer `it` del `describe` (sin `LayoutAnimation`, `transition`, `animate-`, `entering=` ni `exiting=`) no se toca.

Pruebas colocadas que afirman `className` o etiquetas viejas (se reescriben para pasar con la receta nueva; no cambia su intención): `src/components/__tests__/celebration.test.tsx`, `src/components/__tests__/empty-state.test.tsx`, `src/screens/welcome/index.test.tsx`, `login`, `register`, `forgot` (con el bloque `#167 R9` del tile), `reset-password`, `geofences`, `geofence-editor`, `reminders`, `home`, `alert-detail`, `docs-upload-form`, `add-reminder`, `pairing` y, solo si el grep de H0 las encuentra con la receta vieja, `alerts` y `meal-schedule`. El grep de H0 que las localiza:

```bash
git grep -lE "border-b-4|border-black/25|border-b-6|rounded-xl bg-accent|min-h-11|font-bold text-accent-foreground|Button\.Label|rounded-xl border-2" -- 'src/*.test.ts' 'src/*.test.tsx'
```

Las pruebas colocadas de `screens/alerts` y `screens/meal-schedule` mencionan estas cadenas por los botones que quedan fuera (R8): no se tocan salvo que una aserción dependa de algo que esta feature cambia. `screens/alert-detail/index.test.tsx` y `screens/geofence-editor/index.test.tsx` sustituyen `uniwind` o `useThemeColors`: deben seguir montando con el hook (R2.4).

**R11. La carta y las enmiendas.**
- **R11.1**: `docs/ui-guidelines.md` §13 («Botón con cuerpo») se reescribe: la frase inicial deja de decir «nunca una sombra» y dice que el labio es una sombra sólida sin desenfoque en `--lip` (`--color-lip`, `--color-lip-gray`) que cuelga fuera del cuerpo; **Primario sólido** `h-14 rounded-16 bg-accent` con `style={chunkyLip.primary}` y etiqueta `Text` `text-17 font-extrabold text-accent-foreground`; **Secundario neutro** `h-14 rounded-16 border-2 border-lip-gray bg-surface` con `style={chunkyLip.neutral}`; **Compacto** (`reminders-add-link`: `h-10`, `rounded-xl`, `chunkyLip.primaryCompact`); **Tile con labio** (`forgot-lock-tile`: `bg-accent rounded-16` con el orden dicho); **Deshabilitado** (`h-14 rounded-16 bg-default`, etiqueta `text-17 font-extrabold text-muted`, sin labio; lo aplica #189); una frase que dice que el 17 se pinta con `Text` plano por la regla de la Enmienda #187. Contiene la frase «El tile del candado lleva `bg-accent` antes de `rounded-16` para no contar como primario». Las líneas del chip (#178), de Horario (#179), `**Sin labio**`, «Secundario compacto de fila» (#174) y «Primario del detalle de alerta (#180)» quedan **literales**.
- **R11.2**: §12 gana una línea «Fuera de la escala, por fidelidad al canvas (#177): …» que dice que `rounded-16` es el radio de todo botón de 56 de alto y del tile del candado, y que el compacto de 40 conserva `rounded-xl`. La línea «Control, tile, input, botón y píldora de dato → `rounded-xl`» no se toca.
- **R11.3**: el párrafo «El candado lleva labio» de la Enmienda #172 sustituye `rounded-xl border-b-4 border-black/25 bg-accent` por `bg-accent rounded-16` con `style={[CONTINUOUS_CORNER, chunkyLip.primary]}`.
- **R11.4**: la carta gana una sección `## Enmienda #177 — Receta global de botones` con el formato de la #180 (cita de la directiva, «**Qué cambia**», referencia a esta spec) y la línea `- [ ] Enmienda #177 aprobada por humano`, sin marcar. Cualquier test que lea esa casilla usa el patrón tolerante `^- \[[ xX]\] Enmienda #177 aprobada por humano`.
- **R11.5**: `specs/mobile-chunky-cta/requirements.md` (#166) gana al final un bloque `## Enmienda #177 — Receta global de botones` con la misma casilla tolerante, que dice que reemplaza la receta de R2 y R3 de #166 por la de esta spec y que `consistency-classnames.test.ts` se reescribe en su sitio. No se editan R2 ni R3 de #166. `src/__tests__/alert-detail-canvas-fidelity.test.ts` y `profile-canvas-fidelity.test.ts` fijan texto de esa spec por contenido: el bloque se **añade** al final y no mueve ninguna línea que fijen.

Tests (en el fichero nuevo): `it` `#177 R11.1` (frases y recetas de §13 y las líneas que no cambian), `#177 R11.2` (la línea de §12), `#177 R11.3` (el párrafo del candado y la ausencia de `border-b-4 border-black/25` en la carta fuera de las líneas del chip y de la tarjeta de resumen), `#177 R11.4` y `#177 R11.5` (la sección y la casilla con el patrón tolerante en cada fichero). La carta solo conserva `border-b-4` en frases históricas de Enmiendas anteriores: el `it` de R11.3 recorre sección por sección y exige cero fuera de las Enmiendas #172, #174, #180 y de las líneas del chip.

**R12. Guards de la carta.**
- **R12.1**: THE SYSTEM SHALL NOT introducir clases nuevas de color ni de tamaño: toda clase de las tablas existe ya en producción (`h-14`, `h-13`, `h-10`, `rounded-16`, `rounded-xl`, `text-17`, `font-extrabold`, `font-bold`, `text-accent-foreground`, `text-foreground`, `text-accent-strong`, `bg-accent`, `bg-surface`, `border-2`, `border-lip-gray`, `w-full`, `gap-1.5`, `px-3.5`, `size-13`, `items-center`, `justify-center`). El único token nuevo es `--color-lip` (R1).
- **R12.2**: THE SYSTEM SHALL NOT contener, en `src/theme/chunky-lip.ts` ni en los 17 consumidores, clases entre corchetes (C8), literales hexadecimales fuera de `#NNN R<n>`, `StyleSheet`, `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` ni `elevation:`. THE module name and hook SHALL NOT contener la subcadena `shadow` en minúscula (los guards `design-drift` y `legibility-classnames` la tratan como ofensora en ficheros acotados).
- **R12.3**: Todo comentario de código que cite esta feature usa el formato `#177 R<n>`; ningún `#177` suelto (`HEX_LITERAL` exime solo `#NNN R<n>`).
- **R12.4**: `text-accent-strong` en `screens/welcome/index.tsx` sigue en **2** (N1 sustituye la etiqueta, no suma una clase).

Recorrido de guards antes de firmar (hecho en esta spec; Codex lo repite con los `it` reales en c4 y en cada commit de grupo): `design-drift` (HEX_LITERAL, ARBITRARY_CLASS, `StyleSheet`, SHADOW_ESCAPES, radios prohibidos `rounded-2xl|lg|md|sm`, `text-accent` suelto), `legibility-classnames` (pares de color de texto sobre fondo, y `text-accent-strong` de Bienvenida), `ui-copy-table` (sin copy nuevo, sin filas nuevas) y `profile-canvas-fidelity` (sin `text-13`, `text-26`, `rounded-hero` ni `rounded-tile` nuevos). Ninguna de las clases de R12.1 aparece en la lista de ofensoras de esos guards.

Tests: dos `it` en el fichero nuevo, `#177 R12.1/R12.2` (recorre los 18 ficheros con las regex de arriba) y `#177 R12.3` (cada `#177` va seguido de ` R` y un dígito); los guards existentes cubren el resto y se corren enteros en cada commit de grupo.

**R13. Invariantes: lo que no cambia.**
- **R13.1**: THE SYSTEM SHALL conservar en cada `Button` y en el tile todos los `testID`, `onPress`, `isDisabled`, `accessibilityRole`, `variant`, el icono y el texto que pinta (las claves `t('…')` y los literales de copy). Lo cubren los `keeps` de las tablas (R3.1, R4.1) y las pruebas colocadas.
- **R13.2**: `git diff H0..HEAD -- src/i18n package.json bun.lock app.json` SHALL ser vacío: sin copy nuevo, sin dependencias nuevas.
- **R13.3**: `git diff H0..HEAD --stat -- ../backend-pet-tracker` SHALL ser vacío.

R13.2 y R13.3 se comprueban con esos comandos (los corre el reviewer; Codex deja el resultado en `progress/impl_mobile-chunky-cta-canvas-fidelity.md`).

**R14. Prueba de humo humana en dev build de Android.** Es un requisito que solo cierra el humano: Jest ve la forma del estilo, no el pixel. WHEN el humano abre la build de desarrollo en su Android THE SYSTEM SHALL cumplir, sin recorte ni salto, en tema claro **y** oscuro:
1. El primario de Login, Registro, Recuperar y Restablecer mide 56 de alto, radio 16, etiqueta de 17 con peso 800, y el labio verde cuelga 4 px por debajo sin quedar cortado por el contenedor.
2. El secundario neutro (Bienvenida «Ya tengo cuenta», Recuperar «Reenviar», Celebración) lleva su labio gris de 4 px por fuera y el borde de 2 px.
3. Al pulsar un primario, el botón y su labio se escalan juntos y el labio no se queda atrás ni parpadea.
4. El compacto «Añadir» de Recordatorios (40, labio de 3) y el tile del candado de Recuperar se ven igual de sólidos que los primarios.
5. «Ver en el mapa» del detalle de alerta (52) y el ack (56) conviven sin que el labio de uno pise al otro.
6. La hoja de «Eliminar recordatorio» (D10): se ve el par de 56 y la altura por defecto; el humano decide si es aceptable.
7. Los botones que quedan fuera (chip, ack de fila, Horario, retry, destructivos) no cambian.

La casilla propia está en «Gate humano de cierre» y no la marca ningún agente.

## Fuera de alcance

- Los elementos de D5 (chip, ack de fila, Horario, tarjeta de resumen): conservan su labio de borde.
- «Generar plan» y su labio violeta sin token; los destructivos y la sombra `#9F1F15` de «Eliminar» del canvas.
- Aplicar la variante deshabilitada a «Añadir zona» (#189), el entorno de `pairing-submit` (#188), los dos pasos de Añadir mascota (#191) y la validación global de formularios (#186).
- Cualquier cambio de copy, de traducciones, de rutas, de lógica de `onPress` o de `isDisabled`.
- Dependencias nuevas (R13.2). La mecánica usa `boxShadow` de React Native 0.86 y `useThemeColors` que ya existen.
- Un componente propio `ChunkyButton`: no se crea; la receta vive en clases y en el hook.
- `backend-pet-tracker/` (R13.3).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-18) ← gate obligatorio antes de implementar
- D1 elegida (a, b o c): a
- D2 elegida (una altura de 56, o excepciones): una altura de 56
- D3 elegida (sí a 211/167, o no): sí a 211/167 (el humano escribió «221/167»; 221 es errata: la medida exacta es 211 y R9.1 la fija así)
- D4 elegida (compacto y tile dentro, o fuera): compacto y tile dentro
- D5 elegida (fuera y feature posterior, o dentro): fuera y feature posterior
- D6 elegida (empty-state solo receta, o con `w-full`): solo receta (recomendación)
- D7 elegida (17/700 o 17/800): 17/700
- D8 elegida (variante en la carta, o también el `Eliminar` con sombra): variante en la carta
- D9 elegida (valores del token, o los cambia): valores del token tal cual (`#0E5E3C` / `#0B4D31`)
- D10 elegida (par asimétrico, o `confirm` sube a 56): par asimétrico

Firmado en Notion (página 3fe6115a-9b27-81dd-ab23-d801d30c762b, `Estado del gate` = Aprobado, última edición 2026-10-19T01:40:01Z, cuenta del humano).
Cualquier test o comando que lea esta casilla usa el patrón tolerante
`^- \[[ xX]\] Aprobado por humano`: con la casilla marcada o sin marcar da `1`.

## Enmienda E1 (2026-10-19, hallada por Codex en c6)

R7.4 manda que `components/empty-state.tsx` llame a `useChunkyLip()`, y por tanto lo importe. Dos
`it` de #155 R11 en `src/components/__tests__/empty-state.test.tsx` fijan la lista **exacta** de
imports de ese fichero y caen con ese import. R10 los omitió porque su grep de H0 localiza el
fichero por `className` y etiqueta, no por inventarios de imports. Codex paró en c6 conforme al
handoff, sin tocar las aserciones: `Expected "../theme/chunky-lip"` en (a) y el import añadido en
(b), ambos medidos en `/tmp/177-c6-1.log` del impl.

1. **Qué cambia.** El punto 13 de R10: los dos `it` admiten el import del hook, en la posición dicha.
   Es un aflojamiento mínimo (un especificador más) que el propio R7.4 exige. No cambia ningún
   valor de la receta ni de los pisos.
2. **Cómo se aplica (commit c5b, test-primero).** Antes de c6, un commit
   `test(#177 R10): candados de imports de #155 R11 admiten useChunkyLip (R10)` que reescribe solo esos
   dos `it`. Rojo esperado: (b) cae (el fichero aún no importa el hook; `Received` sin la línea);
   (a) es **NV, aflojamiento declarado** (admite un especificador que aún no aparece). Para medir
   el rojo con los siete ficheros de producción de G1 ya editados sin commit: guardar el parche con
   `git diff -- <los 7 ficheros> > <patch fuera del árbol>`, `git checkout HEAD -- <los 7 ficheros>`,
   medir y commitear c5b, y reaplicar con `git apply <patch>`; sin `git stash`. Cuenta de `it`: 0
   (reescribe en su sitio).
3. **Verificado.** No hay más inventarios de imports de los ficheros de producción de esta feature:
   `git grep -nE "matchAll\(/from|match\(/\^import|importa exactamente|solo importa"` sobre los tests
   solo da `empty-state.test.tsx` (los de `design-drift` miran `reicon-react-native` en Horario y el
   historial, fuera de alcance, y el de `weekly-activity-chart` mira otro fichero).

## Enmienda E4 (2026-10-19, hallada por Codex en c10)

R3 manda `rounded-16` en el botón primario y el neutro de `screens/docs-upload-form/index.tsx`. El
`it` «usa solo los radios card, xl, full y 24» de `#175 R10` (`design-drift.test.ts`, regex
`/\brounded-(?!(?:card|xl|full|24)\b)[\w-]+/` sobre `screens/docs/index.tsx` y
`screens/docs-upload-form/index.tsx`) cae con ese radio. R10 lo omitió: su grep de H0 localiza por
receta antigua, y este candado es una lista blanca de radios, no una aserción de la receta. Codex
paró en c10 conforme al handoff (`design-drift`: 1 failed, 112 passed, 113 total).

1. **Qué cambia.** Punto 14 de R10: la lista blanca de ese `it` gana `16`
   (`(?:card|xl|full|24|16)`) y el título pasa a «usa solo los radios card, xl, full, 24 y 16». Es un
   aflojamiento de un radio, el que R3 exige; `docs/index.tsx` no usa `rounded-16`.
2. **Cómo se aplica.** Un commit de test propio antes del feat de G3
   (`test(#177 R10): lista blanca de radios de #175 R10 admite 16 (R10)`). Es **NV, aflojamiento
   declarado** (admite un radio que el fichero ya usa por el código de G3 en el árbol sin commit; no
   hay rojo previo que medir sin `git checkout`). Cuenta de `it`: 0.
3. **Verificado.** Barrido de los guards con G3 en el árbol: `legibility-classnames`, `ui-language`,
   `no-pets-states`, `profile-canvas-fidelity`, `heroui-text-size-merge`, `account-screens-polish` y
   `alert-detail-canvas-fidelity` en verde; `consistency-classnames` (#166 R4, carta) y
   `chunky-cta-canvas-fidelity` (R11.1 a R11.5) caen solo por la carta, que cierra c11. Ninguna otra
   lista blanca de radios: `git grep -nE "rounded-\(\?!"` sobre los tests solo da esta.

## Gate humano de cierre

- [ ] Enmienda #177 aprobada por humano (carta y #166; fecha: ____)
- [x] Enmienda E1 aprobada por humano (inventarios de imports de empty-state; fecha: 2026-10-19)
- [x] Enmienda E4 aprobada por humano (lista blanca de radios de #175 R10; fecha: 2026-10-19)
- [ ] Smoke R14 en dev build de Android hecho por el humano (fecha: ____)
