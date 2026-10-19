# Implementación #186 — mobile-forms-validation-global

## Arranque

- Fecha: 2026-10-19 UTC.
- `pwd`: `/home/claude/sites/Pet-Tracker-wt-186`.
- `git branch --show-current`: `feature/186-mobile-forms-validation-global`.
- H0: `9a94f741f8bcde3d06239d7d712187761560e9df`.
- Spec aprobada; P1–P7 por defecto, R8 incluido; R10 corresponde al humano.
- Skills cargadas: `ponytail` (regla del catálogo para código) y `building-native-ui` (`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`). Ninguna otra skill de Expo; no se cargaron appllama ni animate-expo.
- No se ejecuta `init.sh`, por instrucción expresa del handoff; sin PR ni recursos AWS.

## Base H0

| Ancla | Medida | Resultado |
|---|---|---|
| B1 | 425 claves en `en` | coincide |
| B2 | 35 secciones; última §2.35 (#180) | coincide; corresponde §2.36 |
| B3 | 18 líneas `validation.` | coincide |
| B4 | 0, 0, 0, 0 claves nuevas | coincide |
| B5 | ninguno de los dos módulos existe | coincide |
| B6 | 32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 = 39 | coincide |
| B7 | 35 - 1 + 2 + 1 + 16 - 4 + 8 + 1 + 6 + 2 + 2 = 68 | coincide |
| B8 | 50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1 + 3 = 56 | coincide |
| B9 | 42 + 1 - 2 + 4 = 45 | coincide |
| B10 | fórmula termina en `+ 1 // #185 R2: screens/docs-upload-form/index.tsx` | coincide |
| B11 | register, login, forgot, reset-password; producción | coincide: cuatro |
| B12 | diff H0 de `src/components/form-error.tsx` vacío | coincide |

T0: medición única iniciada con `bun run test > /tmp/pet-tracker-186-T0.log 2>&1`, sin pipe.

T0 medido en H0, una sola ejecución: `Tests:       3994 passed, 3994 total` (120 suites, exit 0). El aviso de worker preexistente no bloquea.

Se leyó también `mobile-pet-tracker/AGENTS.md` y, como exige, la documentación exacta de Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/ antes de escribir código.

## Suites individuales antes del primer commit

Cada fichero se ejecutó solo con `bunx jest <ruta>`; todos con exit 0:

| Fichero bajo mobile-pet-tracker/ | Tests en H0 |
|---|---|
| `src/providers/__tests__/language-provider.test.tsx` | `Tests:       46 passed, 46 total` |
| `src/__tests__/ui-language.test.ts` | `Tests:       30 passed, 30 total` (incluye los 2 it de ui-copy-table importados) |
| `src/__tests__/ui-copy-table.ts` | `Tests:       2 passed, 2 total` |
| `src/screens/add-pet/index.test.tsx` | `Tests:       41 passed, 41 total` |
| `src/screens/add-reminder/index.test.tsx` | `Tests:       60 passed, 60 total` |
| `src/screens/docs-upload-form/index.test.tsx` | `Tests:       73 passed, 73 total` |
| `src/screens/weight-log/index.test.tsx` | `Tests:       58 passed, 58 total` |

Los tres ficheros de tests nuevos aún no existen en H0: base 0 para cada uno. B10 suma 34 ficheros en su fórmula original.

## R1

Rojo verificado: `Tests:       2 failed, 45 passed, 47 total` = base 46 + 1 it nuevo. Solo fallan los dos it declarados (longitud y tabla), por aserción. Typecheck exit 0 y lint sin salida, exit 0.

- Commit rojo R1: `41cb99f82f691250efeb3dde33db87b15fc64ce8` — `test(mobile): copy de validación en ambos idiomas (#186 R1)`.
- Commit verde R1: `883d172244401c7241da72e7d687b7e995ab9e14` — `feat(mobile): copy de validación (#186 R1)`.
- Verde: language-provider `Tests:       47 passed, 47 total` (46 + 1); ui-language `Tests:       30 passed, 30 total` (30 + 0). Typecheck exit 0; lint exit 0 y log vacío. Anclas: `validation.` = 18 + 8 = 26; filas de design = 0 + 4 = 4.
- Nuevos it R1: 1; NV nuevos: ninguno (el test nuevo fue rojo). Cuentas existentes conservadas.
- Desviación procedimental: el registro rojo R1 en Python y `git add` quedaron separados por salto de línea, sin `&&` entre ambos; ambos terminaron con exit 0 y el rojo verificado fue el previsto. Se usará encadenamiento explícito en los siguientes registros. No se reescribió la historia.

S1.1 en `883d1722`: `Tests:       1 failed, 46 passed, 47 total`; falla solo la tabla por literal español de weightRange, como se esperaba. Revertida con git checkout HEAD; diff HEAD y cached vacíos.

S1.2 en `883d1722`: `Tests:       2 failed, 45 passed, 47 total`; fallan longitud (428 frente a 429) y tabla por clave ausente. Revertida con git checkout HEAD; diff HEAD y cached vacíos. Ambas sondas R1 dan el rojo previsto.

## R2 — PARADA OBLIGATORIA, implementación incompleta

Se escribieron los tests puros de `src/utils/form-rules.test.ts` y se añadieron las once filas de `form-rules.ts` a la tabla de copy, con sus deltas encadenados:

- Health: 39 + 4 = 43.
- Profile: 68 + 1 = 69.
- Recordatorios: 56 + 3 = 59.
- Add-pet: 45 + 3 = 48.
- SCREEN_FILES: 34 + 1 = 35.

El nuevo fichero de test se añadió con `git add` antes de las comprobaciones. No se creó `form-rules.ts`. Las suites se ejecutaron individualmente y sin solapar Jest:

| Fichero | Resultado del intento rojo R2 |
|---|---|
| `src/utils/form-rules.test.ts` | `Tests:       0 total`; `Test Suites: 1 failed, 1 total`; `Cannot find module './form-rules' from 'src/utils/form-rules.test.ts'`, el fallo de arranque declarado |
| `src/__tests__/ui-language.test.ts` | `Tests:       6 failed, 24 passed, 30 total` = 30 previos + 0; **seis**, no cinco |

Los seis it rojos de ui-language fallan por ENOENT de `src/utils/form-rules.ts` (no es un error de invocación):

1. `#65 R5: Health resuelve su copy por clave › #186 R2: resuelve las 43 ocurrencias normativas`.
2. `#65 R7: Profile resuelve su copy por clave › #186 R2: resuelve las 69 ocurrencias normativas`.
3. `#65 R8: Recordatorios resuelve su copy por clave › #186 R2: resuelve las 59 ocurrencias normativas`.
4. `#65 R9: el alta de mascota resuelve su copy por clave › #186 R2: resuelve las 48 ocurrencias normativas`.
5. `#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta`.
6. `#65 R18: los sitios resuelven por clave y no queda copy suelta › no deja ningún valor fijo del catálogo como literal entero en las pantallas`.

El it de la lista **no declarado por la spec es el 5**: `checkUses(ALL_USES)` también lee el fichero nuevo porque ALL_USES incluye los bloques ampliados. La spec solo lista los cuatro bloques y SCREEN_FILES. Este sexto fallo activa la orden «un it no listado = PARA y avisa; no ajustes la aserción». Se notificó inmediatamente al usuario; no se alteró ninguna aserción para forzar cinco ni se inició el verde R2.

Evidencia fuera del árbol:

- `/tmp/pet-tracker-186-R2-red-rules.log`.
- `/tmp/pet-tracker-186-R2-red-ui-language.log`.
- R1: `/tmp/pet-tracker-186-R1-red.log`, `/tmp/pet-tracker-186-R1-green-language.log`, `/tmp/pet-tracker-186-R1-green-ui-language.log`, `/tmp/pet-tracker-186-S1.1.log`, `/tmp/pet-tracker-186-S1.2.log`.

R2 no tiene commit rojo ni verde: el resultado no corresponde al rojo autorizado. No se ejecutó el gate de typecheck/lint para un commit R2, porque la parada ocurre antes de ese commit. Sus tres ficheros de tests quedan **sin commit** para inspección: `ui-copy-table.ts`, `ui-language.test.ts` y `form-rules.test.ts` (nuevo). Se retira solo del índice el fichero nuevo al cerrar; se conserva su contenido.

## Estado de cierre y límites

- R1 completo: rojo, verde y ambas sondas. Incremento medido: +1 it.
- R2 bloqueado: suite nueva no arranca y ui-language tiene un fallo adicional no declarado. No hay total ejecutado de nuevos it de R2 ni NV nuevos acreditados para R2.
- R3–R9 no iniciados: incremento +0 en cada uno; sin commits, NV ni sondas ejecutadas. S2.1–S2.5, S3.1–S3.5, S4.1–S4.5, S5.1–S5.3, S6.1–S6.4, S7.1–S7.6, S8.1–S8.3 y S9.1–S9.4 no se ejecutaron por la parada en R2.
- R8 y sus NV no se acreditan: no se migró ninguna pantalla. Los tests de cuenta siguen intactos respecto a H0 (diff vacío), igual que `form-error.tsx` y `account-rules.ts`.
- R10 y las casillas humanas no se tocaron. La feature no se declara done.
- No se ejecutó una suite global final sobre el árbol detenido en rojo. T0 = 3994; el único incremento terminado es R1 +1 (3995 sería el total esperado del árbol R1, **no una medición final**). El total final solicitado de R1–R9 queda sin acreditar por la parada.
- Las líneas de `Tests:` de R1 se midieron para los árboles que se commitearon; las sondas se corrieron después del commit verde. No se atribuye a R2 un commit inexistente.
- H0 y ambos hashes TDD de R1 se comprobaron con `git cat-file -e <hash>^{commit}` (exit 0).
- Desviación de lectura: se intentó leer `jest.config.js`, que no existe; la configuración está en `package.json` y se leyó después. Fue una lectura auxiliar; no se contó como rojo ni se alteró configuración.
- Por la orden de parar se conservan los tests R2 sin commit: el worktree no queda limpio. No se mezclan con el commit final de reporte/trazabilidad.
- No se ejecutaron `init.sh`, backend, AWS, deploy, push, PR, rebase ni cambios a los ficheros de estado reservados al leader.

Para reanudar hace falta que el leader revise la declaración del rojo de R2 y el handoff para incluir explícitamente el it global de ALL_USES (seis rojos observados), o indique cómo resolver esa discrepancia. No se propone debilitar el candado.

## Reanudación R2 — spec corregida a seis rojos

Comprobación inicial: worktree `/home/claude/sites/Pet-Tracker-wt-186`, rama `feature/186-mobile-forms-validation-global`, HEAD `26c58911` — `docs(#186): R2 declara seis rojos en ui-language, no cinco`. Coincide con lo exigido. El usuario autoriza reanudar después de corregir R2 y el handoff: cuatro bloques, SCREEN_FILES y checkUses(ALL_USES). No se repiten T0 ni R1 y se conserva el historial anterior de este reporte. Skills aplicadas: building-native-ui y ponytail, ya leídas en la sesión anterior.

R2 re-medido: form-rules `Tests:       0 total`, Cannot find module declarado; ui-language `Tests:       6 failed, 24 passed, 30 total` (30 + 0). Coinciden los seis it ya enumerados arriba. Sin cambio de aserciones. Typecheck exit 0; lint exit 0, log vacío.

S2.1: `Tests:       1 failed, 88 passed, 89 total`; rojo previsto: #186 R2: reglas puras de los cuatro formularios › #186 R2: peso «999.99».
Revertida con `git checkout HEAD -- src/utils/form-rules.ts`; diff HEAD y cached exit 0.

S2.2: `Tests:       4 failed, 85 passed, 89 total`; rojo previsto: #186 R2: reglas puras de los cuatro formularios › #186 R2: fecha de documento «2026-02-30»; #186 R2: reglas puras de los cuatro formularios › #186 R2: fecha de documento «2026-02-29»; #186 R2: reglas puras de los cuatro formularios › #186 R2: fecha del peso «2026-02-30»; #186 R2: reglas puras de los cuatro formularios › #186 R2: fecha del peso «2026-02-29».
Revertida con `git checkout HEAD -- src/utils/form-rules.ts`; diff HEAD y cached exit 0.

S2.3: `Tests:       1 failed, 88 passed, 89 total`; rojo previsto: #186 R2: reglas puras de los cuatro formularios › #186 R2: recordatorio fecha igual a ahora.
Revertida con `git checkout HEAD -- src/utils/form-rules.ts`; diff HEAD y cached exit 0.

### R2 verde y commits de la reanudación

- Rojo: `b8c0a517` — `test(mobile): reglas de formulario y filas de copy (#186 R2)`.
- Verde: `9c2c676f61c29e52fcc351a47a890ab2f0581ef6` — `feat(mobile): form-rules.ts (#186 R2)`.
- form-rules: `Tests:       89 passed, 89 total` = 0 + 89 it nuevos (suite antes bloqueada por import ausente).
- ui-language: `Tests:       30 passed, 30 total` = 30 + 0.
- Typecheck exit 0; lint exit 0 con log vacío antes de cada commit. `account-rules.ts` sin cambios contra H0.
- Los deltas de copy se conservan: Health 39 + 4 = 43; Profile 68 + 1 = 69; Reminders 56 + 3 = 59; Add-pet 45 + 3 = 48; SCREEN_FILES 34 + 1 = 35.

S2.4: `Tests:       1 failed, 88 passed, 89 total`; rojo previsto: #186 R2: reglas puras de los cuatro formularios › #186 R2: mascota meses inactivos.
Revertida con `git checkout HEAD -- src/utils/form-rules.ts`; diff HEAD y cached exit 0.

S2.5: `Tests:       1 failed, 88 passed, 89 total`; rojo previsto: #186 R2: reglas puras de los cuatro formularios › #186 R2: fecha de documento « 2026-10-09 ».
Revertida con `git checkout HEAD -- src/utils/form-rules.ts`; diff HEAD y cached exit 0.

## R3 — preparación y segunda parada obligatoria

Se escribió `mobile-pet-tracker/src/components/__tests__/field-error-message.test.tsx` con los ocho candados de R3: ausencia con null/undefined, traducción española, parámetros, inglés, render dentro/fuera de TextField, rerender de presencia y de clave, e higiene de fuente. Es un fichero nuevo, con base H0 = 0. Se añadió con git add antes de las comprobaciones.

Rojo medido con una sola suite: `Tests:       0 total`; `Cannot find module '../field-error-message' from 'src/components/__tests__/field-error-message.test.tsx'`, tal como declara R3. Log: `/tmp/pet-tracker-186-R3-red.log`. No hay implementación ni commit rojo R3. Los selectores de los candados de contexto y cambio de clave se concretaron por texto antes del commit; las aserciones de R2 no cambiaron. Typecheck y lint finales de este test pasaron: exit 0 y log de lint vacío (`/tmp/pet-tracker-186-R3-red-final-lint.log`).

**Parada por error de invocación del agente.** En una lectura auxiliar se ejecutó desde `mobile-pet-tracker/`:

```bash
sed -n '485,545p' specs/../src/__tests__/ui-language.test.ts
```

Resultado: exit 2, `sed: can't read specs/../src/__tests__/ui-language.test.ts: No such file or directory`. El segmento `specs/` no existe dentro de móvil. Es un error de lectura, no un rojo de Jest; no se contabiliza como prueba ni se reintenta con otra ruta. Se aplica literalmente la instrucción de reanudación «un error de invocación = PARA y avisa». Se avisó inmediatamente al usuario y se detuvo la implementación. Se dejó terminar el gate de lint ya iniciado, sin lanzar nuevos tests ni modificar aserciones después de la parada.

El fichero de test R3 se conserva sin commit, retirando solo su entrada del índice. No se creó `src/components/field-error-message.tsx`. No se hicieron S3.1–S3.5: requieren el verde R3. No se empezaron R4–R9.

## Estado actual tras la reanudación

Esta sección actualiza el estado; las secciones anteriores se conservan como historial de la primera parada.

- R1 completo en la sesión anterior; no se repitieron T0 ni R1.
- R2 completo: rojo `b8c0a517298300fc385bb787513ac71a82878dbc`, verde `9c2c676f61c29e52fcc351a47a890ab2f0581ef6`; hashes comprobados con `git cat-file -e` (exit 0).
- Nuevos it R2: **89** = base 0 + 89. ui-language conserva 30 + 0. La suite nueva estaba bloqueada por el import declarado; no se atribuyen NV de ejecución a sus casos individuales. Las cinco sondas dieron los rojos previstos y fueron revertidas con diff HEAD/cached exit 0.
- S2.2 detectó cuatro filas: fechas 2026-02-30 y 2026-02-29, en documento y en peso; ambas fechas están en las tablas declaradas.
- R3 sin commit y sin verde. R4–R9 sin iniciar. Incremento ejecutado acreditado R3–R9 = 0; no se declaran NV de esos requisitos.
- Incremento terminado acumulado: R1 +1, R2 +89. T0 3994 + 1 + 89 = **4084 esperado para los commits R1–R2**, no una medición global final. No se ejecutó suite global final por la segunda parada; los tests R3 sin commit dejan ese árbol en rojo por módulo ausente.
- Único fichero de código/test sin commit al cerrar: `mobile-pet-tracker/src/components/__tests__/field-error-message.test.tsx`. Se conserva para revisión, por lo que el worktree no queda limpio.
- No se ejecutaron init.sh, backend, AWS, push ni PR. No se tocaron feature_list.json, R10 ni casillas humanas. No se rebasó ni reescribió ningún commit.
