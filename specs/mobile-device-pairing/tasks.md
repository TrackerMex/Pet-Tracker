---
feature: "mobile-device-pairing"
status: draft   # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-device-pairing]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]]
> y tiene siempre los mismos 3 sub-items, en este orden: **el commit del
> test rojo precede al commit que lo pone verde** (C4 de `CHECKPOINTS.md`).
> Todo en `mobile-pet-tracker/` con `bun run test -- <ruta>` (jest-expo).
> Los nombres exactos de cada `describe` están en [[requirements]]; se
> copian literalmente. Commits: `test(mobile-device-pairing): … (Rn)` para
> el rojo, `feat(mobile-device-pairing): … (Rn)` para el verde.
>
> Antes de empezar: cargar skills `expo-overview` → `expo-router`,
> `expo-native-ui`, `appllama-app-design-skill` (límites de
> `docs/ui-guidelines.md`). Orden: R1→R2→R3 (api), R4→R5→R6→R7→R8→R9
> (pantalla), R10 (entradas), R11 (carta), cierre.

## R1 — `claimDevice` mapea `POST /devices/claim` por kind

- [ ] (1) Test rojo: `src/api/__tests__/devices.test.ts`, describe `R1: claimDevice publica el claim y mapea la respuesta por kind` (201 ok con las 5 claves; 201 malformado/JSON inválido → error; `it.each` 400/401/402/403/404+code/409+code/409 sin code/500; rechazo → unreachable; `undefined`/`''` → missing-config sin fetch; body enviado exacto)
- [ ] (2) Implementación mínima: `src/api/devices.ts` con `postJson` + `readJson` de `./http`, `ClaimDeviceInput`, `ClaimDeviceState`, `claimDevice` (firmas en [[design]] §Archivos)
- [ ] (3) Refactor con tests verdes

## R2 — `releaseDevice` mapea `DELETE /pets/:petId/device` por kind

- [ ] (1) Test rojo: mismo archivo, describe `R2: releaseDevice libera el collar y mapea por kind` (204 ok; 404 con y sin code → not-assigned; 403/401/500; unreachable; missing-config)
- [ ] (2) Implementación mínima: `releaseDevice` con `deleteJson`
- [ ] (3) Refactor con tests verdes

## R3 — `getPetTracking` deriva tracked/free del 402

- [ ] (1) Test rojo: `src/api/__tests__/subscriptions.test.ts`, describe `R3: getPetTracking deriva tracked/free del gate 402 de positions/last` (URL y bearer exactos; 402 → tracked false; 200 null y 200 posición → tracked true; 401; 500; 200 malformado → error; unreachable; missing-config)
- [ ] (2) Implementación mínima: `src/api/subscriptions.ts` delegando en `getLastPosition` ([[design]] §D2, con el comentario `ponytail:`)
- [ ] (3) Refactor con tests verdes

## R4 — Ruta `/pairing` con selector y estados de carga

- [ ] (1) Test rojo: `src/screens/pairing/index.test.tsx`, describe `R4: /pairing monta dentro de (tabs) con selector de mascota y estados de carga` (route default renderiza `screen-pairing`; `pairing-back` → `router.back`; skeleton mientras pending; error + retry refetchea; lista vacía; chips del `PetSwitcher`; `useFocusEffect` registrado)
- [ ] (2) Implementación mínima: `src/app/(tabs)/pairing.tsx` + `src/screens/pairing/index.tsx` con `listPets`/`useApi`/`usePetSelection`/`PetSwitcher` y dimensiones uniformes
- [ ] (3) Refactor con tests verdes

## R5 — Vista de vinculación: formulario y claim solo al enviar

- [ ] (1) Test rojo: describe `R5: sin collar muestra el formulario de vinculación y publica el claim solo al enviar` (nota `pairing-plan-free` exacta; input y botón; botón deshabilitado con código vacío; sin llamada al montar; una llamada con `activationCode` trimmed y `petId` seleccionado)
- [ ] (2) Implementación mínima: rama `device === null` con `TextInput` + `Button` heroui + `Card variant="secondary"`
- [ ] (3) Refactor con tests verdes

## R6 — Mensajes por kind del claim

- [ ] (1) Test rojo: describe `R6: el claim mapea cada kind a su mensaje y permite reintentar` (`it.each` con los 8 kinds y sus strings exactos; `pairing-error` selectable; botón re-habilitado; `unauthorized` → `signOut`)
- [ ] (2) Implementación mínima: `switch (result.kind)` en el submit
- [ ] (3) Refactor con tests verdes

## R7 — Vista "Tracker is ready"

- [ ] (1) Test rojo: describe `R7: tras el 201 muestra "Tracker is ready" con el collar y sus CTAs` (título, subtítulo con el nombre, `ready-model`/`ready-esn` con valor y con `—`; formulario desmontado; `pets.refetch` llamado; `ready-map` → `router.push('/map')`; `ready-done` → `router.back`)
- [ ] (2) Implementación mínima: `phase`/`readyDevice` + vista ready
- [ ] (3) Refactor con tests verdes

## R8 — Vista de estado con plan tracked/free

- [ ] (1) Test rojo: describe `R8: con collar muestra el estado del dispositivo y el plan tracked/free según subscriptions` (5 filas con valores y fallbacks; `plan-skeleton` mientras pending; `plan-tracked`; `plan-free`; `plan-unknown` para error/unreachable/missing-config; `getPetTracking` no llamado con `device === null`)
- [ ] (2) Implementación mínima: rama `device !== null` + `useMemo`/`useApi` de `getPetTracking`
- [ ] (3) Refactor con tests verdes

## R9 — Unpair con confirmación nativa

- [ ] (1) Test rojo: describe `R9: desvincular pide confirmación nativa, libera el collar y vuelve al formulario` (`jest.spyOn(Alert, 'alert')`; título/mensaje/botones exactos; `Cancel` no llama; `Unpair` llama una vez; `ok`/`not-assigned` → refetch y formulario visible con `device: null` en el segundo `listPets`; `forbidden`/`unreachable`/`error`/`missing-config` → mensajes; `unauthorized` → `signOut`; botón deshabilitado en vuelo)
- [ ] (2) Implementación mínima: `Alert.alert` + `releaseDevice`
- [ ] (3) Refactor con tests verdes

## R10 — Puntos de entrada en perfil y home

- [ ] (1) Test rojo: `src/screens/profile/index.test.tsx` describe `R10 (mobile-device-pairing): el perfil enlaza a /pairing` y `src/app/(tabs)/__tests__/home.test.tsx` describe `R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing` (presente con `device: null`, ausente con collar; `router.push('/pairing')`)
- [ ] (2) Implementación mínima: `pairing-link` tras `documents-link`; `collar-pair-link` en la rama `device === null` de `collar-card`. Las suites existentes de ambos archivos siguen verdes sin tocar sus asserts
- [ ] (3) Refactor con tests verdes

## R11 — Carta de UI (C8)

- [ ] (1) Test rojo: `src/__tests__/design-drift.test.ts` describe `R11 (mobile-device-pairing): pairing usa el Card compartido y las dimensiones uniformes` (lee `screens/pairing/index.tsx`: imports de `../../components/card` y `../../components/pet-switcher`, literales `padding: 24`, `gap: 16`, `insets.top + 12`, `insets.bottom + 96`). Rojo solo si R4 aún no cumple; si ya está verde, commit del test igualmente antes del refactor final
- [ ] (2) Implementación mínima: ajustar la pantalla si algo falta; confirmar que el describe `C8` existente sigue verde con la carpeta nueva
- [ ] (3) Refactor con tests verdes

## Cierre (sin R-id, obligatorio)

- [ ] `bun run test`, `bun run lint`, `bun run typecheck` en `mobile-pet-tracker/` verdes; `./init.sh` desde la raíz exit 0
- [ ] `docs/verification.md`: sección `### Feature 42 — mobile-device-pairing` con el guion D11 de [[design]] (commit `docs(mobile-device-pairing): …`)
- [ ] `specs/mobile-device-pairing/traceability.md` sin filas `pendiente` en R1–R11; fila G1 queda `pendiente (humano)` hasta el smoke
- [ ] `progress/impl_mobile-device-pairing.md` con comandos corridos, contención (grep-clean) y el estado de G1
- [ ] Grep de contención: `grep -rn "expo-camera" mobile-pet-tracker/src mobile-pet-tracker/package.json` → 0; `git diff --stat main -- backend-pet-tracker/` → vacío
