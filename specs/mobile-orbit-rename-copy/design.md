---
feature: "mobile-orbit-rename-copy"
status: approved
tags: [harness, spec]
---

# Diseño — [[mobile-orbit-rename-copy]]

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]] para las
> capas. Es un cambio de copy: no toca domain, application ni infrastructure.
> Rutas relativas a `mobile-pet-tracker/` salvo que se diga otra cosa.

## Decisiones técnicas

- **Cambiar el valor, no la clave (R1, R3).** `welcome.pingoGreeting` conserva su nombre: la
  clave es un identificador y los renombra #225 en bloque (explore Parte 8, opción C).
  Renombrar la clave aquí obligaría a tocar `ui-copy-table.ts`, `ui-language.test.ts` y la
  trazabilidad firmada de #153/#205.
- **Dos líneas de producción (R1).** Solo cambian las dos entradas de
  `src/i18n/catalog.ts`: `'Hi, I\'m Pingo.'` → `'Hi, I\'m Orbit.'` y
  `'Hola, soy Pingo.'` → `'Hola, soy Orbit.'`. Ancla por contenido, no por línea.
  `screens/welcome/index.tsx` no cambia: pinta `t('welcome.pingoGreeting')`.
- **Un test nuevo de producción y otro de carta, separados (R1-R4).** El de
  `orbit-rename-copy.test.ts` (R1, R2, R3) es de Codex y no lee la carta. El de
  `orbit-charter-voice.test.ts` (R4) lo trae el commit del humano. Separarlos evita que la
  cadena de Codex dependa de un fichero que solo el humano firma.
- **Candado de R2 como barrido de texto, no como import (R2).** Lee los ficheros como
  texto con `jest.requireActual<typeof import('fs')>('fs')`. Comparar contra el símbolo
  importado de producción sería tautológico. El barrido exige que ciertas rutas conocidas
  aparezcan en la lista para no pasar en vacío.
- **R3 nace verde y vale por su mutación.** Describe lo que R1 no debe tocar. Se justifica
  con M3a, M3b y M3c (tabla de mutación).
- **Nada de `## Enmienda #221` en la carta (R4).** Se edita el punto 7 en su sitio, igual
  que #171. Un encabezado nuevo movería los contadores `grep -c '^## Enmienda'` (30) de los
  tests de carta. La nota con la decisión del humano va dentro del punto 7, sin backticks
  (los guards de clases de color leen la carta).
- **R4 en un commit propio del humano, antes del handoff.** Si la carta cambiase sin las
  tres enmiendas de test, `#153 R2`, `#167 R11` y `#171 R15` quedarían rojos a mitad de
  cadena. Por eso el commit lleva carta + tres enmiendas + test nuevo + casilla, y la rama
  de Codex arranca desde él. El leader prepara los cambios en el working tree; el humano los
  commitea con `git commit --only` sobre las cinco rutas (memoria: firma sin `-am`).
- **Historia intacta.** Títulos de `describe`/`it`, enmiendas fechadas de la carta y specs
  firmadas conservan «Pingo». Se enmiendan solo los literales que describen el
  texto visible o el punto 7 vigente.

## Archivos afectados

Producción (Codex, R1):

- `src/i18n/catalog.ts` — presentación/i18n. Dos valores.

Tests (Codex, R1-R3):

- `src/screens/welcome/index.test.tsx` — 7 líneas de `expect` en 4 `it` (ver R1). Títulos
  intactos.
- `src/__tests__/orbit-rename-copy.test.ts` — nuevo. R1 (catálogo como texto), R2, R3.

Gate G4 (leader prepara, humano firma, R4):

- `docs/ui-guidelines.md` — punto 7.
- `src/screens/welcome/index.test.tsx` — constantes `voice` (T1) e `idleLoops` (T2).
- `src/components/__tests__/celebration.test.tsx` — constante `point7` (T3).
- `src/__tests__/orbit-charter-voice.test.ts` — nuevo.
- `specs/mobile-orbit-rename-copy/requirements.md` — la casilla de la enmienda.

Sin cambio, medido: `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`,
`src/screens/welcome/index.tsx`, `app.json`, `app.config.ts`, `package.json`,
`assets/images/pingo-*.webp`.

## Inventario de «Pingo» medido (base `origin/dev` 0c37e77a)

Clasificación de las apariciones de la palabra. Solo la primera fila es copy visible.

| Clase | Dónde | Acción |
|---|---|---|
| Copy visible (valor) | `src/i18n/catalog.ts`, 2 líneas | R1 cambia |
| Identificadores de código (`PingoFloat`, `homePingoPhrase`, `MOTION_PINGO_*`, `pingo-*.tsx`) | `src/components`, `src/screens`, `src/theme` | #225 |
| Claves de catálogo (`*.pingoGreeting`, `home.pingoPhrase*`) | `catalog.ts`, `ui-copy-table.ts` | #225 |
| testID (`welcome-pingo-float`, ...) | pantallas y tests | #225 |
| Assets | `assets/images/pingo-*.webp` (9) | #225 |
| Literal de copy en tests | `screens/welcome/index.test.tsx` (7 líneas, 4 `it`) | R1 |
| Carta, punto 7 | `docs/ui-guidelines.md` | R4 |
| Tests que leen el punto 7 | `welcome/index.test.tsx` (T1, T2), `celebration.test.tsx` (T3) | R4 |
| Títulos de `describe`/`it` con «Pingo» (~35 ficheros) | `src/**/*.test.*` | historia, no se toca |
| Enmiendas fechadas de la carta, punto «burbuja de Pingo» de radios | `docs/ui-guidelines.md` | historia |
| Specs firmadas, `progress/`, `STATUS.md` | repo | historia |
| Guiones de humo | `docs/verification.md`, `docs/demo-runbook.md` | #225 |

Premisa de 0 fuera de `catalog.ts`: el barrido de R2 es el que la sostiene en CI; el
implementer la mide con `grep -rnw "Pingo" src --include='*.ts' --include='*.tsx'
--exclude-dir=__tests__ --exclude='*.test.*'` (esperado tras R1: salida vacía).

## Pruebas de mutación

Se plantan en zonas donde un candado podría no mirar. Cada una se revierte y se anota en
`progress/impl_mobile-orbit-rename-copy.md`.

| Id | Mutación plantada | Candado que debe ponerse rojo |
|---|---|---|
| M1a | `catalog.ts`: `'Hola, soy Orbit.'` → `'Hola, soy Orbit!'` | `#221 R1` (línea literal) y los `expect` de welcome |
| M1b | `catalog.ts`: apóstrofo `'` → `’` en la cadena en | `#221 R1` (no contiene `’`) |
| M2a | Comentario `// Pingo habla` en `src/components/empty-state.tsx` (zona: un comentario, no un valor) | `#221 R2` (código fuente) |
| M2b | Valor nuevo `'Pingo te avisa.'` en una clave inventada del catálogo (zona: objeto `es`, lejos de welcome) | `#221 R2` (valores del catálogo) |
| M2c | Fichero nuevo `src/hooks/zz.ts` con `// Pingo` (zona: directorio no recorrido por la lista fija de rutas) | `#221 R2` (recorrido recursivo) |
| M3a | Renombrar la clave a `'welcome.orbitGreeting'` en `catalog.ts` | `#221 R3` (a) y el test de welcome |
| M3b | Renombrar `testID="welcome-pingo-float"` → `welcome-orbit-float` | `#221 R3` (b) |
| M3c | Copiar `pingo-wave.webp` a `orbit-wave.webp` en `assets/images` | `#221 R3` (d) |
| M4a | Carta: dejar `**7. Voz de Pingo` | `#221 R4` (i) y T1 |
| M4b | Carta: quitar un solo «Orbit» de las cinco viñetas (p. ej. la de bucles de reposo) | T2 |
| M4c | Carta: añadir una tercera «Pingo» dentro del punto 7 | `#221 R4` (iv) |
| M4d | Carta: añadir `## Enmienda #221` | `#221 R4` (v) |

Un fallo de M2a/M2b/M2c o M4c que no ponga rojo su candado rechaza el requisito.

## Alternativas descartadas

- **Renombrar todo ahora (clave, testID, assets).** Es #225; mezclarlo ensancha la PR y
  tumba trazabilidad firmada (explore Parte 8, opción A).
- **Dejar «Pingo» en el saludo hasta #225.** Contradice la decisión del humano del
  2026-10-26 y deja la bienvenida y la carta en desacuerdo.
- **Editar `ui-copy-table.ts`.** No hay nada que editar: la tabla indexa por `{ file, key }`
  y la clave no cambia. Editarla movería `SCREEN_FILES` sin motivo.
- **Añadir `## Enmienda #221` a la carta.** Mueve los contadores de enmiendas (30) y pide
  tocar tests ajenos. Se edita el punto 7 en su sitio.
- **Que Codex enmiende la carta.** La carta es G4, no delegado: la firma el humano.
- **Un único test que lea código y carta.** Obligaría a Codex a depender de un fichero que
  firma el humano (ver decisión de tests separados).
- **Comparar `es['welcome.pingoGreeting']` con el catálogo importado.** Tautológico.
