---
feature: "mobile-detail-screens-state-reset"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-detail-screens-state-reset]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas —en particular **D1**, que cierra
> por escrito la elección entre Stack y reset local— y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI móvil.
>
> **Commit base de toda medición**: `f50b4203`
> (`chore(harness): registra baseline verde de #63`). Ningún requisito congela
> recuentos absolutos de suites o tests: lo que se mide es el delta contra ese
> commit y la consistencia interna de cada fichero.

## Contexto en una línea

Las pantallas de detalle viven bajo `src/app/(tabs)/`, así que Expo Router las
trata como rutas de tab: salir con `router.back()` o por la barra de tabs
**cambia de pantalla pero no desmonta el componente**, y su `useState` local
sobrevive. Al reentrar, el formulario se pinta con lo de la vez anterior.

**Vía elegida (D1): reset local en la pérdida de foco.** No se mueven rutas, no
se crea un Stack. El precio —el teleport sin transición (M3) y las cabeceras a
mano— queda abierto y documentado en §Deuda que esta spec deja abierta.

## Requisitos funcionales

Los cinco primeros comparten el mismo disparador y difieren solo en la pantalla
y en el conjunto exacto de estado. El disparador **"pierde el foco de
navegación"** significa, de forma observable en test: se ejecuta la función de
limpieza que devuelve el callback registrado en `useFocusEffect`.

- **R1**: WHEN la pantalla `AddReminderContent`
  (`mobile-pet-tracker/src/screens/add-reminder/index.tsx`) pierde el foco de
  navegación THE SYSTEM SHALL devolver su estado local a los valores de primer
  montaje: `type = 'vaccine'`, `title = ''`, `date = null`, `time` = hoy a las
  09:00 locales (`initialTime()`), `advanceMinutes = 10080`,
  `showDatePicker = false`, `showTimePicker = false` y `formError = null`,
  de modo que el siguiente render presente el formulario idéntico al de la
  primera entrada.

- **R2**: WHEN la pantalla `AddPetScreen`
  (`mobile-pet-tracker/src/screens/add-pet/index.tsx`) pierde el foco de
  navegación THE SYSTEM SHALL devolver su estado local a los valores de primer
  montaje: `species = 'dog'`, `name = ''`, `breed = ''`, `sex = null`,
  `size = null`, `sterilized = null`, `microchip = ''`,
  `ageMode = 'birthDate'`, `birthDate = null`, `approxAgeMonths = ''`,
  `showDatePicker = false`, `photoAsset = null`, `formError = null` y
  `photoError = null`.

- **R3**: WHEN la pantalla `WeightLogContent`
  (`mobile-pet-tracker/src/app/(tabs)/weight-log.tsx`) pierde el foco de
  navegación THE SYSTEM SHALL devolver su estado local a los valores de primer
  montaje: `weightText = ''`, `measuredAt = localTodayIso()`,
  `bodyConditionText = ''` y `formError = null`.

- **R4**: WHEN la pantalla `MealScheduleContent`
  (`mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx`) pierde el foco de
  navegación THE SYSTEM SHALL devolver `generateError` a `null`.

- **R5**: WHEN la pantalla `PairingScreen`
  (`mobile-pet-tracker/src/screens/pairing/index.tsx`) pierde el foco de
  navegación THE SYSTEM SHALL devolver `code = ''`, `actionError = null`,
  `phase = 'idle'` y `readyDevice = null`, de modo que salir por la barra de
  tabs estando en fase `ready` deje de presentar "Tracker is ready" al volver.

- **R6**: WHILE `PairingScreen` está montada, WHEN `selectedPetId` cambia de
  valor THE SYSTEM SHALL devolver `code = ''`, `actionError = null`,
  `phase = 'idle'` y `readyDevice = null`, de modo que cambiar de mascota en el
  `PetSwitcher` de la propia pantalla no arrastre ni la vista `ready` ni el
  error de la mascota anterior.

- **R7**: WHILE una petición de la pantalla sigue en vuelo, THE SYSTEM SHALL
  conservar los guardas de envío `submitting` (R1, R2, R3, R4), `claiming` y
  `releasing` (R5, R6): perder el foco **no** los pone a `false`. Su único
  camino a `false` sigue siendo el bloque `finally` que ya existe, para que al
  volver no sea posible disparar un segundo POST sobre una petición aún viva.

## Estado que SÍ debe sobrevivir (criterio de aceptación 5, cerrado)

Auditado uno por uno; solo el primero es un requisito de esta spec (R7), el
resto son invariantes que esta spec **no toca** y que el reviewer debe
comprobar que siguen intactos:

1. **Guardas de petición en vuelo** — `submitting` / `claiming` / `releasing`.
   Ver R7. Es la única razón por la que el reset **no** es "todos los
   `useState` de la pantalla".
2. **`selectedPetId` del `SelectedPetProvider`** — vive en un provider por
   encima de las pantallas (`src/providers/selected-pet-provider.tsx`), es
   deliberadamente compartido entre tabs y no se toca. Un reset aquí devolvería
   al usuario al `Redirect` de cada pantalla de detalle.
3. **Caché de TanStack Query** — los `useQuery` de `pairing`, `weight-log`,
   `meal-schedule` y `docs` y los dos `useFocusEffect` de refetch de `pairing`
   (`refetchPets`, `refetchTracking`). Vaciarlos reintroduciría un parpadeo de
   Skeleton en cada retorno. Esta spec no altera ninguna `queryKey` ni ningún
   `refetch`.
4. **Idioma y tema** — `LanguageProvider` y la preferencia persistida
   (`src/utils/language-preference.ts`, `theme-preference.ts`). Fuera del
   alcance de cualquier reset de pantalla.
5. **Borrador a medio llenar: no existe y no se inventa.** Ninguna de las cinco
   pantallas ofrece hoy "guardar borrador", ni copy que lo prometa, ni
   affordance de recuperación; el reporte humano del 2026-09-04 trata
   explícitamente el resto como defecto. Por tanto **no hay ningún caso
   legítimo de formulario a medio llenar que deba sobrevivir**, y R1–R6 no
   rompen ninguno.

## Fuera de alcance

- **`DocsScreen` (`src/screens/docs/index.tsx`) no se toca.** Auditada: tiene
  **cero** `useState` (ni siquiera importa `useState`); todo su estado es caché
  de dos `useQuery`. No tiene el defecto. Evidencia completa en
  [[design]] §Auditoría de las pantallas bajo `(tabs)`.
- **No se mueve ninguna ruta a un Stack.** Decisión D1 de [[design]]. Con ella,
  `(tabs)/_layout.tsx`, el `Redirect` a `/login`, el `SelectedPetProvider` y el
  `FloatingTabBar` quedan **sin tocar**, y la decisión D4 de
  `specs/mobile-device-pairing/design.md` sigue vigente.
- **Cabeceras nativas**: los seis botones de volver a mano
  (`add-reminder-back`, `add-pet-back`, `docs-back`, `weight-log-back`,
  `meal-schedule-back`, `pairing-back`) se conservan tal cual, con sus `testID`
  y sus aserciones de `TOUCH_SLOP` de #61 R10 intactas.
- **Transición de entrada (M3 de `progress/audit_animations_mobile.md`)**: no se
  añade ninguna animación. El teleport sigue.
- **Copy nueva**: cero. Esta feature **no añade ni renombra ninguna clave de
  `src/i18n/catalog.ts`**, así que
  `src/providers/__tests__/language-provider.test.tsx:55`
  (`expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)`) debe
  quedar **byte a byte idéntica**. Si un diff la toca, la implementación se
  salió del alcance.
- **Pantallas adyacentes que también viven bajo `(tabs)` sin ser tab**:
  `reminders` (`deletingId`, `deleteCandidate`, `actionError`) y `alerts`
  (`acked`, `ackingId`, `actionError`). Auditadas y **no** incluidas: el
  enunciado de #63 acota el criterio 4 a `add-pet`, `weight-log`,
  `meal-schedule` y `docs`. Lo que se encontró está anotado en [[design]]
  §Auditoría para que el leader decida si abre feature.
- **`map.tsx`** (`lostModeBusy`, `lostModeFailed`): es tab de pleno derecho, no
  pantalla de detalle. No entra.
- **Nada de esto crea, renombra ni borra ficheros de ruta**, así que
  `mobile-pet-tracker/.expo/types/router.d.ts` no se invalida. Ver la
  precondición de [[tasks]] §0.

## Deuda que esta spec deja abierta (para que el leader la registre)

La vía estructural queda **explícitamente pospuesta**, no descartada. Enunciado
listo para `feature_list.json`:

> **`mobile-detail-screens-to-stack`** (`priority: P3`). Sacar las seis
> pantallas de detalle (`add-reminder`, `pets/add`, `pets/[petId]/docs`,
> `weight-log`, `meal-schedule`, `pairing`) de `src/app/(tabs)/` a un Stack
> nativo, para darles push/pop de plataforma y cabecera nativa. Cierra M3 de
> `progress/audit_animations_mobile.md` (hoy `router.push` a estas rutas es un
> teleport sin transición) y el punto de `progress/audit_ui_polish.md:125`
> (cabecera nativa en vez de los seis botones de volver a mano). Requiere:
> subir `SelectedPetProvider` y el `Redirect` a `/login` de
> `src/app/(tabs)/_layout.tsx` a `src/app/_layout.tsx` —lo que los pone también
> sobre `(auth)` y `reset-password`—, revisar el `paddingBottom: insets.bottom
> + 96` de las seis pantallas (ese hueco existe por el `FloatingTabBar`, que
> deja de pintarse sobre una pantalla del Stack), sustituir los seis botones de
> volver y sus `testID` por cabecera de Stack con claves de copy nuevas en los
> dos idiomas, y borrar `mobile-pet-tracker/.expo/types/router.d.ts` antes de
> tocar código. Revierte la decisión D4 de
> `specs/mobile-device-pairing/design.md`, que metió `/pairing` bajo `(tabs)`
> precisamente para heredar guard y provider. El reset local de #63 seguiría
> siendo correcto pero redundante en las pantallas que se muevan: retirarlo es
> parte del cierre (C7).

## Verificación

- **Comando dirigido** (el gate completo `./init.sh` lo corre el reviewer; esta
  spec **no** pide correrlo durante la implementación porque el Postgres de
  Docker está compartido entre worktrees):

  ```
  cd mobile-pet-tracker && npx jest src/screens/add-reminder src/screens/add-pet \
    src/screens/pairing src/screens/docs "src/app/(tabs)/__tests__/weight-log" \
    "src/app/(tabs)/__tests__/meal-schedule" src/providers/__tests__/language-provider
  ```

  En `f50b4203` ese conjunto está en verde (comprobado durante la redacción de
  esta spec sobre `add-reminder` y `pairing`). **No se congela aquí ningún
  recuento de suites ni de tests**: caduca. La medición de cierre es el
  **delta contra `f50b4203`** — ninguna suite pasa de verde a roja, ningún
  `it(` existente desaparece ni cambia de nombre, y cada R-id nuevo aporta su
  `describe` con su id en el título.
- `npx tsc --noEmit` y `npx expo lint` en `mobile-pet-tracker/` verdes.
- C8 de `CHECKPOINTS.md`: esta feature no añade ni una `className`, ni un hex,
  ni un token, ni una dimensión, ni una animación. El grep-clean y
  `src/__tests__/consistency-classnames.test.ts` deben salir idénticos.

## Gate humano no delegable (criterio de aceptación 7)

Prueba de humo en **dev build de Android** (nunca Expo Go — `expo-maps` no
existe allí y el runtime de smoke es dev build desde 2026-08-27):

1. Crear un recordatorio completo (tipo distinto de `vaccine`, título, fecha,
   hora, antelación) y guardar. Volver a entrar a "Agregar recordatorio": el
   formulario aparece **en blanco**, con `vaccine` seleccionado, la hora en
   09:00 y la antelación en 7 días.
2. Repetir: crear un **segundo** recordatorio seguido. Sigue en blanco.
3. Escribir medio formulario, salir con la flecha de volver sin guardar,
   reentrar: en blanco.
4. En `/pairing`, emparejar un collar hasta ver "Tracker is ready", salir por
   la barra de tabs y volver a `/pairing`: ya **no** aparece "Tracker is ready".
5. En `/pairing` con dos mascotas: provocar un error de código inválido con la
   mascota A, cambiar a la mascota B en el `PetSwitcher`: el mensaje de error y
   el código escrito desaparecen.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-14) ← gate obligatorio antes de implementar
