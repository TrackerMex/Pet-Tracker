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

---

# Ronda 2

# review: mobile-welcome-splash (#118), ronda 2
Fecha: 2026-10-05T03:40Z
HEAD revisado: `f23345c3` (H0 de la ronda: `4ff4c247`, firma de la Enmienda E1–E5; `origin/main` local `b2a9c2aa` es ancestro)
Veredicto ronda 2: RECHAZADO

Resumen: Codex cumplió la ronda 2 al pie de la letra. Toca solo los tres
ficheros autorizados, la producción no cambia desde la ronda 1, cada
aserción nueva coincide con el texto de la Enmienda y las nueve sondas
declaradas caen donde y como se declaró (las repetí todas). E1, E3, E4 y E5
quedan cerrados. El rechazo viene del barrido de zona ciega sobre la
cláusula de dos ramas de R10 (Enmienda E2): «el del fade lleva
`reduceMotion: ReduceMotion.Never`; el de `translateY` no lo lleva». El
candado prescrito cuenta la cadena en todo el fichero y no la ata al fade.
Mover esa línea del fade al `withTiming` de `translateY` (X1) deja la suite
en 28/28 verde. Una sonda de comportamiento con Reduce Motion de sistema
activo muestra que, con X1, el fade salta a 1 sin animar. Es el mismo hueco
que E2 debía cerrar. El origen vuelve a estar en la spec, y en concreto en
el arreglo que yo mismo propuse en la ronda 1 (`toHaveLength(1)` global).
No es fallo de Codex.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #118)
- [x] progress/current.md actualizado (sesión #118, worktree y estado de la ronda 1 y de la Enmienda)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A en móvil)
- [x] repositories/contratos en domain son interfaces puras (N/A)
- [x] application depende de interfaces, no implementaciones (N/A)
- [x] infrastructure sin lógica de negocio (N/A)
- [x] Sin cambios de producción en esta ronda (punto 1); la estructura revisada en la ronda 1 sigue igual

## Checklist C4 — TDD
- [x] Cada R-id tocado se nombra en su `describe` (`R5`, `R6`, `R10`). Esta ronda no añade ni quita ningún `it` (28 en welcome)
- [x] Sin commit `feat` ni `refactor` en la ronda. Cuatro commits `test(...)`, uno por enmienda y con un solo fichero cada uno. El rojo lo dan las sondas documentadas (punto 6), y yo las repetí (punto 3)
- [ ] Las sondas propias del reviewer caen rojas: **no**. X1 y X2 quedan verdes (E6)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente» salvo R13 (smoke humano, no bloquea el veredicto de código)
- [x] Las filas de R5, de R6 fila 10 y las cuatro de R10 citan los hashes correctos de la ronda 2, y los cuatro son ancestros de HEAD (punto 5)
- [x] Formato de commits igual que en la ronda 1, con los mensajes literales del handoff

## Checklist C6 — Spec aprobada
- [x] `status: approved`. Están marcadas la casilla de la spec y la de la Enmienda E1–E5. La firma de la Enmienda es `4ff4c247` (gate Notion, cita la página y la hora) y es ancestro de HEAD. Después de la firma no cambia ningún fichero de `specs/` salvo traceability.md

## Checklist C7 — Sin código huérfano
- [x] N/A — la ronda 2 no reemplaza nada

## Checklist C8 — Carta de UI
- [x] Sin cambios de UI en esta ronda. Lo revisado en la ronda 1 sigue vigente (producción idéntica a `7789f722`)

## 1. Lista cerrada de ficheros y deriva de código

```
$ git diff --name-only 4ff4c247 HEAD
mobile-pet-tracker/src/screens/welcome/index.test.tsx
progress/impl_mobile-welcome-splash.md
specs/mobile-welcome-splash/traceability.md
$ git diff 4ff4c247 HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx   (vacío)
$ git diff --name-only 7789f722 HEAD   (HEAD de la ronda 1 frente al actual)
  único fichero de mobile-pet-tracker/: src/screens/welcome/index.test.tsx; el resto son progress/ y specs/
```
Cada commit de la ronda lleva un solo fichero: `3932781d` (1+), `3eff471b`
(2+), `c5bc8da1` (8+/1-) y `7c86fcad` (10+/5-), todos sobre
index.test.tsx. `f23345c3` lleva impl y traceability. Producción sin
deriva respecto a la que aprobé en código en la ronda 1.

## 2. Aserciones frente al texto de la Enmienda

| Enmienda | Texto de la spec | Test en HEAD | ¿Coincide? |
| --- | --- | --- | --- |
| E5 (R5) | `props.source` `toEqual([expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/splash-icon\.png$/) })])` | línea 146, literal | ✔ |
| E4 (R6 f.10) | `onPress`, `onClick` y `accessible` `toBeUndefined()`, y `accessibilityRole` `not.toBe('button')` por hijo | líneas 246–249 dentro del `forEach` | ✔ |
| E1 (R10) | `toBe(240)`; referencia `jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated').Easing.bezier(0.23, 1, 0.32, 1).factory()`; 9 puntos con `toBeCloseTo(…, 6)` | líneas 307–311, literal | ✔ |
| E1/E2 (R10) | las tres regex de cableado sobre `readSource('screens/welcome/index.tsx')` | líneas 312–315 | ✔ con `?? []` (ver abajo) |
| E3 (R10) | 5 `toHaveAnimatedStyle` con `alignItems: 'center', gap: 16` y `{ shouldMatchAllProps: true }` | líneas 320–354 (5 de 5) | ✔ |

- E1 no es tautológico. La referencia sale de `jest.requireActual` con los
  coeficientes literales `0.23, 1, 0.32, 1`, nunca del símbolo importado.
  Lo prueban M2b y mi X13 (`Easing.bezier(0.22, 1, 0.36, 1)`, la
  easeOutQuint clásica): caen con `toBeCloseTo` en el punto 0.1,
  `Expected: 0.39812410465104964` frente a `Received: 0.40109689551880867`.
- `?? []` en los tres `source.match`: la spec escribe `source.match(...)`
  sin él. El impl lo declara (§«E1/E2 — detalle de implementación de los
  recuentos»): sirve para que cero coincidencias den `Received length: 0`,
  como pide la tabla de sondas del handoff, y no un error de matcher sobre
  `null`. No cambia ninguna regex. Lo acepto.

## 3. Sondas de la tabla del handoff, repetidas por el reviewer

Desde `mobile-pet-tracker/`, cada una con
`bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > <log> 2>&1; echo "exit=$?"`
y restaurada con `git checkout HEAD -- src/screens/welcome/index.tsx`.
Después de cada una, `git diff --quiet HEAD -- …index.tsx` y
`git diff --cached --quiet` dieron exit 0. Logs en el scratchpad de la
sesión (`r2probes/<sonda>.log`). Antes de las sondas, welcome en HEAD:
28/28, exit=0.

| Sonda | Mutación | exit | Cuentas | `it` rojo | Causa | ¿Como se declaró? |
| --- | --- | --- | --- | --- | --- | --- |
| M8 | hero `logo-glow.png` | 1 | 1 failed / 27 passed | R5 › pinta hero, marca, tagline y legal con sus clases | `toEqual`, Received `testUri: "../../../assets/images/logo-glow.png"` | ✔ |
| S15b | chip `Pressable` con `onPress` | 1 | 1 / 27 | R6 › deja cada chip sin pulsación ni rol de botón | `toBeUndefined`, Received `[Function onClick]` (línea 247) | ✔ |
| M1 | `duration: 400` en los dos `withTiming` | 1 | 1 / 27 | R10 › fija la duración y la curva | `toHaveLength` Expected 2, Received 0 (línea 313) | ✔ |
| M11 | `easing: Easing.linear` solo en el fade | 1 | 1 / 27 | R10 › fija la duración y la curva | `toHaveLength` Expected 2, Received 1 (línea 313) | ✔ |
| M2 | `WELCOME_ENTRANCE_EASING = Easing.linear` | 1 | 1 / 27 | R10 › fija la duración y la curva | `TypeError: _index.WELCOME_ENTRANCE_EASING.factory is not a function` (línea 310), el error declarado | ✔ |
| M2b | `Easing.bezier(0.25, 0.1, 0.25, 1)` | 1 | 1 / 27 | R10 › fija la duración y la curva | `toBeCloseTo` Expected 0.39812410465104964, Received 0.09479630571604326 | ✔ |
| M3 | sin `reduceMotion: ReduceMotion.Never` en el fade | 1 | 1 / 27 | R10 › fija la duración y la curva | `toHaveLength` Expected 1, Received 0 (línea 315) | ✔ |
| M4 | fade con `duration: reduceMotion ? 0 : WELCOME_ENTRANCE_MS` | 1 | 1 / 27 | R10 › fija la duración y la curva | `toHaveLength` Expected 2, Received 1 (línea 313) | ✔ |
| M6 | `marginTop: translateY.get()` extra | 1 | 3 / 25 | R10 › arranca…, termina…, con Reduce Motion… | `toHaveAnimatedStyle` `'marginTop' should be undefined, but is 16` (0 en Reduce Motion) | ✔ |

Las nueve coinciden con el handoff y con lo que reporta el impl.

## 4. Barrido de zona ciega (sondas propias)

Mismo procedimiento y la misma restauración, con exit 0 en worktree e
índice después de cada una.

| # | Rama / cláusula | Mutación en `index.tsx` | Resultado |
| --- | --- | --- | --- |
| **X1** | **R10 E2: `Never` solo en el fade** | **`reduceMotion: ReduceMotion.Never` movido del fade al `withTiming` de `translateY`** | **VERDE 28/28 ✘ (E6)** |
| **X2** | **R10 WHEN: `translateY` anima 240 ms** | **`reduceMotion: ReduceMotion.Always` añadido al `withTiming` de `translateY`** | **VERDE 28/28 ✘ (E6)** |
| X3 | R10, segundo `withTiming` | `easing: Easing.linear` solo en `translateY` | rojo, `fija la duración…` `toHaveLength` 2/1 ✔ |
| X4 | R10, segundo `withTiming` | `duration: 400` solo en `translateY` | rojo, `fija la duración…` 2/1 ✔ |
| X11 | R10 WHILE | fade con `easing: reduceMotion ? Easing.linear : WELCOME_ENTRANCE_EASING` | rojo, `fija la duración…` 2/1 ✔ |
| X13 | R10, curva casi igual | `Easing.bezier(0.22, 1, 0.36, 1)` | rojo, `toBeCloseTo` en 0.1 ✔ |
| X5 | R10 E3, otra clave animada | `{ scale: 0.96 + opacity.get() * 0.04 }` dentro de `transform` | rojo en los 3 `it` de estilo, `'transform' should be [{"translateY":16}]` ✔ |
| X8 | R10 E3 / R5, clave estática extra | `paddingTop: 8` junto a `alignItems`/`gap` | rojo en los 3 `it` de estilo, `'paddingTop' should be undefined, but is 8` ✔ |
| X6 | R6 f.10, solo el tercer chip | `accessibilityRole="button"` solo en `welcome-chip-nutrition` | rojo, fila 10 `not.toBe('button')` ✔ |
| X10 | R6 f.10, solo el tercer chip | el tercer chip como `Pressable` con `onPress` (los otros siguen como `View`) | rojo, fila 10 (y fila 11 por la clase duplicada) ✔ |
| X7 | R6 f.10, prop moderna | `role="button"` en los tres chips, sin `onPress` | verde 28/28 (obs. 2, no bloquea) |
| X9 | R8, el otro CTA | secundario con `router.replace('/login')` | rojo, `R8 › empuja a login sin reemplazar` ✔ |
| X12 | R5 E5, otro asset | hero con `icon.png` | rojo, `R5 › pinta hero…` ✔ |

Cláusulas con candado en cada rama: los tres chips (X6, X10), los dos CTA
(X9 más S17, S18 y S21 de la ronda 1), la duración y la curva en los dos
`withTiming` (M1, M11, X3, X4), Reduce Motion activo (S26 de la ronda 1,
M4, X11) y las claves animadas (M6, X5, X8). Sin candado: **dónde va
`reduceMotion`** (X1, X2).

### Comprobación de comportamiento de X1 y X2 (spike fuera del árbol)

En jest, Reduce Motion de sistema está apagado, así que la suite no ve la
diferencia. Para medir la consecuencia real escribí un spike fuera del árbol
(`r2probes/spike/*.test.tsx` en el scratchpad, lanzado con `--roots` y
`--modulePaths`). Activa
`ReducedMotionManager.setEnabled(true)` de
`react-native-reanimated/lib/module/ReducedMotion`, que es la misma
instancia que resuelve jest (`require.resolve` →
`node_modules/react-native-reanimated/lib/module/index.js`). Después mide
`getAnimatedStyle` a los 48 ms. Mecanismo en Reanimated 4.5.1,
`src/animation/util.ts:150-155` y `:503-514`: sin `reduceMotion` en la
config, la animación usa el valor del sistema, y si está activo hace
`current = toValue` y `onFrame = () => true`.

| Escenario | HEAD | Mutación |
| --- | --- | --- |
| Reduce Motion de sistema activo, `useReducedMotion() → true`: opacidad a 48 ms | 0.6818… (sigue animando) | M3: 1 (salta). **X1: 1 (salta)** |
| Reduce Motion apagado: `translateY` a 48 ms | 5.0901… (sigue animando) | **X2: 0 (salta)** |

Con X1, en un dispositivo con Reduce Motion activo, la bienvenida aparece de
golpe. Eso incumple la rama WHILE de R10 («solo `opacity` SHALL animar 0→1
con la misma duración»), y la propia Enmienda lo da como motivo de E2. Con
X2, sin Reduce Motion, el contenido no se desliza. Eso incumple la rama
WHEN («animar … hasta `translateY: 0` en 240 ms»). La suite queda en 28/28
en los dos casos.

## 5. Trazabilidad

- R5 › pinta hero… → `3932781d` (E5) ✔
- R6 › deja cada chip sin pulsación… (fila 10) → `3eff471b` (E4) ✔
- R10 › fija la duración y la curva → `c5bc8da1` (E1 y E2) ✔
- R10 › arranca… / termina… / con Reduce Motion… → `7c86fcad` (E3) ✔
- `git merge-base --is-ancestor <hash> HEAD` da exit 0 para `3932781d`, `3eff471b`, `c5bc8da1`, `7c86fcad` y `4ff4c247`. No hubo rebase después de escribir los hashes
- Las demás filas no cambian (diff de traceability.md: solo esas 6 filas)

## 6. C4 en el impl

La sección «Ronda 2 — Enmienda E1–E5» del impl documenta cada una de las
nueve sondas con el diff de la mutación, las cuentas, el exit, el `it` rojo
y matcher/Expected/Received (o el `TypeError` declarado de M2), los dos
exit de restauración (`worktree_exit=0`, `index_exit=0`) y la corrida verde
después de restaurar. Incluye además pwd, branch y H0, las skills de su
catálogo (`building-native-ui`, `animate-expo`), las 14 anclas de entrada y
las 6 de cierre, la base, el cierre y el alcance contra H0. Los números
coinciden con mis corridas.

## 7. Suites, typecheck, lint y R12 (corridos por el reviewer, sin pipe)

```
welcome:          Tests: 28 passed, 28 total                      exit=0
ocho suites BASE: Test Suites: 8 passed, 8 total / Tests: 251 passed, 251 total   exit=0
test ! -e .expo/types/router.d.ts → guard_exit=0
bun run typecheck → exit=0
bun run lint      → exit=0
git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock → vacío (0 bytes)
git diff 4ff4c247 HEAD -- …package.json …bun.lock …app.json → vacío
```

## Observaciones

### Hallazgo bloqueante

**E6 — R10 (Enmienda E2): `reduceMotion` se cuenta en el fichero, no se ata a su `withTiming`.**
Fichero: `mobile-pet-tracker/src/screens/welcome/index.test.tsx`. Ancla:
`grep -cF "expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);"`
→ `1`, dentro de `it('fija la duración y la curva'`. La cláusula tiene dos
ramas: «el del fade lleva `reduceMotion: ReduceMotion.Never` … el de
`translateY` no lo lleva». El candado solo comprueba que la cadena aparece
una vez en todo el fichero:
- X1, `Never` movido al `withTiming` de `translateY`: verde. En
  dispositivo, con Reduce Motion activo, el fade salta a 1 (medido arriba).
  Es el hueco de M3 (E2 de la ronda 1) con una línea más.
- X2, `reduceMotion: ReduceMotion.Always` en el de `translateY`: verde. Sin
  Reduce Motion, `translateY` salta a 0 (medido arriba). Es una mutación
  menos natural, pero se cierra con el mismo arreglo.

Origen: la lista de tests de R10 «(Enmiendas E1 y E2)» prescribe ese
`toHaveLength(1)` global, que fue mi propuesta en la ronda 1. Codex lo copió
literal. Hay que enmendar R10 otra vez. Arreglo validado: sobre el fuente de
HEAD, X1, X2, M3, M4, M1 y M11, evaluado con node contra
`src/screens/welcome/index.tsx` y restaurado después. Dentro del mismo `it`,
conservar las tres regex actuales y añadir:
1. `expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);`
   (HEAD 1; X2 2; M3 0).
2. `expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);`
   (HEAD sí casa; X1 y M3 no casan; X2, M4, M1 y M11 casan, y a esos ya los
   para la regex de cableado).

Con las dos líneas, X1, X2 y M3 caen en `R10 › fija la duración y la
curva` y la suite sigue en 28 `it`. Antes de devolverlo a Codex conviene
añadir X1 y X2 a design.md §2 y a la tabla de sondas del handoff.

### No bloqueantes

- obs. 1 — Codex añadió `?? []` a los tres `source.match`, aunque la spec
  no lo pone. Lo declara en el impl y es lo que permite el «Received 0» que
  pide la tabla de sondas. Aceptado. Si R10 se enmienda, conviene escribirlo
  ya en el texto normativo.
- obs. 2 — X7: con `role="button"` (el prop moderno de RN, que tiene
  precedencia sobre `accessibilityRole`) en los chips sin `onPress`, la
  suite queda en 28/28. La fila 10 nombra solo `accessibilityRole`, así que
  no lo reclamo como bloqueante. Validé en el spike que `role` llega al nodo
  host: `expect(chip.props.role).toBeUndefined()` está verde en HEAD y cae
  en X7 con `Received: "button"`. Es barato meterlo en la misma enmienda.
- obs. 3 — design.md §2, fila «`WELCOME_ENTRANCE_EASING = Easing.linear`
  (E1)», da como rojo `toBeCloseTo`, pero el rojo real es el `TypeError` de
  `.factory` que declara el handoff (M2), y M2b es la sonda que cae por
  aserción. Si se toca design.md por E6, conviene alinear esa fila.
- obs. 4 — El commit de firma `4ff4c247` cita la página y la hora de Notion,
  pero no la cuenta. Explica que la API no la devuelve. Lo dejo anotado
  respecto a CLAUDE.md §Gate de specs vía Notion.
- obs. 5 — R13 (smoke humano S1–S8 en dev build de Android) sigue
  pendiente del humano.
- obs. 6 — Las observaciones 3, 4 y 5 de la ronda 1 (TypeError con un
  cuarto chip, mock de `useThemeColors` que no distingue la clave, M5 con
  opacidad estática) siguen igual. Esta ronda no las tocaba.

## Output de ./init.sh

No lo corre el subagente: el clasificador se lo deniega y LocalStack y
Postgres se comparten con otra sesión. Lo lanzó el leader con permiso del
humano. Log: `init-118-r3.log` en el scratchpad de la sesión.

```
head=f23345c3
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
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
head_end=f23345c3
exit=0
```
`git rev-parse HEAD` en wt-118 da `f23345c3737cc1537e32d58e3262492808840850`,
que coincide con head y head_end del log. El log corrió en
`/home/claude/sites/Pet-Tracker-wt-118`. Las líneas `ERROR` de Nest del log
son trazas esperadas de tests de error, no fallos (las suites pasan).
