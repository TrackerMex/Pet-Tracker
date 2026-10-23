# Enmienda de la spec #202 (mobile-canvas-zones): auditoría y RiseIn de #197

Commit: `cf4a31f4` en `feature/202-mobile-canvas-zones`. No se hizo push.
El commit contiene `specs/mobile-canvas-zones/` y
`progress/inventory-audit_mobile-canvas-zones.md`.
El frontmatter queda en `status: spec_ready` y la spec no está firmada.
Este fichero no está commiteado.
Rutas relativas a `mobile-pet-tracker/` salvo `specs/` y `progress/`.

## Hallazgos de la auditoría

Cada hallazgo se verificó con `grep -n` del literal contra el árbol antes de escribirlo.

| # | Qué se cambió | Dónde |
|---|---|---|
| F1 | Fila nueva: GZ `#189 R5: filas con tile pastel, textos y controles` › `las cinco posiciones usan verde, azul, ámbar, violeta y rosa en inglés`. Hoy afirma `color` del `Map`; pasará a afirmar `stroke` del glifo `Svg` por posición. | requirements § Candados (GZ), R3; tasks R3; traceability R3 |
| F2 | Fila nueva: GZ `#189 R5` › `family conserva tile y columna, nombre seleccionable y chip sin controles`. Mismo cambio de `Map` a glifo `Svg`. | igual que F1 |
| F3 | Fila nueva: GE `#146 R14: Eliminar en el editor borra la zona y vuelve a la lista` › `un fallo al borrar pinta el error y no vuelve`. La confirmación pasa del espía de `Alert` a pulsar `-confirm`. | requirements (GE), R9; tasks R9; traceability R9 |
| F4 | Fila nueva: GE `#146 R14` › `un 401 al borrar cierra sesión una vez`. Mismo cambio que F3. Además, el helper `alertButton` se borra en R9. | igual que F3 |
| F5 | Fila nueva: GE `#189 R9: hoja estática solapada y capas del mapa` › `#189 R9: compone la hoja al %s sin fondo que tape el mapa (enmendado por E4 R22)` (`it.each`, 3 filas). Los hijos pasan a `[…, 'geofence-editor-form-entrance']`. | requirements (GE), R13; tasks R13; traceability R13 |
| F6 | Sin fila. CC `#62 R14` y `#98 R10` cuentan `style={CONTINUOUS_CORNER}` en todo el árbol. R6 conserva `style={CONTINUOUS_CORNER}` en la papelera y R3/R5/R10 no lo mueven: Zonas sigue en 3 → 3 y el editor en 2 → 2 (`\bCONTINUOUS_CORNER\b`). Las anclas están en la Base medida y en tasks, sección Cuentas. | requirements, párrafo «Sin fila, verificados»; Base medida; R6 |
| M1 | Corregido el nombre del `it`: GZ `#41 R6` › `pinta %s sin recargar y limpia el error al siguiente intento` (4 filas). | requirements (GZ); tasks R11 |
| M2 | La fila de GZ `#41 R5` métricas incluye ahora `paddingTop: 46` → `52` dentro del `toEqual`, además de `toBe(40 + 12)`. | requirements (GZ), R1; tasks R1 |
| M3 | Decisión: R6 **no** exige `hitSlop` en la papelera y conserva `style={CONTINUOUS_CORNER}`. GZ `#189 R5` (`trash.props.hitSlop` indefinido) sigue en verde y no entra al inventario como fila rota. Queda solo una nota en la fila. | requirements R6; tasks R6 |
| M4 | El inventario usa los nombres reales de los ficheros: `chunky-cta-canvas-fidelity.test.ts` y `consistency-classnames.test.ts`. CF es de #197 y se mide contra su branch. | requirements, tabla de agregados |
| M5 | Corregido el `it`: GE `#146 R8` › `pinta %s bajo Guardar y conserva el borrador (enmendado por #189 R13)` (8 filas). | requirements (GE); tasks R16 |
| M6 | La fila de GE `#146 R6` del esqueleto pasa a tener columna R17 (métricas) y R18 (barras). | requirements (GE); tasks R17 y R18 |
| M7 | El candado ZF de R2 construye la aguja con `['theme', 'header-layout'].join('/')` y no excluye ningún fichero. Base: `grep -rlF "theme/header-layout" src \| wc -l` da 6, después 0. | requirements R2 y Base medida; tasks R2 y Cuentas |
| M8 | CC `#189 R9` (`it` de nivel raíz) es una fila propia en R13. El `style` exacto pasa a `[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }, shadows.sheet]`. Ya no se habla de «geofences 4, editor 2». | requirements (agregados), R13 |
| A6 | El ancla «geofences 4, editor 2» se sustituye por dos anclas: `style={CONTINUOUS_CORNER}` en Zonas (3 → 3) y `\bCONTINUOUS_CORNER\b` en el editor (2 → 2). | Base medida; tasks, sección Cuentas |

## Decisiones del leader

1. **RiseIn es de #197 R24.** Se cambió en el encabezado «Depende de #197», D8, R7.3, R13, design.md (intro, Supuestos, Dependencias, D8, Alternativas, Riesgos) y tasks.md.
   - La firma se copia literal.
   - Las anclas `(#197: …)` se miden con `git show feature/197-mobile-canvas-foundations:…`.
   - No queda ninguna mención a «#199 R24». Las tres menciones de #199 que quedan dicen «no depende de #199».
2. **CF `#197 R20`.** Hay una sola fila: el `describe('#197 R20: cimientos sin cablear')` se borra entero en el rojo de R7. R7 es el primer commit que monta `RiseIn` y `useShadows`.
3. **motion.ts.** #202 no añade exportaciones, así que no hay fila MT.

## Hallazgos que no estaban en la auditoría

- **Candado de longitud del catálogo.** Está en `providers/__tests__/language-provider.test.tsx` › `#194 R1 … (enmendado por #189 R15)`. Su último sumando es `+ 7`. R10 añade `+ 1 // #202 R10` y R18 añade `+ 1 // #202 R18`.
- **UL `toHaveLength`.** Vive en `#41 R10` (`R14_GEOFENCES`, 22 → 23) y `#146 R10` (`R15_GEOFENCE_EDITOR`, 31 → 32). Las filas antiguas lo atribuían por error a `#65 R14` y `#65 R15`.
- **Redacción de R2.** Se corrigió para que las `options` de hoy sean exactas:
  - Zonas: `{ ...headerOptions, title: '', ...TRANSPARENT_HEADER_OPTIONS }`
  - Editor: `{ ...headerOptions, title: '' }`
- **chunky-cta `#177 R7.3`.** Además del mapa `radii` del editor (3 → 4), cambia el total: `26 + 1 + 1 + 1 + 2 + 1 // #202 R18`.
- **design-drift `#178 R13`.** `rounded16` del editor pasa de 3 a 4 (R18).
- **profile y alerts.** Las filas `text-26`, `tracking-title`, `rounded-hero` y `text-15` llevan los sufijos de #197 (R19), y se indica qué R añade o quita cada fichero (R1, R7, R11, R17).
- **`ScreenHeader` se escribe una vez.** Por eso `t('geofences.title'` (1 → 1) y `t('geofenceEditor.title'` (2 → 2) no cambian, y UL `#41 R10` no se enmienda por R1 ni por R17.
- **Revisado sin fila**, verificado contra R1–R18:
  - CC `#62 R14` y `#98 R10`
  - legibility-classnames
  - tab-headers-canvas
  - `theme/__tests__/motion.test.ts`
  - global-css `#197 R3`
  - el `it` de design-drift sobre text-17
  - heroui-text-size-merge
  - empty-state
  - CC `#166 R2` y `R3`
  - UL `#65 R18` (SCREEN_FILES no cambia)
- **Añadido mío, no viene de la auditoría:** `shrink` en el envoltorio `RiseIn` de R13 (`className="-mt-6.5 shrink"`). En RN `flexShrink` vale 0 por defecto, y sin `shrink` la hoja dejaría de encogerse bajo el padding del KAV. Está marcado como revertible en R13 y en los Riesgos de design.md.

## Abierto

- **Token `--scrim` frente a `SCRIM` local.** #197 declara `--scrim: #0D1117` (sería posible `bg-scrim` con opacidad). R7 mantiene la constante local `SCRIM = 'rgba(13,17,23,0.4)'`. Lo decide el leader.
- **Rama desactualizada.** El HEAD de la rama antes de este commit (`d01967a1`) no contiene `origin/dev` (`a470a08a`). Hay que re-basar antes del handoff; si no, las anclas de #197 siguen sin existir en el árbol.
- **Cifras a re-medir tras el re-base**, porque otra feature de la ola 2 puede moverlas:
  - el último sumando del catálogo (`+ 7`)
  - el total de chunky-cta `#177 R7.3`
  - los inventarios de profile y alerts
- **`shrink` en R13 es revertible.** Si el leader no lo quiere, se quita de R13, de su test (className del envoltorio) y de la línea de Riesgos.
- **Identidad del commit.** git avisó de que el committer se configuró automáticamente (`Claude <claude@srv1178023.hstgr.cloud>`). No se tocó la config.
