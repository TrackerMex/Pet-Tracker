# Handoff a Codex CLI — #113 `mobile-kcal-consumed-bar`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA: trabaja AQUI y solo aqui
Antes de tocar nada, confirma en el reporte: `pwd` y `git branch --show-current`.
Tienen que dar /home/claude/sites/Pet-Tracker-wt-backend y
feature/113-mobile-kcal-consumed-bar. Si no, PARA.
NO toques /home/claude/sites/Pet-Tracker: es el worktree de otra sesion.

Feature: mobile-kcal-consumed-bar (#113), branch: feature/113-mobile-kcal-consumed-bar
Spec aprobada por humano el 2026-09-23 (commit de firma e4a4841e):
  specs/mobile-kcal-consumed-bar/requirements.md  (status: approved, R1-R6; R6 es del humano)
  specs/mobile-kcal-consumed-bar/design.md        (D1-D7, arnes de test en §3,
                                                   lista CERRADA de ficheros en §4,
                                                   comandos en §6)
  specs/mobile-kcal-consumed-bar/tasks.md         (orden de commits: seguirlo tal cual)
  specs/mobile-kcal-consumed-bar/traceability.md  (actualizar tras CADA commit)
Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi.

== QUE ES ==

Solo movil (mobile-pet-tracker/). La tarjeta "Objetivo diario" de
src/app/(tabs)/food.tsx gana, debajo de su fila actual, una barra con las kcal
servidas hoy contra merKcal: "{kcalConsumedToday} kcal" a la izquierda,
"{pct}%" a la derecha y un relleno que anima su ancho en 250 ms. El dato ya
llega del backend (#104, mergeada): el tipo NutritionPlan gana
kcalConsumedToday: number. Una clave de catalogo nueva
(food.kcalConsumedOfTarget) como nombre accesible de un unico progressbar.
Cero dependencias, cero tokens nuevos, cero llamadas HTTP nuevas, cero
backend.

== BASE: #95 YA ESTA EN MAIN ==

La branch ya esta rebasada sobre origin/main a833f153, que contiene #95.
Compruebalo con `git merge-base --is-ancestor a833f153 HEAD; echo "exit=$?"`
(tiene que dar 0). Con eso, el paso de tasks.md "Antes de empezar" que manda
parar si #95 no esta en la branch queda cumplido: NO pares por eso.

Consecuencia para los candados que se mueven (requirements.md §Candados):
estas en la variante "con #95". Aun asi, MIDELOS tu al arrancar y escribe en
el reporte la suma tal como este:
  - language-provider.test.tsx, expect(englishKeys).toHaveLength(: hoy termina
    en "+ 4 - 6" (303). Tu delta: " + 1" al final (304) y
    " + 1 de #113 R3 (food.kcalConsumedOfTarget)" al final del comentario que
    empieza por "// 259 en".
  - ui-language.test.ts, expect(R6_FOOD).toHaveLength(: hoy
    "35 + 3 + 1 - 2" con comentario "// +1 #95 R4, -2 #95 R5" y titulo
    'resuelve las 37 ocurrencias normativas'. Tu delta: " + 1" en la suma,
    "+1 #113 R3" detras del comentario existente, y el titulo pasa a 38.

== FICHEROS (lista cerrada de design.md §4; un diff fuera de ella es un hallazgo del reviewer) ==

  mobile-pet-tracker/src/api/types.ts
  mobile-pet-tracker/src/app/(tabs)/food.tsx
  mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
  mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
  mobile-pet-tracker/src/screens/home/index.test.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  specs/mobile-ui-language/design.md   (UNA fila en §2.6, nada mas)
  specs/mobile-kcal-consumed-bar/traceability.md
  progress/impl_mobile-kcal-consumed-bar.md   (lo creas tu)

== SKILLS ==

- Carga `building-native-ui`: es la unica de tus 13 skills de expo que aplica.
- NO tienes skill de animacion. Toda la guia de movimiento (withTiming,
  duracion, curva, reduce motion, .get()/.set() por React Compiler, por que
  width y no scaleX) esta escrita en design.md §1 y D3: siguela literal.
- No cargues ninguna otra skill de expo. Di en el reporte que skills cargaste.
- La carta de UI es docs/ui-guidelines.md (gate C8 del reviewer).

== REGLAS CRITICAS ==

- TDD por requisito, en el orden de tasks.md: R1, R2, R3, R4, R5. UN COMMIT
  POR PASO, el test rojo SIEMPRE antes que su implementacion; mensajes
  literales de tasks.md:
    1. test(kcal-bar) ... (R1) rojo      2. feat(kcal-bar) ... (R1) verde
    3. test(kcal-bar) ... (R2) rojo      4. feat(kcal-bar) ... (R2) verde
    5. test(kcal-bar) ... (R3) rojo      6. feat(kcal-bar) ... (R3) verde
    7. test(kcal-bar) ... (R4) rojo      8. feat(kcal-bar) ... (R4) verde
    9. test(kcal-bar) ... (R5) rojo     10. feat(kcal-bar) ... (R5) verde
  Un commit con test + implementacion juntos incumple C4 de CHECKPOINTS.md.
  Los deltas de candados ajenos van en el commit que dice tasks.md (casi
  todos en el rojo; la fila de ui-copy-table.ts y la de la tabla de idioma,
  en el verde de R3, porque en el rojo no compilarian).
- Valores esperados LITERALES, escritos a mano (tablas de requirements.md y
  tasks.md). Prohibido importar TABULAR_NUMS o KCAL_BAR_TIMING en el test,
  calcular con Math.round o derivar de constantes de produccion: el test
  pasaria aunque el codigo estuviese mal. KCAL_BAR_TIMING NO se exporta.
- Doble de Reanimated en food.test.tsx: segun la INTENCION de design.md §3
  (requireActual + __esModule + exactamente withTiming/withRepeat/withSequence).
  No lo copies de otra suite. Tras escribirlo, corre food.test.tsx ENTERO.
- Los titulos de describe llevan el prefijo "#113 R<n>:" y el sufijo
  "(mobile-kcal-consumed-bar #113)", literales de requirements.md.
- En produccion (food.tsx, types.ts, catalog.ts) ningun comentario cita "#113"
  salvo como "#113 R<n>": el guard de hex de design-drift.test.ts lo lee como
  un color. Lo mas simple: sin comentarios.
- Solo se mueven los candados ajenos de requirements.md §Candados. Si otro
  test existente se pone rojo, la implementacion esta mal: no toques ese
  test, PARA y escribelo en el reporte.
- Haz las sondas de cada "(3) Refactor + sondas" de tasks.md y deja su rojo
  en el reporte; restaura cada una con `git diff` vacio. No se commitean.
- Actualiza traceability.md tras cada commit.
- Sin anclas por numero de linea: localiza cada sitio con grep -n del texto
  citado en la spec.
- bun para todo en movil (bunx, bun run); nunca npx ni npm. Cero dependencias.
- Rutas con (tabs) en jest SIEMPRE con --runTestsByPath: en posicional son
  regex y jest salta el fichero con exit 0. Comprueba que el numero de suites
  impreso es el de ficheros pedidos.
- NO rebasees, NO mergees main, NO hagas push. Los hashes de traceability.md
  tienen que seguir existiendo cuando el reviewer los busque.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Son artefactos de
  cierre del leader. Tu sitio para contarlo todo es
  progress/impl_mobile-kcal-consumed-bar.md.
- NO abras la PR ni la edites. NO marques la casilla de R6: es del humano.

== ENTORNO ==

- NO corras ./init.sh. Postgres y LocalStack son compartidos con otra sesion
  y esta feature no los necesita. La linea base la midio el leader con
  ./init.sh exit=0 en esta misma branch (e4a4841e, que sobre main solo
  cambia specs/); copiala al reporte:
    movil: 80 suites, 1426 tests (la que te importa)
    backend unit: 170 suites, 1298 tests; infra: 2 suites, 14 tests
    e2e: 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped
    lint (backend, infra, movil) y typecheck verdes
- Mide tu la base de food.test.tsx y las dos sumas de candados (tasks.md
  "Antes de empezar").
- Verificacion: SOLO los comandos de design.md §6, desde mobile-pet-tracker/,
  sin pipe (`cmd; echo "exit=$?"`, nunca `cmd | tail`). Incluye el
  `rm -f .expo/types/router.d.ts` del principio.
- Recuentos esperados al cierre: mismas suites moviles que la base (no hay
  ficheros de test nuevos) y +15 tests (R1: 1; R2: 1 + 7 + 1; R3: 2 + 1;
  R4: 1; R5: 1). Backend: sin cambios.

Criterios de aceptacion: R1-R5 de requirements.md (R6 lo firma el humano).
Al terminar: escribir el resultado en progress/impl_mobile-kcal-consumed-bar.md
(pwd y branch, skills cargadas, bases medidas, deltas aplicados con la suma
final escrita, salida de cada rojo y cada verde, sondas, recuentos, grep-clean,
lista de commits con hash) y parar.
```
