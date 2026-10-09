# review: nutrition-ai-explainer, enmienda E1 (revisión previa a la firma)
Fecha: 2026-10-08
HEAD revisado: 4296e44e (`feature/18-nutrition-ai-explainer-claude`, worktree wt-18)
Veredicto: **NECESITA CAMBIOS**

No es un veredicto de código. Reviso la enmienda E1 antes de la firma humana
para que la ronda 2 de Codex sea la última. Todo lo de abajo se midió en un
worktree temporal (`/tmp/rev18-e1`, detached en 4296e44e, `node_modules`
enlazado al de wt-18), con el seam E1.3 y los tests prescritos aplicados. El
worktree ya está eliminado. No se tocó `specs/` ni `backend-pet-tracker/` en
wt-18. No se corrió `init.sh` ni e2e, solo jest unitario dirigido.

Resumen: los 9 supervivientes de la tabla C de la ronda 1 caen en rojo con los
candados prescritos, y todos los recuentos declarados coinciden con lo medido.
Quedan cuatro supervivientes no declarados. Cada uno se cierra con una fila de
test. También hay un fallo de anclas (E1-A28 copiada literal es ciega), una
premisa falsa en E1.3 y una errata en la tabla de S-E1.3c.

---

## 1. Cambios que la enmienda debe hacer antes de la firma

**N1. Las anclas E1-A25…E1-A28 no están cubiertas por la convención de `\|`.**
La nota de requirements.md (párrafo «En la tabla, `\|` es el escape…», junto a
la abreviatura `NUT=`) solo enumera A12, A14, A47 y A53. Si se copian literales
de la tabla de E1:
- E1-A25 y E1-A26 no imprimen nada, cuando se esperaba `0`.
- E1-A27 sale con rc=2.
- E1-A28 está **ciega**. Dentro de la regex `-E`, `\|` es una tubería literal y
  no una alternancia. Con dos positivos plantados midió `0`.

Con `\|` sustituido por `|`, E1-A28 midió `2` y E1-A27 midió `1` con los mismos
positivos plantados (ya borrados).

Arreglo: añadir E1-A25…E1-A28 a la enumeración de esa nota, o poner una frase
equivalente al pie de la tabla de anclas de E1. Si no, el handoff a Codex
heredará anclas sin grep ejecutable.

**N2. R11, rama «`String(valor)` en otro caso»: la premisa de E1.3 es falsa.**
La zona ciega de E1.3 dice: «El formato `String(valor)` vive en el `catch`
compartido, que R11 ya cubre con su fila `'string'`». Medido: la mutación
duck-typed sobrevive con el spec final prescrito (34/34 verdes):
```ts
message: (error as { message?: string } | null)?.message ?? String(error),
```
La fila `'string'` solo cubre la rama en que el valor no tiene `.message`.
Arreglo: añadir a la tabla de R11 la fila
`['objeto', '[object Object]']`, cuyo valor rechazado es `{ message: 'no soy Error' }`.
- Producción: verde.
- Mutación duck-typed: 1 rojo, por `toEqual` del warn.

Después, corregir o borrar esa viñeta de la zona ciega.

**N3. R10, `stopReason: response.stop_reason ?? null`: el `?? null` no tiene candado.**
Ninguna fila de `unusable` omite `stop_reason`, así que
`stopReason: response.stop_reason` (sin `?? null`) sobrevive al spec final.
`usage ?? null` sí tiene candado, por la fila `content null sin usage`.
Arreglo: añadir la fila
`['sin stop_reason', { content: [{ type: 'text', text: 'Tu perro necesita...' }], usage }]`.
- Producción: verde.
- Mutación: 1 rojo, por `toEqual` (`undefined` frente a `null`).

**N4. E1.5, filtro por subcadena: `includes('text')` no está declarado y sobrevive.**
La zona ciega solo nombra `startsWith('text')`. `block.type.includes('text')`
también pasa las 34. Arreglo de coste cero: renombrar en la fila 2 de E1.5
`type: 'tipo-futuro'` a `type: 'texto-futuro'`.
- Mata `startsWith` (1 rojo) e `includes` (1 rojo).
- Sigue matando la lista negra de S-E1.5a y el borrado del filtro de E1-c10.
- No añade tests. Ajusta E1-A20 (`'tipo-futuro'` pasa a `'texto-futuro'`).
- La zona ciega de prefijo puede borrarse.

**N5. E1.4, *array-like*: la zona ciega dice «se razonó, no se midió».**
Medido: sobreviven a las cuatro filas tanto `Array.from((response.content ?? []) as ArrayLike<…>)`
como `Object.values((response.content ?? {}) as Record<…>)`, y esta última no
está nombrada. Una fila las mata a las dos:
`['content array-like', { stop_reason: 'end_turn', content: { 0: { type: 'text', text: 'Tu perro necesita...' }, length: 1 }, usage }]`
(producción verde; 1 rojo con cada mutación).
Arreglo: añadir la fila y borrar la zona ciega. Como mínimo, si el humano
prefiere no añadirla, la zona debe nombrar también `Object.values` y decir que
se midió.

**N6. Declarar el caso `content: [null]`.**
Producción recorre el array sin proteger los elementos. `block.type` sobre
`null` lanza, y el warn sale con la forma de R11
(`{scope, petId, planId, message}`) en vez de la de R10, que dice «no trae
ningún bloque text». Medido con la fila
`['elemento null', { stop_reason: 'end_turn', content: [null], usage }]`:
1 failed / 35, por el `toEqual` del warn de R10. Devuelve `null` igualmente, así
que no rompe la degradación. Arreglo: una línea en la enmienda que lo declare
fuera de alcance o zona ciega. El SDK no produce esa forma. Se pide declararlo,
no candarlo.

**N7. Errata en la tabla de S-E1.3c, columna «tipo de rojo».**
La enmienda dice «1 y 2: `toEqual` del `message`». Medido: el `it` 1 cae por
`toEqual` del message (llega `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`).
El `it` 2 («el constructor del SDK lanza») cae **antes**, por
`toHaveLength(1)` del array de opciones registradas, porque el constructor
falso nunca se invoca. El recuento no cambia. Solo cambia el texto.

**N8. Recontar si se adoptan N2–N5.**
Con las tres filas nuevas (N2, N3, N5), el adaptador pasa de 34 a 37 tests. N4
no añade tests. Valores medidos con el spec de 37 sobre cada mutación
prescrita:

| Mutación | Con el spec E1 (34) | Con las filas extra (37) |
|---|---|---|
| E1-c6 (bloque encima del `try`) | 2 failed, 32 passed, 34 total | 2 failed, 35 passed, 37 total |
| S-E1.3a | 1 failed, 33 passed | 1 failed, 36 passed |
| S-E1.3b | 1 failed, 33 passed | 1 failed, 36 passed |
| S-E1.3c | 4 failed, 30 passed | 4 failed, 33 passed |
| E1-c8 (`!= null`) | 3 failed (string, objeto, numero) | **4 failed** (+ array-like) |
| S-E1.4a (`!== null`) | 4 failed | **5 failed** (+ array-like) |
| S-E1.4b (`typeof object`) | 1 failed (objeto) | **2 failed** (+ array-like) |
| E1-c10 (sin filtro) | 2 failed | 2 failed |
| S-E1.5a (lista negra) | 1 failed | 1 failed |

Los gates intermedios dependen del commit en que entre cada fila. Ejemplo: si
array-like entra en E1-c8, su gate rojo pasa a `4 failed, 29 passed, 33 total`.

Las filas de N2 y N3 son candados nuevos con su propio rojo de producción:
- N3: quitar `?? null`.
- N2: la variante duck-typed.

Según C4 necesitan un par `test(...)`/`fix(...)` propio, o entrar en un par
existente con su mutación versionada. Que lo fije el spec_author. Hay que
actualizar `Tests:` de E1-c8…E1-c11, la tabla de sondas, el total final y las
anclas que cuenten filas.

---

## 2. Recuentos derivados: medido frente a declarado

Todos medidos sobre los ficheros completos, con `pnpm exec jest <spec>`. Ningún
rojo es de compilación ni `ReferenceError`. Todos vienen de una aserción.

### Factory spec (`nutrition-explainer.factory.spec.ts`)
| Punto | Declarado | Medido | Rojos medidos |
|---|---|---|---|
| Base c09ee51c | 18 | 18 | — |
| Final E1 | 25 passed, 25 total | 25 passed, 25 total, exit 0 | — |
| E1-c1 (intercambio de argumentos) | 3 failed, 16 passed, 19 total | 3 failed / 25 en el fichero final; los 3 rojos están en tests de E1-c1, así que en E1-c1 da 3/16/19 (derivado) | los dos anti-vacíos + `pasa clave y modelo sin recortar (E1.1)` |
| E1-c3 (`not-enabled` al final) | 2 failed, 23 passed, 25 total | 2 failed, 23 passed, 25 total | filas 4 y 5 del `it.each` por parejas |
| S-E1.1a | 3 failed, 22 passed, 25 total | igual | los mismos 3 de E1-c1 |
| S-E1.1b | 1 failed, 24 passed, 25 total | igual | `pasa clave y modelo sin recortar (E1.1)` |
| S-E1.2a | 1 failed, 24 passed, 25 total | igual | fila 1 (gana node-env-test) |
| S-E1.2b | 1 failed, 24 passed, 25 total | igual | fila 4 (gana not-enabled) |
| S-E1.2c | 1 failed, 24 passed, 25 total | igual | fila 6 (gana key-missing) |

Sondas extra (no declaradas, solo para confirmar el ancho del candado):
- `node-env-test` al final: 4 failed.
- Factory con cliente no-`null`: 3 failed.

### Adaptador (`anthropic-nutrition-explainer.spec.ts`)
| Punto | Declarado | Medido | Rojos medidos |
|---|---|---|---|
| Base c09ee51c | 25 | 25 | — |
| E1-c5 (solo seam, spec original) | 25 passed, 25 total | 25 passed, 25 total | — |
| Final E1 | 34 passed, 34 total | 34 passed, 34 total, exit 0 | — |
| E1-c6 | 2 failed, 26 passed, 28 total | 2 failed / 34 en el final; los rojos son de E1-c6, así que da 2/26/28 (derivado) | `it` 1 e `it` 2, por `resolves.toBeNull()` |
| S-E1.3a | 1 failed, 33 passed, 34 total | igual | `it` 1, por `toHaveBeenCalledTimes` |
| S-E1.3b | 1 failed, 33 passed, 34 total | igual | `it` 2, por `toHaveBeenCalledTimes` |
| S-E1.3c (con `ANTHROPIC_BASE_URL=http://127.0.0.1:9`) | 4 rojos: `it` 1, 2 y 3 + texto de R9 | 4 failed, 30 passed, 34 total | R9 por `toHaveLength(2)` (recibe 3); `it` 1 por `toEqual` del message; `it` 2 por `toHaveLength` (ver N7); `it` 3 por `resolves.toBe` |
| E1-c8 | 3 failed, 29 passed, 32 total | 3 failed / 34; derivado 3/29/32 | string, objeto, numero |
| S-E1.4a | 4 rojos (las 4 filas E1.4) | 4 failed | las 4 filas |
| S-E1.4b | 1 rojo | 1 failed | objeto |
| E1-c10 | 2 failed, 32 passed, 34 total | igual | las dos filas E1.5 |
| S-E1.5a | 1 rojo | 1 failed | `solo bloque no-text con text` |

### tsc / eslint en el estado final con seam
- `pnpm exec tsc --noEmit -p tsconfig.json`: exit 0, con 0 `error TS`.
- `pnpm exec eslint` sobre `anthropic-nutrition-explainer.ts`: exit 0.

### Anclas E1-A1…E1-A28
Las 28 coinciden con lo declarado (base en wt-18, cuyo backend es idéntico a
c09ee51c; final en `/tmp/rev18-e1`). La única condición es que E1-A25…E1-A28 se
ejecuten con `\|` sustituido por `|` (ver N1).

---

## 3. Barrido de cláusulas universales (R1–R18)

Supervivientes medidos con el spec final prescrito (34/34 verdes):

| Id | Mutación | Cláusula | Estado en la enmienda | Arreglo |
|---|---|---|---|---|
| Z1 | `Array.from((content ?? []) as ArrayLike)` | R10, «todos los bloques» de un array | declarado, sin medir | N5: fila array-like |
| Z2 | `Object.values((content ?? {}) as Record)` | ídem | **no declarado** | N5: la misma fila |
| Z3 | `type.startsWith('text')` | R10, «bloques `text`» | declarado | N4: `'texto-futuro'` |
| Z4 | `type.includes('text')` | ídem | **no declarado** | N4: la misma fila |
| Z5 | `stopReason: response.stop_reason` (sin `?? null`) | R10, warn **exactamente** `… ?? null` | **no declarado** | N3 |
| Z6 | message duck-typed | R11, «`String(valor)` en otro caso» | declarado como cubierto (falso) | N2 |
| Z7 | sin caché (`this.client = null` tras `create`) | ninguna: R9 no exige reutilizar el cliente | — | nota 1 |

Con el spec de 37 (las tres filas nuevas más el renombrado), cada una de Z1…Z6
da exactamente 1 rojo, y producción queda en 37/37 verde.

Otras cláusulas revisadas sin hallazgo:
- **R3 y R5.** El orden de las guardas tiene candado por parejas (E1.2). Las
  sondas extra lo confirman: con `node-env-test` al final hay 4 rojos, y con el
  cliente no-`null` hay 3.
- **R8.** El ítem de 500 caracteres tiene candado a exactamente 100 con
  `toBe('x'.repeat(100))`, y la lista a los 20 primeros con
  `toEqual(items.slice(0, 20))`. Ni `slice(0, 99)` ni un recorte por el final
  sobreviven.
- **R9.** El texto del import aparece una vez, con `toHaveLength(2)` sobre el
  `split`. S-E1.3c lo confirma.
- **R15.** El use-case spec comprueba que no se llama a `explain` ni a
  `setAiExplanation` en las ramas que lo prohíben.

R1, R2, R4, R6, R7, R12–R14 y R16–R18 no se reabrieron en esta pasada. E1 no
toca su código (E1-A25 y E1-A26 dan diff 0) y la ronda 1 ya los cubrió.

---

## 4. C4 y proceso

- **E1-c5 (seam antes del test) cabe en C4.** Es un `refactor(...)` sin cambio
  de comportamiento: el spec original queda en 25/25. Está declarado por
  escrito antes del handoff. Ponerlo detrás de un test rojo haría que ese rojo
  fuera de compilación (el cuarto parámetro no existe), y C4 lo prohíbe. El
  comportamiento del seam queda con candado después, por la mutación de
  producción de E1-c6 (el bloque encima del `try`), con rojos de aserción.
- **Todos los rojos son de aserción.** Ninguno es «Test suite failed to run»,
  ni de compilación, ni `ReferenceError`. El runner lo comprueba en cada sonda.
- **Todos los rojos son mutaciones de producción.** Ninguno muta un doble. Los
  `fix(...)` restauran desde el hash de E1-c5 y tienen precedente en main.
- **Nota 1 (Z7, no bloqueante).** El nombre del `it` 3 dice «construye el
  cliente una vez», pero sin caché sigue verde, porque solo llama a `explain()`
  una vez. Si el humano quiere que «una vez» signifique reutilizar el cliente,
  hace falta un segundo `explain()` y `toHaveBeenCalledTimes(1)`. Si no, conviene
  renombrar el `it` para que no prometa lo que no comprueba.
- **Nota 2 (no bloqueante).** La relectura de la aserción 13 de R3.4 que hace
  E1.6 deja pasar `new AnthropicNutritionExplainer(m, k, null, undefined)`, y con
  eso correría el cargador real por defecto. Sugerencia: un ancla `grep -cF` o un
  punto del checklist del reviewer que exija que el cuarto argumento sea siempre
  un cargador de test en los specs que construyen el adaptador con cliente
  `null`.

---

## 5. D-E1-a (clave y modelo sin recortar con candado): opinión técnica

Fijar con candado los valores sin recortar consagra una asimetría: el factory
valida con `trim()`, pero reenvía el valor crudo.
- **Clave.** Es inocua en la práctica. Medido: `Headers` de fetch en Node
  recorta los espacios de los extremos (`'  sk-abc \n'` pasa a `"sk-abc"`), así
  que la cabecera `x-api-key` llega limpia.
- **Modelo.** No es inocuo. Va crudo en el cuerpo JSON, que nadie normaliza.
  dotenv solo recorta los valores **sin comillas**. Un
  `ANTHROPIC_MODEL="  claude-haiku-5-5  "` entre comillas, o un valor inyectado
  por compose/ECS o Secrets Manager con un espacio o salto de línea final, pasa
  la guarda `trim() !== ''` y llega mal a la API. Entonces cada llamada degrada
  a `null` más un warn tipo 404/`not_found` de modelo. Es seguro, porque R11
  nunca hace 5xx, pero confunde en la prueba de humo de R19: la configuración
  «parece» válida y el factory no avisó.

Técnicamente es mejor recortar, como en S-E1.1b (`(model.trim(), key.trim(), null)`),
y que esos valores pasen a ser los esperados del `it` E1.1. Es un cambio de
comportamiento pequeño y fuera del alcance original de E1. La alternativa
igual de defendible es mantener los valores sin recortar y registrar la
asimetría del modelo como deuda conocida en la enmienda. Decide el humano. Las
dos opciones son coherentes con los recuentos de arriba: con recorte, S-E1.1b
deja de ser sonda y se vuelve el comportamiento esperado, así que hay que
reformular esa sonda.

---

## Checklist de la revisión previa
- [x] Los 9 supervivientes de la tabla C caen en rojo con los candados prescritos.
- [x] Recuentos derivados: medido = declarado en todos los puntos (§2).
- [ ] Cada candado ensanchado a su cláusula entera: quedan Z2, Z4, Z5 y Z6 sin
  declarar (N2–N5).
- [x] C4: E1-c5 cabe; rojos de aserción; mutaciones de producción.
- [ ] Anclas E1-A1…E1-A28 ejecutables tal como están escritas: E1-A25…E1-A28 no
  lo son (N1).
- [x] Worktree temporal eliminado; wt-18 sin cambios salvo este informe; sin
  commit.

## Revisión 2

Fecha: 2026-10-08
Base: HEAD `2a727b94` en wt-18 (`feature/18-nutrition-ai-explainer-claude`),
delta revisado `git diff 83bee22b 2a727b94 -- specs/`.
Veredicto: **NECESITA CAMBIOS** (un bloqueante, R2-1, y dos cambios de ancla
o de texto, R2-2 y R2-3; R2-4 no bloquea).

Método: worktree temporal `/tmp/rev18-e1r2` desprendido en `2a727b94`, con la
producción y las dos specs finales escritas tal como las prescribe E1 (factory
recortado, costura `loadSdk` en el adaptador, factory spec de 25 y adaptador
spec de 37). Solo jest unitario de los dos ficheros, sin e2e ni `init.sh`.
`tsc --noEmit` = 0 y `eslint` sobre los 4 ficheros = 0. El worktree se
eliminó al terminar.

### 1. N1–N8

| Ítem | Estado |
|---|---|
| N1 | Aplicado: la nota «Cómo copiar las anclas» cubre E1-A25…A28, A35…A37 y la mutación de E1.8 |
| N2 | Aplicado: fila de E1.8 y viñeta reescrita |
| N3 | Aplicado: fila `'sin stop_reason'` en E1.7 y rojo E1-c14 |
| N4 | Aplicado: `'texto-futuro'` y sondas S-E1.5b/c |
| N5 | Aplicado: fila *array-like*, sondas S-E1.4c/d, zona ciega retirada |
| N6 | Aplicado: `content: [null]` fuera de alcance |
| N7 | Aplicado: en S-E1.3c, el `it` 2 cae por `toHaveLength(1)` |
| N8 | Aplicado: cifras rehechas (factory 18 a 25, adaptador 25 a 37) |

### 2. Cifras: medido frente a declarado

Factory (spec final de 25): 25 en verde, exit 0.

| Compuerta o sonda | Declarada | Medida |
|---|---|---|
| E1-c1 (swap sin recorte) | 2/16/18 | 3/22/25 en la spec final; en la de 18, 2/16/18 ✓ |
| E1-c3 (sin recorte, rojo natural) | 1/18/19 | 1/24/25 en la spec final; en la de 19, 1/18/19 ✓ |
| E1-c5 | 2/23/25 | 2/23/25 ✓ |
| S-E1.1a | 3/22/25 | 3/22/25 ✓ |
| S-E1.1b, S-E1.1c | 1/24/25 | 1/24/25 ✓ |
| S-E1.2a/b/c | 1/24/25 | 1/24/25 ✓ (filas 1, 4 y 6) |

Adaptador (spec final de 37): 37 en verde, exit 0. E1-c8 da 2/35 (2/26/28
en su punto), E1-c10 4/33 (4/29/33), E1-c12 2/35 (2/33/35), E1-c14 1/36
(1/35/36) y E1-c16 1/36 (1/36/37). Todos coinciden y caen por aserción.
También coinciden S-E1.3a/b (1/36), S-E1.3c (4/33/37, con el `it` 2 por
`toHaveLength`), S-E1.4a (5/32), S-E1.4b (2/35), S-E1.4c/d (1/36) y
S-E1.5a/b/c (1/36).

Barrido Z1–Z6 y tabla C rehechos: Z1 y Z2 (S-E1.4c/d), Z3 y Z4 (S-E1.5b/c),
Z5 (E1-c14) y Z6 (E1-c16) mueren todas con 1 rojo, en la fila prevista.

### 3. Anclas, copiadas tal como lo hará Codex

E1-A1…A37, con `\|` cambiado por `|` y ejecutadas con `bash -c`: **37 de 37
coinciden** en las dos columnas. La base se midió en wt-18, cuyo backend no
difiere de `c09ee51c`; «tras E1» se midió en el worktree temporal.

### 4. D-E1-a (recortar): el candado de E1.1

- El `it` del punto 3 espera los valores recortados, y su rojo natural es la
  producción actual (1/24/25) ✓.
- Las sondas reformuladas sobre el recorte (S-E1.1a/b/c) son coherentes ✓.
- Zonas ciegas buscadas con los valores tal como están escritos
  (`'  clave-de-prueba  '`, `'  modelo-de-prueba  '`, solo espacios):

| Mutación del factory | Resultado |
|---|---|
| Recorte en un solo argumento (S-E1.1b/c) | muere, 1/24/25 |
| `trimStart()` en los dos | muere, 1/24/25 |
| `trimEnd()` en los dos | muere, 1/24/25 |
| swap con recorte | muere, 3/22/25 |
| **solo espacios: `x.replace(/^ +\| +$/g, '')` en los dos** | **sobrevive, 25/25 en verde** |
| quitar todo el blanco: `x.replace(/\s/g, '')` en los dos | sobrevive, 25/25 en verde |

El superviviente de solo espacios deja pasar el caso que la propia D-E1-a da
como motivo («inyectado con un salto de línea final»): un `\n` final llegaría
crudo al cuerpo JSON con la suite en verde.

Variante medida: `ANTHROPIC_API_KEY: '\t clave-de-prueba \n'` y
`ANTHROPIC_MODEL: '\t modelo-de-prueba \n'`. La final sigue en 25 verdes, la
producción sin recorte da 1/24/25, S-E1.1b/c dan 1/24/25 cada una y
`trimStart`/`trimEnd` también 1/24/25. Mata además el recorte de solo
espacios (1/24/25) y el de solo salto final, `replace(/\n+$/, '')`
(1/24/25). **No cambia ninguna cifra declarada.**

### 5. Nota 2: anclas E1-A34…A37 con positivos plantados

Base final: A34 = 3, A35 = 3, A36 = 3, A37 = 1.

| Positivo plantado | A34 | A35 | A36 | A37 | ¿Lo ve? |
|---|---|---|---|---|---|
| Quitar `loadSdk,` de una construcción `null` | 3 | 3 | **2** | 1 | sí |
| Cambiar `loadSdk` por `undefined` | 3 | 3 | **2** | 1 | sí |
| Construcción `null` de una línea en `nutrition-explainer.factory.spec.ts` | 3 | 3 | 3 | **2** | sí |
| Octava construcción `null` sin loader en el mismo fichero | 3 | **4** | 3 | 1 | sí |
| Una de las tres con otra clave literal y sin loader | 3 | **2** | **2** | 1 | sí |
| **Una construcción de cliente falso (`{ create }`) pasada a `null`, con otra clave y sin loader** | 3 | 3 | 3 | 1 | **no** (y E1-A24 sigue en 7) |

La regla funciona tal como está escrita para los casos que declara. El último
residuo es rebuscado; ver R2-4.

### 6. E1-A25: zona ciega de la propia ancla

`git diff -U0 c09ee51c -- $AI/nutrition-explainer.factory.ts | grep -c '^[-+] '`
solo cuenta las líneas cambiadas que empiezan por espacio, así que no ve las
de columna 0 ni las líneas en blanco:

| Plantado sobre el factory final | `grep -c '^[-+] '` | `--numstat` |
|---|---|---|
| nada | 2 | `1 1` |
| `import { Logger } from "@nestjs/common";` en la línea 1 | **2** | `2 1` |
| una línea en blanco en la línea 1 | **2** | `2 1` |

Un `import` añadido a nivel de módulo es justo lo que Codex podría colar en el
factory (por ejemplo, el tipo del loader). La forma
`git diff -U0 c09ee51c -- $AI/nutrition-explainer.factory.ts | grep -cvE '^(diff |index |--- |\+\+\+ |@@ )'`
mide 0 en la base, 2 en la final y 3 con cualquiera de los dos plantados. Así
conserva los valores 0 y 2 que ya citan las compuertas E1-c2 y E1-c4 de
`tasks.md`.

### Cambios pedidos

- **R2-1 (bloqueante).** En E1.1, punto 3 (`it('pasa clave y modelo
  recortados (E1.1)')`), y en el texto «(dos espacios a cada lado)», cambiar
  los valores a `'\t clave-de-prueba \n'` y `'\t modelo-de-prueba \n'`. El
  valor esperado sigue siendo `{ model: 'modelo-de-prueba', apiKey:
  'clave-de-prueba', client: null }`. Añadir a la tabla de sondas de E1.1 dos
  filas, cada una con 1/24/25 medido:
  - recorte de solo espacios: `x.replace(/^ +| +$/g, '')` en los dos argumentos;
  - recorte de solo salto final: `x.replace(/\n+$/, '')` en los dos.
  Las cifras de E1-c1…E1-c6 no cambian.
- **R2-2.** Declarar en E1.1 como zona ciega la eliminación de todo el blanco
  (`x.replace(/\s/g, '')`): sobrevive porque los valores no tienen blanco
  interior. Un modelo o una clave con blanco interior no es realista.
- **R2-3.** Cambiar E1-A25 en la tabla de anclas, y en su línea de la nota
  «Cómo copiar las anclas», por la forma de §6:
  `git diff -U0 c09ee51c -- $AI/nutrition-explainer.factory.ts | grep -cvE '^(diff |index |--- |\+\+\+ |@@ )'`.
  Base 0, tras E1 2. Las compuertas de `tasks.md` que citan A25 = 0 y A25 = 2
  no cambian de valor.
- **R2-4 (no bloquea).** Para cerrar el residuo de §5, añadir el ancla
  `tr -d ' \n' < $AI/anthropic-nutrition-explainer.spec.ts | grep -oF "'clave-de-prueba',{" | wc -l`
  (base 4, tras E1 4, con el residuo plantado 3). Con E1-A24 = 7 = 4 + E1-A36,
  queda contada cada construcción.

Fuera de esto, todo el delta coincide con lo declarado.

### Checklist de la revisión 2

- [x] HEAD de wt-18 = `2a727b94`
- [x] N1–N8 aplicados
- [x] Cifras 25 + 37 y todas las compuertas y sondas, medidas = declaradas
- [x] Z1–Z6 y tabla C rehechos en el worktree temporal
- [x] E1-A1…A37 copiadas como Codex: 37/37
- [x] Nota 2: los positivos plantados se ven (residuo en R2-4)
- [ ] Candado del recorte sin superviviente evitable (R2-1)
- [ ] E1-A25 ve toda línea cambiada (R2-3)
- [x] Sin e2e ni `init.sh`; worktree temporal eliminado; wt-18 sin cambios
  salvo este informe; sin commit

## Revisión 3

Fecha: 2026-10-08
Base: HEAD `8a8613b3` en wt-18 (`feature/18-nutrition-ai-explainer-claude`),
delta revisado `git diff 2a727b94 8a8613b3 -- specs/`.
Veredicto: **APTO PARA FIRMA**.

Método: worktree temporal `/tmp/rev18-e1r3` desprendido en `8a8613b3`, con
la producción y las dos specs finales que prescribe E1. Es lo mismo que en la
revisión 2, con un cambio: el `it` del punto 3 usa los valores nuevos
`'\t clave-de-prueba \n'` y `'\t modelo-de-prueba \n'`. Las sondas S-E1.1a…e
se copiaron del texto crudo de `tasks.md` §Sondas, que coincide carácter a
carácter con la tabla de `requirements.md` §E1.1. Las anclas se copiaron del
texto crudo, cambiando `\|` por `|`. Solo se corrió jest unitario del factory
spec. No se corrieron `init.sh`, e2e ni migraciones. `eslint` sobre el factory
y su spec dio 0. El worktree temporal está eliminado. En wt-18 solo cambió
este informe.

### Medido frente a declarado

| Ítem | Declarado | Medido | |
|---|---|---|---|
| Factory spec final (valores nuevos) | 25 verdes | `25 passed, 25 total`, exit 0 | ✓ |
| R2-1 S-E1.1d, tal como está escrita (`.replace(/^ +/, '').replace(/ +$/, '')`) | `1 failed, 24 passed, 25 total` | 1/24/25, rojo `pasa clave y modelo recortados (E1.1)` por `toEqual` | ✓ |
| R2-1 S-E1.1e, tal como está escrita (`.replace(/\n+$/, '')`) | `1 failed, 24 passed, 25 total` | 1/24/25, mismo rojo | ✓ |
| Control: `replace(/^ +\| +$/g, '')` (forma de la revisión 2) | igual que S-E1.1d | 1/24/25 | ✓ |
| S-E1.1a | 3/22/25 | 3/22/25 (2 anti-vacíos + punto 3) | ✓ |
| S-E1.1b, S-E1.1c | 1/24/25 | 1/24/25 cada una | ✓ |
| `trimStart` / `trimEnd` en los dos (control) | — | 1/24/25 cada una | ✓ |
| R2-2 zona ciega `x.replace(/\s/g, '')` en los dos | sobrevive, 25 verdes | `25 passed, 25 total` | ✓ |
| E1-c3, rojo natural con los valores nuevos (spec de 19, producción `c09ee51c`) | `1 failed, 18 passed, 19 total` | 1/18/19 | ✓ |
| E1-c4 verde (spec de 19, recortada) | `19 passed, 19 total` | 19/19 | ✓ |
| E1-c5 rojo (spec de 25) | 2/23/25 | 2/23/25, las dos filas `gana not-enabled` por `toBe` | ✓ |
| S-E1.2a/b/c | 1/24/25 | 1/24/25 cada una, en la fila prevista | ✓ |
| R2-3 E1-A25 sustituida: base (wt-18) / tras E1 | 0 / 2 | 0 / 2 | ✓ |
| R2-3 E1-A25 con `import { Logger } …` plantado en la línea 1 | 3 | 3 (`--numstat` 2 1) | ✓ |
| R2-3 E1-A25 con una línea en blanco plantada en la línea 1 | 3 | 3 | ✓ |
| R2-3 E1-A25 copiada sin sustituir | sin número (nada en la base; el propio diff tras E1) | base vacía, rc=0; tras E1 imprime el diff | ✓ |
| R2-4 E1-A38 sustituida: base / tras E1 | 4 / 4 | 4 / 4 | ✓ |
| R2-4 residuo plantado (`{ create }` pasado a `'otra-clave', null` sin cargador) | 3 | A38 = 3; A24 = 7, A35 = 3 y A36 = 3 no lo ven | ✓ |
| E1-A35, E1-A36 y E1-A38 copiadas sin sustituir | rc=1 `tr: extra operand` | rc=1 `tr: extra operand '\|'` en las dos columnas | ✓ |
| E1-A1…A38 completas, sustituidas, base y tras E1 | tabla | **38 de 38** coinciden en las dos columnas | ✓ |

### Puntos 1 a 5

1. **R2-1.** Aplicado. Los valores de §E1.1, punto 3, están escritos como
   escapes del literal TS. Las sondas S-E1.1d y S-E1.1e están en las dos
   tablas y en la fila E1.1 de `traceability.md`. La forma partida de
   S-E1.1d mide lo mismo que la de la revisión 2.
2. **R2-2.** Aplicado: la zona ciega está declarada y se midió que sobrevive.
3. **R2-3.** Aplicado en la tabla y en la nota «Cómo copiar las anclas», que
   ya avisa de los cuatro `\|` de la regex.
4. **R2-4.** Aplicado: E1-A38 está en la tabla, en la regla de la nota 2
   (E1-A24 = 7 = E1-A38 + E1-A36), en la nota 2 de §E1.3 (E1-A34…E1-A38), en
   E1-c18 y en el checklist de `tasks.md`.
5. **Cifras.** El delta no cambia ninguna otra cifra declarada. Los gates
   E1-c1…E1-c6, S-E1.1a…c, S-E1.2a…c y E1-A1…A37 dan los mismos valores.

### Notas no bloqueantes (texto, no cifras)

- `tasks.md` E1-c3: «(llegan los valores con espacios)». Ahora llegan con
  tabulador, espacio y salto de línea.
- `tasks.md` E1-c4: «Sondas pendientes: S-E1.1b … y S-E1.1c». No nombra
  S-E1.1d ni S-E1.1e, aunque las dos aplican desde E1-c4. §Sondas y la fila
  de trazabilidad sí las listan, así que Codex las correrá igual.
- `requirements.md` §Cifras y alcance, «Qué está medido»: dice «las sondas
  S-E1.1a…c». S-E1.1d y S-E1.1e las midió el reviewer, como ya dice §E1.1.
- `requirements.md` §E1.1: «solo un recorte de todo el blanco de los extremos
  deja la suite en verde». El párrafo siguiente lo matiza al declarar como
  zona ciega `\s` global.

### Checklist de la revisión 3

- [x] HEAD de wt-18 = `8a8613b3`
- [x] R2-1: valores nuevos; S-E1.1d y S-E1.1e medidas tal como están escritas (1/24/25)
- [x] R2-2: zona ciega declarada y medida (25 verdes)
- [x] R2-3: E1-A25 nueva; base 0, tras E1 2, plantados 3
- [x] R2-4: E1-A38; base 4, tras E1 4, residuo 3
- [x] Ninguna otra cifra cambia (38/38 anclas, gates del factory iguales)
- [x] Sin `init.sh`, sin e2e y sin migraciones; worktree temporal eliminado; `backend-pet-tracker/` de wt-18 intacto; sin commit
