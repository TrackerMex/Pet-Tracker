# review: mobile-meal-toggle-source-lock-nesting (#109)

Fecha: 2026-09-22T17:56Z
Rama: `feature/109-mobile-meal-toggle-source-lock-nesting` · Base: `73f14d5e` · HEAD: `44feb5a8`
**Veredicto: APROBADO**

Ningún hallazgo bloqueante. Hay **tres no bloqueantes** (H-1, H-2, H-3), uno de
ellos un agujero residual del candado nuevo que reproduje y que propongo
registrar como deuda, no rebotar.

---

## Resumen para el leader

El candado hace lo que la spec dice. Repetí las diez sondas y **las diez dan
exactamente el veredicto que Codex reporta**, incluida la que más te importaba:
**V7 (`0.8` → `0.5`) da árbol VERDE y fuente ROJO**, así que la justificación de
que el candado de fuente exista no se apoyaba en una medición falsa.

Además de las diez, corrí **siete sondas propias** contra el recorte nuevo. El
recorte nuevo es **estrictamente más seguro** que el viejo: en las dos sondas
donde el viejo fabricaba un verde falso (renombrar el componente, duplicar el
ancla) el nuevo se pone rojo. Encontré **un** agujero residual (H-1) y necesita
construirse a propósito.

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` — `feature_list.json` en esta rama: únicamente `#109`. (`#108` no existe en este árbol; vive en la rama del worktree `wt-ui`.)
- [x] `progress/current.md` actualizado, con rama, objetivo, restricciones y estado.

## Checklist C3 — Arquitectura
- [x] N/A por capas: el diff de aplicación es **un fichero de test**. Cero diff de producción (R5), así que no hay frontera domain/application/infrastructure que cruzar.

## Checklist C4 — TDD
- [x] Cada `R<n>` tiene test que lo nombra, o su ausencia declarada: `#109 R1` nombra el R-id en el título. R4 y R5 **sin test, declarado en la spec antes del handoff** (§Qué firma el humano, punto 5) y en `traceability.md`.
- [x] Historial test-primero, **verificado commit a commit corriéndolo yo**, no leyendo el reporte:

| Commit | Qué contiene | Medido por mí |
|---|---|---|
| `97f78f41` | recorte nuevo **+ mutación V4 versionada en producción** | `exit=1`, 2 failed / 36 passed |
| `869441b9` | revierte la mutación | `exit=0`, 38/38 |

  El rojo de `97f78f41` es **por su propia aserción**, no incidental:

```
● #107 R5 › #109 R1: acota el bloque de fuente al tag de apertura propio del meal-toggle
    expect(received).toMatch(expected)
    Expected pattern: /style=\{\(\{ pressed \}\) => \(\{\s*opacity: pressed \? 0\.8 : 1,?\s*\}\)\}/
    Received string:  "<Pressable
                            testID={`meal-toggle-${index}`}
                            ...
                            className=\"min-h-11 justify-center\"
                            onPress={() => void toggleMeal(mealTime, served)}
                          >
                            "
    > 792 |     expect(block).toMatch(
```

  El `Received string` es prueba directa de R1: el bloque es **exactamente el
  tag de apertura del `meal-toggle`**, sin hijos dentro.

- [x] **La reversión deja `food.tsx` byte a byte como en `73f14d5e`** — no por diff, por hash de blob:

```
73f14d5e -> cb4d396b8d6907933fa575aac0aad60e47c620d2
97f78f41 -> aec99540c1c904616c8630d7bbc6ce60d274a127   ← V4
869441b9 -> cb4d396b8d6907933fa575aac0aad60e47c620d2   ← idéntico a la base
c8d3d126 -> cb4d396b8d6907933fa575aac0aad60e47c620d2
44feb5a8 -> cb4d396b8d6907933fa575aac0aad60e47c620d2
```

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (la única aparición de la palabra es la línea de la regla).
- [x] Commits con formato correcto y R-ids: `test(mobile): … (R1,R2)` ×2, `docs(mobile): … (R4)`, `docs(mobile): … (R3,R5)`. Inglés, como manda `docs/conventions.md` §Commits.
- [x] Los tres hashes de `traceability.md` siguen siendo ancestros de HEAD (`git merge-base --is-ancestor` → OK ×3). No se rebaseó (lección #87).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla `[X]` marcada.
- [x] **La spec no se tocó después de la firma `090d4a8f`**: `git diff 090d4a8f HEAD --stat -- specs/…/requirements.md` → sin salida. Lo único que cambió bajo `specs/` tras la firma es `traceability.md` (los hashes, que los rellena Codex por diseño).
- No audité Notion, según encargo.

## Checklist C7 — Sin código huérfano
- [x] N/A en sentido estricto: la feature **edita** un `it`, no reemplaza ningún módulo. Las **dos patas de `#107 R5` siguen vivas** (verificado abajo, §Alcance).

## Checklist C8 — UI móvil
- [x] N/A justificado: diff de producción vacío, cero superficie de UI. `docs/ui-guidelines.md` no tiene nada que aplicar a un candado de fuente.

---

## Las diez sondas, repetidas por mí

Todas con el árbol en HEAD, mutando solo `food.tsx`, restaurando entre sonda y
sonda, sin pipes:

```bash
bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' --silent --verbose
```

| # | Mutación | Exigido | `#109 R1` | pata de árbol | exit | ¿coincide con Codex? |
|---|---|---|---|---|---:|---|
| — | baseline sana | verde | ✓ | ✓ | 0 | sí (38/38) |
| V1 | `style` quitado | rojo | ✕ | ✕ | 1 | sí |
| V2 | receta en hermano **anterior** | rojo | ✕ | ✕ | 1 | sí |
| V3 | receta en hermano **posterior** | rojo | ✕ | ✕ | 1 | sí |
| V4 | receta en `Pressable` **anidado** | rojo | ✕ | ✕ | 1 | sí — **el agujero B2 está cerrado** |
| V5 | anidado **sin** receta, propia intacta | verde | ✓ | ✓ | 0 | sí |
| V6 | receta en una línea | verde | ✓ | ✓ | 0 | sí |
| V7 | `0.8` → `0.5` | rojo, árbol verde | ✕ | **✓** | 1 | sí |

**V7 reproduce.** Árbol verde / fuente rojo, 1 failed / 37 passed. La premisa
que sostiene la existencia del candado de fuente está medida, no supuesta.

## Las siete sondas propias sobre el recorte nuevo

El recorte pasó de `<Pressable`…`</Pressable>` a `<`…`<`, así que el vecindario
del ancla cambió y hay que volver a preguntar por los dos límites. Lo probé, no
lo razoné:

| # | Forma de código | `#109 R1` | Lectura |
|---|---|---|---|
| H1 | `<` en el tag **después** del ancla y antes de `style` (`disabled={… && 0 < 1}`) | **ROJO** | el límite documentado; falla al lado seguro ✔ |
| H2 | `<` en el tag **antes** del ancla (`accessible={0 < 1}`) | verde | verde **correcto**: el bloque sigue siendo solo del `meal-toggle` ✔ |
| H3 | el ancla deja de ser el primer atributo (movida tras `style`) | verde | verde **correcto** ✔ |
| H4 | componente renombrado a `<Animated.Pressable` + señuelo con receta antes | **ROJO** | el viejo daba **VERDE falso** (bloque de 5004 chars) ✔ |
| H5 | la receta como **cadena hija** antes del primer hijo elemento | **verde** | **falso verde — ver H-1 abajo** |
| H6 | `meal-toggle` autocerrado sin hijos + receta en hermano posterior | **ROJO** | el límite de atrás no importa nada ajeno ✔ |
| H7 | ancla **duplicada** en un comentario anterior + señuelo con receta | **ROJO** | el viejo daba **VERDE falso** ✔ |

**Respuesta a tu pregunta de B2 (¿puede el límite de atrás señalar un `<`
ajeno?): no.** `lastIndexOf('<', anchor)` no puede rebasar hacia atrás el `<`
del propio tag, porque ese `<` está siempre entre el ancla y cualquier `<`
anterior. El límite solo puede moverse **hacia delante**, y encoger nunca
fabrica un verde (H1, H2). Buscar cualquier `<` en vez de `<Pressable` resultó
ser **más** seguro, no menos: es justo lo que cierra H4 y H7, donde el recorte
viejo mentía.

---

## Hallazgos NO bloqueantes

### H-1 — el candado nuevo trae un agujero residual, pero hay que construirlo a propósito

`mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx:791-794`. El bloque
va del `<` del tag al `<` del primer hijo, así que **todo lo que haya entre el
`>` de cierre del tag y el primer hijo elemento cuenta para la regex** —
incluida una cadena hija. Reproducido (sonda H5): con la receta real quitada del
`meal-toggle` y plantada como texto,

```jsx
<Pressable testID={`meal-toggle-${index}`} … /* sin receta */ >
  {'style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}'}
  <Text …>
```

el candado da **VERDE** (el bloque impreso lo confirma: 696 chars, la cadena
dentro). El recorte viejo también daba verde aquí, así que **no es una
regresión**.

**Aplico el criterio de #106 (¿lo pisa un descuido o hay que construirlo?):
hay que construirlo a propósito.** Exige (i) escribir la sintaxis de atributo
JSX exacta dentro de un literal de cadena, (ii) que ese literal sea hijo del
`meal-toggle`, (iii) antes del primer hijo elemento y (iv) quitar la receta
real. Y no pasa desapercibido: **25 de los 38 tests del fichero se ponen rojos**
(la pata de árbol entre ellos), porque el literal se renderiza en pantalla.
→ **Deuda registrable, no rebote.**

Comando que lo destapa:
```bash
node -e "const s=require('fs').readFileSync('src/app/(tabs)/food.tsx','utf8'),a=s.indexOf('testID={\`meal-toggle-\${index}\`}');
console.log(s.slice(s.lastIndexOf('<',a), s.indexOf('<',a)))"
```

### H-2 — la documentación de R4 presenta su límite como si fuera el único

`docs/conventions.md:205-207` dice «**El** límite conocido es un `<` dentro del
propio tag». H-1 es un segundo límite, y no es de la misma familia: no viene de
«ensanchar la ventana» sino de que la ventana, tal como está definida, incluye
el texto entre `>` y el primer hijo. La frase es correcta en lo que afirma pero
se lee como exhaustiva, que es justo la lectura que B8 quería evitar en quien
copie el patrón. **Arreglo: una frase.** No lo impongo — R4 pide nombrar el
patrón, su regla y su modo de fallo, y los tres están.

### H-3 — riesgo de conflicto con #108 (informativo, no bloqueante)

`origin/main` está **hoy en `73f14d5e`**, que es exactamente la base de esta
rama: no hay divergencia y `git merge-tree --write-tree HEAD origin/main`
devuelve exit 0 sin conflictos. **Mergea limpio ahora mismo.**

El riesgo es de orden, no de contenido (lección «el reparto de ficheros caduca
al mergear», #98/#94): si **#108 mergea primero**, `docs/conventions.md` §Tests
es superficie compartida — #109 le añade la subsección `:198`, y #108 toca
`design-drift.test.ts` y `home/index.test.tsx`. `home/index.test.tsx` no lo toca
#109, así que el único punto de roce posible es `conventions.md`. Trivial de
resolver, pero mejor mergear #109 antes si puede ser.

---

## Verificaciones que me pediste, una a una

| Punto del encargo | Resultado |
|---|---|
| 1. C4 commit a commit, rojo real y propio | ✔ `97f78f41` exit 1 por `toMatch`; revert byte a byte por hash de blob |
| 2. Las diez sondas repetidas | ✔ las diez coinciden; **V7 reproduce** (árbol verde / fuente rojo) |
| 3. El agujero del recorte nuevo | ✔ siete sondas; uno residual (H-1), a propósito, no regresión |
| 4. R4 sin test: ¿sirven los dos sitios? | ✔ sí, con la matización H-2 |
| 5. Alcance: las cinco prohibiciones | ✔ las cinco (tabla abajo) |
| 6. ¿Se aflojó algo? | ✔ no (abajo) |
| 7. C6: spec intacta tras la firma | ✔ |
| 8. `./init.sh` por mí, exit sin pipe | ✔ **exit 0** |
| 9. Conflicto con #108 | ✔ mergea limpio; ver H-3 |

### 4 — R4: ¿sirven de verdad los dos sitios?

**Sí.** Los dos nombran las tres cosas que pide R4:

- **Call-site** (`food.test.tsx:787-790`): nombra el patrón («the meal-toggle's
  own opening tag, from `<` to `<`»), la regla (por qué **no** terminar en
  `</Pressable>`, con la causa: «let a nested Pressable lend it a foreign
  style»), la trazabilidad a la deuda (`B2, #106/#107`) y el **modo de fallo**
  con ejemplo (`disabled={a < b}` → «fail red, never green»).
- **`docs/conventions.md:198-210`**, bajo §Tests: nombra el patrón, la regla
  imperativa («no recortes de `<Tag>` a `</Tag>`»), la asimetría que lo hace
  seguro (encoger = rojo seguro; ensanchar = verde falso), el límite conocido,
  **dónde ya vive el patrón** y **el gemelo que queda por migrar**, con su dueño
  (#108). Eso último es exactamente lo que pedía B8.

**Verifiqué las dos referencias de línea que da la doc** — un documento que
apunta a líneas equivocadas no sirve:
- `consistency-classnames.test.ts:309-311` → correcto, ahí está el `source.slice(source.lastIndexOf('<', use.index), use.index)`.
- `home/index.test.tsx:3355-3359` → correcto, ahí está el gemelo con `lastIndexOf('<Pressable')`/`indexOf('</Pressable>')`.

La afirmación del comentario **no la di por buena: la planté** (sonda H1) y sale
roja, como dice.

### 5 — Alcance

`git diff 73f14d5e HEAD --stat` toca 11 ficheros, y **el único de aplicación es
`food.test.tsx`**. Los otros diez son `specs/`, `progress/`, `docs/`,
`feature_list.json` y `.claude/agents/leader.md`.

| Prohibición | Estado |
|---|---|
| `src/screens/home/index.test.tsx` (de #108) | **INTACTO** |
| Claves de copy (`i18n/catalog.ts`, `language-provider.test.tsx`) | **INTACTOS** — el candado de longitud de catálogo sin tocar |
| Dependencias nuevas (`package.json`, `bun.lock`) | **INTACTOS** |
| Extraer un helper | **no se extrajo** — el recorte sigue inline en el call-site |
| Borrar una pata de `#107 R5` | **las dos vivas** — el `it` de árbol sin tocar, el de fuente editado |

(De regalo: `design-drift.test.ts` también intacto, y su guard de hex no alcanza
a este fichero — el título `#109 R1` se escribe entero y la suite pasa.)

### 6 — ¿Se aflojó alguna aserción?

**No.** El diff de `food.test.tsx` es **un solo hunk**:

- el `it` se renombra a `#109 R1: …` (prefijo de R-id, `conventions.md:157`),
- se añaden 4 líneas de comentario (R4),
- cambian **las dos líneas del recorte**.

La **regex no cambia** (aparece como contexto, idéntica). El `it` de árbol
(`expone opacidad 1 en reposo…`) aparece solo como contexto: **no se tocó**.
Cero aserciones añadidas, cero quitadas, cero relajadas. Delta de suites y tests
= **+0 / +0**, como declara el reporte.

---

## Output de `./init.sh`

Corrido **por mí, en primer plano**, no con Monitor. `pgrep` limpio antes de
arrancar en los cinco worktrees (la corrida de jest de **#108** en
`Pet-Tracker-wt-ui` ya había terminado; esperé a que cayera antes de lanzar).
`mobile-pet-tracker/.expo/types/router.d.ts` borrado antes. Duración **5m51s**
(17:48:50 → 17:54:41 UTC).

**Exit code medido sin pipe:**

```bash
./init.sh > init_109.log 2>&1
echo "EXIT_CODE_SIN_PIPE=$?"   # -> 0
```

```
EXIT_CODE_SIN_PIPE=0
```

| Pata | Resultado |
|---|---|
| Harness (node:test) | 28/28, 5/5, 15/15 — 0 fail |
| Tests backend | **170 suites, 1295 tests** ✅ |
| CDK | **2 suites, 14 tests** ✅ |
| **Mobile** | **77 suites, 1396 tests, 1 snapshot** ✅ |
| Migraciones | applied successfully |
| E2E | **27/30 suites (3 skipped), 384 passed, 8 skipped** ✅ |

`grep -c FAIL init_109.log` → **0**. Cero regresiones: el mobile coincide
exactamente con el 77/1396 que reporta Codex.

---

## Observaciones menores (ni bloquean ni piden acción)

- Codex vuelve a reportar que **`expo-overview` no estaba en su catálogo de
  skills** — es la reaparición de **B5** del review de #106. Aquí no tiene
  consecuencia (diff de producción vacío, cero superficie de UI), pero la
  instrucción del handoff siguió sin poder cumplirse. Merece cerrarse antes del
  próximo handoff móvil que **sí** toque producción.
- El frontmatter de `traceability.md`/`design.md` sigue en `spec_ready` con
  `requirements.md` en `approved`. Es el patrón que ya traen otras specs del
  repo (`mobile-meals-bar-motion` igual), así que no lo cuento como defecto.
- No hay prueba de humo, y es correcto: sin diff de producción no hay nada
  observable en dispositivo. La spec lo declara y lo firma el humano (punto 4).

## Estado del árbol al terminar

`git status --short` vacío. Todas las mutaciones de sonda se revirtieron con
`git checkout HEAD -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'` y se
verificó el blob final contra `73f14d5e` (`cb4d396b…`, idéntico).
