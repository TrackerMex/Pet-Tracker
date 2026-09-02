# review: mobile-map-last-position-error-state (#56)
Fecha: 2026-09-02
Veredicto: APROBADO

Revisión independiente del trabajo de Codex CLI en
`feature/56-mobile-map-last-position-error-state` (commits `83a1602` →
`dbde188` → `1a44a53`, cadena lineal desde el punto de handoff `ae13c31`).
Todos los comandos fueron re-ejecutados por el reviewer; ninguna cifra se
tomó del reporte del implementer.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#56)
- [x] `progress/current.md` describe la sesión activa (spec → aprobación →
      handoff → corrección del comando Jest)

## Checklist C3 — Arquitectura
- [x] Feature de UI móvil pura: cero cambios en backend/domain/application/
      infrastructure. El único diff de producción vive en la pantalla
      `mobile-pet-tracker/src/app/(tabs)/map.tsx`, como manda la spec
- [x] Capa API móvil (`src/api/positions.ts`, `src/api/pets.ts`) intacta:
      la pantalla decide, la API no cambia (§Fuera de alcance)

## Checklist C4 — TDD
- [x] Cada R<n> tiene tests que lo nombran: 4 describes con sufijo
      `(mobile-map-last-position-error-state)` (regla H5) para R1–R4;
      R3(a) y R5 son gates de reviewer/comandos según la spec
- [x] Historial test-primero real: `83a1602` (solo test, 152 adiciones,
      **cero líneas de producción** — `git diff ae13c31 83a1602 -- map.tsx`
      vacío) precede a `dbde188` (solo `map.tsx`, 45+/8−) y a `1a44a53`
      (solo docs/spec)
- [x] Rojo reproducido por el reviewer en worktree limpio en `83a1602`:
      `Tests: 8 failed, 32 passed, 40 total` — los 32 heredados verdes y
      los 8 nuevos fallando por los testIDs `map-last-*`/`map-error`
      inexistentes. Coincide con la salida registrada en el impl report

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente": R1–R5 con
      archivo::describe::it + hashes `83a1602` → `dbde188`
- [x] Commits siguen la convención declarada en la propia traceability:
      `test(map): … (R1-R4)` → `fix(map): … (R1-R4)` → `docs(map): … (R5)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y casilla humana marcada
      (2026-09-01, commit humano `7b0c5e5`)
- [x] Ningún requisito modificado tras la aprobación:
      `git diff 7b0c5e5..HEAD` sobre requirements.md y design.md solo
      muestra el frontmatter draft→approved (paso del leader, flujo
      establecido). La corrección del comando Jest vivió en el handoff
      (`ae13c31`), no en la spec — precedente #55

## Checklist C7 — Sin código huérfano
- [x] `isPetsError` migró de array-includes a switch exhaustivo en el
      mismo símbolo — nada reemplazado quedó atrás
- [ ] N/A — esta feature no reemplaza componentes/módulos

## Checklist C8 — UI móvil conforme a la carta
- [x] Grep-clean sobre las líneas añadidas del diff móvil: cero hex, cero
      clases arbitrarias `[...]`, cero `StyleSheet.create` (grep exit 1)
- [x] §10: la rama B5 pinta su propio `bg-background`; `screen-map`
      conserva `className="flex-1"` sin `bg-*` y ningún ancestro de
      `PetMap` gana fondo opaco. El test R1 lo pinnea
      (`toContain('bg-background')` / `not.toContain('bg-')`) y falló en
      rojo antes de existir la rama
- [x] `<Text selectable>` en el mensaje de error (micro-regla de la carta)
- [x] Sin animaciones nuevas, sin dimensiones nuevas, sin componentes
      duplicados: la rama calca el patrón de la rama de error de pets

## Verificación de diseño D3–D6 (lectura de código + mutaciones)
- [x] D3: `isLastError(state: LastPositionState): boolean` — switch
      exhaustivo SIN `default`, retorno anotado, seis kinds repartidos
      (`ok`/`no-tracking` → false; los cuatro restantes → true).
      `isPetsError(state: PetsState): boolean` — mismo patrón con
      `unauthorized` → true
- [x] R3(a) validado por mutación: kind ficticio añadido a
      `LastPositionState` → `bun run typecheck` falla con
      `map.tsx(34,49): error TS2366: Function lacks ending return
      statement...` — el mecanismo del compilador obliga. Revertido
- [x] D4: `petsReady` gatea B4 (`no-tracking`), B5 y B6 (`ok`);
      `isLoading` factorizado sin cambio semántico
- [x] D5: rama B5 byte-a-byte igual al JSX literal de design.md
      (testIDs `map-last-error-state`/`map-last-error`/`map-last-retry`,
      clases exactas, `onPress={refetchLast}`), insertada entre
      `no-tracking` y `ok`; import de `type LastPositionState` añadido
- [x] D6/R2/R4: `signOut` capturado con `mockUseAuth` propio y asserteado
      en ambos unauthorized; R4 assertea además
      `expect(mockGetLastPosition).not.toHaveBeenCalled()`

## Tests que muerden (mutaciones manuales, revertidas)
| Mutación en `map.tsx` | Resultado |
|---|---|
| `unauthorized` movido al grupo false de `isLastError` | ROJA: `R2 … comparte la rama de error y dispara el signOut` (1 failed, 39 passed) |
| Gate `petsReady` quitado de la rama `ok` | ROJA: `R3 … solo la rama de error de pets renderiza cuando pets cae con last resuelto` (1 failed, 39 passed) |
| Kind ficticio en `LastPositionState` | typecheck ROJO: TS2366 en `isLastError` |

Working tree limpio tras revertir (verificado con `git status --short`).

## Allowlist R5 (contención)
`git diff --numstat ae13c31...HEAD` — exactamente 5 rutas:
```
152  0  mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
 45  8  mobile-pet-tracker/src/app/(tabs)/map.tsx
457  0  progress/impl_mobile-map-last-position-error-state.md
  6  6  specs/mobile-map-last-position-error-state/tasks.md   (solo casillas [ ]→[x])
  5  5  specs/mobile-map-last-position-error-state/traceability.md (solo relleno de filas)
```
- [x] `map.test.tsx` estrictamente aditivo (152/0): ningún test previo
      modificado ni borrado; suite 32 → 40 (7 its, el it.each de R3 corre 2)
- [x] Cero líneas en `pet-map.tsx`, `use-api.ts`, `auth-provider.tsx`,
      `(tabs)/_layout.tsx`, `src/api/*`, `package.json`, `bun.lock`,
      `progress/current.md`, `feature_list.json` (ausentes del numstat)

## Violaciones de proceso
- [x] Ninguna: `feature_list.json` intacto (sigue `in_progress`, lo cambia
      el leader), spec aprobada no editada (salvo traceability/casillas,
      permitido), no marcó done, **no pusheó** (branch `[ahead 3]` de
      origin), paró y reportó el error del comando Jest en vez de editar
      la spec (autorización del leader en `ae13c31` — no es hallazgo)
- [x] Desviación declarada y aceptada: plugin expo de Codex sin
      `expo-overview`; cargó `building-native-ui` + Appllama con
      `docs/ui-guidelines.md` como autoridad (mismo precedente #55)

## Observaciones
Ninguna bloqueante. Nota menor (no exigible): el flake preexistente de #53
en `src/screens/add-pet/index.test.tsx` que el implementer vio en su primera
corrida de `./init.sh` no apareció en la corrida del reviewer; sigue siendo
ajeno a esta feature.

## Comandos re-ejecutados por el reviewer
| Comando (dónde) | Resultado |
|---|---|
| `bun run test -- 'src/app/\(tabs\)/__tests__/map.test.tsx' --runInBand` (mobile-pet-tracker/) | PASS — 40/40, exit 0 |
| Ídem en worktree a `83a1602` | FAIL — 8 failed / 32 passed (rojo esperado) |
| `bun run typecheck` (mobile-pet-tracker/) | exit 0 |
| `bun run lint` (mobile-pet-tracker/) | exit 0 |
| `./init.sh` (raíz) | exit 0 |

## Output de ./init.sh (cierre)
```
Test Suites: 3 skipped, 23 passed, 23 of 26 total
Tests:       8 skipped, 349 passed, 357 total
✅ Tests e2e pasados
✅ Lint sin errores
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 52/57 completadas | 4 pendientes
```
Exit code: 0.
