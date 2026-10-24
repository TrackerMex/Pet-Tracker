# Implementación mobile-canvas-home (#198)

> Estado actual (2026-10-24, Merge de dev): merge resuelto y commiteado en 249e3994. Typecheck y lint sin caché verdes. Suite de 4875 tests con diez fallos de tinta (uno conocido y nueve del Editor); pendiente aclarar autorización para reintentar estos últimos. Sin marcador .done.

Fecha: 2026-10-23.

## Prevuelo

Primer comando solicitado: `/home/claude/sites/Pet-Tracker-wt-198`; rama `feature/198-mobile-canvas-home`; HEAD `69539aaa`. Coinciden. H0: `09095e26`.

Incidente: antes de leer el handoff lancé `./init.sh` siguiendo AGENTS.md general. Lo interrumpí (exit 130) al conocer la excepción; instaló dependencias existentes, comenzó el build del backend. `git status --short` siguió mostrando únicamente el handoff no versionado. No se vuelve a ejecutar.

Feature #198 ya figura `in_progress`; spec aprobada. Sin push, PR, merge ni rebase.

## Anclas T0

```text
grep -cF '<Card testID="summary-card" className="gap-4">' src/screens/home/index.tsx
1
grep -cF 'border-r border-border' src/screens/home/index.tsx
3
grep -cF 'text-2xs font-normal text-muted' src/screens/home/index.tsx
4
grep -cF 'size={20} color={muted}' src/screens/home/index.tsx
5
grep -cF 'bg-accent-soft' src/screens/home/index.tsx
3
grep -cF '<Battery' src/screens/home/index.tsx
1
grep -cF 'rounded-xl py-3' src/screens/home/index.tsx
1
grep -cF 'tracking-widest' src/screens/home/index.tsx
1
grep -cF '<HomeEntrance index={' src/screens/home/index.tsx
7
grep -cF 'useShadows' src/screens/home/index.tsx
0
grep -cF 'useChunkyLip' src/screens/home/index.tsx
2
grep -cF 'text-accent-strong' src/screens/home/index.tsx
2
grep -cF 'text-success' src/screens/home/index.tsx
1
grep -cF 'className="h-12 w-full rounded-card"' src/screens/home/index.tsx
1
grep -cF 'testID="home-error"' src/screens/home/index.tsx
1
grep -cF "t('common.somethingWentWrong')" src/screens/home/index.tsx
2
grep -cF 'size={24}' src/screens/home/index.tsx
1
grep -cF 'bg-success' src/screens/home/collar-battery-bar.tsx
1
grep -cF 'rx={Math.min(bar.width, height) / 2}' src/screens/home/weekly-activity-chart.tsx
2
grep -cF 'fillOpacity' src/screens/home/weekly-activity-chart.tsx
0
grep -cF 'useShadows' src/screens/home/weekly-activity-chart.tsx
0
grep -cF 'bg-surface-secondary' src/screens/home/weekly-activity-chart.tsx
1
grep -cF "'shrink text-xs font-semibold text-foreground'" src/screens/home/weekly-activity-chart.tsx
1
grep -cF 'tone' src/components/empty-state.tsx
0
grep -cF 'badge' src/components/empty-state.tsx
0
grep -cF 'actionIcon' src/components/empty-state.tsx
0
grep -cF "import { Plus } from 'reicon-react-native';" src/components/empty-state.tsx
1
grep -cF 'home-error-action-icon' src/screens/home/index.tsx
0
grep -cF 'home-error-badge' src/screens/home/index.tsx
0
grep -cF 'TABULAR_NUMS' src/screens/home/index.tsx
9
grep -cF 'home.loadPetsError' src/i18n/catalog.ts
0
grep -cF 'home.loadPetsError' src/__tests__/ui-copy-table.ts
0
grep -cF "{ file: 'src/screens/home/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts
2
grep -cF "[join('screens', 'home', 'index.tsx'), 2]" src/__tests__/legibility-classnames.test.ts
1
grep -cF "it('suma las trece ocurrencias que enumera la spec'" src/__tests__/legibility-classnames.test.ts
1
grep -cF '16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 2)' src/__tests__/consistency-classnames.test.ts
2
grep -cF "toBe('flex-row')" src/screens/home/index.test.tsx
4
grep -cF "['home-loading']" src/screens/home/index.test.tsx
1
grep -cF "['src/screens/home/index.tsx', 1]" src/components/__tests__/empty-state.test.tsx
1
grep -cF "'../utils/category-palette'" src/components/__tests__/empty-state.test.tsx
0
grep -cF "['src/screens/home/index.tsx', 'bg-accent-soft', 3]" src/__tests__/home-photo-hero-canvas.test.ts
1
grep -cF "['src/screens/home/index.tsx', 'text-accent-strong', 2]" src/__tests__/home-photo-hero-canvas.test.ts
1
grep -cF '26 + 1 + 1 + 1 + 2)' src/__tests__/chunky-cta-canvas-fidelity.test.ts
1
grep -cF "'screens/home/index.tsx'" src/__tests__/profile-canvas-fidelity.test.ts
1
grep -cF "'screens/home/weekly-activity-chart.tsx'" src/__tests__/alerts-canvas-fidelity.test.ts
0
grep -cF '21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2 + 4)' src/__tests__/ui-language.test.ts
1
grep -cF '#198 R' src/screens/home/index.test.tsx
0
grep -cF '#198 R' src/screens/home/weekly-activity-chart.test.tsx
0
test ! -e src/__tests__/home-canvas-fidelity.test.ts && echo ausente
ausente
test -e src/theme/shadows.ts && echo presente
presente
test -e src/__tests__/canvas-foundations.test.ts && echo presente
presente
grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts
1
test ! -e .expo/types/router.d.ts && echo sin-router-d-ts
sin-router-d-ts
```

Diferencias: []

## Skills y fuentes

Cargadas: ponytail; building-native-ui; expo-tailwind-setup; appllama-app-design-skill; animate-expo. Las dos de Expo se encontraron en `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/`. No disponibles con los nombres antiguos: expo-overview, expo-animation, expo-router, expo-design-system (el handoff indica no buscarlas). Appllama MCP y simulator loop delegados al humano según la carta. Consultada la documentación versionada https://docs.expo.dev/versions/v57.0.0/ exigida por mobile-pet-tracker/AGENTS.md.

Leídos requirements, design, tasks, traceability, arquitectura, convenciones, verificación y carta UI. Los 7 artboards se tratan como datos; no se detectaron instrucciones. Todos los literales canvas de la tabla R17 están presentes.

Error de invocación: `cat mobile-pet-tracker/jest.config.*` no encontró ficheros; Jest se configura en package.json, que se leyó. Sin cambios por el error.

## TDD y commits

K28 estaba presente en T0 y se retira entero en el commit rojo de R1: −5 tests previsto.

R1 rojo: `0586df7a test(#198): R1 lock summary card spacing and shadow`. `Tests: 3 failed, 1378 passed, 1381 total`; 53 suites, solo K1 y los dos tests nuevos fallan por clases esperadas. Log: `progress/r1-red-198.log`. K1 título canónico → padding 8 + 800; K28 −5 tests.

R1 verde: `b28c3b7c feat(#198): R1 match summary card to canvas`. `Tests: 1381 passed, 1381 total`; 53 suites; snapshot 1/1. Log: `progress/r1-green-198.log`. Sin refactor.

Sonda R1: producción con gap-4 en la tarjeta y título antiguo; los dos tests nuevos y K1 rojos por aserción (3 failed, 269 skipped, 272 total). Revertida con restauración del archivo al commit verde b28c3b7c. Log: `progress/r1-mutation-198.log`.

R2 rojo: `a2797ab6 test(#198): R2 lock summary tiles and metric typography`. `Tests: 21 failed, 257 skipped, 278 total` (HI filtrado). Los seis casos nuevos y K2–K6 (primer paso), K36 fallan por aserción; sin errores de imports/helpers. Log: `progress/r2-red-198.log`.

## PARADA OBLIGATORIA EN R2

La primera corrida agregada con la implementación de R2 falla en 4 casos de inventario de esquinas: `progress/r2-green-198.log` (exit 1).

```text
Test Suites: 2 failed, 51 passed, 53 total
Tests:       4 failed, 1383 passed, 1387 total
Snapshots:   1 passed, 1 total
```

Los tests de Inicio, incluidos los seis casos nuevos y los quince casos enmendados por R2, pasan en esa corrida; fallan exclusivamente las dos suites de inventario indicadas abajo.

### Causa y delta medido

R2 introduce cuatro mosaicos `View rounded-xl`. La carta `docs/ui-guidelines.md` §Decisiones fijas 12 exige que toda esquina no cápsula dibujada por el repositorio declare `style={CONTINUOUS_CORNER}`. Por ello los cuatro mosaicos llevan ese estilo. Los candados de inventario conservan las cuentas anteriores, que el handoff no autoriza a cambiar en R2.

| Candado | Antes / esperado | Medido con R2 | Cobertura en la spec |
|---|---:|---:|---|
| CN `#62 R14` — `screens/home/index.tsx importa y aplica sus 1 esquinas (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)` | 1 | 5 | No inventariado en K1–K47 |
| CN `#62 R14` — `fusiona la esquina una vez y la entrega a las dos ramas de Card (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)` | 42 | 46 | No inventariado en K1–K47 |
| CN `#98 R10` — `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban (enmendado por #177 R10) (enmendado por #190 R13) (enmendado por #197 R9)` | 1 en Inicio | 5 en Inicio | K27 solo contempla `bg-accent-soft`, y no para R2; la aserción global de esquinas posterior también necesita +4 |
| HP `#195 R19` — `src/screens/home/index.tsx conserva style={CONTINUOUS_CORNER} en 1 líneas` | 1 | 5 | K41 solo contempla `bg-accent-soft`, `text-accent-strong` y conservar TABULAR_NUMS |

No aplico la excepción de enmienda mecánica: R2 añade cuatro usos nuevos del literal; no quita ni sustituye usos existentes del literal. Tampoco cambio la representación del estilo para eludir los contadores.

Mandato aplicado: handoff, línea 64: «Si al correr la suite aparece en rojo un it que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta»; línea 78: «Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta».

### Estado revisable que queda

- HEAD: `a2797ab6 test(#198): R2 lock summary tiles and metric typography`. R1 tiene su pareja test/feat y sondas completadas; R2 tiene commit rojo de tests e implementación sin commit.
- Único fichero de código sin commit: `mobile-pet-tracker/src/screens/home/index.tsx` (numstat exacto: `41	17	mobile-pet-tracker/src/screens/home/index.tsx`; el diff contiene solo R2). Se conserva para que el leader revise el conflicto con la carta; no se ha commiteado como verde.
- Reporte sin commit: `progress/impl_mobile-canvas-home.md`. El handoff no versionado era preexistente y se conserva intacto.
- No se inicia R3 ni requisitos posteriores. No hay sondas R2 todavía: el bloque no llegó a verde. Ningún it nuevo nació verde en los bloques ejecutados.
- Traceability sigue sin modificar: el handoff reserva ese archivo para el commit final tras el último verde, y la feature no está terminada. Tampoco se crea `progress/impl_mobile-canvas-home.done`.
- `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`, docs y artboards no se modificaron.
- No hay cambios respecto a H0 en package.json, bun.lock, `_layout.tsx`, Card, category-palette ni todo `src/theme/`. `git diff --check` pasa.
- Lint, typecheck, suite móvil completa y graphify no se ejecutaron: parada anterior al cierre. El último verde agregado es R1 (53 suites, 1.381 tests).

### Siguiente paso del leader

Enmendar y re-firmar el inventario de #198 para autorizar los cuatro mosaicos con esquinas continuas: CN `directUses` de Inicio 1 → 5, sumas de esquinas +4, CN #98 R10 (ambas aserciones de esquinas) y HP cuenta directa 1 → 5, con el paso en R2. Actualizar los archivos/it permitidos y el handoff. Después se puede incorporar estas enmiendas al commit rojo de R2 siguiendo el procedimiento que el leader indique, repetir rojo/verde, probar las mutaciones y continuar R3. No se propone quitar las esquinas exigidas por la carta.

## Enmiendas mecánicas — corte histórico de R2

| Candado | Literal / delta | R | Estado |
|---|---|---|---|
| Ninguno | Las cuatro cuentas nuevas requieren enmienda de spec; no se modificaron guardas | R2 | Bloqueado |

## Trazabilidad de lo ejecutado — corte histórico de R2

| R | Test principal | Commit / estado |
|---|---|---|
| R1 | HI `#198 R1 viste summary-card con padding 14/8, hueco 12 y la sombra card`; HI `#198 R1 pinta el título con 16/800 y su sangría de 8` | `0586df7a` test rojo → `b28c3b7c` feat verde; sonda roja y revertida |
| R2 | HI `#198 R2 pinta cuatro celdas sin divisores en el orden del canvas`; cuatro filas de `#198 R2 da a cada mosaico su hueco y su tinta`; `#198 R2 viste valor y etiqueta con 16/800 y 11/600` | `a2797ab6` test rojo; implementación sin commit, guardas bloqueadas |
| R3 | No iniciado | Pendiente por parada en R2 |
| R4 | No iniciado | Pendiente por parada en R2 |
| R5 | No iniciado | Pendiente por parada en R2 |
| R6 | No iniciado | Pendiente por parada en R2 |
| R7 | No iniciado | Pendiente por parada en R2 |
| R8 | No iniciado | Pendiente por parada en R2 |
| R9 | No iniciado | Pendiente por parada en R2 |
| R10 | No iniciado | Pendiente por parada en R2 |
| R11 | No iniciado | Pendiente por parada en R2 |
| R12 | No iniciado | Pendiente por parada en R2 |
| R13 | No iniciado | Pendiente por parada en R2 |
| R14 | No iniciado | Pendiente por parada en R2 |
| R15 | No iniciado | Pendiente por parada en R2 |
| R16 | No iniciado | Pendiente por parada en R2 |
| R17 | No iniciado | Pendiente por parada en R2 |
| R18 | No iniciado | Pendiente por parada en R2 |

## Smoke humano pendiente (dev build Android, claro y oscuro)

1. Sombra doble suave en resumen, semanal y filas; collar y última posición sin borde/sombra.
2. Tres tiles con labio interior de 4 px.
3. Barra del collar en accent con batería >60 y ámbar con ≤60.
4. Retardos de entrada y ausencia de movimiento con Quitar animaciones.
5. Esqueleto con forma del canvas y sin salto de altura.
6. Error en modo avión: disco rosa, huellas danger, badge y recarga que recupera la lista.
7. Vacío y sin collar como sus artboards.

No se ha ejecutado el smoke; la implementación está detenida en R2. La decisión cerrada del icono de R3 sigue pendiente de aplicación: unknown conserva WifiOff; Moon solo en none.

## Reanudación 2026-10-24

HEAD y rama confirmados: `dc0c565d`, `feature/198-mobile-canvas-home`, ruta esperada. Leídos el añadido del handoff y requirements §Erratas del leader. El leader autoriza K48–K51 y la regla de recuentos agregados; la parada anterior queda resuelta. Se conserva el historial del reporte. No se ejecuta init.sh. Se retoma R2 con el diff de producción existente y un commit independiente de los inventarios, según el handoff.

R2 inventarios: `b9b1792a test(#198): R2 amend the corner inventories for the summary tiles`, solo CN/HP. Contra producción de HEAD (R2 guardado en stash nombrado `codex-198-r2-production-for-red-2026-10-24`): `Tests: 4 failed, 99 passed, 103 total`, exactamente K48–K51; log `r2-inventories-red-198.log`. `git stash pop` restauró R2 sin conflictos y eliminó ese stash (el stash anterior ajeno se conserva).

| Candado enmendado | Antes | Después | R |
|---|---|---|---|
| K48 CN directUses Inicio | 1 | 5 | R2 |
| K49 CN suma directUses | 42 | 46 (+4) | R2 |
| K50 CN usos Inicio y suma global | 1 / 40 | 5 / 44 (+4) | R2 |
| K51 HP usos directos Inicio | 1 | 5 | R2 |

R2 verde: `5512133c feat(#198): R2 render the summary metric tiles`. `Tests: 1387 passed, 1387 total`; 53 suites, snapshot 1/1; log `r2-resume-green-198.log`.

Sondas R2: co-plantadas mutaciones independientes de los cuatro slots a neutral, tamaño del icono de peso 18→19, hueco de fila 4→8, divisor solo en distancia, peso de cifra solo en peso y retirada de la esquina solo en distancia. Los seis casos nuevos, K2–K6/K36 y K48–K51 caen por aserción: `Tests: 25 failed, 328 skipped, 28 passed, 381 total` (3 suites). Revertidas con `git restore` al commit verde 5512133c. Log `r2-mutation-198.log`.

R3, ajuste del test antes de su commit: la primera corrida roja produjo `Converting circular structure to JSON` al serializar el fallo de identidad entre nodos RNTL o un `toBeNull` con nodo presente. Se interrumpió esa corrida; las nuevas aserciones de identidad comparan booleanos para que Jest pueda reportar el rojo. No cambia la condición vigilada ni producción. La corrida se repite antes de aceptar el rojo.

R3 rojo: `106c6b1e test(#198): R3 lock the device collar row`. `Tests: 11 failed, 366 skipped, 10 passed, 387 total`; los seis nuevos casos y K8-collar, K17, K27×2, K41-bg fallan por aserción. Log `r3-red-198.log`.

R3 verde: `05ef6a2c feat(#198): R3 compose the collar status and battery row`. `Tests: 1393 passed, 1393 total`; 53 suites, snapshot 1/1; log `r3-green-198.log`. K27 bg-accent-soft global 7→6, K41 Inicio 3→2. Unknown conserva WifiOff (errata); Moon solo en none.

Sondas R3 (tarjeta con sombra antigua, círculo en accent-soft, barra fuera de su columna y Battery reintroducido): los 11 casos afectados rojos por aserción, `Tests: 11 failed, 366 skipped, 10 passed, 387 total`; `r3-mutation-198.log`. Revertidas.

Sonda R3 adicional, solo la rama unknown: tinta muted en WifiOff. `Tests: 1 failed, 283 skipped, 284 total`; rojo del caso unknown por color. Revertida. Log `r3-unknown-mutation-198.log`.

R4 rojo: `3fbf93ae test(#198): R4 lock battery height and threshold colors`. `r4-red-198.log`: `Tests: 12 failed, 385 skipped, 22 passed, 419 total`. Los cinco nuevos casos fallan por altura/colores esperados, incluyendo ≤60 por su pista. K26 suma ahora coteja también los usos reales de producción, para que la sonda pueda ponerla en rojo (antes solo sumaba la tabla fija); `r4-sum-red-198.log`: `Tests: 2 failed, 14 skipped, 11 passed, 27 total`. Nueva regla de inventarios: CN #98 R10, usos text-accent-strong de Inicio 2→3 (+1 prescrito por R4), en el mismo commit rojo.

R4 verde: `97e88f32 feat(#198): R4 match battery size and semantic colors`. `Tests: 1398 passed, 1398 total`; 53 suites, snapshot 1/1, log `r4-green-198.log`. K16 pista 6→8 y bg-success→bg-accent; K26 Inicio 2→3 y suma real 21→22 (término base 13→14); K41 tinta 2→3.

Sonda R4 de altura y cifra: pista h-1.5 y cifra superior text-success. Los cinco nuevos casos y K16/K26/K41/CN caen: `Tests: 13 failed, 385 skipped, 21 passed, 419 total`; log `r4-mutation-198.log`. Revertida.

Sonda R4 adicional, solo relleno ≤60 cambiado a bg-default, sin tocar la pista: `Tests: 2 failed, 285 skipped, 2 passed, 289 total`; fallan 60 y 12, pasan 72 y 61. Revertida. Log `r4-low-mutation-198.log`.

R5 rojo: `67360d82 test(#198): R5 lock quick action dimensions and inset lips`. `Tests: 16 failed, 306 skipped, 322 total`; los siete casos nuevos y K9/K10/K29–K34/PF K45 fallan por aserción, log `r5-red-198.log`.

R5 verde: `3f632c3b feat(#198): R5 apply the quick action canvas tiles`. `Tests: 1405 passed, 1405 total`; 53 suites, snapshot 1/1; log `r5-green-198.log`. K9/K10/K29–K34 adoptan tracking-section, alto 92, radio 20, labios, iconos 26, fuente 13/700 y gap 10; PF K45 incorpora Inicio al inventario text-13.

Sondas R5 co-plantadas en rótulo, altura, los tres labios, tamaño de icono, etiqueta y gaps: `Tests: 16 failed, 306 skipped, 322 total`; todos los casos afectados rechazan producción alterada. Revertidas. Log `r5-mutation-198.log`.

Sonda R5 adicional, solo documents: labio tileBlue sustituido por tileAmber. Fallan K32, K33 y el caso nuevo de documents, pasan los otros dos tiles: `Tests: 3 failed, 291 skipped, 2 passed, 296 total`. Revertida; log `r5-blue-mutation-198.log`.

Checkpoint de tipos tras R5: gate `test ! -e .expo/types/router.d.ts` correcto; `bun run typecheck` exit 0, log `typecheck-r5-198.log`.

R6 rojo: `6826078c test(#198): R6 lock canvas entrance delays and fixed gaps`. `Tests: 4 failed, 294 skipped, 298 total`; dos nuevos y K11/K12, log `r6-red-198.log`. Entrada ocasional para orientar los bloques, Reanimated con sus constantes existentes; sin gestos ni haptics nuevos.

R6 verde: `3d899f91 feat(#198): R6 use the canvas entrance indices`. `Tests: 1407 passed, 1407 total`; 53 suites, snapshot 1/1; log `r6-green-198.log`. Índices 2..7; Pingo sigue en 0. Reduce motion conserva ausencia de entrada. Ningún cambio en HomeEntrance ni motion.ts.

Sonda R6: solo índice de resumen 2→1, sin tocar los otros cinco ni constantes. Caen los dos nuevos tests y K11/K12: `Tests: 4 failed, 294 skipped, 298 total`; revertida. Log `r6-mutation-198.log`.

R7 rojo: `ff821e50 test(#198): R7 lock weekly card spacing and heading`. `Tests: 2 failed, 60 skipped, 62 total`; log `r7-red-198.log`. El doble local de useThemeColors mantiene sus colores anteriores y resuelve solo los nuevos tokens shadow-* como --color-shadow-* para aseverar SOMBRA_CARD literal.

R7 verde: `da6fe70a feat(#198): R7 apply the weekly card canvas surface`. `Tests: 1409 passed, 1409 total`; 53 suites, snapshot 1/1; log `r7-green-198.log`. Sin enmiendas adicionales.

Sondas R7: quitar style de la tarjeta (manteniendo las clases) y volver el título a 700. Los dos tests fallan por sombra/título: `Tests: 2 failed, 60 skipped, 62 total`; revertidas. Log `r7-mutation-198.log`.

R8 rojo: `c868f616 test(#198): R8 lock metric selection and tooltip weights`. `Tests: 4 failed, 62 skipped, 66 total`; log `r8-red-198.log`.

Enmienda mecánica E1, R8: WC `R9: el selector sigue el tema de la app › adapta píldora, texto e icono con los tokens de tabs en ambos temas`. La primera corrida agregada (`r8-green-198.log`) dio `Tests: 1 failed, 1412 passed, 1413 total`. La única diferencia son las dos aserciones (dark/light) del literal `text-foreground`, que R8 sustituye directamente por `text-muted` en la rama no seleccionada. Autorizada por la excepción mecánica original. Se conserva nombre + sufijo, se cambian solo esas dos expectativas y se añade commit rojo propio antes del feat; no se toca ningún candado de columnas #140/#143.

R8 enmienda E1 roja: `494e8221 test(#198): R8 amend the unselected metric ink assertion`. Con producción de HEAD (stash nombrado, luego restaurado sin conflictos): `Tests: 5 failed, 61 skipped, 66 total`; log `r8-mechanical-red-198.log`.

R8 verde: `22996eef feat(#198): R8 style metric selection and tooltip emphasis`. `Tests: 1413 passed, 1413 total`; 53 suites, snapshot 1/1; log `r8-final-green-198.log`. Incluye E1 de la tabla de enmiendas mecánicas.

Sondas R8: check 13→12 (fuente elegida correcta), tinta no seleccionada muted→foreground y tooltip 800→700. Los cuatro nuevos casos y E1 rechazan las mutaciones: `Tests: 5 failed, 61 skipped, 66 total`; revertidas. Log `r8-mutation-198.log`.

R9 rojo: `a014c551 test(#198): R9 lock bar corners selection opacity and day detail`. `Tests: 9 failed, 279 skipped, 4 passed, 292 total`; seis casos nuevos (ambos modos de movimiento y ambos extremos seleccionados) + CK K35, DD K42, AC K46-text15, log `r9-red-198.log`.

R9 verde: `40fdc7be feat(#198): R9 apply bar selection opacity and day detail styling`. `Tests: 1419 passed, 1419 total`; 53 suites, snapshot 1/1; log `r9-green-198.log`. K35/K42 rounded-16 +1 en semanal (total CK 31→32), K46-text15 incorpora la gráfica.

Sondas R9: rx=6 sin limitar al semialto (detectado en barras de alto 3, en ambos modos), opacidades uniformes 0.5, radio de detalle 12 y título sin text-15. Todos los nueve casos afectados rojos: `Tests: 9 failed, 279 skipped, 4 passed, 292 total`; revertidas. Log `r9-mutation-198.log`.

R10 rojo: `dc01784c test(#198): R10 lock reminder rows headers and day pills`. `Tests: 11 failed, 293 skipped, 304 total`; seis casos nuevos y K13/K14/K15. Log `r10-red-198.log`. Las esperas de títulos y píldoras son sobre cada nodo que se aserta.

R10 verde: `ad3078ed feat(#198): R10 apply reminder card shadows and typography`. `Tests: 1425 passed, 1425 total`; 53 suites, snapshot 1/1; log `r10-green-198.log`. K13–K15 pasan con sombra doble, títulos 14/700 y píldoras 12/800. La espera compartida de Jest incluyó una corrida ajena runInBand sin caché; no se leyeron ni modificaron sus archivos.

Sondas R10: quitar sombras de las cuatro filas, tipografía previa de cabecera/títulos y píldoras previas. Caen los once casos afectados: `Tests: 11 failed, 293 skipped, 304 total`; revertidas. Log `r10-mutation-198.log`.

Sonda R10 adicional: quitar solo la sombra de reminders-none-upcoming. Caen su nuevo caso y la segunda rama del candado K14-Card, con vacuna intacta: `Tests: 2 failed, 302 skipped, 304 total`; revertida. Log `r10-empty-mutation-198.log`.

R11 rojo: `1273031c test(#198): R11 lock the last position canvas card`. `Tests: 6 failed, 393 skipped, 10 passed, 409 total`; dos nuevos + K8-last-position, K27×2 y K41-bg. Log `r11-red-198.log`.

R11, ajuste de test propio: la primera corrida agregada dio `Tests: 1 failed, 1426 passed, 1427 total` (`r11-green-198.log`). El único fallo era `toHaveTextContent('Última señal')` frente al texto completo correcto `Última señal <fecha localizada>`: RNTL 14 usa coincidencia exacta para esa cadena. Se cambia únicamente a regex de prefijo, conservando las recetas exactas. Se retira temporalmente el diff propio R11 de producción para repetir el rojo legítimo; no hay cambios ajenos en ese archivo.

R11 prefijo corregido, aún rojo contra producción de HEAD: `1578c646 test(#198): R11 match the localized last signal prefix`. `Tests: 1 failed, 305 skipped, 306 total`; falla por la receta vieja de etiqueta, no por fecha ni excepción; log `r11-prefix-red-198.log`. Se restituye el mismo diff R11 de cuatro recetas.

R11 verde: `53f7629d feat(#198): R11 apply the last position canvas surface`. `Tests: 1427 passed, 1427 total`; 53 suites, snapshot 1/1; log `r11-final-green-198.log`. K27 bg-accent-soft global 6→5 y K41 Inicio 2→1. text-13 ya inventariado por R5, por lo que PF no necesita otro delta de archivos.

Sondas R11: sombra antigua solo en última posición, su círculo en accent-soft y tipografías previas de etiqueta/hora. Los seis casos afectados rojos: `Tests: 6 failed, 393 skipped, 10 passed, 409 total`; revertidas. Log `r11-mutation-198.log`.

R13 rojo: `c42bff63 test(#198): R13 lock the no-collar canvas state`. `Tests: 10 failed, 392 skipped, 11 passed, 413 total`; log verbose `r13-red-198.log` confirma los tres nuevos casos rojos y `#198 R13 no pinta la actividad semanal` nacido verde (declarado). K6 segundo paso y K27/K41-bg enmendados.

R13 verde: `55689d42 feat(#198): R13 apply the no-collar canvas layout`. `Tests: 1431 passed, 1431 total`; 53 suites, snapshot 1/1; log `r13-green-198.log`. K6 adopta valor/etiqueta/nota, K27 bg-accent-soft 5→4 global, K41 Inicio 1→0.

Sondas R13: peso con la receta previa, collar sin dispositivo con sombra, enlace con accent-soft y montaje real de WeeklyActivityChart con days=[] cuando connection=none. Caen los once casos afectados, incluido el nacido verde: `Tests: 11 failed, 392 skipped, 10 passed, 413 total`; revertidas. Log `r13-mutation-198.log`.

R14 rojo: `24da03c7 test(#198): R14 lock the canvas loading skeleton structure`. `Tests: 9 failed, 302 skipped, 2 passed, 313 total`; tres nuevos + K18–K22-carga/K37-carga. Log `r14-red-198.log`. K24 no lee clases/texto de loading/error, solo los marcadores que se conservan; no requiere enmienda.

R14, composición nativa: el View del resumen combina `{ ...CONTINUOUS_CORNER, ...shadows.card }` para conservar la esquina continua que exige la carta y la sombra prescrita; no se añade una sombra distinta ni se modifica el hook. Los 17 Skeleton internos no tienen testID; hay 19 Skeleton en total contando collar/semanal.

R14 verde: `0fbebebd feat(#198): R14 render the canvas loading skeleton`. `Tests: 1434 passed, 1434 total`; 53 suites, snapshot 1/1; log `r14-green-198.log`. K18–K22-carga y K37-carga pasan; no hizo falta mover más inventarios.

Sondas R14: gap de carga/resumen alterado, solo tres celdas y View falso en lugar del Skeleton del collar. Caen los nueve casos afectados: `Tests: 9 failed, 302 skipped, 2 passed, 313 total`; revertidas. Log `r14-mutation-198.log`.

Sonda R14 adicional: título Inicio forzado durante la carga, conservando los 19 Skeleton correctos. Fallan el nuevo test de forma/sin título y K21/K22-carga: `Tests: 3 failed, 310 skipped, 313 total`; revertida. Log `r14-title-mutation-198.log`.

R18 rojo: `2dd53cc5 test(#198): R18 lock optional empty state slots and body`. `Tests: 5 failed, 110 skipped, 2 passed, 117 total`; cuatro nuevos rojos + K25-react. Nacen verdes declarados `sin badge el escenario no cambia` y `sin actionIcon el hero conserva el «+»`, como muestra `r18-red-198.log` verbose.

R18 verde: `81166c33 feat(#198): R18 add optional empty state badge icon and body`. `Tests: 1440 passed, 1440 total`; 53 suites, snapshot 1/1; log `r18-green-198.log`. API compatible: badge último en hero, actionIcon sin clonar, body undefined sin Text ni envoltorio. K25-react en verde.

Sondas R18: badge por defecto indebido, actionIcon ignorado, Plus de 21, cuerpo montado sin prop y ausencia del type import ReactNode. Los siete casos afectados fallan por aserción, incluidos ambos nacidos verdes: `Tests: 7 failed, 110 skipped, 117 total`; revertidas. Log `r18-mutation-198.log`.

Sonda R18 adicional: badge situado antes de la sombra. El nuevo test de orden falla por testID del último hijo: `Tests: 1 failed, 15 skipped, 16 total`; revertida. Log `r18-order-mutation-198.log`.

R15 rojo: `fb8ebaca test(#198): R15 lock the home error hero and default tone`. `Tests: 14 failed, 608 skipped, 15 passed, 637 total`; log verbose `r15-red-198.log`. Ambos casos de tono por defecto nacen verdes declarados. Ajuste del doble SVG para leer el G de producción, pues Svg añade su propio grupo nativo; expectativas semánticas independientes. K22-error/K23/K25-category/K39/K40/K43/K44/K46-tracking/K47 enmendados según inventario.

R15 verde: `1d1a90b8 feat(#198): R15 render the home error hero with danger tone`. `Tests: 1448 passed, 1448 total`; 53 suites, snapshot 1/1; log `r15-green-198.log`. No se ha requerido enmienda adicional al inventario aprobado.

Sondas R15: heading previo, copy body genérico, reintento sin efecto, Alert/Refresh con tamaño incorrecto, disco por defecto alterado y disco/huellas/título danger incorrectos, import adicional válido pero fuera de lista. `Tests: 16 failed, 608 skipped, 13 passed, 637 total`; todos los ocho nuevos casos y K22/K23/K25/K40/K43/K44/K46/K47 afectados fallan por aserción. Revertidas. Log `r15-mutation-198.log`.

Sonda R15-default prescrita: se quita solo `tone = 'default'`; cae el caso sin prop y sigue verde el default explícito. A la vez se sustituye solo el error por View para K39 (2→1 llamadas). `Tests: 2 failed, 107 skipped, 11 passed, 120 total`; ambas sondas revertidas. Log verbose `r15-default-count-mutation-198.log`.

R16 nacido verde declarado, solo test: `c8ea9185 test(#198): R16 preserve the existing home empty hero`. `Tests: 1449 passed, 1449 total`; 53 suites, snapshot 1/1; log `r16-green-198.log`. Protege Voz B, talk, default, título 26, acción y ausencia de badge.

Sonda R16 prescrita: se pasa `tone="danger"` solo al vacío de Inicio. `Tests: 1 failed, 318 skipped, 319 total`, por título 22 frente a 26; revertida. Log `r16-mutation-198.log`.

R12 nacido verde declarado, solo test: `4b512015 test(#198): R12 lock the two home shadow imports`. `Tests: 1450 passed, 1450 total`; 54 suites, snapshot 1/1; log `r12-green-198.log`. HCF lee las dos fuentes de esta feature; no impide imports de otras features tras integrar dev.

Sonda R12 prescrita: se retira solo el import useShadows de la gráfica. `Tests: 1 failed, 1 total`, aserción de fuente; revertida. Log `r12-mutation-198.log`.

R17 nacido verde declarado, solo test: `cd75ab9b test(#198): R17 lock all 46 frozen canvas literals`. `Tests: 1496 passed, 1496 total`; 54 suites, snapshot 1/1; log `r17-green-198.log`. Las 46 filas son literales fijos en HCF y comparan artboard + producción, sin leer design.md en runtime. Incluyen margin-top -751px y -1064px de InicioActividad/InicioRecordatorios.

Sonda R17 prescrita: h-23→h-24 solo en la clase del tile real (no el placeholder). `Tests: 1 failed, 46 passed, 47 total`; detecta el literal de producción ausente y las otras 46 filas/casos siguen verdes. Revertida. Log `r17-mutation-198.log`.


## PARADA HISTÓRICA EN EL CIERRE (2026-10-24, resuelta en Reanudación 2)

La corrida completa `bun run test` está mostrando tests de comportamiento rojos fuera de K1–K51. El handoff §Reglas críticas manda: «Si al correr la suite aparece en rojo un it que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta». Se detienen cambios y nuevas corridas; solo se dejan terminar los procesos ya iniciados y se recoge su evidencia. No se han modificado esos tests ni su producción. No se declara done, no se rellena todavía traceability, no se crea el marcador `.done` ni se hace commit de cierre. El reporte conserva el historial anterior.

| Test fuera del inventario | Esperado | Recibido | Ubicación de la aserción |
|---|---|---|---|
| Reminders `#178 R4: marco y título en contenido` › `pinta Nuevo compacto con Plus de 16 y tinta accent-foreground` | boxShadow offsetY 3, color `color:lip` | offsetY 3, color `#0D1117` | `src/screens/reminders/index.test.tsx:431` |
| Alert detail `#100 R5: el detalle marca leída la alerta` › `marca leída una vez y retira el botón (enmendado por #180 R7, E2)` | boxShadow offsetY 4, color `--color-lip` | offsetY 4, color `#0D1117` | `src/screens/alert-detail/index.test.tsx:381` |
| Alert detail `#170 R15: Ver en el mapa lleva al Mapa con la mascota de la alerta` › `lo pinta en abierta geofence_exit con mapa (enmendado por #180 R6, E2)` | boxShadow offsetY 4, color `--color-lip-gray` | offsetY 4, color `#0D1117` | `src/screens/alert-detail/index.test.tsx:757` |
| Mismo describe › `lo pinta en acked battery_low sin mapa (enmendado por #180 R6, E2)` | mismo color `--color-lip-gray` | `#0D1117` | misma línea |
| Mismo describe › `lo pinta en closed mystery_type sin mapa (enmendado por #180 R6, E2)` | mismo color `--color-lip-gray` | `#0D1117` | misma línea |

Diff medido: `git diff 09095e26 --` sobre los cuatro ficheros de Reminders/Alert detail (pantalla y test), `src/theme/chunky-lip.ts` y `src/theme/use-theme-colors.ts` está vacío. No se ha demostrado si estos fallos reproducen en H0: no se atribuyen a una causa sin comprobarla. Son comparaciones de estilos/colores, no recuentos ni los literales que #198 sustituye; no aplica la excepción mecánica. La parada no se resuelve cambiando los valores esperados a la tinta de fallback.

La misma corrida detectó `src/providers/__tests__/language-provider.test.tsx:55`, `#194 R1: mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas (enmendado por #189 R15)`: catálogo esperado 443, real 445. Delta exactamente +2 por las claves de R15. Este sí es elegible para la regla de recuentos agregados del leader, sin pedir nueva firma. Queda identificado para reanudar; no es la razón de la parada. No se ha editado el fichero tras la parada por las tintas.

Siguiente paso del leader: resolver o dar instrucciones sobre los cinco tests de tintas fuera del inventario (con aislamiento/comparación a H0 si procede). Al reanudar, enmendar también el inventario de claves +2 en un commit propio `test(#198): R15 amend the catalog key inventory`, probar rojo contra catálogo de H0 y mutación/reversión del catálogo final. Después repetir la suite completa; solo si todo queda verde rellenar traceability con los hashes, commitear reporte+traceability juntos y crear `.done`. El smoke Android queda a cargo del humano.

## Enmiendas mecánicas — estado actual de los candados ya ejecutados

La tabla siguiente consolida las enmiendas efectivamente aplicadas; los detalles de rojo/verde y de mutación están en cada R anterior. K7 y K38 no se usan. K24 no necesitó cambios: sus casos solo comprueban marcadores que se conservan.

| Candado | Antes | Después | R aplicado |
|---|---|---|---|
| K1 | título `text-base font-bold text-foreground` | `px-2 text-base font-extrabold text-foreground` | R1 |
| K2 | tres celdas con `border-r border-border` | ninguna celda con `border-r` en la rama con actividad (cambia solo el nombre del `it`, no el del describe) | R2 |
| K3 | la fila no lleva `gap-*` | la fila es `flex-row gap-1` | R2 |
| K4 | regex `<(?:Weight\|Walk\|Moon\|Map) size=\{20\} color=\{muted\} \/>` | iconos de reicon con `size={18}` y tinta del hueco; sigue sin emoji | R2 |
| K5 | `color` `'--color-muted'` en los cuatro | `'--color-category-<slot>-strong'` de R2 en cada uno (sin collar queda solo la celda de peso: violet) | R2, R13 |
| K6 | fila `'flex-row'`; celda `'flex-1 items-center gap-1 border-r border-border'`; `cellChildren[0].props` `{ testID: 'icon-weight', size: 20, color: '--color-muted' }`; valor `'text-sm font-bold text-foreground'`; etiqueta `'text-2xs font-normal text-muted'`; nota `'flex-3 self-center pl-3 font-normal text-muted'` | fila `'flex-row gap-1'`; celda `'flex-1 items-center gap-1.5 border-r border-border'`; `cellChildren[0]` es el `View` `summary-tile-weight` con `'size-9 items-center justify-center rounded-xl bg-category-violet'` y su único hijo tiene props `{ testID: 'icon-weight', size: 18, color: '--color-category-violet-strong' }`; valor `'text-base font-extrabold text-foreground'`; etiqueta `'text-11 font-semibold text-muted'`; nota `'flex-3 self-center pl-3 text-sm leading-5 font-normal text-muted'` | R2, R13 |
| K8 | `className` contiene `border`, `shadow-sm` y `bg-default` | sigue siendo el `Card` compartido con `bg-default`; contiene `border-0` y `shadow-none`, no `shadow-sm` | R3, R11 |
| K9 | rótulo `toBe('text-xs font-semibold uppercase tracking-widest text-muted')` | `toBe('text-xs font-bold uppercase tracking-section text-muted')` (el icono va en K31, el alto en K30, el radio en K32) | R5 |
| K10 | `text-2xs font-semibold text-foreground` | `` `text-13 font-bold ${CATEGORY_SLOTS[slot].ink}` `` (sigue sin estilo en línea en el `Text`) | R5 |
| K11 | índices 1..6 (60..360 ms) | índices 2..7 (120..420 ms) | R6 |
| K12 | retardos con índices de hoy | mismos huecos con índices +1 | R6 |
| K13 | `toContain('rounded-card border border-border bg-surface p-4 shadow-sm')`, píldora `px-2.5 py-1 … text-xs font-bold`, nombre `text-sm font-semibold` | `toContain('rounded-card border border-border bg-surface p-4')` + `toContain('shadow-none')` + `not.toContain('shadow-sm')` (el `className` fusionado es `rounded-card border border-border bg-surface p-4 flex-row items-center gap-3 px-3.5 py-3 shadow-none`; `toContain('flex-row items-center gap-3')` sigue verde) y `props.style.boxShadow` SOMBRA_CARD, píldora `font-extrabold`, nombre `text-sm font-bold` | R10 |
| K14 | sección `gap-3`, título `text-base font-bold`, «Ver todos» `text-xs font-semibold`, filas `toContain('rounded-card border border-border bg-surface p-4 shadow-sm')`, nombre `text-sm font-semibold`, píldora `font-bold` | receta de R10; en las filas `toContain('rounded-card border border-border bg-surface p-4')` + `toContain('shadow-none')` + `not.toContain('shadow-sm')` (el `className` fusionado es `rounded-card border border-border bg-surface p-4 flex-row items-center gap-3 px-3.5 py-3 shadow-none`; `toContain('flex-row items-center gap-3')` sigue verde) y `props.style.boxShadow` SOMBRA_CARD | R10 |
| K15 | `toContain('rounded-card border border-border bg-surface p-4 shadow-sm')`, título `text-sm font-semibold` | `toContain('rounded-card border border-border bg-surface p-4')` + `toContain('shadow-none')` + `not.toContain('shadow-sm')` (el `className` fusionado es `rounded-card border border-border bg-surface p-4 flex-row items-center gap-3 px-3.5 py-3 shadow-none`; `toContain('flex-row items-center gap-3')` sigue verde) y `props.style.boxShadow` SOMBRA_CARD, título `text-sm font-bold` (la barra de comidas no cambia) | R10 |
| K16 | pista `h-1.5 flex-1 overflow-hidden rounded-full bg-surface`, relleno `bg-success` por encima de 60 | pista `h-2 w-full overflow-hidden rounded-full bg-background`, relleno `bg-accent` por encima de 60 | R4 |
| K17 | barra hermana posterior del porcentaje en la fila de batería | `track.parent` es `getByTestId('collar-status').parent` y el índice de `track` es el de `collar-status` + 1; `battery.parent` es `getByTestId('collar-card')` y `battery` es el índice 2 de los hijos no-string de la tarjeta | R3 |
| K18 | `home-loading` es un `Skeleton` | `home-loading` es el `View` de R14 y contiene `home-loading-summary` | R14 |
| K19 | `h-12 w-full rounded-card` | la forma de R14 (cuatro bloques); sigue sin `Spinner` | R14 |
| K20 | sobre `home-loading` | sobre `home-loading-collar` (un `Skeleton` real) | R14 |
| K21 | la rama de carga lleva título y `Skeleton` | la rama de carga no lleva título; el hueco de 14 se mide en `home-loading` (`gap-3.5`) | R14 |
| K22 | título + `Skeleton`; `home-error` `Text` `text-danger` «Algo salió mal» + `home-retry` | carga de R14; error de R15 (`home-error-title`, `home-error-action`) | R14, R15 |
| K23 | `home-error` con «Algo salió mal» y pulsa `home-retry` | `home-error-title` «No pude cargar a tus mascotas» y pulsa `home-error-action` | R15 |
| K25 | `"import { useEffect } from 'react';"`, `"import { Plus } from 'reicon-react-native';"` y sin `category-palette` | `"import { useEffect, type ReactElement, type ReactNode } from 'react';"`, `"import { Plus } from 'reicon-react-native';"` sin cambios y `"import { CATEGORY_SLOTS } from '../utils/category-palette';"` como última importación de la fuente | R15, R18 |
| K26 | `[join('screens', 'home', 'index.tsx'), 2]`, total 13 | `[join('screens', 'home', 'index.tsx'), 3]`, total 14 (nombre del segundo `it` intacto + sufijo de enmienda) | R4 (cifra usa text-accent-strong aquí); base 13→14 y suma actual 21→22 |
| K27 | expresión `16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 2` (7) | la misma expresión con ` - 3` al final (4); si el `it` enumera ficheros, `index.tsx` sale de la lista | R3, R11, R13 (7→6→5→4), sin segundo cambio en R12 |
| K28 | cero importadores de producción de los 4 módulos; `headerShown` ×2 en `_layout.tsx` | el `describe` se **borra entero** en el commit rojo de R1 (el primero que monta `useShadows`). Es un candado temporal de #197 que la ola 2 retira con el mismo borrado en todas sus features, para que git lo mezcle sin conflicto; no se sustituye por nada (regla del leader, 2026-10-23) | R1 |
| K29 | `labelColor` `'text-foreground'` en los tres | `'text-category-violet-strong'`, `'text-category-amber-strong'`, `'text-category-blue-strong'` (weight, reminder, documents) | R5 |
| K30 | `toContain('min-h-11')` | `toContain('h-23')` | R5 |
| K31 | `/<Icon size=\{24\}/g` una vez y `props.size` 24 | `/<Icon size=\{26\}/g` una vez y `props.size` 26; sigue sin emoji | R5 |
| K32 | tokens de radio `['rounded-xl']`; `style` sin `boxShadow` | tokens `['rounded-card']`; con `jest.spyOn(Uniwind, 'getCSSVariable').mockImplementation((t) => t)`, `style` `{ borderCurve: 'continuous', opacity: 1, boxShadow: [{ offsetX: 0, offsetY: -4, blurRadius: 0, spreadDistance: 0, color: '--color-lip-tile-<slot>', inset: true }] }` (weight violet, reminder amber, documents blue) | R5 |
| K33 | cuatro `toEqual` sin `boxShadow` | los cuatro ganan el `boxShadow` del tile de K32, con el mismo spy | R5 |
| K34 | `'gap-3'` y `'flex-row gap-3'` | `'gap-2.5'` y `'flex-row gap-2.5'` | R5 |
| K35 | `radii` sin la gráfica; total `26 + 1 + 1 + 1 + 2` | `radii` + `'screens/home/weekly-activity-chart.tsx': 1`; total `26 + 1 + 1 + 1 + 2 + 1` con `// #198 R9` | R9 |
| K36 | `toBe('flex-row')` en las dos líneas | `toBe('flex-row gap-1')` en las dos; sufijo de enmienda en cada `it` que las usa | R2 (fila); R13 mantiene el gap |
| K37 | `['home-loading']` | `[...Array<string>(13).fill('undefined'), 'home-loading-collar', ...Array<string>(4).fill('undefined'), 'home-loading-weekly']` (D17) | R14 |
| K39 | 1 | 2 (vacío de R16 y error de R15) | R15 |
| K40 | lista sin `'../utils/category-palette'` | la lista gana `'../utils/category-palette'` | R15 |
| K41 | `bg-accent-soft` 3, `text-accent-strong` 2 | `bg-accent-soft` 0, `text-accent-strong` 3 (cada aparición en su propia línea); `TABULAR_NUMS` sigue en 9 | R3, R4, R10, R11, R13 |
| K42 | inventario sin la gráfica | + `'screens/home/weekly-activity-chart.tsx': 1, // #198 R9` | R9 |
| K43 | lista de `text-22` sin `empty-state` | `['components/empty-state.tsx', join('screens', 'alert-detail', 'index.tsx'), join('screens', 'meal-schedule', 'index.tsx')]` | R15 |
| K44 | lista sin Inicio | + `'screens/home/index.tsx', // #198 R15` entre geofences y profile | R15 |
| K45 | lista sin Inicio | + `'screens/home/index.tsx', // #198 R5, R11` entre `screens/geofences/index.tsx` y `screens/login/index.tsx` | R5 incorpora el archivo; R11 añade uso sin cambiar lista |
| K46 | filas `text-15` y `tracking-title` sin los ficheros de abajo | fila `text-15`: + `'screens/home/weekly-activity-chart.tsx', // #198 R9` tras `'screens/home/index.tsx'`; fila `tracking-title`: + `'screens/home/index.tsx', // #198 R15` tras `'screens/geofences/index.tsx'` | R9, R15 |
| K47 | `21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2 + 4` | `21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2 + 4 + 1` con `// +1 #198 R15` | R15 |
| K48 CN directUses Home | 1 | 5 (+4) | R2, errata leader dc0c565d |
| K49 CN suma directUses | 42 | 46 (+4) | R2, errata leader |
| K50 CN Home / suma global | 1 / 40 | 5 / 44 | R2, errata leader |
| K51 HP esquinas directas | 1 | 5 | R2, errata leader |
| E1 WC `R9: el selector sigue el tema... adapta píldora, texto e icono con los tokens de tabs en ambos temas` | distance sin seleccionar `text-foreground` (claro/oscuro) | `text-muted` (dos expectativas); columnas #140/#143 intactas | R8, excepción del literal sustituido; commit 494e8221 |
| E2 CN #98 R10 text-accent-strong de Home | 2 | 3 (+1 de la cifra superior del collar) | R4, regla de recuentos del leader |
| E3 LanguageProvider #194 R1 catálogo | 443 | 445 (+2 claves nuevas en cada idioma) | R15, regla de recuentos del leader, Reanudación 2; 6d0264a5 |

El inventario de catálogo 443→445 quedó pendiente en aquel corte; queda resuelto en Reanudación 2 por 6d0264a5, con rojo contra H0 y mutación/reversión probados.

## Trazabilidad R1–R18 al detener el cierre

Cada requisito alcanzó verde en el bloque local; esta tabla no declara la feature done ni sustituye el cierre pendiente.

| R | Test principal (ruta relativa a mobile-pet-tracker) | Commit verde |
|---|---|---|
| R1 | `src/screens/home/index.test.tsx::#198 R1 viste summary-card con padding 14/8, hueco 12 y la sombra card` | `b28c3b7c feat(#198): R1 match summary card to canvas` |
| R2 | `src/screens/home/index.test.tsx::#198 R2 da a cada mosaico su hueco y su tinta` | `5512133c feat(#198): R2 render the summary metric tiles` |
| R3 | `src/screens/home/index.test.tsx::#198 R3 ordena círculo, columna de estado y barra, y porcentaje` | `05ef6a2c feat(#198): R3 compose the collar status and battery row` |
| R4 | `src/screens/home/index.test.tsx::#198 R4 tiñe barra y cifra por umbral ($pct)` | `97e88f32 feat(#198): R4 match battery size and semantic colors` |
| R5 | `src/screens/home/index.test.tsx::#198 R5 viste cada tile con 92 de alto, radio 20 y su labio interior ($id)` | `3f632c3b feat(#198): R5 apply the quick action canvas tiles` |
| R6 | `src/screens/home/index.test.tsx::#198 R6 escalona los bloques con los retardos del canvas` | `3d899f91 feat(#198): R6 use the canvas entrance indices` |
| R7 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R7 viste la tarjeta con padding 14/16 y la sombra card` | `da6fe70a feat(#198): R7 apply the weekly card canvas surface` |
| R8 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R8 pinta la métrica elegida con 12/800 en accent-strong` | `22996eef feat(#198): R8 style metric selection and tooltip emphasis` |
| R9 | `src/screens/home/weekly-activity-chart.test.tsx::#198 R9 atenúa a 0.35 las barras no seleccionadas` | `40fdc7be feat(#198): R9 apply bar selection opacity and day detail styling` |
| R10 | `src/screens/home/index.test.tsx::#198 R10 viste cada fila como tarjeta con la sombra card ($testID)` | `ad3078ed feat(#198): R10 apply reminder card shadows and typography` |
| R11 | `src/screens/home/index.test.tsx::#198 R11 viste la última posición sin borde ni sombra` | `53f7629d feat(#198): R11 apply the last position canvas surface` |
| R12 | `src/__tests__/home-canvas-fidelity.test.ts::#198 R12 solo Inicio y su gráfica importan las sombras en esta feature` | `4b512015 test(#198): R12 lock the two home shadow imports` |
| R13 | `src/screens/home/index.test.tsx::#198 R13 pinta el collar sin dispositivo en columna` | `55689d42 feat(#198): R13 apply the no-collar canvas layout` |
| R14 | `src/screens/home/index.test.tsx::#198 R14 pinta el esqueleto con la forma del canvas y sin título` | `0fbebebd feat(#198): R14 render the canvas loading skeleton` |
| R15 | `src/components/__tests__/empty-state-hero.test.tsx::#198 R15 tone danger pinta disco rosa, huellas danger y título de 22` | `1d1a90b8 feat(#198): R15 render the home error hero with danger tone` |
| R16 | `src/screens/home/index.test.tsx::#198 R16 conserva el vacío hero sin badge ni tono de error` | `c8ea9185 test(#198): R16 preserve the existing home empty hero` |
| R17 | `src/__tests__/home-canvas-fidelity.test.ts::#198 R17 $artboard dibuja «$canvas» y $file lo aplica` | `cd75ab9b test(#198): R17 lock all 46 frozen canvas literals` |
| R18 | `src/components/__tests__/empty-state-hero.test.tsx::#198 R18 el badge es el último hijo del escenario` | `81166c33 feat(#198): R18 add optional empty state badge icon and body` |

## Commits de implementación y salida de tests consolidada

R16, R12 y R17 nacen verdes y solo llevan commit de test. También nacen verdes los dos default de R15, `sin badge` y `sin actionIcon` de R18 y `no pinta la actividad semanal` de R13. Todos tienen mutación roja observada y revertida, descrita arriba. K28 estaba al entrar y se borró entero en R1 (−5 casos), según mandato. Ningún otro test se borró.

| Hash y mensaje | Línea Tests de la validación | Log en progress/ |
|---|---|---|
| `0586df7a test(#198): R1 lock summary card spacing and shadow` | `Tests:       3 failed, 1378 passed, 1381 total` | `r1-red-198.log` |
| `b28c3b7c feat(#198): R1 match summary card to canvas` | `Tests:       1381 passed, 1381 total` | `r1-green-198.log` |
| `a2797ab6 test(#198): R2 lock summary tiles and metric typography` | `Tests:       21 failed, 257 skipped, 278 total` | `r2-red-198.log` |
| `b9b1792a test(#198): R2 amend the corner inventories for the summary tiles` | `Tests:       4 failed, 99 passed, 103 total` | `r2-inventories-red-198.log` |
| `5512133c feat(#198): R2 render the summary metric tiles` | `Tests:       1387 passed, 1387 total` | `r2-resume-green-198.log` |
| `106c6b1e test(#198): R3 lock the device collar row` | `Tests:       11 failed, 366 skipped, 10 passed, 387 total` | `r3-red-198.log` |
| `05ef6a2c feat(#198): R3 compose the collar status and battery row` | `Tests:       1393 passed, 1393 total` | `r3-green-198.log` |
| `3fbf93ae test(#198): R4 lock battery height and threshold colors` | `Tests:       12 failed, 385 skipped, 22 passed, 419 total` | `r4-red-198.log` |
| `97e88f32 feat(#198): R4 match battery size and semantic colors` | `Tests:       1398 passed, 1398 total` | `r4-green-198.log` |
| `67360d82 test(#198): R5 lock quick action dimensions and inset lips` | `Tests:       16 failed, 306 skipped, 322 total` | `r5-red-198.log` |
| `3f632c3b feat(#198): R5 apply the quick action canvas tiles` | `Tests:       1405 passed, 1405 total` | `r5-green-198.log` |
| `6826078c test(#198): R6 lock canvas entrance delays and fixed gaps` | `Tests:       4 failed, 294 skipped, 298 total` | `r6-red-198.log` |
| `3d899f91 feat(#198): R6 use the canvas entrance indices` | `Tests:       1407 passed, 1407 total` | `r6-green-198.log` |
| `ff821e50 test(#198): R7 lock weekly card spacing and heading` | `Tests:       2 failed, 60 skipped, 62 total` | `r7-red-198.log` |
| `da6fe70a feat(#198): R7 apply the weekly card canvas surface` | `Tests:       1409 passed, 1409 total` | `r7-green-198.log` |
| `c868f616 test(#198): R8 lock metric selection and tooltip weights` | `Tests:       4 failed, 62 skipped, 66 total` | `r8-red-198.log` |
| `494e8221 test(#198): R8 amend the unselected metric ink assertion` | `Tests:       5 failed, 61 skipped, 66 total` | `r8-mechanical-red-198.log` |
| `22996eef feat(#198): R8 style metric selection and tooltip emphasis` | `Tests:       1413 passed, 1413 total` | `r8-final-green-198.log` |
| `a014c551 test(#198): R9 lock bar corners selection opacity and day detail` | `Tests:       9 failed, 279 skipped, 4 passed, 292 total` | `r9-red-198.log` |
| `40fdc7be feat(#198): R9 apply bar selection opacity and day detail styling` | `Tests:       1419 passed, 1419 total` | `r9-green-198.log` |
| `dc01784c test(#198): R10 lock reminder rows headers and day pills` | `Tests:       11 failed, 293 skipped, 304 total` | `r10-red-198.log` |
| `ad3078ed feat(#198): R10 apply reminder card shadows and typography` | `Tests:       1425 passed, 1425 total` | `r10-green-198.log` |
| `1273031c test(#198): R11 lock the last position canvas card` | `Tests:       6 failed, 393 skipped, 10 passed, 409 total` | `r11-red-198.log` |
| `1578c646 test(#198): R11 match the localized last signal prefix` | `Tests:       1 failed, 305 skipped, 306 total` | `r11-prefix-red-198.log` |
| `53f7629d feat(#198): R11 apply the last position canvas surface` | `Tests:       1427 passed, 1427 total` | `r11-final-green-198.log` |
| `c42bff63 test(#198): R13 lock the no-collar canvas state` | `Tests:       10 failed, 392 skipped, 11 passed, 413 total` | `r13-red-198.log` |
| `55689d42 feat(#198): R13 apply the no-collar canvas layout` | `Tests:       1431 passed, 1431 total` | `r13-green-198.log` |
| `24da03c7 test(#198): R14 lock the canvas loading skeleton structure` | `Tests:       9 failed, 302 skipped, 2 passed, 313 total` | `r14-red-198.log` |
| `0fbebebd feat(#198): R14 render the canvas loading skeleton` | `Tests:       1434 passed, 1434 total` | `r14-green-198.log` |
| `2dd53cc5 test(#198): R18 lock optional empty state slots and body` | `Tests:       5 failed, 110 skipped, 2 passed, 117 total` | `r18-red-198.log` |
| `81166c33 feat(#198): R18 add optional empty state badge icon and body` | `Tests:       1440 passed, 1440 total` | `r18-green-198.log` |
| `fb8ebaca test(#198): R15 lock the home error hero and default tone` | `Tests:       14 failed, 608 skipped, 15 passed, 637 total` | `r15-red-198.log` |
| `1d1a90b8 feat(#198): R15 render the home error hero with danger tone` | `Tests:       1448 passed, 1448 total` | `r15-green-198.log` |
| `c8ea9185 test(#198): R16 preserve the existing home empty hero` | `Tests:       1449 passed, 1449 total` | `r16-green-198.log` |
| `4b512015 test(#198): R12 lock the two home shadow imports` | `Tests:       1450 passed, 1450 total` | `r12-green-198.log` |
| `cd75ab9b test(#198): R17 lock all 46 frozen canvas literals` | `Tests:       1496 passed, 1496 total` | `r17-green-198.log` |

Decisiones ya aplicadas: R3 unknown usa WifiOff con accent-strong, igual que offline; solo none lleva Moon. Carga R14 combina la esquina continua con la sombra card en un View. Default de EmptyState conserva disco, paw ink y título; solo la prop danger cambia esos tres. El doble G de ES identifica el grupo de producción dentro del grupo nativo que inserta Svg, sin importar esperados de producción. No se ha añadido dependencia ni tocado los módulos compartidos protegidos.


## Resultado de las verificaciones ya iniciadas al parar

Suite completa: `cd mobile-pet-tracker && bun run test > ../progress/final-test-198.log 2>&1`, sin pipe. Exit 1, duración 208.33 s. Salida literal:

```text
Test Suites: 3 failed, 140 passed, 143 total
Tests:       6 failed, 4789 passed, 4795 total
Snapshots:   1 passed, 1 total
```

Los seis fallos son exactamente los cinco de tintas y el recuento de claves enumerados arriba; no hay timeout ni excepción de ejecución en los tests nuevos. Los bloques R1–R18 se conservan con su último verde. Guardas en verde también dentro de la suite completa: design-drift, consistency-classnames, legibility-classnames, chunky-cta-canvas-fidelity, alerts-canvas-fidelity, profile-canvas-fidelity, home-photo-hero-canvas, ui-language, canvas-foundations, empty-state, empty-state-hero y home-canvas-fidelity. Home/index y weekly-activity-chart también pasan.

Typecheck: gate `test ! -e .expo/types/router.d.ts` pasado antes de ejecutar `bun run typecheck`, exit 0. Log `typecheck-final-198.log`: `$ tsc --noEmit`, sin diagnósticos. No se borró ni generó router.d.ts.

Lint: `bunx expo lint --no-cache > ../progress/lint-198.log 2>&1 && test ! -s ../progress/lint-198.log`, exit 0; log exactamente 0 bytes.

Graphify: `graphify update .`, exit 0, solo AST sin LLM; 28.193 nodos, 36.349 aristas y 1.859 comunidades. Actualiza `graphify-out/` (ignorado). Aviso de dependencia opcional preexistente: 20 .sql no aportan al grafo porque falta tree_sitter_sql. No se instala nada. Log `graphify-198.log`.

Diff protegido vacío contra H0 (`09095e26`): package.json, bun.lock, src/app/_layout.tsx, src/components/card.tsx, src/utils/category-palette.ts y todo src/theme/. No hay cambios de docs, backend, infraestructura ni otros worktrees. `git diff --check` pasa. Las consultas de procesos de Jest se limitaron a metadatos para esperar el turno; no se leyeron otros árboles. Todas las mutaciones están revertidas. Nunca se ejecutó init.sh en la reanudación.

Recuenta final (también en `progress/recounts-final-198.log`):

```text
grep -cF useShadows src/screens/home/index.tsx
2
grep -cF useShadows src/screens/home/weekly-activity-chart.tsx
2
grep -cF '<HomeEntrance index={' src/screens/home/index.tsx
7
grep -cF 'border-r border-border' src/screens/home/index.tsx
1
grep -cF bg-accent-soft src/screens/home/index.tsx
0
grep -cF '<Battery' src/screens/home/index.tsx
0
grep -cF tracking-widest src/screens/home/index.tsx
0
grep -cF text-accent-strong src/screens/home/index.tsx
3
grep -cF text-success src/screens/home/index.tsx
0
grep -cF 'className="h-12 w-full rounded-card"' src/screens/home/index.tsx
0
grep -cF 'testID="home-error"' src/screens/home/index.tsx
1
grep -cF 't('"'"'common.somethingWentWrong'"'"')' src/screens/home/index.tsx
1
grep -cF 'size={24}' src/screens/home/index.tsx
1
grep -cF bg-success src/screens/home/collar-battery-bar.tsx
0
grep -cF 'Math.min(bar.width, height) / 2' src/screens/home/weekly-activity-chart.tsx
0
grep -cF bg-surface-secondary src/screens/home/weekly-activity-chart.tsx
0
grep -cF fillOpacity src/screens/home/weekly-activity-chart.tsx
5
grep -cF tone src/components/empty-state.tsx
5
grep -cF badge src/components/empty-state.tsx
3
grep -cF actionIcon src/components/empty-state.tsx
3
grep -cF 'import { Plus } from '"'"'reicon-react-native'"'"';' src/components/empty-state.tsx
1
grep -cF home-error-action-icon src/screens/home/index.tsx
1
grep -cF home-error-badge src/screens/home/index.tsx
1
grep -cF TABULAR_NUMS src/screens/home/index.tsx
9
grep -cF home.loadPetsError src/i18n/catalog.ts
4
grep -cF home.loadPetsError src/__tests__/ui-copy-table.ts
2
grep -cF '{ file: '"'"'src/screens/home/index.tsx'"'"', key: '"'"'common.somethingWentWrong'"'"' }' src/__tests__/ui-copy-table.ts
1
grep -cF '[join('"'"'screens'"'"', '"'"'home'"'"', '"'"'index.tsx'"'"'), 3]' src/__tests__/legibility-classnames.test.ts
1
grep -cF '16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 2 - 1 - 1 - 1)' src/__tests__/consistency-classnames.test.ts
2
grep -cF 'describe('"'"'#197 R20: cimientos sin cablear'"'"'' src/__tests__/canvas-foundations.test.ts
0
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx
5
#198 R en líneas de tests
151
StyleSheet.create en producción Home/EmptyState
0
Diferencias: []
```

Ficheros móviles tocados, medidos con `git diff --name-only 09095e26..HEAD -- mobile-pet-tracker/ docs/` (20 exactos, ninguno de docs/):

```text
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/home-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/empty-state-hero.test.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/components/empty-state.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
```

Rama `feature/198-mobile-canvas-home`, HEAD `cd75ab9b`. `git status --short -- mobile-pet-tracker/ specs/ docs/` vacío. Aparte solo están el handoff original no versionado y este reporte no versionado. No se ha hecho push, PR, merge ni rebase. No se hace el commit `docs(#198)` de cierre con traceability mientras la suite completa esté roja; `specs/mobile-canvas-home/traceability.md` permanece pendiente conforme al gate de cierre. No se crea `progress/impl_mobile-canvas-home.done`.

## Smoke humano aún pendiente

Ejecutar los siete puntos ya listados arriba en dev build Android, claro y oscuro: sombras, labios interiores, umbral de batería, orden de entradas/Quitar animaciones, esqueleto sin salto, recuperación del error en modo avión, vacío/sin collar. No lo ha ejecutado este agente; no es un gate para implementar, sí queda como entrega del humano. El cierre automatizado está detenido por los cinco tests de tintas fuera del inventario, no por el smoke.


## Reanudación 2 (2026-10-24)

Leída la sección homónima al final del handoff. Ruta, branch y HEAD esperado `cd75ab9b` confirmados; fuente/specs/docs limpias. El leader identifica los cinco rojos de tintas como flake de carga conocido y aporta una corrida aislada sobre cd75ab9b: 2 suites y 196 tests verdes. Es evidencia del leader, no una corrida nueva de este agente. Se respeta la orden de no tocar esos tests ni su producción. Si reaparecen solo esos cinco rojos con fallback, se repetirán sus dos suites con --runInBand según el protocolo nuevo. El catálogo 443→445 está autorizado y añade únicamente `src/providers/__tests__/language-provider.test.tsx` a la lista cerrada para esta enmienda (21 archivos móviles finales). La parada histórica queda resuelta; se conserva su evidencia.

R15 catálogo rojo contra catálogo H0: se copia temporalmente únicamente catalog.ts desde 09095e26, sin tocar la expectativa 445. `Tests: 1 failed, 52 skipped, 1 passed, 54 total`, exit 1 por 445 esperado / 443 recibido; log `r15-catalog-red-198.log`. Catálogo restaurado desde HEAD. Commit propio `6d0264a5 test(#198): R15 amend the catalog key inventory`, solo provider test, sufijo R15 y término +2. Incidencia de la espera inicial: el texto del propio comando del reporte coincidía con el patrón de proceso; se terminó únicamente esa shell (143), sin iniciar Jest, y se relanzó la espera en un comando separado. Ningún proceso compartido fue interrumpido.

R15 catálogo verde con producción actual: `Tests: 54 passed, 54 total`; 1 suite, sin snapshots; log `r15-catalog-green-198.log`. Commit 6d0264a5, enmienda 443→445. Se prepara mutación independiente: quitar solo la clave Body nueva de ambos idiomas (444 claves), conservando Title.

Sonda R15 del recuento: se quita solo loadPetsErrorBody de EN y ES. `Tests: 1 failed, 52 skipped, 1 passed, 54 total`; esperado 445 / recibido 444 por aserción, sin excepción. Revertida restaurando catalog.ts de HEAD; log `r15-catalog-mutation-198.log`. El inventario y ambas comprobaciones de rojo quedan completos.

Reanudación 2: typecheck vuelve a pasar con el gate router.d.ts ausente (exit 0, typecheck-final-198.log). Lint sin caché vuelve a pasar, exit 0 y lint-198.log de 0 bytes. Se conserva la corrida roja anterior en `final-test-before-resume2-198.log` antes de sobrescribir `final-test-198.log` con la repetición completa. No se ejecutan verificaciones pesadas en paralelo con esta corrida.


## Cierre automatizado completado (Reanudación 2)

Suite completa repetida sobre `6d0264a5`: `bun run test > ../progress/final-test-198.log 2>&1`, exit 0, sin pipe, duración 131.563 s. Salida literal:

```text
Test Suites: 143 passed, 143 total
Tests:       4795 passed, 4795 total
Snapshots:   1 passed, 1 total
```

No hay ningún `FAIL`. Reminders y Alert detail pasan en esta misma corrida; no se necesita la repetición aislada prevista por el leader. El aviso de worker force-exit es el preexistente que declara el handoff. La corrida histórica con 6 rojos se conserva como `final-test-before-resume2-198.log`; su análisis anterior se mantiene como historial, no como estado vigente.

Base T0 aportada por el leader en el handoff: 142 suites, 4683 tests y 1 snapshot, todos verdes en H0. Resultado: +1 suite HCF, +117 casos nuevos y −5 casos de K28 = 4795. Ninguna otra eliminación de casos.

Las doce guardas solicitadas pasan dentro de la suite final, junto a Home/index y WeeklyActivityChart. Los dieciocho requisitos tienen hash verde en `specs/mobile-canvas-home/traceability.md`, sin filas pendientes; R15 incluye también el hash del inventario del catálogo.

| Commit adicional de la Reanudación 2 | Tests de validación | Evidencia |
|---|---|---|
| `6d0264a5 test(#198): R15 amend the catalog key inventory` | `Tests: 54 passed, 54 total` | `r15-catalog-green-198.log`; rojo H0 y mutación 444 en `r15-catalog-red-198.log` / `r15-catalog-mutation-198.log` |
| `docs(#198): record home canvas implementation and verification` (commit de este reporte y traceability) | `Tests: 4795 passed, 4795 total` | `final-test-198.log`, exit 0; no cambia producción ni tests |

Typecheck final repetido: gate router.d.ts ausente, `bun run typecheck` exit 0, sin diagnósticos (`typecheck-final-198.log`). Lint final repetido: `bunx expo lint --no-cache` exit 0 y log de 0 bytes; se comprueba también `test ! -s ../progress/lint-198.log`. Se ejecutaron antes de la suite completa, sin añadir carga a esa corrida.

La recuenta final se repitió tras la enmienda del catálogo. Todos los valores originales coinciden; ahora hay 153 líneas con marcadores #198 R en tests (el mínimo era 18). Salida vigente:

```text
grep -cF useShadows src/screens/home/index.tsx
2
grep -cF useShadows src/screens/home/weekly-activity-chart.tsx
2
grep -cF '<HomeEntrance index={' src/screens/home/index.tsx
7
grep -cF 'border-r border-border' src/screens/home/index.tsx
1
grep -cF bg-accent-soft src/screens/home/index.tsx
0
grep -cF '<Battery' src/screens/home/index.tsx
0
grep -cF tracking-widest src/screens/home/index.tsx
0
grep -cF text-accent-strong src/screens/home/index.tsx
3
grep -cF text-success src/screens/home/index.tsx
0
grep -cF 'className="h-12 w-full rounded-card"' src/screens/home/index.tsx
0
grep -cF 'testID="home-error"' src/screens/home/index.tsx
1
grep -cF 't('"'"'common.somethingWentWrong'"'"')' src/screens/home/index.tsx
1
grep -cF 'size={24}' src/screens/home/index.tsx
1
grep -cF bg-success src/screens/home/collar-battery-bar.tsx
0
grep -cF 'Math.min(bar.width, height) / 2' src/screens/home/weekly-activity-chart.tsx
0
grep -cF bg-surface-secondary src/screens/home/weekly-activity-chart.tsx
0
grep -cF fillOpacity src/screens/home/weekly-activity-chart.tsx
5
grep -cF tone src/components/empty-state.tsx
5
grep -cF badge src/components/empty-state.tsx
3
grep -cF actionIcon src/components/empty-state.tsx
3
grep -cF 'import { Plus } from '"'"'reicon-react-native'"'"';' src/components/empty-state.tsx
1
grep -cF home-error-action-icon src/screens/home/index.tsx
1
grep -cF home-error-badge src/screens/home/index.tsx
1
grep -cF TABULAR_NUMS src/screens/home/index.tsx
9
grep -cF home.loadPetsError src/i18n/catalog.ts
4
grep -cF home.loadPetsError src/__tests__/ui-copy-table.ts
2
grep -cF '{ file: '"'"'src/screens/home/index.tsx'"'"', key: '"'"'common.somethingWentWrong'"'"' }' src/__tests__/ui-copy-table.ts
1
grep -cF '[join('"'"'screens'"'"', '"'"'home'"'"', '"'"'index.tsx'"'"'), 3]' src/__tests__/legibility-classnames.test.ts
1
grep -cF '16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 2 - 1 - 1 - 1)' src/__tests__/consistency-classnames.test.ts
2
grep -cF 'describe('"'"'#197 R20: cimientos sin cablear'"'"'' src/__tests__/canvas-foundations.test.ts
0
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx
5
#198 R en líneas de tests
153
StyleSheet.create en Home/EmptyState (incluye tests Home)
0
Diferencias: []
```

Lista final contra H0, medida con `git diff --name-only 09095e26..HEAD -- mobile-pet-tracker/ docs/`: **21 archivos**, los 20 originales más el test de catálogo permitido expresamente en Reanudación 2. Ninguno de docs/:

```text
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/canvas-foundations.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/home-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/empty-state-hero.test.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/components/empty-state.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
```

Diff protegido nuevamente vacío contra 09095e26: package.json, bun.lock, app/_layout.tsx, Card, category-palette y todo theme/. El catálogo final solo conserva las cuatro líneas nuevas (dos claves, EN y ES); todas las mutaciones están revertidas. No se han tocado backend, infraestructura ni otros worktrees. El status de mobile/specs/docs se comprobará limpio tras el commit de cierre. El handoff original no versionado queda fuera del commit. No hay push, PR, merge ni rebase de este agente; el leader integrará dev después del marcador.

El smoke humano de siete puntos sigue pendiente en dev build Android, temas claro y oscuro; su lista está arriba. No es un gate de implementación. feature_list.json y los ficheros de estado global siguen a cargo del leader, igual que init.sh.

Después de verificar el commit y el árbol, la última acción será crear `progress/impl_mobile-canvas-home.done` con la ruta absoluta de este reporte (marcador ignorado por git).

Graphify final repetido tras la enmienda del provider: `graphify update .`, exit 0, AST sin LLM; 28.202 nodos, 36.357 aristas, 1.860 comunidades. Log vigente `graphify-198.log`. Solo actualiza graphify-out ignorado, con su backup automático; no se ejecuta graphify label ni se instala la dependencia SQL opcional.

Comprobación previa al commit de cierre: 12/12 guardas PASS en el log final, 18/18 filas de traceability con hashes, ningún FAIL, fuentes móviles sin diff sin commitear, diff protegido vacío, lint log vacío, router.d.ts y .done ausentes. Recuenta y lista final 21/21 confirmadas; se incluyen únicamente reporte y traceability en el commit de cierre.


## Merge de dev

Entrada confirmada: branch `feature/198-mobile-canvas-home`, HEAD `6304d507`; MERGE_HEAD y origin/dev son `6bbd04858a004ea2fdf9d72eb3eb97d60b499232` (#200 Nutrición). Merge iniciado por el leader, 13 bloques en siete tests. Se mantienen los cambios no conflictivos ya preparados por el leader, incluyendo producción, docs y bookkeeping procedentes de dev; no se modifican manualmente. Snapshot del índice original en `merge-index-before-198.log`, conflictos originales en `merge-conflicts-before-198.log`.

Se aplica dev + delta #198. Los sufijos #200 preceden a #198 en los títulos que chocan. Para tracking-title se conservan las retiradas de Horario/Historial de dev y solo se añade Home de #198: esas dos entradas eran contexto heredado de la base, no adiciones de #198.

Base de tests nueva aportada por el leader: dev 143 suites, 4758 tests, 1 snapshot. #198 añadió 117 casos y retiró cinco de K28 contra H0. Dev ya retiró esos mismos cinco, de modo que aquí no se restan otra vez: **4758 + 117 = 4875 tests**, **143 + 1 HCF = 144 suites**, snapshot 1. Equivalente desde H0: 4683 − 5 K28 + 80 de #200 + 117 de #198 = 4875.


Resolución de los trece bloques:

| Bloque | Test / inventario | Resultado |
|---|---|---|
| 1 | AC tracking-title | Lista de dev (Food y retiradas de Horario/Historial) + Home de #198 R15. La fila text-15 conserva también WeeklyActivityChart de #198 R9 y Food de dev. |
| 2 | AC título de inventarios | Sufijo #200 R1/R3/R5/R12/R13, después #198 R9/R15. |
| 3 | CK rounded-16 | Food 2 de dev + gráfica Home 1; total 33 dev + 1 = 34. Comentarios y sufijos #200 R9, después #198 R9. |
| 4 | CN directUses, título por fichero | Sufijo #200 R1/R5/R7/R8/R9, después #198 R2; tabla conserva Food 6 y Home 5. |
| 5 | CN suma de esquinas, título | Sufijos en el mismo orden dev → Home. |
| 6 | CN suma directUses + compensación Card | 47 de dev + 4 de #198 R2 = 51, con cada término anotado. |
| 7 | CN #98 R10, título | Sufijo #200 R1/R5/R6/R7/R8/R9, después #198 R2/R3/R4/R11/R13. |
| 8 | CN #98 R10, cifras | Home 1+4=5, Food 1+1+1+1+2=6; global de esquinas 45+4=49; accent-soft 7−3=4; tinta Home 2+1=3; tinta Food 1+1−1=1. Conserva términos de ambas features. |
| 9 | DD radios, título | #200 R9 seguido de #198 R9; inventario conserva Food 2 y WeeklyActivityChart 1. |
| 10 | DD text-22/text-17, título | #200 R5 seguido de #198 R15; text-22 conserva EmptyState, Alert detail y Horario; text-17 conserva Food de dev. |
| 11 | LG tinta, dos títulos y suma | Sufijos dev primero; ruta nueva screens/food de dev, Home 3. Suma dev 21 + 1 de Home = 22, con +1/−1 de #200 R5/R6 y +1 de #198 R4. Se conserva también el cotejo de la suma contra los usos reales añadido por #198. |
| 12 | PF text-13, título | #200 R8 seguido de #198 R5; inventario incluye Food y Home. |
| 13 | EI número de EmptyState, título | #200 R1 seguido de #198 R15; Food se busca en screens/food y conserva 2; Home pasa de 1 a 2. |

Medición independiente sobre la producción ya fusionada (sin editarla): radios rounded-16 34, esquinas directas globales 49, directUses con compensación Card 51, accent-soft 4 y suma inkSites 22. Salida guardada en `merge-counts-198.log`. El diff de los siete tests contra el stage 3 (dev) se revisó: solo añade los deltas de #198, sus sufijos y la comprobación real ya existente de LG; no revierte cambios de #200.

Merge guardado con el mensaje por defecto en `249e3994 Merge remote-tracking branch 'origin/dev' into feature/198-mobile-canvas-home`. Padres: 6304d507 y 6bbd0485. Antes del commit: `git diff --name-only --diff-filter=U` y grep de marcadores vacíos, `git diff --cached --check` correcto, y comparación de todos los stage 0 contra el snapshot original idéntica. Solo se resolvieron los siete tests; Home y EmptyState no tienen diff contra 6304d507. Después del merge, mobile/specs/docs limpios; el reporte queda aparte para guardar los resultados de verificación.

Typecheck del merge: gate `test ! -e .expo/types/router.d.ts` correcto, `bun run typecheck` exit 0, sin diagnósticos (`merge-typecheck-198.log`). Primer intento de lint terminado por SIGKILL: log literal `error: Failed to run "eslint" due to signal SIGKILL`, conservado en `merge-lint-killed-198.log`. No se cambian fuentes ni configuración para evitarlo; se repetirá exactamente el lint sin caché cuando no queden procesos Jest en la máquina.

Reintento de lint tras esperar a que Jest dejara libre la máquina: `bunx expo lint --no-cache > ../progress/merge-lint-198.log 2>&1 && test ! -s ../progress/merge-lint-198.log`, exit 0, log 0 bytes. El intento terminado por SIGKILL se conserva aparte y no requirió cambios de código/configuración. Se inicia la suite completa en `merge-test-198.log`, con la espera compartida y sin otras verificaciones pesadas propias en paralelo.

Diff solicitado, medido tras el merge con `git diff --name-only 6bbd0485..HEAD -- mobile-pet-tracker/ docs/` (también guardado en `merge-changed-files-198.log`):

```text
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/home-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/home-photo-hero-canvas.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/empty-state-hero.test.tsx
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/components/empty-state.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
```

Son 20 archivos móviles y ninguno de docs/. La lista anterior al merge tenía 21 respecto de H0; canvas-foundations ya no aparece respecto de dev porque ambos lados retiraron exactamente el mismo bloque temporal K28. Frente a dev, package.json, bun.lock, layout raíz, Card, category-palette y theme/ permanecen idénticos. No se han cambiado manualmente los archivos de estado global ni las pantallas de Nutrición que llegan del merge.

Durante la suite completa aparecen, además del caso conocido de Reminders #178 R4, nueve fallos fuera de la lista de reintentos de Reanudación 2: Editor de zonas #189 R13. Ocho variantes de edición (es/en × nombres Casa, vacío, espacios y Casa con espacios) fallan en línea 806 al esperar sombra lip-gray y recibir #0D1117; el caso busy falla en línea 835 al esperar lip y recibir #0D1117. No cambian clases, tamaños ni offset; el diff de pantalla/test del Editor, chunky-lip y use-theme-colors contra 6bbd0485 está vacío. Se pidió aclaración al usuario sobre extender el reintento aislado a esta suite. No se modifican expectativas ni se ejecuta ese reintento mientras la respuesta esté pendiente. Se deja terminar la corrida completa ya iniciada.

La corrida completa terminó con exit 1 (`merge-test-198.log`):

```text
Test Suites: 2 failed, 142 passed, 144 total
Tests:       10 failed, 4865 passed, 4875 total
Snapshots:   1 passed, 1 total
```

La suma prevista se confirma: 4758 + 117 = 4875. Los siete tests de inventarios donde hubo conflictos pasan; las dos suites rojas son únicamente Reminders (un caso) y Geofence Editor (nueve casos), todos en la tinta de boxShadow con fallback #0D1117. La resolución del merge no requiere ajustes numéricos ni cambios de producción. El cierre espera la aclaración sobre el reintento del Editor. No se crea .done mientras no se haya autorizado y verificado ese cierre.

Estado del cierre del merge: la Reanudación 2 §3 limita el reintento a los cinco tests enumerados y dice «Cualquier otro rojo fuera del inventario sigue siendo PARADA». Los nueve casos del Editor no figuran en esa lista, por eso se ha solicitado ampliar el alcance antes de ejecutar su reintento; la pregunta sigue pendiente. No se afirma una regresión ni se cambia el color esperado a #0D1117. Logs disponibles: merge-test-198.log (exit 1), merge-typecheck-198.log (exit 0), merge-lint-198.log (exit 0, 0 bytes) y merge-lint-killed-198.log (intento inicial SIGKILL).

La resolución del merge está completa y los trece bloques quedan documentados arriba; el único paso pendiente es la validación aislada y el cierre según esa aclaración. No se ejecutaron init.sh, push, PR ni rebase. No se crea progress/impl_mobile-canvas-home.done al quedar pendiente la aceptación de la suite. El reporte se guarda en un commit propio para mantener limpio el árbol y permitir continuar directamente desde el merge resuelto.
