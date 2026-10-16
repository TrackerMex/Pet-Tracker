---
feature: "mobile-account-heroui-text-sizes"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas: tamaños 13 px y 17 px de las pantallas de cuenta (#187)

> Disciplina TDD con commits test-primero. Cada requisito de [[requirements]]
> tiene su par rojo/verde en la cadena de abajo. Quien implementa no revisa.
> Ver [[design]] para el porqué.

## Reglas de la cadena (las fija esta spec; el handoff las repite)

- **Un commit de test va antes que su implementación, siempre**, y el commit de
  test deja el rojo medido de la tabla. Nunca se mezclan tests e implementación
  en un commit (en #19 se hizo y se incumplió C4 de `CHECKPOINTS.md`).
- Todo comando de móvil empieza por `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker"`
  y se escribe en la misma cadena `&&`. Un error de invocación (por ejemplo
  `ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE` o ENOENT del fichero que se iba a crear) no
  es un rojo: se para y se avisa. Móvil es `bun`: `bunx jest …`, `bun run
  typecheck`, `bun run lint`; nunca `npx` ni `npm i -g`.
- **Un fichero de jest a la vez**, con `bunx jest <ruta>` (las rutas de esta
  spec no llevan paréntesis; si una ruta futura los lleva, se escapan,
  `\(tabs\)`, porque jest las toma por regex y se saltaría ficheros con exit 0).
  No se lanza `./init.sh` (lo corre el humano o el leader) ni se arranca más de un
  jest a la vez.
- **Rojo bien formado**: solo vale el rojo de la tabla, con la consulta y el
  `Received` indicados. Un `Unable to find` o `Found multiple elements`, un
  `Test suite failed to run` o un fallo en un `it` que no figura en la tabla =
  **parar y avisar**; no se arregla ajustando la aserción.
- Los `it` de R2 y R3 no se escriben «para que pasen»: se escriben con la receta
  de la spec, se ven rojos y solo entonces se hace el verde.
- Comentarios de código: solo `#187 R<n>` (p. ej. `// #187 R2`); nunca `#187` a
  secas ni una nota copiada de la spec (el guard de hex de `design-drift` los lee
  como color).
- Antes de cada commit: `bun run typecheck` termina con 0; y el lint, en esta
  forma, porque `expo lint` traga un SIGKILL y sale 0 y usa una caché que puede
  quedar obsoleta tras un rojo: `bunx expo lint --no-cache > <log> 2>&1 && test
  ! -s <log>`, con `<log>` en un fichero temporal fuera del árbol que se borra al
  final; si el log contiene `Failed to run`, se repite la corrida. No hay
  prettier en móvil.
- Una dependencia nueva está prohibida: R1 usa `typescript`, ya instalada.
- Los nombres de las skills de Codex no son los nuestros (deuda B5): el handoff
  del leader los traduce; esta spec no nombra ninguna.

## Arranque (antes del primer commit)

1. `H0=$(git rev-parse HEAD)`; el handoff lo cita. Rama `feature/187-mobile-account-heroui-text-sizes`.
2. Correr las anclas A1 a A11 de [[requirements]] § Base medida y comparar. Si una
   difiere, parar.
3. Medir **T0**: total de `it` de toda la suite móvil en H0, con `cd … && bun run
   test > <log> 2>&1; grep -E '^Tests:' <log>` (sin pipe: el código de salida
   que se mide es el de jest). Toda cifra de total de abajo es `T0 + delta`. El
   aviso `A worker process has failed to exit gracefully` ya sale al final de
   todo ALL móvil desde `main` (preexistente): se cuenta solo en la medida, no
   para el verde.
4. Medir los totales por fichero de A13 (13, 40, 65, 49, 49) corriendo cada
   fichero solo.

## Cadena de commits

Cada fila: commit, qué contiene, cuántos `it` fallan después de él, y total de
la suite (`T0 + delta`, donde delta acumula los `it` añadidos). Los totales por
fichero tras cada commit están en la segunda tabla.

| Commit | Mensaje | Contenido | `it` añadidos | Total de la suite | Fallan |
|---|---|---|---|---|---|
| c1 | `test(#187 R1): candado de familia text-NN sobre HeroUI y Card (R1)` | fichero nuevo `heroui-text-size-merge.test.ts` con los 24 `it` de R1 | 24 | T0 + 24 | 1 |
| c2 | `test(#187 R2): doce etiquetas de campo a 13 px y literal 3 de textRecipes (R2)` | 12 filas de R2 en 4 `index.test.tsx` y el literal 3 de `textRecipes` | 12 | T0 + 36 | 17 |
| c3 | `feat(#187 R2): etiquetas de cuenta con Text plano (R2)` | 12 cambios `Label.Text` a `Text` en 4 `index.tsx` | 0 | T0 + 36 | 1 |
| c4 | `test(#187 R3): cinco botones de cuenta a 17 px y literales 10 y 11 (R3)` | 5 `it` de R3 en 4 `index.test.tsx` y los literales 10 y 11 de `textRecipes` | 5 | T0 + 41 | 10 |
| c5 | `feat(#187 R3): botones de cuenta con Text plano (R3)` | 5 cambios `Button.Label` a `Text` en 4 `index.tsx` | 0 | T0 + 41 | 0 |
| c6 | `test(#187 R5): la carta fija la regla de text-NN sobre HeroUI (R5)` | el `it` de R5 en `heroui-text-size-merge.test.ts` | 1 | T0 + 42 | 1 |
| c7 | `docs(#187 R5): enmienda de la carta sobre text-NN y HeroUI (R5)` | sección `## Enmienda #187 …` al final de `docs/ui-guidelines.md` | 0 | T0 + 42 | 0 |
| c8 | `docs(#187): trazabilidad y reporte de implementación (R1-R5)` | `traceability.md` con los hashes reales de c1 a c7 y `progress/impl_mobile-account-heroui-text-sizes.md` | 0 | T0 + 42 | 0 |

Totales por fichero (cada celda = celda anterior + `it` añadidos del commit):

| Fichero | Base (A13) | Tras c1 | Tras c2 | Tras c4 | Tras c6 |
|---|---|---|---|---|---|
| `src/__tests__/heroui-text-size-merge.test.ts` | no existe | 24 | 24 | 24 | 25 |
| `src/__tests__/account-screens-polish.test.ts` | 13 | 13 | 13 | 13 | 13 |
| `src/screens/login/index.test.tsx` | 40 | 40 | 42 | 43 | 43 |
| `src/screens/register/index.test.tsx` | 65 | 65 | 72 | 73 | 73 |
| `src/screens/forgot/index.test.tsx` | 49 | 49 | 50 | 52 | 52 |
| `src/screens/reset-password/index.test.tsx` | 49 | 49 | 51 | 52 | 52 |
| Suma de `it` añadidos | | 24 | 36 | 41 | 42 |

Comprobación cruzada: 24 (R1) + 12 (R2) + 5 (R3) + 1 (R5) = 42.

### Rojos esperados por commit

Se dan las líneas `Tests:` de jest por fichero. «Q» es la consulta que falla.

**c1 (R1, escáner nace con el árbol real rojo):**

| Fichero | `Tests:` esperado | `it` que falla | Q |
|---|---|---|---|
| `heroui-text-size-merge.test.ts` | `1 failed, 23 passed, 24 total` | `#187 R1: el árbol de producción no pasa text-NN a HeroUI ni a Card` | `expect(findings).toEqual([])`; `Received` con 17 hallazgos: `screens/forgot/index.tsx` 3, `screens/login/index.tsx` 3, `screens/register/index.tsx` 8, `screens/reset-password/index.tsx` 3 |

Los otros 23 `it` (2 a 24) **nacen verdes por diseño**: validan el escáner, no el
árbol. Se prueban con las sondas S7 a S17 (se corren tras c1, se revierten con
`git checkout HEAD -- src/__tests__/heroui-text-size-merge.test.ts` y se
comprueba `git diff --quiet` y `git diff --cached --quiet` sobre ese fichero).

**c2 (R2, doce etiquetas y literal 3):**

| Fichero | `Tests:` esperado | `it` que fallan | Q |
|---|---|---|---|
| `login/index.test.tsx` | `2 failed, 40 passed, 42 total` | las 2 filas `#187 R2: la etiqueta "%s" de login pinta 13 px` | `toBe('text-13 font-semibold text-muted')`; `Received` empieza por `label__text` |
| `register/index.test.tsx` | `7 failed, 65 passed, 72 total` | las 7 filas `… del registro pinta 13 px` | ídem |
| `forgot/index.test.tsx` | `1 failed, 49 passed, 50 total` | la fila de forgot | ídem |
| `reset-password/index.test.tsx` | `2 failed, 49 passed, 51 total` | las 2 filas de reset-password | ídem |
| `account-screens-polish.test.ts` | `4 failed, 9 passed, 13 total` | las 4 filas `#172 R6: %s pinta títulos, etiquetas, cuerpos y CTA con su receta` | `expect(source.split(literal).length - 1).toBe(counts[index])`: `Expected: 2/7/1/2`, `Received: 0` (literal 3 enmendado) |
| `heroui-text-size-merge.test.ts` | `1 failed, 23 passed, 24 total` | el `it` 1 (aún 17 hallazgos) | ídem c1 |

Fallos: 2 + 7 + 1 + 2 + 4 + 1 = 17. Ninguno nace verde.

**c3 (R2, verde):**

| Fichero | `Tests:` esperado | Fallan |
|---|---|---|
| `login/index.test.tsx` | `42 passed, 42 total` | 0 |
| `register/index.test.tsx` | `72 passed, 72 total` | 0 |
| `forgot/index.test.tsx` | `50 passed, 50 total` | 0 |
| `reset-password/index.test.tsx` | `51 passed, 51 total` | 0 |
| `account-screens-polish.test.ts` | `13 passed, 13 total` | 0 (los literales 10 y 11 aún son los originales y los `Button.Label` siguen) |
| `heroui-text-size-merge.test.ts` | `1 failed, 23 passed, 24 total` | el `it` 1, ahora con **5** hallazgos: `screens/forgot/index.tsx Button.Label text-17` (×2), `screens/login/index.tsx Button.Label text-17`, `screens/register/index.tsx Button.Label text-17`, `screens/reset-password/index.tsx Button.Label text-17` |

Anclas tras c3: A1 = 0 en las cuatro; A2 = 1, 1, 1, 1; A3 = forgot 1; A4 = `5`;
A6 (primera columna, `Text` 13 px) = login 2, register 7, forgot 1,
reset-password 2; A8 (`</Label.Text>`) = 0 en las cuatro.

**c4 (R3, cinco botones y literales 10 y 11):**

| Fichero | `Tests:` esperado | `it` que fallan | Q |
|---|---|---|---|
| `login/index.test.tsx` | `1 failed, 42 passed, 43 total` | `#187 R3: el botón login-submit pinta su etiqueta a 17 px` | `toBe('text-17 font-extrabold text-accent-foreground')`; `Received` empieza por `button__label ` y contiene `button__label--size-md` |
| `register/index.test.tsx` | `1 failed, 72 passed, 73 total` | `#187 R3: el botón register-submit pinta su etiqueta a 17 px` | ídem |
| `forgot/index.test.tsx` | `2 failed, 50 passed, 52 total` | `forgot-submit` y `forgot-resend` | ídem; `forgot-resend` espera `text-17 font-extrabold text-foreground` y `Received` contiene `button__label--variant-secondary` |
| `reset-password/index.test.tsx` | `1 failed, 51 passed, 52 total` | `#187 R3: el botón reset-submit pinta su etiqueta a 17 px` | ídem |
| `account-screens-polish.test.ts` | `4 failed, 9 passed, 13 total` | las 4 filas de #172 R6 | `Expected: 1/1/1/1` (literal 10) y `Received: 0` |
| `heroui-text-size-merge.test.ts` | `1 failed, 23 passed, 24 total` | el `it` 1 (5 hallazgos) | ídem c3 |

Fallos: 1 + 1 + 2 + 1 + 4 + 1 = 10. Ninguno nace verde: el único candidato,
las filas de #172 R6, falla por el literal 10 ya enmendado (cuenta esperada ≥ 1,
real 0) antes de c5.

**c5 (R3, verde):** todos los ficheros verdes. `Tests:` por fichero: login `43
passed, 43 total`; register `73 passed, 73 total`; forgot `52 passed, 52 total`;
reset-password `52 passed, 52 total`; `account-screens-polish` `13 passed, 13
total`; `heroui-text-size-merge` `24 passed, 24 total`.

Anclas tras c5: A1, A2, A3, A4 = 0 (A4 imprime `0`); A6 = login `2 1 0`,
register `7 1 0`, forgot `1 1 1`, reset-password `2 1 0`; A8 = 0 y 0 en las
cuatro; A7 sin cambio (1 en cada una). Aquí se corren las sondas S1 a S6 de
[[requirements]] sobre el árbol y se revierten cada una.

**c6 (R5, rojo de la carta):**

| Fichero | `Tests:` esperado | `it` que falla | Q |
|---|---|---|---|
| `heroui-text-size-merge.test.ts` | `1 failed, 24 passed, 25 total` | `#187 R5: la carta fija la regla y la receta con Text plano` | `toContain('## Enmienda #187 — Tamaños de letra sobre componentes de HeroUI')` falla sobre el contenido de `docs/ui-guidelines.md` |

**c7 (R5, verde):** `heroui-text-size-merge.test.ts` `25 passed, 25 total`. Además
`git diff H0..HEAD -- docs/ui-guidelines.md` solo añade líneas al final (ninguna
línea previa se modifica ni se borra) y los `it` de la carta existentes siguen
verdes: tras c7 se corre cada guard que lee la carta o escanea código,
**uno por uno**, y se anota el resultado: `design-drift.test.ts`,
`legibility-classnames.test.ts`, `consistency-classnames.test.ts`,
`ui-language.test.ts`, `profile-canvas-fidelity.test.ts` y
`account-screens-polish.test.ts`.

**c8 (traza):** `traceability.md` sin ninguna fila «pendiente» y cada hash
comprobado con `git cat-file -e <hash>`; el reporte `progress/impl_…md` cita los
hashes, los `Tests:` de cada fichero, el T0 medido y el total final. **No se
rebasa después de c8** (cambiaría los hashes que cita).

## R1: candado de familia (c1; verde del árbol en c3 y c5)

- [ ] (1) Escribir `heroui-text-size-merge.test.ts` con los 24 `it` de [[requirements]] § R1 (escáner, pisos, premisa y 19 filas de corpus P1 a P13 y N1 a N6). Ver el rojo único de c1.
- [ ] (2) Correr las sondas S7 a S17 sobre el escáner (cada una cae en el `it` que dice la tabla) y revertir con `git checkout HEAD --`. Tras c3 el árbol baja de 17 a 5 hallazgos; tras c5 a 0. Correr S1 a S6 tras c5.
- [ ] (3) Refactor con tests verdes (nombres de helper, sin cambiar un solo literal de las expectativas).

## R2: doce etiquetas a 13 px (c2, c3)

- [ ] (1) Añadir las 12 filas de R2 y enmendar el literal 3 de `textRecipes` (con `// #187 R2`). Ver los 17 rojos de c2.
- [ ] (2) Cambiar las 12 aperturas y 12 cierres de `Label.Text` a `Text` (los comandos A1 y A8 verifican el recuento). Verde de c3.
- [ ] (3) Refactor con tests verdes (ninguno: la receta es literal).

## R3: cinco botones a 17 px (c4, c5)

- [ ] (1) Añadir los 5 `it` de R3 y enmendar los literales 10 y 11 (con `// #187 R3`). Ver los 10 rojos de c4.
- [ ] (2) Cambiar las 5 aperturas y 5 cierres de `Button.Label` a `Text`. Verde de c5, A4 = `0`.
- [ ] (3) Refactor con tests verdes (ninguno).

## R4: invariantes (en cada commit y en el cierre)

- [ ] (1) En c1, c2, c3, c4 y c5, correr `profile-canvas-fidelity.test.ts` y `design-drift.test.ts` por separado: verdes sin editarlos.
- [ ] (2) Al cierre: `git diff --quiet H0 -- src/theme/global.css package.json bun.lock` (desde `mobile-pet-tracker/`) sale 0; `git diff --name-only H0..HEAD`, sin commits del leader, es la lista cerrada de abajo.
- [ ] (3) Nada que refactorizar.

## R5: la carta (c6, c7)

- [ ] (1) Añadir el `it` de R5. Ver el rojo de c6.
- [ ] (2) Añadir la sección de [[requirements]] § R5 al final de `docs/ui-guidelines.md`, tal cual. Verde de c7.
- [ ] (3) Refactor con tests verdes (ninguno).

## R6: smoke humano (no lo hace ningún agente)

- [ ] (1) El humano abre las cuatro pantallas en un **dev build de Android** (nunca Expo Go) y recorre los 5 pasos de [[requirements]] § R6.
- [ ] (2) Firma su casilla propia («Smoke R6») en [[requirements]] § Gate humano de cierre.
- [ ] (3) Si observa que la etiqueta no se pone roja en error, lo anota como feature aparte; no reabre esta spec.

## Cierre: lista cerrada de ficheros (R4)

`git diff --name-only H0..HEAD` devuelve exactamente estos 13 ficheros (sin contar
commits del leader sobre `specs/`, `progress/`, `feature_list.json`):

1. `mobile-pet-tracker/src/__tests__/heroui-text-size-merge.test.ts` (nuevo)
2. `mobile-pet-tracker/src/__tests__/account-screens-polish.test.ts`
3. `mobile-pet-tracker/src/screens/login/index.tsx`
4. `mobile-pet-tracker/src/screens/register/index.tsx`
5. `mobile-pet-tracker/src/screens/forgot/index.tsx`
6. `mobile-pet-tracker/src/screens/reset-password/index.tsx`
7. `mobile-pet-tracker/src/screens/login/index.test.tsx`
8. `mobile-pet-tracker/src/screens/register/index.test.tsx`
9. `mobile-pet-tracker/src/screens/forgot/index.test.tsx`
10. `mobile-pet-tracker/src/screens/reset-password/index.test.tsx`
11. `docs/ui-guidelines.md`
12. `specs/mobile-account-heroui-text-sizes/traceability.md`
13. `progress/impl_mobile-account-heroui-text-sizes.md`

Al terminar, `git status --short` está limpio y se han borrado los logs
temporales de jest y lint, y `src/components/zz-sonda.tsx` si se creó para S4.
