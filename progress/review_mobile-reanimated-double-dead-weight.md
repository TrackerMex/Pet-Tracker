# review: mobile-reanimated-double-dead-weight (#110)
Fecha: 2026-09-22
Veredicto: **APROBADO**

Revisor: subagente `reviewer`. Base de comparación `origin/main` (= `e4c9ea99`,
ancestro directo de HEAD `4af4a510`). Todas las sondas se corrieron en este
árbol, sin pipe, y el árbol quedó limpio (`git status --porcelain` vacío).

Skills cargadas por el reviewer (obligatorio por `CLAUDE.md` §UI móvil):
`expo:expo-overview` y, por ruta, `expo:expo-animation`. **Ninguna contradice
la spec ni la implementación** (detalle en Observación NB-5).

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`#110`, verificado sobre `feature_list.json`)
- [x] `progress/current.md` actualizado (commits `b15c7cd6` y `4af4a510`)

## Checklist C3 — Arquitectura
- [x] N/A justificado: `docs/architecture.md` (domain/application/infrastructure)
      no aplica a `mobile-pet-tracker/`, y esta feature no añade lógica ninguna.
      Se sustituye por la restricción dura «cero producción», verificada abajo.

## Checklist C4 — TDD
- [x] Cada R\<n\> tiene al menos un test o evidencia que lo nombra
- [x] Historial test-primero, no todo junto — **pares rojo→verde reales**:
      `b15c7cd6` (+24 líneas de test) → `52f553ab` (−19, el borrado);
      `e9f07831` (+13) → `1db9f6ff` (−4). Once commits, ninguno mezcla
      aserción y borrado.

### R1 y R2: rojo real, verificado por mí (no acepto el reporte)

Hice checkout del fichero en cada commit rojo, corrí, y restauré:

| Sonda | Comando | Resultado |
|---|---|---|
| R1 rojo | `git show b15c7cd6:…/index.test.tsx > $F` + `bunx jest --runTestsByPath src/screens/home/index.test.tsx -t 'conserva la clase base del Skeleton de HeroUI'` | **EXIT=1**, `1 failed / 138 skipped / 139 total` |
| R2 rojo | ídem con `e9f07831`, `-t 'conserva el Animated.View real de Reanimated'` | **EXIT=1**, `1 failed / 139 skipped / 140 total` |

Los dos fallan **por su propia aserción**, no por `ReferenceError` ni por
mutación de un doble:

```text
● R1 (…): conserva la clase base del Skeleton de HeroUI
    Expected substring: "skeleton__root"
    Received string:    "h-12 w-full rounded-card"

● R2 (…): conserva el Animated.View real de Reanimated
    expect(received).not.toBe(expected) // Object.is equality
    Expected: not [Function View]
    > 4000 |     expect(Animated.View).not.toBe(View);
```

### R3 y R4: vía (b), declarada antes del handoff — verificada

La spec declaró la vía (b) en §Vías de C4 **antes** del handoff (commit
`fbf2557b`, anterior a la firma `83590ab1`), como exige `CHECKPOINTS.md` C4.
No son tests que nazcan verdes: son requisitos de verificación.

- **R3** se cierra por mutación + `git diff` acotado. Lo comprobé por las dos
  vías (abajo, §Hallazgo V-1 y V-2).
- **R4** se cierra por `grep` sobre `docs/conventions.md`: la subsección existe
  (`docs/conventions.md:235-245`) y nombra los cuatro gemelos con su
  clasificación y dueño.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (4 filas, las 4 con hash)
- [x] Los 4 hashes son **ancestros de HEAD** — `git merge-base --is-ancestor`
      OK para `52f553ab`, `1db9f6ff`, `2b37b65d`, `4ce889ca`. No hubo rebase
      que los invalidara (lección de #87 respetada).
- [x] Formato de commit conforme a la excepción que la propia trazabilidad
      declara: sin producción, R1-R3 van como `test(mobile): … (Rn)` y R4 como
      `docs(mobile): … (R4)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y Gate 1 marcado `[X]`
- [x] **Gate 2 sigue sin marcar** (`- [ ]`), como debe ser: el escenario que lo
      activa no se dio (#62 R8 nunca se puso rojo fuera de la mutación).
- [x] La spec **no se editó en su contenido** tras la firma `83590ab1`.
      Único toque posterior: `4af4a510` cambia
      `- [ ] Gate 2 … (fecha: ____)` → `- [ ] Gate 2 … (no aplica; fecha: 2026-09-22)`.
      **Es lo que la propia spec instruye** («Si no paró, escribir "no aplica"
      y la fecha»). La casilla sigue desmarcada y ningún requisito cambió.

## Checklist C7 — Sin código huérfano
- [x] El borrado arrastró su declaración huérfana: las **tres** piezas
      (`jest.mock('heroui-native')`, el `const { View } = requireActual`, y
      `default: { ...actual.default, View }`) se fueron juntas. No queda `View`
      sin uso: `bunx eslint` y `tsc --noEmit` salen limpios dentro de `init.sh`.
- [x] N/A para «componentes reemplazados»: la feature no reemplaza nada.

---

## Hallazgos de verificación (todos pasan)

### V-1 — La tabla de fidelidad de la spec reproduce **exacta**
Sonda: `describe` transitorio al final del fichero que vuelca el nodo
`home-loading` forzando un rojo, corrido en HEAD y revertido acto seguido
(`git checkout HEAD -- $F`, árbol limpio confirmado). Esta sonda **no toca el
`it` de #62 R8**.

```text
Received: {
  "className": "skeleton__root h-12 w-full rounded-card",
  "style": "[{\"borderCurve\":\"continuous\"},null]",
  "animProps": ["entering","exiting","onLayout","jestAnimatedStyle","jestAnimatedProps","collapsable"],
  "toBeWouldPass": false
}
```

Coincide carácter por carácter con la tabla de `requirements.md` §Estado medido.
El `{ borderCurve: 'continuous' }` que `expo:expo-native-ui` da por convención
para toda esquina redondeada no-cápsula **estaba efectivamente perdido en los
138 tests y ahora se recupera en los 140**. La pérdida de fidelidad era real.

### V-2 — #62 R8: las **dos** mediciones de la spec se reproducen
1. **No se pone rojo al quitar el doble**: en HEAD el fichero sale
   `EXIT=0, 140 passed`, con el `it` de #62 R8 incluido. Confirmado.
2. **El doble no estaba cegando la aserción**: la spec lo atribuye a que usa
   `toContain` y no `toBe`. **Reproduce**: el campo `toBeWouldPass` de V-1 sale
   **`false`**, es decir `className !== 'h-12 w-full rounded-card'` — con `toBe`
   el `it` se habría puesto rojo al quitar el doble. La medición de la spec era
   honesta, no falsa.
3. **El `it` de #62 R8 no se tocó**: el diff completo del fichero contra
   `origin/main` son 3 borrados en la cabecera (`:124-154`) y 2 `describe`
   añadidos al final. Cero líneas en el bloque de #62 R8.
   `git diff origin/main HEAD -- …/index.test.tsx` no muestra ninguna línea
   `±` entre `describe('#62 R8:` y su cierre.

### V-3 — Los dos tests nuevos enrojecen ante su propia mutación
La mutación correcta de un test de fidelidad de dobles es **restaurar el doble**,
que es exactamente el estado de los commits rojos:

| Test nuevo | Qué vigila | Mutación aplicada | Resultado |
|---|---|---|---|
| R1 | la clase base `skeleton__root` | doble de `heroui-native` restaurado (`b15c7cd6`) | **ROJO** (V-1 arriba) |
| R2 | identidad de `Animated.View` | `default: { …actual.default, View }` restaurado (`e9f07831`) | **ROJO** |

Ninguno es tautológico: `skeleton__root` **no existe en producción**
(`grep -rn "skeleton__root" src/` solo lo encuentra en la línea del propio
test, `:3982`); viene de
`node_modules/heroui-native/src/components/skeleton/skeleton.styles.ts`
(`heroui-native@1.0.8`, fijado en `package.json`). Y R2 compara dos símbolos de
terceros entre sí, ninguno importado de producción.

### V-4 — Ningún doble borrado estaba candando algo en silencio
Riesgo central de la feature. Inventarié **todas** las aserciones que tocan un
`Skeleton` en la suite, no solo `home-loading`:

| Línea | Aserción | ¿Cambia de significado al quitar el doble? |
|---|---|---|
| `:419` | `getByTestId('home-loading')).toBeVisible()` | No — pasa por presencia en los dos mundos |
| `:1297` | `#62 R8`, `.className` `toContain('h-12 w-full rounded-card')` | No — ver V-2 |
| `:1668-1669` | `weekly-activity-skeleton` `.className` `toContain('w-full')` / `('rounded-card')` | No — el real **antepone** `skeleton__root`, `toContain` sigue discriminando lo mismo |
| `:1670` | `weekly-activity-skeleton` `.props.style` **`toEqual`** | **Mirado con lupa.** Era el candidato a romperse (el falso normalizaba `style` a `[props.style]`; el real da `[{borderCurve},{height:408}]`). No rompe **ni se debilita**: ya estaba escrita como `expect.arrayContaining([expect.objectContaining({ height: expect.any(Number) })])`, igual de laxa antes y después. No fue tocada por #110 |
| `:3211` | `reminders-section-skeleton` `.className` `toContain('h-16 w-full rounded-card')` | No — mismo caso que `:1668` |
| `:568,:815,:1007,:1412` | `pet-hero-skeleton` `toBeVisible()` | No — presencia |

**Conclusión: ninguna aserción existente pasa ahora "por otra razón".** Las seis
que inspeccionan clases usan `toContain`, y el real solo **añade** un prefijo;
la única que usa `toEqual` lo hace sobre matchers laxos. Ni una perdió poder
discriminante.

### V-5 — Los cinco guards de `design-drift.test.ts`, corridos (no razonados)
```
bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts' --silent
EXIT=0 · Test Suites: 1 passed · Tests: 41 passed, 41 total
```
41/41, idéntico a la base: #110 no añade ni quita ningún test ahí. Además
confirmé la forma de los cinco (`:207,:253,:272,:294,:315`): los cinco son
`expect(violations).toEqual([])` sobre una regex de **prohibición**, así que un
borrado solo puede quitar coincidencias, nunca añadirlas.

### V-6 — La desviación firmada: respetada, y su razón **sigue siendo cierta**
- **Respetada.** Los dos títulos nuevos son
  `R1 (mobile-reanimated-double-dead-weight): …` y
  `R2 (mobile-reanimated-double-dead-weight): …`. Codex **no** los "arregló" a
  `#110 R1`, **no** partió ningún literal, y no añadió un tercer `'#' + '…'`.
- **La razón se sostiene.** Ejecutada la regex real del guard:
```
/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i
  "#110 R1: x"                                    -> true    ← pondría los 5 rojos
  "R1 (mobile-reanimated-double-dead-weight): x"  -> false   ← la forma elegida es segura
  "#62 R8: y"                                     -> false
```
  Es decir: `#110` **sí** casa (`1`,`1`,`0` son dígitos hex) y la forma firmada
  **no**. La desviación estaba bien motivada y bien firmada.

### V-7 — Alcance: las seis prohibiciones, verificadas
`git diff origin/main HEAD --stat` toca 10 ficheros; bajo `mobile-pet-tracker/`
**solo** `src/screens/home/index.test.tsx`.

| Prohibición | Verificación | Resultado |
|---|---|---|
| Tocar producción | `--name-only` bajo `mobile-pet-tracker/src/` | Solo `index.test.tsx`. `src/screens/home/index.tsx` **idéntico** |
| `:3790` / `:3835` (#108) | los literales viven hoy en `:3767` y `:3812` (desplazamiento −23 = las líneas borradas de la cabecera); `grep -cE "^[+-].*'#' \+ '10"` sobre el diff | **0** líneas cambiadas |
| `:3350-3363` (#112) | `grep -cE "^[+-].*reminders-see-all"` sobre el diff | **0** líneas cambiadas |
| Dependencias nuevas | `--name-only` filtrado por `package.json`/`bun.lock` | ninguno |
| Claves de copy | ídem por `catalog.ts`/`language-provider` | ninguno; el candado de longitud del catálogo intacto |
| Ampliar a los 7 gemelos | ídem por `pet-hero-header`/`layout.test`/`theme-transition`/`weekly-activity-chart` | **ninguno tocado**. El load-bearing (`pet-hero-header.test.tsx:44-58`, 4 rojos si se quita) sigue en su sitio |

### V-8 — Merge con `origin/main`
`git merge-tree --write-tree HEAD origin/main` → **exit 0, sin conflictos**, y
`origin/main` es **ancestro** de HEAD (fast-forward limpio). No bloqueante y
además favorable.

---

## Observaciones no bloqueantes

- **NB-1 — `borderCurve` no queda candado por ningún test.** R1 canda
  `skeleton__root` (clase), no `style`. El `{borderCurve:'continuous'}` se
  recupera de facto en los 140 tests (medido en V-1), pero si una subida de
  `heroui-native` dejara de ponerlo y mantuviera la clase, **nada se pondría
  rojo**. R1 no lo promete, así que no es incumplimiento: es una grieta que
  merece una línea en la próxima feature de fidelidad de dobles.
  *Comando que lo destapa:* la sonda de V-1 con `style` mutado a `[null]`.

- **NB-2 — `docs/conventions.md:235` lleva el literal `#110` en el encabezado**
  (`### Inventario de dobles de HeroUI y Reanimated (#110)`). **No es una
  violación de la Restricción 4**, que solo prohíbe `#110` en títulos de test de
  `index.test.tsx`. Verificado que es inocuo: `design-drift.test.ts` solo lee
  `src/`, `docs/ui-guidelines.md`, `package.json` y una `traceability.md`, nunca
  `conventions.md`; y los dos tests que sí leen `conventions.md`
  (`hosting-artifacts.test.ts:90`, `hero-header-amendments.test.ts:52`) son de
  presencia de marcador, no de regex de drift. Lo dejo escrito para que nadie lo
  "arregle" luego creyendo que incumple algo.

- **NB-3 — El diff del PR incluye un cambio de `docs/conventions.md` que no es
  de Codex.** El párrafo de atribución de #112 (`:218-225`) lo reescribió
  `e9212171 spec(#110): resuelve la disputa del gemelo`, **fase de spec, anterior
  a la firma `83590ab1`**. Es trabajo legítimo del `leader` (`CLAUDE.md` permite
  editar `docs/`), pero conviene saber que viaja en este PR y no salió de la
  implementación.

- **NB-4 — La ganancia de fidelidad es mayor que la que midió la spec.**
  `index.test.tsx` **no mockea** `pet-hero-header`, y `HomeScreen` lo renderiza
  (`src/screens/home/index.tsx:307`). Al caer el doble de `heroui-native`, los
  tres `Skeleton` de `src/components/pet-hero-header.tsx:159,238,239` también
  pasan a ser reales **dentro de esta suite**. La tabla de la spec solo midió
  `home-loading`. Todo verde. Matiz útil para la feature futura (F) del
  inventario: en la suite de home esos componentes ya corren contra el real; el
  doble load-bearing solo lo es en `pet-hero-header.test.tsx`.

- **NB-5 — Skills: ninguna contradice la spec.** Cargué `expo:expo-overview`
  (obligatorio) y, por su mapa, `expo:expo-animation` — la única con superficie
  sobre Reanimated. No dice nada sobre dobles de jest de Reanimated ni
  desaconseja montar el `Animated.View` real en tests; las props
  `jestAnimatedStyle`/`jestAnimatedProps` que aparecen en V-1 son las del preset
  de jest de Reanimated, señal de que el real se está montando bien. Confirmo
  también el punto que trae el `leader` desde `expo:expo-native-ui`:
  `borderCurve: 'continuous'` es convención para esquinas redondeadas
  no-cápsula, luego perderlo en 138 tests **era** pérdida real de fidelidad.
  Que la spec prohibiera skills a **Codex** fue correcto: ninguna cubre esto.

---

## Output de `./init.sh`

Corrido por mí, en primer plano, redirigiendo a fichero (**sin pipe**, para que
el código de salida sea el de `init.sh` y no el de `tail` — lección de
«Exit code tras un pipe»). `pgrep` previo: sin `init.sh` de otra sesión en
vuelo; la corrida de jest de #111 en `Pet-Tracker-wt-ui` ya había terminado.

```
EXIT=0

══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...        ✅ node / pnpm / bun disponibles
→ Verificando variables de entorno...
→ Instalando dependencias...
→ Verificando coherencia del harness...
→ Build...
→ Ejecutando tests...

  backend-pet-tracker   Test Suites: 170 passed, 170 total
                        Tests:       1295 passed, 1295 total
  infra                 Test Suites: 2 passed, 2 total
                        Tests:       14 passed, 14 total
  mobile-pet-tracker    Test Suites: 77 passed, 77 total
                        Tests:       1398 passed, 1398 total
                        Snapshots:   1 passed, 1 total
                        Time:        40.436 s
  ✅ Tests pasados

→ Tests e2e...
                        Test Suites: 3 skipped, 27 passed, 27 of 30 total
                        Tests:       8 skipped, 384 passed, 392 total

→ Lint...               ✅
→ Typecheck...          ✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 92/110 completadas | 17 pendientes
```

Los dos números de cierre que pedía el `leader` se confirman de forma
independiente: **mobile 77 suites / 1398 tests** (base 77/1396 → **+2 tests,
+0 suites**) y el fichero objetivo **140 tests** (base 138 → **+2**), medido
aparte con `bunx jest --runTestsByPath 'src/screens/home/index.test.tsx'`,
**EXIT=0**.

Antes de cualquier `tsc` borré `mobile-pet-tracker/.expo/types/router.d.ts`
(lección de tipos obsoletos de expo-router). Todas las rutas de jest se pasaron
con `--runTestsByPath`, que no es regex, así que el paréntesis de `(tabs)` no
pudo saltarse ficheros en silencio.

---

## Veredicto

**APROBADO.** Cero hallazgos bloqueantes.

La feature hace exactamente lo que prometió y ni un gramo más: borra tres piezas
de doble muerto, recupera el `Skeleton` real y el `Animated.View` real en 140
tests, y lo canda con dos tests que **enrojecen ante su propia mutación**. Las
seis prohibiciones de alcance se respetan, la desviación firmada se respeta y su
motivo sigue midiéndose cierto, el `it` de una spec firmada ajena queda intacto,
y el Gate 2 sigue sin marcar porque su escenario no se dio.

Como esta feature **no tiene prueba de humo** (cero diff de producción, nada
observable en dispositivo), dejo constancia de que este veredicto se apoya
íntegramente en sondas ejecutadas, no en el reporte del implementador: cada
número del reporte de Codex fue re-medido aquí y **ninguno discrepó**.

Las cuatro observaciones no bloqueantes (NB-1 a NB-4) son material para el
`leader`, no condiciones de cierre.
