---
feature: mobile-canvas-collar-alerts
id: 203
status: approved
---

# #203 mobile-canvas-collar-alerts — Diseño

## Decisiones

1. **Cabecera en contenido en las tres rutas.** `pairing`, `alerts` y
   `alerts/[alertId]` adoptan `ScreenHeader` y su `Stack.Screen` pasa a
   `headerShown: false` (punto 7 de la Enmienda #197). El detalle conserva su
   `contentStyle` (#170 R9). Sin cabecera nativa, el contenido arranca en
   `paddingTop: insets.top + 8` (56 del artboard ≈ barra de estado + 8; mismo
   valor que #199 D2) y el `KeyboardAvoidingView` de pairing usa
   `keyboardVerticalOffset={0}` y deja de leer `HeaderHeightContext`.
2. **testIDs del `ScreenHeader` elegidos para no mover candados.** En alertas
   `testID="alerts"` y en el detalle `testID="alert-detail"`: el título sale
   como `alerts-title` y `alert-detail-title`, los mismos testIDs de hoy. En
   pairing, `testID="pairing-header"` sin título (el título vive en el hero).
3. **Mascota en la cabecera de Vincular.** El avatar de la mascota
   (`pairing-pet-avatar`, #188 R17) pasa a ser el `accessory` de la cabecera en
   la vista de vincular; desaparece su fila envoltorio `pairing-pet-row`. En la
   vista con collar la cabecera no lleva accesorio y el `PetSwitcher` se queda
   donde está (D1 de §Decisiones con defecto).
4. **Hoja de desvincular en línea.** `Alert.alert` se sustituye por la hoja
   inferior del artboard `VincularDesvincular`, montada con
   `BottomSheet`/`BottomSheetView` de `@expo/ui/community/bottom-sheet` (ya
   instalado, mismo patrón y mismo doble de test que `screens/reminders`). No se
   crea componente compartido (D3).
5. **`RiseIn` sustituye a `HomeEntrance`** en alertas (filas) y detalle (tarjeta y
   mapa), con los retardos literales del canvas; pairing gana `RiseIn` en las
   tres capas que el artboard anima. `HomeEntrance` no cambia (Inicio lo sigue
   usando).
6. **Celebración ya está a la par.** Tras el barrido de `tracking-tight` de
   #197, `components/celebration.tsx` coincide con `Celebracion.dc.html` en
   todo lo medible (36 piezas de confeti con su `left`, tamaño, duración y
   retardo; hero 220; Pingo 170; insignia 56 con borde 4; retardos 500/580/660/740;
   `paddingTop: insets.top + 80`). Esta feature no la toca: solo añade el
   candado de fidelidad contra el artboard congelado (R12), que nace verde y se
   declara así.
7. **Copy: cero claves nuevas.** Todo literal del canvas ya existe en
   `i18n/catalog.ts` (ver requirements §Requisitos, columna «clave»). La hoja
   reutiliza `pairing.unpairAlertTitle`, `pairing.unpairAlertBody`,
   `pairing.unpair` y `pairing.cancel`, que hoy alimentan el `Alert.alert`.

## Ficheros por capa

Solo capa de presentación móvil (no hay dominio ni infraestructura nuevos):

| Fichero | Cambio |
|---|---|
| `src/app/_layout.tsx` | 3 líneas: `pairing`, `alerts`, `alerts/[alertId]` a `headerShown: false` |
| `src/screens/pairing/index.tsx` | `ScreenHeader`, avatar a la cabecera, `RiseIn`, vista con collar al canvas, hoja de desvincular |
| `src/screens/alerts/index.tsx` | `ScreenHeader` con la insignia como accesorio, `RiseIn` en filas, `paddingTop`; importa `ALERT_ROW_RISE_DELAYS` de `./rise-delays` |
| `src/screens/alerts/rise-delays.ts` | nuevo (R9): `export const ALERT_ROW_RISE_DELAYS = [0, 70, 140, 200, 260] as const;`, sin otros imports. Módulo ligero para que el test de R12 lea los retardos de producción sin cargar la pantalla (decisión del leader, 2026-10-24) |
| `src/screens/alert-detail/index.tsx` | `ScreenHeader`, `RiseIn` 0/80, `paddingTop` |
| `src/__tests__/collar-alerts-canvas-fidelity.test.ts` | nuevo (CF203): filas canvas ↔ producción |
| `src/screens/pairing/index.test.tsx`, `src/screens/alerts/index.test.tsx`, `src/screens/alert-detail/index.test.tsx`, `src/app/__tests__/layout.test.tsx`, `src/__tests__/canvas-foundations.test.ts` | tests nuevos y candados del inventario; los dobles de `RiseIn` (R3, R9, R11), de `reicon-react-native` (`ChevronLeft`, F31/F32) y de `expo-router` de pairing (`canGoBack`, F39) |
| `src/app/__tests__/alert-detail.navigation.test.tsx` | doble de `reicon-react-native` con `ChevronLeft` (F33, R8) |
| `src/__tests__/alerts-canvas-fidelity.test.ts`, `src/__tests__/profile-canvas-fidelity.test.ts`, `src/__tests__/chunky-cta-canvas-fidelity.test.ts` | listas y cuenta de los candados F34–F37 |

`components/celebration.tsx` no cambia. Además del módulo `rise-delays.ts`, el único cambio de producción fuera de las tres pantallas y `_layout.tsx` son los imports muertos que salen en el commit verde de su R (`HeaderHeightContext` y `useContext` tras R2; `Alert` tras R7).

## Piezas de #197 que se consumen

| Pieza | Dónde | Uso |
|---|---|---|
| `ScreenHeader` (`src/components/screen-header.tsx`) | las tres pantallas | `testID`, `backFallback`, `title?`, `size` por defecto 26, `accessory?` |
| `BackButton strokeWidth` | vía `ScreenHeader` (2.4) | sin uso directo |
| `RiseIn` (`src/components/rise-in.tsx`) | las tres pantallas | `RiseIn({ delayMs, testID?, className?, children })` |
| `useChunkyLip()` (`src/theme/chunky-lip.ts`) | pairing | claves `danger` (desvincular, hoja) y `neutral` (Cancelar), ya existentes |
| `useShadows()` (`src/theme/shadows.ts`) | pairing | clave `card` en `device-status-card` (canvas `box-shadow: var(--shadow)`) |
| `--tracking-title`, `--tracking-mono`, `--leading-note` | pairing | título 28, ESN, cuerpo de la hoja |
| `MOTION_RISE_OFFSET_Y`, `MOTION_RISE_TIMING` | vía `RiseIn` | 14 px, 400 ms ease-out = `rise 400ms ease-out` del canvas |

No se usa `ToggleSwitch` (ningún artboard de esta feature lo dibuja).

## Decisiones con defecto

Cada una queda cerrada; el humano puede cambiarla en el gate.

- **D1 — Cabecera de la vista con collar.** Defecto: `ScreenHeader` sin
  `accessory` (el artboard `VincularVinculado` no dibuja avatar) y el
  `PetSwitcher` se queda bajo la cabecera como hoy (#188 R17: selector completo
  fuera de la vista de vincular). El canvas no dibuja multi-mascota; quitarlo
  rompería el cambio de mascota.
- **D2 — `backFallback`.** Defecto: pairing `'/profile'` (se entra desde
  Perfil; ruta `src/app/(tabs)/profile.tsx`), alertas `'/'` (se entra desde la
  campana de Inicio) y detalle `'/alerts'`. Solo se usa sin historial
  (`router.canGoBack()` falso).
- **D3 — Hoja de desvincular en línea, sin componente compartido.** Defecto: la
  hoja vive en `screens/pairing/index.tsx` con `BottomSheet index={unpairOpen ? 0 : -1}
  enablePanDownToClose onClose={closeUnpair} snapPoints={['50%', '100%']}`
  (los mismos props que `reminders-delete`), dentro de un
  `View testID="pairing-unpair-host"`. Extraer un `ConfirmSheet` compartido con
  Recordatorios se descarta: tocaría `screens/reminders` (#198 mueve esa
  pantalla) y no lo pide ningún artboard. Riesgo de choque: ninguno.
- **D4 — Labio rojo en los dos destructivos del canvas.** Defecto:
  `device-unpair` y `pairing-unpair-confirm` llevan `style={chunkyLip.danger}`
  (variante ya creada por #197, `0 4px 0` `--color-lip-danger` = `#9F1F15` del
  artboard). La carta §13 «Sin labio» lista los destructivos `bg-danger`; esta
  feature añade la **Enmienda #203** a `docs/ui-guidelines.md` (texto literal en
  requirements R7) con su casilla en §Aprobación. El resto de destructivos
  (`reminders-delete-confirm`, `profile-sign-out`, `lost-mode-button`) sigue
  sin labio.
- **D5 — Verde de batería y conexión.** Defecto: el valor de `device-battery`
  va en `text-accent-strong` cuando `batteryPct !== null`; el de
  `device-connectivity` solo cuando `selectedPet.device.connectivity === 'online'`.
  El resto de casos (`—`, «Sin conexión», «Desconocido») conserva
  `text-foreground`: el canvas solo dibuja el estado en línea.
- **D6 — `flexGrow: 1` siempre.** Defecto: el `contentContainerStyle` de
  `pairing-form` lleva `flexGrow: 1` en todos los estados (hoy solo al vincular),
  porque la vista con collar también empuja su botón al fondo
  (`margin-top:auto` del artboard). Para que `device-unpair-spacer` (`flex-1`)
  empuje el botón, el `View` que lo contiene (el `gap-4` externo de la vista con
  collar) gana `style={{ flexGrow: 1 }}` con `className="gap-4"` (R6), como la vista de vincular; el `gap-4` de dentro de la tarjeta no cambia.
  En carga, error y vacío no cambia nada visible.
- **D7 — Celebración sin cambios.** Defecto: no se toca
  `components/celebration.tsx`; el interlineado del cuerpo (22 px frente a
  15 × 1.5 = 22.5 del artboard) queda como desviación. `motion.ts` no se toca.
- **D8 — Ruta y círculo discontinuo del mapa del detalle.** Defecto: no se
  dibujan. El artboard pinta un SVG estático; la app usa el mapa real
  (`PetMap`) y no tiene datos de recorrido. Desviación declarada.
- **D9 — #165 no se absorbe.** Defecto: sigue `pending`. Sus candados son de
  reintento y guarda de salida en `handleAck`/`onNotFound`, que esta feature no
  toca; necesitan un spike de RNTL 14 propio.
- **D10 — Título de Alertas dentro de `ScreenHeader`.** Defecto: el título deja
  de llevar `flex-1` en su `className` (el `flex-1` lo pone el envoltorio de
  `ScreenHeader`); la insignia «N nuevas» es el `accessory`. Se retira
  `alerts-title-row`.
- **D11 — testIDs de la hoja.** Defecto: prefijo `pairing-unpair-`
  (`-host`, `-sheet`, `-icon`, `-title`, `-body`, `-confirm`, `-cancel`),
  calcado de `reminders-delete-*`. Ningún selector por regex del árbol los
  captura (`grep -rnE "TestId\(/" src` revisado: solo `^pairing-content-skeleton-`,
  `^pet-chip-` y `^pairing-(ring-0|ring-1|pingo)$` en pairing).

## Alternativas descartadas

- **Botón de volver a mano en `alerts-title-row`** en vez de `ScreenHeader`:
  movía menos candados de Alertas, pero dejaba tres cabeceras distintas para la
  misma forma del canvas; la Enmienda #197 §7 fija `ScreenHeader` como la forma
  de D-H.
- **Mantener `Alert.alert`**: el artboard `VincularDesvincular` dibuja una hoja
  inferior con icono, cuerpo y dos botones con cuerpo; el diálogo nativo no
  puede pintarla.
- **`ConfirmSheet` compartido**: ver D3.
- **Dibujar la ruta del mapa con datos inventados**: ver D8.
- **Ajustar el interlineado de Celebración a 22.5** con un token nuevo: medio
  píxel no justifica un token ni tocar un fichero que hoy está a la par.

## Supuestos

Supuestos de entorno que los tests no ven; se comprueban en el smoke del humano
(requirements §Cierre del humano):

1. `paddingTop: insets.top + 8` deja la cabecera a la altura del artboard en un
   Android con barra de estado edge-to-edge (el test fija `insets.top` = 40).
2. La hoja de `@expo/ui/community/bottom-sheet` abre a media pantalla con el
   contenido entero visible y se cierra deslizando hacia abajo, igual que la de
   Recordatorios; el doble de test no ve ni la altura ni el gesto.
3. El labio de `chunkyLip.danger` cuelga 4 px bajo los dos botones rojos sin
   recortarse (el doble no pinta sombras).
4. `RiseIn` respeta «reducir movimiento» del sistema (lo prueba #197 R24; aquí
   solo se observa en el dispositivo).
5. Sin cabecera nativa, el gesto de volver de Android y el botón `-back` hacen
   lo mismo en las tres pantallas.
6. La vista con collar de pairing (`className="gap-4" style={{ flexGrow: 1 }}`, R6,
   como la vista de vincular) empuja `device-unpair` al fondo en un teléfono pequeño
   y con la píldora y la tarjeta más altas de lo normal. El test solo ve `className`
   y `style`; lo confirma el smoke del humano.
