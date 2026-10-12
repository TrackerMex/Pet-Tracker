# review: mobile-chunky-cta (#166)
Fecha: 2026-10-12
HEAD revisado: ea885296 (branch feature/166-mobile-chunky-cta, worktree Pet-Tracker-wt-166)
Veredicto: APROBADO (R5 queda abierta: prueba de humo humana en dev build de Android, fuera del gate del reviewer)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: id 166).
- [x] `progress/current.md` describe la sesión de #166 (worktree, firma `94f64979`, handoff, Reanudación 1).

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: la feature no toca backend ni capas de dominio.
- [x] Contratos en domain como interfaces puras: sin cambios.
- [x] application depende de interfaces: sin cambios.
- [x] infrastructure sin lógica de negocio: sin cambios.
- Alcance real del diff de producción: 18 inserciones del labio en `className` de primarios (el de Bienvenida ya lo llevaba desde #153), 4 recetas de secundario neutro, 2 líneas de token en `src/theme/global.css` y el punto 13 de la carta. Ninguna lógica.

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra:
  - R1: `#166 R1: global.css declara el labio gris en los dos temas`.
  - R2: `#166 R2: todo primario sólido lleva el labio detrás de bg-accent` y los 8 `it` de T2.1.
  - R3: `#166 R3: el secundario neutro lleva el labio gris` (en consistency-classnames y en welcome) y el `it` de `R8` renombrado.
  - R4: `#166 R4: la carta declara el botón con cuerpo`.
  - R5 es humana y no tiene test, como dice la spec.
- [x] El historial muestra test primero. Los commits `test` y `feat`/`docs` están separados uno a uno. Verifiqué cada commit rojo de forma independiente, en un worktree temporal desprendido y ya borrado:

| Commit | Tests | Esperado (handoff) | Causa del rojo |
|---|---|---|---|
| 13a0db1a test R1 | 2 failed, 51 passed, 53 total | igual | aserción `toMatchObject` en las filas light y dark |
| d03bc813 feat R1 | 53 passed | igual | — |
| 76e691ec test R2 | 10 failed, 342 passed, 352 total | igual | aserción; los 10 ● coinciden con la tabla de T2.1 y los 2 `it` nuevos |
| 1b876c1d feat R2 | 352 passed | igual | — |
| 3a88c9bb test R3 | 7 failed, 293 passed, 300 total | igual | aserción: 4 filas, el inventario y los 2 `it` de welcome |
| ee889a54 feat R3 | 300 passed | igual | — |
| aab4b5f9 test R4 | 1 failed, 62 passed, 63 total | igual | aserción `toContain` |
| fd5e2a30 docs R4 | 63 passed | igual | — |

En ningún rojo hubo `Test suite failed to run`, TypeError, ReferenceError, SyntaxError, `Cannot find module` ni `Unable to find`.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` solo tiene «pendiente» en la fila de R5. Es la prueba de humo humana, y la spec la reserva a la casilla propia de §Aprobación.
- [x] Los 8 hashes de R1-R4 existen y son ancestros de HEAD (`git merge-base --is-ancestor`).
- [x] Los commits siguen `test|feat|docs(mobile): <desc> (R-id)`. Los commits del harness (`docs(mobile-chunky-cta)`, `docs(harness)`) no llevan R-id y no lo necesitan.

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-chunky-cta/requirements.md` tiene `status: approved` y la casilla humana marcada (2026-10-11, commit de firma `94f64979`).
- [x] `requirements.md` y `design.md` no cambian desde la firma.
  - `tasks.md` sí cambió una vez, en H0 `e96870fa`: el leader corrigió la clave de `toMatchObject` a `'color-lip-gray'`, sin `--`, porque `parseVariables` quita el prefijo. Está documentado en `tasks.md` y `current.md`, y no toca ningún requisito (obs. O1).
- [x] Casilla R5 (`[ ] Prueba de humo R5`) abierta. Es lo correcto: la cierra el humano.

## Checklist C7 — Sin código huérfano
- [x] La feature no reemplaza ningún componente ni módulo. Solo revierte candados que fijaban la ausencia de labio, y no deja ninguno de ellos huérfano:
  - el `not.toMatch(/border-b-4/)` de `empty-state.test.tsx`;
  - `#153 R7 > deja el CTA secundario sin labio` en `welcome/index.test.tsx`.

  Los dos están borrados o renombrados, y `traceability.md` lo registra.
- [x] No quedan tests de código eliminado.
- [ ] N/A — no hay módulo reemplazado.

## Checklist C8 — Carta UI
Skills cargadas: `expo:expo-overview` y `expo:expo-design-system` (tokens y tema, la que la carta §Skills pide para esta tarea).
- [x] Grep-clean sobre `git diff e96870fa -- mobile-pet-tracker/src`:
  - 0 hex nuevos fuera de `src/theme/`;
  - 0 `className` con corchetes;
  - 0 `StyleSheet`;
  - 0 `shadow-`, `elevation` o `boxShadow` añadidos (CA-2).

  `design-drift` y `legibility-classnames` están en verde en init.sh.
- [x] Dimensiones y safe areas: sin cambios de layout. El labio es un borde dentro del propio botón.
- [x] Skeleton: sin cambios en estados de carga.
- [x] Reutilización: el token se extiende en el sistema ya declarado (`global.css`, `@variant light/dark`). Es lo que pide «Adopt Before You Build» de `expo-design-system`. La receta por `className` en vez de un `ChunkyButton` es decisión aprobada en `design.md` (alternativa descartada).
- [x] Feedback pressed y touch target: siguen siendo `Button` de heroui; el labio no reduce el área.
- [x] Animaciones nuevas: ninguna.
- [x] CA-4/CA-5: `package.json`, `bun.lock`, `src/i18n/catalog.ts` y `src/__tests__/ui-copy-table.ts` no cambian desde H0 (`git diff --quiet` = 0).
- [x] Carta: el punto 13 es igual byte a byte al bloque de `design.md` D5, entre el 12 y `## Animación`.

## Lista cerrada
- [x] `git diff --stat e96870fa..HEAD` sin `progress/handoff_mobile-chunky-cta.md` (único fichero del commit del leader `f1c47164`, excluido por pathspec): 31 ficheros. Coincide exactamente con la lista cerrada del handoff.
- [x] Las sondas S1.x-S4.x del impl (`/tmp/166-s*.txt`) coinciden con las líneas `Tests:` y los nombres ● esperados del handoff. Todas terminan con `limpio=0`.
- [x] El impl deja el guion de R5 y la línea `R5: pendiente del smoke humano`.
- [x] Recuentos independientes en `src/` (sin tests):

| Patrón | Recuento | Esperado |
|---|---|---|
| `rounded-xl bg-accent(?=[\s'"\`])` | 19 | 19 |
| receta del primario completa | 19 | 19 |
| receta del secundario | 4 | 4 |
| `\bborder-b-4\b` | 19 | 19 |
| `border-black/25` | 19 | 19 |
| `\bborder-b-6\b` | 4 | 4 |

  El inventario de `<Button` da 58 tags y su clasificación cuadra con M3.

## Sondas propias
Cada sonda se aplicó en wt-166, corrió jest acotado, se revirtió con `git checkout HEAD -- <fichero>` y terminó en `limpio=0`. CC = `src/__tests__/consistency-classnames.test.ts`, GC = `src/theme/__tests__/global-css.test.ts`.

| Id | Mutación | Test | Resultado | Lectura |
|---|---|---|---|---|
| M1 | `profile-pet-retry` recibe `className="rounded-xl bg-accent"`: primario fuera del inventario, sin labio | CC | 3 failed: `#62 R1`, `#98 R10`, `#166 R2 inventaría…` | R2.1/R2.2 cubiertas fuera de M1 |
| M2 | lo mismo con orden `bg-accent rounded-xl` | CC | 63 passed | zona ciega por definición (obs. O2) |
| M3 | borrar `--color-lip-gray` del tema dark | GC | 1 failed: fila dark | R1 por tema |
| M4 | borrar `--color-lip-gray` del tema light | GC | 1 failed: fila light | R1 por tema |
| M5 | `forgot-resend` con orden `border-b-6 border-2` | CC | 1 failed: fila forgot-resend de R3.1 | R3.1 receta contigua |
| M6 | `profile-pet-retry` recibe `variant="outline"` sin labio | CC | 1 failed: inventario R3 | R3.2 rama outline/secondary |
| M7 | `profile-pet-retry` recibe la receta de secundario completa | CC | 1 failed: inventario R3 | R3.2 rama border-lip-gray |
| M8 | `border-b-4` en `components/card.tsx` (no-Button, `components/`) | CC | 1 failed: `no deja la receta del labio fuera…` | R2.3 |
| M9 | el segundo primario de `docs` pierde el labio (fichero con 2) | CC | 2 failed: inventario R2 y R2.3 | reparto por fichero |
| M10 | `border-b-6` en `components/card.tsx` | CC | 1 failed: inventario R3 | R3.3 |
| M11 | la regla «El labio va detrás…» sale del punto 13 al final de la carta | CC | 63 passed | `toContain` sobre el documento entero (obs. O3) |
| M12 | Bienvenida con el labio delante de `bg-accent` | CC | 3 failed: `#62 R1`, `#98 R10`, inventario R2 | orden labio/bg-accent |
| M13 | Bienvenida con el orden interno del labio invertido | CC | 1 failed: inventario R2 | secuencia contigua R2.1 |

`grep -rnE 'variant=\{' src --include=*.tsx` sin tests: 0. No hay variantes dinámicas que escapen a la clasificación de R3.2.

## Observaciones
Ninguna bloquea. Los candados implementados son los que prescribe la spec aprobada; las zonas ciegas O2 y O3 salen de las definiciones de la spec, no de una desviación del implementer.

- O1. `tasks.md` cambió tras la firma, en H0 `e96870fa`: la clave de `toMatchObject` pasó a `'color-lip-gray'`. Es una corrección mecánica documentada por el leader. `requirements.md` y `design.md` no cambian.
- O2. Un `Button` nuevo con `bg-accent rounded-xl` (orden invertido) no es «primario sólido» según la definición de la spec (P1: literal `rounded-xl bg-accent`). Escapa a R2, a `#62 R1` y a `#98 R10` (sonda M2 verde). Pasa lo mismo con las variantes `ghost` y `tertiary` de heroui, que quedan fuera de la regla de R3.2 (hoy no se usan en producción). Es deuda de definición, heredada de #62. Si se quiere cerrar, va en una spec futura: un candado que cuente `bg-accent` en tags `<Button` sin `rounded-xl` delante.
- O3. El test de R4 busca los literales con `toContain` en toda `ui-guidelines.md`, no dentro del punto 13 (sonda M11 verde). Hoy el texto es igual byte a byte a D5. El candado es el que prescribe `tasks.md` T4.
- O4. init.sh avisa «A worker process has failed to exit gracefully» en la suite móvil. Es preexistente y no hay rojo. También avisa «.env desactualizado: faltan 6 claves de .env.example», que es del entorno del worktree.
- O5. El mensaje de encargo habla de «16 ficheros» de primarios. La spec y el test dicen 17 con Bienvenida, que ya tenía el labio, así que 16 ficheros modificados. No es un defecto.

## Output de ./init.sh
init.sh lo corrió el leader sobre HEAD `ea885296` (exit 0). El clasificador se lo deniega al reviewer y además colisiona con otros worktrees. Leí el log completo en `/tmp/166-init.txt` y confirmé que HEAD sigue en `ea885296` con el árbol limpio:
```
✅ Build exitoso
backend unit   Test Suites: 187 passed, 187 total / Tests: 1474 passed, 1474 total
               Test Suites: 2 passed, 2 total     / Tests: 14 passed, 14 total
mobile         Test Suites: 98 passed, 98 total   / Tests: 2775 passed, 2775 total
               (PASS design-drift.test.ts, PASS legibility-classnames.test.ts)
backend e2e    Test Suites: 3 skipped, 30 passed, 30 of 33 total / Tests: 8 skipped, 468 passed, 476 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
avisos: ".env desactualizado: faltan 6 claves de .env.example"; "A worker process has failed to exit gracefully"
```
El total móvil, 2775, es la base ALL del impl (2765) más los 10 `it` añadidos por la cadena. Cuadra con la tabla de Cuentas de `tasks.md`.
