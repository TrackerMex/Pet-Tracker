# Implementación — e2e-audit-log-order-assert (#76)

## T0 — Línea base

- Branch verificada: `feature/76-e2e-audit-log-order-assert`.
- Los contenedores compartidos `pet-tracker-postgres` y
  `pet-tracker-localstack` estaban healthy.
- Antes de cada e2e e `init.sh` se ejecutaron los dos `pgrep`. No había
  ninguna ejecución real concurrente; `pgrep` solo mostró dos wrappers
  antiguos que monitorizan el texto `bash ./init.sh`, no procesos que
  ejecuten el script.
- El archivo de backend era idéntico a `5666b85` antes de R1. Corrida
  aislada de referencia:

```text
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

## R1 — consulta ordenada

El commit `900b164 test(e2e-audit-log-order-assert): order audit log rows
before asserting (R1)` contiene solo
`backend-pet-tracker/test/health-vaccines.e2e-spec.ts`: importa `asc`,
renombra el `it` y añade
`.orderBy(asc(auditLog.at), asc(auditLog.id))`. Las dos `expect`
posteriores quedaron intactas.

Corrida verde tras R1:

```text
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

## Mutación (R2)

Se sustituyó temporalmente `asc` por `desc` en el import y el
`orderBy`. El test falló únicamente por la aserción de acciones, con este
bloque literal de Jest:

```text
expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

  Array [
-   "vaccine.create",
-   "vaccine.update",
    "vaccine.delete",
+   "vaccine.update",
+   "vaccine.create",
  ]

Test Suites: 1 failed, 1 total
Tests:       1 failed, 14 passed, 15 total
```

La mutación se revirtió con
`git checkout -- test/health-vaccines.e2e-spec.ts`; `git status --short`
quedó vacío y nunca se añadió al índice ni se commiteó. La repetición verde
tras revertir fue:

```text
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

## Barrido (R3)

`grep -n "orderBy" test/*.e2e-spec.ts`:

```text
test/devices.e2e-spec.ts:192:        .orderBy(devices.esn);
test/health-vaccines.e2e-spec.ts:497:        .orderBy(asc(auditLog.at), asc(auditLog.id));
```

`grep -rln "\.select(" src --include=*.spec.ts`:

```text

```

Salida vacía: ningún spec unitario usa `.select(`.

`grep -n "\.select(" test/*.e2e-spec.ts`:

```text
test/activity.e2e-spec.ts:222:      .select({ total: count() })
test/alerts-center-notifier.e2e-spec.ts:170:    return db.select().from(alertEvents).where(eq(alertEvents.petId, petId));
test/alerts-center-notifier.e2e-spec.ts:292:        .select()
test/alerts-center-notifier.e2e-spec.ts:328:        .select()
test/alerts-center-notifier.e2e-spec.ts:349:        .select()
test/alerts-center-notifier.e2e-spec.ts:378:        .select()
test/alerts-center-notifier.e2e-spec.ts:399:          .select()
test/alerts-center-notifier.e2e-spec.ts:411:          .select()
test/alerts-center-notifier.e2e-spec.ts:464:        .select()
test/alerts-center-notifier.e2e-spec.ts:754:        .select()
test/alerts-center-notifier.e2e-spec.ts:764:        .select()
test/alerts-engine.e2e-spec.ts:117:      .select()
test/alerts-engine.e2e-spec.ts:201:      .select()
test/alerts-engine.e2e-spec.ts:320:        .select()
test/alerts-engine.e2e-spec.ts:332:        .select()
test/alerts-engine.e2e-spec.ts:343:        .select()
test/alerts-engine.e2e-spec.ts:356:        .select()
test/alerts-engine.e2e-spec.ts:374:      const [petRow] = await db.select().from(pets).where(eq(pets.id, petId));
test/alerts-engine.e2e-spec.ts:384:        .select()
test/alerts-engine.e2e-spec.ts:431:        .select()
test/auth-forgot-password.e2e-spec.ts:163:        .select()
test/auth-forgot-password.e2e-spec.ts:183:        .select({ passwordHash: users.passwordHash })
test/auth-forgot-password.e2e-spec.ts:198:        .select({ passwordHash: users.passwordHash })
test/auth-forgot-password.e2e-spec.ts:207:        .select()
test/auth-forgot-password.e2e-spec.ts:248:        .select()
test/backfill-weights.e2e-spec.ts:103:        .select()
test/backfill-weights.e2e-spec.ts:123:        .select()
test/backfill-weights.e2e-spec.ts:144:        .select()
test/backfill-weights.e2e-spec.ts:164:        .select()
test/backfill-weights.e2e-spec.ts:178:      const [row] = await db.select().from(pets).where(eq(pets.id, pet.id));
test/device-subscriptions.e2e-spec.ts:717:        .select({ id: devices.id, ingestWatermark: devices.ingestWatermark })
test/device-subscriptions.e2e-spec.ts:754:        .select()
test/device-subscriptions.e2e-spec.ts:758:        .select()
test/device-subscriptions.e2e-spec.ts:774:        .select()
test/device-subscriptions.e2e-spec.ts:822:        .select()
test/device-subscriptions.e2e-spec.ts:850:        .select({ id: devices.id, status: devices.status })
test/device-subscriptions.e2e-spec.ts:860:        .select({ id: petDevices.id })
test/device-subscriptions.e2e-spec.ts:919:        .select({ deviceId: deviceSubscriptions.deviceId })
test/device-subscriptions.e2e-spec.ts:946:        .select({ ingestWatermark: devices.ingestWatermark })
test/device-subscriptions.e2e-spec.ts:965:        .select({ ingestWatermark: devices.ingestWatermark })
test/devices.e2e-spec.ts:120:    const [row] = await db.select().from(devices).where(eq(devices.id, id));
test/devices.e2e-spec.ts:171:        .select()
test/devices.e2e-spec.ts:189:        .select()
test/devices.e2e-spec.ts:236:        .select()
test/devices.e2e-spec.ts:255:        .select()
test/devices.e2e-spec.ts:265:        .select()
test/devices.e2e-spec.ts:323:        .select()
test/devices.e2e-spec.ts:335:        .select()
test/devices.e2e-spec.ts:366:        .select()
test/devices.e2e-spec.ts:387:          .select()
test/devices.e2e-spec.ts:393:          .select()
test/devices.e2e-spec.ts:399:          .select()
test/devices.e2e-spec.ts:431:        .select()
test/devices.e2e-spec.ts:438:        .select()
test/devices.e2e-spec.ts:444:        .select()
test/devices.e2e-spec.ts:505:        .select()
test/devices.e2e-spec.ts:526:        .select()
test/devices.e2e-spec.ts:565:        .select()
test/devices.e2e-spec.ts:637:        .select()
test/devices.e2e-spec.ts:671:        .select()
test/devices.e2e-spec.ts:690:        .select()
test/devices.e2e-spec.ts:715:        .select()
test/devices.e2e-spec.ts:874:        .select()
test/devices.e2e-spec.ts:881:        .select()
test/devices.e2e-spec.ts:887:        .select()
test/devices.e2e-spec.ts:949:        .select()
test/devices.e2e-spec.ts:982:        .select()
test/devices.e2e-spec.ts:988:        .select()
test/devices.e2e-spec.ts:1001:        .select()
test/devices.e2e-spec.ts:1007:        .select()
test/geofences.e2e-spec.ts:205:        .select()
test/geofences.e2e-spec.ts:287:        .select()
test/geofences.e2e-spec.ts:312:        .select()
test/geofences.e2e-spec.ts:343:        .select()
test/geofences.e2e-spec.ts:375:        .select()
test/geofences.e2e-spec.ts:410:        .select()
test/geofences.e2e-spec.ts:527:        .select()
test/geofences.e2e-spec.ts:561:        .select()
test/geofences.e2e-spec.ts:595:        .select()
test/geofences.e2e-spec.ts:607:        .select()
test/geofences.e2e-spec.ts:642:        .select()
test/geofences.e2e-spec.ts:648:        .select()
test/geofences.e2e-spec.ts:679:        .select()
test/geofences.e2e-spec.ts:685:        .select()
test/health-vaccines.e2e-spec.ts:67:      .select({ id: vaccineCatalog.id })
test/health-vaccines.e2e-spec.ts:110:      const rows = await db.select().from(vaccineCatalog);
test/health-vaccines.e2e-spec.ts:127:        const rows = await db.select().from(vaccineCatalog);
test/health-vaccines.e2e-spec.ts:266:        .select()
test/health-vaccines.e2e-spec.ts:465:        await db.select().from(petVaccines).where(eq(petVaccines.id, id)),
test/health-vaccines.e2e-spec.ts:494:        .select()
test/health-weights.e2e-spec.ts:144:        .select()
test/health-weights.e2e-spec.ts:375:        await db.select().from(weights).where(eq(weights.petId, pet.id)),
test/health-weights.e2e-spec.ts:398:        await db.select().from(weights).where(eq(weights.petId, pet.id)),
test/health-weights.e2e-spec.ts:498:        .select()
test/ingestion.e2e-spec.ts:70:      .select()
test/ingestion.e2e-spec.ts:200:      const [petRow] = await db.select().from(pets).where(eq(pets.id, petId));
test/ingestion.e2e-spec.ts:215:        .select()
test/ingestion.e2e-spec.ts:236:        .select()
test/ingestion.e2e-spec.ts:245:        .select()
test/ingestion.e2e-spec.ts:260:        .select()
test/ingestion.e2e-spec.ts:264:        .select()
test/ingestion.e2e-spec.ts:289:        .select()
test/ingestion.e2e-spec.ts:297:      const [petAfter] = await db.select().from(pets).where(eq(pets.id, petId));
test/media-docs.e2e-spec.ts:291:        .select()
test/media-docs.e2e-spec.ts:304:        .select()
test/media-docs.e2e-spec.ts:338:          .select()
test/media-docs.e2e-spec.ts:344:          .select()
test/media-docs.e2e-spec.ts:368:          .select()
test/media-docs.e2e-spec.ts:383:          .select()
test/media-docs.e2e-spec.ts:389:          .select()
test/media.e2e-spec.ts:126:    const [row] = await db.select().from(pets).where(eq(pets.id, petId));
test/media.e2e-spec.ts:264:        .select()
test/media.e2e-spec.ts:289:        .select()
test/nutrition.e2e-spec.ts:92:      .select({ value: count() })
test/nutrition.e2e-spec.ts:180:        .select()
test/nutrition.e2e-spec.ts:272:          .select()
test/nutrition.e2e-spec.ts:588:        .select({ aiExplanation: nutritionPlans.aiExplanation })
test/pet-lost-mode.e2e-spec.ts:183:      const rows = await db.select().from(pets).where(eq(pets.id, pet.id));
test/pet-lost-mode.e2e-spec.ts:187:        .select()
test/pet-lost-mode.e2e-spec.ts:225:      const rows = await db.select().from(pets).where(eq(pets.id, pet.id));
test/pet-lost-mode.e2e-spec.ts:228:        .select()
test/pet-lost-mode.e2e-spec.ts:296:      const rows = await db.select().from(pets).where(eq(pets.id, pet.id));
test/pet-lost-mode.e2e-spec.ts:299:        .select()
test/pet-lost-mode.e2e-spec.ts:329:      const rows = await db.select().from(pets).where(eq(pets.id, patchPet.id));
test/pet-reminders.e2e-spec.ts:230:        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
test/pet-reminders.e2e-spec.ts:252:        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
test/pet-reminders.e2e-spec.ts:268:        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
test/pet-reminders.e2e-spec.ts:285:        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
test/pet-reminders.e2e-spec.ts:313:        await db.select().from(reminders).where(eq(reminders.id, reminderId)),
test/pet-reminders.e2e-spec.ts:351:        .select()
test/pet-reminders.e2e-spec.ts:401:          await db.select().from(reminders).where(eq(reminders.petId, pet.id)),
test/pet-reminders.e2e-spec.ts:505:        .select()
test/pet-reminders.e2e-spec.ts:539:        .select()
test/pet-reminders.e2e-spec.ts:560:        .select()
test/pet-reminders.e2e-spec.ts:573:          await db.select().from(reminders).where(eq(reminders.id, reminderId))
test/pet-reminders.e2e-spec.ts:613:          await db.select().from(reminders).where(eq(reminders.id, reminderId))
test/pet-reminders.e2e-spec.ts:644:          await db.select().from(reminders).where(eq(reminders.id, reminderId))
test/pet-reminders.e2e-spec.ts:698:          await db.select().from(reminders).where(eq(reminders.id, reminderId))
test/pet-reminders.e2e-spec.ts:734:          .select()
test/pet-reminders.e2e-spec.ts:761:        .select()
test/pet-reminders.e2e-spec.ts:774:        .select()
test/pets.e2e-spec.ts:193:      const petRows = await db.select().from(pets).where(eq(pets.id, body.id));
test/pets.e2e-spec.ts:197:        .select()
test/pets.e2e-spec.ts:224:        .select()
test/pets.e2e-spec.ts:237:        .select()
test/pets.e2e-spec.ts:263:        .select()
test/pets.e2e-spec.ts:269:        .select()
test/pets.e2e-spec.ts:581:        .select()
test/pets.e2e-spec.ts:597:        .select()
test/pets.e2e-spec.ts:620:        .select()
test/pets.e2e-spec.ts:626:        .select()
test/provision-device.e2e-spec.ts:127:        .select()
test/provision-device.e2e-spec.ts:201:      const before = await db.select({ id: devices.id }).from(devices);
test/provision-device.e2e-spec.ts:213:      const after = await db.select({ id: devices.id }).from(devices);
test/provision-device.e2e-spec.ts:228:      const before = await db.select({ id: devices.id }).from(devices);
test/provision-device.e2e-spec.ts:236:          .select({ id: devices.id })
test/provision-device.e2e-spec.ts:242:      const after = await db.select({ id: devices.id }).from(devices);
test/provision-device.e2e-spec.ts:264:        .select()
test/provision-device.e2e-spec.ts:274:        .select()
test/provision-device.e2e-spec.ts:305:      const before = await db.select({ id: devices.id }).from(devices);
test/provision-device.e2e-spec.ts:314:      const after = await db.select({ id: devices.id }).from(devices);
test/provision-device.e2e-spec.ts:316:        .select()
test/provision-device.e2e-spec.ts:335:        .select()
test/provision-device.e2e-spec.ts:339:        .select()
test/provision-device.e2e-spec.ts:373:        .select()
test/provision-device.e2e-spec.ts:383:        .select()
test/resource-isolation.e2e-spec.ts:114:      .select()
```

`git diff --name-only 5666b85...HEAD -- backend-pet-tracker/`:

```text
backend-pet-tracker/test/health-vaccines.e2e-spec.ts
```

No apareció ningún `db.select()` nuevo en el delta contra `5666b85`.
El único caso order-dependent sigue siendo el corregido por R1; el resto
coincide con la clasificación order-safe de `design.md` D4.

## Suite completa (R4)

Corrida completa de Codex sobre el commit 1:

```text
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 354 passed, 362 total
```

Gate estándar ejecutado desde la raíz:

```bash
env -u FORCE_COLOR bash ./init.sh
```

Resultado: exit `0`, la e2e interna también dio `354 passed` de
`362 total`, no apareció el aviso «se saltan los e2e» y la última línea
fue:

```text
✅ Todo verde. Listo para trabajar.
```

Las tres corridas consecutivas adicionales de la suite completa y el
`init.sh` independiente corresponden al reviewer, según R4.

