# Handoff a Codex CLI — health-weights (#15)

> Generado por el `leader` el 2026-08-11, tras el gate humano.
> El humano copia el bloque de abajo en su terminal de Codex CLI.
> Claude no ve el output de Codex: el intercambio es por disco
> (`progress/impl_health-weights.md`).

---

```
Feature: health-weights, id 15, branch: feature/15-health-weights (ya creada, ya estás en ella)
Spec aprobada por humano: specs/health-weights/requirements.md (status: approved, 10 requisitos R1..R10)
Lee también, antes de escribir nada: specs/health-weights/design.md y specs/health-weights/tasks.md

La spec es autosuficiente y todas sus decisiones abiertas están cerradas por escrito.
Si encuentras una contradicción o algo imposible, NO improvises una salida: documenta
el bloqueo en progress/impl_health-weights.md y para. Eso es lo que se hizo en #21 y
fue la decisión correcta.

## Qué implementar

Registro de peso de una mascota, extendiendo el módulo existente
backend-pet-tracker/src/modules/health/ (lo creó #14, no crees un módulo nuevo):

- tabla `weights` + migración nueva
- POST /v1/pets/:petId/weights → 201, inserta y actualiza pets.current_weight_kg
  solo si es la medición más reciente
- GET /v1/pets/:petId/weights?limit= → historial ordenado con `variation`

Los detalles exactos (columnas, tipos, shape de respuesta, constantes, semántica
de `variation`, comportamiento ante medición retroactiva y ante empate de fecha)
están en requirements.md y design.md. No los reinventes ni los "mejores".

## Reglas críticas

- Arquitectura: docs/architecture.md (capas domain / application / infrastructure,
  regla de dependencia). El módulo health ya tiene la estructura: sigue la de vaccines.
- Convenciones: docs/conventions.md (naming, errores, DTOs, tests, variables de entorno).
- TDD por requisito, según specs/health-weights/tasks.md: test rojo → verde → refactor.
- **UN COMMIT POR REQUISITO COMO MÍNIMO, CON EL TEST ROJO ANTES QUE SU
  IMPLEMENTACIÓN.** El historial de git tiene que mostrar el patrón rojo→verde por
  R-id. Un único commit con implementación + tests + docs incumple C4 de
  CHECKPOINTS.md y es motivo de rechazo del reviewer. Esto pasó en #19: no lo repitas.
- Cada test nombra su requisito con el sufijo de feature:
  `describe('R<n> (health-weights #15): ...')`. El módulo health ya contiene R1..R13
  de #14; sin el sufijo, C4 no es verificable por grep.
- Actualiza specs/health-weights/traceability.md tras cada commit.
- No crees recursos AWS reales ni corras cdk deploy: eso lo hace el humano.

## Tres trampas concretas de esta feature

1. **La migración tiene que ser un archivo NUEVO (`0010_*.sql`).**
   `src/db/schema/health.schema.spec.ts:63` asevera que la migración `0009` NO
   contiene `CREATE TABLE "weights"`. Si editas `0009` en vez de generar una nueva,
   ese test se pone rojo y no es un falso positivo: es la protección funcionando.
   La migración nueva tampoco debe contener `ALTER TABLE "pets"` (R1).

2. **`weight_kg` es `numeric(5,2)` y el driver `pg` devuelve numeric como string.**
   El repo ya resuelve esto con conversión manual `String()` / `Number()` en el
   repositorio — mira `pet.drizzle.repository.ts:123` y `:152`. No metas
   `mode: 'number'` ni `setTypeParser`: no es el patrón vigente. La respuesta de la
   API expone `weightKg` como `number`, nunca como string (R2).

3. **`variation` se calcula sobre el historial completo, no sobre la página.**
   Con dos mediciones y `?limit=1`, el único elemento devuelto trae `variation` NO
   nula. La spec resuelve esto con una fila sonda `limit+1` (patrón de #13). Ver R5
   y design.md.

## Criterios de aceptación

Los 10 requisitos R1..R10 de specs/health-weights/requirements.md, cada uno con su
archivo de test asignado en tasks.md. Resumen:

  R1  tabla `weights`, índices, migración 0010 nueva
  R2  POST 201 con shape congelado {id, petId, weightKg, measuredAt, bodyCondition, variation}
  R3  current_weight_kg solo si es la más reciente (retroactiva no pisa; empate sí pisa)
  R4  insert + update de pets en una única transacción
  R5  historial ordenado measured_at DESC, id DESC, con `variation` (null en la más antigua)
  R6  ?limit= default 50, tope 100, inválido → 400
  R7  validación del body → 400 sin persistir; fecha futura con tolerancia de 1 día
      (MEASURED_AT_MAX_FUTURE_DAYS = 1; hoy → 201, hoy+1 → 201, hoy+2 → 400,
      sin fechas literales en los tests)
  R8  PetAccessGuard: mascota ajena o petId inválido → 404 en POST y GET
  R9  POST solo owner (403 para otros roles); GET cualquier miembro activo; 404 antes que 403
  R10 auditoría 'weight.create' tras commit; si la escritura falla, no audita

## Fuera de alcance (no lo hagas aunque lo veas)

- PATCH y DELETE de mediciones.
- Añadir cualquier clave a PetProfileResponse — es un contrato congelado de 24 claves
  aseverado en tres archivos de test. `weightVariation` en el perfil está
  explícitamente diferido.
- Tocar el comportamiento de POST/PATCH /v1/pets sobre `weightKg`. La divergencia
  entre perfil e historial es conocida y tiene su propia feature (#22 en
  feature_list.json). No la arregles aquí.
- Paginación por cursor.

## Antes de terminar

- `./init.sh` verde. Los e2e necesitan Docker: `docker compose up -d`. Si la primera
  corrida tras levantar Docker falla con un error de FK en `pet_users`, es la carrera
  de arranque conocida, no una regresión: repite con la infra ya caliente.
- specs/health-weights/traceability.md sin filas "pendiente".
- docs/data-model.md, fila `weights`: anotar la migración `0010`.
- Escribe el resultado en progress/impl_health-weights.md: qué commits, qué R-id cubre
  cada uno, salida de ./init.sh, y cualquier decisión que hayas tenido que tomar.
- No mergees a main y no abras el PR: eso es del humano.
```
