---
feature: "mobile-nutrition-ai-collapse-flicker"
status: approved      # draft | spec_ready | approved
tags: [mobile, nutrition, ui, spec]
---

# Diseño — [[mobile-nutrition-ai-collapse-flicker]] (#234)

> Decisiones técnicas de alto nivel. Los requisitos y las decisiones cerradas
> D1 a D9 están en [[requirements]]. Capa: presentación móvil; no toca dominio,
> aplicación ni infraestructura (`docs/architecture.md`).

## Causa raíz

`AiExplanation` decide el recorte con una medida que nace dentro del recorte:

```
food-ai-body  (overflow-hidden, maxHeight 122 si needsClamp && !expanded)
└─ food-ai-content  (onLayout → setContentHeight)
```

`contentHeight` → `needsClamp` → `maxHeight` de `food-ai-body` → layout de
`food-ai-content` → `contentHeight`. Es un lazo cerrado: la medida depende de la
decisión que ella misma toma. Para romperlo no hace falta saber **cómo** oscila
en Android (el plan sospecha que un hijo se mide «como máximo» la altura del
padre recortado y reporta cerca de 122, lo que apaga el recorte, lo que vuelve a
dar 400; no está medido en la VPS). Basta con que la medida **no dependa** de
`needsClamp`: abierto el lazo, el alto medido solo depende del texto y del
ancho, que no cambian con el estado.

## Forma de la solución

```
View (raíz, className="gap-2")
├─ food-ai-measure   absolute inset-x-0 top-0 opacity-0, oculto a accesibilidad
│                    onLayout → setContentHeight   ← única medida
│  └─ renderBlocks(blocks, sin testIDs)
├─ food-ai-body      accessible, overflow-hidden, maxHeight si recorta
│  ├─ food-ai-content          (sin onLayout)
│  │  └─ renderBlocks(blocks, con testIDs)
│  └─ food-ai-fade             (si recorta)
├─ food-ai-more                (si recorta)
└─ food-ai-disclaimer
```

- **El medidor es absoluto.** Un hijo absoluto no entra en el `gap` de la raíz ni
  en su alto: la tarjeta no crece ni se desplaza. Su alto no está restringido
  por el `maxHeight` de `food-ai-body` (no es su hijo), así que reporta el alto
  natural del texto.
- **Mismo ancho.** `inset-x-0` dentro de una raíz sin relleno da el ancho de
  `food-ai-body`, que es un hijo en estiramiento de la misma raíz. El texto
  envuelve igual y el alto natural coincide. (Si la raíz ganara relleno, el
  medidor tendría que acompañarlo; hoy no lo tiene.)
- **Opacidad 0, no `display: none`.** Un nodo sin layout no emite `onLayout`.
  `opacity-0` lo mantiene medible; `pointerEvents="none"` evita que capture
  toques; `accessibilityElementsHidden` más
  `importantForAccessibility="no-hide-descendants"` lo sacan de TalkBack/VoiceOver
  (la unidad de lectura sigue siendo `food-ai-body`, con su
  `accessibilityLabel`). Es la misma pareja de propiedades que ya usan
  `src/components/celebration.tsx` y `src/screens/pet-members/index.tsx`.
- **Una sola definición de los bloques.** La función de módulo `renderBlocks`
  recibe los bloques, el color del punto (`violetStrong`) y si la variante lleva
  `testID`. Los dos usos comparten las recetas de clase (`text-13 font-medium
  leading-body text-foreground`, `flex-1 …`, `mt-1.75 size-1.25 shrink-0
  rounded-full`, márgenes `mt-2` / `mt-1` / `mt-1.5`). Resultado: las cadenas de
  clase siguen apareciendo una sola vez en el fuente; el medidor no puede
  divergir de lo visible; y los `testID` (`food-ai-block-<i>`,
  `food-ai-dot-<i>`) siguen siendo únicos en el árbol.
- **Sin filtro, sin bandera.** El nodo recortado ya no tiene `onLayout`, así que
  sus eventos no llegan a ningún manejador. No hay `if (clamped) return` en el
  manejador del medidor ni estado nuevo: `contentHeight` y `needsClamp` son los
  mismos de hoy.

## Archivos afectados

| Capa | Archivo | Cambio |
|---|---|---|
| Presentación | `src/screens/food/ai-explanation.tsx` | `renderBlocks` (función de módulo) + nodo `food-ai-measure` con el único `onLayout`; `food-ai-content` pierde su `onLayout`. Comentarios `// #234 R<n>` |
| Presentación (test) | `src/screens/food/ai-explanation.test.tsx` | Helper `layout` reapuntado al medidor; helper `clippedLayout`; título del `it.each` de #224 R6 con sufijo; `describe('#234 R1…R6')` nuevos al final (16 tests) |
| Docs | `specs/mobile-nutrition-ai-collapse-flicker/*` | Esta spec |
| Docs | `specs/mobile-nutrition-ai-format/requirements.md` | Solo la casilla de enmienda de R6 en § Aprobación (el texto de R6 no se edita) |

Ningún otro archivo. Ni `src/screens/food/index.tsx` ni su test, ni
`src/i18n/`, ni `src/__tests__/ui-copy-table.ts`, ni `src/theme/`, ni el
canvas, ni `docs/ui-guidelines.md`.

## Cómo se prueba (y por qué es honesto)

Un test de RNTL no calcula layout. Lo que sí puede hacer es **disparar los
eventos que el dispositivo emitiría** y mirar el árbol:

- Los eventos «naturales» (alto del texto sin recorte) se disparan sobre
  `food-ai-measure`. Deciden el recorte (R4).
- Los eventos que el nodo recortado reportaba en el dispositivo (unos 122, o 0)
  se disparan sobre `food-ai-content`. Si en el árbol hubiera un manejador por
  encima (la mutación que devuelve el `onLayout` al recorte), cambiarían el
  recorte; como no lo hay, son inertes (R5, R6). Esa es la mutación plantada que
  sustituye al dispositivo: devolver el `onLayout` al recorte pone en rojo cuatro
  filas de R5 y tres `it` de R6.
- La posición del medidor **no** se ve con eventos: una mutación que mueva el
  medidor dentro de `food-ai-body` deja verdes R4, R5 y R6 (el evento llega igual
  al medidor). Por eso R1 fija la estructura: hijos de la raíz en orden, cadena
  de ancestros sin `food-ai-body` ni `food-ai-content`, y la lista de nodos con
  `onLayout` recorrida entera (incluidos los ocultos, con
  `includeHiddenElements: true`).
- Las consultas por defecto de RNTL 14 excluyen los nodos ocultos a
  accesibilidad (`accessibilityElementsHidden`, `importantForAccessibility`).
  Eso hace dos cosas: (1) todas las consultas de #224 y de
  `food/index.test.tsx` (`getByText('Plan explicado.')`, `getByTestId('food-ai-body')`)
  siguen viendo una sola copia sin tocarse; (2) cualquier consulta **sobre el
  medidor** necesita `includeHiddenElements: true`, o falla en vacío. R3 lo
  fija con la cifra 1 vs 2.
- No hay forma de medir en jest el ancho real del medidor, el alto natural real
  ni la ausencia de oscilación en Yoga/Fabric. Esos son el contenido del
  «Paso de smoke nuevo» y la tabla «Qué cubre jest y qué solo el smoke» de
  [[requirements]].

## Guards de la carta (cruzados antes de firmar)

| Guard | Qué mira | Efecto de #234 |
|---|---|---|
| `nutrition-canvas-fidelity.test.ts` `#224 R13` (`ai-explanation.tsx`) | sin `StyleSheet`, sin `\b[\w-]+-\[`, sin hex salvo `#NNN R<n>` | La clase nueva (`absolute inset-x-0 top-0 opacity-0`) no es arbitraria; los comentarios del fuente citan `#234 R<n>`; ningún hex ni `StyleSheet` |
| `nutrition-canvas-fidelity.test.ts` línea `leading-body` en `AI_EXPLANATION` | presencia de la cadena | `renderBlocks` conserva `leading-body` |
| `profile-canvas-fidelity.test.ts` (`filesMatching(/\btext-13\b/)`) | lista de ficheros con `text-13` | `ai-explanation.tsx` sigue en la lista; no hay fichero nuevo |
| `ui-language.test.ts` y `ui-copy-table.ts` (`food.aiShowMore`, `food.aiShowLess`, `food.aiDisclaimer`) | llamadas `t(` y filas de copy | Sin `t(` nuevas ni filas nuevas: el recuento `+ 1 // #224 R4` no se mueve |
| `design-drift.test.ts` (`HEX_LITERAL`, `ARBITRARY_CLASS`, `SHADOW_ESCAPES`, `StyleSheet`) | literales prohibidos | Ninguno nuevo |
| `consistency-classnames.test.ts`, `legibility-classnames.test.ts` | clases de la carta (p. ej. `opacity-70`/`opacity-80`) | `opacity-0` no está vetada; verificar con T0 |
| `#224 R5` del propio test | recetas por bloque y 6 hijos de `food-ai-content` | `food-ai-content` no cambia de contenido |

Los candados de unos y otros se miden con T0 (verde **antes** de editar) y
tras cada commit de producción. `food/index.test.tsx` tiene flakes conocidos
(Nutrición #200 R9 y R10, por carrera con el plan): si falla un `it` ajeno bajo carga, repetir sin
el flag y anotarlo; no se enmienda.

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| `onTextLayout` en cada `Text` | Mide líneas por `Text`: no suma márgenes, viñetas ni `gap`, y los `Text` viven dentro del recorte, así que seguiría siendo una medida bajo `maxHeight` |
| Contar líneas o caracteres para decidir | No es el layout real (cambia con ancho, fuente y negrita); contradice la medida por alto de #224 R6 |
| `display: none` en el medidor | Sin layout no hay `onLayout` |
| Medir con `onLayout` en el padre sin recorte (`food-ai-body` sin `maxHeight`) | Es otro lazo: el padre es el que se recorta |
| Recortar con un `View` interno de alto fijo en vez de `maxHeight` | Cambia el aspecto aprobado (se quedaría 122 aunque el texto sea corto) y no elimina la medida |
| Ignorar eventos mientras está recortado / cerrojo con la primera medida | Una bandera más de estado; falla al expandir y no se rehace al cambiar el texto (R6 `it` 3 lo candea) |
| Medir una vez al montar y guardar en `useRef` | No se recalcula con texto nuevo ni con cambios de ancho |
| Tabla de alturas por número de caracteres | Un número a mano que caduca (memoria de constantes congeladas) |

## Plan B (no entra en esta spec, D8)

Si el smoke G2 reprueba con el medidor fuera del recorte, el candidato es un
cerrojo por texto (una vez medido más de 122 para un `text`, no volver a
desrecortar hasta que el texto cambie). No se implementa ahora porque (a) añade
estado, (b) tapa un síntoma en lugar de abrir el lazo y (c) R6 `it` 3 está
escrito para impedir un cerrojo que no se rehace. Si hiciera falta, es una
enmienda con la evidencia del dispositivo.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El diagnóstico (mecanismo de la oscilación) no está medido | El arreglo abre el lazo con independencia del mecanismo; el smoke G2 lo confirma y la spec lo declara en «Contexto» |
| El medidor mide un ancho distinto del visible | Absoluto con `inset-x-0` en una raíz sin relleno; el smoke lo confirma en claro y oscuro |
| Un hijo absoluto más alto que la tarjeta añade espacio o desplazamiento | Los hijos absolutos no cuentan en el alto del padre en Yoga; el smoke (paso 5) lo mira |
| TalkBack lee el texto dos veces | Doble ocultación (`accessibilityElementsHidden` + `importantForAccessibility`); R3 la candea y el smoke (paso 6) la confirma |
| Consultas de otros tests ven dos copias | Las consultas por defecto excluyen lo oculto; R3 fija 1 vs 2; T0/T1 sobre `src/screens/food` |
| `renderBlocks` con la variante «sin testID» divergente | R2 compara la forma de cada hijo del medidor con la del hijo visible, con tres textos (una fila por rama del parser) |
| Salto único al primer pintado (D7) | Se declara; no es un lazo; si molesta, otra enmienda |
| Commit intermedio con medidor vacío (par 1 de [[tasks]]) | El commit de producción del par 1 deja el medidor sin hijos; no se mergea suelto (la rama se mergea entera, y el par 2 lo completa) |
