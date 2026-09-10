---
feature: "e2e-audit-log-order-assert"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[e2e-audit-log-order-assert]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `5666b85`.

## Capas tocadas

Ninguna capa de la aplicación. El único archivo que cambia es un test e2e
(`test/health-vaccines.e2e-spec.ts`). `src/` queda idéntico a `5666b85`;
no hay migración, no hay dependencia nueva.

## Decisiones técnicas

### D1 — Orden por `at` con desempate por `id` (R1)

`audit_log` (`src/db/schema/audit-log.schema.ts:17-35`) tiene dos columnas
que crecen con el tiempo:

| Columna | Tipo | Quién la fija | Sirve como orden |
|---|---|---|---|
| `at` | `timestamptz NOT NULL DEFAULT now()` (l. 29) | Postgres, `now()` = inicio de la transacción | cronológico real |
| `id` | `bigint GENERATED ALWAYS AS IDENTITY` (l. 20-22) | Postgres, secuencia | orden de asignación; desempate |

Se ordena `orderBy(asc(auditLog.at), asc(auditLog.id))`. `at` es lo que el
criterio 1 pide («la columna que da el orden cronológico real»); `id` cubre
el caso teórico de dos filas con el mismo `at` (misma transacción o mismo
microsegundo). En este `it` las tres filas nacen en tres peticiones HTTP
distintas, así que `at` ya es estrictamente creciente y `id` coincide con
él — el desempate cuesta cero y evita que alguien copie el patrón sin él.

Descartado: ordenar solo por `id`. Funciona igual aquí (una secuencia de
identidad es monótona en inserciones secuenciales), pero el criterio habla
de cronología, no de secuencia, y `at` es la columna que la expresa.
Descartado: `createdAt` / id uuidv7 — no existen en esta tabla (verificado
en el schema; no suponer por analogía con `pets`/`users`, que sí usan
uuidv7 pero lo generan en la aplicación).

### D2 — Se mantiene la aserción ordenada; no se compara como conjunto (R1)

El criterio 2 ofrece dos salidas: «o se ordena de verdad, o se compara como
conjunto». Se toma la primera. El `R12` de #14 afirma la **secuencia**
create → update → delete y que la segunda fila es el update con
`meta.fields = ['name', 'notes']`; eso es información de auditoría real
(la traza tiene orden). Con `orderBy` el `rows[1]` deja de ser un golpe de
suerte y pasa a ser una aserción legítima, así que las dos `expect` se
quedan byte a byte como están. `expect.arrayContaining` (patrón ya presente
en `test/pet-lost-mode.e2e-spec.ts:196-202`) habría sido correcto para un
test que solo cuente acciones, pero aquí degradaría el test.

### D3 — No hay commit rojo; la evidencia es una mutación no versionada (R2)

C4 exige historial rojo → verde. Aquí el «rojo» real es no determinista (el
test pasa aislado, cae bajo carga) y no hay código de producción que mutar:
el defecto **es** el test. Opciones consideradas:

- Versionar un commit con `orderBy(desc(...))` como «rojo» y otro con `asc`
  como «verde»: teatro; el primer commit no describe ningún estado real del
  proyecto.
- Reproducir el orden físico (borrar filas de `audit_log`, `VACUUM`,
  reinsertar) dentro del test: acopla el test al comportamiento del heap de
  Postgres para demostrar algo que la documentación de SQL ya garantiza.
- **Elegida**: vía (b) de C4 — mutación aplicada, ejecutada, capturada y
  revertida sin commit. La salida esperada del rojo es la aserción de
  `toEqual` con `Received: ['vaccine.delete', 'vaccine.update',
  'vaccine.create']`. Codex la deja en el reporte de implementación; el
  reviewer la repite. La spec lo declara antes del handoff, como C4 exige,
  y el humano lo firma en [[requirements]] §Aprobación.

Historial de commits resultante (dos, ambos en
`feature/76-e2e-audit-log-order-assert`):

1. `test(e2e-audit-log-order-assert): order audit log rows before asserting (R1)`
   — import de `asc`, el `orderBy`, el rename del `it`. Se commitea
   **antes** de la mutación de R2, para que `git checkout --` la revierta
   limpio sin llevarse R1.
2. `docs(e2e-audit-log-order-assert): mutation evidence, sweep and traceability (R2,R3,R4)`
   — `progress/impl_...md`, `specs/.../traceability.md`.

### D4 — Barrido: método, resultado y clasificación (R3)

Método (reproducible en cualquier commit; el reviewer lo repite):

```sh
cd backend-pet-tracker
grep -n "orderBy" test/*.e2e-spec.ts               # quién ya ordena
grep -rln "\.select(" src --include=*.spec.ts      # specs unitarios con select
grep -n "\.select(" test/*.e2e-spec.ts             # todos los select de e2e
```

Sobre `5666b85`: el primer comando lista solo `test/devices.e2e-spec.ts:192`
(`.orderBy(devices.esn)`); el segundo no devuelve nada (ningún spec unitario
consulta la base); el tercero da la lista completa de `select`. Cada
`select` sin `orderBy` ni `limit(1)` ni `count()` se leyó junto con las
aserciones que consumen su resultado y se clasificó en una de estas
categorías. Un `select` es **order-dependent** solo si (i) puede devolver
más de una fila (el `where` no es por clave única) **y** (ii) alguna
aserción usa un índice `[n]` sin `toHaveLength(1)` previo, o compara con
`toEqual([...])` de dos o más elementos sin `expect.arrayContaining`.

| Categoría | Ejemplos (ruta:línea en `5666b85`) | Order-dependent |
|---|---|---|
| Clave única en el `where` (`id`, `esn`, `wialonUnitId`, `expoToken`, `tokenHash`, `(petId, date)`) + `const [row] =` o `[0]` | `test/devices.e2e-spec.ts:120`, `test/alerts-engine.e2e-spec.ts:117`, `test/provision-device.e2e-spec.ts:274`, `test/alerts-center-notifier.e2e-spec.ts:754` | no |
| Multi-fila con `toHaveLength(0)` / `toEqual([])` | `test/devices.e2e-spec.ts:366`, `test/media-docs.e2e-spec.ts:338`, `test/pet-lost-mode.e2e-spec.ts:228` | no |
| Multi-fila con `toHaveLength(1)` **antes** de `[0]` | `test/auth-forgot-password.e2e-spec.ts:248`, `test/devices.e2e-spec.ts:690`, `test/geofences.e2e-spec.ts:527`, `test/health-weights.e2e-spec.ts:498`, `test/pets.e2e-spec.ts:581`, `test/alerts-center-notifier.e2e-spec.ts:433-436/480-482/489-494` (helper `alertRows()`, l. 169) | no |
| Multi-fila consumida sin índice: `.find()`, `.every()`, `.filter()`, `expect.arrayContaining`, `toHaveLength(N)` sin índice, delta `before.length` | `test/devices.e2e-spec.ts:255`, `test/device-subscriptions.e2e-spec.ts:717/850`, `test/health-vaccines.e2e-spec.ts:110`, `test/pet-lost-mode.e2e-spec.ts:187-201`, `test/geofences.e2e-spec.ts:595-607`, `test/provision-device.e2e-spec.ts:201-213` | no |
| Limpieza (`rows.map(id)` → `delete`) | `test/devices.e2e-spec.ts:171` | no |
| **Multi-fila + `toEqual([a, b, c])` + `rows[1]`** | **`test/health-vaccines.e2e-spec.ts:493-505`** | **sí — R1** |

Resultado: **un** hallazgo, el de la feature. No hay «patrón copiado»: los
otros tests de auditoría (`devices`, `geofences`, `media`, `media-docs`,
`pets`, `health-weights`) auditan una sola acción por `it` y la guardan con
`toHaveLength(1)`; el único que audita tres acciones seguidas sobre la misma
entidad con orden (`pet-lost-mode`) ya compara como conjunto. Por eso el
criterio 3 se cierra con este reporte y R3 solo exige que el diff no toque
nada más y que Codex clasifique el delta si lo hubiera.

### D5 — Estabilidad: tres corridas del reviewer, no una (R4)

«Varias veces seguidas» se fija en **3** corridas consecutivas de
`pnpm -C backend-pet-tracker run test:e2e` por el `reviewer` en su worktree,
más una de `env -u FORCE_COLOR bash ./init.sh` para el gate estándar. Tres
es el mínimo que distingue «pasó otra vez por suerte» de «pasa»; más no
aporta con `maxWorkers: 1` (`test/jest-e2e.json`) y un solo Postgres.
Precondiciones y trampas conocidas del VPS:

- `pgrep -af 'init\.sh'` y `pgrep -af 'test:e2e'` vacíos antes de empezar:
  los worktrees comparten el Postgres de `docker compose`; dos suites a la
  vez producen rojos falsos (visto 2026-09-06).
- Docker arriba: `init.sh` salta los e2e con un `warn` si `5432` o `4566` no
  responden (`init.sh:218-236`, `E2E_REQUIRED_PORTS` en `init.config.sh:36`).
  Un `init.sh` verde con «se saltan los e2e» **no** cierra R4.
- `FORCE_COLOR` en el entorno rompe `init.sh:127-148` (bug #75): usar
  `env -u FORCE_COLOR`.

Se evalúa la **igualdad** del número de tests pasados entre las tres corridas,
no un número fijo: otras features añaden tests y un total congelado caduca.

## Archivos afectados

- `test/health-vaccines.e2e-spec.ts` — capa test (infraestructura de
  pruebas). Línea 3: `asc` en el import de `drizzle-orm`. Línea 471: nombre
  del `it`. Líneas 493-496: `.orderBy(asc(auditLog.at), asc(auditLog.id))`
  tras el `.where(...)`. Nada más en el archivo.
- `../specs/e2e-audit-log-order-assert/traceability.md` — Codex rellena las
  filas.
- `../progress/impl_e2e-audit-log-order-assert.md` — reporte de Codex con
  las secciones `## Mutación (R2)`, `## Barrido (R3)` y `## Suite completa
  (R4)`.
- `../feature_list.json` — solo `status` de #76 (lo mueve el leader).

## Alternativas descartadas

- **Ordenar solo por `id`**: correcto aquí, pero el criterio pide la columna
  cronológica; ver D1.
- **`expect.arrayContaining`** en vez de `orderBy`: pierde la secuencia que
  R12 de #14 afirma; ver D2.
- **`rows.find((r) => r.action === 'vaccine.update')?.meta`** en lugar de
  `rows[1].meta`: redundante una vez ordenado; añade una guarda `?.` que
  esconde un fallo real.
- **Helper compartido `auditRowsFor(entity, id)`** en `test/`: un solo
  llamador; abstracción sin segundo uso.
- **Commit rojo con `desc`**: ver D3.
- **Arreglo de #75 de paso**: otra feature; aquí solo el rodeo.
