---
feature: "mobile-add-pet-two-steps"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-add-pet-two-steps]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Un commit rojo (test) y uno
> verde (implementación) por requisito, con `(R<n>)` en el mensaje. Orden sugerido:
> R1, R7 (función pura), R5, R2, R3, R4, R6, R8, R9, R10, R11; R12 al final.
> Antes de empezar (H0): medir la tabla de §Base medida de requirements y correr
> todas las suites de candados en verde (`bun run test` de `mobile-pet-tracker/`
> sin filtros); cada rojo inesperado es una «parada».

## R1 — Claves de copy del asistente (tres altas, una baja, fórmulas, §2.<N>)

- [ ] (1) Test rojo: `#191 R1` en `language-provider.test.tsx` (EN/ES literales, sin `addPet.avatarPreview`, fórmula `+ 3 - 1`) y fórmula/filas de `R9_ADD_PET` en `ui-language.test.ts` + `ui-copy-table.ts`
- [ ] (2) Implementación mínima: claves en `catalog.ts` (en y es), quitar `addPet.avatarPreview` y, para que `tsc` siga verde, borrar en `add-pet/index.tsx` el `<Text className="font-semibold text-muted">{t('addPet.avatarPreview')}</Text>` (ningún test de la pantalla lo afirma; B5), §2.<N> en `specs/mobile-ui-language/design.md`
- [ ] (3) Refactor con tests verdes (`grep -rn "addPet.avatarPreview" src` sale vacío)

## R2 — Título en el contenido y cabecera sin título

- [ ] (1) Test rojo: fila `['pets/add', '']` en `layout.test.tsx` y `#191 R2` en `index.test.tsx` (reescribe `#95 R5`)
- [ ] (2) Implementación mínima: `title: ''` en `_layout.tsx`; `Text add-pet-title` en la pantalla
- [ ] (3) Refactor con tests verdes

## R3 — Indicador de paso y barra de dos segmentos

- [ ] (1) Test rojo: `#191 R3` (paso 1 y 2, `accessibilityValue`, EN)
- [ ] (2) Implementación mínima: `step` en estado, `add-pet-step-label`, `add-pet-step-bar` y segmentos
- [ ] (3) Refactor con tests verdes

## R4 — Paso 1 (foto, burbuja de Pingo, datos básicos, Continuar)

- [ ] (1) Test rojo: `#191 R4` (orden, ausencias, foto con y sin imagen, burbuja y cola)
- [ ] (2) Implementación mínima: fila foto + burbuja, encabezado, orden de campos, sin nodos del paso 2
- [ ] (3) Refactor con tests verdes

## R5 — `SegmentedControl` compartido

- [ ] (1) Test rojo: `segmented-control.test.tsx` (`#191 R5`) y `#191 R5` de la pantalla; reescritura de `#62 R11` y adaptación de `#61 R10`
- [ ] (2) Implementación mínima: `src/components/segmented-control.tsx`; Tipo, Sexo y Tamaño lo usan
- [ ] (3) Refactor con tests verdes (verificar `consistency-classnames`, `design-drift`, `alerts-canvas-fidelity` por los inventarios de R11)

## R6 — Métricas del canvas y receta de campos

- [ ] (1) Test rojo: `#191 R6` (objeto exacto de `contentContainerStyle`, clases de etiqueta e input, `maxLength`); reescribe `#95 R6`
- [ ] (2) Implementación mínima: nuevas clases y métricas; `ScrollView key={step}`
- [ ] (3) Refactor con tests verdes

## R7 — Continuar valida el nombre y avanza

- [ ] (1) Test rojo: `form-rules.test.ts::#191 R7` y `index.test.tsx::#191 R7`
- [ ] (2) Implementación mínima: `validateAddPetBasics` (y `validateAddPet` la reutiliza), `handleContinue`, botón `add-pet-continue`
- [ ] (3) Refactor con tests verdes (89 `it` de `form-rules.test.ts` intactos)

## R8 — Paso 2 (datos médicos) y su CTA

- [ ] (1) Test rojo: `#191 R8` (presencia, ausencia, errores de edad en el paso 2)
- [ ] (2) Implementación mínima: `renderStep2` con edad, esterilizado, microchip y `add-pet-submit`
- [ ] (3) Refactor con tests verdes

## R9 — Atrás vuelve al paso 1 conservando datos

- [ ] (1) Test rojo: `#191 R9` casos (a) a (f), con el mock de `expo-router/react-navigation` descrito en requirements
- [ ] (2) Implementación mínima: `usePreventRemove`, estado `leaving` y `useEffect` de salida
- [ ] (3) Refactor con tests verdes (B6 verde en H0: `typeof usePreventRemove === 'function'`)

## R10 — Guardar, errores, foto y celebración intactos

- [ ] (1) Test rojo: adaptar los `it` de `#186 R4/R7`, `#90 R6`, `#123`, `#171 R4/R5` con `goToStep2()` y añadir `#191 R10` (400 en el paso 2); reglas de #72 (solo `pressPickPhoto()`, `await` en todo)
- [ ] (2) Implementación mínima: `handleSubmit` sin cambios de contrato; salida por `leaving`
- [ ] (3) Refactor con tests verdes

## R11 — Carta y candados

- [ ] (1) Test rojo: `add-pet-two-steps.test.ts` (enmienda y inventarios) y los candados movidos (`design-drift`, `chunky-cta-canvas-fidelity`, `consistency-classnames`, `alerts-canvas-fidelity`), uno por commit
- [ ] (2) Implementación mínima: sección «Enmienda #191» y línea de radios en `docs/ui-guidelines.md`, casilla **sin marcar**
- [ ] (3) Refactor con tests verdes; `init.sh` completo en verde

## R12 — Cierre humano

- [ ] (1) No hay test: el `reviewer` comprueba las casillas de §Cierre del humano
- [ ] (2) Sin implementación: la marca la pone el humano
- [ ] (3) Sin refactor
