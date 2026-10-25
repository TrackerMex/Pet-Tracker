---
feature: mobile-canvas-collar-alerts
id: 203
status: approved
---

# #203 mobile-canvas-collar-alerts — Trazabilidad

| R | Test (fichero › it) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|
| R1 | `src/app/__tests__/layout.test.tsx` › `#203 R1: %s oculta la cabecera nativa` | `01167214` | `b41a5118` | cubierto |
| R2 | `src/screens/pairing/index.test.tsx` › `#203 R2.1`–`#203 R2.4` | `f61299ab` | `4ac62813` | cubierto |
| R3 | `src/screens/pairing/index.test.tsx` › `#203 R3: %s entra con RiseIn %i` | `d09c24c5` | `c04fb181` | cubierto |
| R4 | `src/screens/pairing/index.test.tsx` › `#203 R4.1`–`#203 R4.3` | `4f8eec63` | `8e18bfe8`, `26843a00` (B1: className exacto) | cubierto |
| R5 | `src/screens/pairing/index.test.tsx` › `#203 R5` (dos `it`) | `581ef0bb` | `2fba8162` | cubierto |
| R6 | `src/screens/pairing/index.test.tsx` › `#203 R6: desvincular es 54, radio 16, labio rojo y va al fondo` | `fddd70af` | `88d75d24`, `26843a00` (B1: className exacto) | cubierto |
| R7 | `src/screens/pairing/index.test.tsx` › `#203 R7.1`–`#203 R7.8` | `17917920` | `c4555d2c`, `26843a00` (B1: className exacto) | cubierto |
| R8 | `src/screens/alerts/index.test.tsx` › `#203 R8` (cuatro `it`) | `214e17fc` | `177aed0f` | cubierto |
| R9 | `src/screens/alerts/index.test.tsx` › `#203 R9: envuelve e0 a e4 con RiseIn y su retardo y deja e5 sin envoltorio` | `6ca3aba1` | `bd6e49bb` | cubierto |
| R10 | `src/screens/alert-detail/index.test.tsx` › `#203 R10` (dos `it`) | `9060bebc` | `c4ceb49b` | cubierto |
| R11 | `src/screens/alert-detail/index.test.tsx` › `#203 R11: la tarjeta entra en 0 y el mapa en 80 con RiseIn` | `7df7f6bf` | `662a4077` | cubierto |
| R12 | `src/__tests__/collar-alerts-canvas-fidelity.test.ts` › `#203 R12: %s` | `d580239e` (nace verde: R1 a R11 ya estaban) | n/a | cubierto |

Cierre del leader (2026-10-24): la primera revisión, sobre `0677e469`, salió RECHAZADA por B1 (las clases de R4.2, R6 y R7.2 se asertaban con `arrayContaining`). La corrección `26843a00` las fija con `toBe` y `49732f36` reapunta la trazabilidad. Se mergeó `origin/dev` con #206 y #196 (`515719ed`, cuatro conflictos de candados agregados resueltos por unión) y el `./init.sh` del leader sobre `515719ed` salió con exit 0 (móvil 152/152 suites, 5251/5251 tests, 1 snapshot). El reviewer aprobó ahí (`progress/review_mobile-canvas-collar-alerts.md`, 0 bloqueantes, 5 no bloqueantes). Después se mergeó `origin/dev` con #204 (`d7421657`, conflictos de candados agregados y de `_layout.tsx` resueltos por unión) y se repitió el gate: exit 0, móvil 153/153 suites, 5295/5295 tests, 1 snapshot. El smoke de R2–R11 lo cierra el humano en el lote `progress/smoke_canvas-parity.md` (plan §6).
