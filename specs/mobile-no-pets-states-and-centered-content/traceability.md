---
feature: "mobile-no-pets-states-and-centered-content"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-no-pets-states-and-centered-content]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 (sondas S1 a S4 en Inicio, Perfil, Recordatorios; S5 en Perfil) | pendiente | pendiente |
| R2.1 (`clearPet` en el proveedor) | pendiente | pendiente |
| R2.2 (el hook limpia con lista ok y vacía) | pendiente | pendiente |
| R2.3 (lo que no limpia) | pendiente | pendiente |
| R2.4 (un solo escritor, firma intacta) | pendiente | pendiente |
| R2.5 (17 dobles exhaustivos, `tsc` en 0) | pendiente | pendiente |
| R3.1 (Inicio, sin tarjeta con selección nula) | pendiente | pendiente |
| R3.2 (Inicio, estado centrado) | pendiente | pendiente |
| R3.3 (Inicio, carga y error intactos) | pendiente | pendiente |
| R4.1 (Recordatorios, sin tarjeta) | pendiente | pendiente |
| R4.2 (Recordatorios, estado centrado) | pendiente | pendiente |
| R4.3 (Recordatorios, rama con mascotas intacta) | pendiente | pendiente |
| R5.1 (Perfil, vacío ilustrado) | pendiente | pendiente |
| R5.2 (Perfil, sin tarjeta ni esqueletos) | pendiente | pendiente |
| R5.3 (Perfil, solo centrado horizontal) | pendiente | pendiente |
| R6 (Comida y Salud heredan la raíz) | pendiente | pendiente |
| R7 (convergencia al crear la primera mascota) | pendiente | pendiente |
| R8.1 (`ui-copy-table`, +2 y +3) | pendiente | pendiente |
| R8.2 (`empty-state.test`) | pendiente | pendiente |
| R8.3 (design-drift y legibility) | pendiente | pendiente |
| R9 (enmienda A20 y candado tolerante) | pendiente | pendiente |
| R10 (mutaciones X1 a X12; X5 equivalente, sin test) | pendiente | pendiente |
| Smoke dev build de Android (humano) | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
