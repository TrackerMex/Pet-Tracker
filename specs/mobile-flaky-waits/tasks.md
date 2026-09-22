---
feature: "mobile-flaky-waits"
status: draft        # draft | approved
tags: [harness, spec, mobile, tests]
---

# Tareas — [[mobile-flaky-waits]] (#111)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Sujeto de cada tarea**: los siete tests que esta feature toca **ya existen** en
> el árbol en HEAD `69a763f3`. Ninguna tarea asevera sobre un nodo, un helper o un
> fichero que otra tarea posterior tenga que crear: no hay orden que romper.
>
> **Antes de la tarea 0**: `rm -f mobile-pet-tracker/.expo/types/router.d.ts`.
> **Todo con `bun`/`bunx`**, nunca `npx` ni `npm i -g`.
> **Ninguna medida con pipe**: `cmd > fichero; echo $?`.
> **No se lanza `./init.sh`**: #111 no toca `backend-pet-tracker/`.

---

## R1 — La espera del sitio reproducido termina en `weight-current`

**Sujeto**: `mobile-pet-tracker/src/screens/health/index.test.tsx` ›
`R6: weight card enlaza al log` › `shows the current weight and opens the weight
log` (`:457`), que ya existe y hoy pasa.

- [ ] **(1) Rojo real (C4 vía (a))**. El implementador verifica primero cómo arma
      `mockListWeights` el `beforeEach` de ese describe (`:444-456`) y **entonces**
      sustituye el `mockResolvedValue` del cuerpo del test por una viga de **200 ms**
      (§Protocolo M de [[design]]), **sin tocar ninguna otra línea del test**. El
      implementador corre `bunx jest --runTestsByPath src/screens/health/index.test.tsx`
      y comprueba que falla en la aserción de `weight-current` con
      `Unable to find an element with testID: weight-current`. Commitea **ese rojo**.
- [ ] **(2) Verde mínimo**. El implementador hace que la espera de `:465` termine en
      el **texto de `weight-current`** y deja detrás las tres aserciones restantes
      (`weight-card` visible, `Peso`, `weight-variation`) y la pulsación de
      `weight-log-link`. **La viga se queda.** Corre el fichero: 28 tests en verde.
- [ ] **(3) Refactor con tests verdes**. El implementador comprueba que la viga no
      se filtra al resto del describe (cada test rearma su `mockListWeights`) y que
      el fichero sigue dando **28**.

## R2 — Los seis sitios restantes del mismo patrón (S2..S7)

**Sujeto**: los seis `it` de la tabla de [[requirements]] §R2, todos existentes:
`health/index.test.tsx:248`; `map/index.test.tsx:483`, `:521`, `:564`, `:601`,
`:821`. Se hacen **uno a uno**, en ese orden.

- [ ] **(1) Rojo por mutación de ventana (C4 vía (b))**. Para cada sitio, el
      implementador pone la viga de 200 ms en la **fuente tardía** que la tabla de
      §Protocolo M le asigna, corre el fichero y **guarda la salida literal del
      fallo**. Para **S4** el implementador ejecuta además la **prueba de zona
      ciega** de §Protocolo M (payload `trips: [makeTrip()]`): registra que el test
      **actual pasa** y que el **corregido falla**. Estas vigas **no se commitean**.
- [ ] **(2) Implementación mínima que lo pasa**. Para cada sitio, el implementador
      aplica la forma que la tabla indica —(F-a) mover la aserción dentro del
      `waitFor`, (F-b) ancla positiva + aserción detrás, (F-c) la parada pasa al
      árbol y el contador queda detrás— **sin añadir, quitar ni cambiar el valor
      esperado de ninguna aserción**, y comprueba el verde con la viga puesta.
- [ ] **(3) Refactor con tests verdes**. El implementador **quita todas las vigas de
      R2** del working tree, corre los dos ficheros (`86` tests) y commitea solo las
      correcciones. El implementador verifica que
      `git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/map/index.test.tsx`
      no añade ninguna línea con `setTimeout`.

## R3 — La espera sobre el mock de `map:284` se conserva

**Sujeto**: `mobile-pet-tracker/src/screens/map/index.test.tsx:284-299`, que ya
existe y **no se edita**.

- [ ] **(1) Escribir la comprobación que falla si se toca**. El implementador anota
      en `progress/impl_mobile-flaky-waits.md` la salida de
      `git diff origin/main..HEAD -- mobile-pet-tracker/src/screens/map/index.test.tsx`
      y señala que el rango del `it` `selects the first pet and loads its first
      position (#72 R2)` no aparece. Si apareciera, **para**.
- [ ] **(2) Implementación mínima**: **ninguna edición**. El requisito es la
      no-edición; el implementador no "mejora" ese test ni aunque el resto del
      fichero cambie a su alrededor.
- [ ] **(3) Refactor con tests verdes**: el implementador copia en el reporte el
      argumento de R3 (el árbol no distingue el estado final en ese fixture) y la
      cita de #72 S6, para que el `reviewer` no lo re-litigue.

## R4 — La configuración de jest no se toca

**Sujeto**: `mobile-pet-tracker/package.json`, bloque `jest`, que ya existe y **no
se edita**.

- [ ] **(1) Escribir la comprobación que falla si se toca**. El implementador
      registra `git diff origin/main..HEAD -- mobile-pet-tracker/package.json` y
      comprueba que sale **vacío**.
- [ ] **(2) Implementación mínima**: **ninguna edición**. Ni `testTimeout`, ni
      `maxWorkers`, ni `asyncUtilTimeout` en ningún otro sitio.
- [ ] **(3) Refactor con tests verdes**: el implementador copia en el reporte la
      razón de R4 (el plazo que venció fue el de RNTL, 1000 ms, no el de jest).

## R5 — Cero cambio de producción

**Sujeto**: todo `mobile-pet-tracker/` que no sea un `.test.tsx`.

- [ ] **(1) Escribir la comprobación que falla si se toca**. El implementador corre
      `git diff --name-only origin/main..HEAD -- mobile-pet-tracker/ ':!*.test.tsx'`
      y comprueba que sale **vacío**.
- [ ] **(2) Implementación mínima**: **ninguna edición** de producción. Si el
      implementador encuentra un bug de producción, lo escribe en
      `progress/impl_mobile-flaky-waits.md` como decisión abierta y **para**; no lo
      arregla.
- [ ] **(3) Refactor con tests verdes**: el implementador repite la comprobación
      tras el último commit de código.

## R6 — El recuento no se mueve y la suite aguanta cinco corridas

**Sujeto**: la suite móvil completa, que ya existe.

- [ ] **(1) Escribir la medida de base**. El implementador ejecuta **V0** y **V1**
      de [[design]] §Protocolo V **antes** de tocar nada, sin pipe, y guarda `S`, el
      recuento de suites, el de tests y el `86` de los dos ficheros.
- [ ] **(2) Implementación mínima**: ninguna. El implementador ejecuta **V2** —cinco
      corridas consecutivas de la suite completa, borrando `perf-cache-*` entre
      ellas, sin pipe— y comprueba los cuatro criterios de "arreglado".
- [ ] **(3) Refactor con tests verdes**: el implementador rellena
      [[traceability]] y escribe `progress/impl_mobile-flaky-waits.md` con las
      salidas del Protocolo M y del Protocolo V. Si alguna corrida sale roja, guarda
      el log **entero** junto a `progress/logs-111/` y **para**.
