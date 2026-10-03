# Handoff a Codex CLI — #94, ronda 2

> Escrito por el `leader` el 2026-09-21. Sustituye a la version anterior de este
> fichero, que decia que H2 no se tocaba: el humano decidio cerrarlo dentro de
> esta feature y firmo la enmienda E2 en `38298cff`.
>
> Dos cosas en una pasada: corregir el bloqueante H1 y anadir R10.

```
Feature: mobile-map-staleness-single-source (#94), ronda 2
Branch: feature/94-mobile-map-staleness-single-source (punta: 38298cff)
Worktree: /home/claude/sites/Pet-Tracker-wt-ui

Lee, en este orden:
  1. progress/review_mobile-map-staleness-single-source.md — hallazgo H1
  2. specs/mobile-map-staleness-single-source/requirements.md §Enmienda E2 (R10)
  3. specs/mobile-map-staleness-single-source/tasks.md §Enmienda E2 — la tarea
     de R10 esta escrita ahi paso a paso; sigue esa, no improvises otra forma

Las dos enmiendas E1 y E2 estan firmadas por el humano, igual que el gate
original y las decisiones D1, D2 y D3. R5 NO se toca: esta firmado con su letra
exacta y tu implementacion la cumple.

## Trabajo 1 — H1 (BLOQUEANTE): devolver el helper compartido

Tu ronda 1 cambio sourceFiles() en
mobile-pet-tracker/src/__tests__/design-drift.test.ts:33-35 para excluir los
*.test.tsx colocados bajo src/. De ese helper cuelgan filesContaining() y
filesMatching(), y de esos los 14 describes preexistentes del fichero (C8,
R3 Card compartido, #87 R19 use-api, ...). El filtro los deja a TODOS sin mirar
los tests colocados: es cobertura ajena perdida en silencio, y design.md
declaraba que los describes existentes no se tocan.

El supuesto que lo justificaba es falso, medido dos veces (reviewer y leader):
con el helper viejo y los dos it de '#94 R5' en su sitio, design-drift.test.ts
da exit 0, 39 de 39 verdes. Hoy ningun test colocado declara STALE_SECONDS ni
compara staleSeconds.

  1. Revertir :33-35 a su forma de 7eb66357:

         return /\.tsx?$/.test(entry.name) ? [path] : [];

  2. Si quieres conservar la letra de R5 ("excluyendo __tests__/ y los *.test.*
     colocados"), dale a '#94 R5' SU PROPIA lista filtrada: un helper local
     junto a su describe, o un .filter() sobre el resultado de filesMatching.
     sourceFiles() no se altera.

  3. Corregir el punto 2 de "Supuestos de la spec que resultaron falsos" de
     progress/impl_mobile-map-staleness-single-source.md: el supuesto falso no
     era el de la spec, era el tuyo.

## Trabajo 2 — R10 (enmienda E2): el inventario de lecturas

El reviewer demostro que el candado de R5 se evade renombrando. Esta mutacion,
plantada en src/app/(tabs)/map.tsx junto a `const updated = ...` (:207), dejo
design-drift.test.ts en exit 0 con 39 passed:

    const positionAge = position?.staleSeconds ?? 0;
    const isFresh = positionAge <= 120;

R10 lo cierra con otra propiedad, no con un regex mas ancho: un inventario de
lecturas. Recuento exacto del identificador staleSeconds por fichero sobre
TODOS los fuentes de produccion, comparado con toEqual contra la tabla
declarada:

    { 'api/types.ts': 1, 'app/(tabs)/map.tsx': 1 }

Asi el alias sale rojo por recuento y una mudanza del umbral a otro fichero
sale roja por clave inesperada.

Dos condiciones que la tarea de E2 fija y que no son negociables:

  - R10 NO usa sourceFiles(). Reutiliza allTypeScriptFiles() (:39-49, sin
    tocar) con un .filter() local. Si te descubres editando sourceFiles(),
    PARA: eso es exactamente lo que provoco el rechazo de la ronda 1.
  - La prueba de fuego es la mutacion de arriba, en ese punto: tiene que poner
    la suite ROJA, y el reviewer la repetira tal cual. Plantala, observa el
    rojo, retirala — el mismo procedimiento que ya usaste en R5.

## Medicion, SIN pipe (el exit code de un pipe es el de tail)

    cd mobile-pet-tracker
    bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'
    bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/map.test.tsx' \
      'src/utils/device-connectivity.test.ts' \
      'src/__tests__/design-drift.test.ts' \
      'src/__tests__/ui-language.test.ts' 'src/__tests__/ui-copy-table.ts'
    bunx jest
    bunx tsc --noEmit

Baseline vigente, medido por el leader en la punta de la ronda 1 (5a5f7fd3):
5 suites, 136 tests, exit 0; design-drift.test.ts sola, 39. Tras R10 deben ser
137 y 40. El 3 suites / 94 tests que aparece en §Antes de empezar de tasks.md
es el de 914905b8 y ya no compara: ignoralo, lo vigente es esto.

Comprueba el numero de suites que imprime cada corrida: las rutas van entre
comillas porque (tabs) sin escapar se interpreta como regex y jest salta
ficheros en silencio con exit 0.

## Reglas que siguen vigentes

  - Commit por requisito, test rojo ANTES que su implementacion (C4). H1 y R10
    son trabajos distintos: no los metas en el mismo commit.
  - Actualiza specs/mobile-map-staleness-single-source/traceability.md con los
    hashes nuevos. NO rebasees: invalidarias los hashes ya registrados.
  - No toques ningun otro fichero. api/types.ts se NOMBRA en la tabla de R10
    pero no se edita: declararlo es leerlo, no tocarlo. El resto de ficheros de
    la feature #98 siguen prohibidos.
  - Cero dependencias nuevas, cero claves i18n nuevas.
  - NO ejecutes ./init.sh: LocalStack y Postgres son de la sesion que lleva #98.
  - H3 (renderMap pasa de await a return en map.test.tsx:238) queda como esta:
    es equivalente en conducta y solo estaba sin declarar.

Al terminar, actualiza progress/impl_mobile-map-staleness-single-source.md con
la ronda 2. No hagas merge ni abras PR: eso lo cierra el humano.
```
