# review: mobile-docs-canvas-fidelity
Fecha: 2026-10-15
Veredicto: APROBADO

Feature #175, branch `feature/175-mobile-docs-canvas-fidelity`, HEAD `4b2d7e40`,
base H0 `d38e2787`. Implementó Codex CLI; el revisor es otro agente y midió por
su cuenta sin fiarse de `progress/impl_mobile-docs-canvas-fidelity.md`.

Alcance de esta aprobación: R1 a R10 (todo lo automatizable). R11 (prueba de
humo humana en dev build de Android) y la firma de la enmienda de la carta
quedan **abiertas a propósito** y las cierra el humano; el revisor no ha
marcado ninguna de las dos casillas. La feature no debe pasar a `done` hasta
que el humano cierre R11 (regla del leader sobre requisitos que solo cierra un
humano).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json` tiene una sola entrada
  `in_progress`; `init.sh` la imprime como «Feature en progreso:
  mobile-docs-canvas-fidelity»).
- [x] progress/current.md actualizado (sesión 2026-10-13 con id, branch, origen,
  decisiones del humano y reparto).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — N/A: el diff no toca
  `backend-pet-tracker/` ni `infra/`; es solo presentación móvil.
- [x] repositories/contratos en domain son interfaces puras — N/A, sin cambios.
- [x] application depende de interfaces, no implementaciones — N/A, sin cambios.
- [x] infrastructure sin lógica de negocio — N/A, sin cambios. En móvil, la
  pantalla `src/screens/docs/index.tsx` conserva la estructura de la
  convención Expo (route delgado + `src/screens/`), consume `useDocuments`/
  hooks existentes y no añade lógica de red ni de dominio. El filtro por
  categoría es estado local de presentación.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (R1 a R10; ver tabla de
  trazabilidad y los `describe('#175 R<n>: ...')` en los ficheros listados).
- [x] Historial de commits muestra test-primero, no todo junto. Hay 21 commits
  `(#175 R...)` entre H0 y HEAD; para R1 a R9 el commit `test(...)` precede al
  `feat(...)`/`docs(...)` correspondiente. Las excepciones están declaradas en
  la trazabilidad y las verifiqué:
  - `2dd9e208` (el primer commit de la rama, dobles de entrada, iconos y
    colores para R6): son dobles de test, nacen verdes por construcción y
    ningún `it` depende de ellos hasta `681ce277`;
  - `4963cea6` (R5b, c10b, creado por la enmienda E2): su propio rojo,
    reproducido abajo; el commit verde de R5 `a2f2ee27` viene después;
  - `12ca9dbe` (R10): nace verde por ser candado de deriva; su rojo se
    demuestra con sondas de mutación (ver Evidencia), no con un commit rojo.
  Ninguno de los rojos viene de `ReferenceError` ni de mutar dobles.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente» para R1 a R10. La única fila
  pendiente es R11, marcada «pendiente (humano)», intencional (la cierra el
  humano tras la prueba de humo).
- [x] Commits siguen el formato `feat(<scope>): <desc> (R-ids)` (los 21 commits
  `(#175 R...)` usan `test|feat|docs(<scope>): <desc> (#175 R<n>)`). Los 21
  hashes de la tabla existen y son ancestros de HEAD.

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada
  (`- [x] Aprobado por humano (fecha: 2026-10-13)`). Las enmiendas E1 y E2 se
  firmaron en el repo (commits `01718048` y `cc0f317f`), y el cuerpo de la
  spec respeta que E1 y E2 prevalecen sobre el texto original (4 tokens y no
  5; figuras 58 a 64; inventarios Δ18 text-26 y Δ19 text-13 en
  `profile-canvas-fidelity`).

## Checklist C7 — Sin código huérfano
- [x] Componentes/módulos reemplazados por esta feature fueron eliminados — el
  único reemplazo es el botón HeroUI primario de `docs-upload` (en H0:
  `<Button testID="docs-upload" className="rounded-xl bg-accent border-b-4 ...">`)
  por una zona `Pressable` discontinua que conserva el testID `docs-upload`.
  El `Button` de subida ya no está en `index.tsx` (queda solo el de
  `docs-upload-submit`), y el cambio de recuento de primarios (−1) y de
  `border-lip-gray` (+1) está cubierto por los deltas de los candados.
- [x] Sus tests también fueron ajustados: los `it` de orden y de pulsación
  (`docs-upload`, `docs-upload-form`) apuntan a la nueva estructura (lista,
  zona, error, formulario) y `#95 R6` lleva el Δ4; con `init.sh` verde no queda
  test que asevere la estructura antigua (`['View', 'docs-upload', 'doc-doc-1']`).
- [ ] N/A — no aplica: esta feature sí reemplaza el botón de subida y el
  encabezado/estructura antigua de la lista.

## Checklist C8 — UI móvil conforme a docs/ui-guidelines.md
- [x] Sin hex, sin corchetes arbitrarios, sin `StyleSheet`, sin emoji en
  `src/screens/docs/index.tsx`; todo el copy pasa por `t()` con siete claves
  nuevas en `en` y `es` y filas nuevas en `specs/mobile-ui-language/design.md`
  §2.30.
- [x] Tokens nuevos en `@theme` de `src/theme/global.css` (`--radius-24`,
  `--tracking-title`, `--tracking-eyebrow`, `--text-11`; `--text-15` ya existía,
  E1) y la carta los recoge en la enmienda `## Enmienda de fidelidad al canvas
  (2026-10-13)` con las frases sustituidas de las reglas 6 y 12.
- [x] Iconos solo de `reicon-react-native` (un único import
  `{ ChevronRight, FileText, Upload }`), `CONTINUOUS_CORNER` y `TOUCH_SLOP`
  reutilizados, `HomeEntrance` respeta reduce motion, colores vía
  `useThemeColors`/tokens.
- [ ] Casilla de la enmienda de la carta (`- [ ] Enmienda de fidelidad al canvas
  aprobada por humano (fecha: ____)` en `docs/ui-guidelines.md`) **sin marcar,
  a propósito**: la firma es del humano. El test de R2 acepta vacía o firmada.

## Observaciones

No hay hallazgos bloqueantes. Observaciones no bloqueantes, con alcance exacto:

1. **Flake conocido de Home, no atribuible a #175.** En la primera corrida
   aislada de `-t '#98 R7|#106 R2'` sobre el árbol de HEAD falló 1 test:
   `#98 R7` «pinta dato, icono, copy, nombre accesible, huecos, tintas y
   tipografía» con `Unable to find an element with testID: reminders-meals`
   (`findByTestId` con el timeout por defecto de RNTL, 1000 ms, sin
   `asyncUtilTimeout` en el repo). En esa corrida había otra sesión con jest en
   marcha (aviso «jest running elsewhere»). Las otras siete corridas aisladas
   en HEAD salieron verdes, el fichero Home entero pasó 221/221, y 4 corridas
   sobre la base H0 (incluidas copias frías) también verdes. Home no está en el
   diff y no importa nada de `screens/docs`. No lo absuelvo por la segunda
   corrida verde: queda registrado como carga-sensible preexistente, con el
   alcance exacto de ese `it` y esa consulta (en el cierre de c19 Codex vio la
   misma familia en `reminders-none-upcoming` y `reminders-meals-fill`); no se
   debe ensanchar a otros tests de Home. `init.sh` del leader en HEAD salió
   verde sin ese flake.
2. **R11 y la casilla de la enmienda**, sin marcar a propósito (ver arriba). La
   fila R11 de la trazabilidad y la casilla `Prueba de humo R11 superada por
   humano (fecha: ____)` quedan para el humano, en dev build de Android, con los
   siete puntos de la tabla.
3. **Frontmatter de la spec.** `requirements.md` está en `status: approved`
   (lo que exige C6), pero `design.md`, `tasks.md` y `traceability.md` siguen en
   `status: draft`. No es regla de C6, y el mismo patrón existe en otras
   features ya cerradas (`mobile-welcome-pingo`, `mobile-no-collar-states-pingo`);
   otras (`mobile-account-screens-pingo`, `mobile-tab-headers-canvas`) las
   pasaron a `approved`. Deuda cosmética, a criterio del leader al cerrar.
4. **Líneas de más de 100 columnas** en `src/screens/docs/index.tsx`. Móvil no
   tiene prettier ni regla de longitud, y `expo lint` pasa; solo es estilo.
5. **Excepciones C4 sin commit rojo** (c1, `2dd9e208`, `4963cea6` con rojo
   propio, y R10 `12ca9dbe`): aceptadas porque cada una tiene su rojo
   demostrado (ver Evidencia), no por confianza en el informe de Codex.

## Evidencia independiente

Entorno: copias del árbol en el scratchpad con
`git archive <commit> mobile-pet-tracker docs specs | tar -x` y enlace simbólico
a `node_modules` del worktree. No se modificó el worktree de Codex: `git status`
limpio y 0 ficheros sin trackear antes de escribir este fichero. Primer intento
de copias sin `specs/` dio fallos ajenos por artefacto (tests que leen
`../specs`); descontados al repetir con `specs/`.

### Punto 1 — Historial C4 y rojos reproducidos
Reproduje el rojo desde el árbol de cada commit de test, con `ReferenceError`
= 0 en todos, y los recuentos coinciden con los del informe de Codex:

| Commit de test | Requisito | Tests rojos |
|---|---|---|
| `68e595da` | R1 | 2 |
| `38660a0b` | R2 | 7 |
| `e02c9421` | R3 | 2 |
| `d49bf51a` | R4 | 2 |
| `0e71b8a4` | R5 | 1 |
| `4963cea6` | R5b (E2.1) | 2 |
| `681ce277` | R6 | 20 |
| `e23e66aa` | R7 | 20 |
| `c40f0b9b` | R8 | 19 reales |
| `90295de8` | R9 | 15 |

(Son diez rojos reproducidos, más de los dos exigidos. En R8 los fallos extra
de la copia sin `specs/` eran artefacto y están descontados.)

### Punto 2 — R1 a R10 y trazabilidad
Leí `src/screens/docs/index.tsx` completo (446 líneas): cumple R4 a R9 al pie de
la letra (marco `px 20 / pt 24 / gap 14`, esqueleto `gap-3.5`, cabecera en el
contenido, fila con mosaico `h-14 w-12 rounded-xl` + `FileText` 24, nombre
`text-15 font-extrabold` con `numberOfLines={1}`, fecha con `fmtDate`, `ChevronRight`
18, chips `h-8.5 rounded-full px-3` con `hitSlop={TOUCH_SLOP}` y orden azul,
verde, ámbar, violeta, neutro, zona de subida `rounded-24 border-2 border-dashed`
tras lista y error y antes del formulario, `setFilter('all')` tras el refetch).
Los 21 hashes de `traceability.md` existen y son ancestros de HEAD; los tests
referenciados existen y nombran su R-id.

### Punto 3 — Lista cerrada
`git diff --name-only d38e2787..HEAD` da 18 ficheros: los 15 de la lista cerrada
más 3 propios del leader (`specs/.../requirements.md`, `progress/current.md`,
`progress/handoff_...md`). Ningún commit del leader toca código de aplicación.

### Punto 4 — Candados no tautológicos
Reproduje S3 y S5 (`-t '#175 R10'`, según la Nota 13): 1 fallo, 81 saltados,
4 pasados, 86 en total, y solo falla el `it` esperado. Además planté siete
mutaciones en zona ciega sobre una copia, cada una enrojeció exactamente el
`it` de R10 que debía: `StyleSheet.create`, `elevation`, `useThemeColor` suelto,
segundo import de `reicon-react-native`, `expo-linear-gradient`, `rounded-lg` y
`h-[34px]`. Los candados miran donde dicen mirar.

### Punto 5 — Calidad contra docs/ui-guidelines.md
Ver C8. Una sola nota de estilo (observación 4).

### Punto 6 — Deriva contra origin/main
`origin/main` sigue en `dea11875` y `git rev-list --count d38e2787..origin/main`
da 0: la base no se ha movido, no hay deriva que rebasar.

### Punto 7 — Flake de Home
Ver observación 1.

### Aritmética del total
3389 (recuento de la base) + K (1307, la cifra que dio el leader) − 1252 =
**3444** (la cuenta cuadra), igual que `Tests: 3444 passed` en el log de `init.sh`
y `Test Suites: 110 passed`. Los 40 `●` del log son todos `● Console` (ninguno
es fallo); el aviso «A worker process has failed to exit gracefully» es
preexistente en todo ALL móvil desde main.

### Corrida dirigida en HEAD
Ocho suites: `global-css`, `design-drift`, `consistency-classnames`,
`ui-language`, `profile-canvas-fidelity`, `legibility-classnames`,
`language-provider` y `screens/docs/index`: 8 suites, 483 tests, todo verde, con `--testTimeout=30000` en primer plano y
sin otro jest en marcha en esa corrida.

## Output de ./init.sh
Lo corrió el leader en HEAD `4b2d7e40` (el reviewer no lo ejecuta: el
clasificador lo deniega) y yo leí su log
(`.../scratchpad/init175.log`). Salida con códigos de color retirados, recortada
a los tramos decisivos (`Test Suites`/`Tests` del móvil, build, lint, typecheck
y resumen):

```
INIT — pet-tracker (Harness SDD)   [HEAD 4b2d7e40, exit 0]
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)

→ Verificando variables de entorno...
✅ .env encontrado
[... instalación de dependencias, sin cambios ...]
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-docs-canvas-fidelity
⚠️  Feature 'harness-init-force-color' (done) sin specs/harness-init-force-color/requirements.md — probablemente anterior a la adopción de specs
⚠️  Feature 'mobile-test-double-icon-scope' (done) sin specs/mobile-test-double-icon-scope/requirements.md — probablemente anterior a la adopción de specs
⚠️  Feature 'mobile-home-useapi-double-by-identity' (done) sin specs/mobile-home-useapi-double-by-identity/requirements.md — probablemente anterior a la adopción de spe
[... build backend e infra ...]
✅ Build exitoso
[... tests de infra ...]
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        11.195 s, estimated 34 s
[... tests de backend, harness y móvil: resumen del móvil ...]
A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles

Test Suites: 110 passed, 110 total
Tests:       3444 passed, 3444 total
Snapshots:   1 passed, 1 total
Time:        94.401 s, estimated 111 s
Ran all test suites.
✅ Tests pasados
[... tests e2e ...]
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
Snapshots:   0 total
Time:        95.26 s, estimated 98 s
Ran all test suites.
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 162/180 completadas | 17 pendientes

Recuentos medidos sobre el log completo:
  líneas con '●': 40; de ellas distintas de '  ● Console': 0
```

Nota sobre el log: las advertencias de `init.sh` (`.env` desactualizado,
features `done` anteriores a las specs, `STATUS.md` 162/177 frente a 162/180)
son preexistentes y no afectan a #175. `STATUS.md` desactualizado lo ajusta el
leader en el cierre.
