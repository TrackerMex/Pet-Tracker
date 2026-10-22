# review (post-merge): mobile-geofences-canvas-fidelity
Fecha: 2026-10-22
Veredicto: APROBADO

Alcance: solo el delta del merge `659850dc` (origin/main, 46 commits) sobre lo ya aprobado en 67f12234. origin/main == merge-base (131fde71), sin commits nuevos tras el merge.

## (1) Tests resueltos a mano: `git diff 67f12234 659850dc`
- chunky-cta-canvas-fidelity.test.ts: el delta es solo lo que aporta main (#194: fila CTA `edit-profile-save`, radio `edit-profile: 1`) y los sumandos `+ 1 // #194 R6`. Ninguna aserción debilitada ni `it` perdido; los comentarios de #189 (R5, R7, R13) y los de #191 R11 se conservan.
- Contadores recontados con grep sobre los fuentes no-test de `src/` (script en el scratchpad, por ref):

| patrón | main | #189 delta | esperado | merge 659850dc | fórmula del test |
|---|---|---|---|---|---|
| `<Button\.Label` | 19 | -2 | 17 | 17 | 35-15-1-1-1 = 17 OK |
| `Button\.Label` | 50 | -4 | 46 | 46 | 82-30-2-2-2 = 46 OK |
| `text-17` | 25 | +2 | 27 | 27 | 8+15+1+1+1+1 = 27 OK |
| `<Text ... text-accent-foreground>` | 18 | -2 | 16 | 16 | 5+11+1+1-1-1 = 16 OK |
| `rounded-16` | 28 | +3 | 31 | 31 | 26+1+1+1+2 = 31 OK |

  Frente a 67f12234 la única diferencia es +1 en text-17 / accent-fg-text / rounded-16 (el +1 de #194), coherente con las fórmulas.
- app/__tests__/layout.test.tsx: solo cambios de main (#194 R4: ruta `edit-profile`, `+ 1` en los `toHaveLength`, títulos con prefijo `#194 R4:`). Los sufijos `(enmendado por #189 R1.1)` de geofences/geofence-editor siguen en sus `it`; ninguna aserción relajada ni `it` perdido (se añaden 2).
- language-provider.test.tsx: suma `+ 7 // #194 R1 (+2); #189 R15 (+5)` (aritmética correcta: 5 de #189 + 2 de #194); el `describe('#189 R15 ...')` con su `it.each` intacto y el `it('#194 R1 ...')` añadido al final. Sin marcadores de conflicto en `src/` ni en docs/ui-guidelines.md.

## (2) Enmiendas en docs/ui-guidelines.md
- `## Enmienda #189 — Zonas seguras y Editor de zona` con `- [X] Enmienda #189 aprobada por humano` (l.843).
- `## Enmienda #194 — Editar perfil` con `- [X] Enmienda #194 aprobada por humano` (l.860).
- Las ediciones de reglas 6/12/13 y paleta de #189 (E4, rounded, receta deshabilitada, KEEP_OPACITY, `zoneCategory`) presentes en `git diff origin/main 659850dc`.

## (3) `git diff --stat origin/main 659850dc` vs alcance de #189
34 ficheros, todos de #189: docs (conventions.md +1 línea E4, ui-guidelines.md), feature_list.json (1 línea, #189 in_progress), pantallas geofences y geofence-editor (+ tests), `_layout.tsx`, `catalog.ts`, `category-palette.ts`, `header-layout.ts`, `native-styles.ts`, candados agregados enmendados (chunky-cta, design-drift, consistency-classnames, profile-canvas, alerts-canvas, alert-detail-canvas, heroui-text-size-merge, ui-copy-table, ui-language, layout, language-provider, category-palette test), `geofences-canvas-fidelity.test.ts`, progress/ y specs/mobile-geofences-canvas-fidelity. Nada ajeno.

## Verificación independiente
Corrí la suite móvil completa (jest, sin init.sh; había un jest ajeno de wt-195 en curso, no del mismo árbol): 133 suites / 4485 tests, exit 0 (aviso worker force-exit preexistente). Coincide con `progress/init-leader-189-merge.log` (exit 0; móvil 133/4485).

## Observaciones
Ninguna bloqueante. Las 8 no bloqueantes de la revisión previa siguen vigentes sin cambios.
