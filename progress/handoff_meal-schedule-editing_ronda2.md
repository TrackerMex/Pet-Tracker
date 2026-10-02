# Ronda 2 de Codex CLI — #103 meal-schedule-editing (B1 y B2 del reviewer)

> Pega el bloque de abajo en la MISMA sesión de Codex o en una nueva. El
> reviewer rechazó la ronda 1 sobre 90017ed4 por dos huecos de candado. La
> enmienda E3 de la spec dice cómo cerrarlos.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Ronda 2 de #103. Antes de nada, ejecuta `git branch --show-current`,
`git rev-parse HEAD` y `git log --oneline -4`, y pega las salidas en una
seccion nueva, `## Ronda 2`, al final de progress/impl_meal-schedule-editing.md.
- La branch debe ser feature/103-meal-schedule-editing.
- HEAD debe ser el commit de la enmienda E3 del leader. Llamalo H1.
- El padre de H1 debe ser 49ffac05, el merge de origin/main (#41) del
  leader, que a su vez desciende de 90017ed4.
Si algo no cuadra, PARA.

Lee primero, enteros:
- progress/review_meal-schedule-editing.md, §Bloqueantes B1 y B2;
- specs/meal-schedule-editing/requirements.md: cabecera E3, §R3 (unit `it` 1,
  candado de ronda 2, S23 y S24) y §R5 (e2e `it` 3, candado de ronda 2, S21
  y S22);
- specs/meal-schedule-editing/tasks.md, §Ronda 2 (E3): pasos (1) a (7).
El codigo de produccion es correcto. Solo se anaden dos candados sobre
codigo ya correcto, cada uno con su mutacion de produccion VERSIONADA en el
commit rojo y REVERTIDA en el verde, como en R11 y R12.

Commits literales, en este orden, test-primero:
  test(meal-schedule-editing): lock objective and warnings on edited copy (R3)
  feat(meal-schedule-editing): restore copyWithMealTimes after R3 lock (R3)
  test(meal-schedule-editing): lock serving move to the edited pet (R5)
  feat(meal-schedule-editing): restore pet filter on serving delete after R5 lock (R5)
  docs(meal-schedule-editing): fill #103 traceability round 2
El ultimo lleva traceability.md y progress/impl_meal-schedule-editing.md.

Rojos exigidos, todos por matcher:
  B1  unit R3 it 1 (toStrictEqual) con objective 'maintenance' + warnings []
  B2  e2e R5 it 3 en servingsOf(B), con el DELETE sin filtro petId
En el rojo de B2, un rojo por matcher en otro `it` se anota con su linea
decisiva y no para. Si cae cualquier rojo que no sea por matcher, PARA.
Cada verde revierte exactamente su mutacion. Comprueba que el diff del
fichero contra el padre del rojo sale vacio y pega la salida.

Sondas S21-S24: una a una sobre el arbol verde final, con el procedimiento
y el criterio E2 de tasks.md §Sondas (el «Exigido» es un minimo). Revierte
con `git checkout HEAD -- <fichero>` y comprueba que `git status --porcelain`
y `git diff --cached` salen vacios despues de cada una.

Lista cerrada, medida con `git diff --name-only <H1> HEAD`, NO desde H0:
  backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts
  backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts
  backend-pet-tracker/test/meal-times.e2e-spec.ts
  specs/meal-schedule-editing/traceability.md
  progress/impl_meal-schedule-editing.md
No toques nada de produccion fuera de las dos mutaciones. Las
observaciones N1-N6 del review no son de esta ronda.

Cifras finales: unit 174 / 1335, sin cambio; <e2e-mt> 23 tests; <e2e-nut>
2 / 45; tsc y lint con exit 0.

Siguen en vigor todas las reglas del handoff original,
progress/handoff_meal-schedule-editing.md: ENTORNO, DB pet_tracker, no
exportar DATABASE_URL, pgrep, medir sin pipe, restaurar las sondas.
- No rebasees ni enmiendes commits de la ronda 1: invalida los hashes.
- Sigue sin ser tuyo: ./init.sh, `pnpm test:e2e` entero, la PR y el push.
```
