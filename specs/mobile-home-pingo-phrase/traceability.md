---
feature: "mobile-home-pingo-phrase"
status: draft        # revisión y smoke humano reservados al cierre
tags: [harness, spec]
---

# Trazabilidad — [[mobile-home-pingo-phrase]]

Rutas relativas a `mobile-pet-tracker/`. R1–R14 verificados automáticamente; R15 corresponde al humano.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/home/index.test.tsx::#190 R1: la frase es el primer bloque con datos completos` (ok, unauthorized, no-tracking y error) | `a17112f3 test(home): require Pingo as the first resolved home block (R1)`<br>`cd54083c feat(home): place Pingo before the home summary (R1)` |
| R2 | `src/screens/home/index.test.tsx::#190 R2: no hay frase antes de conocer la mascota y la actividad` (9 escenarios) | `da577a0c test(home): hide Pingo across incomplete and failed states (R2)`<br>`a88a8895 feat(home): gate Pingo on resolved pet and activity data (R2)` |
| R3 | `src/screens/home/index.test.tsx::#190 R3: la fila alinea burbuja y pose al borde inferior` | `0f11fd80 test(home): lock Pingo row order and alignment (R3)`<br>`39c9edde feat(home): align the bubble and Pingo pose in one row (R3)` |
| R4 | `src/screens/home/index.test.tsx::#190 R4: Pingo usa su pose decorativa de 64 px` | `66d23db9 test(home): lock the decorative Pingo image and size (R4)`<br>`9bb6ec8e feat(home): render the approved decorative Pingo pose (R4)` |
| R5 | `src/screens/home/index.test.tsx::#190 R5: la pose reutiliza PingoFloat` (ambos modos, estilo completo y bucle propio); `src/components/__tests__/pingo-float.test.tsx::#172 R4: PingoFloat` | `ccbde7b2 test(home): require Pingo float and reduced-motion behavior (R5)`<br>`3ab42802 feat(home): reuse PingoFloat for the home phrase pose (R5)` |
| R6 | `src/screens/home/index.test.tsx::#152 R5: ...::escalona las entradas cada 60 ms en el orden de los bloques (enmendado por #190 R6)`; `#190 R6: los índices son fijos aunque falte un bloque` | `cf06f56d test(home): shift stagger delays and preserve missing block slots (R6)`<br>`c2f1a30f feat(home): stagger all seven home blocks at fixed indices (R6)` |
| R7 | `src/screens/home/index.test.tsx::#190 R7: reduce motion conserva solo la entrada sin desplazamiento` (nace verde con HomeEntrance existente) | `922f73cb test(home): preserve the reduced-motion Pingo entrance (R7)` |
| R8 | `src/screens/home/pingo-phrase.test.ts::#190 R8: homePingoPhrase elige por distancia y plan` (14 ramas/bordes) | `bd12aaff test(home): cover phrase priorities and distance boundaries (R8)`<br>`ea7071f0 feat(home): select Pingo phrase from existing daily data (R8)` |
| R9 | `src/screens/home/pingo-phrase.test.ts::#190 R9: las cuatro frases tienen el copy aprobado`; `src/providers/__tests__/language-provider.test.tsx::#65 R12: ...::mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` | `f6240159 test(home): lock bilingual Pingo phrases (R9)`<br>`4b4990cf feat(home): add approved Pingo copy in both languages (R9)`<br>`debf4467 test(home): pass the translation probe as a React child (R9)` |
| R10 | `src/screens/home/index.test.tsx::#190 R10: la frase usa los datos de Inicio y reacciona al idioma` (4 casos, cinco queries sin recarga) | `3fac2a91 test(home): translate live Pingo phrases without refetching (R10)`<br>`22219e18 feat(home): render localized Pingo phrases from loaded data (R10)` |
| R11 | `src/screens/home/index.test.tsx::#190 R11: la burbuja sigue la receta del canvas`; `src/__tests__/home-pingo-phrase.test.ts::#190 R11: token de la cola de la burbuja` | `8e4387dc test(home): lock bubble typography and corner token (R11)`<br>`21c6c350 feat(home): add token-based Pingo bubble styling (R11)` |
| R12 | `src/__tests__/home-pingo-phrase.test.ts::#190 R12: los ficheros de la frase permanecen grep-clean` (2 ficheros; mutación bg-[#fff] verificada y retirada, nace verde) | `cfe3092a test(home): enforce grep-clean Pingo sources (R12)` |
| R13 | `src/__tests__/home-pingo-phrase.test.ts::#190 R13: las claves de la frase están en el inventario de Inicio`; inventarios en `alerts-canvas-fidelity.test.ts`, `ui-copy-table.ts`, `ui-language.test.ts`, `consistency-classnames.test.ts` (#62 R14 y #98 R10) y `profile-canvas-fidelity.test.ts` (#173 R2), enmendados por #190 R13 | `5d3d019b test(home): require the four Pingo copy inventory entries (R13)`<br>`26ac6d6b feat(home): align copy and typography inventories for Pingo (R13)`<br>`3ec3305b feat(home): align Pingo radius and continuous-corner inventories (R13)` |
| R14 | `src/__tests__/home-pingo-phrase.test.ts::#190 R14: la carta incorpora la enmienda aprobada` (texto íntegro y orden del cuerpo; casilla aparte, tolerante a `[ ]`/`[x]`/`[X]`) | `6fb84202 test(home): lock the complete Pingo UI amendment text (R14)`<br>`be7edead feat(home): document the approved Pingo UI amendment (R14)`<br>`5f14c907 test(home): tolerate the signed amendment checkbox (R14)` |
| R15 | Smoke Android claro/oscuro/reduce motion **sin ejecutar por IA**. Guion: `progress/impl_mobile-home-pingo-phrase.md::Smoke Android R15`. Casilla de requirements sin firmar. | Sin commit propio; cierre reservado al humano. |

R7 y R12 nacen verdes por implementación previa, como permite el handoff. El rojo de R12 se comprobó plantando y retirando una violación sin commitearla. Los inventarios de entrada se sincronizan al introducir el bloque en R1 para conservar verde la suite completa; los retrasos se enmiendan en R6. Los inventarios adicionales de esquinas/radio se incorporan bajo la excepción explícita de R13, tras medir sus fallos en el conjunto completo. El detalle y logs están en el informe de implementación.
