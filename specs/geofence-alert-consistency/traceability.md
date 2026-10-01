---
feature: "geofence-alert-consistency"
status: approved           # draft | spec_ready | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[geofence-alert-consistency]] (#145)

R1-R5 viven en `backend-pet-tracker/test/geofences.e2e-spec.ts`, dentro de
`describe('#145: consistencia entre geocercas y alertas'`. Convención de
commit ([[tasks]]):

- `test(geofences): <desc> (Rn)` el rojo;
- `fix(geofences): <desc> (Rn)` el verde;
- `refactor(geofences): …` para los comentarios;
- `docs(data-model): …` para `docs/data-model.md`.

**Codex rellena las columnas de commit en UN solo commit final**,
`docs(geofences): fill #145 traceability`, **después del commit de
documentación**. Este fichero no se toca en los commits TDD: ni mezclado con
test o producción, ni una actualización por commit. El `reviewer` no aprueba
si queda alguna fila en «pendiente» (CHECKPOINTS C5).

Los rojos de R1-R4 son **naturales** ([[design]] D10). R1 y R2 comparten el
verde. R5 es un requisito de verificación: su rojo lleva la mutación de
producción versionada **MV**, revertida en su verde.

Recuentos medidos al cierre (base H0 `321300f933bf136755e471f327bbc8084aacf185`):

- `test/geofences.e2e-spec.ts`: **20 → 30**;
- backend unit: **171 suites / 1307 tests → 171 / 1307** (+0 suites, +0 tests);
- resto de e2e e infra: sin cambios.

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos verificando `git merge-base --is-ancestor`.

| Requisito | Test (título literal del `describe`) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — el DELETE de una zona con alerta no cerrada responde 204, también la segunda de la mascota (1 `it`; reproduce R12.3) | `#145 R1: DELETE de una zona con alerta no cerrada responde 204, también si otra zona de la mascota ya se borró con su alerta no cerrada` | `b4dd456f081782cd975b9ce1ea4c14d0190f1a84` | `e4b8d13ad494a6a7da82ee47e6fe178dd3bf8e02` (compartido con R2) |
| R2 — el DELETE cierra las alertas no cerradas de la zona y no toca ninguna otra (2 filas: `open`, `acked`) | `#145 R2: DELETE cierra las alertas no cerradas de la zona y no toca ninguna otra` | `7f6f48db4e6ffb3d0766c7129cd9c51a0cbcce1a` | `e4b8d13ad494a6a7da82ee47e6fe178dd3bf8e02` (compartido con R1) |
| R3 — cambiar `active` reinicia el estado y cierra (2 `it`: desactivar, reactivar) | `#145 R3: PATCH que cambia active reinicia el estado de evaluación de la zona y cierra sus alertas no cerradas` | `c266f82d6a81706774ff33970297db29caee9306` | `a4b73c56f1f61cc25091926f2c0c4a6566cfdb3c` |
| R4 — cambiar la geometría reinicia el estado y cierra (3 filas: `centerLat`, `centerLng`, `radiusM`) | `#145 R4: PATCH que cambia la geometría reinicia el estado de evaluación de la zona y cierra sus alertas no cerradas` | `0ab86634affb043699c65f6fae67d7472f87a175` | `00069504e55969e63ab6e22eadf9f33aeb2d3bdc` |
| R5 — sin cambio de geometría ni de `active`, el estado y las alertas se conservan (2 filas; verificación, MV) | `#145 R5: PATCH sin cambio de geometría ni de active conserva el estado de evaluación y las alertas de la zona` | `618bed210ce858eda508e95d31c024709c647272` | `fd23e4a299c5c0b0577019a4dcf4609daddebcfc` |
| Refactor — comentarios caducados (puerto, `delete-geofence.use-case.ts`, `alerts-engine-store.ts`) | sin test; greps de [[tasks]] §Cierre | — | `66a2a627f6f032b64cf1ee6f1cf0d2953b56b379` |
| Documentación — `docs/data-model.md` (predicado anti-spam y cierres de #145) | sin test; greps de [[requirements]] §Entregable de documentación | — | `63f53428d2dbfb078f84cef7db6c8882127279a0` |

## Candados ajenos movidos

Ninguno. Ningún `it` ni `describe` existente se edita ([[requirements]]
§Candados).
