# Implementación — mobile-tab-indicator-out-of-range (#91)

Fecha: 2026-09-13

Branch: `feature/91-mobile-tab-indicator-out-of-range`
Base verificada: `072cff40` es ancestro de `HEAD`.

## R6 — Nada más se mueve

| Candado | Comprobación | Resultado frente a `072cff40` |
|---|---|---|
| Geometría del indicador | Las aserciones heredadas conservan ancho de layout `360`, `width: 68.8`, `translateX: 137.6` para índice 2 y `translateX: 68.8` para índice 1. `git diff -U0` no elimina ni modifica ninguna de ellas. | **PASS — delta 0** |
| `TAB_INDICATOR_SPRING` | Producción conserva `duration: 250`, `dampingRatio: 1` y `ReduceMotion.System`; sus pruebas heredadas pasan. | **PASS — delta 0** |
| Cinco pestañas, sin `alerts` | `TABS` tiene 5 entradas y no contiene `alerts`; `_layout.tsx` mantiene 5 `<Tabs.Screen>` y no registra `alerts`. | **PASS — delta 0** |
| Longitud del catálogo de idiomas | `Object.keys(en).length === 302` y `Object.keys(es).length === 302`; no hay diff en el catálogo. | **PASS — +0 claves** |
| Copy `R2_TABS` | La tabla conserva 5 filas y `ui-language.test.ts` mantiene su aserción en 5. | **PASS — delta 0** |
| `text-accent-strong` | `floating-tab-bar.tsx` conserva 1 ocurrencia y el candado `inkSites` conserva su suma declarada de 14. El barrido global da 15 tanto en la base como en `HEAD` por la ocurrencia heredada de `weekly-activity-chart.tsx`, fuera de `inkSites`. | **PASS — delta 0** |
| Escala de radios | Producción mantiene 0 ocurrencias de `rounded-2xl`, `rounded-lg`, `rounded-md` y `rounded-sm`; #91 no modifica ninguna `className`. | **PASS — delta 0** |
| Dependencias | `mobile-pet-tracker/package.json` no tiene diff. | **PASS — 0 dependencias** |
| Grep-clean | Fuera de `src/theme/`: 0 hex; producción: 0 clases arbitrarias, 0 `StyleSheet.create` y 0 propiedades legacy `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`/`elevation`. | **PASS — delta 0** |

Verificación ejecutada desde la raíz:

- `./init.sh`: exit 0; backend 165 suites/1268 tests, infra 2 suites/14 tests,
  móvil 73 suites/1236 tests, e2e 25 suites/362 tests; build, lint y typecheck
  verdes.
- Candados móviles dirigidos: 6 suites/162 tests verdes; el candado de tabs,
  ejecutado por ruta exacta, 1 suite/3 tests verdes.
- `git diff --stat 072cff40..HEAD -- mobile-pet-tracker/`: exactamente
  `src/components/floating-tab-bar.tsx` y
  `src/components/__tests__/floating-tab-bar.test.tsx`.

## R7 — Pruebas de mutación por sitio

Cada mutación se comprobó sola sobre el árbol final, con las otras dos
revertidas. M1 y M2 fueron mutaciones temporales sin commit; M3 quedó versionada
en el rojo de R5 y revertida en su verde.

### M1 — destino del `useEffect`

Diff de una línea:

```diff
- previousIndex < 0 ? nextX : withSpring(nextX, TAB_INDICATOR_SPRING)
+ previousIndex < 0 ? nextX : withSpring(state.index * tabWidth, TAB_INDICATOR_SPRING)
```

- Test rojo: `#91 R3: el cambio de ruta desliza la burbuja al índice de TABS ›
  anima health a su índice en TABS aunque difiera de state.index`.
- Fallo: esperaba `translateX: 137.6` y recibió
  `translateX: 206.39999999999998`.
- Resultado de la suite: 1 fallido, 17 pasados. Mutación revertida.

### M2 — escritura de `handleLayout`

Diff de una línea:

```diff
- translateX.set(activeTabIndex * nextTabWidth)
+ translateX.set(state.index * nextTabWidth)
```

- Test rojo: `#91 R2: el primer layout coloca la burbuja por el índice de TABS ›
  usa el índice de map en TABS aunque difiera de state.index`.
- Fallo: esperaba `translateX: 68.8` y recibió `translateX: 137.6`.
- Resultado de la suite: 1 fallido, 17 pasados. Mutación revertida.

### M3 — estado activo de las celdas

Diff de una línea:

```diff
- const isActive = activeRouteName === name
+ const isActive = activeTabIndex < 0 || activeRouteName === name
```

- Test rojo: `#91 R5: con una ruta ajena las cinco celdas quedan inactivas y
  siguen navegando › conserva el estado inactivo, los dos hijos y la navegación
  de cada pestaña`.
- Fallo: esperaba `accessibilityState={{ selected: false }}` y recibió
  `selected: true` en la primera celda.
- Resultado de la suite: 1 fallido, 17 pasados. Mutación versionada en
  `1c77093e` y revertida en `dba1ea57`.

Tras las tres comprobaciones,
`git diff --exit-code -- mobile-pet-tracker/src/components/floating-tab-bar.tsx`
terminó con exit 0: no quedó ninguna mutación en el árbol.

## R8 — Gate humano en dev build de Android

Ejecutar este guion en un **dev build de Android**, no en Expo Go, sobre el
commit de cierre de esta rama y con una sesión que tenga al menos una mascota:

1. Recorrer `Inicio`, `Mapa`, `Salud`, `Nutrición` y `Perfil` pulsando cada
   pestaña. En las cinco, comprobar que la burbuja queda bajo la pestaña activa
   como antes del arreglo.
2. Volver a `Inicio` y abrir `Alertas` con la campana del hero. Comprobar que no
   aparece ninguna burbuja y que las cinco etiquetas de la barra están grises.
3. Desde `Alertas`, pulsar primero la misma pestaña de origen y repetir entrando
   otra vez y pulsando una pestaña distinta. En ambos retornos, comprobar en el
   primer frame visible que la burbuja ya está bajo la pestaña elegida y que no
   se desliza desde una ranura fantasma.
4. Repetir las comprobaciones de los pasos 2 y 3 entrando en `Recordatorios`
   (Perfil → Recordatorios o Inicio → Ver todo), `Registrar peso` (Inicio →
   Peso) y una ruta `pets/` (Inicio → Documentos o Perfil → Documentos). En cada
   pantalla ajena: ninguna burbuja y cinco etiquetas grises; al pulsar una
   pestaña: burbuja ya colocada, sin deslizamiento fantasma.

Resultado humano: **por ejecutar**. Registrar aquí dispositivo, versión del dev
build, commit probado y veredicto PASS/FAIL; después completar R8 en
`specs/mobile-tab-indicator-out-of-range/traceability.md`.
