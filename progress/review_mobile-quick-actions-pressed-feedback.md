# review: mobile-quick-actions-pressed-feedback (#136)
Fecha: 2026-09-29
Veredicto: **APROBADO** (R1 a R4). R5, la prueba de humo en un dev build de
Android, queda pendiente del humano y no cuenta en este veredicto.

- Commit revisado: `86369a724fb856dfa81c58eb50649ede6609e515` (HEAD de
  `feature/136-mobile-quick-actions-pressed-feedback`).
- Base: `073fa6cb` (merge-base con `origin/main`).
- Firma de la spec: `3bddbf79` (vía Notion).
- Commits de Codex: `f3a912ce` (rojo R1), `0634eaa8` (rojo R2), `3bdb4c96`
  (rojo R3), `6146ae0e` (verde común), `9e77b2c6` (docs R4).
- Dónde se midió:
  - `init.sh` lo corrió el leader en el árbol principal. Yo leí su log.
  - Rojos, verdes y sondas los medí yo en un `git worktree` desechable de
    mi scratchpad, en `86369a72` desacoplado, con `node_modules` enlazado por
    symlink y `test ! -e .expo/types/router.d.ts` antes de cada corrida.
  - Borré la caché de perf de jest (`perf-cache-*`) antes de cada corrida.
  - Al terminar, el worktree se eliminó con `git worktree remove`. El árbol
    principal sigue limpio y en `86369a72`.

## Checklist C2: estado coherente
- [x] Solo una feature está `in_progress`: `git show 86369a72:feature_list.json`
  da `[(136, 'in_progress')]`.
- [x] `progress/current.md` está actualizado con la sesión activa de #136.
  El último commit, del leader, anota #139 de Backend y #140 como el
  siguiente id.

## Checklist C3: arquitectura
- [x] `domain` sin imports de `infrastructure`: no aplica, porque el cambio es
  solo de presentación móvil (`src/screens/home/index.tsx`).
- [x] Repositorios y contratos de `domain` son interfaces puras: no aplica,
  sin cambios.
- [x] `application` depende de interfaces: no aplica, sin cambios.
- [x] `infrastructure` sin lógica de negocio: no aplica, sin cambios.
- [x] El diff de producción es solo la receta. Según
  `git diff --numstat origin/main...HEAD` da `4 1` en la Home, sin cambios
  de imports.
- [x] `collar-pair-link` sigue intacto (es #138):
  `grep -cxF '                      style={CONTINUOUS_CORNER}'` da 1.

## Checklist C4: TDD
- [x] Cada R-id con test lo nombra:
  - `#136 R1`: el `it` nuevo y 4 comentarios `// #136 R1:`.
  - `#136 R2`: el comentario del literal enmendado de `#81 R3`.
  - `#136 R3`: tres comentarios en el test de consistencia.
  - R4 y R5 no tienen test propio, declarado en requirements §Qué firma,
    punto 10.
- [x] El historial va test primero, con rojo natural (vía a):
  - Tres commits `test(mobile)` que tocan solo su fichero de test.
  - Un `feat(mobile)` que toca solo la Home.
  - Un `docs(mobile)` que toca solo impl y traceability.

Rojos y verde, re-medidos en mi worktree:

| Commit | Qué corrí | Resultado | Vía |
|---|---|---|---|
| `f3a912ce` | el test de la Home | exit 1, 1 fallido / 166 pasados: `#136 R1` | `toEqual` en la línea 2709 (`- "opacity": 1`) |
| `0634eaa8` | el test de la Home | exit 1, 2 / 165: `#81 R3` (2693) y `#136 R1` (2714) | ambos por `toEqual` |
| `3bdb4c96` | el test de consistencia | exit 1, 2 / 51: `#62 R14 › …sus 1 esquinas` (287) y `#98 R10` (390) | ambos por `toHaveLength`, Expected 1 / Received 2 |
| `86369a72` | los dos tests | exit 0: 220 / 220 (Home 167 / 167, consistencia 53 / 53) | verde |
| `86369a72` | la suite móvil completa, vía `init.sh` | 86 suites / 1609 tests / 1 snapshot | verde |

Todos los rojos son por aserción; ninguno es por consulta.

Los blobs finales coinciden con tasks.md §R4.6:
- Home: `cb61d0c6`.
- Test de la Home: `04135c8e`.
- Test de consistencia: `e62f88ad`.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única aparición es la
  frase de regla de la línea 23, no una fila.
  - R1, R2 y R3 citan cada uno su rojo propio (`f3a912ce`, `0634eaa8`,
    `3bdb4c96`) y el mismo verde, `6146ae0e`.
  - R4 cita «no aplica» / `6146ae0e` (verde común).
  - R5 cita «no aplica» / «no aplica: casilla de R5».
  - `git merge-base --is-ancestor <hash> 86369a72` da exit 0 para los
    cuatro hashes.
- [x] Los commits siguen `tipo(scope): desc (R-ids)`:
  - `test(mobile): … (R1)`, `(R2)` y `(R3)`;
  - `feat(mobile): dim each quick action tile while pressed (R1,R2,R3)`;
  - `docs(mobile): … (R4)`.

## Checklist C6: spec aprobada
- [x] `requirements.md` tiene `status: approved` y
  `[x] Aprobado por humano (fecha: 2026-09-29)`.
- [x] Entre `a3fd8974` y `3bddbf79` solo cambian el frontmatter y la casilla.
- [x] Desde la firma, la spec solo ha cambiado en los hashes de
  traceability (`9e77b2c6`).

## Checklist C7: sin código huérfano
- [ ] Componentes o módulos reemplazados eliminados.
- [ ] Sus tests eliminados.
- [x] N/A: esta feature no reemplaza nada existente, solo cambia el `style`
  de los tres tiles.

## Checklist C8: UI móvil conforme a la carta
- [x] Grep-clean: las líneas añadidas en `073fa6cb..86369a72 -- mobile-pet-tracker/`
  no tienen hex, `-[`, `StyleSheet` ni shadow o elevation (grep sin hits,
  exit 1). `grep -ci stylesheet` en la Home y en su test da 0 y 0.
- [x] Dimensiones y safe areas: sin cambio. La feature no toca el layout.
- [x] Skeleton: no aplica, porque la rejilla no tiene estado de carga propio.
- [x] Componentes compartidos: la receta es la función de `style` que el repo
  ya usa en cinco sitios, y reutiliza `CONTINUOUS_CORNER`. No hay fork local.
- [x] Feedback pressed y target de 44pt:
  - Cada tile baja a 0.8 al pulsarse; `#136 R1` lo prueba en los tres.
  - `min-h-11` y `flex-1` no cambian (`#81` intacto: 11 menciones antes y
    11 después).
- [x] Animaciones nuevas: ninguna. El cambio es instantáneo; la animación
  queda descartada en design §Alternativas.
- Skills de Codex conformes al handoff: cargó `building-native-ui` y
  `appllama-app-design-skill`, y no cargó `animate-expo`, como pedía el
  handoff.

## Cifras de candado (tasks.md §R4.4), re-medidas
La base se midió sobre `git archive 073fa6cb` y el final sobre el worktree
en `86369a72`. Todas coinciden con la tabla:

| Qué cuenta | Base | Final |
|---|---|---|
| `style={CONTINUOUS_CORNER}` en la Home | 2 | 1 |
| collar | 1 | 1 |
| `...CONTINUOUS_CORNER,` | 0 | 1 |
| `opacity: pressed ? 0.8 : 1` | 2 | 3 |
| `{QUICK_ACTIONS.map(` | 1 | 1 |
| `<Icon size={24}` | 1 | 1 |
| stylesheet | 0 y 0 | 0 y 0 |
| uso directo en el repo | 33 | 32 |
| `#136` en el test | 0 | 7 |
| `#136 R[1-3]` en el test | 0 | 7 |
| `#136 R3` y `#136` en consistencia | 0 y 0 | 3 y 3 |
| `^describe(` | 41 | 41 |
| `#81 R` | 11 | 11 |
| responderGrant | 4 | 6 |
| responderTerminate | 0 | 2 |
| `toEqual({ borderCurve: 'continuous' })` | 1 | 0 |
| `-\[` | 0 | 0 |

Además (tasks.md §R4.5):
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo los
  3 ficheros.
- `git diff --exit-code` sobre `package.json`, `bun.lock`, `catalog.ts` y
  `language-provider.test.tsx` da 0.

## Candados no tautológicos
- `#136 R1` y `#81 R3` comparan el `style` entero con `toEqual` contra
  literales escritos a mano.
- El test no importa la Home ni `CONTINUOUS_CORNER` para construir esperados.
- `#136 R1` recorre una tabla literal de los tres `testID`. En cada vuelta
  comprueba:
  - el reposo;
  - el pulsado por `responderGrant`, con los otros dos tiles en 1 (vía
    `screen.getByTestId(otherID)`);
  - la suelta por `responderTerminate` dentro de `waitFor`.

## Sondas (tasks.md §Sondas): 17 de 17 con el veredicto exigido
Todas las sondas se corrieron sobre los dos tests (220). Cada blob mutado
coincide con la tabla de la spec. Cada restauración volvió a
`home=cb61d0c6`, sin status y sin nada en el índice.

| Sonda | Blob | Resultado | Frame |
|---|---|---|---|
| t0 | 6d701cc4 | rojo 2 (`#81 R3` y `#136 R1`), 218 pasados | 2693 y 2714 |
| t1 | 9b755110 | rojo 2 | 2693 y 2733 |
| t2 | f5254f92 | rojo 2 | 2693 y 2733 |
| rest09 | 8bfc769e | rojo 2 | 2693 y 2714 |
| stray | 932c6c13 | rojo 2 | 2693 y 2714 |
| nocorner | c4d404fe | rojo 2 | 2693 y 2714 |
| nostyle | 82c9a371 | rojo 2 | 2693 y 2714 |
| array | 28cc7f5e | rojo 2 | 2693 y 2714 |
| nopress_t0 | e17d4e5c | rojo 1 (`#136 R1`), 219 pasados | 2726 |
| nopress_t1 | 73dc6a81 | rojo 1 | 2726 |
| nopress_t2 | 69f56555 | rojo 1 | 2726 |
| pressed07 | 3541059e | rojo 1 | 2726 |
| pressed07_t1 | 6fbb9451 | rojo 1 | 2726 |
| shared | fde29fb3 | rojo 1 | 2733 (otros tiles) |
| sticky | 2c8fe39d | rojo 1 | 2748 (`waitFor`) |
| collar | 0d439ebc | test de la Home verde 167; consistencia roja 2 (`#62 R14` y `#98 R10`) | 287 y 390, por `toHaveLength` |
| android_only | 97ceecbb | **verde** 220 / 220 | punto ciego declarado, lo cubre R5 |

- Todos los rojos son por aserción (`toEqual` o `toHaveLength`); ninguno cae
  en la consulta.
- En `collar`, el rojo sale solo en el test de consistencia.

## Sondas propias en zona ciega

| Sonda | Mutación | Blob | Resultado |
|---|---|---|---|
| own_pressed_scale | añade `...(pressed ? { transform: [{ scale: 0.97 }] } : {}),` tras la opacidad | d65c986c | rojo 1, `#136 R1` en 2726 (pulsado), por `toEqual` |
| own_last_tile_rest | `opacity: pressed ? 0.8 : index === 2 ? 0.99 : 1,` | 4eaa4389 | rojo 2, `#81 R3` (2693) y `#136 R1` (2733), por `toEqual` |
| own_literal_corner | `...CONTINUOUS_CORNER,` pasa a `borderCurve: 'continuous',` | 85213be0 | **verde** 220 / 220, y en la suite completa 86 / 1609 / 1, exit 0 |
| own_active_class | añade `active:opacity-50` al `className` de los tiles | a008c641 | **verde** 220 / 220, y en la suite completa 86 / 1609 / 1, exit 0 |

Los dos verdes están dentro de lo firmado (ver Observaciones 2 y 3).

## Observaciones
Ninguna bloquea el veredicto. Son constancias con sus límites.

1. **`origin/main` se movió durante la revisión.** Ahora es
   `70e1fdcb` (merge de la PR #175, feature #133); la merge-base sigue
   siendo `073fa6cb`.
   - Comprobación: `git merge-tree --write-tree --name-only origin/main 86369a72`.
     - Da exit 1, con conflictos solo en `STATUS.md` y `feature_list.json`,
       que son ficheros de harness y le tocan al leader.
     - La parte móvil del merge (`f2e0d707`) difiere de `86369a72` solo en
       `src/hooks/use-push-registration.test.tsx`, que #136 no toca.
     - El uso directo de `style={CONTINUOUS_CORNER}` en el merge es 32, igual
       que el de `#98 R10`.
   - Este veredicto cubre `86369a72`. Si el leader resuelve el conflicto con
     un merge o un rebase, el árbol resultante no lo he medido yo. Aplica la
     regla de drift: comparar lo que llegue a la PR con `86369a72` antes del
     done.
2. **Sonda propia `own_literal_corner`, en verde.** Si la esquina del tile se
   escribe como literal `borderCurve: 'continuous'` en vez de
   `...CONTINUOUS_CORNER`, pasa toda la suite.
   - El render es idéntico, así que no hay defecto visible.
   - La spec lo firmó: requirements §Qué firma, punto 4, y design D6, «no se
     añade un conteo de `...CONTINUOUS_CORNER`».
   - Límite: afecta solo a la forma fuente de los tres tiles, no a su render.
3. **Sonda propia `own_active_class`, en verde.** Un `active:opacity-50`
   añadido al `className` de los tiles pasa toda la suite, porque `#81` fija
   el `className` con `toContain` y no por igualdad.
   - La spec lo deja fuera: requirements §Fuera de alcance (D) y design
     §Alternativas, donde consta que jest no resuelve `className`.
   - Límite: solo el `className` de los tres tiles de accesos rápidos. No es
     un hueco de ningún R-id de #136. Si alguien quiere candarlo, es una
     feature aparte que decide si `#81` pasa a igualdad exacta.
4. **`android_only`, en verde, medido.** Es el punto ciego declarado
   (requirements §Qué firma, punto 7). Lo cierra R5.
5. **R5, pendiente del humano.** La prueba de humo en un dev build de
   Android (casilla de R5) no la cubre este veredicto, y la feature no debe
   pasar a `done` sin ella.
6. **Incidente de ejecución que declara el impl report.** La primera
   sustitución de la Home abortó antes de escribir, y hubo una corrida verde
   accidental que se descartó. El historial no deja rastro: los blobs de
   cada commit son los de la spec, y cada rojo re-medido cae por la vía
   exigida.

## Output de ./init.sh
Lo corrió el leader en el árbol principal, en `86369a72`. Este es el log
`scratchpad/init136.log`, con las líneas que deciden (el número es la línea
del log):

```
1:head-start=86369a724fb856dfa81c58eb50649ede6609e515
219:Test Suites: 171 passed, 171 total
220:Tests:       1307 passed, 1307 total
232:Test Suites: 2 passed, 2 total
233:Tests:       14 passed, 14 total
20247:Test Suites: 86 passed, 86 total
20248:Tests:       1609 passed, 1609 total
20249:Snapshots:   1 passed, 1 total
20545:Test Suites: 3 skipped, 27 passed, 27 of 30 total
20546:Tests:       8 skipped, 389 passed, 397 total
20561:$ expo lint
20565:$ tsc --noEmit
20569:✅ Todo verde. Listo para trabajar.
20576:head-end=86369a724fb856dfa81c58eb50649ede6609e515
20577:exit=0
```

- head-start y head-end son iguales a HEAD (`86369a72`), y `exit=0`.
- Tras init, el árbol principal quedó limpio (`git status --porcelain`
  vacío).
