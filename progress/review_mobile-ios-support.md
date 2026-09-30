# review: mobile-ios-support
Fecha: 2026-09-30T15:36:33Z
Veredicto: APROBADO

HEAD revisado: `3c337645f0d9de303784d7844525293fcdc152a9` (branch
`feature/60-mobile-ios-support`, 18 commits de Codex CLI sobre el HEAD del
handoff `00246f6b`). Firma de la spec: `f22cc1c4`, ancestro de `00246f6b`
(exit 0).

Reparto de la verificación:
- Jest, tsc, eslint, sondas e introspección corrieron en un worktree
  desechable en `3c337645`, después del `exit` de init.sh. El worktree
  enlazaba a `node_modules` y ya se ha eliminado.
- init.sh lo corrió el leader, porque el clasificador se lo deniega al
  reviewer. Aquí se lee su log crudo y se contrasta el HEAD.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: únicamente #60)
- [x] progress/current.md actualizado (entradas del 2026-09-30: fin de Codex y resultado de init.sh; cambio del leader aún sin commitear)
- [x] `feature_list.json`, `STATUS.md`, `progress/current.md` y `progress/history.md` intactos entre `00246f6b` y `3c337645` (Codex no tocó ficheros de lifecycle)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (no aplica: la feature no toca backend)
- [x] repositories/contratos en domain son interfaces puras (no aplica)
- [x] application depende de interfaces, no implementaciones (no aplica)
- [x] infrastructure sin lógica de negocio (no aplica)
- [x] Estructura móvil respetada. La rama de plataforma vive en el wrapper `src/components/pet-map.tsx`, y las pantallas `add-pet` y `profile` solo añaden una opción del picker. `app.json` y `app.config.ts` solo tocan la configuración nativa. `hosting/.well-known/` tiene dos artefactos estáticos. Ningún fichero fuera de la lista cerrada.

## Checklist C4 — TDD
- [x] Cada R<n> con test (R1–R9) tiene al menos un test que lo nombra (`#60 R<n>` en describe e it; `grep -c '#60'` == `grep -c '#60 R[1-9]'` en los seis ficheros: 5, 2, 1, 1, 10, 7)
- [x] Historial de commits muestra test-primero. Hay 9 rojos seguidos de sus verdes; R1 y R2 comparten un verde común, como prescribe la spec. Los mensajes son idénticos a tasks.md (diff exit 0). Cada rojo toca solo sus tests y cada verde solo sus ficheros citados.

Rojos y verdes re-medidos por mí, cada commit con `--runTestsByPath` y sin pipe. Todos los rojos fallan por aserción, con la primera línea de error que exige tasks.md para cada `it`:

| Commit | Estado | Tests | exit | Primera línea |
|---|---|---|---|---|
| 97ed1c54 R1 | rojo | 4 failed, 9 passed, 13 | 1 | `toHaveBeenCalledTimes` ×3, `toEqual` ×1 |
| 88b0b72c R2 | rojo | 1 failed, 58 passed, 59 | 1 | `toEqual` |
| 05061730 R1+R2 | verde | 72 passed, 72 | 0 | |
| 572ef3c3 R3 | rojo | 2 failed, 62 passed, 64 | 1 | `toHaveBeenCalledWith` ×2 |
| 98ec9c49 R3 | verde | 64 passed, 64 | 0 | |
| 0742e5fb R4 | rojo | 1 failed, 13 passed, 14 | 1 | `toEqual` |
| 0f45bab5 R4 | verde | 14 passed, 14 | 0 | |
| db2da5b3 R5 | rojo | 2 failed, 14 passed, 16 | 1 | `toContainEqual` ×2 |
| 53446ec3 R5 | verde | 16 passed, 16 | 0 | |
| a2d6463f R6 | rojo | 2 failed, 16 passed, 18 | 1 | `toEqual` ×2 |
| 53867e41 R6 | verde | 18 passed, 18 | 0 | |
| 3796b5d5 R7 | rojo | 3 failed, 18 passed, 21 | 1 | `toEqual` ×3 |
| 150ec51d R7 | verde | 21 passed, 21 | 0 | |
| 7569bca8 R8 | rojo | 2 failed, 7 passed, 9 | 1 | `toBe` ×2 |
| 51dd3e6e R8 | verde | 9 passed, 9 | 0 | |
| 0aeefa72 R9 | rojo | 3 failed, 9 passed, 12 | 1 | `toContain` ×3 |
| 7139fbfd R9 | verde | 12 passed, 12 | 0 | |

En cada rojo solo fallan los `it` de su R-id. Ningún log trae `TypeError`, `ReferenceError`, `Cannot find module` ni `SyntaxError`.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en R1–R10. R11, R12 y R13 dicen «pendiente (casilla del humano)»: son gates humanos, permitido.
- [x] Los 17 hashes completos de traceability.md existen, son ancestros de `3c337645` y descendientes de `00246f6b` (`merge-base --is-ancestor`, todos exit 0). El asunto de cada hash corresponde a su R-id y a su papel de rojo o verde.
- [x] Commits siguen el formato `<tipo>(<scope>): <desc> (R-ids)`, literal al guion de tasks.md.

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y `[x] Aprobado por humano (fecha: 2026-09-30)`, firmado en `f22cc1c4`

## Checklist C7 — Sin código huérfano
- [x] Componentes/módulos reemplazados por esta feature fueron eliminados. #60 no reemplaza ningún módulo. Sustituye cuatro cosas en su sitio:
  - la aserción de #79 R2 `expect(expo.plugins).toContain('expo-secure-store');`, única línea borrada en los tests (candado de 1 a 0);
  - el plugin en cadena de `expo-secure-store`, que pasa a tupla;
  - el texto del `console.warn`, que sigue siendo uno solo (candado de 1 a 1);
  - la fila de `hosting/` en AGENTS.md y la de `RESET_LINK_HOST` en conventions.md.

  No queda rastro de lo sustituido.
- [x] Sus tests también fueron eliminados (el único test afectado es la línea enmendada de #79 R2)
- [ ] N/A — esta feature no reemplaza nada existente

## Checklist C8 — UI móvil (carta)
- [x] Grep-clean. En las líneas añadidas de producción (`src/`, `app.json`, `app.config.ts`) hay 0 hex, 0 `-[`, 0 `StyleSheet`, 0 `shadow`/`elevation` y 0 `className`. En los seis ficheros de test, `-\[` y `stylesheet` dan 0 y 0.
- [x] Dimensiones y safe areas: sin cambios de layout (PetMap conserva su contenedor; la rama de Apple usa el mismo `testID` y estilo)
- [x] Estados de carga: sin cambios
- [x] Componentes compartidos: se reutiliza `PetMap`; no hay fork del mapa por pantalla
- [x] Tappables: ninguno nuevo
- [x] Animaciones: ninguna nueva
- [x] Skills: el reporte de Codex registra `building-native-ui`, `expo-dev-client` y `expo-deployment` (plugin expo v1.0.2) y `appllama-app-design-skill`, que son los nombres de Codex nombrados en el handoff. También cita la documentación de SDK 57. El reviewer cargó `expo:expo-overview`.

## Verificación independiente de R10 (worktree desechable en 3c337645)
- Punto 1. Los seis ficheros de test: `Test Suites: 6 passed, 6 total`, `Tests: 169 passed, 169 total`, exit=0. Por fichero dan 13, 59, 25, 39, 21 y 12, que son los mismos verdes de la tabla C4.
- Punto 2. Guardas (design-drift, consistency-classnames, hero-header-amendments): `3 passed`, `111 passed, 111 total`, exit=0. Igual que la base.
- Punto 3. Suite entera: la tomo del init.sh del leader. `86 passed`, `1640 passed, 1640 total`, que es la base 1619 más 21, con 0 suites nuevas.
- Punto 4. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`: exit=0, log vacío.
- Punto 5. eslint de los diez ficheros .ts/.tsx: exit=0, log vacío.
- Punto 6. `expo config --type introspect` corrió en el worktree desechable, sin `.env` ni `google-services.json`. Salió con exit=0. El JSON y el `.err` se borraron en el acto (rm exit 0, sin restos) sin abrirlos. `test ! -e .expo/types/router.d.ts` dio exit=0. La única línea extraída coincide byte a byte con la esperada:
  `{"usage":["NSLocalNetworkUsageDescription","NSPhotoLibraryUsageDescription"],"photos":"Se usa para elegir de tu galería la foto de perfil de tu mascota.","encryption":false,"domains":["applinks:reset.example.test"],"aps":"development","android":[]}`
- Punto 7. Todas las cifras de candado dan el valor Final de la tabla. Las dos que barren `src/` entero cumplen su delta: `Platform.OS` pasa de 3 a 4 (+1) y `launchImageLibraryAsync(` de 2 a 2 (+0). Los encabezados `### Feature` de verification.md pasan de 17 a 18.
- Punto 8. La lista cerrada de ficheros contra `00246f6b` hasta `7139fbfd` tiene exactamente 18 ficheros, con 706 inserciones y 16 borrados. Todos los blobs cumplen: los de base en `00246f6b` (19), los intermedios de cada commit y los finales (18). El commit de evidencia `3c337645` solo añade `progress/impl_mobile-ios-support.md` y `traceability.md`.
- Punto 9. Los ficheros que no se debían tocar no cambian (exit 0).

## Sondas (18, una a una sobre 3c337645)
Cada mutación se verificó con `git hash-object` antes de medir. Después se restauró con `git checkout HEAD -- <ruta>`. Tras cada sonda, `git status --porcelain` (salvo el symlink `node_modules`) y `git diff --cached --name-only` salieron vacíos. Todas fallan por aserción, con los `it` y la primera línea que exige tasks.md §Sondas.

| Sonda | Blob | Exigido | Medido |
|---|---|---|---|
| `always_apple` | `a8aff9aa` | 3 rojos de 13 | 3 failed, 10 passed, 13; exit=1; aserción |
| `no_pitch` | `527bba9d` | 2 rojos de 72 | 2 failed, 70 passed, 72; exit=1; aserción |
| `apple_dark` | `671b6512` | 1 rojo de 72 | 1 failed, 71 passed, 72; exit=1; `toBe` |
| `current_addpet` | `970d957f` | 1 rojo de 25 | 1 failed, 24 passed, 25; exit=1; `toHaveBeenCalledWith` |
| `current_profile` | `b5dad4ba` | 1 rojo de 39 | 1 failed, 38 passed, 39; exit=1; `toHaveBeenCalledWith` |
| `target16` | `2cf6ef07` | 6 rojos de 21 | 6 failed, 15 passed, 21; exit=1; `toEqual` |
| `encryption_true` | `bd0a6db4` | 6 rojos de 21 | 6 failed, 15 passed, 21; exit=1; `toEqual` |
| `secure_string` | `8d4ecc4f` | 1 rojo de 21 | 1 failed, 20 passed, 21; exit=1; `toContainEqual` |
| `camera_on` | `2731b4f8` | 1 rojo de 21 | 1 failed, 20 passed, 21; exit=1; `toContainEqual` |
| `no_trim` | `6edffe48` | 2 rojos de 21 | 2 failed, 19 passed, 21; exit=1; `toEqual` |
| `ios_needs_maps` | `2dbc63cd` | 1 rojo de 21 | 1 failed, 20 passed, 21; exit=1; `toEqual` |
| `old_warning` | `a49ccd9e` | 3 rojos de 21 | 3 failed, 18 passed, 21; exit=1; `toEqual` |
| `wrong_bundle` | `d5b021a9` | 1 rojo de 12 | 1 failed, 11 passed, 12; exit=1; `toMatch` |
| `wide_path` | `4d2af87e` | 1 rojo de 12 | 1 failed, 11 passed, 12; exit=1; `toEqual` |
| `htaccess_all` | `ad331d96` | 1 rojo de 12 | 1 failed, 11 passed, 12; exit=1; `toEqual` |
| `secret_doc` | `50687b1a` | 1 rojo de 12 | 1 failed, 11 passed, 12; exit=1; `not.toMatch` |
| `agents_row` | `a15920b3` | 1 rojo de 12 | 1 failed, 11 passed, 12; exit=1; `toContain` |
| `conv_row` | `78ed538c` | 1 rojo de 12 | 1 failed, 11 passed, 12; exit=1; `toContain` |

No apareció el flake de add-pet (#72 R2) en ninguna corrida.

## Observaciones
Ninguna que bloquee.

1. **Gates humanos pendientes.** R11 (AASA publicado en Hostinger con el Team ID real), R12 (prueba de humo en el dev build de iOS en iPhone) y R13 (regresión de Android en el dev build de Android) quedan pendientes del humano. Sus casillas en requirements.md y sus filas en traceability.md siguen sin marcar, como corresponde. El reviewer no las marca. #60 no puede pasar a `done` hasta que el humano las cierre.
2. El AASA versionado lleva el marcador `REPLACE_WITH_APPLE_TEAM_ID`, tal como exige la spec. Sustituirlo por el Team ID real forma parte del gate R11, no de este código.
3. El log de init.sh trae en la suite móvil el aviso `A worker process has failed to exit gracefully`. Sale con exit 0 y 86/1640 en verde; es ajeno a #60 (ningún test de #60 abre timers ni handles).
4. El reporte de Codex no contiene secretos. La introspección de base se registró solo con la línea extraída.

## Output de ./init.sh
Lo corrió el leader sobre `3c337645`, de 2026-09-30T15:26:58Z a 15:31:33Z. `head` = `3c337645f0d9de303784d7844525293fcdc152a9` = `git rev-parse HEAD`, y `exit` = `EXIT=0`. Líneas decisivas del log crudo:

```
# backend (jest)
Test Suites: 171 passed, 171 total
Tests:       1307 passed, 1307 total
# infra (jest --runInBand)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# mobile (jest, suite entera)
Test Suites: 86 passed, 86 total
Tests:       1640 passed, 1640 total
# backend e2e
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados
# lint + typecheck
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
HEAD=3c337645f0d9de303784d7844525293fcdc152a9
exit=0
2026-09-30T15:31:33Z
```
