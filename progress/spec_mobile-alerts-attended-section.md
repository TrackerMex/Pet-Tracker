# Notas de la spec #223 `mobile-alerts-attended-section`

Autor: spec_author, 2026-10-27. Estado de la spec: `draft` (sin firmar, sin
commit). Base `73922b10`. Ficheros: `specs/mobile-alerts-attended-section/`
(`requirements.md`, `design.md`, `tasks.md`, `traceability.md`, `canvas/`).

## Lo que el leader debe decidir o saber antes de firmar

1. **Desviación del plan (la importante).** El plan §2 #223 pide dos consultas
   (`open` y `acked,closed`) con cursores separados. El backend acepta un solo
   `status` por llamada y el cursor no vale entre filtros; `?status=acked,closed`
   y `openCount` quedan fuera de alcance por el propio plan. La spec usa **una
   consulta sin filtro, drenada por el hook** (`useAlertsList({ drain: true })`),
   que da el contador exacto de abiertas y el orden `openedAt` desc del servidor
   sin tocar backend. Alternativas descartadas en `design.md`. Si prefieres
   exigir las dos consultas, hace falta primero la feature de backend.
2. **Coste del drenado.** Aproximadamente 1 petición por cada 50 alertas al abrir
   la pantalla, y el refetch al enfocar vuelve a pedir las páginas cargadas. Es
   un techo aceptado y anotado en `design.md`, no una decisión de costo de AWS
   (no crea recursos). Si lo ves como decisión de costo, la frase literal a
   confirmar es «drenar todas las páginas de alertas al abrir el centro».
3. **R19 y G4.** La línea nueva en `docs/ui-guidelines.md` regla 12 (`rounded-16`
   fila atendida y `rounded-14` «Ver más») tiene su propia casilla humana en
   Aprobación. No está delegada. Sin ella, R19 se queda `pendiente` y el resto
   puede implementarse. Si no quieres tocar la carta, la alternativa es usar
   `Card` para la fila y `rounded-card`, pero se aparta del canvas aprobado.
4. **Copy en inglés.** Solo el español viene del canvas aprobado en G1; las seis
   cadenas EN son traducción directa de la spec (`Open`, `Attended`,
   `Show more`, `Showing {{shown}} of {{total}}`, `All calm`,
   `You have no open alerts. {{petName}} is calm.`). Confírmalas si G1 las exige.
5. **Género de «tranquilo».** `{{petName}} está tranquilo` es el literal del
   canvas con Rocky; para una mascota femenina concuerda mal. No se resuelve con
   claves de género (no hay precedente en el catálogo); se deja tal cual y se
   anota. Alternativa: «está en calma», que no cambia el artboard aprobado más
   que en una palabra.
6. **Diferencia canvas/app en la fecha.** El canvas dibuja «Hace 1 semana»; la app
   conserva `fmtOpenedAt` («Hace 7 días»). Marcado fuera de alcance.
7. **Calma tras el ack de la última abierta.** Por el candado #78 la fila no se
   mueve, así que la tarjeta «Todo en calma» aparece solo tras el siguiente
   refetch, no en el momento del ack.
8. **«Se reescribe el copy de sección» del plan** se interpretó como claves
   nuevas, sin tocar las existentes.
9. **`petName` de la calma** sale de la atendida más reciente (determinista).

## Candados y anclas cruzadas

- Query keys: `alertKeys.list()` (`['alerts','list']`) se conserva; `alertKeys.open()`
  es de Inicio. `alert-detail` mantiene `useAlertsList()` (ancla `grep -cF` → 1).
- `#78` «el ack no mueve la fila»: R6 y las enmiendas de `#78 R6/R7` lo
  conservan.
- Fixtures con `nextCursor: 'c1'` constante (5 en `index.test.tsx`): ciclarían con
  el drenado; la regla de cierre y la convención de la spec obligan a cadenas
  terminadas en `null`.
- `onEndReached`: 1 en producción, 11 en el test; R15 lo lleva a 0 en producción;
  la tabla enmienda los `it` de `#78 R9`.
- `ui-copy-table` / `ui-language`: seis filas nuevas en `R12_ALERTS`; `SCREEN_FILES`
  sin delta (todo inline en `screens/alerts/index.tsx`); `StatusPill` local para que
  `t('alerts.statusAcked')` y `t('alerts.statusClosed')` sigan en 1.
- `chunky-cta-canvas-fidelity`: R7.5, R7.1, R7.3, R4.3, R5.1 y R8.3 enmendados
  (recomputar en T0). `design-drift` (radios 14/16/22),
  `alerts-canvas-fidelity` (tracking 1 → 3). `TABULAR_NUMS` sin cambio.
- Regla de cierre en T0 para rojos por tres causas tipificadas; fuera de eso, se
  reporta y no se toca.
- Candados vigentes que no cambian: `#134 R6/R7`, `#197 R10/R22`, `#174 R12`,
  `#177 R7.4`, `#155 R5`, `#203 R9`.
- testIDs nuevos bajo selectores por prefijo: grep de regex sobre `ByTestId(/^alert…`
  y `alert-row-[` en `src/` → 0 coincidencias en la base; las filas atendidas
  reutilizan `alert-row-<id>-*` y los nuevos son `alerts-attended*`,
  `alerts-calm*`, `alerts-open-heading`. Los inventarios por testID exacto
  (`neutralInventory` de chunky-cta) sí suman `alerts-attended-more`.

## Preguntas dudosas (no bloquean)

- Si el chip de contador debe mostrar el total cargado o el visible: se fijó total.
- Si la fila atendida debe tener `RiseIn`: se fijó que no (fuera de alcance).
- El esqueleto mientras drena sin abiertas reutiliza `alerts-loading`.
- R17 mezcla muchas aserciones de clases; si el reviewer lo ve denso, se
  puede dividir en `it` por fila sin cambiar la spec.
- Los títulos citados en la tabla de enmiendas se midieron por lectura en el árbol
  de `73922b10`; Codex debe recomputarlos en T0 (la spec lo manda).

## Verificación hecha

Anclas `grep -cF` en la base `73922b10` (todas coinciden con las de requirements
§Evidencia): `queryKey: alertKeys.list()` 1, `onEndReached` 1/11,
`nextCursor: 'c1'` 5, `useAlertsList()` en alert-detail 1, `t('alerts.statusAcked')`
y `statusClosed` 1/1, `alerts.attended` y `alerts.calmTitle` en catálogo 0,
`style={chunkyLip.neutralCompact}` 1, `text-13` 2, y la línea `(#199)` de la regla
12 existe y mide 1 con el literal completo.
