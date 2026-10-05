---
feature: mobile-welcome-splash
id: 118
status: approved
tags: [harness, spec, mobile, ui]
---

# Trazabilidad — #118 mobile-welcome-splash

| Requisito | Test (archivo::nombre) | Commit |
| --- | --- | --- |
| R1 | `src/providers/__tests__/language-provider.test.tsx::mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` (+8) | `81ac3fb9` → `01b340fd` |
| R1 | `src/__tests__/ui-language.test.ts::#118 R1: welcome resuelve su copy por clave › resuelve las 8 ocurrencias de welcome` | `cf9407ad` → `fa75f06a` |
| R1 | `src/__tests__/ui-language.test.ts::no deja ningún valor fijo del catálogo como literal entero en las pantallas` (`SCREEN_FILES` +1) | `cf9407ad` → `fa75f06a` |
| R1 | `src/__tests__/ui-copy-table.ts::cuadra ALL_USES con la suma de sus bloques` (`R16_WELCOME`) | `cf9407ad` → `fa75f06a` |
| R2 | `src/app/__tests__/index.test.tsx::#118 R2: redirects an unauthenticated session to welcome` | `c5b6b0be` → `14c389c1` |
| R3 | `src/screens/welcome/index.test.tsx::R3 › registra welcome bajo su propio guard de no autenticado` | `a7c3a656` → `431894bc`; refactor `2f28f62c` |
| R3 | `src/screens/welcome/index.test.tsx::R3 › deja el route de welcome delgado` | `a7c3a656` → `431894bc`; refactor `2f28f62c` |
| R3 | `src/app/__tests__/layout.test.tsx::#118 R3: RootStack declara welcome bajo su propia guarda › declara welcome como sexto hijo bajo Stack.Protected` (+ `toHaveLength(5 + 1)` en `#95 R2`) | `a7c3a656` → `431894bc`; refactor `2f28f62c` |
| R4 | `src/screens/welcome/index.test.tsx::R4 › con sesión redirige a home y no pinta la pantalla` | `a7c3a656` → `431894bc` |
| R5 | `src/screens/welcome/index.test.tsx::R5 › aplica las dimensiones del grupo sin tab bar` | `a7c3a656` → `431894bc` |
| R5 | `src/screens/welcome/index.test.tsx::R5 › apila los siete bloques en orden` | `a7c3a656` → `431894bc` |
| R5 | `src/screens/welcome/index.test.tsx::R5 › pinta hero, marca, tagline y legal con sus clases` | `a7c3a656` → `431894bc`; ronda 2 `3932781d` (nace verde; sonda E5 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › asigna el testID de cada chip` (fila 1) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › aplica la misma clase a cada chip` (fila 2) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › pinta el icono de cada chip` (fila 3) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › usa iconos de 14 puntos` (fila 4) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › resuelve la tinta accent-strong de cada icono` (fila 5) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › resuelve la etiqueta de cada chip por su clave` (fila 6) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › aplica la clase de tinta a cada etiqueta` (fila 7) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › ordena GPS, Salud y Nutrición` (fila 8) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › deja dos hijos por chip, icono y etiqueta` (fila 9) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › deja cada chip sin pulsación ni rol de botón` (fila 10) | `f5ebec6c` (nace verde; sonda R6 documentada); ronda 2 `3eff471b` (nace verde; sonda E4 documentada); ronda 3 `5f6ebf76` (nace verde; sonda E7 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › recorre WELCOME_CHIPS con map y comparte la clase de etiqueta` (fila 11) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › contiene exactamente tres chips` (fila 12) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R7 | `src/screens/welcome/index.test.tsx::R7 › empuja a registro sin reemplazar` | `a81147d9` (nace verde; sonda R7 documentada) |
| R7 | `src/screens/welcome/index.test.tsx::R7 › es el botón primario del repo` | `a81147d9` (nace verde; sonda R7 documentada) |
| R7 | `src/__tests__/consistency-classnames.test.ts::#62 R1 › deja todos los botones primarios sólidos en un único radio` (+1) y `#98 R10` (+1) | `431894bc` (cascadas del verde de T3) |
| R8 | `src/screens/welcome/index.test.tsx::R8 › empuja a login sin reemplazar` | `2a4f2376` (nace verde; sonda R8 documentada) |
| R8 | `src/screens/welcome/index.test.tsx::R8 › es un botón hueco con tinta accent-strong` | `2a4f2376` (nace verde; sonda R8 documentada) |
| R9 | `src/screens/welcome/index.test.tsx::R9 › muestra el copy en español` | `a7c3a656` → `431894bc` |
| R9 | `src/screens/welcome/index.test.tsx::R9 › muestra el copy en inglés` | `a7c3a656` → `431894bc` |
| R10 | `src/screens/welcome/index.test.tsx::R10 › fija la duración y la curva` | `58961dcf` → `fecffd30`; refactor `80250ef2`; ronda 2 `c5bc8da1` (nace verde; sondas E1 y E2 documentadas); ronda 3 `e8300219` (nace verde; sonda E6 documentada) |
| R10 | `src/screens/welcome/index.test.tsx::R10 › arranca invisible y desplazado sin Reduce Motion` | `58961dcf` → `fecffd30`; refactor `80250ef2`; ronda 2 `7c86fcad` (nace verde; sonda E3 documentada) |
| R10 | `src/screens/welcome/index.test.tsx::R10 › termina visible y en su sitio sin Reduce Motion` | `58961dcf` → `fecffd30`; refactor `80250ef2`; ronda 2 `7c86fcad` (nace verde; sonda E3 documentada) |
| R10 | `src/screens/welcome/index.test.tsx::R10 › con Reduce Motion no se desplaza` | `58961dcf` → `fecffd30`; refactor `80250ef2`; ronda 2 `7c86fcad` (nace verde; sonda E3 documentada) |
| R11 | `src/__tests__/design-drift.test.ts::#118 R11: la bienvenida no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales` | `cffe227f` (nace verde; sonda R11 documentada) |
| R11 | `src/__tests__/legibility-classnames.test.ts::#61 R4 › screens/welcome/index.tsx pinta con text-accent-strong (2)` (+2 en la suma) | `cffe227f` (nace verde; sonda R11 documentada) |
| R12 | reviewer: `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacío | `80250ef2`: diff medido vacío; revisión humana en T11 |
| R13 | humano: S1–S8 en dev build de Android (casillas en `requirements.md`) | pendiente |
