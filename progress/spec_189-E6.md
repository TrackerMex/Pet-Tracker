# spec_189-E6 — Enmienda E6 (§4.6): premisa falsa «delta cero» sobre consistency-classnames

Base de medida: `31b7a082` + WIP sin commitear de Codex (R19/R20 en el árbol). No se tocó código, tests ni
commits. Casilla de E6 sin firmar (`- [ ]`, última línea de «Aprobación»).

## Qué cambió por fichero (todos en `specs/mobile-geofences-canvas-fidelity/`)

- `requirements.md`: nueva §4.6 antes de §5 (origen, tabla de choques C1/C2, barrido M20 con comandos, tabla de
  no-choques, «Texto que E6 sustituye», colisión de nombre E5/E6 -> E7, lección, orden rojo->verde, sondas
  P-E6-1..3, lista cerrada); blockquote «Enmendado por E6» bajo el de E5 en §3; casilla E6 al final de
  «Aprobación». El texto firmado de E4/E5 no se editó en su sitio.
- `design.md`: sección «Enmienda E6».
- `tasks.md`: bloques «Enmienda E6», «H0-E6», «R19 rojo-corrección (E6)», «R22 rojo (E6)», «Cierre E6».
- `traceability.md`: filas R19 y R22 mencionan el `it` de consistency-classnames; fila nueva «E6 §4.6 | pendiente».

## Barrido (grep, no memoria)

Comandos en requirements §4.6 (M20). Resultado: 45 tests leen fuente; 16 casan algún literal de los ficheros
de E4. Choques reales: **uno** (un `it`, dos aserciones).

| # | Fichero:línea (ancla por contenido) | Actual | Nuevo | R | Arreglo |
|---|---|---|---|---|---|
| C1 | `src/__tests__/consistency-classnames.test.ts:698`, `it` «#189 R9: la hoja del Editor combina esquina continua y flex sin perderlos» | `import { CONTINUOUS_CORNER, TABULAR_NUMS } from '../../theme/native-styles';` | `import { CONTINUOUS_CORNER, KEEP_OPACITY, TABULAR_NUMS } from '../../theme/native-styles';` | R19 | rojo medido (log e7); commit de test aparte antes del verde conjunto |
| C2 | ídem `:701` | `<KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>` | idéntica con `keyboardVerticalOffset={0}` | R22.3 | rojo previsto (no medido: R22 no está en el árbol); dentro del commit rojo de R22 |

Sin cambio en ese `it`: `:699` (`style={[CONTINUOUS_CORNER, { flexGrow: 0, flexShrink: 1 }]}`) y `:700` (recuento 2).

No chocan (una línea cada uno; detalle en §4.6):
- consistency-classnames `declara las dos constantes nativas` (:278): `toContain` de los dos bloques existentes; `KEEP_OPACITY` se añade sin tocarlos.
- consistency-classnames `directUses`/`style={CONTINUOUS_CORNER}`/`TABULAR_NUMS` (:289-310, :346-360, :392-407): recuentos y regex de import con `[^}]*`; R19/R22 no añaden usos.
- consistency-classnames `card.tsx` import exacto (:312), `rounded-full` (:304), labios (:555-645): ficheros ajenos a E4.
- design-drift: import de `history` (:1197) y frases de carta; R24 va después de la mención de docs-upload del `it` de #185 R10.
- heroui-text-size-merge (pisos 197/163) y legibility: R21/R22 no añaden `text-NN` ni componentes heroui.
- ui-language + ui-copy-table + language-provider: `t('geofenceEditor.title')` exactamente 2 en el Editor; R22 no añade ni quita `t()`.
- alert-detail-canvas-fidelity (expo-blur, 3 ficheros), profile/alerts-canvas-fidelity (inventarios por clase), empty-state (EmptyState x2, prohibidos): sin impacto.
- layout.test.tsx, chunky-cta, geofences-canvas-fidelity: ya en la lista de E4.
- detail-stack(.guard), font-registration, welcome/docs/docs-upload-form/pairing/home/map: sin literal afectado.

## Cambios de contrato

Ninguno. Los dos literales son valores que E4 ya prescribe; el test solo los sigue.

## Para el leader (decisiones y avisos)

1. **Desvío respecto a tu instrucción**: la línea 701 (C2) va en el commit **rojo** de R22, no en el verde. El verde
   es solo producción y docs por regla de E4/C4; el efecto es el mismo (el candado cambia junto a la producción de R22
   y el rojo precede). Dilo a Codex.
2. **C1 va en un commit de test aparte**, antes del verde conjunto R19+R20 y tras los dos commits de E5. Es rojo contra
   producción commiteada, pero con el WIP de Codex en el árbol sale verde: para demostrar el rojo hay que apartar solo la
   producción (`git stash push -m "189-E6-wip" -- mobile-pet-tracker/src/screens mobile-pet-tracker/src/theme`; mirar
   `git stash list` antes de soltar, el stash es del repo). Alternativas descartadas: mismo commit que el verde (mezcla test
   y producción) y commit ya verde (nace verde).
3. **Restricción nueva de forma sobre R22**: la etiqueta de apertura del `KeyboardAvoidingView` debe quedar en una línea,
   atributos `testID`, `className`, `behavior`, `keyboardVerticalOffset` en ese orden, sin otro (C2 la fija como texto;
   prettier partiendo la línea la rompería; P-E6-3 lo prueba). Inclúyelo en el handoff de R22.
4. **Nombre E7**: toda referencia a «enmienda E5/E6» por geometría fuera de ±8 dp (R23.2, DE4-2, design.md) se lee ahora
   «enmienda E7»; anotado en §3 y §4.6, sin editar el texto firmado.
5. **Trampas ya conocidas que siguen vigentes** para el handoff: el candado R18 de `geofences-canvas-fidelity` no exime
   `#NNN` (no poner comentarios `#189` en las dos pantallas); R22 no debe tocar el recuento de `t('geofenceEditor.title')`
   (2); la nota de carta de R24 va después de la mención de docs-upload del `it` de #185 R10 en design-drift.
6. `design-drift.test.ts` y `heroui-text-size-merge.test.ts` siguen fuera de la lista con delta esperado cero; el barrido
   M20 se repite al cerrar R22 y el handoff debe pedir el resultado pegado en `progress/impl_mobile-geofences-canvas-fidelity.md`.
7. Gate: E6 necesita firma humana (casilla propia) antes de reanudar el verde de R19/R20.

## Lista cerrada de ficheros para Codex (E6)

`mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`, solo el `it` «#189 R9: la hoja del Editor combina
esquina continua y flex sin perderlos» (C1, C2 y los sufijos `(enmendado por E4 R19)` / `(enmendado por E4 R22)`).
