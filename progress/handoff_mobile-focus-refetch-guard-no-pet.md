Worktree: /home/claude/sites/Pet-Tracker-wt-193

NO lances `./init.sh` aunque AGENTS.md lo pida: lo corre el leader (comparte Postgres y LocalStack con otros worktrees).

# Handoff a Codex CLI — feature #193 mobile-focus-refetch-guard-no-pet

Antes de tocar nada, confirma en el reporte `pwd` y `git branch --show-current` (debe ser `feature/193-mobile-focus-refetch-guard-no-pet`). Trabaja SOLO en ese worktree: no uses `/home/claude/sites/Pet-Tracker` (otra sesión) ni `main`.

Feature: mobile-focus-refetch-guard-no-pet (#193), branch `feature/193-mobile-focus-refetch-guard-no-pet`.
Spec aprobada: `specs/mobile-focus-refetch-guard-no-pet/requirements.md` (status: approved, firmada en el commit `docs(spec): firma #193 …` tras la aprobación del humano en Notion).
Lee también: `specs/mobile-focus-refetch-guard-no-pet/design.md` (D1 a D8 y estrategia de pruebas), `tasks.md` (cadena de commits y tabla de mutaciones) y `traceability.md`.

Problema en una línea: `refetch()` de TanStack Query ejecuta el `queryFn` aunque `enabled` sea `false`. Inicio y Perfil piden `GET /pets/null` (`getPet`) al enfocarse sin mascota, y Recordatorios llama a `listReminders` con selección nula. La guarda va dentro de la callback de foco y el valor vigente llega por una ref (D1, D2). No cambies la capa de datos.

## Anclas

Desde `mobile-pet-tracker/` (`cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker"` primero). Cada ancla va sola: `grep -c` sale con código 1 cuando la cuenta es 0, así que no las encadenes con `&&`. Salida esperada en H0 tras el `#`.

```
grep -cF 'useFocusEffect(' src/screens/home/index.tsx   # 1
grep -cF 'refetchDetail()' src/screens/home/index.tsx   # 1
grep -cF 'refetchPets()' src/screens/home/index.tsx   # 1
grep -cF 'refetchOpenAlerts()' src/screens/home/index.tsx   # 1
grep -cF 'useRef' src/screens/home/index.tsx   # 0
grep -cF 'useFocusEffect(' src/screens/profile/index.tsx   # 1
grep -cF 'refetchDetail()' src/screens/profile/index.tsx   # 1
grep -cF 'refetchPets()' src/screens/profile/index.tsx   # 1
grep -cF 'refetchOpenAlerts()' src/screens/profile/index.tsx   # 0
grep -cF 'useRef' src/screens/profile/index.tsx   # 0
grep -cF 'useFocusEffect(' src/screens/reminders/index.tsx   # 1
grep -cF 'refetchReminders()' src/screens/reminders/index.tsx   # 2 (una en la callback de foco, otra en handleDelete)
grep -cF 'useRef' src/screens/reminders/index.tsx   # 0
grep -cF 'selectedPetIdRef' src/screens/home/index.tsx src/screens/profile/index.tsx src/screens/reminders/index.tsx   # 0 en cada fichero
grep -cF 'useFocusEffect: jest.fn()' src/screens/home/index.test.tsx   # 1 (igual en profile y reminders)
grep -cF 'PAIRING_STYLE_ESCAPES' src/__tests__/design-drift.test.ts   # 3
grep -cF '#193' src/screens/home/index.tsx src/screens/profile/index.tsx src/screens/reminders/index.tsx src/screens/home/index.test.tsx src/screens/profile/index.test.tsx src/screens/reminders/index.test.tsx src/__tests__/design-drift.test.ts   # 0 en cada fichero
```

Si una ancla no da su valor, PARA y avisa.

## H0 y T0

- H0 = `git rev-parse HEAD` tras el commit de este handoff. Anótalo en el reporte. Base medida antes de este handoff: `84cf13d31e5219ac5f94fa931561ab6a3f7f5f79`. El handoff solo añade `progress/handoff_mobile-focus-refetch-guard-no-pet.md`, así que las anclas valen en H0.
- Mide T0 (total de `it` de toda la suite móvil en H0), una sola vez y sin pipe, con `<log>` en un fichero temporal fuera del árbol: `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" && bun run test > <log> 2>&1; grep -E '^Tests:' <log>`. El aviso final `A worker process has failed to exit gracefully` es preexistente: no paras por él.
- Mide los totales por fichero de los tests que vas a tocar (cada uno solo) antes del primer commit.
- `node_modules` ya está instalado en `mobile-pet-tracker/`. Si falta, `bun install --frozen-lockfile` en esa carpeta. La nota de `tasks.md` «no hay node_modules» está caducada.

## Cadena de commits

Cuatro commits en este orden, con los mensajes exactos de `tasks.md`. Desviación declarada por el leader: la plantilla pide «un commit por requisito»; esta feature sigue la cadena de cuatro commits de `tasks.md`, porque las verificaciones (vía b) se cierran con mutación y no con commit propio.

- **A** `test(mobile): tests de foco sin mascota (R1,R2,R3,R4,R5,R6,R7,R8,R9,R10,R11)`. Solo tests, con describes `#193 R<n>:`: home (R1, R2, R3, R10), profile (R4, R5, R6, R10), reminders (R7, R8, R9, R10) y design-drift (R11, con los tres ficheros de pantalla en su lista, rutas relativas a `src/`). No añadas helpers de test nuevos ni símbolos que no existan en el árbol. Rojo por aserción en R1, R4 y R7: `getPet` o `listReminders` llamados con selección nula. NV (nacen verdes, decláralos en el reporte): R2, R3, R5, R6, R8, R9, R10 y R11. Un `ReferenceError` o un import inexistente no es rojo legítimo (C4).
- **B** `feat(mobile): guarda de refetch sin mascota en Inicio, Perfil y Recordatorios (R1,R4,R7)`. Solo producción:
  - `selectedPetIdRef` como `useRef<string | null>(selectedPetId)` y un `useEffect` que lo sincroniza con `selectedPetId`, declarado antes del `useFocusEffect` (D2).
  - Guarda `selectedPetIdRef.current !== null` delante de `refetchDetail()` en Inicio y Perfil (D1, D3), y delante de `refetchReminders()` en la callback de foco de Recordatorios (D5). La función de limpieza de Recordatorios no cambia y no hay retorno temprano.
  - Sin guarda en `refetchPets()` ni en `refetchOpenAlerts()` (D4). Sin cambios en los arrays de dependencias de los `useCallback` de foco (D6).
  - Imports (D7): añade `useRef`, y `useEffect` solo si el fichero no lo importa ya.
  - Si un test existente asevera la petición sin mascota, lo actualizas aquí y lo declaras en el mensaje del commit.
- **C** `test(mobile): mutaciones de control para R2,R3,R5,R6,R8,R9,R10,R11 (rojo por aserción)`. Aplica a producción las ocho mutaciones de la tabla de `tasks.md` (M-R2, M-R3, M-R5, M-R6, M-R8, M-R9, M-R10, M-R11). Cada `it` de su R tiene que fallar por aserción.
- **D** `test(mobile): revierte mutaciones de control (R2,R3,R5,R6,R8,R9,R10,R11)`. Deshaz exactamente lo de C. Verde en todo.

Evidencia de C4: antes de C, aplica cada M-R<n> sola sobre el estado de B, corre su `it`, anota la aserción que falla y revierte con `git checkout HEAD -- <ruta>` (comprueba `git diff --cached --quiet -- <ruta>` y `git diff --quiet -- <ruta>`). Luego aplica las ocho juntas en C y mide ahí también. Un fallo de compilación, un import inexistente o un doble alterado no cuenta como evidencia.

## Reglas críticas

- **Skills (nombres del catálogo de Codex)**: carga `native-data-fetching` (refetch y `enabled` de TanStack Query). La guía de foco está en `design.md`. No cargues `building-native-ui`, `expo-tailwind-setup`, `appllama-app-design-skill` ni `animate-expo`: no tocas JSX ni estilos. Di en el reporte cuáles cargaste.
- Sigue `docs/architecture.md` y `docs/conventions.md`. Para móvil, `docs/ui-guidelines.md` (R11 prueba su §3). No la modifiques.
- TDD con commits test-primero: A antes que B, sin excepción. Un rojo distinto del de la tabla (`Unable to find`, `Found multiple elements`, `Test suite failed to run`, un `it` no listado) = PARA y avisa; no ajustes la aserción.
- Esperas sobre el árbol renderizado (`docs/conventions.md` §«Esperas sobre el árbol renderizado»): espera a un nodo o a un estado, no al contador de un mock. La carga inicial antes de medir se espera sobre el árbol. `render`, `fireEvent`, `act` y `rerender` de RNTL 14 son asíncronos: `await` en todos, o el `it` siguiente hereda un `setState` pendiente.
- R10: compara la callback con `Object.is`. Nunca `toBe` sobre instancias de React: tumba el worker de jest con JSON circular. Si una corrida de varios ficheros en rojo tumba un worker, repite con `-i`.
- Un fichero de jest a la vez: `bunx jest <ruta>` o `bunx jest <ruta> -t '#193 R1:'` (los dos puntos evitan que `R1` coincida con `R10`). Si un `it` agota el tiempo con la máquina cargada, repite el fichero solo antes de juzgarlo.
- Comentarios: solo `#193 R<n>` (por ejemplo `// #193 R5`). Nunca `#193` a secas: el guard de hex de `design-drift` lo lee como color.
- Antes de cada commit de código: `test ! -e .expo/types/router.d.ts` (si existe, PARA; no lo borres), `bun run typecheck` con salida 0, y `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` con `<log>` fuera del árbol. Ninguna medición de veredicto usa pipes. No hay prettier en móvil.
- Tras modificar código: `graphify update .` desde la raíz del worktree. No commitees `graphify-out/` (está en `.gitignore`).
- Cadenas de comandos: escribe cada cabecera como comentario `# --`, nunca como línea ejecutable, y encadena el registro de rojo con el `git commit` por `&&`. Acota `git status` y `git diff` a las rutas esperadas.
- No tocar: `src/api/`, `src/providers/selected-pet-provider.tsx`, `src/hooks/use-pet-selection.ts`, `src/screens/map/`, `src/components/`, `src/theme/`, `docs/`, backend, `package.json`, `bun.lock`, `app.json`, `src/i18n`, ni el `refetchReminders()` de `handleDelete` (ya protegido por `if (!selectedPetId) return;`).
- Si aparece otra petición con id nulo fuera de las tres callbacks de foco, regístrala como hallazgo en el reporte y no la arregles.
- NO son tuyos: `progress/history.md`, `progress/current.md`, `STATUS.md`, el campo `status` de `feature_list.json`.
- Preguntas abiertas de `requirements.md`: la 1 (arranque en frío) no añade petición de detalle en la ventana con `selectedPetId` nulo. La 2 (checklist de autocrítica): este cambio no toca JSX ni estilos; decláralo en el reporte como no aplicable y deja la confirmación al reviewer. La 3 (smoke) la cierra el humano (CC4); no lo intentes.
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por otro. No crees recursos AWS. NO abras ni edites la PR.

## Criterios de aceptación

- CC1 (desde `mobile-pet-tracker/`): `bunx jest` sin ningún `it` en rojo, uno a uno, en `src/screens/home/index.test.tsx`, `src/screens/profile/index.test.tsx`, `src/screens/reminders/index.test.tsx`, `src/screens/map/index.test.tsx` y `src/__tests__/design-drift.test.ts`; `bun run typecheck` con salida 0; `bunx expo lint --no-cache` con código 0 y log vacío, medido sin pipe.
- CC2: el diff de producción solo toca imports, la ref con su efecto y las guardas. Compruébalo con `git diff <hash de A> -- mobile-pet-tracker/src/screens` tras B. Sin cambios de JSX, copy, testIDs, estilos ni dependencias.
- CC3: `specs/mobile-focus-refetch-guard-no-pet/traceability.md` sin filas «pendiente»: R1 a R11 con el `archivo::describe` real y el hash del commit (A a D) que lo cumple. Verifica cada hash con `git cat-file -e <hash>`.
- Tras D, `git diff <hash de B> -- mobile-pet-tracker/src/screens` sale vacío: D revierte exactamente C.

## Al terminar

1. Un commit final: `docs(#193): trazabilidad y reporte de implementación (R1-R11)`, con `specs/mobile-focus-refetch-guard-no-pet/traceability.md` y `progress/impl_mobile-focus-refetch-guard-no-pet.md`, con `git add` de esas rutas y `git commit -o -- <rutas>`. No rebasar.
2. `progress/impl_mobile-focus-refetch-guard-no-pet.md` incluye: H0, T0, `Tests:` por fichero tras cada commit, los hashes de A a D, las skills cargadas, la aserción que falla por cada M-R<n> (una a una y juntas), los NV, el resultado de CC1 a CC3 y del diff de CC2, y cada parada o desviación.
3. Última acción: crea `progress/impl_mobile-focus-refetch-guard-no-pet.done` con una sola línea: la ruta de `progress/impl_mobile-focus-refetch-guard-no-pet.md`. Es el marcador que vigila `scripts/harness/watch-impl.sh`; no lo commitees (está en `.gitignore`).
