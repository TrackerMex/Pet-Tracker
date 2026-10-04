# review: meals-history (#105)
Fecha: 2026-10-04
Veredicto: RECHAZADO

Rama `feature/105-meals-history`, HEAD `dc1a0c5` (código hasta `2a5919cd`). Base de implementación H0 `2edf8c38`.
Dos bloqueos: B1 es un defecto real de código (lint backend), B2 es un bloqueo de entorno (`./init.sh` sale con EXIT=1 antes de poder verificar los e2e). Todo lo demás verificado cumple; no hay hallazgos funcionales, de arquitectura, de trazabilidad ni de aislamiento.

## Bloqueos

### B1 — El nuevo e2e backend no pasa el lint del repo (defecto de código)
`init.sh` ejecuta `LINT_CMD` (`init.config.sh`: `pnpm -C backend-pet-tracker run lint && …`), y también el CI. El script `lint` del backend es `eslint "{src,apps,libs,test}/**/*.ts" --fix`. Corrí ESLint **sin** `--fix` (para no tocar el árbol) sobre todo el backend: el único fichero con errores es el nuevo, 23 errores:

`backend-pet-tracker/test/meals-history.e2e-spec.ts`
- L39-51: 11 errores `prettier/prettier` (cadena `.insert(users).values({...})` mal indentada). Son autofixables con `--fix`.
- L125, 142, 188, 201, 215, 229, 230, 250, 251: `@typescript-eslint/no-unsafe-member-access` (`response.body.days` / `.from` sobre `any`).
- L240:30 `no-unsafe-assignment` y L251:14 `no-unsafe-call` (mismo origen: `response.body` sin tipar).
- L257:15 `no-unused-vars`: `owner` desestructurado y nunca usado en `it('allows an active family member')`.
- Los 12 que no son de formato **no** los arregla `--fix`, así que `./init.sh` (y el CI) fallarían en el paso Lint aun con la infra e2e levantada.

Contraste: `test/meals.e2e-spec.ts`, `test/meal-times.e2e-spec.ts`, `test/activity.e2e-spec.ts` y todo `src/modules/nutrition` dan 0 problemas con el mismo ESLint. Nada de esto está en el informe de Codex: el handoff solo pedía `bun run lint` (móvil) y Codex no ejecutó el lint backend.
Qué debe corregir el implementer: tipar `response.body` (como hacen los e2e vecinos), quitar `owner` no usado, y dejar `pnpm -C backend-pet-tracker exec eslint "{src,apps,libs,test}/**/*.ts"` (sin `--fix`) con 0 problemas. Es un cambio solo de test (sin tocar su comportamiento ni los R-id).

### B2 — `./init.sh` EXIT=1: infra e2e no disponible en este entorno de revisión
`./init.sh` corrido por mí en `/home/user/Pet-Tracker`:
- Build backend + `cdk synth`: OK.
- Backend unit: 176 suites / 1348 tests passed. Infra: 2 suites / 14 tests. Scripts `node --test`: 15/15.
- Móvil: **92 suites / 1981 tests / 1 snapshot, todos verdes**. Coincide con el informe de Codex.
- Tests e2e: `❌ Infra e2e caída: localhost:5432 no responde`. No hay daemon Docker (`/var/run/docker.sock` ausente) ni Postgres local en este sandbox; no pude levantar la infra. `init.sh` sale con EXIT=1 y los pasos Lint y Typecheck de `init.sh` no se alcanzaron (los corrí por separado, ver abajo).
- No maquillo el fallo: **no verifiqué independientemente 29 suites / 438 e2e** (incluidos los 15 de `meals-history.e2e-spec.ts`); solo el informe de Codex los respalda. Tras corregir B1 hay que repetir `./init.sh` completo en una máquina con `docker compose up -d` (VPS del humano). Si pasa íntegro, no queda ningún otro hallazgo que impida APROBADO.

Comprobaciones sueltas que sí pude correr (verdes): `bun run typecheck` móvil exit=0, `bun run lint` móvil exit=0 (sin `router.d.ts`, comprobado ausente antes), `pnpm exec tsc --noEmit` backend exit=0 (incluye el e2e), `pnpm -C infra run lint` OK. Nota: `init.sh` creó `.env` desde `.env.example` (gitignored; `git status` limpio).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`feature_list.json`: #105 `meals-history`)
- [x] `progress/current.md` actualizado (sesión #105, reparto con #148 documentado)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (`nutrition.errors.ts`, `nutrition.constants.ts`, puerto `meal-serving.repository.ts` sin imports de infra)
- [x] el contrato en domain es interfaz pura (`listServedBetween` en `MealServingRepository`)
- [x] application depende de interfaces (`GetMealsHistoryUseCase` inyecta `MEAL_SERVING_REPOSITORY` y `PET_REPOSITORY`)
- [x] infrastructure sin lógica de negocio (repo Drizzle solo `and/gte/lte/orderBy`; controller solo parsea query, llama al caso de uso y mapea errores; mismos literales que `activity-error.mapper.ts`)

## Checklist C4 — TDD
- [x] Cada R-id R1–R15 tiene al menos un test que lo nombra (`describe('#105 R<n>: …')`): R1/R2/R4 en `test/meals-history.e2e-spec.ts`, R2 en `nutrition-error.mapper.spec.ts`, R3 en `get-meals-history.use-case.spec.ts`, R5 `language-provider.test.tsx`, R6 `nutrition.test.ts`, R7 `query-keys.test.ts`, R8 en las cuatro suites app, R9/R11/R12/R13 `screens/meals-history/index.test.tsx`, R10 `month-grid.test.ts`, R14 `food.test.tsx`, R15 `design-drift.test.ts` (+ filas `R3` Card y `#87 R19` comentadas `#105 R15`).
- [x] Historial test-primero (verificado sobre el grafo completo; este clon es shallow, ver Observaciones): R2 `081f569`→`059aa33`; R1 `20d4c66` (rojo por tsc, como manda tasks.md)→`46c18d5` (el comportamiento de R1 lo observa el e2e rojo de R4 `430b232`→`929465c`); R3 `9a93e73`→`0fe5f78`; R5 `479b124`→`edc990e`; R10 `7dd4c38`→`5a19d59`→`ed5c370`; R6 `9b5bba9`→`cec4a93`; R7 `8f62b4d`→`41c66b8`; R8 `053a158`→`1ca5a8d`; R9 `0385df6`,`4f69865`→`a7cdeef`; R11 `767c682`→`b1ea49a`, E3 `c487b14`→`621035c`; R12 `244744c`→`f9be482`; R13 `a64d43d`→`39d5759` (+refactor `77935e1`); R14 `d26a135`→`ab69385`.
- Excepciones aceptadas, previstas por tasks.md: R15 `ef3a2a8` nace verde (es candado de inventario, documentado en el commit); `40bb583` y `2a5919c` son estilo/refactor sin cambio de comportamiento.
- Incumplimiento menor (no bloquea): `5a19d59 feat(mobile): add pure civil month calendar helpers (#105 R10)` quedó commiteado con un SyntaxError y se corrigió en `ed5c370`. Es un commit intermedio que no compila (estorba a un `git bisect`); Codex lo documentó y no se reescribió historia, conforme a su instrucción.

## Checklist C5 — Trazabilidad
- [x] `specs/meals-history/traceability.md` sin filas "pendiente" salvo **H1** (`pendiente (humano)`), que es el gate humano separado: no la marco ni la ejecuto, **queda pendiente**.
- [x] Los 24 hashes citados existen y son ancestros de `dc1a0c5` (comprobado con `merge-base --is-ancestor`); cada test citado existe y nombra su R-id.
- [x] Commits siguen `feat|test(<scope>): … (#105 R<n>)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`, casilla humana base y casillas propias E1, E2, E3 marcadas (Notion, 2026-10-03/04). Los cambios a `requirements/design/tasks` desde H0 son solo las enmiendas E1–E3 y el `§2.18` de `specs/mobile-ui-language/design.md` que R5 autoriza.

## Checklist C7 — Sin código huérfano
- [x] N/A — la feature no reemplaza nada existente.

## Verificación por requisito, enmiendas y aislamiento (puntos 2, 4, 5, 6, 7, 8 del encargo)
- R1–R4 backend: código coincide literalmente con la spec (orden 1→7 del caso de uso, `assertRange` copia de activity con la constante propia, `z.strictObject`, `PetAccessGuard` intacto, mapper con los literales exactos). R5–R14 móvil: pantalla, util y route conforme (cuatro estados, `keepPreviousData`, tope por `today` del backend, seis decisiones por celda contadas por hijos, detalle inline con toggle, reset de `selectedDay` al cambiar de mes, entrada en Food tras `meal-schedule-link`). R15: `describe('#105 R15')`, `'meals-history'` en la lista `R3`, `screenSignOutCalls` `: 1`, lockfiles/`package.json` sin diff frente a H0 (`d29d49d5` y `origin/main` no existen en este clon; comparé contra `2edf8c38`).
- E1: fila `{ file: 'src/app/_layout.tsx', key: 'mealsHistory.mealsHistory' } // #105 R5` en `R6_FOOD`, `+ 11 // #105 R5` en `#65 R6`. Aplicada.
- E2: `SCREEN_FILES` `toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1)` con `#105 R5` en el comentario; los dos `it` de `#65 R18` en verde desde R8/R14. Aplicada.
- E3: `DayNumber` de hoy con `text-sm font-bold text-accent-strong`, punto `bg-accent`, `inkSites` de `#61 R4` sin tocar, y el candado de fuente de R11 exige `text-accent-strong`. Aplicada. `#61 R4` verde dentro del Jest completo.
- Aislamiento: `git diff --name-only f43c8487 HEAD -- backend-pet-tracker/` vacío (backend sin cambios tras `f43c8487`). De la lista prohibida de #148 solo se tocaron `design-drift.test.ts`, `consistency-classnames.test.ts`, `ui-language.test.ts`, `ui-copy-table.ts`, `catalog.ts`, `language-provider.test.tsx`, `_layout.tsx`, `layout.test.tsx` y `food.tsx` en las líneas que R5/R8/R11/R14/R15 y las enmiendas autorizan (revisé cada hunk). Ningún fichero de los 14 de #148 (formularios + tests) aparece en el diff.
- Carta de UI (`docs/ui-guidelines.md`): sin hex, sin clases arbitrarias, sin `StyleSheet`, sin `UNSAFE_*` ni `process.env.TZ`; `rounded-card` en el Skeleton, `rounded-full` en celdas/punto, `padding: 24 / gap: 16 / paddingBottom: insets.bottom + 24` (A11), touch target `h-11 w-11` (44), feedback de pulsado en cada `Pressable`, `TABULAR_NUMS`, copy por `t()`, colores de icono por `useThemeColors`. Sin hallazgos.
- Punto 7, `it` extra de R3 ('validates a defaulted range after resolving owner today': `from: '2026-03-16'` sin `to`, `findOwnerTimezone` 1 vez, `listServedBetween` 0): **se mantiene**. Fija el paso 3→5 del orden exacto de R3 (la validación de rango con el `to` por defecto va después de resolver `today` y antes de la consulta), que ningún otro caso cubre (el e2e solo prueba `from > to` con ambos presentes). No exige nada fuera de la spec.
- Punto 8: H1 queda **pendiente** en `traceability.md` y en la casilla de `requirements.md`; no la marqué ni la ejecuté.

## Observaciones (no bloquean)
1. Este clon es shallow (`.git/shallow`: `46c18d5` aparece como raíz y `2edf8c38..HEAD` muestra 50 commits). El historial real (53 commits, incluidos `081f569`, `059aa33`, `20d4c66`) lo recorrí por los padres de los objetos con un repo temporal en el scratchpad; el repo no se modificó.
2. `detail-stack.guard.test.tsx` y `detail-stack.navigation.test.tsx` incorporan un `jest.mock('expo-linking', …)` que Codex añadió para esquivar `Unmatched` mientras la ruta no existía (informe, Anexo R8). Sigue ahí tras el verde; no verifiqué si ya es innecesario. Inocuo.
3. `docs/ui-guidelines.md` §Decisiones fijas 6 (A11) no nombra `meals-history` en su lista de pantallas empujadas; la spec no pide editarla (cuestión para el leader, no del implementer).
4. El `Text` de error (`meals-history-error`) no lleva `selectable` (micro-regla de la carta para mensajes de error); la spec dicta ese marcado literal, así que es una brecha de la spec, no de la implementación.
5. `catalog.ts` y el bloque de `language-provider.test.tsx` usan comillas dobles y una indentación distinta del resto del fichero (lint móvil pasa).
6. `progress/impl_meals-history.md` pesa ~500 KB (11 401 líneas de logs crudos de candidatas fallidas); dificulta la lectura de la trazabilidad real.

## Para cerrar el rechazo
1. Implementer: corregir B1 (solo `backend-pet-tracker/test/meals-history.e2e-spec.ts`), con commit propio y sin reescribir historia.
2. Humano/leader: repetir `./init.sh` completo con `docker compose up -d` (Postgres 5432/5433 y LocalStack) y volver a lanzar el reviewer; si queda EXIT=0 con los e2e 29/438, el veredicto pasa a APROBADO.
3. H1 sigue siendo del humano tras la aprobación.

## Output de ./init.sh
Resumen del log completo (24 000 líneas; ruta del log: scratchpad de esta sesión, `init.log`):
```
✅ node, pnpm, bun disponibles
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: meals-history
✅ STATUS.md sincronizado con feature_list.json
→ Build...                  ✅ Build exitoso
→ Ejecutando tests...
   backend  Test Suites: 176 passed, 176 total   Tests: 1348 passed, 1348 total
   infra    Test Suites: 2 passed, 2 total       Tests: 14 passed, 14 total
   node:test (env-drift, init-color, init-e2e-gate)  # tests 15  # pass 15  # fail 0
   móvil    Test Suites: 92 passed, 92 total     Tests: 1981 passed, 1981 total   Snapshots: 1 passed
✅ Tests pasados
→ Tests e2e...
❌ Infra e2e caída: localhost:5432 no responde (derivado de DATABASE_URL en .env). Levántala con: docker compose up -d
EXIT=1
```
Lint backend ejecutado aparte sin `--fix` (el paso que `init.sh` habría corrido tras los e2e): `pnpm exec eslint "{src,apps,libs,test}/**/*.ts"` → `✖ 23 problems (23 errors, 0 warnings)`, todos en `test/meals-history.e2e-spec.ts` (B1).
