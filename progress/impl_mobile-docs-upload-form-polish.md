# Implementación #185 — mobile-docs-upload-form-polish

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-185`
- Rama: `feature/185-mobile-docs-upload-form-polish`
- Inicio: 2026-10-18 UTC. Opción A aprobada por humano en `f7a61348`.
- Skills cargadas: ponytail, appllama-app-design-skill; **cargué building-native-ui** (plugin Expo 11c74d6b). Leída documentación oficial Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/ (AGENTS móvil).
- Alcance: T0 → T1 → T2A → T3 → T4 → T5 → T6 → T7 → T8; R3/R4 no aplican.
- Por handoff: sin init.sh, PR, deploy, AWS ni cambios a los artefactos de cierre del leader. R11 queda para el humano en dev build Android.

## H0

| Medida | Resultado |
|---|---|
| B1 | HEAD `e93a4cc1`; `44acd74b` es ancestro. Los cuatro commits posteriores solo cambian spec/firma/estado/handoff, sin drift del código móvil. |
| B2–B6 | 1, 0, 0, 0, 0 |
| B7 | docs.tsx, geofence-editor.tsx, geofences.tsx |
| B8–B11 | 0, 1, 1, 0 |
| B12 | solo reminders/index.tsx y reminders/index.test.tsx |
| B13–B17 | 59, 20, 29, 2, 4 |
| B18 | §2.34 — Añadidos por #178 — Recordatorios del canvas |
| B19 | 0 |
| B20 | node_modules ausente; `bun install` correcto (1080 paquetes), sin cambio de lockfile. HeroUI 1.0.8 / Expo Router 57.0.14. |
| T0.2 | `.expo/types/router.d.ts` ausente. |
| T0.4 | TextField usa `text-field__root`; CSS `src/styles/components/text-field.css`: `gap: calc(var(--spacing) * 1.5)`; Tailwind `theme.css`: `--spacing: 0.25rem`. Resultado: 6 px. R6 verifica esa regla y la anatomía, sin añadir clase. El comentario gap-1 de text-field.tsx está obsoleto respecto al CSS efectivo. |
| T0.5 | grep literal en imperative-api.d.ts = 0: este archivo reexporta router desde global-state/router. `global-state/router.d.ts` declara `dismissTo` como función y método de ImperativeRouter (2 ocurrencias). Se mantiene dismissTo, sin fallback. |
| T0.6 Δ1 | SCREEN_FILES dinámico; se ajustará el sumando +1. |
| T0.6 Δ2 | ui-copy-table: 29 filas de Docs, 16 anotadas #158 R12; se repartirán conservando las ocurrencias compartidas. |
| T0.6 Δ3 | consistency-classnames: 4 referencias al fichero, 2 a docs-upload-cancel; se mudan solo las correspondientes al formulario. Cuentas globales intactas. |
| T0.6 Δ4 | detail-stack, detail-stack.guard, detail-stack.navigation y layout enumeran docs/geofence-editor; se incluirá docs-upload. |
| T0.6 Δ5 | Lista A11 en conventions y ui-guidelines. design-drift además registra 1 signOut en Docs: se trasladará al formulario. |
| T0.7 | Verde: 14 suites / 433 tests, sin rojos previos (105.668 s). |

## Implementación y commits

Ruta delgada `DocsUploadRoute` → `DocsUploadFormScreen({ petId })`, registrada junto a Docs bajo la guarda del Stack. El archivo viaja por params string. El éxito usa dismissTo con nonce uploaded; la lista refresca y selecciona Todos solo al cambiar un nonce no vacío. Cancelar vuelve atrás sin subir ni reiniciar el filtro. Los errores mantienen su UI anterior y sus textos; los de elegir archivo quedan en la lista y los de formulario/subida se mudan con el formulario.

Espaciado final: 16 px entre campos (`gap-4`), 6 px de HeroUI entre etiqueta e input (sin clase redundante), 12 px entre botones (`gap-3`). Clases de botones/etiquetas/inputs intactas. Sin dependencias ni variables de entorno nuevas.

| Commit | R-id y evidencia |
|---|---|
| `6bf5a61e` | R1 rojo: dos fixtures detectan el formulario dentro de la lista. |
| `911d5257` | R2.1 rojo: PDF/JPEG/PNG no navegan; rechazos sin navegación ya verdes. |
| `8f101b52` | R2.2–R2.6 y R9: se mudan los 18 it y se añaden los cuatro tests de ruta. Rojo por ruta de producción todavía ausente. |
| `2e3e5bf4` | R2.3 lista rojo: aún no refresca al recibir uploaded. |
| `33250fb7` | R10 Δ1/Δ2 rojo: nueva pantalla y tabla de copy. |
| `a3fbbf21` | R10 Δ3/Δ5 rojo: recetas, signOut, grep-clean y lista A11. |
| `017dfd6d` | R10 Δ4 rojo: ruta, cabecera, orden, navegación y guarda. |
| `4b0415b6` | R2/R9: corrige fixture de caché afectada por un reemplazo amplio, elimina setup de subida de la lista y añade useReducedMotion al subpath /mock usado por renderRouter. |
| `32e103a9` | R2.2: usa APIs soportadas por RNTL 14 (solo hosts); props de KAV candadas en fuente y offset real probado por padding 291. |
| `c55bc36e` | R10 Δ2: +2 filas normativas por mensajes compartidos entre lista y formulario. |
| `c001587b` | Verde R1, R2.1–R2.6, R9; implementación de Δ1/Δ2/Δ3/Δ4/Δ6 de R10. Dos suites / 162 tests verdes antes de los nuevos candados de espacios. |
| `8442e279` | R10 Δ5 verde: añade docs-upload a A11 en ambos documentos. Seis suites / 287 tests verdes. |
| `e317c25d` | R7 rojo: falta docs-upload-actions. |
| `fb9fa977` | R7 verde: contenedor gap-3 y orden submit/cancelar. |
| `cfa63a9d` | R5 rojo: falta gap-4 en el formulario. |
| `cfafb4c8` | R5 verde: gap-4 en el padre, sin margen/padding por campo. |
| `22b72b13` | R6 rojo por mutación versionada de producción: primer TextField gap-1; falla solo la fila Tipo (1 roja / 3 verdes). |
| `9ee85011` | R6 verde: revierte la mutación; se conservan los 6 px medidos de HeroUI, cuatro filas verdes. |
| `6efe40f8` | R8 rojo/S6: mutación versionada border-b-4 → border-b-6; falla solo submit (1 roja / 5 verdes). |
| `28a4aba4` | R8 verde: receta original restaurada; seis filas verdes. Las props exactas se leen de la fuente para excluir las clases internas que HeroUI añade a los hosts de RNTL 14. |
| `207da00b` | R9 refactor: retira el import de tipo PetDocsState que lint detectó sin uso; sin cambio de comportamiento. |

El commit final docs(mobile) registra este informe y la trazabilidad tras el último verde; no mezcla arnés con los commits TDD.

## Recuento T7

Cada it.each se cuenta como un it (misma expresión de H0).

| Etapa | Lista | Test-F |
|---|---:|---:|
| H0 | 59 | — |
| T1 | 61 | — |
| T2A | 47 | 22 |
| T3 R7 | 47 | 23 |
| T4 R5 | 47 | 24 |
| T5 R6 | 47 | 25 |
| T6 R8 / final | 47 | 26 |

Se conservan los 18 it anteriores del formulario bajo seis describes `#185 R9 (antes #158 R5/R6/R7/R8/R9/R11)`; grep '#158 R' devuelve seis líneas de describe. Los nueve nombres mencionados en la prosa de R9 no coinciden con los seis describes reales de H0; no se perdió ningún it. #158 R10 (abrir documentos) permanece en la lista.

El caso anterior de bloqueo durante refetch conserva su fila y comprueba el límite nuevo de A: el formulario ya se cerró mientras la lista refresca. El bloqueo durante lectura, blob, creación, PUT y confirmación sigue comprobando ambos botones. La prueba real del teclado conserva paddingBottom 291 con layout 700, teclado 500 y cabecera 91, ahora sobre docs-upload-keyboard-avoider.

## Deltas R10

- Δ1: SCREEN_FILES +1, con ancla `#185 R2`.
- Δ2: las 29 filas de Docs pasan a 18 de lista + 13 de formulario = 31. Las dos adicionales son `docs.errorFileTooLarge` y `common.somethingWentWrong`, que permanecen en ambos ficheros. Se actualiza también la cuenta de R7_PROFILE; sin claves nuevas ni cambio de la spec de idioma.
- Δ3: receta primaria y secundario de cancelar apuntan al nuevo fichero. La lista global de ids secundarios conserva el mismo docs-upload-cancel. CONTINUOUS_CORNER y el resto de estilos de la lista permanecen en Docs; las cuentas globales primaryRadius, border-b-4 y rounded-xl bg-accent no cambian.
- Δ4: nueva fila de ruta; cabecera nativa vacía; guarda autenticada; push/back y salida al cerrar sesión; 13 detalles protegidos y posiciones actualizadas por la inserción junto a Docs.
- Δ5: A11 en conventions/ui-guidelines; test explícito de ambas listas. El candado de signOut pasa de Docs=1 a Docs=0 y formulario=1; grep-clean incluye el nuevo formulario.
- Δ6: los órdenes de hijos ya no incluyen el formulario en la lista; Test-F comprueba su propio orden y los errores en su pantalla.

## Sondas de mutación

Todas modificaron producción temporalmente, fallaron por su aserción y se restauraron con finally. S4 sigue la rama de H0: se fuerza gap-1 en un único campo, puesto que no hay gap-1.5 explícito que retirar. S8 no aplica a A.

| Sonda | Mutación | Resultado |
|---|---|---|
| S1 | Reinsertar docs-upload-form dentro de la lista | exit 1; 2 failed, 99 skipped, 101 total |
| S2a | Retirar gap-4 | exit 1; 1 failed, 72 skipped, 73 total |
| S2b | Cambiar gap-4 por gap-3 | exit 1; 1 failed, 72 skipped, 73 total |
| S3 | Mover el nombre de archivo dentro del primer TextField | exit 1; 1 failed, 72 skipped, 73 total |
| S4 | Forzar gap-1 en Tipo | exit 1; 1 failed, 69 skipped, 3 passed, 73 total |
| S5 | Invertir submit y cancelar | exit 1; 1 failed, 72 skipped, 73 total |
| S6 | Cambiar border-b-4 por border-b-6 en submit | exit 1; 1 failed, 67 skipped, 5 passed, 73 total |
| S7 | Omitir uploaded de dismissTo | exit 1; 1 failed, 72 skipped, 73 total |

## Verificación T8

Repetición final terminada tras retirar el import de tipo sin uso:

- Jest: exit 0; **16 suites / 491 tests**, sin omitidos (27.265 s).
- TypeScript: exit 0; log de 0 bytes. Guard de router.d.ts satisfecho antes de las dos ejecuciones de tsc; no se borró ni regeneró el archivo.
- Expo lint --no-cache: exit 0; log de 0 bytes, sin warnings ni «Failed to run». La primera ejecución había detectado un único tipo importado sin uso, retirado en 207da00b.
- git diff --check: sin errores; mutaciones restauradas.
- Diff desde e93a4cc1: sin cambios en los artefactos reservados al leader. El informe y la trazabilidad se incluyen en un único commit documental final tras este verde.

No se ejecutó init.sh ni el backend/infra: el handoff lo reserva al cierre del leader.

Comandos desde mobile-pet-tracker/:

```bash
bunx jest --silent src/screens/docs src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/app/__tests__
test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/pt185-final-tsc.log 2>&1 && test ! -s /tmp/pt185-final-tsc.log && ! grep -qF 'Failed to run' /tmp/pt185-final-tsc.log
bunx expo lint --no-cache > /tmp/pt185-final-lint.log 2>&1 && test ! -s /tmp/pt185-final-lint.log && ! grep -qF 'Failed to run' /tmp/pt185-final-lint.log
```

## Entrega al leader

- R11: por ejecutar por humano en dev build de Android, claro/oscuro y con teclado. No simulada y no marcada como superada. El humano confirma 16/6/12 px (P2/P3).
- R3/R4 y T2B/T2C: no aplican, P1=A firmada.
- Revisión, gate global init.sh, push/PR y artefactos de cierre corresponden al leader. No se tocaron progress/current.md, progress/history.md, STATUS.md, progress/review_*.md ni feature_list.json.
- La casilla humana de la spec está firmada en f7a61348; su frontmatter sigue diciendo draft como en H0. Se deja señalado al leader, sin modificar requisitos ni reabrir el gate firmado.
- El patrón del marcador no estaba en el .gitignore de este worktree (el handoff afirmaba que sí). Se añadió solo `/progress/impl_mobile-docs-upload-form-polish.done` a info/exclude local para cumplir la entrega ignorada sin modificar .gitignore versionado.
- La entrega termina creando `progress/impl_mobile-docs-upload-form-polish.done` con una sola línea: `progress/impl_mobile-docs-upload-form-polish.md`. El marcador queda fuera de Git.
