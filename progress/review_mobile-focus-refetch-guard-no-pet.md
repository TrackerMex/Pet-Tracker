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

## Pasada de cierre sobre HEAD `7a470b7e`

Fecha: 2026-10-19
HEAD revisado: `7a470b7e` (merge `--no-ff` de `origin/main` `14ec7307` en `feature/193-mobile-focus-refetch-guard-no-pet`; primer padre `58abaed0`, segundo padre `14ec7307`).
Veredicto: APROBADO
Bloqueantes: ninguno.

Alcance: lo que cambia respecto de la segunda pasada (`4e62343a`). Son cuatro commits posteriores a `4e62343a` (`2e1696b7` y `58abaed0`, autor Claude; `cc51f37e` y `8dafe2d2`, autor AlexisSM377, registro del smoke CC4), que solo tocan `progress/`, `specs/` y `docs/`, más el merge. Los commits de la feature (`b7622910`, `8ebb6a13`, `cc3667f7`, `c1094e6a`, `4e62343a`) no cambian. Las pasadas anteriores quedan intactas.

### Drift y merge

- `git show --cc` del merge: salida vacía. Sin marcadores de conflicto en `mobile-pet-tracker`, `backend-pet-tracker` ni `infra`. `14ec7307` es ancestro de `7a470b7e`, y la ref local `origin/main` sigue en `14ec7307` (sin fetch en esta pasada).
- El merge no toca `backend-pet-tracker/` ni `infra/`. Entre los ficheros de código de #193 (pantallas y tests), main solo cambia `home/index.tsx` (3 líneas) y `home/index.test.tsx` (23 líneas), ambos de #176.
- Método. La fórmula literal de la consigna (`git diff A M -- F` igual a `git diff A MAIN -- F`) está mal definida: `M` contiene el delta de la feature, y `A..MAIN` lo invierte, así que nunca puede igualar a `A..M`. Se comprueban dos igualdades sobre líneas `+`/`-` ordenadas, sin contexto:
  - X==Y: `A..M` igual a `B..MAIN`. El merge añade solo el delta de main.
  - Z==W: `MAIN..M` igual a `B..A`. El delta de la feature sobrevive intacto.

  `A`=`4e62343a`, `M`=`7a470b7e`, `MAIN`=`14ec7307`, `B`=`cbd964da` (merge-base). Script: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/c710ce10-bc4a-4eff-a966-9572ea2de8c5/scratchpad/reviewer-193/drift.sh`. Rutas bajo `mobile-pet-tracker/src/`.

| Fichero | X | Y | X==Y | Z | W | Z==W |
|---|---|---|---|---|---|---|
| `screens/home/index.tsx` | 3 | 3 | SI | 11 | 11 | SI |
| `screens/profile/index.tsx` | 0 | 0 | SI | 11 | 11 | SI |
| `screens/reminders/index.tsx` | 0 | 0 | SI | 11 | 11 | SI |
| `screens/home/index.test.tsx` | 23 | 23 | SI | 105 | 105 | SI |
| `screens/profile/index.test.tsx` | 0 | 0 | SI | 92 | 92 | SI |
| `screens/reminders/index.test.tsx` | 0 | 0 | SI | 121 | 121 | SI |
| `__tests__/design-drift.test.ts` | 0 | 0 | SI | 18 | 18 | SI |

La comparación literal sale NO en los siete ficheros, como corresponde a esa definición.

- `feature_list.json`: `git diff 14ec7307 7a470b7e -- feature_list.json` cambia solo la línea 3435 (`"pending"` a `"in_progress"`), la entrada 193. `in_progress` en el HEAD: solo `[193]`.

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress — `in_progress` en `feature_list.json` de `7a470b7e`: solo el id 193.
- [x] progress/current.md actualizado — la línea 10 describe `7a470b7e`, el merge, `./init.sh` con exit 0 y el lint con log vacío; la línea 9 resume todavía la corrida sobre `4e62343a`. El fichero va modificado sin commit (`M`); debe entrar en el commit de cierre del leader (no bloqueante 1).

### Checklist C3 — Arquitectura
Feature de capa de presentación. El delta de #193 no toca `backend-pet-tracker/` ni `infra/`. Sus imports nuevos son solo `useRef` y `useEffect` de `react` (CC2).
- [x] domain sin imports de infrastructure — N/A por capa.
- [x] repositories/contratos en domain son interfaces puras — N/A por capa.
- [x] application depende de interfaces, no implementaciones — N/A por capa.
- [x] infrastructure sin lógica de negocio — N/A por capa.

### Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra — `git grep "#193 R"` en `7a470b7e`: 13 `describe`. Inicio: R1, R2, R3, R10. Perfil: R4, R5, R6, R10. Recordatorios: R7, R8, R9, R10. `design-drift`: R11. Cubren R1 a R11.
- [x] Historial de commits test-primero — `git log --reverse --no-merges cbd964da..4e62343a`: `b7622910` (A, solo tests: 4 ficheros, 324 inserciones) precede a `8ebb6a13` (B, producción y seis aserciones de #181). `cc3667f7` (C, producción mutada en las tres pantallas, sin tests) precede a `c1094e6a` (D, revierte C). El delta de CC2 de la feature es exactamente el de B, así que D deja la producción tal como la dejó B.

Vías de la spec (`requirements.md` líneas 40 a 63, firmada en `00925f6a` antes del handoff): vía a R1, R4, R7; vía b R2, R3, R5, R6, R8, R9, R10, R11. La evidencia de rojo en A y de mutación en C es la de la segunda pasada. Los commits no han cambiado desde entonces; no se repitieron mutaciones (instrucción del leader).

### Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" — 0 ocurrencias de `pendiente` en `7a470b7e`. 11 filas (R1 a R11), cada una con `fichero::describe` y hashes A a D. Los nombres de las 13 referencias coinciden con los `describe` de `git grep`. Los hashes A a D de la tabla coinciden con los commits del historial y son ancestros de `7a470b7e` (merge, no rebase: no se han movido).
- [x] Commits siguen `tipo(scope): desc (R-ids)` — A, B y D sí. C pone los R-ids a mitad del asunto y termina en «(rojo por aserción)» (no bloqueante 2).

### Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` (línea 3).
- [x] Casilla "Aprobado por humano" marcada con fecha — línea 95: `- [x] Aprobado por humano (fecha: 2026-10-19)`.
- [x] Ningún requisito modificado tras la aprobación — `git diff --stat 00925f6a HEAD -- specs/mobile-focus-refetch-guard-no-pet/requirements.md` vacío.

### Checklist C7 — Sin código huérfano
- [x] N/A — la feature no reemplaza ningún componente ni módulo; añade guardas y tests dentro de tres callbacks de foco.

### Checklist C8 — UI móvil
Aplica: la feature toca `mobile-pet-tracker/`. El delta de #193 no cambia JSX, estilos, testIDs ni copy (CC2). En HEAD, la rama sin mascotas de Inicio trae de main (#176) `px-5 py-6` en lugar de `p-6` y `variant="hero"` en `EmptyState` (líneas 305 y 308 de `home/index.tsx`). Ese cambio visual tiene su cierre en #176 (veredicto del reviewer, `b44ff39c`, aprobado y en main) y no se reabre aquí.
- [x] Grep-clean — `design-drift` R11 en PASS en el `init.log` de `7a470b7e` (línea 15850).
- [x] Dimensiones y safe areas — sin cambio de la feature.
- [x] Skeleton en estados de carga — sin cambio de JSX.
- [x] Componentes compartidos reutilizados — sin cambio.
- [x] Tappables con feedback pressed y touch target — sin cambio de JSX.
- [x] Animaciones nuevas — ninguna de #193. La entrada escalonada de `EmptyState` (variante `hero`) llega de main con #176 (`21c70fbf`, `7a48cde0`). El smoke se firmó sobre `4e62343a`, antes del merge, y no vio esa variante (ver CC4).

Autocrítica (`docs/ui-guidelines.md`, línea 390, «Checklist de autocrítica», que cierra «toda pantalla nueva o modificada»): no aplicable a la delta de #193, que no cambia ningún elemento visual. Mismo criterio que la segunda pasada. Pregunta 2 de la spec, abierta para el humano; no bloquea.

### CC1 a CC4
- CC1: en el `init.log` de `7a470b7e`, PASS de los cinco ficheros de CC1 en la suite móvil; `tsc --noEmit` y `expo lint` sin errores (ver Output).
- CC2: el delta de la feature en las tres pantallas solo toca el import de React (`useRef`, `useEffect`), la ref `selectedPetIdRef` con su efecto de sincronización y la guarda dentro del callback. No cambian JSX ni los arrays de dependencias de los `useCallback` de foco.
- CC3: traceability sin "pendiente"; commits según la spec.
- CC4 (humano): `progress/smoke_mobile-focus-refetch-guard-no-pet.md` registra A1 y B1 a B4 en OK, casilla `[X]`, fecha 2026-10-19, OnePlus Nord 5, Q1 respondida. El commit probado es `4e62343a`, no `7a470b7e`.
  - El merge no cambia los criterios de red de CC4. Las callbacks de foco y sus dependencias no reciben líneas de main (X==Y; las líneas de main en `home/index.tsx` son JSX, 305 y 308). `EmptyState` (`mobile-pet-tracker/src/components/empty-state.tsx`) importa de `react` (`useEffect`), `expo-image`, `heroui-native`, `react-native`, `react-native-reanimated`, `reicon-react-native`, `react-native-svg`, módulos de `../theme/` y `./pingo-float`; carga sus imágenes con `require`. No importa nada de `src/api/` ni hooks de datos. Lo que cambia en la cuenta A es el aspecto de la rama sin mascotas, no las peticiones.
  - Repetir A1 sobre `7a470b7e` es decisión del humano (`progress/current.md`, línea 10). No bloquea este veredicto. Si el humano la pide, el leader espera su resultado antes de marcar `done`.
  - La cabecera del smoke (línea 8) dice «(si antes se mergea `origin/main`, anotar el HEAD nuevo)». El merge `7a470b7e` es posterior a la firma del smoke (`cc51f37e` es ancestro del merge), así que la condición no se cumple; la anotación queda a criterio del leader.

### Output de ./init.sh (`7a470b7e`)

Ejecutado por el leader sobre `7a470b7e`. El reviewer no puede correr `init.sh` y no lo repitió.

- `init.exit`: `EXIT=0`. Ruta: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/c710ce10-bc4a-4eff-a966-9572ea2de8c5/scratchpad/init-193-merge/init.exit`.
- `head.txt`: `7a470b7e`, en la misma carpeta.
- Log completo: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/c710ce10-bc4a-4eff-a966-9572ea2de8c5/scratchpad/init-193-merge/init.log` (62 174 líneas; no pegado por tamaño).

Líneas decisivas:

```
47     STATUS.md sincronizado con feature_list.json
59     Build exitoso
220    Test Suites: 187 passed, 187 total   (backend)
221    Tests: 1474 passed, 1474 total       (backend)
233    Test Suites: 2 passed, 2 total       (infra)
234    Tests: 14 passed, 14 total           (infra)
662    $ jest                               (móvil)
1433   PASS src/screens/profile/index.test.tsx
4425   PASS src/screens/map/index.test.tsx
8112   PASS src/screens/reminders/index.test.tsx
9617   PASS src/screens/home/index.test.tsx
15850  PASS src/__tests__/design-drift.test.ts
61822  Test Suites: 124 passed, 124 total   (móvil)
61823  Tests: 4163 passed, 4163 total       (móvil)
62144  Test Suites: 3 skipped, 30 passed, 30 of 33 total   (e2e)
62145  Tests: 8 skipped, 468 passed, 476 total             (e2e)
62160  $ expo lint
62161  Lint sin errores
62164  $ tsc --noEmit
62165  Typecheck sin errores
62168  Todo verde. Listo para trabajar.
```

- Las líneas de Jest (`Test Suites:` y `Tests:`) del bloque anterior tienen los espacios normalizados al copiarlas; los números son los del log.
- Conteos sobre el log completo: `FAIL` 0, `Failed to run` 0, `SIGKILL` 0, `ELIFECYCLE` 0, `ERR_PNPM` 0, `worker process` 0, `Unable to find` 0, `pet-info-card` 0.
- Móvil: sube de 120/4008 (`4e62343a`) a 124/4163. Llegan con el merge cuatro suites nuevas de main, con rutas bajo `mobile-pet-tracker/src/`: `components/__tests__/empty-state-hero.test.tsx` (#176, `306dcbe7`); y tres de #186: `__tests__/forms-validation-global.test.ts` (`5c5e40b1`), `components/__tests__/field-error-message.test.tsx` (`6e20aea1`) y `utils/form-rules.test.ts` (`b8c0a517`). E2E: mismos números que en `4e62343a`; el merge no toca `backend-pet-tracker/` ni `infra/`.
- Lint: log separado `.../init-193-merge/lint-7a470b7e.log`, 0 bytes. El rc=0 lo declara el leader en `progress/current.md` (línea 10); no lo reproduje. La memoria del proyecto (`expo-lint-sigkill-sale-0`, `expo-lint-traga-sigkill`) registra que en los dos incidentes de SIGKILL la salida contenía `Failed to run "eslint" due to signal SIGKILL`. Ni el log completo ni el separado la contienen.

### Observaciones

Bloqueantes: ninguno.

No bloqueantes:
1. `progress/current.md` va modificado sin commit (`M`). Su línea 10 describe `7a470b7e`; la 9 resume todavía la corrida sobre `4e62343a`. Debe entrar en el commit de cierre del leader.
2. El asunto del commit C (`cc3667f7`) no termina en la lista de R-ids. Lo prescribe el handoff (L59); reescribirlo obligaría a reapuntar hashes en `traceability.md`.
3. Seis aserciones de #181 R1 (dos por pantalla) se editaron en B (`8ebb6a13`). El handoff lo autoriza (L58) y `design.md` lo prevé (Riesgos, línea 84). Sin cambio en este HEAD.
4. El flake de `#173 R9` (`profile/index.test.tsx:1043`, «Unable to find an element with testID: pet-info-card»), visto una vez en B bajo carga y descrito en la segunda pasada (observación 4), no aparece en el `init.log` de `7a470b7e`: `pet-info-card` tiene 0 ocurrencias. Si reaparece en un `init.sh`, parar con el log entero.
5. Huecos de skills del handoff (`29a8482d`): su L66 declara solo `native-data-fetching`; no declara `expo-overview` ni `expo-router`. Sin impacto visible, porque #193 no cambia nada visual. Declararlos en el próximo handoff móvil.
6. `design.md`, `tasks.md` y `traceability.md` siguen en `status: draft`. C6 exige `approved` solo en `requirements.md`. #176 (`done`) cerró también con esos tres en draft.
7. Autocrítica declarada no aplicable en esta pasada (ver C8). Pregunta 2 de la spec, abierta para el humano.
8. Preguntas de la spec: Q1 respondida en el smoke (B4: el arranque en frío con mascota carga el detalle). Q3 no tiene respuesta escrita en `requirements.md` ni en el smoke; el smoke incluyó la cuenta sin mascotas (A1, cuenta A), pero la respuesta formal es del humano. Q2 abierta. El reviewer no decide ninguna de las tres.
9. Repetir A1 sobre `7a470b7e`: decisión del humano (ver CC4).
10. Lint: el rc=0 del log separado lo declara el leader y no lo reproduje (ver Output). Sin huella de SIGKILL en ninguno de los logs.

Veredicto de esta pasada: APROBADO, sin bloqueantes.
