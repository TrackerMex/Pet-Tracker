# Enmienda E1 de #180 — resumen para el leader y el humano

Fecha: 2026-10-18. Directiva del humano: «nos debemos acercar al diseño del canvas en D1 a D5; si es necesario
cambiar cosas hazlo, igual instalar dependencias». Todo está en
`specs/mobile-alert-detail-canvas-fidelity/` (requirements § Enmienda E1 al final; design §9; tasks H0 7-10, R4-R7,
R12 y S19-S30; traceability § Enmienda E1). Casilla propia **sin marcar**: `- [ ] Enmienda #180 aprobada por humano`.
No se tocó la firma, el `status`, `feature_list.json`, ni código de aplicación. Sin commit.

## Decisiones D1-D5

| # | Antes | Ahora | Por qué |
|---|---|---|---|
| D1 | 26 / 900 / `tracking-title` | **sin cambio** | ya era el valor del canvas |
| D2 | ping 2400 ms (`MOTION_PING_TIMING`) | **1800 ms con ease-out**: `MOTION_ALERT_PING_MS = 1800` nuevo en `motion.ts` + `MOTION_CELEBRATION_EASE_OUT` (misma curva que el `ease-out` de CSS) | canvas = 1,8 s; Welcome (2400) intacto |
| D3 | `bg-glass-surface` 0,60, sin desenfoque | **`BlurView` (`expo-blur`, ya instalada) `intensity` 48 (~12 px en Android) + token nuevo `bg-glass-surface-strong` 0,86** (claro `rgba(255,255,255,0.86)`, oscuro `rgba(22,27,34,0.86)`) | canvas = blanco 0,86 + desenfoque 12. **No hace falta `bun add`** |
| D4 | botones `rounded-xl` | **`rounded-16`** (token existente) en el ack (`h-14`) y en «Ver en el mapa» (`h-13`) | canvas = radio 16; #177 no mergeado y no se redefine |
| D5 | `rounded-24`, `h-52.5` | **sin cambio** | ya era el valor del canvas |

## Ids

Enmendados: R4.1, R5.2, R6.1, R7.1, R7.3, R12 (filas, anclas y literales) y R14.1 (humo). Nuevos: R4.5, R5.5,
R5.6, R7.4, R7.5. R10.2 no cambia.

## Candados que se mueven (detalle en E1.3 y E1.4)

- **K7, K8 sin delta** (antes +1 y un fichero más): el ack ya no casa `rounded-xl bg-accent`. M14 sin delta.
- **K9 sigue +1** (`border-b-4`, `border-black/25`).
- **K19** `design-drift` reserva de `rounded-16`: `outsideReminders` pasa de `[]` a `[detalle]`, más un `it` de
  conteo (rounded-16 = 2) en R7.
- **K20** `#166 R3`: la fila `alert-detail-view-map` sale de `rows` (su receta es `rounded-xl`) y entra un `it`
  por botón. El de la CTA va en el **rojo de R6** (si no, la fila vieja se pondría roja en el verde de R6).
- **K21** `motion.test.ts`: valor y lista «no exporta nada más» (`MOTION_ALERT_PING_MS` va primera, medido con node).
- **K22** `global-css.test.ts`: describe nuevo del par `glass-surface-strong`.
- **K23** candado C: `ping-ring.tsx` sin `MOTION_PING_TIMING` ni `1800`; importadores de `expo-blur` = barra de
  pestañas + detalle.
- **K24** `index.test.tsx`: doble local de `expo-blur` (precedente `floating-tab-bar.test.tsx`).
- Cartas: viñeta §13 y línea nominal §12 con `rounded-16`; quince anclas (nueva `### R3.` de `mobile-chunky-cta`).
- Medidas nuevas M21-M25 y precondiciones P11-P14, todas medidas al redactar (M14 13, M21 3, M22 1, M23 0, M24 0,
  M25 1).

## Revisión informativa de D6-D15 (nada cambiado)

- **D11**: el canvas escalona 80 ms y el proyecto usa `MOTION_STAGGER_MS = 60`. Es la única diferencia medible
  restante con el canvas fuera de D1-D5 (queda en delimitaciones). Si el humano quiere el 80 exacto, hace falta un
  token local y es otra enmienda.
- **D8, D6, D7, D9, D10, D12-D15**: sin diferencia detectada con el artboard o decisiones de producto (el canvas no
  dibuja batería, ni estado leído).
- `--danger` (T1/T2 del explore) difiere globalmente del canvas: no es de #180.

## Preguntas abiertas para el humano

1. **Alfa del anillo**: el canvas usa 0,18 y la spec `/20` (R4.3, no es D1-D5). `bg-danger/18` no está verificado
   en uniwind. Se deja `/20`; si se quiere exacto, se mide en H0 y se enmienda.
2. **Desenfoque sobre el mapa**: el `BlurView` de Android se pinta sobre la superficie nativa de `expo-maps`. Puede
   no desenfocar o parpadear. Si falla, queda una píldora opaca al 0,86 (legible). Lo cubre el humo R14.1.4. Alternativa
   si no vale: `bg-glass-surface-strong` sin `BlurView`.
3. **Intensidad 48**: se eligió por la equivalencia Android (48 / `blurReduction` 4 = 12 px). En iOS no es un radio;
   el humo es solo Android.
4. **Tema oscuro del relleno**: el canvas solo da el claro; el oscuro (`rgba(22,27,34,0.86)`) conserva la base del
   0,60 existente.
5. **Sombra del labio**: el canvas usa `--lip`; #180 mantiene `border-black/25` (fidelidad completa del botón =
   #177). El ack ya cumple 56 y 16.

## Nota para el leader

- Conflicto de reparto con #177: tras E1 el ack/CTA del detalle ya no tocan `rounded-xl`; #177 hereda solo la
  sombra y cualquier cambio de receta. La descripción de #177 en `feature_list.json` dice que «revierte la receta de
  #166 (rounded-xl bg-accent …)»; conviene que mencione que el ack del detalle ya sale con `rounded-16`. No lo toqué.
- El handoff debe nombrar H0 pasos 7-10 (sonda de `expo-blur` real bajo jest, sonda del ping, orden de la lista).
- Riesgo de jest: el detalle ahora importa `expo-blur`; las cuatro suites de ruta pueden pedir el doble local.
