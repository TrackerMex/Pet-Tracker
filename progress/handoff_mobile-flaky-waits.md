# Handoff a Codex CLI — #111 `mobile-flaky-waits`

> Pegar el bloque de abajo en la terminal de Codex CLI. El humano lo lanza.
> Spec **ya firmada** (via Notion, commit `a04e893e`).

---

```
Feature: mobile-flaky-waits (#111)
Branch: feature/111-mobile-flaky-waits
Worktree: /home/claude/sites/Pet-Tracker-wt-ui  <- trabaja AQUI

Spec aprobada por el humano el 2026-09-22 (commit de firma a04e893e):
  specs/mobile-flaky-waits/requirements.md   (status: approved, R1-R6)
  specs/mobile-flaky-waits/design.md         (D1-D3, Protocolo M, Protocolo V)
  specs/mobile-flaky-waits/tasks.md          (orden de commits, seguirlo tal cual)
  specs/mobile-flaky-waits/traceability.md   (actualizar tras CADA commit)

Lee las cuatro ENTERAS antes de tocar nada. Son largas a proposito: el
inventario sitio a sitio esta en design.md §D2 y §D3, y te ahorra
re-investigar. No viste la conversacion que las origino.

== NO CARGUES NINGUNA SKILL DE EXPO ==

Tu plugin `expo` es la v1.0.2 y tiene 13 skills; NINGUNA cubre esperas de
jest en tests de React Native. Las que podrias buscar por nombre
—expo-overview, expo-animation, expo-router— NO EXISTEN en tu catalogo, y
pedir una que no existe no da error: da silencio, y cargas otra cosa sin que
nadie se entere. Verificado en tu propio catalogo. No cargues ninguna: todo
lo que necesitas esta en la spec.

== QUE ES ==

Refactor de ESPERAS en dos ficheros de test. CERO cambio de produccion.
Siete sitios donde la espera termina en una observacion mas debil que la que
se asevera despues, contra docs/conventions.md §Esperas sobre el arbol
renderizado. No es "arreglar una suite rota": la ventana roja que lo destapo
NO es reproducible y la spec no promete eliminarla.

== LO QUE TIENES PROHIBIDO TOCAR ==

1. CUALQUIER fichero de produccion. Los unicos modificables son:
     mobile-pet-tracker/src/screens/health/index.test.tsx
     mobile-pet-tracker/src/screens/map/index.test.tsx
     specs/mobile-flaky-waits/*, progress/*, feature_list.json, STATUS.md
   Si aparece la necesidad de editar otro, PARA y anotalo en
   progress/impl_mobile-flaky-waits.md como decision abierta. No lo edites.

2. El test `selects the first pet and loads its first position (#72 R2)` de
   map/index.test.tsx (:284-299) se queda BYTE A BYTE COMO ESTA. Es R3, un
   requisito de NO-EDICION. Parece que incumple la regla y NO la incumple:
   no tiene aserciones posteriores, y ningun nodo del arbol distingue el
   estado final del inicial en ese escenario. Ya lo decidio y lo firmo la
   feature #72 el 2026-09-17 (su sitio S6). Si lo "arreglas", rompes R3.

3. mobile-pet-tracker/package.json NO se toca (R4). Nada de testTimeout,
   nada de maxWorkers, nada de asyncUtilTimeout. La spec explica por que con
   los numeros delante: el plazo que vencio fue el de RNTL (1000 ms), no el
   de jest (5000 ms), asi que subir testTimeout habria sido inerte. Subir
   asyncUtilTimeout esta ademas prohibido por el §Fuera de alcance de #72.

4. NO anadas ni quites ningun `it`. Si crees que tu diseno lo necesita, PARA:
   es una enmienda a la spec y vuelve al gate humano.

== QUE HACER ==

R1  health/index.test.tsx, `it` en :457 (`shows the current weight and opens
    the weight log`). La espera de :465 termina en `weight-card`, que es el
    CONTENEDOR y se pinta solo con selectedPetId; la asercion de :467 mira
    `weight-current`, que existe solo con la query `weights` resuelta. Dos
    queries independientes. Que la espera termine en la aparicion del texto
    de `weight-current`.
R2  Los seis sitios S2..S7 de la tabla de requirements.md §R2, uno por uno,
    cada uno con su forma ya decidida. No improvises: la columna "Decision"
    dice exactamente que hacer en cada uno.
R3  No-edicion (arriba).
R4  No-edicion (arriba).
R5  Cero produccion (arriba).
R6  Recuento y cinco corridas (abajo).

== C4: R1 VA POR LA VIA (a), NO POR LA (b) ==

Esto es lo que mas se suele hacer mal, asi que leelo dos veces.

R1 tiene ROJO REAL. El commit rojo mete SOLO la viga de 200 ms sobre el
cuerpo del test INTACTO —sin tocar la espera— y tiene que fallar SIEMPRE en
:467 con exactamente:

    Unable to find an element with testID: weight-current

Esa es la firma literal de los logs progress/logs-111/pre1.txt y pre2.txt.
El commit verde mete la correccion de la espera. **La viga de R1 SE QUEDA en
el arbol final**: es lo que convierte un flake que nadie supo reproducir en
un rojo determinista al 100 %.

R2 va por la via (b), con vigas TRANSITORIAS: una por sitio, se pone, se mide
el par (test viejo falla / test nuevo pasa), y SE QUITA. El commit que cierra
R2 deja los dos ficheros SIN NINGUNA viga salvo la de R1. El reviewer lo
comprueba asi:

    git diff origin/main..HEAD -- 'mobile-pet-tracker/src/screens/map/index.test.tsx' | grep -c setTimeout

y tiene que dar 0.

Para S4 y para la asercion debil de S6, registra ademas la PRUEBA DE ZONA
CIEGA: con la viga puesta, el test ACTUAL pasa (por el motivo equivocado) y
el CORREGIDO falla. Es justo el hueco que la correccion cierra, y sin ese par
no has demostrado nada.

La forma exacta de la viga, el porque de los 200 ms y la advertencia sobre
los beforeEach estan en design.md §Protocolo M. Los 200 ms salen de
DEFAULT_INTERVAL = 50 ms y asyncUtilTimeout = 1000 ms, con 50 < 200 < 1000.
Si un sitio no diera rojo con 200 ms, AMPLIA la ventana y anota el valor.
NUNCA relajes la asercion.

Aviso de design.md ya verificado: ninguno de los describes afectados usa fake
timers. Las unicas llamadas a useFakeTimers de map/index.test.tsx estan en
:706 y :1452, en los dos describes de polling, que no son tuyos.

== REGLA DURA QUE ATRAVIESA TODO ==

Ninguna correccion puede aseverar MENOS de lo que asevera hoy. Un test que
espera mejor y asevera menos no es un arreglo: es un candado debilitado. En
los siete sitios el conjunto final de aserciones es EL MISMO conjunto; solo
cambia donde se evalua.

== ENTORNO ==

- bun / bunx para TODO. Nunca npx, nunca npm i -g.
- Rutas de jest entre comillas simples y con --runTestsByPath.
- Mide SIN pipe: `cmd > fichero; echo $?`. Un `| tail` devuelve el codigo de
  tail, no el del comando.
- Borra mobile-pet-tracker/.expo/types/router.d.ts antes de tocar codigo.
- NO lances ./init.sh: #111 no toca backend-pet-tracker/ ni infra/. (Su warn
  por RESEND_API_KEY, RESEND_FROM y RESET_LINK_HOST no es de esta feature.)
- Cero dependencias nuevas. Las vigas usan setTimeout del runtime.

== GATE DE CIERRE (R6) ==

Base medida en este arbol, sin pipe, exit 0, y confirmada en DOCE corridas:
  Test Suites: 77 passed   Tests: 1396 passed
  src/screens/health/index.test.tsx 28   src/screens/map/index.test.tsx 58

Despues tiene que salir EXACTAMENTE lo mismo: esta feature no anade ni quita
tests. Comprueba las tres cosas:
  1. delta CERO contra la base de la rama;
  2. las cifras absolutas de arriba;
  3. consistencia interna: `bunx jest --listTests` devuelve S rutas y la
     linea `Test Suites: ... N total` cumple N == S. Esto detecta ficheros
     saltados en silencio.

Y CINCO corridas consecutivas de la suite completa en verde, sin pipe. La
spec dice explicitamente que eso NO prueba ausencia de flake: es el control
contra regresiones que esta misma feature pudiera introducir. Comandos y
criterio en design.md §Protocolo V.

Mas los tres git diff de verificacion: el de R3 (sin lineas modificadas entre
:284 y :299), el de R4 (package.json vacio) y el de R5
(`git diff --name-only origin/main..HEAD -- mobile-pet-tracker/ ':!*.test.tsx'`
vacio).

Criterios de aceptacion: R1 a R6 de requirements.md.

Al terminar: escribe progress/impl_mobile-flaky-waits.md con que commit cierra
cada R-id, la evidencia del §Protocolo M sitio a sitio (incluidas las dos
pruebas de zona ciega), la del §Protocolo V, los recuentos antes y despues, y
cualquier desviacion de tasks.md.
```
