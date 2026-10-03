# Handoff correctivo a Codex CLI — #71, tras veredicto RECHAZADO

> Escrito por el leader el 2026-09-08. El reviewer rechazo por **un** motivo:
> `progress/review_mobile-home-quick-actions.md`. La produccion es correcta y
> `./init.sh` quedo verde a la primera. Lo que falta es un candado.
> Van con el tres apuntes menores que conviene cerrar de paso.

---

```
Feature: mobile-home-quick-actions (#71)
Branch: feature/71-mobile-home-quick-actions (la misma; sigue tu historial)
Veredicto: progress/review_mobile-home-quick-actions.md §Observaciones

--------------------------------------------------------------------
BLOQUEANTE — la asercion de "exactamente tres tiles" no existe
--------------------------------------------------------------------
Fichero: mobile-pet-tracker/src/screens/home/index.test.tsx:1528 y :1593

El test usa una LISTA BLANCA -`/^quick-action-(?:weight|reminder|documents)$/`-
y en :1593 cuenta los tiles sobre el FUENTE en vez de sobre el arbol
renderizado. Consecuencia: la asercion que R1 y R3 prescriben, "exactamente tres
hijos en la fila de tiles", nunca se escribio. El reviewer lo probo anadiendo un
CUARTO tile inline apuntando a /pairing y la suite movil ENTERA se quedo verde:
68/68 suites y 1054/1054 tests. O sea que el criterio central de esta feature
-que los destinos salen de un filtro y no se anaden a ojo- no esta vigilado.

Arreglo ya verificado por el reviewer: cambiar la lista blanca de :1528 por
`/^quick-action-/`.

Criterio de aceptacion, y compruebalo plantandolo tu: con un cuarto tile inline
apuntando a /pairing la suite tiene que ponerse ROJA. Y las siete mutaciones de
R15b tienen que seguir rojas despues del cambio.

--------------------------------------------------------------------
NO BLOQUEANTES, arreglalos ya que estas
--------------------------------------------------------------------
O2 — Quinta dimension sin vigilar. `src/screens/home/index.tsx:422` usa
`quickActionInks[index]`; sustituirlo por `[0]` deja la suite 68/68 verde. Es la
quinta decision por tile -la tinta- ademas de icono, etiqueta, color y destino.
El cruce que hoy permite sigue pasando AA (4,76-4,88), por eso no bloquea, pero
el candado debe verla: extiende el test de R4 para que la tinta se compruebe
por tile como las otras cuatro, y planta la mutacion para demostrarlo.

O3 — Un `as Href` no declarado. `src/screens/home/index.tsx:420` mete un tercer
`as Href` que cubre `/weight-log`, cuando R2 dice que esa ruta debe seguir SIN
cast. Lo fuerza D3 y no esta declarado en tu informe. Dos cosas: si el cast es
inevitable, DECLARALO en el informe con la razon; si no lo es, quitalo. Y de
paso, R2 afirma que `as Href` se usa "en dos sitios" del repo y en `src/` hay
SIETE: corrige ese dato en el informe, no en la spec.

O5 — Tu tabla de mutaciones dice "exactamente 2 fallos" en la mutacion 5 y
salen TRES: se suma el cruce de `readdirSync`. El rojo es mas fuerte de lo que
declaraste, pero la tabla esta mal. Corrigela.

--------------------------------------------------------------------
REGLAS
--------------------------------------------------------------------
  - Commits test-primero: rojo antes que verde, en commits separados.
    Formato: fix(mobile-home-quick-actions): <desc> (R1,R3)
  - C4, quinto punto: si un candado se anade sobre codigo YA CORRECTO, el rojo
    legitimo es la MUTACION DE PRODUCCION versionada en el commit rojo y
    revertida en el verde. Mutar un doble no cuenta. Lo hiciste bien en toda la
    feature; mantenlo aqui.
  - NO toques produccion salvo para el `as Href` de O3, si decides quitarlo.
  - Ninguna cifra de ningun candado puede moverse. Si alguna se mueve, PARA.
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Actualiza specs/mobile-home-quick-actions/traceability.md.
  - Al terminar: `env -u FORCE_COLOR ./init.sh` en verde -sin esa variable
    aborta en falso, bug #75-, graphify update ., y amplia
    progress/impl_mobile-home-quick-actions.md con una seccion
    "Correcciones tras el veredicto".
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- El reviewer confirmo lo que mas me interesaba: las **siete mutaciones son de
  produccion**, y el patron se extendio a los rojos de R2-R13 y no solo a R15b.
  El punto nuevo de C4 nacio vivo en su primera feature.
- Tambien verifico rompiendolos que `#64 R9` y el candado de longitud de
  catalogo siguen pudiendo fallar, y que la base quedo visible como suma:
  `260 + 16 + 1 + 4`.
- **Los commits ajenos son dos, no uno** (O4): `997c080` de una linea y
  `71a4db7` de 228 -un runbook de demo de 227 lineas mas una fila en
  `AGENTS.md`-. Los dos son de otra sesion de Claude y **solo existen en esta
  branch**, no en `main`. Decision tuya, ver abajo.
