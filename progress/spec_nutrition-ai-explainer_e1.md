# spec_author — Enmienda E1 de #18 nutrition-ai-explainer

- Base congelada: `c09ee51c` (branch `feature/18-nutrition-ai-explainer-claude`)
- Origen: `progress/review_nutrition-ai-explainer.md` ronda 1, F1–F5 y la tabla C
  de §Sondas. O1–O4 quedan fuera.
- Estado: **completa, pendiente de firma humana**. La casilla
  «Enmienda E1 aprobada por humano (fecha: )» de §Aprobación está sin marcar.
- No se ha hecho ningún commit. `progress/current.md` ya estaba modificado
  antes de esta sesión y no lo he tocado.

## Dónde está escrita

| Archivo | Qué cambia |
|---|---|
| `specs/nutrition-ai-explainer/requirements.md` | `## Enmienda E1 (2026-10-08)` (E1.0–E1.6 y §Cifras y alcance), entre la enmienda 2026-10-08 y «Overrides humanos vigentes»; casilla nueva en §Aprobación; frontmatter sin tocar (`status: approved`) |
| `specs/nutrition-ai-explainer/design.md` | nota «Enmienda E1.3» después de la viñeta «Import perezoso» de D5 |
| `specs/nutrition-ai-explainer/tasks.md` | `## Enmienda E1 — ronda 2` al final: commits E1-c1…E1-c12 con su gate y la tabla de sondas S-E1.* |
| `specs/nutrition-ai-explainer/traceability.md` | filas E1.1–E1.5, todas `pendiente`, y una nota bajo «Regla» |

Lo aprobado de R1–R19 no se ha reescrito. Los cambios a ese texto van como
overrides en E1.6: C-6, D5 de design, la lectura de R3.4, la condición IF de
R11 y los *Test* de R5 y R10.

## Decisiones tomadas

1. **Seam de producción en E1.3.** El constructor gana un cuarto parámetro,
   `loadSdk: AnthropicSdkLoader`, cuyo default es
   `async () => await import('@anthropic-ai/sdk')`. También se añaden
   `AnthropicClientOptions` y `AnthropicSdkLoader`, ambos exportados y
   estructurales. La conducta no cambia y el factory sigue igual. Lo validé en
   un spike: `tsc` da exit 0 contra el SDK 0.128.0 real, el adaptador sigue en
   25/25 y el factory en 18/18.
2. **`jest.mock` no sirve.** Con `module: nodenext`, el `import()` nativo da
   `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` en jest. Lo reproduje en un
   spike y queda como evidencia en E1.0.
3. **D-E1-a.** El factory pasa clave y modelo sin recortar, que es la lectura
   literal de `(model, key, null)`. Se fija con un `it` de valores con
   espacios. El humano puede derogarlo, pero eso sería un cambio de conducta
   fuera de E1.
   **Sustituida en la revisión 2:** el humano decidió recortar (véase
   §E1 revision 2).
4. **Seam primero (E1-c5), test después (E1-c6).** Sin el cuarto parámetro, el
   test no compila, y C4 prohíbe los rojos de compilación o `ReferenceError`.
   Queda declarado por escrito antes del handoff.
5. **Cada lock tiene su rojo versionado.** Es una mutación de producción del
   veredicto, conforme a C4, «Ningún commit rojo falla por una mutación del
   doble». Las demás ramas se acreditan con sondas, cada una con su recuento
   `Tests:` exacto sobre el archivo completo.
6. **E1.5, fila 2, con un tipo inventado (`'tipo-futuro'`).** R10 dice
   «cualquier otro tipo», y con un tipo inventado una lista negra de tipos
   conocidos no puede pasar. En el spike usé `tool_use`, y el resultado de
   A7/A8 no depende de ese nombre.
7. **La 4.ª fila de E1.4 es `undefined`.** La mutación del veredicto
   (`!= null`) la deja verde, así que su rojo se acredita con la sonda
   S-E1.4a (`!== null`).
8. **Los literales de los candados están escritos en el test.** Ejemplos:
   `timeout: 15000`, `maxRetries: 0`, `'modelo-de-prueba'`. Nunca se usan
   constantes importadas de producción, para que el candado no sea
   tautológico.
9. **Nombre del método.** Es `explain`, no `generate` como decía el encargo.
   La spec usa `explain()`.

## Anclas medidas en c09ee51c

Las 28 anclas E1-A1…E1-A28 de requirements §Enmienda E1 §Cifras y alcance se
ejecutaron literalmente desde la tabla con un script el 2026-10-08. Las 28
coinciden con la columna `c09ee51c`:

- A1 = 1, A2 = 0, A3 = 0, A4 = 0 y A5 = 0.
- A6 = 1, A7 = 1, A8 = 1 y A9 = 1.
- De A10 a A23, todas valen 0.
- A24 = 4.
- De A25 a A28, todas valen 0.

## Anclas que cambian tras E1 (antes → después)

| Ancla | Qué cuenta | Antes | Después |
|---|---|---|---|
| E1-A3 | `export type AnthropicSdkLoader` | 0 | 1 |
| E1-A4 | `export interface AnthropicClientOptions` | 0 | 1 |
| E1-A5 | `await this.loadSdk()` | 0 | 1 |
| E1-A10 | `constructorArgs(` | 0 | 4 (1 definición + 3 usos) |
| E1-A11 | `'%s y %s fallan: gana %s'` | 0 | 1 |
| E1-A12 | `pasa clave y modelo sin recortar (E1.1)` | 0 | 1 |
| E1-A14…A19 | cada una de las 6 etiquetas de fila nuevas de R10 | 0 | 1 |
| E1-A20 | `'tipo-futuro'` | 0 | 1 |
| E1-A21 | describe `E1.3:` | 0 | 1 |
| E1-A22 | `'sdk ausente'` | 0 | 2 |
| E1-A23 | `'opciones invalidas'` | 0 | 2 |
| E1-A24 | `new AnthropicNutritionExplainer(` en el spec del adaptador | 4 | 7 |

Estas anclas no se mueven: A1 = 1 (= A48), A2 = 0 (= A49), A6, A7, A8, A9,
A13 (= A52), A25 (diff neto del factory), A26 (`nutrition-scope.spec.ts`),
A27 y A28 (= A47).

Recuento de tests: el spec del factory pasa de 18 a 25 y el del adaptador de
25 a 34.

## Abierto / no cerrado

- Falta la **firma humana** de E1, que es una casilla propia en §Aprobación.
- Hay recuentos **derivados, no medidos**. El spike usó specs reducidos (8 y 10
  tests); las cuentas sobre el archivo completo las razoné fila a fila contra
  los fixtures de `c09ee51c`. Son estas:
  - los 3 rojos de E1-c1 y de S-E1.1a (el spike no tenía el anti-vacío de R3);
  - el rojo extra del `it` de texto de R9 en S-E1.3c;
  - la zona ciega *array-like* de E1.4.

  Si Codex mide otra cosa, tasks.md le indica que pare y no ajuste la tabla.
- La base de `tsc --noEmit` del backend completo no la medí. tasks.md manda
  medirla al arrancar y no añadir errores.
- Zonas ciegas declaradas y sin candado:
  - un 4.º argumento en el factory (lo vigilan las anclas E1-A9 y E1-A25);
  - un orden dependiente del valor (E1.2);
  - el cuerpo del cargador por defecto (lo vigilan R9 por texto y R19);
  - un rechazo que no sea `Error` en el camino perezoso;
  - un `content` *array-like*;
  - un filtro por prefijo `text…`.

## E1 revision 2

**Fecha:** 2026-10-08. **Base congelada:** `83bee22b`, que contiene
`progress/review_nutrition-ai-explainer_e1.md`. Sin commit. No se tocó
`backend-pet-tracker/` del worktree. Las medidas se hicieron en un worktree
temporal en `/tmp`, ya borrado (`git worktree list` lo confirma).

Archivos tocados: `specs/nutrition-ai-explainer/requirements.md` (solo la
sección E1), `tasks.md` (sección E1 reescrita), `traceability.md` (filas E1 y
nota) y `design.md` (nota de D-E1-a).

### Qué se cerró

| Punto | Cambio |
|---|---|
| N1 | Párrafo «Cómo copiar las anclas» al pie de la tabla de E1. Cubre E1-A25…A28, A35…A37 y la mutación de E1.8. Cada ancla se ejecutó como la copiará Codex, con el escape sustituido por la tubería. |
| N2 | E1.8 nuevo: fila R11 `['objeto', '[object Object]']`, que rechaza `{ message: 'no soy Error' }`. Su rojo es la mutación duck-typed, en E1-c16/E1-c17. La viñeta falsa de la zona ciega de E1.3 se reescribió. |
| N3 | E1.7 nuevo: fila `['sin stop_reason', …]` al final de `unusable`. Su rojo es quitar `?? null`, en E1-c14/E1-c15. |
| N4 | `'tipo-futuro'` pasa a `'texto-futuro'` en E1.5 y E1-A20. Sondas nuevas S-E1.5b (`startsWith`) y S-E1.5c (`includes`). Zona ciega de prefijo borrada. |
| N5 | Fila `'content array-like'` en E1.4. E1-c10 da 4 rojos. Sondas nuevas S-E1.4c (`Array.from`) y S-E1.4d (`Object.values`). Zona ciega borrada. |
| N6 | Una línea en E1.4: `content: [null]` queda fuera de alcance, sin candado. |
| N7 | En S-E1.3c, el `it` 2 cae por `toHaveLength(1)`. |
| N8 | Recuentos rehechos. Factory 18 → 25 y adaptador 25 → 37. 18 commits (E1-c1…E1-c18); cada candado nuevo lleva su par `test`/`fix` (C4). |
| D-E1-a | Decisión del humano: recortar. El factory pasa `model.trim()` y `key.trim()`. Se reescribió E1.1, con override de la fila positiva de R5 en E1.6. El rojo de E1-c3 es la producción de `c09ee51c`, y E1-c4 es el `feat`. |
| Nota 1 (Z7) | Sin caché del cliente (decisión del leader, YAGNI). El `it` 3 se renombra a `anti-vacio: el SDK cargado construye el cliente con clave y constantes`. |
| Nota 2 | Anclas E1-A34…A37 más una casilla en el checklist del reviewer (tasks.md §Cierre). En el HEAD final, A34 = A35 = A36 = 3 y A37 = 1. |

### Medido en esta revisión

**Spike del factory** sobre el archivo completo, etapa a etapa. Todos los
rojos son de aserción; no hubo ningún «suite failed to run» ni ningún
`ReferenceError`.

| Estado | `Tests:` | Rojos |
|---|---|---|
| E1-c1: intercambio `(key, model, null)` sobre `c09ee51c` | 2 failed, 16 passed, 18 total | los dos anti-vacíos, por `toEqual` |
| E1-c2 | 18 passed, 18 total | — |
| E1-c3: `it` recortado con producción sin recortar | 1 failed, 18 passed, 19 total | `pasa clave y modelo recortados (E1.1)` |
| E1-c4 (trim) | 19 passed, 19 total | — |
| E1-c5: `not-enabled` al final, sobre trim | 2 failed, 23 passed, 25 total | filas 4 y 5, por `toBe` |
| E1-c6 | 25 passed, 25 total | — |
| S-E1.1a `(model.trim() + 'x', key.trim(), null)` | 3 failed, 22 passed, 25 total | 2 anti-vacíos más el `it` de E1.1 |
| S-E1.1b `(model.trim(), key, null)` | 1 failed, 24 passed, 25 total | `it` de E1.1 |
| S-E1.1c `(model, key.trim(), null)` | 1 failed, 24 passed, 25 total | `it` de E1.1 |
| S-E1.2a / b / c | 1 failed, 24 passed, 25 total cada una | filas 1 / 4 / 6 |

**Estado final plantado** en el worktree temporal: producción con D-E1-a y
el seam de E1.3, más los specs escritos según la spec y pasados por prettier.

- Adaptador: `37 passed, 37 total`. Factory: `25 passed, 25 total`.
- Sondas del adaptador sobre ese estado:

| Sonda | `Tests:` |
|---|---|
| E1-c10 (`!= null`) | 4 failed, 33 passed, 37 total |
| S-E1.4a | 5 failed |
| S-E1.4b | 2 failed |
| S-E1.4c y S-E1.4d | 1 failed cada una; cae `content array-like` por `resolves.toBeNull()` |
| E1-c12 (sin filtro) | 2 failed |
| S-E1.5a, S-E1.5b y S-E1.5c | 1 failed cada una |
| E1-c14 | 1 failed: `sin stop_reason`, por `toEqual` |
| E1-c16 | 1 failed: `degrada objeto: [object Object]`, por `toEqual` |
| S-E1.3c | 4 failed, 33 passed: R9 por `toHaveLength`, `it` 1 por `toEqual`, `it` 2 por `toHaveLength` y `it` 3 |

  Todas coinciden con el veredicto del reviewer.

**Anclas.** Un script extrae cada fila E1-A1…E1-A37 del texto crudo de la
tabla, sustituye `\|` por `|` y ejecuta el comando con `bash -c` desde la raíz
del worktree.

- Base (wt-18 en `83bee22b`, mismo backend que `c09ee51c`): 37/37 coinciden
  con la columna `c09ee51c`.
- Estado final plantado: 37/37 coinciden con la columna «tras E1».

**Ancla negativa de la nota 2.** Sobre el estado final se quitó el cuarto
argumento de una construcción, y también se cambió por `undefined`. En los dos
casos dio A35 = 3 y A36 = 2, así que el ancla lo detecta.

### Derivado, no medido

- Gates intermedios del adaptador: E1-c7 en 25, E1-c8 en 28, E1-c10 en 33,
  E1-c12 en 35, E1-c14 en 36 y E1-c16 en 37. Salen de las medidas sobre 37
  restando las filas que aún no existen en cada commit. Todos los rojos caen
  en filas del propio commit.
- S-E1.3a, S-E1.3b y el rojo de E1-c8 sobre 37 los midió el reviewer; yo no
  los repetí.

### Observación (no se cambia)

La aserción 13 de R1 (`/new AnthropicNutritionExplainer\([^)]*\bnull\s*\)/`)
es ciega a la forma de prettier `null,` + salto + `)`. Lo medí: 0
coincidencias en el estado final mutado. E1-A35…A37 cubren ese hueco en el
único spec que construye el adaptador.

### Abierto

- La **firma humana** de E1, en su casilla propia de §Aprobación.
- La base de `tsc --noEmit` del backend completo sigue sin medirse. tasks.md
  manda medirla al arrancar.
- Siguen declaradas dos zonas ciegas, sin candado:
  - el orden dependiente del valor (E1.2);
  - el cuerpo del cargador por defecto, vigilado por el texto de R9 y por R19.

  Las zonas del 4.º argumento del factory (E1-A29/E1-A25), el *array-like*,
  el prefijo `text…` y el rechazo no-`Error` quedaron cerradas.

## E1 revisión 3 (leader, 2026-10-08)

El leader aplica directamente los cambios R2-1…R2-4 de la revisión 2 del
reviewer (`progress/review_nutrition-ai-explainer_e1.md` §Revisión 2):

| Cambio | Dónde | Qué |
|---|---|---|
| R2-1 | requirements.md §E1.1 punto 3 y tabla de rojos; tasks.md §Sondas; traceability.md fila E1.1 | Valores `'\t clave-de-prueba \n'` y `'\t modelo-de-prueba \n'`. Sondas nuevas S-E1.1d (solo espacios, escrita como `.replace(/^ +/, '').replace(/ +$/, '')` para no meter `\|` en la tabla; mismo resultado que la forma del reviewer) y S-E1.1e (`.replace(/\n+$/, '')`), 1/24/25 cada una según la medición del reviewer. Las cifras de E1-c1…E1-c6 no cambian |
| R2-2 | requirements.md §E1.1 | Zona ciega declarada del recorte: `x.replace(/\s/g, '')` |
| R2-3 | requirements.md tabla de anclas y nota «Cómo copiar las anclas» | E1-A25 pasa a `grep -cvE '^(diff \|index \|--- \|\+\+\+ \|@@ )'`; valores 0 y 2 sin cambio |
| R2-4 | requirements.md tabla de anclas, nota 2 y §E1.3; tasks.md E1-c18 y checklist | Ancla nueva E1-A38 (`'clave-de-prueba',{`), 4 y 4 |

Medido en wt-18 (backend igual a `c09ee51c`), copiando cada fila del texto
crudo y sustituyendo `\|` por `|`: E1-A25 = 0, E1-A38 = 4, E1-A24 = 4,
E1-A36 = 0, todas iguales a la columna «base». Copiadas sin sustituir:
E1-A25 no imprime nada en la base (rc=0) y E1-A38 sale con rc=1
(`tr: extra operand`).
