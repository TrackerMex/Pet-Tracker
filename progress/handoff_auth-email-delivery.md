# Handoff a Codex CLI — #58 `auth-email-delivery`

> Escrito por el leader el 2026-09-02, tras la aprobación humana de la spec
> (commit `0bb05f6`, DA1 y DA2 cerradas). El humano pega el prompt en Codex CLI.

## Prompt

```
Feature: auth-email-delivery (#58), branch: feature/58-auth-email-delivery
Antes de nada: git checkout feature/58-auth-email-delivery && git pull
(La feature se renumeró #55→#58 el 2026-09-02; si ves restos de "#55" en tu
contexto previo, la fuente de verdad es la spec en esta branch.)

Spec aprobada: specs/auth-email-delivery/requirements.md (status: approved)
Lee también: design.md (D1-D11) y tasks.md — R1-R12, no hay decisiones
abiertas (DA1/DA2 cerradas por el humano; §Contexto fijo no se reabre).

Feature de BACKEND PURO (NestJS + pnpm): no cargues skills expo, no toques
mobile-pet-tracker/, infra/, src/db/ ni src/workers/.

Alcance: adaptadores Resend para los dos puertos de email de auth
(src/modules/auth/infrastructure/email/), selección por EMAIL_ENABLED en
auth.module.ts, fallo de arranque si falta config, contención del fallo del
proveedor (R5/R6), logs sin token ni API key (R7), rate limiting (R8-R10,
guard nuevo email-rate-limit.guard.ts), y regresión de #44 intacta (R12).
Los ficheros exactos por requisito están en tasks.md — síguelos literalmente.

Reglas críticas:
  - TDD POR REQUISITO con historial rojo→verde (C4): por cada R-id, commit de
    test rojo ANTES que su implementación (como los 13 rojos de #44). Registra
    cada salida roja en el reporte antes del verde correspondiente.
    Meter varios R-ids con su implementación en un solo commit = rechazo.
  - auth.controller.spec.ts es COMPARTIDO: los describes nuevos llevan el
    sufijo (auth-email-delivery) para no duplicar R-ids (patrón auth-login-me).
  - R11: RESEND_API_KEY vive SOLO en el entorno. Jamás en un commit, jamás en
    .env.example con valor real. Las env vars nuevas (EMAIL_ENABLED,
    RESEND_API_KEY, RESEND_FROM, …) se documentan en docs/conventions.md
    §Variables de entorno y en .env.example (placeholder) en el mismo cierre.
  - Ningún test hace red real: el fetch a api.resend.com se mockea. No crees
    cuenta de Resend, no toques DNS, no envíes correo — eso son los gates
    humanos G1-G4 y quedan FUERA de tu alcance.
  - Actualizar specs/auth-email-delivery/traceability.md tras cada verde (es
    lo único de specs/ que editas; si crees que la spec tiene un error, PARA
    y repórtalo en el reporte de impl, no la edites).
  - Commitea en la branch; NO pushees — el leader pushea tras el veredicto
    del reviewer.
  - PROHIBIDO tocar feature_list.json y progress/current.md.

Criterios de aceptación: R1-R12 de requirements.md.
Cierre: pnpm --filter backend-pet-tracker test, ./init.sh en la raíz,
git diff --stat main...HEAD contra la contención de tasks.md §Regresión;
salida completa en progress/impl_auth-email-delivery.md. Al terminar avisa y
para: los gates G1-G4 (dominio en Resend, DNS, API key, envío real E2E) los
hace el humano y el reviewer no aprueba sin ellos por escrito.
```

## Después del handoff (leader)

1. Mientras Codex implementa: no tocar `backend-pet-tracker/`.
2. Humano confirma fin → humano ejecuta G1–G4 (Resend + DNS Hostinger + envío
   real, §Gates humanos de requirements.md) y los registra por escrito en
   `progress/` (p. ej. en `progress/impl_auth-email-delivery.md`).
3. Con G1–G4 escritos → lanzar `reviewer` (su veredicto exige esa evidencia).
4. Veredicto aprobado → push + `gh pr create`; el humano mergea.

## Corrección R6 autorizada por el leader (2026-09-02)

Codex detectó una contradicción interna en la spec y paró (correcto; detalle
en `progress/impl_auth-email-delivery.md` §Bloqueo de spec en R6):
`requirements.md:275` pide que el e2e de R6 sobreescriba `PASSWORD_RESET_SENDER`
con un doble cuyo `send()` lanza, pero eso deja fuera al adaptador Resend
donde D5 coloca la contención de R5 (`send()` nunca rechaza); el `await` de
application propaga y el endpoint devuelve 500. Hacer pasar ese test exigiría
un try/catch en application o controller — prohibido por R6/R12 y D5.

**Autorización**: el test de R6 (e2e y su espejo unitario) se construye en la
frontera coherente con D5 — se inyecta el `ResendPasswordResetSender` REAL
con un `ResendClient` cuyo doble de `fetch` rechaza; el fallo del proveedor
ocurre dentro del adaptador, R5 lo contiene y el endpoint conserva
`200 { requested: true }` sin tocar `src/modules/auth/application/` ni el
controller. La intención de R6 (el fallo del proveedor no cambia ni el código
ni la forma de la respuesta) queda intacta; solo cambia el mecanismo del
doble. La comparación estructural contra el caso "cuenta inexistente"
(requirements.md:270-272) se mantiene tal cual. La spec aprobada NO se edita;
esta corrección vale como fuente de verdad para R6 y el reviewer la validará
contra este apartado.
