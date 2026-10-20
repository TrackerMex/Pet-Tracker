---
feature: "mobile-focus-refetch-guard-no-pet"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-focus-refetch-guard-no-pet]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Esa guía describe
> solo backend; aquí el cambio es de presentación en `mobile-pet-tracker/src/screens/`.
> No hay `progress/explore_mobile-focus-refetch-guard-no-pet.md`: la feature no es
> ambigua (decisión del humano del 2026-10-18 y premisa medida, abajo).

## Premisa verificada

- `@tanstack/react-query` 5.102.8 (pin exacto en `mobile-pet-tracker/package.json`) y `@tanstack/query-core` 5.102.8 (`mobile-pet-tracker/bun.lock`). El tarball del registro coincide en sha512 con el de `bun.lock`.
- En `build/modern/queryObserver.js` de query-core, `refetch` pasa por `fetch`, luego por `#executeFetch` y por `currentQuery.fetch`, sin mirar `enabled`. `enabled` solo gobierna la carga automática. `query.js` tampoco tiene puerta de `enabled`. Por eso `refetch()` ejecuta el `queryFn` aunque `enabled` sea `false`.
- `expo-router` 57.0.14, `build/useFocusEffect.js`: el efecto tiene como dependencias la callback, `navigation` y `optionalNavigation`. Si la pantalla está enfocada, la callback se vuelve a ejecutar cuando cambia su identidad. Consecuencia: añadir `selectedPetId` a las dependencias dispararía un refetch extra en cada cambio de selección con la pantalla enfocada.
- Estado de selección: `useSelectedPet()` (`mobile-pet-tracker/src/providers/selected-pet-provider.tsx`) devuelve `selectedPetId: string | null`; vale `null` cuando la selección guardada no pertenece al token actual (`selection.token === token ? selection.petId : null`). `usePetSelection` (`mobile-pet-tracker/src/hooks/use-pet-selection.ts`) selecciona la primera mascota si no hay selección y limpia la selección si la lista queda vacía.
- Consultas de Inicio (`src/screens/home/index.tsx`): `pets` (`listPets`, sin `enabled`), `detail` (`getPet`, `enabled: selectedPetId !== null`), `activity` y `reminders` (con el mismo `enabled`), `openAlerts` (`listAlerts(..., 'open')`, sin `enabled`). En Perfil (`detail`) y en Recordatorios (`reminders`), la consulta de mascota también tiene `enabled: selectedPetId !== null`.

## Skills de referencia

Materia para el handoff: router (`useFocusEffect`) y data-fetching (refetch de TanStack Query). Los nombres de skill para Codex los fija el leader según `.claude/agents/leader.md` (§Catálogo real de skills de Codex). Esta spec no los nombra.

## Decisiones técnicas

- **D1. La guarda va en la callback de foco, delante de la llamada de refetch de mascota.** Como `refetch()` ignora `enabled`, la condición tiene que escribirse en el sitio de la llamada. Es la misma condición que `enabled` de la consulta: `selectedPetId` no es `null`. Sirve a R1, R2, R4, R5, R7 y R8.
- **D2. El valor vigente llega a la callback por una referencia, no por dependencias.** Cada pantalla afectada declara `selectedPetIdRef`, un `useRef` tipado como `string | null` e inicializado con `selectedPetId`. Un `useEffect` lo actualiza en cada commit y se declara antes del `useFocusEffect`, así que React lo ejecuta antes que la callback de foco del mismo commit (React ejecuta los efectos de un componente en orden de declaración). La callback lee `selectedPetIdRef.current`. La ref no se lee durante el render. Sirve a R1, R2, R4, R5, R7 y R8 (valor correcto), y a R10 (identidad estable). Sin la ref, la callback vería el valor del render en que se creó; con la selección en las dependencias, se re-ejecutaría (premisa).
- **D3. Comparación explícita con `null`.** La guarda es `selectedPetIdRef.current !== null`, no una comprobación de verdad, para que sea idéntica a `enabled`. Sirve a R1, R2, R4, R5, R7 y R8.
- **D4. Refetch general sin guarda.** `refetchPets()` (Inicio y Perfil) y `refetchOpenAlerts()` (Inicio) se llaman en ambos estados; no dependen de la mascota. Sirve a R3 y R6.
- **D5. Recordatorios: la guarda envuelve solo `refetchReminders()`.** La callback sigue devolviendo siempre la función de limpieza (`deleteCandidate` y `actionError` a `null`); no hay retorno temprano. Sirve a R9. Un retorno temprano antes de la limpieza dejaría visible la confirmación de borrado o el error al perder el foco.
- **D6. Dependencias intactas.** El array de dependencias de cada `useCallback` de foco no cambia: Inicio `[refetchDetail, refetchOpenAlerts, refetchPets]`, Perfil `[refetchDetail, refetchPets]`, Recordatorios `[refetchReminders]`. `QueryObserver` enlaza `refetch` una sola vez en `bindMethods()` (`this.refetch = this.refetch.bind(this)`, en `build/modern/queryObserver.js`), así que su identidad es estable por observador y no cambia con la selección. Sirve a R10.
- **D7. Imports.** Inicio añade `useRef` (ya importa `useEffect`). Perfil añade `useEffect` y `useRef`. Recordatorios añade `useEffect` y `useRef`. No hay dependencias nuevas.
- **D8. Mapa no se toca.** Su callback de foco ya sale si no hay `selectedPetId`, antes de cualquier refetch. Duplicar la guarda allí no aporta nada.

## Archivos afectados por capa

Capa de presentación (`mobile-pet-tracker/src/screens/`). No cambian domain, application ni infrastructure del backend, ni `src/api/`, `src/providers/`, `src/hooks/`, `src/components/`, `src/theme/` ni `docs/`.

- `mobile-pet-tracker/src/screens/home/index.tsx`: import de `useRef`; `selectedPetIdRef` con su `useEffect` de sincronización, declarado antes del `useFocusEffect`; guarda de la llamada a `refetchDetail()` dentro de la callback de foco. Sin cambio de JSX ni de dependencias (D1 a D3, D6, D7).
- `mobile-pet-tracker/src/screens/profile/index.tsx`: imports de `useEffect` y `useRef`; ref y sincronización; guarda de la llamada a `refetchDetail()`. `refetchPets()` sin guarda (D1 a D4, D6, D7).
- `mobile-pet-tracker/src/screens/reminders/index.tsx`: imports de `useEffect` y `useRef`; ref y sincronización; guarda de la llamada a `refetchReminders()`. La función de limpieza no cambia (D1 a D3, D5 a D7).
- `mobile-pet-tracker/src/screens/home/index.test.tsx`: describes `#193 R1:`, `#193 R2:`, `#193 R3:` y `#193 R10:`.
- `mobile-pet-tracker/src/screens/profile/index.test.tsx`: describes `#193 R4:`, `#193 R5:`, `#193 R6:` y `#193 R10:`.
- `mobile-pet-tracker/src/screens/reminders/index.test.tsx`: describes `#193 R7:`, `#193 R8:`, `#193 R9:` y `#193 R10:`.
- `mobile-pet-tracker/src/__tests__/design-drift.test.ts`: describe `#193 R11:` con los tres ficheros de pantalla en su lista de ficheros, con rutas relativas a `src/` (`screens/home/index.tsx`, etc.).

Sin cambios: `src/api/pets.ts` (`getPet`), `src/api/reminders.ts` (`listReminders`), `src/providers/selected-pet-provider.tsx`, `src/hooks/use-pet-selection.ts`, `src/screens/map/index.tsx`, `src/components/`, `src/theme/` y el backend.

## Impacto de UI

- Sin cambio visual. No se tocan JSX, estilos, testIDs ni copy. Las dimensiones de pantalla (`docs/ui-guidelines.md` §3.6, que remite a `conventions.md` §Dimensiones) y los componentes compartidos de `src/components/` (§3.4) quedan como están.
- La grep-clean (§3) se mantiene y se prueba con R11.
- Checklist de autocrítica: pregunta abierta 2 en `requirements.md`.

## Estrategia de pruebas

- **Foco.** Los tres ficheros de test mockean `expo-router` con `useFocusEffect: jest.fn()`. La callback se toma con `mockUseFocusEffect.mock.calls.at(-1)?.[0]` y se ejecuta dentro de `act` asíncrono, como ya hacen los tests de foco de cada fichero.
- **Sin mascota.** Se usa el spy sobre `selectedPetHooks.useSelectedPet` (módulo `src/providers/selected-pet-provider`) que devuelve `selectedPetId: null` y conserva el `selectPet` real, igual que el patrón existente de `home/index.test.tsx`.
- **Contadores.** Se mide la diferencia de llamadas de `mockGetPet`, `mockListReminders`, `mockListPets` o `mockListAlerts` antes y después de invocar la callback. Antes hay que esperar a que termine la carga inicial: con datos en caché, un refetch cancela y repite la petición en vuelo (`cancelRefetch` es true por defecto en v5 y la cancelación solo ocurre si la consulta ya tiene datos; `build/modern/queryObserver.js` y `build/modern/query.js`), y eso falsearía el recuento.
- **Identidad (R10).** Se compara con `Object.is` la callback capturada antes y después de cambiar la selección y rerenderizar. No se usa `toBe` sobre instancias de React (memoria del proyecto: tumba el worker de jest).
- **R9.** Para llegar a la confirmación de borrado hace falta selección no nula. La prueba prepara esa confirmación con selección no nula, cambia la selección a `null` sin desmontar la pantalla, invoca la función de limpieza devuelta por la callback de foco y comprueba que la confirmación y el error ya no están.
- **Rojo legítimo (C4).** R1, R4 y R7 fallan por la aserción de la llamada (`getPet` o `listReminders` invocados con selección nula), no por un import inexistente ni por un doble alterado.
- **Esperas.** `await` en `renderWithProviders`, en `act` y en `rerender`, para que ningún `it` contamine al siguiente.
- **R11.** Se aplica a los tres ficheros de pantalla la regex grep-clean que `design-drift.test.ts` ya define (`PAIRING_STYLE_ESCAPES`: hex, clases arbitrarias, `StyleSheet.create`, sombra o elevación), con `expect(violations).toEqual([])`.
- **Exención de design-drift.** Cualquier `#193` que aparezca en comentarios o cadenas de los ficheros tocados va seguido de ` R<n>`. Si no, `HEX_LITERAL` lo toma por un literal hex.

## Alternativas descartadas

- **Guarda dentro de `getPet` o `listReminders` (`src/api/`)**: cambia el contrato de todos los llamadores y pone la lógica de pantalla en la capa de datos. Descartada.
- **Centinela en `queryFn`** (devolver sin petición si el id es `null`): el refetch seguiría entrando en `queryFn`, la consulta quedaría en éxito con datos falsos y cambia la semántica de datos. No cumple «no hacer el refetch». Descartada.
- **`enabled` como guarda del refetch**: `refetch()` lo ignora (medido en query-core 5.102.8). Descartada.
- **Añadir `selectedPetId` a las dependencias de los `useCallback` de foco**: re-ejecuta la callback en cada cambio de selección con la pantalla enfocada y repite las llamadas de refetch. Es la mutación M-R10. Descartada.
- **Hook compartido `useFocusRefetch`**: tres usos con diferencias (Recordatorios devuelve limpieza, Inicio tiene refetch general). Abstracción no pedida. Descartada.
- **Retorno temprano en Recordatorios si la selección es `null`**: omite la limpieza de `deleteCandidate` y `actionError` al perder el foco (R9). Descartada.
- **Leer la selección desde el provider dentro de la callback**: requeriría un getter nuevo en `providers/` (fuera de alcance). La ref da el valor vigente sin tocar la capa de estado. Descartada.

## Riesgos

- Los tests no ejecutan el `useFocusEffect` real de expo-router. El proxy observable es la callback capturada (R1 a R9) y su identidad (R10). El disparo real al navegar se valida en el smoke del humano (CC4).
- Entre el cambio de selección y el vaciado del efecto de sincronización, la ref puede llevar un instante el valor anterior. Si el foco cae en ese intervalo, la guarda usa el valor previo. No tiene test; se acepta.
- Un test existente que asevere la petición sin mascota fallaría al implementar. Se actualiza en el commit B y se declara en su mensaje; no se borra sin justificación.
- Si la identidad de `refetch` no fuera estable entre renders, R10 fallaría en verde y habría que reabrir D6. No se espera: el observador enlaza `refetch` una vez.
