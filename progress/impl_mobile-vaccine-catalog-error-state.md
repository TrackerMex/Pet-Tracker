# Implementación #236 — mobile-vaccine-catalog-error-state

Fecha: 2026-11-03. H0: `6ea703f9`. Integración: `dev`, a cargo del leader.
**PARA en C4 / M1: el conjunto de tests rojos no coincide con la tabla exigida.
Implementación incompleta; solo C1, C2 y C3 están commiteados.**
No se ejecuta `./init.sh` por instrucción explícita del humano y del handoff;
LocalStack y Postgres están compartidos. Sin fetch, merge, rebase, push, instalación ni PR.

## Partida

Salida de `pwd && git branch --show-current && git log --oneline -5`:

```text
/home/claude/sites/Pet-Tracker-wt-236
feature/236-mobile-vaccine-catalog-error-state
6ea703f9 docs(progress): #236 codex handoff
8dfcb8b2 chore(spec): firma delegada de la enmienda #236 en #208
a96e7c8e chore(spec): firma delegada #236 (mandato del humano 2026-10-23, ampliado 2026-11-03)
b06e688f Merge remote-tracking branch 'origin/dev' into feature/236-mobile-vaccine-catalog-error-state
3520733f Merge pull request #294 from TrackerMex/feature/233-mobile-food-links-without-profile
```

Árbol inicial limpio. Spec aprobada, enmienda firmada. Solo se trabaja #236.
Se leyó el handoff antes de ejecutar la comprobación de rama, sin modificar archivos.

Anclas medidas antes de C1 con `grep -cF` (salvo la expresión `-cP`):

| Fichero | Patrón | Resultado / esperado |
|---|---|---|
| `mobile-pet-tracker/src/screens/vaccine-create/index.tsx` | `accessibilityRole="alert"` | 1 / 1 |
| mismo | `<Button` | 1 / 1 |
| mismo | `{catalog.isPending ? (` | 1 / 1 |
| mismo | `testID="vaccine-create-catalog-error"` | 0 / 0 |
| mismo | `grep -cP '#236(?! R\d)'` | 0 / 0 |
| `progress/smoke_mejoras-smoke.md` | `## #236 mobile-vaccine-catalog-error-state` | 0 / 0 |

## Skills y referencias

- `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.3/skills/ponytail/SKILL.md`.
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`.
- `building-native-ui` (Expo): `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- Leídos requirements, design, tasks y traceability completos, arquitectura,
  convenciones, carta de UI, verificación y checkpoints aplicables.
- Consultada la documentación versionada [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/),
  exigida por `mobile-pet-tracker/AGENTS.md`.
- Manda la carta sobre las skills: patrón existente de Salud, tokens del repo;
  el simulator loop corresponde al smoke humano en Android. Sin copy nuevo.

## Ejecución

### C1 — rojo

`1aba44d294be30ac405e9d099338454a571e11f9` —
`test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)`.
Solo `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx`.

Orden desde `mobile-pet-tracker/`:
`bunx jest src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_c1.log 2>&1; echo "jest=$?"`.
Salida: `jest=1`; 1 suite fallida; **10 fallidos, 42 verdes, 52 total**;
101.056 s; **10 encabezados `●`**. Ningún import roto ni fallo anterior.

Los títulos fallidos son los literales de requirements:

- `#236 R1: con el catálogo en error pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unreachable pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unauthorized pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en missing-config pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: si la consulta del catálogo rechaza pinta el mismo aviso`.
- `#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre`.

Los seis caen en `await screen.findByTestId('vaccine-create-catalog-error')`:
recibido `Unable to find an element with testID: vaccine-create-catalog-error`.

- `#236 R5: «Reintentar» vuelve a pedir el catálogo y, si responde ok, pinta las entradas y retira el aviso`.
- `#236 R6: mientras el reintento está en vuelo el aviso sigue y no vuelven los esqueletos`.
- `#236 R6: si el reintento vuelve a fallar el aviso sigue y se puede reintentar otra vez`.

Estos tres caen en `await screen.findByTestId('vaccine-create-catalog-retry')`:
recibido `Unable to find an element with testID: vaccine-create-catalog-retry`.

- `#236 R8: el aviso y el reintento usan la receta de Salud sin clases ni labio`:
  `expect(source.split(literal).length - 1).toBe(1)` para el primer literal
  (`View`); esperado `1`, recibido `0`.

### C2 — rojo

`895987874b9bdbe37587c11b17a9154e33abb688` —
`test(mobile): usos de copy del aviso del catálogo en rojo (R7)`.
Solo `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` y
`mobile-pet-tracker/src/__tests__/ui-language.test.ts`.

Orden desde `mobile-pet-tracker/`:
`bunx jest src/__tests__/ui-language.test.ts > ../progress/jest_236_c2.log 2>&1; echo "jest=$?"`.
Salida: `jest=1`; 1 suite fallida; **2 fallidos, 37 verdes, 39 total**;
3.212 s; **2 encabezados `●`**. Caen exclusivamente:

- `#208 R20: R19_VACCINE_CREATE tiene 29 usos y cuadra con el código (enmendado por #236 R7)`;
- `resuelve cada ocurrencia de la tabla contra la clave exacta`.

Ambos fallan en `checkUses`, aserción `expect({ file, key, uses: resolvedUses }).toEqual(...)`:
`file: 'src/screens/vaccine-create/index.tsx'`, `key: 'health.couldNotLoadVaccines'`,
esperado `uses: 1`, recibido `uses: 0`. La tabla ya tiene 31 filas, pero el
fuente todavía no usa las claves. Ningún otro `it` falla.

### C3 — verde

`ab2262e47a8f7f5d1fb011a056557d9fca533536` —
`feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)`.
Solo `mobile-pet-tracker/src/screens/vaccine-create/index.tsx`: siete líneas,
sin imports nuevos. C1 y C2 pasan a verde.

Orden desde `mobile-pet-tracker/`:

```bash
bunx jest src/__tests__/chunky-cta-canvas-fidelity.test.ts src/__tests__/design-drift.test.ts src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/alerts-canvas-fidelity.test.ts src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_c3.log 2>&1; echo "jest=$?"
```

`jest=0`; **6/6 suites y 432/432 tests verdes**, 15.926 s.
El log tiene **1 encabezado `● Console`**, **0 encabezados de tests fallidos**:
avisos de `react-native-svg` por los colores `token:*` de los dobles existentes.
No se modifica ninguna guarda.

Anclas tras la implementación de C3, `grep -cF` sobre
`mobile-pet-tracker/src/screens/vaccine-create/index.tsx`:

| Patrón | Resultado / esperado |
|---|---|
| `const catalogFailed = !catalog.isPending && catalog.data?.kind !== 'ok';` | 1 / 1 |
| `testID="vaccine-create-catalog-error"` | 1 / 1 |
| `testID="vaccine-create-catalog-error-text"` | 1 / 1 |
| `<Button testID="vaccine-create-catalog-retry" onPress={() => void catalog.refetch()}>` | 1 / 1 |
| `t('health.couldNotLoadVaccines')` | 1 / 1 |
| `t('common.retry')` | 1 / 1 |
| `className="text-15 leading-body text-danger"` | 1 / 1 |
| `accessibilityRole="alert"` | 2 / 2 |
| `<Button` | 2 / 2 |
| `{catalog.isPending ? (` | 1 / 1 |

- `grep -cP '#236(?! R\d)'`: **0**.
- `ui-copy-table.ts`: cada fila literal nueva de R7, **1** (antes, **0**).
- `ui-language.test.ts`: `expect(R19_VACCINE_CREATE).toHaveLength(29 + 2); // #236 R7`, **1** (antes, **0**).
- `git diff b06e688f -- mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/screens/health/index.tsx`: vacío.

C4 se detuvo en la primera mutación por la regla explícita del handoff.

### C4 — pruebas y mutaciones

Antes de mutar: `bunx jest src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_c4.log 2>&1; echo "jest=$?"`: `jest=0`, **1/1 suite, 55/55 tests verdes**, 14.523 s. R3 (dos filas) y R4 nacen verdes.

#### M1: `entries.length === 0`

Orden desde `mobile-pet-tracker/`: `bunx jest src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_m1.log 2>&1; echo "jest=$?"`.

`jest=1`; fallan exactamente:

- `#236 R1: con el catálogo en error pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unreachable pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unauthorized pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en missing-config pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre`.
- `#236 R3: un catálogo ok vacío no pinta el aviso de error`.
- `#236 R4: mientras carga no pinta el aviso de error`.

```text
Test Suites: 1 failed, 1 total
Tests:       7 failed, 48 passed, 55 total
Time:        14.776 s, estimated 15 s
```

R3 «vacío» y R4: `expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull()`;
esperado `null`, recibido el `View` del aviso.

Los cuatro casos de R1 fallan adicionalmente en
`expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent)`;
R2 falla en `const chips = screen.getByTestId('vaccine-create-chips')`.
Los cinco reciben `Unable to find an element with testID: vaccine-create-chips`.
Hay **7 encabezados `●` de tests fallidos**, frente a los **2** esperados.

Restaurado con `git checkout HEAD -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`; después `git diff --quiet -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx` termina **0**. Ninguna mutación se commitea.

### PARA — discrepancia del gate de mutación

El handoff exige «Cada mutación debe poner rojo justo el `it` de su tabla» y
«Si encuentras una contradicción, PARA y anótala en el reporte; no adaptes la
spec por tu cuenta». M1 debe poner rojos solo R3 «vacío» y R4. Los pone rojos,
pero también R1 (cuatro filas) y R2.

La condición mutada `entries.length === 0` vale `true` desde la carga inicial.
Por ello el aviso aparece antes de que el catálogo termine. La espera prescrita
de R1/R2 a `vaccine-create-catalog-error` termina en ese render, cuando todavía
hay esqueletos y no existe `vaccine-create-chips`. Esta observación explica los
cinco fallos adicionales. No se cambian las esperas ni se relaja la exigencia
de exclusividad del handoff.

- M2, M3 y M4 **no ejecutadas** por el PARA.
- C4 **sin commit**. Sus 19 líneas de tests nuevos se conservan como diff en
  este reporte y se retiran del árbol para cumplir el cierre limpio acotado.
- C5 **no ejecutado**: no se pega el smoke ni se cambia traceability.
- Suite de guardas completa, `tsc` y lint finales **no ejecutados** por el PARA.
  Se comprobó que `.expo/types/router.d.ts` no existe.
- No se ejecutó `./init.sh`; no se tocó infraestructura compartida.
- No se modificaron spec, firma, casilla G2, catálogo de features, STATUS,
  progress/current, historial, handoff ni otros archivos fuera del alcance.
- Reporte local sin commit, porque no se alcanzó C5. El marcador `.done`
  notifica al leader que debe leer este PARA; no afirma que la feature esté terminada.
- El leader debe resolver la discrepancia del gate antes de retomar C4.

### Diff de C4 conservado para retomar (no commiteado)

```diff
diff --git a/mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx b/mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx
index 04c60047..28d8dab3 100644
--- a/mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx
+++ b/mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx
@@ -260,6 +260,25 @@ it('#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su ca
   expect(screen.getByTestId('vaccine-chip-other').props.accessibilityState).toEqual({ selected: true });
   expect(screen.getByTestId('vaccine-create-name')).toBeVisible();
 });
+it.each(['vacío', 'con entradas'])('#236 R3: un catálogo ok %s no pinta el aviso de error', async state => {
+  if (state === 'vacío') mockCatalog.mockResolvedValue({ kind: 'ok', entries: [] });
+  await renderVaccineCreate();
+  const chips = await screen.findByTestId('vaccine-create-chips');
+  expect(chips.children.map(child => typeof child === 'string' ? child : child.props.testID)).toEqual(state === 'vacío'
+    ? ['vaccine-chip-other']
+    : ['vaccine-chip-cat-lepto', 'vaccine-chip-cat-dhppi', 'vaccine-chip-cat-rabia', 'vaccine-chip-cat-tos', 'vaccine-chip-other']);
+  if (state === 'vacío') expect(screen.getByTestId('vaccine-chip-other').props.accessibilityState).toEqual({ selected: true });
+  expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull();
+  expect(screen.queryByTestId('vaccine-create-catalog-retry')).toBeNull();
+  expect(screen.queryByText('No se pudieron cargar las vacunas')).toBeNull();
+});
+it('#236 R4: mientras carga no pinta el aviso de error', async () => {
+  mockCatalog.mockReturnValue(pending());
+  await renderVaccineCreate();
+  const skeleton = await screen.findByTestId('vaccine-create-chips-skeleton');
+  expect(skeleton.children).toHaveLength(3);
+  expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull();
+});
 it('#236 R5: «Reintentar» vuelve a pedir el catálogo y, si responde ok, pinta las entradas y retira el aviso', async () => {
   mockCatalog.mockResolvedValueOnce({ kind: 'error' });
   await renderVaccineCreate();
```

### Cierre por PARA

HEAD: `ab2262e47a8f7f5d1fb011a056557d9fca533536` (C3).
`git status --short -- mobile-pet-tracker specs`: vacío; `git diff --check`: exit 0.
Producción y tests restaurados a C3; logs temporales eliminados. Solo el reporte y el marcador quedan locales, sin commit.

## Retoma

2026-11-03. El humano pide continuar desde C4 con la enmienda `a0b14bc1`
(`docs(progress): #236 handoff, C4 mutation gate amended`). El PARA anterior
queda resuelto: era un defecto del handoff, no de la spec. Se conserva arriba
el registro completo de la primera ejecución.

Comprobación inicial de esta retoma, en el mismo worktree:

```text
/home/claude/sites/Pet-Tracker-wt-236
feature/236-mobile-vaccine-catalog-error-state
a0b14bc1 docs(progress): #236 handoff, C4 mutation gate amended
ab2262e4 feat(mobile): aviso de error del catálogo de vacunas con reintento (R1,R2,R5,R6,R7,R8)
89598787 test(mobile): usos de copy del aviso del catálogo en rojo (R7)
1aba44d2 test(mobile): aviso de error del catálogo de vacunas en rojo (R1,R2,R5,R6,R8)
6ea703f9 docs(progress): #236 codex handoff
```

El árbol móvil/specs estaba limpio; solo el reporte local estaba sin seguimiento.
`a0b14bc1` cambia únicamente el handoff. No se rehacen C1–C3 ni se cambian las
skills ya cargadas. Se reaplican a mano las 19 líneas de C4 guardadas arriba.
No se ejecuta `./init.sh`, por instrucción explícita del humano.

### M1 validada con la regla enmendada

Se reutiliza la evidencia ya medida: **7 rojos, 48 verdes, 55 total**.
Caen R3 «vacío» y R4, los dos tests obligatorios de su fila. Los cuatro casos
adicionales de R1 y el de R2, sus aserciones y sus recibidos están documentados
en el apartado M1 original. El motivo es que el aviso aparece durante la carga
con esa mutación. La nueva regla admite esos rojos adicionales: **M1 cumple**.
Producción ya estaba restaurada y su diff vacío. Se continúa con M2–M4.

### M2: `!catalog.isPending`

Orden desde `mobile-pet-tracker/`: `bunx jest src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_m2.log 2>&1; echo "jest=$?"`.

`jest=1`; 3 encabezados de tests fallidos `●`. Fallan:

- `#236 R3: un catálogo ok vacío no pinta el aviso de error`.
- `#236 R3: un catálogo ok con entradas no pinta el aviso de error`.
- `#236 R5: «Reintentar» vuelve a pedir el catálogo y, si responde ok, pinta las entradas y retira el aviso`.

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 52 passed, 55 total
Time:        17.134 s
```

Aserciones y recibidos (extractos del log):

```text
#236 R3: un catálogo ok vacío no pinta el aviso de error
    expect(received).toBeNull()
    Received: <View className="items-start gap-3" testID="vaccine-create-catalog-error"><Text accessibilityRole="alert" className="text-15 leading-body text-danger" selectable={true} testID="vaccine-create-catalog-error-text">No se pudieron cargar las vacunas</Text><View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"m
    > 271 |   expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull();

#236 R3: un catálogo ok con entradas no pinta el aviso de error
    expect(received).toBeNull()
    Received: <View className="items-start gap-3" testID="vaccine-create-catalog-error"><Text accessibilityRole="alert" className="text-15 leading-body text-danger" selectable={true} testID="vaccine-create-catalog-error-text">No se pudieron cargar las vacunas</Text><View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"m
    > 271 |   expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull();

#236 R5: «Reintentar» vuelve a pedir el catálogo y, si responde ok, pinta las entradas y retira el aviso
    expect(received).toBeNull()
    Received: <View className="items-start gap-3" testID="vaccine-create-catalog-error"><Text accessibilityRole="alert" className="text-15 leading-body text-danger" selectable={true} testID="vaccine-create-catalog-error-text">No se pudieron cargar las vacunas</Text><View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"m
    > 293 |   await waitFor(() => expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull());

```

Restaurado con `git checkout HEAD -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`; `git diff --quiet -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`: **0**.
Todos los tests obligatorios de la fila quedan rojos: **cumple**.
Rojo adicional: R5 falla en `waitFor(() => expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull())`: esperado `null`, recibido el `View` del aviso. Con `!catalog.isPending`, el aviso sigue también después de que el reintento responda `ok`. Se acepta conforme a `a0b14bc1`.

### M3: `catalog.data?.kind !== 'ok'`

Orden desde `mobile-pet-tracker/`: `bunx jest src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_m3.log 2>&1; echo "jest=$?"`.

`jest=1`; 6 encabezados de tests fallidos `●`. Fallan:

- `#236 R1: con el catálogo en error pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unreachable pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unauthorized pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en missing-config pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre`.
- `#236 R4: mientras carga no pinta el aviso de error`.

```text
Test Suites: 1 failed, 1 total
Tests:       6 failed, 49 passed, 55 total
Time:        15.981 s, estimated 17 s
```

Aserciones y recibidos (extractos del log):

```text
#236 R1: con el catálogo en error pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R1: con el catálogo en unreachable pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R1: con el catálogo en unauthorized pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R1: con el catálogo en missing-config pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre
    Unable to find an element with testID: vaccine-create-chips
    > 258 |   const chips = screen.getByTestId('vaccine-create-chips');

#236 R4: mientras carga no pinta el aviso de error
    expect(received).toBeNull()
    Received: <View className="items-start gap-3" testID="vaccine-create-catalog-error"><Text accessibilityRole="alert" className="text-15 leading-body text-danger" selectable={true} testID="vaccine-create-catalog-error-text">No se pudieron cargar las vacunas</Text><View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"m
    > 280 |   expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull();

```

Restaurado con `git checkout HEAD -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`; `git diff --quiet -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`: **0**.
Todos los tests obligatorios de la fila quedan rojos: **cumple**.
Los rojos adicionales se registran arriba. La mutación permite el aviso antes de terminar la carga inicial; las esperas de R1/R2 al aviso terminan cuando aún no existen los chips. Se aceptan conforme a `a0b14bc1`.

### M4: `!catalog.isFetching && catalog.data?.kind !== 'ok'`

Orden desde `mobile-pet-tracker/`: `bunx jest src/screens/vaccine-create/index.test.tsx > ../progress/jest_236_m4.log 2>&1; echo "jest=$?"`.

`jest=1`; 7 encabezados de tests fallidos `●`. Fallan:

- `#236 R1: con el catálogo en error pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unreachable pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en unauthorized pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R1: con el catálogo en missing-config pinta el aviso y «Reintentar» entre la leyenda y los chips`.
- `#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre`.
- `#236 R4: mientras carga no pinta el aviso de error`.
- `#236 R6: mientras el reintento está en vuelo el aviso sigue y no vuelven los esqueletos`.

```text
Test Suites: 1 failed, 1 total
Tests:       7 failed, 48 passed, 55 total
Time:        16.197 s
```

Aserciones y recibidos (extractos del log):

```text
#236 R1: con el catálogo en error pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R1: con el catálogo en unreachable pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R1: con el catálogo en unauthorized pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R1: con el catálogo en missing-config pinta el aviso y «Reintentar» entre la leyenda y los chips
    Unable to find an element with testID: vaccine-create-chips
    > 233 |   expect(error.parent).toBe(screen.getByTestId('vaccine-create-chips').parent);

#236 R2: con el aviso pintado «Otra vacuna» sigue seleccionada y con su campo de nombre
    Unable to find an element with testID: vaccine-create-chips
    > 258 |   const chips = screen.getByTestId('vaccine-create-chips');

#236 R4: mientras carga no pinta el aviso de error
    expect(received).toBeNull()
    Received: <View className="items-start gap-3" testID="vaccine-create-catalog-error"><Text accessibilityRole="alert" className="text-15 leading-body text-danger" selectable={true} testID="vaccine-create-catalog-error-text">No se pudieron cargar las vacunas</Text><View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"m
    > 280 |   expect(screen.queryByTestId('vaccine-create-catalog-error')).toBeNull();

#236 R6: mientras el reintento está en vuelo el aviso sigue y no vuelven los esqueletos
    Unable to find an element with testID: vaccine-create-catalog-error
    > 300 |   expect(screen.getByTestId('vaccine-create-catalog-error')).toBeVisible();

```

Restaurado con `git checkout HEAD -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`; `git diff --quiet -- mobile-pet-tracker/src/screens/vaccine-create/index.tsx`: **0**.
Todos los tests obligatorios de la fila quedan rojos: **cumple**.
Los rojos adicionales se registran arriba. La mutación permite el aviso antes de terminar la carga inicial; las esperas de R1/R2 al aviso terminan cuando aún no existen los chips. Se aceptan conforme a `a0b14bc1`.

### R9 antes de C5

Desde la raíz, ambos `grep -cF` de tasks §R9 dan **0**:

- `## #236 mobile-vaccine-catalog-error-state`.
- `- [ ] Smoke de #236 pasado (fecha: ____; paso 1, fallo reproducido: sí / no)`.

### C4 — commit de la retoma

`354f46c76e8b834bd90eece9e9af79b403fcd151` — `test(mobile): sin aviso con catálogo ok ni durante la carga (R3,R4)`.
Solo `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx`: las 19 líneas reaplicadas de R3 y R4. La suite de ese fichero vuelve a verde dentro de la corrida completa (55 tests); ninguna mutación entra al commit. M1–M4 cumplen la tabla con la regla enmendada.
En M4, el rojo adicional de R4 también proviene del aviso durante la carga inicial antes de iniciar la consulta. R6 «en vuelo» cae en su comprobación del nodo del aviso tras la segunda llamada: `Unable to find an element with testID: vaccine-create-catalog-error`.

### Verificaciones de la retoma

Suite completa, desde `mobile-pet-tracker/`:

```bash
bunx jest src/__tests__ src/app/__tests__ src/components/__tests__ src/screens/vaccine-create > ../progress/jest_236_final.log 2>&1; echo "jest=$?"
```

Primera corrida: `jest=1`; **80 suites verdes, 1 fallida, 81 total**;
**1712 tests verdes, 2 fallidos, 1714 total**; **1 snapshot verde**;
427.81 s. El fichero de Agregar vacuna pasa con sus **55 tests**.
El log tiene **26 encabezados `●`**: **22 `Console`** y **4 de fallo**,
porque los **2 fallos únicos** se imprimen otra vez en el resumen.

Los dos fallos son timeouts de 60000 ms en
`src/components/__tests__/celebration.test.tsx` (suite de 414.064 s):

- `#171 R7: pop › R7.4 la insignia baja de 1.08 a 1 entre los 800 y los 900 ms`;
- `#171 R18: flotación de Pingo › R18.1 Pingo flota desde los 600 ms: 0, -5 y -10 a los 600, 1350 y 2100 ms`.

Se repite solo esa suite según la regla del handoff para timeouts bajo carga:

```bash
bunx jest src/components/__tests__/celebration.test.tsx > ../progress/jest_236_celebration_retry.log 2>&1; echo "jest=$?"
```

Tipos, desde `mobile-pet-tracker/`:

```bash
test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_236.log 2>&1; echo $?
```

Resultado: **0**; log de **0 bytes**. Se comprobó la ausencia de
`.expo/types/router.d.ts` antes y después; no se borra ningún archivo de tipos.

Lint, desde `mobile-pet-tracker/`:

```bash
bunx expo lint --no-cache > ../progress/lint_236.log 2>&1 && test ! -s ../progress/lint_236.log && echo LINT_OK
```

Resultado: **exit 0**, **`LINT_OK`**, log de **0 bytes**.

Verificación de alcance: producción idéntica byte por byte a C3. Retirando
en memoria únicamente los tests nuevos `#236 R1`–`R8`, el fichero de tests es
idéntico byte por byte al de H0 (`6ea703f9`). Los archivos de C1, C2, C3 y C4
coinciden exactamente con la lista cerrada de cada commit.

Repetición aislada de celebración: **`jest=0`**, **1/1 suite verde**,
**66/66 tests verdes**, 66.598 s (suite: 66.152 s), **0 `●`**, **0 timeouts**.
No se modifica esa suite. La evidencia final reúne las 80 suites verdes de la
corrida completa y la suite repetida en aislamiento; se conserva el resultado
rojo de la corrida completa y su causa, sin presentarlo como una corrida verde.

### C5 — smoke y trazabilidad

`docs(progress): paso de smoke y trazabilidad de #236 (R9)`.
Solo `progress/smoke_mejoras-smoke.md`,
`specs/mobile-vaccine-catalog-error-state/traceability.md` y este reporte.
Se pega la sección literal de design §Paso de smoke al final, con línea en
blanco antes del título. La casilla G2 se conserva **sin marcar**.
Las nueve filas de trazabilidad quedan con su verificación y commits;
los hashes C1–C4 figuran arriba. C5 contiene este reporte, así que se identifica
por su título único en lugar de inventar un hash autorreferencial. Su hash
se obtiene después de crearlo mediante:

```bash
git log -1 --format=%H --fixed-strings --grep='docs(progress): paso de smoke y trazabilidad de #236 (R9)'
```

Verificación R9 tras pegar la sección: los dos `grep -cF` anteriores dan **1**.
Comparación byte por byte: la sección final coincide con el bloque literal de design; tiene la línea en blanco anterior y la casilla sin marcar. Las nueve filas de traceability tienen test/verificación y commits, sin filas pendientes.
Producción continúa idéntica a C3; `git diff b06e688f -- mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/screens/health/index.tsx` sigue vacío. `git diff --check`: **0**.

### Cierre de la retoma

C1–C5 completados; el PARA histórico está resuelto por la enmienda `a0b14bc1`. M1–M4 cumplen. Los 55 tests de Agregar vacuna pasan; las guardas pasan; la corrida completa tiene dos timeouts de celebración, cuya repetición aislada pasa 66/66. Tipos y lint pasan con logs vacíos.
Logs temporales de Jest, tipos y lint eliminados. Antes de C5, mobile está limpio y el único cambio en specs es su traceability. El cierre verifica `git status --short -- mobile-pet-tracker specs` vacío después de C5.
No se ejecutaron `./init.sh`, fetch, merge, rebase, push ni bun install. No se abrió ni editó PR. No se tocaron infraestructura, dependencias, otros módulos, catálogo i18n, feature_list.json, STATUS.md, progress/current.md, historial ni handoff. La enmienda del handoff es del leader.
Quedan al leader `./init.sh`, revisión e integración por PR contra `dev`; el smoke Android G2 y su casilla siguen reservados al humano. No se marca la feature done en feature_list.json.
Última acción: crear el marcador local `progress/impl_mobile-vaccine-catalog-error-state.done` con una sola línea que contiene la ruta absoluta de este reporte; no se commitea.

La comprobación final detectó que la primera receta de búsqueda del hash de
C5 no resolvía el commit. Se corrigió por `git log` con título literal y se
verificó que devuelve exactamente HEAD. La corrección se incorpora a C5;
no cambia ningún hash C1–C4 ni se rebasea la rama.
