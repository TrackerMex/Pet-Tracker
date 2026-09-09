# Implementación — mobile-home-reminders-real-data (#85)

## Alcance y baseline

- Branch: `feature/85-mobile-home-reminders-real-data`.
- Base de deltas: `20c7b3c`; implementación retomada sobre `df9b398` tras A7.
- `env -u FORCE_COLOR ./init.sh`: exit 0 antes de escribir código.
- Móvil: 68 suites, 1078 tests y 1 snapshot, todo verde.
- Backend: 163 suites/1243 tests; infra: 2/14; e2e: 25 suites/354 tests
  pasados y 3 suites/8 tests omitidos.
- Alcance respetado: cero cambios en backend, infra, hosting, API móvil,
  componentes compartidos, tema o rutas.

## Implementación por R-id

- **R1**: rojo `5ad5bc6`; verde `41e7a99`. La Home observa la copy restaurada
  en español e inglés; los candados de catálogo y usos quedaron 114/114 verdes
  sin cambiar ningún recuento.
- **R2**: rojo `109cdaa`; verde `2fb06c5`. `localDayOf` construye el instante
  crudo, usa getters locales y rellena mes/día a dos dígitos.
- **R3**: rojo `37f7d74`; verde `4788104`. El helper filtra por estado y día
  local inclusivo, ordena por instante/id y corta en tres. Su verificación por
  mutación M3 quedó validada con la evidencia corregida por A8.
- **R4**: rojo `c2d5dfd`; verde `fc7a31d`. La Home monta una única petición de
  recordatorios para la mascota seleccionada y ninguna sin selección. A10
  adapta el doble posicional heredado de tres a cuatro hooks por render. Home
  quedó 90/90 verde; la suite móvil, 68 suites/1089 tests y 1 snapshot verde;
  `bun run typecheck`, exit 0.

## Prueba de mutación

Todas las mutaciones se plantan en código de producción, de una en una.

| Mutación | Cambio y rojo observado | Restauración |
|---|---|---|
| M1 | Commit `97e06c0`: `localDayOf` cambió a `getUTC*`. `bun run test`, con `TZ` ausente, dejó 1 suite/1 test rojo y 67 suites/1082 tests verdes. Cayó exactamente `#85 R2` → `it('toma el día civil de los getters locales, nunca de los UTC')`: esperaba `2026-09-11`, recibió `2026-09-12`. `3d0ab78` completó el doble de padding para eliminar un `TypeError` secundario antes de registrar la evidencia definitiva. | Getters locales restaurados; `format.test.ts` volvió a 9/9 verde. |
| M3 | Se retiró temporalmente el filtro `status === 'scheduled'`. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente `#85 R3` → `it('descarta enviados, cancelados y pasados, y conserva el de hoy')`. La salida fue `[rem-today, rem-next, rem-sent]`; aflora `rem-sent`, mientras `rem-cancelled` queda cuarto y lo recorta el tope de tres. El `it` espera exactamente `[rem-today, rem-next]`. | Filtro de estado restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |
| M4 | Se retiró temporalmente el filtro `calendarDaysUntil(localDayOf(dueAt), now) >= 0`. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente el mismo `it` de R3 que M3, pero con salida `[rem-past, rem-today, rem-next]`. Entró `rem-past`, un motivo e id distintos de M3. | Filtro de futuro restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |
| M5 | El corte inclusivo cambió temporalmente de `>= 0` a `> 0`. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente el `it` de R3 prescrito y la salida perdió `rem-today`, conservando solo `[rem-next]`. | Corte inclusivo restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |
| M6 | Se retiró temporalmente `a.id.localeCompare(b.id)` del comparador. `format.test.ts` dejó 1 fallo/12 verdes: cayó exactamente `it('desempata por id ascendente')`; el sort estable conservó la fixture invertida como `[rem-z, rem-a]` en vez de `[rem-a, rem-z]`. Con la condición contraria —fixture entregada ya como `[rem-a, rem-z]`— la mutación habría quedado verde. | Desempate por id restaurado sin commit; `format.test.ts` volvió a 13/13 verde. |

## A8 — corrección de la evidencia prescrita para M3

La fixture normativa (`requirements.md:256-260`) contiene dos elegibles antes
de los estados descartados: `rem-today` y `rem-next`. Al retirar el filtro de
estado, ordenar y aplicar el tope obligatorio de tres, la salida es
`rem-today`, `rem-next`, `rem-sent`; `rem-cancelled` queda cuarto y se recorta.
La corrida dejó 1 fallo/12 verdes por `rem-sent`. A8 confirma esta medición,
mantiene intactos la fixture y el candado, y corrige únicamente la evidencia
esperada. M3 se restauró sin commit y la suite dirigida volvió a 13/13 verde.

## A9 — corrección del orden de M7 y M8

`tasks.md:95-96` ordena plantar M3..M8 durante R3 y comprobar que cada mutación
cae por todos los `it` que R15 nombra. Sin embargo, R15/M7 y R15/M8 exigen
también los `it` de Home `las ordena por fecha ascendente bajo la fila de la
vacuna` y `corta en tres aunque haya cinco`; `requirements.md:404-421` y el
propio orden normativo los crean recién en R5. En este punto solo existen los
candados de `format.test.ts`.

A9 resuelve la incompatibilidad sin retirar candados: R3 verifica M3..M6 y R5
verificará M7/M8 una sola vez, cuando también existan sus dos `it` de Home.
Tras la firma se plantaron M5 y M6, ambas cayeron por el `it` prescrito, se
restauraron y la suite dirigida quedó 13/13 verde.

## A10 — adaptación del doble posicional de R4

La implementación mínima exacta de R4 —`listReminders`, `remindersFn` y un
cuarto `useApi(remindersFn)`— puso verdes los dos candados nuevos y la
adaptación de #70, pero dejó la suite de Home en 1 fallo/89 verdes. Cayó el
test heredado `R10: preserva la mascota durante el refetch` con
`TypeError: Cannot read properties of undefined (reading 'nextVaccine')`.

Ese test sustituye `useApi` con un contador posicional `hookCall++ % 3`; tres
llamadas por render mantienen el ciclo alineado, pero la cuarta exigida por R4
desplaza qué estado recibe cada hook en renders posteriores. El mock por
defecto de `listReminders` prescrito por A6 no interviene porque el test
sustituye el hook entero.

A10 autoriza únicamente cambiar `% 3` por `% 4`, conservando la intención y
las dos aserciones del test. Con esa adaptación y la implementación mínima de
R4, `index.test.tsx` quedó 90/90 verde y la suite móvil completa 1089/1089.
La deuda de reemplazar el doble posicional por uno indexado por función queda
registrada en #86 y fuera de #85.
