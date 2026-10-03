# Handoff a Codex CLI — #71, las dos ultimas dimensiones (O7 y O8)

> Escrito por el leader el 2026-09-09. El reviewer **aprobo** #71. Estas dos no
> bloquean, pero son la misma familia de hueco que ya costo un rechazo en esta
> feature y una observacion en #69: un elemento repetido decide mas cosas de
> las que su candado mira.

---

```
Feature: mobile-home-quick-actions (#71)
Branch: feature/71-mobile-home-quick-actions (la misma; sigue tu historial)
Origen: progress/review_mobile-home-quick-actions.md, observaciones O7 y O8

--------------------------------------------------------------------
O7 — El recuento cuenta testID, no hijos
--------------------------------------------------------------------
El arreglo del bloqueante cambio la lista blanca por `/^quick-action-/`, y eso
cerro el agujero que el reviewer probo. Pero el candado sigue contando
COINCIDENCIAS DE testID, no hijos de la fila. Consecuencia verificada por el
reviewer: un cuarto tile con `testID="shortcut-extra"` -o directamente **sin
testID**- sigue pasando con 198/198 verde.

Que hacer: dar `testID` a la FILA de tiles y asertar `children.length === 3`
sobre el arbol renderizado. Eso toca produccion -el `testID` del contenedor-,
asi que va con su par rojo->verde.

Criterio de aceptacion, plantalo tu: un cuarto tile **sin testID** dentro de la
fila tiene que poner la suite ROJA. Y con `testID="shortcut-extra"`, tambien.

--------------------------------------------------------------------
O8 — Sexta dimension sin vigilar: el color de la etiqueta
--------------------------------------------------------------------
`text-foreground` -> `text-muted` en la etiqueta del tile deja la suite entera
verde, 68/68 y 1054/1054. El contraste real caeria de ~17 a **4,54** en claro
sobre texto de 10 px: sigue pasando AA por 0,04, pero la tabla de
`design.md` §4 dejaria de describir lo que se envia.

Que hacer: R4 ya observa cinco dimensiones por tile con `within(tile)` y lee la
tinta espiando `Uniwind.getCSSVariable`. Anade la sexta -el color de la
etiqueta- al mismo mecanismo, para que las seis se comprueben igual.

Criterio de aceptacion: `text-foreground` -> `text-muted` tiene que poner la
suite ROJA.

--------------------------------------------------------------------
Y UNA COSA MAS, que es la leccion de fondo
--------------------------------------------------------------------
Van SEIS dimensiones por tile -icono, etiqueta, color de fondo, destino, tinta
y color de etiqueta- y cada ronda de revision ha destapado una. Cuando termines,
escribe en el informe la lista COMPLETA de decisiones que toma un tile, para que
la proxima spec con elementos repetidos la copie en vez de redescubrirla. Si al
enumerarlas aparece una septima que nadie ha mirado, DILO aunque no la arregles.

REGLAS
  - Commits test-primero, rojo antes que verde, en commits separados.
    Formato: fix(mobile-home-quick-actions): <desc> (R1,R3) / (R4,R5)
  - C4 quinto punto: los rojos son MUTACION DE PRODUCCION versionada en el
    commit rojo y revertida en el verde. Lo has hecho bien en toda la feature.
  - Ninguna cifra de candado puede moverse. Si alguna se mueve, PARA.
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Actualiza specs/mobile-home-quick-actions/traceability.md.
  - Al terminar: `env -u FORCE_COLOR ./init.sh` verde -bug #75-, graphify
    update ., y amplia el informe.
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- **Es tu decision correrlo.** El reviewer aprobo sin esto. Si prefieres cerrar
  #71 ya, lo registro como deuda con id propio.
- Mi recomendacion es correrlo: O7 es el recuento de tiles, que es **el
  criterio central de esta feature** -que los destinos salgan de un filtro y no
  se anadan a ojo-, y hoy se esquiva llamando al tile de otra forma.
- El reviewer vio **una** corrida movil con `1 failed` que su filtro no dejo
  identificar; dos repeticiones identicas y otras cuatro corridas completas
  salieron 1054/1054. Lo trata como flaky ajeno, candidato a **#72**.
