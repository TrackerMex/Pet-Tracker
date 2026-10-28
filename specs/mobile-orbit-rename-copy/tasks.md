---
feature: "mobile-orbit-rename-copy"
status: approved
tags: [harness, spec]
---

# Tareas — [[mobile-orbit-rename-copy]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]].
> Rutas relativas a `mobile-pet-tracker/`. Desde `mobile-pet-tracker/`:
> `bun run typecheck`, `bun run lint`, `bun run test`.
> Orden de ejecución (E1): primero la cadena de Codex (R1 a R3), luego el commit de R4 (humano, gate G4) antes de la PR.
> Commits test-primero (C4 de `CHECKPOINTS.md`): el historial debe mostrar rojo y luego verde.

## Gate G4 — R4 (leader prepara el parche, humano commitea tras la cadena de Codex y antes de la PR)

- [x] (1) Test rojo: crear `src/__tests__/orbit-charter-voice.test.ts` con `#221 R4: la carta nombra a Orbit en el punto 7` (rojo contra la carta actual).
- [x] (2) Aplicar el bloque literal de [[requirements]] R4 a `docs/ui-guidelines.md` y las tres enmiendas T1, T2 y T3. Verde.
- [x] (3) El humano marca `- [x] Enmienda de la carta (punto 7) aprobada por humano (fecha: ...)` y commitea con `git commit --only` sobre las cinco rutas de R4. Mensaje: `docs(ui): Orbit voice in charter point 7 (R4)`.
- Ancla: `grep -c '^## Enmienda' docs/ui-guidelines.md` = 30 antes y después.
- Ancla: `grep -cF "**7. Voz de Orbit: guardián sereno.**" docs/ui-guidelines.md` = 1 (antes 0).
- Ancla: `grep -cF "**7. Voz de Pingo" docs/ui-guidelines.md` = 0 (antes 1).

## R1 — el saludo dice Orbit en es y en

- [x] (1) Test rojo: en `src/screens/welcome/index.test.tsx` enmendar los 7 literales de los 4 `it` (títulos intactos) y crear `src/__tests__/orbit-rename-copy.test.ts` con `#221 R1: el catálogo dice Orbit`. Commit: `test(welcome): greeting says Orbit (R1)`.
- [x] (2) Cambiar los dos valores en `src/i18n/catalog.ts`. Commit: `feat(i18n): rename greeting to Orbit (R1)`.
- [x] (3) Refactor con tests verdes (no hay nada que refactorizar; confirmarlo).
- Ancla: `grep -cF "Hola, soy Orbit." src/i18n/catalog.ts` = 1; `grep -cF "Orbit" src/i18n/catalog.ts` = 2.
- Mutación: M1a, M1b.

## R2 — ninguna cadena visible nombra a Pingo

- [x] (1) Test rojo: añadir a `orbit-rename-copy.test.ts` los dos `it` de `#221 R2` (rojos antes de R1). Va en el mismo commit de test de R1.
- [x] (2) Verde con el commit de R1; ningún cambio de producción adicional.
- [x] (3) Refactor con tests verdes.
- Mutación: M2a, M2b, M2c.

## R3 — identificadores pingo-* intactos

- [x] (1) Test (nace verde): añadir `#221 R3` al fichero de R1; documentar en `progress/impl_mobile-orbit-rename-copy.md` que nace verde por diseño.
- [x] (2) Sin producción. Comprobar `git diff <H0>..HEAD --stat`: no aparecen `ui-copy-table.ts` ni `ui-language.test.ts`.
- [x] (3) Refactor con tests verdes.
- Mutación: M3a, M3b, M3c.

## Cierre

- [x] `bun run typecheck`, `bun run lint` y `bun run test` verdes sin pipe (el código de salida es el de `bun`, no de `tail`).
- [x] Rellenar [[traceability]] con hash y mensaje de cada commit.
- [x] `progress/impl_mobile-orbit-rename-copy.md`: tabla de mutaciones M1a..M4d con rojo observado y revertido.
- [ ] Smoke de la bienvenida en el lote `progress/smoke_ui.md` (humano, G2).
