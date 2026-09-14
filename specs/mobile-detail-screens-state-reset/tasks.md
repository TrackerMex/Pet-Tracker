---
feature: "mobile-detail-screens-state-reset"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-detail-screens-state-reset]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden y sujeto.** R1–R6 son independientes entre sí: cada uno actúa sobre
> una pantalla y un fichero de test que **ya existen en `f50b4203`**. Ninguno
> asevera nada que otro requisito deba crear antes. R7 va **el último a
> propósito**: verifica una propiedad de lo que R1–R5 dejan en el árbol
> (ver §R7).
>
> **Commits test-primero, obligatorio (C4 de `CHECKPOINTS.md`).** Un commit por
> paso: primero el rojo que nombra su R-id, después el verde. Nada de
> implementación + tests + docs en un solo commit. Formato:
> `test(detail-state-reset): <desc> (R1)` para el rojo y
> `feat(detail-state-reset): <desc> (R1)` para el verde
> (`docs/conventions.md` §Commits).

---

## 0 — Precondiciones (una vez, antes de tocar nada)

- [ ] Cargar las skills `expo:expo-overview` y después `expo:expo-router`
      (`docs/ui-guidelines.md` §Skills lo exige para todo trabajo móvil; en
      Codex CLI vienen del plugin `expo`).
- [ ] Comprobar que `mobile-pet-tracker/.expo/types/router.d.ts` **no** existe
      (en `f50b4203` el directorio `.expo/types/` está vacío). Esta feature no
      crea, mueve ni borra ninguna ruta, así que no debería aparecer; si
      existiera y `npx tsc --noEmit` se quejara de rutas fantasma, **bórralo**
      antes de seguir — está en `.gitignore`.
- [ ] Baseline verde dirigido, **sin `./init.sh`** (el Postgres de Docker está
      compartido con otro worktree; el gate completo lo corre el reviewer):

      cd mobile-pet-tracker && npx jest src/screens/add-reminder src/screens/add-pet \
        src/screens/pairing src/screens/docs "src/app/(tabs)/__tests__/weight-log" \
        "src/app/(tabs)/__tests__/meal-schedule" src/providers/__tests__/language-provider

- [ ] Leer [[design]] §D3 (dónde va cada hook) y §D4 (cómo se simula el blur en
      test y qué le falta a cada fichero de test). **No copies el bloque de
      mock de otra suite**: los cinco ficheros parten de mocks distintos y uno
      de ellos ya trae `useFocusEffect`.

---

## R1 — `add-reminder` vuelve en blanco tras perder el foco

- [ ] (1) Escribir test que falla para R1, en
      `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`, dentro de un
      `describe('R1: el formulario vuelve a sus valores iniciales al perder el foco', ...)`.
      En el mismo commit: añadir `useFocusEffect: jest.fn()` al objeto que
      devuelve la factory de `jest.mock('expo-router', ...)` (líneas 34-48),
      importar `useFocusEffect` de `expo-router` y `act` de
      `@testing-library/react-native`, y declarar
      `const mockUseFocusEffect = jest.mocked(useFocusEffect);`.
      El test: renderizar con `renderAddReminder()`, ensuciar **los ocho**
      valores (elegir `type-chip-food`, escribir en `title-input`, elegir fecha
      con `pickDate(...)`, cambiar la hora por el picker, elegir
      `advance-chip-0`, dejar abierto `date-picker`, provocar un
      `add-reminder-error` pulsando enviar con título vacío), ejecutar el
      helper de blur de [[design]] §D4 y afirmar los ocho valores iniciales
      según §D4 §"Cómo se afirma cada valor reseteado".
      **El helper debe tolerar `mock.calls` vacío** (`forEach`, nunca
      `calls[0][0]`): en este commit producción todavía no llama a
      `useFocusEffect`, y el rojo tiene que ser el fallo de la aserción, no un
      `TypeError`.
- [ ] (2) Implementación mínima que lo pasa: en `AddReminderContent`, importar
      `useFocusEffect` de `expo-router` y `useCallback` de `react`, y añadir el
      `useFocusEffect` de reset de [[design]] §D3 forma A. `time` vuelve con
      `initialTime()`. **`submitting` no se toca.**
- [ ] (3) Refactor con tests verdes. Correr toda la suite del fichero: todos
      los `it` que ya había en `f50b4203` siguen verdes y ninguno cambia de
      nombre ni desaparece.

## R2 — `add-pet` vuelve en blanco tras perder el foco

- [ ] (1) Escribir test que falla para R2, en
      `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`, en un
      `describe('R2: ...')`. En el mismo commit: añadir `useFocusEffect:
      jest.fn()` al objeto de `jest.mock('expo-router', ...)` (líneas 34-36 —
      ese mock **no** tiene `Redirect` y no lo necesita: `AddPetScreen` no lo
      usa), importar `useFocusEffect` y `act`, declarar `mockUseFocusEffect`.
      Ensuciar al menos `name`, `breed`, `microchip`, `species`, `sex`, `size`,
      `sterilized`, `ageMode` + `approxAgeMonths`, `photoAsset` (vía el mock de
      `expo-image-picker`) y un `formError`; blur; afirmar los catorce valores
      iniciales. Para `photoAsset`, afirmar sobre las props del `PetAvatar`
      mockeado (esa suite ya lo sustituye por un `View`).
- [ ] (2) Implementación mínima que lo pasa: `useFocusEffect` de reset en
      `AddPetScreen`. **`submitting` no se toca.**
- [ ] (3) Refactor con tests verdes.

## R3 — `weight-log` vuelve en blanco tras perder el foco

- [ ] (1) Escribir test que falla para R3, en
      `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx`, en un
      `describe('R3: ...')`. En el mismo commit: añadir `useFocusEffect:
      jest.fn()` a la factory de `jest.mock('expo-router', ...)` (líneas 38-52,
      conservando `router` y `Redirect`), importar `useFocusEffect` y `act`,
      declarar `mockUseFocusEffect`. Escenario: `listWeights` en `ok`, escribir
      en `weight-input`, `weight-date-input` y `weight-bc-input`, provocar un
      `weight-form-error` enviando un peso no numérico; blur; afirmar los
      cuatro valores iniciales (`measuredAt` vuelve a la fecha de hoy que
      produce `localTodayIso()`; derívala en el test, no la escribas fija).
- [ ] (2) Implementación mínima que lo pasa: `useFocusEffect` de reset en
      `WeightLogContent`. **`submitting` no se toca.**
- [ ] (3) Refactor con tests verdes.

## R4 — `meal-schedule` olvida el error de generación al perder el foco

- [ ] (1) Escribir test que falla para R4, en
      `mobile-pet-tracker/src/app/(tabs)/__tests__/meal-schedule.test.tsx`, en un
      `describe('R4: ...')`. En el mismo commit: añadir `useFocusEffect:
      jest.fn()` a la factory de `jest.mock('expo-router', ...)` (líneas 41-55),
      importar `useFocusEffect` y `act`, declarar `mockUseFocusEffect`.
      Escenario: `generateNutritionPlan` devuelve `unprocessable` con
      `PET_WEIGHT_REQUIRED` → `generate-plan-error` visible; blur;
      `screen.queryByTestId('generate-plan-error')` es `null`.
- [ ] (2) Implementación mínima que lo pasa: `useFocusEffect` de reset en
      `MealScheduleContent` que solo pone `generateError` a `null`.
      **`submitting` no se toca.**
- [ ] (3) Refactor con tests verdes.

## R5 — `pairing` no arrastra la vista `ready` ni el código al perder el foco

- [ ] (1) Escribir test que falla para R5, en
      `mobile-pet-tracker/src/screens/pairing/index.test.tsx`, en un
      `describe('R5: ...')`. **Este fichero ya mockea `useFocusEffect` (línea
      50), ya importa `act` y ya declara `mockUseFocusEffect` (línea 66): no
      toques el bloque de mocks.** Solo añade el helper de blur, que aquí
      **tiene que recorrer todas las llamadas** porque habrá tres
      `useFocusEffect` (los dos de refetch más el nuevo) y el orden no se puede
      presuponer; envuelve en `act` y afirma con `await waitFor`.
      Escenario: `listPets` devuelve una mascota con `device: null`, escribir
      un código en `activation-code-input`, `claimDevice` en `ok` →
      `pairing-ready` visible; blur; afirmar `pairing-ready` nulo,
      `activation-code-input` con `value` `''` y `pairing-error` nulo. Añadir un
      segundo `it` con `claimDevice` en `invalid` para cubrir `actionError`.
- [ ] (2) Implementación mínima que lo pasa: en `PairingScreen`, extraer
      `resetPairingState` (`useCallback`, deps `[]`, los cuatro setters de
      [[design]] §D3 forma B) y añadir el `useFocusEffect` que lo devuelve como
      cleanup. **`claiming` y `releasing` no se tocan.**
- [ ] (3) Refactor con tests verdes. Los dos `useFocusEffect` de refetch
      (líneas 101-111) quedan exactamente como están.

## R6 — `pairing` se limpia al cambiar de mascota

- [ ] (1) Escribir test que falla para R6, en el mismo fichero, en un
      `describe('R6: ...')`. **Este test no usa el helper de blur**: es
      interacción real. Escenario: `listPets` devuelve **dos** mascotas
      (`pet-1` seleccionada, `pet-2` con `device: null`); llegar a
      `pairing-ready` con `pet-1`; `fireEvent.press(screen.getByTestId(
      'pet-chip-pet-2'))`; afirmar `pairing-ready` nulo y
      `activation-code-input` con `value` `''`. Segundo `it`: provocar
      `pairing-error` con `pet-1`, cambiar a `pet-2`, afirmar `pairing-error`
      nulo.
- [ ] (2) Implementación mínima que lo pasa: `useEffect(() => {
      resetPairingState(); }, [resetPairingState, selectedPetId])` en
      `PairingScreen`. Sin `useRef` centinela: la ejecución en el montaje es un
      no-op declarado en [[design]] §D3.
- [ ] (3) Refactor con tests verdes. Verificar que todos los `it` que
      `pairing/index.test.tsx` ya tenía en `f50b4203` siguen verdes: el reset
      en el montaje no debe romper ninguno.

## R7 — los guardas de petición en vuelo sobreviven al blur

> **Declaración obligatoria de C4, tercer punto, hecha antes del handoff:**
> R7 es un **requisito de verificación**. Solo asevera una propiedad de los
> artefactos que R1–R5 ya dejaron en el árbol (que sus bloques de reset **no**
> incluyen `setSubmitting` / `setClaiming` / `setReleasing`), así que su rojo
> no puede ser honesto por orden: antes de R1 el test pasaría en verde sin que
> exista candado alguno. Se elige la **vía (b)**: se declara requisito de
> verificación y su cierre se prueba por **mutación de producción**, con la
> evidencia en `progress/review_mobile-detail-screens-state-reset.md`.

- [ ] (1) Escribir el test de R7 —`describe('R7: el guarda de envío sobrevive
      al blur', ...)`— en `add-reminder/index.test.tsx` y en
      `pairing/index.test.tsx`. Escenario en `add-reminder`: `createReminder`
      devuelve `pending()`, rellenar el formulario válido, pulsar
      `add-reminder-submit` → `isDisabled` en `true`; ejecutar el blur;
      afirmar que `add-reminder-submit` **sigue** deshabilitado. En `pairing`:
      `claimDevice` devuelve `pending()`, pulsar `pairing-submit`, blur,
      afirmar que `pairing-submit` sigue deshabilitado.
- [ ] (2) No hay implementación nueva: R1–R5 ya lo dejan así por construcción.
      **Prueba de mutación, en dos sitios distintos** (un solo sitio deja zona
      ciega): (i) añadir `setSubmitting(false)` al bloque de reset de
      `AddReminderContent` → el `it` de R7 de `add-reminder` debe ponerse rojo
      **por su aserción**; revertir y comprobar `git diff` vacío. (ii) añadir
      `setClaiming(false)` al `resetPairingState` de `PairingScreen` → el `it`
      de R7 de `pairing` debe ponerse rojo **por su aserción**; revertir y
      comprobar `git diff` vacío. Pegar ambas salidas en el reporte de
      implementación.
- [ ] (3) Refactor con tests verdes.

---

## Cierre

- [ ] `progress/impl_mobile-detail-screens-state-reset.md` escrito: qué commit
      cubre qué R-id, la salida de las dos mutaciones de R7, y la salida del
      comando dirigido de [[requirements]] §Verificación **sin pipe** (un
      `./init.sh | tail` devuelve el código de `tail`, no el del gate).
- [ ] `traceability.md` sin ninguna fila "pendiente".
- [ ] `npx tsc --noEmit` y `npx expo lint` verdes en `mobile-pet-tracker/`.
- [ ] `git diff f50b4203 --stat` toca **exactamente diez** ficheros: los cinco
      de producción y los cinco de test de [[design]] §Archivos afectados.
      Si aparece `src/i18n/catalog.ts`,
      `src/providers/__tests__/language-provider.test.tsx`,
      `src/app/(tabs)/_layout.tsx` o cualquier fichero de ruta, la
      implementación se salió del alcance.
- [ ] **No rebasar** después de escribir la trazabilidad: invalidaría los hashes
      registrados.
- [ ] El gate humano de [[requirements]] §Gate humano (dev build de Android)
      **no lo cierra ninguna IA**.
