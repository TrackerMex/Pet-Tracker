# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

- feature: #103 `meal-schedule-editing` (pending, sin spec)
- inicio: 2026-10-02, sesión Frontend, tree principal, branch `feature/103-meal-schedule-editing` desde `origin/main` 4e8d6cc3
- prioridad: el humano pide features largas de producto mientras #60 sigue aparcada esperando la cuenta Apple Developer (286c94bd)
- plan: tabla de escalado, «feature con decisiones de diseño abiertas», es decir, primero `explorer` (`progress/explore_meal-schedule-editing.md`, D4 de #83 pendiente), luego `spec_author` y gate en Notion. Después, mitad backend (endpoints para editar y añadir franjas en `nutrition`) y mitad móvil (`src/screens/meal-schedule/`), como #83/#98.
- 2026-10-02: Backend da turno («Libre»): nada en LocalStack ni en Postgres 5432. Aviso de CPU: Codex puede estar implementando #41 en `wt-backend` (solo `bunx jest` móvil, tsc y lint), así que un rojo por carga en la suite móvil hay que repetirlo antes de culpar al árbol. Hay un spec_author de #146 en `Pet-Tracker-wt-146`. Backend no toma #18. Lanzado el `./init.sh` de arranque, con log en el scratchpad (`init103/`).
- 2026-10-02: `./init.sh` de arranque sobre 4e8d6cc3 (04:41–04:46Z) termina con exit 0. Backend 171 suites / 1307 tests, infra 2 / 14, mobile 86 / 1634 (base para #103), e2e 27 suites (3 saltadas) y 399 tests (8 saltados).
- 2026-10-02: el explorer entrega `progress/explore_meal-schedule-editing.md` con 11 decisiones abiertas. El leader re-verificó contra 4e8d6cc3: `MEAL_TIMES_BY_COUNT`, `mealTimes` fuera del hash, `meal_servings` sin FK al plan y con unique (pet, servedOn, mealTime), el reader directo sobre `nutritionPlans`, `MEAL_TIME_PATTERN` laxo, el texto de la D4, `http.ts` sin `patchJson`, `ExpoDateTimePicker` en add-reminder y `patchJson` en el design de #41. Una ruta mal citada: el puerto de nutrición vive en `domain/repositories/nutrition.repository.ts`, no en `domain/ports/`. Las decisiones de producto (1, 2, 3 y 6) se le preguntan al humano; el resto va con la recomendación del explorer salvo objeción.
- 2026-10-02: **decisiones del humano** (respuestas explícitas por AskUserQuestion), numeradas como en el explore:
  - **1 Recalcular:** «Se conserva». El horario editado sobrevive al recálculo del plan mientras no cambie el número de comidas al día; si cambia, vuelve a los horarios por defecto. Sin migración, salvo que la spec demuestre que hace falta.
  - **2 Ya servida:** «Se mueve con ella». La servida de hoy (`ownerLocalDay`) pasa a la hora nueva en la misma transacción; los días pasados no se tocan.
  - **3 Borrar:** «No, solo editar y añadir». Hay que enmendar el criterio 1 de la entrada #103 («editada o borrada» queda en «editada»).
  - **6 Permisos:** «Solo el dueño». `@RequirePetRole('owner')`; el móvil oculta los controles por `myRole`.
- Resto con la recomendación del explorer, adoptada por el leader y cubierta por el gate de la spec:
  - (4) `mealsPerDay` = `mealTimes.length`, entre 1 y 6;
  - (5) contrato granular, POST para añadir y PATCH para mover;
  - (7) HH:MM estricto solo en los endpoints nuevos, duplicados con 422 y ordenado al escribir;
  - (8) nombres y porciones por comida fuera;
  - (10) mitad backend ahora como #103, y mitad móvil como **#147** `mobile-meal-schedule-editing` cuando mergee #41 (`patchJson`, catálogo 320);
  - (11) regla escrita para #18.
- Id #147 verificado como libre: el máximo es 146 en `origin/main` y en todas las branches remotas.
- 2026-10-02: Backend confirma la reserva de #147. #41 tiene spec firmada (f044fa79) y E1 (3a166fba) le permite implementar sobre main sin #60; el handoff a Codex está escrito y Codex todavía no termina. `patchJson` y el catálogo en 320 son de su spec, no de su código: al especificar #147, anclar en el merge real de #41 y no en esas cifras. Backend avisará cuando abra la PR de #41.
- 2026-10-02: Backend lanza `./init.sh` en `wt-backend` (gate de #41 antes del reviewer, unos 5 min). No correr `init.sh` ni e2e hasta su aviso de fin. El spec_author de #103 no corre nada.
- 2026-10-02: Backend terminó `./init.sh` (05:34Z, exit 0); LocalStack y Postgres libres. Su reviewer de #41 corre jest dirigido y mutaciones en `wt-backend`, así que un rojo raro en un `init.sh` nuestro puede ser carga de CPU.
- 2026-10-02: el spec_author entrega la spec de #103 (db279440): 13 requisitos R1-R13, sondas S1-S20 y tres decisiones de gate G1-G3. El leader la revisó y no encontró bloqueos. Espejada entera a Notion desde db279440: https://app.notion.com/p/3ed6115a9b27818e82a9c7b4973f8e73 (`Estado del gate` = En revisión, `Rol actual` = Spec Author). **Para hasta la firma**: Codex no arranca sin `Estado del gate` = Aprobado.
