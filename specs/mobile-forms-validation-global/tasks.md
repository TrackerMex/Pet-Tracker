---
feature: "mobile-forms-validation-global"
status: draft
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-forms-validation-global]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y tiene siempre los mismos 3 sub-items, en este orden. Cada rojo y cada verde van en commits separados con el R-id (`test(mobile): ... (#186 Rn)` y `feat(mobile): ... (#186 Rn)`). Orden de trabajo: R1, R2, R3, R4, R5, R6, R7, R9 y, solo si P2 = migrar y #177 está mergeada, R8 antes de R9. R10 la cierra el humano.

## R1 — El catálogo trae el copy de validación (cuatro claves, dos idiomas)

> Rojo: 2 `it` (longitud del catálogo y tabla `#186 R1`). Verde: 4 claves + §2.36 en `specs/mobile-ui-language/design.md`.

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Módulo puro `form-rules.ts` con las reglas de los cuatro formularios

> Rojo: la suite `form-rules.test.ts` no arranca (`Cannot find module`) y ENOENT en `ui-language`. Verde: `form-rules.ts` + filas y fórmulas de R2.

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Componente compartido `FieldErrorMessage`

> Rojo: la suite `field-error-message.test.tsx` no arranca. Verde: componente sin `className`. Incluye el candado de uso fuera de `TextField`.

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Añadir mascota: mensaje por campo debajo de cada control

> Rojo: reescribir el `it` de modos de edad y añadir los candados 1-7 y 9. Verde: `validateAddPet`, tres `FieldErrorMessage`, `- 3` en `R9_ADD_PET`.

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Añadir recordatorio: mensaje por campo debajo de título y fecha

> Rojo: reescribir los tres `it` de título/fecha. Los del 400 no cambian. Verde: `validateReminder`, dos `FieldErrorMessage`, `- 3` en `R8_REMINDERS`.

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Subir documento: mensaje por campo y fecha real de calendario

> Rojo: reescribir `#185 R9`. `#185 R5`, `R6` y `R8` no cambian. Verde: `validateDocument`, tres `FieldErrorMessage` con `isInvalid`.

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Registrar peso: validación del DTO y nunca texto crudo del servidor

> Rojo: reescribir los `it` de peso inválido, de unión de mensajes, de fecha cruda y las filas de `#169 R11`. Verde: `validateWeight`, `parseDecimal`, `case 'validation'` reescrito.

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Las cuatro pantallas de cuenta usan el componente (condicional a P2)

> Solo si P2 = migrar y #177 mergeada. Rojo: el candado 3 (conteos de `FieldErrorMessage`). Los tests de #183 no cambian.

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Enmienda de la carta de UI y candados de higiene

> Después de R4-R8. Rojo: candados 1-4 de carta; 5 y 6 según orden. Verde: enmienda en `docs/ui-guidelines.md` (la casilla la firma el humano).

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Prueba de humo humana en dev build de Android

> No hay test: es la casilla del humano de `requirements.md` § R10. El implementer no la marca.

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes
