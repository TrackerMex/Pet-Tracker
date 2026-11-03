---
feature: "mobile-nutrition-ai-collapse-flicker"
status: approved      # draft | spec_ready | approved
tags: [mobile, nutrition, ui, spec]
---

# Trazabilidad — [[mobile-nutrition-ai-collapse-flicker]] (#234)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/food/ai-explanation.test.tsx::#234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2`<br>`src/screens/food/ai-explanation.test.tsx::#234 R1: ningún ancestro del medidor es el recorte ni su contenido`<br>`src/screens/food/ai-explanation.test.tsx::#234 R1: solo el medidor lleva onLayout` | pendiente |
| R2 | `src/screens/food/ai-explanation.test.tsx::#234 R2: el medidor repite los bloques de %s` (3 filas: SAMPLE, una viñeta tras una línea, solo una viñeta) | pendiente |
| R3 | `src/screens/food/ai-explanation.test.tsx::#234 R3: el medidor no se ve, no se toca y no se lee`<br>`src/screens/food/ai-explanation.test.tsx::#234 R3: las consultas por defecto ven una sola copia del texto` | pendiente |
| R4 | `src/screens/food/ai-explanation.test.tsx::#224 R6: alto %s limita según la frontera de 122 (enmendado por #234 R4)` (5 filas)<br>`src/screens/food/ai-explanation.test.tsx::#224 R6: el degradado ocupa 36 y usa el fondo violeta del tema` | pendiente |
| R5 | `src/screens/food/ai-explanation.test.tsx::#234 R5: %s` (5 filas: el recortado reporta 122, 0 y 400 tras medir 400; 400 con medida 100; 400 sin medida) | pendiente |
| R6 | `src/screens/food/ai-explanation.test.tsx::#234 R6: la secuencia que producía el parpadeo se queda quieta`<br>`src/screens/food/ai-explanation.test.tsx::#234 R6: expandir y contraer no dependen del nodo recortado`<br>`src/screens/food/ai-explanation.test.tsx::#234 R6: un texto nuevo se mide otra vez en el medidor` | pendiente |
| R7 | Existentes sin tocar sus aserciones: `src/screens/food/ai-explanation.test.tsx::#224 R4`, `#224 R5`, `#224 R7`, `#224 R8`, `#224 R9`, `#224 R11`; suites `src/screens/food` y `src/__tests__` en verde (T1); alcance por `git diff --name-only <H0>..HEAD` | pendiente |
