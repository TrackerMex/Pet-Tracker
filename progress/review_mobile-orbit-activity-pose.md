# review: mobile-orbit-activity-pose (#225)
Fecha: 2026-10-28
Veredicto: APROBADO

Revisado sobre `feature/225-mobile-orbit-activity-pose`, HEAD `3b698dc5`, worktree
`/home/claude/sites/Pet-Tracker-wt-225`. H0 `3e9c76ae`. Lo implementó el subagente
`implementer` (fallback de CLAUDE.md §Excepciones): cada afirmación del reporte se
verifica contra el árbol y la historia.

## Checklist C2 — Estado coherente
- [x] Máximo 1 feature in_progress: `feature_list.json` no tiene ninguna `in_progress`
  (#221 `spec_ready`, #225 `pending`). Ver H4.
- [x] `progress/current.md` describe la sesión activa: el fallback al `implementer` para #225.
- [x] Ninguna feature pasa a `done` en esta rama.

## Checklist C3 — Arquitectura
- [x] Feature solo de la app móvil. Ningún fichero de `backend-pet-tracker/` en
  `git diff --name-only 43a9ed33..HEAD` (69 ficheros). Tampoco en `3e9c76ae..HEAD`,
  donde solo se añade `progress/current.md` del handoff.
- [x] La estructura route delgado + `src/screens/` se respeta. `homeOrbitPose` vive en
  `src/screens/home/orbit-phrase.ts` junto a `homeOrbitPhrase`, donde R6 lo pide.
  `index.tsx` solo elige la fuente.
- [x] Sin dependencias nuevas: `package.json`, `bun.lock`, `app.json`, `app.config.ts`,
  `ios/` y `android/` no aparecen en el diff.
- [x] Lista cerrada del handoff respetada. El único fichero fuera de
  `mobile-pet-tracker/`, `specs/` y `docs/ui-guidelines.md` es `progress/current.md`, y
  lo tocó el commit de handoff `43a9ed33` del leader. `git status` solo muestra este reporte.

## Checklist C4 — TDD
- [x] Cada R1–R9 tiene al menos un test que lo nombra. Los títulos coinciden letra a
  letra con los de requirements.md y traceability.md.
- [x] El historial va test primero. Los rojos C1 `e42d4a72`, C3 `ee6645be`, C5 `8825994b`,
  C7 `ea5c6608`, C9 `f1066e52` y C11 `3954a658` solo tocan ficheros de test
  (`git show --stat`). C13 `9d1655a5` es el commit propio de R9 (fe de erratas E1) y no
  tiene rojo.
- [x] Dos rojos reproducidos en un worktree temporal
  (`git worktree add --detach <scratch>/rv225 <hash>` + symlink de `node_modules`; luego
  `git worktree remove`; `git worktree list | grep -c rv225` da 0):
  - **C3 `ee6645be`.** `bunx jest src/__tests__/orbit-rename.test.ts` da exit 1, 5 failed
    y 2 passed. Los cinco rojos son `toEqual` o `toBe` (`Expected: true / Received: false`).
    Hay 0 `TypeError`, `ReferenceError`, `Cannot find module` o `SyntaxError`. Los dos
    verdes son R2 (verde desde C2) y el segundo `it` de R4, que nace verde como declara
    tasks.md. El rojo de R4 trae `+ Received + 260`, es decir, 258 entradas más las dos
    líneas de `Array [ … ]`. Coincide con la cifra del reporte.
  - **C9 `f1066e52`.** Con `orbit-activity-pose`, `ui-language`, `language-provider` y
    `home/index.test.tsx`: exit 1, 6 failed y 480 passed. Los seis son de aserción
    (5 `toEqual` y 1 `toHaveLength`), sin excepciones:
    - #194 R1 (enmendado por #225 R1);
    - #225 R1;
    - #71 R11 (enmendado por #225 R1);
    - #65 R18, el de cada ocurrencia contra su clave;
    - R7 distancia;
    - R7 distancia con comidas.

    Los dos `it` de `talk` de R7 nacen verdes, como declara tasks.md (línea 137).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` tiene R1–R9 rellenas y ninguna fila «pendiente». Los hashes
  coinciden con `git log 3e9c76ae..HEAD`.
- [x] Los commits siguen `test(mobile)`, `feat(mobile)` y `docs(spec)`/`docs(ui)` con
  sus R-ids y `(#225)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved`, firma delegada del leader en `2e7902ed` y
  G4 del humano en `5c69aafe`. Después de H0 la historia de requirements.md no tiene más
  commits: E1 `00d11399` y la re-verificación `3e9c76ae` son anteriores. E2 `bb43a455`
  solo toca design.md §6 y tasks.md C9.
- [ ] Smoke G2 (humano) sin marcar: es un gate posterior y no bloquea la review. Bloquea
  el `done`.

## Checklist C7 — Sin código huérfano
- [x] Lo reemplazado se mueve con `git mv`:
  - las 9 poses, renombradas al 100 %;
  - `pingo-float.tsx`, `pingo-phrase.ts` y sus tests, de 54 % a 85 %;
  - `theme/pingo-stage.ts`, que aparece como D más A `orbit-stage.ts`.

  `find src -iname '*pingo*'` solo da `src/__tests__/home-pingo-phrase.test.ts`, que
  requirements.md (línea 70) conserva a propósito.
- [x] Ningún asset borrado: `orbit-talk.webp` sigue en uso (R8).

## Checklist C8 — Carta de UI (feature móvil)
- [x] Sobre las líneas `+` de `src/` y `app/` del diff, todas a 0:
  - `StyleSheet.create`;
  - `virtual: true`;
  - clases arbitrarias `-[`;
  - emoji;
  - hex fuera de `src/theme/`, quitando los ids `#NNN`.
- [x] Ningún `#225` en los 18 ficheros de producción tocados
  (`xargs grep -Hn '#225'` da exit 123).
- [x] La imagen de Inicio, R7:
  - es `Image` de `expo-image`, con `style={{ width: 56, height: 56 }}` y sin `className`;
  - `source={ORBIT_POSE_SOURCE[orbitPose]}` sale de una constante de módulo con dos
    `require` estáticos;
  - `grep -c "t('home.orbitWalkLabel'"` da 1.
- [x] La carta (R9): el script de medida de requirements.md R9 no imprime nada.
  `grep -c '^## Enmienda' docs/ui-guidelines.md` da 31 y no cambia. El párrafo nuevo es
  idéntico al literal de R9.

## Verificación independiente
- `bunx tsc --noEmit` (desde `mobile-pet-tracker/`): exit 0, sin salida.
- `bunx eslint` sobre los 51 `.ts` y `.tsx` añadidos o modificados en
  `43a9ed33..HEAD`: exit 0 con log vacío.
- Jest focalizado, 8 suites: 202 tests y exit 0. Son las suites de R1–R9 y las de los
  candados enmendados.
- R5, procedencia: `uvx --with pillow` con el comando de design.md §7 genera en el
  scratchpad una conversión del maestro idéntica byte a byte al `orbit-walk.webp`
  commiteado. Lo confirman `cmp` y sha256 `12c52706e7b5cc71…`, con 65182 B.
- Candados enmendados. Cada sufijo `(enmendado por #225 …)` sale una sola vez y al final
  del nombre:
  - `#194 R1` y `#167 R5` en language-provider, con `key`/`designKey`;
  - `#71 R11` en ui-language;
  - `#221 R3 (R2, R3)` y `#221 R1 (R3)` en orbit-rename-copy;
  - `no mete otras poses de Pingo (R2, R5)` en welcome, con la lista de 10 en orden;
  - `#190 R4 (R7)` en home;
  - `#221 R4 (R9)` en orbit-charter-voice;
  - el segundo `it` de R4 (R9).

  Las cifras se escriben como base + delta: `+ 1, // #225 R1` y
  `toHaveLength(21 + … + 1 + 1); // +1 #225 R1`.
- Los literales de test están escritos a mano: las tablas de `renamedKeys`, los valores
  en y es, la fila de `R3_HOME` y la fila de §2.39. Ningún test de #225 importa de
  producción el valor que compara.
- `specs/mobile-ui-language/design.md` §2.39 tiene 8 filas, 7 renombradas y 1 añadida.
  La fila de R1 es la última.
- `specs/mobile-home-pingo-phrase/requirements.md` cambia en 2 líneas: la fila H3 y R4.
  §Aprobación no se toca.

## Mutaciones

Todas las planta el reviewer con `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/rv225_mut.sh <id>`. El script:
1. copia el fichero a un backup;
2. aplica la mutación;
3. corre jest;
4. restaura el backup.

Tras cada una, `git diff --quiet` da exit 0 y `git status --short mobile-pet-tracker docs specs` sale vacío. El log de cada una está en `rv225_mut_<id>.log`, y la salida de jest en `rv225_jest_<id>.log`, los dos en el mismo scratchpad. M3, M5, M8, M11 y M12 y la del maestro de R5 están en el reporte del implementer y no se repiten.

| Id | Mutación (comando) | Suites | Resultado |
|---|---|---|---|
| M1 | `sed -i '652s/reset-orbit-float/reset-pingo-float/' src/screens/reset-password/index.test.tsx` | orbit-rename, reset-password | exit 1, 1 failed y 63 passed. Rojo solo «#225 R4: el código de test solo nombra a Pingo…». La suite de reset sigue verde: el negativo vacuo no lo detecta nadie más. 0 excepciones |
| M2 | `printf '// pingo\n' >> src/components/orbit-float.tsx` | orbit-rename | exit 1, 1 failed. «#225 R3: el código de producción no nombra a Pingo ni en contenido ni en rutas» |
| M4 | `orbit-phrase.ts`: `… \|\| labelKey === 'home.orbitPhraseMeals' ? 'walk'` | orbit-phrase, home/index | exit 1, 3 failed: R6 `home.orbitPhraseMeals → talk`, R6 `distancia 99, comidas {"served":1,"total":2} → talk` y R7 «vuelve a la pose base sin etiqueta cuando la frase es de comidas» |
| M6 | `index.tsx`: `style={{ width: 56, height: 56 }}` pasa a `className="h-14 w-14"` | home/index | exit 1, 5 failed: los 4 `it` de R7 y `#190 R4 … (enmendado por #225 R7)` |
| M7 | `uvx --with pillow` reescribe `orbit-walk.webp` con `.convert('RGB')` | orbit-activity-pose | exit 1, 1 failed: R5 «orbit-walk.webp es WebP VP8X con alfa…» |
| M9 | `sed` devuelve `(H3 pendiente: pose placeholder.)` a la spec de #190 | orbit-activity-pose | exit 1, 1 failed: «#225 R8: la hipótesis H3 de #190 queda cerrada» |
| M10 | `sed` borra la fila `{ file: 'src/screens/home/index.tsx', key: 'home.orbitWalkLabel' },` de `ui-copy-table.ts` | orbit-activity-pose, ui-language | exit 1, 2 failed: #225 R1 y `#71 R11 … (enmendado por #225 R1)` |
| B1 (zona ciega) | `cp assets/images/orbit-talk.webp assets/images/orbit-walk.webp` | orbit-activity-pose, orbit-rename, welcome, home/index | **exit 0, 433 passed.** Ver H1 |
| B2 (zona ciega) | `index.tsx`: `t('home.orbitWalkLabel')` pasa al literal `'Orbit caminando'` | home/index, ui-language, orbit-activity-pose | exit 1, 3 failed: #71 R11, #65 R18 «resuelve cada ocurrencia…» y #194 R5 «no deja ningún valor fijo del catálogo como literal…». R7 sigue verde, porque la etiqueta es la misma, pero el copy suelto lo cazan los candados de #65 |
| B3 (zona ciega) | Fichero nuevo `src/components/pingo-badge.tsx` con `export const BADGE_SIZE = 12;`, cuyo contenido no nombra a Pingo | orbit-rename | exit 1, 1 failed: R3 «… ni en contenido ni en rutas». La ruta sola basta |

Todos los rojos son por aserción: 0 `TypeError`, `ReferenceError`, `Cannot find module` o `SyntaxError` en cada log.

## Decisiones del implementer, contrastadas con la spec

- **`orbitPose` junto a `orbitPhrase`.** design.md §6 la pone «dentro del bloque que ya pinta
  la burbuja». Ese bloque es un ternario JSX, así que va en el cuerpo del componente:
  `orbitPhrase !== null ? homeOrbitPose(orbitPhrase.labelKey) : 'talk'`. Cuando
  `orbitPhrase` es `null` la burbuja no se pinta, así que la rama `'talk'` de respaldo no
  se ve nunca. El comportamiento es equivalente: M4, M5 y M6 lo cubren. Aceptada.
- **Un solo sufijo con dos R-ids.** `(enmendado por #225 R2, R3)` y `(… R2, R5)` siguen el
  precedente del repo: `(enmendado por #214 R11, R17)` en sheet-surface-background y
  `(enmendado por #201 R5, R13)` en design-drift. Así cumplen «una sola vez al final». Aceptada.
- **258 líneas en R4 frente a 257.** El `it` quita solo el literal de título y sigue
  escaneando los argumentos de `it.each`. Es más estricto que el script del paso 3 de
  §Re-verificar, y la diferencia es una sola línea, la que R3/C8 pide reapuntar. El rojo
  reproducido en C3 da 258. Aceptada.
- **Líneas de test con `#225` sin `R<n>`.** Hay **seis**, no las cinco que dice el reporte.
  Las cinco del reporte son `orbit-rename.test.ts:112` y `:114` y
  `orbit-activity-pose.test.ts:51`, `:52` y `:61`. La sexta es
  `orbit-charter-voice.test.ts:25`, el literal de la nota de R9 que entró en C13.
  Todas son literales de documento que la spec prescribe y ninguna está en producción.
  Ver H2.
- **Celda H3 sin punto antes de «Cerrada».** R8 pide que la fila «gane al final»
  ` Cerrada por #225 (R8).`, y el implementer lo puso tal cual dentro de la última celda,
  antes del `|`, para no romper la tabla. El literal cumple. La frase queda
  `… y su test Cerrada por #225 (R8).`. Ver H3.
- **`as TranslationKey` en C7.** Hay dos casts nuevos en `orbit-phrase.test.ts`, en las
  líneas 112 y 117, sobre literales escritos a mano. En C7 `home.orbitWalkLabel` todavía
  no existía (llega en C10), así que sin cast `tsc` fallaba. El cast no vuelve
  tautológico el candado: la clave sigue siendo un string literal y no un símbolo
  importado. La fila de `ui-copy-table.ts` va sin cast, como pide E2. `eslint` en HEAD
  sale 0. Aceptada.

## Observaciones (deuda, no bloquea)

- **H1, severidad media: la procedencia de `orbit-walk.webp` no tiene candado.** R5 pide
  el fichero «convertido desde el maestro con el comando de design.md §Conversión», pero
  los dos `it` de R5 solo miran el formato (cabecera, alfa, tamaño y peso) y la cabecera
  del PNG maestro.
  - Con B1, que copia `orbit-talk.webp` sobre `orbit-walk.webp`, las cuatro suites quedan
    verdes (433 passed), y Home pintaría la pose de hablar cuando Orbit camina.
  - No rechazo por esto, por tres motivos:
    1. La spec fija la lista de aserciones de R5 y el implementer la cumple literal.
    2. Volví a correr la conversión de §7 y sale idéntica byte a byte al fichero
       commiteado (`cmp`, sha256 `12c52706e7b5cc71…`). La propiedad se cumple hoy.
    3. El smoke G2 en dispositivo la ve.
  - Propuesta para el leader: una enmienda que fije en el `it` de R5 el sha256 del webp,
    escrito a mano, y el del maestro. Otra opción es dejarlo explícito en los pasos de G2.
- **H2, baja.** El reporte cuenta cinco líneas `+` de test con `#225` sin `R<n>`, y son
  seis: falta `orbit-charter-voice.test.ts:25`. Es un error del reporte, sin efecto en el
  código.
- **H3, baja, cosmética.** La fila H3 de #190 queda `… y su test Cerrada por #225 (R8).`,
  sin punto entre «test» y «Cerrada». El candado de R8 sigue verde con o sin él.
- **H4, baja, del leader.** `feature_list.json` sigue con #225 en `pending` en esta rama.
  Pasar a `done` exige además la casilla G2 del humano.
- **H5, baja.** M1 confirma que fuera de R4 nadie caza los negativos vacuos
  (`queryByTestId('reset-pingo-float')` → `toBeNull()`). R4 lo cubre, como está diseñado.

## Output de ./init.sh

No lo corrí. La consigna del leader lo prohíbe porque comparte LocalStack y Postgres con
otros worktrees (memoria «init.sh del reviewer denegado»). Lo corrió el leader sobre
`3b698dc5`, y el árbol no ha cambiado desde entonces: HEAD sigue en `3b698dc5` y
`git status` solo muestra este reporte. Log:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/init_225.log`.

```
Test Suites: 198 passed, 198 total        # backend
Tests:       1650 passed, 1650 total
Test Suites: 2 passed, 2 total            # backend, segunda tanda
Tests:       14 passed, 14 total
Test Suites: 178 passed, 178 total        # móvil
Tests:       6540 passed, 6540 total
Test Suites: 3 skipped, 32 passed, 32 of 35 total   # e2e
Tests:       8 skipped, 592 passed, 600 total
exit 0
```

Los 54 marcadores «●» del log son todos `● Console`. No hay ningún test en rojo.
