---
feature: "pet-lost-mode"
status: draft        # draft | approved
tags: [harness, spec, backend, mobile]
---

# Diseño — [[pet-lost-mode]]

> Ver [[requirements]] (R1–R9), `docs/architecture.md` (capas del módulo
> pets) y `docs/ui-guidelines.md` (parte móvil). Implementer: cargar
> `expo-overview` antes de tocar `mobile-pet-tracker/` (C8; en Codex, el
> plugin `expo`).

## Decisiones técnicas

### D1 — Lost Mode es un flag expuesto, sin efectos automáticos (producto)

Ningún doc del repo (`docs/*.md`, specs de alerts-engine/positions) define
efectos de `lost_mode` sobre alertas o posiciones; la decisión estaba
abierta y se cierra aquí con la opción mínima: **el endpoint escribe el
flag y el perfil lo expone — nada más**. Razones:

- alerts-engine evalúa geofences/batería sobre eventos de ingesta; colgar
  una alerta `pet.lost` requiere definir tipo, destinatarios y ciclo de
  vida — spec propia, no un rider de un toggle.
- El polling móvil (15 s, #36) ya es el máximo del MVP; "polling más
  agresivo en lost mode" es tuning sin evidencia.
- La opción mínima cumple los tres criterios de aceptación de #45 tal
  como están escritos.

Los efectos quedan en Fuera de alcance como feature futura. Si el humano
quiere efectos ya, se reabre ESTA spec antes del gate.

### D2 — Endpoint dedicado `POST /v1/pets/:petId/lost-mode` con `{enabled}` (R1)

- Coincide con el backlog de #45 y separa "editar la ficha" (PATCH) de
  "cambiar el estado operativo" (toggle).
- `PetFieldsSchema` es compartido por POST y PATCH; meterle `lostMode`
  filtraría el flag al alta o exigiría un `.extend` asimétrico — más
  superficie que un DTO nuevo de una clave.
- Un solo handler con body booleano cubre activar y desactivar
  (alternativa POST/DELETE descartada: dos handlers para un bit).
- `@HttpCode(HttpStatus.OK)` — el POST no crea recurso; responde 200 con
  el perfil, que es lo que la app consume.

### D3 — Autorización: `@RequirePetRole('owner')` (producto: quién puede)

`family`/`walker`/`vet` leen `lostMode` en el perfil pero no lo cambian —
mismo nivel de privilegio que editar/borrar la ficha (PATCH/DELETE). Se
reutiliza `PetAccessGuard` + decorador tal cual: 404 precede a 403, cero
lógica nueva de authz (R2).

### D4 — `SetLostModeUseCase` + `PetFieldChanges.lostMode` (R1)

Capa application: `SetLostModeUseCase.execute(petId, userId, enabled)` →
`pets.update(petId, { lostMode: enabled })` + `auditLogger.record(...)` →
devuelve `Pet`. Sin use case genérico ni "toggle" que lea antes de
escribir: escribir el valor pedido es idempotente por sí solo.

- `PetFieldChanges` (domain/repositories/pet.repository.ts) gana
  `lostMode?: boolean`; `PetDrizzleRepository.update` ya hace spread de
  `changes` sobre `.set()` y la columna `lostMode` existe en el schema —
  la capa infrastructure no cambia.
- Auditoría: `action: 'pet.lost_mode'`, `meta: { enabled }`. A diferencia
  de `pet.update` (solo nombres de campo), aquí el valor SÍ se registra:
  el booleano es la acción misma, no dato personal.
- El caso borde "fila borrada entre guard y use case" hereda el
  comportamiento del PATCH actual (mapPetError en el controller); no se
  añade manejo extra.

### D5 — Respuesta: `toPetProfileResponse(pet, role)` como el PATCH (R1, R4)

Mismo shape congelado; `device`/`photoUrl`/`nextVaccine` van `null` en la
respuesta del toggle (igual que en PATCH — el detalle GET los resuelve).
El tab Map no depende de esos campos: tras `kind: 'ok'` refresca
`listPets`, que es su fuente de verdad.

### D6 — Móvil: mutación con `useState`, gating por `myRole` (R5–R7)

- `setLostMode` en `src/api/pets.ts` sigue el patrón exacto de
  `createPet` (`postJson`, state union por `kind`). Sin dependencia
  nueva, sin react-query (D2 de #36).
- `map.tsx` deriva `selectedPet` de `pets.data.pets` (ya cargado para el
  pet-switcher) — cero fetches nuevos. Dos `useState` locales
  (`busy`, `failed`) gobiernan in-flight y error.
- No-owner: botón **visible y deshabilitado** (no oculto): conserva el
  layout actual del stub, evita saltos y nunca expone el camino 403 en
  UX normal; el 403 queda como defensa del backend.
- Union `myRole` de `types.ts` corregido a los roles reales del backend
  (`'owner' | 'family' | 'walker' | 'vet'`): un rol no-owner real
  (`family`) hoy ni siquiera type-checkea; nada usa los valores viejos
  (verificado por grep 2026-08-27).
- El botón sigue siendo heroui `Button` variant `danger-soft` con las
  clases actuales; label como hoy (`Button.Label`). Sin animación nueva
  (el cambio de label no la amerita); feedback pressed lo trae heroui.
  Error con `<Text selectable>` (carta §micro-reglas).

### D7 — Tests: dónde vive cada uno (C4/C5)

- Unit backend: specs junto a DTO y use case nuevos (patrón del módulo).
  `pets.controller.spec.ts` y `pet-access.guard.spec.ts` **no se tocan**:
  la semántica 403/404 ya está unit-testeada; el cableado de la ruta
  nueva lo cubre el e2e.
- e2e backend: archivo nuevo `test/pet-lost-mode.e2e-spec.ts` con
  helpers locales `seedUser`/`seedMembership` (patrón por-feature de
  `pet-reminders.e2e-spec.ts` — los archivos e2e no comparten fixtures).
- Móvil: describes nuevos en `src/api/__tests__/pets.test.ts` y en
  `src/app/(tabs)/__tests__/map.test.tsx`; el describe R10 del stub (#36)
  se **sustituye** por los de R6/R7 — es la única edición a tests
  existentes (R8), y C7 queda satisfecho: el stub se reemplaza en el
  mismo archivo, sin código huérfano.

## Archivos afectados por capa

**Backend (`backend-pet-tracker/src/modules/pets/`)**

| Capa | Archivo | Cambio |
|---|---|---|
| domain | `domain/repositories/pet.repository.ts` | `PetFieldChanges` + `lostMode?: boolean` |
| application | `application/dto/set-lost-mode.dto.ts` (+spec) | NUEVO — `SetLostModeSchema`/`SetLostModeDto` |
| application | `application/use-cases/set-lost-mode.use-case.ts` (+spec) | NUEVO — persistencia + auditoría |
| infrastructure | `infrastructure/pets.controller.ts` | handler `POST :petId/lost-mode` |
| — | `pets.module.ts` | provider `SetLostModeUseCase` |
| e2e | `test/pet-lost-mode.e2e-spec.ts` | NUEVO — R1–R4 |

**Móvil (`mobile-pet-tracker/src/`)**

| Archivo | Cambio |
|---|---|
| `api/pets.ts` | `setLostMode` + `SetLostModeState` |
| `api/types.ts` | union `myRole` corregido |
| `api/__tests__/pets.test.ts` | describes R5 |
| `app/(tabs)/map.tsx` | botón activo, label toggle, error; fuera `Coming soon` |
| `app/(tabs)/__tests__/map.test.tsx` | describes R6/R7 (sustituyen R10 stub) |

## Alternativas descartadas

- **Extender PATCH con `lostMode`**: mezcla estado operativo con ficha,
  toca el schema compartido de create/update y pierde la acción de
  auditoría distinguible (D2).
- **Par POST/DELETE `/lost-mode`**: dos handlers y dos ramas de test para
  un booleano; el body `{enabled}` es más simple y explícito.
- **Efectos en alerts/positions ahora**: ver D1 — spec propia futura.
- **Ocultar el botón a no-owners**: cambia el layout según rol y deja al
  usuario sin señal de que la función existe; disabled reutiliza el
  render actual del stub (D6).
- **react-query para la mutación**: una llamada con dos `useState` no
  justifica la dependencia (decisión D2 de #36 reafirmada).
- **Toggle de lectura previa (GET + negar en servidor, sin body)**: el
  servidor decidiría el sentido del cambio — dos taps rápidos podrían
  acabar en estado inesperado; con `{enabled}` la app declara la
  intención y repetirla es idempotente.
