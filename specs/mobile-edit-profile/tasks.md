---
feature: "mobile-edit-profile"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-edit-profile]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Rojo y verde van en
> **commits separados** (rojo primero, `test(mobile): ... (#194 Rn)`; verde
> después, `feat(mobile): ... (#194 Rn)`). Los candados de inventario que cada R
> mueve (ver §Deltas de candados en requirements) se editan en el commit rojo de
> ese R. El orden sugerido es el numérico: R4 deja un stub de pantalla para
> compilar y R5 lo reemplaza; R9 va tras R7 porque su caso 3 depende de que la
> caché la escriba R7.

## R1 — Catálogo con el copy de edición (es/en) y registro §2.N

- [ ] (1) Escribir test que falla para R1 (`language-provider.test.tsx`: fórmula `+ 2` y el `it` de las dos claves)
- [ ] (2) Implementación mínima que lo pasa (2 claves en `en` y `es`; §2.N en `specs/mobile-ui-language/design.md`)
- [ ] (3) Refactor con tests verdes

## R2 — `validateProfile` extraída de `validateRegister`

- [ ] (1) Escribir test que falla para R2 (`account-rules.test.ts`: `it.each` de reglas y `validateRegister conserva`)
- [ ] (2) Implementación mínima que lo pasa (`ProfileValues`, `validateProfile`; `validateRegister` la llama)
- [ ] (3) Refactor con tests verdes (los `it` de `#183 R2` intactos)

## R3 — `updateMe` y su resultado por `kind`

- [ ] (1) Escribir test que falla para R3 (`users.test.ts`: los siete casos)
- [ ] (2) Implementación mínima que lo pasa (`UpdateProfileInput`, `UpdateMeState`, `updateMe` con `patchJson`)
- [ ] (3) Refactor con tests verdes (los `it` de `getMe` intactos)

## R4 — Ruta `/edit-profile` protegida con cabecera nativa

- [ ] (1) Escribir test que falla para R4 (`detail-stack`, `layout` ×4 longitudes + última pantalla + fila de cabecera, `guard`, `navigation`)
- [ ] (2) Implementación mínima que lo pasa (`src/app/edit-profile.tsx`, stub `EditProfileScreen` que devuelve `null`, `Stack.Screen` al final del grupo protegido)
- [ ] (3) Refactor con tests verdes

## R5 — Pantalla con el formulario sembrado desde el perfil

- [ ] (1) Escribir test que falla para R5 (`edit-profile/index.test.tsx` casos 1 a 6; `R17_EDIT_PROFILE`, `SCREEN_FILES`, `screenSignOutCalls`, `edit-profile.test.ts` grep-clean y D2)
- [ ] (2) Implementación mínima que lo pasa (`EditProfileScreen`, `EditProfileForm`, cuatro campos, estados skeleton y no disponible)
- [ ] (3) Refactor con tests verdes

## R6 — Guardar valida y pinta el mensaje por campo

- [ ] (1) Escribir test que falla para R6 (casos 1 a 6; fila `editProfile.save`; `CTA_ROWS`, `radii`, recuentos de `chunky`; `consistency-classnames`)
- [ ] (2) Implementación mínima que lo pasa (`handleSubmit` solo con validación, `FieldErrorMessage` por campo, botón con receta #177)
- [ ] (3) Refactor con tests verdes

## R7 — Guardar envía solo lo cambiado y refresca la caché

- [ ] (1) Escribir test que falla para R7 (casos 1 a 7; `keeps` de `CTA_ROWS` con `isDisabled={submitting}`)
- [ ] (2) Implementación mínima que lo pasa (diff recortado, `updateMe`, `setQueryData`, `router.back()`, `submitting`)
- [ ] (3) Refactor con tests verdes

## R8 — Errores sin texto crudo y sin perder lo escrito

- [ ] (1) Escribir test que falla para R8 (casos 1 a 7; tres filas de copy; `screenSignOutCalls` `0 → 1`)
- [ ] (2) Implementación mínima que lo pasa (`FormError` `edit-profile-error`, `signOut` en 401, tres claves)
- [ ] (3) Refactor con tests verdes

## R9 — Fila «Editar perfil» en Perfil y tarjeta refrescada

- [ ] (1) Escribir test que falla para R9 (casos 1 a 3; `it.each` de `me-card` reescrito; fila `profile.editProfile`)
- [ ] (2) Implementación mínima que lo pasa (`Pressable` `edit-profile-link` en `me-card`, `router.push('/edit-profile' as Href)`)
- [ ] (3) Refactor con tests verdes

## R10 — Carta: A11 y enmienda #194

- [ ] (1) Escribir test que falla para R10 (`edit-profile.test.ts`: lista A11 en las dos docs, sección, literales, casillas `[ xX]`)
- [ ] (2) Implementación mínima que lo pasa (edición de `docs/ui-guidelines.md` y `docs/conventions.md`; las casillas quedan sin marcar)
- [ ] (3) Refactor con tests verdes

## R11 — Prueba de humo humana (dev build de Android)

- [ ] (1) Entregar al humano el guion de R11 en `progress/impl_mobile-edit-profile.md`
- [ ] (2) El humano corre el guion y marca la casilla de R11 en `requirements.md`
- [ ] (3) El leader registra el resultado antes de cerrar (no hay refactor; el requisito no tiene test)

## Cierre

- [ ] `./init.sh` verde, corrido por el leader (el reviewer no puede)
- [ ] Rojos y sondas anotados en `progress/impl_mobile-edit-profile.md` con su consulta
- [ ] `traceability.md` sin filas «pendiente»
- [ ] Casillas humanas: Aprobación, Enmienda #194 (R10), Enmienda A22 (R10) y Prueba de humo (R11)
