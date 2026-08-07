---
feature: "alerts-center-notifier"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[alerts-center-notifier]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Ver [[design]] para el
> orden de capas sugerido — no es obligatorio implementar los R en orden
> numérico, pero el orden natural de dependencias es:
>
> ```
> (1) schema + migración 0008        → R1, R2
> (2) push tokens HTTP               → R3-R6
> (3) worker notifier                → R7-R15
> (4) centro de alertas HTTP         → R16-R22
> (5) no regresión de #12 con acked  → R23   ← ejercita (1)+(4) contra el worker de #12
> (6) time_away_minutes              → R24-R28
> (7) cierre: env + no regresión     → R29, R30
> ```
>
> R2 y R23 son las dos caras de la misma decisión (**D1**): conviene hacerlas
> seguidas y verificar que la suite de `alerts-engine` (#12) sigue verde antes
> de continuar.

## R1 — Tabla `push_tokens` (columnas, FK, UNIQUE, CHECK, índice)

- [x] (1) Escribir test que falla para R1
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R2 — Índice anti-spam de `alert_events` redefinido a `WHERE status <> 'closed'` (D1)

- [x] (1) Escribir test que falla para R2
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R3 — `POST /v1/me/push-tokens`: upsert idempotente por `expo_token`

- [x] (1) Escribir test que falla para R3
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R4 — Validación zod del body (formato de token, platform, `strictObject` → 400)

- [x] (1) Escribir test que falla para R4
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R5 — `DELETE /v1/me/push-tokens`: 204 idempotente, solo la fila propia

- [x] (1) Escribir test que falla para R5
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R6 — Ambas rutas exigen JWT (401 sin `@Public()`)

- [x] (1) Escribir test que falla para R6
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R7 — Drenado de `notifications` y parseo zod del contrato v1 (malformado → sin delete)

- [x] (1) Escribir test que falla para R7
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R8 — Destinatarios: push tokens de todos los miembros activos de la mascota

- [x] (1) Escribir test que falla para R8
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R9 — `PUSH_ENABLED != 'true'`: log estructurado `{wouldSend}`, sin llamar a Expo

- [x] (1) Escribir test que falla para R9
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R10 — Sin tokens registrados: log y fin, mensaje borrado, cero excepciones

- [x] (1) Escribir test que falla para R10
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R11 — `PUSH_ENABLED='true'`: `ExpoPushSender` (isExpoPushToken, chunks, envío)

- [x] (1) Escribir test que falla para R11
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R12 — Ticket `DeviceNotRegistered` borra esa fila de `push_tokens`; otro error no

- [x] (1) Escribir test que falla para R12
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R13 — Ningún log ni respuesta HTTP contiene el token completo

- [x] (1) Escribir test que falla para R13
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R14 — Error no controlado: sin delete, sin envenenar el resto del lote

- [x] (1) Escribir test que falla para R14
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R15 — Scheduler gateado por `NOTIFIER_ENABLED` (+ `NODE_ENV=test`)

- [x] (1) Escribir test que falla para R15
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R16 — `GET /v1/alerts`: todas mis mascotas en una lista, orden `opened_at DESC, id DESC`

- [x] (1) Escribir test que falla para R16
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R17 — Filtro `?status=`; valor inválido o clave desconocida → 400

- [x] (1) Escribir test que falla para R17
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R18 — Paginación keyset `{items, nextCursor}`, sin duplicados ni saltos

- [x] (1) Escribir test que falla para R18
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R19 — Aislamiento: jamás una alerta de una mascota ajena; sin membresías → lista vacía

- [x] (1) Escribir test que falla para R19
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R20 — `POST /v1/alerts/:id/ack`: `open` → `acked` + `acked_at`, 200 (ack ≠ closed)

- [x] (1) Escribir test que falla para R20
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R21 — Máquina de estados del ack (idempotente, 409 sobre `closed`, 404 genérico)

- [x] (1) Escribir test que falla para R21
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R22 — Auditoría `alert.ack` solo cuando el ack cambia el estado

- [x] (1) Escribir test que falla para R22
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R23 — No regresión de #12 con `acked`: anti-spam sigue y el regreso sigue cerrando

- [x] (1) Escribir test que falla para R23 (escenario `exit → ack → exit → enter`)
- [x] (2) Implementación mínima que lo pasa (filtro de `closeOpenAlert`, D1)
- [x] (3) Refactor con tests verdes — **la suite completa de #12 debe seguir verde sin editar sus tests**

## R24 — Geocerca de referencia (la más antigua) y `NULL` si la mascota no tiene ninguna

- [x] (1) Escribir test que falla para R24
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R25 — Fórmula del solape con el día local (función pura `computeTimeAwayMinutes`)

- [x] (1) Escribir test que falla para R25
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R26 — Cruce de medianoche y eventos abiertos (con la aproximación documentada en JSDoc)

- [x] (1) Escribir test que falla para R26
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R27 — `NULL` (no medible) distinto de `0` (medido, nunca salió)

- [x] (1) Escribir test que falla para R27
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R28 — Upsert con `coalesce(excluded, actual)`: R11 de #10 sigue verdadera

- [x] (1) Escribir test que falla para R28
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R29 — `PUSH_ENABLED` y `NOTIFIER_ENABLED` documentadas y leídas vía `ConfigService`

- [x] (1) Escribir test que falla para R29
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R30 — No regresión: límites de archivos tocados y una sola dependencia nueva

- [x] (1) Escribir test que falla para R30 (o verificación con `git diff main --name-only` + `git diff main -- backend-pet-tracker/package.json`)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes
