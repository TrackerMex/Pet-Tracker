# Handoff correctivo a Codex CLI — #68, tras veredicto RECHAZADO

> Escrito por el leader el 2026-09-07. El reviewer rechazo la implementacion:
> `progress/review_mobile-home-weekly-activity.md`. Dos candados de zona ciega
> no ven el cambio que existen para ver. **El codigo de produccion es correcto
> y NO hay que tocarlo**: los dos arreglos son solo de test.

---

```
Feature: mobile-home-weekly-activity (#68)
Branch: feature/68-mobile-home-weekly-activity (la misma; sigue tu historial)
Veredicto a corregir: progress/review_mobile-home-weekly-activity.md §Observaciones

CONTEXTO: tu implementacion paso todo el protocolo salvo dos candados. El
reviewer corrio ./init.sh el mismo (exit 0, movil 67/67 suites y 1023/1023
tests), replanto las cinco mutaciones prescritas -mueren todas- y luego probo
VARIANTES triviales y semanticamente identicas de las mutaciones 2 y 3. Esas
variantes dejan la suite entera en verde. Eso es lo que hay que arreglar.

NO TOQUES CODIGO DE PRODUCCION. Los ocho sitios de `day.source` y el parseo por
componentes de `weekdayLabel` son CORRECTOS. Lo que falla son los tests.

--------------------------------------------------------------------
BLOQUEANTE 1 — El candado de R4 prohibe una grafia, no una conducta
--------------------------------------------------------------------
Fichero: src/screens/home/weekly-activity-chart.test.tsx:469-482

Tu hallazgo del runtime es CIERTO y el reviewer lo confirmo midiendolo: dentro
de un worker de jest-expo `process.env` es una copia (isRealProcessEnv: false),
asi que reasignar TZ no ejecuta tzset, la zona sigue en UTC con offset 0, y la
mitad conductual del it -expect(weekdayLabel('2026-09-06','es-MX','short'))
.toBe('dom')- PASA IGUAL con la mutacion 2 plantada. Lo unico que mata la
mutacion hoy es la linea estructural:

  expect(readFileSync(chartSourcePath, 'utf8')).not.toContain('new Date(date)');

Eso prohibe una CADENA LITERAL. El reviewer lo esquivo renombrando el parametro
de `date` a `isoDate` y dejando el mismo bug de parseo UTC: la suite entera se
quedo verde, 67/67 y 1023/1023. Un dia entero de desfase en toda zona de offset
negativo queda sin candado real.

Que hacer: asertar la CONSTRUCCION, no su grafia. Dos vias validas, elige una y
justificala en el informe:
  (a) espiar el constructor: jest.spyOn(global, 'Date') y comprobar que se llama
      con componentes numericos, p.ej. expect(spy).toHaveBeenCalledWith(2026, 8, 6),
      no con la cadena;
  (b) sacar el caso a un proyecto Jest aparte con TZ fijada al arrancar el
      worker, donde la mitad conductual del it si vive de verdad.
La (a) es la mas barata. Si eliges la (b), la mitad conductual debe fallar con
la mutacion plantada, no solo la estructural.

Criterio de aceptacion: con weekdayLabel reescrito como
`new Date(isoDate).toLocaleDateString(...)` -parametro RENOMBRADO, mismo bug-
la suite tiene que ponerse ROJA. Compruebalo plantandolo tu.

--------------------------------------------------------------------
BLOQUEANTE 2 — El discriminante `source` de R5 solo se vigila en 4 de 8 sitios
--------------------------------------------------------------------
Fichero: src/screens/home/weekly-activity-chart.tsx (produccion CORRECTA)
Arreglo: en su fichero de test

El reviewer planto la mutacion 3 -cambiar la rama de hueco a
`metricValue(...) === null`- LINEA A LINEA sobre las ocho decisiones por
`day.source`:

  linea 188 accessibilityLabel del dia .................. ROJA (36 tests)
  linea 283 el valor que se entrega al BarChart ......... VERDE  <-- R5 clausula 1
  linea 287 denominador de la media (measuredValues) .... VERDE
  linea 296 ancla de la linea de media .................. VERDE
  linea 298 estado vacio (hasMeasuredDay) ............... ROJA
  linea 475 valor del tooltip ........................... ROJA
  linea 521 glifo '—' vs valor en la columna ............ ROJA
  linea 551 noDataForDay del panel de detalle ........... VERDE

La linea 283 es justamente la que enuncia la PRIMERA clausula de R5 ("SHALL
pasar al BarChart el valor null"), y §0.1 de la spec dice que la mutacion 3 se
planta "para demostrar que el candado lo ve". Hoy lo ve en un sitio de cinco con
carga semantica.

Por que no lo pilla el it que ya existe: su fixture usa `missing` con
activeMinutes: null y `stored` con 0, asi que ramificar por `=== null` da la
MISMA respuesta. El fixture es el problema, no el assert.

Que hacer: extender el it de `source: 'stored'` + metrica `null` para que
tambien asserte, sobre ESE MISMO dia, (1) lo que llega al BarChart
-latestBarChartProps().data-, (2) la media, y (3) el panel de detalle. Es un
fixture, no un rediseno.

Criterio de aceptacion: planta la mutacion 3 en cada una de las cuatro lineas
283, 287, 296 y 551, UNA POR UNA, y las cuatro tienen que poner la suite roja.
Documenta las cuatro corridas en el informe.

--------------------------------------------------------------------
NO BLOQUEANTE, pero arreglalo ya que estas
--------------------------------------------------------------------
Observacion 4 del reviewer: el boton de mapa de
src/screens/home/index.tsx:377-379 se quedo con
className="min-h-11 w-full rounded-xl" y variant="secondary", SIN clase de
fondo, mientras los otros dos Button secundarios del repo si nombran su token
(add-pet/index.tsx:263 -> bg-accent-soft; profile/index.tsx:358 -> bg-default).
Es la unica pareja de contraste que el reviewer no pudo calcular. Dale el token
que le corresponda siguiendo esos dos precedentes, y di en el informe cual
elegiste y por que.

NO toques las observaciones 3, 5 y 6: la 3 es una decision visual que decide el
humano, y la 5 y la 6 son apuntes para el harness, no para ti.

REGLAS QUE SIGUEN VIGENTES
  - Commits test-primero: cada arreglo deja su rojo antes que su verde.
    Formato: fix(mobile-home-weekly-activity): <desc> (R4) / (R5)
  - Cero ficheros de backend-pet-tracker/ e infra/.
  - Actualiza specs/mobile-home-weekly-activity/traceability.md.
  - Al terminar: ./init.sh en verde (exit 0), graphify update ., y AMPLIA
    progress/impl_mobile-home-weekly-activity.md con una seccion nueva
    "Correcciones tras el veredicto" que incluya las cinco corridas de mutacion
    nuevas (una de R4 y cuatro de R5) con su salida.
  - NO marques done, NO abras PR, NO mergees.
```

---

## Notas para el humano (no van a Codex)

- El reviewer corrio `./init.sh` el mismo: exit 0, móvil 67/67 suites y
  1023/1023 tests. Dejó el árbol restaurado y no tocó código.
- Todo lo demás del protocolo quedó limpio y verificado de forma independiente:
  cero deriva a backend, las cinco mutaciones prescritas mueren, el candado de
  catálogo sigue vivo con la base visible como `260 + 16`, el bloque grep-clean
  de R18 muerde en los 11 ficheros, los deltas de R19 rehechos sin que ninguna
  cifra baje, E1 sin colarse a los otros cuatro enum, chart-kit pinneado exacto
  y solo por `/v2`, las 12 parejas de contraste pasan AA (la más justa 4,70:1),
  y ningún `testID` ni assert murió en la migración de R15.
- **Decisión pendiente tuya** (observación 3): el verde de R19 degradó el botón
  de mapa a `variant="secondary"` para no mover el inventario cerrado de doce
  botones primarios de #62 R1. R19 mandaba parar y reportar; Codex no absorbió
  el número (bien) pero tampoco paró. Es una decisión visual sin firma.
