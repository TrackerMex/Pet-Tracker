---
feature: "mobile-health-vaccines-upcoming-past"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-health-vaccines-upcoming-past]] (#241)

Rutas relativas a `mobile-pet-tracker/src/`. Los `it` de pantalla van dentro
del `describe('#241: vacunas próximas y pasadas'` de
`screens/health/index.test.tsx`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41` | pendiente |
| R2 | `utils/__tests__/vaccine-dates.test.ts::#241 R2: hoy %s, próxima dosis %s, va a %s` | pendiente |
| R3 | `utils/__tests__/vaccine-dates.test.ts::#241 R3: ordena próximas ascendente y pasadas descendente por su fecha, con empate por id` | pendiente |
| R4 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana` | pendiente |
| R5 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo` | pendiente |
| R5 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R5: sin pasadas no pinta la sección` | pendiente |
| R6 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua` | pendiente |
| R7 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R7: $id conserva su tile en $list y entra a los $delay ms` | pendiente |
| R8 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»` | pendiente |
| R9 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R9: sin próximas no pinta su cabecera ni su lista` | pendiente |
| R9 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R9: sin vacunas conserva el vacío sin secciones` (nace verde; sonda de mutación en `progress/impl_mobile-health-vaccines-upcoming-past.md`) | pendiente |
| R10 | `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R10: a las $hora en $tz la dosis del $dosis va a $seccion` | pendiente |
| R11 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R11: %s` | pendiente |
| R11 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R11: inventario del fuente` | pendiente |
| R12 | `__tests__/health-vaccines-upcoming-past.test.ts::#241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
