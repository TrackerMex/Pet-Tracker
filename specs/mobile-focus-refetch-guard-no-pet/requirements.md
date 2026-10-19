---
feature: "mobile-focus-refetch-guard-no-pet"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-focus-refetch-guard-no-pet]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[traceability]] para la trazabilidad. [[../../docs/architecture|architecture]]
> describe solo las capas de backend; este cambio vive en la capa de presentación
> (`mobile-pet-tracker/src/screens/`) y no cruza ninguna capa.

## Contexto

- Origen: respuesta del humano (2026-10-18) a la pregunta de la guarda en §5 de
  `specs/mobile-no-pets-states-and-centered-content/requirements.md` (#181). #181 está
  `done` en `origin/main`, así que su dependencia ya se cumple. Base de esta spec:
  `origin/main` en el commit d799d714 al crear la rama.
- Problema: TanStack Query v5 ejecuta el `queryFn` en `refetch()` aunque `enabled`
  sea `false`. Inicio, Perfil y Recordatorios llaman a su refetch de mascota dentro de
  `useFocusEffect` sin mirar `selectedPetId`. Con una cuenta sin mascotas se envía
  `GET /pets/null`. #181 oculta la tarjeta de error, pero no esa petición.
- Medición (descripción de #193, query-core 5.102.8): 0 llamadas al suscribirse y
  1 llamada tras `refetch()`.

## Definiciones

- **Sin mascota seleccionada**: `selectedPetId` (valor de `useSelectedPet()`) es `null`.
- **Con mascota seleccionada**: `selectedPetId` no es `null`.
- **Foco**: se ejecuta la callback de `useFocusEffect` de la pantalla.
- **Refetch del detalle**: `refetchDetail()` de Inicio y de Perfil. Produce una llamada a `getPet`.
- **Refetch de recordatorios**: `refetchReminders()` de Recordatorios. Produce una llamada a `listReminders`.
- **Refetch general**: `refetchPets()` (llamada a `listPets`) en Inicio y Perfil, y `refetchOpenAlerts()` (llamada a `listAlerts` con `'open'`) en Inicio. No depende de la mascota.
- **Llamada durante el foco**: diferencia del contador de la función mockeada antes y después de invocar la callback de foco.

## Requisitos funcionales

Clasificación según C4 (`CHECKPOINTS.md`). «Rojo, vía a»: el test se escribe antes que la implementación y falla hoy por aserción. «Verificación, vía b»: asevera una propiedad que ya se cumple hoy y se cierra por mutación de producción.

### Inicio (`mobile-pet-tracker/src/screens/home/index.tsx`)

- **R1** (rojo, vía a): WHEN la pantalla Inicio gana el foco AND `selectedPetId` es `null`, THE SYSTEM SHALL no llamar a `getPet` durante ese foco.
- **R2** (verificación, vía b): WHEN la pantalla Inicio gana el foco AND `selectedPetId` no es `null`, THE SYSTEM SHALL llamar a `getPet` una vez, con ese id, durante ese foco.
- **R3** (verificación, vía b): WHEN la pantalla Inicio gana el foco AND `selectedPetId` es `null`, THE SYSTEM SHALL llamar una vez a `listPets` y una vez a `listAlerts` durante ese foco.

### Perfil (`mobile-pet-tracker/src/screens/profile/index.tsx`)

- **R4** (rojo, vía a): WHEN la pantalla Perfil gana el foco AND `selectedPetId` es `null`, THE SYSTEM SHALL no llamar a `getPet` durante ese foco.
- **R5** (verificación, vía b): WHEN la pantalla Perfil gana el foco AND `selectedPetId` no es `null`, THE SYSTEM SHALL llamar a `getPet` una vez, con ese id, durante ese foco.
- **R6** (verificación, vía b): WHEN la pantalla Perfil gana el foco AND `selectedPetId` es `null`, THE SYSTEM SHALL llamar una vez a `listPets` durante ese foco.

### Recordatorios (`mobile-pet-tracker/src/screens/reminders/index.tsx`)

- **R7** (rojo, vía a): WHEN la pantalla Recordatorios gana el foco AND `selectedPetId` es `null`, THE SYSTEM SHALL no llamar a `listReminders` durante ese foco.
- **R8** (verificación, vía b): WHEN la pantalla Recordatorios gana el foco AND `selectedPetId` no es `null`, THE SYSTEM SHALL llamar a `listReminders` una vez durante ese foco.
- **R9** (verificación, vía b): WHEN la pantalla Recordatorios pierde el foco AND `selectedPetId` es `null`, THE SYSTEM SHALL ejecutar la limpieza que devuelve la callback de foco (confirmación de borrado y error de acción a `null`), de modo que ni la confirmación ni el error sigan visibles.

### Transversales

- **R10** (verificación, vía b): WHILE una de las tres pantallas está enfocada, WHEN `selectedPetId` cambia, THE SYSTEM SHALL conservar la misma función de callback de foco (misma identidad antes y después del cambio), de modo que la selección no vuelva a ejecutar el efecto de foco.
- **R11** (verificación, vía b): THE SYSTEM SHALL mantener en `mobile-pet-tracker/src/screens/home/index.tsx`, `mobile-pet-tracker/src/screens/profile/index.tsx` y `mobile-pet-tracker/src/screens/reminders/index.tsx` cero incumplimientos de la grep-clean de `docs/ui-guidelines.md` §3: ningún literal hex, ninguna clase arbitraria, ningún `StyleSheet.create` y ninguna sombra o elevación legacy.

## Fuera de alcance

- Cualquier cambio en `mobile-pet-tracker/src/api/` (`getPet`, `listReminders`, `listPets`, `listAlerts`): ni guardas dentro de la capa de datos ni cambios de contrato.
- Cambios en `mobile-pet-tracker/src/providers/selected-pet-provider.tsx` y en `mobile-pet-tracker/src/hooks/use-pet-selection.ts`.
- Las ramas de la tarjeta de error de #181 (sus R3 a R5) y cualquier cambio de JSX, copy, testIDs, estilos o dimensiones de Inicio, Perfil y Recordatorios.
- La guarda del refetch general: `refetchPets()` y `refetchOpenAlerts()` siguen sin guarda en ambos estados.
- El `refetchReminders()` dentro de `handleDelete` de Recordatorios: ya está protegido por `if (!selectedPetId) return;`.
- Mapa (`mobile-pet-tracker/src/screens/map/index.tsx`): su callback de foco ya sale si no hay `selectedPetId`; no se toca.
- Cualquier otra petición con id nulo fuera de las tres callbacks de foco. Si aparece durante la implementación, se registra como hallazgo y se abre otra feature; no se añade aquí.
- Hook compartido de foco y refactor de la forma de las pantallas.
- Backend y cualquier cambio de contrato HTTP.
- Smoke automatizado y capturas de regresión visual. El smoke lo hace el humano (CC4).

## Criterios de cierre (no son requisitos)

- **CC1**: desde `mobile-pet-tracker/`, `bunx jest` en `src/screens/home/index.test.tsx`, `src/screens/profile/index.test.tsx`, `src/screens/reminders/index.test.tsx`, `src/screens/map/index.test.tsx` y `src/__tests__/design-drift.test.ts` sin ningún `it` en rojo; `bunx tsc --noEmit` sin errores; `bunx expo lint` con código de salida 0 medido sin pipe.
- **CC2**: en cada pantalla, el diff solo toca imports de React, la ref de `selectedPetId` con su efecto de sincronización y la guarda dentro de la callback de foco. No cambian el JSX ni el array de dependencias de los `useCallback` de foco.
- **CC3**: `traceability.md` sin filas «pendiente» y commits según `tasks.md` (C5).
- **CC4** (lo cierra el humano, no el reviewer): smoke en el dev build Android del humano, no en Expo Go ni en la VPS. Con una cuenta sin mascotas, al enfocar Inicio, Perfil y Recordatorios no sale ninguna petición con id nulo (se observa en la red del dev build o en el log de la API). Con una cuenta con mascota, el detalle se refresca al enfocar.

## Preguntas abiertas

Ninguna bloquea la firma. El humano las contesta antes o durante el smoke.

1. **Arranque en frío con mascotas.** Al montar, `selectedPetId` puede ser `null` hasta que `usePetSelection` selecciona la primera mascota. Con la guarda, el foco en esa ventana no pide el detalle, y el detalle lo carga la activación de `enabled` cuando la selección se fija. Es inferencia del código, no medida en ejecución. ¿Se acepta, o hace falta el detalle también en ese foco?
2. **Checklist de autocrítica.** `docs/ui-guidelines.md` (sección «Checklist de autocrítica») pide cerrar «toda pantalla nueva o modificada». Este cambio no toca JSX ni estilos. ¿Se declara no aplicable en la revisión, o se exige el checklist sobre capturas?
3. **Smoke (CC4).** ¿Debe el smoke del humano incluir la cuenta sin mascotas en el dev build Android como criterio de cierre, o bastan CC1 a CC3?

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-19) ← gate obligatorio antes de implementar
