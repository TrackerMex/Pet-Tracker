# Handoff a Codex CLI — #94, ronda 3 (merge de main)

> Escrito por el `leader` el 2026-09-21. #94 esta cerrada y firmada; lo unico
> que queda es integrar `main`, que avanzo con el merge de #98 mientras
> revisabamos. El PR #143 esta CONFLICTING y por eso no corre ningun check.

```
Feature: mobile-map-staleness-single-source (#94), ronda 3
Branch: feature/94-mobile-map-staleness-single-source (punta: 3a4a06a6)
Worktree: /home/claude/sites/Pet-Tracker-wt-ui

Tarea unica: integrar origin/main en la rama y dejar el PR #143 mergeable.

MERGE, NO REBASE. specs/mobile-map-staleness-single-source/traceability.md
registra hashes de commits de esta rama; un rebase los reescribe y la
trazabilidad deja de apuntar a commits que son ancestros de la punta.

    git fetch origin
    git merge origin/main

Base comun: 914905b8. Los seis ficheros que ambas ramas tocan, y como se
resuelve cada uno:

1. mobile-pet-tracker/src/__tests__/ui-copy-table.ts
   main (#98) anade 5 filas; #94 (enmienda E1) quita 3 filas de R4_MAP
   (map.live, map.stale, map.noSignal), sustituye map.gps por
   pairing.connection y anade 4 filas de src/utils/device-connectivity.ts al
   final de R10_PAIRING. Los dos deltas son en bloques distintos: se conservan
   LOS DOS.

2. mobile-pet-tracker/src/__tests__/ui-language.test.ts
   Cifras que deben quedar tras el merge:
     - R4_MAP: 17   (main sigue en 20 porque #98 no lo toco; el 17 es de E1)
     - R10_PAIRING: 42 + 2 + 1 + 4  con su comentario de E1
     - los recuentos que #98 cambio (R3_HOME, R6_FOOD, y los demas) se
       conservan tal como vienen de main
     - SCREEN_FILES sigue en 19 + 2 + 1 en los dos lados: no se toca
   El titulo del it de R4_MAP dice "resuelve las 17 ocurrencias normativas".

3. mobile-pet-tracker/src/__tests__/design-drift.test.ts
   main anade su describe de #98; #94 anade el describe '#94 R10' y, sobre
   todo, DEVUELVE sourceFiles() a su forma sin filtro:

       return /\.tsx?$/.test(entry.name) ? [path] : [];

   Esa reversion es el hallazgo H1 del reviewer y NO se puede perder en el
   merge. Comprueba el fichero despues de resolver. R10 usa
   allTypeScriptFiles(), no sourceFiles(): si acabas editando sourceFiles(),
   algo salio mal.

4. mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
   main anade una sola linea: mealsToday: null en la fixture de PetProfile.
   #94 reescribe la suite del badge. Se conservan los dos: la fixture de #94
   necesita tambien ese campo.

5. feature_list.json — #98 y #94 quedan las dos en "done".

6. progress/history.md — las dos bitacoras se conservan, la de #98 y la de #94.
   Si el recuento final de features "done" difiere entre las dos entradas, la
   buena es la mas alta: cuentalo sobre el feature_list.json ya resuelto.

Verificacion despues de resolver, SIN pipe (el exit code de un pipe es el de
tail), desde mobile-pet-tracker/:

    bunx jest
    bunx tsc --noEmit

Esperado: verde. Antes del merge, en la punta de #94, eran 77 suites / 1367
tests; con lo que #98 trae seran mas — lo que importa es que no haya ningun
rojo y que ninguna cifra de candado quede a medias entre las dos features.

Si una cifra de candado no cuadra tras el merge, NO la ajustes a ojo para
poner verde: para y reporta que cifra, de que feature venia cada lado y que
valor crees que corresponde.

No toques codigo de produccion: ningun fichero de produccion esta en conflicto.
No rebasees. No hagas merge del PR ni lo cierres: eso lo hace el humano.

Al terminar, anota la ronda 3 en
progress/impl_mobile-map-staleness-single-source.md: como quedo cada uno de los
seis ficheros y el resultado de las dos ordenes de verificacion.
```
