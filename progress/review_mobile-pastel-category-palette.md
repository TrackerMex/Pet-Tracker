# review: mobile-pastel-category-palette (#64)

Fecha: 2026-09-06
Branch revisada: `feature/64-mobile-pastel-category-palette` (worktree `/home/claude/sites/Pet-Tracker-wt-ui`)
HEAD revisado: `9da7ce2` (== `origin/feature/64-mobile-pastel-category-palette`, sin drift)
Base de comparación: `4ca0ce5` (punto de corte con `chore/design-gap-backlog`)

**Veredicto: RECHAZADO** — C4 no se puede marcar para **R3**, **R4** y **R9**:
sus commits rojos fallan por un símbolo de test inexistente, no por la aserción.
Todo lo demás está limpio y verificado de forma independiente.

> **Corrección del 2026-09-06.** La primera versión de este reporte decía **dos**
> requisitos afectados. Son **tres**: R3 tiene el mismo defecto y no se
> materializó en la primera pasada. Añadido abajo, y con él una **sección nueva
> de prueba de mutación** que responde a la pregunta que C4 protege de verdad
> —¿el candado está vivo?— para los tres. **Los tres candados están vivos.**

---

## Lo que se verificó recalculando, no leyendo

Se implementó un aparato propio (sRGB → lineal → XYZ D65 → CIE-Lab, contraste
WCAG 2.1 y CIEDE2000 desde la fórmula estándar) sin copiar el del repo.
Reproduce los tres anclajes publicados: `#FFFFFF` sobre `#2AB87C` = **2,547**,
`#FFFFFF` sobre `#178255` = **4,816**, y el ancla que pidió el handoff,
`danger-soft` oscuro = **`#38282E`** (`--danger` al 15 % sobre `--surface`).
También reproduce los compuestos de #61: `accent-soft` claro `#DCECE6`,
`tab-pill` claro `#DFEEE7`, `warning-soft` claro `#FEF0DA`, `accent-soft` oscuro
`#0E2220`, `tab-pill` oscuro `#0F2A25`, `warning-soft` oscuro `#383422`.

### Los 20 hex (R1, R2) — exactos

`global.css` declara los diez claros y los diez oscuros **carácter a carácter**
como los fija la spec. Ninguno redondeado ni "mejorado". La familia verde queda
atada: claro `#F0FBF6` = `--surface-secondary` y `#107148` = `--accent-strong`;
oscuro `#12231B` = `--surface-secondary` y `#2AB87C` = `--accent-strong`.
Las cinco superficies oscuras dan L relativa 0,014097 / 0,014104 / 0,014098 /
0,014096 / 0,014102 contra 0,014098 de `--surface-secondary`: misma profundidad,
como exige R2.

### Las 12 ratios de R3 — recalculadas, las 12 pasan AA

| Tema | blue | amber | green | violet | rose | neutral |
|---|---|---|---|---|---|---|
| claro | 4,746 | 4,705 | 5,703 | 4,725 | 4,732 | 4,601 |
| oscuro | 4,810 | 4,776 | 6,432 | 4,811 | 4,788 | 6,148 |

Las doce coinciden con la spec a tres decimales y las doce son ≥ 4,5:1.

### La tabla CIEDE2000 de `design.md` §3.3 — recalculada entera

**Las 12 celdas de superficie coinciden con la versión enmendada, incluidas las
dos corregidas.** No aparece una tercera celda mal en §3.3:

| Hueco | mín. claro | contra | mín. oscuro | contra |
|---|---|---|---|---|
| `blue` | 9,40 | `accent-soft` | **16,74** | **`danger-soft`** |
| `amber` | 4,87 | `warning-soft` | 8,95 | `warning-soft` |
| `green` | 3,49 | `tab-pill` | 3,62 | `accent-soft` |
| `violet` | 10,16 | `danger-soft` | 10,20 | `danger-soft` |
| `rose` | 4,58 | `danger-soft` | 9,84 | `danger-soft` |
| `neutral` | 8,48 | `tab-pill` | **10,65** | `accent-soft` |

Las 6 celdas de tinta también coinciden: amber/`warning-strong` 6,34 y 21,01;
rose/`danger` 9,61 y 9,18; green/`accent-strong` 0,00 y 0,00 (deliberado);
green/`success` 15,38 y 7,21; blue/`muted` 16,12 y 18,83; violet/`muted` 18,92 y
17,87.

Extra: la matriz de §3.2 (15 parejas × 2 temas) también reproduce entera.
Mínimo claro 3,66 (azul contra neutral), mínimo oscuro 9,26. Mínimo absoluto de
la paleta 3,49 (verde contra `tab-pill` claro), 1,5× el umbral de 2,3.

**Un desliz de documentación, fuera de §3.3 y fuera de todo requisito**:
`design.md` §3.1, tabla oscura, fila `neutral`, columna "Sobre `--surface`" dice
**6,792**; el valor real es **6,813** (6,792 es el de la fila `green`, copiado
una fila arriba). No afecta a R3 —que solo fija las doce ratios sobre la
superficie propia, todas correctas— ni a ningún token. Corregir cuando se toque
la spec; no bloquea.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#64)
- [x] `progress/current.md` describe la sesión activa

## Checklist C3 — Arquitectura

Feature de UI pura sobre `mobile-pet-tracker/`: no toca domain, application ni
infrastructure. `git diff 4ca0ce5...HEAD --stat` da **cero archivos bajo
`backend-pet-tracker/` y cero bajo `infra/`**.

- [x] domain sin imports de infrastructure — N/A, no se toca ninguna capa
- [x] repositories/contratos en domain son interfaces puras — N/A
- [x] application depende de interfaces — N/A
- [x] infrastructure sin lógica de negocio — N/A

## Checklist C4 — TDD

- [x] Cada R1–R10 tiene al menos un test que lo nombra (`describe('#64 R<n>: …')`)
- [ ] **El historial muestra el patrón rojo→verde real** — falla en R3, R4 y R9

Se materializaron seis commits rojos en copias aisladas (`git archive` + enlace a
`node_modules`, sin tocar la branch de este worktree, como pedía el handoff) y se
ejecutó el test de cada uno:

| Rojo | Requisito | Cómo falla | Legítimo |
|---|---|---|---|
| `a89c8ee` | R1 | `toMatchObject` — faltan los diez tokens claros (1 falla, 32 pasan) | sí |
| `3521773` | **R3** | **`ReferenceError: categoryContrastCases is not defined` — el archivo ni siquiera carga: `Tests: 0 total`** | **no** |
| `395d13a` | R4 (original) | `ReferenceError: deltaE00 is not defined` (4 fallas) | no |
| `feac447` | **R4 (definitivo)** | **`ReferenceError: deltaE00 is not defined` (4 fallas)** | **no** |
| `c5e01ab` | R5 | `toEqual` — falta `category` en `REMINDER_TYPE_META` | sí |
| `d30ecad` | R8 | `toContain('bg-category-blue')` recibe `…bg-accent-soft` | sí |
| `f41678b` | **R9** | **`ReferenceError: categoryClassInventory is not defined`** | **no** |
| `2af79d5` | R10 | `toContain('| Hueco | Superficie | …')` — la tabla no está en la carta | sí |

Los verdes correspondientes se ejecutaron y pasan (`2e0315e` 51/51, `3e42193`
49/49), y la suite entera está verde en HEAD.

### El motivo del rechazo, con su evidencia

**R4.** El handoff avisaba: el rojo original `395d13a` fallaba por
`ReferenceError: deltaE00 is not defined`, que no es un rojo legítimo, y pedía
comprobar que el rojo **definitivo** falla por la aserción. **No lo hace: falla
exactamente igual.** `feac447` solo reescribe los números esperados
(`blue: 16.1 → 16.7`, `neutral: 9.6 → 10.6`) dentro de un `describe` que invoca
un `deltaE00` que todavía no existe. Y el verde `2e0315e` es **106 líneas, todas
en el archivo de test, cero líneas de producción**: lo único que añade es el
helper `deltaE00`.

La consecuencia concreta: la enmienda firmada por el humano —lo más delicado de
esta feature— **nunca pasó por un rojo que la ejercitara**. Que los números sean
correctos está comprobado (arriba, con aparato independiente) y el verde sí los
verifica a un decimal; lo que falta es la prueba de que el candado estaba vivo
antes de cerrarlo, que es justo lo que C4 pide y lo que el handoff señaló.

**R3.** El caso más crudo de los tres, y el que faltaba en la primera versión de
este reporte. El rojo `3521773` son 17 líneas que invocan `categoryContrastCases()`,
un helper que todavía no existe; el verde `20bd366` son **95 líneas, todas en el
archivo de test, cero de producción** — solo esa tabla de casos. El fallo no es
siquiera una aserción rota: el `it.each` revienta al construirse y jest reporta
**`Tests: 0 total`**. Ni un solo test llegó a ejecutarse en ese commit.

**R9.** Mismo patrón: `f41678b` falla por `ReferenceError:
categoryClassInventory is not defined`, y el verde `3e42193` son 28 líneas que
solo añaden ese helper. Además, el segundo `it` de R9 —el inventario de los
diecisiete `bg-accent-soft`— **ya pasaba en verde en el propio commit rojo**,
porque R7 y R8 habían aterrizado antes.

**Nota para quien lo corrija**: la causa raíz es de secuencia, no de descuido.
R4 y R9 son requisitos de *verificación* sobre artefactos que R1/R2 y R7/R8 ya
habían dejado en el árbol; en esa posición su aserción no puede estar roja. El
rojo legítimo exigiría haber puesto el test de R4 antes de la implementación de
R1/R2, y el de R9 antes de R7/R8. **No se recomienda rebase**: la branch lleva
dentro los dos commits de firma del humano (`4ca0ce5` y `56b201f`) y reescribir
la historia los clobbrearía. La salida barata es una decisión del `leader`, no
más código de Codex: o se aporta la evidencia que falta de que las dos
aserciones están vivas, o se declara por escrito en la spec que R4 y R9 son
requisitos de verificación cuyo rojo es de ausencia-de-helper, y se firma esa
excepción como se firmó la enmienda.

**Lo que NO es motivo de rechazo, verificado uno a uno:**

- **`0c3346d` ("R9 encapsula su inventario") no afloja el test.** Es un
  movimiento verbatim: las mismas 28 líneas del helper salen del ámbito de
  módulo y entran dentro del `describe('#64 R9')`. Ni una aserción tocada, ni un
  umbral bajado. Hace exactamente lo que dice.
- El helper `deltaE00` añadido al ámbito de módulo de `global-css.test.ts` es una
  **adición** (el archivo tiene 384 inserciones y **0 borrados**), no una edición
  de un test preexistente.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin ninguna fila "pendiente" en R1–R10; las diez filas
      registran test, verde y rojo. La única aparición de "pendiente" es la fila
      del gate humano de smoke, que debe seguir así
- [ ] Commits en el formato `feat(<scope>): <desc> (R1,R2)` — **desviación menor,
      no bloqueante.** `docs/conventions.md` §Commits pide conventional commits en
      inglés con los R-ids entre paréntesis al final, y la propia
      `traceability.md` de #64 declara `feat(mobile-pastel-palette): <desc> (R1,R2)`.
      Los commits reales son `feat(mobile-pastel-palette): R4 verifica separación
      perceptual`: en español y con el R-id encabezando la descripción. El R-id
      está presente y es inequívoco en los 33 commits, y la tabla mapea cada R a
      su hash, así que la intención de C5 se cumple. Se registra para que el
      `leader` decida si alinea la convención o el documento

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved`
- [x] Casilla "Aprobado por humano (fecha: 2026-09-05)" marcada, más las tres
      decisiones firmadas, en el commit **`4ca0ce5` del humano** (Alexis Sovera
      Mireles), no de un agente
- [x] La enmienda de §3.3 la firma el humano en **`56b201f`** (AlexisSM377); el
      commit solo marca la casilla
- [x] Ningún requisito modificado tras la aprobación: el diff `4ca0ce5 → HEAD`
      de `requirements.md` es el frontmatter a `approved` más la sección de firma
      de la enmienda, todo aditivo. R1–R10 intactos. `design.md` cambia
      exactamente las dos celdas firmadas
- [ ] Gate humano posterior: smoke en dev build de Android, temas claro y oscuro,
      Reminders y Documentos — **abierto, no delegable, no lo cierra este review**

## Checklist C7 — Sin código huérfano

- [x] N/A parcial — la feature no reemplaza ningún componente ni módulo. Sustituye
      tres `className` en su sitio y enmienda una aserción de #62 R10 declarada y
      firmada; no queda archivo ni test sin dueño

## Checklist C8 — UI móvil conforme a la carta

Grep-clean rehecho a mano sobre `mobile-pet-tracker/src`, no leído del reporte:

- [x] Cero hex fuera de `src/theme/`
- [x] Cero clases arbitrarias `[...]` (verificado con el mismo patrón que usa
      `design-drift.test.ts:181`, `[A-Za-z0-9_-]+-\[[^\]]+\]`)
- [x] Cero `StyleSheet.create`
- [x] Cero `shadow*`/`elevation` legacy
- [x] `bg-category-*` / `text-category-*` aparecen **solo** en
      `utils/category-palette.ts` (6) y en tests (21). Ninguna pantalla las escribe
- [x] Dimensiones, Skeleton, componentes compartidos, touch targets y animaciones:
      sin cambios — el diff de producción son 3 `className`, 1 `const`, 2 imports
      y un campo nuevo en un record

---

## Los otros puntos que pedía el handoff

**3. Los 17 `bg-accent-soft` de acento no se tocaron.** Inventario base → HEAD:
19 usos de producción antes, **17 después**. Desaparecen exactamente dos, los
dos autorizados (`docs/index.tsx:21` y `reminders/index.tsx:270`). Reparto por
archivo en HEAD, que coincide sitio a sitio con `design.md` §5:
`forgot.tsx` 1, `home.tsx` 3, `pet-switcher.tsx` 1, `add-pet/index.tsx` 4,
`add-reminder/index.tsx` 2, `pairing/index.tsx` 2, `profile/index.tsx` 3,
`reminders/index.tsx` 1 = 17.

**4. Ningún token existente cambió de valor.** El diff de `global.css` son
**20 líneas añadidas y 0 borradas**. `--accent`, `--accent-strong`,
`--radius-card`, `--warning`, `--warning-strong`, `--danger` y `--success`
intactos en los dos temas.

**5. Ediciones de tests preexistentes.** Borrados por archivo:
`reminders/index.test.tsx` **0**, `global-css.test.ts` **0**,
`consistency-classnames.test.ts` **0**, `docs/index.test.tsx` **2**. Las dos son
legítimas: la aserción de #62 R10 (única enmienda autorizada, que pasa de
`'…bg-default …text-muted'` al par categórico exacto y **sigue siendo un `toBe`
de cadena exacta**, no se debilita) y la línea de import, reformateada por
prettier al añadir `within` para el nuevo `describe`. Todo lo demás son bloques
`describe('#64 R…')` añadidos.

**8. El test inestable de foto de `add-pet` es preexistente, no lo introdujo #64.**
`src/screens/add-pet/index.test.tsx` e `index.tsx` son **byte a byte idénticos**
a la base (md5 `9076c174…` y `61de98c3…`), y la feature no toca esa pantalla.
Tres ejecuciones aisladas en la base y tres en HEAD: 17/17 verdes las seis veces.
El archivo ya arrastra esta clase de problema — #53 `mobile-jest-mock-hygiene`
existe justo por una fuga del mock del picker en él. Queda como deuda previa, no
como hallazgo de #64.

**9. Ningún `testID` cambia.** Conjunto extraído de las fuentes de producción
(`*.tsx` sin tests) en la base y en HEAD: **268 en cada uno, diff vacío**.
Tampoco cambia texto visible, conducta ni navegación.

**10. WCAG 1.4.1 — el color nunca es el único portador.** Las tres superficies
migradas conservan su acompañante y los tests lo afirman: el tile de recordatorio
mantiene `{meta.emoji}` y `{meta.label}` (el test de R7 comprueba 💉/"Vaccine" y
💊/"Medication" visibles); la fila de documento mantiene el emoji `📄` y el texto
`{document.type}` dentro del propio badge coloreado (el test de R8 los afirma en
la fila conocida y en la desconocida).

**11. La rejilla de accesos rápidos de la Home (#71) no aparece.** El diffstat no
incluye `src/app/(tabs)/home.tsx` ni ningún archivo bajo `src/app/`; los tres
`bg-accent-soft` de `home.tsx` siguen ahí.

**12. R10 está y dice lo que manda `design.md` §4.6.** `docs/ui-guidelines.md`
gana 16 líneas al final del punto 1 de §Dirección de arte: la tabla de los seis
huecos con su superficie, su tinta y sus tipos, más las dos frases de cierre
("El reparto vive en `src/utils/category-palette.ts` y es el **único** sitio…" y
"El color nunca es el único portador de la categoría…"). Bloque literal, idéntico
al que la spec dicta.

---

## Observaciones (resumen accionable)

1. **Bloqueante — C4, R3.** El rojo `3521773` falla por `ReferenceError:
   categoryContrastCases is not defined` y no ejecuta ningún test (`Tests: 0
   total`). El verde `20bd366` son 95 líneas, todas de test.
2. **Bloqueante — C4, R4.** El rojo definitivo `feac447` falla por
   `ReferenceError: deltaE00 is not defined`, igual que el descartado `395d13a`.
   El verde `2e0315e` solo añade el helper; cero producción. La enmienda firmada
   nunca se ejercitó en rojo.
3. **Bloqueante — C4, R9.** El rojo `f41678b` falla por `ReferenceError:
   categoryClassInventory is not defined`; el verde `3e42193` solo añade el
   helper. Su segundo `it` ya estaba verde en el rojo.
4. **Menor — documentación.** `design.md` §3.1, fila `neutral` oscura, columna
   "Sobre `--surface`": dice 6,792, el real es **6,813**. Fuera de §3.3 y sin
   efecto sobre ningún requisito ni token.
5. **Menor — convención.** Los commits llevan el R-id encabezando la descripción
   y en español, no `(R<n>)` al final y en inglés como fijan
   `docs/conventions.md` §Commits y la propia `traceability.md` de esta feature.

Y la contrapartida, en la sección de prueba de mutación de abajo: **los tres
candados están vivos**. El defecto es de historia, no de cobertura.

Nada más se encontró: los 20 hex, las 12 ratios, las 18 celdas de §3.3, la matriz
de §3.2, los 17 acentos, los 268 `testID`, el grep-clean y la trazabilidad están
todos limpios y verificados de forma independiente.

---

## Output de `./init.sh`

Ejecutado entero desde la raíz del worktree por este review, sin omitir fases.
`cdk synth` incluido (compila en local, no crea recursos AWS). Working tree
limpio antes y después. Salida completa en 10.932 líneas; resumen por fase:

```
→ Verificando entorno...
✅ node disponible (/usr/bin/node)
✅ pnpm disponible (/home/claude/.npm-global/bin/pnpm)
✅ bun disponible (/home/claude/.npm-global/bin/bun)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
⚠️  .env desactualizado: faltan 3 claves de .env.example
⚠️    configuración ausente: RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST
⚠️    init.sh no modifica .env — añade a mano las que necesites desde .env.example

→ Instalando dependencias...
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: mobile-pastel-category-palette
⚠️  STATUS.md desactualizado (58/63 declarado vs 59/71 real) — actualízalo antes de cerrar la sesión

→ Build...
> pet-tracker-infra@0.0.1 synth
> cdk synth --quiet
✅ Build exitoso

→ Ejecutando tests...
  backend:  Test Suites: 163 passed, 163 total | Tests: 1235 passed, 1235 total
  infra:    Test Suites:   2 passed,   2 total | Tests:   14 passed,   14 total
  harness:  TAP — entorno, verde
  mobile:   Test Suites:  59 passed,  59 total | Tests:  891 passed, 891 total | Snapshots: 1 passed
✅ Tests pasados

→ Tests e2e...
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 353 passed, 361 total
✅ Tests e2e pasados

→ Lint...
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 59/71 completadas | 11 pendientes
```

Exit code: **0**. Los avisos de `.env` y de `STATUS.md` son estado previo de la
branch y no los introduce esta feature.

## Ejecuciones adicionales del reviewer

Fuera de `init.sh`, en copias aisladas del árbol por `git archive` (la branch de
este worktree no se cambió en ningún momento):

```
a89c8ee  R1 rojo   → Tests: 1 failed, 32 passed  (falla la aserción)
395d13a  R4 rojo   → Tests: 4 failed, 47 passed  (ReferenceError: deltaE00)
feac447  R4 rojo   → Tests: 4 failed, 47 passed  (ReferenceError: deltaE00)  ← el bloqueante
2e0315e  R4 verde  → Tests: 51 passed, 51 total
c5e01ab  R5 rojo   → Tests: 1 failed,  1 passed  (falla la aserción)
d30ecad  R8 rojo   → Tests: 2 failed, 10 passed  (falla la aserción)
f41678b  R9 rojo   → Tests: 1 failed, 48 passed  (ReferenceError: categoryClassInventory)  ← el bloqueante
3e42193  R9 verde  → Tests: 49 passed, 49 total
2af79d5  R10 rojo  → Tests: 1 failed, 49 passed  (falla la aserción)

add-pet aislado, base   → 17/17 verde ×3
add-pet aislado, HEAD   → 17/17 verde ×3
```

---

# Prueba de mutación — ¿están vivos los candados de R3, R4 y R9?

Añadido el 2026-09-06 a petición del `leader`. **No sustituye ni ablanda el
veredicto de arriba**: el rechazo por C4 sigue en pie hasta que un humano firme
la excepción. Esto es la evidencia que debe acompañar a esa firma.

C4 no protege "hubo un commit rojo", protege "el candado está vivo". Los rojos
de R3, R4 y R9 no lo demostraron porque fallaban por un helper ausente. Se
comprueba aquí directamente: se muta el árbol para romper cada invariante y se
mira si el `describe` correspondiente se pone rojo, y **por qué aserción**.

Método: tres copias aisladas de HEAD (`git archive HEAD` + enlace a
`node_modules`), mutadas y ejecutadas con `bun run test`. **La branch de este
worktree no se tocó en ningún momento**; `git status` sigue limpio salvo este
propio reporte.

## R3 — **VIVO**

**Mutación**: en `global.css`, tema **claro**,
`--color-category-blue-strong: #0768E0` → **`#60A5FA`**. No es un valor
arbitrario: es la tinta azul original del Make, la que `design.md` §3.0 descarta
justamente por dar 2,336:1 sobre `#EFF6FF`.

**Resultado**: `Tests: 2 failed, 49 passed, 51 total`. El `describe('#64 R3…')`
se pone rojo en el caso `light blue`, y falla por la aserción de contraste:

```
● #64 R3: cada tinta categórica pasa AA sobre su superficie en los dos temas
  › light blue conserva el ratio diseñado

  expect(received).toBeGreaterThanOrEqual(expected)

  Expected: >= 4.5
  Received:    2.3361778834310294

  > 611 |       expect(ratio).toBeGreaterThanOrEqual(4.5);
    612 |       expect(ratio).toBeCloseTo(expected, 3);
```

El 2,3361778… recibido coincide con el 2,336 que publica `design.md` §3.0 y con
el que da el aparato independiente de este review. El candado mide de verdad.

**Efecto colateral, informativo**: también se puso rojo `#64 R1`, por su
`toMatchObject` de los diez hex exactos. Es un segundo candado vivo sobre el
mismo token. Y **R4 no se inmutó**, correctamente: cambiar esa tinta no acerca
ninguna superficie a otra.

## R4 — **VIVO**

**Mutación**: en `global.css`, tema **oscuro**,
`--color-category-violet: #221C33` → **`#0B203A`**, es decir la superficie
violeta pasa a ser idéntica a la azul (ΔE00 = 0).

**Resultado**: `Tests: 3 failed, 48 passed, 51 total`. Las **dos** aserciones de
separación de `#64 R4` se ponen rojas:

```
● #64 R4: ninguna categoría se confunde con otra ni con un token de estado
  › separa las quince parejas de superficies en dark

  expect(received).toBeGreaterThanOrEqual(expected)

  Expected: >= 2.3
  Received:    0

    675 |     expect(distances).toHaveLength(15);
  > 676 |     distances.forEach((distance) => expect(distance).toBeGreaterThanOrEqual(2.3));
```

```
● #64 R4: ninguna categoría se confunde con otra ni con un token de estado
  › separa superficies y tintas de los tokens de estado en dark

  expect(received).toBeCloseTo(expected, precision)

  Expected: 10.2
  Received: 16.73578218243516
  Expected precision:    1
  Expected difference: < 0.05
  Received difference:   6.53578218243516

  > 708 |       expect(Math.min(...stateSurfaceDistances)).toBeCloseTo(
```

La segunda es la más valiosa de toda esta prueba: el violeta mutado hereda el
mínimo del azul contra `danger-soft` y el test lo recibe como **16,7357…**,
que es exactamente la celda enmendada y firmada por el humano
(`blue` oscuro: 16,1 `accent-soft` → **16,7 `danger-soft`**). Es decir: **la
enmienda de §3.3 sí es la expectativa viva del test**, aunque su rojo no lo
demostrara en su día. También cayó `#64 R2` por su `toMatchObject` de hex
exactos, otro candado vivo.

## R9 — **VIVO** (las dos mitades)

**Mutación a** — escribir una clase categórica a mano en una pantalla, que es
literalmente la cláusula EARS de R9 ("IF alguna pantalla escribiera una de esas
clases directamente THEN el test SHALL fallar **nombrando el archivo**"). En
`src/screens/docs/index.tsx`, el `Text` del emoji pasa de
`className="text-lg"` a `className="text-lg bg-category-blue"`.

**Resultado**: `Tests: 1 failed, 49 passed, 50 total`, y falla **nombrando el
archivo**, como exige el requisito:

```
● #64 R9: el color categórico solo se nombra en el módulo de paleta
  › centraliza las diez clases completas y prohíbe interpolarlas

  - Expected  - 0
  + Received  + 1

    Array [
  +   "screens/docs/index.tsx",
      "utils/category-palette.ts",
```

**Mutación b** — deshecha la anterior, devolver uno de los tres usos categóricos
a su estado previo: en `src/screens/docs/index.tsx:21`,
`` `…rounded-xl ${slot.surface}` `` → `` `…rounded-xl bg-accent-soft` ``.

**Resultado**: `Tests: 1 failed, 49 passed, 50 total`. Salta el inventario de
los diecisiete:

```
● #64 R9: el color categórico solo se nombra en el módulo de paleta
  › conserva los diecisiete usos de bg-accent-soft que sí son acento

  expect(received).toBe(expected) // Object.is equality

  Expected: 17
  Received: 18

  > 402 |     expect(accentSoftCount).toBe(17);
    403 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
    404 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
```

## Qué cambia esto, y qué no

**Cambia** la lectura del riesgo. Los tres requisitos de verificación de esta
feature —R3, R4, R9— protegen exactamente lo que dicen proteger: el contraste AA
por tinta, la separación perceptual entre categorías y contra los tokens de
estado (con los números **enmendados** como expectativa viva), y la
centralización de las clases en un solo módulo. Una regresión futura en
cualquiera de los tres pone la suite roja. **No hay agujero de cobertura.**

**No cambia** el veredicto. Lo que falta es la evidencia *en la historia* de que
esos candados estaban vivos antes de cerrarse, y esa es la casilla de C4 que
sigue sin poderse marcar. La decisión de qué hacer con ella es del `leader` y
del humano, no de este review; las dos salidas ya descritas siguen sobre la mesa,
con el matiz de que ahora afectan a **tres** requisitos y de que esta sección
existe para poder firmar la excepción con datos en vez de con fe.

Recordatorio: el rebase sigue descartado. La branch lleva dentro los commits de
firma del humano `4ca0ce5` y `56b201f`; reescribir la historia los destruiría.

## Resumen

| Requisito | Rojo original | Candado |
|---|---|---|
| R3 | `3521773` — `ReferenceError`, `Tests: 0 total` | **vivo** |
| R4 | `feac447` — `ReferenceError: deltaE00` | **vivo** |
| R9 | `f41678b` — `ReferenceError: categoryClassInventory` | **vivo** |
