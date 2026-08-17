# Sesión activa

> Este archivo describe el estado de la sesión en curso.
> Al cerrar la sesión, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

- **feature**: `test-dev-resource-isolation` (#28, P2)
- **branch**: `feature/28-test-dev-resource-isolation`
- **inicio**: 2026-08-17
- **estado**: spec aprobada por humano el 2026-08-17, esperando a Codex CLI
- **spec**: `specs/test-dev-resource-isolation/requirements.md` (14 requisitos, R1–R14)
- **implementador**: Codex CLI en terminal aparte (no el subagente `implementer`)

## Plan que implementa Codex

Los e2e y el entorno de desarrollo comparten los mismos recursos de LocalStack.
Se deriva un sufijo de entorno para los nombres, de modo que cada juego sea
suyo:

1. **R1, R2, R3** — `resolveResourceSuffix` y la tabla de los diez nombres.
   `NODE_ENV=test` da sufijo `'test'` en modo local; `AWS_MODE=aws` fuerza `''`
   y **no aborta** (§D5).
2. **R5, R4** — `constants.ts` se queda con literales `const` (§D2), y los
   nombres viajan por el token inyectable `AWS_RESOURCE_NAMES`: cero
   `process.env` en `src/`. Ocho consumidores de producción migrados.
3. **R6, R7, R8** — `provision:local` crea los dos juegos en una invocación,
   sigue siendo idempotente, y la guarda que rechaza `AWS_MODE=aws` sigue
   intacta.
4. **R9, R10** — los e2e resuelven nombres de test, con URLs distintas, y la
   cadena de ingesta no mueve las colas de desarrollo.
5. **R11, R12, R13, R14** — guarda anti-regresión sobre los diez literales, el
   stack CDK sin cambios, y el procedimiento manual documentado.

El orden de ejecución vive en `specs/test-dev-resource-isolation/tasks.md` y no
es el orden numérico de los R-ids: R1 → R2 → R3 → R5 → R4 → R6 → R7 → R8 → R9
→ R10 → R11 → R12 → R13 → R14.

## Riesgo económico a vigilar en la revisión

La stack `PetTrackerDev` está desplegada en `us-east-1` con los nombres **sin
sufijo**. Si el sufijo de test se filtrase al modo `aws`, el backend hablaría
con colas inexistentes, o un `cdk deploy` crearía un juego duplicado de
recursos reales. Cerrado por tres vías independientes: R3 (el modo manda sobre
`NODE_ENV`), R8 (`run-provisioning.ts:39` rechaza `AWS_MODE=aws`) y R12 (el
stack CDK no importa nada de `resource-names.ts`).

## Excepciones aprobadas en el gate humano (2026-08-17)

- **Toca un test de #20**: una línea en `src/aws/cdk-dev-stack-docs.spec.ts:19`.
  La intención de #20 R3 se conserva íntegra — la línea 18 no se toca.
- **R5, R8 y R12 nacen verdes**: son guardas de regresión y no admiten
  rojo→verde. Declarado como excepción explícita a C4 en `traceability.md`.

## Vigilar en el cierre

Codex cerró #25 él mismo sin veredicto del `reviewer` (commit `9ea58cd`). El
handoff de esta feature se lo prohíbe explícitamente; si vuelve a pasar, se
revierte igual antes de revisar.

## Siguiente paso

El humano corre Codex CLI con el prompt de handoff. Mientras tanto el `leader`
no toca `backend-pet-tracker/` — un solo escritor sobre el working tree.
