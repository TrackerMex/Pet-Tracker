# review: mobile-chunky-cta-canvas-fidelity
Fecha: 2026-10-19
Veredicto: APROBADO (R1-R13 verificados; R14 y la casilla «Enmienda #177 aprobada por humano (carta y #166)» quedan pendientes del humano y NO las marco)

HEAD revisado: 8c4b541db2be7e9ed32687993ba6a2af4b0f0d27 (8c4b541d).
H0: 810697769ae564058dc9daa7635db55c3c7a80bd.
Implementó Codex; el reviewer no es el implementador.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (verificado en feature_list.json).
- [ ] progress/current.md actualizado: sigue siendo la plantilla vacía. Es responsabilidad del leader en el cierre de sesión; no bloquea el veredicto (ver Observaciones, punto 3).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (la feature solo toca mobile-pet-tracker; no hay cambios en backend).
- [x] repositories/contratos en domain son interfaces puras (N/A, sin cambios).
- [x] application depende de interfaces, no implementaciones (N/A, sin cambios).
- [x] infrastructure sin lógica de negocio (N/A).
- [x] Estructura móvil: el hook `useChunkyLip` vive en `src/theme/chunky-lip.ts`, lee tokens por `useThemeColors`; las pantallas solo consumen el hook. Tokens `--color-lip` (#0E5E3C claro / #0B4D31 oscuro) junto a `--color-lip-gray` en `src/theme/global.css`.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra. `chunky-cta-canvas-fidelity.test.ts`: 72 `it`, todos `#177 R<n>...` (pasan 72/72 al correrlo yo). `src/theme/__tests__/chunky-lip.test.tsx`: 7 `it` R2.1-R2.7 (7/7). `src/theme/__tests__/global-css.test.ts`: describe `#177 R1`, 2 `it`. Tests enmendados llevan el sufijo «(enmendado por #177 R10/R9)».
- [x] Historial de commits muestra test-primero: c1..c12 más c5b, E2/E3/E4 verificados uno por uno; cada commit es solo-test, solo-producción o solo-docs (ver sección Historial).

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente», salvo R14, que está declarada «pendiente (humano)» (smoke en dispositivo real: la cierra el humano, no el implementer).
- [x] 15/15 hashes de traceability existen (`git cat-file -e`) y son ancestros de HEAD.
- [x] Commits siguen el formato `feat(<scope>): <desc> (R-ids)` / `test(...)` / `docs(...)` / `chore(...)` con R-ids.

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana de la spec marcada (2026-10-18). Casillas de Enmienda E1 y E4 marcadas por el humano.
- [ ] Casilla «Enmienda #177 aprobada por humano (carta y #166)» y «Smoke R14»: sin marcar. Son del humano; no las toco.

## Checklist C7 — Sin código huérfano
- [x] Los `border-b-4`/labio por borde de los CTA reemplazados fueron eliminados y sustituidos por `boxShadow` vía `useChunkyLip` (guards `design-drift`, `consistency-classnames`, `legibility-classnames` enmendados lo exigen).
- [x] Sus tests antiguos fueron reescritos/enmendados (sufijo «enmendado por #177»); no quedan tests del patrón viejo.
- [ ] N/A — la feature sí reemplaza el labio por borde; ver arriba.

## Verificación por requisito

- R1 (tokens `--color-lip` claro/oscuro): global.css contiene #0E5E3C y #0B4D31 junto a `--color-lip-gray`. `global-css.test.ts` 2/2 verde. CUMPLE.
- R2 (hook `useChunkyLip`): código real coincide con spec: `primary` offsetY 4, `primaryCompact` offsetY 3, `neutral` offsetY 4 con `lipGray`; blur 0, spread 0, offsetX 0; `useMemo` sobre `[lip, lipGray]`. `chunky-lip.test.tsx` 7/7 verde (forma, referencia estable, re-resolución al cambiar colores, lista corta tolerada). CUMPLE.
- R3 (CTA primario): los 17 ficheros consumidores coinciden con las tablas de la spec (`h-14 rounded-16 bg-accent`, `style={chunkyLip.primary}`, label `Text 17/800` = `text-17 font-extrabold text-accent-foreground`). CUMPLE.
- R4 (botones neutros): `h-14 rounded-16 border-2 border-lip-gray bg-surface` con `chunkyLip.neutral`. CUMPLE.
- R5 (compacto y tile): compacto `rounded-xl bg-accent h-10 gap-1.5 px-3.5` con `primaryCompact`; tile `size-13 ... rounded-16` con `[CONTINUOUS_CORNER, chunkyLip.primary]`. CUMPLE.
- R6 (anclas, incl. R6.2): coinciden con los valores de la spec. CUMPLE.
- R7 (R7.1-R7.5 anclas de inventario): coinciden. CUMPLE.
- R8, R9, R10 (guards y escáneres enmendados: `consistency-classnames`, `design-drift`, `account-screens-polish`, `heroui-text-size-merge` con pisos 211/167, `empty-state`): enmendados con sufijo y verdes en la corrida completa del leader. CUMPLE (ver NV/aflojamientos).
- R11 (carta `docs/ui-guidelines.md` §12/§13 y sección «Enmienda #177» con casilla sin marcar; mismo bloque anexado a `specs/mobile-chunky-cta/requirements.md`): presentes. CUMPLE.
- R12 (sin clases nuevas ni sombra propia fuera del hook): guard por regex sobre contenido verde; la sonda S11 del reporte lo puso rojo. CUMPLE (ver Observaciones 1 y 2).
- R13 (no regresión): R13.2 y R13.3 `git diff H0..HEAD` vacíos (ejecutados por mí). CUMPLE.
- R14 (smoke en dispositivo real): pendiente del humano; no evaluado por diseño.

## Total de tests (T0+81)
T0 = 3913. c1 añade 9 (7 hook + 2 global-css), c4 añade 72; el resto de ficheros no cambia su cuenta. 3913 + 81 = 3994. Log del leader: `Tests: 3994 passed, 3994 total`, `Test Suites: 120 passed`. CUMPLE.

## Historial test-primero, NV y «rojo por omisión»
- c1..c12 + c5b + errata E2/E3/E4: cada commit de tests precede a su commit de producción; ninguno mezcla test, producción y docs.
- c4: medido 53 rojos / 19 NV (la spec preveía 60/12) porque 7 etiquetas ya cumplían; documentado en el reporte de Codex.
- c3: NV por aflojamiento declarado (D3), autorizado por spec.
- E1 (c5b): NV (a), enmienda firmada por el humano.
- E2: declarada.
- E3: «rojo por omisión» (log `/tmp/177-c10-2.log`), declarado.
- E4: NV, enmienda firmada por el humano.
- El hook se movió dentro de `GeofenceEditorForm`; desviación declarada y autorizada.
Todas las desviaciones están declaradas en el reporte y autorizadas por el humano o por la spec.

## Drift reporte vs árbol
Sin drift: anclas, cuentas por fichero, diffs de producción contra las tablas R3/R4/R5, 15 hashes y total final coinciden con `progress/impl_mobile-chunky-cta-canvas-fidelity.md`. Árbol limpio salvo este fichero de review (sin trackear).

## Observaciones (no bloqueantes)
1. La aserción `expect('chunky-lip.ts useChunkyLip').not.toContain('shadow')` en R12.1/R12.2 es tautológica (compara un literal). La guarda real es el regex sobre contenido de ficheros, y la sonda S11 del reporte la puso roja. Recomendable endurecer en una feature futura.
2. R12.1 (sin clases nuevas) no tiene un `it` propio; lo cubren los guards existentes.
3. `progress/current.md` sigue siendo la plantilla vacía; el leader debe actualizarlo al cerrar.
4. Estilo: el import de `useChunkyLip` queda sin ordenar en algunos ficheros y `style` comparte línea con `className`. Cosmético.
5. Un conteo por subcadena de `chunkyLip.primary` da 18; el regex con `\b` del test da los 17 de la spec. Es una diferencia de método, no de contenido.
6. Jest no puede ver que el labio se pinte de verdad; eso lo cubre R14 (smoke en dispositivo real), pendiente del humano.
7. Mi sonda de mutación independiente sobre `chunky-lip.ts` fue bloqueada por el clasificador del entorno; no se ejecutó y el árbol no cambió. Me apoyo en las sondas S1-S14 del reporte (p. ej. S8, S11) y en que los 7 tests del hook comparan forma exacta, lo que ya fija offsetY/color por variante.

## Output de ./init.sh
No lo ejecuté (el leader lo corrió; instrucción expresa). Resultado citado de `/tmp/177-initsh.log` (HEAD 8c4b541d, exit 0, escrito 04:12:28, posterior al commit HEAD de 04:04:07):
```
Test Suites: 120 passed
Tests:       3994 passed, 3994 total
lint y typecheck verdes
Todo verde
```
