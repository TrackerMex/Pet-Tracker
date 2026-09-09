# Handoff correctivo a Codex CLI — #70, desbloqueo de D1/D2/D3

> Escrito por el leader el 2026-09-09. Codex paro **antes de escribir una linea
> de codigo** por una contradiccion real de la spec aprobada, y paro bien: no
> invento un placeholder, no adelanto requisitos y no difirio el assert por su
> cuenta.
> **No corras esto hasta que el humano firme la casilla** de
> `specs/mobile-home-reminders-section/requirements.md` §Decisiones de
> implementacion.

---

```
Feature: mobile-home-reminders-section (#70)
Branch: feature/70-mobile-home-reminders-section (la misma; sigue desde 2f5cacf)
Decisiones firmadas: specs/mobile-home-reminders-section/requirements.md §D1, §D2, §D3

CONTEXTO: paraste bien. tasks.md §R1 se contradecia consigo mismo -exigia
cardinalidad 1/1/0 sobre `reminders-section-body.children` (:358) con una
implementacion minima que deja el cuerpo VACIO (:363)-, y los hijos reales no
existen hasta R6, R8 y R9. El humano lo ha resuelto. Continua asi:

--------------------------------------------------------------------
D1 — La asercion de cardinalidad se traslada de R1 a R9
--------------------------------------------------------------------
  - R1 conserva su primer `it`: cabecera, rotulo, receta tipografica y
    `reminders-see-all`. Su implementacion minima sigue siendo la seccion, la
    fila de cabecera y el cuerpo vacio, mas las siete claves de R16.
  - R1 PIERDE el `it('deja el cuerpo con un solo hijo')`.
  - Esa asercion se traslada INTEGRA a R9, que es el ultimo de los tres
    requisitos que introduce un hijo del cuerpo. Alli los tres escenarios ya
    tienen su hijo real.
  - NO se relaja nada: siguen siendo las mismas tres longitudes -1 cargado,
    1 pendiente, 0 error-, se siguen contando sobre `children` del contenedor y
    NUNCA sobre coincidencias de `testID`, y **M5 sigue plantando un elemento
    SIN testID**, ahora contra el candado de R9.

--------------------------------------------------------------------
D2 — Dos premisas corregidas, sin efecto en el alcance
--------------------------------------------------------------------
  - `pet-profile-summary-slots` ya no es un nombre suelto: el leader abrio
    **#83** (`meals-served-tracking`) y **#84**
    (`reminder-dates-days-until-drift`). Las citas de §Fuera de alcance apuntan
    a esos ids. Sigue sin construirse nada de eso aqui.
  - Las lineas de `food.tsx` que la spec cita se desplazaron. El hecho -que la
    comida servida se finge con el reloj local- se sostiene; RE-DERIVA la linea
    en vez de copiarla.

--------------------------------------------------------------------
D3 — M1 tiene que depender de verdad de la zona horaria
--------------------------------------------------------------------
Tu hallazgo: M1 falla TAMBIEN en UTC por `-0` frente a `0`, porque en Jest
`expect(-0).toBe(0)` es rojo. Una mutacion que debia morir SOLO bajo zona
horaria negativa muere siempre, y por una razon ajena a la zona horaria. Eso la
invalida como prueba de zona ciega.

  - Se autoriza que `calendarDaysUntil` normalice el cero: devolver `0` y nunca
    `-0`. La conducta que R5 exige no cambia.
  - Replantea M1 para que su rojo dependa de la zona horaria y no del signo del
    cero. Criterio de aceptacion: con M1 plantada, la suite tiene que quedar
    VERDE en UTC y ROJA bajo `TZ='America/Mexico_City'`. Si no consigues esa
    asimetria, PARA y reportalo: significa que la mutacion no prueba lo que
    dice.

--------------------------------------------------------------------
REGLAS QUE SIGUEN VIGENTES
--------------------------------------------------------------------
  - El resto del orden obligatorio de tasks.md no cambia.
  - Commits test-primero, C4 con su quinto punto: el rojo de un candado sobre
    codigo ya correcto es MUTACION DE PRODUCCION versionada en el rojo y
    revertida en el verde. Mutar un doble no cuenta.
  - NO reutilices `src/utils/reminder-dates.ts:15`: arrastra el `Math.ceil`
    sobre milisegundos que costo el rechazo de #68. Arreglarlo es #84.
  - `nextVaccine` se lee del DETALLE, nunca del listado: `GET /v1/pets` pasa
    null fijo y la seccion mostraria estado vacio siempre sin que ninguna
    fixture lo detecte.
  - Un solo camino a `/reminders` desde la Home.
  - Cero backend, cero infra, cero dependencias.
  - `env -u FORCE_COLOR ./init.sh` siempre (bug #75).
  - Al terminar: gate verde, `graphify update .`, informe en
    progress/impl_mobile-home-reminders-section.md con las ocho mutaciones.
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- **Codex paro antes de escribir una sola linea**, y esa es la lectura correcta
  de la contradiccion: las tres salidas que tenia -placeholder, adelantar
  requisitos o diferir el assert- eran decisiones de spec, no de
  implementacion.
- El fallo es **mio y del `spec_author`**: prescribimos un test que medía un
  sujeto que el propio orden de tareas no creaba hasta tres requisitos despues.
- D3 es el hallazgo mas fino de los tres: una mutacion que muere siempre
  parece un candado sano y no lo es.
