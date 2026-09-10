---
feature: "e2e-audit-log-order-assert"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[e2e-audit-log-order-assert]]

> Rutas relativas a `backend-pet-tracker/`. Esta feature no crea tests
> nuevos: R1 y R2 se trazan al `it` existente de #14 que se corrige (renombrado
> para nombrar a #76, ver [[tasks]] R1); R3 y R4 son requisitos de
> verificación y se trazan a comandos y a las secciones del reporte de
> implementación / revisión. Codex actualiza esta tabla tras cada commit; el
> reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
> [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Requisitos

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `test/health-vaccines.e2e-spec.ts::R12: auditoria de mutaciones::'registra create/update/delete en orden cronologico y no audita PATCH vacio (e2e-audit-log-order-assert #76: R1,R2)'` — verde con `orderBy(asc(auditLog.at), asc(auditLog.id))` | pendiente (commit 1) |
| R2 | El mismo `it`, **rojo por aserción** con `orderBy(desc(...), desc(...))` (mutación no versionada) — evidencia en `progress/impl_e2e-audit-log-order-assert.md` §Mutación (R2) y en `progress/review_e2e-audit-log-order-assert.md` | pendiente (commit 2, solo evidencia) |
| R3 | Sin test nuevo — `git diff --name-only 5666b85...HEAD -- backend-pet-tracker/` = solo `test/health-vaccines.e2e-spec.ts`; `grep -n "orderBy" test/*.e2e-spec.ts` = `devices` + `health-vaccines`; sección §Barrido (R3) del reporte | pendiente (commit 2) |
| R4 | Sin test nuevo — 1 corrida de Codex + 3 corridas consecutivas del reviewer de `pnpm -C backend-pet-tracker run test:e2e` con el mismo `N` en `Tests: N passed`, más `env -u FORCE_COLOR bash ./init.sh` verde sin «se saltan los e2e» | pendiente (commit 2; corridas del reviewer en `progress/review_...md`) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(e2e-audit-log-order-assert): <desc> (R1)` /
`docs(e2e-audit-log-order-assert): <desc> (R2,R3,R4)` — ver [[tasks]] cabecera.

## Cobertura de los `acceptance_criteria` de `feature_list.json` #76

| # | Criterio de aceptación (abreviado) | Requisito(s) | Estado |
|---|---|---|---|
| 1 | La consulta del audit log ordena explícitamente por la columna cronológica real, no por el orden físico | R1 (`at` + desempate `id`, [[design]] D1) | pendiente |
| 2 | El assert deja de depender del índice: o se ordena de verdad, o se compara como conjunto | R1 (se ordena de verdad; el índice `[1]` pasa a ser legítimo, [[design]] D2) + R2 (la mutación prueba que el orden gobierna la aserción) | pendiente |
| 3 | Se barre el resto de los e2e buscando el mismo patrón y se reporta lo que aparezca | Barrido hecho en [[design]] D4 (un solo hallazgo: el de R1); R3 fija que el diff no toca nada más y clasifica el delta | pendiente |
| 4 | La suite e2e completa pasa varias veces seguidas, no una | R4 (3 corridas consecutivas del reviewer + `init.sh`) | pendiente |

## Tests de features anteriores actualizados, no borrados

> Una fila por cada test existente cuyo nombre, consulta o comportamiento
> esperado cambia. El reviewer rechaza si algún `it` de #14 desapareció del
> árbol sin aparecer aquí.

| Test | Feature dueña | Qué cambia y por qué | Commit |
|---|---|---|---|
| `test/health-vaccines.e2e-spec.ts::R12: auditoria de mutaciones::'registra create/update/delete y no audita PATCH vacio'` (línea 471 en `5666b85`) | #14 | (a) Nombre: pasa a `'registra create/update/delete en orden cronologico y no audita PATCH vacio (e2e-audit-log-order-assert #76: R1,R2)'` para nombrar esta feature (C4). (b) Consulta: gana `.orderBy(asc(auditLog.at), asc(auditLog.id))`. (c) Aserciones: **intactas** — las mismas dos `expect`, mismo orden esperado, mismo `rows[1].meta`. El `describe` `R12: ...` de #14 no cambia. | pendiente (commit 1) |

## Tests que deben quedar verdes SIN editarse

> Comprobación explícita del reviewer: si alguno de estos hizo falta tocarlo,
> el diseño se desvió de la spec.

- Todo `test/*.e2e-spec.ts` salvo `health-vaccines.e2e-spec.ts` — R3. En
  particular los que ya son order-safe y podrían tentar a «unificar»:
  `test/pet-lost-mode.e2e-spec.ts` (usa `expect.arrayContaining`, l. 197),
  `test/devices.e2e-spec.ts` (único `orderBy` previo, l. 192),
  `test/alerts-center-notifier.e2e-spec.ts` (helper `alertRows()`, l. 169,
  siempre guardado con `toHaveLength(1)`).
- El resto de `test/health-vaccines.e2e-spec.ts`: los describes `R2`-`R11`
  y `R13` de #14, los helpers y el `beforeAll`/`afterAll`, y, dentro de
  `R12`, todo lo que no sean las tres ediciones de [[tasks]] R1.
- Todo `src/**/*.spec.ts` — ninguno consulta la base; `src/` no cambia.
