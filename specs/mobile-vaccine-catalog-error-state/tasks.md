---
feature: "mobile-vaccine-catalog-error-state"
status: approved       # draft | approved
tags: [harness, spec, mobile, health, vaccines]
---

# Tareas — [[mobile-vaccine-catalog-error-state]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa. Las intenciones de cada
> doble y las mutaciones están en [[design]] §Tests.

## Orden de commits (test primero, `CHECKPOINTS.md` C4)

Cada commit lleva solo los ficheros que nombra. Los tests rojos van en commits
propios, antes de la implementación.

1. **C1** — `test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`
   - Solo `src/screens/vaccine-create/index.test.tsx`.
   - Añade los `it` de `#236 R1`, `#236 R2`, `#236 R5`, `#236 R6` y `#236 R8`.
   - Todos rojos: el bloque no existe.
2. **C2** — `test(mobile): usos de copy del aviso del catálogo en rojo (R7)`
   - Solo `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts`.
   - Las dos filas y la longitud `29 + 2`.
   - Rojo: `#208 R20 … (enmendado por #236 R7)` y
     `resuelve cada ocurrencia de la tabla contra la clave exacta` no encuentran
     los usos en el fuente.
3. **C3** — `feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)`
   - Solo `src/screens/vaccine-create/index.tsx`.
   - La constante `catalogFailed` y el bloque de [[design]] §Decisiones técnicas.
   - C1 y C2 pasan a verde.
4. **C4** — `test(mobile): sin aviso con catálogo ok ni durante la carga (R3,R4)`
   - Solo `src/screens/vaccine-create/index.test.tsx`.
   - Nacen verdes. Antes de commitear, corre las mutaciones de [[design]]
     §Pruebas de mutación y anota cada resultado en
     `progress/impl_mobile-vaccine-catalog-error-state.md`.
5. **C5** — `docs(progress): paso de smoke y trazabilidad de #236 (R9)`
   - Solo `progress/smoke_mejoras-smoke.md`,
     `specs/mobile-vaccine-catalog-error-state/traceability.md` y
     `progress/impl_mobile-vaccine-catalog-error-state.md`.

## R1 — Aviso de error del catálogo

- [ ] (1) Escribir test que falla para R1:
  - `#236 R1: con el catálogo en %s pinta el aviso y «Reintentar» entre la leyenda y los chips`
    (`it.each` de cuatro filas: `error`, `unreachable` con
    `message: 'SERVER_NETWORK_PRIVATE'`, `unauthorized` y `missing-config`);
  - `#236 R1: si la consulta del catálogo rechaza pinta el mismo aviso`.
  - Fichero: `src/screens/vaccine-create/index.test.tsx`, commit C1.
- [ ] (2) Implementación mínima que lo pasa: `catalogFailed` y el bloque (C3).
- [ ] (3) Refactor con tests verdes. Ninguno previsto: el bloque es literal.

## R2 — «Otra vacuna» sigue disponible durante el error

- [ ] (1) Escribir test que falla para R2:
  `#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre` (C1).
  Rojo porque espera a `vaccine-create-catalog-error`.
- [ ] (2) Implementación mínima que lo pasa: la misma de R1. Los chips no se
  tocan (C3).
- [ ] (3) Refactor con tests verdes. `#208 R8: con el catálogo en error solo queda «Otra vacuna» seleccionado`
  sigue verde sin tocarlo.

## R3 — Catálogo `ok` (vacío o con entradas) sin aviso

- [ ] (1) Escribir test para R3:
  `#236 R3: un catálogo ok %s no pinta el aviso de error` (`it.each`: `vacío` y
  `con entradas`), en C4.
  - Nace verde. Su rojo se demuestra con las mutaciones `entries.length === 0` y
    `!catalog.isPending` ([[design]] §Pruebas de mutación).
- [ ] (2) Implementación mínima que lo pasa: la de C3, sin cambios.
- [ ] (3) Refactor con tests verdes.

## R4 — Carga sin aviso

- [ ] (1) Escribir test para R4: `#236 R4: mientras carga no pinta el aviso de error` (C4).
  - Nace verde. Su rojo se demuestra con las mutaciones `entries.length === 0` y
    `catalog.data?.kind !== 'ok'`.
- [ ] (2) Implementación mínima que lo pasa: la de C3, sin cambios.
- [ ] (3) Refactor con tests verdes.

## R5 — «Reintentar» repite la misma consulta

- [ ] (1) Escribir test que falla para R5:
  `#236 R5: «Reintentar» vuelve a pedir el catálogo y, si responde ok, pinta las entradas y retira el aviso` (C1).
- [ ] (2) Implementación mínima que lo pasa: `onPress={() => void catalog.refetch()}` (C3).
- [ ] (3) Refactor con tests verdes.

## R6 — Reintento en vuelo y reintento fallido

- [ ] (1) Escribir test que falla para R6 (C1):
  - `#236 R6: mientras el reintento está en vuelo el aviso sigue y no vuelven los esqueletos`;
  - `#236 R6: si el reintento vuelve a fallar el aviso sigue y se puede reintentar otra vez`.
- [ ] (2) Implementación mínima que lo pasa: la condición sin `isFetching` (C3).
  La mutación `!catalog.isFetching && …` debe poner rojo el primero; anótala.
- [ ] (3) Refactor con tests verdes.

## R7 — Tabla de usos de copy

- [ ] (1) Escribir test que falla para R7 (C2), en
  `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts`:
  - dos filas en `R19_VACCINE_CREATE`, tras la de `validation.checkDetails`;
  - el título del `it` `#208 R20` gana ` (enmendado por #236 R7)`;
  - `toHaveLength(29 + 2); // #236 R7`.
- [ ] (2) Implementación mínima que lo pasa: los dos `t(...)` del bloque (C3).
- [ ] (3) Refactor con tests verdes. `src/i18n/catalog.ts` no cambia.

## R8 — Receta visual y guardas de la carta

- [ ] (1) Escribir test que falla para R8:
  `#236 R8: el aviso y el reintento usan la receta de Salud sin clases ni labio` (C1).
- [ ] (2) Implementación mínima que lo pasa: el bloque literal de [[design]] (C3).
- [ ] (3) Refactor con tests verdes. Las guardas de [[requirements]] R8 siguen
  verdes sin tocarlas.

## R9 — Paso de smoke (gate humano G2)

- [ ] (1) Verificación que falla para R9. Antes de C5, desde la raíz del repo,
  los dos comandos dan `0`:
  - `grep -cF '## #236 mobile-vaccine-catalog-error-state' progress/smoke_mejoras-smoke.md`
  - `grep -cF -- '- [ ] Smoke de #236 pasado (fecha: ____; paso 1, fallo reproducido: sí / no)' progress/smoke_mejoras-smoke.md`
- [ ] (2) Implementación mínima: pegar la sección literal de [[design]] §Paso de
  smoke al final del fichero (C5). Los dos comandos dan `1`.
- [ ] (3) Refactor: ninguno. La casilla la marca solo el humano.

## Anclas tras C3 (`grep -cF` sobre `src/screens/vaccine-create/index.tsx`)

| Patrón | Base (`8187d1fb`, igual en `b06e688f`) | Tras C3 |
|---|---|---|
| `const catalogFailed = !catalog.isPending && catalog.data?.kind !== 'ok';` | 0 | 1 |
| `testID="vaccine-create-catalog-error"` | 0 | 1 |
| `testID="vaccine-create-catalog-error-text"` | 0 | 1 |
| `<Button testID="vaccine-create-catalog-retry" onPress={() => void catalog.refetch()}>` | 0 | 1 |
| `t('health.couldNotLoadVaccines')` | 0 | 1 |
| `t('common.retry')` | 0 | 1 |
| `className="text-15 leading-body text-danger"` | 0 | 1 |
| `accessibilityRole="alert"` | 1 | 2 |
| `<Button` | 1 | 2 |
| `{catalog.isPending ? (` | 1 | 1 |

- Con `grep -cP '#236(?! R\d)' src/screens/vaccine-create/index.tsx`, base `0` y
  tras C3 `0`.
- En `src/__tests__/ui-copy-table.ts`, con `grep -cF`:
  - `{ file: 'src/screens/vaccine-create/index.tsx', key: 'health.couldNotLoadVaccines' }, // #236 R7`
    pasa de `0` a `1`;
  - `{ file: 'src/screens/vaccine-create/index.tsx', key: 'common.retry' }, // #236 R7`
    pasa de `0` a `1`.
- En `src/__tests__/ui-language.test.ts`,
  `grep -cF 'expect(R19_VACCINE_CREATE).toHaveLength(29 + 2); // #236 R7'` pasa
  de `0` a `1`.
- `git diff b06e688f -- src/i18n/catalog.ts src/screens/health/index.tsx` sale
  vacío. `b06e688f` es el merge de `origin/dev`; desde `8187d1fb` el catálogo
  ganó claves de otras features, así que esa base ya no sirve aquí.
