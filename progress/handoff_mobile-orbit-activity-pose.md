# Handoff #225 mobile-orbit-activity-pose

Implementer: subagente `implementer` (fallback de CLAUDE.md §Excepciones: a la cuota
semanal de Codex le queda el 3 %, se renueva el 2 de noviembre a las 14:37). Declarado en
`progress/current.md`.

Worktree: /home/claude/sites/Pet-Tracker-wt-225
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-225 && pwd && git branch --show-current && git log --oneline -2`.
Confirma en el reporte la ruta y la branch `feature/225-mobile-orbit-activity-pose`. Los dos
commits deben ser, de arriba abajo, el de este handoff
(`docs(progress): #225 implementer handoff`) y `3e9c76ae` (H0).

## Base

- Feature: mobile-orbit-activity-pose (#225). Integra en `dev`, no en `main`.
- H0 (base de la implementación y del diff final): `3e9c76ae`, la casilla de §Re-verificar.
  Su base de código es `9808728d`, el merge de `origin/dev` (`36f6c1da`) con #221 (PR #282,
  R4 incluida). De H0 a `9808728d` solo cambia `specs/`.
- §Re-verificar al mergear #221 de requirements.md ya la corrió el leader sobre H0:
  el paso 1 da caso A, y los pasos 2 y 3 dan la salida esperada (paso 3: `caso A: 23 entradas, 0 descuadradas; 0 pins de documento sin entrada; 296 líneas para el reemplazo de C4`, exit 0). Usa la variante del caso A de design.md §4 (23 entradas). Repítela
  igual como primer paso (tasks.md lo pide); si algo no cuadra, PARA.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene
  `.env` y `mobile-pet-tracker/node_modules`.

## Spec

- Aprobada con firma delegada (`2e7902ed`). G4 firmado por el humano (`5c69aafe`). La fe de
  erratas E1 (`00d11399`) te pasa R9 como C13.
- Lee enteros `specs/mobile-orbit-activity-pose/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- Las decisiones D1–D9 de requirements.md están cerradas: no hay nada que preguntar. Si
  encuentras una contradicción, PARA y anótala en el reporte. No adaptes la spec por tu
  cuenta.
- Criterios de aceptación: R1 a R9. La casilla del smoke G2 es del humano y no la tocas.

## Orden y commits

El orden, los commits y sus mensajes los manda tasks.md; úsalos literales, de C1 a C13:

1. R2 (C1, C2).
2. R3 y R4 (C3, C4).
3. R5 (C5, C6).
4. R6 (C7, C8).
5. R1 y R7 (C9, C10).
6. R8 (C11, C12).
7. R9 (C13).
8. `traceability.md` y el reporte, en un commit `docs(spec)` aparte. No rebasees después.

Commits test-primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). Cada
commit rojo lleva solo tests; cada verde, solo lo que tasks.md le asigna.

Antes de cada commit rojo, comprueba que los `it` nuevos fallan **por la aserción**, no por
un import roto, un `ReferenceError` ni «Cannot find module». Un «Unable to find» de RNTL
vale como rojo.

tasks.md declara qué `it` nacen verdes y da su mutación: el segundo de R4, el maestro de R5,
los dos de `talk` de R7 y #190 R4 enmendado. Planta cada mutación, mírala en rojo,
reviértela y no la commitees. Anota en el reporte la orden y la salida. Si otro `it` nace
verde, anota «nace verde: <motivo>»; si no sabes por qué, PARA.

C13 (R9) no tiene rojo propio: reproduce las dos mutaciones de R9 que da tasks.md y anota
su salida.

## Archivos

Lista cerrada: design.md §1, más:

- `docs/ui-guidelines.md`, solo en C13 y solo el párrafo de R9;
- `specs/mobile-orbit-activity-pose/design.md` §4, solo en C13: borrar las dos filas
  «R9 la borra»;
- `specs/mobile-orbit-activity-pose/traceability.md`, en el commit final;
- `progress/impl_mobile-orbit-activity-pose.md`, tu reporte.

Si necesitas otro fichero, PARA.

No tocar:

- `backend-pet-tracker/`;
- `package.json`, `bun.lock`, `app.json`, `app.config.ts` ni código nativo;
- `init.sh`, `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/handoff_*.md`;
- el resto de `docs/` y de `specs/`. De los directorios `specs/mobile-*-pingo*`, solo la
  línea de H3 de `specs/mobile-home-pingo-phrase/requirements.md` (R8).

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga `expo:expo-overview` y, según toque,
  `expo:expo-native-ui` (la imagen de la burbuja de Inicio). En el reporte, lista las que
  cargaste.
- **Renombrado mecánico** (design.md §2):
  - el reemplazo conserva la caja: `pingo` pasa a `orbit`, `Pingo` a `Orbit` y `PINGO` a
    `ORBIT`;
  - en los tests no se tocan los títulos de `describe`/`it`/`test`, los comentarios ni las
    líneas de §4;
  - C2 renombra solo los nombres `.webp`, y C4 el resto;
  - assets, módulos y tests colocados se mueven con `git mv`.
- **Literales a mano.** Los valores de la spec son literales del test escritos a mano, nunca
  importados de producción: el candado sería tautológico. Incluye textos, testIDs, claves
  y nombres de fichero.
- **Copy.** `home.orbitWalkLabel` lleva los literales de R1 («Orbit walking» / «Orbit
  caminando») y va detrás de `home.orbitPhraseCalm`. Cada uso va como
  `t('home.orbitWalkLabel'` literal.
- **Candados enmendados.** Los de requirements.md §Candados enmendados, cada uno en el
  commit que nombra su fila:
  - la cifra nueva se escribe como base + delta, con el comentario que da la fila;
  - el sufijo ` (enmendado por #225 R<n>)` va una sola vez, al final del nombre del `it`.
- **Imagen de Inicio** (R7). `expo-image` lleva `style={{ width: 56, height: 56 }}` y ningún
  `className`: Uniwind no mapea `className` en expo-image.
- **Conversión del asset** (R5). Usa la orden literal de design.md §7, desde la raíz del
  worktree. Su comprobación `node` debe imprimir `true RIFF WEBPVP8X true true 1024 1024`.
  Anota los bytes en el reporte.
- **Esperas.** `docs/conventions.md` §Esperas: espera siempre al nodo que aserta el test,
  nunca a un contador de mock.
- **RNTL 14.** `await` en `render`, `renderRouter`, `fireEvent` y `act`; sin `await`, un `it`
  contamina al siguiente.
- **Mocks.** Nada de `jest.mock(…, { virtual: true })`.
- **Prohibido en producción:**
  - `StyleSheet.create` y hex fuera de `src/theme/`;
  - clases `[...]`;
  - emoji y dependencias nuevas;
  - comentarios que citen `#225`. En los tests, solo `#225 R<n>`, nunca `#225` desnudo.
- **Jest:**
  - corre desde `mobile-pet-tracker/` con `bunx jest <ruta>`. Ninguna de estas rutas lleva
    paréntesis;
  - si una suite da timeout bajo carga, repítela sola antes de concluir.

  Para el chequeo final, corre la suite móvil completa
  (`bunx jest --ci > ../progress/jest_225_final.log 2>&1`), guarda el log y anota las
  cifras. Un rojo conocido de flake (#200 R10 food-links, #168 R2, #152 R8) se repite solo
  y se anota.
- **Lint y tipos**, al final, con logs:
  `bunx tsc --noEmit > ../progress/tsc_225.log 2>&1; echo $?` y
  `bunx expo lint --no-cache > ../progress/lint_225.log 2>&1; echo $?`. `expo lint` puede salir 0
  tras un SIGKILL: comprueba que el log no diga «Killed».
- **Producción sin Pingo.** Tras C4, desde `mobile-pet-tracker/`, la orden
  `git grep -il pingo -- src ':!**/__tests__/**' ':!**/*.test.ts' ':!**/*.test.tsx' | wc -l`
  da `0`.
- **Árbol limpio, acotado:**
  `cd /home/claude/sites/Pet-Tracker-wt-225/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`.

## Reporte

`progress/impl_mobile-orbit-activity-pose.md`:

- la salida del primer comando y de §Re-verificar;
- cada C con su hash y, en los rojos, la causa del rojo;
- la salida de la conversión;
- las mutaciones con su orden y su salida;
- los «nace verde»;
- las cifras de jest, tsc y lint;
- las skills cargadas;
- cualquier PARA.

Al terminar, devuelve solo la ruta del reporte.
