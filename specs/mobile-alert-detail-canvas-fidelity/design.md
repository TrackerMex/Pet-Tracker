---
feature: mobile-alert-detail-canvas-fidelity
id: 180
status: approved      # draft | approved
tags: [mobile, ui, canvas, alerts, spec]
---

# Diseño — #180 Detalle de alerta fiel al canvas

## 1. Enfoque

Cambio solo de presentación (`mobile-pet-tracker/`, capa de pantalla y utilidades de UI). Sin dominio,
sin aplicación, sin infraestructura, sin backend: ni una llamada de red nueva, ni un cambio en el ack, en la
navegación al mapa o en la salida cuando la alerta desaparece. Se construye sobre #173/#174/#175/#178/#179,
ya mergeados en `44acd74b`, y reutiliza `Card variant="hero"`, `HomeEntrance`, los `MOTION_PING_*`, el `disc`
de `alert-meta.ts`, `font-extrabold` y los tokens `--text-13/15/22/26`, `--tracking-title`, `--radius-hero`.

La pantalla pasa de una tarjeta con fila de cabecera y borde a: título 26/900 en el contenido, héroe centrado
(disco de 72 + píldora + tipo + mascota + fecha) coloreado por tipo, mapa de 210 de alto con la distancia como
píldora de cristal encima, CTA secundaria con icono y ack primario anclado al fondo.

## 2. Ficheros afectados (por capa)

Solo capa de UI de `mobile-pet-tracker/` (no hay domain/application/infrastructure que tocar; ver
`docs/architecture.md`).

| Capa | Fichero | Cambio |
|---|---|---|
| Ruta | `src/app/_layout.tsx` | `title: ''` en `alerts/[alertId]` (R1.1) |
| Pantalla | `src/screens/alert-detail/index.tsx` | título, marco, héroe, mapa con píldora, CTA, ack, espaciador, entrada, esqueleto y error (R1-R3, R5-R7, R9, R10) |
| Pantalla | `src/screens/alert-detail/ping-ring.tsx` (nuevo) | `AlertPingRing` (R4) |
| Tema | `src/theme/motion.ts`, `src/theme/global.css` | `MOTION_ALERT_PING_MS` (R4.5); par `glass-surface-strong` (R5.5) (enmendado por E1) |
| Utilidades | `src/utils/alert-meta.ts` | quita `surface`; añade `solid`, `onSolid`, `onSolidText`, `heroInk`, `ring` (R11) |
| i18n | `src/i18n/catalog.ts` | `alerts.mapLabel` (R8) |
| Tests | `src/screens/alert-detail/index.test.tsx`, `ping-ring.test.tsx` (nuevo), `src/utils/alert-meta.test.ts` (nuevo), `src/__tests__/alert-detail-canvas-fidelity.test.ts` (nuevo), `src/app/__tests__/layout.test.tsx` y los candados agregados de requirements §4 | R1-R13 |
| Docs | `docs/ui-guidelines.md`, `specs/mobile-ui-language/design.md` y las seis specs de R12.1 | R12 |

## 3. Decisiones de diseño

- **Héroe con `Card variant="hero"`**: da `rounded-hero` (28), `CONTINUOUS_CORNER` y el padding de base; el
  color del tipo entra por `className` (`meta.disc`). Riesgo conocido: `twMerge` debe expulsar
  `bg-surface-secondary` ante `bg-category-rose`/`bg-default`; se sondea en H0 sobre el `Card` real. Si no lo
  hace, fallback a `View` + `CONTINUOUS_CORNER` con las mismas clases (requirements R3.1), sin tocar `Card`.
- **Color por tipo en `alert-meta.ts`, no en la pantalla**: los literales `bg-danger`, `bg-warning-strong` y
  `bg-muted` viven con el resto de metadatos del tipo; los de paleta salen de `CATEGORY_SLOTS` para respetar
  #64 R9 (ninguna clase `*-category-*` fuera de `category-palette.ts`).
- **`surface` se elimina** al cerrar R3: tras el rediseño no tiene consumidor (la lista usa `disc`); dejar un
  campo muerto es peor que un candado menos.
- **`AlertPingRing` local** (D2): un solo anillo, no el trío de Welcome; usa `MOTION_PING_FROM`,
  `MOTION_PING_TO_SCALE`, `MOTION_ALERT_PING_MS` (1800) con `MOTION_CELEBRATION_EASE_OUT` y `useReducedMotion()`
  (con movimiento reducido, nada) (enmendado por E1: antes `MOTION_PING_TIMING`, 2400). No se
  extrae `PingRing` de Welcome para no mover los tests de #167 R12 ni tocar Welcome/Celebration.
- **Píldora de distancia dentro del mapa**: `absolute` sobre el `View` del mapa (que ya tiene
  `overflow-hidden`), no como hijo de `PetMap`: `PetMap` queda con las mismas props (#170 R9, R5.3).
  Cristal con `BlurView` de `expo-blur` y relleno `bg-glass-surface-strong` (0,86) (enmendado por E1, D3; antes
  `bg-glass-surface` 0,60 sin desenfoque). El `BlurView` envuelve al `Text` para que el desenfoque recorte a la
  forma de píldora (`overflow-hidden rounded-full`).
- **Espaciador `flex-1` + `flexGrow: 1`** para el ack al fondo (patrón de `forgot`, `login-spacer`). Se pinta
  siempre para que la CTA no cambie de índice al pasar la alerta a leída.
- **Botones con las alturas de #172 R20 y el radio del canvas** (D4, enmendado por E1): `h-14 rounded-16`
  primario con `border-b-4 border-black/25`; `h-13 rounded-16 border-2 border-b-6 border-lip-gray bg-surface`
  secundario (antes `rounded-xl`). #177 aún no está mergeado y no se redefine aquí. La etiqueta del ack usa `text-accent-foreground`, que
  `twMerge` respeta (precedente en login, forgot, register, reset-password).
- **Fecha con mes corto** (D8): se pasan opciones a `toLocaleString`; se prueba el objeto de opciones y una
  regex medida en node, no la salida de Hermes (humo).
- **Título en los tres estados** (D14) y cabecera nativa con `title: ''`: el back y el gesto se conservan; el
  título pasa al contenido como en Alertas (#174).
- **`HomeEntrance` 0/1** (D11): héroe y mapa entran escalonados con las piezas existentes; el resto sin
  entrada para que la CTA y el ack estén listos al instante.

## 4. Bloque canónico de enmienda

El test de R12 extrae este cercado, sustituye los marcadores y busca el bloque (sin la línea de firma) en
cada fichero; la firma se comprueba aparte con `/- \[[ xX]\] Enmienda #180 aprobada por humano/`.

```markdown
## Enmienda #180 — Detalle de alerta fiel al canvas

> Enmienda de `<FEATURE>` por `mobile-alert-detail-canvas-fidelity` (#180, 2026-10-16). Directiva del humano:
> «el diseño final debe de quedar como el artifact».

**Qué cambia**: <QUÉ CAMBIA>.

Detalle y tests en `specs/mobile-alert-detail-canvas-fidelity/requirements.md`. Los `it` citados se reescriben en
su sitio con el sufijo `(enmendado por #180 Rn)`.

- [ ] Enmienda #180 aprobada por humano
```

## 5. Textos de la carta (literales, R12.2)

- **§13, viñeta «Sin labio»**: la cola `(reintentos, confirmar alerta en el detalle).` pasa a `(reintentos).`
- **§13, viñeta nueva** (con la sangría de «Secundario compacto de fila (#174)», justo detrás):
  `Primario del detalle de alerta (#180): ack con labio, h-14 rounded-16, etiqueta text-17 font-extrabold; el secundario «Ver en el mapa» es h-13 rounded-16 con el icono Map.` (enmendado por E1)
- **§12, línea nominal** (detrás de las de #175/#179): ``Fuera de la escala, por fidelidad al canvas (#180): `rounded-24` (24 px), mapa del detalle de alerta, que es un View y no un Card; `rounded-16` (16 px), ack y «Ver en el mapa» del detalle de alerta.`` (enmendado por E1)

## 6. Decisiones de detalle

- **`onSolid` es un token, no una clase**: el icono recibe `color` por prop (`useThemeColors`); la píldora usa
  la clase `onSolidText`. Dos campos con el mismo valor semántico; fusionarlos obligaría a traducir clase a
  token en la pantalla.
- **`danger-foreground`** viene del tema de HeroUI (nieve) y `background` del tema propio; el contraste en
  tema oscuro (`bg-danger` #F87171) lo mira el humo (R14.1.2).
- **Control positivo junto a cada `queryBy…` nulo** (R4.2, R5.1, R7.1): sin él el `null` es tautológico.
- **Sufijo de enmienda en los `it`**: los `it` de #100/#134/#170 que cambian se reescriben en su sitio con
  `(enmendado por #180 Rn)` en el título, igual que hizo #174.

## 7. Alternativas descartadas

- **Cabecera propia** (título y back en el contenido, `headerShown: false`): pierde el back nativo y el
  gesto; D-H está decidido.
- **Título de 24** (descripción de la feature): no casa con la lista ni con el canvas (D1).
- **Extraer `PingRing` de Welcome**: refactor de otra pantalla con sus tests; fuera de alcance (D2).
- ~~`expo-blur` para la píldora: dependencia nueva por un 0,26 de opacidad (D3).~~ Reabierta por E1: la
  dependencia ya está instalada (barra de pestañas) y no cuesta nada; el humano pidió acercarse al canvas.
- **Redondear a la escala** (`rounded-2xl`, `h-12`): contradice «Píxel exacto».
- **Clases entre corchetes** (`h-[210px]`): vetadas por C8; los tokens `h-52.5`, `size-18`, `rounded-24`
  existen (v4 acepta múltiplos de 0,25 en el espaciado).
- **Poner los colores del héroe en la pantalla**: la lista y el detalle leerían literales distintos del
  mismo tipo; `alert-meta.ts` es el sitio.
- **Mantener `surface`**: campo muerto con una columna de test que nadie usa.

## 8. Notas

- **#177** no es dependencia ni se solapa en ficheros de producción; con E1 el ack y la CTA del detalle ya no
  están en los candados de `rounded-xl` (`#166 R2/R3`, `#62 R1`), pero sí en `border-b-4`/`border-black/25`
  (`#166 R2`) y en la reserva de `rounded-16` de `design-drift`. El reparto de ficheros caduca al mergear:
  quien mergee segundo vuelve a medir.
- **Handoff a Codex**: el leader nombra las skills de Codex según `.claude/agents/leader.md` §Catálogo real de
  skills de Codex (no los nombres de este lado).
- Solapes posibles al mergear: `### §2.N` de `specs/mobile-ui-language/design.md`, la última línea de la
  expresión de longitud de LP, la última `## Enmienda #` de la carta, las listas de `text-13/15/17/22/26` y la
  de `#166 R2`. Todos se re-miden en H0.

## 9. Enmienda E1 (2026-10-18): D2, D3 y D4 al valor exacto del canvas

Directiva del humano: «nos debemos acercar al diseño del canvas en D1 a D5; si es necesario cambiar cosas
hazlo, igual instalar dependencias». D1 y D5 ya eran el valor del canvas. Requisitos en `requirements.md` § Enmienda E1.

- **Ping (D2)**: `MOTION_ALERT_PING_MS = 1800` nuevo en `motion.ts`, junto a `MOTION_CELEBRATION_EASE_OUT`
  (`Easing.bezier(0, 0, 0.58, 1)`, igual que el `ease-out` de CSS). `MOTION_PING_TIMING` (2400, Welcome) queda
  tal cual: el ping del detalle no es el de Welcome. Alternativa descartada: cambiar `MOTION_PING_TIMING` a 1800
  (movería #167 R12 y la bienvenida); y reusar `MOTION_CELEBRATION_PING_MS` (2200, no es 1,8 s).
- **Cristal (D3)**: `BlurView` `intensity={48}` (Android: radio ≈ 12 px = 48 / `blurReduction` 4), `tint` por
  tema y `blurMethod="dimezisBlurViewSdk31Plus"` como la barra de pestañas (mismo patrón y misma versión). El
  relleno es un token nuevo porque el 0,86 del canvas no existe: `--glass-surface-strong` (+ espejo
  `--color-glass-surface-strong` para la clase), claro `rgba(255,255,255,0.86)` y oscuro `rgba(22,27,34,0.86)`
  (el oscuro conserva la base del 0,60 existente: el canvas solo da el claro). **Sin `bun add`**.
  Riesgo: desenfoque sobre la superficie nativa de `expo-maps` (R14.1.4); el relleno opaco hace que, si falla,
  se degrade a una píldora legible. Alternativa descartada: `BlurView` sin relleno (ilegible sobre mapa
  claro); píldora sin desenfoque con 0,86 (cumple el color, no el desenfoque 12).
- **Radio de los botones (D4)**: `rounded-16`, token existente (`--radius-16`), solo en el ack y en «Ver en el
  mapa». Efectos en candados: salen del inventario `rounded-xl bg-accent` y de la receta `rounded-xl … lip-gray`
  (K7, K8, `#166 R3 rows` sin cambio de cifra, fila movida a un `it` propio) y entran en la reserva de
  `rounded-16` de `design-drift` (K19). Alternativa descartada: esperar a #177 y dejar `rounded-xl`
  (la directiva pide el valor exacto ahora); alternativa descartada: `rounded-2xl` (no es 16).
- **Radio y altura no se confunden**: `h-14` (56) y `h-13` (52) no cambian; solo el radio.
- **Reconciliación con #177**: el ack ya cumple 56/16/17-800; quedaría para #177 la sombra en `--lip`
  (`border-black/25` → `--lip`) y, si cambia la receta, tocar las dos pantallas de nuevo. Quien mergee segundo mide.
