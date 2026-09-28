---
feature: "mobile-metric-selector-a11y"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Trazabilidad — [[mobile-metric-selector-a11y]] (#74)

> **Codex** rellena las dos últimas columnas al implementar. Las rutas son
> relativas a `mobile-pet-tracker/` salvo que se diga otra cosa. «El test» es
> `src/screens/home/weekly-activity-chart.test.tsx`.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1: `accessibilityRole="radiogroup"` en el contenedor `weekly-activity-metric` | el test :: `#74 R1: el contenedor del selector se anuncia como grupo de opciones` › `declara el rol radiogroup en el contenedor de las tres opciones`. Rojo natural, por `toBe` | `ea01cec7` | `613a2e23` |
| R2: ni el contenedor ni la tarjeta se vuelven un nodo accesible propio | el test :: `#74 R2: el grupo del selector no colapsa sus tres opciones` › `el contenedor solo lleva su rol, su testID, su clase y sus hijos` y › `la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`. Se cierra por **mutación de producción** (C4, vía **b**): `P2red` va versionada en el rojo | `5911d142` | `12afe47d` |
| R3: `adjustsFontSizeToFit`, `minimumFontScale` 0.85 y `maxFontSizeMultiplier` 1.2 por plataforma, y el comentario del suelo en Android | el test :: `#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma` › `%s: ajuste %s, escala mínima 0.85 y tope 1.2 en las tres etiquetas` (filas `android` e `ios`). Con A, por **mutación de producción** (vía **b**, `P3redA` versionada); con B, rojo natural en la fila `android`. El comentario **no tiene test**: lo verifica el `reviewer` con el `grep` de [[tasks]] §R3 | `43115c35` | `ed868658` |
| R4: el `jest.mock('uniwind')` muerto, borrado | **sin test**: borrar andamiaje de test. Lo verifica el `reviewer` con los `grep` de [[tasks]] §R4 y la gráfica en 41 de 41 | N/A: sin test propio | `8ed1b9fc` |
| R5: +0 suites y +5 tests, ninguna cifra de candado movida, sin dependencias, diff limitado a los dos ficheros | **sin test**: la suite completa, `tsc`, `eslint`, los `grep` y los `git diff` de [[tasks]] §R5, y la tabla de sondas en `progress/impl_mobile-metric-selector-a11y.md`. Lo verifica el `reviewer` | N/A: propiedad del diff y de la suite | `8ed1b9fc` (árbol de código final medido; el commit de evidencias lo sigue) |
| R6: TalkBack recorre el selector en tres paradas separadas en un dev build de Android | **gate humano, no delegable a IA**: [[requirements]] §Prueba de humo del humano, con su casilla propia | N/A: gate humano | superado por el humano el 2026-09-28 en un OnePlus Nord 5 (CPH2709), Android 15, opción A: casilla de R6 en `97f2d349`. Tres paradas, cada una con su etiqueta, «botón de opción» y «seleccionado» en la activa; se oyó «Grupo de botones de opción» y no «1 de 3» (aclaraciones del humano en el chat del leader, 2026-09-28) |

Regla: el reviewer no aprueba si alguna fila de R1 a R5 queda «pendiente». La
fila R6 la cierra el humano después del veredicto, y la feature no se marca
`done` sin ella.

## Convención de commit

- R1: `test(mobile): <desc> (R1)` en el rojo y `fix(mobile): <desc> (R1)` en el
  verde.
- R2: `test(mobile): <desc> (R2)` en los dos. El rojo versiona `P2red` y el
  verde la revierte con `git checkout HEAD~1 --`.
- R3: `test(mobile): <desc> (R3)` en el rojo y `fix(mobile): <desc> (R3)` en el
  verde. Con A, el rojo versiona `P3redA` y el verde la revierte antes de añadir
  el comentario.
- R4: `test(mobile): drop the dead uniwind mock (R4)`.
- El reporte con los hashes: `docs(mobile): record the metric selector a11y evidence (R5)`.

Los mensajes exactos están en [[tasks]]. Cada rojo por mutación toca **un**
fichero de producción, `src/screens/home/weekly-activity-chart.tsx`.

## Requisitos sin test propio

La spec declara aquí, antes del handoff, lo que no tiene test propio:

- **El comentario de R3.** Candar un comentario sería asertar sobre texto que no
  cambia el comportamiento; lo cubre un `grep`.
- **R4.** Es borrar andamiaje de test. La evidencia de que estaba muerto es la
  sonda del `throw` de [[requirements]] §Premisas.
- **R5.** Es una propiedad del diff acumulado y de la suite.
- **R6.** Es un gate humano en un dispositivo real.

El `reviewer` cierra el comentario de R3, R4 y R5 por inspección.

No rebasees esta rama después de que Codex rellene los hashes, porque dejarían
de valer los de la tabla (ver #87).
