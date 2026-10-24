# Enmienda de la spec #196 (mobile-profile-photo-hero-canvas)

- **Fecha:** 2026-10-23
- **Branch:** `feature/196-mobile-profile-photo-hero-canvas`
- **Commit:** `e3c0d7e0`. Contiene `specs/mobile-profile-photo-hero-canvas/` y la auditoría. Sin push.
- **Entrada:** `progress/inventory-audit_mobile-profile-photo-hero-canvas.md`.

He comprobado cada hallazgo con `grep -cF` del literal contra el árbol, y los de #197 con `git show feature/197-mobile-canvas-foundations:…` @ `fb6ef4b6`. La spec no está firmada. El `status` del frontmatter sigue igual.

## Por hallazgo

| # | Cambio | Abierto |
|---|---|---|
| F1 | K36: las dos declaraciones de `PetSwitcher` en `T` añaden `trailing?: ReactNode`. `ReactNode` ya se importa en `T`, línea `import { useEffect, useState, type ReactNode } from 'react'`. Va en el rojo del bloque R2+R5. Ancla 0 → 2. | — |
| F2 | K37: `MockIcon` reenvía `strokeWidth` al `View`, como ya hace con `size`. Va en el rojo de R1+R4, porque la cámara es la primera lectura. Ancla `function MockIcon({ color, size }: { color?: string; size?: number })` 1 → 0. | — |
| F3 | K38 (en `T`, rojo de R1+R4) y D15. Las funciones salen del doble de `pet-hero-header.test.tsx`, anclado por `withSequence: jest.fn((...steps: unknown[]) => steps.at(-1))`. La forma de módulo sale de `home/index.test.tsx`: `...actual` con `__esModule: true,` y sin sobrescribir `default`. | Me aparto de copiar el doble tal cual. El de `pet-hero-header.test.tsx` no lleva `__esModule` y sobrescribe `default`, y `BubblePop` usa `Animated.View` del import por defecto. Lo he deducido leyendo el código; no se ha probado con jest. |
| F4 | K40: el piso de `cardElements` baja de 41 a 39 en el rojo de R1+R4, y el título recibe el sufijo ` (enmendado por #196 R1, R5)`. Los otros pisos aguantan: hero 211 → 208 sobre 197, className 169 → 167 sobre 163. | El comentario dice `#196 R1, R5`, no `#196 R3, R5`. La tarjeta hero desaparece en R1 (ya lo decía el verde de R1), así que el «R3» de la auditoría era incorrecto. |
| F5 | K41: el `marker` de la fila 4 de `AMENDED_DOCS_168` pasa a ser el texto exacto de la N1 de #196. `file`, `feature` y `change` no cambian. El `it` recibe el sufijo ` (enmendado por #196 R11)`. Elegí reescribir y no conservar la prosa B4, porque dos N1 en la carta se contradirían. Va en el **verde** de R11 junto con la carta, como pediste. | Es la única enmienda de candado que va en un verde. |
| F6 | Nuevo R1.5: `grep -cE '#[0-9a-fA-F]{3,8}\b' P` = 0, comentarios incluidos. `H` sí admite `// #196 R3`. En design.md he corregido la frase falsa sobre `#173 R15`, y el requisito queda también en «Deben seguir verdes» y en el handoff. | — |
| S1 | K3 retirada (fila tombstone) y su `it` pasa a «Deben seguir verdes». | — |
| S2, S3 | K13 y K14 quedan concretos: `style` pasa a `{ width: '100%', height: 430 }`, y `width` a `'100%'` y `height` a 430, según el código de `pet-avatar.tsx`. | — |
| S4 | «dos» cambiado a «tres» `text-accent-strong` en requirements.md y en design.md. | — |

## Decisiones del leader aplicadas

- **Regla uniforme de `#197 R20` (K35).** Se borra el `describe` entero, con sus dos `it`, sin sufijo, en el rojo de R7.
  - `useChunkyLip` vive en `src/theme/chunky-lip.ts` y no es cimiento.
  - La firma de `ToggleSwitch` está citada en design.md.
  - Si otra feature de la ola 2 ya lo borró, K35 no tiene efecto y se anota.
- **Altura del hero: solo 430.** Lo he comprobado con grep en requirements.md y design.md.
- **Sin fila MT.** `RiseIn` se atribuye a #197 R24 en D13, en Fuera de alcance y en design.md.

## Cambios de estructura no pedidos

- **R3.2 pasa a R1.4.**
  - Motivo: R3 va antes que R1, así que un rojo de R3 sobre Perfil afirmaría nodos que todavía no existen (sujeto ausente).
  - El `it` cambia de nombre a `#196 R1: pinta nombre y chips dentro del pie del hero`.
  - Por el mismo motivo, K12, K19 y K28 pasan a R1.
- **Bloques R1+R4 y R2+R5 (D14).** Cada bloque tiene un rojo y un verde, y la trazabilidad comparte hashes.
- **Enmiendas en dos pasos.**
  - K20: paso 1 en R1+R4, paso 2 en R6.
  - K21: pasa a R6.
  - K31: `: 1` en R1+R4 y `: 2` en R2+R5.
- **K9 en dos pasos (hallazgo nuevo).**
  - Problema: `content.parent?.props.testID === 'screen-profile'` se rompe en el verde de R1+R4, porque `profile-content` envuelve la fila de título.
  - Paso 1, en R1+R4: solo la paternidad, `content.props.testID === 'profile-content'`.
  - Paso 2, en R2+R5: la receta de R5.
- **K39 (hallazgo nuevo).**
  - Problema: `screens.test.tsx` › `renders the $title placeholder` deja `listPets` pendiente, así que con hero el título vive en `pet-hero-slot`, que arranca con opacidad 0.
  - Cambio: el mismo doble de reanimated, en el rojo de R2+R5.
- **R9 nace verde.** Queda como candado de consolidación, sin commit verde propio. También se espera que nazcan verdes R4.2 y R5.4.

## Revisión de los ficheros que la auditoría no cubrió

| Fichero | Resultado |
|---|---|
| `(tabs)/__tests__/profile.test.tsx` | Solo `R2: route Profile delgada`. Sin impacto. |
| `(tabs)/__tests__/screens.test.tsx` | Necesita K39. `R6: profile permite cerrar sesión` sigue verde. |
| `pet-switcher.test.tsx` | `#173 R4: variante avatars` sigue verde (D6). |
| `screens/health/index.test.tsx` | Sin tocar. |

Los cuatro están listados en «Deben seguir verdes».

## Abierto

- **Re-medir las anclas de #197 tras su merge en `dev`.** Las marcadas `(#197: …)` en §Base medida se midieron sobre la branch @ `fb6ef4b6`, ya no sobre `b322c0a8`.
- **Sin comprobar con jest:**
  - el doble de reanimated (K38, K39);
  - que los `it` previos de `T` sigan verdes con las animaciones en identidad. Si alguno se pone rojo, es parada.
- La spec solo tiene R1–R11. No hay R12 ni posteriores.
- La casilla `Enmienda #196 aprobada por humano` sigue haciendo de gate para el verde de R11 y para el bloque R1+R4.
