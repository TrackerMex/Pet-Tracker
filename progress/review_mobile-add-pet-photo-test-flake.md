# review: mobile-add-pet-photo-test-flake (#72)

Fecha: 2026-09-17
Rama: `feature/72-mobile-add-pet-photo-test-flake`
HEAD revisado: `bed08186` (once commits, `b7095168`..`bed08186`)
Base de la rama: `9c3dcab6` — `origin/main` ha avanzado a `31814254` (merge de #83)
Veredicto: **APROBADO**

> Esta es una feature de tests. La causa A (add-pet) queda **abierta** por decisión
> D-A firmada por el humano; no se juzga por la ausencia de causa raíz, sino por
> que el reporte y el código lo digan y por que lo entregado a cambio (R3, R4, F1)
> esté vivo. Lo está, y lo he comprobado ejecutando, no leyendo.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (`#72`; el resto `pending`/`done`)
  `feature_list.json` → única entrada con `status: in_progress` es la 72.
- [x] `progress/current.md` actualizado: describe la sesión Frontend, la rama, el
      plan R1–R4 y que el implementador es Codex CLI.
- [x] Criterios de aceptación 1, 2 y 5 de la entrada #72 reescritos conforme a D-A y
      D-B (los leí en `feature_list.json`; citan el Protocolo V y dejan A abierta).

## Checklist C3 — Arquitectura

- [x] N/A justificada: la feature **no toca** `backend-pet-tracker/` ni `infra/`;
      `docs/architecture.md` no aplica (así lo dice `design.md` §Capas).
- [x] Cero ficheros de producción modificados (ver C7/contención más abajo).

## Checklist C4 — TDD (rojo→verde por R-id, y el rojo **genuino**)

- [x] Cada R tiene test que lo nombra — 11 coincidencias de `#72 R`:
      R1 `alerts/index.test.tsx:193`; R2 en `alerts:647,685`, `pairing:545,934`,
      `map.test.tsx:264`, `weight-log.test.tsx:377`; R3 `profile:944-945`;
      R4 `add-pet:402-403`.
- [x] Historial test-primero, un par por requisito, nada en un solo commit:
      R1 `b7095168`→`1688dc94`; R2 `c71c7b4d`→`6a94a4ee` (+`28b4934e` regla);
      R3 `7d49df5e`→`effcbb0e`; R4 `ff33b7e7`→`9424733c` (+`0fda68ac` refactor).
- [x] **El rojo de R1 es el defecto real, no un sustituto.** `git show b7095168`
      solo mete import + `afterEach` + la viga + el sufijo del título; **no toca
      ninguna aserción**. `1688dc94` solo cambia `getByTestId`→`await findByTestId`.
- [x] **Verificación independiente del rojo de R1** (lo pedido: revertir la
      corrección dejando la viga): fallo al 100 %, 3 de 3 corridas, con la firma
      exacta de CI.

  ```
  # viga puesta, findByTestId revertido a getByTestId
  E1 run1 exit=1 | Tests: 1 failed, 31 passed, 32 total
  E1 run2 exit=1 | Tests: 1 failed, 31 passed, 32 total
  E1 run3 exit=1 | Tests: 1 failed, 31 passed, 32 total
  ● … › pinta y reintenta cada error de la primera página (#72 R1)
      Unable to find an element with testID: alerts-error
  ```

  Y el control complementario — **quitando también la viga**, el código viejo pasa
  (o sea: la viga es lo que convierte la carrera latente en rojo determinista, y no
  hay trampa de "rojo por otra cosa"):

  ```
  E1b run1 exit=0 | Tests: 32 passed, 32 total
  E1b run2 exit=0 | Tests: 32 passed, 32 total
  ```
  Árbol restaurado tras el experimento (`git checkout --`).

- [x] **Rojo de R2 por mutación de producción, reproducido por mí.** Los cuatro
      ficheros de test en `c71c7b4d` son **byte a byte** iguales a HEAD
      (`git rev-parse c71c7b4d:<f>` == `HEAD:<f>` en los cuatro), así que reapliqué
      las cinco mutaciones del commit rojo sobre el árbol actual
      (`git diff c71c7b4d^..c71c7b4d -- <3 ficheros de producción> | git apply`):

  ```
  alerts/index.test.tsx        exit=1 | Tests: 3 failed, 29 passed, 32 total
  pairing/index.test.tsx       exit=1 | Tests: 2 failed, 52 passed, 54 total
  (tabs)/__tests__/map.test.tsx exit=0 | Tests: 49 passed, 49 total   ← S6 no lleva mutación
  (tabs)/__tests__/weight-log.test.tsx exit=1 | Tests: 1 failed, 23 passed, 24 total
  ```

  Coincide exactamente con la tabla del reporte de Codex. Los que fallan son los
  seis sitios y **fallan por su propia aserción**, no por compilación:

  ```
  ● … › cierra sesión en unauthorized sin pintar error (#72 R2)   [S3]
      expect(received).toBeNull()
      Received: <Text className="text-danger" testID="alerts-action-error">Algo salió mal</Text>
  ● … › submits all fields, clears them, and refetches the list (#72 R2)  [S7]
      expect(received).toBe(expected)  Expected: ""  Received: "12.8"
  ● … › deshabilita durante el vuelo y corta dos pulsaciones seguidas (#72 R2)  [S2]
  ● … › signs out for unauthorized without showing an error message (#72 R2)    [S4]
  ● … › signs out for unauthorized without showing a local error (#72 R2)       [S5]
  ● #97 R5: … › mantiene bloqueado el ack que sigue en vuelo  ← candado previo que ve la misma mutación (declarado en el reporte)
  ```
  Mutaciones revertidas después; los tres ficheros de producción vuelven a su hash
  de HEAD (comprobado con `git hash-object`).

- [x] **Rojo de R3 reproducido**: quitando el `beforeEach` raíz de profile, el test
      nuevo falla por su propia aserción con el valor heredado de `:579`:

  ```
  E4 exit=1 | Tests: 1 failed, 32 passed, 33 total
  ● #72 R3: … › resuelve al valor cancelado por defecto
      expect(received).resolves.toEqual(expected)
      - "canceled": true / "assets": null   + "assets": Array [ … file:///luna.webp … ]
  ```

- [x] **Ningún rojo por `ReferenceError`**: `ff33b7e7` **incluye** el helper
      `pressPickPhoto` (sin la guarda) junto al self-test; el rojo es de aserción.
      Lo reproduje quitando solo la guarda del helper en el árbol actual:

  ```
  E3a exit=1 | Tests: 1 failed, 18 passed, 19 total
  ● #72 R4: … › falla con PICKER_MOCK_UNARMED si el mock está desarmado
      TypeError: Cannot read properties of undefined (reading 'canceled')
      > 137 | if (picked.canceled || !picked.assets[0]) return;
  ```
  Dato que vale la pena registrar: sin la guarda, el mock desarmado produce **la
  firma histórica exacta del flake de add-pet** (`add-pet/index.tsx:137`). El
  invariante de R4 está plantado justo delante de ese fallo, que es lo que D-A
  compraba.

- [x] Ningún rojo se apoya en mutar un doble de test: las cinco mutaciones son de
      producción y están revertidas.

## Checklist C5 — Trazabilidad

- [x] `specs/mobile-add-pet-photo-test-flake/traceability.md` sin filas "pendiente"
      (la única aparición de la palabra es la línea de la regla, no una fila).
- [x] Cada R tiene test y par de commits registrados.
- [x] **Todos los hashes citados son ancestros de HEAD** (`git merge-base
      --is-ancestor` OK en los 11): `b7095168 1688dc94 c71c7b4d 6a94a4ee 28b4934e
      7d49df5e effcbb0e ff33b7e7 9424733c 0fda68ac bed08186`. Nadie rebasó.
- [x] Formato de commit: `test|fix|refactor|docs(add-pet-photo-test-flake): … (Rn)`,
      la forma que `traceability.md` declara y que `docs/conventions.md` §Commits
      admite (conventional commits con R-ids).

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y `- [X] Aprobado por humano (fecha:
      2026-09-17)`, más `- [X] D-A` y `- [X] D-B` firmadas.
- [x] `design.md`, `tasks.md` y `traceability.md` también en `approved`.
- [x] Ningún requisito modificado tras la aprobación: el único cambio a `specs/` en
      los once commits es rellenar filas de `traceability.md`.

## Checklist C7 — Sin código huérfano

- [x] Lo único "reemplazado" es la aserción vacua S6, y se **borró** (no se
      convirtió): `map.test.tsx` pierde `expect(screen.getByTestId('map-loading'))
      .toBeVisible()` y **conserva** el `waitFor` sobre `mockGetLastPosition`.
- [x] No hay módulos, pantallas ni tests eliminados que dejen importadores.

## Checklist C8 — Carta de UI

- [x] N/A verificada, no asumida: **cero** ficheros de producción móviles tocados
      (los seis ficheros cambiados bajo `mobile-pet-tracker/` son `*.test.tsx`), y
      el grep sobre el diff móvil no encuentra hex, clases arbitrarias,
      `StyleSheet.create`, shadow/elevation ni animaciones nuevas.

---

## Contención: ni un fichero de producción cambiado

Comparación de **hashes de blob** (no "el diff sale vacío a ojo") entre la base
`9c3dcab6`, `origin/main` y `HEAD`:

```
IDENTICO  mobile-pet-tracker/src/screens/alerts/index.tsx        c7f806d0…
IDENTICO  mobile-pet-tracker/src/screens/pairing/index.tsx       2fae4234…
IDENTICO  mobile-pet-tracker/src/app/(tabs)/weight-log.tsx       df7bc05c…
IDENTICO  mobile-pet-tracker/src/screens/add-pet/index.tsx       3b1a84f0…
IDENTICO  mobile-pet-tracker/src/screens/profile/index.tsx       5baabd9a…
IDENTICO  mobile-pet-tracker/package.json                        808105ad…
IDENTICO  mobile-pet-tracker/test/jest-setup.js                  d3314961…
IDENTICO  …/src/providers/__tests__/language-provider.test.tsx   1b8306e7…
```

Barrido más ancho que los cuatro ficheros mutados, como se pidió:

```
git diff --name-only 9c3dcab6..HEAD -- 'mobile-pet-tracker/' | grep -v '\.test\.tsx$'
→ (ninguno)
```

Los seis únicos ficheros móviles tocados son los seis ficheros de test de la spec.

## Lo prohibido: no está

- `mobile-pet-tracker/package.json` bloque `jest`: claves presentes =
  `preset`, `transformIgnorePatterns`, `moduleNameMapper`, `setupFilesAfterEnv`.
  **Sin `resetMocks`, `clearMocks` ni `restoreMocks`** (y el fichero es
  byte-idéntico a la base, así que ni se rozó).
- Grep sobre el diff móvil: cero `retryTimes`, `it.skip`, `it.failing`,
  `jest.setTimeout`, `asyncUtilTimeout`, `runInBand`.
- `test/jest-setup.js` sin tocar y sin ninguna de esas claves.

## R1 — la viga: restaurada y sin filtrarse

- `afterEach(() => notifyManager.setScheduler(defaultScheduler));` está a **nivel de
  fichero** (`alerts/index.test.tsx:159`), fuera de los describes, así que cubre
  todos los tests del fichero.
- Prueba de que es **load-bearing**, no decorativo: quitándolo, el fichero sigue
  verde pero el retraso de 200 ms se filtra al resto de tests y el tiempo del
  fichero **se dobla**:

  ```
  con afterEach (V1 corrida 5):   Tests: 32 passed   Time: 5.208 s
  sin afterEach (E6):             Tests: 32 passed   Time: 10.799 s
  ```
- Entre ficheros no puede filtrarse: `notifyManager` es un singleton por registry de
  módulos de jest, y las otras 72 suites salen verdes en las cinco corridas
  completas.

## R4 — el invariante salta, y no da falsos positivos

Tres comprobaciones, todas ejecutadas:

1. **Salta cuando debe**: el self-test `#72 R4` pasa en verde (19/19, cinco veces),
   y al quitar la guarda pasa a fallar (E3a, arriba).
2. **Está en el camino de las tres pulsaciones**: invertí la guarda
   (`!== undefined`) y fallan exactamente los tres tests que pulsan el picker —
   incluido el que apila **dos `mockResolvedValueOnce`** sobre la implementación
   persistente:

   ```
   E5 exit=1 | Tests: 3 failed, 16 passed, 19 total
   ● R2: … › restaura los catorce valores visibles tras el blur        ← usa colas mockResolvedValueOnce
   ● R7: foto opcional tras alta › uploads a chosen preview only after createPet succeeds
   ● #72 R4: … › falla con PICKER_MOCK_UNARMED si el mock está desarmado
   ```
   Con la guarda en su forma correcta esos mismos tests están **verdes** en las
   cinco corridas de V1: la cola no borra la implementación, así que **cero falsos
   positivos**.
3. **Semántica del runtime confirmada contra `jest-mock` 29.7.0** (el de
   `node_modules/jest-runtime/node_modules/jest-mock`, no el 30.4.1 hoisted):

   ```
   version 29.7.0
   recién creado                     → undefined
   tras mockResolvedValue            → function
   tras mockResolvedValueOnce encima → function
   tras mockClear                    → function
   tras mockReset                    → undefined
   ```
   Idéntico a la tabla de `requirements.md` §R4.

## Los siete sitios del criterio 4

| id | Fichero | Tratamiento exigido | Verificado |
|---|---|---|---|
| S1 (R1) | `alerts/index.test.tsx:193` | espera termina en el árbol (`findByTestId`), conservando la aserción de caché de #78 R4 | Sí: el `waitFor` de `getQueryData` sigue ahí |
| S2 | `alerts:685` | convertir a `waitFor(toBeDisabled)`, conservando `toHaveBeenCalledTimes(1)` | Sí |
| S3 | `alerts:647` | ancla positiva `alert-row-alert-1-ack` `not.toBeDisabled` + ausencia después | Sí |
| S4 | `pairing:545` | ancla `pairing-submit` + ausencia | Sí |
| S5 | `pairing:934` | ancla `device-unpair` + ausencia | Sí |
| S6 | `map.test.tsx:264` | **borrar** la línea vacua, conservar la espera de `mockGetLastPosition` | Sí: borrada, no convertida |
| S7 | `weight-log.test.tsx:377` | espera termina en `weight-input.props.value === ''`, el contador después | Sí |

Las tres aserciones de ausencia (S3, S4, S5) quedan ancladas a una espera positiva
sobre el fin del estado "en vuelo", que es lo que `design.md` §D2 prescribe.

## `docs/conventions.md`

- Regla de R2 escrita en §Tests, subsección nueva **"Esperas sobre el árbol
  renderizado"** (`docs/conventions.md:198-205`), justo detrás de la de filtros de
  jest con paréntesis, como pedía `tasks.md`.
- **Riesgo de conflicto/duplicado con `origin/main@31814254`: ninguno.** El merge de
  #83 tocó `conventions.md` en las líneas ~292-303 (recuento de suites e2e), a más
  de 90 líneas de la subsección nueva, y la regla **no existe** en `main` (grep de
  "árbol renderizado"/"termina una espera" sobre `origin/main:docs/conventions.md`:
  sin resultados). Simulación de merge sin efectos secundarios:
  `git merge-tree --write-tree origin/main HEAD` → **exit 0**, árbol
  `89798f7f`, sin marcas de conflicto (tampoco en `feature_list.json`).
- D6 (títulos editados citados por traceabilities ajenas): grep de los siete títulos
  sobre `specs/` → solo dos citas, ambas en prosa de
  `specs/mobile-reminders-alerts-state-reset/` (`requirements.md:51`,
  `design.md:288`), **ninguna fila de traceability**. Nada que actualizar.

---

## Verificación independiente (Protocolo V corrido por el reviewer)

Antes de empezar: `pgrep -af "init.sh|jest"` encontró **un wrapper huérfano**
(`PID 3038251`, de una sesión anterior) cuyo propio command line contenía
`bunx jest`, de modo que su guarda `while pgrep -f "bunx jest"` se emparejaba a sí
misma y nunca podía disparar. Lo maté para que no ensucie los `pgrep` de gates
futuros; `pgrep` limpio después, y ningún `init.sh`, jest o e2e de la otra sesión
en vuelo durante toda la revisión.

**V3 — `./init.sh`, una vez, desde la raíz, sin pipe** → `exit=0`:

```
✅ Build exitoso
Test Suites: 166 passed, 166 total   Tests: 1279 passed  (backend unit)
Test Suites: 2 passed, 2 total       Tests: 14 passed    (infra)
Test Suites: 73 passed, 73 total     Tests: 1286 passed  (móvil)
Test Suites: 3 skipped, 26 passed, 26 of 29 total   Tests: 8 skipped, 367 passed, 375 total  (e2e)
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
init.sh exit=0
```

**V0** — `bunx jest --listTests > fichero` (sin pipe) → `exit=0`, **S = 73**.

**V1 — cinco corridas por fichero, `--runTestsByPath`** (25 invocaciones, 25 verdes):

| Fichero(s) | Corridas | Exit | Tests |
|---|---:|---|---|
| `alerts/index.test.tsx` | 5 | 0,0,0,0,0 | 32/32 |
| `add-pet/index.test.tsx` | 5 | 0,0,0,0,0 | 19/19 |
| `profile/index.test.tsx` | 5 | 0,0,0,0,0 | 33/33 |
| `pairing/index.test.tsx` | 5 | 0,0,0,0,0 | 54/54 |
| `map.test.tsx` + `weight-log.test.tsx` | 5 | 0,0,0,0,0 | 73/73 (2 suites) |

**V2 — cinco corridas de la suite móvil completa** (la #1 con
`/tmp/jest_ru/perf-cache-*` borrada antes), consistencia N == S en las cinco:

| Run | Orden | Exit | Dur | Test Suites | Tests |
|---:|---|---:|---:|---|---|
| 1 | frío (perf-cache borrada) | 0 | 34 s | 73 passed, **73 total** | 1286 passed |
| 2 | caliente | 0 | 35 s | 73 passed, **73 total** | 1286 passed |
| 3 | caliente | 0 | 34 s | 73 passed, **73 total** | 1286 passed |
| 4 | caliente | 0 | 41 s | 73 passed, **73 total** | 1286 passed |
| 5 | caliente | 0 | 40 s | 73 passed, **73 total** | 1286 passed |

`N = 73 = S` en las cinco: ningún fichero saltado en silencio. Mis números **cuadran**
con los del reporte de Codex (S=73, 73 suites, 1286 tests, y los mismos recuentos por
fichero en V1). Corrí 5 de las 20 de V2, no las 20: el reporte aporta las suyas; estas
cinco más V1 más `./init.sh` son la muestra independiente que pedía el gate, y ninguna
discrepa.

Logs completos: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/f91fbbe2-d34d-48eb-b00c-50e3e768878d/scratchpad/rev72/`
(`init.log`, `v1-*.log`, `v2-*.log`, `E1*/E2*/E3a/E4/E5/E6`, `SUMMARY.txt`).

## Deriva de código durante el gate

- `git status --porcelain` **vacío** al empezar y al terminar; todos mis
  experimentos se revirtieron con `git checkout --`.
- `HEAD == bed08186` antes y después; los seis ficheros de test y los tres de
  producción tienen en el árbol de trabajo el mismo hash que en HEAD.
- Los once commits entre `7dab69ea`(harness) y `bed08186` son exactamente los que
  cita el reporte: nadie coló nada fuera de ellos.

---

## Observaciones (ninguna bloqueante)

1. **Premisa de `design.md` §D5 equivocada, y Codex lo declaró.** D5 justifica quitar
   `{ virtual: true }` diciendo que `profile/index.test.tsx` mockea el mismo módulo
   **sin** el flag; en HEAD sí lo usa (`profile/index.test.tsx:58-60`). La acción
   prescrita se ejecutó igual y se sostiene por su otra pata, esa sí verificada
   (`expo-image-picker` es dependencia real, la suite resuelve y sigue verde). Queda
   abierto, para otra feature, el `virtual: true` de profile.
2. **La prueba de zona ciega de S3/S4/S5 no dio el contraste previsto** ("test viejo
   verde"): los tres viejos también salieron rojos. `tasks.md` autoriza expresamente
   anotarlo y seguir, y el reporte lo anota sin adornarlo. Yo verifiqué la mitad que
   importa para C4 —la mutación pone rojo el test **corregido**, por su aserción— y
   no reproduje las corridas del test viejo.
3. **La causa A sigue abierta y el cierre lo dice.** El reporte abre con "La causa A
   de add-pet sigue abierta conforme a D-A; este cierre no la atribuye a una cola de
   `mockResolvedValueOnce`, hipótesis falsada por F1", y el refactor de `virtual` se
   presenta explícitamente como reducción de superficie, no como arreglo. Ni un
   commit vende una causa inventada.
4. `feature_list.json` #72 sigue con `files_affected` = solo
   `add-pet/index.test.tsx`, cuando la feature toca seis ficheros de test. Cosmético;
   el `leader` puede ajustarlo al cerrar.
5. La rama está 1 merge por detrás de `main` (#83). El merge simulado sale limpio, así
   que no hace falta rebasar — y **no conviene**: rebasar invalidaría los hashes ya
   escritos en `traceability.md`.

## Veredicto

**APROBADO.** R1–R4 implementados solo en tests y documentación, con pares rojo→verde
reales por R-id, rojo de R1 reproducido al 100 % por mí, rojos de R2 reproducidos con
las cinco mutaciones de producción y revertidos byte a byte, invariante de R4 vivo en
las tres pulsaciones y sin falsos positivos con colas, cero ficheros de producción
tocados, nada prohibido en la configuración de jest, trazabilidad completa con hashes
ancestros de HEAD y `./init.sh` verde corrido por el reviewer.
