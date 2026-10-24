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
