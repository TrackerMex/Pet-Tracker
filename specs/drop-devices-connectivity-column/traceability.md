---
feature: "drop-devices-connectivity-column"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[drop-devices-connectivity-column]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/src/db/schema/devices.schema.spec.ts :: R1: la migracion crea devices conforme a docs/data-model.md › se llama devices y tiene exactamente las columnas de la spec` (lista de 14) + `:: #93 R1: la migracion 0016 borra devices.connectivity y nada mas` | rojo `ffaf0669`; verde `0a131779`; docs `f9020c3f` |
| R2 | requisito de verificación (C4 vía (b)): candados (b) de [[requirements]] §Inventario intactos + inventario de producción a 0 + `git diff --stat` acotado, en `progress/impl_drop-devices-connectivity-column.md` §R2 | sin test ni implementación propios; evidencia `8f16049b` en el impl §R2 sobre `0a131779` |
| R3 | requisito de verificación (C4 vía (b)): `pnpm db:migrate` ×2 contra `pet_tracker_wt` + consultas psql vía `docker exec` (columna ausente, journal 16 → 17 filas) + `db:generate` no-op + `pnpm test:e2e` verde antes y después + `./init.sh` exit 0 sin pipe, en el impl §R3 | sin test ni implementación propios; evidencia `edcabc41` en el impl §R3 sobre `0a131779` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; aquí
`test(drop-devices-connectivity-column): … (R1)` para el rojo y
`feat|docs(drop-devices-connectivity-column): … (R1)` para el verde y los docs.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
