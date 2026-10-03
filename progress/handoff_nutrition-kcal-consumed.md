# Handoff a Codex CLI — #104 `nutrition-kcal-consumed`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/104-nutrition-kcal-consumed. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: otra sesion (#95) tiene alli a otro
Codex trabajando ahora mismo.

Feature: nutrition-kcal-consumed (#104), branch: feature/104-nutrition-kcal-consumed
Spec aprobada por humano el 2026-09-23 (commit de firma 5b743931):
  specs/nutrition-kcal-consumed/requirements.md  (status: approved, R1-R4)
  specs/nutrition-kcal-consumed/design.md        (D1-D5, codigo literal de D2 y D3,
                                                  lista CERRADA de ficheros)
  specs/nutrition-kcal-consumed/tasks.md         (orden de commits: seguirlo tal cual)
  specs/nutrition-kcal-consumed/traceability.md  (actualizar tras CADA commit)
Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi.

== QUE ES ==

Backend puro. El GET /v1/pets/:petId/nutrition-plan gana un campo,
kcalConsumedToday: number = Math.round(merKcal * servedToday.length / mealsPerDay),
calculado en dominio (funcion pura kcalConsumed) y cableado en el use case y el
mapper. Cero migraciones, cero dependencias, cero variables de entorno, cero
metodos de puerto, cero ficheros de test nuevos.

== FICHEROS (lista cerrada; un diff fuera de ella es un hallazgo del reviewer) ==

  backend-pet-tracker/src/modules/nutrition/domain/entities/meal-serving.entity.ts
  backend-pet-tracker/src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts
  backend-pet-tracker/src/modules/nutrition/application/use-cases/get-nutrition-plan.use-case.ts
  backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts
  backend-pet-tracker/test/meals.e2e-spec.ts
  backend-pet-tracker/test/nutrition.e2e-spec.ts
  specs/nutrition-kcal-consumed/traceability.md
  progress/impl_nutrition-kcal-consumed.md   (lo creas tu)

== REGLAS CRITICAS ==

- Arquitectura de docs/architecture.md y convenciones de docs/conventions.md.
- Skills: NO cargues ninguna skill de expo; no hay ninguna para esto (es
  backend NestJS, no toca mobile-pet-tracker/). Di en el reporte que skills
  cargaste, aunque sea ninguna.
- TDD por requisito, en el orden de tasks.md §Orden:
    1. test(...) R1 rojo       2. feat(...) R1 verde
    3. test(...) R2 rojo (con los DOS deltas declarados de candados ajenos)
    4. test(...) R3 rojo       5. test(...) R4 rojo
    6. feat(...) (R2,R3,R4) verde
  UN COMMIT POR PASO, el test rojo SIEMPRE antes que su implementacion. Un
  commit con test + implementacion juntos incumple C4 de CHECKPOINTS.md (paso
  en #19). Los mensajes de commit, literales de tasks.md.
- Los valores esperados de los tests son LITERALES escritos a mano (tablas de
  requirements.md). Prohibido calcularlos con Math.round, con kcalConsumed o
  con constantes de produccion: el test pasaria aunque la formula estuviese mal.
- Los titulos de describe llevan el sufijo "(nutrition-kcal-consumed #104)",
  literales de requirements.md. Los ficheros ya tienen R-ids de #83 y #17.
- Solo se mueven DOS candados ajenos (requirements.md §Candados): la lista de
  claves de R9 de #83 y el toEqual de R24 de #17. Si otro test existente se
  pone rojo, la implementacion esta mal: no toques ese test, PARA y escribelo.
- Actualiza traceability.md tras cada commit.
- Sin anclas por numero de linea: localiza cada sitio con grep -n del texto
  citado en la spec.
- No crees recursos AWS reales ni corras cdk deploy.
- NO rebasees, NO mergees main, NO hagas push. Los hashes de traceability.md
  tienen que seguir existiendo cuando el reviewer los busque.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Son artefactos de
  cierre del leader y los escribe el DESPUES del veredicto del reviewer. Tu
  sitio para contarlo todo es progress/impl_nutrition-kcal-consumed.md.
- NO abras la PR ni la edites: la abre el leader al cerrar, con el veredicto
  en la mano.

== ENTORNO: ESTO CAMBIA tasks.md §0 Y §Cierre ==

Postgres y LocalStack son contenedores compartidos con la otra sesion. Este
worktree usa su propia base, pet_tracker_wt (DATABASE_URL del .env del
worktree), pero LocalStack (:4566) es comun. Dos ./init.sh a la vez dan e2e
rojos falsos.

- §0, linea base: NO corras ./init.sh. Ya la midio el leader con exit=0 sobre
  esta misma branch (el HEAD solo ha cambiado specs/, progress/ y
  feature_list.json desde entonces). Copia al impl estos numeros como linea base:
    backend unit: 170 suites, 1295 tests
    e2e: 27 suites passed + 3 skipped (30), 384 tests passed + 8 skipped
    movil: 77 suites, 1412 tests (no lo tocas)
  Ese init.sh paso meals.e2e-spec entero sobre pet_tracker_wt, asi que la
  tabla meal_servings existe: NO hace falta el psql de §0.
- Durante el trabajo y al cierre corre SOLO, desde backend-pet-tracker/:
    pnpm test
    pnpm exec tsc --noEmit
    pnpm lint
    pnpm test:e2e -- meals.e2e-spec
    pnpm test:e2e -- nutrition.e2e-spec
  Antes de cada pnpm test:e2e, `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`
  tiene que salir vacio; si no, espera y reintenta. Nunca en paralelo.
- NO corras ./init.sh completo ni `pnpm test:e2e` sin filtro. El init.sh
  completo lo corre el reviewer, coordinado por el leader con la otra sesion.
- Recuentos esperados al cierre: unit = 1295 + 3; en meals.e2e-spec, +5 tests
  (R2: 1, R3: 2, R4: 2); mismas suites en todo.
- Exit codes medidos SIN pipe (`cmd; echo "exit=$?"`, nunca `cmd | tail`).

Criterios de aceptacion: R1, R2, R3, R4 de requirements.md.
Al terminar: escribir el resultado en progress/impl_nutrition-kcal-consumed.md
(pwd y branch, skills cargadas, salida de cada rojo y cada verde, recuentos,
lista de commits con hash) y parar.
```
