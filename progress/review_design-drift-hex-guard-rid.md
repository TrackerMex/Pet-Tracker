# review: design-drift-hex-guard-rid (#108)

Fecha: 2026-09-23
Worktree: `/home/claude/sites/Pet-Tracker-wt-ui`, branch `feature/108-design-drift-hex-guard-rid`
Tip revisado: `cfdbd3cc` (merge de `origin/main` hecho por el leader sobre `fe4562c5`)
Commits de Codex: `74c7cd29` … `fe4562c5`, sobre la firma `6c832281`

**Veredicto: APROBADO**

Sin bloqueantes. Seis observaciones no bloqueantes al final, todas de proceso o
de documentación, ninguna de código.

---

## Nota sobre el gate ejecutado

**No se lanzó `./init.sh`**, por instrucción expresa del encargo y de
[[requirements]] §Reglas de entorno: #108 no toca `backend-pet-tracker/` ni
`infra/`. Verificado: `git diff --stat origin/main HEAD -- mobile-pet-tracker/`
devuelve **dos ficheros** y ninguno es de producción. El gate real son `bunx jest`
y `bunx tsc --noEmit` desde `mobile-pet-tracker/`, medidos **sin pipe**. Se borró
`mobile-pet-tracker/.expo/types/router.d.ts` antes del typecheck.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#108). Medido:
      `grep -c '"status": "in_progress"'` → **1**
- [x] `STATUS.md` actualizado y honesto: dice «implementada; pendiente de
      reviewer» y no la da por cerrada
- [ ] `progress/current.md` — está en la **plantilla vacía**. Codex lo vació en
      `fe4562c5` al volcar su contenido a `progress/history.md`. Es artefacto de
      cierre del leader, no del implementador. **No bloqueante** (ver O1)

## Checklist C3 — Arquitectura

- [x] N/A por capas: #108 no toca `domain`, `application` ni `infrastructure`.
      El cambio vive entero en la suite de verificación del móvil
      (`src/__tests__/design-drift.test.ts`, `src/screens/home/index.test.tsx`)
      y en `docs/conventions.md`, tal como cierra [[design]] §Capa
- [x] Cero dependencias nuevas. Medido: `git diff --stat origin/main HEAD --
      mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock package.json`
      → **vacío**

## Checklist C4 — TDD, cuatro pares rojo→verde

Cada commit rojo se sacó al árbol con `git checkout <commit> -- mobile-pet-tracker/src
docs/conventions.md` y **se corrió**. Los cuatro fallan **por su aserción**:
ningún `ReferenceError`, ningún `Cannot find module`, ningún `SyntaxError`.

| R | Commit rojo | Resultado medido | Fallo |
|---|---|---|---|
| R1 | `74c7cd29` | `2 failed, 41 skipped, 43 total` | `Expected: 1 / Received: 8` y `Expected: 1 / Received: 2` |
| R2 | `63908134` | `1 failed, 7 passed, 43 skipped, 51 total` | solo **F1**: `Expected: false / Received: true` |
| R3 | `ed7a1895` | `3 failed, 51 skipped, 54 total` | tres `Expected substring` |
| R4 | `75b4d0d3` | `1 failed, 54 skipped, 55 total` | `Expected substring: "design-drift.test.ts"` |

- [x] **R2 se comporta exactamente como la spec predijo**: contra el regex viejo
      **solo F1 falla**, y **F2–F8 pasan en verde** (`7 passed`). Confirmado, no
      aceptado del reporte
- [x] Los totales suben de forma monótona 41 → 43 → 51 → 54 → 55: ningún test
      preexistente desapareció en ningún punto del historial
- [x] Cada R<n> tiene describe que lo nombra: `#108 R1`, `#108 R2`, `#108 R3`,
      `#108 R4`, los cuatro presentes en la salida `--verbose`
- [x] El historial es test-primero, un par por requisito, en el orden prescrito
      (R1 → R2 → R3 → R4), con R2 verde antes de tocar los literales de R3

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin filas «pendiente». La única ocurrencia del literal
      es la línea 13, que es la **prosa** de la convención
- [x] Los ocho hashes de la tabla son **ancestros de HEAD** (`git merge-base
      --is-ancestor`, ocho de ocho). No hubo rebase posterior
- [x] Formato de commit `type(scope): desc (R-id)` en los ocho commits de
      requisito; el noveno (`69d5bd5f`) también lo lleva. El décimo
      (`fe4562c5`, `docs(harness)`) es el reporte y no necesita R-id

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y casilla humana marcada
      («Aprobado por humano (fecha: 2026-09-22)»), firmada vía Notion en
      `6c832281`, que es la base de los diez commits de Codex
- [x] No hay gate de humo pendiente: la spec declara por escrito que #108 no
      cambia ni una línea que llegue al dispositivo, y lo verifiqué

## Checklist C7 — Sin código huérfano

- [x] Los **ocho** regex hex inline quedaron eliminados: el literal
      `[\da-f]{3,8}` aparece ahora **una sola vez** en el fichero, en
      `HEX_LITERAL`. Medido con la aguja exacta del test, por `split`: **1**
- [x] La lista de sombra queda **una sola vez** en `SHADOW_ESCAPES`: **1**
- [x] El workaround que #108 reemplaza —los dos literales partidos— quedó
      eliminado: `grep -rc "'#' + '106" mobile-pet-tracker/src/` → **ningún
      acierto** (exit 1)
- [x] `ARBITRARY_CLASS` aparece **dos** veces a propósito (la constante y el
      guard C8 de `:63`, hoy `:79`), consecuencia escrita y asumida en
      [[design]] §3. No es un olvido

## Checklist C8 — UI móvil

- [x] Grep-clean: la suite entera de guards de deriva —que es justo lo que este
      fichero implementa— pasa en verde, los ocho guards incluidos
- [x] Resto de bullets **N/A**: #108 no toca ni una línea de producción del
      móvil. El diff contra `origin/main` son dos ficheros de test. No hay
      dimensiones, ni Skeleton, ni componentes, ni touch targets, ni animaciones
- [x] La carta `docs/ui-guidelines.md` no se ve afectada. La spec ya dejó por
      escrito que el mapa de `expo:expo-overview` **no enruta a ninguna leaf**
      para este trabajo. No lo leo como salto de C8 (ver O3)

---

## Los seis puntos de riesgo, verificados uno a uno

**1. Cuatro pares rojo→verde, rojo por aserción.** Verificado corriendo los
cuatro commits rojos. Tabla arriba en C4. Incluido el matiz de R2: solo F1 roja,
F2–F8 verdes.

**2. `sourceFiles()` no se tocó.** Medido:
`git diff 6c832281 HEAD -- src/__tests__/design-drift.test.ts | grep -E "^[+-].*(sourceFiles|allTypeScriptFiles)"`
→ **sin aciertos** (exit 1). Aparece solo como contexto. Y el recuento de
describes **no bajó**: el inventario de títulos `^describe(` de `origin/main`
contra HEAD da exactamente **cuatro adiciones y cero supresiones**
(`17a18,21`), los cuatro de #108. 17 → 21.

**3. Las dos formas largas siguen siendo distintas.**
`PAIRING_STYLE_ESCAPES` lleva `StyleSheet\.create`; `MEALS_BAR_STYLE_ESCAPES`
lleva `StyleSheet(?:\.create)?`. Y cada guard consume la que le toca: el guard
de pairing (hoy `:212`) usa `PAIRING_STYLE_ESCAPES`, el de `#98 R10` (hoy `:357`)
usa `MEALS_BAR_STYLE_ESCAPES`, y las seis cortas usan `FEATURE_STYLE_ESCAPES`.
No se unificaron.

**4. Ninguna forma compuesta lleva flag `g`.** Las tres se construyen con
`new RegExp(..., 'i')`. Reconstruidas en `node` desde los valores del fichero:
`flags` → `i i i`.

**5. La tabla de frontera tiene ocho filas y tres `expect` por fila.**
Confirmado en el fuente (`expect(FEATURE…)`, `expect(PAIRING…)`,
`expect(MEALS_BAR…)`) y en la salida `--verbose`, que lista los ocho casos.
Reproduje las ocho filas contra las tres formas en `node`, al margen de jest:
**8/8 coinciden**, y **F5 (`#000`) espera y obtiene `true`** en las tres. La
exclusión es contextual, no léxica, como exige la spec.

**6. Los valores esperados van literales.** En la tabla del test los esperados
están escritos como `false` / `true` literales, y las muestras como strings
literales. **Ninguno se deriva de `HEX_LITERAL`** ni de otra constante del
fichero. No hay tautología tipo `MEALS_BAR_TIMING`.

---

## Gate numérico — derivación, no absoluto

Medido por mí en el tip `cfdbd3cc`, **sin pipe**, desde `mobile-pet-tracker/`:

| Medida | Base `origin/main` | Cierre medido | Delta |
|---|---:|---:|---:|
| Test Suites (móvil) | 77 | **77 passed** | **+0** |
| Tests (móvil) | 1398 | **1412 passed** | **+14** |
| `design-drift.test.ts`, tests | 41 | **55 passed** | **+14** |
| `design-drift.test.ts`, describes | 17 | **21** | **+4** |

`bunx jest` → **exit 0**. `bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'`
→ **exit 0**, 55/55. `bunx tsc --noEmit` → **exit 0**, salida vacía.

**Desglose por requisito, contado en la salida `--verbose`, no en el reporte:**

| R | Tests | Contados |
|---|---:|---|
| R1 | 2 | las dos agujas (`[\da-f]{3,8}`, `shadowColor\|…\|shadowRadius`) |
| R2 | 8 | F1…F8, una por fila de la tabla de frontera |
| R3 | 3 | dos `contiene …` + `no parte el prefijo de #106` |
| R4 | 1 | `documenta el guard y la forma canónica` |
| **Total** | **14** | cuadra con el `+14` de la suite y de `design-drift.test.ts` |

**La base no se re-midió corriendo `origin/main`**: se deriva sin margen. El
diff móvil contra `origin/main` son exactamente dos ficheros; en
`design-drift.test.ts` todo el cambio de recuento es aditivo (cuatro describes,
cero supresiones), y el de `screens/home/index.test.tsx` son **dos líneas de
título** con el recuento de describes idéntico. Luego `1412 − 14 = 1398` y
`55 − 14 = 41`, que es lo que midió el leader. **Ningún recuento bajó.**

Comprobaciones de R3:
- `grep -rc "'#' + '106" mobile-pet-tracker/src/` → **ningún acierto** (exit 1)
- `grep -rn '#106 R2' mobile-pet-tracker/src/` → **cuatro** aciertos: el describe
  real en `screens/home/index.test.tsx:3767` y tres en el guard
  (`design-drift.test.ts:590, :602, :617`). Es el efecto buscado por diseño

## Sonda de mutación propia (no acepté la del reporte)

Devolví `screens/home/index.test.tsx` a su estado de `6c832281` (literales
partidos) dejando el `design-drift.test.ts` de HEAD, y corrí el fichero:

```
Tests: 3 failed, 52 passed, 55 total
  ● #108 R3 › contiene describe('#106 R2: la barra de comidas transiciona su ancho'
  ● #108 R3 › contiene describe('#106 R3: reduce motion deja la barra sin animación'
  ● #108 R3 › no parte el prefijo de #106
```

Dos cosas a la vez: **(a)** el candado de R3 en su forma final —la del commit
extra `69d5bd5f`, con la aguja construida por concatenación— **sigue detectando
el workaround**, así que ese commit no lo debilitó; y **(b)** los otros 52 tests
siguen verdes, los cinco guards que listan ese fichero incluidos.

El árbol quedó **limpio** tras cada checkout temporal (`git status --short`
vacío, verificado después de cada uno).

---

## Observaciones — ninguna bloqueante

**O1. Codex escribió artefactos de cierre del leader.** En `fe4562c5` añadió una
entrada a `progress/history.md` **y vació `progress/current.md`** (−68 líneas).
Los dos son artefactos del leader, no del implementador. El texto es honesto y
dice explícitamente que no marca la feature `done`. El leader ya lo detectó para
`history.md`; **el vaciado de `current.md` es la segunda mitad de la misma
desviación** y conviene anotarla igual. No hay pérdida de información: el
contenido está en `history.md`.

**O2. Worktree equivocado.** Codex trabajó en `-wt-ui` en vez del indicado y
cambió esa ruta de branch, dejando el worktree anterior de #108 en detached
sobre `6c832281`. No causó pérdida: los diez commits están en la branch y
pusheados. Anotado como aviso de proceso.

**O3. `expo:expo-overview` no estaba en el catálogo de Codex.** Es la deuda **B5**
conocida. En esta feature no muerde: la spec ya había dejado por escrito, y
verificado, que el mapa de esa skill no enruta a ninguna leaf para un cambio sin
UI, navegación, motion ni dependencias. Aun así es la tercera feature en que el
hueco aparece.

**O4. Un commit de más sobre los ocho prescritos.** `69d5bd5f` parte por
concatenación la aguja `'#' + '106` del tercer test de R3, para que el propio
test no sea un acierto del grep de cierre. Es necesario —sin él, el gate
`grep -rc "'#' + '106" src/` daría un falso positivo sobre el propio candado— y
**no debilita nada**: la aguja sigue siendo un literal escrito a mano, no
derivado del símbolo vigilado, y mi sonda demuestra que el test sigue rojo
contra el workaround. Aprobado tal cual.

**O5. La nota de cierre de `traceability.md` cita un absoluto caducado.** Sigue
diciendo «1396 + 14 = **1410**». La base real era 1398 y el cierre 1412.
`requirements.md` §Gate numérico ya declara por escrito que los absolutos son
«descripción de lo que valía el 2026-09-22» y que **el candado es la
derivación**, así que no es un fallo de gate; pero la nota de trazabilidad no
lleva esa salvedad y conviene reapuntarla a `1398 + 14 = 1412` antes del PR.
Las cifras de `design-drift.test.ts` (41 + 14 = 55, 17 + 4 = 21) sí eran
estables y se cumplieron.

**O6. El flake ajeno que Codex reportó no reapareció.** Codex describió un fallo
intermitente en `src/screens/health/index.test.tsx` R6 (`weight-current` aún no
visible). Mi corrida completa fue **verde a la primera**, 77/1412, sin repetir.
Queda anotado por si vuelve; no es de #108.

---

## Output del gate

```
$ bunx tsc --noEmit ; echo $?
0
(salida vacía)

$ bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts' ; echo $?
Test Suites: 1 passed, 1 total
Tests:       55 passed, 55 total
Snapshots:   0 total
0

$ bunx jest ; echo $?
Test Suites: 77 passed, 77 total
Tests:       1412 passed, 1412 total
Snapshots:   1 passed, 1 total
0

$ grep -rc "'#' + '106" mobile-pet-tracker/src/   → 0 aciertos (exit 1)
$ grep -rn '#106 R2' mobile-pet-tracker/src/      → 4 aciertos (describe real + guard)
```

Los cuatro describes de #108, tal como los lista `--verbose`:

```
  #108 R1: los patrones compartidos se declaran una sola vez
    ✓ declara una sola vez [\da-f]{3,8}
    ✓ declara una sola vez shadowColor|shadowOffset|shadowOpacity|shadowRadius
  #108 R2: el guard de estilo distingue un R-id de un color hex
    ✓ describe('#106 R2: la barra de comidas transiciona su ancho', () => {
    ✓ describe('#98 R10: la barra de comidas no mete drift de estilo', () => {
    ✓ #fff
    ✓ #1DA868
    ✓ #000
    ✓ backgroundColor: #1DA868;
    ✓ ver el hilo #106, gracias
    ✓ #106 R2 usa el token y no #fff
  #108 R3: los títulos de #106 vuelven a ser literales enteros
    ✓ contiene describe('#106 R2: la barra de comidas transiciona su ancho'
    ✓ contiene describe('#106 R3: reduce motion deja la barra sin animación'
    ✓ no parte el prefijo de #106
  #108 R4: la convención de cita del guard está documentada
    ✓ documenta el guard y la forma canónica
```

---

Este fichero queda **sin commitear**: el cierre (commit, `feature_list.json`,
PR) es del leader.
