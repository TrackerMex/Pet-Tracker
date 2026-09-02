# review: auth-email-delivery (#58)
Fecha: 2026-09-02
Veredicto: APROBADO

Revisado sobre `feature/58-auth-email-delivery` @ `56be619` (working tree
limpio). Fuente de verdad para R6: `progress/handoff_auth-email-delivery.md`
§Corrección R6 (`465eee3`), según autorización del leader — validado contra
ese apartado, no contra `requirements.md:275`.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: #58 auth-email-delivery)
- [x] progress/current.md describe la sesión activa de #58

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `src/modules/auth/domain/` con
      CERO diff en la feature
- [x] repositories/contratos en domain son interfaces puras (sin cambios)
- [x] application depende de interfaces, no implementaciones —
      `src/modules/auth/application/` con CERO diff; los `await sender.send()`
      heredados de #44 intactos
- [x] infrastructure sin lógica de negocio: adaptadores Resend + guard
      implementan puertos/`CanActivate`; única dependencia hacia adentro es
      `normalizeEmail` desde domain (permitida, D9)

## Checklist C4 — TDD
- [x] Cada R1–R12 tiene al menos un test que lo nombra (`describe('R<n> ...')`)
- [x] Historial test-primero por requisito: rojo antes que verde en
      R1 (3be8e9c→9b77bb4), R5 (b8ac577→536040f), R2 (26ce596→fc5aa18),
      R7 (a16f041→59a99c5), R3 (8c6cd06→96b97c5), R4 (fa1a447→c233035),
      R8 (f63909b→7b534f9), R9 (27cbacd→f8f8097), R10 (185dee4→7bd3d48),
      R11 (d8f39f7→71a3be0). R6 (38a5e33) y R12 (2391041) verdes al
      introducirse — situación prevista por tasks.md R6(2) y por el carácter
      de red de regresión de R12; ambos anotados en el reporte de impl
- [x] El reporte de impl registra la salida roja literal de cada requisito
- [x] Rojos REPRODUCIDOS por el reviewer en worktree limpio (`git worktree add`):
      - R5 @ `b8ac577`: 3 failed, 3 total (idéntico al reporte)
      - R8 @ `f63909b`: suite failed — `Cannot find module './email-rate-limit.guard'`
- [x] Mutaciones (hechas en worktree desechable, revertidas):
      - R6/R5: quitar el `.catch` de contención en `resend-client.ts` →
        el spec R5 ("contiene un rechazo") falla Y el describe R6 de
        `auth.controller.spec.ts` falla con la excepción propagándose por
        `auth.controller.ts:149`. El test de R6 muerde en la frontera autorizada
      - R7: añadir `text: delivery.text` al log de éxito → los DOS specs R7
        (reset y verificación) fallan
      - R8/R9: subir límites 3→4 y 10→11 → 2 tests del guard fallan

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en la tabla R→test→commit
      (R1–R12 completas, con test y commits rojo+verde)
- [x] Hashes verificados contra `git log` (muestreo: R1, R8, R10, R11 —
      hash y mensaje coinciden literalmente; el resto cotejado en el log
      completo de la branch)
- [x] Commits siguen `feat|test|fix|docs(auth-email-delivery): <desc> (R<n>)`
- [x] Sufijo H5 `(auth-email-delivery)` presente en los describes nuevos de
      ficheros compartidos: R3/R4 en `auth.module.spec.ts`, R6/R10 en
      `auth.controller.spec.ts`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada
      (2026-09-02; DA1/DA2 cerradas)
- [x] Ningún fichero de spec modificado tras la aprobación (`b647a60`)
      salvo `traceability.md` (permitido); la corrección R6 vive en el
      handoff, no editó la spec

## Checklist C7 — Sin código huérfano
- [x] Rama muerta `EMAIL_ENABLED=true` de los dos adaptadores de consola
      eliminada (helper `isEmailEnabled` y `ConfigService` del constructor
      incluidos), conforme D3/allowlist 14–15
- [x] Sus describes de esa rama eliminados de los dos `console-*.spec.ts`
      (allowlist 16–17); la rama `false` intacta

## Comprobaciones específicas del encargo

1. **Secretos (R11)**: `git log -p b647a60..HEAD` contra
   `re_[A-Za-z0-9]{20,}` → 0 aciertos; los 2 aciertos de `RESEND_API_KEY=…`
   son placeholders de docs (`<clave creada en Resend>` y un backtick del
   reporte). `git grep re_…|process.env.RESEND` sobre src/test/infra/docs →
   vacío. `.env.example` con `RESEND_API_KEY=` y `RESEND_FROM=` vacías.
   `.env` gitignoreado y no versionado.
2. **Contención**: `git diff --name-only origin/main...HEAD` — cero diff en
   `infra/`, `src/db/`, `src/workers/`, `mobile-pet-tracker/`,
   `src/modules/auth/{domain,application}/`, `main.ts`, `package.json`,
   `pnpm-lock.yaml`, `test/auth-forgot-password.e2e-spec.ts`. Los commits de
   Codex (autoría AlexisSM377, d81b303..cecdcbc) no tocan
   `feature_list.json`, `progress/current.md` ni la spec salvo
   `traceability.md`. Único cambio de harness: `env-drift.test.mjs` 21→23
   (autorizado, commit `6564994`), consistente con las 2 claves nuevas de
   `.env.example`, ambas documentadas en `docs/conventions.md` §Variables de
   entorno (más la fila `EMAIL_ENABLED` actualizada).
3. **R3/R4**: lecturas ejecutables de `EMAIL_ENABLED` = exactamente 2, ambas
   `auth.module.ts` (líneas 66 y 79, dentro de los dos `useFactory`); el
   tercer acierto del grep literal es un comentario preexistente de
   `domain/ports/email-verification-sender.ts` (ruta prohibida — desviación
   documentada en el impl report, correcta). `MissingResendConfigError` se
   lanza desde el constructor de `ResendClient` en el `useFactory`: la
   compilación del módulo rechaza (verificado por los 2 casos de R4), sin
   fallback a consola.
4. **R5/R6**: `deliver()` retorna `Promise.resolve()` y engancha el `.catch`
   al crear la promesa (D6); seam `whenIdle()`. El e2e de R6 inyecta
   `ResendPasswordResetSender` REAL con `fetch` doble que rechaza, conserva
   `200 {"requested":true}` y compara estructuralmente contra la cuenta
   inexistente (`fetchDouble` llamado 1 vez — el camino de fallo se ejercitó).
   Igual el espejo unitario. Application con CERO diff.
5. **R7**: logs solo con `scope/event/userId/id` (éxito) y
   `status/message` saneado (fallo); el test inyecta el token y la API key en
   el mensaje del proveedor y verifica que no aparecen. Mutación mordió.
6. **R8–R10**: 4º forgot-password mismo email (con variantes de
   normalización) → 429; 11ª alta misma IP → 429; e2e R8 confirma que el
   caso de uso se ejecutó solo 3 veces; el 429 no consulta la base y el body
   429 es idéntico exista o no la cuenta (igualdad estructural); body sin
   `email` string pasa sin contarse; guard NO aplicado a login/verifyEmail/
   resetPassword (metadata `__guards__`); provider normal, no APP_GUARD.
7. **R12**: e2e con `EMAIL_ENABLED` por defecto verifica adaptadores de
   consola por instancia y completa registro→verify→forgot→reset;
   `test/auth-forgot-password.e2e-spec.ts` re-ejecutado por el reviewer sin
   editar: verde.
8. **Gates G1–G4**: registrados por el humano en `d7931d5` al final de
   `progress/impl_auth-email-delivery.md`, sin ningún secreto en el diff.

## Observaciones (no bloqueantes, para el cierre del leader)

- La tabla "Gates humanos" de `specs/auth-email-delivery/traceability.md`
  sigue con Estado "pendiente" en G1–G4; el registro autorizado vive en
  `d7931d5`. Actualizar esas cuatro celdas en el commit de cierre (no son
  filas de la tabla R→test→commit de C5).
- Las casillas de `specs/auth-email-delivery/tasks.md` quedaron sin marcar
  (cosmético; el historial las cubre).
- **Incidencia de working tree compartido**: durante la primera corrida de
  `./init.sh` de esta revisión, algo externo a esta sesión hizo
  `git checkout main` sobre el working tree (reflog `HEAD@{0}` en ese
  momento), invalidando esa corrida (fallos espurios en la suite móvil por
  estado mixto). El reviewer restauró `feature/58-auth-email-delivery`
  (`56be619`, tree limpio) y reejecutó todo en verde. Tercera recurrencia
  del problema de un solo escritor — considerar `git worktree` por agente.
- El ref local `main` (`c083e3f`) está detrás de `origin/main` (`e09cf08`,
  merge de PR #97); la verificación de contención se hizo contra
  `origin/main`.

## Output de ./init.sh (ejecutado por el reviewer, exit 0)

```
✅ Build exitoso
backend:  Test Suites: 162 passed, 162 total | Tests: 1226 passed, 1226 total
infra:    Test Suites: 2 passed, 2 total    | Tests: 14 passed, 14 total
harness:  tests 28 | pass 28 | fail 0
mobile:   Test Suites: 51 passed, 51 total  | Tests: 578 passed, 578 total (1 snapshot)
e2e:      Test Suites: 3 skipped, 24 passed, 24 of 27 total
          Tests: 8 skipped, 352 passed, 360 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
Features: 53/59 completadas | 5 pendientes
exit 0
```

Corrida adicional del reviewer:
`jest --config test/jest-e2e.json test/auth-email-delivery.e2e-spec.ts
test/auth-forgot-password.e2e-spec.ts --runInBand` →
`Test Suites: 2 passed | Tests: 9 passed`.
