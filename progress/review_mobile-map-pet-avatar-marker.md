# review: mobile-map-pet-avatar-marker (#230)
Fecha: 2026-11-04
Veredicto: APROBADO (condicionado al `./init.sh` verde del leader sobre `a6cf10d4`)

Revisado: branch `feature/230-mobile-map-pet-avatar-marker`, diff `94863d5a..a6cf10d4` (H0 = la
enmienda de R4; el handoff es `764acfe8`). Son 24 commits de Codex: 11 rojos, 10 verdes, 2 ajustes
de verificación y 1 cierre de trazabilidad.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress. Hay 0 en `feature_list.json`; #230 sigue `spec_ready`, como el
      resto del plan del 2026-11-03 hasta su cierre.
- [x] `progress/current.md` describe la sesión activa (§Plan de arreglos del smoke: #230 asignada a @Backend).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure. No aplica a las capas de backend. En móvil, el compositor
      (`screens/map/pet-marker-icon.tsx`) importa solo `../../api/types` (tipo),
      `../../theme/use-theme-colors`, expo-image, react, react-native, react-native-svg y blobatar.
      R11 lo bloquea con la lista exacta de imports.
- [x] repositories/contratos en domain son interfaces puras. No aplica: no hay contratos nuevos.
- [x] application depende de interfaces, no implementaciones. No aplica.
- [x] infrastructure sin lógica de negocio. No aplica. `PetMap` solo gana una prop opcional y un
      spread condicional; la lógica de composición vive en el compositor.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra. Todos los `it` llevan el prefijo `#230 R<n>:`,
      R1–R11, en `pet-marker-icon.test.tsx`, `pet-map.test.tsx`, `screens/map/index.test.tsx` y
      `map-canvas-fidelity.test.ts`. El primer `it` de R6 lleva el sufijo «(enmendado por #230 R8)»
      que exige el handoff.
- [x] El historial es test-primero. El orden es R2, R1, R3…R11, como en tasks.md. Cada rojo toca
      solo tests y cada verde solo producción; R11 es un commit único de guardas que nacen verdes.
      Los mensajes son los literales de tasks.md. Cada `it` que tasks.md da por caído cae por su
      aserción o por un módulo o export de producción ausente, no por un helper de test. En
      concreto:
      - R1: `Cannot find module './pet-marker-icon'`;
      - R6: `mock.calls[1]` undefined, que el handoff acepta;
      - R9: `currentMarkerIcon is not a function`, que es lo que tasks.md R9 dice que cae.
- [x] Filas que nacen verdes probadas por mutación: R2a, R2b, R4 (después del verde, según la
      enmienda), R5, R7, R10 y las 7 de R11. Son 13. Cada una cita la orden, el `it` que cae y un
      recibido coherente con la mutación, y se restauró con `git checkout HEAD --`. La única caída
      extra la explica el reporte: el import de expo-linear-gradient también pone rojo «importa solo
      lo suyo».
- [x] El cambio de Codex en el test de R3 no debilita la aserción. `jestExpect` de
      `@jest/globals` es el mismo objeto que el `expect` global: jest-circus `jestAdapterInit`
      inyecta `_expect.jestExpect` en el entorno y en `setGlobalsForRuntime`. El equality tester
      solo actúa entre dos elementos React válidos. Compara en profundidad, y recursivamente porque
      pasa `testers`, `[type, key, props]` contra `parse(blobatar('Luna'))?.children` de la
      implementación real. Solo descarta `_owner`, que es el único campo enumerable de un elemento de
      React 19 que no es type/key/props/$$typeof. Los `d` y `fill` reales del blob se siguen
      comparando, y el esperado no es vacío y depende del nombre.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas "pendiente". Las 11 filas tienen test `archivo::nombre`, y
      cada nombre existe literal en su fichero.
- [x] Los hashes son reales. Los 24 de la tabla coinciden con `git log 764acfe8..HEAD`, incluidos
      los ajustes `7526e4ac` y `bdf53623`. La línea de mutaciones está rellenada (13).
- [x] Los commits siguen el formato `test(mobile)` / `feat(mobile)` / `fix(mobile)`:
      `<desc> (R<n>)`.

## Checklist C6 — Spec aprobada
- [x] La casilla de aprobación está marcada: «Aprobado (firma delegada del leader, fecha:
      2026-11-03)», firma `ce5f89af`.
- [ ] `requirements.md` dice `status: approved` en el frontmatter. **No bloqueante (O1)**: el
      frontmatter sigue en `status: spec_ready`.
- [x] Ningún requisito cambió tras la firma. `requirements.md` y `design.md` no cambian desde
      `ce5f89af`. La única enmienda posterior es `94863d5a` (tasks.md R4 y el handoff), anterior a
      la implementación y hecha por el leader con la firma delegada.

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A. No se reemplaza ningún módulo. El marcador sin icono conserva su forma exacta (R2,
      `toStrictEqual`), y el compositor es nuevo.

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] El grep sale limpio en `pet-marker-icon.tsx`: sin hex, sin clases `[...]`, sin
      `StyleSheet.create`, sin `className`, sin emoji y sin copy. El color es el token
      `accent-foreground` vía `useThemeColors`. Las 6 guardas de `map-canvas-fidelity` se aplican al
      fichero nuevo (R11), y R1 bloquea el copy.
- [x] Dimensiones, safe areas, Skeleton, tappables y animaciones: no aplica. El compositor es
      invisible (`opacity: 0.01`), no recibe toques (`pointerEvents="none"`), está oculto a la
      accesibilidad y no anima.
- [x] Skills: Codex cargó `building-native-ui` y `appllama-app-design-skill`, los nombres que pide
      el handoff (deuda B5).

## Alcance y anclas
- Los ficheros tocados están dentro de la lista cerrada del handoff: los 7 de `mobile-pet-tracker/src/`
  más traceability.md y el reporte. `map-canvas-fidelity.test.ts` solo gana el describe final;
  `pet-map.tsx` e `index.tsx` no se reindentan.
- B1–B9, medidas por el reviewer desde `mobile-pet-tracker/src/`, dan todas lo esperado:

  | Ancla | Esperado | Medido |
  |---|---|---|
  | B1 | 1 | 1 |
  | B2 | 3 | 3 |
  | B3 | sí | sí |
  | B4 | sí | sí |
  | B5 | 1 | 1 |
  | B6 | 1 | 1 |
  | B7 | 0 | 0 |
  | B8 | 0 | 0 |
  | B9 | 0 por fichero | 0 por fichero |

  B8 sale 0 también contra H0, ampliado a `api/`, `theme/`, `pet-avatar.tsx` y `app.json`. B9 sale
  0 también en los 4 ficheros de test.
- Árbol: `git status --short` solo muestra este review sin trackear. El `.done` está ignorado
  (`.gitignore:27`). No quedan logs de jest, tsc ni lint.

## Observaciones
Ninguna bloquea la aprobación.

1. **O1 (C6, metadata).** `requirements.md`, `tasks.md` y `traceability.md` siguen con
   `status: spec_ready`. El commit de firma `ce5f89af` no cambió el frontmatter, mientras que las
   demás specs con firma delegada lo tienen en `approved`. Lo corrige el leader (es `specs/`, no
   código) antes de marcar `done`, como en el precedente de `review_db-setup-drizzle.md`.
2. **O2 (tipos, no verificado aquí).** No corrí `bunx tsc --noEmit`: `pgrep -f '[i]nit\.sh'`
   devolvió un `./init.sh` vivo (pid 3803022, cwd `/home/claude/sites/Pet-Tracker-wt-236`), y la
   regla manda saltárselo. El reporte da tsc exit 0 y `LINT_OK` tras `bdf53623`. El `./init.sh` del
   leader lo confirma o no.
3. **O3 (baja).** El `testID` del `ClipPath` va como `{...{ testID: '…' }}` para esquivar el tipo
   `ClipPathProps`, que no lo declara. En runtime es inocuo y solo lo leen los dobles de los tests.
   Queda anotado por si se rehace el compositor.
4. **O4 (baja).** `pet-marker-icon.test.tsx` es el primer fichero del móvil que importa
   `@jest/globals`. Se resuelve como dependencia transitiva de jest 29.7.0, no declarada en
   `package.json` (que no se podía tocar). Si un día se poda el hoisting, la importación cae.
5. **G2 sigue abierto.** Las casillas de humo Android e iOS de `requirements.md` §Aprobación son del
   humano (marcador con foto, sin foto y con foto rota). La captura real por `toDataURL` y el
   `icon` de expo-maps solo se prueban en dispositivo: los tests usan dobles.

## Output de ./init.sh
Lo corre el leader. El reviewer no ejecuta `./init.sh`, jest ni `bun test` en esta revisión: la
regla del leader lo prohíbe, y el `./init.sh` de otro worktree (`wt-236`) estaba en marcha. La
aprobación queda condicionada a que el `./init.sh` del leader salga verde sobre `a6cf10d4`, sin
regresiones, y a que el `bunx tsc --noEmit` no corrido aquí (O2) salga limpio.

**Corrida del leader.** Fue de 00:53:06 a 01:02:34 UTC del 2026-11-04, con `init=0`. La base fue
`18013ccc`, que es `a6cf10d4` más el frontmatter de O1, sin cambios de código. Antes de lanzarla no
corría ningún otro jest ni `init.sh`; el último, el jest suelto de @Frontend, ya había terminado.

```
backend   Test Suites: 198 passed, 198 total
          Tests:       1650 passed, 1650 total
e2e       Test Suites: 2 passed, 2 total
          Tests:       14 passed, 14 total
móvil     Test Suites: 181 passed, 181 total
          Tests:       6658 passed, 6658 total
          Snapshots:   1 passed, 1 total
          Test Suites: 3 skipped, 33 passed, 33 of 36 total
          Tests:       8 skipped, 599 passed, 607 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

- El móvil gana 2 suites y 45 tests frente a la base de `dev` de #236 (179 suites y 6613 tests).
  Son los de #230.
- Las 55 apariciones de `●` en el log son todas `● Console`; ningún test cae.
- El typecheck verde cierra O2.
- O1 quedó corregido en `18013ccc`.

Las dos condiciones del veredicto quedan cumplidas.
