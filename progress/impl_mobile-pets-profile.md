# Implementación — mobile-pets-profile (#40)

Fecha: 2026-08-24

Branch: `feature/40-mobile-pets-profile`

Estado: implementación automatizable R1–R9 completa; reviewer y R10 humano pendientes.

## Resultado

- Profile usa `GET /users/me`, lista/selección de mascotas, hero, pills,
  información, enlaces a Reminders/Docs, cierre de sesión y toggle de tema.
- El tema se persiste en SecureStore y se restaura antes del árbol estable.
- `PetAvatar` comparte el fallback determinista de `blobatar(name)` entre
  Profile, AddPet y Home; una `photoUrl` real siempre tiene precedencia.
- `/pets/add` es una ruta delgada y el screen envía el contrato exacto de
  `CreatePetSchema`, con edad exclusiva, opcionales omitidos y feedback de
  validación/envío.
- La foto usa `expo-image-picker`, limita MIME a JPEG/PNG/WebP, pide la URL
  presignada después de confirmar la imagen y hace el PUT crudo sin token.
- `/pets/[petId]/docs` consume mediante `listPetDocs` el contrato fake de
  `media-docs-api` (#49), con skeleton, lista, vacío, degradación y retry.
- Las rutas Expo son delgadas y el código nuevo pasa las guardias de tokens,
  color y `StyleSheet`.

## Evidencia TDD

| R-id | Commit rojo | Commit verde |
|---|---|---|
| R1 | `cf360d0` | `8d2dd19` |
| R2 | `42f2bbb` | `0c0f5b0` |
| R3 | `ea75755` | `55dd4c9` |
| R4 | `236ddde` | `a2fb2e8` |
| R5 | `90ad564` | `a410eba` |
| R6 | `99f0636` | `f44f8dc` |
| R7 | `709d706` | `b37bbe4` |
| R8 | `19e1087` | `05ab786` |
| R9 | `ffefbb8` | `91c9ad2` |

La evidencia archivo::suite y las excepciones autorizadas C4/Q2 están en
`specs/mobile-pets-profile/traceability.md`.

## Verificación

- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0.
- `bun run test`: 46 suites, 517 tests y 1 snapshot verdes.
- `./init.sh`: exit 0, `✅ Todo verde`.
  - backend unitario: 145 suites / 1114 tests.
  - infraestructura: 2 suites / 14 tests.
  - backend e2e: 20 suites verdes, 2 omitidas; 327 tests verdes, 6 omitidos.
  - móvil: 46 suites / 517 tests.
- Diff directo de `package.json` desde `7ca9aef`: solo se añadieron
  `blobatar@^2.5.0` y `expo-image-picker@~57.0.13`; la versión de
  `@gorhom/bottom-sheet` sigue en `^5.2.14`.
- No se tocaron `backend-pet-tracker/`, `infra/` ni variables de entorno.

Al inicio, un primer `./init.sh` tuvo una inestabilidad preexistente de orden
en `health-vaccines.e2e-spec.ts`; la reejecución aislada pasó 15/15. El gate
final completo pasó sin reintento.

## Gates pendientes

- R10 no se ejecutó ni se marcó: requiere smoke humano en Expo Go SDK 57
  Android con backend local y LocalStack.
- La parte Docs del smoke real está bloqueada hasta que #49
  `media-docs-api` esté `done`; sus tests móviles usan `fetchFn` fake como
  exige la spec.
- La feature permanece `in_progress`; no se marcó `done` ni se abrió/mergeó
  PR. Tampoco se hizo push, por instrucción expresa del handoff.

## Observaciones de entorno

- La skill `expo-project-structure` mencionada por el handoff no estaba
  instalada en esta sesión. Se siguieron directamente `AGENTS.md`, las specs,
  `docs/conventions.md` y los patrones Expo ya versionados en el repositorio.
- Los archivos no trackeados preexistentes bajo `.agents/`, `.claude/skills/`
  y `skills-lock.json` se preservaron y no forman parte de los commits.

## Corrección post-review fix 1

- Resuelto el bloqueante C7: se retiraron el módulo huérfano
  `src/api/health.ts` y su suite `src/api/__tests__/health.test.ts` como
  continuación de la excepción C4/Q2. `src/api/health-records.ts` y sus
  consumidores no se tocaron.
- La fila R3 de trazabilidad documenta la retirada completa de UI, módulo y
  suite de backend-health. La fila R9 justifica que el cambio previo en
  `src/app/(tabs)/__tests__/screens.test.tsx` fue solo scaffolding de
  mocks/provider y preservó las aserciones de #33.
- `bun run test`: exit 0, 45 suites / 509 tests / 1 snapshot verdes.
- `bun run typecheck`: exit 0.
- `bun run lint`: exit 0.
- `./init.sh`: exit 0, `✅ Todo verde`; backend e2e con 20 suites / 327
  tests verdes (2 suites y 6 tests omitidos), lint y typecheck verdes.

## R10 — corrección de smoke 2 (2026-08-25)

- Hallazgo del smoke humano: abrir AddPet crasheaba con
  `useSelectedPet must be used within a SelectedPetProvider` porque
  `/pets/add` salía del layout `(tabs)`, único lugar que monta el provider.
- Corrección: `pets/add.tsx` y `pets/[petId]/docs.tsx` se movieron bajo
  `src/app/(tabs)/pets/`; `(tabs)` no forma parte de la URL, por lo que se
  conservan `/pets/add` y `/pets/[petId]/docs` sin cambiar ningún
  `router.push`.
- TDD: `644a00c` demuestra el rojo con una guarda estructural en el test del
  layout; `5bae7b0` mueve las rutas y actualiza la guardia R9 de entrypoints.
- `DocsScreen` no consume `useSelectedPet`, pero su route queda dentro del
  mismo layout autenticado y cubierta por la misma regresión estructural.
- Gates móviles: `bun run test` (45 suites / 510 tests / 1 snapshot),
  `bun run typecheck` y `bun run lint` terminaron con exit 0.
- El smoke humano R10 queda pendiente de repetirse en Expo Go; este fix no lo
  marca como completado. La parte Docs sigue bloqueada por #49.

## R10 — corrección de smoke 3 (2026-08-25)

- Hallazgo del smoke humano: tras crear una mascota y volver con
  `router.replace('/profile')`, Profile conservaba la lista montada y no
  mostraba el alta hasta recargar la app completa.
- Corrección: Profile revalida `listPets` y el detalle activo al recuperar
  foco mediante el mismo `useFocusEffect` de Reminders. Home tampoco
  refetcheaba al foco, por lo que aplica el mismo patrón para que la mascota
  y su foto nuevas aparezcan sin reiniciar la app.
- Health y Food no se tocaron; tampoco `use-api.ts`, rutas, layouts, backend,
  infraestructura ni la capa API.
- TDD: `a8cbd7e` demuestra el rojo en Profile y Home → `c3ce9b9` registra
  el refetch estable y el scaffolding del mock compartido de Expo Router.
- Gates móviles: `bun run test` (45 suites / 512 tests / 1 snapshot),
  `bun run typecheck` y `bun run lint` terminaron con exit 0.
- El smoke humano R10 queda pendiente de repetirse en Expo Go; este fix no lo
  marca como completado. La parte Docs sigue bloqueada por #49.

## R10 — corrección de smoke 4 (2026-08-25)

- Hallazgo del smoke humano: fix3 no surtía efecto porque AddPet volvía con
  `router.replace('/profile')`; sobre el navegador de tabs esa acción no
  producía el ciclo de foco que dispara el `useFocusEffect` de Profile.
- Corrección: el éxito de AddPet, tanto sin foto como después de subirla,
  vuelve con `router.back()`, igual que AddReminder. Profile no ejecuta el
  auto-select sobre datos stale mientras `pets.isRefreshing`, por lo que no
  pisa el id de la mascota recién creada antes de que termine el refetch.
- TDD: `d3c00cd` demuestra los tres rojos (navegación sin/con foto y carrera
  de selección) → `9bf01bc` aplica los dos cambios puntuales y estabiliza la
  espera observable del preview en el test de foto.
- No se tocaron hooks API, layouts, tabs, floating tab bar, capa API, backend
  ni infraestructura; no se añadieron dependencias.
- Gates móviles: `bun run test --runInBand` (45 suites / 513 tests / 1
  snapshot), `bun run typecheck` y `bun run lint` terminaron con exit 0.
- El smoke humano R10 queda pendiente de repetirse en Expo Go; este fix no lo
  marca como completado. La parte Docs sigue bloqueada por #49.

## R10 — corrección de smoke 5 (2026-08-25)

- Hallazgo del smoke humano: al entrar en Home tras el alta, la lista stale
  todavía no contenía la mascota nueva y el auto-select reemplazaba su id por
  el primer pet. La misma carrera estaba duplicada en Home, Health y Food.
- Corrección: las tres pantallas omiten el auto-select mientras
  `pets.isRefreshing`, replicando exactamente el guard existente de Profile,
  y observan `pets.isRefreshing` en las dependencias del efecto.
- TDD: `6ef7c26` demuestra los tres rojos con una selección ausente de la
  lista stale durante el refetch → `76f7990` conserva la selección hasta que
  la lista resuelta incluye el id nuevo.
- Nota futura, sin implementar en este fix: el efecto de auto-select queda
  cuadruplicado entre Profile, Home, Health y Food; si otra feature vuelve a
  tocarlo, es candidato a un hook compartido `use-pet-selection`.
- No se tocaron `use-api.ts`, providers, layouts, floating tab bar, capa API,
  backend ni infraestructura; no se añadieron dependencias.
- Gates móviles: `bun run test` (45 suites / 516 tests / 1 snapshot),
  `bun run typecheck` y `bun run lint` terminaron con exit 0. `./init.sh`
  final terminó con exit 0 y `✅ Todo verde`.
- El smoke humano R10 queda pendiente de repetirse en Expo Go; este fix no lo
  marca como completado. La parte Docs sigue bloqueada por #49.
