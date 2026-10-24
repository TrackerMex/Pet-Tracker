# review: mobile-profile-photo-hero-canvas (#196)
Fecha: 2026-10-24
Veredicto: APROBADO (0 bloqueantes, 8 no bloqueantes)

Base revisada: worktree `/home/claude/sites/Pet-Tracker-wt-196`, branch
`feature/196-mobile-profile-photo-hero-canvas`, HEAD `4e8c3134` (merge de
origin/dev en la feature, 18:56). Diff neto `git diff dd46322e 4e8c3134`:
25 ficheros, +3947 / -264. `dd46322e` es el merge-base con origin/dev.
Árbol limpio salvo dos no rastreados de `progress/`: el handoff y este
reporte. El reviewer no editó código ni la spec y no commiteó nada. Las
mutaciones se plantaron en el árbol y se revirtieron con `git checkout --`.
Después, `git diff --stat` y `git diff --cached --stat` salen vacíos y HEAD
sigue en `4e8c3134`.

Rango real de la implementación: los pares test/feat de `1a82f15c` a
`b4141f3e`, más el cierre documental `3440fcc4`. `3440fcc4` es solo docs y
no es la implementación (ver N5).

## Gate (./init.sh)

El reviewer no ejecutó `./init.sh`: el leader lo reservó para sí. Se leyó el
log del leader,
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-196b.log`.
La corrida empezó a las 18:57, posterior al commit HEAD (18:56:27), así que
mide `4e8c3134`.

- backend: 187/187 suites, 1474 tests verdes
- infra: 2/2 suites, 14 tests
- mobile: 148/148 suites, 5084/5084 tests, 1 snapshot
- e2e: 30/33 suites (3 skipped), 468 passed, 8 skipped
- lint y typecheck verdes; «Todo verde»; `exit=0`
- 0 líneas `^FAIL`. El aviso de force-exit del worker es preexistente.

El rojo anterior, `init-196-red1.log`, fue el flake del tinte `#0D1117` de
BackButton. Su causa está corregida por #207 y no se reprodujo en
`init-196b.log`.

## Checklist C1 — Harness
- [x] N/A: no es la primera feature del proyecto

## Checklist C2 — Estado coherente
- [x] Ninguna feature `in_progress` en `feature_list.json`; #196 sigue en `spec_ready` (init.sh no aborta en :156)
- [x] `progress/current.md` es la plantilla, sin sesión colgada

## Checklist C3 — Arquitectura
- [x] Solo se cambia la capa de presentación móvil: `src/screens/profile/index.tsx` y `src/components/pet-hero-header.tsx`
- [x] Sin imports nuevos de infraestructura ni de clientes en componentes. Perfil sigue leyendo por TanStack Query: el `it` `#87 R16` está verde en el gate
- [x] Se reutilizan los componentes compartidos `PetHeroHeader`, `PetSwitcher` (`variant="glass"`), `ToggleSwitch`, `BubblePop`, `HomeEntrance` y `useChunkyLip`. No hay un componente paralelo nuevo
- [x] El catálogo i18n no cambia (R10, filas 15, 18, 23 y 24)

## Checklist C4 — TDD
- [x] Cada R1–R11 tiene al menos un `it` que nombra `#196 R<n>`, con los títulos que da la spec. Están verificados en `T`, en `pet-hero-header.test.tsx`, en `profile-photo-hero-canvas.test.ts`, en `tab-headers-canvas.test.ts` y en `hero-header-amendments.test.ts`
- [x] El historial va de rojo a verde. Cada commit `test(#196)` toca solo tests y cada `feat(#196)` solo producción. Excepción prescrita por la spec: el verde R11 `a5df30ac` añade `docs/ui-guidelines.md` junto con el ajuste de K41
- [x] Los rojos fallan por aserción. En los logs del implementer constan 0 `ReferenceError`, 0 `TypeError` y 0 `SyntaxError` en los rojos:

  | Rojo | Fallos |
  |---|---|
  | R3 | 1 |
  | R11 | 2 |
  | R1+R4 | 31 (confirmación: 9) |
  | E6–E8 | 25 |
  | R2+R5 | 18 |
  | E11–E12 | 14 |
  | R6 | 4 |
  | R7 | 1 |
  | R8 | 4 |

  En R7 solo falla el pulgar de `ToggleSwitch`. Los dos `it` de dirección son candados de regresión y nacen verdes por diseño.
- [x] Las erratas aplicadas al test preceden a su verde: `53d557f4` y `8296caef` van antes de `b646864e`; `dbe46081` y `3e80e56c` antes de `9845117e`; `f82c511a` antes de `38bf092e`
- [x] Los requisitos de verificación nacen verdes (D14): R9 en `2dcb5957` y R10 en `b4141f3e`. Las mutaciones del reviewer los cierran (C4b, tabla de abajo)
- [x] No hay candados tautológicos. R4 y R5 comparan el estilo del labio con el hook real, y `chunkyLip.primary` es `lipStyle({ offsetY: 4, color: lip })`, un valor no trivial. K31 y K32 lo cubren además por inventario de fuente. R10 lee canvas y producción con `readFileSync` en cada fila; no compara constantes consigo mismas
- [x] Sin mocks `virtual` nuevos en el diff neto
- [x] Literales de copy: los textos de R1, R5 y R6 salen del catálogo, y R10 los fija contra los artboards (filas 15, 18, 23 y 24)

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente»; R1–R11 están en «implementado y verificado»
- [x] Todos los hashes citados existen en `dd46322e..4e8c3134`. El merge `4e8c3134` vino después de la trazabilidad, pero merge no es rebase: los hashes siguen válidos
- [x] Los commits siguen `test(#196): R<n> …` / `feat(#196): R<n> …`, y los de spec siguen `chore(spec): errata #196 …`
- [ ] Párrafo de cierre caducado, no bloqueante (N1)

## Checklist C6 — Spec aprobada
- [x] `requirements.md` y `traceability.md` llevan `status: approved`
- [x] Las casillas de aprobación 1 y 2 están marcadas `[x]`. La firma es delegada (`b6ac8d26`, mandato del humano del 2026-10-23), y las erratas E1, E6–E10, E11–E12 y E13 tienen su commit de firma
- [x] La casilla del smoke Android sigue `[ ]`, como corresponde: la cierra el humano (R1–R7 y R9)

## Checklist C7 — Sin código huérfano
- [x] `PetAvatar`, `profile-pet-avatar`, `profile-hero-skeleton` y `profile-entrance-hero` solo quedan en aserciones de ausencia, más el marcador histórico `#168` en `src/__tests__/hero-header-amendments.test.ts:142`, que se conserva a propósito
- [x] `variant="avatars"` sale de Perfil y sigue en `pet-switcher` para Inicio (D6)
- [x] `Switch` ya no se importa en Perfil; lo sustituye `ToggleSwitch`
- [x] Los tests retirados o enmendados llevan `(enmendado por #196 Rn)` y no queda ningún `it` que ya no verifique nada

## Checklist C8 — Carta de UI (`docs/ui-guidelines.md`)
- [x] Sin hex, sin clases `[...]` y sin `StyleSheet.create` en P y H: grep limpio, y `#173 R15` está verde
- [x] Safe areas:
  - con hero, el inset superior lo gestiona `PetHeroHeader`;
  - sin hero, `paddingTop: insets.top + 12` (`index.tsx:355`);
  - abajo, `paddingBottom: insets.bottom + 96`
- [x] Skeletons con tamaño: `pet-hero-skeleton` y `pet-info-skeleton` (`h-52`)
- [x] Objetivo táctil de 44 o más:
  - cámara `size-11` + `TOUCH_SLOP`;
  - píldora de añadir con hero `h-11`;
  - `profile-add-pet` sin hero `h-9` + `TOUCH_SLOP`, igual que antes de #196
- [x] Animación en el hilo de UI: se reutilizan `HomeEntrance`, `BubblePop` y la entrada del hero (Reanimated). No hay `Animated` de RN nuevo
- [x] La enmienda R11 de la carta, «PetHeroHeader solo en Inicio y Perfil», está aplicada y candada (K41 y `tab-headers-canvas`)
- [ ] Sin feedback de pulsación en `change-photo` y `profile-add-pet`, no bloqueante (N3)

## R-ids

| R | Tests | Rojo | Verde | Cierre del reviewer |
|---|---|---|---|---|
| R1 | `T` › `#196 R1: en la rama $name monta el hero = $hero`, `#196 R1: pinta nombre y chips dentro del pie del hero` | 47a0325a; 53d557f4; 8296caef | b646864e | M6, M9 |
| R2 | `T` › 4 `it` `#196 R2` | 225a291e; dbe46081; 3e80e56c | 9845117e | M5, M6, M8 |
| R3 | `pet-hero-header.test.tsx` › 3 `it` `#196 R3` | 1a82f15c | 9fac05f1 | M10 |
| R4 | `T` › 3 `it` `#196 R4` | 47a0325a; 53d557f4; 8296caef | b646864e | M1 |
| R5 | `T` › 4 `it` `#196 R5` | 225a291e; dbe46081; 3e80e56c | 9845117e | M7 |
| R6 | `T` › 2 `it` `#196 R6` | 4910a849; f82c511a | 38bf092e | M4 |
| R7 | `T` › `#196 R7: el tema usa ToggleSwitch con pulgar`, `#196 R7: con tema $0 el interruptor pide $1` | 8bafd7fe | d97438ca | M2 |
| R8 | `T` › `#196 R8: el icono de $0 usa trazo 2.2` | 70a22d91 | 91ebce03 | M3 |
| R9 | `T` › 2 `it` `#196 R9` (nacen verdes) | 2dcb5957 | n/a | M4, M6, M7 |
| R10 | `profile-photo-hero-canvas.test.ts`: 24 filas + cobertura | b4141f3e | n/a | M1, M5, M8 |
| R11 | `tab-headers-canvas.test.ts` › 2 `it` `#196 R11`; K41 en `hero-header-amendments.test.ts` | bebe426d | a5df30ac; b646864e | gate verde |

Las erratas E1–E13 se verificaron contra el código y los tests:

- E6: los nodos bajo opacidad 0 se aseveran con `toBeOnTheScreen()`.
- E8: la cámara mantiene `disabled={photoUploading}` junto a `accessibilityState.disabled`; se comprobó leyendo la fuente (`index.tsx` ~342), ver N7.
- E11–E12: el labio se lee antes del render interactivo.
- E13: firmada tras el merge de dev (`cf0bfd69`).

K1–K41 constan en el inventario (`progress/inventory-audit_mobile-profile-photo-hero-canvas.md`). Los afectados por las mutaciones se pusieron rojos (tablas de abajo).

## Fidelidad al canvas

R10 fija 24 literales de los tres artboards congelados (`Perfil`, `PerfilCuenta` y `PerfilNotificaciones`) y cada fila lee los dos ficheros. Las desviaciones V1–V8 están documentadas en `requirements.md`. M1, M5 y M8 confirman que R10 muerde: cambiar el literal de producción pone roja su fila.

## Mutaciones (C4b)

Lote 1: `T` + R10 + relacionados.
Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev196-mut1.log`.
Resultado: 21 failed / 196 passed, todos por aserción.

| # | Mutación | Rojo |
|---|---|---|
| M1 | cámara `bottom-24` → `bottom-20` | `#196 R4` cámara («Expected absolute bottom-24 right-5»); R10 fila 7 |
| M2 | dirección del interruptor invertida | R7 `it.each` (2 filas); los tres `R4: toggle persiste` |
| M3 | Wifi `strokeWidth` 2.2 → 2 | R8 fila `pairing-link` |
| M4 | índice de entrada de sign-out 4 → 5 | R6 («Expected 4 Received 5»); R9 (6 filas); `#173 R12` (2) |
| M5 | trazo de Plus 2.6 → 2.4 | R2 trazo (las 2 ramas); `#173 R5`; R10 fila 5 |

Lote 2: `T` + `pet-hero-header.test` + `profile-canvas-fidelity` + R10.
Log: `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/rev196-mut2.log`.
Resultado: 15 failed / 293 passed, 0 TypeError.

| # | Mutación | Rojo |
|---|---|---|
| M6 | `showHero` falso con la lista pendiente (`pets.data !== undefined && …`) | R1 fila «mascotas pendientes»; `#196 R2` slot pendiente; K5; K11 pendiente; R9 fila pendiente |
| M7 | índice del aviso 0 → 1 | `#196 R5` aviso con hero; `#196 R9` aviso índice 0; `#99 R3` (K9) |
| M8 | `variant="glass"` → `avatars` | `#196 R2` hero; `#173 R4` (K4); K26 en `profile-canvas-fidelity`; R10 fila 6 |
| M9 | `paddingTop` +12 → +16 | R1 filas «sin mascotas» y «error de mascotas» |
| M10 | caption sin la guarda `pet &&` (`pet-hero-header.tsx:224`) | `#196 R3: con caption y sin mascota el pie sigue en skeleton` |

Todas las mutaciones están revertidas y el árbol queda limpio.

Una reproducción adicional de rojos en el árbol mezcló estados incompatibles: P de `8bafd7fe` con H de `1a82f15c`, que es anterior al caption. Dio 46 fallos ajenos al R-id y se descartó como evidencia. También se revirtió, y el diff quedó vacío.

## Bloqueantes

Ninguno.

## Observaciones (no bloqueantes)

- **N1. Párrafo de cierre de `traceability.md` caducado (líneas 50–53).** Dice «144 suites, 143 passed / 1 failed; 4 823 passed / 1 failed … #0D1117» y «El usuario autorizó expresamente esta excepción». El gate vigente (`init-196b.log`) es 148/148 y 5084/5084, sin excepción. El leader debería reescribirlo con las cifras de su gate al cerrar.
- **N2. Formato en `mobile-pet-tracker/src/screens/profile/index.tsx`:**
  - bloque `titleRow` mal indentado (274–298): el `<View` empieza a la altura de `const`;
  - `{!showHero ? titleRow : null}` infraindentado (356);
  - `<HomeEntrance index={0} testID="profile-entrance-notice"><View …>` en una sola línea (359);
  - tres líneas en blanco sueltas (373–375);
  - fragmento `<>` que envuelve un único `Skeleton pet-info-skeleton` (392–396).

  Móvil no tiene prettier y lint está verde. Solo es legibilidad.
- **N3. Sin feedback de pulsación en `change-photo` (337–351) ni en `profile-add-pet`.** Ya era así antes de #196, y la spec prescribe estos literales sin pressed. Es candidato a deuda de carta, no a esta feature.
- **N4. Títulos de R7 y R8 sin interpolar.** `'#196 R7: con tema $0 el interruptor pide $1'` y `'#196 R8: el icono de $0 usa trazo 2.2'` usan `it.each` con arrays primitivos, donde Jest solo interpola `%s`. Los títulos salen repetidos y literales. Los prescribe la spec tal cual y nombran su R-id, así que C4 se cumple. Conviene `%s` en futuras specs.
- **N5. Premisa del leader sobre el rango.** `3440fcc4` es solo el cierre documental. La implementación es la secuencia de `1a82f15c` a `b4141f3e`.
- **N6. origin/dev avanzó a `a1f4a4cb` (#202 mergeado) tras el merge-base `dd46322e`.** Se solapan con #196:
  - `docs/ui-guidelines.md`
  - `feature_list.json`
  - `alerts-canvas-fidelity.test.ts`
  - `chunky-cta-canvas-fidelity.test.ts`
  - `design-drift.test.ts`
  - `profile-canvas-fidelity.test.ts`

  Antes de la PR, el leader debe mergear dev, volver a medir los candados agregados y repetir el gate. Este veredicto cubre solo `4e8c3134`.
- **N7. E8 (`disabled` de la cámara durante la subida)** se verificó leyendo la fuente (`index.tsx` ~342: `disabled={photoUploading}` y `accessibilityState`) y por los `it` `#184 R1`/`#168 R4` verdes en el gate. No se mutó por separado.
- **N8. K35 sin efecto observable en jest**, como anticipa E5. Queda cubierto por el smoke Android del humano.

## HEAD revisado

`4e8c3134` (branch `feature/196-mobile-profile-photo-hero-canvas`).
