---
feature: "mobile-welcome-pingo"
status: draft        # draft | approved
tags: [harness, spec, mobile, ui-delight]
---

# Trazabilidad — [[mobile-welcome-pingo]] (#153)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/welcome/index.test.tsx`::`#153 R1: el saludo de Pingo existe en los dos idiomas` (5 `it`: 3 en T4, los 2 del bocadillo en T5); `src/providers/__tests__/language-provider.test.tsx` (C1); `src/__tests__/ui-language.test.ts::resuelve las 9 ocurrencias de welcome (#153 R1)` (C2, C3) | `1a363846 test(mobile-welcome): #153 R1 red pingo greeting copy`<br>`be5a716e feat(mobile-welcome): #153 R1 pingo greeting copy`<br>`59b13cbf test(mobile-welcome): #153 R5 red pingo scene replaces the logo`<br>`2e677522 feat(mobile-welcome): #153 R5 pingo scene replaces the logo` |
| R2 | `src/screens/welcome/index.test.tsx`::`#153 R2: la carta escribe la voz de Pingo` (3 `it`) | `a9064d8a test(mobile-welcome): #153 R2 red pingo voice in the charter`<br>`6f0e54f8 feat(mobile-welcome): #153 R2 pingo voice in the charter` |
| R3 | `src/screens/welcome/index.test.tsx`::`#153 R3: las poses entran como WebP` > `%s es un WebP con alfa de 1024×1024 y como mucho 100 000 bytes` (2 filas) | `3f974134 test(mobile-welcome): #153 R3 red pingo webp poses`<br>`be10ffef feat(mobile-welcome): #153 R3 pingo webp poses` |
| R4 | `src/theme/__tests__/motion.test.ts`::`#153 R4: las constantes de Pingo viven en motion.ts` (3 `it`); `no exporta nada más` (C4) | `f7943c81 test(mobile-welcome): #153 R4 red pingo motion constants`<br>`3083d34d feat(mobile-welcome): #153 R4 pingo motion constants` |
| R5 | `src/screens/welcome/index.test.tsx`::`#153 R5: la escena de Pingo sustituye al logo` (4 `it`); `apila los siete bloques en orden` (C5); `pinta marca, tagline y legal con sus clases` (C6) | `59b13cbf test(mobile-welcome): #153 R5 red pingo scene replaces the logo`<br>`2e677522 feat(mobile-welcome): #153 R5 pingo scene replaces the logo` |
| R6 | `src/screens/welcome/index.test.tsx`::`#153 R6: Pingo se pinta con su pose y su capa de parpadeo` (2 `it` y un `it.each` de 2 filas) | `78ad2489 test(mobile-welcome): #153 R6 red pingo pose and blink layer`<br>`69780061 feat(mobile-welcome): #153 R6 pingo pose and blink layer` |
| R7 | `src/screens/welcome/index.test.tsx`::`#153 R7: el CTA primario tiene cuerpo` (2 `it`); `es el botón primario del repo` (C7) | `d6cade3d test(mobile-welcome): #153 R7 red primary cta lip`<br>`2caff4fe feat(mobile-welcome): #153 R7 primary cta lip` |
| R8 | `src/screens/welcome/index.test.tsx`::`#153 R8: el contenido entra con las constantes de motion.ts` (5 `it`; sustituye al describe `R10` de #118, C8) | `ac731b91 test(mobile-welcome): #153 R8 red entrance from motion.ts`<br>`4a41eabc feat(mobile-welcome): #153 R8 entrance from motion.ts` |
| E1 | `src/screens/welcome/index.test.tsx`::`#153 E1: la carta retira WELCOME_ENTRANCE_MS de la migración pendiente` > `deja en la lista solo las cinco constantes pendientes`; sondas S1-S3 del reviewer | `8b8bd35e test(mobile-welcome): #153 E1 red charter retires WELCOME_ENTRANCE_MS`<br>`b273cf52 feat(mobile-welcome): #153 E1 charter retires WELCOME_ENTRANCE_MS` |
| R9 | `src/screens/welcome/index.test.tsx`::`#153 R9: Pingo entra con un muelle de escala` (4 `it`) | `5545b4ae test(mobile-welcome): #153 R9 red pingo entrance scale`<br>`9c1a1450 feat(mobile-welcome): #153 R9 pingo entrance scale` |
| R10 | `src/screens/welcome/index.test.tsx`::`#153 R10: Pingo flota en bucle` (4 `it`) | `5cacd60a test(mobile-welcome): #153 R10 red pingo idle float`<br>`4c2f54af feat(mobile-welcome): #153 R10 pingo idle float` |
| R11 | `src/screens/welcome/index.test.tsx`::`#153 R11: Pingo parpadea cada cuatro segundos` (4 `it`) | `8c48d8a8 test(mobile-welcome): #153 R11 red pingo blink`<br>`23be4df3 feat(mobile-welcome): #153 R11 pingo blink` |
| R12 | `src/screens/welcome/index.test.tsx`::`#153 R12: la parada de los bucles la hace Reanimated` > `no cancela a mano ni devuelve limpieza`; sonda del reviewer de tasks.md T12 | `cd87dcb1 test(mobile-welcome): #153 R12 lock no manual loop cleanup` |
| R13 | `src/screens/welcome/index.test.tsx`::`#153 R13: Pingo no trae dependencias nuevas` > `no declara Lottie, Rive ni expo-linear-gradient`; `src/__tests__/design-drift.test.ts::#118 R11: la bienvenida no mete drift de estilo` sin tocar; diff vacío de `package.json` y `bun.lock` contra el HEAD del handoff | `21b60da6 test(mobile-welcome): #153 R13 lock no new animation deps` |
| R14 | Smoke humano en dev build de Android, pasos de requirements.md R14; casilla «Smoke R14» de requirements.md §Aprobación | pendiente (lo firma el humano) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
