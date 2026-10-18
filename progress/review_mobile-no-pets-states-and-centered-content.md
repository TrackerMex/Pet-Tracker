# Revisión #181 mobile-no-pets-states-and-centered-content

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
