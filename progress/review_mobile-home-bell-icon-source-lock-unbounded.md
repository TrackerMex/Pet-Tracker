# review: mobile-home-bell-icon-source-lock-unbounded (#124)
Fecha: 2026-09-25T16:58Z
Veredicto: **APROBADO**

- Worktree: `/home/claude/sites/Pet-Tracker`. Branch:
  `feature/124-mobile-home-bell-icon-source-lock-unbounded`. HEAD revisado:
  `6cd6ea20785a3c7f8b6953888ce74130855b2089`, comprobado al empezar y al
  terminar. Es el merge de `origin/main` `b602ff6e` (#125) sobre los cuatro
  commits de Codex (`a6212f9e..205b126d`). `origin/main` coincide con el
  merge-base (`b602ff6e`).
- Todo lo de este informe lo he medido yo. El reporte de Codex solo me ha servido
  de índice. El rojo, el verde y las 21 sondas los he corrido en un worktree
  temporal del scratchpad (`rev124/wt`, HEAD separado, `node_modules` enlazado),
  ya eliminado (`git worktree remove`, exit 0). El worktree principal ha quedado
  limpio (`git status --short` vacío).
- `./init.sh` no lo he corrido: el clasificador se lo deniega al subagente
  (memoria «init.sh del reviewer denegado»). Lo corrió el leader. He leído su
  log, su HEAD y su exit (ver §Output de ./init.sh).
- Skill `expo:expo-overview` cargada al empezar, por la regla del repo.

## Checklist C2 — Estado coherente
- [x] Como mucho una feature `in_progress`: hay **cero**. #124 sigue en
      `spec_ready` (ver Obs. 1). `init.sh` lo confirma: «Sin features en
      progreso (sesión limpia)».
- [x] `progress/current.md` describe la sesión activa de #124: branch, base,
      blobs, espejo Notion, fase, punto 3 de la firma y el pendiente (F).
- [x] `STATUS.md` sincronizado con `feature_list.json`, según `init.sh`.

## Checklist C3 — Arquitectura
- [x] N/A por capas: el cambio es solo de test y docs. El diff acumulado de
      producción es vacío (R4). Ninguna línea añadida a `index.test.tsx` es un
      `import` (0).
- [x] domain / application / infrastructure: sin cambios.
- [x] Sin lógica de negocio nueva en ninguna capa.

## Checklist C4 — TDD (vía b: mutación de producción versionada en el rojo)
- [x] R1 tiene test que lo nombra: el `describe`
      `'#124 R1: el icono de la campana se pinta con la tinta muted'`, anidado en
      `#78 R10`, con `sin alertas abiertas` y `con alertas abiertas`. R2 se
      cierra con esos tests ante las sondas. La spec declara por escrito, antes
      del handoff, que R3 y R4 no tienen test (`requirements.md` punto 9 y
      `traceability.md`).
- [x] El historial va test primero. Blobs por commit (index.tsx / index.test.tsx /
      conventions.md), todos iguales a los de tasks.md:
      - base `f45b71f3`: `dbb5b034` / `60c0c013` / `23df873f`
      - R1 rojo `a6212f9e`: `70f48f70` (B2) / `b735c105` / `23df873f`
      - R1 verde `b2a9b630`: `dbb5b034` / `b735c105` / `23df873f`
      - R3 `a5ad104d`, `205b126d` y `6cd6ea20`: `dbb5b034` / `abbdb5b8` / `cb3c5253`
- [x] He re-ejecutado el rojo yo mismo (`a6212f9e`): `exit=1`,
      `Tests: 2 failed, 142 passed, 144 total`. Fallan solo
      `#78 R10 › #124 R1 … › sin alertas abiertas` (index.test.tsx:280) y
      `… › con alertas abiertas` (:296). Los dos fallan por
      `expect(received).toBe(expected)` con `Expected: "--color-muted"` y
      `Received: "--color-accent-strong"`. El `it` `#121 R1` sale `✓`. Hay
      0 `ReferenceError` y ningún otro test cae.
- [x] El verde lo he re-ejecutado yo mismo (`b2a9b630`): `exit=0`,
      `Tests: 144 passed, 144 total`. `b2a9b630` solo toca `index.tsx` y lo
      devuelve al blob `dbb5b0346895cfc26705bee2257d1f8a8815df6c`.
- [x] La mutación es de **producción**, no del doble: `a6212f9e` toca
      `src/screens/home/index.tsx` (B2 exacta de tasks.md §R1 (0)) y el test.
- [x] Los cuatro mensajes de commit coinciden literalmente con tasks.md, y cada
      commit toca exactamente los ficheros que tasks.md le asigna.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». La única aparición de
      la palabra es la regla de la línea 19. El diff contra la firma `d79017a2`
      muestra que solo cambiaron las celdas «pendiente», sustituidas por hashes.
      La celda N/A de R3 se conserva, como pedía el handoff.
- [x] Los cuatro hashes citados (`a6212f9e`, `b2a9b630`, `a5ad104d` y
      `205b126d`) son ancestros de HEAD: `git merge-base --is-ancestor` da exit 0
      en los cuatro. No hubo rebase, solo un merge de `origin/main`.
- [x] Formato de commit: `test(mobile): … (R1)` y `docs(mobile): … (R3)` /
      `(R2,R4)`. Es la convención que declara la propia `traceability.md`, en vez
      de `feat(`, como en #109, #112, #121 y #122.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla humana marcada
      con fecha 2026-09-25. La firma es `d79017a2`, vía Notion: página, estado
      del gate y `page_last_edited_at` citados en el mensaje del commit.
- [x] Desde `d79017a2`, `requirements.md`, `design.md` y `tasks.md` no han
      cambiado (`git diff --stat d79017a2 HEAD`). Solo `traceability.md` cambió,
      y solo en sus celdas de commit.

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza nada existente. Añade un `describe` de dos
      `it`, un comentario y un párrafo de docs.

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] Se cumple de forma trivial: no hay cambio de UI. El diff acumulado de
      producción es vacío (dos puntos y tres puntos, exit 0), y en
      `mobile-pet-tracker/` el diff solo contiene `src/screens/home/index.test.tsx`
      (43 inserciones, 0 borrados).
- [x] Guard `src/__tests__/design-drift.test.ts` verde: 55/55 en HEAD. La regex
      del guard (`HEX_LITERAL` más `text-[10px]` y `StyleSheet`, bandera `i`)
      aplicada al fichero entero no casa nada. `StyleSheet` aparece 0 veces. En
      las líneas añadidas, la única cita `#`+número es `#124 R1` (4 veces).
- [x] Codex no cargó skills, como exigía el handoff.

## Verificaciones por ítem del encargo

1. **C4 vía b:** ver C4. Rojo y verde reproducidos en el worktree temporal. Los
   dos fallos del rojo son exactamente los que exige tasks.md §R1 (1).
2. **R4, cero diff de producción:**
   `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
   da 0, y la forma de dos puntos también.
   - `HEAD:index.tsx` = `dbb5b0346895cfc26705bee2257d1f8a8815df6c` = `origin/main`.
   - `a6212f9e:index.tsx` = `70f48f701a86173ff08d9259f6a34d6b3aba6a96`.
   - Test en HEAD: `abbdb5b87f0b96bda465cc2dacb98937ef7aaf78`.
   - `docs/conventions.md` en HEAD: `cb3c52532df6e9703fd965fc3d810c8eadace191`.
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` solo lista
     `src/screens/home/index.test.tsx`.
3. **R2, las 21 sondas (no solo la muestra):** las he corrido todas sobre HEAD
   `6cd6ea20`, con un script propio que:
   - aplica cada mutación por sustitución única, asertando que el texto viejo
     aparece una sola vez;
   - comprueba el blob contra tasks.md §R2: 21/21 coinciden;
   - corre `bunx jest --runTestsByPath src/screens/home/index.test.tsx --json`
     (1 suite por corrida);
   - clasifica los fallos por test y por matcher;
   - restaura producción, asertando el blob `dbb5b034`, antes de la siguiente.

   Resultado: **21/21 dan el veredicto «Exigido»**, en pasan/fallan, en qué
   `it` cae y en su matcher. No hay ningún `ReferenceError`.

   | Sonda | Pasan / fallan | Fuente | sin | con | Otros |
   |---|---|---|---|---|---|
   | B1 | 141 / 3 | `toContain` | `toBe` | `toBe` | 0 |
   | B2 | 142 / 2 | verde | `toBe` | `toBe` | 0 |
   | B2p, B2f, B2i, B2j, B2c, B2t, B2s y B3 | 142 / 2 cada una | verde | `toBe` | `toBe` | 0 |
   | B4 | 143 / 1 | verde | verde | `toBe` | 0 |
   | B4r | 143 / 1 | verde | verde | `toBe` | 0 |
   | B5 | 143 / 1 | `toContain` | verde | verde | 0 |
   | B5d | 144 / 0 | verde | verde | verde | 0 (límite documentado) |
   | B6 | 143 / 1 | `toContain` | verde | verde | 0 |
   | B6d | 144 / 0 | verde | verde | verde | 0 (límite documentado) |
   | T1 | 141 / 3 | verde | `toBe` | `toBe` | 1: `#70 R8 … dibuja un estado vacío con forma de fila cuando no hay vacuna` (`toBe`) |
   | F1 | 143 / 1 | `toContain` | verde | verde | 0 |
   | F2 | 144 / 0 | verde | verde | verde | 0 |
   | F3 | 143 / 1 | `toContain` | verde | verde | 0 |
   | W2 | 144 / 0 | verde | verde | verde | 0 (la (F), fuera de alcance) |

   Coincide fila a fila con la tabla del reporte de Codex.
4. **R3, literales:**
   - El comentario de cuatro líneas está justo encima de
     `expect(source).toContain('<Bell size={24} color={muted} />');`, con 4
     espacios, y la aserción no cambia (ver Obs. 4).
   - El párrafo de `docs/conventions.md` coincide byte a byte con tasks.md
     §R3 (2). Está entre `como arriba.` + línea en blanco y
     `### Esperas sobre el árbol renderizado`. El diff de conventions es de 11
     inserciones y 0 borrados.
   - Greps de §R3 (3):
     - `'#124 R'` → 4
     - `mockImplementation((token) => token)` → 6
     - `'--color-muted'` → 4
     - `se pinta con la tinta muted` → 1 en el test y 1 en conventions
     - la línea `toContain` → 1
   - Guard de drift 55/55 y el fichero del candado 144/144 en HEAD (una corrida
     de dos suites: `Tests: 199 passed`, exit 0).
5. **Candado no tautológico:** el valor esperado es el literal `'--color-muted'`,
   escrito dos veces en el test. No se importa nada nuevo: hay 0 `import`
   añadidos, y ni `useThemeColors` ni ningún símbolo de producción aparece en el
   bloque. La prueba práctica es T1: si se cambia el token de la lista de
   producción, los dos `it` de R1 caen por `toBe`.
6. **R1, colocación y resto del fichero:**
   - El `describe` es el literal de tasks.md §R1 (1), byte a byte.
   - Está dentro de `#78 R10`, entre el `it` `#122 R2` y
     `no pinta campana cuando no hay mascotas`, con una línea en blanco a cada
     lado.
   - El diff acumulado del fichero es de 43 inserciones y 0 borrados (39 del
     `describe` y 4 del comentario), así que el resto queda idéntico.
   - El `it` `#121 R1` conserva su título, su ancla, su recorte y sus cinco
     aserciones.
7. **Ficheros vedados:** los commits de Codex solo tocan `index.tsx` (en el par
   rojo→verde), `index.test.tsx`, `docs/conventions.md`, `traceability.md` y el
   reporte. En `origin/main..HEAD`, `current.md`, `history.md`, `STATUS.md` y
   `feature_list.json` solo los tocan los commits del leader (`b1469b84`,
   `926a30f4`, `33fed367`, `d79017a2` y `f45b71f3`) y el merge `6cd6ea20`.
   `design-drift.test.ts`, `catalog.ts`, `language-provider.test.tsx`,
   `package.json`, `bun.lock` y las specs de #121 y #122: ningún commit de la
   branch los toca.
8. **Merge `6cd6ea20`:** su diff de primer padre (16 ficheros de #125) no incluye
   `src/screens/home/`, `docs/conventions.md`, `design-drift`, el catálogo ni
   `language-provider` (grep exit 1). La trazabilidad sigue siendo válida.

## Observaciones

Ninguna es bloqueante.

1. **(menor, estado, del leader)** #124 sigue en `spec_ready` en
   `feature_list.json`. Es una decisión explícita, anotada en
   `progress/current.md` para no chocar con el `in_progress` de #125 en
   `init.sh`, igual que en #121 y #122. Al cerrar, el leader la pasa a `done`
   con este veredicto (`AGENTS.md` §7.2).
2. **(informativa, (F) de la spec)** He medido W2 y da 144/144 en verde:
   `#69 R9: usa iconos de reicon y ningún emoji` sigue contando los iconos de
   las celdas sobre todo `index.tsx`, y una copia señuelo le presta el verde.
   Está fuera de alcance por la spec. Registrarlo con id contra `origin/main`
   queda para el leader.
3. **(informativa)** El residuo B5d/B6d sigue en verde, tal como firmó el humano
   en el punto 3. F2 también sigue en verde, como exige la spec: la campana está
   sana y no aparece ningún rojo falso nuevo.
4. **(informativa, para el spec_author)** El bloque `diff` de tasks.md §R3 (1)
   pinta el contenido con 2 espacios de más: las líneas de contexto
   `expect(block)` y `);` salen a 6 espacios, cuando en el fichero están a 4. La
   prosa aclara «4 espacios de sangrado, como la aserción», y Codex siguió la
   prosa. El blob `abbdb5b8` de la spec confirma que es lo correcto. No hace
   falta ninguna acción aquí, pero un literal que se presenta como byte a byte
   debería serlo.
5. **(informativa)** Los commits son `test(mobile)`/`docs(mobile)` en vez de
   `feat(`. Lo declara la propia `traceability.md`, así que no es una
   desviación.

## Output de ./init.sh

Lo ejecutó el leader sobre `205b126d91b4b3e1cada46325b8e5055523c9e06` (HEAD
previo al merge), con el árbol limpio (`init124.status` vacío). Log:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/c1edfdc1-1af4-41a9-b58e-c094475189fd/scratchpad/init124.log`.
Exit medido sin pipe: `exit=0` (`init124.exit`).

```
✅ Sin features en progreso (sesión limpia)
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 170 passed, 170 total          (backend unit)
Tests:       1298 passed, 1298 total
Test Suites: 83 passed, 83 total            (mobile)
Tests:       1496 passed, 1496 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Delta móvil contra la base de 83/1494: +0 suites y +2 tests. Es el cierre
esperado.

**Sobre el HEAD mergeado `6cd6ea20`**:
- Medición del leader (`merge124.head`, `merge124.exit`): jest 0, con
  `Test Suites: 83 passed`, `Tests: 1510 passed` y `Snapshots: 1 passed`;
  `tsc` 0 y `lint` 0, los dos con log vacío. Los +14 tests son los de
  `add-reminder/index.test.tsx` que trae #125.
- Medición propia, sin pipe:
  - `test ! -e .expo/types/router.d.ts` da exit 0.
  - `bunx tsc --noEmit` da exit 0, con log vacío.
  - `bunx expo lint` da exit 0, con log vacío.
  - home más drift: exit 0, 144 + 55 = 199 passed.
