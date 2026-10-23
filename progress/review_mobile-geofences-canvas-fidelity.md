# review: mobile-geofences-canvas-fidelity
Fecha: 2026-10-21
Veredicto: APROBADO

Feature #189. Branch feature/189-mobile-geofences-canvas-fidelity, HEAD 18f86849, base 4204530e.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress
- [x] progress/current.md actualizado (el cierre en feature_list.json y current.md es del leader tras este veredicto y tras el smoke humano)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (el diff es solo mobile-pet-tracker/src/screens, utils, i18n, tests; backend intacto)
- [x] repositories/contratos en domain son interfaces puras (sin cambios)
- [x] application depende de interfaces, no implementaciones (sin cambios)
- [x] infrastructure sin lógica de negocio (sin cambios)

## Checklist C4 — TDD
- [x] Cada R1-R18 tiene al menos un test que lo nombra (ver traceability.md; los `it` existen y llevan el R-id)
- [x] Historial: rojo -> verde por R. R17 y R18 son rojos por mutación de producción deliberada: 44c1e6da / 0896a843 (rojo, mutan `src/screens/geofences/index.tsx`) y de23d7e5 / cd26b658 (verde, restauran). El árbol final no contiene ninguna sonda: `git diff` vacío y producción conforme.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" (R1-R18 con test y hash reales; tabla de enmiendas E1/E2/E3)
- [x] Commits siguen el formato `feat|test(mobile): #189 ... (R-ids)`

## Checklist C6 — Spec aprobada
- [x] requirements.md con status: approved y casillas humanas marcadas (original 2026-10-19; E1/E2/E3 2026-10-21)

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A — la feature reestiliza pantallas en sitio (zones list y geofence-editor); no reemplaza ni deprecia componentes. Los `it` previos se enmendaron con sufijo `(enmendado por #189 R<n>)`, ninguno se borró.

## Verificación independiente
- Alcance: 21 ficheros mobile/docs + 3 spec/progress. Sin cambios en componentes compartidos, tokens, dependencias ni backend.
- Enmiendas E1/E2/E3 y regla residual cubren cada edición de candado agregado (chunky-cta, design-drift, consistency-classnames, profile-canvas, alerts-canvas, heroui-text-size-merge, alert-detail-canvas, ui-copy-table, ui-language, language-provider, layout) con el delta declarado.
- Comportamiento intacto: `isDisabled={busy || atLimit}`, `onPress` de `geofences-add`, `isDisabled={busy || name.trim() === ''}` del editor, rama 401, copy existente y `GEOFENCE_MAX_PER_PET = 5` sin cambios.
- Incidente init.sh (SIGTERM, exit 143, 2.ª reanudación): `git status` mostró solo los 3 ficheros esperados; no dejó cambios. Árbol final limpio salvo el handoff sin trackear.
- Jest acotado por fichero: lote A 275/275 y lote B 457/457 en verde.
- Candados no tautológicos. Sondas de zona ciega R18 (5): todas rojas (1 failed / 16 passed) y restauradas. Sondas de comportamiento, todas rojas y restauradas con `git checkout HEAD --`:
  - labeltext15 (Label.Text text-15): 1 failed
  - tileColor0 (color de icono fijo): 3 failed
  - tileHidden (quita accessibilityElementsHidden): 1 failed
  - addDisabled (quita atLimit de isDisabled): 4 failed
  - deleteNoDisabled: 4 failed
  - progressLE (index <= zoneCount): 4 failed
  - ownerGate (isOwner sin rol): 8 failed
  - limitOwnerAny: 4 failed
  - buttonlabel17: la sustitución sed no aplicó (NO-OP); equivalente cubierto por la mutación de producción de 0896a843 (Button.Label text-17 en geofences-add), roja en R18.
- Estado final: `git diff --cached` vacío, `git diff` vacío, `git status --short` solo `?? progress/handoff_mobile-geofences-canvas-fidelity.md`.

## Observaciones
No bloqueantes (ninguna impide aprobar):
1. profile-canvas-fidelity.test.ts: el comentario `// #178 R12` queda pegado a la línea añadida de geofences.
2. alerts-canvas-fidelity.test.ts: sangría desalineada en la línea de geofences.
3. Sufijos de enmienda duplicados en algún `it` (E1 + E2); legible pero ruidoso.
4. ui-language.test.ts: comentario de recuento previo desactualizado.
5. src/screens/geofences/index.tsx: línea en blanco suelta tras el `Button` `geofences-add`.
6. src/screens/geofences/index.tsx: `categoryColors[position % 5]` repite el orden de `ZONE_SLOT_ORDER` (category-palette.ts); riesgo de deriva si cambia el catálogo. Cubierto hoy por la sonda tileColor0.
7. language-provider.test.tsx: comentario de historial sin actualizar.
8. Relajación de regex en R7.5/R8.1 de chunky-cta: cubierta por la regla residual.

Pendiente humano (no marcado por el reviewer): smoke Android de requirements §6.

## Output de ./init.sh
Corrido por el leader (no por el reviewer): exit 0, 131 suites / 4398 tests móvil. Log completo: /home/claude/sites/Pet-Tracker-wt-189/progress/init-leader-189.log
```
$ expo lint
Lint sin errores

-> Typecheck...
$ tsc --noEmit
Typecheck sin errores

Todo verde. Listo para trabajar.
```

---

# Revisión E4/E5/E6
Fecha: 2026-10-22
Alcance: `git diff 18f86849..HEAD` (HEAD 67f12234). Sección añadida; la revisión anterior (sobre 18f86849) no se modifica.
Veredicto: APROBADO

## Evidencia independiente
- init.sh NO ejecutado por el reviewer (instrucción del leader); leído `progress/init-leader-189-e4.log`: exit=0, móvil 131 suites / 4426 tests, lint y typecheck sin errores. Entre 93785dc4 y HEAD solo cambian `progress/impl_...md` y `traceability.md` (sin deriva de código tras los tests de cierre; última producción `b3c16b4c`, últimos tests `a49eb6b0`).
- Jest propio (sin otro jest en marcha), 6 suites tocadas por E4/E5/E6 en una sola invocación: 6/6, 423/423 verdes.
- Medidas por contenido (M10-M19) re-medidas sobre HEAD, todas igual al total esperado de §4.4: M10 2/3; M11 4/5/1; M12 0 (y `useContext` 0); M13 0/1; M14 0/1; M15 2/0; M16 6; M17 2/2; M19 2/3/0. Los literales 42/70/56 no aparecen en ninguna pantalla.

## C2 — Estado
- [x] Solo #189 `in_progress` en `feature_list.json` de esta branch.
- [x] `progress/current.md` actualizado (estado E4 registrado en 9daf2703).

## C3 — Arquitectura
- [x] `header-layout.ts` y `KEEP_OPACITY` en `src/theme/` (precedente `touch-target.ts`); sin imports cruzados nuevos; pantallas e `_layout.tsx` importan las constantes, ninguna las repite como literal.
- [x] `Stack.Screen` por rama con identidades estables (`useMemo` + constante de módulo); hooks antes de los retornos tempranos; formulario = fragmento `[Stack.Screen, KeyboardAvoidingView]` (R9 `childTestIds` intacto).
- [x] Sin `HeaderHeightContext` ni `useContext` en el Editor; `keyboardVerticalOffset={0}`; etiqueta del KAV en una línea con los 4 atributos en orden.
- [x] Cabecera transparente solo en la ruta de Zonas (`_layout.tsx`, spread después de `headerOptions`) y en la rama formulario del Editor; la ruta del Editor sigue opaca; las 5 ramas de estado declaran `opaqueHeader`.

## C4 — TDD
- [x] Cada R19-R24 tiene `it` que lo nombra (`#189 R19`, `R20`, `R21`/`R1.2`, `R22`, `R23`, `R24.1/2/3`, y los `(enmendado por E4 Rn)`).
- [x] Historial test-primero verificado con `git show --stat`: cada commit rojo toca solo ficheros de test (7e47e13a, 297b9f4b, eace0652, 3a786a89, f3aa4094, 889ed6fa, 8fae5abf, d9077a65, a49eb6b0) y cada verde solo producción/docs (180594ec, cae47221, e82549e3, b3c16b4c, fb578f0b). Orden: R23, R19 rojo, R20 rojo, E5 x2, E6 C1, verde conjunto R19+R20, R21, R22 (con C2 en su rojo), R24.
- [x] Candados no tautológicos: 16 mutaciones plantadas por mí en zonas ciegas, todas detectadas y restauradas (ver abajo).

## C5 — Trazabilidad
- [x] `traceability.md`: la única aparición de «pendiente» es la frase de la regla (L58); filas R19-R24 y E4/E5/E6 completas; los 36 hashes citados existen (`git cat-file -e`).
- [x] Commits `test(mobile): #189 E4 Rn rojo — …` / `feat(mobile): #189 E4 Rn …` según la convención de la spec.

## C6 — Spec aprobada
- [x] Casillas E4 (cc175325), E5 (ae69eee5) y E6 (0babf646) firmadas por AlexisSM377, cada commit toca solo la línea de la casilla; `status: approved`. Ningún cambio de `requirements.md` posterior a la firma E6. Nota menor: la spec E5 (9d3e54ec) reescribió en su sitio tres frases de §4.4 ya firmadas (R20.1, Test F, P-E4-4) con marca «sustituida por E5»; luego el humano firmó E5, así que cubre ese texto.

## C7 — Sin código huérfano
- [x] Lo reemplazado (`HeaderHeightContext`/`useContext`, `left-4 top-3`, 291, `contentInsetAdjustmentBehavior` en Zonas) se eliminó en producción y en tests; anclas negativas probadas con mutación.

## Puntos pedidos
(a) R19/R20: `KEEP_OPACITY` en las 5 etiquetas con `isDisabled=` (Zonas 2, Editor 3), `geofences-add` con el literal exacto `style={atLimit ? KEEP_OPACITY : [chunkyLip.primary, KEEP_OPACITY]}`.
(b) E5: los tres `toEqual({ borderCurve: 'continuous', transform: [{ scale: 1 }], opacity: 1 })` siguen siendo igualdad exacta (R7 `count===5`, `#189 R20.1`, Guardar vacío); no se relajaron. Los `?.opacity` y `toHaveStyle` no se tocaron.
(c) R21/R22/R23: ver C3. Ventana R23 con literales propios del test (34-50, 62-78, 56, 44); cableado F/E con las constantes importadas.
(d) R24: `ui-guidelines.md` y `conventions.md` solo con las ediciones autorizadas (A11 Zonas en las 2 apariciones, frase de transparencia, nota de excepción opaca en ambos docs, frase de regla 13); 0 casillas `[ ]/[x]` añadidas; frases de R16.3 y de títulos intactas.
(e) Lista cerrada: ficheros de mobile/docs desde 18f86849 = `_layout.tsx`, `header-layout.ts`, `native-styles.ts`, las dos pantallas, sus dos tests, `layout.test.tsx`, `chunky-cta-…`, `geofences-canvas-fidelity…`, `consistency-classnames…` (solo el `it` de E6), `docs/conventions.md`, `docs/ui-guidelines.md`. Nada fuera (ni design-drift, ni heroui-text-size-merge).
Aclaraciones del leader sin firma: (1) orden R19/R20 de un verde: no cambia ningún R y cada uno conserva su rojo; (2) ancla R21 (L): verificado en `layout.test.tsx` que el `toEqual` de opciones vive en «le da la cabecera nativa de #95 R4…» y que el `it` «undécimo hijo» no lo contiene, opciones esperadas idénticas a §4.4; (3) P-E4-8: dos mutaciones, ninguna aserción aflojada (confirmado abajo, m7/m8). Ninguna afloja un candado.

## Mutaciones propias (todas restauradas; `git diff HEAD` vacío al terminar)
| # | Mutación | Resultado |
|---|---|---|
| m1 | rama de carga del Editor con `TRANSPARENT_HEADER_OPTIONS` | rojo: 7 `it` de R22.2 (5 ramas, transición, identidad) |
| m2 | `opaqueHeader` como objeto en línea (sin `useMemo`) | rojo: identidad en estado |
| m3 | ruta `geofence-editor` transparente en `_layout.tsx` | rojo: `layout.test` (editor) |
| m4 | Guardar no vacío bajo `busy` sin `KEEP_OPACITY` (`: chunkyLip.primary`) | rojo: 6 (R19.2 E) |
| m5 | Añadir zona `: chunkyLip.primary` sin `KEEP_OPACITY` (el barrido C seguiría contento) | rojo: R7 (0/4 zonas) + busy + chunky |
| m6 | formulario sin `Stack.Screen` | rojo: 5 |
| m7 | `paddingLeft: 42` literal en Zonas | rojo: barrido de fuente R23.2 |
| m8 | `paddingLeft: 50` literal en Zonas | rojo: cableado R1.2 es/en |
| m9 | píldora con `top: 0` | rojo: 6 R8 |
| m10 | etiqueta del KAV partida en dos líneas con `{0}` | rojo: C2 |
| m11 | `Switch` de Zonas sin `KEEP_OPACITY` | rojo: barrido C + F |
| m13 | P-E4-4: `style={[chunkyLip.primary, KEEP_OPACITY]}` también en el límite | rojo: R7 5 zonas es/en (+ chunky) |
| m14 | `paddingTop: insets.top + 12` | rojo: métricas A11 |
| m15 | `contentInsetAdjustmentBehavior="automatic"` restaurado en Zonas | rojo: métricas A11 |
| m16 | `keyboardVerticalOffset={91}` | rojo: teclado 200 + C2 |
| m12 | `<Slider isDisabled={busy}>` sin `KEEP_OPACITY` | VERDE (zona ciega, ver observaciones) |

## Observaciones (no bloqueantes)
1. El barrido (C) de R19.2 mira solo etiquetas `Switch` y `Button`, que es lo que la spec fija; un futuro `Slider`/`Input` de heroui con `isDisabled` en estas pantallas no pondría el candado en rojo (m12). Dentro del alcance firmado (DE4-5 deja el resto fuera); candidato a nota en §5 si se amplía.
2. El barrido de literales de R23.2 recoge solo 42/70/56 (spec); `6`/`44` repetidos como literal los cubre el cableado (m14), no el barrido.
3. `progress/e5-prod.patch` queda sin versionar en el working tree: no es del producto; el leader decide si borrarlo antes del PR.
4. iOS no verificado (DE4-3) y el smoke §6 pasos 6-10 (0.5 real, posición real de la flecha, contraste de la flecha sobre el mapa, destello opaco→transparente) son del humano; jest solo prueba la forma.
