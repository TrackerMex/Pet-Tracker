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
