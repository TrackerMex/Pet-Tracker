# review: users-account-deletion-api (#247), ronda 2
Fecha: 2026-11-07 00:05 UTC
Veredicto: APROBADO

Rama `feature/247-users-account-deletion-api`, worktree `Pet-Tracker-wt-247`.
H0 = `0e70fff2`, HEAD = `8cd43998`, `git rev-list --count 0e70fff2..HEAD` = 20 (lo que fija
la enmienda 2 en `tasks.md`).

La ronda 1 (HEAD `83cb3102`) se rechazó por H1. Desde entonces hay 4 commits:
- `63b63c82`: enmienda 2 del leader en `tasks.md`. Ese commit también versiona el review
  de la ronda 1.
- `4dd25416` (commit 16): test.
- `bad8fe88` (commit 17): refactor.
- `8cd43998` (commit 18): registro.

`git diff --stat 83cb3102..HEAD` toca 5 ficheros, todos dentro de lo que fija la enmienda:
- `backend-pet-tracker/test/devices.e2e-spec.ts`: +7;
- `pet-data-purger.aws.adapter.ts`: +3 −1;
- `progress/impl_users-account-deletion-api.md`;
- `progress/review_users-account-deletion-api.md`;
- `specs/users-account-deletion-api/tasks.md`.

## H1 de la ronda 1: cerrado

`devices.e2e-spec.ts` R15 sigue asertando `released.status` en `'available'` (#247 R10)
y la cascada de `pet_devices` a 0 filas. Después, dentro del mismo `it`, siembra a mano
`devices.status = 'assigned'` sin fila activa (líneas 996-1001) y reclama con `ownerB`
esperando `201`. Esa es justo la regla D3 de `devices-claim` R15 que había quedado sin
candado.

Corrí la sonda yo mismo, desde `backend-pet-tracker/`, con
`FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/devices.e2e-spec.ts`. Antes
de cada corrida apliqué §Esperas del handoff: `DATABASE_URL` no estaba exportada (`0`) y no
había ningún `init.sh` (`espera=1`). La primera esperó a que terminara el `init.sh` de
`Pet-Tracker-wt-246`.

| Corrida | Estado del árbol | `exit` | Resultado |
|---|---|---|---|
| Verde | HEAD `8cd43998` intacto | `0` | 1/1 suites, 29/29 tests |
| Sonda | `      device.status === 'assigned' ||` bajo `device.status === 'inactive' ||` en `claim-device.use-case.ts` (`mutada=1`, diff de 1 línea) | `1` | 1 failed, 28 passed, 29 total |

El único rojo de la sonda:
```
● Devices claim (e2e) › R15: borrar una mascota con collar deja el device reclamable (D3) › claim -> DELETE /v1/pets/:petId -> claim con otra mascota responde 201
  expected 201 "Created", got 409 "Conflict"
  > 1008 |       }).expect(201);
```
Es por aserción, en el reclamo de D3. No hay ningún `Test suite failed to run` ni
`error TS` en ninguno de los dos logs. Coincide con lo que Codex registra en el impl report
(§Enmienda del leader 2).

Revertí con `git checkout HEAD -- src/modules/devices/application/use-cases/claim-device.use-case.ts`,
con un `trap EXIT` de respaldo en el script. Después:
- `git diff --quiet -- src` da `0`;
- `git diff --cached --quiet` da `0`;
- `git status --short` sale vacío.

Logs:
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/r2-247-verde.log`
- `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/r2-247-sonda.log`

Script: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/r2-sonda-247.sh`.

## H2 y H3 de la ronda 1: cerrados

- H2: la fila de `onDelete` en la tabla de mutaciones de `tasks.md` ya no promete un rojo
  e2e. Dice que la base e2e sale de las migraciones SQL y no del esquema TS.
- H3: `pet-data-purger.aws.adapter.ts:114-116` construye el mensaje con
  `${BATCH_WRITE_ATTEMPTS}`. Anclas: `grep -cF "after 3 attempts"` da `0` y
  `grep -cF 'after ${BATCH_WRITE_ATTEMPTS} attempts'` da `1`. El texto resultante es el
  mismo, porque la constante vale `3` (línea 26). Ningún test aserta ese literal: el
  `#247 R15` (e) solo aserta el prefijo `PET_PURGE_FAILED store=dynamodb …`.

## Checklist C2: estado coherente
- [x] `feature_list.json` no tiene ninguna feature `in_progress` (0 en HEAD, `origin/main`
      y `origin/dev`). #247 está `spec_ready`.
- [x] `progress/current.md`: el diff no lo toca, porque lo escribe el leader al cerrar. Sigue
      sin mencionar #247 ni el plan AWS del 2026-11-06, igual que en la ronda 1; no bloquea.
- [x] El marcador `progress/impl_users-account-deletion-api.done` no está versionado: lo
      ignora `.gitignore:27`.

## Checklist C3: arquitectura
- [x] Los dos commits de código de esta ronda no tocan `domain` ni `application`:
      - `4dd25416` es solo test e2e;
      - `bad8fe88` cambia un literal en infraestructura.
      Lo que se verificó en la ronda 1 sigue igual: puertos puros, `application` depende
      de puertos y el orden transaccional vive donde fija el design.
- [x] `infrastructure` sin lógica de negocio nueva.

## Checklist C4: TDD
- [x] Cada R1–R15 de #247 tiene al menos un test que nombra `#247 R<n>:`. La ronda no
      añade ni quita ningún título `#247`.
- [x] El historial va test primero:
      - Los seis pares rojo→verde de la ronda 1 siguen intactos y son ancestros de HEAD.
      - El commit 16 (`4dd25416`) solo trae test: +7 líneas en `devices.e2e-spec.ts`, sin
        nada en `src/`. Nace verde, como declara la enmienda: es un candado de una regla
        que ya existe (D3 de `devices-claim`), no hay producción nueva que fijar. Su rojo
        lo demuestra la sonda (ver H1).
      - El commit 17 (`bad8fe88`) es un refactor sin cambio de comportamiento, con el
        unit de pets en verde según el impl report (17 suites, 146 tests).
      - El commit 18 es solo docs.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». La única aparición de la
      palabra está en la regla de la línea 27. La ronda no lo toca.
- [x] Todos sus hashes son ancestros de HEAD, así que no hubo rebase: `6a900be5`,
      `e62b7bb9`, `5ae914bc`, `b84011b5`, `7ab40b41` y `83ecc9e7`.
- [x] El candado nuevo es de `devices-claim` R15 (D3), no de un R-id de #247, así que no le
      toca fila. Va registrado en la enmienda 2 de `tasks.md` y en el impl report.
- [x] Los mensajes de los commits 16, 17 y 18 son literalmente los que prescribe la enmienda
      2: `test(devices): …`, `refactor(pets): …` y `docs(users-account-deletion-api): …`.
- [x] Cuentas de la enmienda: `rev-list --count` da `20`. Las anclas del commit 16 dan
      `2`, `1` y `1`, y las del commit 17 dan `0` y `1`. Todas coinciden con las columnas
      «Después».

## Checklist C6: spec aprobada
- [x] `requirements.md` está en `status: approved`, con la casilla de firma delegada marcada
      (línea 398).

## Checklist C7: sin código huérfano
- [ ] N/A: la feature no reemplaza ningún módulo, igual que en la ronda 1.

## Recursos AWS reales
Ninguno. La ronda no toca `infra/`, CDK ni `mobile-pet-tracker/`.

## Observaciones
Ninguna bloqueante.

1. El review de la ronda 1 quedó versionado en `63b63c82`. Por eso este veredicto, que lo
   sobrescribe sin commitear, deja `M progress/review_users-account-deletion-api.md` en el
   árbol. Es el único cambio: el código está limpio.
2. `progress/current.md` no menciona #247 (ver C2). Lo actualiza el leader al cerrar.
3. La evidencia de suite completa es el `init.sh` del leader. Mis corridas fueron acotadas
   (devices e2e, verde y sonda), por la restricción del encargo.

## Output de ./init.sh
No lo corrí: el encargo lo prohíbe porque choca con los otros worktrees. Va el log del
leader, sobre HEAD `8cd43998`. Está en
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/init-247.log`
(mtime 23:43 UTC, posterior al commit 18 de las 22:40; el árbol estaba limpio):
```
✅ Sin features en progreso (sesión limpia)                      (línea 42)
Test Suites: 202 passed, 202 total                               (backend unit, línea 220)
Tests:       1680 passed, 1680 total
Test Suites: 2 passed, 2 total                                   (infra)
Tests:       14 passed, 14 total
Test Suites: 184 passed, 184 total                               (móvil)
Tests:       6827 passed, 6827 total
Test Suites: 3 skipped, 34 passed, 34 of 37 total                (e2e backend, línea 205809)
Tests:       8 skipped, 621 passed, 629 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Sin ningún `FAIL`. Todos los `●` del log son bloques `● Console`.
