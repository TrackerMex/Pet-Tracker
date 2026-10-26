# Auditoría de firma delegada — #212 nutrition-ai-structured-plan

- Spec: `specs/nutrition-ai-structured-plan/` @ 3813739f (branch feature/212-nutrition-ai-structured-plan)
- Base: origin/main 1316410f
- Auditor: subagente de solo lectura (no firma; decide el leader)
- Estado: TERMINADO. 3 fallos bloqueantes, 10 avisos.
- Sin cambios en ficheros tracked. Los ficheros de prueba están en el scratchpad de la sesión
  (`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/`:
  `stub_naive.ts`, `stub_safe.ts`, `locks.ts`, `locks.out.ts`, `hash.mjs`).

## Resultados por punto

### 1. Anclas con su cifra — OK

- A1–A20, A22 y A23 coinciden con el árbol: todas dan 1, salvo A23, que da 0 como se espera.
- A21 da 2/2/2 en `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`,
  `test/nutrition.e2e-spec.ts` y `test/meal-times.e2e-spec.ts`. Es lo que declara la spec.
- El ancla de G2 da 1. El comentario viejo `Producto, 2026-08-18 (plan 009 §Paso 3)` está hoy en
  `nutrition-prompt.ts` (`grep -cF` = 1, así que el lock en 0 de tasks.md:184 muerde).
- Ninguna ancla depende de un número de línea. A10 dice «(en copyWithMealTimes)», que es una
  referencia descriptiva y no una posición.
- Ver aviso V10: los locks de código no declaran su directorio de trabajo.

### 2. Cada R-id con test nombrado y fila en traceability — OK

- R1–R17 tienen tests con nombre literal que empieza por `R<n>:` y fichero exacto.
- R18 y R19 se cierran con locks `grep -cF`, y R20 con la casilla humana (requirements.md:452).
- `traceability.md` tiene una fila para cada uno de R1–R20.

### 3. Candados no tautológicos — OK, con un aviso (V3)

- R4: el test compara contra el literal de §G2.1 escrito en el test.
- R10: `R10: la lista es exactamente la aprobada en G2` hace `toEqual` contra los 50 literales
  escritos en el test, y `detecta cada termino` recorre la copia del test, no la constante de producción.
- R6 compara contra el literal del esquema JSON.
- R3 fija los hashes con literales. Los recalculé con node replicando
  `src/modules/nutrition/application/nutrition-input-hash.ts`; los tres coinciden:
  ```
  $ node scratchpad/hash.mjs
  17    d04f38300d0fc38c7fd585e1cb683dde53518f8aa40df6e38c9048326e22a843   (= spec R3, hash de #17)
  empty 9ed1bbad1a21d53672c86756adde7048c2fa6e590005fd5fbd1483ee0eb1bc07   (= spec R3)
  two   3f2aeae30ab9b9722a9a54ed423654eb5f7d8c6651867b42f89c8be7eb2fb7f6   (= spec R3)
  ```
- Fechas de R11 y R14 comprobadas: 2026-12-28 + 7 = 2027-01-04; 2026-10-26 + 90 = 2027-01-24;
  2026-02-25 + 7 = 2026-03-04; 2026-10-25 + 30 = 2026-11-24; 05:30Z en America/Mexico_City cae el
  2026-10-25, y + 7 da 2026-11-01. Cruzan mes y año.
- Bordes de R9 comprobados: 300·10 % = 30, así que 270 y 330 se aceptan y 269 y 331 no; 305·10 % = 30,5,
  así que 275 y 335 se aceptan y 274 y 336 no.

### 4. Guards de la carta — No aplica

`grep -c mobile-pet-tracker` da 0 en requirements, design y tasks. requirements.md:16 dice
«Capa: solo backend», y §Fuera de alcance remite el móvil a #215 y #209.

### 5. Copy en Voz B — No aplica

No hay copy de UI. Los `warn` del backend van en inglés. El texto que verá el usuario lo escribe el
modelo bajo el system prompt de §G2.1, que es gate humano.

### 6. Ninguna decisión abierta salvo G2 — OK

`grep -i "TBD|por decidir|a decidir|pendiente de|abierta|TODO|elegir entre|o bien"` no saca ninguna
decisión abierta. Las únicas casillas son G2 (requirements.md:105), R20 (:452) y la aprobación general (:476).

### 7. Costo y dependencias — OK, con un aviso (V1)

- `@anthropic-ai/sdk` 0.128.0: la versión de `backend-pet-tracker/package.json` coincide con la de
  `node_modules/@anthropic-ai/sdk`, que apunta a `.pnpm/@anthropic-ai+sdk@0.128.0_zod@4.4.3`.
- Los tipos están en `messages.d.ts`: `output_config?: OutputConfig`, `OutputConfig.format?: JSONOutputFormat`
  (`{schema, type:'json_schema'}`) y `ThinkingConfigDisabled {type:'disabled'}`.
- design dice «Dependencias nuevas: ninguna», y es cierto.
- Modelo: `nutrition-explainer.factory.ts` lo lee de `ANTHROPIC_MODEL`, y `.env.example:108` tiene
  `ANTHROPIC_MODEL=claude-haiku-5-5`. Es el mismo modelo de #18 y el que D2 describe.
- D2, contrastado con la skill claude-api:
  - `thinking disabled` solo se admite con effort `high` o menor, y el default es `medium`. Correcto.
  - `budget_tokens` da 400. La spec no lo usa. Correcto.
  - Sampling: matiz de redacción en V1. La decisión de no enviarlos es correcta.
- D1 dice que el esquema del API no admite `minimum`, `maxItems`, `minLength` ni similares. La skill no
  da la lista de keywords, así que no lo pude verificar. El esquema de la spec no usa ninguno y las cotas
  viven en zod (§R7), de modo que la afirmación solo puede pecar de conservadora. No cambia nada.
- Coste: 0,10 y 0,50 USD por millón de tokens coincide con la skill. R20 hace tres llamadas facturadas,
  declaradas en docs §D3. La invalidación masiva de hashes está declarada en design §Consecuencias.

### 8. Migración declarada y regla de regeneración — OK, con avisos (V4, V5, V6, V7)

- design §Migración y coordinación declara una sola migración, generada en el verde de R12, que añade
  `ALTER TABLE "nutrition_plans" ADD COLUMN "ai_proposal" jsonb;` y `CREATE TABLE "nutrition_ai_generations"`,
  citada por nombre.
- El formato del ALTER coincide con las migraciones existentes:
  `grep -h "ADD COLUMN" src/db/migrations/*.sql` da `ALTER TABLE "nutrition_plans" ADD COLUMN "engine_meals_per_day" integer;`.
- La regla de regeneración equivale a la del plan §3: merge de origin/dev, borrar la migración propia,
  regenerar, nunca renumerar ni rebasear, y un commit `chore(...)` propio.
- Estado medido: origin/dev (a6bed881) llega hasta 0019. La branch de #211 tiene `0020_pet_invites.sql`
  y la de #210 no tiene ninguna 002x.

### 9. Ningún endpoint revela un recurso ajeno — OK

- No hay endpoints nuevos.
- `nutrition.controller.ts:41` tiene `@UseGuards(PetAccessGuard)` y `generate` lleva `@RequirePetRole('owner')`
  (:80–83).
- `listRecent(petId, 5)` filtra por `eq(weights.petId, petId)` sobre un petId ya autorizado. R2 lo prueba
  con un peso de la mascota B que no debe aparecer.
- `nutrition_ai_generations` no se expone. `aiStatus` solo describe la mascota propia.

### 10. Stubs de los commits rojos probados en seco — FALLO (F2)

tasks.md:25 prescribe «la firma exportada, devolviendo `null`, `[]`, `false` o el valor de antes», sin forma.
Probé dos versiones de los stubs de R10, R3, R2 y R12 con las firmas de design.md:91, :104, :120 y :125.

La forma literal (`stub_naive.ts`) no pasa:
```
$ pnpm exec eslint --stdin --stdin-filename src/audit/audit.module.ts < stub_naive.ts ; echo $?
  1:35  error  'text' is defined but never used                       @typescript-eslint/no-unused-vars
  5:51  error  '_weightTrend' is defined but never used               @typescript-eslint/no-unused-vars
 10:3   error  Async method 'listRecent' has no 'await' expression    @typescript-eslint/require-await
 14:3   error  Async method 'consumeAiGeneration' has no 'await' expression  @typescript-eslint/require-await
 ... (10 errors)
1
$ pnpm exec prettier --stdin-filepath src/x.ts < stub_naive.ts | diff -q - stub_naive.ts ; echo $?
1
```
- `eslint.config.mjs` no define `argsIgnorePattern`, así que el prefijo `_` no salva el parámetro.

La forma segura (`stub_safe.ts`) pasa: sin `async`, `void <param>;` por cada parámetro y `return Promise.resolve(<valor>);`.
```
eslint exit 0 ; prettier diff exit 0
```
- Aquí uso `Promise.resolve(<valor>)` y no `Promise.reject(new Error('Not implemented'))`. Esta spec depende
  de que los stubs devuelvan valores: R2 `sin pesos devuelve una lista vacia` nace verde con `[]`, y los
  puentes del caso de uso esperan `[]` y `false`. Un reject tumbaría esos its y la suite de cada commit.

El mismo riesgo afecta al stub de R7 («devuelve `null` con el warn en todos los casos»: si se quita el
`await` del SDK, `async explain` cae en `require-await`) y a los stubs de R3 y R5 (tercer parámetro ignorado).

- El quinto parámetro del constructor del stub de R13 no da error si es parameter property
  (`private readonly`), que es lo que exige la DI de Nest.
- La regla «Cada commit compila» (tasks.md:30) solo exige `tsc` y jest. `tsconfig.json` no tiene
  `noUnusedParameters`, no hay hooks (`.husky` no existe y `core.hooksPath` está vacío), y eslint solo
  corre en el cierre (tasks.md:421) y en CI.
- Por eso el efecto es una historia de commits con lint en rojo, no una cadena rota. Lo marco bloqueante
  porque el punto 10 de la checklist exige la forma que pasa. Si el leader solo exige lint en el último
  commit, se puede rebajar a aviso.

Los locks pasan por prettier:
- R1 `allergies: …default([]),`: prettier no lo cambia.
- R6 `thinking: { type: 'disabled' };` (interfaz) y `thinking: { type: 'disabled' },` (llamada): prettier no los cambia.
- R2 `imports: [...]`: prettier lo parte en 6 líneas. Es el FALLO F3.
- Las líneas `message: '…',` de los warn salen multilínea con coma final, porque el objeto supera 80 columnas.

### 11. Mensajes de commit en inglés — OK

docs/conventions.md:355 dice «Conventional commits, en inglés». Todos los commits de tasks.md están en inglés:
`test(…)`, `feat(…)`, `docs(…)` y el `chore(…)` de design.md:312.

### 12. Trazabilidad en un único commit final — FALLO (F1)

- `.claude/agents/leader.md:354-357`: «Rellenar specs/<feature>/traceability.md con los hashes en UN commit
  final `docs(<scope>): ...` tras el último verde. No mezclar ficheros de arnés en los commits TDD
  (#84 y #123: pedir «tras cada commit» chocaba con la lista cerrada de commits y nunca se cumplió)».
- La spec pide lo contrario en dos sitios:
  - tasks.md:37-38: «**Trazabilidad.** Tras cada commit verde se actualiza la fila del R en [[traceability]], con el test y el hash.»
  - traceability.md:35: «El implementer actualiza esta tabla tras cada commit».
- Ningún sitio prescribe el commit final `docs(...)`. El §Cierre de la cadena (tasks.md:412-432) no lo incluye.

### 13. Cuentas base + delta — OK

- Locks en 0, medidos sobre la base (todos dan 1 hoy, así que el 0 posterior muerde):
  - `'ai explanation unusable',` → 1
  - `if (latestPlan.aiExplanation !== null) return latestPlan;` → 1
  - `Producto, 2026-08-18 …` → 1
  - el literal viejo de brief.md → 1
  - el literal viejo de plans/009 → 1
- Locks en 1 o 2 sobre símbolos nuevos: base 0 más el delta declarado. `NUTRITION_AI_GRAMS_TOLERANCE_PERCENT`
  da 2 (declaración y uso).
- Recuento de claves:
  - `toNutritionPlanResponse` tiene hoy 11 claves (mapper.ts:70-82); con `aiProposal` son 12.
  - La vista de hoy añade 2 (`servedToday`, `kcalConsumedToday`): 13 hoy y 14 después.
  - generate llega a 13 con `aiStatus`.
  - Todo coincide con R16.
- Fixtures:
  - doble `projected` (use-case.spec.ts:31-36): `dailyGrams: 305` y `['08:00','14:00','22:00']`;
  - e2e (nutrition.e2e-spec.ts:316-318): `305` y `['07:30','19:30']`;
  - E2E_OUTPUT suma 150 + 160 = 310, dentro de ±10 % de 305.
- R12 y R16: 4 generates dan `proposed` ×3 y `limit_reached`, y 5 concurrentes dan 3 `true`. Coherente con N = 3.
- `docs/verification.md`: `## Notas para el implementer` existe una vez (:1083), así que el awk de §D3 tiene ancla.

### 14. Revert de la mutación — AVISO (V8)

- La mutación de R16 y R17 (tasks.md:309) es local, no se commitea y se anota en impl.md, así que no
  hay revert versionado.
- No se pide comprobar que el árbol queda limpio tras revertirla.

### 15. Contradicciones entre requirements, design y tasks — AVISOS (V7, V9)

Las dos contradicciones encontradas se tratan como avisos.

Verificado sin contradicción:
- Los 11 tests de #18 que design §Tests de #18 manda borrar o mover existen con ese nombre exacto y en
  el fichero indicado (`grep -rlF`).
- `ownerLocalDay`, `findOwnerTimezone`, `PetVaccineDrizzleReader`, `pet-vaccine-read.module.ts` e
  `isPetTracked` existen.
- `weights.measured_at` es `date` (string `YYYY-MM-DD`) y `weight_kg` es `numeric`. design.md:182 lo
  convierte con `Number`, así que R2 espera números.
- `users.timezone` vale `'UTC'` por defecto, lo que hace coherente el «día UTC» del e2e de R16 con el
  día local de R14.
- No hay `MockOf<T>` en nutrition.

### 16. Casilla G2 y bloqueo del handoff — OK

- requirements.md:105 tiene `- [ ] G2 aprobado por humano: system prompt y lista de tóxicos` y la frase
  «Sin esa casilla marcada no hay handoff».
- tasks.md:16-18 dice «La casilla G2 … y la aprobación general tienen que estar marcadas. Sin G2 no se
  toca `nutrition-prompt.ts` ni `nutrition-toxic-foods.ts`».

## Fallos bloqueantes

### F1 — La trazabilidad se rellena tras cada verde, no en un commit final (punto 12)

Corrección mínima:

- En `specs/nutrition-ai-structured-plan/tasks.md:37-38`, sustituir
  ```
  - **Trazabilidad.** Tras cada commit verde se actualiza la fila del R en
    [[traceability]], con el test y el hash. La cadena no se rebasea después.
  ```
  por
  ```
  - **Trazabilidad.** No se toca [[traceability]] durante la cadena. Tras el último
    commit de la cadena (incluido el `chore` de regeneración de [[design]] §Migración,
    si lo hay) se rellenan todas las filas, con el test y el hash del commit verde, en
    un único commit `docs(nutrition-ai-structured-plan): fill traceability`. La cadena no se rebasea después.
  ```
- En `traceability.md:35-36`, sustituir «El implementer actualiza esta tabla tras cada commit; el reviewer la valida»
  por «El implementer rellena esta tabla en un único commit final tras el último verde ([[tasks]] §Reglas); el reviewer la valida».
- En `tasks.md` §Cierre de la cadena, antes de la línea 432 (la de `progress/impl_…`), añadir
  `- [ ] Rellenar [[traceability]] en el commit `docs(nutrition-ai-structured-plan): fill traceability`.`

### F2 — Los stubs no tienen la forma que pasa eslint (punto 10)

Corrección mínima en `specs/nutrition-ai-structured-plan/tasks.md:25`. Sustituir
```
  - Si el símbolo aún no existe, el commit rojo puede llevar un **stub mínimo**: la firma exportada, devolviendo `null`, `[]`, `false` o el valor de antes.
```
por
```
  - Si el símbolo aún no existe, el commit rojo puede llevar un **stub mínimo**: la firma exportada, devolviendo `null`, `[]`, `false` o el valor de antes.
    Forma obligatoria, para que `pnpm exec eslint` pase en cada commit: el método o función **no** es `async`;
    cada parámetro que el stub no usa se consume con `void <param>;` (el prefijo `_` no basta: no hay
    `argsIgnorePattern`); si la firma devuelve una promesa, `return Promise.resolve(<valor>);`. Vale también
    para los parámetros nuevos que se ignoran (R3, R5) y para el adaptador de R7 si el stub quita el `await` del SDK.
```
Esta forma está probada en seco (`stub_safe.ts`): eslint sale con 0 y prettier no cambia nada.

### F3 — El lock de R2 no puede pasar tras el `prettier --write` obligatorio (puntos 1 y 10)

- tasks.md:34 obliga a correr `pnpm exec prettier --write <ficheros tocados>` antes de cada commit.
- La línea del lock de tasks.md:136 mide 86 columnas. Prettier (printWidth 80 por defecto, `.prettierrc`
  sin override) la parte en 6 líneas:
  ```
  $ pnpm exec prettier --stdin-filepath src/x.ts < locks.ts
    imports: [
      PetsModule,
      SubscriptionsModule,
      ConfigModule,
      NutritionWeightReadModule,
    ],
  $ grep -cF 'imports: [PetsModule, SubscriptionsModule, ConfigModule, NutritionWeightReadModule],' locks.out.ts
  0
  ```

Corrección mínima en `tasks.md:136`. Sustituir la línea por
```
  grep -cF '    NutritionWeightReadModule,' src/modules/nutrition/nutrition.module.ts  # 1
```
- Verificado contra la salida de prettier más la línea del import
  (`import { NutritionWeightReadModule } from '…';`, sin coma tras el nombre): da 1.
- Sin el módulo en `imports` da 0.

## Avisos

- **V1 (punto 7).** D2 (requirements.md:115) dice que Haiku 5.5 rechaza `temperature`, `top_p` y `top_k`
  con 400. Según la skill (model-migration.md:2292), Haiku 5.5 acepta `temperature: 1` y `top_p: 0.99`
  (los defaults) y da 400 con cualquier otro valor, con cualquier `top_k` y con `temperature` y `top_p`
  juntos. La decisión de omitirlos es correcta. Precisión sugerida: «que Haiku 5.5 rechaza con 400 salvo en su valor por defecto».
- **V2 (punto 1).** La lista de §G2.2 y el prompt de §G2.1 los aprueba el humano. Si G2 cambia algún
  término, el lock `'nuez moscada',` o `'raw dough'` (tasks.md:79-80) y los 50 literales del test de R10
  se tienen que enmendar en el mismo acto. Conviene decirlo junto a la casilla G2.
- **V3 (punto 3).** El it de R14 `lee cinco pesos y los pasa a la IA y al hash` compara el `inputsHash`
  del INSERT contra `nutritionInputHash(input, tendencia)` importado de producción, lo que es tautológico
  por sí solo. Lo mitiga que R3 fija el hash con literales. Para que R14 muerda por sí mismo, se puede
  fijar también ahí el literal de la tendencia del doble.
- **V4 (punto 8).** design.md:300-305: con #211 en dev, `git merge origin/dev` parará con conflictos en
  `meta/_journal.json` y `meta/0020_snapshot.json` (add/add). Los pasos no dicen cuándo se commitea el
  merge, y design.md:311 exige que la regeneración vaya en un commit propio. Sugerido: después del
  `git rm …`, añadir `git commit --no-edit` (cierra el merge) y luego `drizzle-kit generate` y el commit `chore(…)`.
- **V5 (punto 8).** Tras regenerar, la BD local del worktree (`pet_tracker_wt`) ya tiene aplicada la
  0020 propia con un `created_at` más reciente que la `0020_pet_invites` de #211. El migrador de
  drizzle-orm salta las migraciones con `folderMillis` menor o igual al último aplicado y reaplica la
  regenerada, que falla con «already exists». design.md:307 manda «volver a correr las suites unitaria y
  e2e», pero no resetear la BD local antes. Sugerido: añadir esa instrucción, o avisar al leader de que
  init.sh la necesitará.
- **V6 (punto 8).** El lock de R12 (tasks.md:169) comprueba que sigue el tag `0019_pet_documents_uploaded_at`,
  pero no que exista el tag nuevo. Añadir:
  `grep -cF '_nutrition_ai_structured_plan"' src/db/migrations/meta/_journal.json  # 1`.
- **V7 (puntos 8 y 15).** tasks.md:431 aplica §Migración «Si #210 o #211 se mergearon en `dev` durante la
  cadena», pero design.md:297-298 dice «antes que esta PR», que incluye antes de empezar. Sugerido en
  tasks.md:431: «Si `git ls-tree origin/dev backend-pet-tracker/src/db/migrations/` muestra una 0020 o
  posterior que esta branch no tiene, aplicar [[design]] §Migración antes de la PR».
- **V8 (punto 14).** La mutación local de tasks.md:309 no pide comprobar el revert. Añadir:
  «Revertir con `git checkout HEAD -- <fichero>`; `git diff --quiet -- src` sale con 0 antes del commit».
- **V9 (punto 15).** tasks.md:27-29 exige que en cada commit rojo falle al menos un it del R. El bloque
  R16/R17 e2e (tasks.md:308-310) es un commit `test(...)` cuyos its nacen todos verdes, y la prueba de
  que muerden es la mutación local. Es una excepción razonable, pero contradice la regla tal como está
  escrita y el reviewer puede leerla como incumplimiento de C4. Sugerido: añadir en tasks.md:29 «Excepción:
  el bloque R16/R17 (e2e), que nace verde y se prueba con la mutación local de ese bloque».
- **V10 (puntos 1 y 13).** Los locks de código (rutas `src/` y `test/`) no declaran su directorio de
  trabajo. Solo los de docs dicen «desde la raíz del repo» (tasks.md:326 y :395), y el lock global del
  cierre (tasks.md:427) va en un bloque aparte del `cd backend-pet-tracker`. Sugerido en §Reglas: «Los
  locks con rutas `src/` o `test/` se corren desde `backend-pet-tracker/`».
  Riesgo menor anexo: el e2e de R16 calcula `<hoy UTC + 30>` en el test, por separado del `now` del
  servidor, y puede fallar si la corrida cruza la medianoche UTC.

## Erratas aplicadas

Commit `99c70cc9` (`docs(spec): #212 apply signature audit errata`). Anclas por contenido.

- **F1.** tasks.md §Reglas, viñeta «**Trazabilidad.** No se toca [[traceability]] durante la cadena…» (texto literal
  de la corrección); traceability.md, frase «El implementer rellena esta tabla en un único commit final…»;
  tasks.md §Cierre, casilla «Rellenar [[traceability]] en el commit `docs(nutrition-ai-structured-plan): fill traceability`»,
  antes de la de `progress/impl_…`. `grep -c 'ras cada commit'` = 0 en los cuatro ficheros.
- **F2.** tasks.md §Reglas, tras «puede llevar un **stub mínimo**»: el párrafo «Forma obligatoria…» literal.
- **F3.** tasks.md §R2, lock sustituido por `grep -cF '    NutritionWeightReadModule,' …  # 1` (base medida 0, delta +1).
  design.md §Infraestructura sigue describiendo el array en una línea: es descripción, no lock.
- **V1.** requirements.md, fila D2: «que Haiku 5.5 rechaza con 400 salvo en su valor por defecto (`temperature: 1`,
  `top_p: 0.99`; `top_k` y `temperature` con `top_p` dan siempre 400)».
- **V2.** requirements.md §G2, párrafo nuevo tras «Sin esa casilla marcada no hay handoff.» (fuera de §G2.1 y §G2.2,
  que no se tocaron).
- **V3.** requirements.md, it `R14: lee cinco pesos y los pasa a la IA y al hash`: la tendencia del doble se fija en
  la lista de cinco puntos de R2 y el `inputsHash` en el literal
  `'236528deeb4b704b65e87114a81d4f8ebb26d8e0d92ef038ff34bb049fd3ad90'`. Calculado con una réplica de
  `nutrition-input-hash.ts` más `weightTrend` como última clave (scratchpad `hash14.mjs`), con el `input` de
  `generate-nutrition-plan.use-case.spec.ts` (`ageMonths: 36`, arrays vacíos). Control: la misma réplica da el
  literal de R3 `9ed1bbad…` con la entrada de `hash.mjs`.
- **V4 y V5.** design.md §Migración y coordinación con #210 y #211: el bloque de coordinación se sustituye por la
  receta común de 10 pasos (merge, `meta` de dev, `git rm`, diff en 0, `git commit --no-edit`, `drizzle-kit generate`,
  cuenta de tags = base de `origin/dev` + 1, `chore(…)`, recrear `pet_tracker_wt212`, suites). El primer bloque
  (generación inicial en R12) no cambia.
- **V6.** tasks.md §R12, lock nuevo `grep -cF '_nutrition_ai_structured_plan"' src/db/migrations/meta/_journal.json  # 1`
  (base medida 0, delta +1).
- **V7.** tasks.md §Cierre, la casilla de migración usa el disparador `git ls-tree origin/dev …`; design.md §Migración
  usa el mismo disparador.
- **V8.** tasks.md §R16 y R17 (e2e), viñeta «Revertir con `git checkout HEAD -- <fichero>`; `git diff --quiet -- src` sale con 0».
- **V9.** tasks.md §Reglas, «Its que nacen verdes»: «Excepción: el bloque R16/R17 (e2e)…».
- **V10.** tasks.md §Reglas, viñeta «**Directorio de los locks.**». Riesgo anexo: el e2e no controla el `now` del
  servidor (el controlador llama a `execute` sin `now`), así que va como «Riesgo conocido» en tasks.md §R16 y R17 (e2e).
