# Spec #177 mobile-chunky-cta-canvas-fidelity

Spec en `specs/mobile-chunky-cta-canvas-fidelity/` (requirements, design, tasks, traceability). `status: draft`, aprobación sin marcar. En `feature_list.json` la feature queda en `spec_ready` a la espera del gate humano; el leader decide si lo mantiene hasta la firma.

Base medida en `d799d714`; Codex re-mide las anclas en H0 y para si una difiere.

## Qué fija

- Receta global: cta `h-14 rounded-16 bg-accent` (16 botones), neutro `h-14 rounded-16 border-2 border-lip-gray bg-surface` (6), compacto de Recordatorios (`h-10`, labio de 3) y tile del candado de Recuperar.
- Labio como sombra sólida externa: hook `useChunkyLip()` en `src/theme/chunky-lip.ts` con `boxShadow` y tokens `--color-lip` / `--color-lip-gray`. `border-b-4` queda en 0.
- Etiqueta 17/800 con `Text` plano de react-native (15 conversiones), sin violar el candado AST de #187. Los pisos de #187 bajan a 211 y 167.
- Inventarios cerrados: 17 `Button` con `bg-accent`, 17 consumidores del hook, `rounded-16` en 26 sitios, `text-17` en 23. Un candado por rama de cada cláusula universal.
- Fuera: chips, ack compacto de Alertas, Horario, tarjeta de resumen, destructivos, tonales y reintentos.

## Decisiones abiertas (el humano las decide en Notion)

| # | Pregunta | Recomendación |
|---|---|---|
| D1 | Mecánica del labio | (a) hook + `boxShadow`; (b) borde interno y (c) clase de tema descartadas |
| D2 | Una altura de 56 | Sí; excepciones `view-map` 52 y compacto 40 |
| D3 | Bajar pisos de #187 a 211 y 167 | Sí, en commit solo de test, aflojamiento declarado |
| D4 | Compacto y tile dentro | Dentro; si no, `border-b-4` queda en 2 y `border-black/25` en 4 |
| D5 | Chip, ack de fila, Horario y tarjeta de resumen fuera | Fuera, con feature posterior |
| D6 | Empty-state sin `w-full` ni icono | Sí |
| D7 | «Ya tengo cuenta» a 17/700 como el canvas | Seguir el canvas |
| D8 | Variante deshabilitada solo en la carta; sin «Eliminar» con sombra `#9F1F15` | Sí |
| D9 | `--color-lip` `#0E5E3C` claro y `#0B4D31` oscuro | Sí |
| D10 | Hoja de borrar: cancelar 56 y confirmar destructivo por defecto (asimétrico) | Dejarlo y mirarlo en el smoke |

## Cosas a vigilar

- Jest ve la forma del estilo, no el píxel: aire de 4 px, recorte, tema oscuro y escala al pulsar solo los ve el smoke humano (R14, casilla propia).
- Dos filas no son nuevas pero cambian de dueño: `alert-detail-view-map` solo gana labio y `alert-detail-ack` solo cambia la clase (#180).
- Si #186, #188, #189 o #191 mergean antes, quien fusiona después re-mide las anclas y los `keeps`; cada `Button` nuevo suma fila en su commit.
- Candados con amenaza de ceguera cubiertos con sondas S1 a S14 (tasks.md).
- Gates humanos separados: aprobación de la spec, «Enmienda #177 aprobada por humano» y «Smoke R14».
