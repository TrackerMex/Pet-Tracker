---
feature: "geofences-crud"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[geofences-crud]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `test/geofences.e2e-spec.ts::R1: la tabla geofences persiste el shape de docs/data-model.md` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R2 | `test/geofences.e2e-spec.ts::R2: mascota ajena/inexistente/malformada responde 404 generico en las cinco rutas` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R3 | `test/geofences.e2e-spec.ts::R3: rol distinto de owner en POST/PATCH/DELETE recibe 403; GET sin restriccion de rol` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R4 | `test/geofences.e2e-spec.ts::R4: POST feliz inserta, audita geofence.create y responde 201` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R5 | `test/geofences.e2e-spec.ts::R5: POST invalido responde 400 sin escribir en geofences` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R6 | `test/geofences.e2e-spec.ts::R6: sexta geocerca responde 400 MAX_GEOFENCES_REACHED sin persistir` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R7 | `test/geofences.e2e-spec.ts::R7: nombre duplicado responde 409 GEOFENCE_NAME_TAKEN; carrera concurrente deja a lo sumo un 201` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R8 | `test/geofences.e2e-spec.ts::R8: GET list responde 200 con array ordenado por created_at, [] si no hay geocercas` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R9 | `test/geofences.e2e-spec.ts::R9: GET detail responde 200 con shape completo; id invalido/ajeno es 404 GEOFENCE_NOT_FOUND` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R10 | `test/geofences.e2e-spec.ts::R10: PATCH parcial valido actualiza solo las claves presentes, audita geofence.update y responde 200` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R11 | `test/geofences.e2e-spec.ts::R11: PATCH invalido responde 400 sin escribir en geofences` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R12 | `test/geofences.e2e-spec.ts::R12: PATCH sobre id inexistente/malformado/ajeno responde 404 GEOFENCE_NOT_FOUND` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R13 | `test/geofences.e2e-spec.ts::R13: PATCH sin campos reconocidos es no-op (200, sin escribir ni auditar); 404 de R12 precede` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R14 | `test/geofences.e2e-spec.ts::R14: DELETE borra la fila (hard delete), audita geofence.delete y responde 204` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R15 | `test/geofences.e2e-spec.ts::R15: DELETE sobre id inexistente/malformado/ajeno responde 404 sin auditar` | `23fa1fe` feat(geofences-crud): geofences CRUD module with schema and migration (R1-R15) |
| R16 | `src/pipeline/geofence-eval.spec.ts::R16: isInside circulo — haversine <= radiusM, borde inclusive` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R17 | `src/pipeline/geofence-eval.spec.ts::R17: isInside poligono — ray-casting par-impar` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R18 | `src/pipeline/geofence-eval.spec.ts::R18: unknown transiciona silenciosamente (event null) a inside/outside` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R19 | `src/pipeline/geofence-eval.spec.ts::R19: inside -> outside emite exit si distance >= radius*1.1 y accuracy <= 50 (o indefinida)` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R20 | `src/pipeline/geofence-eval.spec.ts::R20: borde distance < radius*1.1 no dispara, sigue inside` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R21 | `src/pipeline/geofence-eval.spec.ts::R21: accuracy > 50 m bloquea el exit aunque distance >= radius*1.1` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R22 | `src/pipeline/geofence-eval.spec.ts::R22: low_accuracy congela el estado completo (incl. updatedAt), event null` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R23 | `src/pipeline/geofence-eval.spec.ts::R23: outside -> outside (distance > radius*0.9) no re-emite` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R24 | `src/pipeline/geofence-eval.spec.ts::R24: outside -> inside emite enter si distance <= radius*0.9, sin condicion de accuracy` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R25 | `src/pipeline/geofence-eval.spec.ts::R25: geofence-eval.ts sin imports de framework/ORM/SDK; evaluate determinista` | `aba0ff9` feat(geofences-crud): pure isInside/evaluate core with hysteresis (R16-R25) |
| R26 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
