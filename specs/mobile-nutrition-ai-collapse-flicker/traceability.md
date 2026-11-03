---
feature: "mobile-nutrition-ai-collapse-flicker"
status: approved      # draft | spec_ready | approved
tags: [mobile, nutrition, ui, spec]
---

# Trazabilidad — [[mobile-nutrition-ai-collapse-flicker]] (#234)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/food/ai-explanation.test.tsx::#234 R1: food-ai-measure es hermano anterior de food-ai-body bajo la raíz gap-2`<br>`src/screens/food/ai-explanation.test.tsx::#234 R1: ningún ancestro del medidor es el recorte ni su contenido`<br>`src/screens/food/ai-explanation.test.tsx::#234 R1: solo el medidor lleva onLayout` | `d1917e94` test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)<br>`f46549e1` feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6)<br>`020c8ca2` test(mobile): #234 pin the onLayout carrier count (R1) |
| R2 | `src/screens/food/ai-explanation.test.tsx::#234 R2: el medidor repite los bloques de %s` (3 filas: SAMPLE, una viñeta tras una línea, solo una viñeta) | `fdc350c0` test(mobile): #234 measurer must repeat the visible blocks (R2)<br>`440f4f3b` feat(mobile): #234 render the measurer from the same blocks as the content (R2) |
| R3 | `src/screens/food/ai-explanation.test.tsx::#234 R3: el medidor no se ve, no se toca y no se lee`<br>`src/screens/food/ai-explanation.test.tsx::#234 R3: las consultas por defecto ven una sola copia del texto` | `4f14ef23` test(mobile): #234 measurer must be hidden and inert (R3)<br>`699d4ec1` feat(mobile): #234 hide the measurer from touches and screen readers (R3) |
| R4 | `src/screens/food/ai-explanation.test.tsx::#224 R6: alto %s limita según la frontera de 122 (enmendado por #234 R4)` (5 filas)<br>`src/screens/food/ai-explanation.test.tsx::#224 R6: el degradado ocupa 36 y usa el fondo violeta del tema` | `d1917e94` test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)<br>`f46549e1` feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6) |
| R5 | `src/screens/food/ai-explanation.test.tsx::#234 R5: %s` (5 filas: el recortado reporta 122, 0 y 400 tras medir 400; 400 con medida 100; 400 sin medida) | `d1917e94` test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)<br>`f46549e1` feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6) |
| R6 | `src/screens/food/ai-explanation.test.tsx::#234 R6: la secuencia que producía el parpadeo se queda quieta`<br>`src/screens/food/ai-explanation.test.tsx::#234 R6: expandir y contraer no dependen del nodo recortado`<br>`src/screens/food/ai-explanation.test.tsx::#234 R6: un texto nuevo se mide otra vez en el medidor` | `d1917e94` test(mobile): #234 measure the AI card outside its clip (R1, R4, R5, R6)<br>`f46549e1` feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6) |
| R7 | Existentes sin tocar sus aserciones: `src/screens/food/ai-explanation.test.tsx::#224 R4`, `#224 R5`, `#224 R7`, `#224 R8`, `#224 R9`, `#224 R11`; suites `src/screens/food` y `src/__tests__` en verde (T1); alcance por `git diff --name-only <H0>..HEAD` | `f46549e1` feat(mobile): #234 move the AI card measurement outside the clip (R1, R4, R5, R6)<br>`440f4f3b` feat(mobile): #234 render the measurer from the same blocks as the content (R2)<br>`699d4ec1` feat(mobile): #234 hide the measurer from touches and screen readers (R3) |

## Evidencia de cierre automático

- T0: 45 suites / 1262 tests verdes; T1: 45 suites / 1278 tests verdes (+16),
  ejecutando `bunx jest src/screens/food src/__tests__`. Suite de IA: 28 → 44 tests.
- R1 it 3: la enmienda del leader `d800bee5` autoriza que `020c8ca2` nazca verde
  (39 tests). Las mutaciones R5(c) y R1(d) dejan rojo ese it y se revierten;
  R5(c) falla por longitud 2 frente a 1. R1(b) deja verdes R4/R5/R6 y rompe solo
  los dos tests estructurales de R1.
- R7: quitar `shrink-0` rompe #224 R5; plantar un hex en el fuente rompe #224 R13.
  Las aserciones antiguas se conservan; solo se enmienda el título de #224 R6.
- Tipos y lint sin caché: exit 0, logs vacíos. El diff acotado incluye la enmienda
  del leader en requirements.md/tasks.md además de fuente, test y esta trazabilidad.
- El smoke G2 en dispositivo y la firma de enmienda de #224 pertenecen al humano.
