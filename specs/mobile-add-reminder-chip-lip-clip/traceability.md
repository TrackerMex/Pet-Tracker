---
feature: "mobile-add-reminder-chip-lip-clip"
status: approved      # draft | approved
tags: [mobile, reminders, ui, spec]
---

# Trazabilidad — [[mobile-add-reminder-chip-lip-clip]] (#232)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/add-reminder/index.test.tsx::#232 R1: %s reserva 3 px bajo los chips`<br>`src/screens/add-reminder/index.test.tsx::#213 R5: Tipo y Aviso son filas horizontales sin salto de línea (enmendado por #232 R1)` | `9b546b65` — `test(mobile): #232 reserve chip lip room in type and advance rows (R1)` (rojo por falta de paddingBottom)<br>`f3998897` — `feat(mobile): #232 pad chip rows so the selected lip is not clipped (R1)` (verde; mutaciones R1 a–d detectadas y revertidas) |
| R2 | `src/screens/add-reminder/index.test.tsx::#232 R2: %s no desplaza el resto del formulario` | `1b0c4174` — `test(mobile): #232 chip rows must not shift the form (R2)` (rojo por falta de marginBottom)<br>`bfbb84ce` — `feat(mobile): #232 offset chip row padding with a negative margin (R2)` (verde; mutaciones R2 a–d detectadas y revertidas) |
| R3 | `src/screens/add-reminder/index.test.tsx::pinta Vacuna seleccionada con cápsula, labio y texto sin emoji (enmendado por #197 R7)`<br>`src/screens/add-reminder/index.test.tsx::invierte las recetas al seleccionar Otro (enmendado por #197 R7)`<br>`src/screens/add-reminder/index.test.tsx::abre en el 24, con el mínimo en el instante actual y la hora a las 09:00 (enmendado por #197 R7) (enmendado por #220 R15)` | `f3998897` — `feat(mobile): #232 pad chip rows so the selected lip is not clipped (R1)`<br>`bfbb84ce` — `feat(mobile): #232 offset chip row padding with a negative margin (R2)` (tests existentes intactos, nacen y siguen verdes; mutación de labio fijo detectada y revertida por separado en Tipo y Aviso) |
| R4 | `src/screens/add-reminder/index.test.tsx::#232 R4: la fila de Repetición no cambia`<br>`src/screens/add-reminder/index.test.tsx::#213 R5: … (enmendado por #232 R1)` | `9b546b65` — `test(mobile): #232 reserve chip lip room in type and advance rows (R1)` (Repetición nace verde; mutación R4 a detectada y revertida; ancla R4 b: 0 mutada, 1 restaurada)<br>Alcance: `git diff --name-only 67bb626c..HEAD`, base corregida por el leader/humano en el chat; evidencia en `progress/impl_mobile-add-reminder-chip-lip-clip.md` |
