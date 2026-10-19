# review: mobile-focus-refetch-guard-no-pet
Fecha: 2026-10-19T19:30:55+00:00
Veredicto: APROBADO

Revisado: segunda pasada sobre la rama `feature/193-mobile-focus-refetch-guard-no-pet` en HEAD `4e62343a`, diff contra H0 `29a8482d` (9 ficheros: tres pantallas, cuatro tests, `traceability.md` e `impl_mobile-focus-refetch-guard-no-pet.md`). Fuera de la revisión y de los commits: `progress/leader_validacion_mobile-focus-refetch-guard-no-pet.md` (sin seguimiento, decisión del leader).

Bloqueantes: ninguno. Los dos de la primera pasada (C2 y log de `./init.sh` en HEAD) están resueltos. C2 a C8 cumplen.

## Primera pasada (RECHAZADO, HEAD `4e62343a`)

Bloqueantes de entonces:
1. `progress/current.md` sin actualizar (C2). Describía la implementación como pendiente. Resuelto: el leader actualizó las líneas 9 y 10 al estado real (commits A–D y el informe en HEAD, `./init.sh` con exit 0, segunda pasada del reviewer y CC4 pendientes). El cambio queda sin commit por decisión del leader (observación 1).
2. Sin log de `./init.sh` en HEAD `4e62343a`. El reviewer no lo ejecuta: el clasificador le deniega `init.sh`. Resuelto: el leader lo corrió sin pipe sobre `4e62343a` (EXIT=0, log completo en «Output de ./init.sh») y el lint con log vacío. Verificado en la segunda pasada.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress — `feature_list.json`: la única entrada `in_progress` es el id 193.
- [x] progress/current.md actualizado — líneas 9 y 10 describen el estado real: commits A `b7622910`, B `8ebb6a13`, C `cc3667f7`, D `c1094e6a` y docs `4e62343a` en HEAD (verificado con `git log`), `./init.sh` del leader con exit 0, segunda pasada del reviewer y CC4 pendientes. El fichero va modificado sin commit por decisión del leader (observación 1).

## Checklist C3 — Arquitectura
Feature solo de capa de presentación (`mobile-pet-tracker/src/screens/`). El diff no toca `backend-pet-tracker/`; las reglas de C3 son de domain, application e infrastructure del backend.
- [x] domain sin imports de infrastructure — N/A por capa.
- [x] repositories/contratos en domain son interfaces puras — N/A por capa.
- [x] application depende de interfaces, no implementaciones — N/A por capa.
- [x] infrastructure sin lógica de negocio — N/A por capa.

Los únicos imports nuevos del diff de producción son `useRef` y `useEffect` de `react`; no cambian el JSX ni las dependencias de los `useCallback` de foco (CC2).

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra — 11 de 11. Los `describe` `#193 R<n>:` están en `home/index.test.tsx`, `profile/index.test.tsx`, `reminders/index.test.tsx` y `design-drift.test.ts`. R10 aparece en los tres ficheros de pantalla.
- [x] Historial de commits muestra test-primero — A `b762291` (solo tests, 4 ficheros) precede a B `8ebb6a1` (producción más seis aserciones de #181). C `cc3667f` (solo producción mutada) precede a D `c1094e6`, que revierte C; la producción en HEAD es idéntica a la de B. La vía de cada R la declara la spec antes del handoff (`requirements.md` líneas 40–63, firmada en `00925f6a`; handoff en `29a8482d`):
  - vía a: R1, R4, R7.
  - vía b: R2, R3, R5, R6, R8, R9, R10, R11.

Rojo de vía a en A. Líneas de HEAD; el texto de cada línea es la aserción roja. Fuente: JSON de A del implementer (`A-home.json`, `A-profile.json`, `A-reminders.json` en `/tmp/pet-tracker-193.nUdhNb/`). Un único `it` rojo por fichero, con `expect(received).toEqual(expected)`. El resto verde (`A-design.json`: 114/114). No reproducido por mí.

| R | Test | Línea | Aserción que falla en A |
|---|---|---|---|
| R1 | `home/index.test.tsx`: «#193 R1: Inicio sin mascota no pide detalle al enfocar» | 5317 | `expect(mockGetPet.mock.calls.slice(before)).toEqual([])` |
| R4 | `profile/index.test.tsx`: «#193 R4: Perfil sin mascota no pide detalle al enfocar» | 1782 | `expect(mockGetPet.mock.calls.slice(before)).toEqual([])` |
| R7 | `reminders/index.test.tsx`: «#193 R7: sin mascota no pide recordatorios al enfocar» | 1513 | `expect(mockListReminders.mock.calls.slice(before)).toEqual([])` |

Mutación de control de vía b (versionada en C `cc3667f`, revertida en D `c1094e6`). Reproducida por mí sobre copia completa del repo con la mutación conjunta de C: guarda temprana en Inicio y Recordatorios, `refetchPets()` dentro del guard en Perfil, `selectedPetId` añadido a las dependencias de las tres pantallas y un `style` con `#fff` en Inicio. Resultado: 11 `it` seleccionados, 11 fallidos, 0 pasados, todos con fallo de `expect`; ningún error de suite.

| R | Fichero:línea | Aserción que falla en C |
|---|---|---|
| R2 | home:5339 | `expect(mockGetPet.mock.calls.slice(before)).toEqual([[apiUrl, 'jwt-token', 'pet-1']])` |
| R3 | home:5355 | `expect(mockListPets.mock.calls.slice(petsBefore)).toEqual([[apiUrl, 'jwt-token']])` |
| R5 | profile:1802 | `expect(mockGetPet.mock.calls.slice(before)).toEqual([[apiUrl, 'jwt-token', 'pet-1']])` |
| R6 | profile:1817 | `expect(mockListPets.mock.calls.slice(before)).toEqual([[apiUrl, 'jwt-token']])` |
| R8 | reminders:1533 | `expect(mockListReminders.mock.calls.slice(before)).toEqual([[apiUrl, 'jwt-token', 'pet-1']])` |
| R9 (confirmación) | reminders:1568 | `expect(screen.queryByTestId('reminders-delete-sheet')).toBeNull()` |
| R9 (error) | reminders:1569 | `expect(screen.queryByTestId('reminders-action-error')).toBeNull()` |
| R10 (Inicio) | home:5374 | `expect(Object.is(focus, mockUseFocusEffect.mock.calls.at(-1)?.[0])).toBe(true)` |
| R10 (Perfil) | profile:1833 | igual que R10 (Inicio) |
| R10 (Recordatorios) | reminders:1587 | igual que R10 (Inicio) |
| R11 | design-drift:170 | `expect(violations).toEqual([])` (recibe `["screens/home/index.tsx"]`) |

Las mutaciones aisladas, una por grupo (`isolated-*.json` del implementer), fallan cada una solo las aserciones de su R: R2 en 5339, R3 en 5355, R5 en 1802, R6 en 1817, R8 en 1533, R9 en 1568 y 1569, R10 en 5374, 1833 y 1587, R11 en 170. Están parseadas del JSON del implementer; no las reproduje.

En D (HEAD), CC1 en verde: 827/827 en los cinco ficheros de CC1 (home, profile, reminders, map, design-drift), con caché nueva.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" — 11 filas (R1–R11), cada una con test `fichero::describe` y hashes de A a D. Las 13 referencias a tests existen y pasan en HEAD (CC1).
- [x] Commits siguen el formato `tipo(scope): desc (R-ids)` — A, B y D lo cumplen. C (`test(mobile): mutaciones de control para R2,R3,R5,R6,R8,R9,R10,R11 (rojo por aserción)`) pone los R-ids en la descripción y termina en «(rojo por aserción)», no en la lista de R-ids. Lo prescribe el handoff (L59). Observación: no bloquea, y reescribirlo obligaría a reapuntar hashes en `traceability.md`. El commit `4e62343a` usa el rango «(R1-R11)».

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` en el frontmatter.
- [x] Casilla "Aprobado por humano" marcada con fecha — línea 95: `- [x] Aprobado por humano (fecha: 2026-10-19)`.
- [x] Ningún requisito modificado tras la aprobación — `git log 00925f6a..HEAD -- requirements.md` vacío.

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente: añade guardas y tests dentro de tres callbacks de foco y no sustituye ningún componente ni módulo.

## Checklist C8 — UI móvil
Aplica: la feature toca `mobile-pet-tracker/`.
- [x] Grep-clean — `design-drift` R11 en verde en HEAD (CC1) y en rojo al plantar `#fff` en Inicio (mutación de C).
- [x] Dimensiones y safe areas — sin cambio: el diff no toca JSX ni estilos (CC2).
- [x] Skeleton en estados de carga — sin cambio de JSX.
- [x] Componentes compartidos reutilizados — sin cambio.
- [x] Tappables con feedback pressed y touch target — sin cambio de JSX.
- [x] Animaciones nuevas — no hay.

Autocrítica (`docs/ui-guidelines.md`, «Checklist de autocrítica»): declarada no aplicable en esta revisión. El checklist se aplica a pantallas nuevas o modificadas y es de contenido visual; este diff no cambia ningún elemento visual (JSX, estilos, testIDs ni copy). La pregunta 2 de la spec, abierta, admite esa decisión en la revisión. Si el humano exige capturas, lo pide en CC4.

## Observaciones
Bloqueantes: ninguno.

No bloqueantes (8):
1. `progress/current.md` va modificado sin commit por decisión del leader; sus líneas 9 y 10 ya describen el estado real. Debe entrar en el commit de cierre.
2. El asunto del commit C (`cc3667f7`) no lleva la lista de R-ids al final. Lo prescribe el handoff (L59); reescribirlo obligaría a reapuntar hashes en `traceability.md`. Ver C5.
3. Seis aserciones de #181 R1 (S2/S4 en Inicio, Perfil y Recordatorios) se modificaron en B, no en un commit rojo previo. `design.md` (Riesgos, línea 84) lo prevé, el handoff lo autoriza (L58) y el mensaje de B lo declara. Anotado para C4; no bloquea.
4. Flake de `#173 R9` (`profile/index.test.tsx:1043`, «Unable to find an element with testID: pet-info-card», `Time: 298.256 s`), visto una vez en B bajo carga (loadavg 4–7). No reproducido en D, en HEAD ni en las cuatro reejecuciones del leader. Decisión del leader en el fichero sin seguimiento: si reaparece en el `init.sh`, parar con el log entero.
5. Huecos de skills no declarados en el handoff. El handoff nombra `native-data-fetching` (L66). El catálogo de Codex no tiene equivalente de `expo-overview` ni de `expo-router` (`.claude/agents/leader.md`, líneas 152–161), y la materia de foco (`useFocusEffect`) queda sin skill. La compensación fue «La guía de foco está en design.md» y la lectura de la documentación de Expo SDK 57 que exige `mobile-pet-tracker/AGENTS.md` (informe de implementación, línea 12). Sin impacto visible, porque no hay cambio visual. Declarar los huecos en el próximo handoff móvil.
6. `design.md`, `tasks.md` y `traceability.md` siguen con `status: draft` en el frontmatter. C6 exige `approved` solo en `requirements.md`.
7. Autocrítica declarada no aplicable en esta revisión (ver C8). La pregunta 2 de la spec queda abierta para CC4.
8. Preguntas 1 (arranque en frío) y 3 (alcance del smoke) de la spec, y CC4 (smoke Android en el dev build), son del humano. No bloquean. `done` espera a CC4; esta revisión no lo autoriza.

## Output de ./init.sh

Ejecutado por el leader sobre HEAD `4e62343a` en `/home/claude/sites/Pet-Tracker-wt-193`, sin pipe. Al lanzar `init.sh` solo había un fichero sin seguimiento: `progress/leader_validacion_mobile-focus-refetch-guard-no-pet.md`. El review aún no existía.

- Exit code de `./init.sh`: `EXIT=0` (fichero `init.exit`).
- Log completo, 60 440 líneas, no pegado por tamaño: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/c710ce10-bc4a-4eff-a966-9572ea2de8c5/scratchpad/init-193/init.log`.
- Entorno de la corrida: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/c710ce10-bc4a-4eff-a966-9572ea2de8c5/scratchpad/init-193/env.txt`. Contiene solo el sello de fecha `2026-10-19T18:20:30+00:00`; el entorno de la corrida no quedó registrado. Comprobado después, en el shell del leader: ninguna de `FORCE_COLOR`, `NO_COLOR` ni `CI` está definida.
- Cero líneas `FAIL` en el log. Los `ERROR` de Nest y los `console.error` son salida de los propios tests.

Líneas decisivas:

```
✅ Dependencias instaladas
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
Test Suites: 187 passed, 187 total   Tests: 1474 passed, 1474 total   (backend, línea 220)
Test Suites: 2 passed, 2 total       Tests: 14 passed, 14 total       (infra, línea 233)
Test Suites: 120 passed, 120 total   Tests: 4008 passed, 4008 total   (mobile, `$ jest` en línea 662; PASS de home, profile, reminders y design-drift)
✅ Tests pasados
Test Suites: 3 skipped, 30 passed, 30 of 33 total   Tests: 8 skipped, 468 passed, 476 total   (e2e, línea 60410; los saltados no los revisó el leader)
✅ Tests e2e pasados
$ expo lint                 (línea 60426)
✅ Lint sin errores
$ tsc --noEmit             (línea 60430)
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Lint con log vacío, comprobación separada, porque un SIGKILL de `expo lint` sale con 0:

```
cd mobile-pet-tracker && bunx expo lint --no-cache > <log> 2>&1
rc=0, bytes=0
```

Log de esa comprobación: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/c710ce10-bc4a-4eff-a966-9572ea2de8c5/scratchpad/init-193/lint-4e62343a.log` (0 bytes).

Verificado por el reviewer sobre el log (lectura de los logs; no se ejecutó nada):
- `init.exit` = `EXIT=0`.
- Jest móvil (`$ jest`, línea 662): `Test Suites: 120 passed, 120 total` (línea 60088) y `Tests: 4008 passed, 4008 total` (línea 60089). La línea 60086 es el aviso `A worker process has failed to exit gracefully`; no es un fallo, y la memoria del proyecto lo registra como preexistente en `main`.
- Backend (`jest`, línea 220): 187/187 suites y 1474/1474 tests. Infra (línea 233): 2/2 y 14/14. E2E backend (`test:e2e`, línea 60120; resumen en líneas 60410-60411): 30 suites pasan y 3 se saltan, de 33; 468 tests pasan y 8 se saltan, de 476. Ajenos a #193, porque el diff no toca `backend-pet-tracker/`.
- `FAIL` en mayúsculas: 0 líneas. `ERR_PNPM` y `ELIFECYCLE`: 0. Las demás apariciones de `failed` o `Failed` son trazas o logs: `setLostModeFailed` (líneas 1120 y 1131, pantalla de mapa), `Failed query` (línea 60212, log de Nest en e2e) y el aviso de la línea 60086.
- `expo lint` (línea 60426): `Lint sin errores` (línea 60427). `tsc --noEmit` (línea 60430): `Typecheck sin errores` (línea 60431). `Todo verde` (línea 60434).
- Lint con log separado: 0 bytes, comprobado con `test ! -s`. El `rc=0` lo declara el leader.
