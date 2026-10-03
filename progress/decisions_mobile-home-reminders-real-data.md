# Decisiones cerradas antes de la spec — #85 `mobile-home-reminders-real-data`

Base: `progress/explore_mobile-home-reminders-real-data.md`. Este fichero cierra
las decisiones abiertas de ese informe para que la spec no las reabra. Las
cuatro primeras las tomó el humano el 2026-09-09; las demás las cierra el leader
por ser técnicas y no de producto.

## Decisiones del humano

- **D-A — lista corta, no una sola fila.** Es lo que pidió al ver el smoke:
  *"deberia mostar los recordatorios que tiene en lista"*. Arrastra la opción
  **(b)** del informe: la Home llama a `listReminders`, que ya existe, y filtra
  en cliente. **Cero backend**, cero contrato congelado tocado.
- **D-C — la vacuna se queda como PRIMERA FILA FIJA**, separada, con los
  recordatorios debajo. No se fusiona en el orden. Esto elimina de raíz los dos
  problemas que el informe señala: comparar un **día civil** (`nextDoseAt`) con
  un **instante** (`dueAt`), y el empate de orden entre orígenes distintos.
  - Consecuencia aceptada por escrito: si el dueño escribió además un
    recordatorio para esa misma vacuna, **se verán las dos filas**. No hay FK
    entre `pet_vaccines` y `reminders`, así que deduplicar sería comparar
    `title` con `name` — adivinar. La spec lo dice explícitamente en vez de
    esconderlo.
- **D-B — solo pendientes y futuros, ordenados por fecha ascendente, tope 3.**
  El endpoint devuelve **todo el historial y lo más viejo primero**, así que sin
  filtro la Home pintaría arriba un recordatorio de hace tres meses. Sin ventana
  temporal: el tope de 3 ya acota la altura, y una ventana añade una regla más
  que candar sin resolver nada que el tope no resuelva.
- **D-G — mapa de iconos `reicon` por tipo de recordatorio.** #70 R13 prohíbe
  emoji en esta sección y la Home debe ser coherente consigo misma. Se acepta el
  coste: un mapa nuevo, y `reminder-meta.ts` queda con dos representaciones
  —emoji para `/reminders`, reicon para la Home—. La spec **nombra el icono
  exacto de cada `ReminderType`** y exige que cruzar dos de ellos ponga la suite
  roja.

## Decisiones del leader

- **D-E — las filas NO son pulsables.** #70 R10 tiene un candado vivo que
  prohíbe un segundo camino a la lista desde la Home, y el enlace de la cabecera
  ya va a `/reminders`. Hacer la fila pulsable duplicaría el destino y rompería
  ese candado. Si más adelante se quiere abrir el **detalle** de un recordatorio
  —destino distinto, no la lista—, es otra feature.
- **D-F — la copy vuelve a los valores previos a D8**: `home.reminders` a
  `Recordatorios` / `Reminders`, y `home.remindersSeeAll` a `Ver todos` /
  `See all`. Es lo que pide el tercer criterio de aceptación de #85. **Las
  claves no se renombran** — nunca se renombraron — así que la longitud del
  catálogo no se mueve por este cambio.
- **D-H — O7 se cierra, y solo para esta sección.** El candado honesto es
  **renderizar en `en` y asertar sobre el árbol**, no leer `catalog.ts`: un test
  que compara el catálogo consigo mismo no prueba que la app pinte ese texto.
  Alcance limitado a los textos de la sección de #85; cerrar toda la Home es
  deuda aparte y no entra aquí.
- **D-I — el día civil se calcula con el reloj del dispositivo**, igual que
  hace Salud, y de forma **idéntica para las dos fuentes**. La spec debe dejar
  escrito que mientras **#82** siga vivo la vacuna llega filtrada con el día
  **UTC del servidor**, así que el día de la dosis la sección puede ser
  incoherente consigo misma. Es un defecto **heredado y declarado**, no
  introducido por #85, y se cierra en #82.
- **D-J — #85 escribe su propia aritmética** en `src/screens/home/format.ts`,
  junto a `calendarDaysUntil`: una variante que acepte un **instante ISO** y lo
  normalice a día civil local antes de restar medianoches. Motivo verificado por
  el explorer: `calendarDaysUntil` **solo acepta `YYYY-MM-DD`** y con el ISO de
  `dueAt` devuelve **`NaN` en silencio**.
  - Candado con **espías de `Date`**, nunca con `process.env.TZ`: bajo Jest esa
    asignación no llega a V8, y eso costó el rechazo del primer pase de #70.
  - La spec **propone** que #84 se unifique contra este helper —es su cuarto
    criterio de aceptación— en vez de dejar tres implementaciones. No lo
    implementa aquí.
- **D-K — #70 R15 se enmienda explícitamente.** Prometía "cero llamadas
  nuevas"; la opción (b) lleva la Home de 3 peticiones al arranque a 4. La spec
  lo dice de frente y justifica el cambio, en vez de ignorar el requisito.

## Lo que la spec no puede olvidar

- **Elemento repetido nuevo**: la fila de recordatorio. Enumerar las **doce
  decisiones** de `docs/ui-guidelines.md` §Enmienda #70 más las nuevas que el
  informe lista en R-F, con recuento por `children.length` —**nunca** contando
  coincidencias de `testID`— y aserciones de **posición** (`children[i]`), que
  es la dimensión que O6 dejó abierta.
- **Todos los deltas de candado global se expresan como sumandos**, jamás como
  cifras absolutas. Un recuento absoluto ha parado la implementación tres veces.
- **El candado de longitud del catálogo** (`language-provider.test.tsx`) se
  declara con su delta exacto. Se olvidó en #68 y en #69 y paró el trabajo las
  dos veces.
