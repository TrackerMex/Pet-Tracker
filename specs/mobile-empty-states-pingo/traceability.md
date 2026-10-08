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
| R1 — copy de los vacíos en/es | `src/components/__tests__/empty-state.test.tsx::#155 R1: el copy de los vacíos existe en los dos idiomas`; `src/providers/__tests__/language-provider.test.tsx` (C1) | | |
| R2 — seis poses WebP | `src/components/__tests__/empty-state.test.tsx::#155 R2: las poses de los vacíos entran como WebP`; `src/screens/welcome/index.test.tsx::no mete otras poses de Pingo` (C2) | | |
| R3 — componente `EmptyState` | `src/components/__tests__/empty-state.test.tsx::#155 R3: un único componente pinta los vacíos ilustrados`; `src/__tests__/consistency-classnames.test.ts` (C3) | | |
| R4 — sin mascotas en cuatro pantallas | `src/screens/home/index.test.tsx::#155 R4: Inicio sin mascotas presenta a Pingo`; `src/screens/health/index.test.tsx::#155 R4: Salud sin mascotas presenta a Pingo`; `src/app/(tabs)/__tests__/food.test.tsx::#155 R4: Comida sin mascotas presenta a Pingo`; `src/screens/map/index.test.tsx::#155 R4: Mapa sin mascotas presenta a Pingo`; `src/__tests__/ui-language.test.ts` (C4 a C7) | | |
| R5 — sin alertas | `src/screens/alerts/index.test.tsx::#155 R5: sin alertas, Pingo duerme` | | |
| R6 — sin recordatorios | `src/screens/reminders/index.test.tsx::#155 R6: sin recordatorios, Pingo sostiene su lista` | | |
| R7 — sin documentos | `src/screens/docs/index.test.tsx::#155 R7: sin documentos, Pingo los guarda` | | |
| R8 — sin zonas seguras | `src/screens/geofences/index.test.tsx::#155 R8: sin zonas seguras, Pingo enseña el collar` | | |
| R9 — sin plan de comidas | `src/app/(tabs)/__tests__/food.test.tsx::#155 R9: sin plan de comidas, Pingo enseña el cuenco` | | |
| R10 — vacíos en texto | `src/components/__tests__/empty-state.test.tsx::#155 R10: los vacíos que no se ilustran siguen en texto` | | |
| R11 — sin movimiento ni dependencias | `src/components/__tests__/empty-state.test.tsx::#155 R11: los vacíos no traen movimiento ni dependencias` | | |
| R12 — smoke en dev build de Android | manual (requirements.md §Aprobación, «Smoke R12») | | |
