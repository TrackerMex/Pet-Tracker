---
feature: "mobile-collar-pair-link-pressed-feedback"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, ui, deuda]
---

# Trazabilidad — [[mobile-collar-pair-link-pressed-feedback]] (#138)

Los tests de R1 y R2 viven en `mobile-pet-tracker/src/screens/home/index.test.tsx`,
dentro de
`describe('R10 (mobile-device-pairing): la collar card sin collar enlaza a /pairing'`
(«el `describe` del collar»). Los de R3 viven en
`mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `index.test.tsx::R10 (mobile-device-pairing): … › #138 R1: el botón baja a opacidad 0.8 mientras se pulsa y vuelve a 1 al soltarlo, con la esquina continua` | `6dc6570b767c95ee6479eee606bf700628029c79` | `828aade35f5b921e6efa825f5792fc71d9a9c765` |
| R2 | `index.test.tsx::R10 (mobile-device-pairing): … › #138 R2: en reposo, el botón lleva rounded-xl como único radio y la esquina continua con opacidad 1` | `22309656208fd73e00be3bb7659899826209751b` | `828aade35f5b921e6efa825f5792fc71d9a9c765` |
| R3 | `consistency-classnames.test.ts::#62 R14: toda esquina no-cápsula que dibuja el repo es continua › screens/home/index.tsx importa y aplica sus 0 esquinas`, `… › fusiona la esquina una vez y la entrega a las dos ramas de Card` y `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` (enmendados) | `d9878554aec1651babda4094df836a803c16b8b2` | `828aade35f5b921e6efa825f5792fc71d9a9c765` |
| R4 | sin test: cierre medido ([[tasks]] §R4 y `progress/impl_mobile-collar-pair-link-pressed-feedback.md`) | no aplica | `828aade35f5b921e6efa825f5792fc71d9a9c765` (verde común) |
| R5 | sin test: prueba de humo del humano en dev build de Android ([[requirements]] §Prueba de humo del humano) | no aplica | pendiente (firma del humano: casilla de R5 en [[requirements]]) |

Regla: el reviewer no aprueba si alguna fila de R1 a R4 queda «pendiente». La
casilla de R5 la marca el humano después del veredicto, y la feature no pasa a
`done` sin ella.

## Convención de commit

- Rojo: `test(mobile): <desc> (R<n>)`. Solo toca el test del requisito; la Home
  sigue en su blob de base.
- Verde común: `feat(mobile): dim the collar pair link while pressed (R1,R2,R3)`.
  Solo toca la Home.
- Evidencia: `docs(mobile): record the collar pair link pressed feedback evidence (R4)`.

Los mensajes exactos están en [[tasks]]. Las filas de R1, R2 y R3 citan el
mismo commit verde.

## Requisitos sin test propio

- **R4** se verifica con las medidas de [[tasks]] §R4: suite, `tsc`, `eslint`,
  cifras de candado, diff de producción mínimo, blobs finales y la tabla de
  sondas re-medida. Su fila cita el hash del **verde común**, no el de `HEAD`.
  El commit de evidencia solo toca `progress/` y esta tabla, y citarlo haría
  que la fila apuntara a un commit sin código.
- **R5** lo cierra el humano con su casilla en [[requirements]] §Prueba de
  humo del humano.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla, porque los hashes dejarían de valer. Si hace falta, reapunta cada
hash y comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.
