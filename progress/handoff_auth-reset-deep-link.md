# Handoff a Codex CLI — #59 `auth-reset-deep-link`

> Escrito por el leader el 2026-09-02, tras la aprobación humana de la spec
> (commit `5d1a62f`, incluida la decisión D5: página fallback estática sin
> API). El humano pega el prompt en Codex CLI.

## Prompt

```
Feature: auth-reset-deep-link (#59), branch: feature/59-auth-reset-deep-link
Antes de nada: git checkout feature/59-auth-reset-deep-link && git pull

Spec aprobada: specs/auth-reset-deep-link/requirements.md (status: approved)
Lee también: design.md (D1-D11) y tasks.md — R1-R12, sin decisiones abiertas
(§Contexto fijo no se reabre; si crees que la spec tiene un error, PARA y
repórtalo en progress/impl_auth-reset-deep-link.md, no la edites).

Feature MIXTA backend + móvil + hosting estático:
  - Backend (NestJS + pnpm): el correo de reset añade la URL
    https://<RESET_LINK_HOST>/reset-password?token=<token> (R1-R3). OJO: el
    token pelado SIGUE siendo el segundo párrafo del text — ResendClient.sanitize
    lo extrae de ahí; la URL va en párrafo posterior. resend-client.ts, la
    selección de adaptador y el rate limiting NO se tocan.
  - Móvil (mobile-pet-tracker/, isla bun + jest-expo): intent filters de App
    Links vía app.config.ts (R4), ruta src/app/reset-password.tsx en la RAÍZ
    (fuera de (auth) y (tabs)) + pantalla en src/screens/reset-password/ (R5,
    R6, R8), resetPassword en src/api/auth.ts (R7). Sigue docs/ui-guidelines.md
    y carga las skills del plugin expo (expo-overview primero; el plugin ya
    está instalado en tu CLI).
  - Hosting estático (hosting/, nuevo top-level): .well-known/assetlinks.json
    con placeholder REPLACE_WITH_DEV_BUILD_SHA256 (R9) y página fallback
    reset-password/index.html estática pura, sin ninguna petición de red (R10).
  - e2e backend R11: ningún GET consume el token (GETs 404; POST 200; segundo
    POST 400).

Propiedad de seguridad innegociable (R6/R10/R11): los clientes de correo
hacen prefetch de enlaces GET. Ningún GET puede consumir ni invalidar el
token — ni endpoint nuevo, ni fetch al montar la pantalla, ni red en la
página fallback. El token solo se consume en POST /v1/auth/reset-password.

Reglas críticas:
  - TDD POR REQUISITO con historial rojo→verde (C4): por cada R-id, commit de
    test rojo ANTES que su implementación. Registra cada salida roja en el
    reporte antes del verde. Varios R-ids con su implementación en un solo
    commit = rechazo.
  - Orden sugerido en tasks.md: R1→R3, R9→R10, R4, R7, R5→R6→R8, R11, R12.
  - Ficheros compartidos con #58: en resend-password-reset-sender.spec.ts el
    único assert que eliminas es not.stringContaining('http') del describe R1
    de #58 (mismo commit que tu R1 verde); en auth.module.spec.ts añades
    RESET_LINK_HOST al doble de config del describe R3 de #58 (mismo commit
    que tu R3 verde). Nada más de #58 se edita (allowlist en R12).
  - Describes nuevos en ficheros compartidos llevan sufijo
    (auth-reset-deep-link) para no duplicar R-ids.
  - RESET_LINK_HOST: host pelado sin esquema/path. El dominio real NUNCA entra
    al repo — .env.example (raíz y móvil) con placeholder, docs/conventions.md
    §Variables de entorno en el mismo cierre.
  - Ningún test hace red real ni resuelve DNS. No subas nada a Hostinger, no
    toques certificados, no corras builds de Android — eso son los gates
    humanos G1-G4 y quedan FUERA de tu alcance.
  - Actualizar specs/auth-reset-deep-link/traceability.md tras cada verde (lo
    único de specs/ que editas).
  - PROHIBIDO tocar feature_list.json y progress/current.md.
  - Al terminar CADA tramo del orden sugerido (R1-R3 | R9-R10 | R4-R8 | R11-R12):
    git push origin feature/59-auth-reset-deep-link. El push por tramo es
    obligatorio — en #58 el leader quedó ciego hasta el final por no pedirlo.

Criterios de aceptación: R1-R12 de requirements.md.
Cierre: suites de R12 (backend pnpm test + e2e, móvil bun run test,
app.config.test.ts, hosting-artifacts.test.ts, grep de contención vacío,
grep-clean de UI) + ./init.sh en la raíz, y resultado completo en
progress/impl_auth-reset-deep-link.md (plantilla: mira
progress/impl_auth-email-delivery.md).
```

## Notas para el leader (no van a Codex)

- Mientras Codex implementa: no tocar `backend-pet-tracker/`,
  `mobile-pet-tracker/` ni `hosting/`. Un solo escritor sobre el working tree.
- Al confirmar el humano que Codex terminó: leer
  `progress/impl_auth-reset-deep-link.md` y lanzar `reviewer` (C2-C7 +
  propiedad ningún-GET-consume + contención R12).
- Gates G1-G4 (traceability.md) los cierra el humano DESPUÉS de la
  implementación y ANTES del veredicto final: fingerprint SHA-256 del dev
  build (keytool, comando en docs/verification.md §Feature 59), subida de
  `hosting/` a Hostinger, `RESET_LINK_HOST` en los dos `.env`, smoke en dev
  build de Android abriendo el enlace real desde el correo (doble apertura).

---

## Adenda 1 — Desbloqueo de R3 (leader, 2026-09-02, tras `3628aee`)

Bloqueo confirmado: R3 (fail-fast en el constructor de
`ResendPasswordResetSender`) es incompatible con la allowlist de R12 tal
como estaba escrita. Dos consumidores preexistentes de #58 construyen
`new ResendPasswordResetSender(client)` sin host
(`auth.controller.spec.ts:470` y `test/auth-email-delivery.e2e-spec.ts:56`),
y el §Contexto fijo afirmaba erróneamente que el e2e «no se ve afectado».

**Corrección autorizada por escrito (opción 1 del reporte de impl, precedente
#58/#56 — la spec no se edita):**

- La allowlist de R12 queda AMPLIADA con exactamente estas dos ediciones
  mecánicas, y nada más de esos ficheros:
  - `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.spec.ts`
    línea ~470: `new ResendPasswordResetSender(client)` →
    `new ResendPasswordResetSender(client, 'reset.test')`
  - `backend-pet-tracker/test/auth-email-delivery.e2e-spec.ts` línea ~56:
    `new ResendPasswordResetSender(client)` →
    `new ResendPasswordResetSender(client, 'reset.test')`
- Host de prueba: `reset.test` (TLD reservado RFC 6761; ningún assert de #58
  inspecciona la URL en esos dos ficheros, así que el valor es inerte allí).
- La opción 2 (modo compatibilidad del constructor) queda RECHAZADA: vaciaría
  el fail-fast que R3/D3 exigen.
- El resto de reglas del handoff sigue intacto (TDD por R-id, push por tramo,
  sufijos de describe, nada de specs/ salvo traceability).

### Prompt de continuación para Codex

```
Continuación #59 auth-reset-deep-link, branch feature/59-auth-reset-deep-link.
Antes de nada: git pull.

Tu bloqueo de R3 está resuelto: lee la Adenda 1 de
progress/handoff_auth-reset-deep-link.md. Resumen: allowlist de R12 ampliada
con DOS ediciones mecánicas — pasar 'reset.test' como segundo argumento en
new ResendPasswordResetSender(client) de auth.controller.spec.ts (~470) y de
test/auth-email-delivery.e2e-spec.ts (~56). Nada más cambia en esos ficheros.
La opción de modo compatibilidad queda rechazada: el fail-fast del
constructor se implementa literal como pide R3.

Retoma desde tu commit rojo de R3 (d433535): implementación verde de R3
incluyendo esas dos ediciones en el MISMO commit, y sigue el orden del
handoff (R9→R10, R4, R7, R5→R6→R8, R11, R12). Registra en
progress/impl_auth-reset-deep-link.md que el typecheck y las suites de #58
quedan verdes tras el cambio. Push al cierre de cada tramo, como antes.
```
