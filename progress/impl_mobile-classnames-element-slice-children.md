/home/claude/sites/Pet-Tracker
feature/120-mobile-classnames-element-slice-children

# Implementación #120

- Skills cargadas: ninguna (instrucción expresa del encargo).
- Base HEAD: `f08ab572`; spec aprobada, feature `spec_ready`. No se ejecuta `./init.sh` por la instrucción expresa de no tocar la infraestructura compartida.
- `.expo/types/router.d.ts`: ausente, `exit=0`.
- Blobs de base: `consistency-classnames.test.ts` `5df906f85099d965c0e5adf901ae06fccc7fe2b6`; `legibility-classnames.test.ts` `890432e7647c33c06509885e3346c879e1bb9cd7`; `src/screens/reminders/index.tsx` `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`; `docs/conventions.md` `bb2ca08e8d386028c5b871055c22789c667695ed`.
- Base, `bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/120_locks.log 2>&1`: `exit=0`; `Test Suites: 2 passed, 2 total`; `Tests: 79 passed, 79 total`; `Snapshots: 0 total`.
- Base, `bunx jest > /tmp/120_full.log 2>&1`: `exit=0`; `Test Suites: 83 passed, 83 total`; `Tests: 1532 passed, 1532 total`; `Snapshots: 1 passed, 1 total`.

## R1 (0): agujero previo

- `P-active-h` en `src/screens/reminders/index.tsx`: blob `2b43ab8fb2affce0ce70c489d3f608f27dffbd55`.
- `bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/120_r1_hole.log 2>&1`: `exit=0`; `Test Suites: 2 passed, 2 total`; `Tests: 79 passed, 79 total`; `Snapshots: 0 total`. La clase solo en el hijo deja verde el candado anterior.

## R1: rojo y verde versionados

- Rojo `1ba1822433ca6c0aafb59ee376f530cc8899cda8`: helper y cuatro llamadas, blob de test `07cc45b4da0ce1fe0f7397e323188ae2aec1c73b`; mutación `P-active-h` versionada, blob `2b43ab8fb2affce0ce70c489d3f608f27dffbd55`. `grep -c elementWithTestId` = 0; `grep -c openingTagWithTestId` = 5.
- Candados, `/tmp/120_r1_red_locks.log`: `exit=1`; `Test Suites: 1 failed, 1 passed, 2 total`; `Tests: 1 failed, 78 passed, 79 total`; `Snapshots: 0 total`.
- Suite, `/tmp/120_r1_red_full.log`: `exit=1`; `Test Suites: 1 failed, 82 passed, 83 total`; `Tests: 1 failed, 1531 passed, 1532 total`; `Snapshots: 1 passed, 1 total`.
- Único rojo: `#62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)`; matcher `expect(received).toContain(expected)`; `Expected substring: "rounded-xl"`; `Received string: "<View\n testID=\"pill-active\"\n className=\"flex-1 items-center gap-1 bg-accent-soft p-3\"\n style={CONTINUOUS_CORNER}\n >\n "` (espacios de sangría omitidos solo en esta transcripción; log íntegro en `/tmp/120_r1_red_locks.log`).
- Verde `6807677954a5506ed0610ecdceb000b7d6307862`: `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/reminders/index.tsx`; blob restaurado `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`; `/tmp/120_r1_green_locks.log`: `exit=0`; `Test Suites: 2 passed, 2 total`; `Tests: 79 passed, 79 total`; `Snapshots: 0 total`.

## R2: rojo y verde versionados

- Rojo `b53b877831b1e5d6760e6b000dd67225e222b62d`: helper duplicado y candado partido, blob de test `8c42a1052626ed4ea11b2fe361dcb06fac761b7d`; mutación `D-v` versionada, blob `f136e9718d44ef81b5f92a9dd0e9385e60086060`.
- Candados, `/tmp/120_r2_red_locks.log`: `exit=1`; `Test Suites: 1 failed, 1 passed, 2 total`; `Tests: 1 failed, 78 passed, 79 total`; `Snapshots: 0 total`.
- Suite, `/tmp/120_r2_red_full.log`: `exit=1`; `Test Suites: 1 failed, 82 passed, 83 total`; `Tests: 1 failed, 1531 passed, 1532 total`; `Snapshots: 1 passed, 1 total`.
- Único rojo: `#61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`; matcher `expect(received).toContain(expected)`; `Expected substring: "variant=\"danger\""`; `Received string: "<Button\n testID=\"reminders-delete-confirm\"\n className=\"w-full rounded-xl bg-danger\"\n onPress={deleteSelectedReminder}\n >\n "` (espacios de sangría omitidos solo en esta transcripción; log íntegro en `/tmp/120_r2_red_locks.log`).
- Verde `ad361a5db54ddf37fe79bb6979d0ce9fa3801ef6`: `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/reminders/index.tsx`; blob restaurado `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`; `/tmp/120_r2_green_locks.log`: `exit=0`; `Test Suites: 2 passed, 2 total`; `Tests: 79 passed, 79 total`; `Snapshots: 0 total`.

## R3: 26 sondas sobre R1+R2

Cada fila siguió: mutación → blob → `bunx jest --runTestsByPath` sin pipe (log `/tmp/120_probe_<sonda>.log`) → `git checkout -- <ruta>` → `git diff --exit-code -- mobile-pet-tracker/src` = 0. La columna «tras #120» identifica cada `it` rojo y su matcher; «verde» equivale a ningún rojo.

| Sonda | Blob | Exit y cuentas | Tras #120 |
|---|---|---|---|
| `B-login-h` | `10ab4fdd` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › app/(auth)/login.tsx aplica rounded-xl a login-submit en su tag de apertura (#120 R1) [toContain] |
| `B-forgot-h` | `ff15e153` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › app/(auth)/forgot.tsx aplica rounded-xl a forgot-submit en su tag de apertura (#120 R1) [toContain] |
| `B-register-h` | `2f067b66` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › app/(auth)/register.tsx aplica rounded-xl a register-submit en su tag de apertura (#120 R1) [toContain] |
| `B-reset-h` | `01ac5470` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › screens/reset-password/index.tsx aplica rounded-xl a reset-submit en su tag de apertura (#120 R1) [toContain] |
| `B-login-p` | `ec0ed19f` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |
| `B-login-n` | `51e6326d` | `exit=1`; 1 failed, 1 passed, 2 total; 2 failed, 77 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-2xl en producción [toEqual]<br>#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban [toEqual] |
| `P-active-h` | `2b43ab8f` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1) [toContain] |
| `P-week-h` | `195738de` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1) [toContain] |
| `P-inactive-h` | `1c5f5511` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1) [toContain] |
| `P-week-j` | `efa2646a` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |
| `P-week-f` | `214a8eb9` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |
| `P-week-d` | `c841bfde` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1) [toBe] |
| `P-week-t` | `0f51df0a` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1) [toBe] |
| `P-week-a` | `0b3b6f86` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1) [toBe] |
| `P-week-l1` | `f56dbd10` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1) [toContain] |
| `P-week-l3` | `baa5baba` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |
| `P-week-p` | `72410a2c` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |
| `V-h` | `0c3633c1` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R2: cada skeleton tiene la forma del contenido que sustituye › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1) [toContain] |
| `V-f` | `7abf0dcf` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R2: cada skeleton tiene la forma del contenido que sustituye › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1) [toContain] |
| `S-h` | `5bc88a73` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R2: cada skeleton tiene la forma del contenido que sustituye › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1) [toContain] |
| `S-j` | `821d649e` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #62 R2: cada skeleton tiene la forma del contenido que sustituye › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1) [toContain] |
| `S-p` | `fad320de` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |
| `S-n` | `6a798a78` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |
| `D-h` | `00ea6738` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2) [toContain] |
| `D-v` | `f136e971` | `exit=1`; 1 failed, 1 passed, 2 total; 1 failed, 78 passed, 79 total | #61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2) [toContain] |
| `D-d` | `50cc3d89` | `exit=0`; 2 passed, 2 total; 79 passed, 79 total | Verde (ningún `it` rojo) |

Todas las filas coincidieron con «Exigido». `P-week-j`, `P-week-f`, `P-week-l3` y `D-d` quedaron en verde como límites documentados; `B-login-n` dio solo dos rojos y `S-n` quedó verde. Al final, `git diff --exit-code -- mobile-pet-tracker/src`: `exit=0`.

## R4: convención

- Commit: `87f2e9014c906f39b733081c89e9236685e953c1`.
- `git hash-object docs/conventions.md` → `e1f8a5ab02b66286020b3da98b2c9e84a553c2dd`.
- `grep -c "function openingTagWithTestId" docs/conventions.md` → `1` (`exit=0`).
- `grep -c "Los tres que recortan alrededor de" docs/conventions.md` → `0` (`exit=1`, ausencia exigida).
- `grep -c "el recorte acaba en su" docs/conventions.md` → `1` (`exit=0`).
- `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` → sin salida (`exit=1`, ausencia exigida).

## R5: cierre medido

Desde `mobile-pet-tracker/`:

```text
$ bunx jest > /tmp/120_final_full.log 2>&1; echo "exit=$?"
exit=0
Test Suites: 83 passed, 83 total
Tests:       1532 passed, 1532 total
Snapshots:   1 passed, 1 total
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
$ bunx tsc --noEmit > /tmp/120_tsc.log 2>&1; echo "exit=$?"
exit=0
$ bunx eslint src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/120_lint.log 2>&1; echo "exit=$?"
exit=0
```

Desde la raíz:

```text
$ git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx; echo "reminders_diff_exit=$?"
reminders_diff_exit=0
$ git diff --stat origin/main...HEAD -- mobile-pet-tracker/; echo "mobile_stat_exit=$?"
 .../src/__tests__/consistency-classnames.test.ts   | 51 ++++++++++------------
 .../src/__tests__/legibility-classnames.test.ts    | 33 ++++++++++++--
 2 files changed, 53 insertions(+), 31 deletions(-)
mobile_stat_exit=0
$ git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock; echo "deps_diff_exit=$?"
deps_diff_exit=0
```

- Blobs finales: `consistency-classnames.test.ts` `07cc45b4da0ce1fe0f7397e323188ae2aec1c73b`; `legibility-classnames.test.ts` `8c42a1052626ed4ea11b2fe361dcb06fac761b7d`; `src/screens/reminders/index.tsx` `8fbcd07c664d789b4c136347a68ed0ddc2b81bab`; `docs/conventions.md` `e1f8a5ab02b66286020b3da98b2c9e84a553c2dd`.
- Delta respecto a la base medida: +0 suites (83→83), +0 tests (1532→1532), +0 snapshots (1→1). Diff de producción y dependencias vacío. El diff móvil acumulado solo contiene los dos tests.
- Decisiones fuera de los literales de la spec: ninguna en implementación. Para R3 y R5, el commit que contiene este reporte se referencia como `HEAD` en trazabilidad: un fichero no puede contener el hash de su propio commit sin cambiar ese hash.

### Fragmentos literales de los dos rojos

**R1** (`/tmp/120_r1_red_locks.log`):

```text
  ● #62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)

    expect(received).toContain(expected) // indexOf

    Expected substring: "rounded-xl"
    Received string:    "<View
                  testID=\"pill-active\"
                  className=\"flex-1 items-center gap-1 bg-accent-soft p-3\"
                  style={CONTINUOUS_CORNER}
                >
                  "
```

**R2** (`/tmp/120_r2_red_locks.log`):

```text
  ● #61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)

    expect(received).toContain(expected) // indexOf

    Expected substring: "variant=\"danger\""
    Received string:    "<Button
                      testID=\"reminders-delete-confirm\"
                      className=\"w-full rounded-xl bg-danger\"
                      onPress={deleteSelectedReminder}
                    >
                      "
```
