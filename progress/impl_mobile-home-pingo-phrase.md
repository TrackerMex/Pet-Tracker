```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-190
$ git branch --show-current
feature/190-mobile-home-pingo-phrase
$ git rev-parse --short HEAD (H0)
845cc339
$ git status --short
(salida vacía)
```

# Implementación #190 — mobile-home-pingo-phrase

## Anclas iniciales

```text
A1: $ grep -c '^status: approved' specs/mobile-home-pingo-phrase/requirements.md
1
A2: $ grep -cF -- '- [x] Enmienda #190 de' specs/mobile-home-pingo-phrase/requirements.md
1
A3: $ grep -cF -- '- [ ] Smoke de R15' specs/mobile-home-pingo-phrase/requirements.md
1
A4: $ grep -cF 'testID="home-entrance-summary"' mobile-pet-tracker/src/screens/home/index.tsx
1
A5: $ grep -cF 'index={' mobile-pet-tracker/src/screens/home/index.tsx
6
A6: $ grep -cF 'pingo' mobile-pet-tracker/src/screens/home/index.tsx
0
A7: $ grep -cF -- '--radius-4' mobile-pet-tracker/src/theme/global.css
0
A8: $ grep -cF -- '--radius-tile: 18px' mobile-pet-tracker/src/theme/global.css
1
A9: $ grep -cF 'home.pingoPhrase' mobile-pet-tracker/src/i18n/catalog.ts
0
A10: $ grep -cF '+ 4, // #186 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
A11: $ grep -cF 'expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
A12: $ grep -cF '+ 1 // #186 R2: utils/form-rules.ts' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
A13: $ grep -cF "'screens/forgot/index.tsx'," mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
1
A14: $ grep -cF "'screens/login/index.tsx'," mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
1
A15: $ grep -cF "it('pinta los seis envoltorios como hijos directos y en orden'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
A16: $ grep -cF "it('escalona las entradas cada 60 ms en el orden de los bloques'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
A17: $ grep -cF 'export function PingoFloat' mobile-pet-tracker/src/components/pingo-float.tsx
1
A18: $ grep -cF 'export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;' mobile-pet-tracker/src/theme/motion.ts
1
A19: $ grep -cF 'export function fmtKm' mobile-pet-tracker/src/screens/home/format.ts
1
A20: $ grep -cF '## Enmienda #190' docs/ui-guidelines.md
0
A21: $ grep -cF '## Enmienda #186' docs/ui-guidelines.md
1
A22: $ test -f mobile-pet-tracker/assets/images/pingo-talk.webp && echo ok
ok
A23: $ test ! -e mobile-pet-tracker/src/screens/home/pingo-phrase.ts && test ! -e mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts && echo ok
ok
```

## Preparación

- H0: `845cc339`; árbol limpio y branch correcta. Las 23 anclas coinciden.
- `bun install --frozen-lockfile`: exit 0; `node_modules`: presente; `.expo/types/router.d.ts`: ausente (exit 0).
- `pgrep -af '[i]nit\.sh'`: sin procesos, exit 1.
- Skills cargadas: `ponytail`, `building-native-ui` (plugin Expo), `appllama-app-design-skill`. La carta del proyecto prevalece; investigación y smoke Android quedan en leader/humano (§Skills).
- Leída documentación versionada Expo SDK 57 e Image: https://docs.expo.dev/versions/v57.0.0/ y https://docs.expo.dev/versions/v57.0.0/sdk/image/.
- No se ejecuta `init.sh`, no se abre PR ni se cambia bookkeeping: lo reserva el handoff al leader.

## Medidas de base

Medido antes del primer commit, cada fichero por separado (`FORCE_COLOR=0 bunx jest --runInBand --runTestsByPath <fichero>`, logs `/tmp/pet190-base-*.log`), todos exit 0:

| Fichero | Tests |
|---|---:|
| `src/screens/home/index.test.tsx` | 230 |
| `src/screens/home/home-entrance.test.tsx` | 7 |
| `src/theme/__tests__/motion.test.ts` | 25 |
| `src/providers/__tests__/language-provider.test.tsx` | 47 |
| `src/__tests__/ui-language.test.ts` | 30 |
| `src/__tests__/alerts-canvas-fidelity.test.ts` | 27 |
| `src/components/__tests__/pingo-float.test.tsx` | 5 |

`FORCE_COLOR=0 bun run test --runInBand` (una vez de base, sin pipe): exit 0.

```text
Test Suites: 124 passed, 124 total
Tests:       4149 passed, 4149 total
```

Log: `/tmp/pet190-base-full.log`.

Supuestos confirmados antes de los rojos: compilación Tailwind + compilador nativo Uniwind 1.11.0 con el token añadido en memoria: `rounded-br-4` → `borderBottomRightRadius: 4`, `leading-5.25` → `lineHeight: 21`. Script y log en `/tmp/pet190-uniwind-check.*`; se resolvieron sus alias internos mediante tsconfig temporal fuera del árbol. La forma `source: [{ testUri: ...pingo-talk.webp }]` ya la ejecutó en verde el test «pinta la pose» de la base de Inicio.

## Ejecución por requisito

Orden: R9, R8, R11, R1, R2, R3, R4, R6, R10, R7, R13, R12, R5, R14.

- R9 rojo `f6240159`: 9 fallos esperados (cuatro claves ausentes y recuento 429 frente a 433); tsc exit 0. Logs `/tmp/pet190-R9-red*.log`.
- R9 verde `4b4990cf`: 55/55 tests (dos suites), tsc exit 0.
- R8 rojo `bd12aaff`: 14 fallos esperados por módulo todavía inexistente; R9 sigue verde. Verde `ea7071f0`: 22/22, tsc exit 0 en ambas cadenas.
- R11 rojo `8e4387dc`: faltan burbuja y token (2 fallos); 230 tests anteriores de Inicio pasan. La receta se monta primero dentro del resumen y R1 la moverá a su entrada propia; así se prueba R11 antes de implementar R1 según el orden exigido.
- R11 verde `21c6c350`: 232/232 (Inicio + candado nuevo), tsc exit 0. `View` conserva `CONTINUOUS_CORNER`.
- Dependencia de inventarios R1/R6: para que el verde R1 pueda pasar la suite entera de Inicio, la igualdad exacta de hijos de `home-content` y `homeEnteringIds` deben admitir la entrada nueva ya en su rojo R1. Se conservan todos los ids y el orden; se añade únicamente Pingo, con comentario `(enmendado por #190 R1)`. El resto de R6 (siete retrasos y ausencia de bloques) sigue en su turno. No sería posible introducir un séptimo hijo en R1 y conservar simultáneamente la expectativa de seis hasta R6.
- R1 rojo `a17112f3`: 7 fallos esperados (4 escenarios R1 y 3 inventarios de entrada); verde `cd54083c`: 235/235, tsc exit 0.
- R2 rojo `da577a0c`: 4 fallos esperados, por detalle error/unreachable y por lista cargando/error con selección conservada. Las otras 5 filas ya estaban cubiertas parcialmente por R1 o la rama vacía; no se fabricó un rojo para ellas. Se espera siempre un nodo positivo del escenario.
- R2 verde `a88a8895`: 244/244, tsc exit 0.
- R3 rojo `0f11fd80`: 1 fallo por receta de fila ausente; verde `39c9edde`: 245/245, tsc exit 0.
- R4 rojo `66d23db9`: 1 fallo por pose ausente, resto 245/245. A partir de este verde se usa `--silent` en Jest para omitir los avisos informativos preexistentes de HeroUI; se siguen ejecutando los ficheros enteros, sin filtros `-t`, con `FORCE_COLOR=0` y logs fuera del árbol.
- R4 verde `9bb6ec8e`: 246/246, tsc exit 0; source de expo-image y estilo 64×64 comprobados en el árbol.
- R6 rojo `cf06f56d`: dos fallos esperados, la tabla de retrasos y el escenario sin semanal/última posición. Se enmiendan los títulos de las dos pruebas de #152 y la tabla de siete retrasos con `(enmendado por #190 R6)`.
- R6 verde `c2f1a30f`: 247/247, tsc exit 0. Índices fijos 0..6.
- R10 rojo `3fac2a91`: cuatro fallos esperados por texto vacío. Prueba de ES→EN sin recarga de las cinco queries, distancia/comidas, respaldo sin tracking y comidas con actividad error/nombre del detalle. No se encontró ningún `getByText` ambiguo por Luna/Milo que requiriera enmienda; la suite entera lo comprobará en verde.
- R10 verde `22219e18`: 273/273 en Inicio y función/copy (251 + 22), tsc exit 0. Sin enmiendas de ambigüedad necesarias.
- R7 nace verde porque ya lo implementa `HomeEntrance` (permitido por el handoff): el test comprueba inicial translateY 0, fundido opacidad 0→1, retraso 0 y ausencia de escala/entrada propia en la burbuja; no se modifica producción.
- Inventarios medidos antes de R13 (log `/tmp/pet190-inventory-before.log`): `R3_HOME=55`, `ALL_USES=570`, `SCREEN_FILES=35`. La suma esperada será 59 / 574 / 36.
- R7 verde único `922f73cb`: 252/252, tsc exit 0; sin rojo artificial y sin producción tocada.
- R13 rojo `5d3d019b`: 2 fallos esperados (tabla de cuatro claves ausente e inventario de `text-15` sin Inicio), 57 tests verdes. El verde sincroniza las tres listas prescritas y conserva los candados por igualdad exacta. `ALL_USES` mantiene su suma automática por bloques.
- R13 verde `26ac6d6b`: 61/61 (cuatro suites), tsc exit 0. Medida real posterior: `R3_HOME=59`, `ALL_USES=574`, `SCREEN_FILES=36` (log `/tmp/pet190-inventory-after.log`). El rojo fija el contrato nuevo y el verde aplica las enmiendas mecánicas; sin dividirlo así, R13 nacería verde con las listas ya corregidas.
- R12 nace verde (permitido): se plantó a mano `bg-[#fff]` en la fila de Inicio y el candado falló, 1 fallo / 3 verdes (exit 1, `/tmp/pet190-R12-mutation.log`). Se retiró restaurando exactamente el fichero anterior; esa violación nunca se commitea. El guard cubre los dos ficheros de producción de Home tocados: hex, clases arbitrarias, StyleSheet.create, cinco propiedades de sombra/elevation legacy y emoji.
- R12 verde único `cfe3092a`: 4/4, tsc exit 0. Producción restaurada byte a byte tras la mutación.
- R5 rojo `ccbde7b2`: 2 fallos esperados, 252 verdes. Los dos modos usan `toHaveAnimatedStyle` con `shouldMatchAllProps: true`; se distingue `withRepeat(-10, -1, true)` del pulso de estado, se comprueban 1500 ms y la curva 0.42/0/0.58/1 con valores esperados escritos a mano. Gate: casilla de la Enmienda #190 firmada en requirements.md; no se reabre.
- R5 verde `3ab42802`: 284/284 (Inicio 254 + PingoFloat 5 + motion 25), tsc exit 0. No se tocan `pingo-float.tsx`, `home-entrance.tsx` ni `motion.ts`.
- R14 rojo `6fb84202`: 1 fallo por enmienda ausente, otros 4 verdes. El verde copia literalmente el bloque de design.md tras la Enmienda #186, incluida la casilla sin marcar que corresponde al humano; la autorización previa vive en requirements.md.

## Tests enmendados

- `src/providers/__tests__/language-provider.test.tsx`: fórmula 429→433, `+ 4 // #190 R9`, rojo R9.
- `src/screens/home/index.test.tsx`: inventario exacto de hijos de `home-content` y `homeEnteringIds` suma Pingo en el rojo R1 (dependencia explicada arriba); título siete envoltorios y tabla completa 0..360 en rojo R6. Comentarios `(enmendado por #190 R1/R6)` en las líneas respectivas. Las demás listas cerradas permanecen iguales. No hubo que acotar ninguna aserción por ambigüedad del copy en R10.
- `src/__tests__/alerts-canvas-fidelity.test.ts`: añade Inicio entre forgot y login al inventario de `text-15`, verde R13.
- `src/__tests__/ui-copy-table.ts`: cuatro filas nuevas en `R3_HOME` para el helper; `ALL_USES` continúa sumándose por bloques, verde R13.
- `src/__tests__/ui-language.test.ts`: `R3_HOME` 55→59 y `SCREEN_FILES` 35→36, verde R13. Todos estos inventarios llevan el comentario de enmienda.
- `src/__tests__/consistency-classnames.test.ts` (excepción de inventario autorizada en el handoff): Home tiene 1 uso directo de CONTINUOUS_CORNER en vez de 0; total de producción 34→35. Se conservan todos los demás recuentos y guardas.
- `src/__tests__/profile-canvas-fidelity.test.ts` (misma excepción): el inventario exacto y ordenado de `rounded-tile` suma únicamente `screens/home/index.tsx` entre add-reminder y profile. Ambos ficheros llevan `(enmendado por #190 R13)`.
- Los tests nuevos están en los dos ficheros autorizados y el describe de Inicio por requisito.

## Smoke Android R15 — reservado al humano

1. Usar el dev build Android existente de SDK 57 con el entorno local del runbook, una cuenta con mascota y los datos de detalle/actividad resueltos. Desde `mobile-pet-tracker/`, iniciar Metro con `bunx expo start --dev-client --lan` y abrir ese bundle en el dev build. No se generan builds ni recursos AWS en esta entrega.
2. En modo claro, abrir Inicio con mascota: burbuja como primer bloque bajo el hero y antes del resumen; texto 15/600, interlínea 21 px, legible en hasta tres líneas con los datos de prueba; tres esquinas de 18 px y cola de 4 px abajo a la derecha. Pingo a 64×64 a la derecha, alineado al borde inferior, con 10 px de separación. Flota 10 px, 1,5 s por tramo y vuelta invertida. Comprobar frases con distancia/comidas y respaldo cuando faltan; la frase espera a detalle + actividad y no cambia por la llegada tardía de esta última.
3. Repetir en modo oscuro; revisar superficie, texto, contraste y sombra. Cambiar ES↔EN y comprobar la misma información sin refresco ni carga nueva.
4. Activar reduce motion en Android y volver a abrir la app. Pingo permanece en translateY 0 sin bucle; la entrada no desplaza ni escala, conserva el fundido. Comprobar también carga, error, cuenta sin mascotas y sin selección: no hay burbuja.
5. Comparar la zona con el artboard Inicio aprobado, respetando las divergencias firmadas (bloque bajo hero bleed, entrada HomeEntrance y copy disponible sin hora de siguiente comida). Solo el humano marca su casilla de R15 en `requirements.md`; también queda sin marcar la casilla de la Enmienda #190 en la carta, tal como pide el handoff. Esta entrega no declara cerrada la feature.

## Validación final

- R14 verde `be7edead`: 5/5, tsc exit 0; texto literal y ubicación de la enmienda comprobados.
- Primer lint: detectó `react/no-children-prop` en la construcción del probe de R9 con `React.createElement`. Se corrige únicamente la forma de pasar su hijo, sin cambiar los literales ni las aserciones. Se repetirá lint y la suite completa de ese fichero antes de commitear la corrección.
- Corrección de lint R9 `debf4467`: 69/69 (frases + language-provider), tsc y lint exit 0. El overload de React exige el tipo con children aun cuando se pasa en el tercer argumento; se documenta esa aserción de tipo en el test.
- Primera suite móvil completa final: 126 suites, 4197 tests verdes y 3 fallos, todos inventarios que la burbuja desplaza. Repetidos los dos ficheros enteros: mismos 3 fallos / 95 verdes, exit 1 (`/tmp/pet190-extra-inventory-red.log`). Son los usos directos de CONTINUOUS_CORNER de Home (0→1) y globales (34→35), y el inventario exacto de rounded-tile (+Home). Se aplica la excepción explícita del handoff para otros inventarios y se enmiendan solo esos deltas; no cambia producción ni se relaja ningún otro candado.
- Al sincronizar directUses se expone también su suma congelada con las dos ramas de Card (36→37). Se actualiza ese cuarto candado agregado por el mismo +1 de la burbuja; primer intento específico 1 fallo / 97 verdes, sin commit (`/tmp/pet190-R13-extra-green.log`, después sustituido por la corrida final del conjunto). No cambia ningún otro comportamiento.
- Inventarios adicionales R13 `3ec3305b`: 98/98 (dos suites), tsc exit 0; lint global repetido exit 0.
- Segunda corrida completa: inventarios verdes, 4199/4200 tests; fallo en `src/screens/profile/index.test.tsx::R1: me card::shows the real account name and email`. Espera a `me-card` y consulta inmediatamente `Ada Lovelace`, cuando el contenedor puede existir sin resolver el perfil. Esa misma suite pasó tanto en la base como en la primera corrida completa final; no se modifica ese test de comportamiento fuera de alcance. Se repite el conjunto entero para comprobar la intermitencia antes de atribuir una regresión (`/tmp/pet190-final-full-green.log`).
- Repetición completa confirmada: 126/126 suites, 4200/4200 tests y 1/1 snapshot, exit 0 (`/tmp/pet190-final-full-confirmed.log`). Perfil pasó en esta corrida completa; la espera de su test queda documentada como intermitencia observada, sin afirmar un origen preexistente ni alterar comportamiento ajeno a #190.

## Historial de commits por requisito

| Requisito | Commits, en orden |
|---|---|
| R9 | `f6240159 test(home): lock bilingual Pingo phrases (R9)`<br>`4b4990cf feat(home): add approved Pingo copy in both languages (R9)`<br>`debf4467 test(home): pass the translation probe as a React child (R9)` |
| R8 | `bd12aaff test(home): cover phrase priorities and distance boundaries (R8)`<br>`ea7071f0 feat(home): select Pingo phrase from existing daily data (R8)` |
| R11 | `8e4387dc test(home): lock bubble typography and corner token (R11)`<br>`21c6c350 feat(home): add token-based Pingo bubble styling (R11)` |
| R1 | `a17112f3 test(home): require Pingo as the first resolved home block (R1)`<br>`cd54083c feat(home): place Pingo before the home summary (R1)` |
| R2 | `da577a0c test(home): hide Pingo across incomplete and failed states (R2)`<br>`a88a8895 feat(home): gate Pingo on resolved pet and activity data (R2)` |
| R3 | `0f11fd80 test(home): lock Pingo row order and alignment (R3)`<br>`39c9edde feat(home): align the bubble and Pingo pose in one row (R3)` |
| R4 | `66d23db9 test(home): lock the decorative Pingo image and size (R4)`<br>`9bb6ec8e feat(home): render the approved decorative Pingo pose (R4)` |
| R6 | `cf06f56d test(home): shift stagger delays and preserve missing block slots (R6)`<br>`c2f1a30f feat(home): stagger all seven home blocks at fixed indices (R6)` |
| R10 | `3fac2a91 test(home): translate live Pingo phrases without refetching (R10)`<br>`22219e18 feat(home): render localized Pingo phrases from loaded data (R10)` |
| R7 | `922f73cb test(home): preserve the reduced-motion Pingo entrance (R7)` |
| R13 | `5d3d019b test(home): require the four Pingo copy inventory entries (R13)`<br>`26ac6d6b feat(home): align copy and typography inventories for Pingo (R13)`<br>`3ec3305b feat(home): align Pingo radius and continuous-corner inventories (R13)` |
| R12 | `cfe3092a test(home): enforce grep-clean Pingo sources (R12)` |
| R5 | `ccbde7b2 test(home): require Pingo float and reduced-motion behavior (R5)`<br>`3ab42802 feat(home): reuse PingoFloat for the home phrase pose (R5)` |
| R14 | `6fb84202 test(home): lock the complete Pingo UI amendment text (R14)`<br>`be7edead feat(home): document the approved Pingo UI amendment (R14)` |


## Resultado entregado

- R1–R14 implementados y verificados; R15 reservado al humano. Dos ajustes posteriores a la secuencia principal: lint del probe R9 (`debf4467`) e inventarios extra autorizados de R13 (`3ec3305b`). No se reescribe el historial rojo/verde.
- Suite completa final: `FORCE_COLOR=0 bun run test --runInBand --silent`, exit 0 (`/tmp/pet190-final-full-confirmed.log`):

```text
Test Suites: 126 passed, 126 total
Tests:       4200 passed, 4200 total
Snapshots:   1 passed, 1 total
```

- `bun run lint`: exit 0 (`/tmp/pet190-final-lint-green.log`). `bunx tsc --noEmit`: exit 0 en cada cadena de commit; el commit final de trazabilidad vuelve a encadenar el candado completo y tsc. `router.d.ts` ausente en todas las guardas, nunca borrado.
- `git diff --check`: verde. El diff de producción contra `origin/main=14ec7307` contiene exactamente `src/screens/home/index.tsx`, `src/screens/home/pingo-phrase.ts`, `src/i18n/catalog.ts` y `src/theme/global.css`; backend, motion compartido, dependencias, STATUS/progress del leader y feature_list permanecen intactos.
- La trazabilidad se rellena una sola vez tras el último verde, en el commit final `docs(home): trazabilidad de #190`. La feature sigue `in_progress`; no se declara done ni se ejecuta `init.sh`. El leader conserva el gate global y la PR. R15 y las casillas humanas no se marcan.

Lista completa contrastada al cierre con `git diff --name-only 845cc339..HEAD` (H0):

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts
mobile-pet-tracker/src/__tests__/profile-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/home/index.tsx
mobile-pet-tracker/src/screens/home/pingo-phrase.test.ts
mobile-pet-tracker/src/screens/home/pingo-phrase.ts
mobile-pet-tracker/src/theme/global.css
progress/impl_mobile-home-pingo-phrase.md
specs/mobile-home-pingo-phrase/traceability.md
```

# Ronda 2 — casilla de la enmienda

## Base

Capturada antes de editar el test. `git status --short` no imprimió líneas.

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-190
$ git branch --show-current
feature/190-mobile-home-pingo-phrase
$ git rev-parse --short HEAD
402c9bc4
$ git status --short
(vacío)
```

H0R2: `402c9bc4` (`docs(#190): handoff ronda 2 a Codex (casilla de la enmienda tolerante)`). Anclas A1–A5 verificadas: `1`, `1`, `1`, `1`, `ok`.

## Sondas y verificación

Comando de las sondas: `FORCE_COLOR=0 bunx jest --runInBand --silent --runTestsByPath src/__tests__/home-pingo-phrase.test.ts` (cwd `mobile-pet-tracker/`); cada salida se guardó en `/tmp/pet190-r2-Sn.log` y, tras revertir, `ui-guidelines.md` quedó sin diff, el índice sin cambios y A1 volvió a `1`. El diff no puede estar globalmente vacío durante estas comprobaciones porque esta sección requerida ya modifica este mismo impl; ese archivo es el único diff previo de documentación.

| Sonda | Mutación temporal en la carta | Salida esperada | Exit | Resultado |
|---|---|---:|---:|---|
| S0 | Marcar `[x]` con el test original | 1 fallo R14, 4 verdes | 1 | Conforme |
| S1 | Casilla `[ ]` original | 5/5 | 0 | Conforme |
| S2 | Casilla `[x]` | 5/5 | 0 | Conforme |
| S3 | Casilla `[X]` | 5/5 | 0 | Conforme |
| S4 | Quitar la casilla | R14 falla | 1 | Conforme |
| S5 | Cambiar texto a «aprobada por el humano» | R14 falla | 1 | Conforme |
| S6 | `[x]` y cambiar «Un solo uso hoy.» por «Dos usos hoy.» | R14 falla | 1 | Conforme |
| S7 | Añadir una segunda casilla idéntica | R14 falla | 1 | Conforme |

Verificaciones finales desde `mobile-pet-tracker/`:

- `FORCE_COLOR=0 bunx jest --runInBand --silent --runTestsByPath src/__tests__/home-pingo-phrase.test.ts`: exit 0, 1 suite y 5 tests pasados (`/tmp/pet190-r2-final-jest.log`).
- `bunx tsc --noEmit`: exit 0 (`/tmp/pet190-r2-final-tsc.log`).
- `bun run lint`: exit 0 y `grep -ciE 'killed|sigkill|error|warning' /tmp/pet190-r2-final-lint.log` = 0.
- `git diff --check`: sin errores. `router.d.ts` sigue ausente y A1 sigue en 1.
- `./init.sh` (ejecutado por el requisito de entrada de `AGENTS.md`): exit 0; build, 126 suites/4200 tests móviles, 30 suites/468 tests e2e, lint y typecheck verdes. Avisó de seis claves ausentes en `.env` y de soporte futuro de AWS SDK para Node 22; no modificó archivos del proyecto.

## Commits y archivos tocados

H0R2: `402c9bc4`. Commit del test: `5f14c907` (`test(home): tolerate the signed amendment checkbox (R14)`). El segundo commit contiene únicamente este registro documental.

```text
mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts
progress/impl_mobile-home-pingo-phrase.md
```

La feature permanece `in_progress`; R15 y las casillas humanas siguen pendientes.
