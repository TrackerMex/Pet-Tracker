# review: mobile-account-screens-polish (#172)
Fecha: 2026-10-14
Ronda: 1
HEAD revisado: `d795ee66` (branch `feature/172-mobile-account-screens-polish`, worktree `Pet-Tracker-wt-172`)
H0 del handoff: `e0178ab5`
Veredicto: RECHAZADO

El código de producción está bien y cumple la spec. El rechazo es por cuatro
mutaciones propias que dejan en verde todas las suites que vigilan la feature.
Los huecos están en los candados que prescribe la spec, igual que en #113
ronda 1, así que el arreglo pasa por una enmienda del leader y una ronda más de
Codex, sin tocar producción. Detalle en Observaciones §1.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #172).
- [x] progress/current.md actualizado, con la sección #172.

## Checklist C3 — Arquitectura
- [x] N/A en sentido estricto: es una feature móvil, sin capas domain/infrastructure.
  En su lugar se comprueban las convenciones móviles: route delgado +
  `src/screens/`, componentes compartidos en `src/components/`, constantes de
  movimiento en `src/theme/motion.ts` y copy en el catálogo i18n.
- [x] Sin lógica de negocio nueva fuera de pantalla. La validación de correo de
  R12 vive en `src/screens/register/index.tsx`, como prescribe la spec.

## Checklist C4 — TDD
- [x] Cada R1–R20 tiene al menos un test que nombra `#172 R<n>`, comprobado con
  grep sobre los tests. R19 aparece en 8 ficheros. R21 es la prueba de humo
  humana y no tiene test, como corresponde.
- [x] El historial va test-primero: cada `feat(mobile)` llega después de su
  `test(mobile)`, y los commits de test solo tocan tests o datos de test.
- [x] Los commits que nacen verdes (c31/c32/c33) están probados por sonda, con
  recuentos que cuadran con la spec. S14 da 6 fallos, igual que E4: #98 R10,
  #64 R9, #117 R5, #167 R9 ×2 y #172 R14. S15 da 3, igual que E5. S17b da 2,
  igual que E5. Las demás sondas (S16a–S20d) cuadran con su tabla y todas las
  restauraciones salieron exit=0.
- [x] c7c `edf99020` está justificado y no afloja el candado. Solo añade el
  helper `floatTranslateY()` con un cast de tipo para que `tsc` deje de dar
  TS2532/TS2339 (líneas 24–47 de `pingo-float.test.tsx`, motivo registrado en
  el impl, «c8r1 — typecheck»). Literales, clave leída (`transform[0].translateY`),
  tiempos y `toBeCloseTo(…, 0)` siguen idénticos a lo que prescribe R4.
- [ ] **Candados con zona ciega**: cuatro mutaciones de producción salen verdes.
  Ver Observaciones §1.

## Checklist C5 — Trazabilidad
- [x] traceability.md no tiene filas "pendiente" salvo R21, que es humana y
  está exceptuada por la propia spec. Las líneas 53/66/84/105 que contienen
  «pendiente» son notas de reanudación, no filas de la tabla.
- [x] Los 52 commits de Codex en `e0178ab5..HEAD`, sin contar los 9 del leader
  excluidos, siguen el formato `<tipo>(<scope>): <desc> (R-ids)`.
- Nota: el frontmatter de traceability.md sigue en `status: spec_ready`. Es un
  campo del leader y no cuenta para este veredicto.

## Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved` y la casilla humana marcada
  (2026-10-13). Las enmiendas E1–E5 también están firmadas.

## Checklist C7 — Sin código huérfano
- [x] `LOCK_TILE_CLASS` eliminado (0 apariciones). Los imports de
  `AlertCircle`/`useThemeColors` que sobraban en register también se quitaron.
- [x] Los `it` de #167 sustituidos por R9/R14 se reescribieron en su sitio, sin
  duplicados.

## Checklist C8 — Carta de UI
- [x] Ninguno de los 8 ficheros de producción tocados tiene hex,
  clases arbitrarias, `StyleSheet`, shadow/elevation ni `Spinner`.
- [x] Las zonas táctiles miden 44 o más (`size-11` en BackButton y en el toggle
  de contraseña).
- [x] Las animaciones corren en el hilo de UI con Reanimated y respetan reduce
  motion (`useReducedMotion` + `ReduceMotion.System`).
- [x] El texto de la enmienda de `docs/ui-guidelines.md` es literal al bloque de
  la spec (diff exit 0).
- [x] El asset de Pingo cuadra: sha256 `e6756ad5…0a22`, 421796 bytes.
- [x] El desvío de alcance es nulo. `specs/mobile-ui-language/design.md` §2.27
  lo prescriben T2 y B16, así que no cuenta como drift.
- [ ] La respuesta al pulsar de `BackButton` no tiene candado (Observaciones §1, G4).

## Observaciones

### 1. Mutaciones propias en verde (bloqueantes)

Cada mutación se plantó sola en producción y se revirtió con
`git checkout HEAD -- <ruta>`. Al terminar, `git status --short` sale vacío y
`git diff --cached --quiet` da 0. Se corrió jest con `--testTimeout=30000
--runTestsByPath` sobre todas las suites que vigilan el fichero mutado.

**G1 — `PingoFloat` puede quedar invisible con la suite en verde** (mismo
patrón que rechazó #113 ronda 1).
- Mutación en `src/components/pingo-float.tsx`: se añade `opacity: 0` al objeto
  de `useAnimatedStyle`, junto a `transform`.
- Resultado:
  - `pingo-float.test.tsx` + las pantallas login/register/forgot/reset: 5/5
    suites, 147/147 tests en verde.
  - `design-drift.test.ts` + `account-screens-polish.test.ts` + `motion.test.ts`:
    3/3 suites, 100/100 tests en verde.
- Causa: R4 prescribe leer solo `transform[0].translateY` del estilo animado, y
  ninguna pantalla asevera la visibilidad ni el estilo completo de su
  `*-pingo-float`. Pingo puede desaparecer en Crear cuenta, Recuperar y Nueva
  contraseña sin que nada se ponga rojo.

**G3 — En Crear cuenta, el botón se queda deshabilitado tras un correo inválido.**
- Mutación en `src/screens/register/index.tsx`: `setSubmitting(true)` se mueve
  delante de la comprobación de `EMAIL_PATTERN`, justo después de
  `setGeneralError(null)`.
- Resultado: `register/index.test.tsx` y el resto del lote (6/6 suites,
  124/124 tests) en verde.
- Efecto real: el `return` temprano deja `submitting` en `true`, y
  `register-submit` tiene `isDisabled={!terms || submitting}`. Tras un correo
  mal escrito, el usuario no puede corregirlo y volver a enviar sin salir de la
  pantalla.
- Causa: R12 dice en prosa que la comprobación va «antes de marcar el envío en
  vuelo», pero los dos `it` de R12 solo miran el mensaje y que `mockRegister`
  tenga 0 llamadas. Nada asevera que el botón siga habilitado ni que un segundo
  envío con el correo corregido llame a la API.

**G2 — La curva ease-in-out del canvas no está candada en el componente.**
- Mutación en `src/components/pingo-float.tsx`:
  `withTiming(-MOTION_PINGO_FLOAT_OFFSET_Y, { ...MOTION_PINGO_FLOAT_TIMING, easing: Easing.linear })`.
- Resultado: `pingo-float.test.tsx` + `motion.test.ts` +
  `account-screens-polish.test.ts` (3/3 suites, 33/33 tests) en verde.
- Causa: `motion.test.ts` canda la constante con el bezier exacto, pero el test
  del componente muestrea a 0/750/1500/3000/4500 ms. Esos son puntos simétricos
  de una curva simétrica: a mitad de tramo, la lineal y la ease-in-out dan las
  dos `-5`. Es el caso 2 de «candados tautológicos» (#106): un continuo
  muestreado donde las impostoras coinciden. Ningún candado obliga a que el
  componente use la constante sin pisarla.

**G4 — La respuesta al pulsar de `BackButton` no tiene candado.**
- Mutación en `src/components/back-button.tsx`: se borra
  `style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}`.
- Resultado: `back-button.test.tsx` y las tres pantallas que lo montan en verde
  (dentro del lote de 6/6 suites, 124/124 tests).
- Causa: R2 prescribe ese `style` como viñeta del SHALL, pero ningún `it` de R2
  lo asevera. Iniciar sesión, Crear cuenta y Recuperar pierden la respuesta al pulsar (C8)
  sin que nada se ponga rojo.

### 2. Huecos menores (no bloqueantes; conviene incluirlos en la misma enmienda)

- **G5 — limpieza de la animación.** Quitar `return () => cancelAnimation(translateY)`
  deja `pingo-float.test.tsx` en verde (en el mismo lote de G3/G4). R4 lo pide
  con un SHALL y no hay `it` de desmontaje. El riesgo es bajo, porque
  `useSharedValue` cancela al desmontar y eslint marcaría el import sin uso de
  esta mutación concreta.
- **G6 — patrón de correo.** Cambiar `EMAIL_PATTERN` por `/@/` deja
  `register/index.test.tsx` + `account-screens-polish.test.ts` en verde (2/2
  suites, 46/46 tests). R12 fija el regex exacto en la cláusula EARS, pero solo
  lo canda con un caso sin arroba. Ningún caso cubre la falta de punto, un
  espacio o el `trim()`. El impacto es bajo, porque el servidor valida el correo
  (`Invalid email address`).

### 3. Rojo de la primera corrida de init.sh: no es atribuible a #172

- La primera corrida (`init-172-d795ee66.log`) falla en
  `src/app/__tests__/detail-stack.guard.test.tsx` (125,69 s). El primero es
  `#149 R3: cierra sesión en /alerts…` con `Exceeded timeout of 5000 ms`. Los
  otros cuatro caen en el `waitFor` del pathname `/home`, que recibe `"/"`.
- `routes()` (líneas 56–80 de ese test) sustituye cada ruta que no es layout por
  un stub `<Text>{key}</Text>` y dobla `useFonts`. Ninguna pantalla de #172 se
  monta ahí. Lo único de #172 en esa ruta es la entrada `'Inter-ExtraBold'` de
  `_layout.tsx`, que el doble de `expo-font` neutraliza.
- La segunda corrida, sobre el mismo HEAD, sale verde entera (108/108 suites
  móviles), con load de 15,18 a 1 min al arrancar. Según el leader, la suite
  también pasa aislada en wt-172 y en main `fd055ffd`. Es el flake conocido de
  `renderRouter` bajo carga, no una regresión.

### 4. Recuentos

- `it` de las 17 suites del lote: H0 289, HEAD 341, delta +52. Cuadra fichero
  a fichero con la tabla del handoff:
  - pantallas: login 21→26, register 21→30, forgot 28→34, reset 27→34;
  - suites globales: global-css 30→31, language-provider 19→20, motion 16→17,
    font-registration 3→4;
  - suites nuevas: back-button 5, pingo-float 3, form-error 3,
    password-input 4, account-screens-polish 6;
  - sin cambios: ui-language 28, design-drift 51, consistency 33, legibility 12.
- El T22-base del impl da 17 suites y 470 tests en verde, y READERS da 4 suites
  y 192 tests.

### 5. Requisito humano abierto

- R21 (prueba de humo en dev build de Android) sigue pendiente del humano. No
  bloquea esta revisión ni la firma el reviewer.

### 6. Nota de proceso

- La primera tanda de G1 (5 suites, 147 tests) arrancó con un jest de
  `Pet-Tracker-wt-171` en marcha, porque el `pgrep` se imprimió pero no hizo de
  barrera. La carga solo produce rojos falsos (timeouts), nunca verdes falsos,
  así que el verde vale como evidencia. Todas las tandas posteriores esperaron
  a que `pgrep` saliera vacío.

## Output de ./init.sh

No lo corrió el reviewer, por instrucción del leader. Se usan sus dos logs del
mismo HEAD.

```
== init-172-d795ee66.log
HEAD=d795ee66d50356d52d721af55dc87545617281ad start=2026-10-14T18:48:24+00:00
Test Suites: 187 passed, 187 total          (backend unit)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
FAIL src/app/__tests__/detail-stack.guard.test.tsx (125.69 s)
Test Suites: 1 failed, 107 passed, 108 total   (mobile)
Tests:       5 failed, 3157 passed, 3162 total
exit=1 end=2026-10-14T18:53:36+00:00

== init-172-d795ee66-r2.log
HEAD=d795ee66d50356d52d721af55dc87545617281ad start=2026-10-14T18:56:32+00:00 load=3.89 15.18 9.02
Test Suites: 187 passed, 187 total          (backend unit)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 108 passed, 108 total          (mobile)
Tests:       3162 passed, 3162 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total   (e2e)
Tests:       8 skipped, 468 passed, 476 total
exit=0 end=2026-10-14T19:05:28+00:00 load=2.87 9.22 9.10
```

## Ronda 2 (2026-10-14)
Fecha: 2026-10-14T20:30Z
HEAD revisado: `f17eec10` (branch `feature/172-mobile-account-screens-polish`, worktree `Pet-Tracker-wt-172`)
Base de la ronda: `b6c09d5e` (veredicto de la ronda 1). H0 del handoff: `e0178ab5`.
Commits de Codex evaluados: `62b62e4b` (c40), `0b706e05` (c41), `71e7f0c6` (c42), `b44f7034` (trazabilidad) y `f17eec10` (informe).
Veredicto: APROBADO

Las siete sondas de E6, replantadas por el reviewer, dan exactamente el rojo y
el tipo de su tabla. G1, G2, G3, G4 y G6 de la ronda 1 ya se ponen rojos.
Además se plantaron 11 variantes en zona ciega: 7 caen y 4 sobreviven. Ninguna
de las 4 bloquea: dos son mutantes de orden superior (añaden estructura que el
código no tiene), una está en código previo a #172 y fuera de R12, y otra es de
la categoría menor de G6. Detalle en §R2-2.

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #172).
- [x] progress/current.md con la sección #172 (último toque del leader en `0740dc01`).

### Checklist C3 — Arquitectura
- [x] Producción sin cambios desde la ronda 1. `git diff --name-only d795ee66..HEAD`,
  sin contar `progress/` ni `specs/`, solo da los 3 ficheros de test de E6.
  En `b6c09d5e..HEAD`, los commits de Codex tocan esos 3 tests, traceability.md
  e impl. Los del leader (`da45bc50`, `866d685c`, `0740dc01`) solo tocan
  `progress/` y `specs/`. Lo aprobado en C3, C7 y C8 de la ronda 1 sigue en pie.

### Checklist C4 — TDD
- [x] c40, c41 y c42 tocan cada uno solo su fichero de test. Nacen verdes por
  diseño, porque E6 no lleva commit `feat`, y cada uno queda probado por sonda
  (§R2-1).
- [x] El código coincide con el literal de tasks.md T24. Se compararon las
  líneas añadidas de cada commit con los bloques `tsx` de T24, sin contar las
  líneas en blanco: son idénticas en los tres. Cada `it` está donde lo pide T24:
  tras `pasa testID y children`, tras `sin historial reemplaza por el fallback`
  y antes de `#172 R11: cabecera, rejilla…`, dentro de
  `#167 R7: Pingo en la cabecera del registro`. Se conservan los dos espacios a
  cada lado de `'  alex@example.com  '`.
- [x] Los 5 `it` nuevos nombran `#172 R4`, `#172 R2` o `#172 R12`.

### Checklist C5 — Trazabilidad
- [x] La única fila «pendiente» es R21, que es humana: `pendiente (humano)`.
- [x] Las filas R2, R4 y R12 incluyen los `it` nuevos, sus sondas (S2c,
  S4f–S4h, S12b–S12d) y los hashes `0b706e05`, `62b62e4b` y `71e7f0c6`. Los
  cinco commits de Codex son ancestros de HEAD (`merge-base --is-ancestor`).
- [x] Los commits siguen el formato `test(mobile): <desc> (Rn)` y
  `docs(mobile-account-screens-polish): …`.
- Nota, no bloquea: el frontmatter de traceability.md sigue en
  `status: spec_ready`. Lo cierra el leader.
- Nota cosmética, no bloquea: en R4 y R12 aparece «verificadas.;». La nota de
  Reanudación 5 llama «review ronda 1 del leader» a `b6c09d5e`, pero esa review
  es del reviewer.

### Checklist C6 — Spec aprobada
- [x] requirements.md tiene `status: approved`. La casilla
  `- [x] Enmienda E6 aprobada por humano (fecha: 2026-10-14)` está marcada
  (`866d685c`).

### Checklist C7 — Sin código huérfano
- [x] N/A en esta ronda: E6 no reemplaza nada. La ronda 1 sigue vigente.

### Checklist C8 — Carta de UI
- [x] Producción está intacta. Las cuatro guardas (`ui-language`,
  `design-drift`, `consistency-classnames` y `legibility-classnames`) pasan en
  verde en HEAD, dentro de las 17 suites.

### Cifras medidas por el reviewer
- Corrí las 17 suites de T22 en HEAD con
  `bunx jest --testTimeout=30000 --runTestsByPath $BASE <5 suites nuevas>`.
  Resultado: `Test Suites: 17 passed, 17 total`, `Tests: 476 passed, 476 total`,
  exit=0. La ronda 1 midió 470, y E6 suma 6 casos de Jest (2 + 1 + 3), así que
  476 = 409 en H0 + 67. Cuadra con el informe.
- Bloques `it`, contados con la regex de §Cuentas: HEAD 346, H0 289, delta
  +57. Por fichero, pingo-float pasa de 3 a 5, back-button de 5 a 6 y register
  de 30 a 32. En Jest son 5, 6 y 36 casos.
- init.sh del leader: la parte móvil da 108/108 suites y 3168 tests, que son
  los 3162 de la ronda 1 + 6.

### §R2-1 — Mutaciones

Método:
- Comando: `bunx jest -i --testTimeout=30000 --runTestsByPath <rutas>`, desde
  `mobile-pet-tracker/`.
- Tras cada sonda: `git checkout HEAD -- <fichero>` y
  `git diff --quiet HEAD -- <fichero>`. Dio `restore-exit=0` las 21 veces.
- Al terminar: `git status --short` vacío, `git diff --quiet HEAD` → 0 y
  `git diff --cached --quiet` → 0.
- Ninguno de los 21 logs tiene `Exceeded timeout`.
- Durante algunas corridas había Jest de `wt-171` y `wt-173` en marcha. La
  carga solo produce rojos falsos, y todos los rojos fueron por aserción o por
  consulta, del tipo que dice la spec.

Rutas de cada lote:
- **PF**: `pingo-float.test.tsx`, `account-screens-polish.test.ts`,
  `design-drift.test.ts` y `motion.test.ts`. Las pantallas doblan `PingoFloat`,
  así que no lo ven.
- **PF+**: PF más las cuatro pantallas de cuenta.
- **REG**: `src/screens/register/index.test.tsx`.

| Hueco | Sonda | Mutación (fichero de producción) | Lote | Resultado | Rojo |
|---|---|---|---|---|---|
| G1 | S4f (= ronda 1) | `opacity: 0,` en el objeto de `useAnimatedStyle` (`pingo-float.tsx`) | PF+ (8 suites, 252 tests) | exit=1, 1 fallo | `#172 R4: el estilo animado solo lleva translateY`, aserción `toEqual` (`+ "opacity": 0`) |
| G1 | S4g | `style={[animatedStyle, { opacity: 0 }]}` | PF (4, 105) | exit=1, 1 fallo | el mismo `it`, `toEqual` en `pingo-float.test.tsx:74` |
| G1 | zona ciega | `transform: [{ translateY: … }, { scale: 0 }]`: otra entrada del array, donde el `it` de la tabla solo lee `[0]` | PF | exit=1, 1 fallo | el mismo `it`, `toEqual` |
| G1 | zona ciega | `...(reduceMotion ? {} : { opacity: 0 }),` en `useAnimatedStyle` | PF | **exit=0, 105/105** | **sobrevive** (§R2-2.1) |
| G2 | S4h (= ronda 1) | `{ ...MOTION_PINGO_FLOAT_TIMING, easing: Easing.linear }` | pingo-float, motion y account (3, 35) | exit=1, 1 fallo | `#172 R4: la subida y la bajada…`, `toBeCloseTo`: esperado -1.3, recibido -2.5 |
| G2 | zona ciega | `easing: Easing.inOut(Easing.cubic)` | igual | exit=1, 1 fallo | el mismo `it`, recibido -0.625 |
| G2 | zona ciega | bajada lineal: `withRepeat(withSequence(withTiming(-OFFSET, TIMING), withTiming(0, { ...TIMING, easing: Easing.linear })), -1, false)` | igual | **exit=0, 35/35** | **sobrevive** (§R2-2.2) |
| G3 | S12b (= ronda 1) | `setSubmitting(true);` justo debajo de `setGeneralError(null);` (`register/index.tsx`) | REG, account, design-drift y ui-language (4, 149) | exit=1, 1 fallo | `#172 R12: tras un correo inválido…`, `not.toBeDisabled()` en `index.test.tsx:470` |
| G3 | zona ciega | `setSubmitting(true);` dentro de la rama del correo inválido, antes del `return` | REG (36) | exit=1, 1 fallo | el mismo `it`, la misma aserción |
| G3 | zona ciega | se borra `setSubmitting(false);` del `finally` | REG | **exit=0, 36/36** | **sobrevive** (§R2-2.3) |
| G4 | S2c (= ronda 1) | se borra la línea `style={({ pressed }) => …}` (`back-button.tsx`) | back-button, login, register, forgot y design-drift (5, 182) | exit=1, 1 fallo | `#172 R2: suelto pinta opacidad 1 y pulsado 0,8`, `toEqual`: recibido `undefined` (línea 80) |
| G4 | zona ciega | invertida: `pressed ? 1 : 0.8` | back-button y login | exit=1, 1 fallo | el mismo `it`, línea 80 (0.8 en lugar de 1) |
| G4 | zona ciega | `pressed ? 0.5 : 1` | back-button | exit=1, 1 fallo | el mismo `it`, línea 82 (0.5 en lugar de 0.8) |
| G6 | S12c | `const EMAIL_PATTERN = /@/;` | REG y account (2, 49) | exit=1, 2 fallos | `«alex@example»` y `«alex @example.com»`, consulta `register-email-message` |
| G6 | S12d | `EMAIL_PATTERN.test(email)`, sin `.trim()` | REG | exit=1, 1 fallo | `tras un correo inválido…`, consulta `register-error` (línea 473) |
| G6 | zona ciega | sin punto: `/^[^\s@]+@[^\s@]+$/` | REG | exit=1, 1 fallo | `«alex@example»`, consulta |
| G6 | zona ciega | `email.trimStart()` | REG | exit=1, 1 fallo | `tras un correo inválido…`, consulta `register-error` |
| G6 | zona ciega | sin anclas: `/[^\s@]+@[^\s@]+\.[^\s@]+/` | REG | **exit=0, 36/36** | **sobrevive** (§R2-2.4) |
| G6 | zona ciega | `/^\S+@\S+\.\S+$/`, que admite varias `@` | REG | **exit=0, 36/36** | **sobrevive** (§R2-2.4) |
| G5 | límite declarado | se borra `return () => cancelAnimation(translateY);` | `bunx eslint --no-cache src/components/pingo-float.tsx` | exit=0 con `3:3 warning 'cancelAnimation' is defined but never used @typescript-eslint/no-unused-vars` | Lo caza el gate «log vacío» del handoff. init.sh no lo caza, porque solo mira el exit code (`init.sh` ≈ l. 270–273) |

El rojo de `pressed ? 0.5 : 1` sale en la segunda aserción (línea 82). Eso
prueba que `responderGrant` sí cambia `pressed`, así que la aserción del estado
pulsado no es tautológica. El único sitio de producción con la respuesta al
pulsar es `back-button.tsx:16`. Las tres pantallas montan el `BackButton` real,
porque ninguna lo dobla.

### §R2-2 — Mutaciones que sobreviven (no bloquean)

1. **G1, rama con movimiento.**
   - El candado de E6 compara el estilo completo solo con `useReducedMotion` en
     `true`. Con movimiento, que es el caso por defecto, la única lectura sigue
     siendo `transform[0].translateY`.
   - El mutante `...(reduceMotion ? {} : { opacity: 0 })` oculta a Pingo en
     Crear cuenta, Recuperar y Nueva contraseña para todos los que no tienen
     reduce motion, y la suite sigue en verde.
   - La frase de E6 en R4 («Así cae cualquier clave colada en el estilo animado
     o en un estilo estático a su lado») solo es cierta en la rama reducida.
   - Por qué no bloquea:
     - Es un mutante de orden superior: crea un condicional de `reduceMotion`
       en el worklet que el código no tiene.
     - Todos los mutantes de primer orden del código actual caen: clave
       incondicional, estilo estático, entrada extra en `transform` y magnitud
       de `translateY`.
     - La prueba de humo R21 en el dispositivo mostraría a un Pingo invisible.
   - El hueco, descrito tal cual: ningún `it` compara el estilo animado
     completo en la rama con movimiento.
2. **G2, la bajada.**
   - El título dice «la subida y la bajada», pero las dos muestras (375 y
     1125 ms) caen en la subida: de 0 a -10, entre 0 y 1500 ms.
   - La bajada (1500–3000 ms) solo se muestrea a los 3000 ms, donde vale 0, y
     en puntos simétricos que no distinguen curvas.
   - Por qué no bloquea: en producción, la bajada es el reverso de
     `withRepeat(…, -1, true)` con la misma configuración. Para que difiera hay
     que reestructurar la animación (`withSequence`, `reverse` a `false` y un
     import nuevo). El título promete más de lo que comprueba.
3. **G3, el `finally`.**
   - El `finally { setSubmitting(false); }` de `handleSubmit` ya existía,
     idéntico, en H0. Viene de `e5ee5a5f`, el traslado de #167 R1.
   - Queda fuera de R12 y de E6, cuyo candado solo cubre el correo inválido en
     el cliente.
   - Si se pierde, tras cualquier respuesta de la API que no sea `ok`
     (`email-taken`, `validation`, `unreachable` o `error`), `register-submit`
     se queda deshabilitado. Ningún test del registro lo ve.
   - No es atribuible a #172. Si se registra como deuda, el límite es solo ese
     `finally` de `src/screens/register/index.tsx`.
4. **G6, el regex.**
   - Sobreviven quitar las anclas y cambiar `[^\s@]` por `\S`. Solo difieren en
     correos con texto delante o detrás, o con varias `@`.
   - Es la misma categoría menor que G6 en la ronda 1, y el servidor valida con
     `z.email()` (`backend-pet-tracker/src/modules/auth/application/dto/register-user.dto.ts:18`).
5. **No es un mutante: nota de producto, previa a #172 y que no bloquea.**
   - R12 valida `email.trim()`, pero `register(…)` envía `email` sin recortar
     (`src/screens/register/index.tsx`, el objeto que se pasa a `register`).
   - El backend valida `z.email().max(320)` sin `trim`. El `email.trim().toLowerCase()`
     de `user.entity.ts:58` llega después de la validación.
   - Por eso el caso de E6, `'  alex@example.com  '`, pasa en el cliente, pero
     el servidor real lo rechazaría. El test no lo ve porque dobla `register`.
   - Antes de #172 se enviaba lo mismo, así que no empeora nada, y R12 no pide
     enviar el correo recortado. Lo anoto por si el leader quiere registrarlo.

### §R2-3 — Proceso
- El informe de Reanudación 5 dice que la espera previa a T22 terminó en
  «fin-espera» con procesos de otras sesiones vivos. No cambia nada, porque mi
  medida de 476 coincide con la suya.
- R21, la prueba de humo humana en dev build de Android, sigue pendiente. Este
  veredicto no la cierra: la feature solo puede marcarse `done` cuando la firme
  el humano.

### Output de ./init.sh (ronda 2)

No lo corrió el reviewer, por instrucción del leader. Se usa el log del leader,
`init-172-r2-f17eec10.log`. El log no imprime HEAD, pero corresponde a
f17eec10 por tres motivos:
- se modificó a las 20:18Z, después del commit de f17eec10 (20:02Z), y no hay
  commits posteriores;
- sus rutas son de `Pet-Tracker-wt-172`;
- el móvil da 3168 tests, que son los 3162 de la ronda 1 más los 6 de E6.

```
Test Suites: 187 passed, 187 total          (backend unit)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total              (infra)
Tests:       14 passed, 14 total
Test Suites: 108 passed, 108 total          (mobile)
Tests:       3168 passed, 3168 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total   (e2e)
Tests:       8 skipped, 468 passed, 476 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
exit=0
```

## Ronda 3 — Merge con origin/main (2026-10-15)

Veredicto: APROBADO

Alcance acotado: solo el merge `4b355acb` de origin/main (#171) en la branch y
el informe `4f4dfd15`. Lo aprobado en ronda 2 (`e2745566`) y la prueba de humo
R21 (`631826d9`) no se revisan de nuevo.

### 1. Padres y ficheros resueltos a mano

- `git log -1 --format='%H %P' 4b355acb` → padres `ec508f88` (lado #172, M0,
  hijo de `631826d9`) y `a288c7dc` (origin/main con #171). Merge-base `788d1f89`.
- `git show --remerge-diff 4b355acb` lista exactamente 5 conflictos con
  resolución manual: `docs/ui-guidelines.md`, `specs/mobile-ui-language/design.md`,
  `mobile-pet-tracker/src/theme/global.css`, `mobile-pet-tracker/src/theme/motion.ts`,
  `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`. Los mismos 5
  de la Reanudación 6. Coincide con el paso 1 literal del informe de Codex.
- `comm` de `git diff --name-only a288c7dc 4b355acb` y `git diff --name-only ec508f88 4b355acb`
  da 12 ficheros, no 5. Los 7 de más son ficheros que tocaron las dos features
  y que git mezcló sin conflicto: `feature_list.json`, `design-drift.test.ts`,
  `ui-copy-table.ts`, `ui-language.test.ts`, `catalog.ts`,
  `language-provider.test.tsx`, `global-css.test.ts`, `motion.test.ts`. El
  remerge-diff no muestra cambios a mano en ninguno de ellos. `motion.ts` no
  sale en la intersección porque queda idéntico a main
  (`git diff a288c7dc 4b355acb -- motion.ts` vacío).

### 2. Ficheros mezclados sin conflicto: ningún candado perdido

Por fichero, comparé el multiconjunto de líneas `+/-` de `788d1f89..ec508f88`
con el de `a288c7dc..4b355acb` (¿sigue todo #172?) y el de `788d1f89..a288c7dc`
con el de `ec508f88..4b355acb` (¿sigue todo #171?):

- `feature_list.json`, `design-drift.test.ts`, `ui-copy-table.ts`,
  `ui-language.test.ts`, `catalog.ts`, `language-provider.test.tsx`,
  `global-css.test.ts`: los dos lados se conservan enteros.
- `motion.test.ts`: la única diferencia está en `'MOTION_PINGO_FLOAT_OFFSET_Y'` y
  `'MOTION_PINGO_FLOAT_TIMING'`, que las dos features añadieron igual al
  inventario `no exporta nada más`. Git las deja una sola vez y así tiene que
  ser, porque es un `toEqual` de `Object.keys(...).sort()`. Siguen el
  `describe('#172 R4: …')` (l. 111) y los `it` de #171 R6/R7/E4.
- Suma de longitud del catálogo (`language-provider.test.tsx` l. 55-69): lleva
  `+ 4 // #171 R12` y `+ 7 // #170 R1` / `+ 3, // #172 R16` como último sumando,
  como dice la spec en su §Choques de integración.
- `ui-language.test.ts`: R1_AUTH `29 + 7 + 1 + 4` y R11_RESET `15 + 1` (#172),
  y R9_ADD_PET `42 + 1 - 2 + 4` (#171). Las tres siguen.
- En los 5 ficheros resueltos, las únicas líneas de cada lado que faltan
  en el merge son las que la Reanudación 6 manda sustituir: los 4 contadores
  de cada lado, el bloque `// #172 R4` de `motion.ts` y el encabezado `§2.27 — … #172`.

### 3. Cada hunk resuelto coincide con la Reanudación 6

- `ui-guidelines.md`: `## Enmienda #171` en la l. 516 y `## Enmienda #172` en la l. 547,
  separadas por una línea en blanco. Respecto a cada padre, el merge no quita
  ninguna línea (`git diff -U0 ec508f88|a288c7dc 4b355acb` sin `-`), así que
  los dos bloques se conservan sin cambiar ni un carácter.
- `mobile-ui-language/design.md`: `### §2.27 — Añadidos por #171 — Celebraciones`
  en la l. 965 y `### §2.28 — Añadidos por #172 — Las pantallas de cuenta como el canvas`
  en la l. 974. Respecto a #172, solo se pierde el encabezado §2.27; las 4 filas
  siguen iguales. El candado de #172 R16 busca `§2\.\d+`, así que no depende
  de N (requirements.md, «Si otra feature ocupa §2.27 antes, N sube»). El de
  #171 E4.12 exige que §2.27 vaya detrás de §2.26, y se cumple.
- `global.css` `@theme`: `--text-13/15/17` seguidos de los 5 `--color-confetti-*`,
  en el orden prescrito, con `--text-15` una sola vez.
- `motion.ts`: idéntico a `a288c7dc`. Las constantes de main tienen los mismos
  valores que tenía #172 (`MOTION_PINGO_FLOAT_OFFSET_Y = 10`;
  `{ duration: 1500, easing: Easing.bezier(0.42, 0, 0.58, 1), reduceMotion: ReduceMotion.System }`).
  Los candados `#172 R4` de `motion.test.ts` y `pingo-float.test.tsx` usan esos nombres.
- `consistency-classnames.test.ts`: cada contador queda en base + Δ#172 + Δ#171:
  - `CONTINUOUS_CORNER`: base `31+1+4+1`, #172 0, #171 −1 → `31 + 1 + 4 + 1 - 1`.
  - `rounded-xl bg-accent`: base `13+1×6`, #172 0, #171 +1−1 → la línea de main.
  - `bg-accent-soft` y `accentSoftCount`: base `16+2+1-1`, #172 −1, #171 −1 → `16 + 2 + 1 - 1 - 1 - 1`, ×2.
  - `border-b-4` y `border-black/25`: base `19`, #172 +1, #171 +1−1 → `19 + 1 + 1 - 1`, ×2.

### 4. El código de #172 no cambió fuera de las resoluciones

- `git diff --stat e2745566 ec508f88`: solo `progress/current.md`,
  `progress/handoff_…md` y `traceability.md`. Este último cambia una línea: la
  casilla de humo R21 firmada (`[X] … 2026-10-14, OnePlus Nord 5`).
- `git diff --stat 4b355acb 4f4dfd15`: solo `progress/impl_mobile-account-screens-polish.md`.
- Ficheros que cambian en `e2745566..4f4dfd15` y que main no tocó: solo los 4
  de `progress/`/`specs/` anteriores. Ningún fichero de código exclusivo de #172
  cambió. Todo fichero que tocó main es igual a `a288c7dc`, salvo los 13 que
  tocaron las dos features (vistos en los puntos 2 y 3).
- `feature_list.json` tal como lo mezcló git: una sola feature `in_progress`
  (#172) y #171 `done`. Coherente con C2.

### 5. Gate (init.sh corrido por el leader; log leído, no reejecutado)

Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/5bf0fe41-c38a-4318-8d51-90f545e0be95/scratchpad/init-172-merge.log` (50060 líneas).
Las rutas de lint muestran que se corrió en `Pet-Tracker-wt-172`.

```
Test Suites: 187 passed, 187 total          (backend unit)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total              (infra)
Tests:       14 passed, 14 total
Test Suites: 109 passed, 109 total          (mobile)
Tests:       3277 passed, 3277 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total   (e2e)
Tests:       8 skipped, 468 passed, 476 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
exit=0
4f4dfd15380ff3ef7b7409c2e78cd39b9a7e492a
```

- 0 líneas `FAIL` y 0 títulos `●` fuera de `● Console`. La última línea es el
  HEAD actual (`git rev-parse HEAD` = `4f4dfd15…`, árbol limpio).
- Contraste con Codex (informe, paso 5): la suite móvil completa da
  `109 passed / 3277 passed` y `exit=0`, la misma cifra que init.sh. Jest
  dirigido (paso 4): 22 suites / 981 tests, typecheck `exit=0` y lint
  `--no-cache` con log vacío. Las anclas del paso 3 dan las cifras prescritas.
  Codex no corre backend ni e2e. Esas cifras (187/1474 y 30 de 33 con 468 + 8
  skipped) solo las da init.sh y coinciden con las de la ronda 2.
- Cuadre móvil: hay 102 ficheros `*.test.*` en la base, #172 añade 5 y #171
  añade 1, y en el merge hay 108. Las suites son siempre ficheros + 1 (108 en
  ronda 2, 104 en #171), así que 109 cuadra. Lo mismo con los tests:
  3168 (ronda 2) + 3210 (#171; sin cambios móviles entre su última review y
  `a288c7dc`) − 3277 da una base de 3101. Esa base no la medí; queda como
  inferencia.

### Observaciones

- Ninguna bloqueante.
- Informativa: según su informe, `git diff --cached --check` dio exit 2 por
  espacios finales en `progress/impl_mobile-celebrations-and-living-empty.md` y
  `progress/ronda4_…`. Esos ficheros vienen de main y son idénticos a
  `origin/main`, así que no es deuda de #172.
- No se ejecutó jest dirigido: el log de init.sh ya cubre las 109 suites en el
  HEAD exacto.
