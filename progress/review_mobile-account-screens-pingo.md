# review: mobile-account-screens-pingo (#167)
Fecha: 2026-10-12T21:36Z
HEAD revisado: `a27664f8192cd523a8f289bead5d66d0a53304c7` (branch `feature/167-mobile-account-screens-pingo`, worktree `Pet-Tracker-wt-167`, árbol limpio)
H0 (handoff): `7c2ffe6b59685cd86fbdae4de3e5abc341669fac`
Veredicto: **RECHAZADO** (4 hallazgos bloqueantes, B1–B4)

El código de producción cumple R1–R14 en todo lo que he leído y la historia
test-primero es correcta. El rechazo es por **candados**: cuatro cláusulas
explícitas de la spec admiten una mutación que deja verdes todos los tests.
Las cuatro vienen del diseño de tests de tasks.md, que Codex siguió al pie de la
letra; no son desviaciones de Codex. El remedio son candados nuevos, que
nacerían verdes sobre el código actual. Las sondas de abajo sirven de rojo para
cada uno.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: en `feature_list.json` solo #167 está en `in_progress`
- [x] `progress/current.md` describe la sesión #167 y es coherente con el handoff y el informe

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica, porque la feature es solo móvil y no toca `backend-pet-tracker/`
- [x] Contratos: no aplica
- [x] Las pantallas dependen de componentes compartidos (`HomeEntrance`, `PopIn`, `Card`) y de tokens de `src/theme/motion.ts`; ninguna receta duplicada
- [x] Sin lógica de negocio nueva: el cambio es de presentación. Los cuerpos de `LoginScreen` y `RegisterScreen` en `e5ee5a5f` difieren de la base `app/(auth)/*.tsx` solo en la línea `export function` (R1.3)

## Checklist C4 — TDD
- [x] Cada R1–R14 tiene `it` que nombran su R-id (`#167 Rn: …`), y los `describe` también. R15 es humano
- [x] La historia es test-primero: los commits `test(...)` solo tocan ficheros de test y preceden a su `feat(...)` (tabla abajo)
- [x] Los que nacen verdes están declarados en tasks.md y su sonda está en el informe: R1.6 (c2), R11 4.º `it`, R13 (c25) y R14 (c26)
- [x] Rojos verificados de forma independiente en un worktree desacoplado (`git worktree add --detach`, borrado después):
  - `dbdfb49b`: `Tests: 4 failed, 17 passed, 21 total`, los 4 `#167 R8`;
  - `50972818`: `Tests: 11 failed, 45 passed, 56 total`;
  - `fc49e87f`: `Tests: 13 failed, 68 passed, 81 total`.

  Los tres coinciden con el informe.
- [ ] **Cada cláusula con su candado.** Fallan B1–B4: cuatro cláusulas explícitas de R6.2, R7.1, R7.3 y R10.3 no tienen ningún test que las mire

## Checklist C5 — Trazabilidad
- [x] `traceability.md` solo tiene `pendiente` en R15, que es «pendiente (humano)», la prueba de humo que el leader excluye de este veredicto
- [x] Sus 27 hashes son ancestros de HEAD (`git merge-base --is-ancestor`)
- [x] Los commits siguen `feat(mobile): … (Rn)` / `test(mobile): … (Rn)`, más `refactor(mobile)` para R1 y `docs(ui)` para la enmienda R11

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y `- [x] Aprobado por humano (fecha: 2026-10-12)`, firmado en `ed8158b6`. No cambia después
- [x] design.md y tasks.md cambian tras la firma, en H0 `7c2ffe6b`: son correcciones del leader documentadas en línea (ver O1)

## Checklist C7 — Sin código huérfano
- [x] `src/app/(auth)/login.tsx` y `register.tsx` quedan como rutas delgadas de 5 líneas, con el contenido exacto de R1, comprobado con `cat -A`
- [x] Los tests de pantalla se movieron a `src/screens/{login,register}/index.test.tsx` y ya no queda ninguno en `app/(auth)/__tests__/` salvo `layout.test.tsx`
- [x] El ancla `grep -rlE "\(auth\)[/'\", ]+(login|register)"` da las 3 referencias declaradas en tasks.md T1.10

## Checklist C8 — UI móvil conforme a la carta
- [x] **Grep-clean** sobre las líneas `+` del diff de producción (`git diff 7c2ffe6b..HEAD -- mobile-pet-tracker/src`, sin tests):
  - 0 hex: los 4 aciertos de la regex son comentarios `// #167 R2`;
  - 0 clases arbitrarias `[...]`, 0 `StyleSheet.create`, 0 shadow/elevation;
  - 0 `rounded-{sm,md,lg,2xl,3xl}`, 0 `text-accent` suelto.
- [x] **Dimensiones.** Los `contentContainerStyle` con insets no cambian, y los candados #61 R7 y #148 siguen verdes
- [x] **Skeleton:** no aplica, no hay estados de carga nuevos
- [x] **Componentes compartidos.** `login-bubble` y `reset-success-card` son `Card variant="secondary"`, cuyo componente aplica `CONTINUOUS_CORNER`. El disco `reset-success-check` es `rounded-full`, una cápsula exenta. El tile de forgot conserva `style={CONTINUOUS_CORNER}`
- [x] **Tappables:** no hay pulsables nuevos
- [x] **Animaciones.** `PopIn` y `PingRing` usan shared values y `useAnimatedStyle`, y solo animan `opacity` y `transform`, sin color en estilos animados. Además:
  - escala desde 0.9, nunca 0;
  - reduce motion conserva el fundido y quita la escala (R3.3);
  - los anillos no se pintan bajo reduce motion (R13);
  - el bucle infinito de los anillos está amparado por la Enmienda #167 de la carta (R11);
  - el rebote `dampingRatio: 0.6` de `MOTION_POP_SPRING` lo aprobó el humano en la pregunta abierta de requirements.md.
- [x] Carta `docs/ui-guidelines.md`: el bullet y la sección `## Enmienda #167` coinciden literalmente con R11.1 y R11.2. La casilla `- [ ] Enmienda aprobada por humano` sigue sin marcar a propósito, y el candado R11 la tolera (sonda K)
- Observación de carta fuera de alcance: O5 (`selectable` en errores)

## Commits y rojos

| c | Hash | Tipo | Ficheros | Rojo/verde (informe; ✓ = verificado por mí) |
|---|---|---|---|---|
| c1 | e5ee5a5f | refactor R1 | movimiento a `src/screens/{login,register}` y renombrado de rutas en 5 tests | verde 367/367 (declarado) |
| c2 | 7297bde0 | test R1.6 | design-drift | nace verde (declarado), sondas S1 rojas |
| c3/c4 | e009c792 / 43a45f50 | R2 | motion.test / motion.ts | 5 rojos / verde |
| c5/c6 | 697b3199 / a6fa7a86 | R3 | pop-in.test / pop-in.tsx | módulo ausente / 4 verdes |
| c7/c8 | da81e1d7 / 7ff33151 | R4 | home-entrance | 1 rojo / verde |
| c9/c10 | c4e3b3a0 / 1f3e0cc0 | R5 | language-provider / catalog y §2.24 de mobile-ui-language/design.md | 2 rojos / verde |
| c11/c12 | 6e169e1b / 5b31f8a2 | R6 | login test, ui-copy-table, ui-language / login | 11 rojos / 206 verdes |
| c13/c14 | 9c02f7a0 / b5433595 | R7 | register | 4 rojos / verde |
| c15/c16 | dbdfb49b / ed49c8ca | R8 | register | 4 rojos ✓ / verde |
| c17/c18 | 0c66e6c5 / 0a63d4e9 | R9 | forgot | 4 rojos / verde |
| c19/c20 | 50972818 / 3e168e10 | R10 | reset, legibility | 11 rojos ✓ / 215 verdes |
| c21/c22 | f5b7bd17 / 5834b4e5 | R11 | welcome test / carta | 3 rojos / verde |
| c23/c24 | fc49e87f / 13835918 | R12 | welcome | 13 rojos ✓ / 237 verdes |
| c25 | 7c4f727d | test R13 | welcome | nace verde (declarado), S13: 6 rojos |
| c26 | 108bd291 | test R14 | design-drift | nace verde (declarado), S14.1–4: 1 rojo cada una |
| — | ee27c69f / e48b94aa | docs | trazabilidad / informe | — |
| — | a27664f8 | docs (leader) | handoff | — |

## Lista cerrada (K5)

`git diff --no-renames --name-only 7c2ffe6b..HEAD`, quitando feature_list.json,
progress/current.md, el handoff, specs requirements/design/tasks.md y este
fichero, deja **31 rutas, idénticas a las 31 del handoff §K5**. Fuera de la
lista solo aparece `progress/handoff_mobile-account-screens-pingo.md` (commit
del leader `a27664f8`). Ni `requirements.md`, ni `design.md`, ni `tasks.md`
cambian después de H0. Ningún fichero de `backend-pet-tracker/` ni de `infra/`.

## Sondas propias

Las corrí en un worktree desacoplado en `a27664f8`, con `node_modules` enlazado y
borrado al terminar, para no tocar `Pet-Tracker-wt-167`. Cada una es una sola
mutación, con `FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath …`
y revertida con `git checkout HEAD -- <ruta>`, que dio `limpio=0` en todas.
Las rutas son relativas a `mobile-pet-tracker/`.

| Id | Mutación | Test | Resultado | Lectura |
|---|---|---|---|---|
| A | login: el bloque `{error ? <Text testID="login-error"> …}` pasa a ir detrás de `link-forgot`, dentro de `login-body` | `src/screens/login/index.test.tsx` | `Tests: 20 passed, 20 total` | **Zona ciega: B1** |
| G | reset, rama de éxito: `reset-header` con `index={3}` y `className="items-center gap-8"`, y el título delante de `reset-pingo` | `src/screens/reset-password/index.test.tsx` | `Tests: 29 passed, 29 total` | **Zona ciega: B2** |
| O1 | register: `register-submit` envuelto en un `<View>`, así que deja de ser hijo directo del scroll | `src/screens/register/index.test.tsx` | `Tests: 21 passed, 21 total` | **Zona ciega: B3** |
| R1 | register: el título de la cabecera pasa a `className="text-center text-xl font-bold text-foreground"` | register, consistency-classnames, legibility-classnames, design-drift | `Tests: 181 passed, 181 total` | **Zona ciega: B4** |
| R2 | login: el título de la cabecera pasa a `className="text-left text-xl font-bold text-foreground"` | login, consistency-classnames, legibility-classnames, design-drift | `Tests: 180 passed, 180 total` | **Zona ciega: B4** |
| N | reset: dentro de `reset-body`, error y envío se mueven delante de los dos campos | reset-password | `Tests: 29 passed, 29 total` | Ciega, pero R10.1 no dice «en orden» (O4) |
| B | PopIn: `withSpring(1, MOTION_POP_SPRING)` pasa a `withSpring(1, { duration: 400, dampingRatio: 1 })` | pop-in | `Tests: 4 passed, 4 total` | Ciega declarada: R3.2 solo hace observables los 200 ms y los 1500 ms (O3) |
| C | PopIn: quitar `, ReduceMotion.Never` de la opacidad | pop-in | `Tests: 4 passed, 4 total` | Ciega declarada, no observable en jest (O3) |
| D1 | PopIn: quitar el `if (!reduceMotion)` de la escala | pop-in | `Tests: 4 passed, 4 total` | Mutante equivalente: spring de 1 a 1 |
| D2 | PopIn: `useSharedValue(MOTION_ENTRANCE_SCALE)` siempre | pop-in | 1 failed: `con reduce motion funde la opacidad y no escala` | Cubierta, aserción |
| P | PopIn: la opacidad arranca en 1 bajo reduce motion | pop-in | 1 failed: el mismo `it` | Cubierta, aserción |
| Q | PopIn: la escala sin `withDelay` | pop-in | 1 failed: `entra desde opacidad 0 y escala 0.9 tras 250 ms` | Cubierta, aserción |
| J | HomeEntrance: `style={className ? {} : undefined}` | home-entrance | 2 failed (`no añade estilo propio`, `#167 R4: pasa className tal cual sin añadir style`) | Cubierta |
| H | forgot: `rotate: sent ? '0deg' : '6deg'`, que solo rompe el estado de enviado | forgot | 1 failed: `#167 R9: Pingo precede al tile del candado tras enviar` | Cubierta, un candado por estado |
| I | register: `useThemeColors(['accent'])` en lugar de `['danger']` | register | 1 failed: `#167 R8: el icono del error mide 14 y usa danger` | Cubierta |
| O | register: `AlertCircle size={16}` | register | 1 failed: el mismo `it` | Cubierta |
| E | anillos: retardo `duration / 2` | welcome | 2 failed (3300 ms, 4100 ms) | Cubierta, aserción |
| F | anillos: la escala con `withRepeat(…, -1, true)` | welcome | 2 failed (`#167 R12: los anillos se repiten sin invertir` y el de flotar de la base) | Cubierta |
| L | anillos: `border` en lugar de `border-2` solo en el anillo 2 | welcome | 1 failed: `#167 R12: el anillo 2 es un círculo de borde acento` | Cubierta, `it.each` por anillo |
| U | anillos: la opacidad con easing lineal (`{ ...MOTION_PING_TIMING, easing }`) | welcome | 1 failed: `usa el fundido y el muelle de motion.ts` (base) | Cubierta por la guarda de tokens de la base |
| K | carta: `- [ ] Enmienda aprobada por humano` de la Enmienda #167 pasa a `- [x]` | welcome | `Tests: 85 passed, 85 total` | Tolerancia `[ xX]` confirmada: el leader puede marcarla en el cierre |

No volví a correr S13 ni S14: las cubre el informe, con 6 rojos y 1 rojo por sonda.

## Observaciones

### Bloqueantes

**B1. R6.2: la posición de `login-error` en `login-body` no tiene candado.**
- R6.2 dice que `login-body` contiene, «en el orden de la base», `login-email`, `login-password`, `login-error` (cuando hay error), `login-submit`, `link-register` y `link-forgot`.
- El `it('#167 R6: el cuerpo lleva el formulario en el orden de siempre')` de `src/screens/login/index.test.tsx` filtra por la regex `/^(login-email|login-password|login-submit|link-register|link-forgot)$/`, que deja fuera `login-error`. De `login-error` solo comprueba que está dentro del cuerpo.
- Sonda A: con el error movido detrás de `link-forgot`, todo sigue verde (20/20).
- Falta un candado de orden que incluya `login-error` en el estado con error.

**B2. R10.3: la `reset-header` de la rama de éxito no tiene candado.**
- R10.3 dice que la rama de éxito pinta «`reset-header` (el mismo de R10.1)», es decir `index={0}`, `className="flex-row items-center justify-center gap-3"` e hijos `[reset-pingo, título]`.
- `src/screens/reset-password/index.tsx` duplica ese JSX en las dos ramas.
- Los tests solo fijan la cabecera en la rama de formulario: el mapa de entradas del primer render y `#167 R10: la cabecera lleva a Pingo y después el título`. En la rama de éxito solo miran la pose de `reset-pingo` y el orden `[reset-header, reset-success-pop, link-login]`.
- Sonda G: en la rama de éxito, `index={3}`, `className="items-center gap-8"` y el título delante de Pingo; todo sigue verde (29/29).
- Es una cláusula universal («el mismo», en las dos ramas) con candado en una sola rama. Faltan el mapa de `HomeEntrance` y el orden de hijos de `reset-header` en la rama de éxito.

**B3. R7.3: «hijos directos del scroll» no tiene candado; su premisa es falsa.**
- R7.3 dice que los campos, sus `FieldError`, `register-terms`, el error general y `register-submit` «siguen siendo hijos directos del scroll». Delega el candado en «el `it` de #61 R7 que lo dice».
- Ese `it('conserva los campos del formulario como hijos directos del scroll')` de `src/screens/register/index.test.tsx` solo asevera `toBeVisible()` de `register-first-name` y `register-submit`, más `getAllByText('Crear cuenta')` de longitud 2. No mira el padre de nada.
- El `it` nuevo `#167 R7: ningún campo ni el envío quedan dentro de la cabecera` cubre solo la segunda mitad de R7.3.
- Sonda O1: con `register-submit` envuelto en un `<View>`, todo sigue verde (21/21).
- Falta un candado sobre los hijos de `register-form`, el host del scroll.

**B4. R6.2 y R7.1: «misma `className` que en la base» del título no tiene candado.**
- R6.2 (login) y R7.1 (registro) piden que el título movido a la cabecera conserve su `className` de la base, `text-center text-2xl font-black text-foreground`.
- Ningún test la mira:
  - los `it` de cabecera comparan el nodo con `getByText`;
  - consistency-classnames, legibility-classnames y design-drift no la cuentan.
- Sondas R1 y R2: cambiando la clase del título en registro y en login, todo sigue verde (181/181 y 180/180).
- Falta un `toBe` de la `className` del título en cada pantalla.
- Reset no entra en este hallazgo, porque R10.1 no dice «misma className».

### No bloqueantes

**O1. Cambios de design.md y tasks.md tras la firma, en H0 `7c2ffe6b`.** Son correcciones del leader declaradas en línea:
- design.md, 3 líneas: el doble de `useThemeColors` se toma de `pet-map.test.tsx`.
- tasks.md, 33 líneas:
  - la regla «Prettier no se ejecuta»;
  - el ancla `(auth)` = 3;
  - el desglose de rojos de T7 y T11;
  - la cuenta 215 de c20;
  - la cabecera en línea en las dos ramas de reset;
  - las cifras de las sondas S12 y S13.

requirements.md no cambia. Son correcciones mecánicas, del mismo tipo que O1 de #166.

**O2.** El frontmatter de design.md, tasks.md y traceability.md sigue en `status: draft … pendiente de firma humana`, aunque requirements.md está `approved`. Es cosmético; conviene alinearlo en el cierre.

**O3. Zonas ciegas declaradas por la spec.**
- El token de spring de `PopIn` (sonda B) y `ReduceMotion.Never` de su opacidad (sonda C) no son observables en jest. R3.2 limita lo observable a los 200 ms y los 1500 ms.
- La sonda D1 es un mutante equivalente.
- Lo que queda solo se puede comprobar en la prueba de humo R15: el pop con rebote y el fundido bajo reduce motion en el dispositivo.

**O4.** El orden de `reset-body` no tiene candado (sonda N). R10.1 enumera los nodos sin decir «en orden», así que no lo cuento como bloqueante. Si se abre una enmienda por B1–B4, conviene fijarlo con el mismo patrón que B1.

**O5. Deuda de carta previa: errores sin `selectable`.** `docs/ui-guidelines.md` pide `<Text selectable />` en mensajes de error.
- `login-error` y `register-error` no lo llevan, ni en la base `d2b8b0ae` ni ahora; `reset-error` sí.
- R8 reescribe la `className` de `register-error` sin añadirlo, porque la spec no lo pide.
- Fuera de alcance de #167; propongo registrarlo como deuda.

**O6.** El título del `it('resuelve las 36 ocurrencias normativas')` de `src/__tests__/ui-language.test.ts` quedó desfasado: la cuenta es ahora `29 + 7 + 1` = 37. R6.4 solo prescribía la línea del `toHaveLength`. Es cosmético.

**O7. K3 `--runInBand`.** El humano lo autorizó solo para el ALL de K3, y está documentado en el informe. El init.sh del leader en paralelo normal confirma 99/2841 en verde, así que no es motivo de rechazo.

**O8.** Según su propio informe, Codex lanzó y cortó init.sh. Es el problema conocido de la prohibición mal colocada en AGENTS.md. No afecta al árbol revisado.

## Output de ./init.sh

El leader corrió init.sh sobre HEAD `a27664f8` (exit 0). El clasificador se lo
deniega al reviewer, y además comparte LocalStack/Postgres con wt-169. Leí el
log `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/5bf0fe41-c38a-4318-8d51-90f545e0be95/scratchpad/167-init.txt`:
34 997 líneas, todas las rutas son de `Pet-Tracker-wt-167`, y terminó a las
21:19:55Z, después del commit `a27664f8` de las 21:12:31Z. HEAD sigue en
`a27664f8192cd523a8f289bead5d66d0a53304c7` con el árbol limpio. El chequeo
final da `limpio=0`: `git diff --cached --quiet && git diff --quiet && test -z "$(git ls-files --others --exclude-standard -- mobile-pet-tracker docs specs)"`.

```
✅ Build exitoso
backend unit   Test Suites: 187 passed, 187 total / Tests: 1474 passed, 1474 total
harness        Test Suites: 2 passed, 2 total     / Tests: 14 passed, 14 total
mobile         Test Suites: 99 passed, 99 total   / Tests: 2841 passed, 2841 total
               0 líneas FAIL; PASS en los 13 ficheros de test de la feature
               (welcome, register, forgot, reset-password, login, ui-language,
               design-drift, language-provider, consistency-classnames, pop-in,
               home-entrance, motion, legibility-classnames)
backend e2e    Test Suites: 3 skipped, 30 passed, 30 of 33 total / Tests: 8 skipped, 468 passed, 476 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
avisos: ".env desactualizado: faltan 6 claves de .env.example";
        "STATUS.md desactualizado (154/170 declarado vs 154/171 real)";
        "A worker process has failed to exit gracefully" (suite móvil)
```

El total móvil cuadra. La base ALL del informe (B2) es 98/2775. Se suma 1 suite
nueva, `pop-in.test.tsx`; login y registro se mueven, no se suman. Y se suman
66 `it`, de 367 a 433 en la tabla de Cuentas. Total: 99/2841.

## Barrido de la Enmienda E1 (pre-firma)

Fecha: 2026-10-12T22:15:57Z. Reviewer, antes de la firma humana de la Enmienda E1.
No es la ronda 2: todavía no hay implementación nueva.

**Resultado: 1 hueco bloqueante (X1) y 6 observaciones (X2-X7).**

### Cómo se midió

- **Spike.** `…/scratchpad/spike167`, worktree de `a27664f8`. Su producción es
  idéntica a `108bd291` y lleva aplicados sin commit los cinco `it` de E1.
- **Los `it` de E1 en el spike son los de tasks.md.** Se compararon las líneas
  añadidas en el diff de los tres `index.test.tsx` con los tres bloques `tsx` de
  tasks.md §Enmienda E1, y coinciden en los tres. Las seis anclas de inserción
  (`describe(…)` e `it(…)`) dan `grep -cF` = 1 en HEAD.
- **Comando.** Cada sonda corrió solo el fichero de test de su pantalla:
  `FORCE_COLOR=0 bunx jest --testTimeout=30000 --maxWorkers=1 --runTestsByPath <fichero>`.
- **Restauración.** Cada mutación se deshizo con `git checkout HEAD -- <fichero>`
  y se comprobó `limpio=0` antes de la siguiente.
- **Candados propuestos.** Se midieron en copias temporales `zz-sweep.test.tsx`
  de los tres tests, borradas al acabar.
- **Estado final del spike.** `git status --short` muestra solo los tres
  `index.test.tsx` y `?? node_modules`.
- **Sin medir.** `typecheck`, `expo lint`, BASE 438 y ALL 2846. Por permiso, solo
  podía correr ficheros de test sueltos.

### Exactitud de tasks.md §Enmienda E1

| Paso | Declarado | Medido | Tipo de rojo |
|---|---|---|---|
| Verdes (2), (4), (6) | 22 / 23 / 30 | `22 passed, 22 total` / `23 passed, 23 total` / `30 passed, 30 total` | — |
| `it` estáticos | 17/19/23 antes, 19/21/24 con E1 | 17/19/23 y 19/21/24 | — |
| (1) rojo R6 | `2 failed, 20 passed, 22 total` | igual | aserción: `toEqual` (con error) y `toBe` (título). `Unable to find` = 0 |
| (3) rojo R7 | `2 failed, 21 passed, 23 total` | igual | aserción: `toBe` los dos. `Unable to find` = 0 |
| (5) rojo R10 | `1 failed, 29 passed, 30 total` | igual | aserción: `toEqual`. `Unable to find` = 0 |
| S1 | `1 failed, 22 passed, 23 total` | igual | aserción (`toBe`), el `it` declarado |
| S2 | ídem | igual | ídem |
| S3 | ídem | igual | ídem |
| S4 | ídem, por consulta | igual | `Unable to find an element with testID: register-country-error` |
| S5 | `1 failed, 29 passed, 30 total` | igual | aserción: el matcher es `toHaveProperty` (`children[0]`). La tabla solo dice «aserción», así que es correcta |

Las tres mutaciones versionadas se aplicaron tal como las describe la prosa y
dieron exactamente esos rojos. Lo que se puede mejorar de su redacción está en X7.

### Cobertura de E1 por cláusula

| Cláusula | Qué la cubre |
|---|---|
| **R6.2**, orden con error | E1 |
| **R6.2**, orden sin error | `it` de la ronda 1. Es ciego a un `login-error` sobrante: ver **X1** |
| **R6.2**, clase del título | E1 (sondas R2 y (1)) |
| **R6.2**, orden de la cabecera | Ronda 1. Sonda H10 (saludo detrás del título): 1 failed `#167 R6: la cabecera lleva el saludo y después el título` |
| **R6.2**, «ningún nodo de login-body está dentro de login-header» | Ronda 1 |
| **R7.1**, clase | E1 (sonda R1) |
| **R7.1**, hijos en orden y mapa | Ronda 1 |
| **R7.3**, completa (siete campos, sus `FieldError`, términos, error general y envío) | E1. Sondas O1/(3), S1, S2, S3 y S4. «Ninguno dentro de register-header»: el `it` de la ronda 1 |
| **R10.3**, completa | E1 cubre la cabecera «el mismo de R10.1»: índice, clase, `[reset-pingo, título]`. Sondas G/(5) y S5 |
| **R10.3**, orden de las tres piezas, mismo padre y `reset-body` nulo | Ronda 1 |
| **R10.3**, Pingo y mapa de `PopIn` | Ronda 1. Pingo por rama |

Sondas extra que confirman candados existentes (sin hueco):

| Sonda | Mutación | Rojo |
|---|---|---|
| H4 | hijos de la cabecera del formulario de reset intercambiados | 1 failed `#167 R10: la cabecera lleva a Pingo y después el título` |
| H5 | `AlertCircle` detrás del texto en `register-error-row` | 1 failed `#167 R8: el error general va en una fila con icono` |
| H11 | `login-bubble` delante de `login-pingo` | 1 failed `#167 R6: el saludo pone a Pingo junto a su burbuja` |
| H12 | en `reset-success-card`, el texto delante de `reset-success-check` | 1 failed `#167 R10: la tarjeta de estado es secondary con check y texto` |

**Delimitaciones «sin cambios».** `git diff d2b8b0ae 108bd291 -- mobile-pet-tracker/src/screens/reset-password/index.tsx`:

- `link-login` solo aparece como contexto, así que cumple R10.3 «sin cambios»;
- no hay ningún hunk en la rama sin token, así que cumple R10.5.

### Hallazgos

**X1. BLOQUEANTE. R6.2, el orden «sin error» de `login-body`.**

- **Cláusula.** R6.2: «`login-body` SHALL contener, en el orden de la base,
  `login-email`, `login-password`, `login-error` (cuando hay error), `login-submit`,
  `link-register` y `link-forgot`».
  - Sin error, ese orden son cinco nodos. El `it` de la ronda 1 que lo fija
    filtra con una regex de cinco ids que **excluye** `login-error`, así que no
    puede ver un `login-error` que sobre.
  - Es exactamente el «orden con y sin error» que pedía el barrido.
- **Mutación (H1).** El bloque `{error ? (` … `) : null}` de `login-error` pasa
  a pintarse siempre:
  `<Text testID="login-error" className="text-danger">{error}</Text>`, sin ternario.
- **Medido.** `src/screens/login/index.test.tsx` → `Tests: 22 passed, 22 total`.
  No hay ninguna otra referencia a `login-error` en `src` que asevere su ausencia:
  el grep da las líneas 111, 128, 254 y 262, todas con error.
- **Candado mínimo.** Un `it` nuevo justo detrás del `it` E1 «con error», con
  la misma regex de seis ids:

  ```tsx
    it('#167 R6: sin error, el cuerpo no lleva el error', async () => {
      await renderLogin();
      const body = screen.getByTestId('login-body');
      expect(within(body).getAllByTestId(/^(login-email|login-password|login-error|login-submit|link-register|link-forgot)$/)
        .map((node) => node.props.testID)).toEqual([
        'login-email', 'login-password', 'login-submit', 'link-register', 'link-forgot',
      ]);
    });
  ```

  - Contra H1 da `1 failed, 23 passed, 24 total`, solo ese `it` y por
    aserción (`toEqual`). Se midió en una copia con X1 y X3 juntos.
  - **Rojo versionado.** La mutación del paso (1) suma un tercer cambio: el
    bloque, después de moverse detrás de `link-forgot`, pierde el ternario. Es la
    misma sustitución de H1.
  - Medido con X1 y X3: `3 failed, 21 passed, 24 total`. Fallan, por aserción y
    sin `Unable to find`:
    - `con error, el error va entre la contraseña y el envío`;
    - `el título de la cabecera conserva su clase`;
    - `sin error, el cuerpo no lleva el error`.
  - Con X1 solo: `3 failed, 20 passed, 23 total`. Esta cifra está derivada,
    porque X3 pasa bajo esa mutación.
- **Arrastre si se acepta X1 solo.**
  - Login: verde 23, `it` estáticos 20, y la fila R6 de traceability pasa de
    `(9)` a `(12)`.
  - BASE `439 = 433 + 6` y ALL `2847`.
  - La frase de requirements §Enmienda E1 sobre los rojos y la tabla de B1 se
    amplían con la fila «sin error».

**X2. Observación. R10.1, `reset-error` «cuando lo hay».**

- **Mutación (H1b).** `reset-error` se pinta siempre, sin ternario.
- **Medido.** `src/screens/reset-password/index.test.tsx` → `Tests: 30 passed, 30 total`.
- **Candado mínimo.**
  `it('#167 R10: sin error, el cuerpo no lleva el error')`, con
  `expect(within(screen.getByTestId('reset-body')).queryByTestId('reset-error')).toBeNull()`
  tras `renderRoute('reset-token-167')`. Contra H1b: `1 failed, 31 passed, 32 total`
  (copia con X2 y X5), aserción `toBeNull`.
- **Por qué no bloquea.**
  - R10.1 dice dónde va `reset-error` («va en un `HomeEntrance` `reset-body`»),
    no un orden. El `it` de la ronda 1 lo cubre cuando existe.
  - El ternario es de la base y #167 solo lo reindenta.
  - Recomendado por simetría con X1: cuesta un `it`. Si se pliega en el paso (5),
    el rojo pasa a `2 failed, 29 passed, 31 total` (derivado).
  - En la ronda 2 no rechazaré por su ausencia.

**X3. Observación. R6.1, la cabecera antes del cuerpo.**

- **Mutación (H2).** Los bloques `login-header` y `login-body` intercambian su
  sitio dentro del scroll.
- **Medido.** `Tests: 22 passed, 22 total`.
- **Candado mínimo.**

  ```tsx
    it('#167 R6: la cabecera va antes que el cuerpo en el scroll', async () => {
      await renderLogin();
      const header = screen.getByTestId('login-header');
      expect(header.parent?.parent).toHaveProperty('props.testID', 'login-form');
      expect(header.parent?.children).toEqual([header, screen.getByTestId('login-body')]);
    });
  ```

  Contra H2: `1 failed, 23 passed, 24 total`, aserción `toEqual`.
- **Por qué no bloquea.** R6.1 no dice «en orden». Es el mismo criterio que O4.
  E1 deja la pantalla idéntica a `108bd291`, que ya tiene ese orden.

**X4. Observación. R7.1, «sustituir el título suelto del scroll».**

- **Mutación (H3).** El bloque `register-header` pasa detrás de `register-submit`,
  como último hijo del scroll.
- **Medido.** `Tests: 23 passed, 23 total`. El `it` E1 «cuelgan del scroll» solo
  mira padres, no posiciones.
- **Candado mínimo.** Una línea al final de ese `it`:
  `expect(content?.children[0]).toBe(screen.getByTestId('register-header'));`.
  Contra H3: `1 failed, 22 passed, 23 total`, aserción `toBe`.
  - Bajo la mutación (3) el `it` ya cae antes, en la línea del envío. Por eso su
    prueba de rojo sería una sonda S6 (H3) con esa cifra, no un cambio en la
    tabla del paso (3).
- **Por qué no bloquea.** «Sustituir» implica el sitio, pero la cláusula no dice
  «en orden» ni «primer hijo».

**X5. Observación. R10.1, la cabecera antes del cuerpo en la rama de formulario.**

- **Mutación (H2b).** El segundo `reset-header` pasa detrás del `</HomeEntrance>`
  de `reset-body`.
- **Medido.** `Tests: 30 passed, 30 total`.
- **Candado mínimo.** Es el de X3 con `reset-header` y `reset-body`. Contra
  H2b: `1 failed, 31 passed, 32 total`.
  - **Ojo:** en esta rama el scroll es `reset-password-form`.
    `screen-reset-password` es ahí el `KeyboardAvoidingView`. Un primer intento
    con `screen-reset-password` falló en verde, `Received value: "reset-password-form"`.
- **Por qué no bloquea.** Es el mismo caso que X3 y O4.

**X6. Observación. Cláusulas de disposición del fuente, sin candado.**

| Cláusula | Mutación | Medido |
|---|---|---|
| R2.1 «un comentario `// #167 R2` encima de cada uno» | H8: se borra el primero de los cuatro | `src/theme/__tests__/motion.test.ts` → `16 passed, 16 total` |
| R5.1 «justo después de `login.forgotPassword`» | H7: la línea `en` de `login.pingoGreeting` pasa delante de `login.signIn` | `src/providers/__tests__/language-provider.test.tsx` → `26 passed, 26 total`. Las listas de claves se comparan ordenadas |
| R5.2 «justo antes de `## 3. La infraestructura`» | H9: §2.24 pasa al final de `specs/mobile-ui-language/design.md` | mismo fichero → `26 passed, 26 total` |
| R6.4 fila de `ui-copy-table.ts` «justo después de la fila de `login.forgotPassword`» | sin sonda: es un fichero de test, no producción | — |

- **Estado verificado a mano.** Las cuatro cláusulas se cumplen en `108bd291` /
  `a27664f8`:
  - `motion.ts` tiene cuatro `// #167 R2`;
  - en `catalog.ts`, la clave está en las líneas 9-10 (`en`) y 401-402 (`es`);
  - §2.24 está justo antes de `## 3.`, con la cabecera de §2.23;
  - la fila de `ui-copy-table.ts` está en las líneas 15-16, en el árbol y en
    `108bd291`.
- **No pido candado.** Sería un candado de texto del fuente sin valor de
  comportamiento.
- **Ronda 2.** E1 no toca esos ficheros. En la ronda 2 lo compruebo con
  `git diff --quiet 108bd291 HEAD -- mobile-pet-tracker/src/theme/motion.ts mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts specs/mobile-ui-language/design.md`.

**X7. Observación: corregir antes del handoff. Anclas que no se pueden grepear tal cual.**

En tasks.md §Enmienda E1 hay tres anclas que, copiadas literalmente, dan
`grep -cF` = **0**, porque en el fuente `<Button` / `<Image` y `testID=` van en
líneas distintas:

| Ancla en tasks.md | Dónde aparece | Ancla que sí da cuenta |
|---|---|---|
| `<Button testID="login-submit"` | paso (1) | `testID="login-submit"` → 1 |
| `<Button testID="register-submit" …>` | paso (3) | `testID="register-submit"` → 1 |
| `<Image testID="reset-pingo" …/>` | S5 | `testID="reset-pingo"` → 2 (la primera es la rama de éxito) |

Hay además dos anclas que se repiten en el fichero:

- **El `Text` de S5.** `{t('resetPassword.resetPassword')}` sale 3 veces en
  reset: sin token, éxito y formulario. La línea `text-center text-2xl font-black text-foreground`
  también sale 3 veces.
  - «En la rama de éxito (la primera cabecera)» lo desambigua, porque el `Text`
    sin token no está dentro de ninguna cabecera.
  - Aun así, en el handoff conviene decir «el `Text` hijo de la primera
    `reset-header`».
- **El `</LinkButton>` del paso (1).** Sale 2 veces. «El de `link-forgot`» es
  el segundo.

Es la lección de #117/#118: anclas transcritas que paran a Codex. Si se reescriben
como `grep -cF` con su salida esperada, se cierra.

### Para firmar

- X1 debe entrar en la enmienda antes de la firma: el `it`, la mutación del paso (1)
  con su tercer cambio, el rojo `3 failed, 20 passed, 23 total`, y las cuentas
  arrastradas que da X1.
- X2-X5 son opcionales. Cada candado está medido arriba. Si entran, cada `it`
  suma +1 a su fichero, a BASE y a ALL. X4 no suma `it`.
- X6 no pide cambios.
- X7 es una corrección de redacción para el handoff.
