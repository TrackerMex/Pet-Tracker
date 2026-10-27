Veredicto: aprobado

# review: nutrition-ai-structured-plan (#212, backend)
Fecha: 2026-10-27
Veredicto: APROBADO, condicionado a que el `./init.sh` del leader salga verde. Por instrucción del leader no lo corrí yo; si sale rojo, este veredicto no vale.
Hash revisado: 70971efd (H0 821ef76e)

## Hallazgos

### Bloqueantes
Ninguno.

### Menores (no bloquean)
1. **Los unitarios de R15 no distinguen `aiProposal` de `aiExplanation` en el acierto de caché.** Está en el tramo del subagente `implementer`.
   - Sitio: `backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts:89`.
   - Reproducción: sustituir `latestPlan.aiProposal !== null` por `latestPlan.aiExplanation !== null`.
     - `pnpm exec jest --config package.json src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts` da exit 0, 13/13: la mutación sobrevive.
   - Por qué: el it `R15: hash igual con propuesta…` (spec:347) usa `setup().updated`, que tiene las dos columnas no nulas. Los its `R15: hash igual sin propuesta…` (spec:359, 388) parten de `setup().inserted`, que tiene las dos nulas. Ningún unitario usa un plan con `aiExplanation` y sin `aiProposal`, que es justo la fila que deja R17.
   - La red que sí la pilla: el e2e `R17: mover una franja descarta la propuesta y el siguiente generate propone sobre la hora editada`, que falla con esta mutación (1 de 12).
   - Por qué no es bloqueante: los its que pide requirements.md §R15 están todos y son correctos; el hueco solo existe en la capa unitaria. Arreglarlo cuesta una línea: en `spec:388` (o en un it nuevo), que el `latest` sea `new NutritionPlan({ ...setup().inserted, aiExplanation: 'x' })`. Lo decide el leader; no hace falta para cerrar.
2. **design.md no coincide con el handoff en dónde vive `NutritionAiOutputSchema`.** design.md:150 lo pone en `nutrition-prompt.ts`; el handoff (línea 297) lo pone en `anthropic-nutrition-explainer.ts`, y ahí está, como const no exportada (`anthropic-nutrition-explainer.ts:23`). No cambia el comportamiento. El implementador siguió el handoff, así que no es culpa suya. Si interesa, se alinea design.md.
3. **C2 en esta rama:** `feature_list.json` deja #212 en `spec_ready` y no hay ninguna feature `in_progress`. Esto lo lleva el leader, no el implementador. Se anota para el cierre (§7.2).

### Nota de proceso (mía)
- En la mutación 2a, la corrida de jest arrancó con un jest ajeno vivo (`pgrep` dio 1). Ahí incumplí §Esperas.
- El resultado no depende de la carga: falla exactamente la fila mutada, `R7: descarta clave extra en franja`.
- Desde ahí metí la espera dentro de cada comando, con un bucle `pgrep` antes de cada jest.
- Al principio un `init.sh` de #214 corría en otro worktree: lo esperé sin matarlo.

## Verificación independiente (en primer plano, desde backend-pet-tracker)
- Estado: branch `feature/212-nutrition-ai-structured-plan`, HEAD 70971efd. Sin seguimiento solo están `progress/impl_…` y este review.
- tsc: `pnpm exec tsc --noEmit -p tsconfig.json` sale con exit 0 y salida vacía.
- eslint: `pnpm exec eslint <los 39 .ts añadidos o modificados del diff>` sale con exit 0 y salida vacía.
- Unitarios: `pnpm exec jest --config package.json src/modules/nutrition src/db/schema/nutrition.schema.spec.ts` sale con exit 0: 22 suites, 277/277, la misma cifra final del reporte.
- Base del worktree:
  - `pet_tracker_wt212` (5433) tiene 23 migraciones en `drizzle.__drizzle_migrations`;
  - `DATABASE_URL` no está exportada;
  - `.env` no se leyó.
- e2e de nutrición: `pnpm exec jest --config ./test/jest-e2e.json nutrition meal` sale con exit 0: 6 suites, 102/102. El e2e nuevo solo da 12/12 (se ve en las corridas de mutación).
- No corrí la batería completa (198 suites unitarias y 35 e2e): la cubre el `init.sh` del leader.

## Mutaciones plantadas (cada una revertida con `git checkout HEAD -- <f>`)
| # | Zona | Fichero:línea | Mutación | Resultado |
|---|---|---|---|---|
| 1a | caso de uso, R15 | generate-nutrition-plan.use-case.ts:89 | `aiProposal !== null` → `aiExplanation !== null` | unitarios 13/13 verde (sobrevive, hallazgo menor 1); e2e nuevo 1 rojo: R17 |
| 1b | caso de uso, R14 | generate-nutrition-plan.use-case.ts:119 | `ownerLocalDay(...)` → `now.toISOString().slice(0, 10)` | 2 rojos: `R14: consume con la mascota, el dia local del dueno y el limite 3`, `R14: la fecha de revision parte del dia local del dueno` |
| 2a | zod, R7 | anthropic-nutrition-explainer.ts:26 | `z.strictObject` interior → `z.object` | 1 rojo: `R7: descarta clave extra en franja` |
| 2b | zod, R7 | anthropic-nutrition-explainer.ts:34 | `reviewInDays .min(7)` → `.min(6)` | 1 rojo: `R7: descarta reviewInDays 6` |
| 3a | persistencia, R16 | nutrition.drizzle.repository.ts:56 | `.set({ aiExplanation })` sin `aiProposal` | 1 rojo: `R16: setAiResult actualiza explicacion y propuesta solo en el plan indicado` |
| 3b | mapper de fila, R16 (zona ciega) | nutrition.drizzle.repository.ts:184 | `aiProposal: row.aiProposal ?? null` → `null` | unitarios: 1 rojo (R16 repo); e2e: 1 rojo, `R16: generate con propuesta valida devuelve proposed, la persiste y GET la devuelve` |
| 4 | contador atómico, R12 | nutrition.drizzle.repository.ts:43 | `setWhere count < limit` → `<=` | e2e: 3 rojos, los 2 de R12 (secuencial y concurrente) y `R16: el cuarto generate del dia devuelve limit_reached…` |

Repetí el rojo de los commits test del tramo del `implementer`. Para cada uno puse el caso de uso de ese commit contra el spec de HEAD (los verdes 6380af9c, 0f65a3bb y 19612305 solo tocan el caso de uso, y 6380af9c además el controller):
- 88cae663: 10 rojos (R13 b a e, R14 ×3, R15 ×2);
- a0dafe50: 4 rojos (R14 ×3 y R15 con propuesta);
- bd9caada: 1 rojo (R15 con propuesta).

El rojo era real en los tres.

Tras todo: `git diff --quiet HEAD` → 0 y `git diff --cached --quiet` → 0.

## Checklist C2 — Estado coherente
- [ ] Solo 1 feature in_progress: hay 0. #212 sigue en `spec_ready` en `feature_list.json` (menor 3, lo lleva el leader)
- [x] `progress/current.md` actualizado: el fallback al `implementer` está anotado en 5bc3efe0, por el leader

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `nutrition-ai-proposal.ts` solo importa `shiftDay` de `@/pipeline/local-day` (lo autoriza el handoff) y su vecino de dominio; los puertos y entidades solo importan tipos de dominio
- [x] Los repositorios y contratos de domain son interfaces puras: `NutritionWeightReader`, y `NutritionRepository` con `consumeAiGeneration`/`setAiResult`
- [x] application depende de interfaces: el caso de uso inyecta `NUTRITION_WEIGHT_READER`, `NUTRITION_REPOSITORY`, `NUTRITION_EXPLAINER`, `PET_REPOSITORY` y `SUBSCRIPTION_REPOSITORY`
- [x] infrastructure sin lógica de negocio: las cotas (R8, R9, R11) viven en `domain/nutrition-ai-proposal.ts`. El adaptador solo valida la forma con zod y el repositorio solo hace el upsert atómico

## Checklist C4 — TDD
- [x] Cada R1–R17 tiene al menos un test que lo nombra.
  - Todos los `describe` y `it` nuevos empiezan por `R<n>`. Los dos `it` de #18 en `nutrition.mapper.spec.ts` solo cambian su recuento (once a doce y trece a catorce claves).
  - R18 y R19 son docs con locks `grep -cF`: R18 da 0/1/0/1 y R19 da 1 en sus 9 líneas.
  - R20 es humano.
- [x] El historial va test primero: 18 commits `test(...)` preceden a su `feat(...)`. Los rojos con «stub» solo traen firmas o stubs, y 88cae663 vacía la fase de IA para que el rojo sea real.
- [x] El rojo del tramo del `implementer` lo repetí yo (sección de mutaciones).

## Checklist C5 — Trazabilidad
- [x] `traceability.md`: R1–R19 tienen hash, y todos existen en `git log 821ef76e..HEAD`. R20 dice «pendiente (humano)», como prescribe el handoff, y la cierra solo el humano al marcar su casilla.
- [x] Los commits siguen el formato `feat(nutrition-ai-structured-plan): <desc> (R-ids)`, `test(...)` y `docs(...)`.
- [x] Lista cerrada del handoff: todos los ficheros del diff están en ella.
  - Las únicas excepciones son `progress/current.md` y `progress/handoff_…`, y solo las tocan df62f4ee, ffc057d5 y 5bc3efe0, del leader.
  - Ningún fichero de la lista quedó sin tocar.

## Checklist C6 — Spec aprobada
- [x] `requirements.md`: `status: approved`, aprobación `[x]` (2026-10-26) y G2 `[x]` (2026-10-27). R20 está `- [ ]` sin marcar.

## Checklist C7 — Sin código huérfano
- [x] `setAiExplanation` en `src/` y `test/`: 0.
- [x] El puente `.plan` del controller ya no está: generate usa `toNutritionPlanGenerateResponse` (`nutrition.controller.ts:89`).
- [x] Los describes de #18 (R12, R14, R15 y R16 del spec del caso de uso, y R13 del spec del repositorio) se sustituyeron como dice la spec, sin tests huérfanos.

## Comprobaciones de la spec
- Migración 0022:
  - el SQL coincide con D7/D8 (`nutrition_ai_generations`, PK `(pet_id, local_day)`, `CHECK count > 0`, FK a `pets` con `ON DELETE cascade`, y `ai_proposal jsonb` NULL);
  - `0022_snapshot.prevId` es igual al id de 0021, y la tabla nueva es la única añadida;
  - `_journal.json` tiene idx 22 con el tag `0022_nutrition_ai_structured_plan`;
  - hay 23 .sql en la rama y 22 en origin/dev.
- `NUTRITION_AI_DAILY_LIMIT` = 3:
  - `nutrition-ai-proposal.ts:4`;
  - consumo atómico con `onConflictDoUpdate`, `setWhere count < limit`, comprobado con la mutación 4;
  - R14 lo asierta.
- System prompt G2: las 6 líneas del literal de `nutrition-prompt.spec.ts` (R4) salen tal cual en requirements.md (grep -cF = 1 en las 6). El test compara con un literal, no con el símbolo de producción.
- Día local del dueño: `ownerLocalDay(this.pets, petId, now)` se usa en el consumo y en `reviewDate` (`use-case.ts:119`, 124 y 139), comprobado con la mutación 1b.

## Conflictos con origin/dev
`git fetch -q origin && git merge-tree --write-tree --name-only HEAD origin/dev` (origin/dev = ca2d0abb): exit 0, árbol `435c79a2…`, sin conflictos.

## Lo que queda para el humano
- R20: la prueba de humo con clave real de `docs/verification.md` §Feature 212 (línea 1085). Al terminarla, el humano marca `- [ ] R20 prueba de humo con clave real ejecutada por humano (fecha: ____)` en requirements.md. Hasta entonces #212 no pasa a `done`.

## Output de ./init.sh
No ejecutado por el reviewer: el leader lo indicó así («NO ejecutes ./init.sh: el clasificador te lo deniega, y lo corre el leader después de tu veredicto»). La aprobación queda condicionada a que ese `init.sh` salga verde.

Hash revisado: 70971efd
