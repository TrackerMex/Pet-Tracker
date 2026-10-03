# Handoff a Codex CLI — #69, los pares icono/etiqueta sin candado

> Escrito por el leader el 2026-09-08. El reviewer **aprobo** #69. Estas dos
> observaciones no bloquean, pero son un hueco real: R1 decide **tres** cosas
> por celda -icono, etiqueta y valor- y solo el valor esta bajo candado.
> **Es un arreglo solo de test**: la implementacion es correcta y no se toca.

---

```
Feature: mobile-home-stats-strip (#69)
Branch: feature/69-mobile-home-stats-strip (la misma; sigue tu historial)
Origen: progress/review_mobile-home-stats-strip.md, observaciones 1 y 2

CONTEXTO: las cuatro mutaciones de R15b cruzan el VALOR de cada celda y las
cuatro mueren. Pero el reviewer probo las otras dos cosas que R1 decide por
celda y ninguna esta vigilada:

  - intercambiar los iconos `Weight` (src/screens/home/index.tsx:236) y `Moon`
    (:266) deja la suite en VERDE, 194/194;
  - intercambiar las etiquetas `t('home.weight')` (:249) y `t('home.distance')`
    (:288) deja la suite en VERDE.

La segunda es la que duele: la app podria pintar `12.4 kg` debajo de la
etiqueta "Distancia" y ningun test se enteraria. Son la quinta y la sexta
posicion del mismo discriminante que R3 ya vigila en cuatro.

QUE HACER, y solo esto:

1. Extender el `it` de R3 -el de 'asigna cada valor a su celda'- para que, sobre
   el MISMO fixture de cuatro valores distintos, asserte tambien por celda:
     (a) que cada celda lleva SU icono, y
     (b) que cada celda lleva SU etiqueta.
   Que sea el mismo `it` o uno hermano en el mismo `describe` lo decides tu;
   lo que no vale es un test que compruebe "hay cuatro iconos" sin atarlos a su
   celda, porque eso es exactamente lo que hoy pasa en verde con el intercambio.

2. Criterio de aceptacion, y verificalo plantandolo tu: con `Weight` y `Moon`
   intercambiados la suite tiene que ponerse ROJA; con `t('home.weight')` y
   `t('home.distance')` intercambiadas, tambien. Las cuatro mutaciones de valor
   de R15b tienen que seguir rojas.

3. Documenta las dos corridas nuevas en el informe, junto a la tabla de R15b.

REGLAS
  - Commits test-primero: rojo antes que verde, en commits separados.
    Formato: fix(mobile-home-stats-strip): <desc> (R1,R3)
  - NO toques produccion. Si al escribir el test descubres que la
    implementacion esta mal, PARA y reportalo.
  - Ninguna cifra de ningun candado puede moverse. Si alguna se mueve, PARA.
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Actualiza specs/mobile-home-stats-strip/traceability.md.
  - Al terminar: `env -u FORCE_COLOR ./init.sh` en verde -SIN esa variable
    aborta en falso, bug #75, no es tuyo-, graphify update ., y amplia
    progress/impl_mobile-home-stats-strip.md.
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- **Es tu decision correrlo o no.** El reviewer aprobo sin esto; si prefieres
  cerrar #69 ya, lo registro como deuda con id propio y se arregla despues.
  Mi recomendacion es correrlo ahora: son minutos, la implementacion no se
  toca, y una etiqueta que miente sobre el numero que tiene encima es
  exactamente el tipo de defecto que este repo persigue con candados.
- Dos apuntes del reviewer que **no** son de arreglar aqui: R12 se cumple en su
  test pero TalkBack para ocho veces y no cuatro -valor y etiqueta por
  separado-, identico a la tira de 3 celdas anterior, asi que no es regresion; y
  los divisores dan 1,16:1 en claro y 1,25:1 en oscuro, que es el punto fragil
  del smoke. El resto del contraste pasa AA holgado.
