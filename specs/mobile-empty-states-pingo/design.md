---
feature: "mobile-empty-states-pingo"
tags: [harness, spec, mobile, ui-delight]
---

# Diseño — [[mobile-empty-states-pingo]] (#155)

Decisiones de alto nivel, sin bajar a código. Las rutas sin prefijo cuelgan
de `mobile-pet-tracker/`. Base medida: `origin/main` `36c8050d` más
`f5df3b00`, `f23fdc9d` y `c31a738d`; #153 leída a `19a4178e`.

## Dependencia de #153

La implementación espera al merge de #153. A `19a4178e`, #153 es solo spec:
todo lo que sigue sale de su texto. Antes del handoff, el leader corre estas
anclas sobre el HEAD del handoff (ya con #153 mergeada), desde la raíz del
repo. Si alguna no da lo esperado, se enmienda esta spec antes del handoff.

| # | Qué se re-verifica | Comando | Esperado |
|---|---|---|---|
| D1 | Las dos poses de #153 están en el repo | `ls mobile-pet-tracker/assets/images \| grep -c '^pingo-wave'` | `2` |
| D2 | La última línea del recuento del catálogo es la de #153 | `grep -cF '+ 1, // #153 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | `1` |
| D3 | El candado de poses de #153 R3 tiene dos nombres | `grep -cF "['pingo-wave-blink.webp', 'pingo-wave.webp']" mobile-pet-tracker/src/screens/welcome/index.test.tsx` | `1` |
| D4 | §2.20 de #153 existe | `grep -cF '### §2.20 — Añadidos por #153 — Pingo en la bienvenida' specs/mobile-ui-language/design.md` | `1` |
| D5 | La voz de Pingo está en la carta (punto 7 de #153 R2) | `grep -cF '**7. Voz de Pingo: guardián sereno.**' docs/ui-guidelines.md` | `1` (en la base da `0`) |
| D6 | #153 no movió el inventario de botones primarios | `grep -cF '13 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `2` |
| D7 | El describe de dependencias de #153 R13 existe | `grep -cF '#153 R13: Pingo no trae dependencias nuevas' mobile-pet-tracker/src/screens/welcome/index.test.tsx` | `1` |

Además, el catálogo `en` tiene 366 claves tras #153 (365 en la base) y 371
tras #155.

## Decisiones técnicas

1. **Un componente, cuatro props obligatorias y una opcional.**
   `EmptyState({ testID, pose, title, body, action? })` en
   `src/components/empty-state.tsx`. Cumple la regla de extracción de
   `docs/ui-guidelines.md`: lo usan 8 pantallas, su papel tiene nombre y su API
   es más pequeña que lo que pinta.
2. **El texto llega traducido.** `EmptyState` no llama a `t()`. Así no entra
   en `SCREEN_FILES` de `src/__tests__/ui-language.test.ts` (delta 0) y cada
   pantalla sigue siendo la dueña de sus claves en `ui-copy-table.ts`.
3. **El raíz lleva el testID del estado.** `home-empty` sigue siendo el
   estado entero y los hijos llevan sufijo (`-pose`, `-title`, `-body`,
   `-action`). Los `findByTestId('<id>')` y `toBeVisible()` existentes siguen
   valiendo. Los `toHaveTextContent` sobre el raíz se mueven a `-title`,
   porque RNTL 14 compara exacto y el raíz concatena título, cuerpo y botón.
4. **Poses con `require` estático.** Un objeto del módulo mapea cada
   `EmptyStatePose` a su `require('../../assets/images/pingo-<pose>.webp')`.
   Metro solo empaqueta `require` con literal.
5. **`expo-image` a 160×160 con `style` en línea**, como `welcome-hero` en
   main. Decorativa, sin `accessibilityLabel`: el título ya dice el estado.
6. **Sin `Card`.** El vacío es el contenido de la pantalla, no una tarjeta.
   Las dos que hoy son `Card` (`docs-empty`, `geofences-empty`) la pierden.
7. **CTA con el `Button` normal** (`rounded-xl bg-accent`, `Button.Label`
   `font-bold text-accent-foreground`), igual que `profile-add-pet` pero sin
   `size="sm"`. Sin labio (D4).
8. **Sin movimiento** (A3). Sin `entering`, el test de Inicio
   `no da entrada a home-states con %s` sigue esperando `[]` para
   `home-empty`.
9. **La CTA de «sin mascotas» reutiliza `profile.addPet`.** No hace falta una
   clave `common.addPet`: el texto es el mismo y `ui-copy-table.ts` admite la
   clave en cualquier fichero.

## Assets

Las poses fuente están en `/home/claude/pet-tracker-mascot/`, fuera del repo:
PNG 1024×1024 RGBA. Entran seis, convertidas a WebP con alfa.

| Fuente | Destino en el repo | Bytes medidos (2026-10-08) |
|---|---|---|
| `mascot-02-talk.png` | `mobile-pet-tracker/assets/images/pingo-talk.webp` | 57 904 |
| `mascot-04-sleep.png` | `mobile-pet-tracker/assets/images/pingo-sleep.webp` | 47 574 |
| `mascot-09-clipboard.png` | `mobile-pet-tracker/assets/images/pingo-clipboard.webp` | 54 558 |
| `mascot-07-health.png` | `mobile-pet-tracker/assets/images/pingo-health.webp` | 60 300 |
| `mascot-06-collar.png` | `mobile-pet-tracker/assets/images/pingo-collar.webp` | 56 062 |
| `mascot-08-food.png` | `mobile-pet-tracker/assets/images/pingo-food.webp` | 56 050 |

Las seis dan `RIFF`/`WEBP`/`VP8X`, bit de alfa activo y 1024×1024. El
spec_author las midió con este mismo comando en su scratchpad, no en
`webp/`. El peso puede variar con la versión de libwebp; el límite de R2
(100 000) deja más del 39 % de margen sobre la mayor.

**Comando de conversión.** Lo corre el leader antes del handoff, como en
#153. Escribe en la carpeta `webp/` que ya existe (hoy solo tiene las dos de
la bienvenida):

```bash
uv run --with pillow python -I -c "
from PIL import Image
s='/home/claude/pet-tracker-mascot'
for a,b in [('mascot-02-talk','pingo-talk'),('mascot-04-sleep','pingo-sleep'),('mascot-09-clipboard','pingo-clipboard'),('mascot-07-health','pingo-health'),('mascot-06-collar','pingo-collar'),('mascot-08-food','pingo-food')]:
    Image.open(f'{s}/{a}.png').save(f'{s}/webp/{b}.webp','WEBP',quality=80,method=6)
"
```

**Copia al repo.** La hace el implementador en R2, desde la raíz del repo:

```bash
cp /home/claude/pet-tracker-mascot/webp/pingo-{talk,sleep,clipboard,health,collar,food}.webp mobile-pet-tracker/assets/images/
```

Si el sandbox del implementador no puede leer fuera del repo, el leader hace
la copia antes del handoff, sin commitear, y lo dice en el handoff.

## Archivos afectados

Por capa (la app móvil no tiene domain/application propios: todo es
presentación más sus tests).

**Nuevos**

- `src/components/empty-state.tsx` (R3).
- `src/components/__tests__/empty-state.test.tsx` (R1, R2, R3, R10, R11).
- `assets/images/pingo-{talk,sleep,clipboard,health,collar,food}.webp` (R2).

**Producción que cambia**

- `src/i18n/catalog.ts`: 5 claves nuevas y 1 valor cambiado, en los dos
  idiomas (R1).
- `src/screens/home/index.tsx` (R4).
- `src/screens/health/index.tsx` (R4).
- `src/app/(tabs)/food.tsx` (R4, R9).
- `src/screens/map/index.tsx` (R4).
- `src/screens/alerts/index.tsx` (R5).
- `src/screens/reminders/index.tsx` (R6).
- `src/screens/docs/index.tsx` (R7).
- `src/screens/geofences/index.tsx` (R8).

**Tests que cambian**

- `src/screens/home/index.test.tsx`, `src/screens/health/index.test.tsx`,
  `src/app/(tabs)/__tests__/food.test.tsx`, `src/screens/map/index.test.tsx`
  (R4; food también R9).
- `src/screens/alerts/index.test.tsx` (R5).
- `src/screens/reminders/index.test.tsx` (R6).
- `src/screens/docs/index.test.tsx` (R7).
- `src/screens/geofences/index.test.tsx` (R8).
- `src/screens/welcome/index.test.tsx` (R2, fila C2).
- `src/providers/__tests__/language-provider.test.tsx` (R1, fila C1).
- `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts`
  (R4 a R9).
- `src/__tests__/consistency-classnames.test.ts` (R3, fila C3).

**Specs**

- `specs/mobile-ui-language/design.md`: §2.21 (R1).

**No cambian**: `package.json`, `bun.lock`, `src/theme/motion.ts`,
`docs/ui-guidelines.md` y los ficheros de los 11 vacíos en texto salvo los
que ya salen arriba por otro estado.

## Candados existentes que se mueven

Cada fila se ancla por contenido grepeable y no por número de línea. T0
comprueba cada ancla con `grep -cF` (tasks.md). Las filas marcadas con (153)
se re-verifican al merge de #153.

| # | Fichero | Ancla (contenido actual) | Cambio | Requisito |
|---|---|---|---|---|
| C1 (153) | `src/providers/__tests__/language-provider.test.tsx` | `+ 1, // #153 R1` | Pasa a `+ 1 // #153 R1` y debajo entra `+ 5, // #155 R1`, con la misma sangría | R1 |
| C2 (153) | `src/screens/welcome/index.test.tsx` | `['pingo-wave-blink.webp', 'pingo-wave.webp']` | Pasa a la lista de 8 nombres de R2 | R2 |
| C3 | `src/__tests__/consistency-classnames.test.ts` | `13 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7` (2 veces) | Las dos pasan a `13 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3` | R3 |
| C4 | `src/__tests__/ui-language.test.ts` | `expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2);` | Pasa a `expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2); // +2 #155 R4` | R4 |
| C5 | `src/__tests__/ui-language.test.ts` | `expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1` | Pasa a `expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4` | R4 |
| C6 | `src/__tests__/ui-language.test.ts` | `expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9 + 11); // #105 R5; +1 #95 R4, -2 #95 R5, +1 #113 R3, +3 #147 R8, +9 #147 R9` | R4 añade ` + 2` tras `+ 11` y `, +2 #155 R4` al comentario; R9 añade ` + 1` y `, +1 #155 R9` | R4, R9 |
| C7 | `src/__tests__/ui-language.test.ts` | `expect(R4_MAP).toHaveLength(17);` | Pasa a `expect(R4_MAP).toHaveLength(17 + 2); // +2 #155 R4` | R4 |
| C8 | `src/__tests__/ui-language.test.ts` | `expect(R8_REMINDERS).toHaveLength(50 + 1 - 2 + 1 - 1); // +1 #95 R4, -2 #95 R5, +1 #114 R4, -1 #114 R5` | Pasa a `... - 1 + 1); // ..., -1 #114 R5, +1 #155 R6` | R6 |
| C9 | `src/__tests__/ui-language.test.ts` | `expect(R14_GEOFENCES).toHaveLength(18);` | Pasa a `expect(R14_GEOFENCES).toHaveLength(18 + 1); // +1 #155 R8` | R8 |
| C10 | `src/__tests__/ui-copy-table.ts` | `{ file: 'src/screens/alerts/index.tsx', key: 'alerts.empty' },` | Debajo entra `{ file: 'src/screens/alerts/index.tsx', key: 'alerts.emptyBody' }, // #155 R5`. `R12_ALERTS` no tiene recuento | R5 |
| C11 | `src/__tests__/ui-copy-table.ts` | `{ file: '<fichero>', key: 'common.noPetsYet' },` para home, health, `src/app/(tabs)/food.tsx` y map (1 cada una) | Debajo de cada una entran las filas `common.noPetsBody` y `profile.addPet` de ese fichero, con `// #155 R4` | R4 |
| C12 | `src/__tests__/ui-copy-table.ts` | `{ file: 'src/screens/reminders/index.tsx', key: 'reminders.noRemindersYet' },` | Debajo entra la fila `reminders.emptyBody`, con `// #155 R6` | R6 |
| C13 | `src/__tests__/ui-copy-table.ts` | `{ file: 'src/screens/geofences/index.tsx', key: 'geofences.empty' },` | Debajo entra la fila `geofences.emptyBody`, con `// #155 R8` | R8 |
| C14 | `src/__tests__/ui-copy-table.ts` | `{ file: 'src/app/(tabs)/food.tsx', key: 'food.noMealPlanYet' },` | Debajo entra la fila `food.noMealPlanBody`, con `// #155 R9` | R9 |
| C15 | tests de pantalla | `expect(screen.getByTestId('<id>')).toHaveTextContent(` para `home-empty`, `health-empty`, `food-empty`, `map-no-pets`, `reminders-empty`, `food-plan-empty`, `alerts-empty` (1 cada uno) | Pasa a `'<id>-title'`; en alertas, el valor esperado pasa además del símbolo `es['alerts.empty']` al literal `'No hay alertas'` | R4, R5, R6, R9 |
| C16 | `src/screens/alerts/index.test.tsx` | `expect(screen.getByTestId('alerts-empty').props.className).toBe(` | Pasa a `alerts-empty-title` con `'text-center text-lg font-bold text-foreground'` | R5 |
| C17 | `src/screens/geofences/index.test.tsx` | `it('pinta el vacío con su tarjeta y su copy'` | Se borra; lo sustituye el describe `#155 R8` | R8 |
| C18 | `specs/mobile-ui-language/design.md` | `## 3. La infraestructura` | Antes entra §2.21 (R1) | R1 |

Los títulos de los `it` de `ui-language.test.ts` que citan un recuento
(`resuelve las 17 ocurrencias normativas` de mapa, etc.) no se tocan: ya hoy
`R5_HEALTH` (35) y `R6_FOOD` (61) citan su recuento original (32 y 50).

`SCREEN_FILES` no cambia: los 8 ficheros ya están en `ALL_USES` y
`empty-state.tsx` no llama a `t()`.

## Guards que vigilan los ficheros tocados

Cada clase o patrón que prescribe la spec, contra los guards globales:

| Prescrito | Guard | Resultado |
|---|---|---|
| `items-center gap-3 py-8` | `design-drift.test.ts`, clases arbitrarias `/[A-Za-z0-9_-]+-\[[^\]]+\]/` | No casa |
| `text-center text-lg font-bold text-foreground` | `legibility-classnames.test.ts` #61 R4, `/text-accent(?![-\w])/`; #61 R5, `/text-warning(?![-\w])/` | No casa |
| `text-center font-normal text-muted` | Ídem | No casa |
| `rounded-xl bg-accent` | `consistency-classnames.test.ts`, inventario de `rounded-xl bg-accent` seguido de espacio o comilla (fuera de tests) | Casa una vez en `empty-state.tsx`: mueve C3 |
| `font-bold text-accent-foreground` | #61 R4, `/text-accent(?![-\w])/` | No casa: sigue un guion |
| `font-bold text-accent-foreground` | #61 R3, sin opacidad sobre `bg-accent` | Sin opacidad |
| `style={{ width: 160, height: 160 }}` | `design-drift.test.ts` caza `StyleSheet`, no `style` en línea | Permitido; ya lo usa `welcome-hero` |
| Comentarios `#155 R<n>` | `HEX_LITERAL` de `design-drift.test.ts` | Un `#155` suelto casaría |
| Tests nuevos | `design-drift.test.ts` también escanea tests: ni hex, ni `StyleSheet`, ni `text-[10px]` | La spec no prescribe ninguno |
| Copy nuevo | Emoji y exclamaciones | R1 lo cierra |

`bg-accent-soft`, `text-accent-strong`, `CONTINUOUS_CORNER`,
`TABULAR_NUMS` y `useThemeColor` no se usan, así que sus inventarios no se
mueven.

## Alternativas descartadas

- **Testid en el título y no en el raíz.** Ahorraría mover los
  `toHaveTextContent`, pero deja el estado sin ancla propia y obliga a
  `-container`. El raíz es el estado.
- **`EmptyState` que llama a `t()` con claves.** Metería
  `empty-state.tsx` en `SCREEN_FILES` y repartiría las claves de cada
  pantalla en dos ficheros.
- **Una clave `common.addPet`.** Duplica el valor de `profile.addPet` y
  suma un candado más al catálogo.
- **Flotar la pose desde ya.** Ver A3: no pasa el filtro de frecuencia para
  Alertas y Recordatorios.
- **Lottie o Rive.** D3 los veta.
- **Ilustrar los 20 vacíos.** Una pose de 160 px dentro de una tarjeta o
  junto a un formulario empuja el contenido y repite la mascota en una misma
  pantalla (Salud tendría tres).
