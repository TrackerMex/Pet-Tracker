# Implementación — #193 mobile-focus-refetch-guard-no-pet

Implementación y evidencia TDD completadas en los commits A–D. CC1, CC2 y CC3 verificados. La guarda de foco usa la selección vigente mediante una ref; conserva el refresco general, la limpieza y la identidad de la callback. La feature conserva su estado `in_progress` para la revisión del leader y el smoke humano.

## Base, alcance y habilidades

- Fecha: 2026-10-19.
- `pwd`: `/home/claude/sites/Pet-Tracker-wt-193`; rama: `feature/193-mobile-focus-refetch-guard-no-pet`.
- H0 (commit del handoff, padre de A): `29a8482dbde7acb94dac383e7b4bc5b9d1082582`.
- HEAD observado al primer acceso: `00925f6ab2ba5b0ed5dfbda5c105596c234fab01`. El leader terminó los commits de estado `84cf13d3` y handoff `29a8482d` antes de A. Solo cambió bookkeeping; la base de código medida es idéntica a H0. Todas las anclas iniciales coincidieron. No se repitió T0 al reanudar.
- T0: `Tests:       3994 passed, 3994 total`; 120 suites verdes, una sola corrida completa en la base.
- Skills cargadas: `ponytail` y `native-data-fetching` (`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/native-data-fetching/SKILL.md`). Leída la documentación de Expo SDK 57 exigida por `mobile-pet-tracker/AGENTS.md`.
- Alcance final: tres pantallas, sus tests, design-drift, trazabilidad y este reporte. Sin cambios finales de JSX, copy, testIDs, estilos, dependencias o capa de datos. Autocrítica visual no aplicable; confirmación a cargo del reviewer.
- Logs completos y JSON de Jest fuera del árbol: `/tmp/pet-tracker-193.nUdhNb/`.

## Commits

| Fase | Hash | Mensaje |
|---|---|---|
| A | `b762291010526c541cfea691c43da7141e79f672` | `test(mobile): tests de foco sin mascota (R1,R2,R3,R4,R5,R6,R7,R8,R9,R10,R11)` |
| B | `8ebb6a1340f2c6830933030df32b76806ab6c8aa` | `feat(mobile): guarda de refetch sin mascota en Inicio, Perfil y Recordatorios (R1,R4,R7)` |
| C | `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210` | `test(mobile): mutaciones de control para R2,R3,R5,R6,R8,R9,R10,R11 (rojo por aserción)` |
| D | `c1094e6ac4eb17190e6354e500a70e4fcc298aec` | `test(mobile): revierte mutaciones de control (R2,R3,R5,R6,R8,R9,R10,R11)` |

A añade solo tests. B incluye los seis ajustes de aserciones de #181 R1 (S2/S4 en Inicio, Perfil y Recordatorios), ya presentes al reanudar y declarados en el cuerpo de su commit. Durante la continuación no se modificó ningún test, mock ni timeout: las huellas SHA-256 de los cuatro ficheros coinciden con las capturadas al reanudar.

## Resultados por fichero y estado de commit

Cada fichero se ejecutó por separado. Los gates se midieron en el árbol exacto antes de crear su commit. Los totales H0 se midieron antes de modificar cada fichero.

| Fichero | H0 | A | B | C (filtro de control) | D |
|---|---|---|---|---|---|
| home | `Tests:       227 passed, 227 total` | `Tests:       1 failed, 230 passed, 231 total` | `Tests:       231 passed, 231 total` | `Tests:       3 failed, 228 skipped, 231 total` | `Tests:       231 passed, 231 total` |
| profile | `Tests:       138 passed, 138 total` | `Tests:       1 failed, 141 passed, 142 total` | `Tests:       142 passed, 142 total` | `Tests:       3 failed, 139 skipped, 142 total` | `Tests:       142 passed, 142 total` |
| reminders | `Tests:       64 passed, 64 total` | `Tests:       1 failed, 68 passed, 69 total` | `Tests:       69 passed, 69 total` | `Tests:       4 failed, 65 skipped, 69 total` | `Tests:       69 passed, 69 total` |
| design | `Tests:       113 passed, 113 total` | `Tests:       114 passed, 114 total` | `Tests:       114 passed, 114 total` | `Tests:       1 failed, 113 skipped, 114 total` | `Tests:       114 passed, 114 total` |
| map (regresión, sin cambios) | — | — | — | — | `Tests:       271 passed, 271 total` |

- Rojo legítimo A: R1 y R4 esperan `[]` y reciben una llamada a `getPet(apiUrl, jwt-token, null)`; R7 recibe esa llamada nula a `listReminders`. Solo fallan esos tres tests.
- NV (nacen verdes): R2, R3, R5, R6, R8, R9 (dos casos), R10 (tres pantallas) y R11.
- En C se ejecuta por fichero `-t '#193 R(2|3|5|6|8|9|10|11):'`; los once tests de control fallan por aserción. Las suites completas quedan verdes en B y D.

## Mutaciones de control: aisladas y juntas

Cada mutación aislada parte de B. Se comprueba el índice limpio, se mide su R y se restaura con `git checkout HEAD -- <rutas>`; después se comprueban `git diff --cached --quiet -- <rutas>` y `git diff --quiet -- <rutas>`. Tras las ocho restauraciones se aplican todas juntas en C. Los once mensajes de fallo aislados y conjuntos coinciden exactamente antes del stack: mismo matcher y mismos valores esperado/recibido (`C-matching-assertions-ok`).

| Mutación | Test que falla | Aserción aislada | Aserción con todas juntas en C |
|---|---|---|---|
| M-R2 | home, R2 | `toEqual([[apiUrl, jwt-token, pet-1]])`: recibido `[]` de getPet | Idéntica; ver `C-*.json` |
| M-R3 | home, R3 | `toEqual([[apiUrl, jwt-token]])`: recibido `[]` de listPets | Idéntica; ver `C-*.json` |
| M-R5 | profile, R5 | `toEqual([[apiUrl, jwt-token, pet-1]])`: recibido `[]` de getPet | Idéntica; ver `C-*.json` |
| M-R6 | profile, R6 | `toEqual([[apiUrl, jwt-token]])`: recibido `[]` de listPets | Idéntica; ver `C-*.json` |
| M-R8 | reminders, R8 | `toEqual([[apiUrl, jwt-token, pet-1]])`: recibido `[]` de listReminders | Idéntica; ver `C-*.json` |
| M-R9 | reminders, R9: confirmación y error | `toBeNull()`: persiste el nodo de confirmación en un caso y el nodo de error en el otro (dos fallos) | Idéntica; ver `C-*.json` |
| M-R10 | home, profile y reminders, R10 | `Object.is(callbackAntes, callbackDespués)` → `toBe(true)`: recibido `false` en las tres pantallas | Idéntica; ver `C-*.json` |
| M-R11 | design-drift, R11 | `toEqual([])`: recibido `["screens/home/index.tsx"]` | Idéntica; ver `C-*.json` |

Evidencia íntegra por mutación: `isolated-R2-home`, `isolated-R3-home`, `isolated-R5-profile`, `isolated-R6-profile`, `isolated-R8-reminders`, `isolated-R9-reminders`, `isolated-R10-home`, `isolated-R10-profile`, `isolated-R10-reminders`, `isolated-R11-design` (cada nombre tiene `.log` y `.json`). Evidencia conjunta: `C-home`, `C-profile`, `C-reminders`, `C-design`.

Adaptación sintáctica temporal para los gates de C: M-R2/M-R5/M-R8 reemplazan la invocación por `void refetchDetail`/`void refetchReminders`, conservando la referencia de la dependencia sin ejecutar el refetch. M-R10 añade `void selectedPetId` junto a su dependencia deliberada. Evita avisos de dependencias innecesarias; esas lecturas sin efectos y las ocho mutaciones se revierten exactamente en D. No se modifican aserciones ni dobles.

## Gates y criterios de cierre

- A, B, C y D: `bun run typecheck` salida 0; `bunx expo lint --no-cache` salida 0 y log vacío en los gates aceptados. `.expo/types/router.d.ts` ausente antes de cada commit de código. Sin mediciones de veredicto mediante pipes.
- `graphify update .` ejecutado tras los estados de código A, B, C y D, salida 0. Avisos de parser SQL opcional ausente y de etiquetas de comunidades desactualizadas; no se añaden dependencias ni se commitea `graphify-out/`.
- CC1: 827 tests verdes, cero fallos y cero omitidos, en cinco suites completas en D, una por corrida (Inicio, Perfil, Recordatorios, Mapa y design-drift); typecheck salida 0 y lint con salida 0/log vacío. Logs `D-*.log` y JSON de cada suite.
- CC2: `git diff A B -- mobile-pet-tracker/src/screens` revisado; producción solo cambia imports, ref, efecto y guardas. Sin cambios de JSX o dependencias de foco. Se conserva `handleDelete` completo. Evidencia: `CC2-A-vs-B.diff`.
- Reversión exacta: `git diff B D -- mobile-pet-tracker/src/screens` vacío, incluyendo tests. Evidencia `D-vs-B.diff` (0 bytes) y comparación de huellas SHA-256 de tests.
- CC3: R1–R11 enlazados a sus describes reales y a los hashes A–D en `specs/mobile-focus-refetch-guard-no-pet/traceability.md`. Todos los hashes comprobados con `git cat-file -e`; cadena A → B → C → D verificada. Sin filas pendientes.
- CC4: pendiente del humano en su dev build Android. Las pruebas capturan callbacks; el disparo por navegación real se valida en ese smoke. El intervalo entre cambio de selección y sincronización del efecto conserva el riesgo aceptado en el diseño.

## Paradas, validación y restricciones de la continuación

La primera ejecución se detuvo correctamente por `#173 R9: última señal relativa formatea 2026-10-13T11:59:00.000Z en español como hace 1 min`: `Unable to find an element with testID: pet-info-card`, línea 1043. El fichero tardó 298.256 s y ese it 167.686 s. El primer lint de B también recibió SIGKILL; su log no vacío fue rechazado. Se conservan `B-profile.log`, `B-profile.json` y `B-lint.log`.

El leader repitió Perfil cuatro veces en el mismo árbol (142 verdes en cada una) y autorizó continuar en `progress/leader_validacion_mobile-focus-refetch-guard-no-pet.md`. La causa exacta del primer rojo no está demostrada; la contención de CPU es hipótesis. Se cumplieron las tres repeticiones adicionales solicitadas, sin cambios de código:

| Corrida de Perfil al reanudar | Carga previa | Tests | Time |
|---|---|---|---|
| 1 | `0.93 2.45 3.48 2/1286 1666403` | `Tests:       142 passed, 142 total` | `Time:        16.271 s, estimated 26 s` |
| 2 | `1.16 2.43 3.46 1/1294 1666654` | `Tests:       142 passed, 142 total` | `Time:        15.99 s, estimated 17 s` |
| 3 | `1.12 2.36 3.42 2/1277 1666881` | `Tests:       142 passed, 142 total` | `Time:        15.943 s, estimated 16 s` |

Perfil también quedó verde en D. Lint se ejecutó separado de Jest y graphify, comprobando que no hubiera procesos init/Jest ajenos al lanzarlo:

| Gate de lint | Carga previa | Resultado |
|---|---|---|
| B | `1.18 2.28 3.36 6/1288 1667362` | salida 0; log vacío; pgrep sin coincidencias |
| C | `1.48 1.84 2.79 1/1275 1672923` | salida 0; log vacío; pgrep sin coincidencias |
| D | `1.55 1.71 2.50 1/1272 1676264` | salida 0; log vacío; pgrep sin coincidencias |

Incidencia de instrumentación M-R8: una búsqueda de línea encontró dos llamadas a refetchReminders (foco y handleDelete) y detuvo el script antes de escribir. Se acotó al bloque de la guarda de foco y se repitió toda la serie. No fue un fallo de Jest; handleDelete permaneció intacto.

Se sigue la cadena de cuatro commits del handoff, excepción declarada por el leader al patrón genérico de un commit por requisito. La documentación se cierra en un quinto commit separado.

No se ejecutó `./init.sh`: lo corre el leader. No se creó `.done`, por instrucción expresa de esta continuación. No se abrió ni editó PR, no se cambió el status y no se tocaron los archivos de estado del leader. `progress/leader_validacion_mobile-focus-refetch-guard-no-pet.md` queda fuera de los commits. No se hallaron otras peticiones nulas fuera del alcance durante estas verificaciones.
