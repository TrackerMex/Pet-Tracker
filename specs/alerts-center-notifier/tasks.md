---
feature: "alerts-center-notifier"
status: draft        # draft | approved
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

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Índice anti-spam de `alert_events` redefinido a `WHERE status <> 'closed'` (D1)

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — `POST /v1/me/push-tokens`: upsert idempotente por `expo_token`

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Validación zod del body (formato de token, platform, `strictObject` → 400)

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — `DELETE /v1/me/push-tokens`: 204 idempotente, solo la fila propia

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Ambas rutas exigen JWT (401 sin `@Public()`)

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Drenado de `notifications` y parseo zod del contrato v1 (malformado → sin delete)

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Destinatarios: push tokens de todos los miembros activos de la mascota

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — `PUSH_ENABLED != 'true'`: log estructurado `{wouldSend}`, sin llamar a Expo

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Sin tokens registrados: log y fin, mensaje borrado, cero excepciones

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — `PUSH_ENABLED='true'`: `ExpoPushSender` (isExpoPushToken, chunks, envío)

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Ticket `DeviceNotRegistered` borra esa fila de `push_tokens`; otro error no

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Ningún log ni respuesta HTTP contiene el token completo

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — Error no controlado: sin delete, sin envenenar el resto del lote

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Scheduler gateado por `NOTIFIER_ENABLED` (+ `NODE_ENV=test`)

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — `GET /v1/alerts`: todas mis mascotas en una lista, orden `opened_at DESC, id DESC`

- [ ] (1) Escribir test que falla para R16
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R17 — Filtro `?status=`; valor inválido o clave desconocida → 400

- [ ] (1) Escribir test que falla para R17
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R18 — Paginación keyset `{items, nextCursor}`, sin duplicados ni saltos

- [ ] (1) Escribir test que falla para R18
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R19 — Aislamiento: jamás una alerta de una mascota ajena; sin membresías → lista vacía

- [ ] (1) Escribir test que falla para R19
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R20 — `POST /v1/alerts/:id/ack`: `open` → `acked` + `acked_at`, 200 (ack ≠ closed)

- [ ] (1) Escribir test que falla para R20
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R21 — Máquina de estados del ack (idempotente, 409 sobre `closed`, 404 genérico)

- [ ] (1) Escribir test que falla para R21
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R22 — Auditoría `alert.ack` solo cuando el ack cambia el estado

- [ ] (1) Escribir test que falla para R22
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R23 — No regresión de #12 con `acked`: anti-spam sigue y el regreso sigue cerrando

- [ ] (1) Escribir test que falla para R23 (escenario `exit → ack → exit → enter`)
- [ ] (2) Implementación mínima que lo pasa (filtro de `closeOpenAlert`, D1)
- [ ] (3) Refactor con tests verdes — **la suite completa de #12 debe seguir verde sin editar sus tests**

## R24 — Geocerca de referencia (la más antigua) y `NULL` si la mascota no tiene ninguna

- [ ] (1) Escribir test que falla para R24
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R25 — Fórmula del solape con el día local (función pura `computeTimeAwayMinutes`)

- [ ] (1) Escribir test que falla para R25
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R26 — Cruce de medianoche y eventos abiertos (con la aproximación documentada en JSDoc)

- [ ] (1) Escribir test que falla para R26
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R27 — `NULL` (no medible) distinto de `0` (medido, nunca salió)

- [ ] (1) Escribir test que falla para R27
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R28 — Upsert con `coalesce(excluded, actual)`: R11 de #10 sigue verdadera

- [ ] (1) Escribir test que falla para R28
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R29 — `PUSH_ENABLED` y `NOTIFIER_ENABLED` documentadas y leídas vía `ConfigService`

- [ ] (1) Escribir test que falla para R29
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R30 — No regresión: límites de archivos tocados y una sola dependencia nueva

- [ ] (1) Escribir test que falla para R30 (o verificación con `git diff main --name-only` + `git diff main -- backend-pet-tracker/package.json`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes
