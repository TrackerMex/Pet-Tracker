---
feature: "mobile-ui-legibility-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-ui-legibility-polish]]

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-ui-legibility): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Los R-ids conservan su número desde la primera versión de la spec, aunque la
decisión de contraste se revirtiera el 2026-09-03: **R1 y R5-R12 no cambiaron
de contenido**; R2, R3 y R4 sí, pero mantienen su número para no romper la
trazabilidad ya escrita ([[design]] §10).

## R-id → criterio de aceptación → test → hallazgo del audit

| Requisito | Criterio de aceptación (#61 en `feature_list.json`) | Test (archivo::describe) | Hallazgo audit | Commit |
|---|---|---|---|---|
| R1 | AC8 — "El botón destructivo del bottom sheet de reminders resuelve su etiqueta con el token de danger, no con el del acento" | `src/__tests__/legibility-classnames.test.ts::#61 R1: la etiqueta destructiva usa el token de danger` | **21** | `bbb7931` (rojo `87dd3ce`) |
| R2 | AC1 (**redactado obsoleto**, ver §Criterios obsoletos) — cubre su intención: la etiqueta sobre el acento pasa AA en los dos temas | `src/theme/__tests__/global-css.test.ts::#61 R2: el relleno de acento pasa AA con etiqueta blanca` | **1** (token) | `0abaf8c` (rojo `ed5e9ae`) |
| R3 | AC1 — misma intención: ningún texto sobre `bg-accent` queda por debajo de AA, tampoco los compuestos con opacidad | `src/__tests__/legibility-classnames.test.ts::#61 R3: ningún texto sobre bg-accent se compone con opacidad` | **1** (4 nodos) | `67a9177` (rojo `0860e10`) |
| R4 | AC2 — "text-accent como color de enlace sobre bg-surface y sobre bg-default pasa AA" | `src/theme/__tests__/global-css.test.ts::#61 R4: token accent-strong con AA como tinta en los dos temas` + `src/__tests__/legibility-classnames.test.ts::#61 R4: el acento como tinta usa accent-strong` | **3** | `aacf81e` (rojo `caadc07`) |
| R5 | AC2 — "…y text-warning deja de usarse como color de texto sobre esas superficies; el ámbar puro queda reservado a iconos y rellenos como hace el diseño" | `src/theme/__tests__/global-css.test.ts::#61 R5: token warning-strong con AA sobre surface y warning-soft` + `src/__tests__/legibility-classnames.test.ts::#61 R5: text-warning deja de usarse como color de texto` | **2** | pendiente |
| R6 | AC3 — "text-muted sobre bg-default pasa AA en tema claro (hoy 4,47:1, falla por 0,03), sin cambiar su valor en tema oscuro donde ya pasa" | `src/theme/__tests__/global-css.test.ts::#61 R6: muted light pasa AA sobre bg-default sin tocar dark` | **19** | pendiente |
| R7 | AC4 — "Register usa contentInsetAdjustmentBehavior y padding en contentContainerStyle con useSafeAreaInsets como las otras once pantallas con scroll" | `src/app/(auth)/__tests__/register.test.tsx::#61 R7: register usa las métricas de pantalla uniformes` | **5** | pendiente |
| R8 | AC4 — "…y Login, Forgot y Reset password ganan contenedor de scroll: con el teclado abierto en Android se alcanza todo el contenido y en un teléfono corto nada se recorta" | `src/app/(auth)/__tests__/login.test.tsx::#61 R8: …` + `src/app/(auth)/__tests__/forgot.test.tsx::#61 R8: …` + `src/screens/reset-password/index.test.tsx::#61 R8: las tres ramas de reset tienen contenedor de scroll` | **6** | pendiente |
| R9 | AC5 — "El label de sección de pet-info-card vuelve al tratamiento que fijó #46 R10…: la pantalla Profile deja de tener dos estilos para el mismo rol" | `src/screens/profile/index.test.tsx::#61 R9: la etiqueta de sección de pet-info-card vuelve a #46 R10` | **7** | pendiente |
| R10 | AC6 — "Los objetivos táctiles de las tres recetas del hallazgo 13 (filas de enlace, chips y botones de volver) llegan a 44pt sin cambiar el tamaño visible del control ni su testID" | En los 7 archivos de [[requirements]] R10, todos `::#61 R10: los controles táctiles declaran TOUCH_SLOP` | **13** | pendiente |
| R11 | AC7 — "El overlay de stats del mapa deja de envolver texto: los cuatro tiles siguen siendo cuatro y ningún valor se corta ni salta de línea con los textos más largos que hoy renderiza" | `src/app/(tabs)/__tests__/map.test.tsx::#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver` | **4** | pendiente |
| R12 | AC9 — "Suite móvil completa verde sin reescribir ningún assert de conducta; git diff no toca ningún archivo de backend-pet-tracker/ ni ningún .test.tsx salvo tests nuevos que nombren su R-id" | Gate mecánico del `reviewer`: `bun test` + `git diff origin/main...HEAD --stat` (no es un test de jest) | — (invariante de #46/#61) | pendiente |

## Criterios de aceptación sin R-id propio

| Criterio | Cobertura | Estado |
|---|---|---|
| AC10 — "Gate humano: smoke en dev build de Android comparando lado a lado con el Figma, en tema claro Y oscuro… **No delegable a IA**" | **Sin R-id: no es automatizable.** Guion de 9 puntos en [[tasks]] §Cierre. El `leader` no puede marcar la feature `done` hasta que el humano lo cierre, aunque el `reviewer` haya aprobado | pendiente |

Los diez criterios quedan cubiertos: AC1→R2+R3, AC2→R4+R5, AC3→R6, AC4→R7+R8,
AC5→R9, AC6→R10, AC7→R11, AC8→R1, AC9→R12, AC10→gate humano.

## Criterios obsoletos en `feature_list.json` (redacción sustitutiva propuesta)

La `description` de #61 se actualizó con la decisión revertida del 2026-09-03,
pero **dos criterios de aceptación siguen con la redacción anterior y dicen lo
contrario de lo que la `description` ya recoge**. Esta spec implementa la
`description` (más reciente y explícitamente marcada "DECISION REVISADA") y deja
aquí el texto sustitutivo para que el humano lo pegue; no lo edita por su cuenta
porque `acceptance_criteria` es contrato suyo.

| # | Redacción vigente (obsoleta) | Redacción propuesta |
|---|---|---|
| AC1 | "Un token de texto sobre acento, definido en src/theme/global.css junto al resto, da >=4,5:1 contra bg-accent en los dos temas; **--accent conserva el valor #2AB87C exacto del diseno y ningun relleno cambia de color**" | "El relleno de acento se oscurece a #178255 conservando el hue del Figma (154,7 grados), de modo que la etiqueta blanca da >=4,5:1 encima en los dos temas; --accent-foreground sigue siendo #FFFFFF y el acento usado como tinta pasa a --accent-strong, que en dark recupera el #2AB87C original. La desviacion respecto al #2AB87C que fijo #46 R1 queda escrita en docs/ui-guidelines.md" |
| AC10 | "Gate humano: smoke en dev build de Android comparando lado a lado con el Figma, en tema claro Y oscuro, **confirmando que ningun relleno cambio de color** y que las etiquetas se leen. No delegable a IA" | "Gate humano: smoke en dev build de Android comparando lado a lado con el Figma, en tema claro Y oscuro, confirmando que el acento se ve mas oscuro que el Make a proposito, que las etiquetas blancas se leen encima y que el verde de tinta sigue vivo en dark. No delegable a IA" |

## Cobertura de los hallazgos en alcance

| Hallazgo | Requisito | |
|---|---|---|
| 1 | R2 + R3 | ✔ |
| 2 | R5 | ✔ |
| 3 | R4 | ✔ |
| 4 | R11 | ✔ |
| 5 | R7 | ✔ |
| 6 | R8 | ✔ |
| 7 | R9 | ✔ |
| 13 | R10 (menos `pet-switcher`, medido en 52 pt: [[design]] §D5) | ✔ |
| 19 | R6 | ✔ |
| 21 | R1 | ✔ |

Hallazgos 8-12, 14-18, 20 y 22-26: **fuera de alcance**, son la feature #62.
Hallazgo 18: cerrado por decisión humana del 2026-09-03, ver [[design]] §9.
