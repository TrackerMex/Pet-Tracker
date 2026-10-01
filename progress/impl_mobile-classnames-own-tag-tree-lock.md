/home/claude/sites/Pet-Tracker-wt-backend
feature/127-mobile-classnames-own-tag-tree-lock
b5d1062ff406db7fa0005bea6b3486beac04ac38

# Evidencia final — mobile-classnames-own-tag-tree-lock: R1–R6 verificados

Implementación y cierre verificados: **24 sondas conformes**, nueve **220/220**, suite **86 suites / 1634 tests / 1 snapshot**, `exit=0`; delta **+8 tests / +0 suites** sobre la base medida. Tsc y eslint pasan, las cuentas y blobs coinciden, los siete prefijos son exactos y producción termina sin diff. La trazabilidad no contiene ninguna fila pendiente. Se conservan los nueve commits propios originales y se añade únicamente el commit de evidencia con el mensaje literal.

H0 permanece `b5d1062ff406db7fa0005bea6b3486beac04ac38`; las tres primeras líneas reproducen pwd, branch y HEAD del primer arranque. Skills cargadas: **ninguna**. Spec leída completa y casilla humana `[x]` (2026-09-30). Fecha de las medidas: 2026-10-01 (UTC).

Las dos correcciones del leader, `968c1ebc2dbc0f02290d3dd8f29609a01f886278` y `b268f8d5219db842abb71cfdd5567c98c35575d7`, solo cambian tasks.md. Por autorización explícita, el diff H0..HEAD tiene **once ficheros**: los diez propios más ese único fichero de spec. El historial desde H0 contiene diez commits propios y esos dos commits del leader. No se cambió de rama, no se accedió a otros worktrees, no se ejecutó init.sh, E2E, CDK ni infraestructura compartida, y no se hizo push ni se abrió PR. Los artefactos del leader quedan intactos.

## Incidente resuelto: B-login-h

La primera preparación produjo `10ab4fdde34c15463ff9b8d4c32ab6e746a5accc`, pero la tabla citaba `10ab4fde`. Se detuvo antes de Jest y se restauró producción. El leader reprodujo el blob desde login.tsx en 886558db y corrigió la errata en `968c1ebc2dbc0f02290d3dd8f29609a01f886278`. La mutación literal no cambió; la medida posterior fue conforme: 2 rojos de 220 (toContain previo y toBe de R1-login), exit=1.

```text
AssertionError: ('mobile-pet-tracker/src/app/(auth)/login.tsx', '10ab4fdde34c15463ff9b8d4c32ab6e746a5accc', '10ab4fde')
```

## Incidente resuelto: D-h

La medida original dio 11 rojos de 220, exit=1: diez previos más R4 por toBe en la aserción del botón (a1). Dos previos fallaron por consulta, con la primera línea `Unable to find an element with testID: reminder-delete-reminder-1`: `R7: borrar recordatorio con confirmación › refetches and removes the row after not-found` y la segunda ocurrencia de `R7: borrar recordatorio con confirmación › shows the action error for $state.kind`. Se detuvo y restauró producción. El leader midió la base 886558db y confirmó que esos dos errores en cascada ya existían, y corrigió la fila en `b268f8d5219db842abb71cfdd5567c98c35575d7`.

La medida de D-h es conforme con la fila corregida y se conserva sin repetir. Z-d-dup es la única consulta roja **nueva** de este ciclo; los dos rojos de consulta de D-h son previos. Se registran los cuatro casos de it.each por ocurrencia para no agrupar títulos iguales. No se alteró ninguna aserción, helper, mock ni import para resolver los incidentes.

## Base medida y 18 blobs

Los 18 controles de base coinciden byte a byte con tasks.md.

| Ruta | Blob medido |
|---|---|
| `mobile-pet-tracker/src/app/(auth)/login.tsx` | `72ef07f50c9c79d939f3496b358b9864a46b7fc5` |
| `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | `cbf07d9085838ed5df2c1e29d4af5c69b621d365` |
| `mobile-pet-tracker/src/app/(auth)/register.tsx` | `02c1e79595279c6973511cbca8f74ec4abee22d7` |
| `mobile-pet-tracker/src/screens/reset-password/index.tsx` | `f58c118ca953c8f58a24d503d721d23204535ccd` |
| `mobile-pet-tracker/src/screens/health/index.tsx` | `7e31f13313a390ce8d32bf9ce930be9688ed505d` |
| `mobile-pet-tracker/src/components/pet-hero-header.tsx` | `eb19efe3776345d7294fef922d15ef7a6d060a9a` |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `8fbcd07c664d789b4c136347a68ed0ddc2b81bab` |
| `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx` | `f1af97725d933db3710399034efbf8530cb5ee0e` |
| `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` | `0ca250f887f701657029bd6c67ef97c65b6c9053` |
| `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx` | `9c0d47bce0dc06efae78467c8f3923061ce08971` |
| `mobile-pet-tracker/src/screens/reset-password/index.test.tsx` | `7ff07c24c4814e824ff40890c746bf6a23fc1eef` |
| `mobile-pet-tracker/src/screens/health/index.test.tsx` | `6717494236cf9f1e8abbfe744d2d71a60a28b2ba` |
| `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` | `63e01f83b3450d363c16484892607b4227a7db37` |
| `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | `0c02d608b9afc407b53ad584e80d308df7ab8092` |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `b6c352b56d03eaf4b242f46fbc0d3b7460eaf2c7` |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | `8c42a1052626ed4ea11b2fe361dcb06fac761b7d` |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `2b8b33f343a993833a23686174ddb1ae0b7a0776` |
| `docs/conventions.md` | `78ed538c70c544989e296ee71a890b49c2bd7e0d` |

## Comandos de medida

Desde mobile-pet-tracker/, siempre sin pipe; cada ejecución se redirigió a su log con `> /tmp/127_<medida>.log 2>&1; echo "exit=$?"`. Los logs temporales no se versionan. Los bloques Console no cuentan como fallos.

Las nueve (9 suites verificadas):

```bash
bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/screens/reminders/index.test.tsx "src/app/(auth)/__tests__/login.test.tsx" "src/app/(auth)/__tests__/forgot.test.tsx" "src/app/(auth)/__tests__/register.test.tsx" src/screens/reset-password/index.test.tsx src/screens/health/index.test.tsx src/components/__tests__/pet-hero-header.test.tsx
```

Suite completa, comando literal de tasks.md: `bunx jest`.

Las 33 (33 suites verificadas):

```bash
bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/screens/reminders/index.test.tsx "src/app/(auth)/__tests__/login.test.tsx" "src/app/(auth)/__tests__/forgot.test.tsx" "src/app/(auth)/__tests__/register.test.tsx" src/screens/reset-password/index.test.tsx src/screens/health/index.test.tsx src/components/__tests__/pet-hero-header.test.tsx "src/app/(tabs)/__tests__/profile.test.tsx" "src/app/(tabs)/__tests__/screens.test.tsx" "src/app/(tabs)/__tests__/alerts.test.tsx" "src/app/(tabs)/__tests__/food.test.tsx" src/screens/home/index.test.tsx src/screens/profile/index.test.tsx src/screens/alerts/index.test.tsx src/screens/home/weekly-activity-chart.test.tsx src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/hosting-artifacts.test.ts src/__tests__/ui-language.test.ts src/app/__tests__/alert-detail.navigation.test.tsx src/app/__tests__/alert-detail.notification.test.tsx src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/detail-stack.navigation.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/hooks/use-pet-selection.test.tsx src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/font-registration.test.ts src/theme/__tests__/global-css.test.ts
```

R5 (4 suites):

```bash
bunx jest --runTestsByPath src/__tests__/hosting-artifacts.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/screens/home/index.test.tsx
```

## Diez commits propios, en el orden literal

| Nº | R-id | Hash | Mensaje |
|---|---|---|---|
| 1 | R1 rojo | `91a5fb232251c95a8e0f71c8d5760f292e02e4ce` | `test(mobile): expose the auth submit recipes with a versioned mutation (R1)` |
| 2 | R1 verde | `9cbff1681ec8236e74690caa7fff6003591b0228` | `test(mobile): lock the auth submit buttons' className in the tree (R1)` |
| 3 | R2 rojo | `cc0571c265655e452689ea310769961d8484a2ce` | `test(mobile): expose the skeleton recipes with a versioned mutation (R2)` |
| 4 | R2 verde | `9975df4779f0e5cd92fff82156e14f07bde63240` | `test(mobile): lock the vaccines and hero skeletons in the tree (R2)` |
| 5 | R3 rojo | `e41cff36ee38f85de0f190a81027278fa0f7ca4c` | `test(mobile): expose the summary pill recipe with a versioned mutation (R3)` |
| 6 | R3 verde | `ff2ca5aeb7bc27637195061cec9f327be66fe72b` | `test(mobile): lock the three summary pills in the tree (R3)` |
| 7 | R4 rojo | `df33eed552e91a9daeb385fe2979ccbffc2a2415` | `test(mobile): expose the delete-confirm label decoy with a versioned mutation (R4)` |
| 8 | R4 verde | `4b032a18d39aa1f5322e1e22903a08e52d1ce0cf` | `test(mobile): lock the delete-confirm button and its label in the tree (R4)` |
| 9 | R5 | `d0742cb0ef7b768cbce607197e387cb8507ca4e5` | `docs: close the opening-tag slice limits with the tree locks (R5)` |
| 10 | R1,R2,R3,R4,R5,R6 | `HEAD` al cerrar (consulta reproducible debajo) | `docs(mobile): record the own-tag tree lock evidence (R1,R2,R3,R4,R5,R6)` |

La décima fila identifica el commit que contiene este reporte. Su hash se obtiene con `git log -1 --format=%H --fixed-strings --grep='docs(mobile): record the own-tag tree lock evidence (R1,R2,R3,R4,R5,R6)'`; no se escribe un hash autorreferente que cambiaría al añadirse al propio fichero. Los nueve hashes previos son literales y permanecen intactos.

Los cuatro verdes solo cambian producción, restaurada desde `HEAD~1` inmediatamente después de cada rojo. R5 solo cambia docs/conventions.md.

## Base, rojos y verdes

| Medida | exit | Salida de resumen literal |
|---|---|---|
| `base_nueve` | 0 | `Test Suites: 9 passed, 9 total`<br>`Tests:       212 passed, 212 total`<br>`Snapshots:   0 total`<br>`Time:        26.73 s` |
| `base_full` | 0 | `Test Suites: 86 passed, 86 total`<br>`Tests:       1626 passed, 1626 total`<br>`Snapshots:   1 passed, 1 total`<br>`Time:        60.497 s` |
| `r1red_nueve` | 1 | `Test Suites: 4 failed, 5 passed, 9 total`<br>`Tests:       4 failed, 212 passed, 216 total`<br>`Snapshots:   0 total`<br>`Time:        17.534 s` |
| `r1red_full` | 1 | `Test Suites: 4 failed, 82 passed, 86 total`<br>`Tests:       4 failed, 1626 passed, 1630 total`<br>`Snapshots:   1 passed, 1 total`<br>`Time:        49.489 s, estimated 57 s` |
| `r1green_nueve` | 0 | `Test Suites: 9 passed, 9 total`<br>`Tests:       216 passed, 216 total`<br>`Snapshots:   0 total`<br>`Time:        9.213 s` |
| `r2red_nueve` | 1 | `Test Suites: 2 failed, 7 passed, 9 total`<br>`Tests:       2 failed, 216 passed, 218 total`<br>`Snapshots:   0 total`<br>`Time:        16.655 s` |
| `r2red_full` | 1 | `Test Suites: 2 failed, 84 passed, 86 total`<br>`Tests:       2 failed, 1630 passed, 1632 total`<br>`Snapshots:   1 passed, 1 total`<br>`Time:        49.863 s` |
| `r2green_nueve` | 0 | `Test Suites: 9 passed, 9 total`<br>`Tests:       218 passed, 218 total`<br>`Snapshots:   0 total`<br>`Time:        8.758 s` |
| `r3red_nueve` | 1 | `Test Suites: 1 failed, 8 passed, 9 total`<br>`Tests:       1 failed, 218 passed, 219 total`<br>`Snapshots:   0 total`<br>`Time:        14.633 s` |
| `r3red_full` | 1 | `Test Suites: 1 failed, 85 passed, 86 total`<br>`Tests:       1 failed, 1632 passed, 1633 total`<br>`Snapshots:   1 passed, 1 total`<br>`Time:        47.93 s, estimated 50 s` |
| `r3green_nueve` | 0 | `Test Suites: 9 passed, 9 total`<br>`Tests:       219 passed, 219 total`<br>`Snapshots:   0 total`<br>`Time:        9.318 s` |
| `r4red_nueve` | 1 | `Test Suites: 1 failed, 8 passed, 9 total`<br>`Tests:       1 failed, 219 passed, 220 total`<br>`Snapshots:   0 total`<br>`Time:        16.605 s` |
| `r4red_full` | 1 | `Test Suites: 1 failed, 85 passed, 86 total`<br>`Tests:       1 failed, 1633 passed, 1634 total`<br>`Snapshots:   1 passed, 1 total`<br>`Time:        49.005 s` |
| `r4green_nueve` | 0 | `Test Suites: 9 passed, 9 total`<br>`Tests:       220 passed, 220 total`<br>`Snapshots:   0 total`<br>`Time:        8.177 s` |
| `r5` | 0 | `Test Suites: 4 passed, 4 total`<br>`Tests:       234 passed, 234 total`<br>`Snapshots:   0 total`<br>`Time:        18.656 s, estimated 29 s` |
| `final_nueve` | 0 | `Test Suites: 9 passed, 9 total`<br>`Tests:       220 passed, 220 total`<br>`Snapshots:   0 total`<br>`Time:        16.403 s` |
| `final_full` | 0 | `Test Suites: 86 passed, 86 total`<br>`Tests:       1634 passed, 1634 total`<br>`Snapshots:   1 passed, 1 total`<br>`Time:        48.234 s` |

Base medida: **86 suites / 1626 tests / 1 snapshot**, exit=0; nueve: **212/212**, exit=0. Final medido: **86 suites / 1634 tests / 1 snapshot**, exit=0; nueve: **220/220**, exit=0. Delta: **+8 tests / +0 suites**, tanto en la suite como en las nueve. Se conservan las medidas de cada rojo y verde del primer tramo.

### Cada rojo: it, matcher, Expected y Received

En las nueve y en la suite completa cada rojo contiene exactamente los it nuevos del requisito, todos por aserción. consistency-classnames.test.ts y legibility-classnames.test.ts permanecen verdes en los cuatro rojos.

#### #127 R1: el botón de envío de forgot lleva su receta en el árbol › pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toBe`.

```text
expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full bg-accent"
```

#### #127 R1: el botón de envío de register lleva su receta en el árbol › pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toBe`.

```text
expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full rounded-xl bg-accent"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md disabled:element-disabled w-full bg-accent"
```

#### #127 R1: el botón de envío de reset-password lleva su receta en el árbol › pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toBe`.

```text
expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full bg-accent"
```

#### #127 R1: el botón de envío de login lleva su receta en el árbol › pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toBe`.

```text
expect(received).toBe(expected) // Object.is equality

    Expected: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full rounded-xl bg-accent"
    Received: "pressable-feedback__root button__root button__root--variant-primary button__root--size-md w-full bg-accent"
```

#### #127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 260 como único estilo, los vea o no el recorte de fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toBe`.

```text
expect(received).toBe(expected) // Object.is equality

    Expected: "w-full"
    Received: "w-full bg-default"
```

#### #127 R2: el skeleton de vacunas lleva su receta en el árbol › pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toBe`.

```text
expect(received).toBe(expected) // Object.is equality

    Expected: "skeleton__root h-24 w-full rounded-card"
    Received: "skeleton__root h-24 w-full"
```

#### #127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toStrictEqual`.

```text
expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -5,11 +5,11 @@
            "borderCurve": "continuous",
          },
          "testID": "pill-active",
        },
        Object {
    -     "className": "flex-1 items-center gap-1 rounded-xl bg-default p-3",
    +     "className": "flex-1 items-center gap-1 bg-default p-3",
          "style": Object {
            "borderCurve": "continuous",
          },
          "testID": "pill-week",
        },
```

#### #128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente

Medido en las nueve y en la suite completa; rojo por **aserción**, matcher `toBe`. En R4 falla la segunda aserción (etiqueta); la del botón pasa.

```text
expect(received).toBe(expected) // Object.is equality

    Expected: "button__label button__label--variant-danger button__label--size-md font-bold text-danger-foreground"
    Received: "button__label button__label--variant-danger button__label--size-md font-bold text-foreground"
```

## Blobs de control de los pasos

| Paso | Ruta | Blob medido |
|---|---|---|
| R1 rojo | `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx` | `9cf126af385d8472ce4930088d8b12025a24dc4d` |
| R1 rojo | `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` | `d407cbe0a48c0f885d36273941964869cecd0099` |
| R1 rojo | `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx` | `dca8649f909cb12ea3806b69743d1cdace9105bb` |
| R1 rojo | `mobile-pet-tracker/src/screens/reset-password/index.test.tsx` | `1a2ea572443f026ea8b497b3453b7f0b9e86a030` |
| R1 rojo | `mobile-pet-tracker/src/app/(auth)/login.tsx` | `00794879d47aad3e7c8862369f54a8fac5650582` |
| R1 rojo | `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | `a2d2c544cce1e262f6d8ef5793c51d4e1b206a73` |
| R1 rojo | `mobile-pet-tracker/src/app/(auth)/register.tsx` | `d0cb2b303b4bbb028ae57e79b31ac7c410a34121` |
| R1 rojo | `mobile-pet-tracker/src/screens/reset-password/index.tsx` | `c910abf7ad866e688cb4d0bbd692ae2b0ea6d15b` |
| R1 verde | `mobile-pet-tracker/src/app/(auth)/login.tsx` | `72ef07f50c9c79d939f3496b358b9864a46b7fc5` |
| R1 verde | `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | `cbf07d9085838ed5df2c1e29d4af5c69b621d365` |
| R1 verde | `mobile-pet-tracker/src/app/(auth)/register.tsx` | `02c1e79595279c6973511cbca8f74ec4abee22d7` |
| R1 verde | `mobile-pet-tracker/src/screens/reset-password/index.tsx` | `f58c118ca953c8f58a24d503d721d23204535ccd` |
| R2 rojo | `mobile-pet-tracker/src/screens/health/index.test.tsx` | `c1f95aca46b4bdeff4c8fde59398caf68cf403c1` |
| R2 rojo | `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` | `3642ba3dedb67a57859c3da039889ee6427551b1` |
| R2 rojo | `mobile-pet-tracker/src/screens/health/index.tsx` | `565067e256a4af0d4087a45b0d85cc9c52dc99ee` |
| R2 rojo | `mobile-pet-tracker/src/components/pet-hero-header.tsx` | `9b4d1690cc1c2647a87b05e541f09a5b47426d3d` |
| R2 verde | `mobile-pet-tracker/src/screens/health/index.tsx` | `7e31f13313a390ce8d32bf9ce930be9688ed505d` |
| R2 verde | `mobile-pet-tracker/src/components/pet-hero-header.tsx` | `eb19efe3776345d7294fef922d15ef7a6d060a9a` |
| R3 rojo | `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | `af60a67049e09c098b57a255be742e56c79b235b` |
| R3 rojo | `mobile-pet-tracker/src/screens/reminders/index.tsx` | `baa5baba69d4a2c3bd94ba351e354b88090b1b9c` |
| R3 verde | `mobile-pet-tracker/src/screens/reminders/index.tsx` | `8fbcd07c664d789b4c136347a68ed0ddc2b81bab` |
| R4 rojo | `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | `1f6fa07ed92e45126f13cf09aa915dd4353dc428` |
| R4 rojo | `mobile-pet-tracker/src/screens/reminders/index.tsx` | `74fe6d45de908378bc99f2f130bc5f56665fb081` |
| R4 verde | `mobile-pet-tracker/src/screens/reminders/index.tsx` | `8fbcd07c664d789b4c136347a68ed0ddc2b81bab` |
| R5 | `docs/conventions.md` | `c34410e2fa7eb848ccb58d83208399b8c7bb37b0` |

## R5: blob y grep -cF

Blob medido: `c34410e2fa7eb848ccb58d83208399b8c7bb37b0`. Diff de la convención: +12 / −3, solo las dos sustituciones prescritas.

| Patrón literal | Base | Medido |
|---|---|---|
| `límites documentados` | 1 | 0 |
| `los límites 2 y 3 los cierra el` | 0 | 1 |
| `#127 R` | 0 | 1 |
| `#128 R4` | 0 | 2 |
| `Lo cierra el árbol (#128 R4)` | 0 | 1 |
| `Esos candados solo leen fuente` | 1 | 1 |

R5: 4 suites / 234 tests, exit=0.

## Sondas: tabla literal con columna medido

Cada sonda se aplicó una vez sobre el árbol final, se comprobó con git hash-object y se midió con el comando prescrito, sin pipe. Se restauraron siempre las siete rutas con `git checkout HEAD --`; tras cada sonda ambos diffs de src dieron cero. Se conservaron las medidas ya realizadas y solo se ejecutó D-v en la última reanudación. Ninguna sonda se commiteó. La columna medido identifica cada it rojo, primera línea del error, matcher y tipo de fallo; los títulos repetidos se distinguen por ocurrencia.

| Sonda | Fichero | Blob | Comando | Hoy | Exigido tras este ciclo  Medido |
|---|---|---|---|---|------|
| `P1red` | los cuatro de autenticación | los de R1 | 33 | verde | rojo 4 de 788: R1-login, R1-forgot, R1-register y R1-reset, por `toBe`  blobs: `00794879d47aad3e7c8862369f54a8fac5650582`, `a2d2c544cce1e262f6d8ef5793c51d4e1b206a73`, `d0cb2b303b4bbb028ae57e79b31ac7c410a34121`, `c910abf7ad866e688cb4d0bbd692ae2b0ea6d15b`; comando 33; exit=1; Test Suites: 4 failed, 29 passed, 33 total; Tests:       4 failed, 784 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#127 R1: el botón de envío de register lleva su receta en el árbol › pinta register-submit, deshabilitado al montar, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`<br>`#127 R1: el botón de envío de forgot lleva su receta en el árbol › pinta forgot-submit, deshabilitado, con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`<br>`#127 R1: el botón de envío de reset-password lleva su receta en el árbol › pinta reset-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`<br>`#127 R1: el botón de envío de login lleva su receta en el árbol › pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |
| `B-login-j` | login | `378fd105` | 33 | verde | rojo 1 de 788: R1-login, por `toBe`  blobs: `378fd105b8b1fdd64be515fd4497f7936b1df066`; comando 33; exit=1; Test Suites: 1 failed, 32 passed, 33 total; Tests:       1 failed, 787 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#127 R1: el botón de envío de login lleva su receta en el árbol › pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |
| `B-login-h` | login | `10ab4fdd` | nueve | rojo 1: `#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › app/(auth)/login.tsx aplica rounded-xl a login-submit en su tag de apertura (#120 R1)`, por `toContain` | rojo 2 de 220: ese, igual, y R1-login, por `toBe`  blobs: `10ab4fdde34c15463ff9b8d4c32ab6e746a5accc`; comando nueve; exit=1; Test Suites: 2 failed, 7 passed, 9 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#127 R1: el botón de envío de login lleva su receta en el árbol › pinta login-submit con la clase exacta, rounded-xl y bg-accent incluidos, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`<br>`#62 R1: la escala de radios está declarada y el botón primario tiene un solo radio › app/(auth)/login.tsx aplica rounded-xl a login-submit en su tag de apertura (#120 R1)` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`; restauración HEAD, diff=0 y cached=0 |
| `Z-label` | login | `5c8e9b14` | 33 | verde | **verde**, 788/788: (F)  blobs: `5c8e9b149849dca38c7bc21211577cb5f48981d8`; comando 33; exit=0; Test Suites: 33 passed, 33 total; Tests:       788 passed, 788 total; Snapshots:   0 total; **conforme**; sin it rojo ni matcher; restauración HEAD, diff=0 y cached=0 |
| `Z-state` | login | `e248151f` | nueve | rojo 2: `#62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-lg en producción` y `#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, por `toEqual` | rojo 2 de 220, los mismos: R1 no ve el estado de envío, (D)  blobs: `e248151f06a13dcd8a1cba75037133bce62e5536`; comando nueve; exit=1; Test Suites: 1 failed, 8 passed, 9 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#62 R4: la app solo usa los radios de la escala declarada › no deja la clase fuera de escala rounded-lg en producción` — aserción; primera línea: `expect(received).toEqual(expected) // deep equality`; matcher `toEqual`<br>`#98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` — aserción; primera línea: `expect(received).toEqual(expected) // deep equality`; matcher `toEqual`; restauración HEAD, diff=0 y cached=0 |
| `Z-state2` | login | `c5a2de62` | 33 | verde | **verde**, 788/788: (D)  blobs: `c5a2de625ef9ce9393d3298e750151f473991ec1`; comando 33; exit=0; Test Suites: 33 passed, 33 total; Tests:       788 passed, 788 total; Snapshots:   0 total; **conforme**; sin it rojo ni matcher; restauración HEAD, diff=0 y cached=0 |
| `P2red` | salud y hero | los de R2 | 33 | verde | rojo 2 de 788: R2-vacunas y R2-hero (a1), por `toBe`  blobs: `565067e256a4af0d4087a45b0d85cc9c52dc99ee`, `9b4d1690cc1c2647a87b05e541f09a5b47426d3d`; comando 33; exit=1; Test Suites: 2 failed, 31 passed, 33 total; Tests:       2 failed, 786 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#127 R2: el skeleton de vacunas lleva su receta en el árbol › pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`<br>`#127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 260 como único estilo, los vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |
| `V-h` | salud | `0c3633c1` | nueve | rojo 1: `#62 R2: cada skeleton tiene la forma del contenido que sustituye › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)` | rojo 2 de 220: ese y R2-vacunas, por `toBe`  blobs: `0c3633c18444e7fd0abe2e5118db611708589a0a`; comando nueve; exit=1; Test Suites: 2 failed, 7 passed, 9 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#127 R2: el skeleton de vacunas lleva su receta en el árbol › pinta vaccines-skeleton con la clase exacta, rounded-card incluido, la vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`<br>`#62 R2: cada skeleton tiene la forma del contenido que sustituye › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`; restauración HEAD, diff=0 y cached=0 |
| `S-h` | hero | `5bc88a73` | nueve | rojo 1: `#62 R2: cada skeleton tiene la forma del contenido que sustituye › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)` | rojo 2 de 220: ese y R2-hero, por `toBe`, a1 (recibido `"h-full"`)  blobs: `5bc88a738dacea060cfc7e607d0753d98db1300f`; comando nueve; exit=1; Test Suites: 2 failed, 7 passed, 9 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#62 R2: cada skeleton tiene la forma del contenido que sustituye › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`#127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 260 como único estilo, los vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |
| `Z-hero-style` | hero | `e9e397cd` | nueve | verde | rojo 1 de 220: R2-hero, por `toStrictEqual`, a2  blobs: `e9e397cd07d49cf015e02c2646ecff0a6c350fa3`; comando nueve; exit=1; Test Suites: 1 failed, 8 passed, 9 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#127 R2: el skeleton del hero lleva su receta en el árbol › pinta pet-hero-skeleton con la clase w-full sin radio y el alto de 260 como único estilo, los vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`; restauración HEAD, diff=0 y cached=0 |
| `P3red` = `P-week-l3` | recordatorios | `baa5baba` | 33 | verde | rojo 1 de 788: R3, por `toStrictEqual`  blobs: `baa5baba69d4a2c3bd94ba351e354b88090b1b9c`; comando 33; exit=1; Test Suites: 1 failed, 32 passed, 33 total; Tests:       1 failed, 787 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`; restauración HEAD, diff=0 y cached=0 |
| `P-week-j` | recordatorios | `efa2646a` | 33 | verde | rojo 1 de 788: R3, por `toStrictEqual`  blobs: `efa2646a65821e1496bc434ccff27055a85e0c2d`; comando 33; exit=1; Test Suites: 1 failed, 32 passed, 33 total; Tests:       1 failed, 787 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`; restauración HEAD, diff=0 y cached=0 |
| `P-week-f` | recordatorios | `214a8eb9` | 33 | verde | rojo 1 de 788: R3, por `toStrictEqual`  blobs: `214a8eb9fd920e09eab4debc98d3608534a1643e`; comando 33; exit=1; Test Suites: 1 failed, 32 passed, 33 total; Tests:       1 failed, 787 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`; restauración HEAD, diff=0 y cached=0 |
| `P-week-h` | recordatorios | `195738de` | nueve | rojo 1: `#62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)` | rojo 2 de 220: ese y R3, por `toStrictEqual`  blobs: `195738de4f5d2c2bdc6472c71ac88f410f5f1d18`; comando nueve; exit=1; Test Suites: 2 failed, 7 passed, 9 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`<br>`#62 R4: la app solo usa los radios de la escala declarada › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`; restauración HEAD, diff=0 y cached=0 |
| `P-active-l3` | recordatorios | `bdf163a9` | nueve | verde | rojo 1 de 220: R3, por `toStrictEqual`  blobs: `bdf163a96d7bfca387f73e3fc8d05457a5b97272`; comando nueve; exit=1; Test Suites: 1 failed, 8 passed, 9 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`; restauración HEAD, diff=0 y cached=0 |
| `P-inactive-l3` | recordatorios | `812a6ce3` | nueve | verde | rojo 1 de 220: R3, por `toStrictEqual`  blobs: `812a6ce34ad75026621b7ef0ecb505d40f42c8da`; comando nueve; exit=1; Test Suites: 1 failed, 8 passed, 9 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`; restauración HEAD, diff=0 y cached=0 |
| `Z-week-style` | recordatorios | `60f28714` | nueve | verde | rojo 1 de 220: R3, por `toStrictEqual`  blobs: `60f287146f51fd9a55d7b3c5897c868445ea8395`; comando nueve; exit=1; Test Suites: 1 failed, 8 passed, 9 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#127 R3: las tres píldoras de resumen llevan su receta en el árbol › pinta cada píldora con su clase exacta, rounded-xl incluido, y la esquina continua, las vea o no el recorte de fuente` — aserción; primera línea: `expect(received).toStrictEqual(expected) // deep equality`; matcher `toStrictEqual`; restauración HEAD, diff=0 y cached=0 |
| `Z-child` | recordatorios | `6a341626` | 33 | verde | **verde**, 788/788: (F)  blobs: `6a341626cafac46061557f2d0cd51acfe8df3bc1`; comando 33; exit=0; Test Suites: 33 passed, 33 total; Tests:       788 passed, 788 total; Snapshots:   0 total; **conforme**; sin it rojo ni matcher; restauración HEAD, diff=0 y cached=0 |
| `D-c` = `P4red` | recordatorios | `74fe6d45` | 33 | verde | rojo 1 de 788: R4, por `toBe`, a2  blobs: `74fe6d45de908378bc99f2f130bc5f56665fb081`; comando 33; exit=1; Test Suites: 1 failed, 32 passed, 33 total; Tests:       1 failed, 787 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |
| `D-d` | recordatorios | `50cc3d89` | 33 | rojo 2: `#65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas` y `#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta`, por `toEqual` | rojo 3 de 788: esos dos, igual, y R4, por `toBe`, a2  blobs: `50cc3d89333fbd3f42dbdd368cffdbbb98496e73`; comando 33; exit=1; Test Suites: 2 failed, 31 passed, 33 total; Tests:       3 failed, 785 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`<br>`#65 R8: Recordatorios resuelve su copy por clave › resuelve las 49 ocurrencias normativas` — aserción; primera línea: `expect(received).toEqual(expected) // deep equality`; matcher `toEqual`<br>`#65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta` — aserción; primera línea: `expect(received).toEqual(expected) // deep equality`; matcher `toEqual`; restauración HEAD, diff=0 y cached=0 |
| `Z-d-variant` | recordatorios | `a94461d0` | 33 | verde | rojo 1 de 788: R4, por `toBe`, a1 (recibido con `variant-danger-soft`)  blobs: `a94461d0dd2dc689ebb969007d87ca02147e8e9a`; comando 33; exit=1; Test Suites: 1 failed, 32 passed, 33 total; Tests:       1 failed, 787 passed, 788 total; Snapshots:   0 total; **conforme**<br>`#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |
| `Z-d-dup` | recordatorios | `47d10363` | nueve | verde | rojo 1 de 220: R4, **por consulta** (`Found multiple elements with text: Eliminar`)  blobs: `47d103637b3a9985335d69d80d380962991bdc63`; comando nueve; exit=1; Test Suites: 1 failed, 8 passed, 9 total; Tests:       1 failed, 219 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` — consulta; primera línea: `Found multiple elements with text: Eliminar`; matcher no aplica (consulta); restauración HEAD, diff=0 y cached=0 |
| `D-h` | recordatorios | `00ea6738` | nueve | rojo 10: `#61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`, y nueve de `src/screens/reminders/index.test.tsx` que pasan por `confirmDelete` (`#97 R2`, `#97 R3` y siete de `R7: borrar recordatorio con confirmación`). Dos de esos siete son **por consulta** (`Unable to find an element with testID: reminder-delete-reminder-1`): `refetches and removes the row after not-found` y la segunda `shows the action error for $state.kind`, en cascada del test anterior; son preexistentes, no de este ciclo | rojo 11 de 220: esos diez, igual (los dos por consulta incluidos), y R4, por `toBe`, a1  blobs: `00ea6738a79eb0dfa3982e98f7ab1802a227d19a`; comando nueve; exit=1; Test Suites: 2 failed, 7 passed, 9 total; Tests:       11 failed, 209 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`R7: borrar recordatorio con confirmación › refetches and removes the row after ok` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`R7: borrar recordatorio con confirmación › refetches and removes the row after not-found` — consulta; primera línea: `Unable to find an element with testID: reminder-delete-reminder-1`; matcher no aplica (consulta)<br>`R7: borrar recordatorio con confirmación › shows the action error for $state.kind` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`R7: borrar recordatorio con confirmación › shows the action error for $state.kind [ocurrencia 2]` — consulta; primera línea: `Unable to find an element with testID: reminder-delete-reminder-1`; matcher no aplica (consulta)<br>`R7: borrar recordatorio con confirmación › shows the action error for $state.kind [ocurrencia 3]` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`R7: borrar recordatorio con confirmación › shows the action error for $state.kind [ocurrencia 4]` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`R7: borrar recordatorio con confirmación › disables only the row being deleted while the request is pending` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`#97 R2: el error de acción no sobrevive a la pérdida de foco › borra el error visible al perder foco` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`#97 R3: el guarda del borrado en vuelo sobrevive a la pérdida de foco › mantiene deshabilitada solo la fila cuyo delete sigue pendiente` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |
| `D-v` | recordatorios | `f136e971` | nueve | rojo 1: el `(#120 R2)` de `D-h`, por `toContain` | rojo 2 de 220: ese y R4, por `toBe`, a1 (recibido con `variant-primary`)  blobs: `f136e9718d44ef81b5f92a9dd0e9385e60086060`; comando nueve; exit=1; Test Suites: 2 failed, 7 passed, 9 total; Tests:       2 failed, 218 passed, 220 total; Snapshots:   0 total; **conforme**<br>`#61 R1: la etiqueta destructiva usa el token de danger › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)` — aserción; primera línea: `expect(received).toContain(expected) // indexOf`; matcher `toContain`<br>`#128 R4: el botón destructivo del sheet y su etiqueta llevan su receta en el árbol › pinta reminders-delete-confirm con la variante danger y bg-danger, y su única etiqueta Eliminar con text-danger-foreground, haya o no un señuelo en la fuente` — aserción; primera línea: `expect(received).toBe(expected) // Object.is equality`; matcher `toBe`; restauración HEAD, diff=0 y cached=0 |

## R6: tsc, eslint y cuentas de grep

Desde mobile-pet-tracker/: `test ! -e .expo/types/router.d.ts; echo "exit=$?"` dio **exit=0** inmediatamente antes de `bunx tsc --noEmit > /tmp/127_tsc.log 2>&1; echo "exit=$?"`, que dio **exit=0**. Nunca se borró router.d.ts. El log de tsc está vacío.

El comando literal de eslint de tasks.md §R6.3, con las catorce rutas, `> /tmp/127_lint.log 2>&1; echo "exit=$?"`, dio **exit=0**; log vacío.

Grep -c, base → final:

| Test | `^describe(` | `#127 R` | `#128 R4` | `props.className` | `.toBe(` | `toStrictEqual` | `pressable-feedback__root` | `within(` |
|---|---|---|---|---|---|---|---|---|
| login | 2 → 3 | 0 → 1 | 0 → 0 | 0 → 1 | 2 → 3 | 0 → 0 | 0 → 1 | 0 → 0 |
| forgot | 2 → 3 | 0 → 1 | 0 → 0 | 0 → 1 | 2 → 3 | 0 → 0 | 0 → 1 | 0 → 0 |
| register | 2 → 3 | 0 → 1 | 0 → 0 | 0 → 1 | 1 → 2 | 0 → 0 | 0 → 1 | 0 → 0 |
| reset-password | 4 → 5 | 0 → 1 | 0 → 0 | 0 → 1 | 4 → 5 | 0 → 0 | 0 → 1 | 0 → 0 |
| salud | 7 → 8 | 0 → 1 | 0 → 0 | 3 → 4 | 3 → 4 | 0 → 0 | 0 → 0 | 1 → 1 |
| hero | 7 → 8 | 0 → 1 | 0 → 0 | 10 → 11 | 12 → 13 | 0 → 1 | 0 → 0 | 11 → 11 |
| recordatorios | 11 → 13 | 0 → 1 | 0 → 1 | 8 → 10 | 5 → 7 | 0 → 1 | 0 → 1 | 19 → 20 |

En los siete tests, #127 = #127 R y #128 = #128 R4; ningún id suelto. Eliminar en recordatorios: **1 → 3**. El grep de stylesheet, text-[10px], use-api y useapi conserva exactamente la base (hero 2 → 2; los otros seis 0 → 0). Salida completa:

```text
grep -c '^describe(' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
3
grep -c '#127 R' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
1
grep -c '#128 R4' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
0
grep -c props.className 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
1
grep -c '.toBe(' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
3
grep -c toStrictEqual 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
0
grep -c pressable-feedback__root 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
1
grep -c 'within(' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
0
grep -c '#127' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
1
grep -c '#128' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
0
grep -c Eliminar 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
0
grep -ciE 'stylesheet|text-\[10px\]|use-api|useapi' 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
0
grep -c '^describe(' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
3
grep -c '#127 R' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
1
grep -c '#128 R4' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
0
grep -c props.className 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
1
grep -c '.toBe(' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
3
grep -c toStrictEqual 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
0
grep -c pressable-feedback__root 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
1
grep -c 'within(' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
0
grep -c '#127' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
1
grep -c '#128' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
0
grep -c Eliminar 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
0
grep -ciE 'stylesheet|text-\[10px\]|use-api|useapi' 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
0
grep -c '^describe(' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
3
grep -c '#127 R' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
1
grep -c '#128 R4' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
0
grep -c props.className 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
1
grep -c '.toBe(' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
2
grep -c toStrictEqual 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
0
grep -c pressable-feedback__root 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
1
grep -c 'within(' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
0
grep -c '#127' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
1
grep -c '#128' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
0
grep -c Eliminar 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
0
grep -ciE 'stylesheet|text-\[10px\]|use-api|useapi' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
0
grep -c '^describe(' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
5
grep -c '#127 R' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
1
grep -c '#128 R4' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
0
grep -c props.className mobile-pet-tracker/src/screens/reset-password/index.test.tsx
1
grep -c '.toBe(' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
5
grep -c toStrictEqual mobile-pet-tracker/src/screens/reset-password/index.test.tsx
0
grep -c pressable-feedback__root mobile-pet-tracker/src/screens/reset-password/index.test.tsx
1
grep -c 'within(' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
0
grep -c '#127' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
1
grep -c '#128' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
0
grep -c Eliminar mobile-pet-tracker/src/screens/reset-password/index.test.tsx
0
grep -ciE 'stylesheet|text-\[10px\]|use-api|useapi' mobile-pet-tracker/src/screens/reset-password/index.test.tsx
0
grep -c '^describe(' mobile-pet-tracker/src/screens/health/index.test.tsx
8
grep -c '#127 R' mobile-pet-tracker/src/screens/health/index.test.tsx
1
grep -c '#128 R4' mobile-pet-tracker/src/screens/health/index.test.tsx
0
grep -c props.className mobile-pet-tracker/src/screens/health/index.test.tsx
4
grep -c '.toBe(' mobile-pet-tracker/src/screens/health/index.test.tsx
4
grep -c toStrictEqual mobile-pet-tracker/src/screens/health/index.test.tsx
0
grep -c pressable-feedback__root mobile-pet-tracker/src/screens/health/index.test.tsx
0
grep -c 'within(' mobile-pet-tracker/src/screens/health/index.test.tsx
1
grep -c '#127' mobile-pet-tracker/src/screens/health/index.test.tsx
1
grep -c '#128' mobile-pet-tracker/src/screens/health/index.test.tsx
0
grep -c Eliminar mobile-pet-tracker/src/screens/health/index.test.tsx
0
grep -ciE 'stylesheet|text-\[10px\]|use-api|useapi' mobile-pet-tracker/src/screens/health/index.test.tsx
0
grep -c '^describe(' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
8
grep -c '#127 R' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
1
grep -c '#128 R4' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
0
grep -c props.className mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
11
grep -c '.toBe(' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
13
grep -c toStrictEqual mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
1
grep -c pressable-feedback__root mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
0
grep -c 'within(' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
11
grep -c '#127' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
1
grep -c '#128' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
0
grep -c Eliminar mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
0
grep -ciE 'stylesheet|text-\[10px\]|use-api|useapi' mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
2
grep -c '^describe(' mobile-pet-tracker/src/screens/reminders/index.test.tsx
13
grep -c '#127 R' mobile-pet-tracker/src/screens/reminders/index.test.tsx
1
grep -c '#128 R4' mobile-pet-tracker/src/screens/reminders/index.test.tsx
1
grep -c props.className mobile-pet-tracker/src/screens/reminders/index.test.tsx
10
grep -c '.toBe(' mobile-pet-tracker/src/screens/reminders/index.test.tsx
7
grep -c toStrictEqual mobile-pet-tracker/src/screens/reminders/index.test.tsx
1
grep -c pressable-feedback__root mobile-pet-tracker/src/screens/reminders/index.test.tsx
1
grep -c 'within(' mobile-pet-tracker/src/screens/reminders/index.test.tsx
20
grep -c '#127' mobile-pet-tracker/src/screens/reminders/index.test.tsx
1
grep -c '#128' mobile-pet-tracker/src/screens/reminders/index.test.tsx
1
grep -c Eliminar mobile-pet-tracker/src/screens/reminders/index.test.tsx
3
grep -ciE 'stylesheet|text-\[10px\]|use-api|useapi' mobile-pet-tracker/src/screens/reminders/index.test.tsx
0
```

## R6: diff y prefijos

`git diff --stat H0 HEAD`, con H0 `b5d1062ff406db7fa0005bea6b3486beac04ac38`:

```text
 docs/conventions.md                                |  15 +-
 .../src/app/(auth)/__tests__/forgot.test.tsx       |  10 +
 .../src/app/(auth)/__tests__/login.test.tsx        |  19 +
 .../src/app/(auth)/__tests__/register.test.tsx     |  19 +
 .../components/__tests__/pet-hero-header.test.tsx  |  13 +
 .../src/screens/health/index.test.tsx              |  28 +
 .../src/screens/reminders/index.test.tsx           |  86 +++
 .../src/screens/reset-password/index.test.tsx      |  14 +
 .../impl_mobile-classnames-own-tag-tree-lock.md    | 610 +++++++++++++++++++++
 specs/mobile-classnames-own-tag-tree-lock/tasks.md |   4 +-
 .../traceability.md                                |  20 +-
 11 files changed, 823 insertions(+), 15 deletions(-)
```

Las once rutas son las autorizadas: siete tests (+189 / −0), docs/conventions.md (+12 / −3), reporte y trazabilidad propios, y tasks.md por **dos erratas del leader** (968c1ebc y b268f8d5) que afectan al mismo fichero. No hay otra ruta. Los cambios propios en tests y convención son:

```text
10	0	mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx
19	0	mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx
19	0	mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx
13	0	mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
28	0	mobile-pet-tracker/src/screens/health/index.test.tsx
86	0	mobile-pet-tracker/src/screens/reminders/index.test.tsx
14	0	mobile-pet-tracker/src/screens/reset-password/index.test.tsx
12	3	docs/conventions.md
```

Diff de producción y demás rutas protegidas: vacío, exit=0. Comando desde la raíz:

```bash
git diff --exit-code origin/main...HEAD -- 'mobile-pet-tracker/src/app/(auth)/login.tsx' 'mobile-pet-tracker/src/app/(auth)/forgot.tsx' 'mobile-pet-tracker/src/app/(auth)/register.tsx' mobile-pet-tracker/src/screens/reset-password/index.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/components/pet-hero-header.tsx mobile-pet-tracker/src/screens/reminders/index.tsx mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts
```

Cada test de base es un prefijo exacto del final. Los siete cmp y sus salidas:

```bash
T='mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx'
git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | cmp -n "$(git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | wc -c)" - "$T"; echo "exit=$?"
```

`mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx`: `exit=0`.

```bash
T='mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'
git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | cmp -n "$(git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | wc -c)" - "$T"; echo "exit=$?"
```

`mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx`: `exit=0`.

```bash
T='mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx'
git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | cmp -n "$(git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | wc -c)" - "$T"; echo "exit=$?"
```

`mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx`: `exit=0`.

```bash
T=mobile-pet-tracker/src/screens/reset-password/index.test.tsx
git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | cmp -n "$(git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | wc -c)" - "$T"; echo "exit=$?"
```

`mobile-pet-tracker/src/screens/reset-password/index.test.tsx`: `exit=0`.

```bash
T=mobile-pet-tracker/src/screens/health/index.test.tsx
git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | cmp -n "$(git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | wc -c)" - "$T"; echo "exit=$?"
```

`mobile-pet-tracker/src/screens/health/index.test.tsx`: `exit=0`.

```bash
T=mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | cmp -n "$(git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | wc -c)" - "$T"; echo "exit=$?"
```

`mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx`: `exit=0`.

```bash
T=mobile-pet-tracker/src/screens/reminders/index.test.tsx
git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | cmp -n "$(git show "b5d1062ff406db7fa0005bea6b3486beac04ac38:$T" | wc -c)" - "$T"; echo "exit=$?"
```

`mobile-pet-tracker/src/screens/reminders/index.test.tsx`: `exit=0`.

## Blobs finales (18 controles)

| Ruta | Blob final medido |
|---|---|
| `mobile-pet-tracker/src/app/(auth)/login.tsx` | `72ef07f50c9c79d939f3496b358b9864a46b7fc5` |
| `mobile-pet-tracker/src/app/(auth)/forgot.tsx` | `cbf07d9085838ed5df2c1e29d4af5c69b621d365` |
| `mobile-pet-tracker/src/app/(auth)/register.tsx` | `02c1e79595279c6973511cbca8f74ec4abee22d7` |
| `mobile-pet-tracker/src/screens/reset-password/index.tsx` | `f58c118ca953c8f58a24d503d721d23204535ccd` |
| `mobile-pet-tracker/src/screens/health/index.tsx` | `7e31f13313a390ce8d32bf9ce930be9688ed505d` |
| `mobile-pet-tracker/src/components/pet-hero-header.tsx` | `eb19efe3776345d7294fef922d15ef7a6d060a9a` |
| `mobile-pet-tracker/src/screens/reminders/index.tsx` | `8fbcd07c664d789b4c136347a68ed0ddc2b81bab` |
| `mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx` | `9cf126af385d8472ce4930088d8b12025a24dc4d` |
| `mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx` | `d407cbe0a48c0f885d36273941964869cecd0099` |
| `mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx` | `dca8649f909cb12ea3806b69743d1cdace9105bb` |
| `mobile-pet-tracker/src/screens/reset-password/index.test.tsx` | `1a2ea572443f026ea8b497b3453b7f0b9e86a030` |
| `mobile-pet-tracker/src/screens/health/index.test.tsx` | `c1f95aca46b4bdeff4c8fde59398caf68cf403c1` |
| `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx` | `3642ba3dedb67a57859c3da039889ee6427551b1` |
| `mobile-pet-tracker/src/screens/reminders/index.test.tsx` | `1f6fa07ed92e45126f13cf09aa915dd4353dc428` |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | `b6c352b56d03eaf4b242f46fbc0d3b7460eaf2c7` |
| `mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts` | `8c42a1052626ed4ea11b2fe361dcb06fac761b7d` |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | `2b8b33f343a993833a23686174ddb1ae0b7a0776` |
| `docs/conventions.md` | `c34410e2fa7eb848ccb58d83208399b8c7bb37b0` |

Los siete ficheros de producción y los tres candados de fuente vuelven a sus blobs de base. Los siete tests y la convención coinciden con los blobs finales de tasks.md. Dependencias, catálogo, language-provider y ui-copy-table quedan sin cambios.

## Trazabilidad y decisiones de cierre

R1–R4 citan sus pares rojo/verde originales. R5 y R6 citan `d0742cb0ef7b768cbce607197e387cb8507ca4e5` en la columna verde: es el último commit con cambios fuera de progress/ y specs/. Ninguna fila queda pendiente; los nueve hashes son ancestros verificados. No se hizo rebase ni se alteraron los nueve commits existentes.

No hubo decisiones nuevas de implementación: se copiaron los ocho bloques literales, sin formatter, imports ni helpers nuevos. Los únicos cambios de especificación fueron las dos erratas del leader, conservadas como incidentes. El hash del commit que contiene este propio reporte se resuelve por el comando literal de la tabla de commits; esta referencia evita un hash autorreferente. La salida de diff se confirma después de crear ese commit. Push, PR y cambios de estado del leader corresponden al leader.
