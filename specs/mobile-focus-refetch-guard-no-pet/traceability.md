---
feature: "mobile-focus-refetch-guard-no-pet"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-focus-refetch-guard-no-pet]]

| Requisito | Test (archivo::describe) | Commits verificados |
|---|---|---|
| R1 | `src/screens/home/index.test.tsx::#193 R1: Inicio sin mascota no pide detalle al enfocar` | A `b762291010526c541cfea691c43da7141e79f672`; B `8ebb6a1340f2c6830933030df32b76806ab6c8aa` |
| R2 | `src/screens/home/index.test.tsx::#193 R2: Inicio con mascota refresca el detalle al enfocar` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |
| R3 | `src/screens/home/index.test.tsx::#193 R3: Inicio sin mascota conserva los refetch generales` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |
| R4 | `src/screens/profile/index.test.tsx::#193 R4: Perfil sin mascota no pide detalle al enfocar` | A `b762291010526c541cfea691c43da7141e79f672`; B `8ebb6a1340f2c6830933030df32b76806ab6c8aa` |
| R5 | `src/screens/profile/index.test.tsx::#193 R5: Perfil con mascota refresca el detalle al enfocar` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |
| R6 | `src/screens/profile/index.test.tsx::#193 R6: Perfil sin mascota conserva el refetch de la lista` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |
| R7 | `src/screens/reminders/index.test.tsx::#193 R7: sin mascota no pide recordatorios al enfocar` | A `b762291010526c541cfea691c43da7141e79f672`; B `8ebb6a1340f2c6830933030df32b76806ab6c8aa` |
| R8 | `src/screens/reminders/index.test.tsx::#193 R8: con mascota refresca los recordatorios al enfocar` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |
| R9 | `src/screens/reminders/index.test.tsx::#193 R9: perder foco sin mascota limpia confirmación y error` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |
| R10 | `src/screens/home/index.test.tsx::#193 R10: Inicio conserva la identidad de su callback de foco`; `src/screens/profile/index.test.tsx::#193 R10: Perfil conserva la identidad de su callback de foco`; `src/screens/reminders/index.test.tsx::#193 R10: Recordatorios conserva la identidad de su callback de foco` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |
| R11 | `src/__tests__/design-drift.test.ts::#193 R11: grep-clean de Inicio, Perfil y Recordatorios` | A `b762291010526c541cfea691c43da7141e79f672`; C `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210`; D `c1094e6ac4eb17190e6354e500a70e4fcc298aec` |

## Hashes y mensajes

| Fase | Hash | Mensaje |
|---|---|---|
| A | `b762291010526c541cfea691c43da7141e79f672` | `test(mobile): tests de foco sin mascota (R1,R2,R3,R4,R5,R6,R7,R8,R9,R10,R11)` |
| B | `8ebb6a1340f2c6830933030df32b76806ab6c8aa` | `feat(mobile): guarda de refetch sin mascota en Inicio, Perfil y Recordatorios (R1,R4,R7)` |
| C | `cc3667f70eebe05b0aef4a5b0ff9ab3a8ca5f210` | `test(mobile): mutaciones de control para R2,R3,R5,R6,R8,R9,R10,R11 (rojo por aserción)` |
| D | `c1094e6ac4eb17190e6354e500a70e4fcc298aec` | `test(mobile): revierte mutaciones de control (R2,R3,R5,R6,R8,R9,R10,R11)` |

R1/R4/R7: rojo por llamada nula en A, verde por la guarda en B. R2/R3/R5/R6/R8/R9/R10/R11: nacen verdes en A, mutaciones aisladas y conjuntas rojas por aserción en C, restauración verde en D. R9 cubre confirmación y error; R10 se verifica en las tres pantallas.

CC1–CC3 verificados. Evidencia y paradas resueltas en `progress/impl_mobile-focus-refetch-guard-no-pet.md`. CC4 (smoke Android) corresponde al humano; el status de la feature no se modifica.
