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
