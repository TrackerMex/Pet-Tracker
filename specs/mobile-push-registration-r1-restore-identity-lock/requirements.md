---
feature: "mobile-push-registration-r1-restore-identity-lock"
status: spec_ready         # draft | spec_ready | approved  ← se firma dentro de la spec de #137
tags: [harness, spec, mobile, puntero]
---

# Requisitos — [[mobile-push-registration-r1-restore-identity-lock]] (#139)

> **Este fichero es un puntero, no una spec.** Existe para que
> `init.sh:165`, que exige `specs/<nombre>/requirements.md` a toda feature
> `in_progress` o `done`, encuentre algo cierto en vez de emitir su aviso
> «probablemente anterior a la adopción de specs», que en el caso de #139
> sería falso.

## Dónde vive la spec de verdad

En **[[../mobile-push-registration-r15-named-import-lock/requirements|specs/mobile-push-registration-r15-named-import-lock/requirements.md]]**.
La firma del humano va en su §Aprobación, no aquí.

El humano decidió el 2026-09-29 juntar #137 y #139 en **un solo ciclo**: los
dos tocan el mismo fichero de test
(`mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`) y el mismo
`it` de R15, y por separado cada uno sería un cambio de unas pocas líneas con
su propio gate humano, su propio Codex y su propia revisión.

| Entrada | Requisitos que le pertenecen |
|---|---|
| **#137** `mobile-push-registration-r15-named-import-lock` | R1 |
| **#139** `mobile-push-registration-r1-restore-identity-lock` | **R2** |
| las dos | R3 (cierre medido) |

## Qué cierra #139

**R2**: un `describe` nuevo, `#139 R2`, último del fichero, que asevera que
tras R15 `jest.requireMock('expo-notifications')` devuelve **el mismo
objeto** que construyó la fábrica de la cabecera, capturado por el propio
test al cargarse. Pone rojo cualquier `finally` de R15 que restaure otro
objeto, aunque tenga el mismo contenido (sondas O1, O4, O5 y O6).

Es **requisito de verificación por la vía (b) de C4**: la restauración ya es
correcta, así que su commit rojo lleva la mutación O1 en el `finally` de R15 y
el verde la revierte. El diff neto de esa línea es cero.

Trazabilidad, veredicto y reporte: los de #137, en
`specs/mobile-push-registration-r15-named-import-lock/traceability.md`,
`progress/impl_mobile-push-registration-r15-named-import-lock.md` y
`progress/review_mobile-push-registration-r15-named-import-lock.md`.

## Por qué #139 se queda en `spec_ready` mientras se implementa

`init.sh:156` aborta con más de **una** feature en `in_progress`. Al ser un
solo ciclo con una sola branch
(`feature/137-mobile-push-registration-r15-named-import-lock`), la que lo
representa es #137; #139 pasa de `spec_ready` a `done` de golpe, con el mismo
veredicto. No es un atajo: el harness modela una feature por ciclo y aquí hay
dos entradas compartiendo uno.
