---
feature: "design-drift-hex-guard-rid"
status: approved       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[design-drift-hex-guard-rid]] (#108)

Rutas relativas a `mobile-pet-tracker/`.
Convención de commit: `test(mobile): <desc> (R<n>)` para el rojo;
`refactor(mobile)` / `fix(mobile)` / `docs(conventions)` para el verde.
Quien implemente rellena las dos últimas columnas tras cada commit; el
`reviewer` no aprueba si queda una fila en «pendiente» (CHECKPOINTS C5).

**No rebasear después de rellenar esta tabla**: los hashes dejarían de ser
ancestros y habría que reapuntarlos uno a uno verificando
`git merge-base --is-ancestor`.

| Requisito | Test (archivo :: título literal del `describe`) | Tests | Commit rojo | Commit verde |
|---|---|---|---|---|
| R1 — el átomo hex y la lista de sombra se declaran una sola vez | `src/__tests__/design-drift.test.ts` :: `#108 R1: los patrones compartidos se declaran una sola vez` | 2 | `74c7cd29` | `cd1b262a` |
| R2 — el guard ignora `#<id> R<n>` y sigue disparando ante cualquier hex | `src/__tests__/design-drift.test.ts` :: `#108 R2: el guard de estilo distingue un R-id de un color hex` | 8 | `63908134` | `0a56ddf9` |
| R3 — los dos títulos de #106 vuelven a ser literales enteros | `src/__tests__/design-drift.test.ts` :: `#108 R3: los títulos de #106 vuelven a ser literales enteros` | 3 | `ed7a1895` | `c9a5561d` |
| R4 — la convención `#<id> R<n>` queda escrita en `docs/conventions.md` | `src/__tests__/design-drift.test.ts` :: `#108 R4: la convención de cita del guard está documentada` | 1 | `75b4d0d3` | `7c719c17` |

**Total de tests nuevos: 14**, en 4 describes nuevos. El gate numérico de
[[requirements]] se deriva de esta columna: 1396 + 14 = **1410** en la suite,
41 + 14 = **55** en `design-drift.test.ts`, 17 + 4 = **21** describes. Si la
columna «Tests» cambia, el gate cambia con ella.

## Notas para quien rellene la tabla

- **Los cuatro requisitos tienen rojo natural por aserción**, ninguno necesita
  mutación para producirlo: los cuatro aseveran sobre el contenido de ficheros
  que ya existen. #108 se declara de **verificación, vía (b) de C4** porque no
  añade comportamiento de producción, pero el historial rojo → verde es real en
  los cuatro. Ningún commit rojo puede fallar por `ReferenceError`.
- **El orden R2 → R3 no es negociable.** Revertir los literales con el regex
  viejo pone en rojo los cinco guards que listan `screens/home/index.test.tsx`
  (`:220, :260, :279, :301, :322`), y ese rojo no es el del candado de R3.
- **El prefijo `#108` en los títulos de `describe` es obligatorio**:
  `design-drift.test.ts` ya acumula R-ids de muchas specs a la vez —`R3`, `R4`,
  `R9` y `R11` sin prefijo, más `#68`, `#69`, `#70`, `#71`, `#79`, `#85`, `#87`,
  `#94` y `#98` con él— y sin prefijo el título no identifica nada
  (`docs/conventions.md` §Prefijo de feature cuando un fichero acumula R-ids de
  dos specs).
- **`grep '#106 R2' src/` devolverá dos aciertos** cuando R2 y R3 estén verdes:
  el describe de `screens/home/index.test.tsx` y la muestra F1 del guard de
  `design-drift.test.ts`. Es por diseño —el guard cita lo que protege— y no
  rompe el método de C5, que desambigua por título completo.
- La **sonda de mutación** de [[tasks]] §Al terminar no genera commits: su
  evidencia va a `progress/impl_design-drift-hex-guard-rid.md`.
- **#108 no se marca `done`** sin veredicto aprobado del `reviewer`. No hay
  gate de humo: la feature no cambia ni una línea que llegue al dispositivo.
