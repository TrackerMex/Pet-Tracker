---
feature: "mobile-home-motion-foundations"
status: draft        # draft | approved
tags: [mobile, ui, motion, spec]
---

# Diseño — [[mobile-home-motion-foundations]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
>
> Referencia visual, no normativa: artboard *Inicio* del canvas de propuesta
> (https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j), dirección que el humano
> aprobó el 2026-10-06. De ese artboard esta spec solo toma la entrada
> escalonada y la barra de batería; colores, copy, mascota y botones son de
> features posteriores. Donde el canvas y esta spec difieran, manda la spec.

## Decisiones técnicas

1. **Entrada con `entering`, no con un estilo animado.** La carta
   (§Animación) ya pide "Entering/exiting de Reanimated para cambios de estado
   visibles (aparición de cards, resultados de fetch)", y la skill
   expo-animation elige animaciones de layout para "un elemento que se monta".
   En jest además es la única opción que no rompe la suite:
   - un estilo animado que nace en `opacity: 0` deja ese valor en
     `props.style` del host para siempre (PL1), y todos los `toBeVisible` de
     sus descendientes fallarían;
   - `entering` no toca `style` y no se ejecuta en jest (PL2).
2. **Receta propia, no constructor.** `homeEntering(delayMs, offsetY)`
   devuelve una animación de layout personalizada (función `'worklet'` que
   devuelve `initialValues` y `animations`), en vez de
   `FadeInDown.springify()...`. Así:
   - el muelle se configura por `duration` y `dampingRatio`, como pide la
     skill;
   - el desplazamiento es exactamente 12 y el fundido tiene su propio
     `ReduceMotion.Never`;
   - y un test puede invocar la receta y comparar el resultado entero con un
     literal (R3), sin leer campos privados de un constructor.
3. **"Una vez por montaje" es la semántica nativa de `entering`.** Reanimated
   la ejecuta al montarse el nodo y nunca en una actualización. El trabajo de
   la Home es no desmontar los envoltorios sin necesidad:
   - cada `HomeEntrance` ocupa una posición fija del JSX de `home-content`;
   - se pinta bajo la misma condición que su bloque;
   - TanStack Query conserva `data` durante un refresco, así que un refresco
     no cambia ninguna condición.

   R6 lo cierra por la identidad del nodo host (PL4).
4. **Envoltorio fuera del bloque.** `Card` aplana su `style` con
   `StyleSheet.flatten` y renderiza un `View` o un `Pressable` normal, así que
   no puede llevar `entering`. Por eso cada bloque se envuelve en un
   `Animated.View` sin estilo, que es el que participa en el `gap: 16` de
   `home-content`. Es la misma razón por la que `summary-reveal` envuelve la
   fila del resumen desde fuera: los tests de #77 y #69 leen
   `valor.parent.parent` como la fila `flex-row`, y esa cadena no cambia.
5. **Índice fijo por bloque, no por orden de llegada.** La espera es
   `index × 60 ms`. Collar y última posición se montan cuando llega el
   detalle, más tarde que el resto, y entran con su espera contada desde su
   propio montaje. No hace falta coordinar entre bloques.
6. **Reduce motion por el hook, como welcome (#118) y la barra de comidas
   (#106).** `useReducedMotion()` decide el desplazamiento (12 o 0) y si la
   barra se llena o salta a su valor. El fundido lleva `ReduceMotion.Never`,
   así que sobrevive aunque el sistema pida reducir. El muelle lleva
   `ReduceMotion.System` como red de seguridad.
7. **Barra de batería como componente propio.** `CollarBatteryBar` se monta
   con `collar-card`. Su valor compartido nace en cada montaje, y por eso la
   barra se llena desde vacía cada vez que el collar entra, sin lógica de
   "primera vez" en `HomeScreen`, que ya tiene 848 líneas. Reproduce el patrón
   de la barra de comidas (#106): pista con `overflow-hidden`, relleno sin
   hijos que anima `width` en porcentaje. Es la excepción que la skill admite
   para animar `width`.
8. **Fundaciones mínimas.** `motion.ts` declara las tres duraciones de la
   carta, aunque #152 solo consume la de 250 ms: `feature_list.json` pide
   "150/250/400 en un solo sitio". También declara los tres presets que esta
   feature usa. No migra las constantes existentes (deuda escrita en la
   enmienda A21).

## Archivos afectados

Rutas relativas a la raíz del repo. Ninguna capa de backend ni de
`domain/application/infrastructure` se toca: es UI pura de `mobile-pet-tracker/`.

| Fichero | Cambio | R |
|---|---|---|
| `mobile-pet-tracker/src/theme/motion.ts` | Nuevo: constantes de movimiento | R1 |
| `mobile-pet-tracker/src/theme/__tests__/motion.test.ts` | Nuevo | R1, R2 |
| `docs/ui-guidelines.md` | §Animación (una frase) y sección `## Enmienda #152` al final | R2 |
| `mobile-pet-tracker/src/screens/home/home-entrance.tsx` | Nuevo: `homeEntering` y `HomeEntrance` | R3, R4 |
| `mobile-pet-tracker/src/screens/home/home-entrance.test.tsx` | Nuevo | R3, R4 |
| `mobile-pet-tracker/src/screens/home/collar-battery-bar.tsx` | Nuevo: `CollarBatteryBar` | R8 |
| `mobile-pet-tracker/src/screens/home/index.tsx` | Seis `HomeEntrance`, `summary-reveal` y `CollarBatteryBar` en la fila de batería | R5, R7, R8 |
| `mobile-pet-tracker/src/screens/home/index.test.tsx` | Describes `#152 R5`-`#152 R8` y los cuatro tests de orden de P8 | R5-R8 |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | Describe `#152 R9` | R9 |
| `mobile-pet-tracker/src/theme/global.css` | Solo el commit rojo de R2 (mutación versionada, ver `tasks.md`); el verde la revierte y el diff neto contra la base es vacío | R2 |
| `specs/mobile-home-motion-foundations/traceability.md` | Filas con test y commit | todos |
| `progress/impl_mobile-home-motion-foundations.md` | Nuevo: reporte de Codex | — |

**No se tocan:**
- `mobile-pet-tracker/src/theme/global.css` (D1);
- `src/components/card.tsx`, `src/components/pet-hero-header.tsx` y
  `weekly-activity-chart.tsx`;
- `i18n/catalog.ts` y `ui-copy-table.ts` (no hay copy nuevo, así que el
  candado de longitud de `language-provider.test.tsx` y `SCREEN_FILES` de
  `ui-language.test.ts` no se mueven);
- `package.json` (cero dependencias nuevas).

## Alternativas descartadas

- **Envoltorio con `useSharedValue` + `useAnimatedStyle` + `withDelay`.** Es
  el patrón de welcome (#118) y sería observable con `toHaveAnimatedStyle`.
  Pero la opacidad que nace en 0 queda congelada en `props.style` en jest
  (PL1), y rompería todos los `toBeVisible` de la Home. Arreglarlo exigiría
  reescribir cientos de aserciones o arrancar en opacidad 1, con un frame de
  parpadeo en el dispositivo.
- **`FadeInDown.springify().damping(16).stiffness(180)` del explore.** Rebota
  (D4), se configura por masa/rigidez en vez de por duración, y solo se puede
  inspeccionar leyendo campos privados del constructor.
- **Tokens `--motion-*` en `global.css`** (D1).
- **Pasar `entering` a `Card`.** Cambiaría un componente que importan 16 ficheros de
  `src` (sin contar tests) para un uso de uno solo.
- **Fundido cruzado skeleton/contenido.** Exige montar los dos a la vez y
  medir alturas distintas; el skeleton se desmonta y el contenido funde.
- **Count-up de cifras** (§Fuera de alcance).
- **Rellenar la barra de batería desde `HomeScreen`** con un valor compartido
  en la pantalla. Haría falta resetearlo a 0 al cambiar de mascota y al
  desmontarse el collar; el componente propio lo obtiene gratis de su montaje.
