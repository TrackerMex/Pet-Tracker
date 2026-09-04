---
feature: "mobile-ui-language"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-ui-language]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-ui-language): <desc> (R1)` — **un commit por
requisito**, con el commit del test rojo antes que el de la implementación
([[../../CHECKPOINTS|CHECKPOINTS]] C4).
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

## Comprobaciones que el reviewer rehace, no hereda

Desde `mobile-pet-tracker/`:

| Qué | Comando | Esperado |
|---|---|---|
| Cadenas traducidas | la suite: `describe('#65 R13')` | 309 presencias, 234 ausencias, 40 excepciones |
| Consultas de texto | `grep -rEoh "(get\|query\|find)(All)?By(Text\|PlaceholderText\|LabelText\|DisplayValue)\(\|toHaveTextContent\(" src --include='*.test.ts*' \| wc -l` | **244** (era 246) |
| Consultas por `testID` | `grep -rEoh "By(TestId\|testId)\(" src --include='*.test.ts*' \| wc -l` | **800** (era 796) |
| Ningún `testID` borrado | `git diff` de la feature: cero líneas que **quiten** un `testID=` de fuente | 0 |
| Backend intacto | `git diff --stat` de la feature | ni un fichero de `backend-pet-tracker/` |
| Grep-clean C8 | `src/__tests__/design-drift.test.ts` y `consistency-classnames.test.ts` | verdes, sin cambios |
| Enmiendas | los 9 `.md` de [[design]] §5.1 | bloque `## Enmienda #65` presente, casilla firmada por el humano |
