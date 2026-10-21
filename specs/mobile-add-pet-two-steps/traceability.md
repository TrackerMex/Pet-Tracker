---
feature: "mobile-add-pet-two-steps"
status: draft        # revisión del reviewer y cierre humano por realizar
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-add-pet-two-steps]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx::#191 R1: declara las claves del asistente de dos pasos en los dos idiomas` | `ba085a7d` feat(mobile): claves de copy del asistente de dos pasos (R1) |
| R2 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::#191 R2: el título vive en el contenido`; `mobile-pet-tracker/src/app/__tests__/layout.test.tsx::#95 R4: cada pantalla de detalle declara su cabecera nativa` | `e499681f` feat(mobile): título de Nueva mascota en el contenido (R2) |
| R3 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R6: alta de mascota → #191 R3: el indicador de paso muestra el primero con un segmento lleno` | `3010a03d` feat(mobile): Nueva mascota en dos pasos: indicador, paso 1, Continuar y paso 2 (R3,R4,R7,R8,R10) |
| R4 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R6: alta de mascota → #191 R4: el paso 1 pinta foto, burbuja y datos básicos` | `3010a03d` feat(mobile): Nueva mascota en dos pasos: indicador, paso 1, Continuar y paso 2 (R3,R4,R7,R8,R10) |
| R5 | `mobile-pet-tracker/src/components/__tests__/segmented-control.test.tsx::#191 R5: SegmentedControl`; `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R6: alta de mascota → #191 R5: Tipo, Sexo y Tamaño usan el selector` | `4f2fc961` feat(mobile): SegmentedControl compartido para Tipo, Sexo y Tamaño (R5) |
| R6 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::#191 R6: métricas y receta de campos` | `15395c13` feat(mobile): métricas y campos de Nueva mascota como el canvas (R6) |
| R7 | `mobile-pet-tracker/src/utils/form-rules.test.ts::#191 R7: validateAddPetBasics`; `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R6: alta de mascota → #191 R7: Continuar valida el nombre en %s y avanza al corregirlo` | `0cfc685c` feat(mobile): validateAddPetBasics en form-rules (R7); `3010a03d` feat(mobile): Nueva mascota en dos pasos: indicador, paso 1, Continuar y paso 2 (R3,R4,R7,R8,R10) |
| R8 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R6: alta de mascota → #191 R8: el paso 2 pinta datos médicos y guarda en modo %s` | `3010a03d` feat(mobile): Nueva mascota en dos pasos: indicador, paso 1, Continuar y paso 2 (R3,R4,R7,R8,R10) |
| R9 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R6: alta de mascota → #191 R9: atrás en el paso 2 vuelve al 1 con los datos` | `f47fece9` feat(mobile): atrás en el paso 2 vuelve al paso 1 (R9) |
| R10 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::R6: alta de mascota → #191 R10: el 400 se queda en el paso 2 con el aviso y los valores`; grupos `R7: foto opcional tras alta`, `#171 R4: primera mascota`, `#171 R5: variante sin collar` y salidas de `#191 R9` | `3010a03d` feat(mobile): Nueva mascota en dos pasos: indicador, paso 1, Continuar y paso 2 (R3,R4,R7,R8,R10); `f47fece9` feat(mobile): atrás en el paso 2 vuelve al paso 1 (R9) |
| R11 | `mobile-pet-tracker/src/__tests__/add-pet-two-steps.test.ts::#191 R11: la carta recoge la enmienda`; `mobile-pet-tracker/src/__tests__/add-pet-two-steps.test.ts::#191 R11: add-pet y el selector cumplen los inventarios`; guards `design-drift`, `chunky-cta-canvas-fidelity`, `consistency-classnames`, `alerts-canvas-fidelity`, `profile-canvas-fidelity` y `heroui-text-size-merge` (nombres y resultados en el reporte) | `b331fc88` docs(mobile): carta de Nueva mascota en dos pasos (R11); `3175b6be` test(mobile): inventario de radios y selector sin drift (R11); `c43884de` test(mobile): inventario de CTA y foto como Pressable (R11); `d40a306c` test(mobile): inventarios de esquinas y acento (R11); `9a5d6b48` test(mobile): inventarios de radios y texto de Alertas (R11); `9fa07aae` test(mobile): inventarios de burbuja y texto de Perfil (R11); `8f09db78` test(mobile): universo medido de elementos HeroUI (R11) |
| R12 | cierre humano — sin test automático; smoke Android y las casillas de cierre quedan para el humano | cierre humano |
| R13 | `mobile-pet-tracker/src/screens/add-pet/index.test.tsx::#191 R13: el campo de fecha usa la receta de fecha de add-reminder` | `68d3c45a` feat(mobile): campo de fecha de Nueva mascota con icono, como add-reminder (R13) |

R1–R11 implementados. R12 corresponde al cierre humano definido en requirements;
esta tabla no marca aprobaciones humanas ni cambia el estado de la feature.
Los rojos, verdes, inventarios que nacen verdes y verificaciones están en
[[../../progress/impl_mobile-add-pet-two-steps|el reporte de implementación]].
