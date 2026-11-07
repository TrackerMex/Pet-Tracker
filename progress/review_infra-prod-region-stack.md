# review: infra-prod-region-stack (#246), ronda 1
Fecha: 2026-11-07T00:19Z
Veredicto: APROBADO

Revisado: `feature/246-infra-prod-region-stack` en `0693389c`, contra H0 `c42cc398`.
Worktree: `/home/claude/sites/Pet-Tracker-wt-246`.

## Resumen de la verificación

- **Cuenta de commits.** `git rev-list --count c42cc398..HEAD` = `43`:
  - 40 commits de requisitos (20 pares rojo/verde);
  - 2 de cierre (`aaa610f7`, `0693389c`);
  - la enmienda del leader `28e93a83`.
- **Asuntos de commit.** Los 42 asuntos que no son del leader coinciden carácter a carácter, y en orden, con los `**Commit**` de `tasks.md` (`diff` vacío).
- **Ficheros tocados.** Solo los de la lista cerrada de `design.md` §Archivos afectados, más la enmienda del leader a `tasks.md`. `tasks.md` no tiene ningún cambio después de `28e93a83`.
  - `git diff --exit-code c42cc398` sobre los ficheros protegidos da `exit=0`. Son estos: `infra/lib/pet-tracker-dev-stack.ts`, `infra/test/pet-tracker-dev-stack.test.ts`, `infra/test/no-duplicated-literals.test.ts`, `infra/cdk.json`, `infra/package.json` e `infra/pnpm-lock.yaml`.
  - No hay dependencias nuevas.
- **Verificación independiente en `infra/` sobre HEAD:**
  - `FORCE_COLOR=0 pnpm exec jest`: exit 0, `Test Suites: 4 passed, 4 total`, `Tests: 50 passed, 50 total`;
  - `pnpm exec tsc --noEmit -p tsconfig.json`: exit 0;
  - `pnpm run lint`: exit 0.
- **Synth sin contexto ni credenciales** (orden de §Cierre 3, ejecutada sobre una copia `git archive` de HEAD en el scratchpad): `exit=0`, `dev-ok` y `0` plantillas `PetTrackerProd*`.
- **Plantillas sintetizadas** de `mx-central-1` y `us-east-2` (89 recursos cada una):
  - 0 rayas largas (U+2014) en toda la plantilla, descripciones incluidas. Tampoco hay ninguna en el diff de `infra/`.
  - Los 5 roles de `ecs-tasks` tienen 0 `ManagedPolicyArns`.
  - Las sentencias `secretsmanager:*` de los execution roles apuntan solo a `{ Ref: DbSecretAttachment… }` y a los ARN parciales `:secret:pet-tracker/prod/<nombre>-??????`. No hay ningún comodín de nombre.
    - api: `db`, `jwt`, `wialon-token`, `resend-api-key`, `anthropic-api-key`.
    - workers: `db`, `jwt`, `wialon-token`.
    - ops: `db`, `wialon-token`.
  - El único `Resource: "*"` es `ecr:GetAuthorizationToken`, que AWS no deja acotar.
- **Secretos.** En el código solo hay nombres: `pet-tracker/prod/{jwt,wialon-token,resend-api-key,anthropic-api-key}`, leídos con `Secret.fromSecretNameV2`. El diff no contiene `SecretValue.plainText` ni `unsafePlainText`, ni claves, tokens o contraseñas literales.

## Checklist C2 — Estado coherente
- [x] Como máximo una feature `in_progress`: hay 0 en el branch, en `origin/dev` y en `origin/main`. #246 figura `spec_ready` en el branch, la misma convención que en reviews anteriores, p. ej. `review_reminders-recurrence.md` (ver O4).
- [x] `progress/current.md` describe la sesión del leader. El estado de #246 vive en disco, en el handoff y en el informe. No hay ninguna sesión sin cerrar que choque con esta feature.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: N/A, el diff no toca `backend-pet-tracker/`.
- [x] repositories/contratos en domain son interfaces puras: N/A.
- [x] application depende de interfaces: N/A.
- [x] infrastructure sin lógica de negocio. `infra/lib/*` solo compone constructs de CDK. Importa constantes de `@backend/aws/constants`, igual que el stack dev, sin duplicar literales.

## Checklist C4 — TDD
- [x] Cada R1–R20 tiene al menos un test que lo nombra. Los 36 `it` nuevos llevan el prefijo `#246 R<n>:`, y ningún `it` de `build-app.test.ts` ni de `pet-tracker-prod-stack.test.ts` va sin R-id (cruce con `jest --json`).
- [x] El historial muestra test primero, en 20 pares rojo y verde separados:
  - **Contenido de los rojos.** Cada rojo contiene solo tests, más los stubs y el fixture que declara `tasks.md`:
    - R1: `build-app.ts` con `BACKEND_IMAGE_DIRECTORY = ''` y `return new App()`;
    - R3: `PetTrackerProdStack` con solo `super(...)` y `fixtures/backend-image/Dockerfile` con `FROM scratch`.
  - **Contenido de los verdes.** Cada verde solo toca código de `infra/lib` o `infra/bin`.
  - **Comprobaciones del rojo sobre los 20 logs de Codex** (`/tmp/impl-246-R<n>-red.log`), repetidas por mí: `0`, `0` y N. N es igual al número de `it` nuevos de cada bloque, así que todos los `it` nuevos nacen rojos y ninguno nace verde.
  - **Reproducción independiente.** Reproduje 3 rojos desde `git archive <hash>`, sin tocar el worktree:
    - R4 `fdc0fa21`: 2 fallados de 24, `0 0 2`;
    - R10 `e479454e`: 2 de 36, `0 0 2`;
    - R15 `48320d25`: 1 de 43, `0 0 1`.
    En los tres `tsc` da 0 y caen por `expect(...).toEqual` o `resourceCountIs`. No hay ningún ReferenceError ni TypeError.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente»; la única aparición de la palabra es la regla de la línea 32.
  - Los 40 hashes completos existen.
  - Todos son ancestros de HEAD y ninguno lo es de H0.
  - Cada uno es el rojo o el verde del R-id de su fila.
  - Los 36 nombres de test de la tabla existen tal cual en la corrida de jest, y no falta ningún `it` de #246.
- [x] Los commits siguen `test|feat(infra-prod-region-stack): <desc> (R<n>)`. Los dos de cierre usan el `docs(...)` que prescribe `tasks.md`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla de firma delegada marcada (`c281df0e`, mandato del 2026-10-23 ampliado el 2026-11-06).
- [x] La enmienda `28e93a83` solo cambia el procedimiento del rojo en `tasks.md`: excluye la línea exacta `  ● Console`. No toca ningún requisito, ni `design.md`, ni las cifras. En los 20 rojos, el segundo grep da 0 también sin necesitar más exclusiones.

## Checklist C7 — Sin código huérfano
- [x] `bin/app.ts` pasa a delegar en `buildApp`. La creación de `PetTrackerDevStack` se movió, no se duplicó: el test R1 fija que `bin/app.ts` no contiene `new PetTrackerDevStack`.
- [x] No se elimina ningún test, y los 14 tests base siguen verdes.
- [ ] N/A: la feature no reemplaza ningún componente.

## Mutaciones (§Cierre 5 y sondas en zona ciega)

Las corrí sobre una copia `git archive HEAD` del scratchpad, con `infra/node_modules` enlazado. Revertí cada una con `git checkout HEAD -- lib/pet-tracker-prod-stack.ts` antes de la siguiente. El worktree no se tocó.

| Id | Mutación | Esperado | Resultado |
|---|---|---|---|
| #15 | `addToExecutionRolePolicy` de api con `secretsmanager:GetSecretValue` sobre `'*'` | cae R10 | 1/50: `#246 R10: secretos y lectura del execution role` |
| #5 | nombre del bucket con `PROD_PRIMARY_REGION` | cae solo R7 us-east-2 | 1/50: `#246 R7: bucket de us-east-2` |
| #2 | sin el endpoint gateway de DynamoDB | cae R4 en las dos regiones | 2/50: R4 mx-central-1 y us-east-2 |
| #13 | sin las 2 líneas que quitan el task role de ops | cae R16 | 2/50: los dos `it` de R16 |
| sonda P2 | execution role de workers con `GetSecretValue` sobre `…:secret:pet-tracker/prod/*` | cae R14 | 1/50: `#246 R14: secretos y lectura del execution role` |
| sonda P3 | execution role de ops lee además `pet-tracker/prod/jwt-??????` | cae R16 | 1/50: `#246 R16: TD ops, su contenedor, logs y secretos` |
| sonda P4 | zonas de disponibilidad de la VPC fijadas a `PROD_PRIMARY_REGION` (standby) | cae R4 us-east-2 | 1/50: `#246 R4: red de us-east-2` |
| sonda P5 | `AdministratorAccess` en el task role de api | cae R11 | 1/50: `#246 R11: cuatro sentencias exactas…` |
| sonda P1 | execution role de api con `secretsmanager:*` sobre `'*'` | zona ciega | **50/50 verde** (ver O2) |
| sonda P6 | `AdministratorAccess` en el execution role de api | zona ciega | **50/50 verde** (ver O2) |

En todas las mutaciones `tsc` da 0.

## Observaciones

Ninguna bloquea el veredicto.

1. **O1. Atribución inexacta en `progress/impl_infra-prod-region-stack.md:71`.** El informe dice «El humano ordenó reanudar desde el parche y autorizó la cuenta final de 43 commits». Quien resolvió el PARA y ordenó reanudar fue el leader, con su commit `28e93a83`. Juicio: es redacción y no afecta a nada verificable.
   - La cuenta de 43 sale mecánicamente de ese commit.
   - El leader tiene el mandato delegado de firma para este plan.
   - Ninguna cifra, test ni gate depende de esa frase.

   Aun así, `progress/` es el registro versionado, y la frase atribuye al humano una autorización que no dio. Conviene que el leader la corrija antes de la PR, cambiando «El humano» por «El leader», sin tocar el resto del informe.
2. **O2. Zona ciega en los execution roles (deuda de spec, no del implementer).** El código es correcto: en la plantilla, los 3 execution roles tienen 0 `ManagedPolicyArns` y solo las sentencias esperadas. Pero dos mutaciones pasan 50/50:
   - una sentencia `secretsmanager:*` sobre `'*'`;
   - `AdministratorAccess` en el execution role de api.

   **Causa.** `requirements.md` §Términos define «secretos leídos» solo por las sentencias cuya `Action` incluye `secretsmanager:GetSecretValue`, y R10, R14 y R16 no fijan ni las demás sentencias ni las políticas administradas de los execution roles. `secretsReadBy` implementa esa definición al pie de la letra.

   **Alcance exacto.** Solo afecta a `ApiTaskDefExecutionRole`, `WorkersTaskExecutionRole` y `OpsTaskExecutionRole`. Los task roles sí están candados: P5 hace caer R11.

   **Arreglo propuesto, para quien enmiende este stack (#247–#249).** Dos opciones:
   - incluir en `secretsReadBy` las sentencias cuya `Action` casa con `secretsmanager:*` o `*`;
   - o fijar `ManagedPolicyArns` ausente en los execution roles.
3. **O3. Frase de `docs/conventions.md` sobre `ANTHROPIC_MODEL`.** La frase dice que el literal `claude-haiku-5-5` solo aparece en `.env.example` y en los dos ficheros de `infra/`. También aparece en `STATUS.md` y `feature_list.json`: son ficheros del harness, ya lo tenían antes del branch y el branch no los toca. La frase es la que prescribe `tasks.md` §Cierre 6, literal, y la de base ya tenía la misma imprecisión. Es cosmético; no pido cambio en esta feature.
4. **O4. Estado de #246.** En el branch está `spec_ready`, y en `origin/dev` está `pending`. Le toca al leader registrarlo al cerrar (`AGENTS.md` §7.2). No es incoherente: hay 0 features `in_progress`.

## Output de ./init.sh

No lo ejecuté: el brief del leader lo prohíbe en esta ronda, y el clasificador ya se lo denegó al reviewer otras veces. Como sustituto:
- verifiqué de forma independiente la suite, los tipos y el lint de `infra/`, y el synth sin contexto (arriba);
- leí el log del leader sobre `0693389c`, `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/init-246-r2.log`, sin pipe.

Líneas de resumen del log:

```
✅ Build exitoso
Test Suites: 198 passed, 198 total          (backend)
Tests:       1651 passed, 1651 total
Test Suites: 4 passed, 4 total              (infra)
Tests:       50 passed, 50 total
Test Suites: 184 passed, 184 total          (móvil)
Tests:       6827 passed, 6827 total
Snapshots:   1 passed, 1 total
[✓] migrations applied successfully!
Test Suites: 3 skipped, 33 passed, 33 of 36 total   (e2e backend)
Tests:       8 skipped, 601 passed, 609 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

El log también trae líneas `ERROR` de Nest (consumers y `ExceptionsHandler`). No las analicé una a una: el diff no toca `backend-pet-tracker/` y todas las suites salen en verde.

Al terminar, `git status --short` y `git diff --cached` del worktree quedan vacíos, salvo este fichero.
