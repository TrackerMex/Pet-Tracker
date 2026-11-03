# review: mobile-add-reminder-chip-lip-clip (#232)
Fecha: 2026-11-03
Veredicto: APROBADO (condicionado a que el leader corra ./init.sh en verde; el reviewer no lo ejecuta por instrucción expresa, comparte LocalStack/Postgres con otros worktrees)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (el diff 67bb626c..HEAD no toca feature_list.json ni progress/current.md; los gestiona el leader)
- [x] progress/current.md: no tocado por Codex (corresponde al leader en el cierre)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (N/A: cambio solo en `mobile-pet-tracker/src/screens/add-reminder/index.tsx`)
- [x] contratos en domain: N/A
- [x] application depende de interfaces: N/A
- [x] infrastructure sin lógica de negocio: N/A
- [x] Capa móvil: solo dos constantes de estilo de módulo (`CHIP_ROW_CONTENT`, `CHIP_ROW_STYLE`) y sus 2+2 usos. Sin clases, copy, deps ni `Platform.OS` nuevos (D4)

## Checklist C4 — TDD
- [x] Cada R1-R4 tiene test que lo nombra:
  - R1: `#232 R1: %s reserva 3 px bajo los chips` (it.each, 2 filas) + `#213 R5 ... (enmendado por #232 R1)`
  - R2: `#232 R2: %s no desplaza el resto del formulario` (it.each, 2 filas)
  - R3: los it existentes `#197 R7` (Vacuna, Otro) y `#123 R5` (calendario), sin tocar sus aserciones (el diff no los toca)
  - R4: `#232 R4: la fila de Repetición no cambia` + el `#213 R5` enmendado
- [x] Historial test-primero rojo -> verde, commits separados y de un solo tipo de fichero:
  - 9b546b65 test (solo `index.test.tsx`; R1 + enmienda #213 R5 + R4 verde-de-nacimiento) -> f3998897 feat (solo `index.tsx`, `CHIP_ROW_CONTENT`)
  - 1b0c4174 test (solo `index.test.tsx`, R2) -> bfbb84ce feat (solo `index.tsx`, `CHIP_ROW_STYLE`)
  - 66faad26 docs(spec) trazabilidad. Sin rebase posterior (hashes de traceability resuelven)
  - Rojo legítimo documentado en el reporte (falta `paddingBottom` / `marginBottom`, sin errores de import). Dado que el commit de test solo toca el test y la producción anterior carece de `paddingBottom: 3`, el rojo es inevitable.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" (`grep -c pendiente` = 0; R1-R4 con hashes reales)
- [x] Commits con formato `feat|test(mobile): #232 ... (R-id)` (convención del repo con scope `mobile`)
- Observación menor, no bloqueante: la fila R3 no lista el `it` de `#123 R5` ni el `#213 R5` que la spec cita en R3; sí lista los tres `#197 R7`/`#220 R15`. Los tests existen y pasan.

## Checklist C6 — Spec aprobada
- [x] requirements.md `status: approved`, casilla humana/delegada marcada (firma 7bd8ba6c), casilla de la enmienda #213 R5 marcada
- [x] Spec intacta: `git diff 67bb626c HEAD -- specs/.../requirements.md` = 0 líneas (design y tasks tampoco)
- [x] Casilla **G2** (smoke del humano) sigue `- [ ]` sin fecha: no tocada

## Checklist C7 — Sin código huérfano
- [ ] N/A parcial: la feature no reemplaza nada; solo enmienda en sitio el pin de #213 R5.
- [x] Enmienda #213 R5: el título del `it` termina en ` (enmendado por #232 R1)`; `grep -cF "(enmendado por #232 R1)" index.test.tsx` = 1; `toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 })` y el resto de aserciones (horizontal, sin indicador, `-mr-5`, sin flex-wrap, 7/4 chips) intactas.
- [x] Anclas de la spec (Tras #232): `contentContainerStyle={{ gap: 8, paddingRight: 20 }}` = 0; `paddingBottom: 3` = 1; `marginBottom: -3` = 1; `CHIP_ROW_CONTENT` = 3; `CHIP_ROW_STYLE` = 3.
- [x] Alcance (R4 Test C): `git diff --name-only 67bb626c..HEAD` = `add-reminder/index.tsx`, `add-reminder/index.test.tsx`, `traceability.md`; nada en `src/i18n`, `src/theme`, `ui-copy-table.ts`, `docs/`. El reporte `progress/impl_...md` está sin trackear (acordado). Árbol sin cambios pendientes salvo ese fichero.

## Verificación independiente
- `bunx jest src/screens/add-reminder src/__tests__` (desde mobile-pet-tracker/): 43 suites, 1161 tests, exit 0 (coincide con el reporte: 1156 -> 1161, +5).
- Mutaciones re-ejecutadas por el reviewer, restauradas con `git checkout HEAD -- <ruta>` (árbol limpio tras ellas):
  - R1 (c) Aviso con el objeto viejo `{ gap: 8, paddingRight: 20 }`: rojo `#232 R1 advance-chips-row` y `#213 R5 enmendado`; `type-chips-row` verde (zona ciega cubierta por fila).
  - R2 (d) quitar `style` de Aviso: rojo solo `#232 R2 advance-chips-row`; `type-chips-row` verde.
- Las demás mutaciones (R1 a/b/d, R2 a/b/c, R3 por fila, R4 a/b) están registradas en el reporte con la salida de aserción; las dos ejecutadas por el reviewer coinciden con ese comportamiento. tsc y expo lint reportados en 0 bytes por Codex.

## Observaciones
Ninguna que bloquee. Pendientes fuera del gate del reviewer: `./init.sh` (leader), tablero Notion/PR a `dev`, y G2 humano (smoke en dev build, lote final).

## Output de ./init.sh
No ejecutado por el reviewer (regla del leader: comparte LocalStack/Postgres con otros worktrees). Corre el leader antes de cerrar.
