# Handoff de corrección — #78 `mobile-alerts-center`, ronda 2

> Escrito por el leader el 2026-09-11, tras el veredicto **rechazado** del
> `reviewer` (`progress/review_mobile-alerts-center.md`).
> El rechazo NO toca producción: son dos aserciones que faltan. Todo lo demás
> —R1-R5, R7-R13 y las ocho enmiendas E1-E8— queda aceptado tal cual, la
> trazabilidad no necesita reapuntar ningún hash y `./init.sh` salió verde dos
> veces seguidas en manos del reviewer.

---

## Prompt

```
Feature: mobile-alerts-center (#78), branch: feature/78-mobile-alerts-center
Ronda 2: corrección tras veredicto rechazado.
Lee primero: progress/review_mobile-alerts-center.md (§Observaciones y
§Qué hay que hacer para aprobar). Tu implementación de la ronda 1 está en
progress/impl_mobile-alerts-center.md.

NO cambies de branch, NO mergees main, NO rebases: la trazabilidad ya está
escrita y un rebase invalidaría sus hashes (pasó en #87, 42 hashes).

Dos correcciones, AMBAS SOLO DE TEST. No toques una sola línea de producción:
si crees que hace falta cambiar producción para pasarlas, para y dilo en el
reporte.

--- Corrección 1 (bloqueante). R6, decisión 12: el orden de los TRES TEXTOS
    de la fila no está candado.

El reviewer intercambió en producción los dos <Text> de la columna —el
petName se pinta ENCIMA del tipo de alerta, una fila visiblemente distinta— y
la suite móvil entera quedó VERDE: 73 suites, 1230 tests. Es, palabra por
palabra, el modo de fallo que la decisión 12 de docs/ui-guidelines.md
§Enmienda #70 existe para impedir.

Por qué se escapó: src/screens/alerts/index.test.tsx:336-342 fija bien la
posición de los hijos del Card (children[0] icono, children[1] columna,
children[2] ack) y cuenta con children.length, nunca por prefijo de testID.
Lo que falta es la posición UN NIVEL MÁS ABAJO, dentro de la columna.

En el it.each de '#78 R6', junto a las aserciones que ya existen:

  const column = elementChild(row, 1);
  expect(elementChild(column, 0).props.testID).toBe(`${rowId}-type`);
  expect(elementChild(column, 1).props.testID).toBe(`${rowId}-pet`);
  expect(elementChild(column, 2).props.testID).toBe(`${rowId}-time`);

--- Corrección 2 (menor, misma ronda). R4 punto 1: la receta tipográfica del
    título de la pantalla no tiene expect.

R4.1 exige literalmente <Text className="text-2xl font-black text-foreground">.
El reviewer lo degradó a "text-xs font-normal text-muted" y la suite completa
siguió verde. Añade en '#78 R4':

  expect(screen.getByText(es['alerts.title']).props.className).toBe(
    'text-2xl font-black text-foreground',
  );

--- Método obligatorio, para las dos: SONDA VISTA EN ROJO.

La carta §Enmienda #70 dice que sin sonda en rojo no hay candado, y este
rechazo nace exactamente de dos candados que nadie probó en rojo. Para cada
corrección, en este orden:
  1. Commit del test nuevo.
  2. Planta la mutación en PRODUCCIÓN (corrección 1: intercambia los dos
     <Text> de la columna en src/screens/alerts/index.tsx; corrección 2:
     degrada la className del título), corre la suite dirigida y comprueba que
     el rojo sale POR TU ASERCIÓN NUEVA, no por otra.
  3. Restaura con `git checkout -- <fichero>` y verifica `git diff` vacío.
  4. Pega en progress/impl_mobile-alerts-center.md el bloque rojo literal de
     cada sonda, como ya hiciste con la de R13.

Si al plantar la sonda el rojo no sale por tu aserción, la aserción no cierra
la dimensión: arréglala antes de seguir.

Reglas que siguen vigentes de la ronda 1:
  - Está PROHIBIDO relajar o borrar una aserción existente. Si crees que una ya
    no aplica, no la toques: escríbelo en el reporte y para.
  - Ninguna cifra de candado se mueve en esta ronda. Si alguna se moviera,
    decláralo como suma y dilo en el reporte.
  - NO toques feature_list.json ni STATUS.md: los lleva el leader.
  - NO toques backend-pet-tracker/.
  - Actualiza progress/impl_mobile-alerts-center.md con los commits de esta
    ronda y las dos sondas; añade las filas a specs/mobile-alerts-center/
    traceability.md si el hash de R6 o de R4 cambia de sitio.
  - Al terminar, COMMITEA Y PUSHEA.

Entorno, sin cambios:
  - env -u FORCE_COLOR bash ./init.sh (sin esa env aborta en falso, bug #75).
  - pgrep -af 'init\.sh' | grep -v grep antes de lanzarlo: Postgres compartido
    con el worktree /home/claude/sites/Pet-Tracker-wt-backend. Espera si hay
    algo vivo, no mates nada.
  - Flake #72 (add-pet, "uploads a chosen preview only after createPet
    succeeds"): si cae, repite la corrida completa y anótalo. No es tuyo.

Al terminar: init.sh verde y el reporte actualizado. R14 sigue siendo gate
humano: no lo firmes.
```

---

## Qué NO se le pide a Codex

- Nada de producción. El reviewer aceptó el código: los dos hallazgos son
  aserciones que faltan.
- Nada de reapuntar hashes: los 37 citados resuelven y son ancestros de HEAD.
- Las tres observaciones no bloqueantes del veredicto (R5 con aserciones más
  estrechas, `isDisabled` más amplio de lo pedido, `alerts-action-error`
  compartido entre R8 y R9) se aceptan como están. La cuarta —`STATUS.md`
  desactualizado— es del leader y se arregla al mergear `main`, cuando el
  recuento sea estable.
