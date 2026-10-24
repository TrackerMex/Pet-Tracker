---
feature: "mobile-canvas-tab-bar"
status: approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-canvas-tab-bar]]

TDD por requisito: (1) commit rojo con el test que nombra el R-id y las
enmiendas del inventario de ese R, (2) commit verde con la implementación
mínima, (3) refactor opcional sin cambiar tests. Nunca implementación y test en
el mismo commit. Rutas relativas a `mobile-pet-tracker/` salvo `docs/` y
`specs/`. BAR y CF como en requirements.md.

Comandos (bun, nunca npx; jest con `--runTestsByPath` porque `(tabs)` en un
posicional es regex y se salta el fichero con exit 0):

```bash
cd mobile-pet-tracker
bunx jest --runTestsByPath src/components/__tests__/floating-tab-bar.test.tsx src/__tests__/tab-bar-canvas-fidelity.test.ts
bunx jest --runTestsByPath src/__tests__/canvas-foundations.test.ts src/__tests__/ui-language.test.ts src/__tests__/ui-copy-table.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/alert-detail-canvas-fidelity.test.ts 'src/app/(tabs)/__tests__/alerts.test.tsx' 'src/app/(tabs)/__tests__/layout.test.tsx'
bunx tsc --noEmit
bunx expo lint --no-cache > /tmp/lint-206.log 2>&1; echo "exit=$?"; grep -cE "error|warning" /tmp/lint-206.log
```

`expo lint` puede salir 0 tras un SIGKILL: se lee el log, no solo el código.
No se lanza `./init.sh` (lo corre el leader).

## Orden recomendado

R1 → R2 → R3 → R4 → R5 → R6 → R7 → R8 → R9 → R10. Sin sujeto ausente:

| R | Sujeto que asierta | Lo crea |
|---|---|---|
| R1 | `tab-bar-row`, `h-16`; crea CF | R1 (testID nuevo en la fila existente) |
| R2 | `tab-bar-overlay` | existe |
| R3 | clase exacta de la raíz con `h-16` | R1 |
| R4 | `tab-<name>` | existe |
| R5 | `tab-indicator` | existe |
| R6 | `icon-tab-<name>` como `Svg` | R6 (el doble de reicon sale en su commit rojo) |
| R7 | `stroke` / `strokeWidth` del `Svg` | R6 |
| R8 | `tab-bar-row` | R1 |
| R9 | `docs/ui-guidelines.md` | existe |
| R10 | fuente de la barra | existe; nace verde (mutación plantada) |

Filas rojas cruzadas con los `it` previos: R3 exige la clase sin `shadow-lg`
(R1 solo añade `h-16`); R6 verde pone `strokeWidth={2}` fijo, así cada fila de
R7 es roja por su rama activa (2.4); R8 es rojo porque la fila no tiene rol ni
nombre. Ninguna fila nace verde salvo R10, declarada.

## Cuentas a re-medir al terminar (base + delta)

Desde `mobile-pet-tracker/`. Base en 81cb6d6b. Si se mergea `dev` con
enmiendas de #198 a #205 en la carta, la base de `^## Enmienda` sube 1 por
cada una y el esperado también.

| Comando | Base | Delta | Esperado |
|---|---|---|---|
| `grep -cE "\('#206 R" src/components/__tests__/floating-tab-bar.test.tsx` | 0 | R1 1, R2 1, R3 1, R4 1, R5 1, R6 1, R7 1, R8 2 | 9 |
| `grep -cF "(enmendado por #206 R" src/components/__tests__/floating-tab-bar.test.tsx` | 0 | R5 6, R6 1 | 7 |
| `grep -cE "\('#206 R" src/__tests__/tab-bar-canvas-fidelity.test.ts` | fichero ausente | R1 a R10, 1 cada uno | 10 |
| `grep -cF "(enmendado por #206 R8)" src/__tests__/ui-language.test.ts` | 0 | R8 1 | 1 |
| `grep -cF "(enmendado por #206 R8)" src/providers/__tests__/language-provider.test.tsx` | 0 | R8 1 | 1 |
| `grep -cF "+ 1, // #206 R8" src/providers/__tests__/language-provider.test.tsx` | 0 | R8 1 | 1 |
| `grep -cF "key: 'tabs." src/__tests__/ui-copy-table.ts` | 5 | R8 1 | 6 |
| `grep -cF "'tabs.bar'" src/i18n/catalog.ts` | 0 | R8 2 | 2 |
| `grep -cF "describe('#197 R20: cimientos sin cablear'" src/__tests__/canvas-foundations.test.ts` | 1 | R3 -1 | 0 |
| `grep -c '^## Enmienda' ../docs/ui-guidelines.md` | 24 | R9 1 | 25 |
| `grep -cF '#206' ../docs/ui-guidelines.md` | 0 | R9 3 | 3 |
| `grep -cF "from 'reicon-react-native'" src/components/floating-tab-bar.tsx` | 1 | R6 -1 | 0 |
| `grep -cF "from 'react-native-svg'" src/components/floating-tab-bar.tsx` | 0 | R6 1 | 1 |
| `grep -cF "shadow-lg" src/components/floating-tab-bar.tsx` | 1 | R3 -1 | 0 |
| `grep -cF "text-accent-strong" src/components/floating-tab-bar.tsx` | 1 | 0 | 1 |
| `grep -cF "#" src/components/floating-tab-bar.tsx` | 0 | 0 | 0 |
| `grep -cF "{ name: '" src/components/floating-tab-bar.tsx` | 5 | 0 | 5 |
| `grep -cF "68.8" src/components/__tests__/floating-tab-bar.test.tsx` | 4 | R5 -4 | 0 |
| `grep -cF "137.6" src/components/__tests__/floating-tab-bar.test.tsx` | 5 | R5 -5 | 0 |
| `git diff --stat <base>..HEAD -- src/app src/theme src/screens` | — | — | vacío |

## Bloques por requisito

### R1 — Cápsula de 64 y fila
1. Rojo: crea CF con su cabecera de lectura (artboards y fuente) y
   `#206 R1`; añade a BAR `#206 R1`. Rojo esperado: `Unable to find … tab-bar-row`
   y CF sin `h-16` en la fuente.
2. Verde: raíz con `h-16`; fila `testID="tab-bar-row" className="flex-row gap-1 p-1.5"`.
3. Refactor: ninguno previsto.

### R2 — Velo .86
1. Rojo: BAR y CF `#206 R2` (igualdad exacta de la clase del overlay).
2. Verde: overlay `className="flex-1 bg-glass-surface-strong"`.
3. Refactor: ninguno.

### R3 — Sombra `tabBar`
1. Rojo: BAR y CF `#206 R3`; en el mismo commit **borra entero**
   `describe('#197 R20: cimientos sin cablear')` de
   `src/__tests__/canvas-foundations.test.ts` (fila 10 del inventario; si ya no
   existe, se anota que el paso no tuvo efecto; si `dev` lo trae enmendado por
   #201, se borra igualmente).
2. Verde: `import { useShadows } from '../theme/shadows'`,
   `const shadows = useShadows()`, sale `shadow-lg` de la clase y el `style` de
   la raíz pasa a `{ ...shadows.tabBar, bottom: insets.bottom + 12, left: 16, right: 16 }`.
3. Refactor: ninguno.

### R4 — Celda de 52
1. Rojo: BAR y CF `#206 R4`.
2. Verde: cada `Pressable` con `className="h-13 flex-1 items-center justify-center gap-0.5"`.
3. Refactor: ninguno.

### R5 — Píldora
1. Rojo: BAR y CF `#206 R5`; enmiendas 1 a 6 del inventario (`68.8 → 70`,
   `137.6 → 140`, geometría del `it` de `R3`) con su sufijo
   ` (enmendado por #206 R5)`.
2. Verde: `tabWidth = (containerWidth - 30) / TABS.length`; destino
   `activeTabIndex * (tabWidth + 4)` en el efecto y en `handleLayout`; estilo
   `left: 6, top: 6, height: 52` (sale `left: 8` y `bottom: 6`).
3. Refactor: si el destino se repite, una función local
   `indicatorOffset(index, width)` no exportada.

### R6 — Iconos SVG
1. Rojo: en BAR sale `jest.mock('reicon-react-native', …)` y entra el doble de
   `react-native-svg` (`default`, `Svg`, `Path`, `Circle`, `SvgXml` según la E1 de
   requirements.md § Erratas del leader, `__esModule: true`,
   patrón de `src/components/__tests__/celebration.test.tsx`); añade
   `#206 R6` (`it.each(ICON_SHAPES)`) y la enmienda 7 del inventario
   (`#91 R5`: `.props.stroke`, `strokeWidth` 2, `stroke`) con sufijo
   ` (enmendado por #206 R6)`; CF `#206 R6`.
2. Verde: `TabIcon` y `TAB_ICON_SHAPES` locales no exportados según
   `design.md` § Decisiones técnicas 2, con `strokeWidth={2}` fijo; `TABS`
   pierde `Icon` y conserva `{ name, labelKey }`; sale el import de reicon.
3. Refactor: ninguno.

### R7 — Estado activo por artboard
1. Rojo: BAR `#206 R7` (`it.each(ARTBOARD_TABS)`, cinco filas) y CF `#206 R7`
   (`it.each` de los cinco artboards). El CF corta cada artboard con
   `i = s.indexOf('<nav aria-label="Pestañas"')` y
   `nav = s.slice(i, s.indexOf('</nav>', i))`, y cuenta dentro de `nav`. Los
   cinco `nav` miden 1 `aria-current`, 1 `stroke-width="2.4"`, 4
   `stroke-width="2"`, 5 `<svg` y 5 `<a`; sobre el fichero entero esas cifras
   no se cumplen.
2. Verde: `strokeWidth={active ? 2.4 : 2}` en `TabIcon`.
3. Refactor: ninguno.

### R8 — `tablist` y `tabs.bar`
1. Rojo: BAR `#206 R8` (dos `it`: es y en), CF `#206 R8`; fila `tabs.bar` al
   final de `R2_TABS` en `src/__tests__/ui-copy-table.ts`; enmiendas 8 y 9 del
   inventario con sufijo ` (enmendado por #206 R8)`.
2. Verde: `'tabs.bar': 'Tabs'` tras `'tabs.profile': 'Profile'` y
   `'tabs.bar': 'Pestañas'` tras `'tabs.profile': 'Perfil'` en
   `src/i18n/catalog.ts`; la fila gana `accessibilityRole="tablist"` y
   `accessibilityLabel={t('tabs.bar')}`.
3. Refactor: ninguno.

### R9 — Enmienda #206 de la carta
1. Rojo: CF `#206 R9` con el bloque literal de `design.md` § Enmienda de la
   carta como constante del test.
2. Verde: el bloque, tal cual, al final de `docs/ui-guidelines.md`, precedido
   de una línea en blanco. La casilla queda `- [ ]`: la marca el humano.
3. Refactor: ninguno.

### R10 — Guardas
1. CF `#206 R10` nace verde. Planta `shadowColor: 'red'` en la fuente, corre
   CF, comprueba el rojo, revierte sin commitear y anota la salida en el
   informe.
2. Verde: sin cambio de producción.
3. Refactor: ninguno.

### R11 — Smoke del humano
Sin commit. El informe lista las ocho líneas de requirements § Cierre del
humano para que el humano las cierre.
