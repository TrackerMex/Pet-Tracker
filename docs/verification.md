# Verification — Cómo demostrar que una feature funciona

> Antes de declarar cualquier feature como `done`, el implementer debe verificar
> todos los puntos de esta guía. El reviewer repetirá los pasos críticos de
> forma independiente.

---

## Verificación base (toda feature)

Los comandos exactos viven en `init.config.sh` de este proyecto.

### 1. Build limpio

```bash
$BUILD_CMD
# Debe terminar sin errores (ver init.config.sh para el comando real)
```

### 2. Tests sin regresión

```bash
$TEST_CMD
# Todos los tests previos deben seguir pasando
```

### 3. Init verde

```bash
./init.sh
# Debe terminar con "✅ Todo verde"
```

---

## Disciplina TDD

Esta es la regla central de verificación de este harness, no una sugerencia:

1. **El implementer escribe el test ANTES que el código.** Por cada requisito
   `R<n>` de `specs/<feature>/requirements.md`: primero un test que falla
   (rojo), después la implementación mínima que lo pasa (verde), después
   refactor manteniendo los tests en verde. Esto es exactamente el checklist
   de `specs/<feature>/tasks.md`.
2. **Cada test nombra su requisito.** Convención: `describe('R1: ...', ...)`
   o el equivalente idiomático del framework de test de `NestJS + TypeScript + pnpm + LocalStack (AWS local)`
   (documentado en `docs/conventions.md`).
3. **El reviewer verifica en el diff/historia** que los tests existen y
   nombran los R-ids correctos — no le basta con que "algo" tenga cobertura.
   Si una feature no tiene tests que nombren sus requisitos, el reviewer
   **rechaza**, sin excepción.
4. **`specs/<feature>/traceability.md` se actualiza en cada commit**, nunca
   al final: cada fila pasa de "pendiente" a `test::nombre` + `hash commit`
   tan pronto ese requisito queda verde.

---

## Verificación por feature (a rellenar por el proyecto)

<!-- Cuando el proyecto tenga features concretas, añade aquí un bloque de
     verificación manual por feature (curl, comandos de CLI, pasos de UI),
     análogo a:

### Feature <id> — <nombre>

```bash
# pasos de verificación manual específicos de esta feature
```
-->

### Feature 19 — aws-real-credentials

1. Inicia una sesión válida con `aws login`.
2. En el `.env` raíz, comenta `AWS_ACCESS_KEY_ID=test` y
   `AWS_SECRET_ACCESS_KEY=test`. La cadena del SDK prioriza esas variables
   sobre la sesión y la suite falla de forma explícita si siguen presentes.
3. Desde la raíz del repositorio, ejecuta:

```bash
AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e --runInBand test/aws-real-smoke.e2e-spec.ts
```

Resultado esperado: una suite con dos tests verdes. La única llamada remota es
`ListQueues`; no crea ni modifica recursos. Después de verificar, restaura las
dos credenciales dummy para seguir usando LocalStack.

---

## Notas para el implementer

- No declares done solo porque el build pasa. Prueba los casos edge (errores,
  permisos, condiciones límite).
- Los scripts de verificación manual (curl, CLI, etc.) no sustituyen a los
  tests automáticos exigidos por la disciplina TDD.
- Si alguna verificación falla, documenta por qué en `progress/impl_<feature>.md`
  antes de reportar al leader.
