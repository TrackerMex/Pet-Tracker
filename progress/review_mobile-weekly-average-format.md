# review: mobile-weekly-average-format (#219)
Fecha: 2026-10-26
Veredicto: APROBADO (con una observación menor, sin bloqueo)

Alcance revisado: `git diff fb6b9ad2..HEAD` (H0 = firma) en la rama
`feature/219-mobile-weekly-average-format`, HEAD `c60e8b4b`. `./init.sh` NO lo corrí
(lo corre el leader, por instrucción); queda pendiente de su lado.

## Checklist C2 — Estado coherente
- [x] Una sola feature in_progress en mi alcance: `feature_list.json` no se tocó en el diff; #219 sigue `pending` (ver Observación 1).
- [x] `progress/current.md` y `feature_list.json` sin tocar por Codex (bookkeeping del leader, conforme al handoff).

## Checklist C3 — Arquitectura
- [x] `domain` sin imports de infrastructure: no se toca backend. Solo 4 ficheros de `mobile-pet-tracker/src/screens/home/`.
- [x] Contratos/interfaces: N/A (formateadores puros + un `Intl.NumberFormat` local).
- [x] `application` / `infrastructure`: N/A.
- [x] Sin `StyleSheet`, hex ni `text-[10px]` añadidos (grep sobre líneas `+` del diff: vacío salvo comentarios `#219 R<n>`); sin dependencias ni claves de catálogo nuevas (`package.json`, `bun.lock`, `i18n/` fuera del diff).

## Checklist C4 — TDD
- [x] Cada R tiene test que lo nombra: R1, R2, R3 (`format.test.ts`, `it.each` titulados `#219 R1/R2/R3`, 19/13/8 filas); R4 (9 filas es/en), R5, R6 (9 filas es + 1 en), R7 en `weekly-activity-chart.test.tsx`. R8 y R9 sin test nuevo por spec (suites heredadas verdes).
- [x] Historial test-primero: `7e4a3eaf` (test, 1 fichero) -> `2b4b716b` (test, 1 fichero) -> `6360d5b0` (feat format.ts) -> `8b53d0f5` (feat chart) -> `c60e8b4b` (docs). Ningún commit mezcla test + implementación + docs. El reporte documenta rojos de C1 (20 fallos) y C2 (16 fallos) por aserción.
- [x] Candados no tautológicos: todos los valores esperados son literales en el test; nada importado de producción salvo la función bajo prueba. R4/R6/R7 usan regex ancladas `^...$` con escapes de `+` y `.`. R7 espía `Intl.NumberFormat` y restaura en `finally`.
- [x] Mutaciones, plantadas por mí y revertidas (`git status` limpio al final):
  - (a) sin `Math.round` en `fmtMinutes`: rojas las filas con decimales de R1 (0.4, 0.5, 59.4, 119.4/5/6, 210.333…, 1439.6, ...).
  - (b) `Math.round(count*10)/10` en `fmtCount`: rojo solo `3.05` (1 failed / 53), como prescribe la spec.
  - (c) `Number(toFixed(1))` en `fmtKm`: 4 rojas en R3 (0, 49, 1033.3333, 22000).
  - (d) `Math.round` sobre `average`: rojo `#219 R5` (1 failed).
  - (e) `Intl.NumberFormat('es-MX', ...)` en la tendencia: rojo `#219 R7` (1 failed).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (grep = 0); cada R tiene hash de test y de implementación/validación; los hashes existen en el historial (`7e4a3eaf`, `2b4b716b`, `6360d5b0`, `8b53d0f5`).
- [x] Commits `test(#219)` / `feat(#219)` con R-ids en el asunto, en el formato de la cadena de `tasks.md`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla de firma delegada marcada. La casilla de smoke Android queda sin marcar (cierre humano, G2; no es gate de implementación).

## Checklist C7 — Sin código huérfano
- [x] N/A — no reemplaza ni depreca nada. `formatTrendPercent` perdió su parámetro `locale` y su `.replace`; `locale` sigue usándose en otros puntos del componente (typecheck exit 0 confirmado por mí).

## Verificación independiente
- Diff de producción mínimo y exacto a la spec: `format.ts` (`Math.round` antes de partir; `String(Number(count.toFixed(1)))`; `fmtKm` intacto) y `weekly-activity-chart.tsx` (import de `LOCALES`, `Intl.NumberFormat(LOCALES.en, {signDisplay:'exceptZero', maximumFractionDigits:1, useGrouping:false})`, sin `.replace`; `average` sin redondear).
- Lista cerrada de ficheros: `git diff --name-only fb6b9ad2..HEAD -- mobile-pet-tracker/` = los 4 de `src/screens/home/`. Fuera de `mobile-pet-tracker/`: handoff (ya estaba en `75d17a3a`), traceability y reporte. Nada más.
- Los únicos `it` antiguos editados son los 3 literales de coma de `R12` (añaden sufijo «enmendado por #219 R6»), como autoriza la spec.
- Copy: no hay copy nuevo ni plantillas cambiadas; los literales de salida son los de la spec (Voz B no aplica a números; «Media»/«Average» sin cambio).
- Tests de alcance, ejecutados por mí con `bunx jest --runTestsByPath src/screens/home/{format.test.ts,weekly-activity-chart.test.tsx,index.test.tsx,pingo-phrase.test.ts} --testTimeout=30000`: exit 0, 4/4 suites, 487/487 tests. Los `pgrep` estaban vacíos al arrancar; durante la corrida otro worktree lanzó jest (carga ajena), sin efecto en el resultado.
- `bun run typecheck`: exit 0 (guarda `test ! -e .expo/types/router.d.ts` pasada). `git diff --check`: limpio.
- Drift: `git fetch origin`; `origin/dev` avanzó solo con #210 (backend, specs y progress de reminders-recurrence, `feature_list.json`). `git diff --name-only HEAD...origin/dev` no toca nada bajo `mobile-pet-tracker/` ni `screens/home`/`i18n`. Sin solapamiento; merge limpio esperado.
- Suite completa (5609/5609, exit 0, 157 suites) y lint (`> log && test ! -s log`, exit 0): son evidencia del reporte, no repetidas por mí por el coste y la carga ajena; el leader corre `init.sh`.

## Observaciones
1. (Menor, bookkeeping del leader) `feature_list.json` marca #219 como `pending`; al abrir la PR y cerrar hay que pasarla a `done` tras el veredicto y el tablero (Notion), según el protocolo de cierre. No es defecto de Codex (el handoff le prohibía tocarlo).
2. (Informativa) Pendiente humano: smoke Android (G2) de que «Media 3h 30m», «Media 2.3» y «Media 1.0 km» caben en la card y la tendencia muestra punto; va en `progress/smoke_ui.md`. Jest no mide desborde.
3. (Informativa) Gate final: `./init.sh` por el leader antes de la PR a `dev`.

Hallazgos bloqueantes: ninguno. Mayores: ninguno.

## Output de ./init.sh
No ejecutado por el reviewer (instrucción del leader; el clasificador lo deniega al reviewer). Lo corre el leader.
