# review: mobile-home-cell-icons-source-lock-unbounded (#126, + verificación de #80)
Fecha: 2026-09-28
Veredicto: APROBADO

Revisado sobre `feature/126-mobile-home-cell-icons-source-lock-unbounded`, HEAD
`b4b5490c`, con el árbol limpio. HEAD es el merge limpio de `origin/main`
(`a8d5cb70`, #99) sobre los commits de Codex: `git show --remerge-diff b4b5490c`
sale vacío, y `git merge-base origin/main HEAD` da `a8d5cb70`.

Por la regla vigente (el clasificador deniega `init.sh` al subagente), el
reviewer no ejecutó `./init.sh`, e2e, Postgres ni LocalStack. Se usa el log del
leader, corrido sin pipe con exit=0, y se comprueba que corresponde a HEAD (ver
el final de este informe). Todo lo demás lo midió el reviewer en primer plano,
sin pipe (`cmd > log 2>&1; echo "exit=$?"`), desde `mobile-pet-tracker/` y con
`bunx`.

## Checklist C2 — Estado coherente
- [x] Hay como mucho 1 feature in_progress. Hoy son 0: #126 sigue en `spec_ready` y #80 en `pending`, igual que el precedente de #124. Lo declara `progress/current.md` («#126 se queda spec_ready hasta done, como #124»). init.sh pasó su control de una sola feature in_progress.
- [x] `progress/current.md` está actualizado: describe la sesión de #126 y de #80, la base `d7cb0d60`, sus blobs, el espejo en Notion, la firma y el handoff.

## Checklist C3 — Arquitectura
- [x] domain no importa de infrastructure. N/A: no se toca código de capas.
- [x] Los contratos de domain son interfaces puras. N/A.
- [x] application depende de interfaces. N/A.
- [x] infrastructure no tiene lógica de negocio. N/A.
- El diff de la branch sobre `mobile-pet-tracker/` es solo `src/screens/home/index.test.tsx` (+91/-0), según `git diff --numstat origin/main...HEAD`. Las 91 líneas añadidas no traen ningún `import` ni `from` nuevo.

## Checklist C4 — TDD (vía (b): candado de verificación sobre código ya correcto)
- [x] Cada R<n> tiene un test que lo nombra, o su ausencia está declarada.
  - R1: describe `'#126 R1: cada celda de la tira pinta su propio icono en muted'`, anidado en `#69 R1` entre `#69 R9` y `#69 R12`, con sus dos `it`, «con las métricas de hoy» y «sin métricas ni peso». El bloque coincide byte a byte con el literal de `tasks.md` (diff exit 0, 87 líneas).
  - R2: sus veredictos los dan los tests de R1 y `#69 R9`.
  - R3 y R4 no tienen test, y lo declaran `traceability.md` y el punto 10 de la firma: R3 es documentación y R4 una propiedad del diff.
- [x] El historial muestra rojo antes que verde.
  - `f83a9361` (rojo) añade los tests y versiona la mutación W2 en `index.tsx`: `<Weight size={20} color={accent} />{false && <Weight size={20} color={muted} />}`, blob `58a3c32b0765f7406e6462550b6fa691eaf6d031`.
  - `824c5b3b` (verde) solo revierte `index.tsx` al blob `dbb5b0346895cfc26705bee2257d1f8a8815df6c`.
  - Después vienen `3f0c53f7` (R3) y `fbedfc03` (evidencia R2/R4).
- [x] El rojo falla solo por la aserción nueva. Reproducido con los blobs de `f83a9361`: 144 verdes y 2 rojos, exit 1.
  - Los 2 rojos son los dos `it` de `#126 R1`, los dos por `toEqual` sobre `icon-weight`: `- "color": "--color-muted"` / `+ "color": "--color-accent-strong"`.
  - No hay ReferenceError ni TypeError, y el doble no está mutado.
  - `#69 R9` sigue verde en el rojo, que es justo el agujero que se cierra.
- [x] El agujero es real. Con el `index.tsx` de W2 y el test de la base `d7cb0d60` (blob `abbdb5b8`), el fichero da 144/144 verde, exit 0.
- [x] Los literales del test no se calculan desde producción. `'--color-muted'`, los `testID`, `size: 20` y `toHaveLength(3)` están escritos a mano. `Uniwind.getCSSVariable` está espiado para devolver su argumento, y el bloque no importa nada de producción.

### Sondas del reviewer (cada una revertida; `git status --porcelain` vacío después de cada lote)

| Sonda | Qué muta | Resultado del fichero Home | Lectura |
|---|---|---|---|
| spec_D2f | Map de celda a `accent` + copia `{false && <Map …muted/>}` fuera de la tira | 144/2, `toEqual` en los dos `it`. Blob `838aef1e`, coincide con la tabla | exigido ROJO, cumple |
| spec_S8 | Moon de sueño movido tras la etiqueta | 144/2, `toEqual` | cumple |
| spec_A9 | Bell extra en la celda de actividad | 144/2, `toHaveLength` | cumple |
| spec_W5d | rama `Platform.OS` + copia | 146/0 | residual documentado (*5d/*6d), cumple |
| spec_T1 | `'muted'` a `'accent-strong'` en `useThemeColors` | 141/5: dos de #124 R1 (`toBe`), dos de #126 R1 (`toEqual`), #70 R8 (`toBe`). Blob `c1e13841`, coincide | cumple |
| own_S_swap_collar (zona ciega) | Moon de sueño a `accent` y Moon de `collar-card` a `muted`: la cuenta de 4 se engaña con un elemento real, sin copia `{false && …}` | 144/2, `toEqual` en los dos; `#69 R9` verde | el candado muerde fuera de peso |
| own_D_swap_lastpos (zona ciega) | lo mismo con el Map de `last-position-card` | 144/2, `toEqual` en los dos | muerde |
| own_D_extra_prop | `<Map … strokeWidth={3} />` + copia | 144/2, `toEqual` en los dos | muerde (no estaba en la lista de la spec) |
| own_A_bell_when_missing | la celda de actividad pinta Bell si `activeMinutes` es null | 145/1, solo «sin métricas ni peso», por `toEqual` | muerde en el estado que la dispara |
| own_D_threshold | `color={(today?.distanceM ?? 0) > 5000 ? accent : muted}` + copia | 146/0 | residual no declarado (observación 2), no bloqueante |
| own_S_wrapped | `<View>{<Moon …accent/>}</View>` + copia | jest agotó el heap sin escribir JSON | no concluyente; los ficheros se restauraron (observación 3) |

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única coincidencia de `grep -i pendiente` es la línea de la regla. Las cuatro filas tienen test (o «sin test» declarado) y commits. Los tres hashes completos (`f83a9361…`, `824c5b3b…`, `3f0c53f7…`) son ancestros de HEAD (`git merge-base --is-ancestor` exit 0), así que el merge no los invalidó.
- [x] El formato de los commits cumple la convención de la spec. Los cuatro de Codex siguen la que declara `traceability.md` (`test(mobile): … (R1)`, `docs(mobile): … (R3)`, `docs(mobile): … (R2,R4)`), no el literal `feat(<scope>)` de C5. Es un par de verificación sin feature nueva, con el precedente de #124, y la spec firmada lo declara (observación 1).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla `[x] **Aprobado por humano** (fecha: 2026-09-27)`.
  - El commit de firma es `9152cfe0` (2026-09-27 22:48:03), por la vía de Notion. Cita la página `3e66115a9b27810c8236c5ab1a7b85b2`, `Estado del gate = Aprobado`, `page_last_edited_at 2026-09-27T22:44:22.618Z` y el espejo `eb4368dd`.
  - Desde la firma, en `specs/<feature>/` solo cambió `traceability.md`, que rellenó Codex en `fbedfc03`, y eso está permitido.

## Checklist C7 — Sin código huérfano
- [x] N/A: esta feature no reemplaza nada. La cuenta de fuente de `#69 R9` se queda byte a byte, como decide la opción (b) firmada, y el comentario de R3 explica por qué convive con el candado del árbol.

## Checklist C8 — UI móvil (`docs/ui-guidelines.md`)
- [x] El diff de producción está vacío, así que no hay superficie de UI que revisar.
  - `git diff --exit-code` de `src/screens/home/index.tsx` da exit 0 contra `d7cb0d60`, contra `origin/main...HEAD` y contra `origin/main`.
  - El blob de HEAD es `dbb5b034`, igual que la base, `824c5b3b` y `origin/main`.
- [x] Las líneas añadidas del test están limpias: `grep -P` del hex con la exención `#NN R<n>` da exit 1, y `StyleSheet|className|style=|[Npx]|rgb(|from` también da exit 1.
- [x] La guarda `src/__tests__/design-drift.test.ts` sigue verde: 55/55, exit 0, sin cambio de recuento. Las referencias `#126 R1` del test entran en la exención de su regex.
- [x] Skill `expo:expo-overview` cargada. El handoff prohibió a Codex cargar skills, porque la tarea es solo de tests y docs, y su reporte confirma que no cargó ninguna.

## R3 y R4, por inspección
- R3: el comentario de cuatro líneas sobre la cuenta en `index.test.tsx` y el párrafo de `docs/conventions.md` coinciden con los literales de `tasks.md` (diff exit 0). `docs/conventions.md` solo tiene líneas añadidas (+9/-0).
- R4: el diff de producción está vacío (ver C8). Codex solo tocó los cuatro ficheros declarados entre `a867dfdb` y `fbedfc03`: `index.test.tsx`, `docs/conventions.md`, `traceability.md` y el reporte de implementación.

## Mediciones propias del reviewer (HEAD `b4b5490c`)
- `bunx jest --runTestsByPath src/screens/home/index.test.tsx`: 146/146, exit 0. Es la base 144 más 2, el delta que declara el punto 6 de la firma.
- `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`: 55/55, exit 0.
- `bunx tsc --noEmit`: exit 0, 0 líneas de salida.
- `bunx expo lint`: exit 0.
- `test ! -e .expo/types/router.d.ts`: exit 0.
- El aviso de clave duplicada «2026-08-21» aparece igual en la base y en HEAD, así que es previo y ajeno.

## #80 mobile-test-double-icon-scope — verificación (propuesta (a), punto 12 de la firma)

Veredicto sobre #80: **VERIFICADA, se puede cerrar como `done` por verificación, sin cambio de código.**

Premisa de la entrada: el doble emitía `summary-icon-sleep` y `summary-icon-distance`, nombres de uso. Está caducada:
- `git log -S "summary-icon-sleep" origin/main -- mobile-pet-tracker/src` da solo dos commits: `18454a44`, que los añadió, y `a1796c91` (2026-09-08 21:23:05, `test(mobile-home-quick-actions): name reicon doubles by icon (R7)`), que los quitó.
- `git grep -n "summary-icon" origin/main -- mobile-pet-tracker/src` da exit 1, y lo mismo sobre HEAD. En `a1796c91^` había 8 coincidencias.
- El mock de hoy nombra por componente en `index.test.tsx:157-169`: `mockIcon('icon-weight')`, `icon-walk`, `icon-moon`, `icon-map`, … `icon-bell`.

Contra sus tres criterios:
1. «Ningún testID de icono se resuelve a más de un nodo, **o** el nombre dice explícitamente que es del componente»: **se cumple** por la segunda rama. `icon-moon` e `icon-weight` siguen dando dos nodos en la Home, pero el nombre `icon-<componente>` ya no promete una celda.
2. «El `it` de R3 sigue verde sin necesitar `within()`»: pertenece a la primera rama, la de los nombres únicos, como argumenta la spec en §#80 y firmó el humano en el punto 12. Comprobado en el árbol:
   - Todos los usos de `icon-weight/walk/moon/map` están acotados. Son las filas de «asigna cada valor, icono y etiqueta…» (`within(value.parent!)`), los tiles de #71 (`within(tile)`, que #71 R7 hace obligatorio) y el nuevo `#126 R1`, que ancla por los hijos de la celda.
   - Ningún test busca un icono de celda con `getByTestId` global.
   - Ese `it` sigue verde dentro de los 146/146.
3. «Suite móvil completa verde; ninguna cifra de candado se mueve»: **se cumple**.
   - Mobile da 83 suites, 1532 tests y 1 snapshot en el init.sh de HEAD.
   - `design-drift` sigue en 55.
   - La cuenta `toHaveLength(4)` de `#69 R9` queda byte a byte.
   - #80 no añade ningún cambio propio.

## Observaciones (ninguna bloqueante)
1. C5, tipo de commit: `test(mobile)` y `docs(mobile)` en vez del literal `feat(<scope>)`. Lo declaran `traceability.md` y el precedente de #124, así que se acepta como convención de la spec.
2. Residual no declarado de la clase «condición de render»: una tinta condicionada a un umbral que ninguno de los dos estados del fixture dispara, como `distanceM > 5000 ? accent : muted` más una copia, deja 146/146 verde. Es el límite natural de fijar dos estados (punto 2 de la firma), del mismo tipo que el residual *5d/*6d ya documentado (rama de plataforma). No pide cambio. Si un día se quiere cerrar, hace falta un tercer estado de fixture por encima de los umbrales plausibles, y eso es una decisión de spec, no de este veredicto.
3. La sonda `own_S_wrapped` (`<View>{<Moon …/>}</View>` más una copia) agotó el heap de jest, así que el reviewer no tiene veredicto para ella. Es un fallo de la sonda, no de la feature, y los dos ficheros se restauraron (`git status --porcelain` vacío). Las otras dos sondas en zona ciega (sueño y distancia, intercambiando con `collar-card` y `last-position-card`) ya prueban que el candado muerde fuera de la celda de peso.
4. `design.md` §Recuentos prevé la suite en 83/1510→83/1512. Tras el merge de #99 (+20 tests, 1510→1530) la cifra real es 83/1532. Cuadra: 1530 + 2 de #126.
5. El log de init.sh no contiene la salida de `git rev-parse`. Que corresponde a HEAD se deduce de dos hechos:
   - El reflog pone HEAD en `b4b5490c` a las 2026-09-28 00:12:33, sin movimientos después, y el log se escribió a las 00:17:37.
   - Las cifras cuadran con este árbol: 1532 = 1530 + 2.

   Para cierres futuros, conviene que el leader anteponga `git rev-parse HEAD` dentro del mismo log.

## Output de ./init.sh
Log del leader, corrido sin pipe con exit=0 sobre HEAD `b4b5490c` (ver la observación 5), en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/c1edfdc1-1af4-41a9-b58e-c094475189fd/scratchpad/init126.log` (1598644 bytes, mtime 2026-09-28 00:17:37). Líneas de resumen:
```
✅ Build exitoso
Test Suites: 171 passed, 171 total        (backend)
Tests:       1307 passed, 1307 total
Test Suites: 2 passed, 2 total            (infra)
Tests:       14 passed, 14 total
Test Suites: 83 passed, 83 total          (mobile)
Tests:       1532 passed, 1532 total
Snapshots:   1 passed, 1 total
[✓] migrations applied successfully!
Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
Tests:       8 skipped, 389 passed, 397 total
$ expo lint
✅ Todo verde. Listo para trabajar.
```
Los avisos «.env desactualizado: faltan RESEND_API_KEY…» del log son previos y no bloquean.
