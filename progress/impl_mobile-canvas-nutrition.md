# Implementación #200 — mobile-canvas-nutrition

Estado final al 2026-10-24: R1–R17 implementados y verificados por requisito. PARADA en el cierre global: BackButton #172 R2 recibe el color de respaldo en la suite completa. No se declara la feature done.

Las secciones anteriores a «Reanudación 2026-10-24 — 31837443» conservan la evidencia histórica de las paradas. Sus pendientes quedan sustituidos por la evidencia más reciente al final, sin borrar el historial.

## Identidad y alcance

Salida de la comprobación de identidad:
```
/home/claude/sites/Pet-Tracker-wt-200
feature/200-mobile-canvas-nutrition
0e6e3988 chore(spec): errata #200 en R17 y el inventario de candados
```
Desviación de orden: antes de conocer la orden del «primer comando» se leyó el handoff, ponytail y git status (solo lectura); la comprobación exacta fue la siguiente invocación, antes de editar. H0 = c285eae4.
No se ejecuta init.sh; lo corre el leader. Sin push, PR, merge ni rebase. No se modifican estado de feature ni ficheros del leader.

## Skills y documentación

Cargadas: ponytail:ponytail, building-native-ui y expo-tailwind-setup (plugin expo/11c74d6b), appllama-app-design-skill y animate-expo (.agents/skills). expo-overview, expo-animation, expo-router y expo-design-system no están disponibles con esos nombres; se siguen los equivalentes del handoff. Sin MCP Appllama; smoke Android corresponde al humano según carta §Skills. Consultada la documentación versionada https://docs.expo.dev/versions/v57.0.0/ por mobile/AGENTS.md.
Spec aprobada leída: requirements, design y tasks. Carta, arquitectura, convenciones y verificación consultadas. Artboards tratados solo como datos de diseño.
P1 y P2 están resueltos en la spec de 0e6e3988: CN suma 42→47 por pasos; guarda hex solo producción.

## Anclas T0

Todas coinciden con el handoff.
```
$ test ! -e src/screens/food && echo ausente
ausente
$ grep -c '' "src/app/(tabs)/food.tsx"
468
$ test -e "src/app/(tabs)/__tests__/food.test.tsx" && echo presente
presente
$ grep -cF "src/app/(tabs)/food.tsx'" src/__tests__/ui-copy-table.ts
25
$ grep -cF "src/screens/food/index.tsx'" src/__tests__/ui-copy-table.ts
0
$ grep -cF '<Card' "src/app/(tabs)/food.tsx"
6
$ grep -cF "from '../../components/card'" "src/app/(tabs)/food.tsx"
1
$ grep -cF 'style={CONTINUOUS_CORNER}' "src/app/(tabs)/food.tsx"
1
$ grep -cF 'text-accent-strong' "src/app/(tabs)/food.tsx"
1
$ grep -cF 'padding: 24,' "src/app/(tabs)/food.tsx"
1
$ grep -cF 'variant="avatars"' "src/app/(tabs)/food.tsx"
0
$ grep -cF 'KCAL_BAR_TIMING' "src/app/(tabs)/food.tsx"
2
$ grep -cF 'strokeOpacity={0.2}' "src/app/(tabs)/food.tsx"
1
$ grep -cF 'export const MOTION_RING_' src/theme/motion.ts
0
$ grep -cF "t('food.pending')" "src/app/(tabs)/food.tsx"
1
$ grep -cF 'food.pending' src/i18n/catalog.ts
2
$ grep -cF 'food.markServedAction' src/i18n/catalog.ts
0
$ grep -cF '<Sparkles size={18}' "src/app/(tabs)/food.tsx"
1
$ grep -cF '<ChevronRight size={20}' "src/app/(tabs)/food.tsx"
2
$ grep -cF 'tracking-tight' "src/app/(tabs)/food.tsx"                                          # B19: 0 (movida por
0
$ grep -cF 'headerShown' src/app/_layout.tsx
2
$ grep -cF "name=\"meal-schedule\" options={{ ...headerOptions, title: '' }}" src/app/_layout.tsx
1
$ grep -cF "name=\"meals-history\" options={{ ...headerOptions, title: '' }}" src/app/_layout.tsx
1
$ grep -cF 'HomeEntrance' src/screens/meal-schedule/index.tsx
5
$ grep -cF 'HomeEntrance' src/screens/meals-history/index.tsx
5
$ grep -cF 'meal-schedule-heading' src/screens/meal-schedule/index.tsx
1
$ grep -cF 'meals-history-heading' src/screens/meals-history/index.tsx
1
$ grep -cF 'paddingBottom: insets.bottom + 24' src/screens/meal-schedule/index.tsx
1
$ grep -cF 'paddingBottom: insets.bottom + 24' src/screens/meals-history/index.tsx
1
$ grep -cF '<ScreenHeader' src/screens/meal-schedule/index.tsx
0
$ grep -cF '<ScreenHeader' src/screens/meals-history/index.tsx
0
$ grep -cF 'chunkyLip.violet' src/screens/meal-schedule/index.tsx
0
$ ls src/components | grep -cF 'rise-in.tsx'                                                   # B28: 1 (movida por
1
$ ls src/components | grep -cF 'screen-header.tsx'                                             # B29: 1 (movida por
1
$ grep -cF -- '--leading-note' src/theme/global.css                                            # B30: 1 (movida por
1
$ grep -cF 'Enmienda #200' ../docs/ui-guidelines.md
0
$ test ! -e src/__tests__/nutrition-canvas-fidelity.test.ts && echo ausente
ausente
$ grep -cF '#197 R20: cimientos sin cablear' src/__tests__/canvas-foundations.test.ts          # B33: 1 (movida por
1
$ grep -cF "'app/(tabs)/food.tsx'" src/__tests__/canvas-foundations.test.ts                    # B34: 1 (movida por
1
$ grep -cF "'app/(tabs)/food.tsx'," src/__tests__/alerts-canvas-fidelity.test.ts               # B35: 1 (movida por
1
$ grep -cF 'export const MOTION_' src/theme/motion.ts                                          # B36: 37 (movida por
37
$ grep -cF 'sigue sin labio hasta #200' ../docs/ui-guidelines.md                               # B37: 1 (movida por
1
$ grep -cF 'sigue sin labio hasta #200' src/__tests__/chunky-cta-canvas-fidelity.test.ts       # B38: 1 (movida por
1
$ grep -cF 'sigue sin labio hasta #200' src/__tests__/design-drift.test.ts                     # B39: 1 (movida por
1
$ grep -cF 'const chunkyLip = useChunkyLip();' src/screens/meal-schedule/index.tsx
1
$ grep -cF 'contentInsetAdjustmentBehavior' src/screens/meal-schedule/index.tsx
1
$ grep -cF 'contentInsetAdjustmentBehavior' src/screens/meals-history/index.tsx
1
$ grep -cF 'Título en contenido (D-H)' ../docs/ui-guidelines.md
1
$ test ! -e .expo/types/router.d.ts && echo sin-router-d-ts
sin-router-d-ts
```
Base de suite facilitada por leader: 142 suites, 4683 tests, 1 snapshot.

## Registro TDD

## Enmiendas mecánicas

| Candado | Antes / después | R | Evidencia |
|---|---|---|---|
| CF #197 R21: Punto 13 | Cola antigua de Generar plan → cola R16(e) en el bloque esperado | R16 | r16-cf-mechanical-red-200.log: 1 rojo por literal exacto; luego sonda de carta |
| DD #178 R13 rounded16 | Sin Food → Food: 2 | R9 | Autorización expresa fila 53; 114 tests verdes y sonda R9 roja |

## Sondas de mutación

## Validación final y smoke

Feature incompleta. La parada y los resultados definitivos constan al final de este reporte.

### R1

- Rojo: `f4363121 test(#200): R1 require a thin nutrition route`. DS falla por `Received: 468`, `Expected: <= 5` (aserción, no import).
- Verde: pantalla extraída y FO movido con git mv; sin cambios de aserción. Candados de ruta [1–8], [42], [43] actualizados; nombres conservados con sufijo.
- `r1-red-200.log`: `Tests: 1 failed, 20 passed, 21 total`.
- `r1-green-200.log`: `Test Suites: 10 passed, 10 total`; `Tests: 559 passed, 559 total`; FO 31.035 s y EmptyState 65.768 s. Sin timeout. Solo el nuevo caso DS añade un test al total T0 (4684 esperado global).
- Sondas de ruta ejecutadas después del verde de R2 (tabla al final); la primera tentativa no arrancó por Jest de otro worktree (exit 75 de la guarda).
- Incidencias de herramientas: una aserción del script de edición detectó dos títulos iguales de DD; se acotó al describe correspondiente. Otra invocación de edición usó una ruta con prefijo de raíz desde cwd mobile y dio ENOENT, sin tocar ficheros; corregida desde la raíz. La suite no dependía de esas anotaciones de títulos y pasó; anotaciones terminadas después.
- Orden medido con node -e:
```
TH [4] ["components/celebration.tsx","screens/food/index.tsx","screens/health/index.tsx","screens/profile/index.tsx"]
ES [5] ["src/screens/alerts/index.tsx","src/screens/docs/index.tsx","src/screens/food/index.tsx","src/screens/geofences/index.tsx","src/screens/health/index.tsx","src/screens/home/index.tsx","src/screens/map/index.tsx","src/screens/profile/index.tsx","src/screens/reminders/index.tsx"]
```

### R2

- Rojo `a770860b`: `Tests: 7 failed, 108 passed, 115 total`; los cuatro casos nuevos fallan por padding, fila inexistente y gap, más tres candados previstos [9], [31], [44].
- Verde: `Tests: 115 passed, 115 total` (FO y PC, r2-green-200.log); +4 casos, total global esperado 4688. R2 conserva los niveles del contenido y gap-4 de esqueletos. B8 sigue en 1.
- Anotación de invocación: el primer intento del script de R2 tenía prefijo de raíz con cwd mobile y dio ENOENT antes de tocar nada; esa corrida accidental verde de 111 casos no se usa como rojo. Se corrigió el cwd, se escribieron los casos y se midió el rojo real de 115 casos.

### R3 y parada obligatoria

- Rojo `97e8fc3e`: seis casos nuevos de FO fallan por las clases de héroe; dos casos antiguos de FO y LG, AC, PC y CC fallan como prevé el inventario. `r3-red-confirm-200.log`: `Tests: 9 failed, 112 passed, 121 total` (FO y PC). `r3-red-200.log` tiene además LG, AC y CC.
- Error de edición corregido antes del commit: una sustitución demasiado amplia había añadido Food al inventario de `Card variant=hero` de PC. Se retiró esa modificación accidental (fuera de [45]), se repitió FO+PC rojo y se confirmó que el test de consumidores de Card hero sigue verde sin tocarlo.
- Implementación de R3: View hero con `style={[CONTINUOUS_CORNER, chunkyLip.hero]}` y clases exactas de R3; un solo hook; B8 sigue en 1. Los tests de Food y los candados afectados pasan dentro de la suite completa. La implementación se guarda en su commit separado para dejar el árbol móvil limpio, sin declarar verde global.
- En `bun run test` (`progress/r3-full-green-200.log`, nombre del log creado antes de conocer el resultado) aparece un rojo no inventariado en `src/screens/geofence-editor/index.test.tsx`:
  - Ocho casos `#189 R13: recetas al editar en {es,en} con nombre {"Casa", "", "   ", " Casa "}`: línea 806 espera `boxShadow[0].color: 'lip-gray'`, recibe `'#0D1117'`.
  - `#189 R13: busy bloquea ambos botones conservando las recetas`: línea 835 espera `'lip'`, recibe `'#0D1117'`.
- No son literales que R3 quite o sustituya, así que no aplica la excepción de enmienda mecánica. No se modifica el Editor ni sus tests.
- Diff medido frente a H0 (c285eae4), salida VACÍA:
```
git diff c285eae4 -- mobile-pet-tracker/src/screens/geofence-editor/index.tsx mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx mobile-pet-tracker/src/theme/chunky-lip.ts mobile-pet-tracker/src/theme/use-theme-colors.ts
```
Esto acredita que esos ficheros no se tocaron; no demuestra por sí solo la causa del fallo. No se hizo rerun ni workaround tras la parada.
- Orden verificado con node -e:
```
[39] ["screens/alerts/index.tsx","screens/food/index.tsx","screens/meal-schedule/index.tsx"]
[45] ["components/card.tsx","screens/alert-detail/index.tsx","screens/food/index.tsx","screens/profile/index.tsx"]
```

## Sondas ejecutadas y límites

`progress/r1-r2-mutation-200.log`: `Tests: 35 failed, 533 passed, 568 total`, 10 suites rojas, exit 1. Se plantaron mutaciones en `screens/food/index.tsx` y se restauró su contenido con `finally`; no se commitearon.

| Sonda en Food | Candados observados rojos |
|---|---|
| Import Card con comillas dobles (sin romper import) | DD importa Card |
| Alias FoodEmptyState | EmptyState: cuenta de Food e inventario global |
| tracking-title → tracking-tight | TH dos títulos, AC tracking-title y CF R4 |
| Quitar estilo de esquina directa | CN directUses, suma de esquina y candado R10 |
| Cambiar tinta accent-strong | LG inkSites |
| Cambiar textos de etiquetas de acento y añadir opacity-70 | LG opacidad y dos etiquetas |
| Comentarios de sonda con corchetes, StyleSheet, hex y text-accent | TH cuatro guardas y DD escapes |
| Literal de copy fijo fuera del catálogo | UI-language R194 R5 |
| Comentario queryKey: [ y signOut( | DD claves y sign-out |
| Comentario localTimeHhmm/new Date( | FO no deja rastro del reloj |
| Opacidad pulsada 0.8 → 0.7 | FO ancla propia de meal-toggle y feedback |
| variant avatars → chips | PC inventario de avatares |

Faltan las sondas específicas de los dos candados de FO enmendados por R2 (marco y hermanos del vacío), de los candados de R3 y de los requisitos aún no empezados. R1/R2 tuvieron verde antes de las sondas; la suite posterior de R3 vuelve a confirmar sus suites en verde tras restaurarlas. Ningún it nuevo nació verde: R1, los cuatro de R2 y los seis casos de R3 se observaron rojos por aserción. NC/R16/R17 no se han creado.

## Candados enmendados

| Inventario | Antes / después | Requisito |
|---|---|---|
| [1–8], [42], [43] | ruta app/(tabs)/food y FO antiguo → screens/food y FO junto a pantalla; listas reordenadas; mismas aserciones | R1 |
| [9] | padding 24 → lateral 20 y gap 14 | R2 |
| [31] | hermano food-title → food-title-row en vacío | R2 |
| [44] | avatars solo Perfil → Food y Perfil | R2 |
| [10–12] | tipografía antigua del héroe → caps/extrabold, 24, 14, 24 y 11 de R3 | R3 |
| [33] | consumers de useChunkyLip gana Food (una declaración) | R3 |
| [39] | tracking-caps gana Food entre alerts y meal-schedule | R3 |
| [45] | rounded-hero gana Food entre alert-detail y profile | R3 |

No hubo enmiendas mecánicas adicionales al inventario. P1 y P2 no llegan a ejercerse: R5/R7/R8/R9 y R17 quedan pendientes.

## Validaciones de cierre no alcanzadas

- Suite completa final: exit 1; 3 suites fallan, 139 pasan (142 total); 24 tests fallan, 4670 pasan (4694 total); 1 snapshot pasa. Duración 155.478 s. No se repitió la suite tras la parada.
- Typecheck y lint: no ejecutados tras la parada; no se borró .expo/types/router.d.ts (ausente al inicio).
- graphify update .: no ejecutado; cierre satisfactorio no alcanzado.
- Sin cambios en package.json, bun.lock ni _layout.tsx respecto a H0 (diff vacío). Las dos líneas previstas de layout corresponden a R12/R13, aún pendientes.
- No se ejecutó init.sh, no se regeneraron .env/node_modules, no se añadieron dependencias ni recursos AWS.
- Sin push, sin PR, sin merge/rebase; sin cambios de feature_list, STATUS, current ni history.
- Las desviaciones visuales D1–D6 aprobadas siguen según la spec; no se introduce otra decisión visual.

## Smoke Android pendiente (humano, claro y oscuro)

- [ ] Nutrición con plan: héroe con labio, anillo tras pausa, cascada plan/comidas/IA/enlaces.
- [ ] Marcar servido con labio; al pulsar, píldora y tile verdes con check, anillo avanza.
- [ ] Avisos entre comidas e IA.
- [ ] Avatares a la derecha del título y cambio de mascota recarga plan.
- [ ] Horario/Generar plan con labio violeta e Historial; flechas vuelven a Nutrición sin cabecera nativa duplicada.
- [ ] Eliminar animaciones de Android: sin movimiento.

No ejecutar este smoke como validación de #200 completa todavía: R4–R17 siguen pendientes.

## Resultado definitivo de la corrida completa

```
Test Suites: 3 failed, 139 passed, 142 total
Tests:       24 failed, 4670 passed, 4694 total
Snapshots:   1 passed, 1 total
Time:        155.478 s
```

Los 4694 tests son exactamente T0 4683 + R1 (1) + R2 (4) + R3 (6): no se borró ningún caso. Las suites de Food, DS, PC, CC, CN, LG, AC, DD, TH, UI-language, CF y EmptyState pasan en esta corrida.

Tres ficheros en rojo, ninguno modificado ni incluido en la lista cerrada:

1. `src/screens/geofence-editor/index.test.tsx`: 9 casos de R189 R13 ya descritos (tokens de labio frente a respaldo de color).
2. `src/__tests__/heroui-text-size-merge.test.ts`: `#187 R1: el escáner cubre al menos el universo medido (enmendado por #177 R9) (enmendado por #189 R5, R10, R13)` exige >=41 Card y mide 40 (línea 126). R3 retira un Card del héroe: es un delta medido que la spec no inventarió. Ese fichero tampoco está autorizado por la lista cerrada, por lo que no se enmienda. El leader debe resolver el inventario y su permiso antes de continuar; R5/R7/R8/R9 retirarán más Card.
3. `src/theme/__tests__/chunky-lip.test.tsx`: 14 casos: el mock useThemeColors recibe 0 llamadas y los estilos reciben el respaldo de color. No se modificaron ni el hook ni el resolver de colores ni este test. No se afirma una causa sin aislarla; corresponde al leader investigarla fuera de este alcance.

No se aplica ninguna enmienda mecánica fuera de los 51 candados. El motivo de parada ya existía con el primer fallo del Editor; estos otros fallos proceden de la misma corrida que se dejó terminar para conservar la evidencia completa.

## Commits y evidencia por paso

| Commit | Mensaje | Línea Tests de la verificación del paso |
|---|---|---|
| f4363121 | test(#200): R1 require a thin nutrition route | 1 failed, 20 passed, 21 total |
| 4c1eab22 | feat(#200): R1 extract nutrition behind a thin route | 559 passed, 559 total (10 suites afectadas) |
| a770860b | test(#200): R2 lock nutrition spacing and avatar title row | 7 failed, 108 passed, 115 total |
| 42d516d0 | feat(#200): R2 align nutrition spacing and avatar title row | 115 passed, 115 total (FO y PC) |
| 97e8fc3e | test(#200): R3 lock the nutrition hero surface and type scale | 9 failed, 112 passed, 121 total (confirmación FO y PC; otros candados en r3-red) |
| 556e103c | feat(#200): R3 align the nutrition hero with the canvas | 24 failed, 4670 passed, 4694 total (suite completa; suites afectadas verdes, global rojo) |

El commit docs de cierre contiene este reporte y la trazabilidad parcial. No constituye aprobación, estado done ni un verde global.

## Trazabilidad R1–R17

| R | Test | Rojo | Implementación | Pendiente |
|---|---|---|---|---|
| R1 | DS #200 R1, FO y candados de ruta | f4363121 | 4c1eab22 | cierre global verde |
| R2 | FO #200 R2 ×4 | a770860b | 42d516d0 | sondas FO marco/vacío y cierre global |
| R3 | FO #200 R3: héroe + it.each de cinco textos | 97e8fc3e | 556e103c | sondas, resolver inventario Card y rojos externos |
| R4 | MT y FO #200 R4 previstos | — | — | no iniciado |
| R5 | FO #200 R5 previsto | — | — | no iniciado |
| R6 | FO #200 R6 previsto | — | — | no iniciado |
| R7 | FO #200 R7 previsto | — | — | no iniciado |
| R8 | FO #200 R8 previsto | — | — | no iniciado |
| R9 | FO #200 R9 previsto | — | — | no iniciado |
| R10 | FO #200 R10 previsto | — | — | no iniciado |
| R11 | FO #200 R11 previsto en rojo R9 | — | — | no iniciado |
| R12 | MS y LY #200 R12 previstos | — | — | no iniciado |
| R13 | MH y LY #200 R13 previstos | — | — | no iniciado |
| R14 | MS #200 R14 previsto | — | — | no iniciado |
| R15 | MS y MH #200 R15 previstos | — | — | no iniciado |
| R16 | NC #200 R16 previsto | — | — | no iniciado |
| R17 | NC #200 R17 previsto | — | — | no iniciado |

## Listas ordenadas restantes verificadas con node

```
[42] AC tracking-title sorted: ["components/celebration.tsx","components/empty-state.tsx","components/pet-hero-header.tsx","components/screen-header.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/food/index.tsx","screens/geofence-editor/index.tsx","screens/geofences/index.tsx","screens/health/index.tsx","screens/meal-schedule/index.tsx","screens/meals-history/index.tsx","screens/pairing/index.tsx","screens/profile/index.tsx","screens/reminders/index.tsx"]
[42] order matches: true
[44] avatars: ["screens/food/index.tsx","screens/profile/index.tsx"]
```
Las listas de los requisitos no iniciados no se han modificado ni verificado.

## Diff y árbol al parar

`git diff c285eae4 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`: vacío.
`git diff c285eae4 -- mobile-pet-tracker/src/app/_layout.tsx`: vacío (R12/R13 no iniciados).
`git diff --check`: sin errores.
`git status --short -- mobile-pet-tracker/ specs/ docs/`: limpio antes del bookkeeping final; tras ese commit debe seguir limpio.

`git diff --name-only c285eae4..HEAD -- mobile-pet-tracker/ docs/` en el último commit de producción:
```
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(tabs)/food.tsx
mobile-pet-tracker/src/app/__tests__/detail-stack.test.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/screens/food/index.test.tsx
mobile-pet-tracker/src/screens/food/index.tsx
```
Git detecta el rename de FO (98%) y muestra la ruta nueva en esta salida. El historial de R1 conserva git mv desde `src/app/(tabs)/__tests__/food.test.tsx`. Solo se tocó el subconjunto autorizado de R1–R3; el resto de la lista cerrada sigue intacto. El handoff sin seguimiento preexistente se conserva.

Se crea `progress/impl_mobile-canvas-nutrition.done` incluso al parar, como pide el handoff. Significa fin de esta ejecución del arnés, no feature terminada.


## Reanudación autorizada — 562051d2

Identidad verificada antes de editar: /home/claude/sites/Pet-Tracker-wt-200, feature/200-mobile-canvas-nutrition, 562051d2. Árbol móvil/specs/docs limpio. El leader resolvió la parada y amplió el inventario con HT, fila 52; no se reescribe historia. Su corrida midió solo HT rojo (1 failed, 4693 passed, 4694 total). Si reaparecen los rojos de chunky-lip y Editor con mock a cero, se aislarán según el handoff antes de decidir una parada. El .done anterior ya está borrado por el leader.
Continúan las mismas skills y documentos ya leídos; no se ejecuta init.sh. Los apartados anteriores describen la primera ejecución; las filas siguientes registran la reanudación.

- HT: 14dee099 `test(#200): R3 lower the Card floor of the HeroUI scanner`; `Tests: 25 passed, 25 total` (r3-ht-green-200.log).
- Sondas reanudación R2/R3: `Tests: 17 failed, 261 passed, 278 total` (r2-r3-resume-mutation-200.log), seis suites rojas; se probaron marco y hermanos de vacío de FO, CC hook/guardas/comentarios, LG etiquetas, AC tracking-caps, PC rounded-hero y HT (otro Card retirado baja 40 a 39). Todas restauradas con finally. El antiguo candado FO de porcentaje/consumido se comprobará junto al anillo en R4.

### R4 reanudado
Rojo ce1bb032: `Tests: 6 failed, 119 passed, 125 total`. Verde f773b353: `Tests: 125 passed, 125 total`. Sonda r4-mutation-200.log: `Tests: 8 failed, 114 skipped, 6 passed, 128 total` (filtro R3/R4), renombre del export delay, duración 1101, pista .21 y texto porcentaje 22; prueba MT inventario y curva, FO pista/transición y el antiguo candado R3 de porcentaje. Restauradas.

### R5 reanudado
Rojo 4d7ddc5b: `Tests: 11 failed, 436 passed, 447 total`. Verde a7a23d9a: `Tests: 447 passed, 447 total`. Sonda: `Tests: 12 failed, 435 passed, 447 total`; todas restauradas. P1 suma 43 y B8=2; acento de Food=2 hasta R6. HT suelo=39. Enmiendas [17],[18],[36],[38],[40],[47],[51],[52]. La suma LG solo lee su tabla interna de test; ninguna mutación de producción puede volver rojo ese caso: su entrada se comprueba por el it.each de inkSites, que sí quedó rojo con la sonda. Un helper de edición inicialmente no reconoció it.each(directUses); se corrigió antes de correr rojo, sin cambio de alcance.

Listas verificadas con node tras R4/R5:
```
[16] MT ["MOTION_ALERT_PING_MS","MOTION_BLINK_INTERVAL_MS","MOTION_BLINK_TIMING","MOTION_CELEBRATION_BADGE_DELAY_MS","MOTION_CELEBRATION_BADGE_POP_MS","MOTION_CELEBRATION_EASE_OUT","MOTION_CELEBRATION_PING_MS","MOTION_CELEBRATION_POP_MS","MOTION_CELEBRATION_POP_PEAK","MOTION_CELEBRATION_RISE_DELAY_MS","MOTION_CELEBRATION_RISE_OFFSET_Y","MOTION_CELEBRATION_RISE_STAGGER_MS","MOTION_CONFETTI_FALL_TIMING","MOTION_ENTRANCE_OFFSET_Y","MOTION_ENTRANCE_SCALE","MOTION_FADE_TIMING","MOTION_FEEDBACK_MS","MOTION_FILL_TIMING","MOTION_FLOAT_OFFSET_Y","MOTION_FLOAT_TIMING","MOTION_HERO_BUBBLE_POP_DELAY_MS","MOTION_HERO_CAPTION_DELAY_MS","MOTION_HERO_FADE_MS","MOTION_HERO_PING_MS","MOTION_PINGO_FLOAT_OFFSET_Y","MOTION_PINGO_FLOAT_TIMING","MOTION_PING_FROM","MOTION_PING_TIMING","MOTION_PING_TO_SCALE","MOTION_POP_SCALE","MOTION_POP_SPRING","MOTION_RING_DELAY_MS","MOTION_RING_TIMING","MOTION_RISE_OFFSET_Y","MOTION_RISE_TIMING","MOTION_SETTLE_SPRING","MOTION_STAGGER_MS","MOTION_SURFACE_MS","MOTION_TRANSITION_MS"]
order matches: true
[38] DD text-17 ["components/celebration.tsx","components/empty-state.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/docs-upload-form/index.tsx","screens/edit-profile/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofence-editor/index.tsx","screens/geofences/index.tsx","screens/home/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/pairing/index.tsx","screens/register/index.tsx","screens/reminders/index.tsx","screens/reset-password/index.tsx","screens/weight-log/index.tsx","screens/welcome/index.tsx"]
order matches: true
[40] AC text-15 ["components/celebration.tsx","components/empty-state.tsx","screens/add-pet/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofence-editor/index.tsx","screens/home/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/meals-history/index.tsx","screens/register/index.tsx","screens/reset-password/index.tsx"]
order matches: true
```

### R6 reanudado
Rojo 1a4c70c1: `Tests: 12 failed, 275 passed, 287 total` inicialmente; un reemplazo de fixture había tocado R7.2 de CC por error, se revirtió antes del commit y se confirmó el rojo correcto de R7.5: `Tests: 1 failed, 77 passed, 78 total`. Verde dccce7d3: `Tests: 318 passed, 318 total`. Sonda sobre rama pendiente (labio, copy y acento), borde de segunda fila: `Tests: 7 failed, 280 passed, 287 total`, todos los candados enmendados que leen producción rojos; restaurada. [19],[20],[34],[47] y clave de R6_FOOD; sin cambios de longitudes. B8 sigue 2, acento vuelve a 1.

### R7 reanudado
Rojo 96295d13: `Tests: 5 failed, 204 passed, 209 total`. Verde 5df35c8a: `Tests: 209 passed, 209 total`. Sonda r7-mutation-200.log: `Tests: 7 failed, 202 passed, 209 total`; clases/estilo de avisos, contenedor vacío y Card adicional retirado. Restaurada. El it de ausencia de avisos nació verde; se demostró su rojo con warnings.length >= 0 (mutación). Enmiendas [18],[21],[51],[52], B8=3, CN suma=44, HT suelo=38.

### R8 reanudado
Rojo fde92720: `Tests: 6 failed, 230 passed, 236 total`. Verde fc640890: `Tests: 236 passed, 236 total`. Sonda: `Tests: 7 failed, 229 passed, 236 total`; título IA, cuerpo text-13, tamaño Sparkles, esquina y otro Card retirado para HT; restaurada. Enmiendas [17],[18],[46],[51],[52], B8=4, CN suma=45, HT suelo=37.

node -e equivalente (node heredoc):
```
[46] PC text-13 ["components/form-error.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/edit-profile/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofences/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/pairing/index.tsx","screens/profile/index.tsx","screens/register/index.tsx","screens/reminders/index.tsx","screens/reset-password/index.tsx"]
order matches: true
```

Verificación final con node -e de listas afectadas:
~~~
[16] MT ["MOTION_ALERT_PING_MS","MOTION_BLINK_INTERVAL_MS","MOTION_BLINK_TIMING","MOTION_CELEBRATION_BADGE_DELAY_MS","MOTION_CELEBRATION_BADGE_POP_MS","MOTION_CELEBRATION_EASE_OUT","MOTION_CELEBRATION_PING_MS","MOTION_CELEBRATION_POP_MS","MOTION_CELEBRATION_POP_PEAK","MOTION_CELEBRATION_RISE_DELAY_MS","MOTION_CELEBRATION_RISE_OFFSET_Y","MOTION_CELEBRATION_RISE_STAGGER_MS","MOTION_CONFETTI_FALL_TIMING","MOTION_ENTRANCE_OFFSET_Y","MOTION_ENTRANCE_SCALE","MOTION_FADE_TIMING","MOTION_FEEDBACK_MS","MOTION_FILL_TIMING","MOTION_FLOAT_OFFSET_Y","MOTION_FLOAT_TIMING","MOTION_HERO_BUBBLE_POP_DELAY_MS","MOTION_HERO_CAPTION_DELAY_MS","MOTION_HERO_FADE_MS","MOTION_HERO_PING_MS","MOTION_PINGO_FLOAT_OFFSET_Y","MOTION_PINGO_FLOAT_TIMING","MOTION_PING_FROM","MOTION_PING_TIMING","MOTION_PING_TO_SCALE","MOTION_POP_SCALE","MOTION_POP_SPRING","MOTION_RING_DELAY_MS","MOTION_RING_TIMING","MOTION_RISE_OFFSET_Y","MOTION_RISE_TIMING","MOTION_SETTLE_SPRING","MOTION_STAGGER_MS","MOTION_SURFACE_MS","MOTION_TRANSITION_MS"]
order matches: true
[38] DD text-17 ["components/celebration.tsx","components/empty-state.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/docs-upload-form/index.tsx","screens/edit-profile/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofence-editor/index.tsx","screens/geofences/index.tsx","screens/home/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/pairing/index.tsx","screens/register/index.tsx","screens/reminders/index.tsx","screens/reset-password/index.tsx","screens/weight-log/index.tsx","screens/welcome/index.tsx"]
order matches: true
[40] AC text-15 ["components/celebration.tsx","components/empty-state.tsx","screens/add-pet/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofence-editor/index.tsx","screens/home/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/meals-history/index.tsx","screens/register/index.tsx","screens/reset-password/index.tsx"]
order matches: true
[42] AC tracking-title ["components/celebration.tsx","components/empty-state.tsx","components/pet-hero-header.tsx","components/screen-header.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/food/index.tsx","screens/geofence-editor/index.tsx","screens/geofences/index.tsx","screens/health/index.tsx","screens/meal-schedule/index.tsx","screens/meals-history/index.tsx","screens/pairing/index.tsx","screens/profile/index.tsx","screens/reminders/index.tsx"]
order matches: true
[46] PC text-13 ["components/form-error.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/edit-profile/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofences/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/pairing/index.tsx","screens/profile/index.tsx","screens/register/index.tsx","screens/reminders/index.tsx","screens/reset-password/index.tsx"]
order matches: true
[44] avatars ["screens/food/index.tsx","screens/profile/index.tsx"]
~~~


## Nueva parada en R9 — reanudación de 562051d2

R4–R8 tienen sus commits rojos y verdes y sondas restauradas. R9 y R11 tienen tests y producción guardados, pero R9 no cierra: su tanda de verificación encuentra un candado no inventariado. No se ha empezado R10 ni R12–R17.

### Evidencia exacta del bloqueo nuevo

`progress/r9-green-200.log` (nombre elegido antes de conocer el resultado), comando:
```
bunx jest --runTestsByPath src/screens/food/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/chunky-cta-canvas-fidelity.test.ts src/__tests__/design-drift.test.ts src/__tests__/heroui-text-size-merge.test.ts --testTimeout=30000
```

```
Test Suites: 1 failed, 4 passed, 5 total
Tests:       1 failed, 406 passed, 407 total
```

Único rojo: DD `#178 R13: Recordatorios sin deriva › reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto (enmendado por #177 R10)`, `src/__tests__/design-drift.test.ts:1134`.

Diff recibido frente a esperado:
```
+ "screens/food/index.tsx": 2,
```

El caso construye `rounded16` desde todas las fuentes de producción fuera de Recordatorios y lo compara con un inventario cerrado (líneas 1130–1152). R9 introduce dos literales rounded-16 en Food, tal como exige la spec. La fila [35] cubre el inventario equivalente de CC, que pasa; falta este segundo inventario de DD. No es la fila [38] de DD (text-17), ni [24] (importa Card), ni HT [52].

No se enmienda: la lista cerrada autoriza solo los it inventariados, y la excepción mecánica se refiere al literal exacto retirado o sustituido. Este fallo añade un consumidor de un token nuevo en Food; no compara un literal viejo que R9 retire. El leader debe ampliar el inventario para esta aserción de DD antes de continuar.

FO, CN, CC y HT pasan en la misma tanda. La producción de R9 se conserva en 76b5bea8, separado de su commit de test 2194ccca, para que el trabajo quede revisable y el árbol limpio. Esto no equivale a verde global ni estado done. No se aplica ningún workaround ni se toca este it de DD.

### R9 y R11: TDD y pendientes

- Rojo 2194ccca: `Tests: 10 failed, 397 passed, 407 total` (r9-red-200.log). Los dos casos nuevos de superficie y el it de R11 fallan por aserción; R11 detecta la ausencia de food-links.
- Los dos casos nuevos de navegación nacieron verdes: las rutas ya funcionaban. Antes del commit de test se plantó la mutación de onPress hacia /food; ambos quedaron rojos: `Tests: 2 failed, 113 skipped, 115 total` (r9-navigation-mutation-200.log). Se restauró antes de commitear.
- Producción 76b5bea8: View food-links y dos Pressable con className/style literales propios; no queda import de Card en Food. Se conserva onPress, copy y ramas.
- R11 pasa en FO después de R9; no tiene implementación ni commit propio, como manda tasks.md.
- Enmiendas de R9: [17],[18],[23],[24],[32],[35],[51],[52]. Se retira únicamente la fila food de DD importa Card (−1 caso autorizado).
- Las sondas de los candados enmendados por R9 quedan pendientes por la parada; solo está ejecutada la de los dos nuevos casos de navegación. No se informa que estén probados por mutación todavía.
- Contadores locales verificados en las suites que sí pasan: B8 Food=6; CN suma de esquinas=47 y global=45; acento Food=1; rounded-16 de Food=2; HT suelo de Card=35. No se modificaron los otros tres suelos de HT: siguieron verdes.

### Commits de la reanudación y líneas Tests

| Commit | Mensaje | Tests observados |
|---|---|---|
| 14dee099 | test(#200): R3 lower the Card floor of the HeroUI scanner | 25 passed, 25 total |
| ce1bb032 | test(#200): R4 lock delayed nutrition ring timing | 6 failed, 119 passed, 125 total |
| f773b353 | feat(#200): R4 animate the nutrition ring with canvas timing | 125 passed, 125 total |
| 4d7ddc5b | test(#200): R5 lock the canvas meal card and inventories | 11 failed, 436 passed, 447 total |
| a7a23d9a | feat(#200): R5 match the canvas meal card | 447 passed, 447 total |
| 1a4c70c1 | test(#200): R6 lock meal rows and served actions | 12 failed, 275 passed, 287 total; CC corregido confirmado 1 failed, 77 passed, 78 total |
| dccce7d3 | feat(#200): R6 render canvas meal states and serving actions | 318 passed, 318 total |
| 96295d13 | test(#200): R7 lock neutral nutrition warnings | 5 failed, 204 passed, 209 total |
| 5df35c8a | feat(#200): R7 render neutral plan warnings | 209 passed, 209 total |
| fde92720 | test(#200): R8 lock the violet AI recommendation | 6 failed, 230 passed, 236 total |
| fc640890 | feat(#200): R8 match the violet AI recommendation | 236 passed, 236 total |
| 2194ccca | test(#200): R9 and R11 lock nutrition links and piece order | 10 failed, 397 passed, 407 total |
| 76b5bea8 | feat(#200): R9 render canvas nutrition links in piece order | 1 failed, 406 passed, 407 total (DD nuevo no autorizado) |

Los números son de las suites de cada paso, no supuestas corridas globales. El total global esperado tras R9 sería 4714 (4683 base + 32 casos nuevos − 1 fila de DD); no se ha medido una suite completa en esta reanudación, porque la parada llegó antes. No se borraron otros casos.

### Estado actualizado R1–R17

| R | Test | Rojo | Producción / ajuste | Estado actual |
|---|---|---|---|---|
| R1 | DS #200 R1 | f4363121 | 4c1eab22 | implementado, sondas de ruta verificadas |
| R2 | FO #200 R2 ×4 | a770860b | 42d516d0 | implementado; sondas completadas al reanudar |
| R3 | FO #200 R3 y HT fila 52 | 97e8fc3e | 556e103c; HT 14dee099 | implementado; sondas completadas con R4 |
| R4 | MT y FO #200 R4 | ce1bb032 | f773b353 | verde local y sondas verificadas |
| R5 | FO #200 R5 | 4d7ddc5b | a7a23d9a | verde local; sondas de producción verificadas; limitación de suma LG descrita |
| R6 | FO #200 R6 | 1a4c70c1 | dccce7d3 | verde local y sondas verificadas |
| R7 | FO #200 R7 | 96295d13 | 5df35c8a | verde local y sondas verificadas; caso negativo nació verde |
| R8 | FO #200 R8 | fde92720 | fc640890 | verde local y sondas verificadas |
| R9 | FO #200 R9 | 2194ccca | 76b5bea8 | implementado; parada DD e inventarios por sondear |
| R10 | FO #200 R10 previsto | — | — | no iniciado |
| R11 | FO #200 R11 (en R9) | 2194ccca | 76b5bea8 | orden verde local |
| R12 | MS y LY #200 R12 previstos | — | — | no iniciado |
| R13 | MH y LY #200 R13 previstos | — | — | no iniciado |
| R14 | MS #200 R14 previsto | — | — | no iniciado |
| R15 | MS y MH #200 R15 previstos | — | — | no iniciado |
| R16 | NC #200 R16 previsto | — | — | no iniciado |
| R17 | NC #200 R17 previsto | — | — | no iniciado |

Todos conservan el cierre global pendiente; no se marca la feature done. La prueba humana de seis puntos ya escrita en este reporte sigue pendiente, en ambos temas, tras completar lo restante.

### Verificación y alcance al cerrar esta reanudación

- No se ejecutó init.sh, no se hizo push ni PR, no hubo merge/rebase ni cambios de historial existente.
- Las incidencias previas de chunky-lip y Editor no reaparecieron en estas tandas, que no ejecutaban sus suites. No se afirma que se hayan aislado aquí; su autorización de rerun queda disponible en el handoff si reaparecen en la futura suite completa.
- Typecheck, lint, graphify y suite completa de cierre siguen pendientes por la parada. No se han ejecutado ni omitido silenciosamente.
- package.json, bun.lock y _layout.tsx siguen con diff vacío frente a c285eae4. Horario/Historial y sus tests no se han modificado.
- Sin enmiendas mecánicas adicionales fuera de las filas autorizadas. HT se tocó solo tras la autorización explícita de [52].
- Hubo una invocación de functions.exec con sintaxis inválida al preparar node -e (no arrancó ningún comando ni tocó ficheros); se corrigió y se registraron los órdenes con node -e. Las otras incidencias de edición se describen en R5/R6 y se corrigieron antes de los commits de test.
- El docs parcial anterior se conserva. Este reporte se actualiza, no se reemplaza. Se recrea el .done al final como marcador del fin de la ejecución parada.

Lista de ficheros tocados en producción/tests/docs desde H0 (git diff --name-only c285eae4..HEAD -- mobile-pet-tracker/ docs/):
```
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(tabs)/food.tsx
mobile-pet-tracker/src/app/__tests__/detail-stack.test.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/food/index.test.tsx
mobile-pet-tracker/src/screens/food/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
```
Todos pertenecen al alcance original o al HT añadido expresamente por la fila 52. El único nuevo it que bloquea no fue enmendado. El rename de FO conserva el historial de git mv.


## Reanudación 2026-10-24 — 31837443
Identidad y HEAD verificados; árbol móvil/specs/docs limpio. Se leyó la fila 53 y la regla nueva de recuentos agregados. La parada previa está resuelta; se conservan los commits y el reporte. El leader borró el .done. No se ejecuta init.sh. Primero se aplica DD [53], después sondas de R9 y R10–R17 según tasks.md. Para un recuento nuevo se medirá el delta exacto y se registrará la enmienda autorizada, sin detenerse.

DD [53]: 309a1c8e, `Tests: 114 passed, 114 total`. Sondas pendientes de R9 completadas: r9-resume-mutation-200.log `Tests: 13 failed, 394 passed, 407 total`. Se mutaron el segundo enlace, sus esquinas/radio/título, el contenedor sin plan, un consumidor restante de Card y el suelo HT; todos los candados enmendados de R9 quedaron rojos y fueron restaurados. El cambio de MS solo fue una sonda temporal, no está en git.

### R10 (2026-10-24)
Rojo ef53a51d: `Tests: 6 failed, 181 passed, 187 total`. Verde b4c2e91b: `Tests: 454 passed, 454 total`. Se borró CF #197 R20 entero (−5 casos). El negativo sin plan nació verde; mutación antes del commit: RiseIn también sin plan, `Tests: 1 failed, 121 skipped, 122 total`. Sonda posterior solo en el segundo aviso: 110 + 31 * index, `Tests: 1 failed, 115 skipped, 6 passed, 122 total`; el primer aviso sigue verde. Ambas restauradas.

### R12
Rojo e7dabe58: `Tests: 10 failed, 237 passed, 247 total`. Verde b5a0e887: `Tests: 312 passed, 312 total`. Sonda R12 (cabecera, padding, literal tracking-title y opción nativa) restaurada; resultado en r12-mutation-200.log. Enmiendas [25],[27]/[50],[37],[41]. Sale solo la fila meal-schedule de LY (−1 caso); contentInsetAdjustmentBehavior automatic conservado; headerShown sube a 3.

### R13
Rojo 009e815c: `Tests: 9 failed, 96 passed, 105 total`. Verde efdbd055: `Tests: 244 passed, 244 total`. Enmiendas [26],[27],[41]. Se conserva la posición 12 de meals-history en LY y se exige options exacto headerShown false. MH mock de ChevronLeft distingue tamaño 24 del botón de volver y tamaño 18 del calendario; no cambia los selectores anteriores. contentInsetAdjustmentBehavior automatic conservado; headerShown total=4. Sonda sobre MH, LY y AC registrada en r13-mutation-200.log y restaurada.

### R14
Rojo 3a096545: `Tests: 1 failed, 76 passed, 77 total`. Verde de implementación: `Tests: 269 passed, 269 total` (MS, DD, CC). Solo se añadió style={chunkyLip.violet}; se reutilizó la constante existente; className y variant no cambian.

### R15
Rojo 554d4935: `Tests: 15 failed, 228 passed, 243 total` (los cinco nuevos fallan por delayMs undefined, no por excepción). Verde 0a5396d6: `Tests: 243 passed, 243 total`. Sonda en MS y MH, con import de MH mutado para comprobar el segundo fichero del candado DD: mismo rojo 15/228/243; restaurada. Dobles RiseIn y riseDelayOf locales, sin importar tests ajenos. Enmiendas [28],[29],[30].

R16: preflight mecánico CF #197 R21 (Punto 13) cambia solo la cola de Generar plan en la carta temporalmente: `Tests: 1 failed, 64 skipped, 65 total` (r16-cf-mechanical-red-200.log). Es el literal exacto que R16(e) sustituye, dentro de canonicalBlock; se aplica la excepción de enmienda mecánica permitida. La carta se restauró antes de escribir los nuevos tests.

### R16
Rojo 09aa0139: `Tests: 5 failed, 273 passed, 278 total` (carta y expectativas CC/DD/CF). Los 19 casos de valores/cabeceras nacieron verdes y se probaron antes del commit con la sonda de todos los valores: `Tests: 21 failed, 21 total` (incluye las dos filas de carta aún rojas). Verde c83b8147: `Tests: 278 passed, 278 total`. Sonda posterior de carta: `Tests: 5 failed, 273 passed, 278 total`, las dos filas nuevas de carta y los tres candados antiguos enmendados rojos; restaurada. Sonda separada del retardo del anillo (duración sin cambiar): `Tests: 1 failed, 20 skipped, 21 total`; restaurada. Los 21 casos NC tienen sonda de producción vista en rojo. Carta solo cambia cola de Secundarios de Horario y sección Enmienda #200; firma reflejada desde la spec aprobada.

## Orden final medido con node -e (2026-10-24)
~~~
[4] TH title ["components/celebration.tsx","screens/food/index.tsx","screens/health/index.tsx","screens/profile/index.tsx"]
order matches: true
[5] EmptyState ["src/screens/alerts/index.tsx","src/screens/docs/index.tsx","src/screens/food/index.tsx","src/screens/geofences/index.tsx","src/screens/health/index.tsx","src/screens/home/index.tsx","src/screens/map/index.tsx","src/screens/profile/index.tsx","src/screens/reminders/index.tsx"]
order matches: true
[16] MT ["MOTION_ALERT_PING_MS","MOTION_BLINK_INTERVAL_MS","MOTION_BLINK_TIMING","MOTION_CELEBRATION_BADGE_DELAY_MS","MOTION_CELEBRATION_BADGE_POP_MS","MOTION_CELEBRATION_EASE_OUT","MOTION_CELEBRATION_PING_MS","MOTION_CELEBRATION_POP_MS","MOTION_CELEBRATION_POP_PEAK","MOTION_CELEBRATION_RISE_DELAY_MS","MOTION_CELEBRATION_RISE_OFFSET_Y","MOTION_CELEBRATION_RISE_STAGGER_MS","MOTION_CONFETTI_FALL_TIMING","MOTION_ENTRANCE_OFFSET_Y","MOTION_ENTRANCE_SCALE","MOTION_FADE_TIMING","MOTION_FEEDBACK_MS","MOTION_FILL_TIMING","MOTION_FLOAT_OFFSET_Y","MOTION_FLOAT_TIMING","MOTION_HERO_BUBBLE_POP_DELAY_MS","MOTION_HERO_CAPTION_DELAY_MS","MOTION_HERO_FADE_MS","MOTION_HERO_PING_MS","MOTION_PINGO_FLOAT_OFFSET_Y","MOTION_PINGO_FLOAT_TIMING","MOTION_PING_FROM","MOTION_PING_TIMING","MOTION_PING_TO_SCALE","MOTION_POP_SCALE","MOTION_POP_SPRING","MOTION_RING_DELAY_MS","MOTION_RING_TIMING","MOTION_RISE_OFFSET_Y","MOTION_RISE_TIMING","MOTION_SETTLE_SPRING","MOTION_STAGGER_MS","MOTION_SURFACE_MS","MOTION_TRANSITION_MS"]
order matches: true
[38] DD text-17 ["components/celebration.tsx","components/empty-state.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/docs-upload-form/index.tsx","screens/edit-profile/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofence-editor/index.tsx","screens/geofences/index.tsx","screens/home/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/pairing/index.tsx","screens/register/index.tsx","screens/reminders/index.tsx","screens/reset-password/index.tsx","screens/weight-log/index.tsx","screens/welcome/index.tsx"]
order matches: true
[39] AC tracking-caps ["screens/alerts/index.tsx","screens/food/index.tsx","screens/meal-schedule/index.tsx"]
order matches: true
[40] AC text-15 ["components/celebration.tsx","components/empty-state.tsx","screens/add-pet/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofence-editor/index.tsx","screens/home/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/meals-history/index.tsx","screens/register/index.tsx","screens/reset-password/index.tsx"]
order matches: true
[41/42] AC tracking-title ["components/celebration.tsx","components/empty-state.tsx","components/pet-hero-header.tsx","components/screen-header.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/food/index.tsx","screens/geofence-editor/index.tsx","screens/geofences/index.tsx","screens/health/index.tsx","screens/pairing/index.tsx","screens/profile/index.tsx","screens/reminders/index.tsx"]
order matches: true
[44] PC avatars ["screens/food/index.tsx","screens/profile/index.tsx"]
order matches: true
[45] PC rounded-hero ["components/card.tsx","screens/alert-detail/index.tsx","screens/food/index.tsx","screens/profile/index.tsx"]
order matches: true
[46] PC text-13 ["components/form-error.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/alerts/index.tsx","screens/docs/index.tsx","screens/edit-profile/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofences/index.tsx","screens/login/index.tsx","screens/meal-schedule/index.tsx","screens/pairing/index.tsx","screens/profile/index.tsx","screens/register/index.tsx","screens/reminders/index.tsx","screens/reset-password/index.tsx"]
order matches: true
[53] DD rounded16 ["components/celebration.tsx","components/empty-state.tsx","screens/add-pet/index.tsx","screens/add-reminder/index.tsx","screens/alert-detail/index.tsx","screens/docs-upload-form/index.tsx","screens/edit-profile/index.tsx","screens/food/index.tsx","screens/forgot/index.tsx","screens/geofence-editor/index.tsx","screens/geofences/index.tsx","screens/home/index.tsx","screens/login/index.tsx","screens/pairing/index.tsx","screens/register/index.tsx","screens/reset-password/index.tsx","screens/weight-log/index.tsx","screens/welcome/index.tsx"]
order matches: true
~~~

## Contadores finales medidos
```json
{
  "Food route lines": 3,
  "Old FO test exists": false,
  "Copy rows old/new": [
    0,
    25
  ],
  "Food <Card / Card import": [
    0,
    0
  ],
  "Food style CONTINUOUS_CORNER": 6,
  "Food text-accent-strong": 1,
  "Food avatar variant": 1,
  "Ring exports / motion exports": [
    2,
    39
  ],
  "Food old timing / old track": [
    0,
    0
  ],
  "Copy pending / markServedAction": [
    0,
    2
  ],
  "headerShown total": 4,
  "MS/MH HomeEntrance": [
    0,
    0
  ],
  "MS/MH ScreenHeader": [
    1,
    1
  ],
  "MS/MH automatic insets": [
    1,
    1
  ],
  "MS chunkyLip declarations / violet style": [
    1,
    1
  ],
  "CF temporary foundation guard": 0,
  "Charter old lip / amendment": [
    0,
    2
  ],
  "Dependencies / devDependencies": [
    44,
    8
  ],
  "Generated router type exists": false
}
```


## R17 y comprobaciones finales del 2026-10-24

R14 verde: c2b79aca. R17 nació verde en c52df92b: `Tests: 31 passed, 31 total` (21 casos R16 y 10 R17). No tiene commit feat: la implementación ya cumple. Sonda de StyleSheet en los seis ficheros, hex en las tres pantallas e import de Card en Food: `Tests: 10 failed, 21 passed, 31 total`. Sonda independiente de clase con corchetes en los seis ficheros: `Tests: 6 failed, 25 passed, 31 total`. Las dos sondas se restauraron. Cada uno de los 31 casos NC tiene al menos una mutación plantada en producción vista en rojo. No hay sondas pendientes de R9 ni de R10–R17.

Casos nacidos verdes: el negativo de avisos R7 (sonda registrada al reanudar), el negativo sin plan de R10, las 17 filas de valores y las dos de cabeceras de R16, y los 10 casos R17. R11 se escribió junto a R9 y se observó rojo antes de implementar, por lo que no nació verde. La limitación de la suma interna de LG sigue descrita en R5; su fila de producción sí se comprobó por mutación.

### Resultados de la última tanda TDD

| Paso / commit | Log | Línea Tests |
|---|---|---|
| R9 DD / 309a1c8e | r9-dd53-green-200.log | `Tests:       114 passed, 114 total` |
| R10 rojo / ef53a51d | r10-red-200.log | `Tests:       6 failed, 181 passed, 187 total` |
| R10 verde / b4c2e91b | r10-green-200.log | `Tests:       454 passed, 454 total` |
| R12 rojo / e7dabe58 | r12-red-200.log | `Tests:       10 failed, 237 passed, 247 total` |
| R12 verde / b5a0e887 | r12-green-200.log | `Tests:       312 passed, 312 total` |
| R13 rojo / 009e815c | r13-red-200.log | `Tests:       9 failed, 96 passed, 105 total` |
| R13 verde / efdbd055 | r13-green-200.log | `Tests:       244 passed, 244 total` |
| R14 rojo / 3a096545 | r14-red-200.log | `Tests:       1 failed, 76 passed, 77 total` |
| R14 verde / c2b79aca | r14-green-200.log | `Tests:       269 passed, 269 total` |
| R15 rojo / 554d4935 | r15-red-200.log | `Tests:       15 failed, 228 passed, 243 total` |
| R15 verde / 0a5396d6 | r15-green-200.log | `Tests:       243 passed, 243 total` |
| R16 rojo / 09aa0139 | r16-red-200.log | `Tests:       5 failed, 273 passed, 278 total` |
| R16 verde / c83b8147 | r16-green-200.log | `Tests:       278 passed, 278 total` |
| R17 verde / c52df92b | r17-green-200.log | `Tests:       31 passed, 31 total` |

La base es 4683 tests / 142 suites / 1 snapshot. El cierre contiene 4758 tests / 143 suites / 1 snapshot: 82 casos nuevos menos 7 retirados expresamente (R9 −1, R10 −5, R12 −1). No hay otra eliminación de casos. Las 143 suites se ejecutaron; la primera corrida completa deja 139 verdes y cuatro rojas por el color de respaldo en pantallas sin cambios (detalle al final).

Typecheck: `test ! -e .expo/types/router.d.ts` pasó inmediatamente antes de `bun run typecheck`; exit 0, log solo `$ tsc --noEmit`. Lint: `bunx expo lint --no-cache > ../progress/lint-200.log 2>&1 && test ! -s ../progress/lint-200.log`, exit 0 y log de 0 bytes. No se borró ni generó router.d.ts. `git diff --check` limpio.

`graphify update .`: exit 0, extracción AST sin LLM de 2429 ficheros, grafo de 28237 nodos / 36409 aristas / 1872 comunidades actualizado en graphify-out (ignorado). Aviso de herramienta: 20 ficheros SQL no aportan nodos porque falta tree_sitter_sql; no se instalaron dependencias. La extracción del código TypeScript sí concluyó.

`git diff c285eae4 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`: vacío. Dependencias 44 / desarrollo 8. Componentes compartidos y hook de tema sin cambios. El diff del layout solo contiene las dos líneas aprobadas:

```diff
diff --git a/mobile-pet-tracker/src/app/_layout.tsx b/mobile-pet-tracker/src/app/_layout.tsx
index 950f5873..e5c0d959 100644
--- a/mobile-pet-tracker/src/app/_layout.tsx
+++ b/mobile-pet-tracker/src/app/_layout.tsx
@@ -98,14 +98,14 @@ function RootStack() {
         <Stack.Screen name="pets/[petId]/docs" options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="pets/[petId]/docs-upload" options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="weight-log" options={{ ...headerOptions, title: t('weightLog.weightLog') }} />
-            <Stack.Screen name="meal-schedule" options={{ ...headerOptions, title: '' }} />
+            <Stack.Screen name="meal-schedule" options={{ headerShown: false }} />
         <Stack.Screen name="pairing" options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="reminders" options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="alerts" dangerouslySingular options={{ ...headerOptions, title: '' }} />
         <Stack.Screen name="alerts/[alertId]" dangerouslySingular options={{ ...headerOptions, title: '', contentStyle: { backgroundColor: background } }} />
         <Stack.Screen name="pets/[petId]/geofences" options={{ ...headerOptions, title: '', ...TRANSPARENT_HEADER_OPTIONS }} />
         <Stack.Screen name="pets/[petId]/geofence-editor" options={{ ...headerOptions, title: '' }} />
-        <Stack.Screen name="meals-history" options={{ ...headerOptions, title: '' }} />
+        <Stack.Screen name="meals-history" options={{ headerShown: false }} />
         <Stack.Screen name="edit-profile" options={{ ...headerOptions, title: '' }} />
       </Stack.Protected>
       <Stack.Protected guard={status !== 'authenticated'}>
```

### Ficheros finales de app y carta desde H0

Salida de `git diff --name-only c285eae4..HEAD -- mobile-pet-tracker/ docs/`:

```
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/nutrition-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(tabs)/food.tsx
mobile-pet-tracker/src/app/__tests__/detail-stack.test.tsx
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/food/index.test.tsx
mobile-pet-tracker/src/screens/food/index.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
mobile-pet-tracker/src/screens/meals-history/index.test.tsx
mobile-pet-tracker/src/screens/meals-history/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
```

Coincide con la lista cerrada, con HT autorizado por fila 52 y CF por la enmienda mecánica literal R16. Git detecta el rename de FO y por eso --name-only muestra su destino. Con --no-renames también figura la baja de `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx`; no se perdieron casos por el traslado. Sin cambios en backend ni ficheros de bookkeeping del leader. No se ejecutó init.sh, push, PR, merge ni rebase.

### Commits de esta reanudación

```
309a1c8e test(#200): R9 amend the rounded-16 inventory of design drift
ef53a51d test(#200): R10 lock staggered nutrition entrances
b4c2e91b feat(#200): R10 stagger loaded nutrition pieces with RiseIn
e7dabe58 test(#200): R12 lock the in-content meal schedule header
b5a0e887 feat(#200): R12 move the meal schedule header into content
009e815c test(#200): R13 lock the in-content meals history header
efdbd055 feat(#200): R13 move the meals history header into content
3a096545 test(#200): R14 require a violet lip on plan generation
c2b79aca feat(#200): R14 add the violet lip to plan generation
554d4935 test(#200): R15 lock shared meal screen entrance delays
0a5396d6 feat(#200): R15 use canvas entrance delays on meal screens
09aa0139 test(#200): R16 bind nutrition fidelity to frozen canvas literals
c83b8147 feat(#200): R16 document nutrition canvas exceptions
c52df92b test(#200): R17 enforce nutrition screen style guards
```


### Sondas de la última tanda y corrida completa inicial

| Sonda restaurada | Línea Tests |
|---|---|
| R12 cabecera, padding, tracking-title y opción nativa | `Tests: 10 failed, 237 passed, 247 total` |
| R13 cabecera, padding, tracking-title y opción nativa | `Tests: 9 failed, 96 passed, 105 total` |
| R15 retardos de ambas pantallas e import del segundo fichero | `Tests: 15 failed, 228 passed, 243 total` |

Primera corrida completa (`bun run test`, final-tests-200.log): `Test Suites: 4 failed, 139 passed, 143 total`; `Tests: 11 failed, 4747 passed, 4758 total`; `Snapshots: 1 passed, 1 total`. Todos los tests de #200 y todos los candados de cierre están verdes. Los once rojos están en cuatro pantallas y tests sin cambios respecto de H0:

| Suite sin cambios | Casos rojos | Diferencia |
|---|---:|---|
| reminders | 1 | labio esperado color:lip, recibido #0D1117 |
| alert-detail | 4 | labio esperado --color-lip o --color-lip-gray, recibido #0D1117 |
| alerts | 4 | labio esperado --color-lip-gray, recibido #0D1117 |
| forgot | 2 | labio esperado color:lip, recibido #0D1117 |

Comprobación aislada, tras esperar ambos pgrep vacíos: `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx src/screens/alert-detail/index.test.tsx src/screens/alerts/index.test.tsx src/screens/forgot/index.test.tsx --testTimeout=30000`; exit 0, `Test Suites: 4 passed, 4 total`, `Tests: 323 passed, 323 total` (final-isolated-200.log). La diferencia de resultado demuestra intermitencia en la ejecución; no identifica por sí sola la causa. Se parece al síntoma de mock/tema documentado por el leader, pero afecta a otras suites. No se ha cambiado producción, hooks, mocks, configuración ni expectativas de esas pantallas. Se repite la suite completa con --no-cache para verificar el cierre con transformaciones nuevas. El aviso de worker forzado es el preexistente contemplado en el handoff.


## Trazabilidad consolidada R1–R17 (2026-10-24)

| R | Test | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | DS `#200 R1`; FO y candados de ruta | f4363121 | 4c1eab22 | verificado por requisito |
| R2 | FO `#200 R2` ×4 | a770860b | 42d516d0 | verificado por requisito |
| R3 | FO `#200 R3` (héroe y cinco textos); HT fila 52 | 97e8fc3e | 556e103c; HT 14dee099 | verificado por requisito |
| R4 | MT `#200 R4`; FO timing y track | ce1bb032 | f773b353 | verificado por requisito |
| R5 | FO `#200 R5`; inventarios de Card, tinta y esquina | 4d7ddc5b | a7a23d9a | verificado por requisito |
| R6 | FO `#200 R6` ×4; copy Marcar servido | 1a4c70c1 | dccce7d3 | verificado por requisito |
| R7 | FO `#200 R7` ×2 (negativo nacido verde, mutado) | 96295d13 | 5df35c8a | verificado por requisito |
| R8 | FO `#200 R8`; inventario de IA | fde92720 | fc640890 | verificado por requisito |
| R9 | FO `#200 R9` ×2; DD fila 53 | 2194ccca | 76b5bea8; DD 309a1c8e | verificado por requisito |
| R10 | FO `#200 R10` (6 piezas y negativo sin plan mutado); retirada CF #197 R20 | ef53a51d | b4c2e91b | verificado por requisito |
| R11 | FO `#200 R11` (orden; rojo junto a R9) | 2194ccca | 76b5bea8 | verificado por requisito |
| R12 | MS cabecera en loading/loaded; LY opción nativa | e7dabe58 | b5a0e887 | verificado por requisito |
| R13 | MH cabecera en loading/loaded; LY opción nativa y posición 12 | 009e815c | efdbd055 | verificado por requisito |
| R14 | MS `#200 R14`: labio violeta | 3a096545 | c2b79aca | verificado por requisito |
| R15 | MS retardos 0/80/140; MH 0/100; DD imports | 554d4935 | 0a5396d6 | verificado por requisito |
| R16 | NC 17 literales, 2 cabeceras, 2 casos de carta; CC/DD/CF | 09aa0139 | c83b8147 | verificado por requisito |
| R17 | NC 6 casos estilo/corchetes, 3 hex, 1 Card | nace verde; 10 mutaciones rojas y 6 sondas de corchetes | c52df92b (test) | verificado por requisito |

Las filas describen verificación por requisito. El resultado global de cierre se documenta a continuación; no se modifica el estado de la feature, que corresponde al leader.


### Repetición sin caché y diagnóstico en un proceso

Segunda corrida completa (`bun run test --no-cache`, final-tests-retry-200.log): exit 1, `Test Suites: 1 failed, 142 passed, 143 total`; `Tests: 1 failed, 4757 passed, 4758 total`; `Snapshots: 1 passed, 1 total`, 262,058 s. Las cuatro suites inicialmente rojas pasaron. El único rojo migra a BackButton, también sin cambios: `#172 R2: pinta ChevronLeft de 24 en foreground`, esperado color:foreground, recibido #0D1117. No es un timeout.

BackButton aislado, después de ambos pgrep vacíos: `bunx jest --runTestsByPath src/components/__tests__/back-button.test.tsx --testTimeout=30000`; exit 0, `Test Suites: 1 passed, 1 total`; `Tests: 8 passed, 8 total`, 5,37 s (final-back-button-isolated-200.log). Sin cambios en el componente, su test, el hook ni el setup de Jest.

Se ejecuta una última corrida completa de diagnóstico con `bun run test --runInBand --no-cache`: todos los tests, un proceso y transformaciones nuevas. Es un flag de ejecución; no cambia configuración, aserciones ni cobertura. Las dos corridas anteriores y las comprobaciones aisladas se conservan como evidencia de la intermitencia de mocks/tema. No se considera identificada la causa raíz por el mero cambio de resultado.


## Cierre definitivo de esta reanudación — parada en validación global

R1–R17 están implementados y tienen sus commits y verificaciones por requisito. La parada de inventario R9 está resuelta y no quedan requisitos de implementación por empezar. La feature no se declara done porque no se consiguió una suite completa verde.

Última corrida completa: `bun run test --runInBand --no-cache` (final-tests-serial-200.log), exit 1:

```
Test Suites: 1 failed, 142 passed, 143 total
Tests:       1 failed, 4757 passed, 4758 total
Snapshots:   1 passed, 1 total
Time:        446.327 s
```

El único fallo es `src/components/__tests__/back-button.test.tsx`, `#172 R2: pinta ChevronLeft de 24 en foreground`: esperado `color:foreground`, recibido `#0D1117`. BackButton aislado pasó los ocho casos (final-back-button-isolated-200.log). El fallo se reproduce en las dos corridas completas sin caché, incluida la serial; el resultado aislado no sustituye el cierre completo. La causa raíz no está resuelta. No se ajustan expectativas a un valor de respaldo.

Evidencia de alcance: `git diff c285eae4 --` para BackButton, su test, use-theme-colors, chunky-lip, test/jest-setup.js, package.json y bun.lock está vacío. BackButton no figura en la lista cerrada del handoff y su producción está expresamente en «No tocar». La excepción de reejecución del leader menciona chunky-lip y geofence-editor; ambas pasan en esta última suite, y no extiende autorización para enmendar BackButton. El mandato aplicable del handoff es «Si al correr la suite aparece en rojo un it que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta». La regla de recuentos agregados no aplica: este caso afirma comportamiento de color, no un recuento ni un literal sustituido por #200. Se entrega esta evidencia al leader, sin ampliar alcance ni hacer más cambios de producción.

Todos los candados de cierre pasan dentro de esa corrida:

```
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/chunky-cta-canvas-fidelity.test.ts
PASS src/__tests__/alerts-canvas-fidelity.test.ts
PASS src/__tests__/tab-headers-canvas.test.ts
PASS src/__tests__/profile-canvas-fidelity.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/canvas-foundations.test.ts
PASS src/__tests__/nutrition-canvas-fidelity.test.ts
```

También pasan FO, MS, MH, LY, MT, HT, chunky-lip y geofence-editor. Typecheck y lint sin caché siguen verdes (no hubo cambios de código desde que se ejecutaron). Graphify actualizado con la limitación SQL ya descrita. La trazabilidad final refleja verificación por requisito y este bloqueo global. El reporte conserva las tres corridas completas, sus resultados aislados y todas las sondas, sin presentar una selección de pases como una corrida completa verde.

Se deja el trabajo en la rama local, con un commit final de reporte y trazabilidad y el árbol móvil/specs/docs limpio. El handoff preexistente queda sin tocar y sin añadir a git. No se ejecutó init.sh; no se hizo push, PR, merge ni rebase. El archivo .done señala que esta ejecución terminó con la parada descrita; no implica aprobación ni estado done de la feature.

### Smoke de cierre del humano (dev build Android, claro y oscuro)

- [ ] Nutrición con plan: héroe morado con labio inferior, anillo tras una pausa breve y cascada de plan/comidas/IA/enlaces.
- [ ] «Marcar servido» con labio: pasa a píldora verde «Servido», tile verde con check y avance del anillo.
- [ ] Avisos del plan entre comidas e IA.
- [ ] Avatares a la derecha del título; cambiar mascota recarga el plan.
- [ ] Horario y «Generar plan» con labio violeta; Historial; ambas flechas vuelven a Nutrición sin cabecera nativa duplicada.
- [ ] «Eliminar animaciones» de Android: todo aparece sin movimiento.

No ejecutado por este agente. La casilla de smoke de la spec permanece sin marcar; corresponde al humano y no es el bloqueo automático que se informa aquí.
