# review: mobile-detail-screens-state-reset (#63)

Fecha: 2026-09-14
Branch: `feature/63-mobile-detail-screens-state-reset`
Commit revisado: `36b7e67f`
Commit base del baseline: `f50b4203`
**Veredicto: APROBADO**

Ningún hallazgo bloqueante. Dos observaciones no bloqueantes (§Hallazgos 2 y 3),
una de las cuales es **deuda de spec, no de implementación**, y que recomiendo
registrar antes de cerrar la siguiente feature que toque `pairing/index.test.tsx`.

---

## Output de `./init.sh`

Ejecutado por el reviewer, **en primer plano y sin pipe**, con el Postgres
libre (comprobado con `pgrep -af 'init\.sh|test:e2e|jest-e2e'` antes de lanzar:
sin procesos). Duración 19:09:13 → 19:13:14 (4 m 01 s).

```
EXIT_CODE_INIT_SH=0
```

```
→ Verificando entorno...        ✅ node / pnpm / bun disponibles
→ Verificando variables...      ✅ .env encontrado, DATABASE_URL definida
→ Instalando dependencias...    ✅ Dependencias instaladas
→ Verificando coherencia...     ✅ Archivos del harness presentes
→ Build...                      ✅ Build exitoso
→ Ejecutando tests...
Test Suites: 166 passed, 166 total     (backend)
Tests:       1277 passed, 1277 total
Test Suites: 2 passed, 2 total         (infra)
Tests:       14 passed, 14 total
Test Suites: 73 passed, 73 total       (móvil)
Tests:       1275 passed, 1275 total
                                ✅ Tests pasados
→ Tests e2e...
Test Suites: 3 skipped, 26 passed, 26 of 29 total
Tests:       8 skipped, 365 passed, 373 total
                                ✅ Tests e2e pasados
→ Lint...                       ✅ Lint sin errores
→ Typecheck...                  ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

> Las líneas `ERROR [PollerService]` / `[AlertsEngineConsumerService]` del log son
> la ruta de fallo deliberada de tests que **pasan**; no son regresión.

### Delta contra el baseline de `f50b4203`

| Bloque | Baseline `f50b4203` | Medido en `36b7e67f` | Delta |
|---|---|---|---|
| backend | 166 suites / 1277 tests | 166 / 1277 | **0 / 0** |
| infra | 2 / 14 | 2 / 14 | **0 / 0** |
| móvil | 73 / 1265 | 73 / **1275** | **0 suites / +10 tests** |
| e2e | 26 de 29 suites, 365 de 373 tests | 26 de 29, 365 de 373 | **0 / 0** |
| exit code | 0 | **0** | — |

Los **+10 tests** móviles cuadran exactamente con lo que la spec pide y ni uno
más: add-reminder R1 (1) + R7 (1), add-pet R2 (1), weight-log R3 (1),
meal-schedule R4 (1), pairing R5 (2) + R6 (2) + R7 (1) = **10**.

**Ningún `it(` existente desapareció ni cambió de nombre.** Comprobado extrayendo
y comparando los títulos de `it(`/`test(` de los cinco ficheros entre `f50b4203`
y `HEAD`: 0 perdidos, 0 renombrados, 10 nuevos.

| Fichero | `it(` base → head | Perdidos/renombrados |
|---|---|---|
| `add-reminder/index.test.tsx` | 13 → 15 | 0 |
| `add-pet/index.test.tsx` | 9 → 10 | 0 |
| `pairing/index.test.tsx` | 28 → 33 | 0 |
| `(tabs)/__tests__/weight-log.test.tsx` | 16 → 17 | 0 |
| `(tabs)/__tests__/meal-schedule.test.tsx` | 10 → 11 | 0 |

---

## Verificación dirigida — el comando corregido corre 7 suites, no 5

Confirmo la errata del leader (`36b7e67f`) **empíricamente**, y es exactamente
como la describe.

Con los paréntesis **escapados** (el comando corregido):

```
Test Suites: 7 passed, 7 total
Tests:       161 passed, 161 total
EXIT=0
```

Con los paréntesis **sin escapar** (la redacción original de la spec):

```
Test Suites: 5 passed, 5 total
Tests:       114 passed, 114 total
Ran all test suites matching /…|src\/app\/(tabs)\/__tests__\/weight-log|…/i.
```

exit **0** igualmente. Es decir: la redacción original daba verde habiéndose
saltado `weight-log` y `meal-schedule` **en silencio** — R3 y R4 sin ejecutar.
La corrección es necesaria y correcta.

**Codex no se comió R3 ni R4.** Su reporte declara 5 suites/114 tests y, por
separado, 2 suites/47 tests con `--runTestsByPath` para los dos ficheros
`(tabs)`. 114 + 47 = **161**, exactamente el total del comando corregido. Detectó
el problema del regex por su cuenta y lo compensó; lo dejó escrito en el impl
report. Es honesto y está completo.

---

## Hallazgos

### 1. La supresión de lint de `79ed667a` es correcta — NO BLOQUEANTE

`mobile-pet-tracker/src/screens/pairing/index.tsx:124`:

```
// eslint-disable-next-line react-hooks/set-state-in-effect -- R6 resets form state when the selected pet changes.
```

**Es load-bearing, no cargo-cult.** Lo comprobé borrando la línea y corriendo
`npx expo lint` (eslint-config-expo `~57.0.1`, expo `~57.0.14`):

```
src/screens/pairing/index.tsx:124:5
> 124 |     resetPairingState();
      |     ^^^^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect
                                            react-hooks/set-state-in-effect
✖ 1 problem (1 error, 0 warnings)
error: "eslint" exited with code 1
```

Es **error**, no warning: sin la supresión el gate `npx expo lint` de `init.sh`
se pone rojo. Revertido; árbol limpio.

Juzgo que **no tapa un problema de diseño**, por cinco razones:

1. **Es mínima**: `-next-line`, no de bloque ni de fichero. Una sola línea, un
   solo emplazamiento.
2. **Es nominal**: nombra la regla concreta, no un `eslint-disable` a pelo.
3. **Lleva motivo escrito** y además el R-id, así que el siguiente que la lea
   sabe por qué está.
4. **Coincide con el estilo de la casa**: `src/providers/query-provider.tsx:43`
   ya usa el mismo patrón (`/* eslint-disable react-hooks/refs -- <motivo> */`).
   Es la tercera supresión del árbol móvil, y las tres son nominales y motivadas.
5. **Conserva la mecánica firmada.** D3 §Forma B prescribe literalmente
   `useEffect(() => { resetPairingState(); }, [resetPairingState, selectedPetId])`.
   Codex la mantuvo intacta y descartó explícitamente las alternativas malas
   (temporizadores, microtareas), que sí habrían sido un problema de diseño real.

**¿Hay forma de cumplir D3/R6 sin suprimir?** Sí, una: el patrón canónico de
React de *ajustar estado durante el render* con centinela del valor previo
(`const [prevPetId, setPrevPetId] = useState(selectedPetId); if (selectedPetId !== prevPetId) {…}`),
que es lint-limpio y ahorra un render. Pero **D3 punto 1 lo rechazó por escrito**
("No se añade un `useRef` centinela: sería complejidad para evitar un render que
no cambia nada"). Adoptarlo habría sido que Codex revocara una decisión firmada
por su cuenta; hacer lo que hizo —conservar lo firmado, supresión mínima, y
declarar la desviación en §Decisiones no cerradas literalmente por la spec— es
el comportamiento correcto del implementador.

*Para el leader*: si la deuda `mobile-detail-screens-to-stack` acaba tocando
`pairing`, ese es el momento de revisitar D3 punto 1 con la regla ya conocida.
Nota menor: D3 afirma "Deps `[]` es correcto y lint-limpio", y eso es **cierto**
para la Forma A (el `setState` vive en el *cleanup*, que la regla no mira); la
que tropieza es la Forma B, sobre la que D3 no hizo ninguna afirmación de lint.
La spec no se equivocó; simplemente no lo anticipó.

### 2. Colisión de R-ids dentro de los ficheros de test — NO BLOQUEANTE (deuda de spec)

Confirmada, y es más amplia de lo que parece. En `pairing/index.test.tsx` hay
ahora **duplicados textuales**:

| `describe` | Línea | Spec dueña |
|---|---|---|
| `R5: el estado local de pairing se limpia al perder el foco` | 139 | **#63** |
| `R6: el estado local de pairing se limpia al cambiar de mascota` | 189 | **#63** |
| `R7: el guarda de envío sobrevive al blur` | 241 | **#63** |
| `R5: sin collar muestra el formulario…` | 386 | #42 `mobile-device-pairing` |
| `R6: el claim mapea cada kind…` | 488 | #42 |
| `R7: tras el 201 muestra "El collar está listo"…` | 567 | #42 |

En `add-pet` (R2 nuevo junto a R6/R7 previos), `weight-log` (R3 junto a R7/R8/R9)
y `meal-schedule` (R4 junto a R7/R8) no hay duplicado textual, pero sí la misma
ambigüedad: un `R<n>` desnudo ya no identifica una spec.

**Por qué no bloquea:**

- **C5 se cumple literalmente.** Sus tres casillas son: `traceability.md` sin
  filas "pendiente", cada requisito con test y commit, y formato de commit. Las
  tres se cumplen. `traceability.md` desambigua **por título completo del
  `describe`**, no por el número suelto, y cada uno de esos títulos es único en
  su fichero: las siete filas resuelven sin ambigüedad. Lo verifiqué fichero a
  fichero.
- **C4 se cumple**: cada R1–R7 tiene al menos un test que lo nombra.
- **La convención de prefijo no está escrita en ninguna parte.** Ni
  `docs/conventions.md:150-154` (que solo pide `describe('R1: <resumen>')`), ni
  `docs/verification.md`, ni `CHECKPOINTS.md` dicen nada de unicidad del R-id
  dentro de un fichero compartido.
- **Y, sobre todo, la spec firmada prescribió los títulos desnudos.**
  `tasks.md` pide literalmente `describe('R5: ...')` (línea 132),
  `describe('R6: ...')` (153), `describe('R7: el guarda de envío…')` (180), y
  análogos en 55, 84, 101 y 117. Codex escribió exactamente lo que la spec le
  mandó escribir. **El defecto es del spec_author, no del implementador**, y
  rechazar la implementación por obedecer su spec sería incorrecto.

**Pero es deuda real**, porque el repo ya demostró tres veces la solución:

| `describe` prefijado | Commit que lo introdujo |
|---|---|
| `#87 R15: PairingScreen lee por TanStack Query` | `ab66c3b7` |
| `#61 R10: los controles táctiles declaran TOUCH_SLOP` | `59d3fe72` |
| `R1 (mobile-jest-mock-hygiene): el mock del picker se reinicializa por test` | `79caf8c4` |

Tres features independientes que añadieron un `describe` a un fichero cuyos
R-ids ya pertenecían a otra spec prefijaron. #63 es la primera que no.
Consecuencia práctica: `npx jest -t "R7"` sobre `pairing` ya selecciona tests de
dos specs distintas.

**Recomendación al leader** (no condiciona este veredicto): abrir tarea menor
para (a) renombrar los tres `describe` de #63 en `pairing/index.test.tsx` a
`#63 R5/R6/R7` —y, ya puestos, los de `add-pet`/`weight-log`/`meal-schedule`—, y
(b) **codificar la regla del prefijo en `docs/conventions.md`**, que es lo que
de verdad evita la tercera repetición. Mientras no se escriba, el spec_author
volverá a prescribir títulos desnudos.

### 3. `feature_list.json` entra en el diff del alcance — NO BLOQUEANTE

El leader acotó el alcance a "diez ficheros móviles + `specs/` + `progress/`".
El diff trae además `feature_list.json` (27 líneas), que es territorio del leader
(registro de #63 y de la deuda), no de Codex. Lo señalo solo para que el recuento
del alcance cuadre; no es un hallazgo contra la implementación.

---

## Alcance verificado

Diff `f50b4203..36b7e67f`: **10 ficheros móviles** (5 producción + 5 test), más
`specs/` (4), `progress/` (3) y `feature_list.json`.

| Producción (5) | Test (5) |
|---|---|
| `src/screens/add-reminder/index.tsx` | `src/screens/add-reminder/index.test.tsx` |
| `src/screens/add-pet/index.tsx` | `src/screens/add-pet/index.test.tsx` |
| `src/screens/pairing/index.tsx` | `src/screens/pairing/index.test.tsx` |
| `src/app/(tabs)/weight-log.tsx` | `src/app/(tabs)/__tests__/weight-log.test.tsx` |
| `src/app/(tabs)/meal-schedule.tsx` | `src/app/(tabs)/__tests__/meal-schedule.test.tsx` |

Ficheros que la spec exige **idénticos** — los cinco sin diff alguno:

```
IDENTICO  src/i18n/catalog.ts
IDENTICO  src/providers/__tests__/language-provider.test.tsx
IDENTICO  src/app/(tabs)/_layout.tsx
IDENTICO  src/screens/docs/index.tsx
IDENTICO  src/__tests__/consistency-classnames.test.ts
```

- `backend-pet-tracker/` e `infra-pet-tracker/`: **cero ficheros tocados**.
- `mobile-pet-tracker/.expo/types/router.d.ts`: no existe (correcto; #63 no crea
  ni renombra rutas).
- Copy nueva: **cero**. `catalog.ts` sin diff, luego el candado de longitud de
  `language-provider.test.tsx:55` sigue byte a byte igual.

### C8 — carta de UI

Grep sobre las líneas **añadidas** en los cinco ficheros de producción buscando
`className`, hex, `withTiming`/`withSpring`/`Animated`/`useSharedValue`,
`StyleSheet` y dimensiones (`padding|margin|width|height|fontSize`): **cero
coincidencias**. El diff de producción son solo imports (`useFocusEffect`,
`useCallback`, `useEffect`) y llamadas a setters ya existentes. Ni una
`className` nueva, ni hex, ni token, ni dimensión, ni animación.

### Drift de código

```
HEAD                                                = 36b7e67facf147a715b84b4c6ef54f3267e99a45
origin/feature/63-mobile-detail-screens-state-reset  = 36b7e67facf147a715b84b4c6ef54f3267e99a45
git diff origin/… HEAD  → vacío
git status --porcelain  → vacío
```

Sin drift y sin nada sin commitear. No se coló nada entre el reporte de Codex y
esta revisión (el fallo de #59 no se repite).

---

## R7 — prueba de mutación (replantada por el reviewer)

Planté las **dos** mutaciones yo mismo; **no** me baso en la salida de Codex.
Ambas caen **por aserción**, no por compilación, y el árbol queda limpio.

### Mutación A — `setSubmitting(false)` en el reset de `AddReminderContent`

Añadido `setSubmitting(false);` dentro del cleanup del `useFocusEffect`:

```
● R7: el guarda de envío sobrevive al blur › mantiene deshabilitado el envío pendiente tras el blur

    expect(instance).toBeDisabled()
    Received instance is not disabled:
      <View accessibilityRole="button"
            accessibilityState={{ "disabled": false }}
            testID="add-reminder-submit" />

    > 243 |     await waitFor(() =>
          |                  ^
      244 |       expect(screen.getByTestId('add-reminder-submit')).toBeDisabled(),

    at Object.<anonymous> (src/screens/add-reminder/index.test.tsx:243:18)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 22 skipped, 23 total
```

Rojo **por la aserción** de `index.test.tsx:243`. Revertido con
`git checkout`: `git diff --stat` vacío, `git status --porcelain` vacío.

### Mutación B — `setClaiming(false)` en `resetPairingState`

```
● R7: el guarda de envío sobrevive al blur › mantiene deshabilitado el claim pendiente tras el blur

    expect(instance).toBeDisabled()
    Received instance is not disabled:
      <View accessibilityRole="button"
            accessibilityState={{ "disabled": false }}
            testID="pairing-submit" />

    > 272 |     await waitFor(() =>
          |                  ^
      273 |       expect(screen.getByTestId('pairing-submit')).toBeDisabled(),
      274 |     );
      275 |     expect(mockClaimDevice).toHaveBeenCalledTimes(1);

    at Object.<anonymous> (src/screens/pairing/index.test.tsx:272:18)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 skipped, 54 total
```

Rojo **por la aserción** de `pairing/index.test.tsx:272`. Revertido:
`git diff` vacío, `git status --porcelain` vacío, `HEAD` sin mover.

Ambas salidas reproducen exactamente las que Codex copió en su reporte
(incluidos los recuentos `22 skipped / 23 total` y `53 skipped / 54 total`).

**El test de R7 de pairing discrimina de verdad.** Vuelve a escribir un código
válido (`ACT-AGAIN`) después del blur antes de comprobar el botón: sin ese paso
el botón seguiría deshabilitado por código vacío —R5 limpia `code`— y la prueba
pasaría aunque la mutación borrase `claiming`. Además cierra con
`expect(mockClaimDevice).toHaveBeenCalledTimes(1)`, que es el invariante que R7
persigue de verdad (no disparar un segundo POST sobre una petición viva).

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (#63 `mobile-detail-screens-state-reset`)
- [x] `progress/current.md` actualizado (baseline, spec aprobada, handoff a Codex)

## Checklist C3 — Arquitectura

- [x] N/A en el sentido backend: #63 es exclusivamente móvil y no cruza capas
- [x] Se respeta la estructura Expo oficial: el cuerpo de pantalla sigue en
      `src/screens/<nombre>/index.tsx`; los dos ficheros bajo `src/app/(tabs)/`
      (`weight-log`, `meal-schedule`) ya eran pantallas con cuerpo inline desde
      antes de #63 y esta feature **no** cambia su forma
- [x] Ninguna decisión de infraestructura ni de negocio nueva: el diff de
      producción es reset de estado local de UI

## Checklist C4 — TDD

- [x] Cada R1–R7 tiene al menos un test que lo nombra
- [x] Historial test-primero, no todo junto. Alternancia perfecta, verificada
      commit a commit (rojo = solo test, verde = solo producción):

| Commit | Mensaje | test / prod |
|---|---|---|
| `a710b05b` | `test(…): cover reminder blur reset (R1)` | 1 / 0 |
| `00e82481` | `feat(…): reset reminder state on blur (R1)` | 0 / 1 |
| `eb931f7e` | `test(…): cover pet form blur reset (R2)` | 1 / 0 |
| `86b01d75` | `feat(…): reset pet form state on blur (R2)` | 0 / 1 |
| `d922f8ba` | `test(…): cover weight form blur reset (R3)` | 1 / 0 |
| `5343f374` | `feat(…): reset weight form state on blur (R3)` | 0 / 1 |
| `9537666b` | `test(…): cover meal error blur reset (R4)` | 1 / 0 |
| `947a9d07` | `feat(…): clear meal error on blur (R4)` | 0 / 1 |
| `e46cfd2e` | `test(…): cover pairing blur reset (R5)` | 1 / 0 |
| `7b809932` | `feat(…): reset pairing state on blur (R5)` | 0 / 1 |
| `4c8ec120` | `test(…): cover pairing pet switch reset (R6)` | 1 / 0 |
| `6fd8de2e` | `feat(…): reset pairing state on pet change (R6)` | 0 / 1 |
| `5cdf2024` | `test(…): preserve request guards on blur (R7)` | 2 / 0 |
| `79ed667a` | `fix(…): allow intentional pairing reset effect (R6)` | 0 / 1 |

- [x] **Los rojos eran rojos de verdad.** Verificado que en cada commit rojo la
      producción **aún no tenía** el mecanismo, así que el test no podía pasar:

```
R1 rojo=a710b05b -> 'useFocusEffect'    en add-reminder/index.tsx:  0
R2 rojo=eb931f7e -> 'useFocusEffect'    en add-pet/index.tsx:       0
R3 rojo=d922f8ba -> 'useFocusEffect'    en weight-log.tsx:          0
R4 rojo=9537666b -> 'useFocusEffect'    en meal-schedule.tsx:       0
R5 rojo=e46cfd2e -> 'resetPairingState' en pairing/index.tsx:       0
R6 rojo=4c8ec120 -> 'useEffect'         en pairing/index.tsx:       0
```

- [x] Ningún rojo por `ReferenceError` de helper inexistente
- [x] Ningún rojo por mutación del doble de test
- [x] **R7 es requisito de verificación, vía (b)**, declarado por escrito en
      `tasks.md` §R7 y en `traceability.md` **antes** del handoff, y cerrado por
      mutación de **producción** con evidencia en este reporte (§R7 arriba)

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" (7 de 7 con test y commit)
- [x] Cada fila resuelve sin ambigüedad: desambigua por título completo del
      `describe`, y cada título es único en su fichero (ver Hallazgo 2)
- [x] Todos los tests referenciados existen y nombran su R-id
- [x] Commits en formato `feat(<scope>): <desc> (R-ids)` / `test(<scope>): …`

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla humana marcada: `[X] Aprobado por humano (fecha: 2026-09-14)`
- [x] Firma real en branch: `1a9fef11` **AlexisSM377** 2026-09-14
      "Approve mobile detail screens state reset spec", y toca **solo**
      `requirements.md` (flujo de aprobación por commit en branch, correcto)
- [x] La errata posterior `36b7e67f` es del leader y toca **solo** §Verificación;
      no altera R1–R7 ni ninguna decisión firmada

## Checklist C7 — Sin código huérfano

- [x] **N/A — esta feature no reemplaza ni deprecia nada.** #63 es puramente
      aditivo (añade reset donde no lo había). La spec deja explícito que será
      la deuda `mobile-detail-screens-to-stack` la que vuelva redundante este
      reset en las pantallas que migre, y que retirarlo es el C7 **de esa**
      feature, no de esta.

## C8 — Carta de UI móvil

- [x] Cero `className` nuevas, cero hex, cero tokens, cero dimensiones, cero
      animaciones (grep sobre líneas añadidas: 0 coincidencias)
- [x] `src/__tests__/consistency-classnames.test.ts` idéntico, sin diff

---

## Flake #72 (add-pet foto) — NO se manifestó, y #63 no puede agravarlo

Separado a propósito de los hallazgos de #63.

**No apareció**: ni en `./init.sh` (móvil 73/73 suites, 1275/1275 tests) ni en
6 corridas aisladas consecutivas de `src/screens/add-pet`:

```
run 1..6: Tests: 18 passed, 18 total   (6/6 verde)
```

**Y estructuralmente #63 no puede alimentarlo**, que es lo que de verdad
importa. El diff de #63 en `add-pet/index.test.tsx` **sí toca**
`mockLaunchImageLibrary` —el mock señalado por #72—, así que lo miré en detalle:

1. El fichero tiene un `beforeEach` **a nivel de fichero**
   (`add-pet/index.test.tsx:93-96`), instalado por `mobile-jest-mock-hygiene`:

   ```
   beforeEach(() => {
     mockLaunchImageLibrary.mockReset();
     mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });
   });
   ```

   `mockReset()` **vacía la cola de `mockResolvedValueOnce`** y reinstala un
   default. Jest corre los `beforeEach` de fuera hacia dentro, así que esto se
   ejecuta antes de **cada** test del fichero, pase lo que pase en el bloque
   anterior. Es una barrera incondicional: ningún residuo de cola puede cruzarla.
2. El bloque nuevo `R2` de #63 está **balanceado**: encola exactamente dos
   `mockResolvedValueOnce` en su `beforeEach` y su único `it` los consume los dos
   (dos `press` sobre `add-pet-photo`). No deja sobrante ni aunque la barrera no
   existiera.
3. Su `jest.clearAllMocks()` no interfiere: `clearAllMocks` limpia
   `mock.calls`/`results`, **no** implementaciones ni la cola.
4. No hay `resetMocks` / `clearMocks` / `restoreMocks` en la config de Jest
   (`package.json` → preset `jest-expo`) ni en `test/jest-setup.js`, así que la
   barrera del punto 1 es el único —y suficiente— mecanismo.

Conclusión: el flake de #72 sigue vivo y sigue siendo **preexistente y ajeno a
#63**; esta feature no lo reproduce ni le añade superficie. Queda en #72.

---

## Observaciones finales

Trabajo limpio y fiel a la spec. La producción implementa D3 **literalmente**,
fichero por fichero, componente por componente: `initialTime()` y
`localTodayIso()` se re-invocan (no se congela el valor del montaje anterior),
los guardas `submitting`/`claiming`/`releasing` quedan intactos, `pairing` extrae
`resetPairingState` con `useCallback(…, [])` y lo usa en los dos sitios que D3
manda, y los dos `useFocusEffect` de refetch preexistentes no se tocan.

El helper de blur de los tests recorre **todas** las llamadas a
`mockUseFocusEffect` en vez de indexar una concreta, como pide D4 — por eso
sigue siendo válido con tres `useFocusEffect` en `pairing`.

Las dos decisiones que Codex tomó fuera de lo firmado están **declaradas en su
reporte** (§Decisiones no cerradas literalmente por la spec) y las dos son
correctas: el recodificado del código en el test de R7 de pairing (que es lo que
hace la prueba discriminante) y la supresión de lint del Hallazgo 1.

Queda pendiente, como marca la spec, el **gate humano no delegable**: la prueba
de humo de los 5 pasos en **dev build de Android** (nunca Expo Go). Este
veredicto no lo sustituye.
