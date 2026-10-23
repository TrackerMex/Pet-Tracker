# Implementación mobile-canvas-foundations (#197)

Estado actual: **Verificación final VERDE**. R1–R22 y R24 completos; 142 suites y 4683 tests pasan, snapshot 1/1. Tipos, lint, nueve guardas y Graphify verdes. R23 queda pendiente del smoke humano en Android tras aprobación del reviewer.

## Inicio

Ruta confirmada: `/home/claude/sites/Pet-Tracker-wt-197`. Rama: `feature/197-mobile-canvas-foundations`. H0: `046133e8`. Sin init.sh, push, PR ni merges conforme al handoff.

Desviación: el primer comando leyó init.config.sh, el handoff y ponytail antes de conocer su exigencia de primer comando; el comando literal de comprobación se ejecutó inmediatamente después y devolvió ruta y rama correctas.

Skills cargadas: ponytail, building-native-ui, expo-tailwind-setup, appllama-app-design-skill, animate-expo. No se buscaron los nombres excluidos por el handoff (expo-overview, expo-animation, expo-router, expo-design-system). Appllama MCP no disponible; se usa la referencia congelada.

## Anclas T0

```text
+ cd mobile-pet-tracker
+ G=src/theme/global.css
+ grep -cF 'rgba(13,17,23,0.07)' src/theme/global.css
+ grep -cF -- '--danger: #EF4444;' src/theme/global.css
+ grep -cF -- '--color-danger: #EF4444;' src/theme/global.css
+ grep -cF -- '--warning: #F59E0B;' src/theme/global.css
+ grep -cF -- '--color-warning: #F59E0B;' src/theme/global.css
+ grep -cF -- '--warning-strong: #92610A;' src/theme/global.css
+ grep -cF -- --color-lip- src/theme/global.css
+ grep -cF -- --color-shadow- src/theme/global.css
+ grep -cF -- --leading- src/theme/global.css
+ grep -cF -- --tracking- src/theme/global.css
+ grep -cF '#D92D20' src/theme/global.css
+ grep -cF '#B54708' src/theme/global.css
+ grep -cF '#93370D' src/theme/global.css
+ git grep -c tracking-tight -- src ':!**/__tests__/**' ':!*.test.ts' ':!*.test.tsx'
+ git grep -c tracking-tight -- ':(glob)src/**/__tests__/**' ':(glob)src/**/*.test.tsx'
+ grep -cF border-b-3 src/screens/add-reminder/index.tsx
+ grep -cF border-black/25 src/screens/add-reminder/index.tsx
+ grep -cF border-b-5 src/screens/alerts/index.tsx
+ grep -cF border-b-5 src/screens/meal-schedule/index.tsx
+ grep -cF border-b-6 src/screens/meal-schedule/index.tsx
+ grep -cF border-black/25 src/screens/meal-schedule/index.tsx
+ grep -cF useChunkyLip src/screens/add-reminder/index.tsx
+ grep -cF useChunkyLip src/screens/alerts/index.tsx
+ grep -cF useChunkyLip src/screens/meal-schedule/index.tsx
+ grep -cF CONTINUOUS_CORNER src/screens/meal-schedule/index.tsx
+ grep -cF ''\''lip'\'', '\''lip-gray'\''' src/theme/chunky-lip.ts
+ grep -cF MOTION_RISE src/theme/motion.ts
+ grep -cF MOTION_SETTLE_SPRING src/screens/home/home-entrance.tsx
+ grep -cF MOTION_ENTRANCE_OFFSET_Y src/screens/home/home-entrance.tsx
+ grep -cF MOTION_FADE_TIMING src/screens/home/home-entrance.tsx
+ grep -cF strokeWidth src/components/back-button.tsx
+ grep -cF headerShown src/app/_layout.tsx
+ grep -cF '## Enmienda #197' ../docs/ui-guidelines.md
+ grep -cF 'Título en contenido (D-H)' ../docs/ui-guidelines.md
+ node -e 'const p=require("./package.json");console.log(Object.keys(p.dependencies).length, Object.keys(p.devDependencies).length)'
+ test '!' -e src/components/toggle-switch.tsx
+ test '!' -e src/components/screen-header.tsx
+ test '!' -e src/theme/shadows.ts
+ test '!' -e src/__tests__/canvas-foundations.test.ts
+ test '!' -e src/theme/__tests__/shadows.test.tsx
+ test '!' -e src/components/__tests__/toggle-switch.test.tsx
+ test '!' -e src/components/__tests__/screen-header.test.tsx
2
1
1
1
1
1
2
0
0
4
0
0
0
src/app/(tabs)/food.tsx:1
src/components/celebration.tsx:1
src/screens/health/index.tsx:1
src/screens/profile/index.tsx:1
src/__tests__/tab-headers-canvas.test.ts:2
src/app/(tabs)/__tests__/food.test.tsx:1
src/components/__tests__/celebration.test.tsx:1
src/screens/health/index.test.tsx:1
src/screens/profile/index.test.tsx:1
1
1
1
2
1
1
2
0
0
3
1
0
2
2
2
0
2
0
1
44 8
sin-router-d-ts
```

## R1

Rojo por aserciones: 5 failed, 2 passed, 70 skipped (77 total). Verde: `Tests: 70 skipped, 7 passed, 77 total`. Cuatro tests nuevos, total acumulado esperado 4573 frente a T0 4569. El candado oscuro nace verde. Sondas plantadas y revertidas: border claro, danger claro, warning claro, danger oscuro, color-danger claro, warning-strong claro: todas exit 1 por aserción. Logs progress/r1-*.log.

Enmiendas: GC paleta light y espejos semánticos: border/separator .07 → .08, danger EF4444 → D92D20, warning F59E0B → B54708 (R1).

Invocación corregida sin cambios: se intentó leer jest.config.js; la configuración real está en package.json.

## R2

Nace verde tras R1, sin implementación adicional: `Tests: 78 passed, 78 total` en CF+GC. Un test nuevo (total esperado 4574). Sondas strong, warning y colisión de tinta ámbar con warning: exit 1 por aserción, revertidas. Una sonda inicial a blanco no rompía el predicado de separación: verde legítimo, sustituida por la colisión; ambas quedan en logs. Enmiendas GC: warningSoft FEF0DA → F4E3DA; fila clara AA 92610A → 93370D, relleno F59E0B → B54708; mínimos ámbar 4.9 → 5.7, violeta 10.2 → 10.5, rosa 4.6 → 5.0. El test de contraste comprueba también la tinta leída de CSS.

## R3

Rojo por aserción: 7 failed, 78 passed, 85 total. Verde: `Tests: 85 passed, 85 total`. Seis sondas (retirada de cada token de producción) en rojo y revertidas, prueban cada fila CF y el inventario GC. Siete tests nuevos, total esperado 4581.

## R4

Rojo por aserción: 23 failed, 4 passed, 401 skipped, 428 total. Verde: `Tests: 401 skipped, 27 passed, 428 total`. Un test nuevo, total esperado 4582. Sondas: restaurar tracking-tight en un consumidor cada vez (food, celebration, health, profile): rojo en CF, TH, inventario AC y tests renderizados correspondientes; revertidas. Enmiendas TH, tres títulos de pestaña, celebration R20.4 e inventario AC tracking-title según R4 (sin ScreenHeader aún). Typecheck temprano verde, guard router.d.ts ausente.

## R5

Rojo por aserción: 7 failed, 86 passed, 93 total. Verde: `Tests: 93 passed, 93 total`. Cinco sondas cambian solo el token oscuro correspondiente: todas en rojo, revertidas. Siete tests nuevos, total esperado 4589.

## R6

Rojo: 17 failed, 26 passed, 43 total (CF+CL), todos por aserción. Verde: `Tests: 43 passed, 43 total`. 19 tests nuevos (CF 11, CL 8), total esperado 4608. Las tres filas CF existentes nacen verdes; las ocho nuevas nacen rojas. Once sondas alteran el offset de una variante cada vez, y otra altera el séptimo token pedido: todas rojas, revertidas. Se enmienda CL R2.1 a siete tokens y once claves. Un helper local construye la capa compartida (como pide tasks.md); no hay módulo nuevo.

## Bloqueo histórico de R7 — resuelto por 1e0d70cf (primera sesión)

No se declara terminada la feature. R1–R6 implementados y verificados por sus suites seleccionadas; R7 tiene únicamente el commit de test rojo. R8–R22 y la verificación final no se han ejecutado.

El cambio mínimo de producción de R7 hace pasar los tres tests autorizados, pero la suite completa de NuevoRecordatorio devuelve `Tests: 17 failed, 48 passed, 65 total`. Ninguno de los 17 fallos pertenece al inventario cerrado de requirements.md. Todos comparan contra la constante `CHIP_SELECTED` a través de `expectAdvanceChips`, que aún exige `border-b-3 border-black/25`. Log: `progress/r7-full-197.log`. El handoff ordena PARAR ante un it rojo no inventariado; no se ha enmendado ninguno.

También se detectó que el test original de #123 R5 solo comprobaba fecha/hora, no la clase de chips que le atribuye la tabla de candados; en el commit de R7 se añadieron las aserciones de estilo y ausencia de bordes requeridas.

El leader debe ampliar y aprobar el inventario para #125 R3 (9 casos), #125 R4 (3), #125 R6 (2) y #178 R12 (3), y decidir la actualización de la constante/helper compartido. No se cambia código para conservar una receta que contradice R7.

### Fallos fuera del inventario

- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › a 7 días justos del 1 de julio, el aviso de 7 días cae en el instante actual y cuenta como pasado (cruce de mes)
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › a 7 días y 1 minuto del 1 de julio, el aviso de 7 días sigue en el futuro (cruce de mes)
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 1 de enero de 2027 desde el mediodía del 29 de diciembre queda el aviso de 1 día (cruce de año)
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 1 de octubre desde la noche del 30 de septiembre solo queda el mismo día (cruce de mes)
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 30 de septiembre a 3 días justos, el aviso de 3 días cuenta como pasado
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › el 1 de enero de 2027 a 1 día justo, el aviso de 1 día cuenta como pasado (cruce de año)
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › a la hora exacta del recordatorio todos cuentan como pasados y el formulario lo rechaza
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › pulsar un chip desactivado no cambia la selección
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro › al cambiar fecha u hora se recalcula: la elección explícita se conserva mientras siga en el futuro y vuelve cuando deja de estar en el pasado
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío › cambiar la hora reevalúa los chips con el instante del cambio
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío › volver a elegir la fecha reevalúa los chips con el instante del cambio
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío › guardar envía el mayor aviso aún futuro en el instante del envío
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1) › con avisos mayores activos, cambiar fecha u hora conserva el aviso elegido
- #125: avisos que ya pasaron en Nuevo recordatorio › #125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1) › con todos los chips desactivados sigue marcada la elección, no un valor fijo
- #178 R12: chips de aviso y vista previa › pinta el aviso por defecto y los demás chips con sus recetas y pesos
- #178 R12: chips de aviso y vista previa › invierte la receta del seleccionado y su etiqueta al elegir un día antes
- #178 R12: chips de aviso y vista previa › usa el aviso efectivo cuando los tres anticipados ya pasaron

### Diff medido de la implementación de R7

3 líneas añadidas, 1 eliminada. Se conserva aquí para que sea revisable; se revierte solo este cambio no committeado para dejar el árbol acotado limpio.

```diff
diff --git a/mobile-pet-tracker/src/screens/add-reminder/index.tsx b/mobile-pet-tracker/src/screens/add-reminder/index.tsx
index 9ce609d8..051f26de 100644
--- a/mobile-pet-tracker/src/screens/add-reminder/index.tsx
+++ b/mobile-pet-tracker/src/screens/add-reminder/index.tsx
@@ -28,7 +28,7 @@ import { CONTINUOUS_CORNER } from '../../theme/native-styles';
 import { TOUCH_SLOP } from '../../theme/touch-target';
 import { useThemeColors } from '../../theme/use-theme-colors';
 
-const SELECTED_CHIP = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent border-b-3 border-black/25';
+const SELECTED_CHIP = 'h-9.5 items-center justify-center rounded-full px-3.5 bg-accent';
 
 const ADVANCE_OPTIONS = [
   { minutes: 0, labelKey: 'addReminder.advanceSameDay' },
@@ -167,6 +167,7 @@ function AddReminderContent({ petId }: { petId: string }) {
                   accessibilityState={{ selected }}
                   testID={`type-chip-${reminderType}`}
                   hitSlop={TOUCH_SLOP}
+                  style={selected ? chunkyLip.primaryCompact : undefined}
                   className={
                     selected
                       ? SELECTED_CHIP
@@ -297,6 +298,7 @@ function AddReminderContent({ petId }: { petId: string }) {
                   accessibilityState={{ selected }}
                   testID={`advance-chip-${option.minutes}`}
                   hitSlop={TOUCH_SLOP}
+                  style={selected ? chunkyLip.primaryCompact : undefined}
                   disabled={disabled}
                   className={`${selected ? SELECTED_CHIP : 'h-9.5 items-center justify-center rounded-full px-3.5 bg-default'}${disabled ? ' opacity-50' : ''}`}
                   onPress={() => setAdvanceMinutes(option.minutes)}
```

Las sondas de R7 no se ejecutan: la parada se produce antes de esa fase. No existe commit feat de R7.

## Commits y resultados asociados

Las líneas son las mediciones de cada estado TDD (rojo antes del commit test; verde antes del commit feat). No son recuentos de la suite completa.

| Commit | Mensaje | Tests: |
|---|---|---|
| `03de724e` | test(#197): R1 lock light colors to frozen canvas | 5 failed, 70 skipped, 2 passed, 77 total |
| `28fa2d22` | feat(#197): R1 align light semantic colors with canvas | 70 skipped, 7 passed, 77 total |
| `f0aa3db8` | test(#197): R2 verify updated state color contrast | 78 passed, 78 total |
| `4a792781` | test(#197): R3 lock canvas tracking and line heights | 7 failed, 78 passed, 85 total |
| `3bfbbebf` | feat(#197): R3 add canvas typography tokens | 85 passed, 85 total |
| `c702f6fd` | test(#197): R4 align title tracking guards with canvas | 23 failed, 401 skipped, 4 passed, 428 total |
| `1fa7db78` | feat(#197): R4 use canvas tracking for large titles | 401 skipped, 27 passed, 428 total |
| `f6fc598c` | test(#197): R5 lock new lip colors in both themes | 7 failed, 86 passed, 93 total |
| `3a05751e` | feat(#197): R5 add canvas lip tokens in both themes | 93 passed, 93 total |
| `76f76621` | test(#197): R6 cover all eleven canvas lip variants | 17 failed, 26 passed, 43 total |
| `7f242bc7` | feat(#197): R6 expand memoized canvas lip catalogue | 43 passed, 43 total |
| `d8c65463` | test(#197): R7 require external lips on selected reminder chips | 3 failed, 62 skipped, 65 total |

## Tabla R1–R22 → test → commit (primera sesión; sustituida por la tabla final)

| R | Tests | Commits / estado |
|---|---|---|
| R1 | CF #197 R1; GC paleta light y espejos | `03de724e`; `28fa2d22` |
| R2 | CF #197 R2; GC #61 R5 y #64 R4 | `f0aa3db8` |
| R3 | CF #197 R3; GC #197 R3 | `4a792781`; `3bfbbebf` |
| R4 | CF #197 R4; TH #168 R1; AC #174 R12; títulos food/profile/health; celebration R20.4 | `c702f6fd`; `1fa7db78` |
| R5 | CF #197 R5; GC #197 R5 | `f6fc598c`; `3a05751e` |
| R6 | CF #197 R6; CL #177 R2.1 y #197 R6 | `76f76621`; `7f242bc7` |
| R7 | AR #178 R10 ×2 y #123 R5 (enmendados por #197 R7) | `d8c65463` — solo test rojo; bloqueado |
| R8 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R9 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R10 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R11 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R12 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R13 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R14 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R15 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R16 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R17 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R18 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R19 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R20 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R21 | No ejecutado | No iniciado por parada obligatoria en R7 |
| R22 | No ejecutado | No iniciado por parada obligatoria en R7 |

## Verificación y límites del cierre bloqueado (primera sesión)

- Anclas T0: todas coinciden. `router.d.ts` ausente.
- Typecheck temprano (tras escribir los tests R4): guard verde y `bun run typecheck` exit 0 (`progress/typecheck-197.log`). No se afirma typecheck final de R6/R7.
- Lint, suite completa móvil, guardas finales y graphify: no ejecutados por la parada obligatoria. No se ejecutó init.sh; lo corre el leader. No se tocaron .env, node_modules, dependencias, layout, copy, backend ni bookkeeping ajeno.
- Diff de package.json, bun.lock y app/_layout.tsx contra H0: vacío; se conserva headerShown ×2.
- Los 18 artboards son datos. La búsqueda de texto con apariencia de instrucciones no encontró coincidencias. No se ejecutaron sus scripts.
- No se actualiza traceability.md: el handoff reserva esa edición al commit final de la implementación, que no se alcanza. Las filas pendientes siguen abiertas.
- No se hace push ni PR.
- Total de tests nuevos hasta R6: 39 (total proyectado 4608 contra T0 4569). R7 enmienda tres existentes y no añade it. No se midió la suite completa; la cifra 4608 es una proyección, no un resultado observado.
- Estado final deliberado: commits test/feat de R1–R6 y commit test rojo de R7. Tras revertir la implementación de R7, sus tres tests quedan pendientes de implementación; no se vende este HEAD como verde global.

## R23 — lista para el humano (pendiente)

Ejecutar únicamente tras completar R1–R22 y recibir aprobación del reviewer, en dev build Android, tema claro y oscuro:


Tras el veredicto aprobado del reviewer, el humano corre el smoke de R23 en
dev build Android (no Expo Go), en su PC, con tema claro y oscuro:

1. NuevoRecordatorio: el chip de tipo y el de antelación seleccionados muestran
   un labio verde de 3 px bajo la cápsula que no pisa la fila siguiente.
2. Alertas: el botón de reconocer de una fila abierta muestra un labio gris de
   3 px; rojos y ámbar son los nuevos (`#D92D20`, `#B54708` en claro).
3. Horario de comidas: el resumen verde tiene labio de 5 px; «Editar» mide 36 y
   «Añadir comida» 50, cada uno con su labio gris colgando y sin solaparse.
4. Nutrición, Salud, Perfil y la celebración: el título grande se lee igual
   que antes (el cambio de `tracking-tight` a `tracking-title` es de
   -0.025em a -0.02em).
5. Inicio: las tarjetas entran subiendo 14 px en 400 ms escalonadas; con
   «Quitar animaciones» del sistema activo aparecen sin moverse ni fundirse.

`ToggleSwitch`, `ScreenHeader` y `useShadows()` no se ven en la app (R20):
su smoke va con la ola 2. Si el humano lo prefiere, puede delegar la firma de
la casilla en el leader citando el mensaje donde dio el visto bueno.


## Archivos committeados desde H0 al primer cierre (móvil/docs)

```text
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
mobile-pet-tracker/src/app/(tabs)/food.tsx
mobile-pet-tracker/src/components/__tests__/celebration.test.tsx
mobile-pet-tracker/src/components/celebration.tsx
mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.tsx
mobile-pet-tracker/src/theme/__tests__/chunky-lip.test.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
mobile-pet-tracker/src/theme/chunky-lip.ts
mobile-pet-tracker/src/theme/global.css
```

Todos pertenecen a la lista cerrada. El código de NuevoRecordatorio no figura: su implementación tentativa se revirtió tras documentar el diff. El estado `git status --short -- mobile-pet-tracker/ specs/ docs/` quedó vacío. El reporte se entrega en commit docs, sin modificar la trazabilidad reservada al cierre final de R22.

Nota de desarrollo: el primer borrador del extractor de CF R6 exigía cada declaración en una sola línea y daba falsos rojos para las tres variantes existentes. Antes del commit de test se corrigió para aislar la declaración hasta la siguiente clave; el rojo válido quedó en 17 fallos (ocho variantes ausentes en CF, ocho en CL y el inventario CL), con las tres filas existentes verdes.

## Reanudación — 2026-10-23

Autorizada por el humano y el commit 1e0d70cf del leader. Primer comando de esta reanudación confirmó `/home/claude/sites/Pet-Tracker-wt-197` y `feature/197-mobile-canvas-foundations`, árbol limpio. El bloqueo histórico de R7 queda resuelto por la fila CHIP_SELECTED y la Enmienda mecánica permitida. No se rehacen R1–R6 ni d8c65463. Se retira el marcador .done anterior hasta el cierre nuevo.

## Enmiendas mecánicas

La constante CHIP_SELECTED ya tiene autorización explícita y no es una enmienda adicional.

| Fichero › describe › it | Literal viejo → nuevo | R |
|---|---|---|
| src/screens/meal-schedule/index.test.tsx › #179 R6 › el dueño ve las dos entradas planas con Editar al final de cada fila | vía expectRows: h-9.75 rounded-10 border-2 border-b-5 border-lip-gray bg-surface px-3.5 → h-9 rounded-10 border-2 border-lip-gray bg-surface px-3.5 | R9 |

## R7 reanudado: verde

Rojo ampliado: `Tests: 20 failed, 45 passed, 65 total`. Verde: `Tests: 65 passed, 65 total`. Tres sondas de producción (reintroducir el borde, retirar estilo solo de tipo, retirar estilo solo de antelación) rojas y revertidas. El rojo de clase cubre los 17 casos de CHIP_SELECTED; los tests autorizados también detectan la pérdida de estilo. Sin nuevos it. El bloqueo histórico queda cerrado.

## R8

Rojo: 5 failed (AL 4 casos + CN), por aserción. Verde seleccionado final: Tests:       145 skipped, 5 passed, 150 total . Sonda: retirar solo el estilo del ack, detectada por todos los candados enmendados y revertida. Se conserva variant, hitSlop y los handlers. Un reemplazo demasiado amplio añadió sufijos a dos nombres sin cambiar sus aserciones; se corrigió en commit de test separado antes del feat. No hay it nuevos.

Enmienda mecánica R9: MS › #179 R6 › el dueño ve las dos entradas planas con Editar al final de cada fila. Helper expectRows cambia el literal exacto h-9.75 … border-b-5 por h-9 … sin borde; sufijo añadido. Autorizada por la Enmienda mecánica permitida.

## R9

Rojo: 7 failed, 19 passed, 123 skipped (149 total). Verde de pantalla completa: Tests: 74 passed, 74 total. Verde seleccionado MS+CN: Tests:       123 skipped, 26 passed, 149 total. Sondas resumen (estilo simple de esquina), Editar (sin labio), Añadir (sin labio): rojas y revertidas. La suma de CN cuenta usos reales en lugar de sumar el inventario esperado, para que la sonda detecte la regresión. El comprobador de logs de sondas se amplió para reconocer el formato expect(instance) de RNTL; la sonda Editar ya era roja por la aserción correcta. No hay it nuevos.

## R10

Nace verde tras R7–R9: Tests: 185 skipped, 24 passed, 209 total (CF+CC+CN+AC). Un it nuevo CF y reemplazo uno-a-uno de #177 R8.2 por #197 R10 (recuento conservado). Once sondas rojas y revertidas: border-b-3, border-b-5, border-b-6, border-black/25, llamada del consumidor, neutral, neutralCompact, summary, ancla Editar y guards legacy/comentarios sobre los nuevos consumidores. Las filas sin cambio semántico de los it.each conservan sus aserciones.

## R11

Rojo por aserción: Tests: 3 failed, 54 passed, 57 total. Verde: Tests: 57 passed, 57 total. Dos it nuevos. Sondas offset 15, duración 399 y exportación extra: todas rojas y revertidas; cubren CF, forma de MT y el inventario de 37 claves.

## R12

Rojo: Tests: 4 failed, 3 skipped, 7 total. Verde: Tests: 3 skipped, 4 passed, 7 total. Sondas opacidad final incorrecta, offset por defecto +1 y retardo +1: rojas y revertidas. El test de receta diferida también comprueba el timing al invocarla para detectar el cambio de producción. Sin it nuevos.

## R13

Rojo: Tests: 3 failed, 270 skipped, 4 passed, 277 total. Verde: Tests: 270 skipped, 7 passed, 277 total. Las cuatro filas #190 R1 nacen verdes por R12. Sondas: restaurar entrada bajo reduce motion y cambiar offset a 15; rojas y revertidas. HI #152 R7 verifica HomeEntrance del resumen sin entrada bajo reduce motion y, tras rerender sin reduce motion, el timing 400/System del reveal interior; este último sigue respetando el sistema mediante MOTION_RISE_TIMING. No se toca home/index.tsx de producción. Sin it nuevos. Lecturas de rutas de tipos RNTL inexistentes se corrigieron consultando rg --files; sin cambios de código por ese error de invocación.

## R14

Rojo por aserción: Tests: 8 failed, 106 passed, 114 total. Verde: Tests: 114 passed, 114 total. Ocho it nuevos. Seis sondas retiran individualmente el token oscuro dejando el claro correcto: rojas y revertidas, cubren todas las filas CF y GC.

## R15

Rojo: Tests: 23 failed, 36 passed, 59 total, por aserción (módulo ausente se trata expresamente como exportación ausente, sin import roto). Verde inicial: Tests: 59 passed, 59 total. 23 it nuevos: SW 13 y CF 10. Diez sondas alteran la primera capa de cada variante; tres adicionales alteran tokens pedidos, referencia memoizada y dependencia accent: todas rojas y revertidas. El test de re-resolución cambia cada color por separado para cubrir las ocho dependencias. Helper local de capas, sin promover el helper de chunky-lip porque su contrato es de labios sin blur.

## R16

Rojo: Tests: 3 failed, 46 passed, 49 total. Verde: Tests: 49 passed, 49 total. Tres it nuevos. Sondas pista, pulgar y distancia al borde: rojas y revertidas. Los tests espían los props recibidos por Switch y Thumb y delegan el render a los componentes reales: HeroUI consume animation antes de llegar al nodo host. Se consulta el pulgar con includeHiddenElements, conservando su accesibilidad decorativa.

## R17

Nace verde tras R16, sin cambio de producción: Tests: 5 passed, 5 total. Tres it nuevos, eventos await sobre Switch real y selección controlada comprobada. Sondas handler anulado e isDisabled ignorado: rojas y revertidas. Se reconoce también el formato expect(jest.fn()) en el comprobador de sondas; el rojo del handler ya era correcto (cero llamadas frente a una).

## R18

Rojo: Tests: 1 failed, 7 passed, 8 total (sin trazo nace verde). Verde: Tests: 8 passed, 8 total. Dos it nuevos. Sondas trazo fijo 2.3 y defecto 2: rojas y revertidas. Los seis #172 R2 permanecen verdes y sin editar.

## R19

Rojo por aserción: Tests: 9 failed, 94 skipped, 4 passed, 107 total. Verde: Tests: 94 skipped, 13 passed, 107 total. Siete it nuevos (HD 6 + CF 1). Ocho sondas: margen, eyebrow, título 24, título 26/inventario PC, accesorio, trazo, título opcional e inventario tracking AC; rojas y revertidas. PC y AC amplían solo los inventarios aprobados.

## R20

Nace verde: Tests: 74 skipped, 5 passed, 79 total. Cuatro it nuevos CF (tres módulos + layout). Sondas de import desde producción para los tres módulos y retirada de accent del hook de sombras: rojas y revertidas. **Sin sonda de mutación sobre app/_layout.tsx**, porque el handoff prohíbe tocar ese fichero; el candado se complementa con diff byte a byte vacío contra H0 y recuento headerShown ×2. No se afirma probada por mutación esa fila.

## R21

Rojo: Tests: 8 failed, 268 skipped, 1 passed, 277 total (D-H nace verde). Verde: Tests: 268 skipped, 9 passed, 277 total. Cinco it nuevos. Siete sondas sobre los cuatro bloques permitidos: tracking, leading, cada una de las tres recetas, texto de Enmienda y duplicación de D-H dentro de la Enmienda nueva: rojas y revertidas. La línea D-H original no se altera ni durante las sondas. Se agrupan las tres recetas del bloque Punto 13 antes de Sin labio para conservar el bloque canónico byte a byte. Ninguna otra enmienda cambia.

## R22

Nace verde: Tests: 68 passed, 68 total (CF completo). Once it nuevos: diez fuentes y dependencias. Diez sondas introducen una marca legacy de elevation en una fuente cada vez: todas rojas y revertidas. **Sin sonda sobre package.json/bun.lock**, porque el handoff prohíbe tocarlos; los recuentos 44/8 y el diff vacío contra H0 se verifican al cierre. No se afirma probada por mutación esa fila.

## Historial TDD completo — commits y mediciones del paso

Cada fila asocia el commit al log observado del paso (rojo por aserción o verde). Los logs de sonda de los tests reforzados son rojos con la mutación plantada y luego revertida. Las mediciones se realizan antes de commitear, siguiendo TDD; no se presentan como una suite global por commit.

| Commit | Mensaje | Tests: (log asociado) |
|---|---|---|
| `03de724e` | test(#197): R1 lock light colors to frozen canvas | 5 failed, 70 skipped, 2 passed, 77 total (r1-red-197.log) |
| `28fa2d22` | feat(#197): R1 align light semantic colors with canvas | 70 skipped, 7 passed, 77 total (r1-green-197.log) |
| `f0aa3db8` | test(#197): R2 verify updated state color contrast | 78 passed, 78 total (r2-green-197.log) |
| `4a792781` | test(#197): R3 lock canvas tracking and line heights | 7 failed, 78 passed, 85 total (r3-red-197.log) |
| `3bfbbebf` | feat(#197): R3 add canvas typography tokens | 85 passed, 85 total (r3-green-197.log) |
| `c702f6fd` | test(#197): R4 align title tracking guards with canvas | 23 failed, 401 skipped, 4 passed, 428 total (r4-red-197.log) |
| `1fa7db78` | feat(#197): R4 use canvas tracking for large titles | 401 skipped, 27 passed, 428 total (r4-green-197.log) |
| `f6fc598c` | test(#197): R5 lock new lip colors in both themes | 7 failed, 86 passed, 93 total (r5-red-197.log) |
| `3a05751e` | feat(#197): R5 add canvas lip tokens in both themes | 93 passed, 93 total (r5-green-197.log) |
| `76f76621` | test(#197): R6 cover all eleven canvas lip variants | 17 failed, 26 passed, 43 total (r6-red-197.log) |
| `7f242bc7` | feat(#197): R6 expand memoized canvas lip catalogue | 43 passed, 43 total (r6-green-197.log) |
| `d8c65463` | test(#197): R7 require external lips on selected reminder chips | 3 failed, 62 skipped, 65 total (r7-red-197.log) |
| `d285ec01` | test(#197): R7 amend CHIP_SELECTED for the lip-less selected chip | 20 failed, 45 passed, 65 total (r7-resume-red-197.log) |
| `885bca96` | feat(#197): R7 render reminder chip lips outside their bodies | 65 passed, 65 total (r7-green-197.log) |
| `871ac40f` | test(#197): R8 require compact external lips on alert acknowledgements | 5 failed, 141 skipped, 4 passed, 150 total (r8-red-197.log) |
| `58a976b0` | test(#197): R8 limit amended titles to acknowledgement assertions | 5 failed, 141 skipped, 4 passed, 150 total (r8-red-197.log) |
| `14acfd53` | feat(#197): R8 apply compact neutral lips to alert rows | 145 skipped, 5 passed, 150 total (r8-green-197.log) |
| `f2a479a8` | test(#197): R9 lock meal schedule body heights and external lips | 7 failed, 123 skipped, 19 passed, 149 total (r9-red-197.log) |
| `af69e294` | test(#197): R9 count actual corner uses in the aggregate guard | 5 failed, 123 skipped, 21 passed, 149 total (r9-probe-summary-197.log) |
| `3156ffa6` | feat(#197): R9 move meal schedule lips outside canvas body heights | 123 skipped, 26 passed, 149 total (r9-green-197.log) |
| `584d92d3` | test(#197): R10 close external lip inventories and guards | 185 skipped, 24 passed, 209 total (r10-green-197.log) |
| `26f7b406` | test(#197): R11 pin rise motion to frozen canvas values | 3 failed, 54 passed, 57 total (r11-red-197.log) |
| `36cde247` | feat(#197): R11 export the canvas rise timing and offset | 57 passed, 57 total (r11-green-197.log) |
| `1218c3d4` | test(#197): R12 require timing-based staggered home entrances | 4 failed, 3 skipped, 7 total (r12-red-197.log) |
| `7f4c87ee` | feat(#197): R12 animate home entrances with the canvas rise timing | 3 skipped, 4 passed, 7 total (r12-green-197.log) |
| `4957fab0` | test(#197): R13 require no home entrance under reduced motion | 3 failed, 270 skipped, 4 passed, 277 total (r13-red-197.log) |
| `fea73469` | feat(#197): R13 omit home entrance animations under reduced motion | 270 skipped, 7 passed, 277 total (r13-green-197.log) |
| `36ccb4e5` | test(#197): R14 bind shadow colors to both canvas themes | 8 failed, 106 passed, 114 total (r14-red-197.log) |
| `4cdcb891` | feat(#197): R14 add semantic shadow tokens for both themes | 114 passed, 114 total (r14-green-197.log) |
| `db896099` | test(#197): R15 cover the canvas shadow catalogue and memoization | 23 failed, 36 passed, 59 total (r15-red-197.log) |
| `26273b33` | test(#197): R15 verify each shadow color dependency independently | 1 failed, 12 passed, 13 total (r15-probe-dependency-197.log) |
| `a250f6da` | feat(#197): R15 add the memoized canvas shadow catalogue | 59 passed, 59 total (r15-green-197.log) |
| `4576ab78` | test(#197): R16 pin switch geometry and forwarded props | 3 failed, 46 passed, 49 total (r16-red-197.log) |
| `8eae2efb` | feat(#197): R16 add the canvas toggle switch wrapper | 49 passed, 49 total (r16-green-197.log) |
| `c456bd7e` | test(#197): R17 verify controlled and disabled switch interactions | 5 passed, 5 total (r17-green-197.log) |
| `f25046b2` | test(#197): R18 cover optional back chevron stroke width | 1 failed, 7 passed, 8 total (r18-red-197.log) |
| `ec1f969c` | feat(#197): R18 forward optional chevron stroke width | 8 passed, 8 total (r18-green-197.log) |
| `98cf944b` | test(#197): R19 lock the content header structure and typography | 9 failed, 94 skipped, 4 passed, 107 total (r19-red-197.log) |
| `6cd3b1d8` | test(#197): R19 assert accessory presence before its row position | 1 failed, 94 skipped, 12 passed, 107 total (r19-probe-accessory-197.log) |
| `67c55afb` | feat(#197): R19 add the canvas content header component | 94 skipped, 13 passed, 107 total (r19-green-197.log) |
| `66f9d00f` | test(#197): R20 keep the new foundations unwired | 74 skipped, 5 passed, 79 total (r20-green-197.log) |
| `9c2d837b` | test(#197): R21 require the canonical canvas charter amendment | 8 failed, 268 skipped, 1 passed, 277 total (r21-red-197.log) |
| `66065bef` | feat(#197): R21 apply the canonical canvas foundations charter | 268 skipped, 9 passed, 277 total (r21-green-197.log) |
| `e74076a9` | test(#197): R22 guard clean sources and unchanged dependency counts | 68 passed, 68 total (r22-green-197.log) |

## Verificación final — avances

- Typecheck: guard router.d.ts ausente y bun run typecheck, exit 0 (progress/typecheck-final-197.log).
- Lint: bunx expo lint --no-cache con redirect, exit 0 y log de 0 bytes; test ! -s verde (progress/lint-197.log).
- graphify update .: exit 0. AST sin LLM; 28095 nodos, 36247 aristas, 1847 comunidades. Aviso: 20 ficheros SQL omitidos porque tree_sitter_sql no está instalado; no se añaden dependencias. Artefactos en graphify-out (ignorados).
- Guardas manuales: dark conserva todos los valores previos salvo nuevos tokens; success/lip/lip-gray intactos; las 35 exportaciones previas de motion mantienen sus valores; solo se añaden RISE_OFFSET_Y/RISE_TIMING. D-H idéntica y una sola vez. Horario/Historial sin shadow/elevation. Callers de BackButton sin strokeWidth. ui-copy-table, layout y dependencias idénticos a H0.
- Lista cerrada: exactamente 40/40 rutas de móvil/docs, sin ninguna extra. Se adjunta la lista al cierre final.
- Excepciones de sondas: no se mutaron app/_layout.tsx ni package.json/bun.lock, por prohibición explícita del handoff. Esas filas se comprueban con igualdad contra H0, recuentos y suite, sin atribuirles una sonda inexistente.

## Cierre de Verificación final — VERDE

Reanudación 2, autorización b2f73327. Comando bun run test --runInBand, con pgrep de Jest e init vacíos antes del arranque; exit 0. Log completo sin pipe: progress/final-test-197.log.

~~~text
Test Suites: 142 passed, 142 total
Tests:       4683 passed, 4683 total
Snapshots:   1 passed, 1 total
Time:        341.485 s, estimated 376 s
~~~

Respecto a T0: 4569 → 4683 (**114 tests nuevos, ninguno eliminado**); 137 → 142 suites. Snapshot conservado 1/1. Los dos candados obsoletos del cierre anterior quedan resueltos por 7da0e950 con las tres filas autorizadas. No aparecen rojos nuevos ni enmiendas mecánicas adicionales en esta reanudación.

Las nueve guardas pasan en la suite completa: design-drift, consistency-classnames, legibility-classnames, chunky-cta-canvas-fidelity, alerts-canvas-fidelity, tab-headers-canvas, profile-canvas-fidelity, ui-language, canvas-foundations.

Tipos: test ! -e .expo/types/router.d.ts y bun run typecheck, exit 0 (progress/typecheck-final-197.log). Lint: bunx expo lint --no-cache con redirección a progress/lint-197.log y test ! -s, exit 0, 0 bytes. git diff --check verde.

git diff 046133e8 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/app/_layout.tsx vacío. HomeEntrance no cambia durante R24. Tema oscuro conserva todos sus valores anteriores; solo se añaden los cinco labios y seis colores de sombras aprobados. D-H y el bloque de #195 están intactos; copy y exportaciones antiguas de motion conservados. Guardas manuales: progress/manual-guards-final-197.log, exit 0.

graphify update .: exit 0, AST sin LLM, 28113 nodos, 36267 aristas, 1852 comunidades. Avisos: 20 SQL omitidos por tree_sitter_sql ausente; las etiquetas de comunidades existentes se reasignan por hub. No se instalan dependencias ni se invoca etiquetado LLM. Artefactos en graphify-out ignorados.

### Lista exacta de archivos móvil/docs desde H0

~~~text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
mobile-pet-tracker/src/app/(tabs)/food.tsx
mobile-pet-tracker/src/components/__tests__/back-button.test.tsx
mobile-pet-tracker/src/components/__tests__/celebration.test.tsx
mobile-pet-tracker/src/components/__tests__/rise-in.test.tsx
mobile-pet-tracker/src/components/__tests__/screen-header.test.tsx
mobile-pet-tracker/src/components/__tests__/toggle-switch.test.tsx
mobile-pet-tracker/src/components/back-button.tsx
mobile-pet-tracker/src/components/celebration.tsx
mobile-pet-tracker/src/components/rise-in.tsx
mobile-pet-tracker/src/components/screen-header.tsx
mobile-pet-tracker/src/components/toggle-switch.tsx
mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
mobile-pet-tracker/src/screens/add-reminder/index.tsx
mobile-pet-tracker/src/screens/alerts/index.test.tsx
mobile-pet-tracker/src/screens/alerts/index.tsx
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
mobile-pet-tracker/src/screens/home/home-entrance.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
mobile-pet-tracker/src/screens/profile/index.test.tsx
mobile-pet-tracker/src/screens/profile/index.tsx
mobile-pet-tracker/src/theme/__tests__/chunky-lip.test.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/__tests__/shadows.test.tsx
mobile-pet-tracker/src/theme/chunky-lip.ts
mobile-pet-tracker/src/theme/global.css
mobile-pet-tracker/src/theme/motion.ts
mobile-pet-tracker/src/theme/shadows.ts
~~~

43/43 coinciden exactamente con la lista cerrada ampliada. R23 conserva su lista de cinco puntos en este reporte para el humano, tras el veredicto del reviewer. No se ejecuta init.sh, no se hace push ni se abre PR. La tabla definitiva y los tres commits de esta reanudación figuran abajo.

## Reanudación 2

Autorización b2f73327 leída junto con requirements, design y tasks. Primer comando comprobó ruta y rama correctas y worktree limpio. Se retira el marcador anterior durante el trabajo. Mismo H0, sin rehacer R1–R22 ni ejecutar init.sh.

### Paso 1 — candados autorizados de #195

7da0e950 test(#197): amend #195 contrast and charter-section locks (R1, R21).
Tests: 28 passed, 28 total (progress/resume2-195-197.log).
Los tres it nacen verdes, incluido el tercero que ya pasaba. Solo cambia la séptima referencia clara (3.76 → 4.83); no cambian suelos ni referencias oscuras. Los dos it de carta comparten charterSection, que corta en la siguiente cabecera o EOF; las siguientes cabeceras deben ser enmiendas.
Sondas: probe-resume2-contrast-197.log y probe-resume2-section-197.log: exit 1 por aserción, restauradas. probe-resume2-section-boundary-197.log: exit 0 al añadir temporalmente medidas antiguas a #197, demostrando el aislamiento de #195. El tercer it no lleva sonda roja en #195: el handoff prohíbe alterar otras enmiendas, incluso para esta prueba; queda explícitamente sin esa sonda destructiva. El bloque #195 se conserva intacto. No hay enmiendas mecánicas nuevas fuera de las tres filas autorizadas.

### R24 — entrada compartida

3b96b769 test(#197): R24 lock the shared rise entrance (R24).
Tests: 1 failed, 69 passed, 70 total (progress/r24-red-197.log); RI no carga por import ausente, como autoriza Reanudación 2; el caso nuevo CF R22 falla por aserción de longitud 0. CF R20 rise-in nace verde.
Implementación mínima: worklet propio, opacidad 0 y desplazamiento 14 al inicio; withDelay(delayMs, withTiming(..., MOTION_RISE_TIMING)) en ambas propiedades, entering undefined bajo reduce motion. Props opcionales y children directos. HomeEntrance permanece sin cambios en R24; no hay consumidores.
Tests: 74 passed, 74 total (progress/r24-green-197.log y progress/r24-restored-197.log tras sondas).
Sondas rojas por aserción y restauradas: probe-r24-offset, delay, timing, reduced, classname, children-shape, unwired y clean (logs progress/<nombre>-197.log). Prueban los cuatro it RI y las nuevas filas CF R20/R22, incluida la nacida verde. El primer intento children retiraba el hijo y falló al buscarlo, no por expect: no se cuenta como sonda válida; se reemplazó por children-shape (añade un wrapper), que sí falla por aserción. Ninguna mutación permanece en producción.

ece57bea feat(#197): R24 add the shared RiseIn entrance (R24).
Tests: 74 passed, 74 total (restored), 70 → 74 con los cuatro it RI; CF añade otros dos respecto a la base de la primera Verificación final.

### Verificación final de Reanudación 2 — verde

Tipos: guardia test ! -e .expo/types/router.d.ts satisfecha, bun run typecheck exit 0. Guardas manuales exit 0: 43/43 archivos de la lista ampliada exactos; tema oscuro conserva sus valores anteriores y solo gana once tokens permitidos; success y labios anteriores intactos; D-H y #195 byte a byte; Horario e Historial sin sombras; headerShown x2; dependencias 44/8; layout, lockfile, package y copy intactos. HomeEntrance no cambia en R24. Detalle en progress/manual-guards-final-197.log.
Corrección de invocación en la comprobación manual: la primera lectura usó meal-history/index.tsx (ENOENT); rg --files identificó meals-history/index.tsx y se repitió la guarda completa con exit 0, sin editar código. La suite completa conserva todo su log en progress/final-test-197.log, sin pipe.

Lint: exit 0, log 0 bytes. Graphify: exit 0, 28113 nodos / 36267 aristas / 1852 comunidades. Suite completa: Test Suites: 142 passed, 142 total; Tests:       4683 passed, 4683 total; Snapshots:   1 passed, 1 total; Time:        341.485 s, estimated 376 s.

### Tabla final R1–R24 → test → commit

| R | Test | Commits |
|---|---|---|
| R1 | src/__tests__/canvas-foundations.test.ts::#197 R1; src/theme/__tests__/global-css.test.ts::paleta light/espejos (enmendado por #197 R1); src/__tests__/home-photo-hero-canvas.test.ts::#195 R17 (enmendado por #197 R1) | 03de724e test(#197): R1 lock light colors to frozen canvas<br>28fa2d22 feat(#197): R1 align light semantic colors with canvas<br>7da0e950 test(#197): amend #195 contrast and charter-section locks (R1, R21) |
| R2 | src/__tests__/canvas-foundations.test.ts::#197 R2; src/theme/__tests__/global-css.test.ts::#61 R5 y #64 R4 (enmendado por #197 R2) | f0aa3db8 test(#197): R2 verify updated state color contrast |
| R3 | src/__tests__/canvas-foundations.test.ts::#197 R3; src/theme/__tests__/global-css.test.ts::#197 R3 | 4a792781 test(#197): R3 lock canvas tracking and line heights<br>3bfbbebf feat(#197): R3 add canvas typography tokens |
| R4 | src/__tests__/canvas-foundations.test.ts::#197 R4; src/__tests__/tab-headers-canvas.test.ts::#168 R1; src/__tests__/alerts-canvas-fidelity.test.ts::#174 R12; src/app/(tabs)/__tests__/food.test.tsx, src/screens/profile/index.test.tsx, src/screens/health/index.test.tsx::pinta el título grande; src/components/__tests__/celebration.test.tsx::R20.4 (enmendados por #197 R4) | c702f6fd test(#197): R4 align title tracking guards with canvas<br>1fa7db78 feat(#197): R4 use canvas tracking for large titles |
| R5 | src/__tests__/canvas-foundations.test.ts::#197 R5; src/theme/__tests__/global-css.test.ts::#197 R5 | f6fc598c test(#197): R5 lock new lip colors in both themes<br>3a05751e feat(#197): R5 add canvas lip tokens in both themes |
| R6 | src/__tests__/canvas-foundations.test.ts::#197 R6; src/theme/__tests__/chunky-lip.test.tsx::#197 R6 y #177 R2.1 (enmendado por #197 R6) | 76f76621 test(#197): R6 cover all eleven canvas lip variants<br>7f242bc7 feat(#197): R6 expand memoized canvas lip catalogue |
| R7 | src/screens/add-reminder/index.test.tsx::#178 R10 y #123 R5 (enmendados por #197 R7); constante CHIP_SELECTED de expectAdvanceChips (#125 R3/R4/R6 y #178 R12, 17 casos) | d8c65463 test(#197): R7 require external lips on selected reminder chips<br>d285ec01 test(#197): R7 amend CHIP_SELECTED for the lip-less selected chip<br>885bca96 feat(#197): R7 render reminder chip lips outside their bodies |
| R8 | src/screens/alerts/index.test.tsx::#78 R6 (enmendado por #197 R8); src/__tests__/consistency-classnames.test.ts::#174 R8 (enmendado por #197 R8) | 871ac40f test(#197): R8 require compact external lips on alert acknowledgements<br>58a976b0 test(#197): R8 limit amended titles to acknowledgement assertions<br>14acfd53 feat(#197): R8 apply compact neutral lips to alert rows |
| R9 | src/screens/meal-schedule/index.test.tsx::#147 R4, #179 R5/R6/R7 (enmendados por #197 R9); src/__tests__/consistency-classnames.test.ts::esquinas directas, suma y guard global (enmendados por #197 R9) | f2a479a8 test(#197): R9 lock meal schedule body heights and external lips<br>af69e294 test(#197): R9 count actual corner uses in the aggregate guard<br>3156ffa6 feat(#197): R9 move meal schedule lips outside canvas body heights |
| R10 | src/__tests__/canvas-foundations.test.ts::#197 R10; src/__tests__/chunky-cta-canvas-fidelity.test.ts::#197 R10 y #177 R7/R8/R12; src/__tests__/consistency-classnames.test.ts::#166 R2/R3; src/__tests__/alerts-canvas-fidelity.test.ts::#174 R12 (enmendados por #197 R10) | 584d92d3 test(#197): R10 close external lip inventories and guards |
| R11 | src/theme/__tests__/motion.test.ts::#197 R11 y #152 R1 inventario (enmendado por #197 R11); src/__tests__/canvas-foundations.test.ts::#197 R11 | 26f7b406 test(#197): R11 pin rise motion to frozen canvas values<br>36cde247 feat(#197): R11 export the canvas rise timing and offset |
| R12 | src/screens/home/home-entrance.test.tsx::#152 R3/R4 (cuatro it enmendados por #197 R12) | 1218c3d4 test(#197): R12 require timing-based staggered home entrances<br>7f4c87ee feat(#197): R12 animate home entrances with the canvas rise timing |
| R13 | src/screens/home/home-entrance.test.tsx::#152 R4 reduce motion; src/screens/home/index.test.tsx::#190 R1/R7 y #152 R7 (enmendados por #197 R13) | 4957fab0 test(#197): R13 require no home entrance under reduced motion<br>fea73469 feat(#197): R13 omit home entrance animations under reduced motion |
| R14 | src/theme/__tests__/global-css.test.ts::#197 R14; src/__tests__/canvas-foundations.test.ts::#197 R14 | 36ccb4e5 test(#197): R14 bind shadow colors to both canvas themes<br>4cdcb891 feat(#197): R14 add semantic shadow tokens for both themes |
| R15 | src/theme/__tests__/shadows.test.tsx::#197 R15 (13 casos); src/__tests__/canvas-foundations.test.ts::#197 R15 (10 filas) | db896099 test(#197): R15 cover the canvas shadow catalogue and memoization<br>26273b33 test(#197): R15 verify each shadow color dependency independently<br>a250f6da feat(#197): R15 add the memoized canvas shadow catalogue |
| R16 | src/components/__tests__/toggle-switch.test.tsx::#197 R16; src/__tests__/canvas-foundations.test.ts::#197 R16 | 4576ab78 test(#197): R16 pin switch geometry and forwarded props<br>8eae2efb feat(#197): R16 add the canvas toggle switch wrapper |
| R17 | src/components/__tests__/toggle-switch.test.tsx::#197 R17 | c456bd7e test(#197): R17 verify controlled and disabled switch interactions |
| R18 | src/components/__tests__/back-button.test.tsx::#197 R18 | f25046b2 test(#197): R18 cover optional back chevron stroke width<br>ec1f969c feat(#197): R18 forward optional chevron stroke width |
| R19 | src/components/__tests__/screen-header.test.tsx::#197 R19; src/__tests__/canvas-foundations.test.ts::#197 R19; src/__tests__/profile-canvas-fidelity.test.ts::#173 R2.4 y src/__tests__/alerts-canvas-fidelity.test.ts::#174 R12 (enmendados por #197 R19) | 98cf944b test(#197): R19 lock the content header structure and typography<br>6cd3b1d8 test(#197): R19 assert accessory presence before its row position<br>67c55afb feat(#197): R19 add the canvas content header component |
| R20 | src/__tests__/canvas-foundations.test.ts::#197 R20; src/__tests__/legibility-classnames.test.ts::accent (enmendado por #197 R20) | 66f9d00f test(#197): R20 keep the new foundations unwired<br>3b96b769 test(#197): R24 lock the shared rise entrance (R24), caso rise-in |
| R21 | src/__tests__/canvas-foundations.test.ts::#197 R21; src/__tests__/design-drift.test.ts::#178 R2/#179 R2; src/__tests__/chunky-cta-canvas-fidelity.test.ts::#177 R11.1; src/__tests__/alerts-canvas-fidelity.test.ts::#174 R11 (enmendados por #197 R21); src/__tests__/home-photo-hero-canvas.test.ts::#195 R20 (dos it enmendados por #197 R21) | 9c2d837b test(#197): R21 require the canonical canvas charter amendment<br>66065bef feat(#197): R21 apply the canonical canvas foundations charter<br>7da0e950 test(#197): amend #195 contrast and charter-section locks (R1, R21) |
| R22 | src/__tests__/canvas-foundations.test.ts::#197 R22 (12 casos) | e74076a9 test(#197): R22 guard clean sources and unchanged dependency counts<br>3b96b769 test(#197): R24 lock the shared rise entrance (R24), caso rise-in |
| R23 | smoke humano (requirements.md § Cierre del humano) | pendiente |
| R24 | src/components/__tests__/rise-in.test.tsx::#197 R24; src/__tests__/canvas-foundations.test.ts::#197 R20 y #197 R22 (caso rise-in) | 3b96b769 test(#197): R24 lock the shared rise entrance (R24)<br>ece57bea feat(#197): R24 add the shared RiseIn entrance (R24) |

R23: pendiente del humano tras aprobación del reviewer; no se afirma haber realizado el smoke. El marcador .done comunica al leader que este reporte está listo. Todas las filas automatizadas R1–R22 y R24 tienen hashes; se elimina la sección de bloqueo global de traceability.md. Reporte y trazabilidad se entregan juntos en el último commit docs.
