# review: media-docs-confirm-size-limit
Fecha: 2026-10-09T05:22:21Z
Veredicto: APROBADO

Feature #161 (P3, solo backend). Worktree `/home/claude/sites/Pet-Tracker-wt-161`,
branch `feature/161-media-docs-confirm-size-limit`, HEAD `2e8319df` (comprobado al
empezar y al terminar). Diff revisado: `6ccdb744..57609fdc`. El merge `2e8319df`
(origin/main `306f3c9f`, #18) no toca `backend-pet-tracker/src/modules/media` ni
`backend-pet-tracker/test/media*`: `git diff 57609fdc 2e8319df --stat` sobre esas
rutas lista solo `meal-times`, `nutrition-ai-explainer` y `nutrition` (e2e de #18).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: únicamente #161)
- [x] progress/current.md actualizado (describe la sesión activa de #161)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (`pet-document.errors.ts` y `photo-storage.ts` no importan nada nuevo)
- [x] repositories/contratos en domain son interfaces puras (`PhotoStorage` sigue siendo `interface`; solo cambia la firma a `getObjectSize(key: string): Promise<number | null>;`)
- [x] application depende de interfaces, no implementaciones (el use case inyecta `PHOTO_STORAGE` y usa el tipo `PhotoStorage`)
- [x] infrastructure sin lógica de negocio (el adapter no aplica límite: R1 (a) con `10485761` lo fija; el límite vive en el use case; el mapper solo traduce)

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (`#161 R1` ×3 its, `#161 R2` ×2 unit + 1 mapper + 2 e2e, `#161 R3` ×1 unit + 1 mapper; R4 es de verificación sin test propio, declarado en la spec)
- [x] Historial de commits muestra test-primero, no todo junto:
  - R1: `935e8d15` (solo 4 specs; rojo por `TypeError: storage.getObjectSize is not a function` / `this.storage.objectExists is not a function` y TS2339/TS2353: falta un símbolo de **producción**, no un helper de test) → `25788949` (solo producción).
  - R2: `d31b95d9` (solo tests; rojo por aserción en unit (b) y e2e (b) `expected 409, got 204`; mapper spec por símbolo de producción ausente) → `781e7fe7` (solo producción).
  - R3: `be474e38` (tests + mutaciones de producción M3a/M3b versionadas) → `fa81bf5a` (revierte M3a/M3b; `git diff 781e7fe7 fa81bf5a` en use case y mapper = vacío).
- [x] Requisitos de verificación (R2 (a), R2 (c), R3) declarados antes del handoff y cerrados por la vía elegida: R3 por mutación de producción versionada; R2 (a)/(c) por mutación con evidencia en §Sondas de mutación de este reporte.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente"; frontmatter intacto (el diff solo toca las 4 filas). Los 6 hashes existen, son ancestros de HEAD (`git merge-base --is-ancestor`) y coinciden con mensaje y R-id de `git log`.
- [x] Commits siguen el formato `test|feat(media): <desc> (#161 R<n>)` (convención de la propia spec)

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada (2026-10-08, firma `c2676ab6`); no hay commits sobre requirements.md después de la firma.

## Checklist C7 — Sin código huérfano
- [x] `objectExists` (reemplazado por `getObjectSize`) eliminado: `grep -rlF objectExists backend-pet-tracker` (sin node_modules/dist) → 0 ficheros
- [x] Sus tests no quedan huérfanos: el spec `photo-storage.object-exists.spec.ts` conserva el nombre por decisión de la spec (E1; la trazabilidad de #157 R7 apunta a él) y ahora prueba `getObjectSize`
- [ ] N/A — esta feature no reemplaza nada existente

## Verificaciones adicionales

### Greps de R4 (re-ejecutados desde la raíz)
`objectExists` 0 · `getObjectSize` 7 · firma del puerto 1 · `PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;` 1 · `PET_DOCUMENT_MAX_BYTES` en src+test 1 (ningún test importa la constante) · `PET_DOCUMENT_TOO_LARGE` 3 · `HeadObjectCommand` 3 · `DeleteObjectCommand` en src 0 · `git diff --name-only 6ccdb744...HEAD -- infra mobile-pet-tracker` vacío. Todos coinciden con lo declarado.

### Lista cerrada
Los 13 ficheros del impl («R4 — Lista cerrada tras c7») coinciden uno a uno con «Ficheros que TU cambias (13, ni uno mas)» del handoff y con design.md §Archivos afectados. `git diff --stat 6ccdb744 57609fdc` añade solo `progress/handoff_…` (commits L1/L2 del leader, excluidos por pathspec).

### PARADA de E2 en el impl (línea ~2027)
Codex escribió «PARADA: revisión de alcance de E2 no coincide.» con un verificador propio de tokens (no era eslabón del handoff) y siguió con un segundo verificador por AST. Lo comprobé de forma independiente: apliqué con `sed` sobre `git show 6ccdb744:<ruta>` exactamente las sustituciones literales de E1–E5, pasé el resultado por el `prettier` del proyecto y lo comparé con `57609fdc`. E3 y E4: diff vacío. E1, E2 y E5: la **única** diferencia son los `describe('#161 R…')` nuevos añadidos al final. Por tanto, las ediciones de tests existentes son solo las autorizadas más formato (los reflujos de prettier de L1 y el import multilínea de E5). La PARADA era un falso positivo de su herramienta.

### Casos sin tratar en R1–R3 (punto 3 del encargo)
- 404 → `null`: candado `#157 R7: resuelve null …` (sondas S1d y 404-rethrow rojas).
- Otros errores se relanzan por identidad: `#157 R7: relanza … 403` con `rejects.toBe(boom)` (sondas swallow y wrapped rojas).
- `ContentLength` 0 aceptado: `#161 R1 (a): resuelve 0` (sonda S1b falsy roja). En el use case, `0 > 10485760` es falso y se confirma.
- El `throw` de ContentLength ausente está dentro del `try`, pero el `catch` solo intercepta `$metadata.httpStatusCode === 404`, así que se relanza tal cual (R1 (b) lo fija con regex anclada).
- Comentario `// ponytail: sin s3:ListBucket, AWS devuelve 403 …` conservado (grep = 1).

### Sondas de mutación
Cada sonda se aplicó sola sobre HEAD, se ejecutó y se restauró con `git checkout HEAD -- <ruta>`; tras cada una, `git diff --quiet && git diff --cached --quiet` → limpio. Unit: `FORCE_COLOR=0 pnpm exec jest src/modules/media` (base 12 suites / 46 tests en verde). e2e: `pnpm exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts -t '#161 R2'`, con `pgrep` → `libre` en una llamada propia antes de cada uno. Todos los rojos son **por aserción** (ninguna salida contiene `Test suite failed to run`, `TypeError` ni `ReferenceError`). Los tests asertan literales (`10485760`, `10485761`, `0`, `18`), no la constante importada.

| Sonda | Mutación | Resultado | Test que la mata |
|---|---|---|---|
| S2a | `size > MAX` → `size >= MAX` | unit 1 rojo; e2e 1 rojo (`expected 204, got 409`) | `#161 R2 (a)` unit y e2e |
| K+1 | `10 * 1024 * 1024 + 1` | unit 1 rojo; e2e 1 rojo (`expected 409, got 204`) | `#161 R2 (b)` unit y e2e |
| K−1 | `10 * 1024 * 1024 - 1` | unit 1 rojo; e2e 1 rojo (`expected 204, got 409`) | `#161 R2 (a)` unit y e2e |
| S2b | `10 * 1000 * 1000` | unit 1 rojo | `#161 R2 (a)` |
| sin typeof | adapter `return ContentLength as number;` sin el check | unit 1 rojo (`resolved instead of rejected`) | `#161 R1 (b)` |
| ausente→0 | `throw …` → `return 0;` | unit 1 rojo | `#161 R1 (b)` |
| ausente→undefined | `throw …` → `return undefined as unknown as number;` | unit 1 rojo | `#161 R1 (b)` |
| S1a | `return ContentLength ?? 0;` | unit 1 rojo | `#161 R1 (b)` |
| S1b | `!ContentLength` | unit 1 rojo | `#161 R1 (a) … 0` |
| mensaje | mensaje del Error + ` header` | unit 1 rojo | `#161 R1 (b)` (regex anclada) |
| S1c | `return 1;` | unit 3 rojos | `#157 R7 … ContentLength`, `#161 R1 (a)` ×2 |
| S1d | 404 → `return 0;` | unit 1 rojo | `#157 R7: resuelve null …` |
| 404 relanza | 404 → `throw error;` | unit 1 rojo | `#157 R7: resuelve null …` |
| 404→403 | `=== 404` → `=== 403` | unit 2 rojos | `#157 R7` null y relanza |
| traga errores | `throw error;` → `return null;` | unit 2 rojos | `#157 R7 relanza …`, `#161 R1 (b)` |
| envuelve error | `throw new Error(String(error))` | unit 2 rojos | `#157 R7 relanza …`, `#161 R1 (b)` |
| S1e | `Key: key + '/'` / `Bucket: 'other'` | unit 1 rojo cada una | `#157 R7 … ContentLength` (aserción del `input`) |
| orden null/límite | límite antes del check `null` (con `(size as number)`) | **verde** (46/46) | ninguno: mutante equivalente, ver nota |
| S2f | `markUploaded` antes del check de tamaño | unit 3 rojos; e2e 1 rojo (GET lista el id) | `#161 R2 (b)` unit y e2e, `#161 R2 (a)`, `#157 R5` |
| S2g | `getObjectSize` antes del `return` de ya confirmado | unit 1 rojo (`Received number of calls: 1`) | `#157 R5: ya confirmado …` (E2) |
| S2d | use case lanza `PetDocumentNotUploadedError` por tamaño | unit 1 rojo; e2e 1 rojo (`code`) | `#161 R2 (b)` unit y e2e |
| sin límite | se borra el `if (size > MAX)` | unit 1 rojo | `#161 R2 (b)` |
| S2e | mapper `code: 'PET_DOCUMENT_NOT_UPLOADED'` | unit 1 rojo; e2e 1 rojo | mapper `#161 R2 (b)`, e2e `#161 R2 (b)` |
| status | mapper `HttpStatus.BAD_REQUEST` | unit 1 rojo | mapper `#161 R2 (b)` |
| clase | mapper `NotFoundException` en la rama nueva | unit 1 rojo | mapper `#161 R2 (b)` |
| mensaje mapper | `'Pet document file not found in storage'` | unit 1 rojo | mapper `#161 R2 (b)` |
| sin rama | se borra la rama `PetDocumentTooLargeError` del mapper | unit 1 rojo | mapper `#161 R2 (b)` |
| nombre error | `this.name = 'PetDocumentNotUploadedError'` | unit 1 rojo | `#161 R2 (b)` (`name`) |
| mensaje error | `super('Pet document file not found in storage')` | unit 1 rojo | `#161 R2 (b)` (`message`) |
| S2h | adapter envía `DeleteObjectCommand` si `> 10485760` | e2e 1 rojo **por consulta** (`NotFound` en el segundo HEAD, línea 924) | e2e `#161 R2 (b)` (como predice tasks.md) |
| S3a = M3a | `try/catch` → `PetDocumentNotUploadedError` | unit 2 rojos | `#161 R3: propaga …`, `#157 R6 (g)` |
| S3b = M3b | `return error;` → `return new NotFoundException();` | unit 1 rojo | `#161 R3: devuelve el mismo Error …` |

Nota sobre «orden null/límite»: es un mutante **equivalente** en tiempo de ejecución (`null > 10485760` es `false` en JS, así que cae en el check `null` y lanza `PetDocumentNotUploadedError` igual), y ningún test puede distinguirlo. El orden lo protege el compilador: sin el cast, `pnpm exec tsc --noEmit` sale con exit 2 y `TS18047: 'size' is possibly 'null'`. No es un hueco de candado.

## Observaciones
Ninguna bloqueante.

1. Incidencia de proceso **mía**, sin efecto en el veredicto: la primera sonda e2e (S2a) se lanzó con `pnpm run test:e2e -- media-docs -t '#161 R2'`. Con el `--` de pnpm, jest tomó `-t` como patrón de ruta (casa con cualquier ruta que contenga `-t`) y corrió **la suite e2e completa** (33 suites; 1 rojo esperado, el resto 466 en verde). Además, antes de esa corrida no repetí el `pgrep`: el último `libre` era el de la corrida base inmediatamente anterior. El resto de corridas e2e usaron la forma filtrada de tasks.md (`pnpm exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts -t '#161 R2'`, 1 suite) con `pgrep` → `libre` en una llamada propia antes de cada una. Si alguna sesión vecina vio un rojo e2e hacia las 05:15Z en `pet_tracker:5433`/LocalStack, puede venir de esa corrida.
2. Variación ya registrada por Codex: el TSC rojo repetido de c3 dio exit 1 en vez del 2 que esperaba L2, con el mismo TS2305 y el mismo fichero. No afecta al rojo legítimo.

## Output de ./init.sh
No lo ejecuté yo: el clasificador lo deniega a subagentes. Lo corrió el leader. Leí el log `…/scratchpad/161-init.log`, con cabecera `…/scratchpad/161-init-head.txt` = `2e8319df` / `2026-10-09T05:05:02Z`. Coincide con el HEAD actual, sin drift. Resúmenes (sin códigos ANSI):
```
Backend unit:  Test Suites: 187 passed, 187 total
               Tests:       1471 passed, 1471 total
Infra:         Test Suites: 2 passed, 2 total
               Tests:       14 passed, 14 total
Mobile:        Test Suites: 96 passed, 96 total
               Tests:       2275 passed, 2275 total
               Snapshots:   1 passed, 1 total
e2e:           Test Suites: 3 skipped, 30 passed, 30 of 33 total
               Tests:       8 skipped, 467 passed, 475 total
Lint (backend --fix, infra, expo lint): sin errores
Typecheck: sin errores
✅ Todo verde. Listo para trabajar.
exit=0
```
Comprobaciones propias en HEAD `2e8319df`: unit del módulo media, exit 0 (12 suites / 46 tests) al empezar y al terminar; e2e `media-docs` filtrado, exit 0 (32 passed). Árbol limpio al terminar (`git status --short` vacío).
