# Implementación mobile-canvas-zones (#202)

Estado de cierre (2026-10-24): R1–R25 implementados con verdes focales y sondas; cierre global bloqueado por Home #190 R5. No hay marcador .done. La primera parada de R7 que figura abajo es histórica y está resuelta por la errata 4c067d76.

Cierre medido: 144 suites / 4747 tests; suite completa 141 suites y 4744 tests verdes, 3 rojos. Los dos timeouts pasan aislados sin flag (GE 143/143 y GZ 118/118); queda sin resolver Home #190 R5. Las 12 guardas pasan. Typecheck y lint finales exit 0, log de lint vacío. No se ejecutó init.sh.

Base comprobada: `/home/claude/sites/Pet-Tracker-wt-202`, rama `feature/202-mobile-canvas-zones`, HEAD `af55f048`.

Desviaciones de arranque: el comando de comprobación se ejecutó después de leer el handoff, la skill ponytail y el estado de Git, que permitieron conocer esa instrucción. Tres invocaciones del recolector de anclas dividieron incorrectamente comentarios; se corrigió la invocación sin tocar código. No se ha ejecutado `./init.sh`. No se hará push ni PR.

## Anclas T0

```text
$ test -e src/components/toggle-switch.tsx && echo existe
existe

$ test -e src/components/screen-header.tsx && echo existe
existe

$ test -e src/theme/shadows.ts && echo existe
existe

$ test -e src/components/rise-in.tsx && echo existe
existe

$ grep -cF 'export function RiseIn({ delayMs, testID, className, children }' src/components/rise-in.tsx
1

$ grep -cF "header-layout" src/screens/geofences/index.tsx
1

$ grep -cF "HEADER_ROW_TOP" src/screens/geofences/index.tsx
2

$ grep -cF "ZONES_TITLE_OFFSET" src/screens/geofences/index.tsx
2

$ grep -cF "AlertCircle" src/screens/geofences/index.tsx
2

$ grep -cF "<Map " src/screens/geofences/index.tsx
1

$ grep -cF "<Switch" src/screens/geofences/index.tsx
1

$ grep -cF "bg-danger-soft" src/screens/geofences/index.tsx
1

$ grep -cF "Alert.alert" src/screens/geofences/index.tsx
1

$ grep -cF 'testID="geofences-title"' src/screens/geofences/index.tsx
1

$ grep -cF "text-26" src/screens/geofences/index.tsx
1

$ grep -oF "<Skeleton" src/screens/geofences/index.tsx | wc -l
1

$ grep -oF "<Skeleton" src/screens/geofence-editor/index.tsx | wc -l
1

$ grep -cF "ScreenHeader" src/screens/geofences/index.tsx
0

$ grep -cF "ToggleSwitch" src/screens/geofences/index.tsx
0

$ grep -cF "ConfirmDialog" src/screens/geofences/index.tsx
0

$ grep -cF "leading-note" src/screens/geofences/index.tsx
0

$ grep -cF "react-native-svg" src/screens/geofences/index.tsx
0

$ grep -cF "header-layout" src/screens/geofence-editor/index.tsx
1

$ grep -cF "Stack.Screen" src/screens/geofence-editor/index.tsx
2

$ grep -cF "TRANSPARENT_HEADER_OPTIONS" src/screens/geofence-editor/index.tsx
2

$ grep -cF "EDITOR_PILL_LEFT" src/screens/geofence-editor/index.tsx
2

$ grep -cF "<Switch" src/screens/geofence-editor/index.tsx
1

$ grep -cF "Alert.alert" src/screens/geofence-editor/index.tsx
1

$ grep -cF "h-14" src/screens/geofence-editor/index.tsx
2

$ grep -cF "text-26" src/screens/geofence-editor/index.tsx
1

$ grep -cF "rounded-16" src/screens/geofence-editor/index.tsx
2

$ grep -cF "ScreenHeader" src/screens/geofence-editor/index.tsx
0

$ grep -cF "useShadows" src/screens/geofence-editor/index.tsx
0

$ grep -cF "RiseIn" src/screens/geofence-editor/index.tsx
0

$ grep -cF "leading-body" src/screens/geofence-editor/index.tsx
0

$ grep -cF "headerShown" src/app/_layout.tsx
2

$ grep -cF "TRANSPARENT_HEADER_OPTIONS" src/app/_layout.tsx
2

$ grep -cF "header-layout" src/app/_layout.tsx
1

$ grep -cF "'geofences.loadingLabel'" src/i18n/catalog.ts
0

$ grep -cF "'geofenceEditor.loadingLabel'" src/i18n/catalog.ts
0

$ grep -rlF "theme/header-layout" src | wc -l
6

$ grep -oF "t('geofences.title'" src/screens/geofences/index.tsx | wc -l
1

$ grep -oF "t('geofenceEditor.title'" src/screens/geofence-editor/index.tsx | wc -l
2

$ grep -oF "t('geofences.deleteTitle'" src/screens/geofences/index.tsx | wc -l
1

$ grep -oF "t('geofences.deleteBody'" src/screens/geofences/index.tsx | wc -l
1

$ grep -oF "t('geofences.cancel'" src/screens/geofences/index.tsx | wc -l
1

$ grep -oF "t('geofences.delete'" src/screens/geofences/index.tsx | wc -l
1

$ grep -oF "t('geofences.deleteTitle'" src/screens/geofence-editor/index.tsx | wc -l
1

$ grep -oF "t('geofences.deleteBody'" src/screens/geofence-editor/index.tsx | wc -l
1

$ grep -oF "t('geofences.cancel'" src/screens/geofence-editor/index.tsx | wc -l
1

$ grep -oF "t('geofences.delete'" src/screens/geofence-editor/index.tsx | wc -l
2

$ grep -oF "style={CONTINUOUS_CORNER}" src/screens/geofences/index.tsx | wc -l
3

$ grep -oE "\bCONTINUOUS_CORNER\b" src/screens/geofence-editor/index.tsx | wc -l
2

$ test -e src/theme/header-layout.ts && echo existe
existe

$ test ! -e src/components/confirm-dialog.tsx && echo ausente
ausente

$ test ! -e src/components/__tests__/confirm-dialog.test.tsx && echo ausente
ausente

$ test ! -e src/__tests__/zones-canvas-fidelity.test.ts && echo ausente
ausente

$ test ! -e .expo/types/router.d.ts && echo sin-router-d-ts
sin-router-d-ts

$ grep -cF "toHaveLength(18 + 1 + 1 + 1 + 1)" src/__tests__/ui-language.test.ts
1

$ grep -cF "toHaveLength(27 - 1 + 2 + 3)" src/__tests__/ui-language.test.ts
1

$ grep -cF "+ 7, // #194 R1 (+2); #189 R15 (+5)" src/providers/__tests__/language-provider.test.tsx
1

$ grep -cF "'screens/geofence-editor/index.tsx': 3, // #189 R13" src/__tests__/design-drift.test.ts
1

$ grep -cF "'screens/geofence-editor/index.tsx': 3, // #189 R13" src/__tests__/chunky-cta-canvas-fidelity.test.ts
1

$ grep -cF "toBe(26 + 1 + 1 + 1 + 2);" src/__tests__/chunky-cta-canvas-fidelity.test.ts
1

$ grep -cF "'flex-2 h-14 rounded-16 bg-accent'" src/__tests__/chunky-cta-canvas-fidelity.test.ts
1

$ grep -cF "'flex-1 h-14 rounded-16 border-2 border-lip-gray bg-surface'" src/__tests__/chunky-cta-canvas-fidelity.test.ts
1

$ grep -cF "style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }]}" src/__tests__/consistency-classnames.test.ts
1

$ grep -cF "['components/card.tsx', 'screens/alert-detail/index.tsx', 'screens/profile/index.tsx']" src/__tests__/profile-canvas-fidelity.test.ts
1

$ grep -cF "'screens/geofences/index.tsx', // #189 R1" src/__tests__/profile-canvas-fidelity.test.ts
1

$ grep -cF "'screens/geofence-editor/index.tsx', // #189 R8" src/__tests__/profile-canvas-fidelity.test.ts
1

$ grep -cF "'screens/geofences/index.tsx', // #189 R1" src/__tests__/alerts-canvas-fidelity.test.ts
1

$ grep -cF "'screens/geofence-editor/index.tsx', // #189 R8" src/__tests__/alerts-canvas-fidelity.test.ts
1

$ grep -cF "'screens/geofence-editor/index.tsx', // #189 R12" src/__tests__/alerts-canvas-fidelity.test.ts
1

$ grep -cF "'components/celebration.tsx'," src/__tests__/alerts-canvas-fidelity.test.ts
2

$ grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts
1

$ grep -cF "export const MOTION_TRANSITION_MS = 250;" src/theme/motion.ts
1

$ bun -e "console.log(Object.keys(require('./package.json').dependencies).length)"
44
```

## Preparación

Skills cargadas: ponytail, building-native-ui, expo-tailwind-setup, appllama-app-design-skill y animate-expo. No disponibles: expo-overview, expo-animation, expo-router, expo-design-system (según handoff); MCP Appllama ausente. Consultada documentación Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/. Carta y spec prevalecen.

Varias lecturas de rutas glob/inexistentes y una edición con un directorio de trabajo incorrecto dieron ENOENT; se corrigieron las invocaciones sin cambios de código derivados de esos errores.

## R7 en curso

CF `describe('#197 R20: cimientos sin cablear')` existía y se borró entero: -5 tests. CD usa stub permitido `export function ConfirmDialog() { return null; }` para que los rojos sean aserciones. El test invisible nace verde y se demostrará por mutación.

## Enmiendas mecánicas

| Candado | Antes | Después | R |
|---|---|---|---|
| GE #189 R22.1 (3 casos) | hijo geofence-editor-form | hijo geofence-editor-form-entrance | R13: enmienda mecánica por literal exacto; las opciones transparentes se conservan |
| Chunky #177 R4.1, fila Editor | onPress={confirmDelete} | onPress={() => setDeleteVisible(true)} | R9: enmienda mecánica tardía del literal exacto retirado; producción no cambia |

## R26 — Cierre del humano en dev build Android

Pendiente del humano tras el reviewer. Ejecutar los ocho puntos en tema claro y oscuro:

1. Zonas: volver llega a Perfil (sin historial, `/profile`); título y contador comparten fila; no aparece cabecera nativa.
2. Formulario del Editor: círculo de cristal y píldora con sombra sobre el mapa; volver llega a Zonas.
3. Estados del Editor: cabecera en contenido con volver, sin cabecera nativa duplicada.
4. Borrado en Zonas y Editor: velo con fade y tarjeta con rise; atrás de Android y velo cierran sin borrar; Eliminar borra.
5. Interruptores de 48 × 28 en las filas y en Activa.
6. Esqueletos de Zonas y Editor con red lenta.
7. Hoja y teclado: el nombre sigue visible mientras se escribe.
8. Reducir movimiento: sin animaciones de entrada.

Primer rojo de R7: 10 failed / 116 passed / 126 total. Se detectó uso de una API de consulta retirada de RNTL 14 en el test nuevo; se sustituyó por `screen.root` antes de crear el commit rojo. Los otros nueve fallos eran aserciones previstas. Ningún candado ajeno falló.

R7 rojo confirmado: `cd3aa980 test(#202): R7 lock the shared canvas confirmation dialog`. Tests: 9 failed, 117 passed, 126 total (5 suites). Todos los fallos son aserciones previstas. CD invisible nace verde. Delta de tests contra H0: +8 nuevos −5 retirados = +3.

R7 ajuste del test: `7f198849 test(#202): R7 account for Reanimated style arrays`; la primera ejecución verde dio Tests: 1 failed, 125 passed, 126 total por la representación en array del estilo de Reanimated. Se usa `toHaveStyle` para normalizarla. Después: Tests: 126 passed, 126 total (5 suites).

R7 sondas: sin guard de visible, handlers de cancelar/velo/atrás/confirmar vacíos, fade constante aun con reduce motion, duración 249, rounded-hero→rounded-tile y text-15→text-base. CD: sus 7 tests fallan por aserción, incluido invisible que nació verde; ZF R7 y los dos inventarios enmendados fallan. También cae rounded-tile por la mutación intencional; no se enmienda. Tests: 11 failed, 50 passed, 61 total. Mutaciones revertidas; cinco suites otra vez en verde, Tests: 126 passed, 126 total.

R7 verde: `2590c582 feat(#202): R7 add the shared canvas confirmation dialog`.

## R1 en curso

Rojo: `c5a45651 test(#202): R1 lock the zones content header`. Tests: 18 failed, 137 passed, 155 total (3 suites). Todos son las aserciones previstas: los nuevos casos y los candados del inventario.

Enmiendas: GZ métricas 46→52 y suma literal 40+12; título pasa a `geofences-header-title` anidado y receta de ScreenHeader; contador último de tres hijos; estados sin contador y con dos envoltorios. Profile text-26 y alerts tracking-title quitan Geofences. Import de header-layout eliminado del test. Doble expo-router de GZ añade `canGoBack` (false), `back` y `replace` para pulsar el volver en las cinco ramas y verificar `/profile`. +6 tests.

## Bloqueo: discrepancia R7 frente al canvas congelado

Detectada al revisar la fidelidad después del verde de R1, antes de comenzar R3:

- `specs/mobile-canvas-zones/requirements.md:323`, R7.1, exige `View testID={testID} className="flex-1 justify-center px-6"` (24 px horizontales).
- `specs/mobile-canvas-zones/canvas/ZonasEliminar.dc.html:44`, el velo que centra y contiene la tarjeta, fija `padding: 0 28px`.
- La implementación de R7 y CD siguieron la receta literal de la spec, `px-6`; no coinciden con los 28 px del artboard. Esta desviación no figura en requirements § Desviaciones conscientes del canvas.

El handoff fija: «si discrepan con otra fuente, manda la copia congelada y avisas» y «Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta». Por ello se detiene la implementación, sin cambiar la spec aprobada ni el canvas y sin empezar R3. El leader debe alinear R7 con los 28 px congelados antes de continuar. El conflicto se detectó después de implementar R7: se deja explícito; no se declara completado R7 frente al canvas.

La segunda ejecución de R1 tras revertir sondas ya estaba en espera de Jest ajeno cuando se detectó el conflicto; solo se cierra ese paso iniciado y se documenta el bloqueo.

R1 sondas: paddingTop 12→6, fallback /profile→/welcome, título 26→24, contador con text-26/tracking-title y contador espurio en estados sin lista. Rojo de cada candado enmendado y de los seis casos nuevos: Tests: 19 failed, 136 passed, 155 total. También cae el orden de family-three por la mutación intencional; no se enmienda. Se restauró exactamente la fuente que había dado Tests: 155 passed, 155 total.

## Verificación pendiente por la primera parada (histórico, sustituido por el cierre posterior)

No se ejecutan `./init.sh`, suite móvil completa, typecheck, lint, graphify ni cierre agregado: el handoff impide continuar ante esta discrepancia. No se modifican package.json, bun.lock ni app/_layout.tsx frente a H0. No se hace push ni PR. No se crea `progress/impl_mobile-canvas-zones.done`: el trabajo completo no terminó.

R1 verde tras restauración: `2a352007 feat(#202): R1 render the zones header in content`. Tests: 155 passed, 155 total (3 suites). No quedan mutaciones plantadas.

## Estado al detenerse (2026-10-24)

| R | Tests | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | GZ #202 R1 (6 casos); inventarios profile y alerts; candados GZ enmendados | c5a45651 | 2a352007 | Verificado, sin cierre global |
| R2 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R3 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R4 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R5 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R6 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R7 | CD #202 R7 (7 casos), ZF #202 R7; inventarios profile y alerts | cd3aa980; 7f198849 (ajuste de normalización del test) | 2590c582 | Verde contra la spec; conflicto 24/28 px pendiente |
| R8 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R9 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R10 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R11 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R12 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R13 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R14 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R15 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R16 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R17 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R18 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R19 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R20 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R21 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R22 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R23 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R24 | No ejecutados | — | — | Pendiente por bloqueo R7 |
| R25 | No ejecutados | — | — | Pendiente por bloqueo R7 |

### Commits creados

```text
cd3aa980 test(#202): R7 lock the shared canvas confirmation dialog
7f198849 test(#202): R7 account for Reanimated style arrays
2590c582 feat(#202): R7 add the shared canvas confirmation dialog
c5a45651 test(#202): R1 lock the zones content header
2a352007 feat(#202): R1 render the zones header in content
```

Líneas Tests de verificación por commit:

- cd3aa980: Tests: 9 failed, 117 passed, 126 total (rojo previsto).
- 7f198849: Tests: 126 passed, 126 total (normalización del estilo; producción aún sin commitear).
- 2590c582: Tests: 126 passed, 126 total (verde y mutaciones revertidas).
- c5a45651: Tests: 18 failed, 137 passed, 155 total (rojo previsto).
- 2a352007: Tests: 155 passed, 155 total (verde y mutaciones revertidas).

Base de suite completa aportada por el leader: 4683 tests. Delta de estos pasos: +7 CD +1 ZF −5 CF +6 GZ = +9. No se ha medido una suite completa de 4692: solo son las cuentas de altas/bajas y las ejecuciones parciales indicadas.

### Ficheros de app/docs tocados desde H0

```text
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/zones-canvas-fidelity.test.ts
mobile-pet-tracker/src/components/__tests__/confirm-dialog.test.tsx
mobile-pet-tracker/src/components/confirm-dialog.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
```

Todos pertenecen a la lista cerrada del handoff. `git diff af55f048 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/app/_layout.tsx` está vacío. La lista no incluye specs/ ni progress/, como pide el handoff.

Pendientes R3→R4→R5→R6→R8→R9→R10→R11→R12→R13→R14→R15→R16→R17→R18→R19→R2→R20→R21-R24→R25 y el cierre. No se continúa hasta que el leader resuelva la discrepancia de R7.

## Reanudación 1 — 2026-10-24

Primer comando: ruta `/home/claude/sites/Pet-Tracker-wt-202`, rama `feature/202-mobile-canvas-zones`, HEAD `4c067d76`, coincidentes. Leída la errata aprobada del leader: raíz del diálogo px-7 (28 px), tarjeta px-6. Se conserva el historial del bloqueo. Se reanuda con los dos commits de R7.1 y después R3; sin reescribir commits anteriores, init, push ni PR.

R7.1 errata resuelta: `e083cb06` rojo (Tests: 1 failed, 7 passed, 8 total; solo px-6/px-7); `ca15f85a feat(#202): R7 inset the dialog 28 px like the canvas` verde (Tests: 8 passed, 8 total). No cambian los tests totales. La sonda inicial del margen exterior es el propio estado anterior px-6, visto rojo; la tarjeta mantiene px-6.

## R3

Rojo: 47643ab6. Verde: 097959b1 feat(#202): R3 render the canvas zone glyph. +2 tests. GZ añade un doble de SVG que conserva las props y los dos Circle. Se retira Map del doble de reicon; las tres filas antiguas de GZ usan stroke del glifo (incluidas cinco posiciones y family), GF espera AlertCircle y Trash. Una sustitución inicial de color→stroke alcanzó el aviso; se deshizo antes del commit rojo.

red: Tests:       6 failed, 127 passed, 133 total

mutation: Tests:       6 failed, 127 passed, 133 total

green: Tests:       133 passed, 133 total

Sondas: width 22→21, tinta equivocada solo en posición 1 y Map importado de nuevo. Cada candado enmendado y ZF fallaron; revertidas; verde restablecido.

## R4

Rojo: f46cbd3b. Verde: 42993f4c feat(#202): R4 use the canvas ToggleSwitch in both zone screens. +3 tests. GZ verifica ambos active invertidos; GE espera el checked visible de la zona recargada. GF amplía la lista Switch/ToggleSwitch/Button manteniendo las cuentas 2/3: nace verde, su sonda elimina KEEP_OPACITY en ambos ToggleSwitch. ZF se prueba reintroduciendo Switch solo en el Editor.

red: Tests:       3 failed, 253 passed, 256 total

mutation: Tests:       7 failed, 249 passed, 256 total

green: Tests:       256 passed, 256 total

Sondas revertidas antes del verde y del commit.

Guardas tras R4: 12 suites, Tests: 507 passed, 507 total. Sin enmiendas adicionales de recuentos.

## R5

18918880 feat(#202): R5 match the canvas zone limit notice

GZ enmienda #189 R6 en es/en; GF renombra el inventario y espera AlertTriangle y Trash, filtrando Map/AlertCircle/AlertTriangle/Trash. El doble conserva geofences-icon-alert. +2 tests. Sondas: icono anterior y leading-body en el aviso; detectadas por todos los candados enmendados y ZF.

red: Tests:       5 failed, 132 passed, 137 total

mutation: Tests:       5 failed, 132 passed, 137 total

green: Tests:       137 passed, 137 total

Sondas revertidas y verde restablecido antes del feat.

## R6

36edd873 feat(#202): R6 use rose for zone trash backgrounds

Enmiendas GZ #41 R7 y #189 R5: bg-danger-soft→bg-category-rose. +2 tests. Producción interpola CATEGORY_SLOTS.rose.surface; conserva CONTINUOUS_CORNER y ausencia de hitSlop. Sonda amber en la papelera; todos los candados enmendados y ZF fallan.

red: Tests:       4 failed, 107 passed, 111 total

mutation: Tests:       4 failed, 107 passed, 111 total

green: Tests:       111 passed, 111 total

Sondas revertidas y verde restablecido antes del feat.

## R8

cff043d0 feat(#202): R8 confirm zone deletion with the canvas dialog

GZ #41 R7 y #189 R5 migran de Alert al diálogo y al estado final de la lista. El helper GZ alertButton se conserva y adapta para consultar el botón del diálogo; se retira su espía de Alert. +4 tests. El candado de bloqueo nació verde: la sonda permite pulsar papeleras durante busy. También se plantaron handlers de confirmar/cancelar vacíos y título incorrecto; cada candado enmendado cayó.

red: Tests:       10 failed, 100 passed, 110 total

mutation: Tests:       11 failed, 99 passed, 110 total

green: Tests:       110 passed, 110 total

Sondas revertidas y verde restablecido antes del feat.

## R9

804f3ccd feat(#202): R9 confirm editor deletion with the canvas dialog

GE #146 R14 y rama eliminar de #189 R19.2 consultan y pulsan el diálogo. Se borra el helper alertButton y se añade confirmEditorDelete que espera la tarjeta. Se retiran los espías de Alert. +5 tests, incluidos es/en y cancelar/velo. Sondas: handlers vacíos, título incorrecto y pérdida de KEEP_OPACITY del interruptor para cubrir las tres filas de #189 R19.2; todos los candados enmendados fallan.

red: Tests:       12 failed, 114 passed, 126 total

mutation: Tests:       14 failed, 112 passed, 126 total

green: Tests:       126 passed, 126 total

Sondas revertidas y verde restablecido antes del feat.

## R10

b21e37e0 feat(#202): R10 render two accessible zone loading rows

GZ sustituye el esqueleto plano por dos Card con cinco Skeleton cada uno; escritos una vez en [0,1].map. +3 tests. R14_GEOFENCES 22→23; catálogo +1 clave en cada idioma, UL y provider enmendados. SCREEN_FILES no cambia. Sondas: solo segunda fila con ancho 54%, raíz gap-2, clave de carga equivocada y clave extra temporal en ambos catálogos; cubren cada candado enmendado y ZF.

red: Tests:       6 failed, 197 passed, 203 total

mutation: Tests:       7 failed, 196 passed, 203 total

green: Tests:       203 passed, 203 total

Sondas revertidas y verde restablecido antes del feat.

## R11

398cb54c feat(#202): R11 match canvas typography for zone errors

+4 tests. GZ #41 R5 (tres fallos de carga) y #41 R6 (cuatro de escritura) esperan text-15 leading-body text-danger. Inventario alerts text-15 añade Geofences. Sonda aislada: solo carga vuelve a 14 mientras el error de acción conserva 15; ZF detecta la pérdida de una de las dos recetas. Sonda conjunta: ambas vuelven a 14 para cubrir cada candado enmendado, incluido el inventario.

red: Tests:       12 failed, 137 passed, 149 total

mutation: Tests:       12 failed, 137 passed, 149 total

green: Tests:       149 passed, 149 total

Sondas revertidas y verde restablecido antes del feat.

## R12

a7612dc1 feat(#202): R12 add the floating glass back button and title shadows

+4 tests. GE #189 R8 enmienda sus seis combinaciones formulario/idioma/tema. Se retira su import de header-layout; el de producción conserva TRANSPARENT_HEADER_OPTIONS hasta R17. GE router añade canGoBack(false) y replace: se pulsa volver en crear/editar/lectura y se comprueba el fallback a las zonas de pet-1. Sombras card comprobadas con literales y los tokens que devuelve el doble existente. Sonda aislada: solo la píldora pierde sombra, el volver la conserva; ZF cae. Sonda de top +7: detectada por los seis candados enmendados.

red: Tests:       10 failed, 127 passed, 137 total

mutation: Tests:       10 failed, 127 passed, 137 total

green: Tests:       137 passed, 137 total

Sondas revertidas y verde restablecido antes del feat.

## R13

f6da1bcd feat(#202): R13 wrap the editor sheet in RiseIn with sheet shadow

+4 tests. GE #146 R6 y #189 R9 cambian hijo directo y clase de hoja; CC #189 R9 añade shadows.sheet. Se conserva el shrink firmado por el leader y el estilo exacto de la hoja. Enmienda mecánica GE #189 R22.1: mismo literal de hijo directo en tres casos, sin alterar opciones de cabecera (se retirará el describe en R17). Sonda aislada quita shrink; ZF cae. Sonda conjunta cambia testID del envoltorio y retira shadows.sheet: todos los candados enmendados caen.

red: Tests:       12 failed, 204 passed, 216 total

mutation: Tests:       12 failed, 204 passed, 216 total

green: Tests:       216 passed, 216 total

Sondas revertidas y verde restablecido antes del feat.

## R14

8d6acb88 feat(#202): R14 use canvas typography for the zone name

+3 tests. El input añade text-base font-semibold delante del sufijo existente, que conserva altura, radio y padding. Sonda font-normal en ese input; ZF y ambas ramas crear/editar fallan.

red: Tests:       3 failed, 141 passed, 144 total

mutation: Tests:       3 failed, 141 passed, 144 total

green: Tests:       144 passed, 144 total

Sondas revertidas y verde restablecido antes del feat.

### Enmienda mecánica R9 detectada antes de R15

71aac698 test(#202): R9 amend the editor delete CTA binding lock

El candado neutro antiguo fallaba únicamente por el literal del handler que R9 sustituyó. Se ajusta en commit propio sin reescribir historia ni cambiar producción. No cambia el número de tests.

red: Tests:       1 failed, 77 passed, 78 total

mutation: Tests:       1 failed, 77 passed, 78 total

green: Tests:       78 passed, 78 total

Sonda: solo el onPress del botón Eliminar pasa a noop, vista roja y revertida.

## R15

3c1c3180 feat(#202): R15 size editor actions at 54 px

+4 tests. GE #146 R8, #146 R14 y #189 R13 (ocho combinaciones de nombre/idioma y busy) esperan h-13.5. Chunky #177 R3.1/R4.1 cambia solo las dos filas del Editor. Sonda aislada: solo Guardar vacío vuelve a h-14, ZF detecta que falta una de las tres recetas; sonda conjunta de las tres alturas para cubrir cada candado enmendado.

red: Tests:       17 failed, 209 passed, 226 total

mutation: Tests:       17 failed, 209 passed, 226 total

green: Tests:       226 passed, 226 total

Sondas revertidas y verde restablecido antes del feat.

## R16

21b58dd1 feat(#202): R16 match canvas text sizes and leading in the editor form

+5 tests. GE #146 R8 (8 errores), #146 R16 (4 roles) y #189 R11 radio en lectura enmendados. Carga conserva su texto antiguo hasta R19. ZF recorta cada tag por testID único. Sonda aislada: solo la nota de lectura pierde leading-body y la de reinicio lo conserva, ZF cae; sonda conjunta de leading y tamaño del radio cubre todos los candados enmendados.

red: Tests:       18 failed, 135 passed, 153 total

mutation: Tests:       18 failed, 135 passed, 153 total

green: Tests:       153 passed, 153 total

Sondas revertidas y verde restablecido antes del feat.

### R17 en curso — bootstrap de test

Se borra el describe GE #189 R22 entero (11 casos, incluidos los 3 temporalmente enmendados por R13). Desviación operativa: se conserva el doble de Stack durante el rojo, aunque el handoff pide retirarlo ahí. Retirarlo antes de quitar Stack.Screen de producción causaría TypeError en render y violaría el requisito de rojo por aserción. Tras el feat verde se retirará en un commit de test propio, sin mezclar implementación y tests ni reescribir historia. El mockStackScreen solo sirve de bootstrap; no se conserva ningún candado de opciones.

## R17

4f5f0637 feat(#202): R17 render shared editor state headers and canvas cards

+9 tests y -11 del describe #189 R22 eliminado: delta neto -2. GE #146 R6 carga cambia métricas (barras aún antiguas), #189 R8 plano y #189 R14 cambian a cabecera en contenido, #146 R16 solo dueño cambia padding. Profile text-26 y alerts tracking-title retiran Editor. ScreenHeader se escribe una vez en estados; desaparecen Stack.Screen, header-layout y la configuración opaca. Sonda aislada: solo tarjeta sin collar pierde padding24, las otras dos lo conservan y ZF cae; conjunta: ID de cabecera, inset, padding y tokens de título antiguos para cubrir todos los candados. El doble Stack se conserva temporalmente para el rojo por aserción y se retira a continuación.

red: Tests:       23 failed, 181 passed, 204 total

mutation: Tests:       23 failed, 181 passed, 204 total

green: Tests:       204 passed, 204 total

Sondas revertidas y verde restablecido antes del feat.

R17 bootstrap retirado: fbea47b3 test(#202): R17 remove the obsolete Stack mock. El doble GE de expo-router solo exporta router; no queda mockStackScreen ni describe de opciones. Sin cambio en número de tests. Tests:       138 passed, 138 total

### Corrección de API de R7 detectada por typecheck durante R18

El chequeo anticipado `test ! -e .expo/types/router.d.ts && bun run typecheck` falló con TS2345/TS2367 en el doble nuevo de Uniwind (sobrecarga getCSSVariable) y TS2769 en `role="header"` del título. React Native 0.86 define `role` con `heading`, y el patrón del ScreenHeader compartido usa `accessibilityRole="header"`. Se corrige el título a ese atributo nativo válido conservando la semántica de encabezado pedida; desviación literal de nombre de atributo frente al ejemplo R7.4, sin cambio visual. El test verifica el atributo y la consulta por rol header. El doble de color se mueve al hook de colores del repo (patrón ya usado por GZ/GE), conservando el literal RGBA de la sombra y sin doble de useShadows. Son cambios de implementación/test dentro de R7, no una modificación de la spec aprobada ni de los valores del canvas. Se harán test y feat separados antes de continuar el verde de R18.

## R7-API

1ca6234f feat(#202): R7 expose the dialog title with the native header role

Corrección de API dentro de R7. CD mantiene 7 tests. Sonda: accessibilityRole text en el título, roja por aserción y revertida.

red: Tests:       1 failed, 6 passed, 7 total

mutation: Tests:       1 failed, 6 passed, 7 total

green: Tests:       7 passed, 7 total

Sondas revertidas y verde restablecido antes del feat.

## R18

1672db90 feat(#202): R18 match the editor loading bars and accessible label

+3 tests nuevos. Las cinco enmiendas de inventario y el test antiguo de carga se vieron rojos por aserción (8 fallos). Esqueleto con tres barras y clave ES/EN con una fila de copy. Sonda aislada: solo barra 2 baja de 48 a 46 px, barra 0 conserva 48 y ZF cae; conjunta: gap, etiqueta, radio16 y clave temporal de catálogo para probar todos los candados enmendados.

red: Tests:       8 failed, 424 passed, 432 total

mutation: Tests:       9 failed, 423 passed, 432 total

green: Tests:       432 passed, 432 total

Sondas revertidas y verde restablecido antes del feat.

## R19

f2b7c425 feat(#202): R19 align loading errors with canvas text metrics

+2 tests; se enmiendan las tres filas de #146 R6 error. Sonda: revierte solo la clase del error de carga a text-danger, las cinco aserciones caen; copy y Reintentar conservados.

red: Tests:       5 failed, 137 passed, 142 total

mutation: Tests:       5 failed, 137 passed, 142 total

green: Tests:       142 passed, 142 total

Sondas revertidas y verde restablecido antes del feat.

## R2

8b91d4a8 feat(#202): R2 hide native zone headers and remove unused geometry

+2 tests y -4 casos de GF #189 R23 (describe completo). LY conserva los dos nombres antiguos con sufijo R2. ZF escanea todos los ts/tsx, incluido sí mismo, con aguja construida. Sonda tras borrar el fichero: ambas options headerShown true y una referencia textual temporal; ZF detecta la referencia sin depender de que exista el fichero. Rutas conservan su posición.

red: Tests:       4 failed, 66 passed, 70 total

mutation: Tests:       4 failed, 66 passed, 70 total

green: Tests:       70 passed, 70 total

Sondas revertidas y verde restablecido antes del feat.

## R20

2ba3083b feat(#202): R20 document zone content headers and canvas metrics

+1 test ZF. Cuatro tests de GF enmendados con los textos exactos aprobados. Sonda aislada: revierte solo la segunda frase de la papelera, conserva la primera y ZF detecta el literal antiguo; conjunta revierte todos los textos y los cinco tests caen. Se comprobó que el bloque canónico Punto 13 de CF solo cubre tres viñetas y no incluye la papelera: se descartó antes del commit una enmienda innecesaria de CF; CF queda intacto respecto al último commit, verde.

red: Tests:       5 failed, 100 passed, 105 total

mutation: Tests:       5 failed, 100 passed, 105 total

green: Tests:       105 passed, 105 total

Sondas revertidas y verde restablecido antes del feat.

## R21-R24

e30ee110 test(#202): R21-R24 conservation locks

+4 tests de conservación; los cuatro nacen verdes, sin feat. Sonda conjunta cambia los IDs de ambos vacíos, la receta de estado de solo lectura y el fondo de Guardar vacío; los cuatro tests nuevos deben caer por aserción y la producción queda restaurada.

mutation: Tests:       33 failed, 228 passed, 261 total

green: Tests:       261 passed, 261 total

Sondas revertidas y verde restablecido antes del feat.

## R25

1cf77769 test(#202): R25 lock zone source fidelity and dependency count

+4 tests (tres filas y manifiesto), todos nacen verdes, sin feat. Aislada: clase arbitraria en Zonas, hex en Editor y StyleSheet.create en diálogo: las tres filas caen. Conjunta: StyleSheet.create en los tres y una dependencia existente retirada temporalmente (44→43, sin instalar ni cambiar lock): las cuatro filas caen. Todas las fuentes y el manifiesto se restauran antes del commit exclusivamente de ZF.

mutation: Tests:       4 failed, 16 passed, 20 total

green: Tests:       20 passed, 20 total

Sondas revertidas y verde restablecido antes del feat.

## Parada de cierre — fallo no inventariado en Home

La suite completa ya iniciada ha fallado en `src/screens/home/index.test.tsx`, `#190 R5: la pose reutiliza PingoFloat › usa Animated.View y repite solo translateY -10 en tramos de 1500 ms invertidos`: espera transform translateY -10, recibe 0. Es una aserción de comportamiento, no un timeout, literal sustituido ni recuento agregado; no aplica ninguna excepción. Se respeta la parada del handoff. No se cambia Home ni PingoFloat; `git diff af55f048 -- mobile-pet-tracker/src/screens/home/ mobile-pet-tracker/src/components/pingo-float.tsx` está vacío. La causa no se ha determinado y no se afirma que sea preexistente. Se dejan finalizar únicamente las comprobaciones ya iniciadas. No se crea `.done`.

El lint de cierre señaló además un import `act` sin uso en GZ, residuo propio de los helpers de Alert retirados en R8. Se limpia solo ese import y se repite únicamente lint, sin cambios de comportamiento ni en el fallo ajeno. El primer log de lint se conserva como `lint-202-before-cleanup.log`.

## Cuentas finales de tasks.md

Todas las cuentas coinciden con su esperado. Las filas de copy son arrays de objetos literales; se cuenta cada fila en el bloque correspondiente. Un primer intento de importar ui-copy-table con bun fuera de Jest dio ReferenceError describe is not defined (el fichero contiene un describe al final); no fue un fallo del runner ni del código de la feature y no produjo cambios. Se corrigió la invocación para leer los dos arrays. Intento conservado en counts-202-attempt.log.

```text
$ grep -oF '<Skeleton' src/screens/geofences/index.tsx | wc -l
5

$ grep -oF '<Skeleton' src/screens/geofence-editor/index.tsx | wc -l
3

$ grep -cF 'headerShown' src/app/_layout.tsx
4

$ grep -rlF 'theme/header-layout' src | wc -l
0

$ grep -cF 'Alert.alert' src/screens/geofences/index.tsx src/screens/geofence-editor/index.tsx
src/screens/geofences/index.tsx:0
src/screens/geofence-editor/index.tsx:0

$ grep -cF "'geofences.loadingLabel'" src/i18n/catalog.ts
2

$ grep -cF "'geofenceEditor.loadingLabel'" src/i18n/catalog.ts
2

$ grep -oF "t('geofences.title'" src/screens/geofences/index.tsx | wc -l
1

$ grep -oF "t('geofenceEditor.title'" src/screens/geofence-editor/index.tsx | wc -l
2

$ grep -oF "t('geofences.delete'" src/screens/geofence-editor/index.tsx | wc -l
2

$ grep -oF 'style={CONTINUOUS_CORNER}' src/screens/geofences/index.tsx | wc -l
3

$ grep -oE '\bCONTINUOUS_CORNER\b' src/screens/geofence-editor/index.tsx | wc -l
2

$ python3 -c "from pathlib import Path; s=Path('src/__tests__/ui-copy-table.ts').read_text(); print(s.split('export const R14_GEOFENCES: UseRow[] = [', 1)[1].split('];', 1)[0].count('{ file:'))"
23

$ python3 -c "from pathlib import Path; s=Path('src/__tests__/ui-copy-table.ts').read_text(); print(s.split('export const R15_GEOFENCE_EDITOR: UseRow[] = [', 1)[1].split('];', 1)[0].count('{ file:'))"
32

$ rg -F -A 2 '+ 7 // #194 R1 (+2); #189 R15 (+5)' src/providers/__tests__/language-provider.test.tsx
        + 7 // #194 R1 (+2); #189 R15 (+5)
        + 1 // #202 R10
        + 1, // #202 R18

$ rg -F "'screens/geofence-editor/index.tsx': 4" src/__tests__/design-drift.test.ts
      'screens/geofence-editor/index.tsx': 4, // #189 R13; #202 R18: +1

$ rg -F "'screens/geofence-editor/index.tsx': 4" src/__tests__/chunky-cta-canvas-fidelity.test.ts
  'screens/geofence-editor/index.tsx': 4, // #189 R13; #202 R18: +1

$ rg -F 'toBe(26 + 1 + 1 + 1 + 2 + 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts
  expect(count(/\brounded-16\b/g)).toBe(26 + 1 + 1 + 1 + 2 + 1); // #202 R18 // #194 R6 // #191 R11 // #189 R7; #189 R13

$ bun -e "console.log(Object.keys(require('./package.json').dependencies).length)"
44

$ grep -cF 'leading-body' src/screens/geofence-editor/index.tsx
5

```

## Scope final medido desde H0

```text
$ git diff --name-only af55f048..HEAD -- mobile-pet-tracker/ docs/
docs/conventions.md
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/geofences-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/__tests__/zones-canvas-fidelity.test.ts
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/components/__tests__/confirm-dialog.test.tsx
mobile-pet-tracker/src/components/confirm-dialog.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
mobile-pet-tracker/src/screens/geofence-editor/index.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/theme/header-layout.ts
```

Todos los ficheros están en la lista cerrada; sin ampliación por recuentos agregados. El diff de package.json y bun.lock frente a H0 está vacío (44 dependencias, 8 dev).

```diff
diff --git a/mobile-pet-tracker/src/app/_layout.tsx b/mobile-pet-tracker/src/app/_layout.tsx
index 950f5873..011b0d30 100644
--- a/mobile-pet-tracker/src/app/_layout.tsx
+++ b/mobile-pet-tracker/src/app/_layout.tsx
@@ -13,7 +13,6 @@ import { AuthProvider, useAuth } from '../providers/auth-provider';
 import { LanguageProvider, useTranslate } from '../providers/language-provider';
 import { QueryProvider } from '../providers/query-provider';
 import { SelectedPetProvider } from '../providers/selected-pet-provider';
-import { TRANSPARENT_HEADER_OPTIONS } from '../theme/header-layout';
 import { useThemeColors } from '../theme/use-theme-colors';
 import { getStoredLanguage } from '../utils/language-preference';
 import { getStoredTheme } from '../utils/theme-preference';
@@ -103,8 +102,8 @@ function RootStack() {
         <Stack.Screen name="reminders" options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="alerts" dangerouslySingular options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="alerts/[alertId]" dangerouslySingular options={{ ...headerOptions, title: '', contentStyle: { backgroundColor: background } }} />
-        <Stack.Screen name="pets/[petId]/geofences" options={{ ...headerOptions, title: '', ...TRANSPARENT_HEADER_OPTIONS }} />
-        <Stack.Screen name="pets/[petId]/geofence-editor" options={{ ...headerOptions, title: '' }} />
+        <Stack.Screen name="pets/[petId]/geofences" options={{ headerShown: false }} />
+        <Stack.Screen name="pets/[petId]/geofence-editor" options={{ headerShown: false }} />
         <Stack.Screen name="meals-history" options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="edit-profile" options={{ ...headerOptions, title: '' }} />
       </Stack.Protected>
```

Typecheck final: `test ! -e .expo/types/router.d.ts && bun run typecheck`, exit 0, salida `$ tsc --noEmit` (typecheck-202.log). No se ha creado ni borrado router.d.ts.

Graphify: `graphify update .`, exit 0, 28254 nodos / 36413 aristas / 1816 comunidades, artefactos en graphify-out ignorados. Advertencia de la herramienta: los 20 SQL no se analizaron por tree_sitter_sql ausente; no se instala nada. AST de código actualizado sin extracción semántica de pago.

No se ejecutó init.sh, no hubo push ni PR, merge, rebase, amend, instalaciones ni cambios en env. Tampoco se tocan feature_list, STATUS, current, history, el handoff ni backend. El handoff sin seguimiento existía al inicio y se conserva.

Resultado de la suite completa: 141 suites verdes / 3 rojas de 144; Tests: 3 failed, 4744 passed, 4747 total; snapshot 1 passed. Además del fallo de Home, dos casos de GZ/GE agotaron el timeout estándar de 5000 ms (#189 R5 cada fila; #189 R19.2 eliminar). El handoff exige medir los timeouts aislados sin flag antes de tocar código: se ejecutan ambos ficheros secuencialmente, sin --testTimeout. No se altera el timeout ni se reintenta el fallo de comportamiento ajeno para ocultarlo.

La segunda invocación de lint fue terminada por SIGKILL (log no vacío: el guard del handoff lo detectó), mientras acababa la suite completa. Se conserva en lint-202-sigkill.log y se repetirá el mismo comando exacto, sin Jest ni graphify propios simultáneos. La concurrencia de estas verificaciones fue una decisión operativa propia; no se modifica configuración ni se atribuyen sin prueba los fallos de tests a esa concurrencia.

## Balance de casos

Base del leader: 142 suites / 4683 casos / 1 snapshot. Altas: 84 casos nuevos. Bajas autorizadas: CF #197 R20 = 5, GF #189 R23 = 4, GE #189 R22 = 11, total 20. Delta neto +64; medido en la suite completa: 144 suites / 4747 casos / 1 snapshot, exactamente 4683 + 84 − 20. Los dos ficheros nuevos de tests son CD y ZF. Ninguna bajada adicional.

| R | Casos nuevos | Bajas |
|---|---|---|
| R1 | +6 | 0 |
| R2 | +2 | 4 |
| R3 | +2 | 0 |
| R4 | +3 | 0 |
| R5 | +2 | 0 |
| R6 | +2 | 0 |
| R7 | +8 | 5 |
| R8 | +4 | 0 |
| R9 | +5 | 0 |
| R10 | +3 | 0 |
| R11 | +4 | 0 |
| R12 | +4 | 0 |
| R13 | +4 | 0 |
| R14 | +3 | 0 |
| R15 | +4 | 0 |
| R16 | +5 | 0 |
| R17 | +9 | 11 |
| R18 | +3 | 0 |
| R19 | +2 | 0 |
| R20 | +1 | 0 |
| R21 | +1 | 0 |
| R22 | +1 | 0 |
| R23 | +1 | 0 |
| R24 | +1 | 0 |
| R25 | +4 | 0 |

Nacieron verdes: CD invisible (R7), los cuatro casos R21–R24 y las cuatro filas R25. Entre los candados enmendados, GF #189 R19.2 (R4) y el bloqueo de papelera durante busy (R8) también conservaban su verde inicial. Todos se vieron rojos mediante las sondas indicadas, sin alterar su aserción. La adición de padding congelado en ZF para la errata R7 ya era cierta en el canvas; el margen de producción se verifica con CD rojo/verde.

## Guardas del cierre

Las doce guardas exigidas pasaron dentro de la suite completa (el agregado global sigue rojo por los tres casos indicados):

```text
PASS src/__tests__/design-drift.test.ts (71.636 s)
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/chunky-cta-canvas-fidelity.test.ts
PASS src/__tests__/alerts-canvas-fidelity.test.ts
PASS src/__tests__/tab-headers-canvas.test.ts
PASS src/__tests__/profile-canvas-fidelity.test.ts
PASS src/__tests__/geofences-canvas-fidelity.test.ts
PASS src/__tests__/zones-canvas-fidelity.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/canvas-foundations.test.ts
PASS src/__tests__/heroui-text-size-merge.test.ts
```

## Sondas y mutaciones: índice de evidencia

Las sondas se plantaron únicamente en este árbol, no se commitearon y se revirtieron antes del verde focal. Las descripciones anteriores identifican cada cambio y los candados afectados. Resúmenes medidos:

| Log de progreso | Test Suites | Tests |
|---|---|---|
| test-202-r1-mutation.log | Test Suites: 3 failed, 3 total | Tests:       19 failed, 136 passed, 155 total |
| test-202-r10-mutation.log | Test Suites: 4 failed, 4 total | Tests:       7 failed, 196 passed, 203 total |
| test-202-r11-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 6 passed, 7 total |
| test-202-r11-mutation.log | Test Suites: 3 failed, 3 total | Tests:       12 failed, 137 passed, 149 total |
| test-202-r12-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 7 passed, 8 total |
| test-202-r12-mutation.log | Test Suites: 2 failed, 2 total | Tests:       10 failed, 127 passed, 137 total |
| test-202-r13-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 8 passed, 9 total |
| test-202-r13-mutation.log | Test Suites: 3 failed, 3 total | Tests:       12 failed, 204 passed, 216 total |
| test-202-r14-mutation.log | Test Suites: 2 failed, 2 total | Tests:       3 failed, 141 passed, 144 total |
| test-202-r15-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 10 passed, 11 total |
| test-202-r15-mutation.log | Test Suites: 3 failed, 3 total | Tests:       17 failed, 209 passed, 226 total |
| test-202-r16-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 11 passed, 12 total |
| test-202-r16-mutation.log | Test Suites: 2 failed, 2 total | Tests:       18 failed, 135 passed, 153 total |
| test-202-r17-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 12 passed, 13 total |
| test-202-r17-mutation.log | Test Suites: 4 failed, 4 total | Tests:       23 failed, 181 passed, 204 total |
| test-202-r18-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 13 passed, 14 total |
| test-202-r18-mutation.log | Test Suites: 6 failed, 6 total | Tests:       9 failed, 423 passed, 432 total |
| test-202-r19-mutation.log | Test Suites: 1 failed, 1 total | Tests:       5 failed, 137 passed, 142 total |
| test-202-r2-mutation.log | Test Suites: 2 failed, 1 passed, 3 total | Tests:       4 failed, 66 passed, 70 total |
| test-202-r20-isolation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 15 passed, 16 total |
| test-202-r20-mutation.log | Test Suites: 2 failed, 1 passed, 3 total | Tests:       5 failed, 100 passed, 105 total |
| test-202-r21-r24-mutation.log | Test Suites: 2 failed, 2 total | Tests:       33 failed, 228 passed, 261 total |
| test-202-r25-isolation.log | Test Suites: 1 failed, 1 total | Tests:       3 failed, 17 passed, 20 total |
| test-202-r25-mutation.log | Test Suites: 1 failed, 1 total | Tests:       4 failed, 16 passed, 20 total |
| test-202-r3-mutation.log | Test Suites: 3 failed, 3 total | Tests:       6 failed, 127 passed, 133 total |
| test-202-r4-mutation.log | Test Suites: 4 failed, 4 total | Tests:       7 failed, 249 passed, 256 total |
| test-202-r5-mutation.log | Test Suites: 3 failed, 3 total | Tests:       5 failed, 132 passed, 137 total |
| test-202-r6-mutation.log | Test Suites: 2 failed, 2 total | Tests:       4 failed, 107 passed, 111 total |
| test-202-r7-api-mutation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 6 passed, 7 total |
| test-202-r7-errata-red.log | Test Suites: 1 failed, 1 passed, 2 total | Tests:       1 failed, 7 passed, 8 total |
| test-202-r7-mutation.log | Test Suites: 4 failed, 4 total | Tests:       11 failed, 50 passed, 61 total |
| test-202-r8-mutation.log | Test Suites: 1 failed, 1 total | Tests:       11 failed, 99 passed, 110 total |
| test-202-r9-chunky-mutation.log | Test Suites: 1 failed, 1 total | Tests:       1 failed, 77 passed, 78 total |
| test-202-r9-mutation.log | Test Suites: 1 failed, 1 total | Tests:       14 failed, 112 passed, 126 total |

No se ajustó ningún candado ajeno por fallar ante una sonda intencional. No se tocaron las fuentes ni los tests de Home al detectar su fallo de cierre.

## Inventarios y candados enmendados (resumen antes/después)

| R | Candado | Antes → después |
|---|---|---|
| R7 | Profile rounded-hero; alerts text-15 | añade solo confirm-dialog; CF #197 R20 se borra entero |
| R1 | GZ #41 R5, #189 R1; profile text-26; alerts tracking-title | 46→52, 40+6→40+12; título y contador dentro de ScreenHeader; quita Zonas de ambos inventarios |
| R3 | GZ #189 R5; GF #189 R18 | Map/color → Svg/stroke; importados AlertCircle+Trash, sin Map |
| R4 | GF #189 R19.2 | lista Switch/Button → Switch/ToggleSwitch/Button, cuentas 2/3 conservadas |
| R5 | GZ #189 R6; GF #189 R18 | AlertCircle→AlertTriangle; aviso leading-note |
| R6 | GZ #41 R7 y #189 R5 | bg-danger-soft→bg-category-rose, sin hitSlop y con esquina continua |
| R8 | GZ #41 R7, #189 R5 | Alert→ConfirmDialog, eventos nativos→acciones de tarjeta y espera de DOM |
| R9 | GE #146 R14, #189 R19.2; Chunky #177 R4.1 | Alert→ConfirmDialog; confirmDelete→abrir estado local (enmienda mecánica tardía) |
| R10 | GZ #41 R5; UL #41 R10; provider #194 R1 | esqueleto plano→2 filas; tabla 22→23 y catálogo +1 |
| R11 | GZ #41 R5/#41 R6; alerts text-15 | ambas recetas de error 14→15/1.4; añade Zonas al inventario |
| R12 | GE #189 R8 | offsets nativos→fila top+8, volver y dos sombras |
| R13 | GE #146 R6/#189 R9; CC #189 R9; GE #189 R22.1 | hoja directa→RiseIn; añade shadows.sheet; literal de hijo actualizado en 3 casos |
| R15 | GE #146 R8/#146 R14/#189 R13; Chunky #177 R3.1/R4.1 | h-14→h-13.5 en las tres recetas del Editor |
| R16 | GE #146 R8/#146 R16/#189 R11 | leading-body en notas/error, tamaño 15 en radio de lectura |
| R17 | GE #146 R6/#189 R8/#189 R14/#146 R16; profile text-26, alerts tracking-title | top 24→52; tarjetas py8→px4/py6; quita Editor de inventarios; borra GE #189 R22 completo |
| R18 | GE #146 R6; UL #146 R10; provider #194 R1; design-drift rounded16; Chunky radii | 1→3 barras; copy 31→32 y catálogo +1; radios Editor 3→4, total 31→32 |
| R19 | GE #146 R6 (3 errores) | text-danger→text-15 leading-body text-danger |
| R2 | LY ×2; GF #189 R23 | options nativas→headerShown false; se borran 4 casos de geometría y su import |
| R20 | GF #189 R16.1/R16.3/R24.1/R24.2 | los cinco textos de carta aprobados, incluida papelera en dos apariciones y ambas excepciones documentales |

R14 no necesita enmienda de candados antiguos; solo tests nuevos. No fue necesaria ninguna ampliación adicional del inventario por la errata de recuentos agregados.

## Commits y líneas Tests asociadas

Se indica el resultado medido al preparar o verificar cada commit; las etapas y los ficheros están en los logs y las secciones anteriores. Los commits de documentación y la errata del leader no alteran tests. No se reescribe ningún commit.

| Commit y mensaje | Resultado asociado |
|---|---|
| cd3aa980 test(#202): R7 lock the shared canvas confirmation dialog | Tests:       9 failed, 117 passed, 126 total |
| 7f198849 test(#202): R7 account for Reanimated style arrays | Tests:       126 passed, 126 total |
| 2590c582 feat(#202): R7 add the shared canvas confirmation dialog | Tests:       126 passed, 126 total |
| c5a45651 test(#202): R1 lock the zones content header | Tests:       18 failed, 137 passed, 155 total |
| 2a352007 feat(#202): R1 render the zones header in content | Tests:       155 passed, 155 total |
| f1854a8f docs(#202): report R7 canvas discrepancy and verified steps | Documentación / spec; sin ejecución nueva de Jest |
| 4c067d76 chore(spec): errata #202 R7.1 margen del velo de 28 px y regla de recuentos agregados | Documentación / spec; sin ejecución nueva de Jest |
| e083cb06 test(#202): R7 align the dialog inset with the frozen canvas | Tests:       1 failed, 7 passed, 8 total |
| ca15f85a feat(#202): R7 inset the dialog 28 px like the canvas | Tests:       8 passed, 8 total |
| 47643ab6 test(#202): R3 lock each zone glyph against the canvas | Tests:       6 failed, 127 passed, 133 total |
| 097959b1 feat(#202): R3 render the canvas zone glyph | Tests:       133 passed, 133 total |
| f46cbd3b test(#202): R4 lock canvas switches in both zone screens | Tests:       3 failed, 253 passed, 256 total |
| 42993f4c feat(#202): R4 use the canvas ToggleSwitch in both zone screens | Tests:       256 passed, 256 total |
| f9fa9a07 test(#202): R5 lock the canvas zone limit notice | Tests:       5 failed, 132 passed, 137 total |
| 18918880 feat(#202): R5 match the canvas zone limit notice | Tests:       137 passed, 137 total |
| 4b405bba test(#202): R6 lock rose backgrounds for zone trash actions | Tests:       4 failed, 107 passed, 111 total |
| 36edd873 feat(#202): R6 use rose for zone trash backgrounds | Tests:       111 passed, 111 total |
| e3b327da test(#202): R8 lock zone deletion through ConfirmDialog | Tests:       10 failed, 100 passed, 110 total |
| cff043d0 feat(#202): R8 confirm zone deletion with the canvas dialog | Tests:       110 passed, 110 total |
| 3052f1ad test(#202): R9 lock editor deletion through ConfirmDialog | Tests:       12 failed, 114 passed, 126 total |
| 804f3ccd feat(#202): R9 confirm editor deletion with the canvas dialog | Tests:       126 passed, 126 total |
| 12b653ef test(#202): R10 lock the zones loading skeleton and copy | Tests:       6 failed, 197 passed, 203 total |
| b21e37e0 feat(#202): R10 render two accessible zone loading rows | Tests:       203 passed, 203 total |
| 538ba7de test(#202): R11 lock canvas typography for zone errors | Tests:       12 failed, 137 passed, 149 total |
| 398cb54c feat(#202): R11 match canvas typography for zone errors | Tests:       149 passed, 149 total |
| 2c201776 test(#202): R12 lock the floating editor header | Tests:       10 failed, 127 passed, 137 total |
| a7612dc1 feat(#202): R12 add the floating glass back button and title shadows | Tests:       137 passed, 137 total |
| b356fc13 test(#202): R13 lock the rising editor sheet and its shadow | Tests:       12 failed, 204 passed, 216 total |
| f6da1bcd feat(#202): R13 wrap the editor sheet in RiseIn with sheet shadow | Tests:       216 passed, 216 total |
| 0d348fd2 test(#202): R14 lock canvas typography for the zone name | Tests:       3 failed, 141 passed, 144 total |
| 8d6acb88 feat(#202): R14 use canvas typography for the zone name | Tests:       144 passed, 144 total |
| 71aac698 test(#202): R9 amend the editor delete CTA binding lock | Tests:       78 passed, 78 total |
| 86ba686f test(#202): R15 lock 54 px editor actions | Tests:       17 failed, 209 passed, 226 total |
| 3c1c3180 feat(#202): R15 size editor actions at 54 px | Tests:       226 passed, 226 total |
| b03fc85e test(#202): R16 lock editor form text recipes | Tests:       18 failed, 135 passed, 153 total |
| 21b58dd1 feat(#202): R16 match canvas text sizes and leading in the editor form | Tests:       153 passed, 153 total |
| 15a955f4 test(#202): R17 lock editor state headers and cards | Tests:       23 failed, 181 passed, 204 total |
| 4f5f0637 feat(#202): R17 render shared editor state headers and canvas cards | Tests:       204 passed, 204 total |
| fbea47b3 test(#202): R17 remove the obsolete Stack mock | Tests:       138 passed, 138 total |
| d3b8121a test(#202): R18 lock the editor loading canvas and copy inventories | Tests:       8 failed, 424 passed, 432 total |
| 1842bba0 test(#202): R7 require a native accessible dialog heading | Tests:       1 failed, 6 passed, 7 total |
| 1ca6234f feat(#202): R7 expose the dialog title with the native header role | Tests:       7 passed, 7 total |
| 1672db90 feat(#202): R18 match the editor loading bars and accessible label | Tests:       432 passed, 432 total |
| d8217632 test(#202): R19 lock loading error typography | Tests:       5 failed, 137 passed, 142 total |
| f2b7c425 feat(#202): R19 align loading errors with canvas text metrics | Tests:       142 passed, 142 total |
| a4e03209 test(#202): R2 require content headers and retire shared native geometry | Tests:       4 failed, 66 passed, 70 total |
| 8b91d4a8 feat(#202): R2 hide native zone headers and remove unused geometry | Tests:       70 passed, 70 total |
| 11c28902 test(#202): R20 lock the approved zone charter amendments | Tests:       5 failed, 100 passed, 105 total |
| 2ba3083b feat(#202): R20 document zone content headers and canvas metrics | Tests:       105 passed, 105 total |
| e30ee110 test(#202): R21-R24 conservation locks | Tests:       261 passed, 261 total |
| 1cf77769 test(#202): R25 lock zone source fidelity and dependency count | Tests:       20 passed, 20 total |
| 505bf6ab test(#202): R8 remove the unused Alert helper import | Tests:       118 passed, 118 total |

505bf6ab retira exclusivamente el import act que quedó sin uso al adaptar R8; no cambia casos ni comportamiento. GZ aislado sin flag tras el import: Tests: 118 passed, 118 total. GE aislado sin flag: Tests: 143 passed, 143 total. Los dos timeouts de la suite completa no se reproducen en estas ejecuciones. Se conservan todos los resultados; no se repite Home ni se convierte la suite completa roja en verde.

Errores adicionales de recolección, sin cambios de código: se consultó el segundo log aislado antes de su creación (ENOENT, luego se consultó al terminar); el primer recolector de commits esperaba dos puntos tras el R-id en mensajes que usan un espacio (assertion del recolector antes de escribir el reporte). Se corrigieron ambas invocaciones.

## R1–R25 → test → commit (estado final)

Cada fila de traceability conserva además los candados antiguos enmendados.

| R | Test(s) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | GZ `#202 R1` ×2; enmienda GZ `#41 R5` métricas (`paddingTop: 52`, `toBe(40 + 12)`), GZ `#189 R1`, profile `#173 R2.4` `text-26`, alerts `#174 R12` `tracking-title` | c5a45651 | 2a352007 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R2 | LY, ZF `#202 R2` (aguja `['theme', 'header-layout'].join('/')`); enmienda LY ×2; borra GF `#189 R23` | a4e03209 | 8b91d4a8 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R3 | GZ, ZF `#202 R3`; enmienda GZ `#189 R5` (cada fila, las cinco posiciones, family: F1, F2), GF `#189 R18`; doble de reicon sin `Map` | 47643ab6 | 097959b1 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R4 | GZ, GE, ZF `#202 R4`; enmienda GF `#189 R19.2` | f46cbd3b | 42993f4c | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R5 | GZ, ZF `#202 R5`; enmienda GZ `#189 R6`, GF `#189 R18`; doble de reicon con `AlertTriangle` | f9fa9a07 | 18918880 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R6 | GZ, ZF `#202 R6`; enmienda GZ `#41 R7` (recetas), `#189 R5` (papelera; sin `hitSlop`, M3) | 4b405bba | 36edd873 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R7 | CD (7 casos), ZF `#202 R7`; errata 28 px y atributo nativo accessibilityRole header; borra CF `describe('#197 R20: cimientos sin cablear')` entero; enmienda profile `#173 R2` `rounded-hero`, alerts `#174 R12` `text-15` | cd3aa980; ajuste 7f198849; errata e083cb06; API 1842bba0 | 2590c582; ca15f85a; 1ca6234f | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R8 | GZ `#202 R8` ×3; enmienda GZ `#41 R7` (Alert) | e3b327da; limpieza posterior 505bf6ab | cff043d0 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R9 | GE `#202 R9` ×4; enmienda GE `#146 R14` (incluidos F3, F4), `#189 R19.2`; borra el helper `alertButton` | 3052f1ad; enmienda tardía 71aac698 | 804f3ccd | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R10 | GZ ×2, ZF `#202 R10`; enmienda GZ `#41 R5` esqueleto, UL `#41 R10` (`+ 1`), language-provider `#194 R1` (`+ 1 // #202 R10`) | 12b653ef | b21e37e0 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R11 | GZ, ZF `#202 R11`; enmienda GZ `#41 R5` `pinta %p…`, `#41 R6` `pinta %s sin recargar…` (M1), alerts `#174 R12` `text-15` | 538ba7de | 398cb54c | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R12 | GE, ZF `#202 R12`; enmienda GE `#189 R8` fila | 2c201776 | a7612dc1 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R13 | GE, ZF `#202 R13`; enmienda GE `#146 R6` compone, `#189 R9` compone la hoja (F5), CC `#189 R9` (M8) | b356fc13 | f6da1bcd | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R14 | GE, ZF `#202 R14` | 0d348fd2 | 8d6acb88 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R15 | GE, ZF `#202 R15`; enmienda GE `#146 R8`, `#146 R14`, `#189 R13`, chunky-cta `#177 R3.1`, `#177 R4.1` | 86ba686f | 3c1c3180 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R16 | GE, ZF `#202 R16`; enmienda GE `#146 R8` `pinta %s bajo Guardar…` (M5), `#146 R16`, `#189 R11` | b03fc85e | 21b58dd1 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R17 | GE ×2, ZF `#202 R17`; enmienda GE `#146 R6` esqueleto (métricas, M6), `#189 R8` plano, `#189 R14`, `#146 R16`; borra `#189 R22`; profile `#173 R2.4`, alerts `tracking-title` | 15a955f4; limpieza posterior fbea47b3 | 4f5f0637 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R18 | GE ×2, ZF `#202 R18`; enmienda GE `#146 R6` esqueleto (barras, M6), UL `#146 R10` (`+ 1`), language-provider `#194 R1` (`+ 1 // #202 R18`), design-drift `#178 R13` `rounded16`, chunky-cta `#177 R7.3` | d3b8121a | 1672db90 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R19 | GE `#202 R19`; enmienda GE `#146 R6` error | d8217632 | f2b7c425 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R20 | ZF `#202 R20`; enmienda GF `#189 R16.1`, `#189 R16.3`, `#189 R24.1`, `#189 R24.2` | 11c28902 | 2ba3083b | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R21 | GZ `#202 R21` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R22 | GZ `#202 R22` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R23 | GZ `#202 R23` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R24 | GE `#202 R24` | n/a (conservación) | e30ee110 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R25 | ZF `#202 R25` (4 casos) | n/a (nace verde) | 1cf77769 | verde focal y sonda; cierre global bloqueado por Home #190 R5 |
| R26 | Smoke humano, dev build Android | n/a | n/a | pendiente |

R26 sigue pendiente del humano, con la checklist de ocho puntos conservada arriba. No se ejecutó smoke Android.

## Resultado final de la parada

- Typecheck repetido tras retirar el import sin uso: `test ! -e .expo/types/router.d.ts && bun run typecheck`, exit 0, `$ tsc --noEmit`.
- Lint final, sin Jest ni graphify propios simultáneos: `bunx expo lint --no-cache > ../progress/lint-202.log 2>&1 && test ! -s ../progress/lint-202.log`, exit 0, log de 0 bytes. Se conservan el warning inicial y el SIGKILL posterior en sus logs separados; no se esconden.
- Re-mediciones exigidas por el handoff, sin --testTimeout: Editor 143/143 y Zonas 118/118, ambas exit 0. El import de limpieza 505bf6ab estaba incluido en la medición de Zonas.
- Suite completa original: Tests: 3 failed, 4744 passed, 4747 total; Test Suites: 3 failed, 141 passed, 144 total; snapshot 1 passed; 278.619 s. Los 12 candados estáticos pasaron; no se vuelve a correr la suite ni Home tras la parada no inventariada.
- Fuente de la parada: handoff, Reglas críticas, «Si al correr la suite aparece en rojo un it que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta». Home #190 R5 afirma comportamiento de animación, por lo que no aplica la excepción de literal ni la regla de recuentos agregados del leader. Se necesita que el leader resuelva o autorice expresamente el tratamiento de ese fallo antes de un cierre global verde.
- Sin cambios pendientes en mobile-pet-tracker ni docs. El único cambio pendiente dentro del chequeo acotado antes del commit documental es traceability.md, que entra en ese commit junto al reporte. El handoff sin seguimiento se conserva.
- No se marca done, no se crea progress/impl_mobile-canvas-zones.done. No se ejecutan init.sh, push ni PR. R26 queda al humano tras reviewer.

Para reanudar: comprobar este HEAD y la resolución del leader de Home #190 R5; cerrar una suite móvil completa verde, actualizar el resultado global de esta trazabilidad y crear el marcador .done como última acción solo si el handoff queda cumplido. Los pasos R1–R25 y sus sondas no requieren rehacerse por esta parada.
