# Auditoría de firma delegada: #210 reminders-recurrence

- Worktree: /home/claude/sites/Pet-Tracker-wt-210 (feature/210-reminders-recurrence, de51d896).
- Base: origin/main 1316410f. `git diff --stat 1316410f origin/dev` da 0 líneas (el árbol de dev es idéntico).
  `git diff --stat 1316410f HEAD -- backend-pet-tracker mobile-pet-tracker` también da 0: la rama solo añade la spec.
- Auditor: subagente en solo lectura. No firma; decide el leader. Solo escribe este fichero, sin commitear.
  Los stubs de la prueba en seco están en el scratchpad,
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/stubs210/`.
- Checklist aplicada: `progress/plan_canvas-parity-2026-10-23.md` §4, más los dos puntos que añade
  `progress/plan_mejoras-producto-2026-10-26.md` §4 (la migración y cómo regenerarla; ningún endpoint revela
  existencia).

**Resumen: 5 fallos bloqueantes y 10 avisos.**

## Resultado por punto

### 1. Anclas con la cuenta esperada, sin números de línea: OK, con un aviso

Se corrieron tal cual desde la raíz del worktree, con `a(){ grep -cF -- "$3" "$4"; }`:

| Ancla | Esperado | Medido |
|---|---|---|
| A1–A11, A13–A23, A25, A26 | 1 | 1 (todas) |
| A12 (literal sin el escape de tabla) | 1 | 1 |
| A24 `"tag"` en `_journal.json` | 20 | 20 |
| A18 negativa: `export const EditReminderSchema` | 0 (hoy no se exporta) | 0 |

Enmiendas E1–E7 de tasks.md, medidas desde `backend-pet-tracker/`:

| Enmienda | Esperado/medido |
|---|---|
| E1 | 2/2 |
| E2a–e | 1/1 cada una |
| E3 | 1/1 |
| E4 `new Reminder({` en update | 2/2 |
| E4 en list | 1/1 |
| E4 en dispatch | 5/5 |
| E4 en notifier | 1/1 |
| E5 | 1/1 |
| E6 | 1/1 |
| E7 | 1/1 |

`new Reminder({` aparece además solo en `reminder.drizzle.repository.ts`, que es producción y queda cubierto por el stub de
C7. La lista de E4 está completa. Ninguna ancla depende de un número de línea.

- **AVISO 1.** A12 está escrita en la tabla como `Promise<string \| null>`, con el escape de pipe de Markdown. Copiada
  tal cual a `grep -cF 'findOwnerTimezone(petId: string): Promise<string \| null>;' …` da **0**. Quien la vuelva a medir
  a mano (Codex o el reviewer) verá un falso rojo.

### 2. Cada R-id tiene un test con nombre y una fila en traceability.md: OK

Los R1–R14 nombran su test como `fichero::nombre` en requirements.md. traceability.md tiene las 14 filas, todas en
«pendiente», como corresponde antes de implementar.

### 3. Candados no tautológicos: OK, con un aviso

Los candados usan literales: fechas ISO, `'Invalid recurrence'`, `stale_schedule`, la regex del nombre de la migración,
`kind: 'reminder'`, los códigos `23514`/`42703`, y `config.checks` de longitud `7`. Ningún test importa un símbolo de
producción como valor esperado.

- **AVISO 2.** La spec no obliga a que los límites de `every` (24/365/52/12/10) ni la lista de unidades vayan como
  literales en el test. Nada impide que Codex escriba `RECURRENCE_UNITS.map(...)` o importe una constante de límites
  en `recurrence.spec.ts` o en el e2e, y eso sería un candado tautológico. Corrección: añadir en tasks.md §R2 (1) y
  §R7 (1) la frase «Unidades y topes de `every` como literales en el test; prohibido importar `RECURRENCE_UNITS` o
  cualquier constante de límites de producción».

### 4. Guardas de la carta (solo si toca móvil): N/A

No se toca ningún fichero de `mobile-pet-tracker/`. A26 solo lee.

### 5. Copy literal en voz B: OK / N/A

No hay copy nuevo visible al usuario. `'Invalid recurrence'` sigue el inglés de los mensajes de API existentes.
El push reutiliza el cuerpo actual (`Recordatorio: …`).

### 6. Ninguna decisión abierta: OK

`grep -niE "TBD|por decidir|a decidir|pendiente de|\?\?|o bien"` sobre los tres md da 3 coincidencias, y ninguna es
una decisión abierta: design.md tiene dos usos del operador `??` en código, y tasks.md tiene «pendiente de medir»
(la regla del e2e que mide el leader). El riesgo del plan («La spec de #210 decide») queda cerrado en D10. Las dos desviaciones respecto al plan
§2 (columnas en vez de jsonb, avance en el notifier en vez de reschedule) están razonadas en D1 y D12, y respetan
las decisiones humanas del plan §1 (calendario + cada N h, `{unidad, cada}`, zona del owner, sin fin o hasta una fecha).

### 7. Ningún coste ni dependencia sin declarar: OK

`Intl`, `uuidv7` y `sql` de drizzle ya están en `backend-pet-tracker/package.json` o son del runtime. No hay paquetes
nuevos ni recursos AWS nuevos.

### 8. Migración declarada y cómo regenerarla: FALLO, con dos avisos

Está declarada: design.md §Migración y tasks.md §Migración dicen merge `origin/dev`, nunca rebase, y regenerar con
`db:generate --name reminders_recurrence`. Hay colisión segura en 0020: #211 ya tiene
`backend-pet-tracker/src/db/migrations/0020_pet_invites.sql` y `meta/0020_snapshot.json` en
/home/claude/sites/Pet-Tracker-wt-211 (HEAD 37f1821c), y la spec de #212 espera `0020_nutrition_ai_structured_plan.sql`.

**El fallo está en el paso 3**, que es el mismo en los dos ficheros:

- tasks.md: «Borrar el `.sql` `*_reminders_recurrence.sql` propio, su `meta/<NNNN>_snapshot.json` y su entrada del
  journal si sobrevivió.»
- design.md: «Borrar los tres artefactos propios: … su `meta/<NNNN>_snapshot.json` …»

En el caso de colisión, el paso 2 resuelve el conflicto de `meta/0020_snapshot.json` quedándose con `origin/dev`, así
que después del paso 2 ese fichero ya es el de #211. El paso 3 lo borra. Entonces `db:generate` parte del snapshot
0019, emite un 0021 que incluye también `CREATE TABLE "pet_invites"` y la cadena de snapshots de dev queda rota. La
comprobación del paso 4 («solo `ALTER TABLE "reminders"`») lo detectaría, pero la spec no dice cómo recuperarse.

#211 D17 tiene el mismo defecto; queda fuera del alcance de esta auditoría.

- **AVISO 3.** El procedimiento no cubre la base del worktree `pet_tracker_wt210` (localhost:5433), que ya habrá
  aplicado el 0020 propio. Después de regenerar, `db:migrate` falla con «column already exists» o se salta
  `pet_invites`, según el orden. Corrección: un paso 6 en las dos §Migración: «Recrear la base del worktree
  (`pet_tracker_wt210`) antes del siguiente `db:migrate`; nunca psql crudo sobre el journal».
- **AVISO 4.** `db:generate` carga `../.env` y aborta si falta `DATABASE_URL` (`drizzle.config.ts`). En wt-210 el
  fichero existe, pero la spec no lo menciona como requisito previo.

### 9. Ningún endpoint revela si existe un usuario o un recurso ajeno: OK

No hay endpoints nuevos. R14 fija el 404 opaco con cuerpos de recurrencia, para POST y PATCH, sobre una mascota o un
reminder ajenos. En el caso de uso, R3 (las reglas cruzadas) se evalúa después de la autorización. El 400 de zod se
produce antes de consultar la base, así que no depende de que el recurso exista.

### 10. Prueba en seco de los stubs de los commits rojos con eslint y prettier: FALLO

La configuración real es `eslint.config.mjs` con `recommendedTypeChecked` y sin `argsIgnorePattern`, así que
`no-unused-vars` aplica `args: 'after-used'`. `tsconfig.json` no tiene `noUnusedLocals`. La regla 6 de tasks.md exige
`eslint <ficheros del commit>` antes de cada commit, de modo que un stub que no pasa eslint bloquea el commit rojo.

Comandos: `pnpm exec eslint --stdin --stdin-filename src/audit/audit.module.ts < f` y
`pnpm exec prettier --stdin-filepath src/x.ts < f`, comparando la salida con la entrada.

| Stub | Forma | eslint (exit) | prettier |
|---|---|---|---|
| C3 `recurrence.ts`: `assertValidRecurrence(dueAt, recurrence, until, timeZone): void {}` y `nextOccurrence(reminder, now, timeZone) { return reminder.dueAt; }`, como prescribe tasks.md §R7 | la que pide tasks.md | **1**: 6 × `no-unused-vars` | 0, sin cambios |
| La misma con un `void <param>;` por parámetro | lint-safe | 0 | 0, sin cambios |
| C13 drizzle: `async advanceOccurrence(id, scheduleName, dueAt, newScheduleName): Promise<boolean> { return false; }` | la que pide tasks.md | **1**: `require-await` + 4 × `no-unused-vars` | 0, sin cambios |
| La misma sin `async`, con `void` ×4 y `return Promise.resolve(false);` | lint-safe | 0 | 0, sin cambios |
| C13 drizzle: `async markEnqueued(id, scheduleName, at)` sin usar `scheduleName` | — | 0 (`after-used`: `at` sí se usa) | 0 |
| C7/C17: `constructor(@Inject(PET_REPOSITORY) private readonly pets: PetRepository)` sin usar | — | 0 en reglas; solo `prettier/prettier`, que corrige el `prettier --write` de la regla 6 | cambia (pliega a una línea) |

tasks.md no da la forma lint-safe de los dos primeros stubs.

### 11. Mensajes de commit en inglés: FALLO, con un aviso

`docs/conventions.md` §Commits dice «Conventional commits, en inglés». Los 19 mensajes de tasks.md §Commits están en
español; por ejemplo, `test(reminders): #210 R1 columnas y CHECKs de recurrencia`. Se repite en traceability.md,
línea «Convención de commit».

- **AVISO 5.** La convención pone los R-ids como sufijo `(R<n>)`, y la tabla los pone en el asunto (`#210 R<n>`). Es
  un problema de forma, no bloqueante, y se puede mantener si es el uso del repo.

### 12. Trazabilidad rellenada en un solo commit final: FALLO

traceability.md dice «El implementer actualiza esta tabla tras cada commit». La plantilla de handoff
(`.claude/agents/leader.md` §Handoff a Codex CLI) exige: «Rellenar specs/<feature>/traceability.md con los hashes en
UN commit final `docs(<scope>): ...` tras el último verde. No mezclar ficheros de arnés en los commits TDD (#84 y #123:
pedir «tras cada commit» chocaba con la lista cerrada de commits y nunca se cumplió)». La tabla C1–C19 de tasks.md
tampoco tiene ese commit final.

### 13. Cuentas de la cadena (base + delta): OK, con un aviso

- e2e R1: 26 filas (1 + 5 + 5 + 10 + 4 + 1).
- Filas de aceptación: R2 10, R3 6, R6 8, R7 11, R8 9, R9 4, R10 4.
- 8 mutaciones en total.
- `config.checks` de longitud 7: hoy hay 4 `check(` en `reminders.schema.ts`, más 3 nuevos.
- Las cuentas de E4 se miden al cerrar C7.

Comprobado con un prototipo del algoritmo de design.md (node v20): las filas de R7 (11), R8 (9), R9 (4), R10 (4) y
R11 (3) dan los valores esperados, sin filas malas. Todas las rutas de issue de R2 coinciden con zod 4.4.3 instalado
(`recurrence.every` too_small/too_big/invalid_type, `recurrence.unit` invalid_union, `recurrence`
unrecognized_keys/invalid_type, `recurrenceUntil` custom). `{recurrence:null}` y `{recurrenceUntil:null}` pasan el
refine de `EditReminderSchema`.

- **AVISO 6.** La cuenta del journal no aparece en la cadena. A24 mide 20 entradas `"tag"` en la base; tras C2 deben
  ser 21, o 22 o más si dev ya trae las de #211/#212. Corrección: en tasks.md §R1 (2) añadir «tras `db:generate`,
  `grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json` = A24 + 1».

### 14. Mutación versionada definida como «fichero igual que en el commit X»: OK / N/A

No hay mutaciones versionadas. La regla 7 de tasks.md revierte cada mutación con `git checkout HEAD -- <fichero>` y
prohíbe commitearlas.

- **AVISO 7.** La fila `not.toHaveBeenCalledWith(failed…)` de E2 se declara «nace verde» en tasks.md §R13 (1) sin
  ninguna mutación que la ponga en rojo, y la regla 7 exige una para cada fila que nace verde. Corrección: añadir la
  mutación «el dispatcher llama a `markEnqueued` también para el reminder cuyo envío falló; la fila
  `not.toHaveBeenCalledWith(failed…)` pasa a rojo». Las mutaciones pasan a ser nueve, así que §Cierre debe decir «las
  nueve mutaciones (R3, R4, R6, R11, R13 ×4, R14)».

### 15. Contradicciones entre requirements.md, design.md y tasks.md, y tests existentes rotos: FALLO, con tres avisos

**Fallo: test existente con la lista exacta de columnas, fuera de E1–E7.** `src/db/schema/reminders.schema.spec.ts`,
`it('exporta reminders con las columnas, tipos y nulabilidad aprobados')`, asserta
`expect([...columns.keys()].sort()).toEqual([ 'id', …, 'created_by' ].sort())`: las 11 columnas exactas. C2 añade
cuatro columnas y lo rompe. requirements.md R1 solo exime `declara los CHECKs, FKs e indices exactos`, porque usa
`arrayContaining`, y tasks.md dice «Ninguna otra línea de tests existentes cambia».

Anclas medidas desde `backend-pet-tracker/`:

| Literal | Cuenta |
|---|---|
| `grep -cF "'created_by'," src/db/schema/reminders.schema.spec.ts` | 2 (línea del array y `column: 'created_by',` de la FK) |
| `grep -cF "expect([...columns.keys()].sort()).toEqual(" …` | 1 |
| `grep -cF "exporta reminders con las columnas, tipos y nulabilidad aprobados" …` | 1 |

Se comprobó que no hay más tests de forma exacta rotos:

- Los `toEqual([` del GET en `test/pet-reminders.e2e-spec.ts` («responde todos los status…» y «permite cualquier rol
  activo…») envuelven cada elemento en `expect.objectContaining`, así que aguantan los campos nuevos.
- `expect(after).toEqual(before)` compara filas de la base, que tienen las mismas columnas antes y después.
- El `MessageBody` de SQS en `reminders-dispatch.service.spec.ts` no cambia: ya lleva `kind: 'reminder'` y
  `scheduleName`.
- El `data` del push está cubierto por E1 y E5. `Object.keys` está cubierto por E3.

- **AVISO 8.** La extracción de `ownerTimeZone` a `owner-local-day.ts` (design.md) no está asignada a ningún commit.
  Su primer consumidor es C8, pero ni la tabla de commits ni §R4 (2) la nombran. Corrección: en la columna «Stubs» o
  en «verde» de C8, añadir «extrae `ownerTimeZone` a `owner-local-day.ts`, de forma que `localDayInZone` lo
  reutilice sin cambiar su comportamiento (los tests existentes de `owner-local-day` siguen verdes sin tocarlos)».
- **AVISO 9.** Que C8 ya llame a `assertValidRecurrence` en el create solo se deduce del «500» de la columna roja de
  C11. Corrección: decirlo en tasks.md §R4 (2): «C8 llama a `assertValidRecurrence` en el create; el mapeo de
  `InvalidRecurrenceError` a 400 llega en C12».
- **AVISO 10.** Los tests unitarios de R11 en `notifier-consumer.service.spec.ts` no dicen cómo construir un reminder
  en serie. `reminderRow()` no se puede cambiar, porque la lista de enmiendas es cerrada. Corrección: en tasks.md
  §R11 (1), «la fila de serie se construye con `new Reminder({ ...reminderRow().props, recurrence: {...},
  recurrenceUntil: …, recurrenceAnchorAt: … })` dentro del `it`, sin tocar `reminderRow()`». Antes de prescribirlo hay
  que comprobar contra el fichero el nombre real del accesor de props.

## Fallos bloqueantes

**F1 (punto 10). Los stubs de C3 y C13 no pasan eslint.**

- tasks.md §R7 (1): sustituir «`recurrence.ts` con `assertValidRecurrence` no-op y `nextOccurrence` devolviendo
  `reminder.dueAt`.» por:
  > `recurrence.ts` con `assertValidRecurrence` cuyo cuerpo es solo `void <param>;` por cada parámetro, y
  > `nextOccurrence` con `void now; void timeZone; return reminder.dueAt;`. Sin los `void`, eslint da 6 ×
  > `no-unused-vars` y la regla 6 bloquea el commit rojo.
- tasks.md §R13 (1): sustituir «`advanceOccurrence` de drizzle devolviendo `false` sin escribir» por:
  > `advanceOccurrence` de drizzle **sin** `async`, con cuerpo
  > `void id; void scheduleName; void dueAt; void newScheduleName; return Promise.resolve(false);`. La forma
  > `async … { return false; }` da `require-await` + 4 × `no-unused-vars`.

**F2 (punto 11). Los mensajes de commit están en español.**

En tasks.md §Commits, sustituir los 19 mensajes por estos:

| Commit | Mensaje |
|---|---|
| C1 | `test(reminders): #210 R1 recurrence columns and CHECKs` |
| C2 | `feat(reminders): #210 R1 recurrence columns, CHECKs and additive migration` |
| C3 | `test(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation` |
| C4 | `feat(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation` |
| C5 | `test(reminders): #210 R2 zod validation of recurrence` |
| C6 | `feat(reminders): #210 R2 zod validation of recurrence` |
| C7 | `test(reminders): #210 R4 POST persists the series` |
| C8 | `feat(reminders): #210 R4 POST persists the series` |
| C9 | `test(reminders): #210 R5 response shape with recurrence` |
| C10 | `feat(reminders): #210 R5 response shape with recurrence` |
| C11 | `test(reminders): #210 R3 R6 cross-field rules and series PATCH` |
| C12 | `feat(reminders): #210 R3 R6 cross-field rules and series PATCH` |
| C13 | `test(reminders): #210 R13 writes conditioned on schedule_name` |
| C14 | `feat(reminders): #210 R13 writes conditioned on schedule_name` |
| C15 | `test(reminders): #210 R12 kind in the reminder push data` |
| C16 | `feat(reminders): #210 R12 kind in the reminder push data` |
| C17 | `test(reminders): #210 R11 notifier advances the series` |
| C18 | `feat(reminders): #210 R11 notifier advances the series` |
| C19 | `test(reminders): #210 R14 opaque 404 with recurrence bodies` |

En traceability.md, la línea «Convención de commit» queda igual, pero con `<desc>` en inglés.

**F3 (punto 12). La trazabilidad se pide «tras cada commit».**

- traceability.md: sustituir «El implementer actualiza esta tabla tras cada commit; el reviewer la valida» por:
  > El implementer la rellena con los hashes en UN commit final `docs(reminders): #210 fill traceability` (C20), tras
  > el último verde y sin mezclarla con los commits TDD; el reviewer la valida
- tasks.md §Commits: añadir la fila
  `| C20 | docs(reminders): #210 fill traceability | — (solo specs/reminders-recurrence/traceability.md) | — |`.

**F4 (punto 8). El paso 3 de §Migración borra el snapshot de `origin/dev` cuando hay colisión.**

En tasks.md §Migración y design.md §Migración, sustituir el paso 3 por:
> 3. Borrar **solo** el `.sql` propio `*_reminders_recurrence.sql`. No se borra ningún `meta/<NNNN>_snapshot.json` ni
> ninguna entrada de `_journal.json`: tras el paso 2 son los de `origin/dev`. Antes del paso 4,
> `git diff --name-status origin/dev -- backend-pet-tracker/src/db/migrations | wc -l` debe dar `0`. Si da otra cosa,
> queda un artefacto propio: se restaura con `git checkout origin/dev -- <ruta>` o se borra si `origin/dev` no lo tiene.

**F5 (punto 15). Un test existente con la lista exacta de columnas se rompe en C2 y no está en la lista cerrada.**

- tasks.md, tabla de enmiendas: añadir la fila

  > | E8 | `src/db/schema/reminders.schema.spec.ts` | `'created_by',` (2): solo la aparición dentro del array de
  > `expect([...columns.keys()].sort()).toEqual(` (1), en el `it` `exporta reminders con las columnas, tipos y
  > nulabilidad aprobados` | el array gana `'recurrence_unit', 'recurrence_every', 'recurrence_until',
  > 'recurrence_anchor_at',` justo después de `'created_by',` | literal base 0 de `'recurrence_unit',` | C1 (rojo
  > por aserción, verde en C2) |

- requirements.md R1: tras «El `it` existente `declara los CHECKs, FKs e indices exactos` usa
  `expect.arrayContaining`: no se enmienda.», añadir:
  > El `it` existente `exporta reminders con las columnas, tipos y nulabilidad aprobados` compara la lista exacta de
  > columnas: se enmienda (E8 de [[tasks]]).
- tasks.md §R1 (1): añadir «y aplica E8» a la descripción de C1.

## Avisos

1. A12 tiene `\|` en la tabla y, copiada a grep, da 0. Añadir bajo la tabla de anclas: «A12: el `\|` es escape de
   tabla; el literal lleva `|`».
2. Los topes de `every` y la lista de unidades no se exigen como literales en los tests (punto 3).
3. La base `pet_tracker_wt210` queda desfasada después de regenerar la migración. Añadir un paso 6 para recrearla
   (punto 8).
4. `db:generate` necesita `../.env` con `DATABASE_URL`, y la spec no lo dice (punto 8).
5. Los R-ids van en el asunto (`#210 R<n>`) en vez del sufijo `(R<n>)` de conventions.md (punto 11).
6. La cuenta del journal tras C2 (A24 + 1) no aparece en la cadena (punto 13).
7. La fila `not.toHaveBeenCalledWith(failed…)` de E2 nace verde sin mutación. Añadir la novena mutación y actualizar
   §Cierre (punto 14).
8. La extracción de `ownerTimeZone` no tiene commit asignado (punto 15).
9. La llamada a `assertValidRecurrence` en el create de C8 solo está implícita (punto 15).
10. No se dice cómo se construye el reminder en serie de los tests unitarios de R11 sin tocar `reminderRow()` (punto 15).

## Erratas aplicadas

Commit `3a41b056` (`docs(spec): #210 apply signature audit errata`).

- **F1.** tasks.md §R7 (1): `assertValidRecurrence` con `void <param>;` por parámetro y `nextOccurrence` con
  `void now; void timeZone; return reminder.dueAt;`. tasks.md §R13 (1): `advanceOccurrence` sin `async`, con los cuatro
  `void` y `return Promise.resolve(false);`.
- **F2.** tasks.md §Commits: los 19 mensajes en inglés, tal cual la tabla de F2. tasks.md regla 1 y traceability.md
  «Convención de commit»: `<desc>` en inglés.
- **F3.** traceability.md: un commit final `docs(reminders): #210 fill traceability` (C20) en vez de «tras cada commit».
  tasks.md §Commits: fila C20. La cadena pasa a C1–C20.
- **F4.** Sustituido por la receta común de regeneración que dio el leader (10 pasos, compartida con #211 y #212), en
  tasks.md §Migración y design.md §Migración. El paso 3 borra solo el `.sql` propio con `git rm`, y el paso 2 deja
  `meta/` como en `origin/dev`. El paso 6 cita las cuatro `ADD COLUMN` y las tres `ADD CONSTRAINT` propias. El commit
  `chore(reminders): regenerate migration after merging dev` solo existe si hay colisión, fuera de C1–C20.
- **F5.** tasks.md: fila E8 en la tabla de enmiendas (la lista pasa a E1–E8 en el encabezado, la regla 8 y
  requirements.md, en la nota del prefijo); C1 «y aplica E8» en §R1 (1), más E8 en la columna de rojo de C1.
  requirements.md R1: la frase sobre el `it` `exporta reminders con las columnas, tipos y nulabilidad aprobados`.
  Base medida: `'created_by',` = 2, nombre del `it` = 1, `'recurrence_unit',` = 0.
- **Aviso 1.** requirements.md, bajo la tabla de anclas: «A12: el `\|` es escape de tabla; el literal lleva `|`».
  Literal con `|` medido: 1.
- **Aviso 3.** Paso 9 de la receta (DROP y CREATE de `pet_tracker_wt210`, luego `pnpm run db:migrate`).
- **Aviso 4.** design.md y tasks.md §Migración: requisito previo de `.env` con `DATABASE_URL` para la generación
  inicial; paso 6 de la receta para la regeneración.
- **Aviso 6.** tasks.md §R1 (2): `"tag"` en `_journal.json` = A24 + 1 (21 en la base; tras un merge, la cuenta de
  `origin/dev` + 1, paso 7).
- **Aviso 7.** tasks.md §R13 (1): novena mutación (el dispatcher llama a `markEnqueued` también para el envío fallido).
  §Cierre: «nueve mutaciones (R3, R4, R6, R11, R13 ×4, R14)».
- **Aviso 8.** tasks.md §R4 (2): C8 extrae `ownerTimeZone` a `owner-local-day.ts` sin cambiar `localDayInZone`; los
  tests existentes de `owner-local-day.spec.ts` no se tocan.
- **Aviso 9.** tasks.md §R4 (2): C8 llama a `assertValidRecurrence` en el create y el 400 llega en C12.
- **Aviso 10.** tasks.md §R11 (1), comprobado contra el código: `Reminder` no tiene accesor `props`. Su constructor hace
  `Object.assign(this, props)` y la clase `implements ReminderProps`, y `anchorAt`/`until` viven dentro de
  `recurrence` (`ReminderRecurrence`, design.md). La forma prescrita es
  `new Reminder({ ...reminderRow(), dueAt: <dueAt>, recurrence: { unit: 'day', every: 1, anchorAt: <dueAt>, until: … } })`.
  Las formas `reminderRow().props` y `recurrenceUntil`/`recurrenceAnchorAt` como campos sueltos del informe no
  compilarían. El fichero real está en `backend-pet-tracker/src/workers/notifier/`. `@typescript-eslint/no-misused-spread`
  no está en `recommendedTypeChecked` (8.65.0), así que el spread de la instancia pasa eslint.
- **No aplicados**, por instrucción del leader: el aviso 2 (literales de los topes de `every`) y el aviso 5 (R-ids en
  sufijo).
