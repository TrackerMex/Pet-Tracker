# review: mobile-kcal-consumed-bar (#113)
Fecha: 2026-09-23T17:35Z
Veredicto: **RECHAZADO**

Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/113-mobile-kcal-consumed-bar`, HEAD `15e43269`. Revisado contra la
spec firmada (`e4a4841e`) y el handoff (`12298582`). Skills cargadas:
`expo:expo-overview`, `expo:expo-animation`, `expo:expo-native-ui` y
`expo:expo-design-system`.

**En una línea:** el código de producción es correcto y cumple la spec, y los
cinco rojos son reales, pero **3 de mis 14 mutaciones sobreviven con la suite
verde**. Hay una zona ciega: nadie mira el `style` de los nodos que no son
texto (el relleno animado y el carril). El agujero viene del test que
prescribe la spec, no de un error de Codex, y se cierra solo con cambios en el
test (propuesta verificada en H1).

---

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#113). #95 está `done` y #114 `pending`.
- [x] `progress/current.md` describe la sesión activa de #113.
- [x] `progress/history.md` tiene la entrada de cierre de #95, que es la sesión anterior en este worktree.

## Checklist C3 — Arquitectura
- [x] N/A a capas: la app móvil es solo presentación (design §0). El cambio va en un tipo del cliente HTTP, una pantalla, el catálogo y los tests.
- [x] No toca `backend-pet-tracker/`: `git diff --name-only 12298582 HEAD` no lista ningún fichero de backend.
- [x] No hay lógica de negocio nueva en la UI. `kcalPct` es presentación y el dato se lee del backend (#104), nunca se deriva de las franjas. Lo prueban el caso 1420/890 y la mutación M12.

## Checklist C4 — TDD
- [x] Cada R1-R5 tiene tests con el prefijo `#113 R<n>:` y el sufijo `(mobile-kcal-consumed-bar #113)`, con títulos literales de la spec. R6 es del humano.
- [x] Diez commits alternos, cada rojo antes de su verde, y ninguno junta test e implementación. Los rojos solo tocan tests y `traceability.md`. Los verdes llevan la implementación y los ajustes que tasks.md les asigna: las fixtures `makePlan` en el verde de R1, y `ui-copy-table.ts` y la fila de la tabla de idioma en el verde de R3.
- [x] **Rojos verificados por mí**: checkout de cada commit rojo y ejecución de sus tests (logs en el scratchpad de la sesión, `reds/`):

| Commit rojo | Suites ejecutadas | Resultado | Motivo del rojo |
|---|---|---|---|
| `c752795e` R1 | food + home, `-t '#113 R1\|#98 R1'` | 2 failed, exit=1 | `slice(-2)` diff (`generatedAt, servedToday`); `Expected length: 13 / Received length: 12` |
| `a408be18` R2 | food.test entero | 8 failed / 40 passed, exit=1 | (a) `Expected length: 2 / Received: 1`; las 7 filas de (b) con `Unable to find … food-plan-consumed`. (c) pasa: es la rama negativa, como dice la spec |
| `59220c29` R3 | food + language-provider + ui-language | 5 failed / 80 passed, exit=1 | `accessible` `undefined`; clave `undefined`; 304 frente a 303; 38 frente a 37 |
| `a91b6af7` R4 | food.test entero | 1 failed / 51 passed, exit=1 | `Expected ObjectContaining {duration: 250, reduceMotion: "system"} / Received: undefined` |
| `a73390f7` R5 | food.test entero | 2 failed / 51 passed, exit=1 | `Received: "skeleton__root h-32 w-full rounded-card"` (R5 y el candado de carga) |

- [x] Ningún rojo falla por `ReferenceError`, `SyntaxError` ni módulo ausente: el grep sobre los cinco logs sale vacío. Ninguno falla por mutar un doble.
- [x] Verdes verificados: `f4b0c388`, `5523cd29`, `40bfb708`, `cd2952e8` y `82568138` dan 5 suites verdes, con 235, 244, 247, 248 y 249 tests y exit=0 (food, home, meal-schedule, language-provider, ui-language).
- [x] No hay requisitos de verificación: los cinco tienen rojo real.

## Checklist C5 — Trazabilidad
- [x] R1-R5 rellenas en `traceability.md`, con título literal, hash rojo y hash verde. Los diez hashes son ancestros de HEAD (`git merge-base --is-ancestor`). La tabla de candados ajenos tiene sus siete hashes.
- [x] La fila R6 dice «pendiente del humano». Es el gate humano previsto por la spec, que solo exige R1-R5 al reviewer. No bloquea esta revisión, pero sí el `done`.
- [x] Commits `test(kcal-bar): … (Rn)` y `feat(kcal-bar): … (Rn)` según la convención de la spec. El de cierre es `docs(kcal-bar): …`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md`, `design.md` y `tasks.md` tienen `status: approved`, y la casilla «Aprobado por humano (fecha: 2026-09-23, vía Notion)» está marcada.
- [x] `git diff e4a4841e HEAD -- specs/mobile-kcal-consumed-bar/` solo toca `traceability.md`: pasa de `pendiente` a títulos y hashes en las filas R1-R5 y en las siete de candados, 12+/12−. No cambia ningún requisito.
- [x] La desviación del test de R5 frente al literal de la spec no modifica ningún requisito (juicio en §Desviaciones, D2). Queda una errata de spec que registrar (H2).

## Checklist C7 — Sin código huérfano
- [x] N/A: #113 no reemplaza nada. El anillo de `specs/mobile-food/design.md` D2 sigue sin implementarse y su letra sigue siendo verdad (C5 de requirements).

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Grep-clean de design §6: hex, `[...]`, `StyleSheet`/sombras y radios u opacidades vetados dan salida vacía (exit=1 en cada grep). `package.json`, `bun.lock` y `src/theme/` no tienen diff. `git diff --check` sale limpio.
- [x] No cambian las dimensiones de pantalla ni los insets.
- [x] Skeleton dimensionado: `food-plan-skeleton` pasa a `h-40` (160 px), frente a ≈163 px estimados en D6.
- [x] Reutiliza el `Card` compartido y no crea forks. El bloque es cápsula (`rounded-full`) sin `CONTINUOUS_CORNER`, y `#62 R14` sigue en 2 (lo confirma M11).
- [x] No añade elementos pulsables: el bloque no tiene `onPress`.
- [x] Animación: Reanimated en el hilo de UI (`useAnimatedStyle`) e interrumpible (cada `withTiming` nuevo parte del valor actual). `.get()` y `.set()` solo en el worklet y en el efecto, nunca en render. `ReduceMotion.System`. No mete `Color`, `PlatformColor` ni variables CSS en el estilo animado: solo `width`. Sin háptico nuevo.
- [x] Texto sobre acento a opacidad plena, cifras tabulares en los dos contadores, un solo `progressbar` accesible con clave de catálogo, y `kcal`/`%` en línea según D7 de #65.

Juicio con las skills:
- **expo-animation**: frecuencia ocasional (servir y deshacer), así que la animación estándar está justificada. Propósito: indicar estado. Curva ease-in-out `Easing.bezier(0.77, 0, 0.175, 1)` para un cambio en pantalla, 250 ms (menos de 300). Anima `width` y no `scaleX`. La exención de la skill cubre un relleno absoluto sin hijos; aquí el relleno está en flujo, pero es hijo único de un carril de alto fijo, así que el re-layout se queda en un nodo. Es el mismo razonamiento que se aceptó en #106 y lo firmó el humano en D3. No es hallazgo.
- **expo-native-ui**: `tabular-nums` en contadores y cápsula sin esquina continua. Sin `selectable` por decisión de spec (D5).
- **expo-design-system**: solo tokens. El `/20` es un modificador de un solo uso, no un token nuevo. `250 ms` va por su cuarta repetición sin `--motion-*`: deuda declarada en la spec (§Fuera de alcance), no es hallazgo de #113.

---

## Deltas de candados ajenos (variante «con #95»)

| Candado | Esperado | Observado |
|---|---|---|
| `language-provider.test.tsx` `#65 R12` | 303 → 304, ` + 1` y comentario | `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1`, más `+ 1 de #113 R3 (food.kcalConsumedOfTarget).` al final del comentario ✓ |
| `ui-language.test.ts` `#65 R6` | 37 → 38: suma, comentario y título | `35 + 3 + 1 - 2 + 1`, `// +1 #95 R4, -2 #95 R5, +1 #113 R3` y `'resuelve las 38 ocurrencias normativas'` ✓ |
| `home/index.test.tsx` `#98 R1` | `12 + 1` y `.slice(-3, -1)` | `toHaveLength(12 + 1); // +1 #113 R1`, `.slice(-3, -1)` con el mismo array ✓ |
| `food.test.tsx` carga | `h-32` → `h-40` | `expect.stringContaining('h-40')` ✓ |
| `ui-copy-table.ts` `R6_FOOD` | una fila tras `food.dailyGrams` | ✓ (`// #113 R3`) |
| `specs/mobile-ui-language/design.md` §2.6 | una fila tras `food.mealsServedOfTotal` | ✓, formato literal |
| fixtures `makePlan` (food y meal-schedule) | `kcalConsumedToday: 0` | ✓ |

No se modificó ningún otro test existente. En `food.test.tsx`, el diff sobre
tests previos se limita a `h-32` → `h-40` y a `makePlan`. El doble de
Reanimated a nivel de módulo es el prescrito por design §3.

Lista cerrada de design §4: `git diff --name-only 12298582 HEAD` da
exactamente los 12 ficheros de la tabla. No hay ninguno fuera.

## Candados tautológicos y comentarios en producción
- [x] El test no importa `TABULAR_NUMS` ni `KCAL_BAR_TIMING`. `KCAL_BAR_TIMING` no se exporta: `const` de módulo, dos apariciones, ambas en `food.tsx`. `Easing` y `ReduceMotion` vienen de la librería. La curva se compara en nueve puntos.
- [x] No hay `#113` en `food.tsx`, `types.ts` ni `catalog.ts`: el grep sale vacío. La mutación M9 confirma que el guard lo habría cazado.

## Pruebas de mutación (mías)

Suites: food, design-drift, consistency-classnames, legibility-classnames,
ui-language y home, 352 tests. Cada mutación se aplicó por reemplazo exacto
con ancla única y se restauró con `git checkout`. `git diff --exit-code` dio 0
tras cada una y al final.

| # | Fichero · mutación | Resultado |
|---|---|---|
| M1 | food.tsx · fórmula `Math.round` → `Math.ceil` | **rojo**: R2(b) 1000/333 |
| M2 | food.tsx · guarda `merKcal > 0` → `merKcal !== null` | **rojo**: R2(b) 0/0 (`NaN%`) |
| M3 | food.tsx · orden: carril antes que la cabecera | **rojo**: R2(a) |
| M4 | food.tsx · clase de cabecera `items-center` → `items-baseline` | **rojo**: R2(a) |
| M5 | food.tsx · a11y `{min:0,max:100,now:kcalPct}` → `{min:0,max:merKcal,now:kcalConsumedToday}` | **rojo**: R3(a) ×2 |
| M6 | food.tsx · curva `bezier(0.77,0,0.175,1)` → `(0.77,0,0.2,1)` | **rojo**: R4 |
| M7 | food.tsx · `withTiming` solo al subir (al deshacer asigna sin animar) | **rojo**: R4 (paso de deshacer) |
| **M8** | food.tsx · **zona ciega**: `opacity: 0.7` dentro de `useAnimatedStyle` del relleno | **VERDE 352/352: sobrevive** |
| M9 | food.tsx · comentario JSX `{/* barra de kcal #113 */}` | **rojo**: `#98 R10` design-drift (guard hex) |
| M10 | types.ts · `kcalConsumedToday` antes de `servedToday` | **rojo**: `#113 R1` y `#98 R1` |
| M11 | food.tsx · `style={CONTINUOUS_CORNER}` en el carril | **rojo**: `#62 R14` y `#98 R10` |
| M12 | food.tsx · etiqueta `target: merKcal` → `rerKcal` | **rojo**: R3(a) ×2 |
| **M13** | food.tsx · **zona ciega**: `style={{ opacity: 0.5 }}` en `food-plan-track` | **VERDE 352/352: sobrevive** |
| **M14** | food.tsx · **zona ciega**: `backgroundColor: accent` dentro del estilo animado (relleno verde sobre tarjeta verde: la barra desaparece) | **VERDE 352/352: sobrevive** |

Las sondas que Codex dice en su reporte (textos intercambiados, `/30`,
`bg-accent`, tabulares, `>= 0`, derivar de franjas, sin tile, `Math.floor`,
rol, `now+1`, `accessible`, 300 ms, `Never`, `set(kcalPct)`, `h-44`) no
coinciden con las mías salvo en la idea. Todas las que repetí de forma
equivalente dieron rojo, así que su reporte es coherente.

---

## Juicio de las dos desviaciones declaradas por Codex

### D1 — `afterEach(() => mockGetNutritionPlan.mockReset())` en el `describe` de R4 → **ACEPTABLE**
- **Es necesaria.** `jest.clearAllMocks()` del `beforeEach` global no vacía la cola de `mockResolvedValueOnce`. Solo lo hace `mockReset`. Lo comprobé: quité la línea en el rojo `a91b6af7` y salieron **2 failed**. Además de R4, cae `#65 R17` (`Unable to find … food-ai-title`), que recibe el plan `full` que R4 dejó en cola al fallar en el paso 1. Con la línea, solo cae R4 (1 failed / 51 passed).
- **No debilita nada.** Está acotada al `describe` de R4, corre después de su único `it` y no toca ninguna aserción. Quita la implementación por defecto de `mockGetNutritionPlan` tras R4, pero todos los tests posteriores del fichero la vuelven a fijar (`#65 R17` en su `beforeEach`), y R5 no llega a llamar al plan porque `listPets` queda pendiente. Si se ejecuta un test aislado con `-t`, el hook ni corre.
- Es una desviación de forma, no de fondo. Codex la declaró. No hace falta errata.

### D2 — R5 asevera `'skeleton__root h-40 w-full rounded-card'` en vez del literal de la spec → **DEFECTO DE SPEC; el test de Codex es correcto**
- **Comprobado.** Con el literal de la spec (`.toBe('h-40 w-full rounded-card')`) sobre HEAD, es decir con el tamaño correcto, el test falla: `Expected: "h-40 w-full rounded-card" / Received: "skeleton__root h-40 w-full rounded-card"`. HeroUI antepone `skeleton__root` (`node_modules/heroui-native/lib/module/components/skeleton/skeleton.styles.js`, `base: 'skeleton__root'`). Ya hay precedente en el repo: `src/screens/home/index.test.tsx` asevera `'skeleton__root'`. El test prescrito por la spec no podía pasar nunca.
- **Para C6** no hay incumplimiento. El SHALL de R5 («pintar `food-plan-skeleton` con `className="h-40 w-full rounded-card"`») se cumple en el call-site de `food.tsx`. Lo que está mal es el párrafo «Test» de R5 y el paso R5 (1) de tasks.md, que prescriben una aserción imposible. La spec no se editó y el requisito no cambió. Codex se apartó del literal del test, no del requisito, y lo declaró en su reporte. Aun así la spec firmada dice algo falso sobre su propio test: ver H2.
- **Sigue candando `h-40` y no es tautológico.** El valor esperado es un literal escrito a mano, no un import. Es exacto (`toBe`), así que también canda `w-full` y `rounded-card`, algo más estricto que el `stringContaining` de la spec. Su rojo en `a73390f7` fue real (`h-32`), y la sonda `h-44` de Codex dio rojo. Coste menor: queda acoplado al nombre interno `skeleton__root` de HeroUI, y una actualización de heroui que lo cambie lo pondrá rojo. Es aceptable y ya pasa en la Home.

---

## Observaciones (hallazgos)

**H1 — MEDIA, bloqueante. Zona ciega en el `style` de los nodos no-texto del bloque.**
- **Evidencia.** M8, M13 y M14 dejan la suite en 352/352 verde. Un `opacity` o un `backgroundColor` añadido al estilo animado del relleno, o un `style` inline en el carril, cambian cómo se ve la barra y ningún test lo ve. M14 hace la barra invisible (relleno verde sobre tarjeta verde) y pasa en verde.
- **Causa.**
  - `toHaveAnimatedStyle` de Reanimated compara por defecto **solo las claves del esperado** (`findStyleDiff` en `node_modules/react-native-reanimated/src/jestUtils/index.ts`; la comparación completa exige `shouldMatchAllProps`). Las cuatro llamadas sobre `food-plan-fill` (R2(b) y los tres pasos de R4) solo miran `width`.
  - R2(a) asevera el `className` exacto de bloque, cabecera, carril y relleno, pero no su `style`, que puede pisar ese `className`. Los dos textos sí tienen el `style` candado con `toEqual`, así que la dimensión se cubrió para los textos y se olvidó para el resto.
- **Origen.** La prescripción de la spec (R2 y R4 de requirements y tasks). Codex la siguió al pie de la letra. No es un error de implementación y el código en HEAD es correcto, pero el candado deja sin vigilar la decisión D4 (relleno blanco opaco, 3,38:1) y la regla C8 de estilos animados. Un descuido basta para romperla, así que según `candados-tautologicos` corresponde rebote, no aprobar con nota.
- **Qué tiene que cumplir la corrección** (solo en test, `food.test.tsx`). Cualquier propiedad extra en el estilo animado del relleno, o un `style` en `food-plan-progress`, en la cabecera o en `food-plan-track`, tiene que poner rojo R2 o R4.
- **Mecanismo verificado por mí** con una sonda temporal ya revertida (`git diff` vacío). Añadir `{ shouldMatchAllProps: true }` como segundo argumento a las cuatro llamadas `toHaveAnimatedStyle` del relleno, y en R2(a) `expect(<nodo>.props.style).toBeUndefined()` para bloque, cabecera y carril. Resultado:
  - food.test en HEAD: **53/53 verde**.
  - M8 → 8 rojos, M14 → 8 rojos, M13 → 1 rojo.
- **Nota para C4 al registrarlo.** Es un candado nuevo sobre código ya correcto. Si se commitea como par rojo→verde, el rojo legítimo es una mutación de producción versionada (por ejemplo, M8 en `food.tsx`) que el verde revierte (CHECKPOINTS C4, punto 5). Nunca una mutación del doble.

**H2 — BAJA, no bloqueante por sí sola. Errata en la spec firmada (R5).**
El párrafo «Test» de R5 en `requirements.md` y el paso R5 (1) de `tasks.md`
prescriben `.toBe('h-40 w-full rounded-card')`, que no puede pasar (D2). Hay
que dejarlo escrito para que la spec no afirme un test imposible. Si se toca
el texto firmado, hay que reabrir el gate solo para la enmienda. Conviene
juntarla con la de H1, que también se aparta de la prescripción literal de R2
y R4.

**H3 — INFO.** `afterEach(mockReset)` de R4 es aceptable y necesario (D1).

**H4 — INFO.** R6 (smoke en dev build de Android) sigue pendiente del humano,
como estaba previsto. La feature no puede pasar a `done` hasta que se marque
su casilla.

**H5 — INFO.** Tras `./init.sh`, `git status --short` sale vacío: el
`eslint --fix` del backend no modificó nada.

## Output de ./init.sh

Lanzado en primer plano y sin pipe, después de comprobar que `pgrep -af
'init\.sh|test:e2e|jest-e2e'` salía vacío. Log completo:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init-113-review.log`
(18233 líneas).

```
exit=0
backend unit : Test Suites: 170 passed, 170 total   | Tests: 1298 passed, 1298 total
infra        : Test Suites: 2 passed, 2 total       | Tests: 14 passed, 14 total
móvil        : Test Suites: 80 passed, 80 total     | Tests: 1441 passed, 1441 total
e2e          : Test Suites: 3 skipped, 27 passed, 27 of 30 total | Tests: 8 skipped, 389 passed, 397 total
→ Lint...      ✅ Lint sin errores (backend, infra, móvil: expo lint)
→ Typecheck... ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Frente a la línea base medida sobre `12298582`: móvil 80/1426 → **80/1441
(+15)**, que es el esperado (R1 1; R2 9; R3 3; R4 1; R5 1). Backend, infra y
e2e sin cambios. No hay regresiones.

---

## Sondas para la enmienda de H1

Encargo del leader (2026-09-23), antes de redactar R7. Método: pongo la sonda
del mecanismo en `food.test.tsx` (`{ shouldMatchAllProps: true }` en las
cuatro llamadas `toHaveAnimatedStyle` de `food-plan-fill` y
`props.style` `toBeUndefined()` en bloque, cabecera y carril dentro de R2(a)).
Luego aplico cada mutación en `food.tsx` sobre `food-plan-fill`, corro
`food.test.tsx` entero con `--runTestsByPath` y restauro con `git checkout`.
Al terminar, `git diff --exit-code` da 0 y `git status` solo muestra este
fichero.

| Mutación en `food-plan-fill` | Tests actuales (HEAD) | Con la sonda de R7 | Motivo del rojo |
|---|---|---|---|
| — (HEAD sin mutar) | 53/53 verde | **53/53 verde** | — |
| (a) `style={[kcalBarStyle, { opacity: 0.7 }]}` | 53/53 verde (**sobrevive**) | **rojo, 8 failed**: las 7 filas de R2(b) y R4 | `Received: {"width":"0%","opacity":0.7}` · `'opacity' should be undefined, but is 0.7` |
| (b) `style={[{ opacity: 0.7 }, kcalBarStyle]}` | 53/53 verde (**sobrevive**) | **rojo, 8 failed**: R2(b) ×7 y R4 | `Received: {"opacity":0.7,"width":"0%"}` · el mismo diff |
| (c) `className="… bg-accent-foreground opacity-70"` | no medido (lo caza el `toBe` de R2(a), que ya existe) | **rojo, 1 failed**: R2(a) | `Expected: "h-full rounded-full bg-accent-foreground" / Received: "… opacity-70"` |
| (d) extra: array anidado `style={[kcalBarStyle, [{ opacity: 0.7 }]]}` | no medido | **rojo, 8 failed** | `Received: {"0":{"opacity":0.7},"width":"0%","opacity":0.7}` |

**Por qué cae (a)/(b).** El matcher de Reanimated
(`getCurrentStyle`, en `node_modules/react-native-reanimated/src/jestUtils/index.ts`)
fusiona los objetos inline del array `style` con los valores animados antes
de comparar. Con `shouldMatchAllProps` sobra la clave `opacity`. Sin esa
opción, (a) y (b) pasan con la suite actual: el control está medido arriba.
El código de Reanimated avisa de que no maneja arrays anidados, pero (d) cae
igualmente.

**Conclusión.** Con la sonda de R7, ninguna de (a), (b) ni (c) sobrevive. No
hace falta ninguna aserción extra sobre `fill.props.style`: basta con
`toHaveAnimatedStyle({ width: '<n>%' }, { shouldMatchAllProps: true })` en las
cuatro llamadas del relleno, más `expect(<nodo>.props.style).toBeUndefined()`
para `food-plan-progress`, la cabecera y `food-plan-track`, más el
`className` `toBe` de R2(a) que ya existe. Esa combinación da 53/53 verde en
HEAD y rojo en M8, M13, M14, (a), (b), (c) y (d).

Logs: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/mut/h1-*.log`.

---

# Ronda 2 — Enmienda E1 (R7)
Fecha: 2026-09-23 (tras `436f936f`)
Veredicto: **APROBADO**

Base revisada: HEAD `436f936f`. Commits de la ronda: `2a1d1cff` (rojo R7),
`8dd65ed3` (verde R7) y `436f936f` (trazabilidad y reporte). La Enmienda E1
está en `ed6ef397` y su firma en `9da4db78`. Mismo worktree y branch que la
ronda 1.

## H1 (ronda 1) — cerrado
- **El `describe` de R7 coincide con el literal de requirements §Enmienda E1.**
  - Título: `#113 R7: los nodos no-texto de la barra no llevan más estilo que el ancho (mobile-kcal-consumed-bar #113)`.
  - `it.each` con el título literal y las dos filas: 656/0/`[]`/`'0%'` y 1420/890/`['07:30']`/`'63%'`.
  - Mocks `mockListPets` y `mockGetNutritionPlan` según la spec.
  - Las cuatro aserciones: `toHaveAnimatedStyle({ width }, { shouldMatchAllProps: true })`, `progress.props.style`, `header.props.style` con la guarda `typeof header === 'string'`, y `food-plan-track` `props.style` `toBeUndefined()`.
- **Mutaciones replantadas por mí en HEAD.** Seis suites (food, design-drift, consistency, legibility, ui-language y home), 354 tests. Cada una se restauró con `git checkout` y `git diff --exit-code` dio 0 tras cada una y al final:

| Mutación en `food.tsx` | Resultado |
|---|---|
| M8 `opacity: 0.7` en `kcalBarStyle` | **rojo**: R7 ×2 |
| M14 `backgroundColor: accent` en `kcalBarStyle` | **rojo**: R7 ×2 |
| M13 `style={{ opacity: 0.5 }}` en `food-plan-track` | **rojo**: R7 ×2 |
| relleno `style={[kcalBarStyle, { opacity: 0.7 }]}` | **rojo**: R7 ×2 |
| relleno `style={[{ opacity: 0.7 }, kcalBarStyle]}` | **rojo**: R7 ×2 |
| relleno `style={[kcalBarStyle, [{ opacity: 0.7 }]]}` | **rojo**: R7 ×2 |
| `style={{ opacity: 0.5 }}` en `food-plan-progress` | **rojo**: R7 ×2 |
| `style={{ opacity: 0.5 }}` en la cabecera | **rojo**: R7 ×2 |

## Búsqueda de zona ciega nueva (lo que R7 no mira)

| Id | Mutación | Resultado |
|---|---|---|
| N1 | en `kcalBarStyle`: `...(kcalBarWidth.get() >= 100 ? { opacity: 0.7 } : {})` | **VERDE 354/354: sobrevive** |
| N2 | en `food-plan-track`: `style={kcalPct >= 100 ? { opacity: 0.5 } : undefined}` | **VERDE 354/354: sobrevive** |
| N3 | `importantForAccessibility="no-hide-descendants"` en `food-plan-progress` | **rojo**, 13 failed: R2, R3, R4 y R7, porque RNTL excluye los nodos ocultos de `getByTestId` |
| N4 | `className` del relleno con ` opacity-70` solo al 100 % | **rojo**, pero lo caza `#61 R3` (grep de `opacity-70`), no R2. Con una clase no vetada sobreviviría, igual que N1 |

**Qué es.** Un hueco de muestreo, no de mecanismo. R7 comprueba «no hay más
estilo que el ancho» en 0 % y 63 %. El 100 % sí se pinta en R2(b), fila
656/656, y en el paso de servir de R4, pero con el matcher parcial. Un estilo
que solo aparece al completar el día queda fuera de R7.

**Cierre verificado** con una sonda temporal ya revertida: añadir a R7 una
tercera fila `{ merKcal: 656, kcal: 656, servedToday: ['07:30', '19:30'], width: '100%' }`.
R7 queda en 3/3 verde en HEAD, y con esa fila N1 y N2 salen rojos (1 failed
cada una, la fila del 100 %).

## Checklist ronda 2
- **C2** [x] Solo #113 `in_progress`. `progress/current.md` describe la ronda 2.
- **C3** [x] N/A a capas. Producción idéntica a la ronda 1.
- **C4** [x] Par rojo→verde de R7, cada uno en su commit.
  - El rojo `2a1d1cff` lleva el `describe` de R7 más una **mutación de producción** versionada (`opacity: 0.7` en `kcalBarStyle` de `food.tsx`). No toca el doble: el diff del test en ese commit son solo las 27 líneas del `describe`.
  - Checkout de `2a1d1cff`: food.test da **2 failed / 53 passed**, exit=1, **por aserción** (`Received: {"width":"0%","opacity":0.7}` · `'opacity' should be undefined, but is 0.7`, y lo mismo con `63%`). No hay ningún `ReferenceError`, `SyntaxError` ni módulo ausente.
  - El verde `8dd65ed3` revierte la mutación: food.test da **55/55**, exit=0. `git diff 15e43269 HEAD -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'` sale **vacío**.
- **C5** [x] Fila R7 con título literal, `2a1d1cff` y `8dd65ed3`. Los 12 hashes (R1-R5 y R7) son ancestros de HEAD. Commits `test(kcal-bar): … (R7)` y `feat(kcal-bar): … (R7)`. R6 sigue «pendiente del humano», como está previsto.
- **C6** [x] Enmienda E1 firmada: casilla marcada y commit de firma `9da4db78`. `git diff 9da4db78 HEAD -- specs/mobile-kcal-consumed-bar/` solo cambia la fila R7 de `traceability.md` (de `pendiente (ronda 2)` a los hashes). El diff de `e4a4841e` a `9da4db78` es la enmienda firmada: añade R7 y las erratas y no modifica R1-R6 ni D1-D6.
- **C7** [x] N/A.
- **C8** [x] Sin cambios en producción respecto a la ronda 1, así que el grep-clean y el juicio de C8 de la ronda 1 siguen valiendo.
- **Lista cerrada de la ronda 2** [x] `git diff --name-only 9fb6c11a HEAD` da `food.test.tsx`, `progress/impl_mobile-kcal-consumed-bar.md` y `specs/mobile-kcal-consumed-bar/traceability.md`. `food.tsx` aparece en los commits intermedios y su diff neto es nulo.
- **R1-R5 intactos** [x] Desde `15e43269` la parte móvil solo suma 27 líneas en `food.test.tsx` (numstat `27 0`) y no borra ni cambia ninguna línea de ningún test existente.
- **H2 cerrado** [x] La errata consta en requirements (bajo el párrafo «Test» de R5 y en §Enmienda E1) y en tasks.md (R5 (1)), con el literal `'skeleton__root h-40 w-full rounded-card'`. El SHALL de R5 no cambia.

## Hallazgos ronda 2
**H6 — BAJA, no bloqueante. R7 solo muestrea el 0 % y el 63 %: un estilo que aparece al completar el día sobrevive (N1, N2).**
- **Por qué no bloquea.** La familia de mutaciones que produce un descuido, añadir una clave de estilo sin condición en objeto, array o array anidado, en cualquiera de los cuatro nodos, queda candada por completo. Lo que sobrevive exige un estilo **condicionado** a un estado que no se muestrea, y eso es un cambio de diseño deliberado, no un despiste. Además, el 100 % ya está cubierto en ancho y textos por R2(b) y R4.
- **Si el leader quiere cerrarlo antes del `done`**: basta la tercera fila de 100 % de arriba, ya medida. Como la tabla de R7 está firmada, añadirla es una Enmienda E2 con su propia firma. La alternativa es registrarlo como deuda nombrada. Decide el leader.

**H4 (ronda 1)** R6 (smoke en dev build de Android) sigue siendo del humano.
La feature no puede pasar a `done` hasta que se marque su casilla.

## Output de ./init.sh (ronda 2)

Lanzado en primer plano, sin pipe, después de comprobar que `pgrep -af
'init\.sh|test:e2e|jest-e2e'` salía vacío. Log completo:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/f4719a40-0501-4a5f-80e7-b8287f1de20f/scratchpad/init-113-review2.log`
(18435 líneas). Tras la ejecución, `git status --short` sale vacío.

```
exit=0
backend unit : Test Suites: 170 passed, 170 total   | Tests: 1298 passed, 1298 total
infra        : Test Suites: 2 passed, 2 total       | Tests: 14 passed, 14 total
móvil        : Test Suites: 80 passed, 80 total     | Tests: 1443 passed, 1443 total
e2e          : Test Suites: 3 skipped, 27 passed, 27 of 30 total | Tests: 8 skipped, 389 passed, 397 total
✅ Lint sin errores · ✅ Typecheck sin errores · ✅ Todo verde.
```

Coincide con lo esperado: móvil 1441 → **1443** (+2, las dos filas de R7),
mismas 80 suites. Lo demás no cambia. No hay regresiones.

Logs de la ronda 2: `…/scratchpad/r2/` (rojo, verde, mutaciones y sondas).
