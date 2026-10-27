---
feature: "mobile-tab-avatar-header"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — [[mobile-tab-avatar-header]]

Rutas de test relativas a `mobile-pet-tracker/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente (`src/components/__tests__/tab-pet-header.test.tsx::#222 R1: con cero mascotas no pinta nada`; `::con mascotas pinta la raíz con la receta de vidrio plano y sus rellenos`; `::TAB_PET_HEADER_HEIGHT suma 7 + 50 + 7 + 1`; `::monta el selector avatars con edgeInset = horizontalInset - 5`; `::pasa scrollHint al selector`; `::no importa expo-blur ni llama a t()`) | pendiente |
| R2 | pendiente (`src/components/__tests__/pet-switcher.test.tsx::#222 R2: la caja del chip mide 50 y la fila no lleva gap`; `::sin edgeInset ni scrollHint ...`; `::edgeInset y scrollHint llegan al ScrollView pet-switcher-scroll`; `::las variantes default y glass no cambian`; `::reparte los cinco colores ... (enmendado por #222 R2)`) | pendiente |
| R3 | pendiente (`src/screens/health/index.test.tsx::#222 R3: sin título visible y sin health-header`; `::con mascotas la cabecera fija va tras el scroll`; `::el scroll arranca bajo la cabecera con mascotas y arriba sin ellas`; `::health-content es el único hijo del scroll`; `::el selector vive solo en health-pet-header`; `::seis mascotas sin pista, siete con ella`) | pendiente |
| R4 | pendiente (`src/screens/food/index.test.tsx::#222 R4: sin título visible y sin food-title-row`; `::food-root envuelve al scroll y la cabecera va después`; `::el scroll arranca bajo la cabecera con mascotas y arriba sin ellas`; `::el selector vive solo en food-pet-header`; `::seis mascotas sin pista, siete con ella`) | pendiente |
| R5 | pendiente (`src/screens/profile/index.test.tsx::#222 R5: profile-hero-top es una fila con el selector a la izquierda y la cápsula a la derecha`; `::el selector glass vive en profile-hero-selector`; `::la cápsula conserva su receta y su ruta`; `::no hay título visible en ninguna rama`) | pendiente |
| R6 | pendiente (`src/screens/profile/index.test.tsx::#222 R6: sin hero, profile-top-row lleva solo la cápsula pastilla a la derecha`; `::sin hero, profile-content conserva paddingTop 52`) | pendiente |
| R7 | pendiente (`src/screens/health/index.test.tsx::#222 R7: Salud anuncia su encabezado sin texto visible`; `src/screens/food/index.test.tsx::#222 R7: Nutrición anuncia su encabezado sin texto visible`; `src/screens/profile/index.test.tsx::#222 R7: Perfil anuncia su encabezado sin texto visible`; los `::el encabezado sale en inglés`, `::el encabezado existe en todos los estados` y `::el encabezado es el primer hijo` de cada pantalla; `src/__tests__/ui-language.test.ts::resuelve cada ocurrencia de la tabla contra la clave exacta`) | pendiente |
| R8 | pendiente (`src/__tests__/ui-language.test.ts::#222 R8: la clave tabHeader.petsScroll dice el literal en es y en`; `::resuelve cada ocurrencia de la tabla contra la clave exacta`; los `toHaveLength` de `R5_HEALTH` y `R6_FOOD` con `(enmendado por #222 R8)`; `src/providers/__tests__/language-provider.test.tsx::paridad de claves`) | pendiente |
| R9 | pendiente (L1 y L2 `src/__tests__/tab-headers-canvas.test.ts::#168 R1 ... (enmendado por #222 R9)`; L4 `src/__tests__/canvas-foundations.test.ts::#197 R4: ningún fichero de producción usa tracking-tight`; L5 `src/__tests__/profile-canvas-fidelity.test.ts::#173 R4: limita la variante nueva ...`; L6 y L7 `src/__tests__/profile-photo-hero-canvas.test.ts::#196 R10 (FILAS)`; L8 `src/__tests__/alerts-canvas-fidelity.test.ts::limita $token a su inventario de producción`; L9 `src/components/__tests__/pet-switcher.test.tsx::reparte los cinco colores ...`; L10 los `it` de R9.1 en las tres `index.test.tsx`) | pendiente |
| R10 | pendiente (`src/__tests__/tab-headers-canvas.test.ts::#222 R10: ningún fichero de producción nombra los ids del título`; `::variant="avatars" solo vive en TabPetHeader`; `::las pantallas y el componente nuevo no usan StyleSheet, hex ni corchetes`; `src/__tests__/alert-detail-canvas-fidelity.test.ts::#180 R5.6` sin cambios) | pendiente |
| R11 | pendiente (`src/__tests__/hero-header-amendments.test.ts::#222 R11: inserta el bloque literal de design.md §2 en los siete documentos`; `::deja en cada documento su línea de firma propia, marcada o no`; `::aplica además el marcador en prosa de la tabla R11.1`) | pendiente |
| R12 | pendiente (`src/__tests__/tab-headers-canvas.test.ts::#222 R12: la carta recoge la enmienda N1 de #222`; `src/__tests__/hero-header-amendments.test.ts::aplica además el marcador en prosa ... (enmendado por #222 R12)`). Gate G4 humano | pendiente |
| R13 | pendiente (`src/__tests__/tab-headers-canvas.test.ts::#222 R13: conventions.md recoge la excepción de la cabecera fija`). sin gate humano | pendiente |
| R14 | pendiente (`src/__tests__/tab-headers-canvas.test.ts::#222 R14: los testID de otras features siguen en su pantalla`; `::TabPetHeader no llama a t() y SCREEN_FILES no crece`) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
