---
feature: "auth-forgot-password"
issue: 44
branch: "feature/44-auth-forgot-password"
revisado: "feature/44-auth-forgot-password @ 8674abf"
fecha: 2026-08-29
veredicto: APROBADO_CON_OBSERVACIONES
---

# review: auth-forgot-password (#44)

Fecha: 2026-08-29
Veredicto: **APROBADO** (con 2 hallazgos de proceso, ninguno de código)

Revisado sobre el working tree existente en `feature/44-auth-forgot-password`
(HEAD `8674abf`), sin cambiar de rama, sin editar código y sin commitear.
PR abierto: #93.

**Resumen.** La implementación es correcta y está verificada de punta a punta.
`./init.sh` re-ejecutado por el reviewer da **exit 0** y reproduce exactamente
las cifras del reporte. El historial TDD es real: los 13 commits rojos existen,
todos preceden a su verde y todos introducen tests que nombran su R-id — no se
repitió el fallo de #19. Los controles de seguridad (R1/R2/R10, 400 vs 410,
invalidación de hermanos, no intercambiabilidad de tokens) están **cubiertos
por tests ejecutables**, no afirmados en prosa. La contención de R13 se sostiene
verificada **ítem por ítem contra la allowlist escrita**, con independencia del
regex.

Los dos hallazgos son de **proceso del arnés**, no de código: Codex marcó la
feature `done` sin veredicto de reviewer (H1) y editó la spec aprobada por
humano (H2). Ninguno altera el veredicto técnico, pero H2 pide una ratificación
humana de una línea antes del merge.

---

## Checklist C2 — Estado coherente

- [x] Máximo una feature `in_progress` — de hecho **cero** (`grep -c '"in_progress"'` = 0)
- [x] Toda feature `done` tiene tests que la cubren — R1–R13 cubiertos (ver C4)
- [x] `progress/history.md` tiene entrada de la sesión cerrada
      (`progress/history.md:1988` — `## 2026-08-28 — Feature #44 auth-forgot-password (cerrada)`)
- [~] `progress/current.md` describe la sesión activa — el commit `8674abf`
      retiró las 51 líneas de #44 y dejó el archivo con la sesión Backend de
      #52/#45/#54/#53. El archivo es coherente, pero quedó así por el cierre
      prematuro de H1: `init.sh` reportó "Sin features en progreso (sesión
      limpia)" **porque #44 ya estaba en `done`**, no porque el ciclo hubiera
      terminado bien. Es consecuencia de H1, no un defecto independiente.

## Checklist C3 — Arquitectura

- [x] **`domain` sin imports de `infrastructure`.** Verificado archivo por
      archivo: los cuatro ficheros nuevos de domain no importan **nada**
      externo. `password-reset-token.entity.ts` y `password-reset.errors.ts`
      tienen cero imports; `password-reset-sender.ts` solo declara `Symbol` +
      interfaces; `password-reset-token.repository.ts` solo importa su propia
      entidad. Grep de `infrastructure|drizzle|@nestjs/common` sobre los cuatro:
      sin resultados.
- [x] **Contratos en domain = interfaces puras.** `PasswordResetTokenRepository`
      y `PasswordResetSender` son `interface` sin implementación, con token de
      inyección `Symbol`.
- [x] **`application` depende solo de interfaces.** `RequestPasswordResetUseCase`
      (`request-password-reset.use-case.ts:20-29`) y `ResetPasswordUseCase`
      (`reset-password.use-case.ts:19-28`) inyectan por token
      (`USER_REPOSITORY`, `PASSWORD_RESET_TOKEN_REPOSITORY`,
      `PASSWORD_RESET_SENDER`, `PASSWORD_HASHER`, `AUDIT_LOGGER`) y tipan con
      `import type`. Ninguna clase Drizzle referenciada.
- [x] **`infrastructure` sin lógica de negocio.** Los dos handlers nuevos
      (`auth.controller.ts:140-169`) son `parseBody` → `execute` → respuesta
      literal, más el mapeo de los dos errores de dominio a `GoneException` /
      `BadRequestException`. Cero decisiones de negocio en el controlador: el
      orden invalidar→insertar→enviar→auditar y el 400-vs-410 viven en los use
      cases.
- [x] `UserDrizzleRepository.updatePasswordHash` implementa la interfaz de
      domain, no al revés.

## Checklist C4 — TDD

**Cada R tiene test que lo nombra** (verificado leyendo los `describe` reales,
no la tabla del reporte):

| R | describe verificado en disco |
|---|---|
| R1 | `request-password-reset.use-case.spec.ts:81` + `auth.controller.spec.ts:413` |
| R2 | `request-password-reset.use-case.spec.ts:118` + `auth.controller.spec.ts:425` + `test/auth-forgot-password.e2e-spec.ts:132` |
| R3 | `auth.controller.spec.ts:447` |
| R4 | `request-password-reset.use-case.spec.ts:135` + `e2e:155` |
| R5 | `reset-password.use-case.spec.ts:89` + `auth.controller.spec.ts:471` + `e2e:178` |
| R6 | `reset-password.use-case.spec.ts:126` + `auth.controller.spec.ts:488` |
| R7 | `reset-password.use-case.spec.ts:152` + `auth.controller.spec.ts:510` |
| R8 | `auth.controller.spec.ts:529` |
| R9 | `e2e:214` |
| R10 | `console-password-reset-sender.spec.ts:21` y `:58` + `auth.controller.spec.ts:564` + `e2e:243` |
| R11 | `request-password-reset.use-case.spec.ts:157` + `reset-password.use-case.spec.ts:186` |
| R12 | `password-reset-tokens.schema.spec.ts:22` |
| R13 | `e2e:259` |

**Historial rojo→verde — verificado commit a commit, no aceptado del reporte.**
Los 13 pares declarados existen y `git merge-base --is-ancestor rojo verde`
devuelve 0 en los 13 casos:

```
R1  a40ceb2 → b3e0aaf   R2  97e2c4b → bfa3f8c   R3  080817e → 9d1f7e7
R4  25abbdd → 721c580   R5  e36de77 → e531f63   R6  1e62765 → ff042c0
R7  ac3af27 → e1bc6cf   R8  56054ce → 2142d49   R9  106349c → e531f63
R10 f699540 → 44fecd5   R11 4e05906 → 4324e31   R12 64230ee → 9cd8473
R13 0e67341 → 562b8a5
```

`git show --stat` de cada rojo confirma que **12 de 13 tocan exclusivamente
ficheros `*.spec.ts` / `*.e2e-spec.ts`**. No hay ningún commit monolítico:
contraste con #19, donde implementación + tests + docs cayeron juntos.

Comprobaciones adicionales de que los rojos eran rojos de verdad (vía
`git cat-file -e <rojo>:<ruta-impl>`, sin checkout):
- R1: `request-password-reset.use-case.ts` **no existe** en `a40ceb2`.
- R5: `reset-password.use-case.ts` **no existe** en `e36de77`.
- R12: `0015_auth_password_reset_tokens.sql` **no existe** en `64230ee`, y el
  test lo lee del disco (`readMigration0015()`) → fallo garantizado.
- R10: el sender **sí** existía en `f699540` (creado por el verde de R1,
  17 líneas). El rojo de R10 añade el spec completo y el verde `44fecd5`
  amplía el adaptador (+28 líneas) con la rama `EMAIL_ENABLED=true`. Sigue
  siendo rojo legítimo para el caso nuevo.

- [x] Patrón test-primero presente y auditado
- [x] Ningún commit rojo posterior a su verde

## Checklist C5 — Trazabilidad

- [x] `specs/auth-forgot-password/traceability.md` **sin ninguna fila
      "pendiente"**: las 13 filas están rellenas.
- [x] **Cada fila apunta a un test que existe de verdad.** Comprobado uno a uno:
      los 13 `archivo::describe` citados coinciden **literalmente** con
      `describe(...)` presentes en disco (tabla de C4). Ninguna ruta rota,
      ningún nombre inventado.
- [x] **Cada fila apunta a un commit real**: los 26 hashes citados resuelven en
      `git log` de la rama.
- [x] Formato de commit `feat(<scope>): <desc> (R-ids)` en los 12 verdes de
      código (ver H4 para la única excepción, R13).

## Checklist C6 — Spec aprobada

- [x] `specs/auth-forgot-password/requirements.md` con `status: approved`
      (línea 3)
- [x] Casilla humana marcada con fecha:
      `requirements.md:465` — `- [X] Aprobado por humano (fecha: 2026-08-28)`
      `requirements.md:466` — `- [X] DA1 y DA2 revisadas` (2026-08-28)
- [ ] **Ningún requisito modificado tras la aprobación** → **no se cumple**.
      Ver H2. El texto normativo (la allowlist de 33 ítems) quedó intacto; lo
      editado es el comando de verificación del reviewer dentro de R13.

## Checklist C7 — Sin código huérfano

- [x] N/A parcial — la feature **no reemplaza** ningún componente existente.
      La spec es explícita (§Fuera de alcance): **no** se retrofitea
      `verify-email`, **no** se unifican las dos tablas de tokens, **no** se
      activa el stub móvil de Forgot.
- [x] Verificado que se respetó: el diff **no toca**
      `verify-email.use-case.ts`, `email-verification-token*`,
      `argon2-password-hasher.ts`, `jwt-token-service.ts`, `auth.guard.ts` ni
      `mobile-pet-tracker/`. Cero ficheros borrados en toda la rama.
- [x] No quedan `.spec`/`.test` de ficheros inexistentes.

## Checklist C8 — UI móvil

- [x] **N/A.** Feature de backend puro. `git diff --name-only origin/main...HEAD`
      no contiene ni una ruta bajo `mobile-pet-tracker/`.

---

## Cobertura de los requisitos de seguridad (revisión dirigida)

El leader pidió confirmar que ningún control de seguridad esté solo en prosa.
**Ninguno lo está.** Detalle:

**R1/R2 — respuesta uniforme exista o no la cuenta.**
`RequestPasswordResetUseCase.execute` (`request-password-reset.use-case.ts:32-36`)
sale con `return` limpio si `findByEmail` da `null`: sin insert, sin sender, sin
auditoría. El controlador devuelve `{ requested: true }` incondicionalmente
(`auth.controller.ts:143-147`).
Cubierto por **igualdad estructural**, tal y como exigía la spec — no por dos
literales escritos a mano:
- `auth.controller.spec.ts:425` construye los dos caminos y hace
  `expect(missingResponse).toEqual(existingResponse)` sobre `{status, body}`.
- `e2e:132` hace lo mismo contra Postgres real y además fija
  `status === 200` y `body === {requested:true}`.
- `request-password-reset.use-case.spec.ts:118` asserta "sin persistir, enviar
  ni auditar".

**R10 — el token NUNCA en la respuesta HTTP.**
- `auth.controller.spec.ts:564`: `expect(Object.keys(body)).toEqual(['requested'])`
  **y** `expect(JSON.stringify(body).toLowerCase()).not.toContain('token')`.
  Es una aserción de forma cerrada: un campo extra rompe el test.
- El use case entrega el token en claro **solo** a `resetSender.send`
  (`request-password-reset.use-case.ts:52-57`); nunca lo retorna
  (`Promise<void>`).

**R10 — solo se persiste el hash SHA-256, con TTL.**
- Persistencia: `create({ tokenHash: hashVerificationToken(token), expiresAt })`
  (`request-password-reset.use-case.ts:46-50`). El token en claro no entra.
- Verificado **contra la base real** en `e2e:243`: lee las filas de
  `password_reset_tokens`, asserta `tokenHash === hashVerificationToken(token)`,
  `toMatch(/^[a-f0-9]{64}$/)` y — la aserción que importa —
  `expect(JSON.stringify(rows)).not.toContain(token)`.
- TTL: `PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000` (1 h), añadido sin tocar
  las dos funciones existentes (`verification-token.ts`, diff estrictamente
  aditivo). El schema fija `expires_at timestamptz NOT NULL`.

**R4/R5 — invalidación de tokens previos.**
- Emisión: `invalidateAllForUser(user.id, issuedAt)` se ejecuta **antes** del
  `create` (`request-password-reset.use-case.ts:39` vs `:46`) — el orden que
  pide R4.
- Consumo: `invalidateAllForUser(token.userId, changedAt)` tras el cambio de
  hash (`reset-password.use-case.ts:47`).
- Probado contra Postgres en `e2e:155`: pide dos tokens, comprueba
  `firstRow.usedAt instanceof Date` y `secondRow.usedAt === null`. No es un
  mock: es la fila real.

**400 vs 410.**
- `reset-password.use-case.ts:35-42`: `null || isUsed()` →
  `InvalidPasswordResetTokenError`; **después** `isExpired()` →
  `PasswordResetTokenExpiredError`. El orden es el correcto: un token usado da
  400 aunque además esté expirado, como fija R6.
- Mapeo HTTP en `auth.controller.ts:161-167` (`GoneException` / `BadRequestException`).
- R6 se prueba con `it.each` sobre **los dos** casos (`'inexistente'`, `'ya usado'`)
  y asserta que `hash`, `updatePasswordHash`, `invalidateAllForUser` y `record`
  **no** se llamaron (`reset-password.use-case.spec.ts:126-150`).
- R7 se prueba con `it.each` incluyendo el **borde exacto**
  (`expires_at === now`, no solo `< now`) — `reset-password.use-case.spec.ts:152-184`.
  Es el caso que suele quedar sin cubrir; aquí está.

**R13 — tokens de verify-email y password-reset no intercambiables.**
Cubierto en **ambas direcciones** por un test e2e real (`e2e:259-300`), no por
prosa:
- token de verificación → `POST /v1/auth/reset-password` → `.expect(400)`
- token de reset → `POST /v1/auth/verify-email` → `.expect(400)`
- y a continuación completa los dos flujos legítimos, probando que la
  separación no rompió ninguno.

---

## Contención R13 — verificación independiente

El reporte admite haber corregido el regex de la allowlist. **Lo verifiqué yo
mismo, y la corrección es legítima.**

**1. Qué se editó.** `git show 679e659 -- specs/auth-forgot-password/requirements.md`
muestra un cambio de **una sola línea**: el regex pasa de empezar en
`'password-reset|password_reset|…'` a `'forgot-password|password-reset|reset-password|password_reset|…'`.
Solo se añadieron dos alternativas. La allowlist normativa de 33 ítems **no se
tocó**.

**2. Qué señalaba el regex original.** Lo ejecuté tal como lo aprobó el humano:

```
backend-pet-tracker/src/modules/auth/application/dto/forgot-password.dto.ts
backend-pet-tracker/src/modules/auth/application/dto/reset-password.dto.ts
backend-pet-tracker/src/modules/auth/application/use-cases/reset-password.use-case.spec.ts
backend-pet-tracker/src/modules/auth/application/use-cases/reset-password.use-case.ts
```

Cuatro ficheros, exactamente los **ítems 9, 10, 13 y 14 escritos en la propia
allowlist** de R13. Eran falsos positivos: la spec los autoriza por nombre y el
regex no los reconocía. La errata es real.

**3. Verificación independiente del regex — ítem por ítem.** No me apoyo en
ningún regex para el veredicto. Mapeé los **41 ficheros** del diff contra la
allowlist escrita:

- Ítems 1–18 (nuevos): los 18 presentes, ninguno de más.
- Ítems 19–33 (modificados): los 15 presentes.
- Harness (`specs/auth-forgot-password/**`, `progress/**`, `feature_list.json`,
  `STATUS.md`): 7 ficheros, todos permitidos.
- **18 + 15 + 7 = 40**, más `progress/history.md` (cubierto por `progress/**`) = 41.

**Correspondencia exacta: cero ficheros fuera de la allowlist, cero ítems de la
allowlist sin tocar.** El cambio de regex **no escondió nada**.

**4. Prohibiciones explícitas de R13 — todas respetadas.** El diff no contiene
`mobile-pet-tracker/`, `infra/`, `.env.example`, la tabla de entorno de
`docs/conventions.md`, `verify-email.use-case.ts`, `email-verification-token*`,
`argon2-password-hasher.ts`, `jwt-token-service.ts`, `auth.guard.ts`, ni ninguna
migración anterior a la 0015 (verificado:
`git diff --name-only … -- src/db/migrations/ | grep -vE '0015|_journal'` sale
vacío).

**5. Sobre `main` vs `origin/main`.** El uso de `origin/main...HEAD` en lugar de
`main...HEAD` está justificado: el ref local `main` está atrasado. Yo usé
`origin/main...HEAD` por la misma razón, y es el contraste correcto para la rama
de la PR #93.

---

## Migración R12

- [x] **Aditiva.** `0015_auth_password_reset_tokens.sql` contiene exactamente
      tres sentencias, todas sobre la tabla nueva: `CREATE TABLE
      password_reset_tokens`, `ALTER TABLE password_reset_tokens ADD CONSTRAINT
      … FOREIGN KEY … REFERENCES public.users(id) ON DELETE cascade`, y
      `CREATE INDEX password_reset_tokens_user_id_idx`. **Ningún `DROP`, ningún
      `ALTER` sobre tabla existente, ninguna columna alterada en `users`.**
- [x] **No destructiva.** La única referencia a `users` es la FK entrante; la
      tabla `users` no se modifica.
- [x] **Schema Drizzle coincide con la migración y con R12.**
      `password-reset-tokens.schema.ts` declara las seis columnas exigidas con
      sus tipos: `id uuid PK` (generado en app, sin `defaultRandom`),
      `user_id uuid NOT NULL` + FK cascade, `token_hash char(64) NOT NULL
      .unique()`, `expires_at timestamptz NOT NULL`, `used_at timestamptz`
      nullable, `created_at timestamptz NOT NULL .defaultNow()`, más
      `index('password_reset_tokens_user_id_idx')` sobre la FK — la regla "toda
      FK lleva índice manual" de `docs/data-model.md`.
- [x] **Espeja `email_verification_tokens`** como pedía la spec.
- [x] `_journal.json`: una sola entrada nueva, `idx: 15`,
      `tag: "0015_auth_password_reset_tokens"`. Las 15 anteriores intactas.
      (El diff arregla además el "no newline at end of file" preexistente.)
- [x] Barrel `src/db/schema/index.ts` reexporta la tabla (una línea).
- [x] `docs/data-model.md` documenta la tabla con fila propia en el catálogo.
- [x] El test `password-reset-tokens.schema.spec.ts` valida **las dos caras**:
      `getTableConfig(passwordResetTokens)` y el SQL de la migración leído del
      disco. No puede quedar desincronizado en silencio.

## Nada de AWS real

- [x] Cero cambios bajo `infra/`.
- [x] Sin `cdk deploy` / `cdk bootstrap`: la feature no toca CDK en absoluto.
- [x] **Sin variables de entorno nuevas.** El único `config.get` añadido en todo
      el diff es `this.config.get<string>('EMAIL_ENABLED')`
      (`console-password-reset-sender.ts:35`) — variable **preexistente** y ya
      documentada. `.env.example` y la tabla de entorno de `docs/conventions.md`
      no se tocan, como exigía R13.
- [x] **Sin dependencias nuevas.** `package.json` y el lockfile no aparecen en
      el diff. Se reutilizan `zod`, `argon2`, `drizzle`, `node:crypto`.
- [x] El único aviso de AWS en `init.sh` es el preexistente del SDK v3
      (Node >= 22 a partir de 2027); no bloqueante y ajeno a esta feature.

## Sin secretos en el repo

- [x] Barrido sobre las líneas añadidas del diff completo (patrones `AKIA`,
      `BEGIN … PRIVATE KEY`, `secret_key=`, `api_key="…"`, passwords literales
      largos): **cero hallazgos reales**.
- [x] Los dos únicos aciertos del barrido son **placeholders** de la guía manual
      `docs/verification.md`: `export OLD_PASSWORD='<password-anterior>'` y
      `export NEW_PASSWORD='<password-nuevo-de-8-a-128-caracteres>'`. No son
      credenciales.
- [x] Las contraseñas en tests son literales de prueba (`OldPassword1!`) sobre
      usuarios sembrados con `runId`, no credenciales reales.

## Deuda declarada — DA1/DA2 siguen abiertas

- [x] **DA1 (proveedor de correo real) no se cierra ni se presupone.** No hay
      dependencia de correo nueva, ni SES, ni `nodemailer`. `ConsolePasswordResetSender`
      escribe un log estructurado `auth.password_reset.issued` y, con
      `EMAIL_ENABLED=true`, emite además el `logger.warn` diciendo
      explícitamente que **no hay proveedor real cableado** — el aviso mantiene
      la deuda visible en runtime en vez de enterrarla. Ambas ramas están
      probadas (`console-password-reset-sender.spec.ts:21` y `:58`).
- [x] **DA2 (plantilla / enlace) no se cierra.** No hay plantilla de email,
      ni URL, ni deep link en ninguna parte del diff. La guía de
      `docs/verification.md` hace que el humano copie el token **pelado** del
      log y lo pegue, que es exactamente el estado provisional que DA2 describe.
- [x] El resto de la deuda anotada (rate limiting, timing, revocación de JWT,
      stub móvil) sigue fuera de alcance y sin tocar.
- [x] La casilla `requirements.md:466` confirma que el humano aceptó **cerrar la
      feature con entrega por log**, que no es lo mismo que cerrar DA1/DA2.

---

## Hallazgos

### H1 — `feature_list.json` marcado `done` por el implementador, sin veredicto de reviewer — **MEDIA (proceso)**

**Evidencia.** `git show 8674abf -- feature_list.json`:

```
     "id": 44,
     "name": "auth-forgot-password",
-    "status": "in_progress",
+    "status": "done",
```

Commit `8674abf docs(auth-forgot-password): close feature 44`, autor
`Claude <claude@srv1178023.hstgr.cloud>`, 2026-08-28 23:27:31 — es decir, el
propio implementador, **antes** de que existiera esta revisión.

**Por qué importa.** `CLAUDE.md` §Reglas duras: *"No declares ni marques una
tarea como `done` sin veredicto aprobado del `reviewer` — el gate es su
revisión"*, y registrar `status: "done"` es parte del **cierre del leader**
(`AGENTS.md` §7.2), no del implementador. El mismo commit escribió la entrada
de `progress/history.md` dando la feature por cerrada y vació `current.md`.

**Efecto colateral verificado.** `./init.sh` reporta *"✅ Sin features en
progreso (sesión limpia)"* — pero ese check pasa **por el cierre prematuro**,
no porque el ciclo hubiera terminado. Un `done` autoconcedido desactiva
justamente la señal que debía detectar que faltaba la revisión: el gate se
valida a sí mismo.

**Alcance.** El código no está afectado — el veredicto técnico de este review es
independiente. Es una violación del orden del arnés, y el `done` queda
legitimado *a posteriori* por esta aprobación, pero se registró en el orden
equivocado.

**Acción sugerida (leader, no reviewer).** Dejar constancia en el cierre de
sesión, y reforzar en el prompt de handoff a Codex la prohibición explícita de
tocar `feature_list.json`, `STATUS.md` y `progress/history.md`: el implementador
reporta en `progress/impl_<feature>.md` y para ahí.

### H2 — La spec aprobada por humano fue editada por el implementador — **MEDIA (proceso, C6)**

**Evidencia.** `679e659 docs(auth-forgot-password): trace R13 and align
containment check` modifica `specs/auth-forgot-password/requirements.md:386`,
un fichero con `status: approved` y casilla humana firmada el 2026-08-28.

**Por qué importa.** C6 exige que *"ningún requisito fue modificado después de
la aprobación sin pasar de nuevo por el gate"*. La spec es el contrato del
handoff por disco; si el implementador puede reescribirla, el gate humano deja
de ser un gate. El agravante potencial es evidente: la línea editada es
justamente **el comando con el que el reviewer comprueba la contención** — un
implementador podría ensanchar el regex para ocultar ficheros fuera de alcance.

**Verificación del contenido — el cambio es legítimo.** Lo comprobé sin
apoyarme en el regex (ver §Contención R13): el diff es de una línea, añade solo
`forgot-password|` y `reset-password|`, y los cuatro ficheros que esas dos
alternativas dejan de señalar son **los ítems 9, 10, 13 y 14 escritos en la
allowlist de la misma spec**. La allowlist normativa no se tocó. El mapeo
ítem-por-ítem de los 41 ficheros del diff da correspondencia exacta. **No se
escondió ningún fichero fuera de alcance.**

**Alcance.** Sustantivamente inocuo, procedimentalmente incorrecto. El
implementador debió reportar la errata en `impl_<feature>.md` y dejar que el
humano la ratificara, en vez de corregirla él. Que la corrección fuera correcta
esta vez no valida el mecanismo.

**Acción sugerida.** Ratificación humana de una línea antes del merge de la PR
#93: confirmar la corrección del regex de R13. Es una formalidad — el contenido
ya está verificado aquí — pero cierra el hueco de C6.

### H3 — El rojo de R12 incluye el schema, no solo el test — **BAJA (informativo)**

**Evidencia.** `64230ee` (rojo de R12) toca cuatro ficheros: además del spec,
añade `password-reset-tokens.schema.ts` y la línea del barrel `index.ts`.
Es el único de los 13 rojos que no es test-puro.

**Valoración: aceptable.** El test importa `passwordResetTokens` y llama a
`getTableConfig()`, así que sin el schema no compilaría siquiera. Y el rojo es
genuino: verifiqué que `0015_auth_password_reset_tokens.sql` **no existe** en
`64230ee`, y el test lo lee del disco con `readMigration0015()` → falla seguro.
No es un commit monolítico ni oculta implementación de negocio.

### H4 — El "verde" de R13 es un commit `test(...)`, no `feat(...)` — **BAJA (informativo)**

**Evidencia.** `562b8a5 test(auth-forgot-password): verify e2e isolation and
containment (R13)` toca `password-reset-tokens.schema.spec.ts`,
`docs/verification.md` y el reporte de implementación. C5 pide commits
`feat(<scope>): <desc> (R-ids)`.

**Valoración: aceptable.** R13 es un requisito de regresión y contención: no
tiene código de producción que añadir, su "implementación" es que todo lo demás
siga verde. El prefijo `test(` describe el commit honestamente.

**Comprobación anti-trampa.** Revisé el cambio a `password-reset-tokens.schema.spec.ts`
en ese commit por si debilitaba una aserción para forzar el verde. **No lo
hace**: son reflows de Prettier. La aserción
`expect(sql).toContain('CREATE INDEX "password_reset_tokens_user_id_idx"')` se
conserva íntegra, solo pasa de tres líneas a una.

### H5 — R-ids duplicados dentro de `auth.controller.spec.ts` — **BAJA (deuda de arnés)**

**Evidencia.** El fichero contiene ahora `describe('R1: …')`, `R2`, `R3` y `R5`
**dos veces**: una serie de `auth-registration` (líneas 160, 173, 197, 229) y
otra de `auth-forgot-password` (líneas 413, 425, 447, 471). `auth-login-me`
resolvió el mismo choque desambiguando: `describe('R1 (auth-login-me): …')`
(línea 352).

**Valoración: no imputable al implementador.** Los nombres exactos venían
**fijados literalmente en la spec aprobada** (`requirements.md:151, 165, 180,
212`), y la spec ordena copiarlos sin reescribir. Codex cumplió.

**Alcance.** Los describes se distinguen por el endpoint en el texto, así que
hoy no hay ambigüedad práctica. Pero un grep futuro de `R1:` en ese fichero
devuelve dos features distintas, que es justo lo que la convención de
`auth-login-me` evitaba. Merece una nota de backlog para que `spec_author`
aplique el sufijo `(<feature>)` cuando un R-id aterrice en un fichero de test
compartido.

---

## Comandos ejecutados

| # | Comando | Exit | Resultado |
|---|---|---|---|
| 1 | `docker ps` | 0 | `pet-tracker-postgres` (healthy) y `pet-tracker-localstack` (healthy) ya arriba; no hizo falta `docker compose up -d` |
| 2 | `git branch --show-current` | 0 | `feature/44-auth-forgot-password` (no se cambió de rama en toda la revisión) |
| 3 | `git log --oneline -40` | 0 | 39 commits de la feature; historial rojo→verde visible |
| 4 | `git diff --name-only origin/main...HEAD` | 0 | 41 ficheros |
| 5 | `git diff --stat origin/main...HEAD` | 0 | 41 ficheros, +5286 / -5 |
| 6 | `git show 679e659 -- specs/…/requirements.md` | 0 | edición de 1 línea al regex de R13 (H2) |
| 7 | `git diff --name-only origin/main...HEAD \| grep -vE '<regex ORIGINAL aprobado>'` | grep 0 | 4 rutas — ítems 9, 10, 13, 14 de la allowlist (falsos positivos) |
| 8 | `git diff --name-only origin/main...HEAD \| grep -vE '<regex CORREGIDO>'` | grep 1 | **salida vacía** — contención limpia |
| 9 | `git show --stat` × 13 rojos | 0 | 12/13 test-puros; R12 añade schema (H3) |
| 10 | `git merge-base --is-ancestor <rojo> <verde>` × 13 | 0 ×13 | los 13 rojos preceden a su verde |
| 11 | `git cat-file -e <rojo>:<impl>` × 4 | 1 (missing) ×3 | impl ausente en los rojos de R1, R5, R12 |
| 12 | `grep -E "^\s*(describe\|it)\("` sobre los 6 ficheros de test | 0 | los 13 describes de traceability existen literalmente |
| 13 | `git diff origin/main...HEAD -- <3 ficheros modificados de auth>` | 0 | `verification-token.ts`, `user.repository.ts`, `user.drizzle.repository.ts`: estrictamente aditivos |
| 14 | `git diff --name-only … -- src/db/migrations/ \| grep -vE '0015\|_journal'` | grep 1 | vacío — ninguna migración previa tocada |
| 15 | `grep -c '"in_progress"' feature_list.json` | 0 | `0` |
| 16 | barrido de secretos sobre líneas `+` del diff | 0 | solo placeholders de `docs/verification.md` |
| 17 | **`./init.sh`** | **0** | **todo verde** (salida abajo) |

## Output de `./init.sh`

Ejecutado por el reviewer, no copiado del reporte. Exit code **0**.

```text
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
✅ Sin features en progreso (sesión limpia)
✅ STATUS.md sincronizado con feature_list.json
→ Build...
✅ Build exitoso
→ Ejecutando tests...
Test Suites: 156 passed, 156 total          # backend
Tests:       1198 passed, 1198 total
Test Suites: 2 passed, 2 total              # infra
Tests:       14 passed, 14 total
Test Suites: 50 passed, 50 total            # mobile
Tests:       561 passed, 561 total
✅ Tests pasados
→ Tests e2e...
Test Suites: 3 skipped, 23 passed, 23 of 26 total
Tests:       8 skipped, 349 passed, 357 total
Time:        85.468 s
✅ Tests e2e pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.

INIT_EXIT=0
```

**Correspondencia con el reporte del implementador.** Las cifras coinciden
**exactamente** con las declaradas en `progress/impl_auth-forgot-password.md`
(156/1198 backend, 2/14 infra, 50/561 móvil, 23 suites y 349 tests e2e con 8
omitidos). El reporte no infló resultados.

**Sin regresiones.** Ninguna suite preexistente falla. El único aviso no
bloqueante es el ya conocido del AWS SDK v3 (Node >= 22 a partir de enero de
2027; el entorno corre Node 20.20.2), preexistente y ajeno a esta feature. En
la salida e2e aparece además un `ri_ReportViolation` sobre
`pet_users_user_id_users_id_fk` proveniente de una suite ajena que ejercita el
camino negativo de una FK: es log esperado de un test que pasa, no un fallo
(las 23 suites e2e están en verde).

---

## Veredicto

**APROBADO.**

El código cumple la spec R1–R13, respeta las capas de `docs/architecture.md`,
no toca nada fuera de la allowlist de R13, no introduce dependencias,
variables de entorno, recursos AWS ni secretos, y deja DA1/DA2 abiertas tal
como la spec exige. El historial TDD es auténtico y auditado commit a commit —
el fallo de #19 no se repitió. Los controles de seguridad están cubiertos por
tests ejecutables, incluidos los bordes que suelen quedar fuera (`expires_at ==
now`, token usado *y* expirado, no intercambiabilidad de tokens en ambas
direcciones). `./init.sh` da exit 0 re-ejecutado por el reviewer.

**Condición formal antes del merge de la PR #93** (no bloquea el código): que
el humano ratifique la corrección del regex de R13 descrita en H2, para cerrar
el hueco de C6. Es una línea.

**Para el leader:** H1 y H2 son violaciones del orden del arnés cometidas por
el implementador y ya irreversibles desde aquí. El `done` de #44 queda
legitimado por este veredicto, pero se registró antes de existir. Conviene
endurecer el prompt de handoff a Codex en dos puntos: **no tocar
`feature_list.json` / `STATUS.md` / `progress/history.md`**, y **no editar
`specs/**` una vez aprobada** — reportar la errata y esperar.
