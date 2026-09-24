/home/claude/sites/Pet-Tracker
feature/121-mobile-home-bell-source-lock-unbounded

## Bloqueo de entorno

- Skills cargadas: ninguna.
- Antes de modificar código, se intentó `rm -f .expo/types/router.d.ts` desde `mobile-pet-tracker/`.
- La revisión automática rechazó el comando: `rm -f style commands are not permitted. Use a safer approach`.
- La instrucción de #121 exige parar si se deniega ese comando y no sustituirlo por otra herramienta. No se ejecutaron tests, sondas ni commits.

## Enmienda 1 autorizada por el humano

El humano autorizó sustituir cada `rm -f .expo/types/router.d.ts` del handoff y de `tasks.md` por `test ! -e .expo/types/router.d.ts; echo "exit=$?"`. La primera comprobación, desde `mobile-pet-tracker/`, dio `exit=0` el 2026-09-24. Si en una comprobación posterior da `exit=1`, se para sin borrar el fichero. No se cargó ninguna skill.

## Base medida antes de N1

HEAD: `c94e0cbf7ab864ff7c3d85b14834f4674391d6e1`. Blob de `index.tsx` en HEAD y `origin/main`: `dbb5b0346895cfc26705bee2257d1f8a8815df6c`.

| Comando desde `mobile-pet-tracker/` | Salida | Exit | Log |
|---|---|---:|---|
| `bunx jest --runTestsByPath src/screens/home/index.test.tsx` | `Test Suites: 1 passed, 1 total`; `Tests: 140 passed, 140 total` | 0 | `/tmp/121_base_home.log` |
| `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` | `Test Suites: 1 passed, 1 total`; `Tests: 55 passed, 55 total` | 0 | `/tmp/121_base_drift.log` |
| `bunx jest` | `Test Suites: 82 passed, 82 total`; `Tests: 1452 passed, 1452 total`; `Snapshots: 1 passed, 1 total` | 0 | `/tmp/121_base_all.log` |
| `test ! -e .expo/types/router.d.ts; echo "exit=$?"` antes de `tsc` | `exit=0` | 0 | salida directa |
| `bunx tsc --noEmit` | salida vacía | 0 | `/tmp/121_base_tsc.log` |
| `bunx expo lint` | salida vacía | 0 | `/tmp/121_base_lint.log` |

## (0) Agujero N1 con el test original

En `src/screens/home/index.tsx`, solo la línea de estilo de `home-alerts-bell` se cambió a `style={{ opacity: 1 }}`. `git diff` mostró únicamente esa línea. `git hash-object mobile-pet-tracker/src/screens/home/index.tsx` devolvió `675ae7a1c18b400c234a9dbef2950c1175aaf026`.

`bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/121_n1_hole.log 2>&1; echo "exit=$?"` devolvió `exit=0`. El log conserva: `Test Suites: 1 passed, 1 total` y `Tests: 140 passed, 140 total`. El candado original quedó verde con la campana sin receta de pulsado.

## R1 + R2: par rojo → verde

- Rojo `0c50bf5a` — `test(mobile): expose the unbounded home-alerts-bell source lock (R1,R2)`. N1 versionada en `index.tsx` y el `it` de R1 acotado como prescribe `tasks.md`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/121_red.log 2>&1; echo "exit=$?"` dio `exit=1`, `Test Suites: 1 failed, 1 total`, `Tests: 1 failed, 139 passed, 140 total`. Falló solo `#121 R1`, en `expect(block).toMatch(`; la línea de fallo fue `expect(received).toMatch(expected)`.
- `Received string` del rojo, copiado de Jest:

  ```text
  "<Pressable
                testID=\"home-alerts-bell\"
                accessibilityRole=\"button\"
                accessibilityLabel={
                  hasOpenAlerts
                    ? t('home.alertsBellUnread')
                    : t('home.alertsBell')
                }
                className=\"size-11 items-center justify-center rounded-full\"
                style={{ opacity: 1 }}
                onPress={() => router.push('/alerts')}
              >
                "
  ```

  El recorte termina antes de `<Bell`; no contiene la receta de `reminders-see-all`.
- Verde `5fbf2aba` — `test(mobile): bound the home-alerts-bell source lock to its own opening tag (R1,R2)`. Se ejecutó `git checkout HEAD~1 -- src/screens/home/index.tsx`; el diff contra `git merge-base origin/main HEAD` dio `exit=0` y el blob volvió a `dbb5b0346895cfc26705bee2257d1f8a8815df6c`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/121_green.log 2>&1; echo "exit=$?"` dio `exit=0`, `Test Suites: 1 passed, 1 total`, `Tests: 140 passed, 140 total`.

## R2: seis sondas sobre el árbol verde

Cada sonda escribió la mutación literal de `tasks.md` en `src/screens/home/index.tsx`, ejecutó `bunx jest --runTestsByPath src/screens/home/index.test.tsx` con stdout y stderr redirigidos al log indicado, y restauró el contenido original antes de la siguiente. No se usaron pipes. En cada log figura `Test Suites: 1` y 140 tests totales. «Otros» excluye `#121 R1`.

| Sonda | Veredicto `#121 R1` | Matcher | Otros | Exit | Log |
|---|---|---|---:|---:|---|
| S1p | ROJO | `toMatch` | 0 | 1 | `/tmp/121_probe_S1p.log` |
| V7 | ROJO | `toMatch` | 0 | 1 | `/tmp/121_probe_V7.log` |
| N1n | ROJO | `toMatch` | 0 | 1 | `/tmp/121_probe_N1n.log` |
| W1 | ROJO | `toMatch` | 3 | 1 | `/tmp/121_probe_W1.log` |
| S2 | ROJO | `toMatch` | 2 | 1 | `/tmp/121_probe_S2.log` |
| S3 | ROJO | `toMatch` | 2 | 1 | `/tmp/121_probe_S3.log` |

## R3: diez sondas sobre el árbol verde

Mismo método y restauración tras cada sonda. L2 rompe el render con `Text strings must be rendered within a <Text> component`; esos 119 fallos son ajenos al candado. P1, P2 y P4 permanecen verdes según la spec. E1, V6 y A0 son los tres cambios declarados hacia rojo.

| Sonda | Veredicto `#121 R1` | Matcher | Otros | Exit | Log |
|---|---|---|---:|---:|---|
| N2 | VERDE | ninguno | 0 | 0 | `/tmp/121_probe_N2.log` |
| E2 | VERDE | ninguno | 0 | 0 | `/tmp/121_probe_E2.log` |
| E3 | VERDE | ninguno | 0 | 0 | `/tmp/121_probe_E3.log` |
| L2 | VERDE | ninguno | 119 | 1 | `/tmp/121_probe_L2.log` |
| P1 | VERDE | ninguno | 0 | 0 | `/tmp/121_probe_P1.log` |
| P2 | VERDE | ninguno | 0 | 0 | `/tmp/121_probe_P2.log` |
| P4 | VERDE | ninguno | 0 | 0 | `/tmp/121_probe_P4.log` |
| E1 | ROJO | `toMatch` | 0 | 1 | `/tmp/121_probe_E1.log` |
| V6 | ROJO | `toMatch` | 0 | 1 | `/tmp/121_probe_V6.log` |
| A0 | ROJO, `Received string:  ""` | `toMatch` | 9 | 1 | `/tmp/121_probe_A0.log` |

Tras las 16 sondas, `git diff --exit-code HEAD -- mobile-pet-tracker/src/screens/home/index.tsx; echo "exit=$?"` devolvió `exit=0`; el blob medido fue `dbb5b0346895cfc26705bee2257d1f8a8815df6c`.

## R4: comentario y convención

Commit `f2c954826cf29e33886f08d277c095dc73911365` — `docs(mobile): record the home-alerts-bell opening-tag slice (R4)`. El comentario literal quedó encima de `const block`, y se sustituyó solo el bloque final de la sección de recortes en `docs/conventions.md`.

Salidas desde la raíz del repo:

```text
$ grep -c "lastIndexOf('<', anchor)" mobile-pet-tracker/src/screens/home/index.test.tsx; echo "exit=$?"
2
exit=0
$ grep -n "expect(source).toMatch(" mobile-pet-tracker/src/screens/home/index.test.tsx; echo "exit=$?"
exit=1
$ grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src; echo "exit=$?"
exit=1
$ grep -n "tres candados" docs/conventions.md; echo "exit=$?"
exit=1
```

Tras R4, `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/121_r4_drift.log 2>&1; echo "exit=$?"` dio `exit=0`, `Test Suites: 1 passed, 1 total`, `Tests: 55 passed, 55 total`. `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/121_r4_home.log 2>&1; echo "exit=$?"` dio `exit=0`, `Test Suites: 1 passed, 1 total`, `Tests: 140 passed, 140 total`.

## R5: cierre medido

Desde `mobile-pet-tracker/`, salvo los comandos `git` (raíz del repo):

| Comando | Salida exacta relevante | Exit | Log |
|---|---|---:|---|
| `bunx jest > /tmp/121_final_all.log 2>&1; echo "exit=$?"` | `Test Suites: 82 passed, 82 total`; `Tests: 1452 passed, 1452 total`; `Snapshots: 1 passed, 1 total`; `exit=0` | 0 | `/tmp/121_final_all.log` |
| `test ! -e .expo/types/router.d.ts; echo "exit=$?"` | `exit=0` | 0 | salida directa |
| `bunx tsc --noEmit > /tmp/121_final_tsc.log 2>&1; echo "exit=$?"` | `exit=0`; log de 0 bytes | 0 | `/tmp/121_final_tsc.log` |
| `bunx expo lint > /tmp/121_final_lint.log 2>&1; echo "exit=$?"` | `exit=0`; log de 0 bytes | 0 | `/tmp/121_final_lint.log` |

Desde la raíz del repo:

```text
$ git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx; echo "production_diff_exit=$?"
production_diff_exit=0
$ git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx
dbb5b0346895cfc26705bee2257d1f8a8815df6c
$ git rev-parse 0c50bf5a:mobile-pet-tracker/src/screens/home/index.tsx
675ae7a1c18b400c234a9dbef2950c1175aaf026
$ git diff --stat origin/main...HEAD -- mobile-pet-tracker/
 mobile-pet-tracker/src/screens/home/index.test.tsx | 13 +++++++++++--
 1 file changed, 11 insertions(+), 2 deletions(-)
```

Delta contra la base de esta branch: **+0 suites, +0 tests** en la suite completa; Home **+0 tests**; guard **+0 tests**. Diff acumulado de producción vacío. Los commits de esta implementación desde `c94e0cbf7ab864ff7c3d85b14834f4674391d6e1` cambian únicamente `index.test.tsx`, `docs/conventions.md`, este reporte y `specs/mobile-home-bell-source-lock-unbounded/traceability.md` en su diff acumulado.

| R-id | Commit rojo | Commit verde o documental |
|---|---|---|
| R1, R2 | `0c50bf5a71abed3a3d6ee1ba71b69096dae01c7e` | `5fbf2aba45076197c3bbd5b0b3b166eeea79b435` |
| R3 | mismo candado rojo de R1/R2 | sondas sobre `5fbf2aba45076197c3bbd5b0b3b166eeea79b435` |
| R4 | N/A, entregable documental | `f2c954826cf29e33886f08d277c095dc73911365` |
| R5 | N1 en `0c50bf5a71abed3a3d6ee1ba71b69096dae01c7e` | N1 revertida en `5fbf2aba45076197c3bbd5b0b3b166eeea79b435` |

Decisión humana fuera del texto original de la spec: Enmienda 1, ya registrada arriba. No se cargó ninguna skill. No se ejecutó `./init.sh`, ni se tocó infraestructura compartida; no se hizo push ni se abrió PR, conforme al handoff. La feature no deja cambios de UI, por lo que C8 se comprobó en los guards del fichero de test y no requiere smoke de Android.
