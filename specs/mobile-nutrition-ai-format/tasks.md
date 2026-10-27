---
feature: "mobile-nutrition-ai-format"
status: draft
tags: [harness, spec]
---

# Tareas — [[mobile-nutrition-ai-format]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. El diseño y el inventario de
> candados están en [[design]]. Rutas relativas a `mobile-pet-tracker/src/`.

## Cadena de commits (test primero, historial rojo a verde)

Cada commit `test(...)` deja tests rojos por la razón correcta y su `feat(...)` los pone
verdes. Ningún commit mezcla tests, implementación y docs (en #19 Codex metió todo en uno
y se incumplió C4 de `CHECKPOINTS.md`). Cada commit corre `bun run typecheck` y el jest de
su alcance; el último `feat` corre el jest completo **sin pipe** (memoria «Exit code tras
un pipe»). Las enmiendas de candados van en el commit de **test** que las motiva.

| Commit | Tipo | Contenido | R | Estado esperado tras el commit |
|---|---|---|---|---|
| C1 | test | `screens/food/parse-ai-explanation.test.ts` | R1, R2, R3 | todo rojo: el módulo no existe (`Cannot find module`); ese es el motivo declarado |
| C2 | feat | `screens/food/parse-ai-explanation.ts` | R1, R2, R3 | verde: 19 + 18 + los `it` de R2 + 6 + 1 |
| C3 | test | `screens/food/ai-explanation.test.tsx`; mock de `reicon` y `it` R10 en `screens/food/index.test.tsx`; filas en `__tests__/ui-copy-table.ts`; fórmulas en `ui-language.test.ts` y `language-provider.test.tsx`; lista `text-13` en `profile-canvas-fidelity.test.ts`; fila `leading-body` e `it.each` R13 en `nutrition-canvas-fidelity.test.ts` | R4–R11, R13 | rojo: componente y claves inexistentes, tarjeta antigua en `index.tsx` |
| C4 | feat | `i18n/catalog.ts` (tres claves) y `screens/food/ai-explanation.tsx` | R4–R9, R11, R13 | verde salvo, **declarado**: el `it` `#200 R8` enmendado y `#224 R10` de `index.test.tsx` y el candado de lista `text-13` de Perfil (porque `index.tsx` aún tiene su `text-13`) |
| C5 | feat | `screens/food/index.tsx` | R10, R13 | todo verde |
| C6 | docs | `traceability.md` con hashes y `progress/impl_mobile-nutrition-ai-format.md` | todos | |

Por qué C3 enmienda los candados antes de C4: así nacen rojos por la razón correcta (la
lista de Perfil pide un fichero que no existe, las fórmulas piden claves que faltan). Si
las enmiendas se hicieran después de la implementación nacerían verdes o mezcladas con el
código y no probarían nada.

Cuentas encadenadas: `git diff origin/dev --stat -- src/` (ficheros de `src/` tocados,
acumulados) debe dar **1** tras C1, **2** tras C2, **9** tras C3 (los dos de C1 y C2 más
`ai-explanation.test.tsx`, `index.test.tsx`, `ui-copy-table.ts`, `ui-language.test.ts`,
`language-provider.test.tsx`, `profile-canvas-fidelity.test.ts` y
`nutrition-canvas-fidelity.test.ts`), **11** tras C4 (`+ catalog.ts`,
`+ ai-explanation.tsx`) y **12** tras C5 (`+ index.tsx`): 4 nuevos y 8 editados. Si una
cuenta no coincide, se para y se avisa.

### Anclas del handoff (cada una con su salida esperada)

Se ejecutan desde `/home/claude/sites/Pet-Tracker-wt-224/mobile-pet-tracker` tras C5.

| Comprobación | Salida esperada |
|---|---|
| `grep -cF "text-13" src/screens/food/index.tsx` | `1` (enmendado por E1: el pie de L468 lo conserva) |
| `grep -cF "leading-body" src/screens/food/index.tsx` | `0` |
| `grep -cF "food-ai-body" src/screens/food/index.tsx` | `0` (el cuerpo vive ahora en el componente) |
| `grep -cF "food-ai-card" src/screens/food/index.tsx` | `1` |
| `grep -cF "food-ai-header" src/screens/food/index.tsx` | `1` |
| `grep -cF "<AiExplanation" src/screens/food/index.tsx` | `1` (el uso; el import de `AiExplanation` y el de `parseAiExplanation` van en líneas aparte) |
| `grep -cF "parseAiExplanation" src/screens/food/index.tsx` | `2` (import y una sola llamada) |
| `grep -cF "heroui-native" src/screens/food/ai-explanation.tsx` | `0` |
| `grep -cF "StyleSheet" src/screens/food/ai-explanation.tsx` | `0` |
| `grep -cF "t('food.aiShowMore')" src/screens/food/ai-explanation.tsx` | `1` |
| `grep -cF "t('food.aiShowLess')" src/screens/food/ai-explanation.tsx` | `1` |
| `grep -cF "t('food.aiDisclaimer')" src/screens/food/ai-explanation.tsx` | `1` |
| `grep -cF "TOUCH_SLOP" src/screens/food/ai-explanation.tsx` | `2` (import y `hitSlop`) |
| `grep -cF "'food.aiShowMore'" src/i18n/catalog.ts` | `2` (es y en) |
| `grep -cF "'food.aiShowLess'" src/i18n/catalog.ts` | `2` |
| `grep -cF "'food.aiDisclaimer'" src/i18n/catalog.ts` | `2` |
| `git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock` | salida vacía |

Si una ancla da otro número, **parar y avisar**: no ajustar la cifra. Las anclas
negativas (`0`) se prueban con una mutación plantada: se añade un `heroui-native`, un
`StyleSheet` o un `#abc` en el fichero nuevo, se ve rojo el candado correspondiente y
se revierte.

### Prueba de mutación obligatoria (se planta, se ve el rojo concreto, se revierte)

Registrada en `progress/impl_mobile-nutrition-ai-format.md` con el `it` que se puso rojo:

1. Parser: regex de viñeta `^[-*]\s*(.*)$` (R1 filas 9 y 16 rojas).
2. Parser: no aplanar sangría (R1 fila 7 roja).
3. Parser: fusionar líneas en un párrafo (R1 filas 2, 4, 18 rojas).
4. Parser: quitar `.replace(/\r\n?/g, '\n')` (R2 filas 9 y 10 rojas).
5. Parser: no eliminar el `*` suelto (R2 filas 1 a 4, 7 y 18 rojas).
6. Parser: regex de negrita voraz `\*\*(.+)\*\*` (R1 filas 12 y 17 rojas).
7. Parser: lanzar con `null` (R2 fila 13 roja).
8. Texto plano: unir con `' '` en vez de `'\n'` (R3 rojo).
9. Componente: `>=` en vez de `>` o `123` en la constante (R6 filas 122 y 123 rojas).
10. Componente: quitar `hitSlop`, o cambiar `h-8` por `h-6` (R7 rojo).
11. Componente: ocultar el aviso cuando `expanded` (R8 fila expandida roja).
12. Componente: etiqueta con `'• '` por viñeta (R9 roja).
13. Componente: no colapsar al cambiar el texto (R7 rojo).
14. Integración: dejar `flex-row` en la tarjeta (R10 amendado rojo).
15. Integración: pintar la tarjeta con `''` (R10 `it.each` rojo).

### Prohibido para Codex

- `./init.sh` (lo corre el leader; `AGENTS.md` lo manda y aquí se repite).
- Crear recursos AWS o tocar `backend-pet-tracker/` (en particular `nutrition-prompt.ts`,
  `anthropic-nutrition-explainer.ts` y el mapper; R12).
- Añadir dependencias o tocar `package.json` y el lockfile.
- `virtual:` en cualquier `jest.mock` (candado `jest-virtual-mock-lock`).
- Importar de `heroui-native` en los dos ficheros nuevos.
- Escribir `#224` suelto en un comentario (solo `#224 R<n>`), hex, `StyleSheet`, `x-[…]`
  o clases `text-category-*` literales.
- Calcular los valores esperados de los tests con el propio parser: los esperados de
  R1–R3 son los literales de [[requirements]].
- Editar los `it` antiguos de `index.test.tsx` distintos de `#200 R8` (que se enmienda).
- Skills: usar los **nombres del catálogo de Codex** del handoff (el plugin de Codex no
  tiene las mismas skills que el nuestro; pedir una inexistente da silencio).
- Esperas sobre el árbol: `docs/conventions.md` §Esperas sobre el árbol renderizado
  (`await` en `fireEvent`, `act`, `rerender`, `render`; sin contadores de mock). El
  layout se simula con `await fireEvent(node, 'layout', { nativeEvent: { layout: … } })`.
- `git status --short` sin acotar tras `git add`: acotarlo a las rutas del commit.

## R1 — gramática del parser (19 filas)

- [ ] (1) Escribir test que falla para R1 (`screens/food/parse-ai-explanation.test.ts`, `it.each '#224 R1'`)
- [ ] (2) Implementación mínima que lo pasa (`parseAiExplanation`)
- [ ] (3) Refactor con tests verdes

## R2 — degradación y entradas hostiles (18 filas más carga lineal)

- [ ] (1) Escribir test que falla para R2 (`it.each '#224 R2'`, `no lanza` y carga de 20000)
- [ ] (2) Implementación mínima que lo pasa (normalización, `*` fuera de pares, colapso de espacios)
- [ ] (3) Refactor con tests verdes

## R3 — texto plano y `SAMPLE`

- [ ] (1) Escribir test que falla para R3 (`it.each '#224 R3'` y `it('#224 R3: SAMPLE ...')`)
- [ ] (2) Implementación mínima que lo pasa (`aiExplanationPlainText`)
- [ ] (3) Refactor con tests verdes

## R4 — copy ES/EN y fórmulas de candados

- [ ] (1) Escribir test que falla para R4 (filas de `ui-copy-table.ts`, fórmulas de `ui-language.test.ts` y `language-provider.test.tsx`, `it.each '#224 R4'` en `ai-explanation.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (tres claves en `catalog.ts`, `t(...)` una vez cada una)
- [ ] (3) Refactor con tests verdes

## R5 — render de bloques

- [ ] (1) Escribir test que falla para R5 (`ai-explanation.test.tsx`, `SAMPLE` con una decisión por hijo)
- [ ] (2) Implementación mínima que lo pasa (`AiExplanation`: párrafos, viñetas, puntos, negritas)
- [ ] (3) Refactor con tests verdes

## R6 — recorte y degradado (frontera 122 / 123)

- [ ] (1) Escribir test que falla para R6 (`it.each '#224 R6'` y literal del degradado)
- [ ] (2) Implementación mínima que lo pasa (`onLayout`, `maxHeight`, `food-ai-fade`)
- [ ] (3) Refactor con tests verdes

## R7 — botón Ver más / Ver menos y zona de 44

- [ ] (1) Escribir test que falla para R7 (alternancia, `hitSlop`, texto nuevo colapsa)
- [ ] (2) Implementación mínima que lo pasa (`Pressable`, chevrones, `expandedFor`)
- [ ] (3) Refactor con tests verdes

## R8 — aviso fijo

- [ ] (1) Escribir test que falla para R8 (`it.each '#224 R8'`, 6 filas)
- [ ] (2) Implementación mínima que lo pasa (`food-ai-disclaimer`)
- [ ] (3) Refactor con tests verdes

## R9 — accesibilidad continua

- [ ] (1) Escribir test que falla para R9 (etiqueta, botón fuera de la unidad, recorte no cambia la etiqueta)
- [ ] (2) Implementación mínima que lo pasa (`accessible` y `accessibilityLabel` en `food-ai-body`)
- [ ] (3) Refactor con tests verdes

## R10 — integración en `index.tsx`

- [ ] (1) Escribir test que falla para R10 (enmendar `#200 R8`, `it.each '#224 R10'`, mock de reicon)
- [ ] (2) Implementación mínima que lo pasa (tarjeta columna, cabecera, `AiExplanation`, condición por `parseAiExplanation`)
- [ ] (3) Refactor con tests verdes

## R11 — API reutilizable por #215

- [ ] (1) Escribir test que falla para R11 (montaje con solo `text`; ausencia de imports prohibidos)
- [ ] (2) Implementación mínima que lo pasa (`AiExplanation({ text })` exportado, sin dependencias de `index.tsx`)
- [ ] (3) Refactor con tests verdes

## R12 — backend y dependencias intactos

- [ ] (1) Sin test de jest: la comprobación es el diff vacío de la tabla de anclas
- [ ] (2) Sin implementación
- [ ] (3) El reporte pega la salida (vacía) de `git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock`

## R13 — candados de inventario y grep-limpio

- [ ] (1) Escribir test que falla para R13 (lista `text-13` de Perfil, fila `leading-body`, `it.each '#224 R13'`)
- [ ] (2) Implementación mínima que lo pasa (los ficheros nuevos son grep-limpios; `index.tsx` pierde `leading-body` y conserva `text-13` por E1)
- [ ] (3) `bun run typecheck`, `bun run lint` (con `> log 2>&1 && test ! -s log`) y `bun run test` completo sin pipe, código 0
