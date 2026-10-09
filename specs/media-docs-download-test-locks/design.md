---
feature: "media-docs-download-test-locks"
status: draft        # draft | approved
tags: [harness, spec, backend, media, tests]
---

# Diseño — [[media-docs-download-test-locks]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Base
> congelada `51ffebd0`. Rutas relativas a `backend-pet-tracker/` salvo que
> se diga otra cosa. #162 no cambia ninguna capa: solo añade tests en
> infrastructure (adapter S3), application (use case) y e2e (repositorio
> Drizzle contra Postgres).

## Decisiones técnicas

- **D1 — Cada candado se ancla a la sonda que sobrevivió en #157 (R1–R3)**:
  P10, P4 y el `WHERE` sin `isNull` son las mutaciones que el reviewer de
  #157 plantó y que ningún test mató. Cada R-id las versiona como M1, M2 y
  M3 en su commit rojo y las revierte en el verde (C4, quinto punto). Así el
  rojo demuestra que el test nuevo mira justo donde el viejo no miraba,
  y el diff neto de producción queda en cero (R4).
- **D2 — R1 se candada en las dos direcciones (R1 (a) y (b))**: con solo
  (a) (404 sin `name`), la mutación
  `name === 'NotFound' || httpStatusCode === 404` sobrevive. Con solo (b)
  (`name: 'NotFound'` con 403), sobrevive
  `name === 'NotFound' && httpStatusCode === 404`. Los dos its juntos
  fijan «decide por status, no por name» (memoria
  `clausulas-universales-candadas-en-un-caso`). Ambos usan `buildDeps()`,
  el doble de `S3Client` que ya tiene el fichero; ningún doble tipado
  `PhotoStorage` se toca (inventario: 2, sin cambios).
- **D3 — R2 libera cada URL a mano, sin timers falsos**: el doble de
  `createDownloadUrl` devuelve una promesa pendiente por key y guarda su
  `resolve`. El test espera con
  `await new Promise((resolve) => setImmediate(resolve))` a que el use case
  haya llamado dos veces (en Node, `setImmediate` corre cuando la cola de
  microtareas está vacía), libera **primero** la de `b`, espera otra vez
  y luego libera la de `a`. Es el patrón de `poller.service.spec.ts`
  (`releaseGetMessages` + `setImmediate`). El orden de liberación lo
  controla el test, así que no depende de ventanas de timers (memoria
  `ventana-de-timer-en-specs-de-spring`). Verificado por el spec_author con
  un spike en Node puro fuera del árbol: con `Promise.all` el resultado es
  `a, b`; con P4 es `b, a`.
- **D4 — R3 va en el e2e y llama al repositorio directamente**: la
  propiedad es del SQL (`UPDATE … WHERE id = $1 AND uploaded_at IS NULL`),
  así que solo Postgres la prueba de verdad. Por HTTP no se alcanza: el use
  case devuelve antes de `markUploaded` cuando `uploadedAt !== null`. El
  test siembra la fila con `seedDocument(…, { uploadedAt: <fecha fija> })`,
  instancia `new PetDocumentDrizzleRepository(db)` con el `db` que el e2e
  ya obtiene de `DRIZZLE` (precedente: `device-subscriptions.e2e-spec.ts`),
  llama a `markUploaded` y relee la fila. La limpieza es la de `afterAll`
  (borra mascotas y usuarios sembrados), como el resto de `seedDocument`.
- **D5 — Los tests asertan literales**: `3600`, `'signed:' + key`,
  `2026-10-01T10:00:00.000Z`, `404`, `403` y `'NotFound'`. Ninguno importa
  `DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS` ni otro símbolo de producción
  como valor esperado (memoria `candados-tautologicos`; R4 lo comprueba).

## Archivos afectados

Lista **cerrada** (R4). Rutas relativas a `backend-pet-tracker/`.

Producción: **ninguno en el diff neto**. Tocados de forma transitoria (rojo
→ verde, revertidos byte a byte):

- `src/modules/media/infrastructure/photo-storage.s3.adapter.ts` (M1, R1).
- `src/modules/media/application/use-cases/list-pet-documents.use-case.ts` (M2, R2).
- `src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` (M3, R3).

Tests:

- `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`:
  `describe('#162 R1: …')` nuevo al final, 2 its.
- `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts`:
  `describe('#162 R2: …')` nuevo al final, 1 it.
- `test/media-docs.e2e-spec.ts`: un import nuevo (E1) y
  `describe('#162 R3: …')` nuevo al final del `describe('Pet documents API (e2e)')`
  raíz, 1 it.

Docs (los escribe el implementer): `specs/media-docs-download-test-locks/traceability.md`
y `progress/impl_media-docs-download-test-locks.md`.

`pet-document-error.mapper.spec.ts`, que la entrada de `feature_list.json`
lista en `files_affected`, **no** se toca: su hueco lo cerró #161 R3
(DA1). La entrada caducó al mergear #161; el leader decide si la corrige.

## Alternativas descartadas

- **Unit del repositorio con cadena de `jest.fn()`** (patrón de
  `nutrition.drizzle.repository.spec.ts`), asertando
  `where.mock.calls[0][0]` contra `and(eq(...), isNull(...))`: no necesita
  Postgres, pero copia la implementación en el test (construye la misma
  expresión con los mismos helpers) y no prueba lo que importa, que la
  fila no cambia. Un `WHERE` equivalente escrito de otra forma lo rompería
  sin cambiar el comportamiento.
- **Timers falsos en R2** (`setTimeout` de 10 ms para `a` y 0 ms para
  `b` + `jest.advanceTimersByTime`): mete un reloj donde basta controlar
  dos promesas, y el orden quedaría en manos de los ms elegidos.
- **Cambiar los dobles de #157** (quitar `name` del 404 existente,
  sustituir el `Promise.resolve` de #157 R4): la descripción lo permitía,
  pero perdería el caso realista (un 404 de S3 trae ambos) y obligaría a
  re-razonar las sondas de #157 sobre tests que ya mataban las suyas
  (P1, P2a, P2b, P3). Añadir its no cambia nada de lo que ya funciona.
- **Unit para las ramas NOT_FOUND y NOT_UPLOADED del mapper**: duplica el
  e2e, que aserta el cuerpo entero (DA1).
- **Probar la carrera de dos confirms por HTTP**: dos peticiones en
  paralelo no garantizan que ambas pasen el `if (document.uploadedAt !== null)`
  antes de que una marque; el test sería no determinista.
