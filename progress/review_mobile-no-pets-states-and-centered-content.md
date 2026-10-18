# Revisión #181 mobile-no-pets-states-and-centered-content

Veredicto vigente: APROBADO (revisión técnica) en la ronda 3, HEAD revisado 0ac2e9de, con B1 pendiente de rechazo condicionado. Condiciones previas a done: ronda 3, sección «Condiciones antes de done». Historial: ronda 1 RECHAZADO (73f5585b); ronda 2 RECHAZADO (39369bf3), veredicto sin persistir. La ronda 4 (merge de origin/main) queda fuera de esta revisión y se revisa aparte.

---

# Ronda 3: APROBADO (revisión técnica)

> Persistido por el leader el 2026-10-18 desde el hand-back del reviewer (agente a6e1b861ec5de4cc6), con OK explícito del humano. El reviewer no puede escribir `.md` en su entorno. Contenido del reviewer sin cambios; solo se quitó su título de nivel 1.

Fecha: 2026-10-18. HEAD revisado: 0ac2e9de. Branch: feature/181-mobile-no-pets-states-and-centered-content. Worktree: /home/claude/sites/Pet-Tracker-wt-181. `git status --short` vacío al cierre. No he hecho commits ni tocado specs/ ni feature_list.json.

Veredicto: APROBADO (revisión técnica), sujeto a las condiciones previas a done de la última sección.
Bloqueantes: ninguno con la evidencia actual.
B1 (fallo intermitente de Jest): NO bloquea. Rechazo condicionado (ver sección B1).
Persistencia: progress/review_mobile-no-pets-states-and-centered-content.md NO escrito; mi configuración prohíbe escribir informes .md. Este mensaje es el informe completo; el leader lo persiste si lo quiere.

## B1: fallo intermitente de Jest

Pruebas rojas en la ronda 1 (scratchpad: /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/init-181/log, cuenta final L59316-59317: 5 failed de 3754):
1. R7: cambiar foto › does not request a URL when the picker is cancelled
2. R7: cambiar foto › requests, uploads raw bytes, and refetches the active pet
3. R7: cambiar foto › keeps the old photo and shows an error when upload fails
4. #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero
5. #168 R4 (enmendado por #173 R6): profile-pet-card es la Card hero con anillo y cámara › expone la cámara deshabilitada mientras la subida está en curso
(Todas en mobile-pet-tracker/src/screens/profile/index.test.tsx. El describe "R7: cambiar foto" es de una feature anterior, no el R7 de #181.)

Historial de corridas completas de mobile:
- H0 44acd74b: 2 corridas, 112 suites / 3717 tests, 0 rojas (init-181/ctrl-h0-1.log, ctrl-h0-2.log).
- 6d323318: 4 corridas, 1 roja (el init.sh de la ronda 1), 3 verdes (ctrl-head1, ctrl-head2, mobile-full-rerun; 113 / 3754). Caché de las verdes no documentada.
- 0ac2e9de: 3 corridas en frío (/tmp/181-full-1..3.log, 113 / 3759 cada una, según impl report L98-100) y init-ronda3.log (mobile 113 / 3759). 0 rojas.
- Perfil aislado (reviewer): 6 corridas, 138/138 cada una (init-181/profile-alone, profile-par-1..3, profile-seq-1..2).

Por qué no bloquea:
- Las cinco pruebas están en describes idénticos a H0. El camino de foto (handleChangePhoto) es idéntico a H0. Los cambios de #181 en profile/index.tsx (petsEmpty) no se ejecutan en ese flujo porque hay mascota.
- Los hooks beforeEach/afterEach añadidos por #181 están dentro de describe('#181 R1: …') (L1755-1768), no a nivel de fichero. El único cambio fuera de bloque es el import namespace de L31, sin efecto al cargar.
- 0 rojas en 3 corridas en frío a 0ac2e9de.

Límites:
- Causa no identificada. Las verdes de H0 y 6d323318 no documentan caché fría: no absuelven. Tres verdes en frío no excluyen una tasa baja de fallo.
- Hipótesis no verificada: llamadas sin await heredadas de H0 en profile/index.test.tsx (L429, 438, 522, 819, 1211, 1222) filtrando estado entre its.
- No hay arreglo aplicado. La opción 5B (await en las seis llamadas) exige reproducción determinista, que no existe. Traceability B1: "sin arreglo: diagnóstico en el informe".

Rechazo condicionado: una roja de cualquiera de las cinco pruebas en una corrida completa en frío sobre el árbol final, o en el init.sh previo al PR, convierte el veredicto en RECHAZADO. Entonces hay que reproducir de forma determinista, arreglar (5B u otro) y repetir la revisión.

## Checklist C2: estado coherente
- [x] Solo 1 feature in_progress: feature_list.json L3358 es la única línea "status": "in_progress" (#181 en L3356).
- [x] progress/current.md actualizado a la ronda 3. Ver obs. 3 (L13).

## Checklist C3: arquitectura (mobile)
Capas móviles: screens, components, hooks, providers, api, i18n. Las capas domain, repositorios y application no existen en mobile: los ítems de backend son N/A.
- [x] Sin rutas de backend-pet-tracker/ ni infra/ tocadas desde H0. Solo mobile-pet-tracker/, docs/, specs/, progress/ y harness.
- [x] En los ficheros de producción cambiados (hooks/use-pet-selection.ts, providers/selected-pet-provider.tsx, screens/home, screens/profile, screens/reminders) no hay import de screens/ desde hooks/ ni providers/.
- [x] N/A: infra sin lógica de negocio (no hay infra nueva).

## Checklist C4: TDD
- [x] Cada R<n> tiene test que lo nombra (conteo de "#181 R<n>" en HEAD): R1 (3), R2 (2), R3 (2), R4 (5), R5 (4), R6 (2), R7 (1), R8 (R8.1, R8.2, R8.3), R9 (describe('#181 R9: …') en src/__tests__/no-pets-states.test.ts L15).
  - R10 no tiene test con su nombre. Es requisito de verificación (mutación): cubierto por C4 punto 3 (vía declarada en tasks.md en e775b9f7, antes del handoff de ronda 1), con evidencia en la fila R10 de traceability y en mis re-mediciones. La lectura literal del punto 1 no lo cubre. No bloquea; queda registrado.
- [x] Historial test-primero: R2 45a13f42 → 2f1165f3; R3 c5170de1 → d74224cc; R4 88228369 → f90f7d57; R5 c8133255 → 1af399ba; R9 9fe88151 → 78313d6a; R1 f08797a6 antes de las producciones de R2-R5. R6 y R7: test posterior (2af02ae5) sin commit de producción propio, cierre por mutación declarado antes del handoff de ronda 1 (C4 punto 3). R8: test solo en 8da45c96 más pares de mutación (C4 punto 5); declaración tardía, obs. 5.
- [x] Pares R8 de C4 punto 5, rojo y revertido en verde: M1 abc4ff8c/393002ab, M2 7e1f50aa/04a0a936, M3 169006a2/7fa5a640. Re-medidos por mí (scratchpad/review181/): m1-red 1 fallo de 7; m2-red 2 fallos de 7; m3-red-nopets 1 fallo de 7; m3-red-drift 1 fallo de 110 (R9); green-nopets 7/7; green-drift 110/110. Restaurados, árbol limpio.

## Checklist C5: trazabilidad
- [x] traceability.md sin filas "pendiente": la única coincidencia es L107 (X7), dentro del nombre de un test ("detalle pendiente").
- [x] Commits de código con formato type(mobile): desc (R-ids), por ejemplo "feat(mobile): centra el estado de Inicio sin mascotas (R3)". Los commits docs/chore/spec no llevan R-ids, correcto para harness. Ver obs. 8.
- Obs. 1 (fila X1) y obs. 4 (fila de smoke).

## Checklist C6: spec aprobada
- [x] requirements.md "status: approved" (L3). "[x] Aprobado por humano (fecha: 2026-10-18)" en L497. Enmiendas en L498-499 marcadas.
- [x] Sin cambios desde la firma d3fab6ed (diff d3fab6ed..HEAD de requirements.md: 0 líneas). El commit de firma cita la página de Notion y "Estado del gate = Aprobado".

## Checklist C7: sin código huérfano
- [x] Ningún fichero eliminado desde H0 (name-status: 1 A, 17 M, 0 D). La spec no declara reemplazos de módulos. El vacío inline de Perfil se sustituye in-place por el EmptyState existente. ESLint sin warnings en los 18 ficheros: no quedan símbolos locales sin usar.

## Checklist C8: UI móvil contra docs/ui-guidelines.md
- [x] Con reservas.
  - Componente: EmptyState compartido (src/components/empty-state.tsx), ya existente en el repo.
  - Copy common.noPetsYet / common.noPetsBody (src/i18n/catalog.ts L52-53 y L481-482): voz B de Pingo (ui-guidelines §7, L348-361): primera persona ("te ayudo") y sin exclamaciones. El mismo copy aparece en home, profile, reminders y food.
  - Deriva de diseño: pruebas R9 y ui-language.test.ts en verde; ESLint con 0 errores y 0 warnings.
  - Reservas: ui-guidelines no tiene regla específica de estado vacío centrado (búsqueda de EmptyState, centrado y vacío: sin regla; L584-592 aplica a pantallas de cuenta). El centrado se verifica con las pruebas R3/R4 de la spec, no con la guía. No revisé cada regla de la guía línea a línea.
  - Skills Expo: el handoff de ronda 3 (L40) dice "No cargues ninguna skill de expo", contrario a CLAUDE.md §UI móvil. El informe de Codex no documenta carga de skill. No bloquea porque C8 se evaluó sobre el código. Ver obs. 2.

## Observaciones no bloqueantes
1. Traceability X1 (L101) no nombra R7. El impl report (L198) sí lista para X1 el test src/screens/home/index.test.tsx ":: #181 R7: Inicio converge…". Trazar R7 en X1 o en otra fila.
2. Handoff ronda 3 L40 contradice CLAUDE.md §UI móvil. Corregir la plantilla de §Handoff a Codex CLI en leader.md antes de la siguiente feature móvil, y nombrar las skills con los nombres de Codex (§Catálogo real).
3. progress/current.md L13 dice "test '#181 R8' sin tocar la spec", pero la spec recibió la enmienda R8 (b8936eee, firma d3fab6ed). Corregir el registro.
4. Smoke Android: la fila se retiró de traceability (b8936eee). El pendiente vive solo en requirements.md §6 L481 y en current.md. Mantenerlo visible hasta el cierre.
5. Declaración tardía de la vía (b) para R8. Test en 8da45c96 (18:16). La ronda 2 declaró la ruta solo en su handoff (f9d4179c, 08:38). La spec declara la vía (b) en b8936eee (19:32), firma d3fab6ed (19:51), antes del handoff de ronda 3 (00abcc94, 19:59) y de los pares (20:14). Registrado, no bloquea. No repetir.
6. Los seis commits de pares R8 caen en un minuto (20:14). El timestamp no demuestra orden; lo sostiene la re-medición independiente (C4).
7. El impl report no tiene fila roja (EXIT=1) para c2, c4, c6 y c8. No bloquea: el historial muestra test primero donde aplica.
8. docs/conventions.md §Commits (L353-364) lista feat/fix/refactor. El repo usa también test(), docs() y chore(). Añadirlos.
9. X5 (traceability L105) marcada "equivalente; no plantada". Argumento plausible (el retorno anticipado cubre el caso); no verificado por mutación.
10. La rama va 34 commits por detrás de origin/main y 35 por delante (ref local, sin fetch). Antes del PR: merge de origin/main; si trae dependencias, pnpm install --frozen-lockfile; repetir init.sh.
11. Conteo de tests: 3754 (6d323318) → 3759 (0ac2e9de), +5. Desde H0 no se elimina ninguna prueba: la única línea it borrada (home/index.test.tsx, 'queda en el sitio del vacío que sustituye') reaparece renombrada en su sitio, "(enmendado por #181 R3)".
12. init.sh: "Lint sin errores" sin salida de expo lint (init-ronda3.log L57951-57952). Posible falso verde por SIGKILL. El lint real es ESLint directo sobre los 18 ficheros cambiados: exit 0, errorCount 0 y warningCount 0 (scratchpad/eslint-181.json), stderr vacío.

## Condiciones antes de done (fuera del reviewer)
a. El leader ejecuta init.sh sobre el árbol final (tras el merge de origin/main), con log y EXIT=0. El reviewer no lo ejecutó por instrucción del leader.
b. El humano marca la casilla A20: docs/conventions.md L642 y requirements.md L350. No bloquea la revisión técnica, pero es prerequisito de done.
c. El humano hace el smoke Android en dev build (requirements.md §6 L481) y lo firma. No marcar done antes (CLAUDE.md: requisitos que solo cierra un humano). No bloquea la revisión técnica.
d. Tablero Notion: Implementado / Completado antes de la PR.
e. El leader registra en current.md el B1: ruta del log de la ronda 1, los cinco nombres y la condición de rechazo.
f. El leader abre la PR con gh pr create; el humano mergea (obs. 10).

## init.sh (no ejecutado por el reviewer)
Instrucción del leader: no ejecutar init.sh ni e2e de backend (Postgres y LocalStack compartidos). Evidencia de scratchpad/init-181/init-ronda3.log (mtime 20:33:58, posterior al commit 0ac2e9de de 20:17:24), no del reviewer. Extracto:
```
L220-221      Test Suites: 187 passed, 187 total / Tests: 1474 passed, 1474 total   (backend unit)
L233-234      Test Suites: 2 passed, 2 total / Tests: 14 passed, 14 total          (infra)
L57613-57614  Test Suites: 113 passed, 113 total / Tests: 3759 passed, 3759 total  (mobile)
L57935-57936  Test Suites: 3 skipped, 30 passed, 30 of 33 total / Tests: 8 skipped, 468 passed, 476 total (e2e)
L57952        Lint sin errores (sin salida de expo lint; ver obs. 12)
L57956        Typecheck sin errores
L57966        EXIT=0
```
Corridas del reviewer: 6 de perfil (138/138 cada una), 6 de mutación (4 rojas, 2 verdes) y ESLint directo. No repetí la suite completa de mobile: usé las tres corridas en frío de /tmp/181-full-1..3.log y init-ronda3.log.
Árbol final: no hay diff de mobile-pet-tracker/ entre 8da45c96 y 0ac2e9de (0 ficheros, 0 bytes), así que las mediciones R10 hechas en 8da45c96 aplican al árbol final.

---

# Ronda 1: RECHAZADO (73f5585b)

> Persistido por el leader el 2026-10-18 desde el hand-back del reviewer (agente ac7b6f651cbaba0ff). El reviewer no pudo escribirlo: dijo que su entorno prohíbe informes .md. Texto sin cambios.

RECHAZADO. Razon: init.sh EXIT=1 con 5 fallos en profile/index.test.tsx, y R8 sin ningun test que lo nombre (C4).

No escribi /home/claude/sites/Pet-Tracker-wt-181/progress/review_mobile-no-pets-states-and-centered-content.md: la regla del entorno prohibe escribir informes .md. Este texto es el informe completo; el leader puede persistirlo.

## Alcance y metodo
- Revisado feature/181-mobile-no-pets-states-and-centered-content en HEAD 6d323318. H0 44acd74b, handoff e10cd689, firma de spec a64859d8. Commits c1-c13: f08797a6, 45a13f42, 2f1165f3, c5170de1, d74224cc, 88228369, f90f7d57, c8133255, 1af399ba, 2af02ae5, 9fe88151, 78313d6a, 6d323318.
- No ejecute init.sh ni la suite completa (restriccion del leader). Use el log del leader, head 6d3233181ebf033c3cbc510c9d1b3c222bc48b71.
- Mutaciones solo en worktree desechable bajo el scratchpad, ya borrado (symlink de node_modules desvinculado, worktree remove --force, prune). Sin commits, push ni PR. No edite nada en /home/claude/sites/Pet-Tracker-wt-181 ni en el arbol principal.
- graphify no aplica: no hay graphify-out/ en el worktree. Use git y lectura directa.
- Ninguna denegacion de sandbox.

## Output de ./init.sh (log del leader)
```
EXIT=1
backend (lineas 305-308): Test Suites: 187 passed, 187 total / Tests: 1474 passed
lineas 318-321: Test Suites: 2 passed, 2 total / Tests: 14 passed
lineas 59316-59319 (mobile):
Test Suites: 1 failed, 112 passed, 113 total
Tests: 5 failed, 3749 passed, 3754 total
Time: 120.829 s
```
Los 5 fallos, todos en /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/screens/profile/index.test.tsx:
- R7: cambiar foto > does not request a URL when the picker is cancelled
- R7: cambiar foto > keeps the old photo and shows an error when upload fails
- R7: cambiar foto > requests, uploads raw bytes, and refetches the active pet
- #168 R4 (enmendado por #173 R6) > con la subida fallida deja photo-upload-error inmediatamente tras la entrada del hero
- #168 R4 (enmendado por #173 R6) > expone la camara deshabilitada mientras la subida esta en curso

## Bloqueos

### B1. init.sh EXIT=1 (regla absoluta)
- Error comun: `TypeError: Cannot read properties of undefined (reading 'canceled')` en /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/screens/profile/index.tsx:199. El picker devuelve undefined. La linea 199 cae fuera de los hunks de #181 (lineas nuevas 21, 182-183, 314-321, 337).
- El fichero aislado pasa 138/138 (/tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/init-181/profile-alone.log). Control del reviewer de 3 ficheros: 429/429 verdes. El implementer reporta 837/837 con --runInBand sobre 10 ficheros (no reproducido). El fallo solo aparece en la corrida conjunta. No lo atribuyo a #181 ni lo descarto.
- Accion: init.sh limpio con log guardado sobre el HEAD corregido. Si profile vuelve a caer, la misma corrida completa sobre 44acd74b para clasificar el fallo como preexistente o de #181.

### B2. R8 sin test que lo nombre (C4, punto 1)
- grep "181 R8" sobre el diff añadido e10cd689..HEAD: 0 titulos. Las unicas menciones son "// #181 R5" y "// #181 R4" en /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/__tests__/ui-language.test.ts (toHaveLength de R7_PROFILE y R8_REMINDERS).
- /home/claude/sites/Pet-Tracker-wt-181/specs/mobile-no-pets-states-and-centered-content/traceability.md mapea R8.1 a "#65 R7", "#65 R8" y "#65 R18", y R8.2/R8.3 a tests previos. Ninguno nombra R8 de #181. Los commits c6 (88228369) y c8 (c8133255) llevan (R8) en el mensaje sin test que lo nombre.
- Para aprobar: un test con "#181 R8" en el titulo que pruebe R8.1 a R8.3, o enmienda de spec firmada por el humano que cambie el criterio para R8. El reviewer no concede la excepcion.

## Pendiente (no causa de rechazo esta ronda)

### P1. Evidencia de mutacion R10 incompleta (C4 via b)
- X1 reproducida sobre /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/hooks/use-pet-selection.ts. 7 fallos: S1 de home, profile y reminders; R2.2 de use-pet-selection.test.tsx; R6 de food y health; R7 "limpia la seleccion rancia y selecciona la mascota que llega al revalidar la lista" (fuera de la columna X1 de la spec: consecuencia, no defecto). S2 y S3 verdes. S3 de las tres pantallas sigue verde, como exige R10.
- Sin reproducir: X2-X4 y X6-X12. No las planté porque el arbol cambia con B1 y B2; van en la siguiente ronda sobre el arbol corregido. X5 es equivalente y no se planta (enmienda a64859d8).

## Checklist

C2 Estado
- [x] Solo 1 feature in_progress: /home/claude/sites/Pet-Tracker-wt-181/feature_list.json linea 3358 (#181).
- [ ] /home/claude/sites/Pet-Tracker-wt-181/progress/current.md desfasado: dice "Sin commits de implementacion" y "Siguiente: el humano lanza Codex desde c1". Lo actualiza el leader; el handoff prohibe tocarlo al implementer.

C3 Arquitectura (mobile no tiene capas domain/infrastructure)
- [x] El diff no toca src/api ni infraestructura.
- [x] use-pet-selection.ts consume solo useSelectedPet; clearPet entra en el contrato de selected-pet-provider.tsx.
- [x] Imports nuevos de produccion: solo EmptyState y Text.

C4 TDD
- [ ] Cada R<n> tiene un test que lo nombra: R1-R7 y R9 si (describe "#181 R<n>: ..."). R8 no (B2). R10 va por mutacion (P1).
- [x] Test-primero: R2 (rojo 45a13f42, verde 2f1165f3), R3 (c5170de1, d74224cc), R4 (88228369, f90f7d57), R5 (c8133255, 1af399ba), R9 (9fe88151, 78313d6a). R6 y R7 nacen verdes en 2af02ae5 por la excepcion documentada en spec y tasks; se cierran por mutacion.
- [x] Rojo por asercion, no por simbolo ausente: c1 f08797a6 (15 fallos: 13 sondas #181 R1 y 2 preexistentes; ReferenceError 0). c11 9fe88151 (2 fallos: toHaveLength recibe 0, y regex de la casilla; ReferenceError 0). Evidencia en la seccion Evidencia.
- No reproducido: rojo de c2, c4, c6 y c8.

C5 Trazabilidad
- [ ] traceability.md tiene una fila "pendiente": linea 38, smoke Android, "pendiente del humano". La spec §6 y el handoff asignan esa fila al humano. Literalmente no cumple C5: decide el leader si es excepcion.
- [x] Formato de los 13 commits: test(mobile), feat(mobile), docs(mobile-no-pets-states-and-centered-content), con R-ids.
- Menor: la fila c13 de traceability dice "este commit" sin hash (linea 56).

C6 Spec aprobada
- [x] /home/claude/sites/Pet-Tracker-wt-181/specs/mobile-no-pets-states-and-centered-content/requirements.md con status: approved (linea 3) y casillas humanas marcadas (lineas 492-493, 2026-10-18). Firma a64859d8. La spec no cambio tras la firma.

C7 Sin codigo huerfano (la spec sustituye profile-pets-empty)
- [x] El Text con testID profile-pets-empty se elimino (linea 313 en e10cd689). En HEAD queda el EmptyState en la linea 316 de /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/screens/profile/index.tsx.
- [x] Sin tests huerfanos: la tabla de vacios pasa de 12 a 11 filas; "#155 R4" se reescribe, no se borra; los 3 tests de Perfil con ese testID no se tocan.

C8 UI movil
- [x] Sin hex sueltos, StyleSheet ni clases con corchetes en el diff. "#181" aparece solo como "#181 R<n>" en comentarios y titulos (no es hex). design-drift y legibility-classnames verdes en la corrida del leader (solo cae profile, B1).
- [x] Lint bunx expo lint --no-cache: salida vacia (0 bytes). Typecheck tsc --noEmit: sin errores. Ambos con el arbol revertido a HEAD en el worktree desechable. Evidencia en la seccion Evidencia.

## Observaciones (no bloquean)
- c1 hace caer dos tests preexistentes que pasan en HEAD: "#114 R5" (reminders, "deja Nuevo junto al titulo") y "#173 R5" ("pinta la capsula tras el titulo...", probablemente en profile, porque la capsula es de Perfil; no comprobado). Unos 2 s cada uno. Mismo sintoma que B1 (caen solo en la corrida conjunta): posible relacion, no verificada.
- X1 tambien rompe R7 "limpia la seleccion rancia...": consecuencia logica; la columna X1 de la spec no es exhaustiva.
- /home/claude/sites/Pet-Tracker-wt-181/progress/impl_mobile-no-pets-states-and-centered-content.md sin commitear. Alega una "excepcion explicita del handoff" para no indexarlo; el apartado "Al terminar" del handoff en disco no la contiene. El leader debe confirmar si Codex la recibio.
- /home/claude/sites/Pet-Tracker-wt-181/docs/conventions.md (78313d6a) añade "- [ ] Enmienda A20 aprobada por humano (fecha: ____)" sin marcar. No verifique si A20 consta firmada en requirements.md. Comprobarlo antes de cerrar.
- status: draft en tasks.md, design.md y traceability.md. C6 solo exige requirements.md.
- R2.5 (17 dobles) se cubre por typecheck y dobles existentes; no hay test con nombre R2.5. C4 es por R<n>: no bloquea.

## No verificado
- Rojo por asercion de c2, c4, c6 y c8.
- Cuerpos de R2.3, R2.4, R4 y R5: solo comprobe los nombres.
- X2-X4 y X6-X12.
- init.sh propio y suite completa (no ejecutados).
- Causa de B1.
- Smoke Android (humano).

## Para aprobar
(a) init.sh EXIT=0 con log guardado sobre el HEAD corregido. Si profile sigue cayendo, clasificar con corrida sobre 44acd74b.
(b) Test con "#181 R8" en el titulo, o enmienda de spec firmada por el humano.
(c) Mutaciones X2-X4 y X6-X12 sobre el arbol corregido, con el it que cae por cada una.
(d) Decision del leader sobre la fila smoke de C5, la casilla A20 de docs/conventions.md y progress/current.md (C2).

## Evidencia (rutas completas)
- /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/init-181/log (init.sh del leader, lineas 59316-59319)
- /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/init-181/profile-alone.log (138/138)
- /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/rev181-c1.txt (15 fallos en c1)
- /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/rev181-c11.txt (2 fallos en c11)
- /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/rev181-x1.txt (mutacion X1)
- /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/rev181-tc.txt (tsc --noEmit sin errores)
- /tmp/claude-1002/-home-claude-sites-Pet-Tracker/4e8f7f58-6a83-4c71-a1d7-80aa092df5f2/scratchpad/rev181-lint.txt (0 bytes)
- /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/screens/profile/index.tsx (linea 199 en el error; EmptyState linea 316)
- /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/screens/profile/index.test.tsx
- /home/claude/sites/Pet-Tracker-wt-181/mobile-pet-tracker/src/__tests__/ui-language.test.ts
- /home/claude/sites/Pet-Tracker-wt-181/specs/mobile-no-pets-states-and-centered-content/requirements.md
- /home/claude/sites/Pet-Tracker-wt-181/specs/mobile-no-pets-states-and-centered-content/traceability.md
- /home/claude/sites/Pet-Tracker-wt-181/progress/current.md
- /home/claude/sites/Pet-Tracker-wt-181/progress/impl_mobile-no-pets-states-and-centered-content.md
- /home/claude/sites/Pet-Tracker-wt-181/docs/conventions.md
- /home/claude/sites/Pet-Tracker-wt-181/feature_list.json
