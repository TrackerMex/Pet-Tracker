# Handoff a Codex CLI — #108 `design-drift-hex-guard-rid`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza.
> **No lanzar hasta que el humano haya firmado** `specs/design-drift-hex-guard-rid/requirements.md:386`.

---

```
Feature: design-drift-hex-guard-rid (#108)
Branch: feature/108-design-drift-hex-guard-rid
Worktree: /home/claude/sites/Pet-Tracker-wt-ui  <- trabaja AQUI

Spec aprobada por humano:
  specs/design-drift-hex-guard-rid/requirements.md   (R1-R4)
  specs/design-drift-hex-guard-rid/design.md         (decisiones cerradas + tabla fichero->cambio)
  specs/design-drift-hex-guard-rid/tasks.md          (orden de commits, seguirlo tal cual)
  specs/design-drift-hex-guard-rid/traceability.md   (actualizar tras CADA commit)

Lee las cuatro enteras. No viste la conversacion que las origino.

== EL DEFECTO ==

design-drift.test.ts guarda contra colores hex con /#[\da-f]{3,8}\b/i. Un R-id
de tres cifras casa, porque 0-9 son un subconjunto de los hex: '#106 R2' se
toma por un color de tres digitos. Frontera exacta y verificada: '#98' son dos
caracteres y NO casa; '#100' en adelante SI. Afecta a toda feature de id >= 100.

El regex esta duplicado en OCHO sitios: SEIS con la forma corta (lineas 117,
220, 260, 279, 301, 322) y DOS con la forma larga (197, 343). Las dos largas NO
son iguales entre si: 197 lleva StyleSheet\.create y 343 lleva
StyleSheet(?:\.create)?.

== LA DECISION YA ESTA TOMADA: NO UNIFIQUES LAS DOS LARGAS ==

design.md §2 lo cierra. Se sondeo y hoy unificarlas no romperia nada, pero
seria ampliar cobertura sin requisito detras y pisaria el guard C8 de :63. Lo
que SI se comparte es el atomo roto: la constante HEX_LITERAL pasa de 8
ocurrencias a 1. Cada guard sigue componiendo la forma que le toca.

La exclusion va como LOOKAHEAD NEGATIVA DENTRO del atomo:

    #(?!\d{2,3} R\d)[\da-f]{3,8}\b

NO como alternativa hermana. El \b casa contra el espacio que sigue a '#106',
asi que una exclusion por alternancia dependeria del orden dentro del patron, y
eso es una trampa para el siguiente que lo edite.

Ya esta probada contra los diez casos frontera: '#106 R2', '#100 R1' y
'#108 R12' dejan de disparar; '#98 R1' sigue sin disparar como hoy; '#fff',
'#1DA868', "'#2AB87C'", ':#abc;' y '(#aabbcc)' siguen disparando; y '#106'
SUELTO, sin ' R2' detras, TAMBIEN sigue disparando. Ese ultimo importa: la
exclusion es quirurgica, no un agujero.

== ORDEN DURO: R2 ANTES QUE R3. NO LO INVIERTAS ==

Revertir los literales partidos con el regex viejo todavia puesto pone en rojo
los cinco guards que listan screens/home/index.test.tsx en su featureFiles
(:220, :260, :279, :301, :322), y ese rojo NO es el del candado de R3. Si ves
esos cinco en rojo, es que te saltaste el orden.

(Las cinco listas estan en :207, :253, :272, :294 y :315; cada una alimenta el
guard que va justo debajo.)

== QUE HACER ==

R1  design-drift.test.ts: extraer HEX_LITERAL, ARBITRARY_CLASS y SHADOW_ESCAPES
    mas las formas compuestas; sustituir los ocho regex inline por la forma que
    le toca a cada guard. HEX_LITERAL queda en UNA sola ocurrencia y R1 lo
    canda con un conteo.
R2  anadir la lookahead a HEX_LITERAL.
R3  screens/home/index.test.tsx: DOS lineas, que LOCALIZAS CON grep y NUNCA
    por numero (`grep -n "'#' + '" ...`; #110 las movio 23 lineas arriba al
    mergear, de :3790/:3835 a :3767/:3812, y #112 las movera otra vez),
    vuelven a ser
    literales enteros. Nada mas en ese fichero.
R4  docs/conventions.md: un parrafo al final de la seccion «Prefijo de feature
    cuando un fichero acumula R-ids de dos specs», antes de «### Filtros de
    jest con rutas que llevan parentesis».

Mas los cuatro describes nuevos (#108 R1, R2, R3, R4) con 14 tests en total.

No te extrane que los describes nuevos se llamen '#108 R1': design-drift.test.ts
no se escanea a si mismo (sourceFiles() excluye las carpetas __tests__/ y ese
fichero no aparece en ninguna lista featureFiles), asi que no hay problema de
arranque. Comprobado.

== PROHIBIDO ==

- NO toques el helper sourceFiles() de design-drift.test.ts:25-35. Anadirle un
  filtro apagaria describes preexistentes en silencio: fue el bloqueante H1 que
  hizo rechazar la ronda 1 de #94.
- NO anadas ni quites ficheros de las listas featureFiles.
- NO toques nada mas de screens/home/index.test.tsx que esas dos lineas.
- Cero dependencias nuevas. expo-haptics ~57.0.3 ya esta instalado desde #106;
  no lo vuelvas a declarar.

== COMMITS: C4 VIA (b) ==

No hay comportamiento nuevo de produccion, asi que el rojo lo produce el propio
candado. El rojo de R2 es el test de frontera contra el regex viejo: tiene que
fallar POR LA ASERCION, no por un error de sintaxis ni por un modulo que no
resuelve. Un commit rojo + uno verde por requisito como minimo.

Actualiza traceability.md tras cada commit.

== ENTORNO ==

- bun / bunx para TODO. Nunca npx, nunca npm i -g.
- Rutas de jest con (tabs) entre comillas simples y con --runTestsByPath: sin
  comillas, (tabs) se interpreta como regex y jest SALTA ficheros en silencio
  con exit 0.
- Mide SIN pipe: `cmd > fichero; echo $?`. Un `| tail` devuelve el codigo de tail.
- Borra mobile-pet-tracker/.expo/types/router.d.ts antes de tocar codigo.
- NO lances ./init.sh: #108 no toca backend-pet-tracker/. (Aviso: init.sh emite
  warn, no fail, por RESEND_API_KEY, RESEND_FROM y RESET_LINK_HOST ausentes del
  .env. Lleva asi varias sesiones y no es de esta feature.)

== GATE DE CIERRE ==

MIDE TU LA BASE. No te la doy congelada a proposito: la feature #110, en vuelo
en la sesion paralela, sube la suite movil de 1396 a 1398 y nadie sabe si
mergeara antes o despues que #108. Un numero absoluto aqui caducaria.

Primer paso, ANTES de tocar codigo, sin pipe:

    bunx jest --silent > /tmp/base108.txt 2>&1; echo "EXIT=$?"
    grep -E '^Test Suites:|^Tests:' /tmp/base108.txt
    bunx jest --runTestsByPath 'src/__tests__/design-drift.test.ts' --silent

Anota esos numeros en el reporte como BASE, con el hash de origin/main del
momento. Si la base sale ROJA, PARA y dilo: no arranques sobre una base rota.

El candado es el DELTA, no el absoluto:

  Test Suites   base + 0    <- #108 no crea ningun fichero de test
  Tests         base + 14   <- exactos
  design-drift  41 + 14 = 55 tests en 17 + 4 = 21 describes

Los 14 se reparten R1=2, R2=8, R3=3, R4=1. Si tu reparto sale distinto, la suma
manda: dilo en el reporte en vez de ajustar el total a mano.

Las cifras de design-drift.test.ts (41 y 17) SI son estables: ninguna otra
feature en vuelo toca ese fichero. Si al arrancar no valieran 41 y 17, PARA y
dilo en el reporte.

Para referencia: el 2026-09-22 la base era 77 suites / 1396 tests, o sea que el
cierre habria sido 1410. Si #110 ya mergeo, seran 1398 -> 1412. Ese numero es
CONSECUENCIA, no gate.

Mas: bunx tsc --noEmit limpio, y estas dos comprobaciones de R3:
  grep -rc "'#' + '106" mobile-pet-tracker/src/   -> ningun acierto
  grep -rn '#106 R2' mobile-pet-tracker/src/      -> al menos el describe

Criterios de aceptacion: R1 a R4 de requirements.md.

Al terminar: progress/impl_design-drift-hex-guard-rid.md con que commit cierra
cada R-id, los recuentos antes y despues, y cualquier desviacion de tasks.md.
```
