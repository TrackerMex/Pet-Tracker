---
feature: "pet-lost-mode"
status: draft        # draft | approved
tags: [harness, spec, backend, mobile]
---

# Tareas — [[pet-lost-mode]]

> Disciplina TDD (CHECKPOINTS C4): cada requisito con commit rojo→verde
> explícito — el test rojo se commitea ANTES que la implementación que lo
> pasa. Ver [[requirements]] (R1–R9) y [[design]] (D1–D7). Parte móvil:
> cargar `expo-overview` antes de empezar (C8).

## R1 — Owner activa/desactiva y el perfil responde

- [ ] (1) Test rojo: `set-lost-mode.use-case.spec.ts` §R1 (persiste vía
      `pets.update` con `{ lostMode }`, audita `pet.lost_mode` con
      `meta.enabled`, devuelve el Pet) + e2e
      `test/pet-lost-mode.e2e-spec.ts` §R1 (owner POST `{enabled:true}` →
      200 `lostMode:true`; `{enabled:false}` → 200 `lostMode:false`;
      repetir el mismo valor → 200 igual)
- [ ] (2) Implementación mínima: `SetLostModeSchema`/DTO,
      `SetLostModeUseCase`, `lostMode?: boolean` en `PetFieldChanges`,
      handler `@Post(':petId/lost-mode')` + provider en `pets.module.ts`
      ([[design]] §D2/D4/D5)
- [ ] (3) Refactor con tests verdes

## R2 — Solo el owner (403/404/401 heredados del guard)

- [ ] (1) Test rojo: e2e §R2 — family 403, walker 403, no-miembro 404,
      sin token 401 (helpers locales patrón `pets.e2e-spec.ts`)
- [ ] (2) Implementación mínima: `@UseGuards(PetAccessGuard)` +
      `@RequirePetRole('owner')` en el handler (normalmente ya verde tras
      R1 — confirmar)
- [ ] (3) Refactor con tests verdes

## R3 — Validación del body y PATCH sin acceso a lostMode

- [ ] (1) Test rojo: `set-lost-mode.dto.spec.ts` §R3 (sin `enabled`,
      string, null, número → invalid; claves extra → strip) + e2e §R3
      (400 `Validation failed` sin persistir; PATCH con `lostMode` en el
      body lo ignora)
- [ ] (2) Implementación mínima (el schema de R1 debería cubrirlo —
      confirmar el caso PATCH)
- [ ] (3) Refactor con tests verdes

## R4 — GET detalle y lista reflejan el cambio

- [ ] (1) Test rojo: e2e §R4 (owner activa → family ve `true` en
      GET `/v1/pets/:petId` y `/v1/pets` → owner desactiva → `false`;
      claves del contrato intactas)
- [ ] (2) Implementación mínima (esperado ya verde: el mapper lee
      `pet.lostMode` — confirmar)
- [ ] (3) Refactor con tests verdes

## R5 — `setLostMode` en la API móvil

- [ ] (1) Test rojo: `src/api/__tests__/pets.test.ts` §R5 (ok 200,
      forbidden 403, unauthorized 401, error 500/body inválido,
      unreachable, missing-config)
- [ ] (2) Implementación mínima: `setLostMode` + `SetLostModeState` en
      `src/api/pets.ts` (patrón `createPet`)
- [ ] (3) Refactor con tests verdes

## R6 — Botón del Map activo para el owner

- [ ] (1) Test rojo: `map.test.tsx` §R6 — sustituir el describe
      `'R10: lost mode es stub deshabilitado'` por: label según
      `lostMode`, habilitado para owner, press llama al endpoint,
      disabled in-flight, refetch actualiza label, sin `Coming soon`
- [ ] (2) Implementación mínima: `map.tsx` (selectedPet derivado,
      onPress, busy) + union `myRole` en `types.ts` ([[design]] §D6)
- [ ] (3) Refactor con tests verdes

## R7 — No-owner deshabilitado + estado de error

- [ ] (1) Test rojo: `map.test.tsx` §R7 — `myRole: 'family'` → botón
      `accessibilityState.disabled`; fallo de `setLostMode` →
      `lost-mode-error` visible, botón re-habilitado, error se limpia al
      reintentar
- [ ] (2) Implementación mínima en `map.tsx`
- [ ] (3) Refactor con tests verdes

## R8 — Regresión y contención

- [ ] (1) Ejecutar `bun run typecheck`/`lint`/`test`
      (mobile-pet-tracker), `pnpm -C backend-pet-tracker run
      lint`/`test`/`test:e2e` (con `docker compose up -d`), `./init.sh`
      — todo exit 0
- [ ] (2) Verificar contención del diff contra la allowlist de
      [[requirements]] R8 + grep-clean C8; anotar en
      `progress/impl_pet-lost-mode.md`
- [ ] (3) Refactor final si algo quedó sucio

## R9 — Smoke humano en Expo Go (cierre humano)

- [ ] (1) Implementer: dejar los pasos del smoke listados en
      `progress/impl_pet-lost-mode.md` (son los 5 de [[requirements]] R9)
- [ ] (2) **HUMANO**: ejecutar el smoke, registrar resultado y marcar la
      casilla R9 de [[requirements]] §Aprobación — sin esto la feature NO
      pasa a `done`
