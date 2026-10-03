# Handoff a Codex CLI — #111 ronda 2 (rebote por B1 y B2)

> Pegar el bloque de abajo. **No lanzar hasta que el humano firme la enmienda E1**
> en `specs/mobile-flaky-waits/requirements.md` §Enmienda E1.

---

```
Feature: mobile-flaky-waits (#111), RONDA 2
Branch: feature/111-mobile-flaky-waits
Worktree: /home/claude/sites/Pet-Tracker-wt-ui  <- trabaja AQUI

El reviewer RECHAZO la ronda 1 con dos bloqueantes. Veredicto completo en
progress/review_mobile-flaky-waits.md. Leelo, y lee la ENMIENDA E1 nueva en
specs/mobile-flaky-waits/requirements.md, que el humano ya firmo.

Tu trabajo de la ronda 1 se conserva entero salvo UNA linea. No rehagas nada.

== B1 — NO ES CULPA TUYA, Y NO TIENES QUE HACER NADA DE CODIGO ==

El reviewer no pudo cerrar la via (b) de C4 para S2 porque NO EXISTE par
rojo/verde para S2 y no es obtenible: lo midio con la viga prescrita y tambien
con una de 200 ms sobre mockListPets, y el test viejo pasa igual (exit 0).

La causa es un error de la spec, no tuyo. S2 cae en la tercera categoria de
§F4 —aserciones causalmente implicadas por el estado esperado— que la propia
spec declara NO defecto: src/screens/health/index.tsx:55 y :61 declaran las
queries vaccines y weights con `enabled: selectedPetId !== null`, y el waitFor
de :256 espera justo a ese mismo selectedPetId via el chip. Las tres llamadas
son consecuencia del render esperado.

La enmienda E1 lo resuelve: S2 deja de ser un sitio de §R2, tu cambio
(commit bcd8ba8a) SE CONSERVA como endurecimiento defensivo, y su via de C4
pasa a ser el argumento de invariancia sin mutacion, con el precedente de #72
§S6. NO revientas nada y NO tienes que producir ningun rojo para S2.

Lo unico que te toca de B1: en progress/impl_mobile-flaky-waits.md, sustituir
lo que dijeras sobre la evidencia de S2 por el argumento de invariancia y la
medicion del reviewer, citando E1.

== B2 — ESTO SI ES UN FALLO Y ES UNA LINEA ==

En el commit 9051eb77, mobile-pet-tracker/src/screens/map/index.test.tsx,
sitio S4 (`it` del describe `R7: ruta del dia como polylines` que prueba el
dia sin viajes), hiciste esto:

    -    await waitFor(() => expect(screen.getByTestId('map-view')).toBeVisible());
    +    await waitFor(() =>
    +      expect(screen.getByTestId('stat-distance')).toHaveTextContent('0.0 km'),
    +    );
         expect(screen.getByTestId('map-view').props.polylines).toEqual([]);

El ancla positiva nueva es CORRECTA y se queda. El problema es que
`expect(screen.getByTestId('map-view')).toBeVisible()` fue ELIMINADA, no
movida. Eso incumple la regla dura de §R2:

    "Ninguna correccion puede aseverar MENOS de lo que asevera hoy. Un test que
     espera mejor y asevera menos no es un arreglo, es un candado debilitado."

El test gemelo S3, en el MISMO describe, si la conservo. Mirale y calca esa
forma.

Arreglo: conservar las dos. El ancla de stat-distance termina la espera, y la
asercion de map-view visible se queda detras (o dentro del waitFor, como
prefieras, mientras siga estando). Delta de tests: CERO.

== QUE NO TOCAS ==

- R1 y su viga permanente de 200 ms: verificados verdes por el reviewer. No los
  toques.
- S3, S5, S6, S7: verificados. No los toques.
- El test de R3 (`selects the first pet and loads its first position (#72 R2)`):
  sigue siendo NO-EDICION. El reviewer lo comprobo byte a byte (393 vs 393).
- package.json (R4) y cualquier fichero de produccion (R5): siguen prohibidos.
- NO anadas ni quites ningun `it`.

== COMMITS ==

Un commit para B2 con el prefijo test(mobile-flaky-waits) y el R-id (R2), mas
uno de docs para el reporte. B2 no lleva par rojo/verde propio: el rojo de S4
ya esta demostrado en la ronda 1 (la zona ciega que el reviewer re-midio,
corregido falla con 0.8 km y viejo pasa) y lo que haces ahora es restituir una
asercion, no cambiar una espera. Dilo asi en el reporte.

Actualiza specs/mobile-flaky-waits/traceability.md.

== ENTORNO ==

- bun / bunx. Nunca npx, nunca npm i -g.
- Rutas de jest entre comillas simples y con --runTestsByPath.
- Mide SIN pipe: `cmd > fichero; echo $?`.
- Borra mobile-pet-tracker/.expo/types/router.d.ts antes de tocar codigo.
- NO lances ./init.sh.
- Cero dependencias nuevas.

== GATE DE CIERRE ==

El mismo de la ronda 1, y el reviewer ya lo midio verde salvo por B2:
  Test Suites: 77 passed   Tests: 1396 passed
  health/index.test.tsx 28   map/index.test.tsx 58
  N == S = 77 con `bunx jest --listTests`
  bunx tsc --noEmit limpio
  5 corridas consecutivas en verde, sin pipe

Delta CERO: B2 restituye una asercion dentro de un `it` que ya existe.

Al terminar: actualiza progress/impl_mobile-flaky-waits.md con el commit de B2
y con la correccion de la evidencia de S2 que pide B1.
```
