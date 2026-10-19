---
feature: "mobile-account-heroui-text-sizes"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Diseño: tamaños 13 px y 17 px de las pantallas de cuenta (#187)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. La feature
> vive entera en el cliente móvil (`mobile-pet-tracker/`) y en `docs/`; no toca
> `backend-pet-tracker/` ni `infra/`. Se rige por `docs/ui-guidelines.md`.

## Decisiones técnicas

- **Hijo `Text` plano en los 17 sitios (D1 (a), R2 y R3).** `Label` y `Button`
  de HeroUI renderizan un hijo no-string tal cual y no le fusionan clases, así que
  el `className` del `Text` llega intacto al nodo (medido). Es el único camino que
  se prueba como corre en producción y que no muta una librería fijada. El coste
  conocido es la pérdida de `label__text--is-invalid` y de la fuente base de
  HeroUI; se observa en el smoke R6 (paso 5) y se deja como decisión de producto
  si el humano quiere la etiqueta roja en error.
- **Cambio de etiqueta, no de receta (R2, R3).** Las doce etiquetas conservan
  exactamente `text-13 font-semibold text-muted` y los cinco botones
  `text-17 font-extrabold text-accent-foreground` (secundario:
  `text-foreground`). Solo cambia el componente que las pinta. Por eso los
  inventarios de `text-13`/`text-17` de `profile-canvas-fidelity` y
  `design-drift` y los guards de clases (`legibility-classnames`,
  `consistency-classnames`) siguen verdes sin editarlos (R4).
- **Tokens ya existentes (R4).** `--text-13` y `--text-17` ya están en
  `src/theme/global.css` junto a 11, 15, 22, 26 y 2xs; la carta fija esa escala.
  No se crea ningún token ni se usa `text-[13px]` (prohibido por la carta).
- **Candado de familia por AST en un fichero nuevo (R1).** El fallo es de toda la
  familia (cualquier componente que pase por `tailwind-merge`), no de cuatro
  pantallas. Un `grep` de una línea no ve un `className` partido en varias
  líneas, una plantilla, un ternario ni un alias de import: por eso el escáner es
  un recorrido con la API de TypeScript (`import * as ts from 'typescript'`, ya
  usada en `ui-language.test.ts`, sin dependencia nueva). Descubre ficheros por
  directorio, no por lista, así que un fichero nuevo no se escapa.
- **Regla estricta: cualquier `text-<n>` está prohibido sobre un componente que
  fusiona, tenga o no color detrás.** `text-17 font-extrabold` sin color hoy
  sobrevive, pero basta añadir un color después para que muera sin avisar; la
  regla simple («`text-<n>` va en `Text` plano») es más fácil de recordar y de
  candar que «`text-<n>` sin color detrás».
- **Componentes que fusionan: todo `heroui-native` y `Card` local (R1).** `Card`
  (`src/components/card.tsx`) es el único fichero de `src` que importa
  `tailwind-merge`; el `it` 3 lo candan para que un segundo componente local con
  `twMerge` obligue a ampliar la lista en vez de colarse. No se tratan `Text`,
  `View` ni `Animated.Text`: no fusionan.
- **Premisa viva (R1, `it` 5).** Un `it` asevera con `cn` real de
  `heroui-native/utils` que `text-13`/`text-17` siguen cayendo ante un color. Si
  una actualización de HeroUI lo arregla, se pone rojo y avisa de que la regla
  puede relajarse; así el candado no sobrevive a su causa sin que nadie lo vea.
- **Expectativas independientes del detector (R1).** Cada fila del corpus lleva su
  número de hallazgos como literal; el escáner no puede ser su propio oráculo. La
  tabla de sondas del requisito 1 prueba, mutación a mutación, qué `it` cae y con
  qué consulta; las zonas ciegas (multilínea, plantilla, alias, fichero nuevo) se
  mutan de verdad.
- **Enmienda explícita a #172 R6.** `textRecipes` cuenta por `split` el literal
  `<Label.Text className="…">`; tras el cambio esos literales deben ser
  `<Text className="…">`. Se sustituyen 3 literales en su sitio y las cuentas no
  cambian (requisitos § Enmienda a #172 R6), con comentario `#187 R2`/`#187 R3`
  como único `#NNN` permitido.
- **Carta (R5).** La regla se escribe en `docs/ui-guidelines.md` como sección de
  enmienda al final, con un `it` que la candea por `toContain`, para que la
  siguiente pantalla no tenga que redescubrir el fallo por render.
- **Smoke humano separado (R6).** jest no mide píxeles. Un humano compara en un
  dev build de Android (nunca Expo Go) y firma su propia casilla, distinta de la
  del gate de aprobación.
- **Orden y solape (D2, D3).** #187 va antes de #177 y de #186 (recomendación):
  deja cuatro pantallas limpias y un candado que ellas heredan. El reparto de
  ficheros caduca al mergear el primero, y el segundo mergea main (nunca rebasa).

## Archivos afectados

Presentación (`mobile-pet-tracker/src/screens/`), solo `index.tsx` de cada una:

- `login/index.tsx` — 2 `Label.Text` y 1 `Button.Label` pasan a `Text` (R2, R3).
- `register/index.tsx` — 7 `Label.Text` y 1 `Button.Label` pasan a `Text`.
- `forgot/index.tsx` — 1 `Label.Text` y 2 `Button.Label` pasan a `Text`.
- `reset-password/index.tsx` — 2 `Label.Text` y 1 `Button.Label` pasan a `Text`.

Tests (`mobile-pet-tracker/src/`):

- `__tests__/heroui-text-size-merge.test.ts` — **nuevo**: escáner, 24 `it` de R1
  y 1 de R5.
- `__tests__/account-screens-polish.test.ts` — 3 literales de `textRecipes` (R2,
  R3); sin cambio de cuentas ni de total.
- `screens/login/index.test.tsx`, `screens/register/index.test.tsx`,
  `screens/forgot/index.test.tsx`, `screens/reset-password/index.test.tsx` — `it`
  nuevos de R2 y R3.

Documentación:

- `docs/ui-guidelines.md` — sección `## Enmienda #187 …` al final (R5).
- `specs/mobile-account-heroui-text-sizes/traceability.md` — la rellena Codex.
- `progress/impl_mobile-account-heroui-text-sizes.md` — el reporte de Codex.

No cambian: `src/theme/global.css`, `package.json`, `bun.lock`, `src/components/`,
`profile-canvas-fidelity.test.ts`, `design-drift.test.ts`,
`legibility-classnames.test.ts`, `consistency-classnames.test.ts`,
`ui-language.test.ts`, `ui-copy-table.ts`.

## Alternativas descartadas

- **Registrar 13/15/17 en `defaultConfig.twMergeConfig` de `tailwind-variants`**
  (medido): no llega a HeroUI. Su `tv` pasa su propia `twMergeConfig` y pisa esa
  clave, tanto si se registra antes como después de importar HeroUI.
- **Mutar `require('heroui-native/utils').twMergeConfig.classGroups['font-size']`
  antes del barril** (medido, D1 (b)): es lo único que funciona de esa familia,
  pero obliga a un entry propio (`package.json` `main` es `expo-router/entry`),
  depende del orden de import, el setup de jest ocultaría un fallo de orden en
  producción y muta un objeto de una librería fijada a 1.0.8. Se deja a la
  decisión del humano (D1) y a #177 si quiere conservar `Button.Label`.
- **`text-[13px]` / `text-[17px]`** (sobreviven al merge): la carta prohíbe clases
  arbitrarias entre corchetes.
- **Quitar la clase de color** (`Label.Text className="text-13 font-semibold"`):
  cambia el color a `foreground` y se pierde el `text-muted` del artboard.
- **`style={{ fontSize }}` inline**: salta los tokens de la carta y no pasa por el
  grep-clean.
- **Candado por `grep`/regex sobre el texto fuente**: ciego a `className` en
  varias líneas, plantillas, ternarios y alias de import (S2 y S3 de la tabla de
  sondas lo demuestran con el `grep` en 0 sobre una mutación real).
- **Candado limitado a las cuatro pantallas**: el fallo es de familia (cualquier
  `Card`, `Button.Label` o `Label.Text` de la app); un inventario cerrado no avisa
  de la pantalla nueva.
- **Candar solo «`text-<n>` seguido de color»**: ver la regla estricta arriba.
- **Fundir #187 en #177** (D2 (c)): #177 no tiene spec; retrasa el arreglo de 17
  sitios ya medidos.
