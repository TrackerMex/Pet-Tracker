---
feature: "localstack-provisioning"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[localstack-provisioning]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## R1 — Clientes AWS SDK v3 construidos con endpoint desde ConfigService (app) / env (script standalone)

- [ ] (1) Escribir test que falla para R1 (unitario sobre `src/aws/aws-clients.ts`:
      dado un `ConfigService` mockeado con `AWS_ENDPOINT_URL=http://localhost:4566`,
      el cliente construido tiene `config.endpoint` resuelto a ese valor)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Abortar si falta AWS_ENDPOINT_URL

- [ ] (1) Escribir test que falla para R2 (unitario/integración del script:
      con `AWS_ENDPOINT_URL` sin definir, `provision-local.ts` lanza/termina
      con error antes de invocar cualquier API de AWS SDK)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Credenciales y región desde env, sin literales hardcodeados

- [ ] (1) Escribir test que falla para R3 (test estático: grep/lint check
      o test unitario que falla si `AWS_REGION`/credenciales aparecen como
      literal en `src/aws/` o en el script)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Primera corrida crea los 4 recursos y sale con código 0

- [ ] (1) Escribir test que falla para R4 (test de integración contra
      LocalStack real en CI/local: ejecutar el script sobre un LocalStack
      limpio, verificar exit code 0 y presencia de los 4 recursos)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Segunda corrida es idempotente (no falla, no duplica)

- [ ] (1) Escribir test que falla para R5 (test de integración: ejecutar el
      script dos veces seguidas, verificar exit code 0 en ambas y que el
      conteo de recursos no cambia entre corridas)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Las 4 colas SQS existen con los nombres correctos

- [ ] (1) Escribir test que falla para R6 (test de integración: tras correr
      el script, `ListQueuesCommand` contra LocalStack devuelve URLs que
      contienen `positions-raw`, `positions-raw-dlq`, `notifications`,
      `notifications-dlq`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — positions-raw tiene RedrivePolicy hacia positions-raw-dlq

- [ ] (1) Escribir test que falla para R7 (test de integración:
      `GetQueueAttributesCommand` con `RedrivePolicy` sobre `positions-raw`
      contiene el ARN de `positions-raw-dlq` y un `maxReceiveCount` numérico)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — notifications tiene RedrivePolicy hacia notifications-dlq

- [ ] (1) Escribir test que falla para R8 (test de integración: idéntico a
      R7 mutatis mutandis sobre `notifications`/`notifications-dlq`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Orden de creación: DLQ antes que cola principal

- [ ] (1) Escribir test que falla para R9 (unitario: espiar el orden de
      llamadas `CreateQueueCommand` del cliente SQS mockeado y verificar
      que cada `-dlq` se crea antes que su cola principal)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Tabla DynamoDB positions con pk/sk correctos

- [ ] (1) Escribir test que falla para R10 (test de integración:
      `DescribeTableCommand` sobre `positions` muestra `KeySchema` con `pk`
      HASH y `sk` RANGE, y `AttributeDefinitions` con los tipos S/N
      correspondientes)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — TTL habilitado sobre expires_at

- [ ] (1) Escribir test que falla para R11 (test de integración:
      `DescribeTimeToLiveCommand` sobre `positions` muestra
      `AttributeName: expires_at` y `TimeToLiveStatus: ENABLED`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Bucket S3 de media existe

- [ ] (1) Escribir test que falla para R12 (test de integración:
      `ListBucketsCommand` contra LocalStack incluye el bucket de media)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Bucket S3 sin acceso público

- [ ] (1) Escribir test que falla para R13 (test de integración:
      `GetPublicAccessBlockCommand` sobre el bucket muestra los 4 flags de
      bloqueo en `true`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — Bus EventBridge pet-tracker existe

- [ ] (1) Escribir test que falla para R14 (test de integración:
      `ListEventBusesCommand` contra LocalStack incluye un bus
      `Name: pet-tracker`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Sin literales de endpoint AWS real en el código

- [ ] (1) Escribir test que falla para R15 (test estático: script/test que
      falla si `grep -rn "amazonaws.com"` sobre
      `backend-pet-tracker/scripts/provision-local.ts` y
      `backend-pet-tracker/src/aws/` devuelve algún resultado)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — Fallo claro si LocalStack no está levantado

- [ ] (1) Escribir test que falla para R16 (test de integración: apuntar
      `AWS_ENDPOINT_URL` a un puerto sin nada escuchando, ejecutar el
      script, verificar mensaje de error identificable y exit code != 0)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R17 — STATUS.md documenta cómo arrancar y verificar

- [ ] (1) Escribir "test" que falla para R17 (verificación documental: un
      check —manual o script simple de CI de docs— confirma que
      `pnpm run provision:local` y `aws --endpoint-url=http://localhost:4566
      sqs list-queues` aparecen como texto en `STATUS.md`)
- [ ] (2) Implementación mínima que lo pasa (editar `STATUS.md`)
- [ ] (3) Refactor con tests verdes (revisión de redacción, sin cambiar el
      contenido verificado)
