# review: mobile-nutrition-ai-format (#224)
Fecha: 2026-10-27
HEAD revisado: `2c759d1d54676b4fb83ed488dec8d43d84f2294c` (branch `feature/224-mobile-nutrition-ai-format`, H0 `552c6b0b`)
Veredicto: APROBADO (con una acción del leader antes de cerrar: F1)

Alcance: `git diff 552c6b0b..HEAD` sobre `mobile-pet-tracker/` y el reporte/trazabilidad de Codex. Se excluyen los commits del leader `cbbf08cd`, `34dc9402`, `9f2b5115`. `./init.sh` NO se ejecutó (lo corre el leader).

## Checklist C2 — Estado coherente
- [x] Ninguna feature `in_progress` en `feature_list.json` (0); #224 sigue `spec_ready`. Codex no tocó `feature_list.json`, `progress/current.md` ni `STATUS.md` (diff vacío), como mandaba el handoff. Pasar #224 a `in_progress`/`done` es del leader (ver F2).
- [ ] `progress/current.md` no menciona #224: pendiente del leader (F2).

## Checklist C3 — Arquitectura
- [x] `parse-ai-explanation.ts` es puro (sin imports). `ai-explanation.tsx` importa solo react, react-native, reicon, `language-provider`, `theme/*`, `utils/category-palette` y el parser; sin `api/`, sin `heroui-native`, sin `./index` (el candado R11 lo prueba y lo reviso en el fuente).
- [x] `index.tsx` solo cambia la tarjeta y dos imports (diff de 7+/7-).
- [x] Sin lógica de negocio en infraestructura; `backend-pet-tracker/` intacto.

## Checklist C4 — TDD
- [x] Cada R1..R11 y R13 tiene `it` que nombra su R-id (`#224 R<n>:`); R12 sin jest por spec.
- [x] Cadena test-primero verificada con `git show --stat`: C1 `4886b387` (solo test del parser, rojo `Cannot find module`) -> C2 `ba62b57f` (solo parser) -> C3 `bcb94e1a` (solo tests/candados, 7 ficheros) -> C4 `8be51e4f` (solo `catalog.ts` + `ai-explanation.tsx`) -> C5 `9b95970f` (solo `index.tsx`) -> C6 `2c759d1d` (solo traceability, tasks, reporte). Ningún commit mezcla test, implementación y docs. Rojos de C3/C4 documentados con logs (`progress/c3-224-*.log`, `c4-224-*.log`) y coherentes con la ventana declarada; tras C4 solo quedaron los 4 rojos esperados (`#200 R8` enmendado + 3 filas de `#224 R10`).
- [x] Filas que nacieron verdes (`#224 R10` null, `#224 R13` AI_PARSER) declaradas y con sonda (16 y C3).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin ninguna fila "pendiente" (grep = 0); los hashes completos de C1..C5 coinciden con `git log`.
- [x] Commits `feat|test(mobile): ... (R-ids)`.

## Checklist C6 — Spec aprobada
- [x] Casilla "Aprobado por humano" marcada (firma delegada del leader, `008c1ccd`).
- [ ] Frontmatter `status:` sigue en `draft` en `requirements.md`, `tasks.md` y `traceability.md` (CHECKPOINTS.md l.86 pide `status: approved`). Es del leader, no de Codex: ver F1.
- [x] Casilla del smoke Android (l.480) **sin marcar**, como corresponde.

## Checklist C7 — Sin código huérfano
- [x] El `Text` `food-ai-body` antiguo y su clase `text-13 leading-body` ya no están en `index.tsx` (`grep -cF food-ai-body` = 0, `leading-body` = 0); el `it` `#200 R8` se enmendó en lugar de dejarse huérfano. No se reemplazó ningún módulo con tests propios.

## Verificación independiente (sin init.sh)
- `bun run test -- --runTestsByPath` sobre 13 ficheros (parser, componente, `food/index`, `profile-canvas-fidelity`, `nutrition-canvas-fidelity`, `ui-language`, `language-provider`, `ui-copy-table`, `design-drift`, `consistency-classnames`, `legibility-classnames`, `home-canvas-fidelity`, `jest-virtual-mock-lock`): exit 0, `Test Suites: 13 passed`, `Tests: 706 passed`.
- `bun run typecheck` (sin `router.d.ts`): exit 0.
- `bunx expo lint --no-cache > log 2>&1 && test ! -s log`: exit 0, log de 0 bytes.
- Log de Codex `progress/final-test-224.log`: 170 suites / 6302 tests verdes, sin pipe; coincide con la cuenta encadenada (6222 + 46 + 28 + 6 = 6302). El timeout de `pet-members` R10 del primer intento está documentado, aislado en verde (55/55) y no toca ficheros de la feature.
- R12: `git diff origin/dev --stat -- backend-pet-tracker mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` (con `origin/dev` = `04c6e6a5`): **salida vacía**.
- Ficheros de producción nuevos/editados grep-limpios: cero hex, cero `StyleSheet`, cero `x-[`/`text-[`, y los únicos `#224` son `#224 R6` (exento por la forma `#NNN R<n>`). `grep -c text-13 index.tsx` = 1 (E1).

## Requisito por requisito
- R1/R2/R3: las 19 + 18 + 6 filas y SAMPLE coinciden con la spec, con esperados literales escritos a mano (no usan el parser para calcularlos). Test de no-lanza + sin `*`, y carga de 20000 viñetas sin cronómetro. Parser **lineal**: medido con `bun` sobre entradas hostiles (`'**a *'` x100000: 87 ms; 50000 `**` sin cerrar: 17 ms; 200000 espacios: 0 ms; 200000 líneas `- `: 86 ms).
- R4: tres claves ES/EN con el literal exacto de la tabla (verificado en `catalog.ts`), una sola `t('<clave>')` por clave, tres filas en `R6_FOOD`, fórmulas 71 / 43 / 670; títulos enmendados con `(enmendado por #224 R4)` solo en los tres `it` que la spec manda. 6 filas `#224 R4` es/en.
- R5: clases exactas de párrafo, viñeta (con `mt-1`/`mt-1.5`/`''`), punto (`mt-1.75 size-1.25 shrink-0 rounded-full` + `style backgroundColor`) y negrita `font-extrabold`; sin glifos, sin `StyleSheet`. Test por cada hijo.
- R6: constantes `AI_CLAMP_HEIGHT = 122`, `AI_FADE_HEIGHT = 36`, frontera `> 122`, degradado `pointerEvents="none"`, `absolute inset-x-0 bottom-0`, literal `experimental_backgroundImage` exacto. Tabla de 5 filas (sin evento, 0, 122, 123, 400).
- R7: `Pressable` `accessibilityRole="button"`, `accessibilityState.expanded`, `hitSlop={TOUCH_SLOP}`, `h-8` (32 + 12 = 44), rótulo `text-13 font-extrabold` + `CATEGORY_SLOTS.violet.ink`, `ChevronDown/Up` 16 / 2.6; texto nuevo colapsa (`expandedFor === text`); sin animación.
- R8: aviso siempre, `text-11 leading-body text-muted`, 6 filas es/en.
- R9: `food-ai-body` `accessible` con `accessibilityLabel` = texto plano completo; botón fuera de la unidad (TalkBack: párrafo continuo + botón aparte); puntos decorativos sin texto.
- R10: tarjeta columna `gap-2 rounded-card ${violet.surface} p-3.5` + `CONTINUOUS_CORNER`, cabecera `food-ai-header`, `Sparkles` 20/2.2, `AiExplanation` como segundo hijo, `RiseIn delayMs={140}` y orden conservados; condición por `parseAiExplanation(...).length > 0`; `it.each` null / `''` / `'   '` / `'**'`. Mock de reicon gana solo `ChevronDown`/`ChevronUp`. Los `it` antiguos de `index.test.tsx` no se editaron (solo `#200 R8`).
- R11: API `({ text }: { text: string })`, sin tarjeta/título/icono; candado de imports prohibidos.
- R13: (a) Perfil: `'screens/food/ai-explanation.tsx', // #224 R13` entre `edit-profile` y `food/index` (E1: conserva `food/index.tsx`), título enmendado; (b) fila `leading-body` apunta a `AI_EXPLANATION`, `it.each('#224 R13: %s ...')` con `AI_EXPLANATION` y `AI_PARSER` con rutas relativas a `src`; el `it.each` `#200 R16` **no** lleva sufijo (P14) y el título de `#200 R17` tampoco; (c) grep-limpio; (d) clases existentes, `design-drift`, `consistency-classnames`, `legibility`, `home-canvas-fidelity` verdes sin cambiar de cuenta.
- Lecciones del repo: sin `Image` en la feature; aviso fijo y copy es/en literales; diana de 44; textos sintéticos con `// sintético`; sin `virtual:`; `await` en `fireEvent`, `rerender` y `render`.

## Sondas de mutación
Codex reporta las 16 de la spec más 14b, 15b (import, StyleSheet, hex) y la adicional de C3, cada una con rojo concreto y restauración (`progress/probe-224-*.log`). Reverifiqué por mi cuenta cuatro, todas rojas y revertidas con `git checkout HEAD --` (árbol limpio al final):
- `mt-2` en el bloque 0 -> rojo `#224 R5: SAMPLE pinta cada bloque...`.
- `h-8` -> `h-6` -> rojo `#224 R7: la zona táctil es de 44`.
- regex de viñeta `^[-*]\s*(.*)$` -> rojas filas 9, 12, 13, 14, 16, 17 de R1.
- quitar `accessible` de `food-ai-body` -> rojo `#224 R9: la etiqueta es el texto plano completo`.

## Hallazgos
- **F1 (acción del leader, no bloquea el trabajo de Codex).** El frontmatter `status:` de `specs/mobile-nutrition-ai-format/{requirements,tasks,traceability}.md` sigue en `draft`, aunque la casilla de firma está marcada (el commit de firma `008c1ccd` lo dejó así; #222 igual). CHECKPOINTS.md C6 pide `status: approved`. Cambiarlo es una edición de spec del leader; hazla en el cierre.
- **F2 (informativo, del leader).** #224 sigue `spec_ready` en `feature_list.json` y no figura en `progress/current.md`; Codex no debía tocarlos. Registrar el cierre (y el tablero Notion) tras la PR según el protocolo.
- **F3 (observación, no bloquea).** Sonda 4: quitar `.replace(/\r\n?/g, '\n')` pone roja solo la fila 10 de R2 (CR solo); la fila 9 (CRLF) sigue verde porque `trim()` elimina el `\r` final. Codex lo declaró y no forzó nada. La spec decía «filas 9 y 10»: la fila 9 no distingue esa mutación. El candado de CR sí existe (fila 10).
- **F4 (informativo).** El smoke en dev build Android (l.480) queda para el humano y no está marcado. Si el recorte de 122 o el degradado de 36 no calzan en dispositivo, se ajustan `AI_CLAMP_HEIGHT` / `AI_FADE_HEIGHT` en una enmienda.

## Output de ./init.sh
No ejecutado por el reviewer (instrucción del leader: lo corre él). Las verificaciones independientes arriba sustituyen la parte de jest/typecheck/lint acotada; la corrida completa sin pipe queda para el leader.
