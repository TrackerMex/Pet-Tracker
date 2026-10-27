# Implementación — mobile-sheet-surface-background (#218)

Estado: implementación y verificación automática completas; cadena C1–C6 cerrada con documentación. Smoke G2 reservado al humano. No se ejecutó `./init.sh` (lo corre el leader). Sin push, PR, merge ni rebase.

## Entorno y alcance

- Ruta confirmada: `/home/claude/sites/Pet-Tracker-wt-218`.
- Rama confirmada: `feature/218-mobile-sheet-surface-background`.
- H0: `68a1f217`; HEAD inicial `3859b70f` solo añade el handoff. `git diff --stat 68a1f217 -- mobile-pet-tracker docs specs`: vacío.
- Spec aprobada por firma delegada; no se modifica el estado de feature_list.json ni el smoke humano.
- Desviación de orden: antes de conocer la instrucción «primer comando» leí el handoff, la skill ponytail y `git status`. Ejecuté después el comando literal `cd /home/claude/sites/Pet-Tracker-wt-218 && pwd && git branch --show-current`; salida:

```text
/home/claude/sites/Pet-Tracker-wt-218
feature/218-mobile-sheet-surface-background
```

## Skills y referencias

Cargadas: `ponytail:ponytail`, `building-native-ui`, `expo-tailwind-setup` y `.agents/skills/appllama-app-design-skill/SKILL.md`. La carta del repositorio prima sobre sus estilos genéricos. Sin diseño nuevo, clases nuevas ni dependencias. Appllama MCP no está disponible en Codex; su investigación y simulator loop se omiten conforme al handoff y la carta (smoke Android humano).

No disponibles con esos nombres en el catálogo: `expo-overview`, `expo:expo-overview`, `expo-animation`, `expo-router`, `expo-design-system`; no se buscaron los alias que el handoff indica inexistentes. Las dos skills Expo solicitadas sí están instaladas en `openai-curated/expo/11c74d6b/skills/`.

Leídos: requirements, design, tasks, traceability, progress/current.md, feature #218, architecture, conventions, ui-guidelines, verification y mobile-pet-tracker/AGENTS.md. También la referencia versionada requerida: https://docs.expo.dev/versions/v57.0.0/.

## Anclas T0

Ejecutadas literalmente desde `mobile-pet-tracker/src`, en el orden del handoff. Log: `progress/anchors-t0-218.log`. Todas coinciden.

| Comando/ancla (grep -cF) | Salida |
|---|---:|
| backgroundStyle, reminders | 0 |
| backgroundStyle, pairing | 0 |
| useThemeColors(, reminders | 1 |
| useThemeColors(, pairing | 1 |
| snapPoints={['50%', '100%']}, reminders | 1 |
| snapPoints={['50%', '100%']}, pairing | 1 |
| items-center gap-3 bg-surface px-5 pb-9 pt-3, reminders | 1 |
| items-center gap-3 bg-surface px-5 pb-9 pt-3, pairing | 1 |
| const categoryInk = {, reminders | 1 |
| const [muted, danger] = useThemeColors(['muted', 'danger']);, pairing | 1 |
| #218, reminders test | 0 |
| #218, pairing test | 0 |
| community-bottom-sheet, reminders test | 6 |
| community-bottom-sheet, pairing test | 4 |
| describe #178 R9 el vacío, reminders | 1 |
| describe #204 R9 Eliminar, reminders | 1 |
| describe #203 R7 hoja, pairing | 1 |
| it #203 R7.3 Cancelar, pairing | 1 |
| ls nuevo test / grep -c No such file | 1 |

`test ! -e .expo/types/router.d.ts && echo sin-router-d-ts`: `sin-router-d-ts`.

Espera inicial: Jest del worktree #219 estaba activo; no se lanzó Jest simultáneamente.

## Base de tests T0

`bun run test > ../progress/t0-218.log 2>&1; echo exit=$?` arrancó con ambas guardas de procesos vacías. Resultado: `exit=0`, cero líneas `FAIL`.

```text
Test Suites: 157 passed, 157 total
Tests:       5548 passed, 5548 total
```

Avisos de HeroUI/worker preexistentes, sin fallos. Las cifras esperadas quedan: C1 5549, C2 5550, C3–C6 5553 (C3 añade tres tests).

Incidencia de lectura sin cambios: se intentó leer `mobile-pet-tracker/jest.config.js`, que no existe; la configuración está en package.json y se leyó allí. No fue un fallo de código ni de una guarda.

## Cadena C1–C6

### C1 — `45557e98`

`test(#218): R1 lock the reminders delete sheet container to the surface token`

Antes del commit, `c01-red-218.log`: R1 rojo por `expect(...).toEqual`, recibido `{}` frente a `{ backgroundColor: 'color:surface' }`, sin excepción/import roto. Tras el commit, `c01-218.log`, exit 1 (solo R1 rojo):

```text
Tests:       1 failed, 81 passed, 82 total
```

Base del fichero 81 → 82 (+1); total de la app 5548 → 5549. Diff del test: +24/-0.

### C2 — `0f491fbd`

`test(#218): R2 lock the pairing unpair sheet container to the surface token`

Antes del commit, `c02-red-218.log`: R2 rojo por la aserción (recibido `{}`; esperado `color:surface`), sin excepción/import roto. Tras el commit, `c02-218.log`, exit 1 (solo R2 rojo):

```text
Tests:       1 failed, 137 passed, 138 total
```

Base del fichero 137 → 138 (+1); total de la app 5549 → 5550. Diff del test: +7/-0. Esperas y eventos con await, sin introducir la palabra vetada en pairing.

### C3 — `f44ecb23`

`test(#218): R3 lock every BottomSheet to the surface background`

`c03-red-218.log` antes y `c03-218.log` después del commit, ambos exit 1:

```text
Tests:       2 failed, 1 passed, 3 total
```

Las dos filas `it.each` nacen rojas por la aserción `source.split(...).toHaveLength(2)` (longitud recibida 1), sin importar producción ni lanzar excepciones. El inventario `#218 R3: solo Recordatorios y Vinculación montan un BottomSheet` nace verde. Se probará con un tercer importador temporal (sonda 4). Total de la app 5550 → 5553 (+3); suites 157 → 158. Test nuevo +53 líneas.

### Suite completa antes de C4

`full-218-c03.log`, `bun run test` sin pipe, exit 1 únicamente por los cuatro rojos TDD previstos (R1, R2, ambas filas de R3):

```text
Test Suites: 3 failed, 155 passed, 158 total
Tests:       4 failed, 5549 passed, 5553 total
```

Ningún candado ajeno rojo ni flake. Conteo real = 5548 + 1 + 1 + 3. Antes de editar producción se confirmó vacío el diff contra H0 de las dos pantallas (sin cambios ajenos de #213).

### C4 — `e3def8e3`

`feat(#218): R1, R5, R6 paint the reminders delete sheet with the surface token`

Antes del commit: `c04-green-218.log` confirma los 82 tests de Recordatorios y su fila R3 verdes; solo la fila de pairing aún roja (`Tests:       1 failed, 84 passed, 85 total`). Tras el commit, `c04-218.log`, exit 0:

```text
Tests:       82 passed, 82 total
```

Diff de producción contra H0: `2\t0` en reminders. Conteo de la app sin incremento: 5553. Sin refactor ni cambios de contrato.

### C5 — `a9b0ad93`

`feat(#218): R2, R5, R6 paint the pairing unpair sheet with the surface token`

Antes (`c05-green-218.log`) y después (`c05-218.log`) del commit: exit 0, pairing y R3 completos verdes:

```text
Tests:       141 passed, 141 total
```

138 de pairing + 3 de R3. Total de la app sin incremento: 5553. Ambas pantallas miden +2/-0 desde H0. La suite completa posterior a C5 se ejecutará tras revertir todas las sondas y se guardará también como log final.

## Sondas de mutación

Cada sonda se planta, se mide y se revierte; no se incluye en los commits.

| Sonda | Mutación y rojo concreto | Resultado |
|---|---|---|
| 1a | Quitar backgroundStyle en reminders: R1 recibe `{}`; fila R3 reminders obtiene longitud 1 en vez de 2 | `probe-1-reminders-218.log`, exit 1; `Tests:       2 failed, 81 skipped, 2 passed, 85 total` |
| 1b | Quitar backgroundStyle en pairing: R2 recibe `{}`; fila R3 pairing obtiene longitud 1 en vez de 2 | `probe-1-pairing-218.log`, exit 1; `Tests:       2 failed, 137 skipped, 2 passed, 141 total` |
| 2 | Hook de reminders pide background: R1 recibe `color:background`; fila R3 reminders no encuentra la declaración literal de surface | `probe-2-token-218.log`, exit 1; `Tests:       2 failed, 81 skipped, 2 passed, 85 total` |
| 3 | Hex `#FFFFFF` en ambos fondos: R1 y R2 reciben el literal; los cuatro guards R5 detectan escapes | `probe-3-hex-218.log`, exit 1; `Tests:       6 failed, 328 skipped, 334 total` |

Los cuatro rojos de design-drift de la sonda 3 fueron exactamente:

- `#193 R11: grep-clean de Inicio, Perfil y Recordatorios` → `mantiene las tres pantallas sin escapes de estilo literales`.
- `R11 (mobile-device-pairing): pairing usa el Card compartido y las dimensiones uniformes` → `keeps pairing free of forbidden styling escapes`.
- `#68 R18: la actividad semanal no mete drift de estilo` → `keeps arbitrary text, hex colors, and StyleSheet out of feature sources`.
- `#178 R13: Recordatorios sin deriva` → `no deja escapes de estilo, radios vetados ni text-accent suelto`.

Las sondas 1a, 1b, 2 y 3 ya se revirtieron. La sonda 4 usa `src/sheet-surface-background-probe.tsx` como tercer importador temporal, autorizado expresamente por el handoff.

La concurrencia exigió varias esperas adicionales por Jest de #217/#219 e init externos. Todos los lanzamientos propios de Jest se realizan solo tras quedar vacías ambas guardas.

Sonda 4 (`probe-4-inventory-218.log`), exit 1:

```text
Tests:       2 failed, 2 passed, 4 total
```

El inventario que nació verde se pone rojo porque recibe el tercer fichero `sheet-surface-background-probe.tsx`. Su fila añadida también cae por longitud 1 en vez de 2; las filas de las dos pantallas reales siguen verdes. Fichero temporal eliminado. Todas las sondas están revertidas; comprobación acotada literal de árbol limpio: `scoped-tree-clean` (mobile + docs + specs). Ninguna mutación se commiteó.

## Verificaciones finales (R4–R6)

- Typecheck: `test ! -e .expo/types/router.d.ts` pasó inmediatamente antes de `bun run typecheck`; exit 0, log `typecheck-218.log` solo contiene `$ tsc --noEmit`. No se borró router.d.ts.
- Lint: comando literal `bunx expo lint --no-cache > ../progress/lint-218.log 2>&1 && test ! -s ../progress/lint-218.log`; exit 0 y log de 0 bytes.
- `graphify update .` en la raíz: exit 0; extracción AST, 30134 nodos, 38723 aristas, 1923 comunidades. Salida en `graphify-out/` ignorado. Aviso: 21 archivos SQL omitidos por falta del parser opcional `tree_sitter_sql`; no se instalaron dependencias ni se hizo extracción semántica de pago.
- Guardas de dependencias, tema e i18n: `git diff 68a1f217 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/i18n`: vacío.
- Los tests existentes no se editaron: numstat de reminders test `24\t0`, pairing test `7\t0`.
- Numstat de producción, desde H0:

```text
2	0	mobile-pet-tracker/src/screens/pairing/index.tsx
2	0	mobile-pet-tracker/src/screens/reminders/index.tsx
```

Anclas finales (`anchors-final-218.log`), mismo orden que design.md §Anclas; todas coinciden:

```text
1
1
2
2
1
1
1
1
2
1
7
5
```

`git diff --name-only 68a1f217..HEAD -- mobile-pet-tracker/`, exactamente cinco ficheros:

```text
mobile-pet-tracker/src/__tests__/sheet-surface-background.test.ts
mobile-pet-tracker/src/screens/pairing/index.test.tsx
mobile-pet-tracker/src/screens/pairing/index.tsx
mobile-pet-tracker/src/screens/reminders/index.test.tsx
mobile-pet-tracker/src/screens/reminders/index.tsx
```

No se cambiaron className, snapPoints, index, onClose ni hijos; ninguna enmienda a guards, estilos, copy, providers ni dependencias. Sin refactor.

## Suite completa posterior a C5 y cierre

Una misma ejecución final, después de revertir todas las sondas: `bun run test > ../progress/final-test-218.log 2>&1; echo exit=$?`, exit 0, cero `FAIL`. Copia idéntica de su salida en `progress/full-218-c05.log` (no es otra ejecución):

```text
Test Suites: 158 passed, 158 total
Tests:       5553 passed, 5553 total
```

Los cuatro guards de R5 y los contratos R4 existentes pasan sin editarse. Todos los candados del inventario quedan verdes. Delta final desde T0: +1 suite, +5 tests. No hubo timeout, flake ni fallo inesperado de código o guardas.

## Trazabilidad R1–R6

| Requisito | Test/evidencia | Commit de test → implementación |
|---|---|---|
| R1 | reminders::`#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface` | `45557e98` → `e3def8e3` |
| R2 | pairing::`#218 R2: backgroundStyle del BottomSheet de desvincular es exactamente el token surface` | `0f491fbd` → `a9b0ad93` |
| R3 | sheet-surface-background::inventario y dos filas por fichero; sonda 4 prueba el inventario inicialmente verde | `f44ecb23` → `e3def8e3` + `a9b0ad93` |
| R4 | Sin test propio: `confirmDelete()`, `centra los cinco hijos del sheet con el marco del canvas`, `#203 R7.2: desvincular abre la hoja con su anatomía y sin diálogo nativo`; R1/R2 repiten snapPoints | Contratos heredados de `68a1f217` → `e3def8e3` + `a9b0ad93` |
| R5 | Sin test propio: los cuatro it de design-drift enumerados arriba y R1/R2; sonda hex roja y suite final verde | Guards `68a1f217`, tests `45557e98`/`0f491fbd` → `e3def8e3` + `a9b0ad93` |
| R6 | Sin test propio: guards completos sin enmiendas, numstat 2/0 por pantalla, typecheck/lint y suite final | Guards `68a1f217` → `e3def8e3` + `a9b0ad93` |

Los mensajes completos de C1–C5 están registrados en sus apartados y en traceability.md. C6 es el único commit que contiene este reporte y traceability.md: `docs(#218): record sheet surface background traceability and validation`. Su hash se obtiene con `git log -1` después de crearlo; no se incluye dentro de su propio contenido ni se reescribe la historia.

Línea Tests aplicable a C6 (sin tests nuevos ni cambios de código):

```text
Tests:       5553 passed, 5553 total
```

## Smoke reservado al humano

La casilla de requirements.md §Aprobación sigue intacta y sin marcar. En dev build Android, abrir Recordatorios → borrar y Vinculación → Desvincular collar, en claro y oscuro con Material You activo (cambiar fondo del teléfono si hace falta). Aceptación: sin franja rosa ni de otro color; contenedor igual al cuerpo (blanco en claro, surface oscuro, nunca tinta de texto); scrim y handle conservados, botones responden. Jest prueba la prop, no el resultado nativo ni la hipótesis del tinte dinámico.

## Desviaciones y cierre

- Orden inicial del primer comando: documentado arriba; ruta y rama correctas, código aún intacto en ese punto.
- Lecturas anticipadas de `c01-218.log` y `c03-red-218.log` devolvieron No such file mientras la guarda aún esperaba; no eran errores de Jest. Se releyeron tras su ejecución. Sin cambios de código por errores de invocación.
- Graphify pasó con el aviso del parser SQL opcional documentado; no se añadieron dependencias.
- No se ejecutó `./init.sh`, no se regeneraron .env/node_modules, no se modificaron feature_list.json, STATUS.md, progress/current.md ni history.md. No push, PR, merge ni rebase. Sin recursos AWS reales.
- No se usaron subagentes. Skills no disponibles y límites de Appllama documentados arriba. Sin artboard para esta feature.
- Tras C6 se verificará árbol limpio y se creará como última acción `progress/impl_mobile-sheet-surface-background.done`, con una sola línea que apunta a este reporte (ignorado, sin commit).

Revisión final antes de C6: alcance exacto de cinco ficheros móviles, anclas, numstat, log final, lint vacío y las seis filas de trazabilidad comprobados; `git diff --check` limpio. Solo este reporte y traceability.md entran en C6.
