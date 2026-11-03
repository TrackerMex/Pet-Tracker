# Implementación #231 — mobile-welcome-secondary-pressed

**PARA: contradicción del control de diff del handoff.** HEAD `64a80f25`.
Implementación y 358 tests relevantes verdes; cierre incompleto. Véase el último
apartado: H0 excluye el commit del propio handoff y su archivo aparece en el diff,
aunque la lista cerrada lo prohíbe. No se modificó ni eliminó ese archivo.

Fecha: 2026-11-03. Alcance autorizado: R1–R6. R7 queda pendiente (espera gate G4).
No se ejecuta `./init.sh` (lo corre el leader), no se abre/edita PR y no se hace
fetch, merge, rebase ni instalación de dependencias. G2 y G4 permanecen intactos.

## Identidad y base

El primer comando real fue `pwd && git status --short && git branch --show-current`;
salió con árbol limpio, ruta y rama correctas. Tras leer el handoff ejecuté su
comando exacto, antes de modificar archivos:

```text
$ cd /home/claude/sites/Pet-Tracker-wt-231 && pwd && git branch --show-current && git log --oneline -4
/home/claude/sites/Pet-Tracker-wt-231
feature/231-mobile-welcome-secondary-pressed
f47114d1 docs(progress): #231 codex handoff
71a0e0f9 chore(spec): firma delegada #231 (mandato del humano 2026-10-23, ampliado 2026-11-03)
def9dce1 docs(spec): add spec for mobile-welcome-secondary-pressed (#231)
f05016d3 Merge pull request #284 from TrackerMex/docs/plan-mejoras-smoke-2026-11-03
```

H0: `71a0e0f9`; destino de integración: `dev`.

## Instrucciones y skills cargadas

Leídos requirements, design, tasks y traceability completos; arquitectura,
convenciones, carta de UI y checkpoints. D1–D4 se mantienen cerradas.
Skills: `ponytail`, `appllama-app-design-skill` y `building-native-ui`.
Esta última se localizó en
`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
La carta prevalece sobre las skills: se conservan Tailwind/Uniwind/HeroUI y el
smoke Android del humano; no se ejecuta el simulator loop de iOS ni investigación
de pantallas ajena al alcance. Leída también la referencia versionada exigida por
`mobile-pet-tracker/AGENTS.md`: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

**Cita de docs/conventions.md §Esperas sobre el árbol renderizado (línea 331):**
«La condición que termina una espera debe ser la misma observación que hacen las
aserciones posteriores. Si el test asevera el árbol, espera al árbol».
Los nuevos tests de render usan `await renderWelcome()` y consultan directamente
el nodo asertado; no esperan contadores de mocks. El mock de HeroUI no se cambia.

## T0 — antes de editar código o tests

Desde `mobile-pet-tracker/`, cuentas sobre producción (`.ts/.tsx`, excluyendo
`__tests__` y `.test.*`, igual que los helpers de los guards):

```text
grep -cF 'variant=' src/screens/welcome/index.tsx -> 0 (exit 1: ninguna coincidencia)
grep -cF 'border-lip-gray' src/screens/welcome/index.tsx -> 1 (exit 0)
git grep -l 'dark:border-' -- src -> sin coincidencias (exit 1)
dark:border- -> 0, inventory = {}
border-lip-gray -> 25 (ambos guards)
text-17 -> 46
<Text className="text-17 font-bold text-accent-strong"> -> 1
neutralInventory -> 18
```

Inventario neutro medido:
`${rowId}-ack`, `add-meal-time-button`, `alert-detail-view-map`, `alerts-attended-more`,
`docs-upload-cancel`, `forgot-resend`, `geofence-editor-delete`, `home-join-pet-button`,
`meal-time-edit-${index}`, `member-leave-sheet-cancel`, `member-remove-sheet-cancel`,
`pairing-unpair-cancel`, `pet-invite-copy`, `pet-members-leave`,
`reminders-cancel-series-keep`, `reminders-delete-cancel`, `secondary.testID`,
`welcome-have-account`.

`radii` medido (ruta relativa a `src/`, sin `/index.tsx` salvo indicación):
components/celebration.tsx=2, components/empty-state.tsx=1, screens/add-pet=2,
screens/add-reminder=2, screens/alert-detail=2, screens/alerts=1,
screens/docs-upload-form=2, screens/edit-profile=1, screens/food=3,
screens/forgot=3, screens/geofence-editor=4, screens/geofences=2, screens/health=2,
screens/home=2, screens/home/weekly-activity-chart.tsx=1, screens/join-pet=2,
screens/login=1, screens/map=1, screens/nutrition-plan=3,
screens/nutrition-questionnaire=2, screens/pairing=4, screens/pet-invite=2,
screens/pet-members=6, screens/register=1, screens/reminders=7,
screens/reset-password=2, screens/vaccine-create=1, screens/weight-log=1,
screens/welcome=2.

```text
$ bunx jest src/screens/welcome src/__tests__/chunky-cta-canvas-fidelity src/__tests__/consistency-classnames --runInBand
PASS src/screens/welcome/index.test.tsx (84.831 s)
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/chunky-cta-canvas-fidelity.test.ts
Test Suites: 3 passed, 3 total
Tests:       273 passed, 273 total
Snapshots:   0 total
Time:        86.688 s
exit 0
```

Salida resumida; HeroUI imprimió sus mensajes informativos de estilos. No hubo
`failed to run`, imports rotos ni cero tests. R5: comprobados antes de editar
el login R8, orden de welcome-rise-actions, labio #166 R3 y #177 R4.1/R4.2.

## Ejecución

Evidencia de commits, rojos, verdes y mutaciones a continuación. Las comprobaciones
finales quedaron sin ejecutar al activar el PARA obligatorio del handoff.

### Rojo inicial, antes de enmendar los pins (R1, R3, R4, R6)

`bunx jest src/screens/welcome src/__tests__/chunky-cta-canvas-fidelity src/theme/__tests__/global-css --runInBand --silent -t #231 R[1346]`

```text
FAIL src/theme/__tests__/global-css.test.ts
  ● #231 R4: contraste del borde oscuro de Bienvenida › #231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo

    expect(received).not.toBeNull()

    Received: null

      13 |     const tag = source.slice(source.lastIndexOf('<', index), source.indexOf('<', index));
      14 |     const match = tag.match(/(?:^|\s)dark:border-([a-z0-9-]+)(?=\s|")/);
    > 15 |     expect(match).not.toBeNull();
         |                       ^
      16 |     const variables = parseVariables(extractVariant('dark'));
      17 |     const color = variables[match![1]];
      18 |     expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);

      at Object.toBeNull (src/theme/__tests__/global-css.test.ts:15:23)

FAIL src/screens/welcome/index.test.tsx
  ● R8 › #231 R1: el secundario declara variant outline y conserva el feedback de escala

    expect(received).toBe(expected) // Object.is equality

    Expected: "outline"
    Received: undefined

      394 |     await renderWelcome();
      395 |     const props = screen.getByTestId('welcome-have-account').props;
    > 396 |     expect(props.variant).toBe('outline');
          |                           ^
      397 |     expect(props.animation).toBeUndefined();
      398 |     expect(props.feedbackVariant).toBeUndefined();
      399 |   });

      at Object.toBe (src/screens/welcome/index.test.tsx:396:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● R8 › #231 R3: el secundario añade el borde oscuro tras la receta neutra

    expect(received).toBe(expected) // Object.is equality

    Expected: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted"
    Received: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface"

      408 |     const props = screen.getByTestId('welcome-have-account').props;
      409 |     const NEW_CLASSES = 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted';
    > 410 |     expect(props.className).toBe(NEW_CLASSES);
          |                             ^
      411 |     expect(props.className.split(' ').slice(-3)).toEqual(['border-lip-gray', 'bg-surface', 'dark:border-muted']);
      412 |   });
      413 |

      at Object.toBe (src/screens/welcome/index.test.tsx:410:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #231 R6: los candados enmendados nombran su enmienda

    expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 1
    Received:    0

      434 |   ];
      435 |   for (const source of sources) {
    > 436 |     expect(source.split('enmendado por #231 R1, R3').length - 1).toBeGreaterThanOrEqual(1);
          |                                                                  ^
      437 |   }
      438 | });
      439 |

      at Object.toBeGreaterThanOrEqual (src/screens/welcome/index.test.tsx:436:66)

FAIL src/__tests__/chunky-cta-canvas-fidelity.test.ts
  ● #231 R3: la excepción dark:border-* vive solo en Bienvenida

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 1

    - Object {
    -   "screens/welcome/index.tsx": 1,
    - }
    + Object {}

      48 |
      49 | it('#231 R3: la excepción dark:border-* vive solo en Bienvenida', () => {
    > 50 |   expect(inventory(/dark:border-/g)).toEqual({ 'screens/welcome/index.tsx': 1 });
         |                                      ^
      51 | });
      52 |
      53 | const CTA_ROWS = [

      at Object.toEqual (src/__tests__/chunky-cta-canvas-fidelity.test.ts:50:38)

Test Suites: 3 failed, 3 total
Tests:       5 failed, 266 skipped, 1 passed, 272 total
Snapshots:   0 total
Time:        7.217 s, estimated 86 s

exit 1
```

Nace verde: el primario de R1 ya no declara variant; es la conducta correcta previa.

### Rojo con los tres pins enmendados, antes del commit 1

`bunx jest src/screens/welcome src/__tests__/chunky-cta-canvas-fidelity src/__tests__/consistency-classnames src/theme/__tests__/global-css --runInBand --silent`

```text
FAIL src/screens/welcome/index.test.tsx (8.637 s)
  ● R8 › #231 R1: el secundario declara variant outline y conserva el feedback de escala

    expect(received).toBe(expected) // Object.is equality

    Expected: "outline"
    Received: undefined

      394 |     await renderWelcome();
      395 |     const props = screen.getByTestId('welcome-have-account').props;
    > 396 |     expect(props.variant).toBe('outline');
          |                           ^
      397 |     expect(props.animation).toBeUndefined();
      398 |     expect(props.feedbackVariant).toBeUndefined();
      399 |   });

      at Object.toBe (src/screens/welcome/index.test.tsx:396:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● R8 › #231 R3: el secundario añade el borde oscuro tras la receta neutra

    expect(received).toBe(expected) // Object.is equality

    Expected: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted"
    Received: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface"

      408 |     const props = screen.getByTestId('welcome-have-account').props;
      409 |     const NEW_CLASSES = 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted';
    > 410 |     expect(props.className).toBe(NEW_CLASSES);
          |                             ^
      411 |     expect(props.className.split(' ').slice(-3)).toEqual(['border-lip-gray', 'bg-surface', 'dark:border-muted']);
      412 |   });
      413 |

      at Object.toBe (src/screens/welcome/index.test.tsx:410:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● R8 › es un botón de superficie con labio gris y tinta accent-strong (enmendado por #231 R1, R3)

    expect(received).toBe(expected) // Object.is equality

    Expected: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted"
    Received: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface"

      422 |   it('es un botón de superficie con labio gris y tinta accent-strong (enmendado por #231 R1, R3)', async () => {
      423 |     await renderWelcome();
    > 424 |     expect(screen.getByTestId('welcome-have-account').props.className).toBe('w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted');
          |                                                                        ^
      425 |     expect(screen.getByText('Ya tengo una cuenta').props.className).toBe('text-17 font-bold text-accent-strong');
      426 |   });
      427 | });

      at Object.toBe (src/screens/welcome/index.test.tsx:424:72)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

FAIL src/theme/__tests__/global-css.test.ts
  ● #231 R4: contraste del borde oscuro de Bienvenida › #231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo

    expect(received).not.toBeNull()

    Received: null

      13 |     const tag = source.slice(source.lastIndexOf('<', index), source.indexOf('<', index));
      14 |     const match = tag.match(/(?:^|\s)dark:border-([a-z0-9-]+)(?=\s|")/);
    > 15 |     expect(match).not.toBeNull();
         |                       ^
      16 |     const variables = parseVariables(extractVariant('dark'));
      17 |     const color = variables[match![1]];
      18 |     expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);

      at Object.toBeNull (src/theme/__tests__/global-css.test.ts:15:23)

FAIL src/__tests__/chunky-cta-canvas-fidelity.test.ts
  ● #231 R3: la excepción dark:border-* vive solo en Bienvenida

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 1

    - Object {
    -   "screens/welcome/index.tsx": 1,
    - }
    + Object {}

      48 |
      49 | it('#231 R3: la excepción dark:border-* vive solo en Bienvenida', () => {
    > 50 |   expect(inventory(/dark:border-/g)).toEqual({ 'screens/welcome/index.tsx': 1 });
         |                                      ^
      51 | });
      52 |
      53 | const CTA_ROWS = [

      at Object.toEqual (src/__tests__/chunky-cta-canvas-fidelity.test.ts:50:38)

  ● #177 R4.1: screens/welcome/index.tsx pinta la receta neutra de testID="welcome-have-account" (enmendado por E4 R19) (enmendado por #202 R9) (enmendado por #202 R15) (enmendado por #231 R1, R3)

    expect(received).toContain(expected) // indexOf

    Expected substring: "className=\"w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted\""
    Received string:    "<Button testID=\"welcome-have-account\" className=\"w-full h-14 rounded-16 border-2 border-lip-gray bg-surface\" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
                "

      150 | it.each(NEUTRAL_ROWS)('#177 R4.1: %s pinta la receta neutra de %s (enmendado por E4 R19) (enmendado por #202 R9) (enmendado por #202 R15) (enmendado por #231 R1, R3)', (path, anchor, classes, variant, _label, _labelClasses, keeps) => {
      151 |   const tag = openingTagWithTestId(readSource(path), anchor);
    > 152 |   expect(tag).toContain(`className="${classes}"`);
          |               ^
      153 |   expect(tag).toContain(path === 'screens/geofence-editor/index.tsx' ? 'style={[chunkyLip.neutral, KEEP_OPACITY]}' : 'style={chunkyLip.neutral}');
      154 |   if (variant === null) expect(tag).not.toContain('variant=');
      155 |   else expect(tag).toContain(`variant="${variant}"`);

      at toContain (src/__tests__/chunky-cta-canvas-fidelity.test.ts:152:15)

FAIL src/__tests__/consistency-classnames.test.ts
  ● #166 R3: el secundario neutro lleva el labio gris › screens/welcome/index.tsx pinta welcome-have-account con la receta del secundario en su tag de apertura (enmendado por #177 R10) (enmendado por #231 R1, R3)

    expect(received).toContain(expected) // indexOf

    Expected substring: "variant=\"outline\""
    Received string:    "<Button testID=\"welcome-have-account\" className=\"w-full h-14 rounded-16 border-2 border-lip-gray bg-surface\" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
                "

      668 |       expect(tag).not.toContain('variant=');
      669 |     } else {
    > 670 |       expect(tag).toContain(`variant="${variant}"`);
          |                   ^
      671 |     }
      672 |   });
      673 |

      at toContain (src/__tests__/consistency-classnames.test.ts:670:19)

Test Suites: 4 failed, 4 total
Tests:       7 failed, 350 passed, 357 total
Snapshots:   0 total
Time:        10.162 s

exit 1
```

R6 pasa tras añadir los sufijos; ya se probó rojo antes de ellos. El pin de etiqueta #177 R4.2 nace verde: clases de etiqueta, Text y copy no cambian. Los otros tres pins fallan por la clase/variant nuevos frente al tag viejo.

Commit 1: `63a6ca21f5a79d90e46b03e941924fc71e131599` — `test(mobile): #231 welcome secondary variant, dark border and amended pins (R1, R3, R4, R6)`. Rojo confirmado por aserciones, sin fallos de importación.

### R2 nace verde (contrato ya correcto de la librería)

`bunx jest src/screens/welcome --runInBand --silent -t #231 R2`

```text
PASS src/screens/welcome/index.test.tsx (5.007 s)

Test Suites: 1 passed, 1 total
Tests:       91 skipped, 1 passed, 92 total
Snapshots:   0 total
Time:        5.151 s, estimated 9 s

exit 0
```

Orden R2: `cp button.tsx <backup>` → sustituir SOLO themeColorDefaultHover por themeColorAccentHover en el case outline del useMemo highlightColorMap → test rojo → `cp <backup> button.tsx` → test verde.

### Mutación R2: outline usa accent-hover

`bunx jest src/screens/welcome --runInBand --silent -t #231 R2`

```text
FAIL src/screens/welcome/index.test.tsx
  ● #231 R2 › #231 R2: HeroUI pinta el pulsado de outline con default-hover y el de primary con accent-hover

    expect(received).toContain(expected) // indexOf

    Expected substring: "themeColorDefaultHover"
    Received string:    "outline':
            return colorKit
              .setAlpha(
                themeColorAccentHover,
                hasDefaultThemeBackground ? 0.05 : 0.3
              )
              .hex();
          "

      442 |     expect(outline).not.toBeUndefined();
      443 |     expect(primary).toContain('themeColorAccentHover');
    > 444 |     expect(outline).toContain('themeColorDefaultHover');
          |                     ^
      445 |     expect(outline).not.toContain('themeColorAccentHover');
      446 |   });
      447 | });

      at Object.toContain (src/screens/welcome/index.test.tsx:444:21)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        4.668 s, estimated 6 s

exit 1
```

Restaurada la copia de HeroUI con `cp`; identidad de bytes comprobada. Nada de node_modules se versiona.

### R2 restaurado en verde

`bunx jest src/screens/welcome --runInBand --silent -t #231 R2`

```text
PASS src/screens/welcome/index.test.tsx

Test Suites: 1 passed, 1 total
Tests:       91 skipped, 1 passed, 92 total
Snapshots:   0 total
Time:        4.601 s, estimated 5 s

exit 0
```

Commit 2: `17813a57abb66fbc9142b6a5693ed40c4799a7eb` — `test(mobile): #231 heroui outline highlight contract (R2)`. Nace verde y su mutación roja está acreditada arriba.

### Verde tras el cambio del único tag de producción

`bunx jest src/screens/welcome src/__tests__/chunky-cta-canvas-fidelity src/__tests__/consistency-classnames src/theme/__tests__/global-css --runInBand --silent`

```text
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/chunky-cta-canvas-fidelity.test.ts
PASS src/theme/__tests__/global-css.test.ts
PASS src/screens/welcome/index.test.tsx (7.505 s)

Test Suites: 4 passed, 4 total
Tests:       358 passed, 358 total
Snapshots:   0 total
Time:        9.687 s

exit 0
```

Commit 3: `64a80f25dfe7667d92281370008987ef71967979` — `feat(mobile): #231 welcome secondary uses outline and a dark border (R1, R3)`. Único cambio de producción: una línea, el tag de welcome-have-account; navegación, labio, etiqueta, copy, hermanos y primario intactos.

### Mutación R1a — quitar variant outline

Orden: plantar el diff siguiente → `bunx jest src/screens/welcome --runInBand --silent -t #231 R1: el secundario` desde `mobile-pet-tracker/` → restaurar con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..50139bfc 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/screens/welcome/index.test.tsx (6.096 s)
  ● R8 › #231 R1: el secundario declara variant outline y conserva el feedback de escala

    expect(received).toBe(expected) // Object.is equality

    Expected: "outline"
    Received: undefined

      394 |     await renderWelcome();
      395 |     const props = screen.getByTestId('welcome-have-account').props;
    > 396 |     expect(props.variant).toBe('outline');
          |                           ^
      397 |     expect(props.animation).toBeUndefined();
      398 |     expect(props.feedbackVariant).toBeUndefined();
      399 |   });

      at Object.toBe (src/screens/welcome/index.test.tsx:396:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        6.279 s, estimated 8 s

exit 1
```

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

### Mutación R1b — variant primary en el secundario

Orden: plantar el diff siguiente → `bunx jest src/screens/welcome --runInBand --silent -t #231 R1: el secundario` desde `mobile-pet-tracker/` → restaurar con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..d69266eb 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" variant="primary" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/screens/welcome/index.test.tsx (5.435 s)
  ● R8 › #231 R1: el secundario declara variant outline y conserva el feedback de escala

    expect(received).toBe(expected) // Object.is equality

    Expected: "outline"
    Received: "primary"

      394 |     await renderWelcome();
      395 |     const props = screen.getByTestId('welcome-have-account').props;
    > 396 |     expect(props.variant).toBe('outline');
          |                           ^
      397 |     expect(props.animation).toBeUndefined();
      398 |     expect(props.feedbackVariant).toBeUndefined();
      399 |   });

      at Object.toBe (src/screens/welcome/index.test.tsx:396:27)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        5.588 s, estimated 7 s

exit 1
```

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

### Mutación R1c — desactivar highlight

Orden: plantar el diff siguiente → `bunx jest src/screens/welcome --runInBand --silent -t #231 R1: el secundario` desde `mobile-pet-tracker/` → restaurar con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..d0c202cf 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" variant="outline" animation={{ highlight: false }} className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/screens/welcome/index.test.tsx (5.364 s)
  ● R8 › #231 R1: el secundario declara variant outline y conserva el feedback de escala

    expect(received).toBeUndefined()

    Received: {"highlight": false}

      395 |     const props = screen.getByTestId('welcome-have-account').props;
      396 |     expect(props.variant).toBe('outline');
    > 397 |     expect(props.animation).toBeUndefined();
          |                             ^
      398 |     expect(props.feedbackVariant).toBeUndefined();
      399 |   });
      400 |

      at Object.toBeUndefined (src/screens/welcome/index.test.tsx:397:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        5.533 s, estimated 6 s

exit 1
```

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

### Mutación R1d — variant outline en el primario

Orden: plantar el diff siguiente → `bunx jest src/screens/welcome --runInBand --silent -t #231 R1: el primario` desde `mobile-pet-tracker/` → restaurar con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..149674e6 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -114,7 +114,7 @@ export function WelcomeScreen() {
         </RiseIn>
         <View testID="welcome-spacer" className="flex-1" />
         <RiseIn testID="welcome-rise-actions" delayMs={280} className="gap-3.5">
-          <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
+          <Button testID="welcome-get-started" variant="outline" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
           <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
```

```text
FAIL src/screens/welcome/index.test.tsx (5.675 s)
  ● R8 › #231 R1: el primario no declara variant

    expect(received).toBeUndefined()

    Received: "outline"

      401 |   it('#231 R1: el primario no declara variant', async () => {
      402 |     await renderWelcome();
    > 403 |     expect(screen.getByTestId('welcome-get-started').props.variant).toBeUndefined();
          |                                                                     ^
      404 |   });
      405 |
      406 |   it('#231 R3: el secundario añade el borde oscuro tras la receta neutra', async () => {

      at Object.toBeUndefined (src/screens/welcome/index.test.tsx:403:69)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        5.819 s, estimated 6 s

exit 1
```

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

### Mutación R3a — quitar clase oscura

Orden: plantar el diff siguiente → `bunx jest src/screens/welcome --runInBand --silent -t #231 R3` desde `mobile-pet-tracker/` → restaurar con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..8c964ef6 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/screens/welcome/index.test.tsx (5.544 s)
  ● R8 › #231 R3: el secundario añade el borde oscuro tras la receta neutra

    expect(received).toBe(expected) // Object.is equality

    Expected: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted"
    Received: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface"

      408 |     const props = screen.getByTestId('welcome-have-account').props;
      409 |     const NEW_CLASSES = 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted';
    > 410 |     expect(props.className).toBe(NEW_CLASSES);
          |                             ^
      411 |     expect(props.className.split(' ').slice(-3)).toEqual(['border-lip-gray', 'bg-surface', 'dark:border-muted']);
      412 |   });
      413 |

      at Object.toBe (src/screens/welcome/index.test.tsx:410:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        5.708 s, estimated 6 s

exit 1
```

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

### Mutación R3b — anteponer clase oscura

Orden: plantar el diff siguiente → `bunx jest src/screens/welcome --runInBand --silent -t #231 R3` desde `mobile-pet-tracker/` → restaurar con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..74b47f81 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 dark:border-muted border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/screens/welcome/index.test.tsx (5.29 s)
  ● R8 › #231 R3: el secundario añade el borde oscuro tras la receta neutra

    expect(received).toBe(expected) // Object.is equality

    Expected: "w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted"
    Received: "w-full h-14 rounded-16 border-2 dark:border-muted border-lip-gray bg-surface"

      408 |     const props = screen.getByTestId('welcome-have-account').props;
      409 |     const NEW_CLASSES = 'w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted';
    > 410 |     expect(props.className).toBe(NEW_CLASSES);
          |                             ^
      411 |     expect(props.className.split(' ').slice(-3)).toEqual(['border-lip-gray', 'bg-surface', 'dark:border-muted']);
      412 |   });
      413 |

      at Object.toBe (src/screens/welcome/index.test.tsx:410:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        5.457 s, estimated 6 s

exit 1
```

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

### Mutación R3c — extender clase oscura a home-join-pet-button

Orden: plantar el diff siguiente → `bunx jest src/__tests__/chunky-cta-canvas-fidelity --runInBand --silent -t #231 R3` desde `mobile-pet-tracker/` → restaurar con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/home/index.tsx b/mobile-pet-tracker/src/screens/home/index.tsx
index 63dbd87a..36c1b3b0 100644
--- a/mobile-pet-tracker/src/screens/home/index.tsx
+++ b/mobile-pet-tracker/src/screens/home/index.tsx
@@ -358,7 +358,7 @@ export function HomeScreen() {
         />
         <View testID="home-join-pet" className="w-full items-center gap-3.5 pt-5">
           <Text testID="home-join-pet-prompt" className="text-sm font-semibold text-muted">{t('joinPet.invitedPrompt')}</Text>
-          <Button testID="home-join-pet-button" variant="outline" className="w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => router.push('/join-pet')}>
+          <Button testID="home-join-pet-button" variant="outline" className="w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/join-pet')}>
             <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Key size={20} color={foreground} /></View>
             <Text className="text-base font-extrabold text-foreground">{t('joinPet.title')}</Text>
           </Button>
```

```text
FAIL src/__tests__/chunky-cta-canvas-fidelity.test.ts
  ● #231 R3: la excepción dark:border-* vive solo en Bienvenida

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

      Object {
    +   "screens/home/index.tsx": 1,
        "screens/welcome/index.tsx": 1,
      }

      48 |
      49 | it('#231 R3: la excepción dark:border-* vive solo en Bienvenida', () => {
    > 50 |   expect(inventory(/dark:border-/g)).toEqual({ 'screens/welcome/index.tsx': 1 });
         |                                      ^
      51 | });
      52 |
      53 | const CTA_ROWS = [

      at Object.toEqual (src/__tests__/chunky-cta-canvas-fidelity.test.ts:50:38)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 101 skipped, 102 total
Snapshots:   0 total
Time:        1.904 s

exit 1
```

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

Reversión verificada: contenido idéntico a HEAD y diff del archivo vacío.

## PARA obligatorio — contradicción del control final de archivos

El handoff impone simultáneamente:

> H0 (base del diff final): `71a0e0f9`.
>
> `git diff --name-only 71a0e0f9..HEAD` solo lista ficheros de la lista cerrada.
>
> No tocar […] `progress/handoff_*.md`.
>
> Si encuentras una contradicción, PARA y anótala; no adaptes la spec.

El commit `f47114d1` del propio handoff está después de H0 y añade
`progress/handoff_mobile-welcome-secondary-pressed.md`, que no pertenece a la
lista cerrada. El control ya incumplía su lista en la rama inicial, antes de
cualquier edición de esta sesión:

```text
$ git diff --name-only 71a0e0f9..f47114d1
progress/handoff_mobile-welcome-secondary-pressed.md
```

Resultado actual del control exigido:

```text
$ git diff --name-only 71a0e0f9..HEAD
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/screens/welcome/index.test.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
progress/handoff_mobile-welcome-secondary-pressed.md
```

No cambié la base por mi cuenta ni borré/modifiqué el handoff. Para reanudar,
el leader debe corregir la base del control o autorizar explícitamente la
excepción del archivo del handoff.

### Estado entregado al parar

- HEAD: `64a80f25dfe7667d92281370008987ef71967979`; tres commits, en el orden exigido.
- R1 y R3 implementados en un único tag; R2 y R4 con pruebas de contrato/contraste;
  R5 conservado; los tres pins de R6 enmendados. Último verde de las cuatro suites:
  **4 suites, 358 tests, exit 0**, antes de plantar mutaciones.
- Mutaciones comprobadas rojas por aserción y restauradas: R2, R1a–R1d,
  R3a–R3c. No se obtuvo evidencia completa de R4a: se interrumpió el runner al
  detectar la contradicción; su `finally` restauró el archivo. R4a–R4d y R6
  quedan por verificar. La segunda línea consecutiva de reversión al final de
  las mutaciones corresponde a esa restauración de R4a interrumpida.
- El runner recibió SIGINT y terminó con exit 130/KeyboardInterrupt para cumplir
  el PARA; no fue un fallo de la app. No quedan procesos Jest de este worktree.
- Se compararon los bytes de welcome/index.tsx, home/index.tsx, global.css y el
  guard de consistencia con `git show HEAD:<ruta>`: todos idénticos. HeroUI ya se
  había restaurado desde su copia con identidad de bytes comprobada.
- **Sin ejecutar por el PARA**: suite móvil completa `bunx jest --ci`, tsc y
  lint finales, recomputación final de T0 y commit 4 de trazabilidad. No se
  generaron logs temporales de esos comandos. Traceability permanece sin
  editar; no se declara la feature terminada.
- **R7 pendiente (espera gate G4)**: no se implementaron su test ni su sección
  de docs, y no se marcaron G2/G4. `./init.sh` no se ejecutó: corresponde al leader.
- No se tocaron feature_list.json, STATUS.md, progress/current.md,
  progress/history.md, requirements, tasks, docs, backend ni dependencias.
- No se hizo fetch, merge, rebase, instalación, push ni apertura/edición de PR.

```text
$ git status --short -- mobile-pet-tracker specs
(sin salida)
$ git diff --check
(sin salida, exit 0)
```

El reporte y su marcador se dejan sin commit, como exige el handoff.

## Reanudación autorizada — corrección del control de archivos (2026-11-03)

El humano aclaró que era un defecto del handoff y corrigió expresamente el
control de lista cerrada a `git diff --name-only f47114d1..HEAD`, excluyendo el
commit del propio handoff. Queda resuelto el PARA anterior y se reanuda desde
`64a80f25dfe7667d92281370008987ef71967979`, en
`/home/claude/sites/Pet-Tracker-wt-231`, rama
`feature/231-mobile-welcome-secondary-pressed`.

Leído `progress/review_mobile-welcome-secondary-pressed.md`: código y tests de
R1–R6 correctos; pendientes commit 4, verificaciones finales y control de archivos
con la base corregida. Este apartado y las evidencias siguientes se **añaden** al
reporte; se conserva todo su contenido anterior. El reporte de review se respeta
sin editar. R7 permanece pendiente (espera gate G4), sin test ni sección de docs;
G2/G4 humanos intactos. No se hará fetch, merge, rebase, bun install ni init.sh.

Se mantiene docs/conventions.md §Esperas: «Si el test asevera el árbol, espera al
árbol». No se modifica producción ni los tests en esta reanudación.

### Reanudación: mutación R4a — token lip-gray

Orden: plantar diff → `bunx jest src/theme/__tests__/global-css --runInBand --silent -t #231 R4` desde `mobile-pet-tracker/` → `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..0c546546 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-lip-gray" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/theme/__tests__/global-css.test.ts
  ● #231 R4: contraste del borde oscuro de Bienvenida › #231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo

    expect(received).toMatch(expected)

    Matcher error: received value must be a string

    Received has value: undefined

      16 |     const variables = parseVariables(extractVariant('dark'));
      17 |     const color = variables[match![1]];
    > 18 |     expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
         |                   ^
      19 |     expect(contrast(color, variables['surface'])).toBeGreaterThanOrEqual(3);
      20 |     expect(contrast(color, variables['background'])).toBeGreaterThanOrEqual(3);
      21 |   });

      at Object.toMatch (src/theme/__tests__/global-css.test.ts:18:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 78 skipped, 79 total
Snapshots:   0 total
Time:        2.148 s

exit 1
```

Reversión verificada: archivo idéntico a HEAD; ninguna mutación se commitea.

### Reanudación: mutación R4b — token border rgba

Orden: plantar diff → `bunx jest src/theme/__tests__/global-css --runInBand --silent -t #231 R4` desde `mobile-pet-tracker/` → `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..4a29d341 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-border" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/theme/__tests__/global-css.test.ts
  ● #231 R4: contraste del borde oscuro de Bienvenida › #231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo

    expect(received).toMatch(expected)

    Expected pattern: /^#[0-9A-Fa-f]{6}$/
    Received string:  "rgba(255,255,255,0.08)"

      16 |     const variables = parseVariables(extractVariant('dark'));
      17 |     const color = variables[match![1]];
    > 18 |     expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
         |                   ^
      19 |     expect(contrast(color, variables['surface'])).toBeGreaterThanOrEqual(3);
      20 |     expect(contrast(color, variables['background'])).toBeGreaterThanOrEqual(3);
      21 |   });

      at Object.toMatch (src/theme/__tests__/global-css.test.ts:18:19)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 78 skipped, 79 total
Snapshots:   0 total
Time:        1.429 s, estimated 2 s

exit 1
```

Reversión verificada: archivo idéntico a HEAD; ninguna mutación se commitea.

### Reanudación: mutación R4c — sin clase oscura

Orden: plantar diff → `bunx jest src/theme/__tests__/global-css --runInBand --silent -t #231 R4` desde `mobile-pet-tracker/` → `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 386efaab..8c964ef6 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -117,7 +117,7 @@ export function WelcomeScreen() {
           <Button testID="welcome-get-started" className="w-full h-14 rounded-16 bg-accent" style={chunkyLip.primary} onPress={() => router.push('/register')}>
             <Text className="text-17 font-extrabold text-accent-foreground">{t('welcome.getStarted')}</Text>
           </Button>
-          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface dark:border-muted" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
+          <Button testID="welcome-have-account" variant="outline" className="w-full h-14 rounded-16 border-2 border-lip-gray bg-surface" style={chunkyLip.neutral} onPress={() => router.push('/login')}>
             <Text className="text-17 font-bold text-accent-strong">{t('welcome.haveAccount')}</Text>
           </Button>
         </RiseIn>
```

```text
FAIL src/theme/__tests__/global-css.test.ts
  ● #231 R4: contraste del borde oscuro de Bienvenida › #231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo

    expect(received).not.toBeNull()

    Received: null

      13 |     const tag = source.slice(source.lastIndexOf('<', index), source.indexOf('<', index));
      14 |     const match = tag.match(/(?:^|\s)dark:border-([a-z0-9-]+)(?=\s|")/);
    > 15 |     expect(match).not.toBeNull();
         |                       ^
      16 |     const variables = parseVariables(extractVariant('dark'));
      17 |     const color = variables[match![1]];
      18 |     expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);

      at Object.toBeNull (src/theme/__tests__/global-css.test.ts:15:23)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 78 skipped, 79 total
Snapshots:   0 total
Time:        1.461 s, estimated 2 s

exit 1
```

Reversión verificada: archivo idéntico a HEAD; ninguna mutación se commitea.

### Reanudación: mutación R4d — muted oscuro pierde contraste

Orden: plantar diff → `bunx jest src/theme/__tests__/global-css --runInBand --silent -t #231 R4` desde `mobile-pet-tracker/` → `git checkout HEAD -- mobile-pet-tracker/src/theme/global.css`.

```diff
diff --git a/mobile-pet-tracker/src/theme/global.css b/mobile-pet-tracker/src/theme/global.css
index acae547c..eef81138 100644
--- a/mobile-pet-tracker/src/theme/global.css
+++ b/mobile-pet-tracker/src/theme/global.css
@@ -139,7 +139,7 @@
       --surface-secondary-foreground: #F7F8FA;
       --default: #1F242B;
       --default-foreground: #F7F8FA;
-      --muted: #9CA3AF;
+      --muted: #2A2F37;
       --border: rgba(255,255,255,0.08);
       --separator: rgba(255,255,255,0.08);
       --accent: #178255;
```

```text
FAIL src/theme/__tests__/global-css.test.ts
  ● #231 R4: contraste del borde oscuro de Bienvenida › #231 R4: el borde oscuro de Bienvenida contrasta 3:1 con la superficie y el fondo

    expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 3
    Received:    1.2852048687250273

      17 |     const color = variables[match![1]];
      18 |     expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    > 19 |     expect(contrast(color, variables['surface'])).toBeGreaterThanOrEqual(3);
         |                                                   ^
      20 |     expect(contrast(color, variables['background'])).toBeGreaterThanOrEqual(3);
      21 |   });
      22 | });

      at Object.toBeGreaterThanOrEqual (src/theme/__tests__/global-css.test.ts:19:51)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 78 skipped, 79 total
Snapshots:   0 total
Time:        1.465 s, estimated 2 s

exit 1
```

Reversión verificada: archivo idéntico a HEAD; ninguna mutación se commitea.

### Reanudación: mutación R6 — quitar sufijo del guard de consistencia

Orden: plantar diff → `bunx jest src/screens/welcome --runInBand --silent -t #231 R6` desde `mobile-pet-tracker/` → `git checkout HEAD -- mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`.

```diff
diff --git a/mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts b/mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
index 3a1c58a8..24334a9b 100644
--- a/mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
+++ b/mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
@@ -657,7 +657,7 @@ describe('#166 R3: el secundario neutro lleva el labio gris', () => {
     [join('screens', 'reminders', 'index.tsx'), 'reminders-delete-cancel', 'outline'],
   ] as const;
 
-  it.each(rows)('%s pinta %s con la receta del secundario en su tag de apertura (enmendado por #177 R10) (enmendado por #231 R1, R3)', (path, testId, variant) => {
+  it.each(rows)('%s pinta %s con la receta del secundario en su tag de apertura (enmendado por #177 R10)', (path, testId, variant) => {
     const tag = openingTagWithTestId(readSource(path), testId);
 
     expect(tag).toContain(recipe);
```

```text
FAIL src/screens/welcome/index.test.tsx (8.992 s)
  ● #231 R6: los candados enmendados nombran su enmienda

    expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 1
    Received:    0

      454 |   ];
      455 |   for (const source of sources) {
    > 456 |     expect(source.split('enmendado por #231 R1, R3').length - 1).toBeGreaterThanOrEqual(1);
          |                                                                  ^
      457 |   }
      458 | });
      459 |

      at Object.toBeGreaterThanOrEqual (src/screens/welcome/index.test.tsx:456:66)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 91 skipped, 92 total
Snapshots:   0 total
Time:        9.163 s, estimated 31 s

exit 1
```

Reversión verificada: archivo idéntico a HEAD; ninguna mutación se commitea.

### Reanudación: T0 recomputado tras restaurar las mutaciones

```text
grep -cF 'variant=' src/screens/welcome/index.tsx -> 1 (exit 0)
grep -cF 'border-lip-gray' src/screens/welcome/index.tsx -> 1 (exit 0)
dark:border- -> 1; inventory = {"screens/welcome/index.tsx": 1}
border-lip-gray -> 25
text-17 -> 46
<Text className="text-17 font-bold text-accent-strong"> -> 1
radii = {"components/celebration.tsx": 2, "components/empty-state.tsx": 1, "screens/add-pet/index.tsx": 2, "screens/add-reminder/index.tsx": 2, "screens/alert-detail/index.tsx": 2, "screens/alerts/index.tsx": 1, "screens/docs-upload-form/index.tsx": 2, "screens/edit-profile/index.tsx": 1, "screens/food/index.tsx": 3, "screens/forgot/index.tsx": 3, "screens/geofence-editor/index.tsx": 4, "screens/geofences/index.tsx": 2, "screens/health/index.tsx": 2, "screens/home/index.tsx": 2, "screens/home/weekly-activity-chart.tsx": 1, "screens/join-pet/index.tsx": 2, "screens/login/index.tsx": 1, "screens/map/index.tsx": 1, "screens/nutrition-plan/index.tsx": 3, "screens/nutrition-questionnaire/index.tsx": 2, "screens/pairing/index.tsx": 4, "screens/pet-invite/index.tsx": 2, "screens/pet-members/index.tsx": 6, "screens/register/index.tsx": 1, "screens/reminders/index.tsx": 7, "screens/reset-password/index.tsx": 2, "screens/vaccine-create/index.tsx": 1, "screens/weight-log/index.tsx": 1, "screens/welcome/index.tsx": 2}
neutralInventory = ["${rowId}-ack", "add-meal-time-button", "alert-detail-view-map", "alerts-attended-more", "docs-upload-cancel", "forgot-resend", "geofence-editor-delete", "home-join-pet-button", "meal-time-edit-${index}", "member-leave-sheet-cancel", "member-remove-sheet-cancel", "pairing-unpair-cancel", "pet-invite-copy", "pet-members-leave", "reminders-cancel-series-keep", "reminders-delete-cancel", "secondary.testID", "welcome-have-account"]
```

Cambios previstos: variant= pasa de 0 a 1; dark:border-* pasa de 0 a una única coincidencia en Bienvenida. Se conservan border-lip-gray=25, text-17=46, etiqueta accent-strong=1, el inventario neutro de 18 y todos los valores de radii. Los guards verifican sus inventarios completos.

Integridad del reporte anterior: sus primeros 41509 bytes conservan SHA-256 `1341879b143b9d581c943293e55cd86e6de07d35e9d50cff363a0936060bae6f`; solo se añadió contenido.

### Commit 4 — trazabilidad R1–R6

`7ba76320f2247abe05dd449ce465d4329655b30c` — `docs(spec): #231 traceability`. Solo modifica `specs/mobile-welcome-secondary-pressed/traceability.md`. Las seis filas tienen archivo::test y hashes literales completos; R2 distingue su nacimiento verde y mutación, y R5 registra regresión sobre tests existentes sin implementación propia. R7 sigue `pendiente (espera gate G4)`. No se cambia ninguna aprobación ni se hace rebase.

### Lista cerrada corregida — medida sobre HEAD 7ba76320

Base autorizada por el humano: `f47114d1`, commit del handoff. H0 `71a0e0f9` se conserva como referencia histórica de la firma, no como base de este control.

```text
$ git diff --name-only f47114d1..HEAD
mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/screens/welcome/index.test.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
specs/mobile-welcome-secondary-pressed/traceability.md

$ git diff --numstat f47114d1..HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx
1	1	mobile-pet-tracker/src/screens/welcome/index.tsx

$ git status --short -- mobile-pet-tracker specs
(sin salida)
```

Resultado: exactamente los seis archivos permitidos; ningún handoff ni reporte en el diff versionado. Único archivo de producción: welcome/index.tsx, una línea sustituida en el tag del secundario. No hay cambios en docs, home, global.css, chunky-lip.ts, dependencias, backend, estados de features ni gates humanos.

### Tipos finales

Desde `mobile-pet-tracker/`, se comprobó que `.expo/types/router.d.ts` no existía
antes de lanzar el comando y sigue ausente; no se borró ningún tipo generado.

```text
$ test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_231.log 2>&1; echo $?
0
$ wc -c progress/tsc_231.log
0 progress/tsc_231.log
```

TypeScript terminó sin errores y con log vacío (0 bytes). El log temporal se
borra en el cierre, después de registrar su medida.

### Lint: primer intento interrumpido externamente

Comando del handoff: `bunx expo lint --no-cache > ../progress/lint_231.log 2>&1 && test ! -s ../progress/lint_231.log && echo LINT_OK`. Exit 1. El log no estaba vacío (52 bytes):

```text
error: Failed to run "eslint" due to signal SIGKILL
```

El proceso recibió SIGKILL, sin diagnósticos de código de ESLint. Había verificaciones concurrentes; se repetirá de forma aislada tras las guardas. No se atribuye el SIGKILL al código ni se cambia la configuración.

### Guardas completas: primer intento, timeout bajo carga

Desde `mobile-pet-tracker/`: `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ > ../progress/jest_231_guards.log 2>&1`. Exit 1.

```text
Test Suites: 1 failed, 78 passed, 79 total
Tests:       1 failed, 1642 passed, 1643 total
Snapshots:   1 passed, 1 total
Time:        468.346 s
Ran all test suites matching /src\/__tests__|src\/app\/__tests__|src\/components\/__tests__/i.

FAIL src/components/__tests__/celebration.test.tsx (462.666 s)
  ● #171 R7: pop › R7.4 la insignia sigue el primer tramo del pop a los 450, 550 y 650 ms

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      395 |   });
      396 |
    > 397 |   it('R7.4 la insignia sigue el primer tramo del pop a los 450, 550 y 650 ms', async () => {
          |   ^
      398 |     await renderProbe();
      399 |     await advance(450);
      400 |     const samples = [samplePop('probe-badge')];

      at it (src/components/__tests__/celebration.test.tsx:397:3)
      at Object.describe (src/components/__tests__/celebration.test.tsx:347:1)
```

Único fallo: timeout de 60000 ms de la prueba existente #171 R7.4 en celebration.test.tsx; las 78 suites restantes pasaron. Se aplica la instrucción del handoff «Timeout bajo carga: repite sola» y se repetirá también el conjunto con un único proceso para reducir la carga. No se modifica el test ni producción.

### Lint final — segundo intento aislado, verde

```text
$ bunx expo lint --no-cache > ../progress/lint_231.log 2>&1 && test ! -s ../progress/lint_231.log && echo LINT_OK
LINT_OK
exit 0
$ wc -c progress/lint_231.log
0 progress/lint_231.log
```

Mismo comando, sin cambios de código, configuración ni dependencias. El intento
sin otras verificaciones de este worktree terminó correctamente; el log final
está vacío (0 bytes). Se conserva arriba la evidencia del SIGKILL inicial.

### Repetición aislada de celebration — verde

`bunx jest src/components/__tests__/celebration --runInBand --silent > ../progress/jest_231_retry.log 2>&1`

```text
PASS src/components/__tests__/celebration.test.tsx (61.173 s)

Test Suites: 1 passed, 1 total
Tests:       66 passed, 66 total
Snapshots:   0 total
Time:        61.398 s, estimated 463 s

exit 0
```

El archivo completo pasó sin tocarlo. La prueba #171 R7.4 que agotó el tiempo en el primer conjunto está incluida en esta corrida.

### Guardas completas — segundo intento con un proceso, verde

Desde `mobile-pet-tracker/`:

```text
$ bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ --runInBand > ../progress/jest_231_guards.log 2>&1
Test Suites: 79 passed, 79 total
Tests:       1643 passed, 1643 total
Snapshots:   1 passed, 1 total
Time:        118.251 s, estimated 979 s
Ran all test suites matching /src\/__tests__|src\/app\/__tests__|src\/components\/__tests__/i.
exit 0
```

Se conserva el mismo alcance completo solicitado (incluidos componentes y rutas); `--runInBand` solo limita la concurrencia. No se cambiaron tests, timeouts, mocks ni configuración. Las 79 suites y 1643 tests pasaron, sin skipped ni fallos de importación. También pasó la prueba de animación que agotó el tiempo en el primer intento.

### Suite móvil completa R6 — verde

Depuis `mobile-pet-tracker/` (todo el conjunto, sin filtrar suites):

```text
$ bunx jest --ci --runInBand > ../progress/jest_231_final.log 2>&1
Test Suites: 178 passed, 178 total
Tests:       6547 passed, 6547 total
Snapshots:   1 passed, 1 total
Time:        567.751 s
Ran all test suites.
exit 0
```

`--runInBand` limita únicamente la concurrencia para evitar repetir la carga del primer intento de guardas; `--ci` y todo el alcance móvil se mantienen. No se cambiaron tests, mocks, timeouts, configuración ni código. Sin suites fallidas ni fallos de importación.

## Cierre de la reanudación — R1–R6 listos para nueva revisión

El PARA histórico quedó resuelto por la corrección explícita del humano. Se
completaron las verificaciones pendientes y el commit 4, sin modificar el código
ni los tests aceptados por el reviewer:

- **Commit 4:** `7ba76320f2247abe05dd449ce465d4329655b30c` — `docs(spec): #231 traceability`.
  R1–R6 tienen archivos/tests y hashes literales de los commits rojo/verde;
  R2 y R5 explican su caso de contrato/regresión ya existente.
- **Guardas completas:** 79 suites, 1643 tests, 1 snapshot; exit 0.
  El primer timeout se documentó y el archivo aislado pasó (66 tests), seguido
  del conjunto completo en verde con un proceso.
- **Suite móvil completa:** 178 suites, 6547 tests, 1 snapshot; exit 0,
  567.751 s. Ningún test omitido.
- **TypeScript:** exit 0; log vacío, 0 bytes.
- **Lint:** `LINT_OK`, exit 0; log vacío, 0 bytes tras repetir aisladamente
  el comando que recibió SIGKILL en el primer intento.
- **Mutaciones:** completadas R4a–R4d y R6 en la reanudación, todas rojas por
  aserción y restauradas; complementan R1a–R1d, R2 y R3a–R3c de la primera parte.
- **Lista cerrada corregida:** `git diff --name-only f47114d1..HEAD` devuelve
  exactamente los seis archivos permitidos enumerados arriba. Solo el tag de
  welcome-have-account cambió en producción. Desde `64a80f25` solo cambia
  `specs/mobile-welcome-secondary-pressed/traceability.md`.
- **Limpieza:** `git status --short -- mobile-pet-tracker specs` vacío;
  `git diff --check`, diff sin stage e índice vacíos. Eliminados los cinco logs
  temporales después de conservar sus resultados y medidas en este reporte:
  tsc_231.log, lint_231.log, jest_231_guards.log, jest_231_retry.log y
  jest_231_final.log. No se borró ni generó router.d.ts.
- **Reporte:** los primeros 41509 bytes conservan el SHA-256 original; todo el
  trabajo de reanudación se añadió, sin reescribir la evidencia anterior. Este
  reporte y el de revisión permanecen sin commit; el de revisión no se editó.
- **R7 pendiente (espera gate G4):** no se implementó su test ni su sección de
  docs. G2 y G4 siguen siendo del humano; no se tocaron sus casillas. No se
  declara la feature done ni se cambian sus estados administrativos.
- **Leader:** quedan su init.sh y la nueva revisión/PR hacia dev según el flujo
  acordado. No se ejecutó init.sh, fetch, merge, rebase ni bun install. No se
  hizo push ni se abrió/editó PR.

Última acción prevista: crear `progress/impl_mobile-welcome-secondary-pressed.done`
con una sola línea, la ruta absoluta de este reporte, sin commitearlo.
