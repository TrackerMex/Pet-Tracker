Veredicto: aprobado

# review: mobile-quick-actions-typography-lock (#81)

Fecha: 2026-09-29 20:40 UTC
HEAD revisado: `7d580e44947d82779c087e58b521cd55ccebabcd`, branch `feature/81-mobile-quick-actions-typography-lock`, worktree `/home/claude/sites/Pet-Tracker-wt-backend`.
Base: `origin/main` = `4efb6c81`, que es también el merge-base.
Skills cargadas: `expo:expo-overview`.

Al arrancar, `pwd` y `git branch --show-current` dieron el worktree y la branch de #81. No he tocado `/home/claude/sites/Pet-Tracker` ni he cambiado de branch.

Al terminar, el árbol de `mobile-pet-tracker/` quedó limpio: `git status --porcelain` no lista nada bajo `mobile-pet-tracker/` y `git diff --cached` sale vacío. Los blobs en disco son los de HEAD (Home `ff591a1f`, test `f91c8971`). La única línea de `git status --porcelain` es ` M progress/current.md`, una edición del leader sin commitear que no es mía ni de Codex (observación 5).

## init.sh (lo corrió el leader; he leído yo el log)

Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/61925982-adfd-442b-96d4-acd459f33878/scratchpad/init81_review.log`.
- Su mtime es 2026-09-29 20:06:08 UTC, posterior al commit `7d580e44` (19:54:43 UTC).
- El log no imprime ni su propio `exit` ni el HEAD. El leader informa `EXIT=0` medido sin pipe, y el log cierra con `Todo verde. Listo para trabajar.`

```
Build                 ✅ Build exitoso
Backend unit          Test Suites: 171 passed, 171 total / Tests: 1307 passed, 1307 total
Infra                 Test Suites: 2 passed, 2 total / Tests: 14 passed, 14 total
Harness (node:test)   # tests 28 / # fail 0 ; # tests 5 / # fail 0 ; # tests 15 / # fail 0
Móvil                 Test Suites: 86 passed, 86 total / Tests: 1604 passed, 1604 total / Snapshots: 1 passed, 1 total
                      PASS src/screens/home/index.test.tsx (26.331 s)
e2e                   Test Suites: 3 skipped, 27 passed, 27 of 30 total / Tests: 8 skipped, 389 passed, 397 total
Lint                  ✅ Lint sin errores
Typecheck             ✅ Typecheck sin errores
```

El total móvil de 1604 es exactamente el delta de requirements.md: 1597 + 7, con +0 suites. Ese recuento solo puede darse sobre un árbol que ya contiene los siete `it` de #81, y eso respalda que el log corresponde a este HEAD.

## Mediciones propias (desde `mobile-pet-tracker/`, sin pipe, en primer plano)

| Comando | exit | Resultado |
|---|---|---|
| `bunx jest` (suite completa) | 0 | 86/86 suites, 1604/1604 tests, 1/1 snapshot |
| `bunx jest src/screens/home/index.test.tsx` | 0 | 166/166 (base 159 + 7) |
| `test ! -e .expo/types/router.d.ts` | 0 | no existe |
| `bunx tsc --noEmit` | 0 | log vacío |
| `bunx eslint src/screens/home/index.tsx src/screens/home/index.test.tsx` | 0 | log vacío |
| `git diff --exit-code 4efb6c81 HEAD -- mobile-pet-tracker/ ':!*.test.tsx'` | 0 | diff de producción vacío |

Logs: `rv81_full.log`, `rv81_home.log`, `rv81_tsc.log` y `rv81_lint.log`, en el scratchpad de esta sesión.

## Checklist C2: estado coherente
- [x] Solo una feature está `in_progress`: `[(81, 'mobile-quick-actions-typography-lock', 'in_progress')]`, leído de `feature_list.json` con python. El paso de `pending` a `in_progress` lo hizo el leader en `8db3cfab`.
- [x] `progress/current.md` en HEAD describe la sesión activa de #81: spec, espejo Notion, gate, firma y handoff.
- [x] Codex no tocó los artefactos del leader. En el rango `8db3cfab..7d580e44`, `git diff --name-only` da solo el test, `progress/impl_mobile-quick-actions-typography-lock.md` y `specs/…/traceability.md`. Los únicos commits que cambian `progress/current.md`, `progress/history.md`, `STATUS.md` o `feature_list.json` son `b97351b9` y `8db3cfab`, ambos del leader.

## Checklist C3: arquitectura
- [x] Solo se añaden tests en la capa de presentación móvil (`src/screens/home/index.test.tsx`). No se tocan dominio, aplicación ni infraestructura.
- [x] No hay imports nuevos. El diff del test es solo aditivo: +153 líneas, 0 líneas `-` y ningún `import`.
- [x] No aplica a contratos ni repositorios: no hay ninguno implicado.
- [x] No hay lógica de negocio en infraestructura: la feature no toca infraestructura.

## Checklist C4: TDD (vía b)
- [x] Cada requisito R1-R6 tiene al menos un `it` dentro de `describe('#81 R1-R6: la rejilla de accesos rápidos no deja decisiones sin candado'`. R6 tiene dos (detalle en error y actividad en error). R7 se cierra por inspección, como prescribe la spec.
- [x] El historial es test primero. Hay seis pares rojo→verde (`a7a2df31`→`d7dfadb4`, `c6530ce9`→`18cc4774`, `8ee5f1a8`→`8e80f15e`, `7e2d324c`→`5a45d8da`, `04e926a9`→`3281cd58` y `9b495d14`→`d14c10c0`), más el commit de evidencia `7d580e44`.
  - Cada rojo toca el test y la Home. La Home de cada rojo tiene exactamente el blob de mutación de tasks.md: a1 `f06c0fc6`, b `dcf0a26c`, e6 `da4a57bf`, e4 `973320c2`, e7 `edc0d24c` y m6_both `256e5a7e`.
  - Cada verde toca solo la Home y la devuelve a `ff591a1f`.
  - Los blobs del test por R coinciden con tasks.md: `43d73077`, `89ee0a77`, `9f447048`, `48b550b4`, `0c5b27f5` y `f91c8971` (el final).
- [x] He reproducido el rojo de R6 de forma independiente. Tomé la Home de `9b495d14` (blob `256e5a7e`), cuyo árbol móvil difiere de HEAD solo en la Home, y corrí la suite completa: exit 1, 2 failed de 1604, solo los dos `it` de R6, ambos con `Unable to find an element with testID: quick-actions-row`. Es rojo por consulta, que es lo que tasks.md espera de m6_both. Los rojos de R1-R5 los tomo del informe de Codex; coinciden con tasks.md en `it` y matcher, y las sondas de zona ciega de abajo los corroboran por otra vía.
- [x] Los valores esperados son literales y no hay candados tautológicos.
  - R1: `'text-2xs font-semibold text-foreground'`.
  - R3: `['rounded-xl']` y `{ borderCurve: 'continuous' }`, un literal y no el `CONTINUOUS_CORNER` importado de producción.
  - R4: `'gap-3'` y `'flex-row gap-3'`, y los tres testIDs de tile como literales.
  - R2 compara `children[1]` con `within(tile).getByText(label)`, donde la etiqueta sale de la tabla literal del test.
  - No hay hex ni imports nuevos.

### Sondas remedidas (suite completa; mutación literal de tasks.md con blob verificado; restauración con `git checkout HEAD --` y comprobación de porcelain y cached vacíos tras cada una)

| Sonda | Exigido (tasks.md) | Medido por mí | Codex | Veredicto |
|---|---|---|---|---|
| a2_1 | R1, por aserción | exit 1, 1 failed: R1 por `toBe` (Received `text-xs font-medium text-foreground`) | igual | ok |
| m2_swap2 | R2, por aserción | exit 1, 1 failed: R2 por `toHaveProperty` (se esperaba `icon-file-text` y llegó la etiqueta de Documentos) | igual | ok |
| m3_round1 | R3, por aserción | exit 1, 1 failed: R3 por `toEqual` (`rounded-card`) | igual | ok |
| e12_1 | R3, por aserción | exit 1, 1 failed: R3 por `toEqual` (Received `undefined`) | igual | ok |
| m5_one_2 (no validada en spec) | R5, como mínimo | exit 1, 1 failed: R5 por `toHaveAccessibleName` (se esperaba Documentos y llegó Peso) | igual | ok |
| e10 | verde | exit 0, 1604/1604 | verde | ok |
| m6_tile0 (no validada) | R6 ×2, como mínimo | exit 1, 2 failed: solo R6 detalle y R6 actividad, por `toHaveLength` | 5 failed (3 de #71 y R6 ×2) | mínimo ok; extras no deterministas |
| m6_tile1 (no validada) | R6 ×2, como mínimo | 1.ª corrida: 2 failed (R6 ×2). 2.ª corrida: 3 failed (#81 R4 por `toEqual` y R6 ×2) | 5 failed (#71 iconos, #81 R1, #81 R5 y R6 ×2) | mínimo ok; extras no deterministas |
| m6_both (réplica del rojo `9b495d14`) | R6 ×2, por consulta | exit 1, 2 failed: R6 ×2, `Unable to find … quick-actions-row` | igual | ok |

Para e12_1 y m5_one_2, la línea ancla aparece dos veces en la Home, así que las apliqué anclando también la línea siguiente. Los blobs resultantes fueron `510f37d2` y `273bf0e0`, los de tasks.md.

**Comparación con la columna «Exigido».** La tabla de Codex cumple el mínimo exigido en todas las filas. Los «rojos de más» que declara aparecen solo en las filas m6_tile, m6_tile0, m6_tile1 y m6_tile2. Mis corridas confirman que esos extras dependen de una carrera de tiempos durante la espera y no son deterministas: la misma sonda dio 2 y luego 3 rojos, y Codex vio 5. Lo estable es el mínimo, los dos `it` de R6 por `toHaveLength(3)`. No hay regresión: los extras son `it` que ya existían y que fallan por la mutación, no por el código de la feature.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». Todas las filas R1-R6 llevan los hashes completos de rojo y verde. R7 figura como «no aplica» en el rojo y con `d14c10c0` en el verde. La única aparición de la palabra «pendiente» es la frase de regla de la línea 24, que no es una fila.
- [x] Los 12 hashes pasan `git merge-base --is-ancestor <hash> HEAD` con exit 0.
- [x] Los commits siguen el formato de convención con scope y R-id: `test(mobile): … (R<n>)` para los pares y `docs(mobile): … (R7)` para la evidencia. Es el mismo uso de `test(mobile)` que en las features de solo-test anteriores (#130 y #132).

## Checklist C6: spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla humana marcada `[x]` con fecha 2026-09-29. La firma es el commit `0894f07a`, vía Notion.
- [x] `git diff 0894f07a HEAD -- specs/mobile-quick-actions-typography-lock/` toca solo `traceability.md`, y solo para rellenar hashes. La spec que implementó Codex es la firmada.

## Checklist C7: sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados (no aplica)
- [ ] Sus tests también fueron eliminados (no aplica)
- [x] N/A: esta feature no reemplaza nada existente. Solo añade candados sobre la Home.

## Checklist C8: carta de UI (`docs/ui-guidelines.md`)
- [x] El diff de producción está vacío, así que la feature no introduce UI. El test está limpio de hex, `StyleSheet` y valores arbitrarios `-[`.
- [x] Cumple §Enmienda #70: cada decisión del tile repetido queda cerrada por posición vía `children`.
  - Queda fijada la receta de la etiqueta (R1).
  - Queda fijada la anatomía, en orden y con dos hijos (R2).
  - Queda fijado el radio junto con la esquina continua (R3).
  - Queda fijada la sección con su fila, en orden, gap y dirección (R4).
  - Queda fijado el nombre accesible (R5).
  - Queda fijada la condición de render (R6).
- [x] Greps de §R7 sobre HEAD, todos según la spec:
  - `CONTINUOUS_CORNER` = 2 y `QUICK_ACTIONS.map` = 1.
  - `<Icon size={24}` = 1.
  - `stylesheet` = 0 y `text-[10px]` = 0.
  - `-[` = 0 en el diff.
  - `^describe(` pasa de 40 a 41 y `^describe('#81 R` = 1.
  - `#81` = 11 y `#81 R[1-6]` = 11.
  - `quick-actions-row` pasa de 1 a 5.

## Observaciones

Ninguna bloquea la aprobación.

1. **Las filas m6_tile* de tasks.md miden una carrera.** Los rojos extra de m6_tile, m6_tile0, m6_tile1 y m6_tile2 no son deterministas: Codex vio 5/5/5 (y 6 en m6_tile), y yo vi 2 en m6_tile0 y luego 2 y 3 en dos corridas de m6_tile1. La columna «Hoy» de la spec para esas filas es también una sola muestra de la misma carrera. Solo el mínimo (R6 ×2 por `toHaveLength`) es reproducible. Recomendación para futuras specs: en las sondas que desmontan un nodo durante una espera, rotular la columna como «mínimo estable; extras no deterministas» en vez de dar un recuento exacto.
2. **Error de transcripción en `progress/impl_…md`.** Dice que la skill `expo:building-native-ui` es la «versión instalada 1.0.1». En `~/.codex/plugins/cache/openai-curated/expo/` lo instalado es la v1.0.2, y la skill `building-native-ui` existe en ella. No afecta al resultado: la feature no toca UI.
3. **El log de init.sh no se autoidentifica.** No imprime `exit` ni HEAD. Lo he corroborado por su mtime (posterior a HEAD), por el recuento de 1604 (= 1597 + 7) y por mis propias corridas de jest, tsc y eslint, todas con exit 0. Para próximos gates conviene que el leader añada `git rev-parse HEAD` y `echo "exit=$?"` al final del fichero de log.
4. **Nota sobre la fecha de la firma, dirigida al leader.** El commit de firma `0894f07a` declara que la casilla de Notion lleva fecha 2026-09-26, anterior a la creación de la página, y que en disco se copió 2026-09-29. Está declarado en el propio commit y no invalida la firma, pero conviene que el humano lo sepa al leer el historial.
5. **Hay una edición sin commitear de `progress/current.md` en el worktree.** Es el «Aviso de Frontend (2026-09-29): #132 cerrado en la PR #173, que registra #135… empieza en #136». La añadió el leader durante la revisión; no es de Codex ni mía, y no la he tocado. El leader debe incluirla en su commit de cierre o descartarla a propósito.
6. **Deuda (F) sin registrar.** La falta de feedback de pulsado en los tiles es anterior a #81 y design.md la declara fuera de alcance. Queda sin id en `feature_list.json`. Si el leader decide registrarla, según su propia nota el siguiente id libre empieza en #136, que hay que verificar contra `origin/main`.
