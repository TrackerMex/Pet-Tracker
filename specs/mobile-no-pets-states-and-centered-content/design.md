---
feature: "mobile-no-pets-states-and-centered-content"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[mobile-no-pets-states-and-centered-content]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Todo es `mobile-pet-tracker/`: no hay backend, ni dominio, ni infraestructura. La capa
> "application" del móvil es `src/providers` y `src/hooks`; la "presentación" es
> `src/screens` y `src/app`.

## Decisiones técnicas

- **Dos defensas independientes, no una (R2 + R3/R4/R5).** La causa tiene dos ramas (P2a
  selección rancia, P2b `refetch()` sobre consulta deshabilitada). La raíz (`clearPet`)
  elimina P2a en origen y arregla además Comida, Salud, Mapa y Emparejar, pero **no puede**
  cubrir P2b, porque ahí `selectedPetId` ya es `null`. La red de seguridad en pantalla
  cubre las dos ramas pero deja la selección rancia viva para el resto de pantallas. Por
  eso son las dos, y por eso R1 tiene tres escenarios por pantalla: S1 prueba la raíz, S2
  prueba `selectedPetId !== null` y S3 prueba `!petsEmpty` con la raíz anulada (R1, R10).
- **`clearPet` como API propia, no `selectPet(null)` (R2.1).** `selectPet(id: string)` es
  hoy total sobre cadenas; ensancharlo a `string | null` obliga a revisar a los siete
  llamadores de `usePetSelection` y a `add-pet`, que lo usa con el id recién creado. Un
  método nuevo con un solo escritor (R2.4) es auditable con un `grep`. Coste: 17 dobles
  de `useSelectedPet` lo necesitan (R2.5); es mecánico y `tsc` lo caza.
- **Un solo sitio decide limpiar: el hook (R2.2, R2.4).** `usePetSelection` ya es el único
  dueño de la selección automática (`#87 R8`); la limpieza es su simétrica y comparte los
  mismos guards de foco y de revalidación. Con `isRefreshing` no se limpia: una lista
  `[]` en caché mientras se revalida puede estar rancia, y limpiar y reseleccionar
  parpadearía.
- **Condición `kind === 'ok'` y lista vacía, nada más (R2.2/R2.3).** Un `error`,
  `unreachable`, `missing-config` o `unauthorized` no dice que la cuenta esté vacía; limpiar
  ahí borraría una selección válida por un fallo de red. R2.3 lo candan rama a rama.
- **Retorno anticipado al estilo de Mapa, no centrar dentro del `ScrollView` (R3.2, R4.2).**
  Mapa resuelve el vacío con un contenedor `flex-1 items-center justify-center p-6
  bg-background` que sustituye a la escena. En Inicio y Recordatorios el estado sin
  mascotas hace lo mismo: sustituye al `ScrollView`. Centrar dentro del scroll
  (`contentContainerStyle: { flexGrow: 1, justifyContent: 'center' }`) tocaría las métricas
  de scroll que unos veinte candados de #155, #178 y #179 fijan por contenido. El
  retorno anticipado va **después de todos los hooks** (regla de hooks) y deja el
  `ScrollView` íntegro en la rama con mascotas: los candados existentes no se enteran.
- **Perfil conserva el scroll y solo centra en horizontal (R5).** Perfil es una pantalla
  de cuenta (título, notificaciones, `me-card`, cierre de sesión): sacar el vacío a pantalla
  completa escondería esas acciones. Se sustituye el `<Text testID="profile-pets-empty">` por
  un `EmptyState` **con el mismo testID**; así los tres tests de Perfil y la fila
  `PROFILE_BRANCHES_168` siguen valiendo sin edición (M16). Es la mitad de D1 que la
  pantalla admite y se declara en R5.3 y en la enmienda A20.
- **Compuerta `petsEmpty` y `selectedPetId !== null`, constantes locales (R3.1, R4.1, R5.2).**
  `petsEmpty = pets.data?.kind === 'ok' && pets.data.pets.length === 0`. No se extrae a
  un helper compartido: son dos líneas por pantalla y cada pantalla ya tiene sus propias
  condiciones de carga y error. No se usa la `petsReady` literal de Mapa porque significa
  «lista no vacía» (es el opuesto) y porque con la lista cargando o fallida no debe
  pintarse el vacío.
- **El contenedor del estado es de #181; el interior es de #176 (D4).** R3.2 y R4.2 no
  cambian la composición de `EmptyState`, ni el tamaño de Pingo, ni la receta de botón. Si
  #176 rehace el interior, reescribe los candados del interior y deja los del contenedor.
- **Recordatorios usa `pose="talk"` y `reminders-no-pets`, distinto de `reminders-empty`
  (R4.2).** `reminders-empty` es «no hay recordatorios» (con mascota) y mantiene la pose
  `clipboard`; el vacío de cuenta es otra cosa, comparte copy con Inicio (`common.noPetsYet`)
  y lleva su propio testID para no mezclar los candados de las dos situaciones.
- **No se guarda el `refetch()` (§4 de requirements).** La guarda
  `if (selectedPetId !== null) refetchDetail()` necesita `selectedPetId` en las
  dependencias del `useFocusEffect`, y eso refetchea en cada cambio de selección (con
  `cancelRefetch` entre dobles, que los tests de Inicio ya vigilan). Es riesgo
  desproporcionado para un síntoma que R3 a R5 ya ocultan; queda como deuda propuesta.
- **Candados agregados (R8).** Las filas de `ui-copy-table.ts` y los recuentos de
  `empty-state.test.tsx` se mueven en el **mismo commit rojo** que el requisito que los
  provoca, para que el rojo sea por aserción (conteo) y no por símbolo ausente.
- **Excepción nombrada A20 con candado tolerante (R9).** La carta fija métricas de scroll
  uniformes; el contenedor sin insets de R3.2/R4.2 es una excepción. Se nombra en
  `docs/conventions.md` con el formato de A9 a A11 y se candan solo la existencia y la
  forma tolerante de la casilla (`[ xX]`), nunca la casilla vacía.

## Archivos afectados

Presentación y aplicación (`mobile-pet-tracker/`):

- `src/providers/selected-pet-provider.tsx` — `clearPet` en el tipo, el `useCallback` y el
  valor memoizado (R2.1).
- `src/hooks/use-pet-selection.ts` — rama de limpieza tras los guards de foco y de
  revalidación (R2.2, R2.3).
- `src/screens/home/index.tsx` — condición de `pet-hero-error` (R3.1); retorno anticipado
  con `home-no-pets-screen`; el `EmptyState` `home-empty` sale de `home-states` (R3.2, R3.3).
- `src/screens/reminders/index.tsx` — `petsEmpty`; condición de `reminders-error`;
  retorno anticipado con `reminders-no-pets-screen` y `reminders-no-pets`; import de
  `EmptyState` ya existente (R4).
- `src/screens/profile/index.tsx` — `petsEmpty`; `petLoading`; condición de
  `profile-pet-error`; `EmptyState` con testID `profile-pets-empty`; import nuevo de
  `EmptyState` (R5).

Tests (todos bajo `mobile-pet-tracker/`):

- `src/screens/home/index.test.tsx`, `src/screens/reminders/index.test.tsx`,
  `src/screens/profile/index.test.tsx` — sondas de R1, R3 a R5 y R7; reescritura del `it`
  de `#155 R4` (§3).
- `src/hooks/use-pet-selection.test.tsx` — R2.2/R2.3/R2.4 y los 2 dobles (R2.5).
- `src/providers/__tests__/selected-pet-provider.test.tsx` — R2.1.
- `src/app/(tabs)/__tests__/food.test.tsx`, `src/screens/health/index.test.tsx` — R6.
- `src/screens/add-pet/index.test.tsx` (14 dobles), `src/screens/alert-detail/index.test.tsx`
  (1 doble) — solo `clearPet` (R2.5).
- `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts` — R8.1.
- `src/components/__tests__/empty-state.test.tsx` — R8.2.
- `src/__tests__/no-pets-states.test.ts` (nuevo) — R9.2.

Documentación:

- `docs/conventions.md` — excepción A20 (R9.1).
- `docs/ui-guidelines.md` — **no se toca** (R9.3).

Sin cambios: `src/components/empty-state.tsx`, `src/i18n/catalog.ts`, `src/app/(tabs)/map`,
backend.

## Alternativas descartadas

- **`selectPet(null)` en lugar de `clearPet`:** ensancha un contrato usado por ocho
  llamadores y no se puede auditar con un `grep`.
- **Limpiar la selección en `SelectedPetProvider` mirando la lista:** el proveedor no
  conoce la consulta de mascotas y acoplarlo a TanStack Query invierte la dependencia;
  la decisión es del hook, que ya tiene `data`.
- **Centrar con `contentContainerStyle` dentro del scroll:** mueve métricas fijadas por
  decenas de candados; el retorno anticipado no toca ninguno.
- **`maxWidth` global o centrado de todas las pantallas:** descartado por D1-A.
- **Solo la raíz (D2-A):** deja a las cuentas nuevas con tarjeta (P2b).
- **Solo la red de seguridad (D2-B):** deja viva la selección rancia en Comida, Salud,
  Mapa y Emparejar y obliga a repetir la compuerta en cada pantalla que se añada.
- **Guardar el `refetch()` vía dependencias del `useFocusEffect`:** ver arriba; se propone
  como feature aparte.
- **Envolver solo el `<Text>` de Perfil con un contenedor centrado:** deja el copy plano
  sin Pingo ni CTA y rompe D3.
- **Sonda de raíz en las pantallas de detalle:** no usan `usePetSelection` (P4).
- **Reutilizar `reminders-empty` para el vacío de cuenta:** mezcla dos situaciones con
  candados distintos.
