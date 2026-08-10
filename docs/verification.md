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
AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-smoke.e2e-spec.ts
```

El `--` antes de `--runInBand` es obligatorio: sin él pnpm no reenvía los flags
a jest. En PowerShell no existe el prefijo `VAR=valor comando`, así que usa
Bash, o exporta `$env:AWS_MODE='aws'` en una línea aparte.

Resultado esperado: una suite con dos tests verdes, **sin `skipped`** — si la
suite aparece saltada, `AWS_MODE` no llegó al proceso. La única llamada remota
es `ListQueues`; no crea ni modifica recursos. Después de verificar, restaura
las dos credenciales dummy para seguir usando LocalStack.

### Feature 20 — aws-cdk-dev-stack

Estos pasos crean y usan recursos AWS reales. Los ejecuta el humano, en orden,
y registra cada resultado en `progress/impl_aws-cdk-dev-stack.md` con ARNs y
account-id redactados.

1. **R17 — Billing.** En la consola de AWS Billing, confirma que la cuenta del
   plan nuevo (creada después del 2025-07-15) cubre DynamoDB Standard
   provisionado hasta 25 RCU, 25 WCU y 25 GB. Registra también qué ocurre al
   agotar los créditos o al cumplirse la ventana de 6 meses antes de desplegar.
2. **R18 — Bootstrap.** Comenta `AWS_ACCESS_KEY_ID=test` y
   `AWS_SECRET_ACCESS_KEY=test` en el `.env` raíz, inicia una sesión válida con
   `aws login` y usa un principal con `iam:*`:

   ```bash
   pnpm -C infra exec cdk bootstrap aws://<accountId>/us-east-1 --termination-protection
   ```

   No añadas `--bootstrap-customer-key`.
3. **R19 — Primer deploy.** Con PowerUserAccess y la sesión anterior:

   ```bash
   pnpm -C infra exec cdk deploy PetTrackerDev
   ```

   Debe terminar en `CREATE_COMPLETE` con los 11 recursos de R13.
4. **R20 — Deploy idempotente.** Ejecuta de nuevo el mismo comando `cdk deploy`
   sin cambiar `infra/`. Debe reportar `no changes` y no actualizar la stack.
5. **R21 — Ingest real.** Desde Bash, ejecuta la suite específica:

   ```bash
   AWS_MODE=aws pnpm -C backend-pet-tracker run test:e2e -- --runInBand test/aws-real-ingest.e2e-spec.ts
   ```

   Debe quedar verde y **sin `skipped`**. En PowerShell, exporta primero
   `$env:AWS_MODE='aws'`. Al terminar, restaura las credenciales dummy y
   `AWS_MODE=local` para LocalStack.

Consecuencias de las políticas de borrado: si el bucket tiene objetos,
`cdk destroy` falla y hay que vaciarlo manualmente antes; la tabla retenida
sigue provisionada a 25/25 y consumiendo el cupo de la cuenta después de
destruir la stack, hasta que el humano la elimine por separado.

---

## Notas para el implementer

- No declares done solo porque el build pasa. Prueba los casos edge (errores,
  permisos, condiciones límite).
- Los scripts de verificación manual (curl, CLI, etc.) no sustituyen a los
  tests automáticos exigidos por la disciplina TDD.
- Si alguna verificación falla, documenta por qué en `progress/impl_<feature>.md`
  antes de reportar al leader.
