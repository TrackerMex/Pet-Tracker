# spec_author — Enmienda E1 de #18 nutrition-ai-explainer

- Base congelada: `c09ee51c` (branch `feature/18-nutrition-ai-explainer-claude`)
- Origen: `progress/review_nutrition-ai-explainer.md` ronda 1, F1–F5 y la tabla C
  de §Sondas. O1–O4 quedan fuera.
- Estado: **completa, pendiente de firma humana**. La casilla
  «Enmienda E1 aprobada por humano (fecha: )» de §Aprobación está sin marcar.
- No se ha hecho ningún commit. `progress/current.md` ya estaba modificado
  antes de esta sesión y no lo he tocado.

## Dónde está escrita

| Archivo | Qué cambia |
|---|---|
| `specs/nutrition-ai-explainer/requirements.md` | `## Enmienda E1 (2026-10-08)` (E1.0–E1.6 y §Cifras y alcance), entre la enmienda 2026-10-08 y «Overrides humanos vigentes»; casilla nueva en §Aprobación; frontmatter sin tocar (`status: approved`) |
| `specs/nutrition-ai-explainer/design.md` | nota «Enmienda E1.3» después de la viñeta «Import perezoso» de D5 |
| `specs/nutrition-ai-explainer/tasks.md` | `## Enmienda E1 — ronda 2` al final: commits E1-c1…E1-c12 con su gate y la tabla de sondas S-E1.* |
| `specs/nutrition-ai-explainer/traceability.md` | filas E1.1–E1.5, todas `pendiente`, y una nota bajo «Regla» |

Lo aprobado de R1–R19 no se ha reescrito. Los cambios a ese texto van como
overrides en E1.6: C-6, D5 de design, la lectura de R3.4, la condición IF de
R11 y los *Test* de R5 y R10.

## Decisiones tomadas

1. **Seam de producción en E1.3.** El constructor gana un cuarto parámetro,
   `loadSdk: AnthropicSdkLoader`, cuyo default es
   `async () => await import('@anthropic-ai/sdk')`. También se añaden
   `AnthropicClientOptions` y `AnthropicSdkLoader`, ambos exportados y
   estructurales. La conducta no cambia y el factory sigue igual. Lo validé en
   un spike: `tsc` da exit 0 contra el SDK 0.128.0 real, el adaptador sigue en
   25/25 y el factory en 18/18.
2. **`jest.mock` no sirve.** Con `module: nodenext`, el `import()` nativo da
   `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` en jest. Lo reproduje en un
   spike y queda como evidencia en E1.0.
3. **D-E1-a.** El factory pasa clave y modelo sin recortar, que es la lectura
   literal de `(model, key, null)`. Se fija con un `it` de valores con
   espacios. El humano puede derogarlo, pero eso sería un cambio de conducta
   fuera de E1.
4. **Seam primero (E1-c5), test después (E1-c6).** Sin el cuarto parámetro, el
   test no compila, y C4 prohíbe los rojos de compilación o `ReferenceError`.
   Queda declarado por escrito antes del handoff.
5. **Cada lock tiene su rojo versionado.** Es una mutación de producción del
   veredicto, conforme a C4, «Ningún commit rojo falla por una mutación del
   doble». Las demás ramas se acreditan con sondas, cada una con su recuento
   `Tests:` exacto sobre el archivo completo.
6. **E1.5, fila 2, con un tipo inventado (`'tipo-futuro'`).** R10 dice
   «cualquier otro tipo», y con un tipo inventado una lista negra de tipos
   conocidos no puede pasar. En el spike usé `tool_use`, y el resultado de
   A7/A8 no depende de ese nombre.
7. **La 4.ª fila de E1.4 es `undefined`.** La mutación del veredicto
   (`!= null`) la deja verde, así que su rojo se acredita con la sonda
   S-E1.4a (`!== null`).
8. **Los literales de los candados están escritos en el test.** Ejemplos:
   `timeout: 15000`, `maxRetries: 0`, `'modelo-de-prueba'`. Nunca se usan
   constantes importadas de producción, para que el candado no sea
   tautológico.
9. **Nombre del método.** Es `explain`, no `generate` como decía el encargo.
   La spec usa `explain()`.

## Anclas medidas en c09ee51c

Las 28 anclas E1-A1…E1-A28 de requirements §Enmienda E1 §Cifras y alcance se
ejecutaron literalmente desde la tabla con un script el 2026-10-08. Las 28
coinciden con la columna `c09ee51c`:

- A1 = 1, A2 = 0, A3 = 0, A4 = 0 y A5 = 0.
- A6 = 1, A7 = 1, A8 = 1 y A9 = 1.
- De A10 a A23, todas valen 0.
- A24 = 4.
- De A25 a A28, todas valen 0.

## Anclas que cambian tras E1 (antes → después)

| Ancla | Qué cuenta | Antes | Después |
|---|---|---|---|
| E1-A3 | `export type AnthropicSdkLoader` | 0 | 1 |
| E1-A4 | `export interface AnthropicClientOptions` | 0 | 1 |
| E1-A5 | `await this.loadSdk()` | 0 | 1 |
| E1-A10 | `constructorArgs(` | 0 | 4 (1 definición + 3 usos) |
| E1-A11 | `'%s y %s fallan: gana %s'` | 0 | 1 |
| E1-A12 | `pasa clave y modelo sin recortar (E1.1)` | 0 | 1 |
| E1-A14…A19 | cada una de las 6 etiquetas de fila nuevas de R10 | 0 | 1 |
| E1-A20 | `'tipo-futuro'` | 0 | 1 |
| E1-A21 | describe `E1.3:` | 0 | 1 |
| E1-A22 | `'sdk ausente'` | 0 | 2 |
| E1-A23 | `'opciones invalidas'` | 0 | 2 |
| E1-A24 | `new AnthropicNutritionExplainer(` en el spec del adaptador | 4 | 7 |

Estas anclas no se mueven: A1 = 1 (= A48), A2 = 0 (= A49), A6, A7, A8, A9,
A13 (= A52), A25 (diff neto del factory), A26 (`nutrition-scope.spec.ts`),
A27 y A28 (= A47).

Recuento de tests: el spec del factory pasa de 18 a 25 y el del adaptador de
25 a 34.

## Abierto / no cerrado

- Falta la **firma humana** de E1, que es una casilla propia en §Aprobación.
- Hay recuentos **derivados, no medidos**. El spike usó specs reducidos (8 y 10
  tests); las cuentas sobre el archivo completo las razoné fila a fila contra
  los fixtures de `c09ee51c`. Son estas:
  - los 3 rojos de E1-c1 y de S-E1.1a (el spike no tenía el anti-vacío de R3);
  - el rojo extra del `it` de texto de R9 en S-E1.3c;
  - la zona ciega *array-like* de E1.4.

  Si Codex mide otra cosa, tasks.md le indica que pare y no ajuste la tabla.
- La base de `tsc --noEmit` del backend completo no la medí. tasks.md manda
  medirla al arrancar y no añadir errores.
- Zonas ciegas declaradas y sin candado:
  - un 4.º argumento en el factory (lo vigilan las anclas E1-A9 y E1-A25);
  - un orden dependiente del valor (E1.2);
  - el cuerpo del cargador por defecto (lo vigilan R9 por texto y R19);
  - un rechazo que no sea `Error` en el camino perezoso;
  - un `content` *array-like*;
  - un filtro por prefijo `text…`.
