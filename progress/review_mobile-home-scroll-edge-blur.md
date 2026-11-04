# review: mobile-home-scroll-edge-blur (#242)
Fecha: 2026-11-04
Veredicto: APROBADO (sujeto a `./init.sh` verde del leader y a G3/G2 del humano, D11)

Base del diff: H0 `1c9e43741f030897b578d7c7226d7d80ca92ad46`; HEAD `b3e989a918f319224faec2981e7fd587eaff55da`.
Los commits `155c8a02` y `37a6267a` (enmiendas del leader) no se juzgan como trabajo de Codex.

## Checklist C2 — Estado coherente
- [x] Ninguna feature `in_progress` en `feature_list.json` (#242 sigue `spec_ready`, correcto por D11).
- [x] `progress/current.md` no lo toca la rama (diff vacío); lo mantiene el leader.

## Checklist C3 — Arquitectura
- [x] N/A de backend. En móvil el cambio se limita a `src/screens/home/index.tsx`; sin lógica de negocio ni imports cruzados nuevos.
- [x] Sin `StyleSheet`, sin hex, sin copy ni `t()` nuevos en el diff (`git diff -w`: 37 líneas añadidas / 0 borradas). `grep -cE '\bBlurView\b'` = 0.

## Checklist C4 — TDD
- [x] R1 a R8 tienen test que nombra `#242 R<n>` (13 `it`: R1 1, R2 3, R3 2, R4 2, R5 1, R6 2, R7 1, R8 1).
- [x] Historial test-primero real:
  `e3dd63c1` (test R1, solo canvas-foundations) -> `e42a223c` (dependencia, solo package.json/bun.lock) -> `4d8658e2` (test, solo zones-canvas-fidelity) -> `d184d16d` (solo `index.test.tsx`) -> `51df26c7` (solo `index.tsx`) -> `83b0ade1` (D12, solo `index.tsx`).
- [x] Rojo reproducido por mí: worktree desechable en `d184d16d` (ya eliminado). Resultado: 10 rojos (R2 3, R3 2, R4 2, R5 1, R6 2) por "Unable to find testID home-edge-blur-top" y similares (causa correcta, no error de módulo) y R7/R8 verdes. Coincide con lo declarado en la spec (R7/R8 nacen verdes).
- [x] Verde en HEAD: `bunx jest src/screens/home/index.test.tsx -t "#242"` -> 12 verdes. `bunx jest src/__tests__` -> 43 suites / 1060 tests verdes (cifra de T1 del reporte).

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (0 coincidencias); R1..R9 enlazan test y commit (hashes existentes en el historial).
- [x] Commits con formato `tipo(scope): #242 ... (R-ids)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`; casillas de aprobación, de la enmienda #197 R22 y de la enmienda #202 R25 marcadas. G3 y G2 desmarcadas (gates humanos, esperado).

## Checklist C7 — Sin código huérfano
- [x] N/A: el spike no reemplaza nada existente.

## Verificaciones independientes
- Anclas de R9 Test A: todas las cifras de "Tras #242" coinciden (1/1/1/1/1/1, `from 'uniwind'` 1, `from 'expo-backdrop'` 1, root/top/bottom testID 1 cada uno, `edge=` 1+1, `StyleSheet` 0, `intensity` 0, tint dark/light 1+1; test: `expo-backdrop` 1, `mockInsets` 10, `StyleSheet` 0; `"expo-backdrop": "0.1.3"` 1; `bun.lock` 2; sufijo `(enmendado por #242 R` 1 en cada fichero de test).
- R1: dependencias 44/8; `bun install --frozen-lockfile` exit 0; sin `expo-linear-gradient` ni masked-view.
- R9 Test B (alcance): `git diff --name-only H0..HEAD` lista solo package.json, bun.lock, index.tsx, index.test.tsx, canvas-foundations, zones-canvas-fidelity, y `specs/mobile-home-scroll-edge-blur/*` (los tres de specs del leader y traceability). Nada en `src/components/`, `src/app/`, `src/i18n/`, `docs/`, app.json. `git diff -w --numstat H0..HEAD -- index.tsx` = 37 añadidas / 0 borradas (límite: 2 borradas).
- D12: el spread `{...TOP_EDGE_BLUR_PROPS}` / `{...BOTTOM_EDGE_BLUR_PROPS}` son objetos `{ testID: '…' }` esparcidos; el orden de claves no importa y R2 sigue aserto exacto de `['edge','style','testID','tint']` sobre las props recibidas por el doble. En ejecución las props son las mismas que con atributo explícito. Sin `as`, `@ts-ignore` ni `declare module`. `bunx tsc --noEmit` exit 0, log vacío (con `test ! -e .expo/types/router.d.ts` previo).
- Hook: `useUniwind()` se llama junto a `const insets = useSafeAreaInsets();` (antes del early return de `home-no-pets-screen`), conforme a D7.
- Mutaciones propias (worktree desechable en HEAD, todas restauradas y worktree borrado): (1) tint del overlay inferior fijo a claro -> rojo solo R6 rama dark; (2) `paddingBottom` del ScrollView a `+ 24 + 12 + 64` -> rojo R8; (3) `edge="top"` en el inferior -> rojo R2 x3; (4) altura superior calculada con `insets.bottom` -> rojo R3 primera rama (47/31), la segunda (0/0) pasa por diseño, que es justo para lo que se eligieron 47/31. Los 4 detectados por el candado previsto. El reporte documenta 39 variantes con logs por caso en `progress/242-mutation-*.log`; las existentes en disco concuerdan con la tabla.
- Candados no tautológicos: valores esperados escritos a mano (71/131/24/100/120), el doble no importa nada de producción, `jest.mock('expo-backdrop')` sin `virtual`, tema e insets por `let` mutables restaurados en `afterEach`/`beforeEach`.

## Observaciones
Ninguna bloqueante.

- Baja: R2 lee las claves exactas desde la primera llamada al doble (`mock.calls.find(...)`), no desde el nodo (el `View` del preset añade `children` sintéticos y RNTL 14 expone solo hosts). Es una adaptación de lectura justificada y documentada en el impl; no cubre una prop que apareciera solo en un re-render posterior. Aceptable para un spike con props estáticas.
- Baja: `traceability.md` §Evidencia aún cita "35 añadidas / 0 eliminadas" (cifra anterior a D12); el valor actual y el declarado en el impl es 37/0. Documental, sin efecto en los candados.
- Informativa: el commit `51df26c7` queda con 2 errores TS2322 (resueltos en `83b0ade1` por la enmienda D12 del leader); está declarado en el impl y en la trazabilidad. Cada commit intermedio no es necesariamente verde en tsc, pero el estado final sí.
- Informativa: `feat` `51df26c7` muestra 591/556 líneas por el reindentado del ScrollView; con `-w` el cambio real es solo adiciones.
- Pendiente humano (D11): G3 (rebuild del dev build con `expo-backdrop`) y G2 (smoke Android claro/oscuro). La feature no debe pasar a `done` hasta cerrarlos.
- No he ejecutado `./init.sh` (lo corre el leader) ni `expo lint` (el reporte da exit 0 y log vacío; el leader debe confirmarlo en init.sh).

## Output de ./init.sh
No ejecutado por el reviewer por instrucción del leader; pendiente de su corrida.
