# Handoff a Codex CLI — #102 `mobile-routes-to-screens`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza;
> el leader no lo ejecuta.

---

```
Feature: mobile-routes-to-screens (#102)
Branch: feature/102-mobile-routes-to-screens
Worktree: /home/claude/sites/Pet-Tracker-wt-ui  <- trabaja AQUI, no en /home/claude/sites/Pet-Tracker

Spec aprobada por humano el 2026-09-21 (commit 7098f985):
  specs/mobile-routes-to-screens/requirements.md   (status: approved, R1-R9)
  specs/mobile-routes-to-screens/design.md         (D1-D14 + tabla fichero->cambio->R-id)
  specs/mobile-routes-to-screens/tasks.md          (orden de commits, seguirlo tal cual)
  specs/mobile-routes-to-screens/traceability.md   (actualizar tras CADA commit)

Lee las cuatro enteras antes de tocar nada. No viste la conversacion que las
origino: toda decision abierta ya esta cerrada por escrito ahi.

== QUE ES ==

Refactor puro. Mueves el cuerpo de CUATRO rutas al patron vigente desde #39
(route delgado + src/screens/<nombre>/index.tsx) y mueves sus tests junto al
cuerpo. CERO cambio de comportamiento. CERO cambio de asercion. La suite
existente es el candado.

Las cuatro: map (406 lineas), weight-log (341), meal-schedule (324),
health (279).

== LO QUE NO PUEDES TOCAR, Y ES LO MAS IMPORTANTE DE ESTE HANDOFF ==

1. src/app/(tabs)/food.tsx y src/app/(tabs)/__tests__/food.test.tsx estan
   PROHIBIDOS. Otra sesion los esta editando ahora mismo (features #106 y
   #107). Si los abres, rompes la regla de un solo escritor sobre el working
   tree. La spec §0.2 lo declara y el criterio de aceptacion 4 de la entrada
   #102 lo autoriza.

2. NO modifiques el helper sourceFiles() de
   src/__tests__/design-drift.test.ts:25-35. Anadirle un filtro de
   *.test.tsx apagaria en silencio 14 describes preexistentes. Eso fue el
   hallazgo bloqueante H1 que hizo rechazar la ronda 1 de #94 hace dos dias.
   Si crees que hace falta tocarlo, PARA y escribelo en el reporte en vez de
   hacerlo.

3. NO anadas tests. Ni de delegacion del route delgado, ni de nada. El
   recuento tiene que quedar EXACTAMENTE igual (D9, D10 de design.md).

== DOS TRAMPAS YA MEDIDAS, NO LAS REDESCUBRAS ==

- El ternario de design-drift.test.ts:84-86 SE INVIERTE, no se colapsa. Su
  it.each lista siete pantallas y food SIGUE en app/(tabs)/. Colapsar a la
  rama screens/ haria leer src/screens/food/index.tsx -> ENOENT -> rojo.
  Queda: screen === 'food' ? app/(tabs) : screens/. Es R6.

- design-drift.test.ts:25-35 excluye la carpeta __tests__/ pero NO los
  *.test.tsx colocados (consistency-classnames y legibility-classnames si
  excluyen ambos). Al sacar los cuatro tests de __tests__/ entran por primera
  vez en el escaneo de C8/R3/R4. Ya esta medido: los cuatro dan cero
  coincidencias de los tres patrones, asi que queda verde. Es R7:
  compruebalo, no lo asumas.

== FICHEROS ==

Se mueven (usa `git mv`, el diff tiene que salir como rename):
  src/app/(tabs)/map.tsx            -> src/screens/map/index.tsx
  src/app/(tabs)/health.tsx         -> src/screens/health/index.tsx
  src/app/(tabs)/weight-log.tsx     -> src/screens/weight-log/index.tsx
  src/app/(tabs)/meal-schedule.tsx  -> src/screens/meal-schedule/index.tsx
  src/app/(tabs)/__tests__/<x>.test.tsx -> src/screens/<x>/index.test.tsx  (los cuatro)

Se reescriben con el route delgado (5 lineas, calcado de
src/app/(tabs)/home.tsx y alerts.tsx):
  src/app/(tabs)/{map,health,weight-log,meal-schedule}.tsx

Candados con rutas a fichero hardcodeadas que hay que repuntar:
  src/__tests__/ui-copy-table.ts                 68 filas nuestras (map 17, health 13, weight-log 19, meal-schedule 19); las 19 de food NO
  src/__tests__/consistency-classnames.test.ts   :110, :174, :275-279, :341, :351-352  (:168 y :398 son de food: NO)
  src/__tests__/legibility-classnames.test.ts    :92, :124, :126, :155                 (:91 y :125 son de food: NO)
  src/__tests__/design-drift.test.ts             el ternario :84-86, el inventario screenSignOutCalls :429-435 (4 claves), y el inventario R10 de #94 :526-528 ('app/(tabs)/map.tsx')

  src/__tests__/ui-language.test.ts NO SE TOCA. Cero ocurrencias de (tabs);
  sus toHaveLength miden longitudes de bloque, no rutas. Verificado.

Y fuera de mobile-pet-tracker/:
  docs/conventions.md  lineas 445-446 -> excepcion A10 (R1, texto literal en requirements.md)

== DATOS VERIFICADOS QUE ABARATAN EL TRABAJO ==

- Los CUERPOS de pantalla no cambian ni un import. src/app/(tabs)/x.tsx y
  src/screens/x/index.tsx estan ambos a profundidad 3: los '../../api/...',
  '../../components/...' y '../../providers/...' quedan identicos. Incluso la
  asercion design-drift.test.ts:93 ("from '../../components/card'") sobrevive
  intacta para las dos formas.
- Los TESTS si bajan un nivel: '../../../api/...' -> '../../api/...'.
- Cambio en el cuerpo: UNA linea. `export default function MapScreen()` pasa a
  `export function MapScreen()`. El test importa `{ MapScreen } from '.'`
  (forma mayoritaria: 6 de 7 screens ya migradas). Sin barril index.ts: no
  existe ninguno en src/screens/ y la resolucion a index.tsx ya funciona.

== COMMITS: C4 POR LA VIA (b) ==

No hay comportamiento nuevo que poner rojo, asi que el rojo lo produce el
propio candado. Un commit rojo + uno verde POR RUTA = 8 commits de codigo,
mas los de R1, R6, R7 y R9 segun tasks.md.

El commit ROJO mueve el fichero y deja los candados apuntando a la ruta
vieja: tiene que fallar POR LA ASERCION DEL CANDADO, no por ReferenceError ni
por un mock mutado. El VERDE repunta los candados. Ese orden es el requisito,
no un detalle de estilo: en #19 metiste implementacion + tests + docs en un
solo commit sin historial rojo->verde y incumplio C4.

Actualiza specs/mobile-routes-to-screens/traceability.md tras cada commit.

== ENTORNO: REGLAS DURAS ==

- bun / bunx para TODO en movil. Nunca npx, nunca npm i -g.
- Rutas de jest con (tabs) SIEMPRE entre comillas simples y con
  --runTestsByPath. Sin comillas, (tabs) se interpreta como regex y jest
  SALTA los ficheros en silencio devolviendo exit 0:
      bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/map.test.tsx'
- Mide SIN pipe. `cmd > fichero; echo $?`. Un `| tail` devuelve el codigo de
  tail, no el del comando.
- Borra mobile-pet-tracker/.expo/types/router.d.ts ANTES de tocar codigo.
  Esta gitignorado y rompe el typecheck con rutas fantasma. Critico aqui
  porque se mueven ficheros de ruta: vuelve a borrarlo tras los movimientos.
- Cero dependencias nuevas.
- NO lances ./init.sh. #102 no toca backend-pet-tracker/ y los puertos de
  Postgres y LocalStack son de la sesion vecina.
- Carga las skills del plugin expo que indica docs/ui-guidelines.md
  (expo-overview primero, y expo-project-structure para el patron de rutas).

== GATE DE CIERRE ==

Baseline medido en 3a52028b, sin pipe, exit 0:
  Test Suites: 77 passed   Tests: 1386 passed
Por suite tocada: map 58, health 28, weight-log 32, meal-schedule 23,
design-drift 41, consistency-classnames 57, legibility-classnames 26,
ui-language 25, ui-copy-table 2, screens 2.

Un refactor puro no mueve NINGUNO de esos numeros. Si alguno cambia, algo se
rompio o se anadio: PARA y dilo en el reporte.

Tambien: bunx tsc --noEmit limpio.

Criterios de aceptacion: R1 a R9 de requirements.md.

Al terminar: escribe el resultado en
progress/impl_mobile-routes-to-screens.md — que commit cierra cada R-id, los
recuentos por suite antes y despues, que observaste en R7, y cualquier cosa
que te hiciera desviarte de tasks.md.
```
