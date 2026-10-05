# review: mobile-welcome-splash (#118), ronda 1
Fecha: 2026-10-05T02:25Z
HEAD revisado: `7789f722` (handoff H0 `69847c4f`; `origin/main` `b2a9c2aa` es ancestro)
Veredicto: RECHAZADO

Resumen: el código de producción cumple R1–R12 y `./init.sh` está verde
sobre el HEAD correcto. Todos los rojos de los commits `test(...)` son
rojos reales de aserción o de consulta. 33 de las 34 sondas de design.md §2
caen donde se declaró. Se rechaza por cinco candados ciegos (E1–E5): una
mutación natural de la fila «Chip pulsable» de §2 queda verde, y cuatro
mutaciones propias en zona ciega (R10 y R5) también. Los cinco tests
siguen al pie de la letra lo que prescribe `requirements.md`, así que el
origen está en la spec y no en Codex. El arreglo pasa por enmendar R5, R6
y R10; decide el leader.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #118)
- [x] progress/current.md actualizado (sesión #118, branch y base correctas)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A en móvil; la pantalla solo importa providers, theme e i18n)
- [x] repositories/contratos en domain son interfaces puras (N/A)
- [x] application depende de interfaces, no implementaciones (N/A)
- [x] infrastructure sin lógica de negocio (N/A)
- [x] Estructura Expo: route delgado `src/app/welcome.tsx` (4 líneas no vacías) y cuerpo en `src/screens/welcome/index.tsx`

## Checklist C4 — TDD
- [x] Cada R1–R12 tiene al menos un test que lo nombra (R12 se verifica con `git diff` vacío, como declara la spec)
- [x] El historial muestra test primero. Medido con checkout de cada commit `test(...)` en un worktree aparte:
  - `81ac3fb9` (R1): rojo de aserción, `Expected length: 360 / Received length: 352`
  - `c5b6b0be` (R2): rojo de aserción en `#118 R2: redirects an unauthenticated session to welcome` (href)
  - `a7c3a656` (R3/R4/R5/R9): 9 rojos, todos de aserción o de consulta (`toMatch` de la guarda, `toContain` del route, `toHaveBeenCalledTimes`, `Unable to find … screen-welcome / welcome-content / welcome-brand`, `Unable to find … text: Pet Tracker`, y `layout #118 R3` `Expected: true`). Ningún error de import
  - `58961dcf` (R10): 4 rojos (`Expected: 240 / Received: undefined` y tres `toHaveAnimatedStyle`)
  - `cf9407ad` (R1): rojo en cascada declarado (`SCREEN_FILES` 28 frente a 29), cerrado por `fa75f06a`
  - Nacen verdes, como declaran la spec y el handoff (ruta b): R6 (`f5ebec6c`), R7 (`a81147d9`), R8 (`2a4f2376`), R11 (`cffe227f`) y el `checkUses` de R1. Mis sondas los ponen rojos: S12 y S13 (R6), S17 y S18 (R7), S21 (R8), S29a, S29b y S30 (R11), S22 (R1)
- [x] Trampa 11: `58961dcf` frente a `2a4f2376` solo añade el describe R10, los imports y el mock con `__esModule: true`. Ninguna aserción previa cambia
- [ ] Las sondas del reviewer caen rojas: **no**. S15b, M1–M4, M6, M8 y M11 quedan verdes (ver E1–E5)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente» salvo R13 (smoke humano S1–S8 en dev build de Android). Según la instrucción del leader, R13 no bloquea el veredicto de código; queda pendiente del humano
- [x] Los commits siguen `test|feat|refactor|docs(mobile): <desc> (#118 R-ids)`, en el orden literal del handoff
- [x] La lista cerrada de ficheros se cumple: `git diff --name-only 69847c4f 7789f722` da 17 ficheros = design.md §1.2 (16) + traceability.md

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved`, casilla humana marcada y firma en `16c8e565` (ancestro de HEAD). Después de la firma solo cambia traceability.md

## Checklist C7 — Sin código huérfano
- [x] N/A — #118 no reemplaza ningún módulo. El único cambio de destino es el `Redirect` de `src/app/index.tsx` (`/login` a `/welcome`), y su test se renombró en vez de duplicarse

## Checklist C8 — Carta de UI (docs/ui-guidelines.md)
- [x] Dimensiones del grupo sin tab bar (`insets.bottom + 24`, `insets.top + 12`, `padding: 24`), igual que `(auth)/login.tsx`
- [x] Botones heroui `Button` con el radio de la escala (`rounded-xl`), primario sólido y secundario hueco con tinta `accent-strong`. Sin `text-accent` suelto
- [x] Grep-clean en los dos ficheros nuevos: sin hex, sin `[...]`, sin `StyleSheet`, sin `expo-linear-gradient` ni `expo-symbols`
- [x] Animación solo de `opacity` y `transform`, con `.get()`/`.set()` y Reduce Motion atendido en producción. Un apunte: la carta prefiere spring para las entradas, pero la spec firmada fija `withTiming` 240 ms; no es hallazgo
- [x] R12: `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacío, y también desde H0

## Sondas de design.md §2 (worktree aparte en `7789f722`; restauradas con `git checkout HEAD --`, y `git diff --cached` vacío después de cada una)

| # | Mutación | Rojo esperado | Rojo obtenido |
| --- | --- | --- | --- |
| S01 | `index.tsx` redirige a `/login` | `#118 R2` (aserción) | `#118 R2` `toEqual` href ✔ |
| S02 | `index.tsx` sin `splash-logo` | `shows the centered logo…` (consulta) | `Unable to find … splash-logo` ✔ |
| S03 | sin `Stack.Protected` en welcome | `R3 registra welcome…` y `layout #118 R3` | los dos (`toMatch`; `toBe(Stack.Protected)`) ✔ |
| S04 | welcome antes de la guarda autenticada | `#95 R2` y `#114 R1` | `#95 R2` `Expected: true`, `#114 R1` `toHaveLength(12)`, más 16 en cascada (#95 R4, #100, #41, #146, #105, #118 R3) ✔ |
| S05 | route con lógica | `R3 deja el route delgado` | `<= 5 / Received: 6` ✔ |
| S06 | pinta con sesión | `R4` | `toHaveBeenCalledTimes(1) / 0` ✔ |
| S07 | `paddingBottom + 96` | `R5 dimensiones` | `toEqual` ✔ |
| S08a | sin legal | `R5 siete bloques` | `Expected length: 7 / 6`, más R5 clases y R9 ES/EN por consulta ✔ |
| S08b | tagline antes de chips | `R5 siete bloques` | `toEqual` del orden ✔ |
| S09 | hero 120 | `R5 hero` | `toEqual` del style ✔ |
| S10a | dos chips | `R6 cardinalidad` | `Expected length: 3 / 2`, más R9 por consulta ✔ |
| S10b | cuarto chip | `R6 cardinalidad` | `3 / 4` y filas 1, 3, 6, 9; la fila 8 cae por `TypeError` (obs. 3) ✔ |
| S11 | chips en otro orden | filas 1 y 3 | filas 1, 3, 6, 8 y 9 ✔ |
| S12 | icono 20 | fila 4 | `Expected: 14 / Received: 20` ✔ |
| S13 | `useThemeColors(['muted'])` | fila 5 | `toHaveBeenCalledWith` ✔ |
| S14 | etiqueta `text-accent` suelto | legibility y fila 7 | legibility (2), fila 7, fila 11 y design-drift `#118 R11` ✔ |
| S15a | chip `View` con `onPress` | fila 10 | `toBeUndefined / [Function onPress]` ✔ |
| **S15b** | **chip como `Pressable` con `onPress`** | **fila 10** | **VERDE 28/28 ✘ (E4)** |
| S16 | tres chips a mano, sin `map` | fila 11 | `toContain('WELCOME_CHIPS.map')` ✔ |
| S17 | primario con `replace` | `R7` | `push toHaveBeenCalledTimes(1) / 0` ✔ |
| S18 | primario a `/login` | `R7` | `Expected: "/register" / "/login"` ✔ |
| S19 | primario `rounded-2xl` | `#62 R4` y R7 className | `#62 R1`, `#62 R4`, `#98 R10` y R7 ✔ |
| S20 | secundario sólido | R8 y `#62 R1` +2 | `16 / 17` en `#62 R1` y `#98 R10`, y R8 ✔ |
| S21 | secundario a `/register` | `R8` | `Expected: "/login"` ✔ |
| S22 | literal `Comenzar ahora` en el fuente | `wholeLiterals` y `#118 R1 checkUses` | los dos, más `#65 R18` por clave ✔ |
| S23 | `welcome.legalNotice` fuera de `es` | language-provider y `tsc` | `#65 R12` `toEqual`; `tsc` exit 2 `TS2741 Property '"welcome.legalNotice"' is missing` ✔ |
| S24 | EN `Get Started` | `R9 inglés` | `Unable to find … text: Get started` ✔ |
| S25 | `translateY` inicial 24 | `R10 arranca` | `R10 arranca` y `R10 termina` ✔ |
| S26 | Reduce Motion ignorado | `R10 con Reduce Motion` | `translateY: 16` antes de avanzar ✔ |
| S27 | `WELCOME_ENTRANCE_MS = 400` | `R10 fija` | `Expected: 240 / 400` ✔ |
| S28 | fade hasta 0.9 | `R10 termina` | `R10 termina` y `R10 con Reduce Motion` ✔ |
| S29a | hex en la pantalla | design-drift `#118 R11` | ✔ |
| S29b | `StyleSheet.create` | design-drift `#118 R11` | ✔ |
| S30 | `expo-linear-gradient` | design-drift `#118 R11` | `not.toMatch` ✔ |

## Mutaciones propias en zona ciega (`src/screens/welcome/index.test.tsx`, 28 tests)

| # | Mutación en `src/screens/welcome/index.tsx` | Resultado |
| --- | --- | --- |
| M1 | `duration: 400` escrito a mano en los dos `withTiming` (la constante sigue en 240) | VERDE ✘ (E1) |
| M2 | `WELCOME_ENTRANCE_EASING = Easing.linear` | VERDE ✘ (E1) |
| M11 | `easing: Easing.linear` solo en el `withTiming` del fade | VERDE ✘ (E1) |
| M3 | quitar `reduceMotion: ReduceMotion.Never` del fade | VERDE ✘ (E2) |
| M4 | `duration: reduceMotion ? 0 : WELCOME_ENTRANCE_MS` en el fade | VERDE ✘ (E2) |
| M6 | clave animada extra `marginTop: translateY.get()` | VERDE ✘ (E3) |
| M8 | hero con `logo-glow.png` | VERDE ✘ (E5) |
| M9 | solo el chip de nutrición con otra clase | rojo, fila 2 por elemento (cláusula universal bien candada) ✔ |
| M10 | `Redirect` autenticado a `/login` | rojo, `R4` `toEqual` ✔ |
| M7 | segundo `useThemeColors(['muted'])` aplicado al icono | verde (obs. 4) |
| M5 | `opacity: 0.5` estática en el estilo de `welcome-content` | verde; no concluyente, sin reclamo (obs. 5) |

Cada arreglo propuesto abajo se validó en el mismo worktree aparte: verde en
HEAD (33/33) y rojo en su mutación (P-wiring frente a M1, M3, M4 y M11;
P-easing frente a M2; P-anim frente a M6; P-chip frente a S15b; P-hero
frente a M8). Después se revirtió.

## Observaciones

### Hallazgos bloqueantes

**E1 — R10: la duración y la curva no están ligadas a la animación (trampa 3, candado tautológico).**
Fichero: `mobile-pet-tracker/src/screens/welcome/index.test.tsx`. Ancla:
`grep -cF "expect(WELCOME_ENTRANCE_EASING).toBeDefined();"` → `1`, dentro
de `it('fija la duración y la curva'`. `toBeDefined()` pasa con cualquier
curva (M2), y `toBe(240)` mira una constante que los `withTiming` pueden
no usar (M1, M11). La ventana `WELCOME_ENTRANCE_MS * 2 + 100` llega a 1
igual con 400 ms. R10 exige «240 ms con `Easing.bezier(0.23, 1, 0.32, 1)`»
y hoy no hay nada que lo cande. Arreglo exacto, dentro de ese `it`:
1. Sustituir `toBeDefined()` por una comparación contra una curva de
   referencia construida en el test con los coeficientes literales:
   `const ref = jest.requireActual('react-native-reanimated').Easing.bezier(0.23, 1, 0.32, 1).factory();`
   y, para cada `x` de `[0.1, 0.3, 0.5, 0.7, 0.9]`,
   `expect(WELCOME_ENTRANCE_EASING.factory()(x)).toBeCloseTo(ref(x), 6)`.
2. Añadir un candado de cableado sobre el fuente:
   `source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g)` `toHaveLength(2)`
   y `source.match(/\b(duration|easing):/g)` `toHaveLength(4)`.

**E2 — R10, rama WHILE Reduce Motion: «solo `opacity` SHALL animar 0→1 con la misma duración» no tiene candado (cláusula universal sin candado por rama).**
Ancla: `grep -cF "it('con Reduce Motion no se desplaza'"` → `1`. En jest el
flag de sistema de Reduce Motion de Reanimated está apagado. Por eso quitar
`ReduceMotion.Never` (M3) sigue verde, aunque en dispositivo con Reduce
Motion activo el fade saltaría a 1 sin animar. Un fade de 0 ms bajo Reduce
Motion (M4) también sigue verde. Arreglo exacto: añadir en el candado de
cableado de E1 `source.match(/reduceMotion: ReduceMotion\.Never/g)`
`toHaveLength(1)`. La regex de E1 ya pone rojo M4.

**E3 — R10: `toHaveAnimatedStyle` solo compara las claves que se le pasan (trampa 4).**
Ancla: `grep -cF "toHaveAnimatedStyle({"` → `5`, todas en `describe('R10')`.
Una clave animada extra (M6, `marginTop` animado, una propiedad de layout
que la carta prohíbe animar) pasa en verde. Arreglo exacto: en las 5
llamadas, añadir `alignItems: 'center', gap: 16` al objeto esperado y pasar
`{ shouldMatchAllProps: true }` como segundo argumento. El precedente en el
repo es `src/app/(tabs)/__tests__/food.test.tsx` (`food-plan-fill`).

**E4 — R6 fila 10 («no pulsable: `View`, sin `onPress`»): un chip `Pressable` pasa (fila «Chip pulsable» de design.md §2).**
Ancla: `grep -cF "it('deja cada chip sin pulsación ni rol de botón'"` → `1`.
Convertir el chip en `<Pressable … onPress={…}>` (S15b, la forma natural de
hacerlo pulsable) da 28/28 en verde. El nodo host no recibe `onPress`, y sin
`accessibilityRole` el `not.toBe('button')` pasa. Solo cae la variante
artificial `View` con `onPress` (S15a). Arreglo exacto: dentro del
`forEach` de ese `it`, añadir `expect(chip.props.accessible).toBeUndefined()`
y `expect(chip.props.onClick).toBeUndefined()`.

**E5 — R5: el `source` del hero no tiene candado.**
Ancla: `grep -cF "it('pinta hero, marca, tagline y legal con sus clases'"` → `1`.
R5 fija `source=splash-icon.png`, y requirements.md descarta `logo-glow.png`
de forma explícita. Aun así, cambiar el hero a `logo-glow.png` (M8) sigue
verde. Arreglo exacto: en ese `it`, añadir
`expect(screen.getByTestId('welcome-hero').props.source).toEqual([expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/splash-icon\.png$/) })])`.

Origen común de E1–E5: las listas de tests de requirements.md R5, R6 y R10
prescriben exactamente las aserciones actuales: `toBeDefined()`, las dos
claves en `toHaveAnimatedStyle`, `onPress` y `accessibilityRole` en la fila
10, y ninguna aserción sobre `source`. Codex las siguió al pie de la letra.
El handoff prohíbe «ajustar ninguna aserción», así que el arreglo necesita
enmendar R5, R6 y R10 antes de devolver el trabajo a Codex. El código de
producción no cambia: los cinco arreglos están en verde sobre `7789f722`.

### No bloqueantes

- obs. 1 — Incidente de entorno con `./init.sh`, no atribuible a Codex. La
  primera corrida (`init_118.log`, exit=1) falló en el paso e2e
  (`drizzle-kit migrate`, `ELIFECYCLE`). wt-118 no tenía `.env`, así que
  init.sh copió `.env.example`, que apunta a `localhost:5432`, un Postgres
  del host que no es el del proyecto. Aun así, en esa corrida la suite móvil
  ya daba 94/94 suites y 2039/2039 tests. Esa corrida no cuenta. El leader
  copió el `.env` del worktree principal (Postgres 5433, base `pet_tracker`)
  y la segunda corrida (`init_118_r2.log`) es la que vale.
- obs. 2 — El `+ 1 // #118 R3` de `layout.test.tsx` entró en el commit
  verde `431894bc` y no en el rojo `a7c3a656`, como manda el handoff (rojos
  en cascada de design.md §2), aunque tasks.md T3 lo situaba en el rojo. Es
  coherente con el handoff; lo dejo anotado por la discrepancia entre
  tasks.md y handoff.
- obs. 3 — Con un cuarto chip (S10b), `it('ordena GPS, Salud y Nutrición')`
  falla con `TypeError: Cannot set properties of undefined (setting
  'lastIndex')` en vez de con una aserción, porque indexa un array fijo por
  hijo. La cardinalidad (fila 12) ya cae por aserción, así que el rojo útil
  existe.
- obs. 4 — El mock de `useThemeColors` devuelve `['accent-strong-ink']` para
  cualquier clave. La fila 5 depende solo de
  `toHaveBeenCalledWith(['accent-strong'])`: un segundo
  `useThemeColors(['muted'])` aplicado al icono (M7) sigue verde. Mutación
  rebuscada; un mock que mapee la clave
  (`keys.map((k) => \`${k}-ink\`)`) lo cerraría. No bloquea.
- obs. 5 — M5 (`opacity: 0.5` estática después de `entranceStyle`) queda
  verde incluso con `shouldMatchAllProps`, porque jestUtils funde el estilo
  animado por encima del estático. No verifiqué el comportamiento en
  dispositivo y no lo reclamo.
- obs. 6 — Según el handoff, las sondas de R6, R7, R8 y R11 de Codex no se
  commitearon y solo constan en `progress/impl_mobile-welcome-splash.md`. Mis
  sondas S12, S13, S17, S18, S21, S29a, S29b y S30 las reproducen en rojo.
- obs. 7 — R13 (smoke humano S1–S8 en dev build de Android) sigue pendiente
  del humano, con sus casillas en requirements.md.

## Output de ./init.sh
Corrida válida, la segunda: `init_118_r2.log` en el scratchpad de la sesión,
lanzada por el leader con permiso del humano. El subagente no puede correr
init.sh.

```
head=7789f7220bdcb2cafb571d3ab9073bfe6ee13108
Test Suites: 176 passed, 176 total          # backend unit
Tests:       1348 passed, 1348 total
Test Suites: 2 passed, 2 total               # backend integración
Tests:       14 passed, 14 total
# tests 28 / # pass 28 / # fail 0            # harness (node:test), más 5/5 y 15/15
Test Suites: 94 passed, 94 total             # móvil (jest)
Tests:       2039 passed, 2039 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 29 passed, 29 of 32 total   # e2e
Tests:       8 skipped, 438 passed, 446 total
✅ Tests e2e pasados
$ expo lint
✅ Lint sin errores
$ tsc --noEmit
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
head_end=7789f7220bdcb2cafb571d3ab9073bfe6ee13108
exit=0
```
`git rev-parse HEAD` en wt-118 = `7789f7220bdcb2cafb571d3ab9073bfe6ee13108` = head = head_end.
