---
feature: "mobile-no-pets-states-and-centered-content"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-no-pets-states-and-centered-content]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
> Rutas relativas a `mobile-pet-tracker/` salvo que se diga `docs/` o `specs/`.
> Los `describe` de esta feature llevan el prefijo `#181 Rn` (conventions §Tests:
> varios ficheros de test ya acumulan R-ids de otras specs).

## 0. Base, premisas y decisiones de partida

### 0.1 Base

H0 = `origin/main` 44acd74b (merge de la PR #222). Todo recuento de §1 se mide en H0; si
`origin/main` avanza antes de arrancar, el implementador **re-mide §1 antes del primer
commit** y la diferencia la absorbe la spec sin enmienda siempre que el cambio sea anterior
a esta feature. Los anclajes son por contenido grepeable, nunca por número de línea.

### 0.2 Qué pidió el humano y qué se midió

Texto literal (smoke R16 de #171, 2026-10-15): «con una cuenta sin mascotas no debe de
aparecer la card con el botón de reintentar y el mensaje de Algo salió mal; lo mismo pasa
en el screen de perfil y recordatorios; y en todas las screen deben de estar centrado como
lo está la screen de mapa».

Correcciones a las premisas de partida (verificadas contra el árbol de H0):

- **P1. El texto de Perfil no es «Algo salió mal».** Perfil pinta `profile.couldNotLoadPet`
  («No se pudo cargar el perfil de la mascota») dentro de `profile-pet-error`. Inicio
  (`pet-hero-error`) y Recordatorios (`reminders-error`) sí pintan `common.somethingWentWrong`.
- **P2. Dos causas, no una.** (a) *Selección rancia*: `selectedPetId` sigue puesto mientras
  `GET /pets` devuelve `[]`; `getPet` falla (`{kind:'error'}`) y `listReminders` devuelve
  `{kind:'not-found'}`. `usePetSelection` solo actúa con lista no vacía, así que nadie
  limpia la selección. (b) *Refetch manual sobre una consulta deshabilitada*:
  `refetch()` de TanStack Query v5 ejecuta el `queryFn` aunque `enabled` sea `false`
  (medido sobre `@tanstack/query-core` 5.102.8: 0 llamadas al suscribirse, 1 tras
  `refetch()`). Los `useFocusEffect` de Inicio y Perfil llaman `refetchDetail()` y el de
  Recordatorios `refetchReminders()` **con `selectedPetId === null`**, de modo que una
  cuenta **recién creada, sin selección alguna**, también dispara `getPet(…, null)` y
  `listReminders(…, null)`, guarda el `{kind:'error'}` / `{kind:'not-found'}` bajo la
  clave `''` y pinta las tarjetas. Esto contradice la premisa del leader de que una cuenta
  nueva no las muestra, y probablemente es lo que vio el humano. La raíz de D2-A (limpiar
  la selección) **solo cubre (a)**; (b) lo cubre la red de seguridad de D2-B (R3 a R5).
- **P3. Inicio con selección rancia pinta más que la tarjeta.** Con `selectedPetId` puesto
  y lista vacía, además de `pet-hero-error` pinta el bloque de `home-content` guardado por
  `selectedPetId` (resumen, acciones rápidas, recordatorios…) junto a `home-empty`.
- **P4. Las pantallas de detalle no usan `usePetSelection`.** `weight-log`, `meals-history`,
  `meal-schedule` y `add-reminder` solo leen `selectedPetId` de `useSelectedPet`; no leen la
  lista. La raíz de D2-A solo las alcanza de forma indirecta (se limpia al enfocar cualquiera
  de las siete pantallas que sí llaman al hook). Ver §4.
- `usePetSelection` lo llaman hoy siete pantallas (M8): Inicio, Perfil, Recordatorios,
  Comida (`src/app/(tabs)/food.tsx`), Salud, Mapa y Emparejar. La raíz les cambia el
  comportamiento a todas con selección rancia más lista vacía.

### 0.3 Decisiones de partida (del humano; no se reabren)

- **D1 = A.** «Centrado como Mapa» significa **solo los estados** (sin mascotas), centrados
  en los dos ejes con la receta de `map-no-pets`: contenedor
  `flex-1 items-center justify-center p-6 bg-background`. Sin `maxWidth` global; no se
  toca el scroll de ninguna pantalla. **Centro de qué**: el contenedor de Mapa no lleva
  insets, su caja es toda la escena, así que centra respecto a la **pantalla**, no respecto
  al área segura. Inicio es una pestaña con `headerShown: false`: el centro es el de la
  pantalla. Recordatorios es una pantalla empujada con cabecera nativa (conventions A11): el
  mismo contenedor centra respecto al área bajo la cabecera, el único espacio que tiene.
- **D2 = A+B.** Raíz en `usePetSelection` / `SelectedPetProvider` (limpiar la selección
  cuando la lista llega `ok` y vacía; API `clearPet`; inventario exhaustivo de dobles) **más**
  red de seguridad que condiciona las tarjetas de error en Inicio, Perfil y Recordatorios,
  para que la tarjeta nunca conviva con el estado sin mascotas. Respeta
  `specs/mobile-tanstack-query` R8 (la firma `{data, isRefreshing}` de `usePetSelection`
  no cambia) y R20 (los candados que aquella spec reescribió se conservan).
- **D3 = A.** Recordatorios y Perfil muestran `EmptyState` (`common.noPetsYet`,
  `common.noPetsBody`, acción `profile.addPet` hacia `/pets/add`) igual que Inicio, con el
  `src/components/empty-state.tsx` **actual y su composición intactos**.
- **D4 = A.** #181 va **antes** que #176 y #177. #181 no cambia la composición, el tamaño de
  Pingo ni la receta de botón de `home-empty` / `EmptyState`. Solo: (a) suprime
  `pet-hero-error`, `profile-pet-error` y `reminders-error` sin mascotas; (b) añade la rama
  sin mascotas a Recordatorios; (c) centra los estados sin mascotas de Inicio, Perfil y
  Recordatorios. **Dueño del círculo #176 <-> #181**: #181 es dueño del *contenedor* del
  estado (dónde está y cómo se centra); #176 es dueño de *lo de dentro* (escenario de
  Pingo, 190 px, flotación, título 26/900, cuerpo 15 con ancho 290, CTA a todo el ancho,
  entrada escalonada). La nota para el leader está en §5. Solapes: §3.
- **D5.** Alcance obligatorio: Inicio, Perfil y Recordatorios. Comida y Salud llevan una
  sonda cada una (R6) porque llaman `usePetSelection`. Detalle, Mapa y Emparejar van a §4
  clasificados con su premisa verificada.
- **D6 (abierta, no bloquea).** Cómo llegó el humano a la cuenta sin mascotas (selección
  rancia tras borrar su única mascota, o cuenta recién creada). Los requisitos cubren **las
  dos** vías (R1 las prueba por separado), así que la spec no depende de la respuesta.

- [ ] Decisiones de partida D1 a D5 y premisas P1 a P4 confirmadas por humano (fecha: ____)

## 1. Medidas en H0

Todas las órdenes se ejecutan desde `mobile-pet-tracker/` en el worktree de la feature.

| id | Orden | Valor en H0 | Quién lo mueve |
|---|---|---|---|
| M1 | `grep -cF "pet-hero-error" src/screens/home/index.tsx` | 1 | R3 (cambia la condición, no el testID) |
| M2 | `grep -cF "profile-pet-error" src/screens/profile/index.tsx` | 1 | R5 |
| M3 | `grep -cF "reminders-error" src/screens/reminders/index.tsx` | 1 | R4 |
| M4 | `grep -cF "pets.data.pets.length === 0" src/screens/home/index.tsx` | 1 | R3 |
| M5 | `grep -c "<EmptyState" ` sobre `src/screens/home/index.tsx` / `src/screens/profile/index.tsx` / `src/screens/reminders/index.tsx` | 1 / 0 / 1 | R3 deja 1; R5 sube a 1; R4 sube a 2 |
| M6 | `grep -cF 'testID="profile-pets-empty"' src/screens/profile/index.tsx` | 1 (un `<Text`) | R5 (pasa a `<EmptyState`) |
| M7 | `grep -cF 'className="flex-1 items-center justify-center p-6 bg-background"' src/screens/map/index.tsx` | 2 | nadie; ancla de la receta |
| M8 | `grep -rlF "usePetSelection(" src --include=*.tsx` sin los `*.test.tsx` | 7 ficheros: food, health, home, map, pairing, profile, reminders | nadie |
| M9 | `grep -c "mockUseSelectedPet.mockReturnValue"` sobre `src/screens/add-pet/index.test.tsx` / `src/screens/alert-detail/index.test.tsx` | 14 / 1 | R2.5 |
| M10 | `grep -c "satisfies SelectedPetContextValue" src/hooks/use-pet-selection.test.tsx` | 2 | R2.5 |
| M11 | `grep -rlF "clearPet" src` | 0 ficheros | R2 (pasa a 2 de producción más los tests) |
| M12 | `expect(R7_PROFILE).toHaveLength(35 - 1 + 2 + 1 + 16 - 4 + 8 + 1 + 6)` en `src/__tests__/ui-language.test.ts` | 64 | R8.1 (+2) |
| M13 | `expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1 + 1 + 1 + 1 + 1)` en el mismo fichero | 53 | R8.1 (+3) |
| M14 | `it.each` «los vacíos que no se ilustran siguen en texto» de `src/components/__tests__/empty-state.test.tsx` | 12 filas, una es `['src/screens/profile/index.tsx', 'Text', 'profile-pets-empty']` | R8.2 (-1) |
| M15 | tabla «pinta %i EmptyState» del mismo fichero | 8 ficheros; `reminders` 1; `profile` ausente | R8.2 (`reminders` 2, `profile` 1, 9 ficheros) |
| M16 | `grep -rnF "profile-pets-empty" src` | 5 apariciones (fuente 1, test de Perfil 3, `empty-state.test.tsx` 1) | R5 conserva el testID; ningún test de Perfil se edita por esto |
| M17 | `grep -cF "Excepción nombrada" ../docs/conventions.md` | medir en H0 (n) | R9 (n + 1) |
| M18 | `grep -cF "enmienda A20" ../docs/conventions.md` | 0 | R9 (1) |
| M19 | `grep -c "selectPet:" src/providers/selected-pet-provider.tsx` | 1 (la declaración del tipo) | R2.1 |

El implementador mide M17 en H0 y lo escribe en
`progress/impl_mobile-no-pets-states-and-centered-content.md`; la cifra futura es
`H0 + delta`, nunca un número fijado aquí.

## 2. Requisitos funcionales

### R1 — Sondas rojas: sin mascotas nunca hay tarjeta de error (primer commit)

Requisito de verificación y real a la vez: las sondas nacen rojas por **aserción** (nunca
por `ReferenceError`) y son las que cierran R2 a R5.

- **R1.1** WHEN `GET /pets` devuelve `{kind:'ok', pets:[]}`, `getPet` devuelve
  `{kind:'error'}` y `listReminders` devuelve `{kind:'not-found'}` THE SYSTEM SHALL no pintar
  en Inicio `pet-hero-error` ni `pet-hero-retry`, en Perfil `profile-pet-error` ni
  `profile-pet-retry`, y en Recordatorios `reminders-error` ni `reminders-retry`, y SHALL
  pintar el estado vacío de cada pantalla (`home-empty`, `profile-pets-empty`,
  `reminders-no-pets`), en tres escenarios por pantalla:
  - **S1, selección rancia real**: proveedor real; tras aparecer el estado vacío, el test
    llama a `selectPet('pet-stale')` desde un `SelectionProbe` local (mismo contrato que el
    de `src/screens/profile/index.test.tsx`: `<Text testID="selected-pet-id">` con `none`
    sin selección y `selectPet` expuesto al test). Aserta primero `selected-pet-id` igual a
    `none` (la raíz de R2; rojo hasta entonces) y después la ausencia de las tarjetas.
  - **S2, cuenta nueva**: sin `selectPet`. El test invoca el último callback pasado a
    `useFocusEffect` (como `refocusHome` en `src/screens/home/index.test.tsx`, dentro de
    `await act(async …)`), que es lo que dispara el `refetch()` sobre la consulta
    deshabilitada (P2b). Antes aserta, con el mock de `getPet` (Inicio, Perfil) o de
    `listReminders` (Recordatorios), que la llamada ocurrió: así el rojo no puede ser un
    falso verde por no haber llegado a hacerla.
  - **S3, selección fijada**: `jest.spyOn(selectedPetHooks, 'useSelectedPet')` (patrón del
    `it` R20 de Inicio: capturar el hook real antes del spy y propagar su resultado real)
    devuelve `selectedPetId: 'pet-stale'` y un `clearPet` inerte, de modo que la raíz de R2
    **no puede** enmascarar la red de R3 a R5.
- **R1.2 (sincronización)** THE SYSTEM SHALL, en cada sonda de ausencia, anclar primero en
  un nodo positivo (el estado vacío), esperar después
  `await waitFor(() => expect(queryClient.isFetching()).toBe(0))` con el `queryClient` que
  devuelve `renderWithProviders`, y solo entonces aseverar `queryByTestId(…)` igual a
  `null`. Ningún `expect` síncrono tras `render` (regla de `waitFor` de conventions §Tests).
  Un `queryBy…` a `null` sin ancla positivo ni espera sobre el mismo árbol es tautológico y
  se rechaza.
- **R1.3** Las sondas viven en `src/screens/home/index.test.tsx`,
  `src/screens/reminders/index.test.tsx` y `src/screens/profile/index.test.tsx`, bajo
  `describe('#181 R1: …')`, con un `it.each` de los tres escenarios por fichero (9 `it`).
  Rojo de partida esperado: los tres escenarios de Inicio rojos por la tarjeta o por la
  selección que sigue puesta; Recordatorios y Perfil rojos porque `findByTestId` del estado
  vacío agota el tiempo (aserción, no error de símbolo).

### R2 — Raíz: la selección se limpia cuando la lista llega ok y vacía

- **R2.1 (proveedor)** THE SYSTEM SHALL ampliar `SelectedPetContextValue`
  (`src/providers/selected-pet-provider.tsx`) con `clearPet: () => void`, que deja
  `selectedPetId` en `null` para el token actual. `clearPet` conserva identidad mientras el
  token no cambie (`useCallback` con `[token]`, igual que `selectPet`); `selectPet` y el
  reinicio por cambio de token no cambian. El valor memoizado pasa a
  `{selectedPetId, selectPet, clearPet}`.
- **R2.2 (hook)** WHEN `usePetSelection` corre con la pantalla enfocada, sin revalidación en
  curso (`isRefreshing === false`), `data.kind === 'ok'`, `data.pets.length === 0` y
  `selectedPetId !== null` THE SYSTEM SHALL llamar `clearPet()` exactamente una vez y no
  llamar `selectPet`. La rama va tras los guards de foco y de revalidación existentes y antes
  del `return` por lista vacía.
- **R2.3 (lo que NO limpia)** IF falla alguna condición de R2.2 (sin foco, con revalidación,
  `selectedPetId === null`, o `data` es `undefined` o de otro `kind`: `error`, `unreachable`,
  `missing-config`, `unauthorized`) THEN THE SYSTEM SHALL no llamar `clearPet`. Con lista no
  vacía el comportamiento actual no cambia (la selección existente se conserva; si falta, se
  selecciona la primera).
- **R2.4 (un solo escritor)** THE SYSTEM SHALL tener `clearPet` referenciado en producción
  únicamente en `src/providers/selected-pet-provider.tsx` y `src/hooks/use-pet-selection.ts`
  (ninguna pantalla limpia la selección por su cuenta), y la firma
  `usePetSelection({data, isRefreshing})` no cambia (`#87 R8` sigue verde).
- **R2.5 (dobles exhaustivos)** THE SYSTEM SHALL añadir `clearPet` a **todo** doble tipado de
  `useSelectedPet`, sin `as` ni `Partial`: los 14 `mockUseSelectedPet.mockReturnValue(…)` de
  `src/screens/add-pet/index.test.tsx`, el 1 de `src/screens/alert-detail/index.test.tsx` y
  los 2 `satisfies SelectedPetContextValue` de `src/hooks/use-pet-selection.test.tsx` (M9,
  M10). Candado: `bun run typecheck` sale 0. `src/app/(tabs)/__tests__/layout.test.tsx`
  mockea el módulo del proveedor pero no `useSelectedPet`: no es un doble y no se toca.
- **Tests** (`describe('#181 R2: …')`):
  - `src/hooks/use-pet-selection.test.tsx`: un `it` por R2.2 y uno por cada condición de
    R2.3 (sin foco; con revalidación; selección nula; `data` `undefined`; y un `it.each` por
    los cuatro `kind` no `ok`), cada uno aseverando `mockClearPet` y `mockSelectPet`.
  - `src/providers/__tests__/selected-pet-provider.test.tsx`: `clearPet` tras `selectPet`
    deja `none`; identidad estable entre renders; cambiar el token sigue reiniciando.
  - un `it` de escaneo en `use-pet-selection.test.tsx` (patrón de «la selección automática
    vive solo en `usePetSelection`»): solo esos dos ficheros de producción contienen
    `clearPet`.

### R3 — Inicio

- **R3.1 (red de seguridad)** WHILE `selectedPetId === null` THE SYSTEM SHALL no pintar
  `pet-hero-error` ni `pet-hero-retry`. La condición actual
  (`detail.data?.kind === 'error' || … 'unreachable'`) pasa a exigir además
  `selectedPetId !== null` (cubre P2b también con la lista en error o cargando). La rama de
  lista vacía con selección fijada queda cubierta por R3.2.
- **R3.2 (estado sin mascotas centrado)** WHEN la lista llega `{kind:'ok', pets:[]}` THE
  SYSTEM SHALL renderizar **en lugar** del `ScrollView` un único
  `<View testID="home-no-pets-screen" className="flex-1 items-center justify-center p-6 bg-background">`
  cuyo único hijo es el `EmptyState` `home-empty`, con las mismas props que hoy
  (`pose="talk"`, `common.noPetsYet`, `common.noPetsBody`, acción `profile.addPet` que hace
  `router.push('/pets/add')`). El `return` anticipado va **después de todos los hooks**
  (inmediatamente antes del `return (` final); ningún hook se vuelve condicional. En ese
  estado no existen `screen-home`, `home-states`, `home-content`, `home-entrance-*` ni
  `home-alerts-bell`.
- **R3.3 (lo que no cambia)** WHILE la lista carga o falla (`home-loading`, `home-error`,
  `home-retry`) THE SYSTEM SHALL conservar el `ScrollView` y `home-states` con su estilo
  (`paddingHorizontal: 24`, `paddingTop: insets.top + 12`, `gap: 16`) y el título «Inicio»;
  `home-states` pasa a tener como hijos solo lo de carga y error (el `EmptyState` sale).
- **Tests** (`describe('#181 R3: …')` en `src/screens/home/index.test.tsx`): el contenedor
  tiene exactamente esa `className` y `['home-empty']` como único hijo; los nodos de la
  lista de R3.2 son `null` (tras ancla positiva); el copy y la acción de `home-empty` (los
  tres `it` de `#155 R4` se conservan salvo el primero, ver §3); R3.3 con el `it` de carga
  existente sin tocar; R3.1 con las sondas de R1 más un `it` de `selectedPetId` nulo con la
  lista en `unreachable` (`home-error` presente, `pet-hero-error` ausente).

### R4 — Recordatorios

- **R4.1 (red de seguridad)** WHILE `selectedPetId === null` o la lista llegó `ok` y vacía
  THE SYSTEM SHALL no pintar `reminders-error` ni `reminders-retry`. La condición de
  `reminders-error` pasa a exigir `selectedPetId !== null && !petsEmpty`, con `petsEmpty` =
  `pets.data?.kind === 'ok' && pets.data.pets.length === 0` (constante local de la
  pantalla, no un helper compartido).
- **R4.2 (estado sin mascotas centrado)** WHEN `petsEmpty` THE SYSTEM SHALL renderizar en
  lugar del `ScrollView` un único
  `<View testID="reminders-no-pets-screen" className="flex-1 items-center justify-center p-6 bg-background">`
  cuyo único hijo es `<EmptyState testID="reminders-no-pets" pose="talk" …>` con
  `common.noPetsYet`, `common.noPetsBody` y acción `profile.addPet` que hace
  `router.push('/pets/add')`. El `return` anticipado va tras todos los hooks y `useCallback`
  de la pantalla. En ese estado no existen `screen-reminders`, `reminders-actions` (el
  título «Recordatorios» lo da la cabecera nativa; el botón «Nuevo» no tiene sentido sin
  mascota), `reminders-empty`, `reminders-pills` ni `reminders-delete-host`.
- **R4.3 (lo que no cambia)** WHILE hay mascotas THE SYSTEM SHALL conservar el `ScrollView`,
  `reminders-empty` (vacío de *recordatorios*, `clipboard`, acción `reminders.new`) y todo lo
  demás tal cual (candados de `#178` y `#155 R6` intactos).
- **Tests** (`describe('#181 R4: …')` en `src/screens/reminders/index.test.tsx`): el
  contenedor y su único hijo; copy en español y acción; que pulsarla hace
  `router.push('/pets/add')` una vez; ausencia de los nodos de R4.2 con la lista vacía y
  presencia de `screen-reminders` con una mascota; las sondas de R1.

### R5 — Perfil

- **R5.1 (estado sin mascotas)** WHEN la lista llega `ok` y vacía THE SYSTEM SHALL pintar, en
  el hueco que hoy ocupa el `<Text testID="profile-pets-empty">`, un `EmptyState` con el
  **mismo testID** `profile-pets-empty`, `pose="talk"`, `common.noPetsYet`,
  `common.noPetsBody` y acción `profile.addPet` hacia `/pets/add`. El resto del `ScrollView`
  (título, cápsula `profile-add-pet`, aviso de notificaciones, `reminders-link`, `me-card`,
  cierre de sesión) se conserva: Perfil sigue siendo una pantalla de cuenta con scroll.
- **R5.2 (red de seguridad)** WHILE `selectedPetId === null` o `petsEmpty` THE SYSTEM SHALL
  no pintar `profile-pet-error`, `profile-pet-retry`, `profile-hero-skeleton` ni
  `pet-info-skeleton`. `petLoading` pasa a `… && !petsEmpty` y la tarjeta de error exige
  `selectedPetId !== null && !petsEmpty`. `petsEmpty` es una constante local, como en R4.1.
- **R5.3 (centrado)** THE SYSTEM SHALL centrar el estado de Perfil solo en el eje
  horizontal (el `EmptyState` ya es `items-center` y ocupa el ancho del contenido): un
  `ScrollView` con más hijos no admite el centrado vertical de Mapa sin mover `me-card` y el
  cierre de sesión. Es la mitad de D1 que la pantalla permite; se declara en §5.
- **Tests** (`describe('#181 R5: …')` en `src/screens/profile/index.test.tsx`): copy, pose y
  acción; el testID `profile-pets-empty` sigue siendo uno solo y es un `EmptyState`
  (`profile-pets-empty-title` existe); ausencia de error y esqueletos con las sondas de R1;
  la fila `PROFILE_BRANCHES_168` de «sin mascotas» y los dos
  `findByTestId('profile-pets-empty')` existentes siguen verdes sin editarse (M16).

### R6 — Comida y Salud heredan la raíz (una sonda cada una)

- **R6.1** WHEN, con el proveedor real, el estado vacío ya se pintó y el test llama a
  `selectPet('pet-stale')` THE SYSTEM SHALL dejar la selección en `none` (`SelectionProbe`)
  tras la raíz de R2 en **Comida** (`src/app/(tabs)/__tests__/food.test.tsx`: `food-empty`
  presente y `food-plan-error` ausente) y en **Salud** (`src/screens/health/index.test.tsx`:
  `health-empty` presente). Mismo patrón de sincronización que R1.2.
  `describe('#181 R6: …')`.

### R7 — Convergencia al crear la primera mascota

- **R7.1** WHEN, con selección rancia y lista `[]` en caché, la lista se revalida y llega con
  una mascota (el caso de `add-pet`, que hace `selectPet(result.pet.id)` sin invalidar la
  lista) THE SYSTEM SHALL terminar con esa mascota seleccionada y abandonar el estado sin
  mascotas: `home-empty` ausente, `pet-chip-<id>` presente, `selected-pet-id` igual a `<id>`.
  La limpieza intermedia de R2 es transitoria. Sonda en `src/screens/home/index.test.tsx`
  (`describe('#181 R7: …')`) con `queryClient.refetchQueries({ queryKey: petKeys.list() })`
  y `listPets` pasando de `[]` a `[pet]`, esperando con `findByTestId` / `waitFor`.

### R8 — Candados agregados y de catálogo

- **R8.1** THE SYSTEM SHALL subir `R7_PROFILE` en 2 filas (`common.noPetsBody` y una segunda
  `profile.addPet`) y `R8_REMINDERS` en 3 filas (`common.noPetsYet`, `common.noPetsBody`,
  `profile.addPet`) en `src/__tests__/ui-copy-table.ts`, con los comentarios
  `// #181 R5` / `// #181 R4`, y las expresiones de `toHaveLength` de
  `src/__tests__/ui-language.test.ts` pasan a `… + 2 // #181 R5` y `… + 3 // #181 R4`
  (M12, M13). `R3_HOME` no cambia (las tres claves siguen una vez cada una). `SCREEN_FILES`
  no cambia (ningún fichero nuevo entra en `ALL_USES`) y `checkUses(ALL_USES)` sigue verde.
  Ninguna clave nueva entra en `src/i18n/catalog.ts`.
- **R8.2** THE SYSTEM SHALL actualizar `src/components/__tests__/empty-state.test.tsx`: la
  fila `profile-pets-empty` sale del `it.each` de textos (12 a 11), la tabla de recuentos
  pasa a 9 ficheros con `reminders` 2 y `profile` 1, y la lista de «ningún otro fichero usa
  EmptyState» suma `src/screens/profile/index.tsx` (posición verificada con `node` sobre el
  `.sort()`, no a ojo).
- **R8.3** THE SYSTEM SHALL no introducir `#NNN` sueltos en comentarios (solo la forma
  `#NNN R<n>`), `text-accent` suelto, `StyleSheet` ni clases con corchetes; el contenedor de
  R3.2 y R4.2 usa clases de la escala (`p-6`, `flex-1`, `items-center`, `justify-center`,
  `bg-background`) sin estilo en línea. Candado: `design-drift.test.ts` y
  `legibility-classnames` siguen verdes.

### R9 — Enmienda de la carta (excepción nombrada)

- **R9.1** THE SYSTEM SHALL añadir a `docs/conventions.md`, tras las excepciones nombradas de
  §Dimensiones de pantalla uniformes, una viñeta «**Excepción nombrada (enmienda A20 de #181,
  2026-10-16)**» con este texto: «el estado sin mascotas de una pantalla (`EmptyState` de
  `common.noPetsYet`) no lleva las métricas de scroll de esta viñeta: se pinta, en lugar del
  scroll, en un contenedor `flex-1 items-center justify-center p-6 bg-background` sin
  insets, como `map-no-pets`. Recordatorios lo aplica bajo su cabecera nativa (A11). Perfil,
  que conserva su scroll, solo centra en horizontal.» Y el bloque de firma:
  `- Spec enmendada: docs/conventions.md`, `- Qué cambia: enmienda A20 de #181 R9`,
  `- Qué NO cambia: A9, A10, A11, ni la excepción de fidelidad al canvas`, y la casilla
  `- [ ] Enmienda A20 aprobada por humano (fecha: ____)`.
- **R9.2 (candado tolerante)** THE SYSTEM SHALL tener un test
  (`src/__tests__/no-pets-states.test.ts`, `describe('#181 R9: …')`) que verifique en
  `docs/conventions.md` que «enmienda A20 de #181» aparece exactamente una vez (M18 de 0 a 1)
  y que la casilla casa `/- \[[ xX]\] Enmienda A20 aprobada por humano/`. **Nunca** asevera
  la casilla vacía: firmarla no puede poner el CI rojo.
- **R9.3** THE SYSTEM SHALL no tocar `docs/ui-guidelines.md`: el centrado del estado vacío no
  cambia ninguna decisión fija de la carta (Pingo, copy voz B, `EmptyState` compartido).

### R10 — Pruebas de mutación (requisito de verificación)

Se cierran por la vía (b) de C4: cada mutación se planta a mano sobre el árbol verde, se
registra en `progress/impl_mobile-no-pets-states-and-centered-content.md` con el nombre del
`it` que se pone rojo, y se revierte. Una sonda que sobrevive es un rechazo.

| id | Mutación | Debe ponerse rojo |
|---|---|---|
| X1 | hook: quitar la llamada a `clearPet` | R2.2 (hook), R1 S1 de las tres pantallas, R6 |
| X2 | hook: quitar el guard `isRefreshing` de la rama de limpieza | R2.3 con revalidación |
| X3 | hook: limpiar también con `data.kind !== 'ok'` | R2.3 por cada `kind` |
| X4 | Inicio: quitar `selectedPetId !== null` de la condición de `pet-hero-error` | R1 S2 y el `it` de lista `unreachable` |
| X5 | Recordatorios: quitar `!petsEmpty` de `reminders-error` | R1 S3 |
| X6 | Recordatorios: quitar `selectedPetId !== null` de `reminders-error` | R1 S2 |
| X7 | Perfil: quitar `!petsEmpty` de `petLoading` | R1 S3 (esqueletos) |
| X8 | Perfil: quitar `selectedPetId !== null` de `profile-pet-error` | R1 S2 |
| X9 | Inicio o Recordatorios: sacar el `return` anticipado y dejar el `EmptyState` dentro del scroll | R3.2 / R4.2 (contenedor y único hijo) |
| X10 | Inicio o Recordatorios: `justify-center` por `justify-start` en el contenedor | R3.2 / R4.2 |
| X11 | Perfil: devolver el `<Text testID="profile-pets-empty">` | R5.1 |
| X12 | añadir `clearPet()` a una pantalla | R2.4 (escaneo) |

X1 se planta además **donde el candado podría no mirar**: en S3 el `clearPet` es inerte y la
sonda debe seguir verde sin la raíz; si X1 pone rojo S3, S3 no aísla la red de seguridad y la
sonda se rehace. Las mutaciones X4 a X8 se plantan una a una: cada red tiene que caer por su
propio escenario (S2 aísla `selectedPetId !== null`, S3 aísla `!petsEmpty`).

## 3. Candados que se mueven

Se reescriben en su sitio, con el sufijo `(enmendado por #181 Rn)` en el título del `it`:

- `src/screens/home/index.test.tsx`, bloque `#155 R4` del final del fichero, `it` «queda en
  el sitio del vacío que sustituye»: hoy aserta `slot.parent?.props.testID` igual a
  `home-states` y los hijos `['Text', 'home-empty']`; pasa a R3.2. Los `it` de copy, pose y
  acción de `home-empty` siguen tal cual (el testID se conserva).
- `src/screens/home/index.test.tsx`, `it.each` «no da entrada a home-states con %s»: la fila
  `home-empty` sigue valiendo (sin entradas); no se edita.
- `src/screens/reminders/index.test.tsx` y `src/screens/profile/index.test.tsx`: ningún
  candado roto (M16; `reminders-empty` y `#155 R6` describen la rama con mascotas).
- `src/components/__tests__/empty-state.test.tsx`: R8.2.
- `src/__tests__/ui-language.test.ts` y `src/__tests__/ui-copy-table.ts`: R8.1.

Solapes con otras features (ninguna `in_progress` en H0; el orden lo fija D4):

| Feature | Solape | Quién va primero | Candado que reabre |
|---|---|---|---|
| #176 mobile-home-empty-canvas-fidelity | contenedor del vacío de Inicio frente a su composición | #181 | #176 reescribe `home-no-pets-screen` y los `it` de `#155 R4` que #181 deja; su «composición centrada sin título» ya la cumple R3.2 |
| #177 mobile-chunky-cta-canvas-fidelity | receta del botón de `EmptyState` | #181 (no la toca) | ninguno de #181 |
| #184 mobile-profile-followups | `src/screens/profile/index.test.tsx` | cualquiera; ficheros compartidos, no candados | ninguno |
| #190 mobile-home-pingo-phrase | `src/screens/home/index.tsx` | #181 antes (así lo declara #190) | ninguno; #190 añade bajo el hero, que R3.2 deja intacto |

## 4. Fuera de alcance

Clasificado viñeta a viñeta; la premisa de cada una se verificó en H0.

- **Pantallas de detalle (`weight-log`, `meals-history`, `meal-schedule`, `add-reminder`)**:
  *sin sonda aquí; feature aparte si el smoke las señala.* Premisa (P4): no llaman
  `usePetSelection` ni leen la lista, así que una sonda «de la raíz» no probaría nada de
  #181. Solo son accesibles desde pantallas que sí lo llaman, y estas limpian antes. Se
  desvía de la sugerencia de una sonda por pantalla; consta en §5.
- **Mapa**: *cubierto, sin cambio.* Ya condiciona por `petsReady` y pinta `map-no-pets` con
  la receta de referencia; recibe la raíz sin cambio visible.
- **Emparejar (`pairing`)**: *cubierto por la raíz, sin sonda.* Usa `usePetSelection`; su
  vacío es `pairing-no-pets` como `<Text>` suelto y no se toca.
- **Re-centrar los vacíos de Comida y Salud**: *otra feature si el humano lo pide.* D1-A
  limita el centrado a Inicio, Perfil y Recordatorios; sus `food-empty` y `health-empty`
  viven dentro de un scroll con otros hijos.
- **Evitar `GET /pets/null` (guardar el `refetch()` con `selectedPetId === null`)**: *deuda
  registrada, no se arregla aquí.* Exige meter `selectedPetId` en las dependencias del
  `useFocusEffect` (refetch en cada cambio de selección, con `cancelRefetch` entre dobles);
  R3 a R5 ocultan el síntoma sin ese riesgo. Se propone al leader como feature (§5).
- **`pet` ok con lista vacía en Perfil**: *no se especifica.* Un backend consistente no
  devuelve una mascota que su propia lista no contiene.
- **Composición, tamaño de Pingo, receta de botón y copy del `EmptyState`**: *#176 / #177.*
- **`maxWidth` global y cambios de scroll**: *descartado por D1-A.*
- **Backend**: *sin cambios.*

## 5. Preguntas abiertas (para el humano; no bloquean la firma)

1. **D6**: cómo llegó a la cuenta sin mascotas. Los requisitos cubren las dos vías.
2. **Hallazgo P2b**: la tarjeta aparece también en cuentas nuevas por `refetch()` sobre
   consultas deshabilitadas. ¿Se registra como feature la guarda de peticiones
   (`GET /pets/null`)?
3. **Compuerta `petsEmpty`** (lista `ok` y vacía) en lugar de la literal `petsReady` de Mapa
   (lista no vacía): con la lista cargando o fallida no debe pintarse el vacío.
4. **Título «Inicio» y botón «Nuevo»** desaparecen en el estado sin mascotas de Inicio y
   Recordatorios (Mapa tampoco los lleva); la cabecera nativa de Recordatorios conserva su
   título.
5. **Perfil** se centra solo en horizontal (R5.3). ¿Basta, o se quiere el vacío a pantalla
   completa con la cuenta fuera de la vista?
6. **CTA duplicada en Perfil**: la cápsula «Añadir mascota» del título y la acción del
   `EmptyState` coexisten.
7. **Detalle sin sonda** (§4) y **Comida y Salud no re-centradas**.
8. **Pose `talk` y testIDs nuevos** en Recordatorios (`reminders-no-pets`,
   `reminders-no-pets-screen`) y en Inicio (`home-no-pets-screen`).
9. **#190** solo existe en la rama del leader (no en `origin/main` de H0); el solape se
   nombra por el texto que el leader dio.
10. **Nota para el leader (D4)**: reflejar en la descripción de #176 que #181 es dueño del
    contenedor y #176 de lo de dentro, y en la de #190 que va tras #181.

## 6. Smoke (dev build de Android, no Expo Go)

Lo corre el humano; Codex no lo ejecuta. Con una cuenta recién creada **y** con una cuenta a
la que se le borró su única mascota con la app abierta:

1. Inicio muestra a Pingo con el mensaje y «Añadir mascota» centrados en la pantalla, sin
   tarjeta de «Algo salió mal» ni «Reintentar».
2. Recordatorios (desde Perfil) igual, bajo su cabecera nativa.
3. Perfil muestra el vacío ilustrado en el lugar del texto, sin «No se pudo cargar el perfil
   de la mascota» ni esqueletos.
4. Pulsar «Añadir mascota» en cada una abre `/pets/add`; tras crear la mascota, Inicio
   muestra su ficha.
5. Mapa sigue igual.

- [ ] Smoke #181 en dev build de Android firmado por humano (fecha: ____)

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
