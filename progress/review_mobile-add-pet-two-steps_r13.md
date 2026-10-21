# review: mobile-add-pet-two-steps — delta Enmienda E1 / R13
Fecha: 2026-10-21
Alcance: `git diff b361754a..HEAD` (HEAD `ad3b412e`). R1-R11 conservan el veredicto aprobado de `progress/review_mobile-add-pet-two-steps.md` (código `ed4462fd`); el delta solo toca R13 y la aserción de R6 que R13 sustituye.
Veredicto: APROBADO (con observaciones no bloqueantes)

## Bloqueantes
Ninguno.

## Checklist C2 a C7 (solo delta)
- [x] C2: sin cambios en `feature_list.json`, `current.md` ni estado. Ninguna casilla humana tocada.
- [x] C3: solo UI en `src/screens/add-pet/index.tsx`; sin capas nuevas, sin imports de infraestructura, sin dependencias nuevas (`Calendar` ya lo usa `add-reminder`).
- [x] C4: cada R13 tiene un `it` que lo nombra (`#191 R13: el campo de fecha usa la receta de fecha de add-reminder`). Orden test-primero ver punto 3.
- [x] C5: fila R13 de `traceability.md` con test exacto y `68d3c45a` (`git cat-file -e 68d3c45a`: ok). Ninguna fila "pendiente" (R12 es "cierre humano", como en la aprobación anterior).
- [x] C6: `requirements.md` con la casilla `[X] Enmienda E1 (R13) aprobada por humano (fecha: 2026-10-20)`.
- [x] C7: N/A, R13 no reemplaza nada existente (solo sustituye una aserción de R6 en el mismo fichero).

## 1. Producción vs R13: coincide literalmente
Diff de `index.tsx` (7 líneas): import `{ Calendar, Camera }`; `className="h-12 flex-row items-center gap-2 rounded-xl border-2 border-transparent bg-default px-3.5"` con `style={CONTINUOUS_CORNER}` intacto; `<Calendar size={18} color={muted} />` (`muted` ya existía en `useThemeColors` línea 105); `<Text className={`text-15 font-semibold ${birthDate ? 'text-foreground' : 'text-muted'}`}>`. `testID="birth-date-field"`, `accessibilityRole="button"`, `onPress={() => setShowDatePicker(true)}`, texto `toLocaleDateString(locale)` / `t('addPet.selectBirthDate')` y `FieldErrorMessage` de debajo sin tocar. `git diff --check`: limpio. Sin hex, sin StyleSheet.

## 2. Test no tautológico: mutaciones plantadas (cada una revertida; árbol limpio tras cada una con `git diff --quiet` y `--cached`)
Comando: `bunx jest src/screens/add-pet/index.test.tsx -t '#191 R13:'`.
| Mutación | Resultado |
|---|---|
| producción de `68d3c45a^` (receta anterior) | falla (Expected `h-12 flex-row ...`, Received `h-12 rounded-xl ...`) |
| quitar `flex-row` | falla |
| quitar `h-12` | falla |
| `Calendar size` 18 a 20 | falla |
| quitar el icono | falla |
| icono después del texto (orden) | falla |
| color del icono a `"#888"` | falla |
| `text-15` a `text-base` | falla |
| quitar `font-semibold` | falla |
| `text-muted` a `text-foreground` (sin fecha) | falla |
| `text-foreground` a `text-muted` (con fecha) | falla |
| quitar `style={CONTINUOUS_CORNER}` del campo | falla |
| `accessibilityRole` a `link` | falla |
| color del icono `muted` a `accentStrong` | **PASA (superviviente)** |

La única mutación superviviente es observación O1, no bloqueante: en jest `Uniwind.getCSSVariable` devuelve `undefined` para todos los tokens y `useThemeColors` cae al fallback de `foreground`, así que `muted` y `accentStrong` valen lo mismo y el test no distingue un token de otro. Cualquier color literal o ausente sí se detecta. Es la misma ceguera del entorno que ya afecta a `placeholderTextColor`; no se puede cerrar en jest sin mockear el hook. La aserción de R6 reescrita (`index.test.tsx` línea ~892) pide el mismo `className` que R13: coherente, no contradice. Se conservan las aserciones con `within(...).getByText` (`9/4/2024`, etiquetas).

## 3. Orden test-primero
`f3623bd0` (test) y `707daafd` (docs) son un intento previo; `eb83ca10` (test, corrige la inspección del icono con `Children.toArray` y selección por props) precede a `68d3c45a` (feat, solo `index.tsx`), y `ad3b412e` (docs) cierra. Rojo de `eb83ca10` legítimo: reproduje el mismo fallo de aserción (`className`) al restaurar la producción anterior. El primer rojo `f3623bd0` fue un TypeError de inspección (según el reporte, con la producción ya aplicada en el árbol): no era rojo legítimo, pero queda superado porque `eb83ca10` registra un rojo por aserción real y la producción llega después. Es aceptable: no se reescribió la historia, el intento previo está declarado en el reporte y el rojo verdadero es anterior al verde (observación O2: historial con un commit de test que no fue rojo útil).

## 4. Lista cerrada de ficheros
`git diff --name-only b361754a..HEAD`: `mobile-pet-tracker/src/screens/add-pet/index.test.tsx`, `mobile-pet-tracker/src/screens/add-pet/index.tsx`, `progress/impl_mobile-add-pet-two-steps_r13.md`, `specs/mobile-add-pet-two-steps/traceability.md`. Exactamente los cuatro autorizados. En `traceability.md` solo cambió la fila R13.

## 5. Los 9 candados: sin modificar y verdes
Ninguno aparece en el diff. Corridos uno a uno desde `mobile-pet-tracker/`, sin pipes, exit 0 todos: add-pet `index.test.tsx` 68; `consistency-classnames` 73; `alerts-canvas-fidelity` 27; `design-drift` 114; `profile-canvas-fidelity` 26; `chunky-cta-canvas-fidelity` 74; `heroui-text-size-merge` 25; `add-pet-two-steps` 2; `ui-language` 30; `forms-validation-global` 8. Logs `g13-<fichero>.log` en el scratchpad. No cambió ninguna cifra de candado de R11.

## 6. Casillas humanas
`Cierre del humano` (enmienda y smoke) siguen `[ ]`; la casilla de enmienda de `ui-guidelines.md` no figura en el diff. Ninguna marcada por IA. La de aprobación de E1 en `requirements.md` está firmada por el humano (2026-10-20) y no cambió en este delta.

## 7. Typecheck y lint
Router generado ausente (`test ! -e .expo/types/router.d.ts`: ok). `bun run typecheck`: exit 0. `bunx expo lint --no-cache > log 2>&1 && test ! -s log`: exit 0, log de 0 bytes (log fuera del árbol).

## Valoración de init.sh (dos corridas)
- Backend diff de la rama: `git diff --name-only origin/main...HEAD -- backend-pet-tracker` da 0 ficheros. El código backend no pudo causar el rojo.
- Corrida 1 (exit 1): móvil 126 suites / 4193 tests verdes; backend unit 187/1474 verdes; solo fallaron 3 suites e2e (`alerts-center-notifier`, `alerts-engine`, `pet-reminders`), 6 tests. Los fallos son de contaminación de cola: `['alert','alert']` en vez de `['alert']` y un `sendPush` que recibe el `petId`/`reminderId` de otra ejecución. Eso es lo esperable con un LocalStack/cola compartida con otra sesión, no con un cambio de lógica.
- Corrida 2, mismo HEAD (`ad3b412e`), exit 0: móvil 126/4193, backend 187/1474 y e2e 30 suites / 468 tests verdes (3 saltadas).
- Conclusión: la explicación (flake de entorno compartido) es sostenible: rama sin cambios backend, fallos con firma de mensajes ajenos, verde reproducible sin cambiar nada. No está demostrada la causa exacta (no hay traza de la otra sesión); el `ECONNREFUSED 127.0.0.1:4566` del log aparece en un spec unitario con mocks y es ruido, no causa. Como gate final lo aceptable es la corrida verde de `init191r13b`; no la tomo como regresión.

## D6 (botón que cambia de posición): análisis de código
R13 ni lo explica ni lo agrava. Antes y después de R13 `birth-date-field` y `approx-age-input` miden `h-12`; R13 solo añade `flex-row items-center gap-2` y el icono dentro de una caja de altura fija, por lo que no cambia la altura de la fila de edad ni el flujo vertical. Quedan sin cambios por R13 y son lo único que podría mover contenido: el `FieldErrorMessage` bajo el campo activo (solo existe uno según `ageMode`, y su aparición empuja contenido), y el `<Host>` del selector que se monta en flujo (`showDatePicker`) entre la sección de edad y lo siguiente. Esto no se prescribe: queda para el smoke del humano tras R13, como indica D6.

## Observaciones
- O1: superviviente `muted`/`accentStrong` por entorno jest (arriba). No bloqueante.
- O2: historial con `f3623bd0`/`707daafd` como intento previo con rojo por TypeError. No bloqueante.
- O3: el reporte de Codex resume T0 como 4192 → 4193 y el `init.sh` del leader confirma 4193; coherente.
- La fila R12 sigue siendo cierre humano; la feature no se puede marcar done hasta que el humano cierre las dos casillas de `Cierre del humano`.
