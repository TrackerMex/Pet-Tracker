# review: mobile-tab-screens-canvas-fidelity
Fecha: 2026-10-15
Veredicto: APROBADO (condicionado: R16 y las casillas humanas quedan para el humano; ver Observaciones)

Rama `feature/173-mobile-tab-screens-canvas-fidelity`, HEAD `91b705ab`, H0 `adad3359295766758851761dce337f028671bc4b`. 33 commits sobre H0: 30 de Codex (c1 a c30, pares test/feat por requisito) más commits de docs del leader. Árbol limpio e índice vacío al terminar la revisión.

## Qué ejecuté yo y qué leí del log

Ejecutado por mí en esta revisión:
- `mcheck.py` (medidas M1 a M51 de la spec): 51 de 51 en ok.
- Reproducción independiente de 14 rojos, cada uno con el checkout del commit rojo (`.` más `../specs ../docs`), restauración con `git checkout HEAD -- . ../specs ../docs` y `git diff --quiet && git diff --cached --quiet` después. Recuentos de tests fallidos: R1 2, R2 2, R3 4, R4 6, R5 7, R6 12, R7 18, R8 12, R9 24, R10 14, R11 23, R12 3, R14 16, R17 1. Coinciden con los del informe del implementer. R6 se midió con `jest -i` porque el worker de jest se cae con JSON circular en rojos multi-fichero.
- Unas 60 mutaciones sobre producción, cada una restaurada con `git checkout HEAD --`; unas 50 murieron. Las que sobreviven están en Observaciones.
- Lectura completa de `src/screens/profile/index.test.tsx` (1752 líneas) y `src/__tests__/profile-canvas-fidelity.test.ts` (153 líneas), de `requirements.md` (961 líneas), `tasks.md`, `traceability.md`, del informe del implementer y de `progress/current.md`.
- Verificación de la fuente `assets/fonts/Inter-ExtraBold.ttf`: es Inter 4.001 ExtraBold genuina.
- Greps de la carta y de C8 (los 10 bloques R14, sus firmas sin marcar y el texto de la carta).
- Diff contra H0 de la lista cerrada de rutas, y del botón `profile-sign-out` (sin cambios).
- Ficheros sueltos de jest con `bunx jest --testTimeout=30000 --runTestsByPath <fichero>` con `(tabs)` escapado. El flake conocido `R1: me card > shows the real account name and email` no se disparó en ninguna corrida suelta.

Leído del log, NO ejecutado por mí (el clasificador deniega `./init.sh` al subagente y el leader ya lo corrió): `init-review-173.log` y `init-review-173.exit` en el scratchpad `h173/`, corrida sobre HEAD `91b705ab` con árbol limpio, EXIT=0. La primera corrida (`init-review-173-run1-sin-env.log`) falló solo por falta de `.env` en el worktree; no es un defecto del código.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #173).
- [x] `progress/current.md` actualizado (Reanudaciones 1 a 10).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica, la feature es solo móvil; `git diff --stat adad3359..HEAD -- backend-pet-tracker` vacío.
- [x] repositories/contratos en domain son interfaces puras: no aplica, sin cambios de backend.
- [x] application depende de interfaces, no implementaciones: no aplica.
- [x] infrastructure sin lógica de negocio: no aplica. En móvil, la pantalla `src/screens/profile/index.tsx` es el único sitio con lógica nueva (`formatLastSignal`, cambio de tema e idioma) y la ruta `src/app/(tabs)/profile.tsx` sigue delgada.
- [x] Lista cerrada de rutas de la spec respetada: el diff contra H0 no toca nada fuera de ella.

## Checklist C4 — TDD
- [x] Cada R-id tiene al menos un test que lo nombra. R1 a R15 y R17 los nombran en `describe`/`it` (`#173 R4`, `R5`, `R8`, `R9`, `R11`, `R12` en `profile/index.test.tsx`; R1 a R3, R14 y R15 en `profile-canvas-fidelity.test.ts` y en los tests de tokens, Card, PetSwitcher y `_layout`; `#168 R4/R5/R6/R7 (enmendado por #173 Rn)` y `R2` para R17). R16 es gate humano, sin test.
- [x] El historial muestra test primero: cada requisito tiene su commit `test(mobile)` inmediatamente antes de su `feat(mobile)` (pares c91efe84/2d462afa, 9591e3f1/ca83aaf9, 7056ca0e/a18abc0d, fc6715cf/36356ae8, aaeb9bab/166c8af4, f785d96c/fe0dc8a5, 89795331/bf21fbbd, 427079ac/92308138, b73f4963/9b01360f, 44e0b9c6/94614567, 506ad153/74641446, b10028b7/83112c89, 1bb49c33/4369cafc, 0b6d8329/9222e981). Los rojos de 14 de ellos los reproduje (ver arriba). R13 va en un `refactor` (5e48dc40) sobre catálogo y tabla de copy, cubierto por los candados de delta que cambian en los commits de R7 a R12. R15 (2ed3a7fc) es solo candados de grep-limpio; su prueba de rojo es la sonda S15 del implementer.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" salvo R16, que es gate humano y la spec lo exceptúa expresamente (fila 26 y regla de la línea 29).
- [x] Commits en formato `feat(<scope>): <desc> (R-ids)`; aquí `feat(mobile): ... (#173 Rn)`, el estilo del repositorio.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla humana marcada (aprobación vía Notion, 2026-10-13).
- Nota: el frontmatter de `traceability.md` dice `status: draft`. Ver O3.

## Checklist C7 — Sin código huérfano
- [x] Los literales reemplazados (`profile.information`, `profile.gpsSettings`, `profile.account`, `profile.useLightTheme`) fueron eliminados del catálogo y de la tabla de copy; el grep-limpio R15 lo candada.
- [x] Sus tests también se eliminaron o se enmendaron (los `#168 R4/R5/R6/R7` quedaron "enmendados por #173 Rn").
- [ ] N/A: no aplica; la feature sí reemplaza etiquetas y el interruptor de tema.

## Resultado por punto de validación del leader
1. Spec y enmiendas E1 a E7: conforme. Las siete son correcciones factuales que no cambian el diseño ni la lista cerrada. Ver O4.
2. Historial test-primero: conforme (C4).
3. Medidas M1 a M51: 51 de 51 ok ejecutadas por mí.
4. Lista cerrada de rutas: conforme.
5. Calidad de candados y mutación: suficiente, con las supervivencias O1, O2 y O6.
6. Carta de UI, C8 y los 10 bloques R14: texto de la carta y bloques canónicos verificados; las firmas humanas están sin marcar, como corresponde antes del gate (el candado acepta `[ xX]`).
7. Pureza: `formatLastSignal` recibe `detail.dataUpdatedAt` (E4), sin `Date.now()` en render; `react-hooks/purity` verde en el lint del log.
8. R16 pendiente: humano.

## Observaciones
Ninguna bloqueante. Condiciones de cierre y puntos para el humano:

- Condición de cierre R16: prueba de humo en dev build de Android (claro y oscuro, es y en), a cargo del humano. Tampoco están firmadas las casillas humanas "Enmiendas R14 revisadas" ni la del copy R13.2.
- O1 (candado ausente, error de la spec, no del implementer): `disabled={photoUploading}` en el control `change-photo` (`src/screens/profile/index.tsx`, línea cercana a 353) no tiene candado; la mutación M1 sobrevive. R6.2 lo prescribe literalmente y la lista de tests de la spec no lo recoge. `handleChangePhoto` tampoco tiene guardia de reentrada, así que el candado útil sería un test que pulse dos veces durante una subida pendiente y espere una sola llamada a `launchImageLibraryAsync`. Registrar como deuda.
- O2 (candado ausente): en la rama de foto de `PetSwitcher variant="avatars"` (`src/components/pet-switcher.tsx`, cerca de la línea 46), `size={40}` y `cacheKey={pet.id}` de `PetAvatar` están prescritos por R4.2 pero no candados (M41 y M46 sobreviven). Deuda.
- O3 (trazabilidad): la fila de R13 de `traceability.md` omite los commits rojos `427079ac`, `44e0b9c6` y `506ad153` (los rojos de R8, R10 y R11 que mueven los candados de catálogo), y el frontmatter del fichero sigue en `status: draft`. Es higiene documental, no cambia el veredicto.
- O4 (enmiendas sin casilla): E1 a E7 son correcciones factuales sin firma humana. E3 edita `mobile-ui-language/design.md` §6.3 fuera del mecanismo de casilla firmada, y E4 ancla el tiempo relativo a la última carga del detalle (`dataUpdatedAt`) en lugar de a la hora actual. Conviene que el humano las lea en la PR.
- O5 (patrón habitual): varios commits `feat` ajustan recuentos de candados por delta (ui-language `R7_PROFILE`, `englishKeys`, consistency-classnames) y `bf21fbbd` cambia la aserción `'Hembra'`. Es el patrón de delta del repositorio; cada ajuste lo exige la propia spec.
- O6 (zona preexistente sin candado): la `className` de `profile-sign-out` (`rounded-xl bg-danger-soft`) no está candada (M58 sobrevive). R11.4 dice "sin cambios" y el diff contra H0 confirma que el botón no cambió.
- El flake conocido `R1: me card` no se reprodujo en corridas sueltas, así que no cuenta.

## Output de ./init.sh
Leído de `.../scratchpad/h173/init-review-173.log` (no ejecutado por el reviewer; corrida del leader sobre HEAD `91b705ab`, árbol limpio), `EXIT=0`:

```
Test Suites: 187 passed, 187 total          (backend unitarios)
Tests:       1474 passed, 1474 total
Test Suites: 2 passed, 2 total              (backend e2e)
Tests:       14 passed, 14 total
Test Suites: 104 passed, 104 total          (mobile)
Tests:       3213 passed, 3213 total
Snapshots:   1 passed, 1 total
Test Suites: 3 skipped, 30 passed, 30 of 33 total
Tests:       8 skipped, 468 passed, 476 total
Todo verde. Listo para trabajar.
Features: 159/173 completadas | 13 pendientes
```

El log solo contiene el aviso conocido de worker force-exit ("A worker process has failed to exit gracefully ...") al final de la suite móvil, preexistente en main. `grep -c "reading 'canceled'"` en el log da 0. Lint y typecheck en verde.

## Ronda 2 — merge de main (#171 + #172) y E8
Fecha: 2026-10-15
Veredicto: APROBADO

Delta revisado: merge `51254654` (padres `f4e5d18b` rama #173 y `9547115e` origin/main = #171 + #172) más la enmienda E8. El veredicto de la ronda 1 (APROBADO sobre `91b705ab`) sigue vigente para el código de #173. No se ejecutó `./init.sh` ni la suite completa de jest (denegado al subagente y compite por Postgres/LocalStack): se leyó el log del leader (sección final). Se corrió jest dirigido, un fichero a la vez, y `bunx tsc --noEmit`.

### 1. Sin deriva del código de #173 en mobile-pet-tracker/
Comparado `git diff $(git merge-base 91b705ab origin/main) 91b705ab -- mobile-pet-tracker/` contra `git diff origin/main HEAD -- mobile-pet-tracker/`, fichero a fichero (líneas `+`/`-` ordenadas y hasheadas).
- 17 ficheros en el efecto neto de después; el mismo conjunto de antes salvo dos que ya no aparecen porque main los trae idénticos: `assets/fonts/Inter-ExtraBold.ttf` y `src/app/_layout.tsx` (los dos lados añadían el mismo registro de ExtraBold; el efecto neto de #173 sobre ellos desaparece). Ningún fichero nuevo en el neto.
- 12 ficheros con líneas `+`/`-` idénticas antes y después (`design-drift.test.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `card.test.tsx`, `pet-switcher.test.tsx`, `card.tsx`, `pet-switcher.tsx`, `catalog.ts`, `profile/index.test.tsx`, `profile/index.tsx`, `font-registration.test.ts`, `global-css.test.ts`).
- 5 ficheros difieren, todos en la lista permitida: `src/theme/global.css`, `consistency-classnames.test.ts`, `legibility-classnames.test.ts`, `profile-canvas-fidelity.test.ts` (E8) y `language-provider.test.tsx`. Las diferencias son solo las esperadas: en `global.css` desaparecen `--font-extrabold` y `--text-13` del neto (main ya los trae) y quedan `--radius-hero`, `--radius-tile` y `--text-26`; en los candados numéricos, la expresión de main más los deltas de #173; en `language-provider.test.tsx`, el pin `§2.27` pasa a `§2.29` y se apila `- 4 + 3` tras `+ 3 // #172 R16`; en `profile-canvas-fidelity.test.ts`, solo el `it` de `text-13`.
- Deriva: ninguna. Ningún fichero de producción de #173 (`profile/index.tsx`, `card.tsx`, `pet-switcher.tsx`, `catalog.ts`) cambia de efecto neto.
- Fuera de mobile: el efecto neto de #173 en docs/specs es el mismo salvo `requirements.md` (+5 líneas: E8, ver punto 4), `progress/` (informes) y `STATUS.md`/`progress/current.md` (resolución de leader).

### 2. Informe del implementer (fallback) contra el árbol
`progress/merge_main_mobile-tab-screens-canvas-fidelity.md` contrastado:
- `global.css`: `grep -cF` da 1 para `--text-13:`, `--text-15:`, `--text-17:`, `--text-26:`, `--font-extrabold`, `--radius-hero`, `--radius-tile` y `--text-2xs`; 5 para `--color-confetti-`. Sin duplicados.
- Inter-ExtraBold: una sola entrada en `src/app/_layout.tsx:35` y una sola `--font-extrabold`; 6 TTF de Inter en `assets/fonts/`.
- `global-css.test.ts`: los tres describe están (`#173 R2` línea 750, `#173 R2.3` línea 759, `#171 E4` línea 769) más `#172 R1` (línea 62). `git diff origin/main HEAD` del fichero no tiene ninguna línea `-`: no se perdió ni aflojó nada de main.
- `font-registration.test.ts`: describes `#173 R1` (4 its) y `#172 R6` (1 it) intactos; la única línea `-` es la firma de `readFileSync` ampliada a sobrecargas para `Buffer`, propia de #173 R1 y presente antes del merge.
- Aserciones de #171, #172, #173: las 20 líneas `-` de main en los seis ficheros son todas expresiones de candado reescritas con el delta de #173 (o la reescritura de #173 de los its de `ChevronRight` y del inventario de primarios con labio). Ninguna aserción de #171/#172 desaparece ni se afloja; los comentarios `// #171 R3`, `// #171 R14`, `// #172 R14` y `// #172 R19` se conservan.
- Marcadores de conflicto: `grep` de `<<<<<<<`/`>>>>>>>`/`=======` en src, app, assets, specs, docs, STATUS.md y feature_list.json: 0.
- Pequeña inexactitud del informe (no bloqueante): atribuye `+1 -1` de `primaryRadius` a «#171 R3 y R14, no verificada»; coincide con los comentarios del propio fichero. Los valores y su medición sí cuadran (punto 3).

### 3. Candados numéricos de consistency-classnames y sondas de mutación
Medición independiente con un script (mismo regex y mismo recorrido que el test, sin `__tests__` ni `*.test.*`) sobre `git archive origin/main` y sobre HEAD:

| Candado | main | HEAD | delta medido | Expresión del test en HEAD |
|---|---|---|---|---|
| `rounded-xl bg-accent(?=[\s'"\`])` | 19 | 18 | -1 (#173 R5) | `13+1*7-1-1` = 18 |
| `bg-accent-soft` | 16 | 15 | -1 (#173 R6) | `16+2+1-1-1-1-1` = 15 |
| `style={CONTINUOUS_CORNER}` | 36 | 29 | -7 (#173 R10, ProfileTile) | `31+1+4+1-1-7` = 29 |
| `\bborder-b-4\b` | 20 | 19 | -1 (#173 R5) | `19+1+1-1-1` = 19 |
| `border-black/25` | 20 | 19 | -1 (#173 R5) | `19+1+1-1-1` = 19 |

Cada valor es la expresión de main más el delta de #173, y la expresión de main reproduce el valor de main. `consistency-classnames.test.ts`: 69/69 verdes.

Sondas de mutación (extra en un fichero de pantalla o componente no-Perfil, jest dirigido, revertida con `git checkout HEAD --`, `git diff --quiet HEAD -- mobile-pet-tracker/` OK tras cada una):
- M1 `const __probe = 'rounded-xl bg-accent x';` en `src/screens/health/index.tsx`: 3 rojos (`#62 R1` botones primarios en un solo radio, `#98 R10`, `#166 R2` inventario de dieciocho primarios).
- M2 `bg-accent-soft` extra en `src/components/pet-switcher.tsx`: 2 rojos (`#64 R9` y `#98 R10`).
- M3 `style={CONTINUOUS_CORNER}` extra en `src/components/card.tsx`: 1 rojo (`#98 R10`). Lo ve el recuento global de `#98 R10`; el recuento por ficheros de `#62 R14` no se movió, y no hace falta.
- M4 `border-b-4 border-black/25` extra en `src/screens/login/index.tsx`: 1 rojo (`#166 R2` receta del labio fuera de un primario).
Los cuatro candados se ponen rojos con una clase colada. `legibility-classnames.test.ts` (27/27) y `language-provider.test.tsx` (36/36) en verde; `+1 -1 +1 +1` de #173 apilado tras `+ 1 // #172 R19` en el total de `inkSites` y `- 4 + 3, // #173 R13` tras `+ 3 // #172 R16` en las claves.

### 4. E8
- Texto: `requirements.md` R2.4 (línea 182) y fila E8 de la tabla (línea 950) ya están commiteados en el merge. R2.4 pasa de «`text-13` solo en Perfil» a «inventario cerrado de seis ficheros»; `text-26` sigue en Perfil.
- Test: el `it` lista exactamente `components/form-error.tsx`, `screens/forgot`, `screens/login`, `screens/profile`, `screens/register`, `screens/reset-password`, en el orden de `filesMatching`. El `it` de `text-26` no cambió (`git diff` sin líneas `-` ahí).
- Mutaciones (todas revertidas): `text-13` en un séptimo fichero (`screens/health/index.tsx`) rojo; `text-13` reemplazado por `text-sm` en `form-error.tsx` rojo; lo mismo en `profile/index.tsx` rojo (el inventario se cierra por los dos lados); `text-26` en `screens/health/index.tsx` rojo en el `it` de `text-26` y el de `text-13` sigue verde. Control con comentario sin efecto: 26/26 verdes.
- Valoración: es una corrección de hecho, no un ensanchamiento. La premisa «solo Perfil» se midió en la base H0 y #172 no había mergeado; tras el merge `text-13` ya vive en esos cinco ficheros, que #173 no escribe. E8 no afloja a regex ni a prefijo: lista seis ficheros exactos y conserva la propiedad que importa (ningún séptimo fichero usa `text-13` ni ninguno distinto de Perfil usa `text-26`). Lo que sí cambia es el sentido del candado: de «reserva» a «inventario cerrado» con granularidad de fichero, así que un uso extra de `text-13` dentro de uno de los cinco ficheros de #172 (o un segundo uso en Perfil) ya no lo detecta este test; añadir o quitar un fichero del conjunto sí lo pone rojo. Queda como el resto de E1 a E7: enmienda factual sin casilla humana propia (O4 de la ronda 1). Conviene que el humano la lea en la PR, sobre todo porque edita texto normativo de R2.4.

### 5. Docs
- `docs/ui-guidelines.md`: enmiendas en orden `#167`, `#168`, `#171` (línea 527), `#172` (558), `#173` (597); la casilla `- [X] Enmienda #173 aprobada por humano` (línea 609) intacta.
- `specs/mobile-ui-language/design.md`: `### §2.27` (#171, línea 965), `### §2.28` (#172, 974), `### §2.29 — Añadidos por #173 — Perfil fiel al canvas` (983, claves `profile.gpsLinked`, `profile.gpsNoCollar`, `profile.gpsCollar`) y a continuación `## 3. La infraestructura` (991). Las cuatro retiradas siguen marcadas `← retirada por #173 (R13)`.
- `language-provider.test.tsx` pina `### §2.29 — Añadidos por #173 — Perfil fiel al canvas`. Sonda: cambiar la cabecera a `§2.27` en `design.md` pone rojos los tres its `declara profile.gps* ...`; revertida.
- Observación menor (no bloqueante): `docs/ui-guidelines.md` línea 74 atribuye a #173 los tokens `--text-13` y `--text-26`, pero `--text-13` ya lo declaró #172 (junto con `--text-15` y `--text-17`, que la carta no menciona). El test de #173 R14 solo exige las dos cadenas, así que es una imprecisión de redacción, no de comportamiento.

### 6. Ediciones de cierre sin commitear
`git diff HEAD` en el working tree: `feature_list.json` (una línea, `"status": "in_progress"` a `"done"` en #173), `design.md` y `tasks.md` de la spec (solo el frontmatter `draft` a `approved`) y `traceability.md` (solo la fila R16, de `pendiente` a «prueba de humo en dev build de Android (humano)» con el commit `36abb01c`). `git diff --quiet HEAD -- mobile-pet-tracker/` da 0: no tocan código. Tras la edición, `traceability.md` no tiene ninguna fila «pendiente» (la única aparición de la palabra es la línea de regla). `36abb01c` existe y es ancestro de HEAD (commit del humano del 2026-10-14).

### Observaciones
Ninguna bloqueante.
- R16: el humano marcó la casilla de la prueba de humo, pero dejó vacío el campo `temas:` de la línea 966 de `requirements.md` (`... dispositivo: OnePlus Nord 5, temas:)`). R16 pedía claro y oscuro, es y en. Es su firma; el leader puede confirmarlo con el humano antes de la PR.
- Las deudas O1, O2, O3, O4 y O6 de la ronda 1 siguen igual (no las toca el merge). O3: el frontmatter de `traceability.md` ya está `approved` en HEAD.
- `specs/mobile-tab-screens-canvas-fidelity/mcheck.py` (script suelto de la spec) ya existía en `91b705ab`; no es del merge.

### Output de ./init.sh (leído, no ejecutado por el reviewer)
Log del leader sobre HEAD `51254654` con las ediciones de cierre presentes: `.../scratchpad/h173/init-merge-173.log`, línea 47717 `Todo verde. Listo para trabajar.`, `Features: 162/176 completadas`. `grep -c "reading 'canceled'"` da 0.
```
Test Suites: 187 passed, 187 total   (backend unitarios)   Tests: 1474 passed
Test Suites: 2 passed, 2 total       (backend e2e)         Tests: 14 passed
Test Suites: 110 passed, 110 total   (mobile)              Tests: 3389 passed, Snapshots: 1 passed
Test Suites: 3 skipped, 30 passed, 30 of 33 total          Tests: 8 skipped, 468 passed, 476 total
```
Verificación propia del reviewer: jest dirigido, uno a uno, en verde (`consistency-classnames` 69, `global-css` 58, `font-registration` 8, `legibility-classnames` 27, `language-provider` 36, `profile-canvas-fidelity` 26); `bunx tsc --noEmit` exit 0 sin salida. Working tree de `mobile-pet-tracker/` idéntico a HEAD tras todas las sondas.
