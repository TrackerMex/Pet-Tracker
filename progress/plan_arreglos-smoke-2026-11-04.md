# Plan: arreglos tras el smoke G2 del lote del 2026-11-03 (2026-11-04)

El humano hizo el dev build de Android con `dev` en `3c059343` y recorrió el lote de
`progress/smoke_mejoras-smoke.md`. Todo pasó salvo el paso 3 de #228. Además encontró
dos problemas en fechas y orden. Este plan los convierte en tres features, #239–#241.

## 0. Estado de partida

- `dev` en `3c059343`: el plan del 2026-11-03 (#226–#238) está entero mergeado.
- Resultado del smoke, en palabras del humano, a la pregunta «Del resto del smoke del lote,
  ¿qué pasó?»: «Todo lo demás pasó». #230 iOS no se probó.
- El humano marcó él mismo todas las casillas de `progress/smoke_mejoras-smoke.md` en
  `3fa245a0` (2026-11-04 10:10 -0600), también la de #228. El hallazgo del paso 3 de #228
  (hallazgo 1, abajo) lo arregla #239 y su smoke lo vuelve a recorrer.
- El leader copió esas casillas a las G2 de cada spec. Pasan a `done` #224, #226–#229 y
  #231–#236. #230 sigue `spec_ready` por su G2 iOS.
- Capturas del humano (2026-11-04, 09:38–09:53 hora del teléfono): Recordatorios con una
  fila de Pasados deslizada, y Salud con la lista de Vacunas de dos mascotas.

## 1. Hallazgos y decisiones del humano (2026-11-04)

Texto literal del humano:

> En recordatorios en la lista de PASADOS al aplicar la accion de eliminar sale el boton de
> eliminar pero el color rojo no se oculta, debe de quedar como en la lista de PROXIMOS si
> hace bien el funcionamiento
>
> En salud en el listado de Vacunas los que ya fueron aplicadas como la identificamos que
> son la proxima a aplicarse, siguen en el listado pero supongamos que hoy el es el proximo
> a aplicarse, entonces se debe de quitar de la lista de PROXIMOS y pasar a PASADOS
> Igual note que no estan en orden las vacunas en la lista de PROXIMOS y PASADOS es decir
> hay vacunas que estan para el dia de hoy y toma los de de otra fecha

Diagnóstico del leader contra `dev`, antes de preguntar:

1. **Franja rosa en Pasados.** La fila pasada va al 50 % de opacidad. La franja del panel de
   borrar, de 24 de ancho y detrás del borde derecho de la fila, se transparenta mientras la
   fila está abierta. Es el riesgo que ya nombraba `specs/mobile-reminder-swipe-actions/design.md`
   §Riesgos («Si molesta, la salida es acortar la franja a la esquina (otra feature)»).
2. **«Desorden» en Recordatorios.** El orden es ascendente y correcto, pero la fila pinta la
   fecha sin año (`reminders/index.tsx`, `toLocaleDateString(locale, { day, month })`).
   «Rabia, 4 nov, 09:00 · en 365 días» es el 4 nov de 2027 y parece la de hoy.
3. **Vacunas sin orden ni secciones.** `screens/health/index.tsx` pinta
   `vaccines.data.vaccines` tal como llega del API, ordenado por `appliedAt` descendente
   (`vaccine.drizzle.repository.ts`), sin separar las próximas de las pasadas.

Respuestas del humano (2026-11-04):

| Pregunta | Respuesta literal | Lo que significa |
|---|---|---|
| «En Salud, ¿cómo debe quedar la lista de Vacunas?» | «Próximas y Pasadas» | Dos secciones como en Recordatorios. Arriba «PRÓXIMAS»: las que tienen la próxima dosis después de hoy, de la más cercana a la más lejana. Abajo «PASADAS», colapsada: las que tienen la próxima dosis hoy o antes, o no tienen próxima dosis. El humano aceptó que una vacuna vencida quede en Pasadas. |
| «En Recordatorios, ¿cómo mostramos la fecha para que no parezca desordenada?» | «Año si no es este año» | «4 nov 2027, 09:00 · en 365 días». Las fechas del año en curso no cambian. |
| «¿Quién firma las specs de estos tres arreglos?» | «Firma delegada» | El leader firma #239–#241 con la checklist del §4. PRs a `dev`. |
| «Del resto del smoke del lote, ¿qué pasó?» | «Todo lo demás pasó» | Las casillas del lote las marcó el humano en `3fa245a0`. |

## 2. Features

### 239 `mobile-reminder-swipe-past-row-bleed` (P1, @Backend)

Hallazgo 1. Al deslizar una fila de Pasados, el rosa del panel no debe verse a través de la
fila; tiene que quedar como en Próximos. La fila pasada sigue viéndose atenuada en reposo.
El borrado ya funciona y no cambia. Ficheros previsibles: el `SwipeableRow` de #228 y la fila
de `reminders/index.tsx`. La spec elige entre acortar la franja a la esquina (salida de la
spec de #228) y dar a la fila pasada un fondo opaco con el contenido atenuado. Su paso de
smoke reproduce el paso 3 de #228. Sin dependencia nativa nueva.

### 240 `mobile-reminder-date-year` (P2, @Backend)

Hallazgo 2. La fecha de cada fila de Recordatorios lleva el año cuando no es el año en curso.
Vale para Próximos y Pasados. La cuenta «en N días» y el orden no cambian. Sin copy nuevo:
cambia el formato de `Intl`. La spec decide si el «hasta» de las series (`reminders.untilDay`)
sigue la misma regla y lo dice.

### 241 `mobile-health-vaccines-upcoming-past` (P1, @Backend)

Hallazgo 3, con la respuesta «Próximas y Pasadas»:

- «PRÓXIMAS»: `nextDoseAt` posterior a hoy, en orden ascendente por `nextDoseAt`.
- «PASADAS», colapsada al entrar: `nextDoseAt` hoy o antes, o `null`. Orden descendente por
  la fecha que la manda ahí (`nextDoseAt`; si es `null`, `appliedAt`).
- Cabecera de sección, contador y chevron iguales a los de Recordatorios (#227).
- Las filas no cambian: mismo icono y color de hoy (verde, ámbar o rosa).
- La tarjeta «PRÓXIMA DOSIS» de arriba no cambia (sigue contando hoy).
- El orden se hace en el móvil. El API no cambia.

Copy nuevo: «PRÓXIMAS» y «PASADAS», los literales de la opción que eligió el humano. Si se
necesita una caja de vacío para Próximas, la spec reutiliza un copy existente o lo pregunta
(G1).

## 3. Reparto y paralelismo

| Sesión | Features | Orden |
|---|---|---|
| @Backend (leader) | #239, #240, #241 | specs en paralelo; Codex de una en una entre #239 y #240 (las dos tocan `reminders/`); #241 en paralelo |

- Codex: como mucho 3 a la vez entre las dos sesiones, y se avisa a @Frontend antes de lanzar.
- `./init.sh`: uno a la vez entre sesiones, avisando a la otra antes.
- Quien va detrás en `reminders/index.tsx` mergea `dev` antes del handoff (memoria
  `handoff-tras-merge-de-dependencia`).

## 4. Ciclo por feature

Idéntico a `plan_mejoras-smoke-2026-11-03.md` §4. En el commit de firma va:
`chore(spec): firma delegada #<id> (mandato del humano 2026-10-23, ampliado 2026-11-04)`.

La checklist de firma es la de ese §4, sin cambios.

## 5. Gates humanos

| Gate | Qué | Cuándo | Casilla |
|---|---|---|---|
| G1 | Copy «PRÓXIMAS» y «PASADAS» de #241 y, si la spec lo pide, un artboard | Antes de firmar #241 | este plan, abajo |
| G2 | Smoke en el dev build de Android de #239–#241 | En lote, al final (`progress/smoke_arreglos-smoke.md`) | ese fichero |
| G4 | Enmiendas de `docs/ui-guidelines.md` o `docs/conventions.md` | Con la spec que las pida | `specs/<feature>/requirements.md` |
| G5 | Mergear `dev` → `main` | Cuando el humano dé la app por lista | PR en GitHub |

- [x] G1 de #241, copy: «PRÓXIMAS» y «PASADAS» (fecha: 2026-11-04). El humano eligió la
      opción «Próximas y Pasadas», cuyo texto daba esos dos literales. La marcó el leader con
      la respuesta en la mano.
- ~~[ ] G1 de #241, artboard: solo si la spec se aparta de la cabecera de Recordatorios (#227,
      canvas v167). Si no, no hace falta y esta casilla se tacha.~~ Tachada el 2026-11-04 al
      firmar #241: la cabecera de Pasadas copia la receta de #227 literal por literal (R11), así
      que no hace falta artboard.

Ninguna IA lanza `eas build` ni toca AWS real.

## 6. Fuera de alcance

- Pasar las vacunas vencidas a una sección propia o avisar de ellas: el humano aceptó que
  queden en Pasadas.
- Atenuar las filas de Pasadas en Salud como en Recordatorios.
- Deslizar para borrar en Salud.
- #230 iOS: la casilla sigue abierta en su spec.
