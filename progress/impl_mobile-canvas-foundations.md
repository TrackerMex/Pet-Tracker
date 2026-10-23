# Implementación mobile-canvas-foundations (#197)

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

## BLOQUEADO en R7 — inventario de candados incompleto

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

## Tabla R1–R22 → test → commit

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

## Verificación y límites del cierre bloqueado

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


## Archivos committeados desde H0 (móvil/docs)

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
