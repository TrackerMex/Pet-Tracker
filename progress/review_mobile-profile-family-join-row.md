# review: mobile-profile-family-join-row (#229)
Fecha: 2026-11-03
Veredicto: APROBADO

Base del diff: af7cf00b (H0 firma 910983c5). Rama feature/229-mobile-profile-family-join-row, HEAD f49b03d1.
Reserva: `./init.sh` NO lo corrió el reviewer por instrucción del leader; lo corre el leader antes del cierre (el veredicto lo presupone verde). Jest acotado sí lo corrí yo (ver abajo).

## Checklist C2 — Estado coherente
- [x] Ninguna feature `in_progress` en feature_list.json del worktree (#229 sigue `spec_ready`: el leader lo pasa a in_progress/done en su cierre; no es defecto de Codex).
- [x] progress/current.md sin sesión #229 propia; lo actualiza el leader al cerrar.

## Checklist C3 — Arquitectura
- [x] Cambio solo de presentación en `src/screens/profile/index.tsx` (capa móvil), +1 −3 (`git diff --numstat af7cf00b..HEAD` = `1	3`).
- [x] Sin imports, capas, copy, hex, StyleSheet ni clases nuevas salvo el prefijo `flex-1 ` en el Pressable de `ProfileWideTile`.
- [x] `git diff --name-only af7cf00b..HEAD` lista solo `index.tsx`, `index.test.tsx` y `specs/mobile-profile-family-join-row/traceability.md`. Sin cambios en package.json / bun.lock / backend (0 líneas de diff).

## Checklist C4 — TDD
- [x] Cada R tiene test que lo nombra: R1 (it.each x2), R2, R3 (it.each x2), R4, R5 y R6 (3 `it` enmendados). 7 nuevos + 3 enmendados = 10 casos con `-t '#229'`.
- [x] Historial test-primero. Re-medí los rojos reconstruyendo el estado de cada commit de test sobre su producción previa:
  - 832cead7 + producción af7cf00b: R1 x2, R4 y R5 rojos por aserción (4 con `-t '#229'`; los otros 2 de los 6 del reporte son los `it` antiguos enmendados solo en la clase, que no llevan "#229" en el título en ese commit), sin "Test suite failed to run". R3 nace verde (declarado).
  - 915f5ded + producción c1a2375c: 4 rojos por aserción (grid, #214 R4, #214 R6, #229 R2).
  - 192a2ecc: nace verde, autorizado por el leader, solo 2 líneas (`toHaveLength(3)` y espera a `profile-links-row-2`). Justificado y declarado en el reporte y en traceability.
- Mutaciones re-plantadas por mí (todas con aserción roja, revertidas con `git checkout HEAD -- <ambos>`; tras cada una `git diff --cached --quiet && git diff --quiet` limpio):

| Mutación | Resultado |
|---|---|
| R1(a) quitar flex-1 del componente | 6 rojos (R1 x2, R4, R5, #214 R4/R6) |
| R1(c) flex-1 solo para rose | R1 join-pet-link, R4, R5, #214 R6 rojos; R1 members-link verde (zona ciega bien cubierta) |
| R1(d) flex solo en style | 6 rojos |
| R2(a) fila 3 separada | 4 rojos (grid, #214 R4/R6, R2) |
| R2(b) Unirme antes de Familia | 3 rojos (#214 R4/R6, R2) |
| R3(c) cuarto hijo `<View />` | 2 rojos (R3 x2), gracias al `toHaveLength(3)` del commit extra |
| R4(b) copia por rama sin flex-1 en sin-mascota | 1 rojo (solo R4); los controles R1 siguen verdes |
| R5(a) items-start en fila 2 | 3 rojos (R5, R2, #214 R4) |
| R5(d) h-20 en tarjeta | 6 rojos |
| R5(e) flex-1 repetido | 6 rojos |
| R6(a) `t('profile.membersLink')` extra en ProfileWideTile | rojo en `#65 R18` y `#214 R22` (más otros tests de copy de Perfil) |
| R6(b) revertir la aserción 2+1 a 2+2 | 1 rojo (el `it` de dos filas de dos tiles) |

## Checklist C5 — Trazabilidad
- [x] traceability.md con R1–R6, ninguna fila "pendiente"; tests referenciados existen y nombran su R-id.
- [x] Commits `test(mobile)/feat(mobile)/docs(spec): #229 … (R-ids)`. Seis commits (cinco de cadena + traceability), el extra explicado.

## Checklist C6 — Spec aprobada
- [x] requirements.md `status: approved`, casilla humana/firma delegada marcada.
- [x] Enmienda de #214 R4 y R6 con casilla propia marcada en §Aprobación.
- [x] G2 (smoke humano) sigue sin marcar, como corresponde.

## Checklist C7 — Sin código huérfano
- [x] Se elimina `profile-links-row-3` (ancla `testID="profile-links-row-3"` = 0); los tests antiguos que lo usaban fueron enmendados (3 `it` con sufijo `(enmendado por #229 R…)`).

## Anclas "Tras #229" (grep -cF -- sobre index.tsx)
`flex-row items-center gap-2.5 rounded-tile p-3`=1; `flex-1 flex-row items-center gap-2.5 rounded-tile p-3`=1; `flex-1 gap-1.5 rounded-tile p-3`=1; `testID="profile-links-row-`=5; `-row-2"`=1; `-row-3"`=0; `{joinPetLink}`=2; `ChevronRight`=2; `ProfileWideTile`=3. `grep -cF "(enmendado por #229 R" index.test.tsx` = 3. Todas coinciden. Sin `StyleSheet` en el test.

## Verificación independiente (jest acotado, uno a la vez, árbol limpio)
- `bunx jest src/screens/profile`: 1 suite, 226/226 verdes.
- `bunx jest src/__tests__` (guards: consistency-classnames, profile-canvas-fidelity, legibility-classnames, design-drift, ui-language, etc.): 42 suites, 1037/1037 verdes.
- Total 1263 = T0 1256 + 7 casos nuevos. Sin timeouts en mi corrida.

## Observaciones
- Ninguna que bloquee. Pendiente fuera del reviewer: `./init.sh` por el leader; G2 y apertura de PR a `dev`.
- Árbol dejado como estaba: solo `progress/impl_mobile-profile-family-join-row.md` untracked (más este review); sin cambios en tracked, índice vacío.

## Output de ./init.sh
No ejecutado por el reviewer (instrucción del leader: lo corre el leader).
