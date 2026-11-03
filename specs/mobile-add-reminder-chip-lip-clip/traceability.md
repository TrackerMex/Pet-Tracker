---
feature: "mobile-add-reminder-chip-lip-clip"
status: approved      # draft | approved
tags: [mobile, reminders, ui, spec]
---

# Trazabilidad — [[mobile-add-reminder-chip-lip-clip]] (#232)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/add-reminder/index.test.tsx::#232 R1: %s reserva 3 px bajo los chips`<br>`src/screens/add-reminder/index.test.tsx::#213 R5: Tipo y Aviso son filas horizontales sin salto de línea (enmendado por #232 R1)` | pendiente |
| R2 | `src/screens/add-reminder/index.test.tsx::#232 R2: %s no desplaza el resto del formulario` | pendiente |
| R3 | `src/screens/add-reminder/index.test.tsx::pinta Vacuna seleccionada con cápsula, labio y texto sin emoji (enmendado por #197 R7)`<br>`src/screens/add-reminder/index.test.tsx::invierte las recetas al seleccionar Otro (enmendado por #197 R7)`<br>`src/screens/add-reminder/index.test.tsx::abre en el 24, con el mínimo en el instante actual y la hora a las 09:00 (enmendado por #197 R7) (enmendado por #220 R15)` | pendiente (sin cambio de tests: nacen y siguen verdes) |
| R4 | `src/screens/add-reminder/index.test.tsx::#232 R4: la fila de Repetición no cambia`<br>`src/screens/add-reminder/index.test.tsx::#213 R5: … (enmendado por #232 R1)` | pendiente (el `it` de repetición nace verde; alcance por `git diff --name-only`) |
