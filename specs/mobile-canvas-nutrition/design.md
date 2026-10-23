---
feature: "mobile-canvas-nutrition"
status: spec_ready
tags: [harness, spec, mobile, canvas-parity]
---

# Diseño — [[mobile-canvas-nutrition]] (#200)

## Decisiones

Todas cerradas con un valor por defecto; el humano puede cambiarlas en el gate.

| # | Decisión | Valor por defecto | Riesgo de colisión |
|---|---|---|---|
| D1 | Entrada escalonada | `RiseIn` de #199 (no un componente propio). El leader no hace handoff hasta que #199 esté en `dev` | `rise-in.tsx` es de #199; #200 no lo modifica |
| D2 | `HomeEntrance` en Horario e Historial | Se sustituye por `RiseIn` (R15) para que las tres pantallas usen la misma curva del canvas | `HomeEntrance` sigue en Inicio; no se toca |
| D3 | Superficies de Nutrición | `View`/`Pressable` con clases propias en vez de `Card` (radios 28/24/20/16, sin borde ni sombra donde el canvas no los dibuja). Evita además que `twMerge` expulse `text-13/15/17` | `Card` no cambia |
| D4 | Anillo | Siempre `withDelay(200, withTiming(…, MOTION_RING_TIMING))`, también al servir o deshacer (una sola ruta de animación); constantes nuevas en `motion.ts` (Enmienda #152) | `motion.ts` y MT los tocan también #197 y #199 (`MOTION_DRAW_*`) |
| D5 | Copy del botón pendiente | Clave nueva `food.markServedAction` (renombra `food.pending`, que solo usa Nutrición) | `catalog.ts` y la tabla de copy los tocan #196–#206 |
| D6 | Píldora «Edad» | No se pinta (Desviación D1) | — |
| D7 | Opacidades .85/.9 del héroe | Se descartan (carta #61 R3) | — |
| D8 | Anillo de avatar | El de `PetSwitcher variant="avatars"` sin cambios | `PetSwitcher` lo tocan #196/#199; #200 solo lo consume |
| D9 | `backFallback` de Horario e Historial | `/food` | — |
| D10 | Test de Nutrición | `git mv` a `src/screens/food/index.test.tsx` (convención Expo desde #39) | Las listas por ruta de § Candados R1 |
| D11 | Cabeceras | `ScreenHeader` de #197 en contenido y `headerShown: false` en su `Stack.Screen` (regla «Cablear es de cada pantalla») | `_layout.tsx` lo tocan #199 y el resto de la ola 2 |
| D12 | Carta | Enmienda #200 en `docs/ui-guidelines.md` con casilla propia de aprobación | `ui-guidelines.md` lo enmiendan #197 y #199 |

## Ficheros afectados por capa

Solo presentación móvil (`mobile-pet-tracker/`); sin dominio, aplicación ni
infraestructura.

- Rutas: `src/app/(tabs)/food.tsx` (delgada, R1), `src/app/_layout.tsx`
  (R12, R13).
- Pantallas: `src/screens/food/index.tsx` (nuevo, R1–R11),
  `src/screens/meal-schedule/index.tsx` (R12, R14, R15),
  `src/screens/meals-history/index.tsx` (R13, R15).
- Tema: `src/theme/motion.ts` (R4).
- Copy: `src/i18n/catalog.ts` (R6), `src/__tests__/ui-copy-table.ts` (R1, R6).
- Carta: `docs/ui-guidelines.md` (R16, ruta relativa a la raíz del repo).
- Tests: FO (movido), MS, MH, LY, MT, DS, NC (nuevo) y los de § Candados
  (`ui-language`, `design-drift`, `tab-headers-canvas`, `empty-state`,
  `consistency-classnames`, `legibility-classnames`).

## Guardas de la carta

Cada clase nueva cruzada contra las guardas:

- **HEX_LITERAL** (design-drift): ninguna clase lleva hex; los comentarios que
  citen la feature usan `#200 R<n>` (un `#200` suelto es hex de 3 cifras).
- **Corchetes**: ninguna clase usa `[…]`; `p-4.5`, `size-9`, `rounded-24`,
  `rounded-16`, `text-11/13/15/17/24`, `leading-body`, `leading-note`,
  `tracking-caps` son tokens o escala de `global.css` (los `leading-*` los
  crea #197).
- **Radios (regla 12)**: `rounded-hero`, `rounded-card`, `rounded-xl`,
  `rounded-full` están en escala; `rounded-24` y `rounded-16` llevan frase en
  la Enmienda #200. `CONTINUOUS_CORNER` en cada esquina no cápsula (héroe,
  comidas, tile, aviso, IA, enlaces).
- **Legibilidad #61 R3**: ningún texto sobre `bg-accent` lleva opacidad
  (héroe y botón «Marcar servido»).
- **#64 R9**: verde y violeta solo vía `CATEGORY_SLOTS` en clases; los iconos
  toman `category-green-strong` / `category-violet-strong` de
  `useThemeColors` (precedente: Horario).
- **Consistencia**: `text-accent-strong` sigue con una sola aparición en
  Nutrición; `style={CONTINUOUS_CORNER}` pasa de 1 a 6 (B8).
- **`StyleSheet.create` cero** y **sin `StyleSheet` en los tests de
  `src/screens/`** (#68 R18): estilos con `toHaveStyle`.
- **twMerge y HeroUI (Enmienda #187)**: ningún `text-<n>` va en un componente
  de HeroUI ni en `Card`; todos van en `Text` de RN. El único componente HeroUI
  tocado es `generate-plan-button`, que solo gana `style`.

## Supuestos

Supuestos de entorno que los tests no ven; los cubre el smoke de § Cierre del
humano:

- `Button` de HeroUI reenvía `style` a su `Pressable`, de modo que el labio
  violeta se ve en Android (precedente: labios de #197 R9 en Horario).
- `RiseIn` respeta «Eliminar animaciones» de Android (lo prueba #199) y
  `ReduceMotion.System` hace saltar el anillo al valor final.
- `ScreenHeader` resuelve la vuelta con `backFallback="/food"` cuando no hay
  historial (deep link), según #197.
- `headerShown: false` en las dos rutas no deja hueco de status bar: el
  `paddingTop: insets.top + 8` lo cubre.
- `PetSwitcher variant="avatars"` expone `pet-chip-<id>` y
  `accessibilityState` como la variante actual (verificado en
  `src/components/pet-switcher.tsx`).

## Alternativas descartadas

- **Nuevas variantes de `Card`** (`hero`, `violet`, `link`): ampliaría un
  componente compartido que usan otras pantallas de la ola y obligaría a
  esquivar `twMerge` con `text-<n>`. Descartado por D3.
- **Cambiar solo el valor de `food.pending`** a «Marcar servido»: menos
  ficheros, pero la clave mentiría sobre su contenido. Descartado por D5.
- **Animar el anillo sin retardo al servir**: dos rutas de animación para un
  matiz que el canvas no dibuja. Descartado por D4.
- **Mantener `HomeEntrance` en Horario e Historial**: su curva no es la del
  canvas (`rise 400ms ease-out`). Descartado por D2.
- **Crear un `RiseIn` propio**: duplicaría #199. Descartado por D1.
