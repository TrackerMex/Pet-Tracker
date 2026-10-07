---
feature: "mobile-welcome-pingo"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui-delight]
---

# Trazabilidad — [[mobile-welcome-pingo]] (#153)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/welcome/index.test.tsx`::`#153 R1: el saludo de Pingo existe en los dos idiomas` (5 `it`: 3 en T4, los 2 del bocadillo en T5); `src/providers/__tests__/language-provider.test.tsx` (C1); `src/__tests__/ui-language.test.ts::resuelve las 9 ocurrencias de welcome (#153 R1)` (C2, C3) | pendiente (T4 y T5) |
| R2 | `src/screens/welcome/index.test.tsx`::`#153 R2: la carta escribe la voz de Pingo` (3 `it`) | pendiente (T1) |
| R3 | `src/screens/welcome/index.test.tsx`::`#153 R3: las poses entran como WebP` > `%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes` (2 filas) | pendiente (T3) |
| R4 | `src/theme/__tests__/motion.test.ts`::`#153 R4: las constantes de Pingo viven en motion.ts` (3 `it`); `no exporta nada más` (C4) | pendiente (T2) |
| R5 | `src/screens/welcome/index.test.tsx`::`#153 R5: la escena de Pingo sustituye al logo` (4 `it`); `apila los siete bloques en orden` (C5); `pinta marca, tagline y legal con sus clases` (C6) | pendiente (T5) |
| R6 | `src/screens/welcome/index.test.tsx`::`#153 R6: Pingo se pinta con su pose y su capa de parpadeo` (2 `it` y un `it.each` de 2 filas) | pendiente (T6) |
| R7 | `src/screens/welcome/index.test.tsx`::`#153 R7: el CTA primario tiene cuerpo` (2 `it`); `es el botón primario del repo` (C7) | pendiente (T7) |
| R8 | `src/screens/welcome/index.test.tsx`::`#153 R8: el contenido entra con las constantes de motion.ts` (5 `it`; sustituye al describe `R10` de #118, C8) | pendiente (T8) |
| R9 | `src/screens/welcome/index.test.tsx`::`#153 R9: Pingo entra con un muelle de escala` (4 `it`) | pendiente (T9) |
| R10 | `src/screens/welcome/index.test.tsx`::`#153 R10: Pingo flota en bucle` (4 `it`) | pendiente (T10) |
| R11 | `src/screens/welcome/index.test.tsx`::`#153 R11: Pingo parpadea cada cuatro segundos` (4 `it`) | pendiente (T11) |
| R12 | `src/screens/welcome/index.test.tsx`::`#153 R12: la parada de los bucles la hace Reanimated` > `no cancela a mano ni devuelve limpieza`; sonda del reviewer de tasks.md T12 | pendiente (T12) |
| R13 | `src/screens/welcome/index.test.tsx`::`#153 R13: Pingo no trae dependencias nuevas` > `no declara Lottie, Rive ni expo-linear-gradient`; `src/__tests__/design-drift.test.ts::#118 R11: la bienvenida no mete drift de estilo` sin tocar; diff vacío de `package.json` y `bun.lock` contra el HEAD del handoff | pendiente (T13) |
| R14 | Smoke humano en dev build de Android, pasos de requirements.md R14; casilla «Smoke R14» de requirements.md §Aprobación | pendiente (lo firma el humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
