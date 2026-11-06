---
feature: "mobile-orbit-splash-icono"
status: draft        # draft | approved
tags: [mobile, ui, mascota, orbit, assets, icono, splash, spec]
---

# Trazabilidad — [[mobile-orbit-splash-icono]] (#244)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/__tests__/orbit-brand-assets.test.ts::#244 R1: cada PNG de marca tiene el sha256 del arte de Orbit` (ocho filas, rojo en C1a) y `::#244 R1: logo-glow.png no cambia` (nace verde; M15) | pendiente |
| R2 | `src/__tests__/orbit-brand-assets.test.ts::#244 R2: ningún fichero de assets conserva el arte del robot` y `::#244 R2: el fichero retirado ya no existe` (cinco filas) | pendiente |
| R3 | `src/__tests__/orbit-brand-assets.test.ts::#244 R3: las fuentes PNG están congeladas` y `::#244 R3: el script de conversión es el de la spec` (nacen verdes; M12, M13) | pendiente |
| R4 | salida de `specs/mobile-orbit-splash-icono/convert-orbit-icons.py` (exit 0, ocho filas `ok`); huella en R1 | pendiente |
| R5 | `app.assets.test.ts::#244 R5: toda la mascota del splash cabe en el círculo de radio 338` (sustituye a `la punta del pin es transparente`) y `::#244 R5: la mascota de android-icon-foreground.png y de android-icon-monochrome.png cabe en el círculo de radio 338` (la fila del monocromo nace verde) | pendiente |
| R6 | `app.assets.test.ts::#244 R6: icon.png y favicon.png no tienen ni un píxel con alfa menor que 255` (nace verde; M5) | pendiente |
| R7 | `app.assets.test.ts::#244 R7: el monocromo y la notificación 96 solo tienen píxeles blancos`, `::#244 R7: las dos notificaciones dejan 4 px de margen` y `::#244 R7: la notificación en color conserva su color` (nacen verdes; M6, M7, M8) | pendiente |
| R8 | `src/__tests__/orbit-brand-assets.test.ts::#244 R8: icon.json compone solo a Orbit sobre el violeta de marca` y `::#244 R8: expo.icon/Assets contiene solo orbit.png` | pendiente |
| R9 | suites de tasks.md §Verde de la cadena y guarda de `mobile-pet-tracker` (tres rutas) de §Guardas finales (sin test de jest propio) | pendiente |
| R10 | `src/__tests__/orbit-brand-assets.test.ts::#244 R10: la carta lleva la Enmienda #244 una sola vez, con la marca de Orbit` (C4 y C5, tras la firma G4 del humano) | pendiente |
| R11 | guarda de `assets/` de tasks.md §Guardas finales (trece rutas; sin test de jest) | pendiente |

Tanda del 2026-11-06 detenida antes del commit C2 por la guarda de lint (exit 1;
log de 12 bytes, solo la invocación que imprime Bun). Commits TDD disponibles:
`91b91fd7` — `test(mobile): R1 R2 R3 R8 red, Orbit brand art locked by content (#244)`;
`1abb6782` — `test(mobile): R5 R6 R7 red, safe circle and brand pixels (#244)`.
Las filas siguen pendientes de cierre: 41 tests verdes sobre C2 en el worktree y
typecheck exit 0 no sustituyen la guarda fallida, las mutaciones ni las guardas finales.
Detalle y ocho hashes medidos en `progress/impl_mobile-orbit-splash-icono.md`.
C4 y C5 no se ejecutaron.

Regla: el reviewer no aprueba si alguna fila de R1 a R9 y R11 queda sin cerrar. R10 queda
condicionada a la casilla G4 de [[requirements]] §Aprobación; sin ella, la feature
sigue `spec_ready` tras C3. Los gates G3 (rebuild) y G2 (smoke) son del humano y no se
marcan aquí.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras C2 y C5 en commits de documentación; el reviewer
la valida al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
