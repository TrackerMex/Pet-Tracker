# Handoff a Codex CLI: #180 mobile-alert-detail-canvas-fidelity (corrección E4)

Worktree: /home/claude/sites/Pet-Tracker-wt-180
Antes de tocar nada, confirma en tu reporte: `pwd` (debe dar /home/claude/sites/Pet-Tracker-wt-180) y `git branch --show-current` (debe dar feature/180-mobile-alert-detail-canvas-fidelity). Si no coincide, PARA.

Feature: mobile-alert-detail-canvas-fidelity (#180). Branch: feature/180-mobile-alert-detail-canvas-fidelity.
Spec aprobada: specs/mobile-alert-detail-canvas-fidelity/requirements.md (status: approved). Firmas: base 6f2b8403, E1 42222344, E2 e0386f87, E3 49b607c1, E4 b55e797b.
Lee también: specs/mobile-alert-detail-canvas-fidelity/tasks.md (sección R2 y tabla de sondas), traceability.md, y docs/ui-guidelines.md (rige la UI móvil).

## Reanudación tras E4 (leer antes que lo demás)

Este handoff corrige el veredicto RECHAZADO del reviewer sobre R1–R13 (`progress/review_mobile-alert-detail-canvas-fidelity.md`, bloqueantes B1 y B2). Sustituye al handoff anterior, cuyas reanudaciones E2 y E3 ya están aplicadas.

- Comprueba que el log del HEAD incluye `docs(spec): firma la enmienda E4 de #180 desde Notion` (b55e797b). Si no está, PARA.
- H0 = a2524267. Es el HEAD al reanudar. No cuenta el commit que añade este handoff. Regístralo en tu reporte.
- No reimplementes nada. R1–R13 quedan como están. Solo cambian R2.3 (E4.2) y la sonda S31 (E4.6).
- R2.3 pasa de cuatro a seis casos en el `it.each`: {con zona, sin zona, sin posición} × {con error de ack, sin error}. «Sin zona» = posición sin `geofenceId`. «Sin posición» = payload `{}`. El mapa aparece siempre que hay posición (E4.2, opción a). Sin posición no hay nodo de mapa: el orden se asevera sin él, y el resto no cambia. La píldora de distancia sigue solo con zona (R5).
- B1 (E4.1): R13.1 queda fuera de C4 puntos 2 y 5. No hagas commit rojo para R13.1 ni lo repitas. Su evidencia de S15 ya está en el reporte original.
- Medidas: M19 y M25 tienen objetivo 4 (E4.3) y ya están medidas como 4 y 4 en el reporte original. No cambian con esta corrección. Si el paso de cuatro a seis casos cambia el conteo de tests de alguna medida M1–M25, recalcúlala sobre H0 y repórtala como delta. No la trates como desviación.

## Commits (test primero, en este orden)

1. **Rojo**: `test(mobile): #180 R2.3 rojo — seis casos del mapa y S31`.
   - En `mobile-pet-tracker/src/screens/alert-detail/index.test.tsx`: el `it.each` de R2.3 pasa a seis casos. Cada nombre lleva `#180 R2.3`.
   - En `mobile-pet-tracker/src/screens/alert-detail/index.tsx`: planta S31. La guarda `{position ? <HomeEntrance` pasa a `{position && alert.geofenceId !== null ? <HomeEntrance`. Solo esa línea.
   - Debe quedar en rojo: los dos casos «sin zona» y el test `#170 R11` del mismo fichero (describe «#170 R11: sin geofenceId pinta el mapa sin zona»). Anota en el reporte qué casos fallan exactamente. Si ninguno falla, PARA y reporta: el candado es ciego.
2. **Verde**: `fix(mobile): #180 R2.3 revierte S31 — mapa con posición aunque no haya zona`.
   - Revierte la guarda a `{position ? <HomeEntrance` (el texto de H0). No toques otra línea de producción.
   - Todos los casos de R2.3 y `#170 R11` quedan en verde.
3. **Final**: UN commit `docs(mobile): #180 corrección E4 con hashes e informe`, con:
   - `specs/mobile-alert-detail-canvas-fidelity/traceability.md`: en la fila R2, sustituye «rojo y verde pendientes, hashes en el commit final» por los hashes de los commits 1 y 2. No toques la fila R13.
   - `progress/impl_mobile-alert-detail-canvas-fidelity.md`: añade la sección «Corrección E4». No borres las anteriores. Incluye H0, los dos commits, los casos que fallaron en rojo, las medidas, y las skills cargadas.

Commitea siempre con `git commit --only <rutas> -m ...` para no arrastrar ficheros ajenos. Los commits 1 y 2 solo llevan los dos ficheros de código y test. Nada de progress/ ni de specs/ en esos commits.

## Skills

Ninguna skill del catálogo de Codex encaja con esta corrección (cambia un `it.each` y una guarda de render). No cargues ninguna skill de expo: no hay ninguna para esto. Di en el reporte que no cargaste ninguna.

## Comandos

- Cada cadena empieza con `cd /home/claude/sites/Pet-Tracker-wt-180/mobile-pet-tracker && …` (cd explícito).
- Jest: `bunx jest src/screens/alert-detail/index.test.tsx --testTimeout=30000`. Tras el verde, también `bunx jest src/app/__tests__/alert-detail.navigation.test.tsx --testTimeout=30000`: tiene que quedar en verde (E4.4).
- Antes de correr jest, `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` deben salir vacíos.
- Si un fichero no termina tras el resumen, añade `--forceExit`, sin tocar aserciones ni timeouts, y repórtalo como desviación.
- Tras el verde: `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit`. Si el fichero existe, PARA. Nunca `rm -f`.
- Tras el verde: `bunx expo lint --no-cache > /tmp/e4-lint.txt 2>&1 && test ! -s /tmp/e4-lint.txt`. Con el árbol limpio, expo lint no imprime nada. Si imprime `Failed to run` (SIGKILL por OOM), sale con código 0 igualmente: cuenta como fallo. Reintenta la cadena entera, como mucho tres veces, tras `pgrep -af '[i]nit\.sh'` vacío. A la tercera, PARA.
- Solo `bunx`. No `pnpm`, `npx`, `npm` ni `bun add`. Sin dependencias nuevas.
- NO ejecutes `./init.sh`. Lo corre el leader o el reviewer con permiso del humano.

## Tests

- RNTL 14: `await` en fireEvent, render y act.
- Espera a la misma observación que aserta cada caso (docs/conventions.md §«Esperas sobre el árbol renderizado»). No esperes a la caché de Query ni al contador de un mock.
- Date.now() no va en el render (react-hooks/purity).
- Los literales de copy los fija la spec (R8, R12.2 y E1). No inventes copy.

## Prohibido

- No toques progress/history.md, progress/current.md, STATUS.md ni el campo `status` de feature_list.json. Son del leader y se escriben tras el veredicto del reviewer.
- No abras ni edites la PR. No mergees. No hagas rebase.
- No marques la casilla de §6 de requirements (smoke). La prueba en dev build de Android la hace el humano.
- No toques `backend-pet-tracker/`. Nada de AWS ni cdk.
- Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.

## Criterios de aceptación

- R2.3 (E4.2): seis casos en verde tras el commit 2. S31 comprobada en rojo en el commit 1.
- R2.1 y R2.2 y el resto de R2 sin cambios.
- `#170 R11` en verde.
- `tsc` y lint sin salida.
- R13.1 como está (E4.1).

## Al terminar

Escribe la sección «Corrección E4» en `progress/impl_mobile-alert-detail-canvas-fidelity.md`. En el chat devuelve solo «listo» y la ruta de ese fichero. Si algo no cuadra con la spec, PARA y reporta antes de improvisar.
