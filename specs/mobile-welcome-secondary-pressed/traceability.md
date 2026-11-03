---
feature: "mobile-welcome-secondary-pressed"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-welcome-secondary-pressed]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/welcome/index.test.tsx::R8::#231 R1: el secundario declara variant outline y conserva el feedback de escala`; `R8::#231 R1: el primario no declara variant` | Rojo: `63a6ca21f5a79d90e46b03e941924fc71e131599` — tests de variante y pins (R1, R3, R4, R6). Verde: `64a80f25dfe7667d92281370008987ef71967979` — secundario outline y borde oscuro (R1, R3). El primario nace verde: ya no declaraba variant. |
| R2 | `mobile-pet-tracker/src/screens/welcome/index.test.tsx::#231 R2::#231 R2: HeroUI pinta el pulsado de outline con default-hover y el de primary con accent-hover` | `17813a57abb66fbc9142b6a5693ed40c4799a7eb` — contrato de highlight de HeroUI (R2). Nace verde; rojo demostrado por mutación de `themeColorDefaultHover` a `themeColorAccentHover` en outline y restauración con `cp`, documentados en el reporte. Sin cambio de producción propio. |
| R3 | A: `mobile-pet-tracker/src/screens/welcome/index.test.tsx::R8::#231 R3: el secundario añade el borde oscuro tras la receta neutra`; B: `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts::#231 R3: la excepción dark:border-* vive solo en Bienvenida` | Rojo: `63a6ca21f5a79d90e46b03e941924fc71e131599` — tests de variante, borde y pins (R1, R3, R4, R6). Verde: `64a80f25dfe7667d92281370008987ef71967979` — secundario outline y borde oscuro (R1, R3). |
| R4 | `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts::#231 R4: contraste del borde oscuro de Bienvenida::#231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo` | Rojo: `63a6ca21f5a79d90e46b03e941924fc71e131599` — test de contraste derivado del tag (R1, R3, R4, R6). Verde: `64a80f25dfe7667d92281370008987ef71967979` — clase oscura que selecciona el token existente (R1, R3). Mutaciones R4a–R4d rojas por aserción y restauradas. |
| R5 | Tests existentes en `mobile-pet-tracker/src/screens/welcome/index.test.tsx`: `R8::empuja a login sin reemplazar`; `R8::es un botón de superficie con labio gris y tinta accent-strong (enmendado por #231 R1, R3)`; `#205 R2::#205 R2: el contenido apila escena, chips, marca, espaciador, CTAs y legal`; `#166 R3::lleva el labio gris en el CTA secundario`. En `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts`: filas `welcome-have-account` de `#177 R4.1` y `#177 R4.2`, enmendadas por #231 R1, R3. | Sin implementación propia ni nuevo rojo: los tests ya existían y T0 pasó antes de editar. Regresión verde sobre `64a80f25dfe7667d92281370008987ef71967979` — único tag de producción cambiado (R1, R3); `63a6ca21f5a79d90e46b03e941924fc71e131599` solo enmienda los pins exigidos por R6, conservando las demás aserciones. |
| R6 | `mobile-pet-tracker/src/screens/welcome/index.test.tsx::#231 R6: los candados enmendados nombran su enmienda`; pin de clase de `R8::es un botón de superficie…`; filas `welcome-have-account` de `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts::#177 R4.1` / `#177 R4.2` y de `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts::#166 R3`. Los cuatro títulos llevan `(enmendado por #231 R1, R3)`. | Rojo de los tres pins contra el tag anterior: `63a6ca21f5a79d90e46b03e941924fc71e131599` — tests de variante, borde y pins (R1, R3, R4, R6). Verde: `64a80f25dfe7667d92281370008987ef71967979` — tag con clases y variante esperadas (R1, R3). El test de sufijos falló antes de las enmiendas y pasó al añadirlas; mutación del sufijo de consistency roja y restaurada. |
| R7 | pendiente (espera gate G4) | pendiente |

Mensajes literales de los commits referenciados:

- `63a6ca21f5a79d90e46b03e941924fc71e131599`: `test(mobile): #231 welcome secondary variant, dark border and amended pins (R1, R3, R4, R6)`.
- `17813a57abb66fbc9142b6a5693ed40c4799a7eb`: `test(mobile): #231 heroui outline highlight contract (R2)`.
- `64a80f25dfe7667d92281370008987ef71967979`: `feat(mobile): #231 welcome secondary uses outline and a dark border (R1, R3)`.

Evidencia de rojos, verdes, mutaciones y verificaciones finales:
`progress/impl_mobile-welcome-secondary-pressed.md` (sección de reanudación incluida).
R7 se excluye del alcance implementado: no se añade su test ni la enmienda de la
carta hasta que el humano firme G4. G2 y G4 permanecen sin marcar.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
