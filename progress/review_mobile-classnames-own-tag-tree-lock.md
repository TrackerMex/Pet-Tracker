# review: mobile-classnames-own-tag-tree-lock (#127, y #128 mobile-delete-confirm-label-tree-lock por puntero)
Fecha: 2026-10-01
Veredicto: APROBADO

Revisado en `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/127-mobile-classnames-own-tag-tree-lock`, HEAD
`f53012c9b16cc88d21a7263ae3185520d01f2057`. H0 = `b5d1062f` (handoff).
`origin/main` = `886558db`, ancestro de HEAD.

El veredicto cubre las dos features: #127 (R1, R2, R3, R5 y R6) y #128 (R4).
La spec de #128 es un puntero (`specs/mobile-delete-confirm-label-tree-lock/requirements.md`,
`status: approved`) a la spec, la trazabilidad y esta review de #127.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` en HEAD tiene solo #127 `in_progress`. #128 está en `spec_ready` como puntero y pasa a `done` con este mismo veredicto, según `progress/current.md`.
- [x] `progress/current.md` actualizado: describe la sesión de #127 + #128 hasta el handoff. La entrada del cierre (init.sh, reviewer) le toca al leader.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: no aplica. El diff de producción contra `origin/main` está vacío (`git diff --exit-code origin/main...HEAD -- mobile-pet-tracker` sin los tests da 0).
- [x] repositories/contratos en domain son interfaces puras: no se tocan.
- [x] application depende de interfaces, no implementaciones: no se toca.
- [x] infrastructure sin lógica de negocio: no se toca.

## Checklist C4 — TDD (vía b)
- [x] Cada R<n> tiene al menos un test que lo nombra. Cuatro `describe('#127 R1: …')` en login, forgot, register y reset-password. Dos `#127 R2` en health y hero. Un `#127 R3` y un `#128 R4` en reminders. En cada uno de los siete tests, `grep -c "#127"` es igual a `grep -c "#127 R"`, y `grep -c "#128"` igual a `grep -c "#128 R4"`, así que no hay ningún id suelto. R5 y R6 son de documentación y medición y se trazan a `d0742cb0` y a `f53012c9`.
- [x] El historial muestra test primero. Hay cuatro pares rojo→verde (`91a5fb23`→`9cbff168`, `cc0571c2`→`9975df47`, `e41cff36`→`ff2ca5ae`, `df33eed5`→`4b032a18`). Cada rojo versiona el test más la mutación de producción, y cada verde solo revierte producción.
  - Los blobs de los rojos son los de tasks.md: login `00794879`, forgot `a2d2c544`, register `d0cb2b30`, reset `c910abf7`, health `565067e2`, hero `9b4d1690`, reminders `baa5baba` en R3 y `74fe6d45` en R4.
  - Los verdes vuelven a los blobs base: login `72ef07f5`, health `7e31f133` y reminders `8fbcd07c` en `ff2ca5ae` y `4b032a18`.
  - Los tests de cada rojo no cambian hasta HEAD (`git diff 91a5fb23 HEAD` y `cc0571c2 HEAD` sobre sus tests están vacíos). Reminders solo suma el bloque R4 en `df33eed5`. Por eso reproducir la mutación sobre el árbol final equivale al rojo del commit; los resultados están en §Sondas.
  - Los siete tests de `origin/main` son prefijo exacto de los finales (`cmp` exit 0). Numstat total: 189 líneas añadidas y 0 borradas.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente". La palabra solo aparece en el texto de la regla, nunca en una fila. Los 9 hashes citados existen y todos son ancestros de HEAD (`merge-base --is-ancestor` da 0): 91a5fb23, 9cbff168, cc0571c2, 9975df47, e41cff36, ff2ca5ae, df33eed5, 4b032a18 y d0742cb0.
- [x] Los commits siguen conventional commits en inglés con R-ids (`test(mobile): … (R1)`, `docs: … (R5)`, `docs(mobile): … (R1,R2,R3,R4,R5,R6)`), el formato que prescriben el handoff y `docs/conventions.md` §Commits.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla humana marcada con fecha 2026-09-30. La firma es el commit `40e2c12d`, vía Notion (página 3ec6115a…, gate Aprobado). `requirements.md`, `design.md` y el puntero de #128 no cambian desde la firma. Tras ella, `tasks.md` solo recibe dos erratas que el leader aprobó: `968c1ebc` (blob de control de B-login-h) y `b268f8d5` (los dos rojos por consulta preexistentes de D-h). Cada una toca una línea de tasks.md y nada más.

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados por esta feature fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A: la feature no reemplaza nada. Solo añade candados en el árbol. La frase «quedan como límites documentados» desaparece de `docs/conventions.md` (`grep -c` da 0), como pide R5.

## Checklist C8 — UI móvil conforme a la carta
Skill `expo:expo-overview` cargada. No hay cambio de UI: el diff de producción contra `origin/main` está vacío.
- [x] Grep-clean sobre las líneas añadidas: ningún hex, ninguna clase arbitraria `[...]`, ningún `StyleSheet.create`, ningún shadow/elevation.
- [x] Dimensiones / safe areas: no aplica, no hay cambio de pantalla.
- [x] Skeleton dimensionado: R2 lo blinda en el árbol (`skeleton__root h-24 w-full rounded-card` y hero `w-full` con `{ height: 260 }`).
- [x] Componentes compartidos: no aplica, no hay recetas nuevas.
- [x] Tappables: no aplica, no hay cambio.
- [x] Animaciones: no aplica.

## Verificación independiente
- Lista cerrada: `git diff --stat b5d1062f..HEAD` da **11 ficheros**: `docs/conventions.md`, los 7 tests, `progress/impl_…`, `tasks.md` y `traceability.md`. Solo `tasks.md` recibe las dos erratas. Ningún fichero de #60 está entre los tocados.
- Candados no tautológicos: los bloques nuevos no importan nada de producción. Todos los esperados son literales, también `{ height: 260 }` y `{ borderCurve: 'continuous' }`, sin `PET_HERO_MEDIA_HEIGHT` ni `CONTINUOUS_CORNER`. Comparan con `toBe` o `toStrictEqual` el valor entero, sin `toContain` ni muestreo.
- «Las nueve» sobre el árbol final, en primer plano y sin pipe: `exit=0`, 9 suites, **220/220**.
- Cifras del impl report: base 212 / 86·1626, final 220 / 86·1634 (delta +8 tests, +0 suites). Las confirma el log de init.sh del leader (móvil 86 / 1634).

## Sondas reproducidas
Método: aplicar la mutación con un script, comprobar el blob con `git hash-object` y correr «Comando» en primer plano, sin pipe. Después, restaurar siempre con `git checkout HEAD -- <las 7 rutas de producción>`; en las 15 sondas `git diff --exit-code` y `git diff --cached --exit-code` sobre `mobile-pet-tracker/src` dieron 0 y 0. Clasificación por la línea de jest: «aserción» es `expect(received).<matcher>` y «consulta» es `Unable to find…`/`Found multiple…`.

| Sonda | Blob comprobado | Comando | Resultado | Clase | Conforme |
|---|---|---|---|---|---|
| `P1red` | 00794879 / a2d2c544 / d0cb2b30 / c910abf7 | 33 | rojo 4 de 788: R1-login, R1-forgot, R1-register, R1-reset | aserción, `toBe` | sí |
| `P2red` | 565067e2 / 9b4d1690 | 33 | rojo 2 de 788: R2-vacunas y R2-hero a1 (recibido `"w-full bg-default"`) | aserción, `toBe` | sí |
| `P3red` | baa5baba | 33 | rojo 1 de 788: R3 (pill-week sin `rounded-xl`) | aserción, `toStrictEqual` | sí |
| `D-c` | 74fe6d45 | 33 | rojo 1 de 788: R4 a2 (etiqueta, recibido `text-foreground`) | aserción, `toBe` | sí |
| `D-h` | 00ea6738 | nueve | rojo 11 de 220. R4 a1 por `toBe` (sin `bg-danger`). `#61 R1 (#120 R2)` y #97 R2, #97 R3 y 5 de R7 por `toContain`. Dos de R7 por consulta, `Unable to find an element with testID: reminder-delete-reminder-1`: `refetches and removes the row after not-found` y la 2.ª iteración de `shows the action error for $state.kind` | 9 aserción + 2 consulta, ambas preexistentes | sí |
| `D-v` | f136e971 | nueve | rojo 2 de 220: `(#120 R2)` por `toContain` y R4 a1 por `toBe`, con `variant-primary` recibido | aserción | sí |
| `Z-d-dup` | 47d10363 | nueve | rojo 1 de 220: R4, `Found multiple elements with text: Eliminar` | **consulta**, la única de un `it` nuevo | sí |
| `Z-d-variant` | a94461d0 | nueve | rojo 1 de 220: R4 a1, con `variant-danger-soft` recibido | aserción, `toBe` | sí |
| `Z-hero-style` | e9e397cd | nueve | rojo 1 de 220: R2-hero a2 | aserción, `toStrictEqual` | sí |
| `Z-label` | 5c8e9b14 | 33 | **verde** 788/788, (F) declarado | — | sí |
| `Z-state2` | c5a2de62 | 33 | **verde** 788/788, (D) declarado | — | sí |
| `Z-child` | 6a341626 | 33 | **verde** 788/788, (F) declarado | — | sí |

`Z-d-variant` y `Z-hero-style` se corrieron con «nueve» en vez de «33». La tabla pide 33 para `Z-d-variant`. El rojo cae en el mismo `it` y las 24 suites extra no tocan reminders.

No reproducidas, aceptadas por el impl report y la verificación del leader: `B-login-j`, `B-login-h`, `Z-state`, `V-h`, `S-h`, `P-week-j/f/h`, `P-active-l3`, `P-inactive-l3`, `Z-week-style` y `D-d`.

### Mutaciones propias en zona ciega (no están en el catálogo)
Las tres buscan sitios que la tabla no prueba con esa técnica:

| Sonda propia | Mutación | Blob | Resultado (nueve) | Lectura |
|---|---|---|---|---|
| `OWN-register-j` | register: `className="w-full bg-accent"` y `{/* rounded-xl bg-accent */}` como primer hijo. Es el límite 2 en un fichero distinto de login, el único donde la tabla lo prueba | adae0fe5 | rojo 1 de 220: solo R1-register, `toBe` | el candado de fuente queda ciego (verde); el de árbol lo cierra |
| `OWN-d-after` | reminders: etiqueta real a `text-foreground` y señuelo `{false && (<Button.Label … text-danger-foreground>…)}` **detrás** de ella (D-d lo pone delante) | e9152472 | rojo 1 de 220: solo R4 a2, `toBe` | el bloque de fuente `elementWithTestId` queda ciego (verde); R4 lo cierra |
| `OWN-inactive-f` | reminders: `pill-inactive` sin `rounded-xl` y `{false && 'rounded-xl'}` como primer hijo. P-week-f solo prueba esto en pill-week | 8f0047da | rojo 1 de 220: solo R3, `toStrictEqual` | el candado de fuente queda ciego (verde); R3 lo cierra |

## Observaciones (no bloqueantes)
1. **Frase de la tabla resumen de `requirements.md`.** «Todas las rojas son **por aserción**, salvo `Z-d-dup`» es imprecisa leída en sentido literal. En `D-h` hay dos rojos por consulta, en `it` de R7 preexistentes (cascada desde el test anterior; están medidos en `886558db` y registrados en `tasks.md` por `b268f8d5`). Leída sobre los `it` nuevos, la frase es exacta: en las 12 sondas de catálogo y las 3 propias, todo rojo de un `it` `#127`/`#128` es por aserción salvo `Z-d-dup`. Que el leader no enmiende la spec firmada es razonable, porque la errata de `tasks.md` ya acota el alcance. Si una spec futura copia la frase, que diga «de los `it` nuevos».
2. **Huecos declarados que siguen abiertos**, sin que sea defecto de este ciclo: (D) los otros estados (enviando, vacunas refrescando, lista vacía) y (F) la tinta de `Button.Label` de envío y la tipografía de los hijos de píldora. `Z-label`, `Z-state2` y `Z-child` salen verdes, como firma la spec.
3. **Acoplamiento a heroui-native 1.0.8.** Los literales de R1 y R4 incluyen las clases de heroui-native (`pressable-feedback__root button__root …`). Subir de versión los pone en rojo a propósito. R5 lo documenta en `docs/conventions.md`, y es el punto 3 que firmó el humano.
4. **Warnings preexistentes de init.sh**, ajenos al ciclo: faltan 3 claves en `.env`, STATUS.md dice 128/143 cuando son 128/144, hay tres features `done` sin spec y un worker de jest «failed to exit gracefully». El STATUS.md se corrige en el cierre del leader.

## Output de ./init.sh
init.sh no lo corrió el reviewer: el clasificador se lo deniega al subagente. Lo corrió el leader sin pipe sobre el mismo HEAD. Su meta es `scratchpad/init127.meta`:

```
HEAD_START=f53012c9b16cc88d21a7263ae3185520d01f2057 2026-10-01T14:56:10Z
exit=0 HEAD_END=f53012c9b16cc88d21a7263ae3185520d01f2057 2026-10-01T15:00:34Z
```

Extracto del log (`scratchpad/init127.log`, 20927 líneas):

```
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️  Feature en progreso: mobile-classnames-own-tag-tree-lock
⚠️  STATUS.md desactualizado (128/143 declarado vs 128/144 real) — actualízalo antes de cerrar la sesión
✅ Build exitoso
Test Suites: 171 passed, 171 total            (backend unit)
Tests:       1307 passed, 1307 total
Test Suites: 2 passed, 2 total                (infra)
Tests:       14 passed, 14 total
Test Suites: 86 passed, 86 total              (móvil)
Tests:       1634 passed, 1634 total
Snapshots:   1 passed, 1 total
✅ Tests pasados
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
Tests:       8 skipped, 389 passed, 397 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 128/144 completadas | 14 pendientes
```

Corrida propia del reviewer sobre el árbol final: «las nueve» `exit=0`, 220/220.
