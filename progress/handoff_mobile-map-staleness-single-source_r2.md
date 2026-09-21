# Handoff a Codex CLI — #94, ronda 2 (correccion del rechazo)

> Escrito por el `leader` el 2026-09-21 tras el veredicto RECHAZADO de
> `progress/review_mobile-map-staleness-single-source.md`.
> Un solo hallazgo bloqueante, una sola edicion. El resto del trabajo esta
> verificado y no se toca.

```
Feature: mobile-map-staleness-single-source (#94), ronda 2
Branch: feature/94-mobile-map-staleness-single-source (punta: c558fca0)
Worktree: /home/claude/sites/Pet-Tracker-wt-ui

Lee primero: progress/review_mobile-map-staleness-single-source.md (hallazgo H1).

Que paso. Tu implementacion cambio el helper compartido sourceFiles() de
mobile-pet-tracker/src/__tests__/design-drift.test.ts:33-35 para excluir los
ficheros *.test.tsx colocados bajo src/. De ese helper cuelgan filesContaining()
y filesMatching(), y de esos los 14 describes preexistentes del fichero (C8,
R3 Card compartido, #87 R19 use-api, etc.). El filtro no solo afecta a tu
describe '#94 R5': deja a TODOS esos candados sin mirar los tests colocados
(src/utils/*.test.ts, src/hooks/*.test.tsx, src/screens/**/index.test.tsx).
Eso es cobertura ajena perdida en silencio, y design.md declaraba para ese
fichero "los describes existentes no se tocan": cambiar la entrada del helper
los toca aunque su texto no cambie.

El supuesto del punto 2 de tu progress/impl_mobile-map-staleness-single-source.md
("hubo que anadir el filtro antes de evaluar el umbral") es falso, medido dos
veces —por el reviewer y por el leader— restaurando el helper a su forma vieja
y dejando los dos it de '#94 R5' en su sitio:

  cd mobile-pet-tracker
  bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'
  -> exit 0, 39 passed, 39 total, con '#94 R5' verde

Hoy ningun test colocado declara STALE_SECONDS ni compara staleSeconds, asi que
el filtro no hacia falta para cerrar R5.

Que tienes que hacer, y nada mas:

  1. Revertir mobile-pet-tracker/src/__tests__/design-drift.test.ts:33-35 a su
     forma de 7eb66357:

         return /\.tsx?$/.test(entry.name) ? [path] : [];

  2. Si quieres conservar la letra de R5 ("excluyendo __tests__/ y los *.test.*
     colocados"), dale a '#94 R5' SU PROPIA lista filtrada: un helper local
     junto a su describe (:488), o un .filter() sobre el resultado de
     filesMatching. sourceFiles() no se altera.

  3. Corregir el punto 2 de la seccion "Supuestos de la spec que resultaron
     falsos" de progress/impl_mobile-map-staleness-single-source.md: el supuesto
     falso no era el de la spec, era el tuyo.

  4. Volver a medir, SIN pipe (el exit code de un pipe es el de tail):
       bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts'
       bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/map.test.tsx' \
         'src/utils/device-connectivity.test.ts' \
         'src/__tests__/design-drift.test.ts' \
         'src/__tests__/ui-language.test.ts' 'src/__tests__/ui-copy-table.ts'
       bunx jest
       bunx tsc --noEmit
     Comprueba el numero de suites que imprime cada corrida: las rutas van
     entre comillas porque (tabs) sin escapar se interpreta como regex y jest
     salta ficheros en silencio con exit 0.

Reglas que siguen vigentes:
  - Commit propio para esta correccion, con su R-id (R5) en el mensaje.
  - Actualiza specs/mobile-map-staleness-single-source/traceability.md con el
    hash nuevo. NO rebasees: invalidarias los hashes ya registrados.
  - No toques ningun otro fichero. Los de la feature #98 siguen prohibidos.
  - Cero dependencias nuevas, cero claves i18n nuevas.
  - NO ejecutes ./init.sh: LocalStack y Postgres son de la sesion que lleva #98.

No hagas merge ni abras PR: eso lo cierra el humano.

Dos apuntes que NO tienes que arreglar, anotados para que no los toques:
  - H2: el candado de comparacion de R5 se evade renombrando staleSeconds a un
    alias local. Cumple la letra de R5 tal como la firmo el humano; endurecerlo
    seria cambiar un requisito aprobado. Lo decide el leader aparte.
  - H3: renderMap() de map.test.tsx:238 pasa de await a return. Equivalente en
    conducta; queda anotado en el delta, no se revierte.
```
