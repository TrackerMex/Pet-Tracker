# Implementación mobile-canvas-zones (#202)

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
| Ninguna hasta ahora | — | — | — |

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

## Verificación pendiente por la parada

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
