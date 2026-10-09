---
feature: "mobile-empty-states-pingo"
tags: [harness, spec, mobile, ui-delight]
---

# Trazabilidad — [[mobile-empty-states-pingo]] (#155)

Una fila por requisito. El implementador rellena las dos columnas de commit
tras el commit verde de cada tarea. R10 y R11 son candados que nacen en
verde: su «Commit rojo» es el de las sondas apuntadas en
`progress/impl_mobile-empty-states-pingo.md` y su «Commit verde» es el del
test. R12 lo cierra el humano en requirements.md §Aprobación.

Convención de commits: `test(mobile-empty-states): #155 R<n> red <qué>` y
`feat(mobile-empty-states): #155 R<n> <qué>`.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 — copy de los vacíos en/es | `src/components/__tests__/empty-state.test.tsx::#155 R1: el copy de los vacíos existe en los dos idiomas`; `src/providers/__tests__/language-provider.test.tsx` (C1) | `9ced6cc5 test(mobile-empty-states): #155 R1 red copy de los vacíos` | `d6528bd0 feat(mobile-empty-states): #155 R1 copy de los vacíos` |
| R2 — seis poses WebP | `src/components/__tests__/empty-state.test.tsx::#155 R2: las poses de los vacíos entran como WebP`; `src/screens/welcome/index.test.tsx::no mete otras poses de Pingo` (C2) | `e3ddd2ab test(mobile-empty-states): #155 R2 red poses WebP` | `d7b6aa28 feat(mobile-empty-states): #155 R2 poses WebP` |
| R3 — componente `EmptyState` | `src/components/__tests__/empty-state.test.tsx::#155 R3: un único componente pinta los vacíos ilustrados`; `src/__tests__/consistency-classnames.test.ts` (C3) | `d7455e94 test(mobile-empty-states): #155 R3 red componente EmptyState` | `22c8d591 feat(mobile-empty-states): #155 R3 componente EmptyState` · E2: `d84b47ae test(mobile-empty-states): #155 R3 candado de orden y botón` |
| R4 — sin mascotas en cuatro pantallas | `src/screens/home/index.test.tsx::#155 R4: Inicio sin mascotas presenta a Pingo`; `src/screens/health/index.test.tsx::#155 R4: Salud sin mascotas presenta a Pingo`; `src/app/(tabs)/__tests__/food.test.tsx::#155 R4: Comida sin mascotas presenta a Pingo`; `src/screens/map/index.test.tsx::#155 R4: Mapa sin mascotas presenta a Pingo`; `src/__tests__/ui-language.test.ts` (C4 a C7) | `0c236ef4 test(mobile-empty-states): #155 R4 red sin mascotas` | `b33be109 feat(mobile-empty-states): #155 R4 sin mascotas` · E2: `b4abfe7d test(mobile-empty-states): #155 R4 candado de sitio` |
| R5 — sin alertas | `src/screens/alerts/index.test.tsx::#155 R5: sin alertas, Pingo duerme` | `1226da46 test(mobile-empty-states): #155 R5 red alertas` | `59eb7eca feat(mobile-empty-states): #155 R5 alertas` · E2: `96bda091 test(mobile-empty-states): #155 R5 candado de sitio` |
| R6 — sin recordatorios | `src/screens/reminders/index.test.tsx::#155 R6: sin recordatorios, Pingo sostiene su lista` | `13e323e2 test(mobile-empty-states): #155 R6 red recordatorios` | `344a7fcb feat(mobile-empty-states): #155 R6 recordatorios` · E2: `5b24557c test(mobile-empty-states): #155 R6 candado de sitio` |
| R7 — sin documentos | `src/screens/docs/index.test.tsx::#155 R7: sin documentos, Pingo los guarda` | `5fdbff46 test(mobile-empty-states): #155 R7 red documentos` | `6e61e1c2 feat(mobile-empty-states): #155 R7 documentos` · E2: `bedbfb8f test(mobile-empty-states): #155 R7 candado de sitio` |
| R8 — sin zonas seguras | `src/screens/geofences/index.test.tsx::#155 R8: sin zonas seguras, Pingo enseña el collar` | `dae5d2d6 test(mobile-empty-states): #155 R8 red zonas seguras` | `63e531a9 feat(mobile-empty-states): #155 R8 zonas seguras` · E2: `397bbc2e test(mobile-empty-states): #155 R8 candado de sitio` |
| R9 — sin plan de comidas | `src/app/(tabs)/__tests__/food.test.tsx::#155 R9: sin plan de comidas, Pingo enseña el cuenco` | `2a1e61ba test(mobile-empty-states): #155 R9 red plan de comidas` | `8b6eb528 feat(mobile-empty-states): #155 R9 plan de comidas` · E2: `2a589c65 test(mobile-empty-states): #155 R9 candado de sitio` |
| R10 — vacíos en texto | `src/components/__tests__/empty-state.test.tsx::#155 R10: los vacíos que no se ilustran siguen en texto` | sondas S1-S2 (impl) | `309570ba test(mobile-empty-states): #155 R10 candado de vacíos en texto` |
| R11 — sin movimiento ni dependencias | `src/components/__tests__/empty-state.test.tsx::#155 R11: los vacíos no traen movimiento ni dependencias` | sonda S3 (impl) | `25f46e87 test(mobile-empty-states): #155 R11 candado sin movimiento` · E2: `d4063486 test(mobile-empty-states): #155 R11 candado de Animated y transiciones` |
| R12 — smoke en dev build de Android | manual (requirements.md §Aprobación, «Smoke R12») | sin test: smoke del humano en dev build de Android, superado el 2026-10-09 | `db033b17 Smoke R12 superado` (casilla firmada por el humano); gate del leader: `./init.sh` sobre `7d10fb25`, exit 0 (backend 176/1348, móvil 97/2365, e2e 29 de 32 suites con 438 tests); reviewer APROBADO en la ronda 2 (`f986c72c`) |
