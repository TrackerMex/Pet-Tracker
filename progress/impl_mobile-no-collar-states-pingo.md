# Implementación #159 mobile-no-collar-states-pingo

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-159
$ git branch --show-current
feature/159-mobile-no-collar-states-pingo
$ git rev-parse --short HEAD
f9fb79ed
$ git status --short
```

H0: `f9fb79ed`. Status vacío. Guion exclusivo: bloque del handoff.

BASE inicial: `git fetch origin` correcto; `git merge-base --is-ancestor origin/main HEAD`: exit=0. `node_modules`: presente. Router generado: exit=0. `pgrep -af '[i]nit\.sh'`: vacío (exit=1 esperado).

Skills cargadas: `building-native-ui`, `appllama-app-design-skill`, `emil-design-eng` y `ponytail:ponytail`. La spec y la carta prevalecen: se reutiliza EmptyState, sin assets ni motion; smoke Android del humano.

## Anclas en H0

A1:
```text
$ test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok
ok
```

A2:
```text
$ git merge-base --is-ancestor 65f37841 HEAD && echo ok
ok
```

A3:
```text
$ grep -cF '+ 5, // #155 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

A4:
```text
$ grep -cF "['geofences.needsCollar', 'Safe zones require a collar', 'Las zonas seguras requieren un collar']," mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

A5:
```text
$ grep -cF 'expect(R4_MAP).toHaveLength(17 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

A6:
```text
$ grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1); // +1 #155 R8' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

A7:
```text
$ grep -cF "{ file: 'src/screens/map/index.tsx', key: 'map.trackingNeedsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A8:
```text
$ grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A9:
```text
$ grep -cF "{ file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A10:
```text
$ grep -cF "['src/screens/map/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

A11:
```text
$ grep -cF "['src/screens/geofences/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

A12:
```text
$ grep -cF "t('map.trackingNeedsCollar')" mobile-pet-tracker/src/screens/map/index.tsx
1
```

A13:
```text
$ grep -cF '<Text testID="map-no-tracking" className="text-center text-muted">' mobile-pet-tracker/src/screens/map/index.tsx
1
```

A14:
```text
$ grep -cF '<Card testID="geofences-no-tracking" className="items-center py-8">' mobile-pet-tracker/src/screens/geofences/index.tsx
1
```

A15:
```text
$ grep -cF "const canSetLostMode = selectedPet?.myRole === 'owner';" mobile-pet-tracker/src/screens/map/index.tsx
1
```

A16:
```text
$ grep -cF "'El rastreo en vivo requiere un collar'," mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

A17:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

A18:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

A19:
```text
$ grep -cF 'Las zonas seguras requieren un collar' mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
2
```

A20:
```text
$ grep -cF "'La actividad requiere un collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
3
```

A21:
```text
$ grep -cF 'const mockRouter = jest.mocked(router);' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

A22:
```text
$ grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' specs/mobile-ui-language/design.md
1
```

A23:
```text
$ grep -cF '### §2.23' specs/mobile-ui-language/design.md
0
```

A24:
```text
$ grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md
1
```

A25:
```text
$ grep -cF 'el tab Map muestra `Live tracking requires a collar`' docs/verification.md
1
```

A26:
```text
$ grep -cF 'map.trackingNeedsCollar' mobile-pet-tracker/src/i18n/catalog.ts
2
```

A27:
```text
$ grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" mobile-pet-tracker/src/i18n/catalog.ts
0
```

A28:
```text
$ grep -cE "react-native-reanimated|\bAnimated\b|LayoutAnimation|entering=|MOTION_" mobile-pet-tracker/src/screens/map/index.tsx mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/map/index.tsx:0
mobile-pet-tracker/src/screens/geofences/index.tsx:0
```

H1:
```text
$ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H2:
```text
$ grep -cF -- '- [ ] Prueba de humo R10 superada en dev build de Android (fecha: ____)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H3:
```text
$ grep -cF '"status": "in_progress"' feature_list.json
1
```

H4:
```text
$ grep -rlF '#159' mobile-pet-tracker/src | wc -l
0
```

H5:
```text
$ grep -cF "describe('#159" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
0
```

H6:
```text
$ grep -cF 'function makeDevice(connectivity: string | null): DeviceStatus {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H7:
```text
$ grep -cF 'function pending<T>(): Promise<T> {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H8:
```text
$ grep -cF "function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H9:
```text
$ grep -cF "function mount(language: Language = 'es', onUnauthorized?: () => void, seedRole = false) {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H10:
```text
$ grep -cF "const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';" mobile-pet-tracker/src/screens/geofences/index.tsx
1
```

H11:
```text
$ grep -cF 'testID="summary-note"' mobile-pet-tracker/src/screens/home/index.tsx
1
```

H12:
```text
$ grep -cF 'testID={`${testID}-action`}' mobile-pet-tracker/src/components/empty-state.tsx
1
```

H13:
```text
$ grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/map/index.tsx
0
```

H14:
```text
$ grep -cF "router.push('/pairing')" mobile-pet-tracker/src/screens/map/index.tsx
0
```

H15:
```text
$ grep -cF 'function languageDesign(): string {' mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

H16:
```text
$ grep -cF "describe('R5: mascota free degrada sin mapa'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H17:
```text
$ grep -cF "it('shows the collar requirement without map, stats, lost mode, or polling'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H18:
```text
$ grep -cF "describe('#41 R5: la pantalla pinta la lista de zonas y sus estados'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H19:
```text
$ grep -cF "describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H20:
```text
$ grep -cF "describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H21:
```text
$ grep -cF "it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma'" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

H22:
```text
$ grep -cF "it('explains that activity tracking requires a collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H23:
```text
$ grep -cF "it('pinta un guion y la nota cuando el perfil tampoco resuelve'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H24:
```text
$ grep -cE '<Card\s+testID="geofence-editor-no-tracking"' mobile-pet-tracker/src/screens/geofence-editor/index.tsx
1
```

H25:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H26:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

HEAD del handoff: f9fb79ed076b8aae7115e02a0634fdf4c86270d6

## BASE

`FORCE_COLOR=0 bunx jest (10 ficheros del comando BASE) > /tmp/159-base.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 10 passed, 10 total
Tests:       699 passed, 699 total
exit=0
```

## ALL base

`FORCE_COLOR=0 bunx jest > /tmp/159-all-base.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 97 passed, 97 total
Tests:       2365 passed, 2365 total
exit=0
```

## c1

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r1.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       13 failed, 64 passed, 77 total
exit=1
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara map.noTrackingTitle en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "No live location"
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara map.noTrackingBody en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Once your pet has a collar with an active plan, I'll show you where they are."
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara geofences.noTrackingTitle en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Safe zones unavailable"
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › declara geofences.noTrackingBody en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone."
    Received: undefined
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingBody no exclama, no lleva emoji y termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingBody no exclama, no lleva emoji y termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingTitle no exclama, no lleva emoji y no termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingTitle no exclama, no lleva emoji y no termina en punto en los dos idiomas

    expect(received).toBe(expected) // Object.is equality

    Expected: "string"
    Received: "undefined"
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › abre la sección §2.23 en mobile-ui-language tras §2.21 y antes de la infraestructura

    expect(received).toContain(expected) // indexOf

    Expected substring: "### §2.23 — Añadidos por #159 — Pingo sin collar"
    Received string:    "---
    feature: \"mobile-ui-language\"
    status: approved     # draft | approved
    tags: [harness, spec]
    ---·
    # Diseño — [[mobile-ui-language]]·
    > Ver [[requirements]] para los requisitos que este diseño implementa,
    > [[copy-review]] para la hoja de revisión humana de la copy (no normativa),
    > [[../../docs/ui-guidelines|ui-guidelines]] (carta de UI) y
    > [[../../docs/conventions|conventions]] para las reglas que la implementación
    > debe respetar. Fuente del alcance: `progress/explore_design-gap-vs-make.md`
    > §4 y su ampliación del 2026-09-05. Fuente del vocabulario español:
    > `specs/mobile-figma-polish/design-src/App.tsx` (el export del Figma Make ya
    > versionado en el repo).·
    Esta spec es **autosuficiente**: Codex CLI no ve la conversación que la
    originó. Todo el copy y todas las claves están en §2. **Codex no redacta texto
    de producto y no inventa claves**: si encuentra una cadena visible que no está
    en la tabla, para y lo anota en `progress/impl_mobile-ui-language.md`.·
    ---·
    ## 1. El inventario·
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingTitle tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `map.noTrackingTitle` | `No live location` | `Sin ubicación en vivo` | ← añadida por #159 (R1) |"
    Received string:    ""
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › map.noTrackingBody tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `map.noTrackingBody` | `Once your pet has a collar with an active plan, I'll show you where they are.` | `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` | ← añadida por #159 (R1) |"
    Received string:    ""
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingTitle tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `geofences.noTrackingTitle` | `Safe zones unavailable` | `Zonas seguras no disponibles` | ← añadida por #159 (R1) |"
    Received string:    ""
```

```text
  ● #159 R1: el copy sin collar existe en los dos idiomas › geofences.noTrackingBody tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `geofences.noTrackingBody` | `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.` | `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.` | ← añadida por #159 (R1) |"
    Received string:    ""
```

Cadena literal del handoff c1:
```text
grep -qE '^Tests: +13 failed, 64 passed, 77 total$' /tmp/159-r1.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r1.txt)" = 13 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r1.txt \
    && ! grep -qF 'Unable to find' /tmp/159-r1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R1 red no-collar copy'
[feature/159-mobile-no-collar-states-pingo 6906af80] test(mobile-no-collar-states): #159 R1 red no-collar copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 51 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `6906af80 test(mobile-no-collar-states): #159 R1 red no-collar copy`.

## c2

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx > /tmp/159-g1.txt 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       101 passed, 101 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g1-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c2:
```text
grep -qE '^Tests: +101 passed, 101 total$' /tmp/159-g1.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g1-guardas.txt \
    && test "$(grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" src/i18n/catalog.ts)" = 8 \
    && test "$(grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' ../specs/mobile-ui-language/design.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table'
[feature/159-mobile-no-collar-states-pingo b77f23ff] feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 19 insertions(+), 1 deletion(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `b77f23ff feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table`.

## c3

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r2-map.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 96 passed, 99 total
exit=1
```

```text
  ● R5: mascota free degrada sin mapa › shows the collar requirement without map, stats, lost mode, or polling

    Unable to find an element with testID: map-no-tracking-body
```

```text
  ● #159 R2: Mapa sin seguimiento presenta a Pingo › pinta la pose del collar, el título y la frase de Pingo

    Unable to find an element with testID: map-no-tracking-pose
```

```text
  ● #159 R2: Mapa sin seguimiento presenta a Pingo › queda en el sitio del texto que sustituye y sin mapa debajo

    Unable to find an element with testID: map-no-tracking-pose
```

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r2-es.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 77 passed, 79 total
exit=1
```

```text
  ● #159 R2: el texto de rastreo en vivo se retira › map.trackingNeedsCollar ya no existe en ningún idioma y queda retirada en mobile-ui-language

    expect(received).not.toContain(expected) // indexOf

    Expected value: not "map.trackingNeedsCollar"
    Received array:     ["login.invalidCredentials", "common.cannotReachServer", "common.somethingWentWrong", "login.signIn", "login.email", "login.password", "login.createAccount", "login.forgotPassword", "forgot.forgotPassword", "forgot.email", "forgot.sendRecoveryLink", "forgot.instructions", "forgot.checkYourEmail", "forgot.sentTo", "forgot.resend", "forgot.invalidEmail", "forgot.tooManyAttempts", "forgot.backToSignIn", "register.emailAlreadyRegistered", "register.createAccount", "register.firstName", "register.lastName", "register.email", "register.phone", "register.password", "register.confirmPassword", "register.country", "register.iAcceptTerms", "tabs.home", "tabs.map", "tabs.health", "tabs.food", "tabs.profile", "home.noLocationDataYet", "home.lastSeen", "home.home", "common.retry", "common.noPetsYet", "common.noPetsBody", "home.free", "home.online", "home.offline", "home.unknown", "home.noCollar", "home.pairCollar", "home.summaryTitle", "home.activityNeedsCollar", "home.couldNotLoadActivity", "home.activity", "home.walks", "home.sleep", "home.distance", "home.weight", "home.quickActions", "home.quickActionWeight", "home.quickActionReminder", "home.quickActionDocuments", "home.viewOnMap", "home.reminders", "home.remindersSeeAll", "home.nextVaccineDays", "home.nextVaccineDaysLeft", "home.nextVaccineToday", "home.nextVaccineOverdue", "home.noUpcomingVaccine", "home.alertsBell", "home.alertsBellUnread", "alerts.title", "alerts.empty", "alerts.emptyBody", "alerts.ack", "alerts.typeGeofenceExit", "alerts.typeBatteryLow", "alerts.typeUnknown", "alerts.statusAcked", "alerts.statusClosed", "alerts.justNow", "alerts.minutesAgo", "alerts.hoursAgo", "alerts.daysAgo", "alerts.detailTitle", "alerts.statusOpen", "alerts.openedAt", "geofences.title", "geofences.empty", "geofences.emptyBody", "geofences.noTrackingTitle", "geofences.noTrackingBody", "geofences.needsCollar", "geofences.radius", "geofences.activeLabel", "geofences.statusActive", "geofences.statusInactive", "geofences.delete", "geofences.cancel", "geofences.deleteTitle", "geofences.deleteBody", "geofenceEditor.title", "geofenceEditor.nameLabel", "geofenceEditor.mapHint", "geofenceEditor.radiusLabel", "geofenceEditor.resetNote", "geofenceEditor.save", "geofenceEditor.nameTaken", "geofenceEditor.limitReached", "geofenceEditor.invalid", "geofenceEditor.notFound", "geofenceEditor.add", "geofenceEditor.editLabel", "geofenceEditor.limitNotice", "geofenceEditor.ownerOnly", "weeklyActivity.metricActiveMinutes", "weeklyActivity.metricDistance", "weeklyActivity.metricWalks", "weeklyActivity.dayLabelActiveMinutes", "weeklyActivity.dayLabelDistance", "weeklyActivity.dayLabelWalks", "weeklyActivity.dayLabelMissing", "weeklyActivity.chartSummary", "weeklyActivity.trend", "weeklyActivity.title", "weeklyActivity.lastSevenDays", "weeklyActivity.noDataYet", "weeklyActivity.noDataForDay", "weeklyActivity.average", "deviceConnectivity.online", "deviceConnectivity.unknown", "deviceConnectivity.offline", "map.justNow", "map.agoMinutes", "map.agoHours", "map.noSignal", "map.live", "map.stale", "map.noTrackingTitle", "map.noTrackingBody", "map.trackingNeedsCollar", "map.noLocationDataYet", "map.gps", "map.speed", "map.distance", "map.updated", "map.deactivateLostMode", "map.activateLostMode", "map.couldNotUpdateLostMode", "health.health", "health.vaccines", "health.nextDue", "health.noVaccinesYet", "health.couldNotLoadVaccines", "health.weight", "health.noWeightEntriesYet", "health.couldNotLoadWeight", "health.weightLog", "weightLog.enterValidWeight", "weightLog.errorForbidden", "weightLog.weightLog", "weightLog.weight", "weightLog.weightKg", "weightLog.measuredAt", "weightLog.yyyyMmDd", "weightLog.bodyCondition", "weightLog.bodyConditionPlaceholder", "weightLog.logWeight", "weightLog.noWeightEntriesYet", "weightLog.bodyConditionValue", "weightLog.dateCannotBeAfterToday", "weightChart.notEnoughDataYet", "food.food", "food.dailyTarget", "food.dailyKcal", "food.dailyGrams", "food.kcalConsumedOfTarget", "food.mealsToday", "food.markServed", "food.undoServed", "food.couldNotUpdateMeal", "food.mealsServedOfTotal", "food.pending", "food.served", "food.aiRecommendation", "food.noMealPlanYet", "food.noMealPlanBody", "food.couldNotLoadPlan", "food.mealSchedule", "food.mealScheduleLinkSubtitle", "mealSchedule.errorForbidden", "mealSchedule.errorProfileRequired", "mealSchedule.registerWeightFirst", "mealSchedule.mealSchedule", "mealSchedule.dailyTarget", "mealSchedule.dailyGrams", "mealSchedule.mealsPerDay", "mealSchedule.timesAndPortions", "mealSchedule.noMealPlanYet", "mealSchedule.generatePlan", "mealSchedule.nutritionProfile", "mealSchedule.noNutritionProfileYet", "mealSchedule.addMeal", "mealSchedule.editTime", "mealSchedule.editTimeLabel", "mealSchedule.errorInvalidTime", "mealSchedule.errorEditForbidden", "mealSchedule.errorPlanRequired", "mealSchedule.errorTimeNotInPlan", "mealSchedule.errorDuplicateTime", "mealSchedule.errorMealLimit", "profile.notRegistered", "profile.sterilized", "profile.notSterilized", "profile.ageMonths", "profile.errorPhotoFormat", "profile.couldNotUploadPhoto", "profile.profile", "profile.addPet", "profile.couldNotLoadPets", "profile.couldNotLoadPet", "profile.changePhoto", "profile.information", "profile.breed", "profile.microchip", "profile.gpsDevice", "profile.lastSignal", "profile.documents", "profile.gpsSettings", "profile.reminders", "profile.account", "profile.accountUnavailable", "profile.useDarkTheme", "profile.useLightTheme", "profile.signOut", "profile.notificationsBlocked", "profile.openSettings", "docs.documentsOf", "docs.pet", "docs.noDocumentsYet", "docs.emptyBody", "docs.couldNotLoadDocuments", "reminders.errorForbidden", "reminders.reminders", "reminders.new", "reminders.noRemindersYet", "reminders.emptyBody", "reminders.active", "reminders.thisWeek", "reminders.inactive", "reminders.upcoming", "reminders.cancelled", "reminders.sent", "reminders.dueInDays", "reminders.delete", "reminders.deleteReminder", "reminders.deleteSheetBody", "reminders.cancel", "reminderType.vaccine", "reminderType.deworming", "reminderType.medication", "reminderType.appointment", "reminderType.weight", "reminderType.food", "reminderType.other", "addReminder.advanceSameDay", "addReminder.advance1Day", "addReminder.advance3Days", "addReminder.advance7Days", "addReminder.titleIsRequired", "addReminder.pickDate", "addReminder.dateMustBeFuture", "addReminder.errorForbidden", "addReminder.addReminder", "addReminder.type", "addReminder.title", "addReminder.reminderTitle", "addReminder.date", "addReminder.selectDate", "addReminder.time", "addReminder.alert", "addReminder.saveReminder", "addPet.errorPhotoFormat", "addPet.nameIsRequired", "addPet.chooseBirthDate", "addPet.errorAgeRange", "addPet.errorPhotoAfterCreate", "addPet.checkPetDetails", "addPet.youCannotCreatePet", "addPet.addPet", "addPet.pet", "addPet.avatarPreview", "addPet.choosePhoto", "addPet.basicDetails", "addPet.species", "addPet.cat", "addPet.dog", "addPet.name", "addPet.petName", "addPet.breed", "addPet.optional", "addPet.sex", "addPet.female", "addPet.male", "addPet.size", "addPet.small", "addPet.medium", "addPet.large", "addPet.medicalDetails", "addPet.age", "addPet.birthDate", "addPet.approxMonths", "addPet.selectBirthDate", "addPet.months", "addPet.sterilized", "addPet.yes", "addPet.no", "addPet.microchip", "addPet.savePet", "pairing.errorInvalidCode", "pairing.errorAlreadyClaimed", "pairing.errorPetHasDevice", "pairing.errorNoSubscription", "pairing.errorForbiddenClaim", "pairing.errorForbiddenRelease", "pairing.unpairAlertTitle", "pairing.unpairAlertBody", "pairing.cancel", "pairing.unpair", "pairing.addPetFirst", "pairing.trackerIsReady", "pairing.readySubtitle", "pairing.model", "pairing.esn", "pairing.viewOnMap", "pairing.done", "pairing.pairCollar", "pairing.freePlanPairPrompt", "pairing.activationCode", "pairing.printedOnCollarBox", "pairing.gpsDevice", "pairing.battery", "pairing.connection", "pairing.lastMessage", "pairing.noMessagesYet", "pairing.gpsTrackingActive", "pairing.freePlanNoActivePlan", "pairing.planStatusUnavailable", "pairing.unpairCollar", "resetPassword.errorInvalidToken", "resetPassword.errorExpiredToken", "resetPassword.resetPassword", "resetPassword.errorMissingToken", "resetPassword.backToSignIn", "resetPassword.passwordUpdated", "resetPassword.newPassword", "resetPassword.confirmNewPassword", "resetPassword.updatePassword", "profile.languageSpanish", "profile.languageEnglish", "profile.changeLanguage", "food.mealsHistory", "food.mealsHistoryLinkSubtitle", "mealsHistory.mealsHistory", "mealsHistory.previousMonth", "mealsHistory.nextMonth", "mealsHistory.emptyMonth", "mealsHistory.noMealsOnDay", "mealsHistory.servedOne", "mealsHistory.servedMany", "welcome.brand", "welcome.chipGps", "welcome.chipHealth", "welcome.chipNutrition", "welcome.tagline", "welcome.getStarted", "welcome.haveAccount", "welcome.legalNotice", "welcome.pingoGreeting"]
```

```text
  ● #159 R2: el texto de rastreo en vivo se retira › docs/verification.md describe a Pingo en el paso 5 del plan Free

    expect(received).toContain(expected) // indexOf

    Expected substring: "el tab Map muestra a Pingo con `No live location`, sin el botón `Pair a collar` (la mascota ya tiene collar)"
    Received string:    "# Verification — Cómo demostrar que una feature funciona·
    > Antes de declarar cualquier feature como `done`, el implementer debe verificar
    > todos los puntos de esta guía. El reviewer repetirá los pasos críticos de
    > forma independiente.·
    ---·
    ## Verificación base (toda feature)·
    Los comandos exactos viven en `init.config.sh` de este proyecto.·
    ### 1. Build limpio·
    ```bash
    $BUILD_CMD
    # Debe terminar sin errores (ver init.config.sh para el comando real)
    ```·
    ### 2. Tests sin regresión·
    ```bash
    $TEST_CMD
    # Todos los tests previos deben seguir pasando
    ```·
    ### 3. Init verde·
    ```bash
    docker compose up -d
```

Cadena literal del handoff c3:
```text
grep -qE '^Tests: +3 failed, 96 passed, 99 total$' /tmp/159-r2-map.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r2-map.txt)" = 3 \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-body' /tmp/159-r2-map.txt \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-pose' /tmp/159-r2-map.txt \
    && grep -qE '^Tests: +2 failed, 77 passed, 79 total$' /tmp/159-r2-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r2-es.txt)" = 2 \
    && ! grep -qF 'Unable to find' /tmp/159-r2-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r2-map.txt /tmp/159-r2-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/map/index.test.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R2 red map no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 56918113] test(mobile-no-collar-states): #159 R2 red map no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 45 insertions(+), 2 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `56918113 test(mobile-no-collar-states): #159 R2 red map no-tracking empty state`.

Lectura anticipada de /tmp/159-r2-es.txt antes de que existiera: `No such file or directory`, sin cambios en esa lectura. Se repitió tras acabar la medición desde el cd literal de BASE; lectura correcta.

## c4

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g2.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       232 passed, 232 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g2-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c4:
```text
grep -qE '^Tests: +232 passed, 232 total$' /tmp/159-g2.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g2-guardas.txt \
    && test "$(grep -cF "t('map.trackingNeedsCollar')" src/screens/map/index.tsx)" = 0 \
    && test "$(grep -cF 'map.trackingNeedsCollar' src/i18n/catalog.ts)" = 0 \
    && test "$(grep -cF 'Live tracking requires a collar' ../docs/verification.md)" = 0 \
    && test "$(grep -cF 'el tab Map muestra a Pingo con `No live location`' ../docs/verification.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/components/__tests__/empty-state.test.tsx src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx src/screens/map/index.tsx ../docs/verification.md ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/verification.md mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/map/index.tsx specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R2 map no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 00755951] feat(mobile-no-collar-states): #159 R2 map no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 8 files changed, 14 insertions(+), 10 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `00755951 feat(mobile-no-collar-states): #159 R2 map no-tracking empty state`.

## c5

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r3.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 99 passed, 101 total
exit=1
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar al dueño de una mascota sin collar

    Unable to find an element with testID: map-no-tracking-action
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › lleva a emparejar una sola vez

    Unable to find an element with testID: map-no-tracking-action
```

Cadena literal del handoff c5:
```text
grep -qE '^Tests: +2 failed, 99 passed, 101 total$' /tmp/159-r3.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r3.txt)" = 2 \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-r3.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r3.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R3 red pair collar action'
[feature/159-mobile-no-collar-states-pingo f346baf3] test(mobile-no-collar-states): #159 R3 red pair collar action
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 22 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `f346baf3 test(mobile-no-collar-states): #159 R3 red pair collar action`.

## c6

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g3.txt 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       131 passed, 131 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g3-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c6:
```text
grep -qE '^Tests: +131 passed, 131 total$' /tmp/159-g3.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g3-guardas.txt \
    && test "$(grep -cF "router.push('/pairing')" src/screens/map/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/map/index.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R3 pair collar action on map'
[feature/159-mobile-no-collar-states-pingo 9b89f6c8] feat(mobile-no-collar-states): #159 R3 pair collar action on map
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 3 insertions(+), 1 deletion(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `9b89f6c8 feat(mobile-no-collar-states): #159 R3 pair collar action on map`.

## c7

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r4.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       8 failed, 101 passed, 109 total
exit=1
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón al dueño de una mascota con collar

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve error

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve unreachable

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve missing-config

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón mientras el detalle carga

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

Cadena literal del handoff c7:
```text
grep -qE '^Tests: +8 failed, 101 passed, 109 total$' /tmp/159-r4.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r4.txt)" = 8 \
    && ! grep -qF 'Unable to find' /tmp/159-r4.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar'
[feature/159-mobile-no-collar-states-pingo 9506bd88] test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 49 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `9506bd88 test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar`.

## c8

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g4.txt 2>&1; echo "exit=$?"
Test Suites: 2 passed, 2 total
Tests:       139 passed, 139 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g4-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c8:
```text
grep -qE '^Tests: +139 passed, 139 total$' /tmp/159-g4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g4-guardas.txt \
    && test "$(grep -cF 'const canPairCollar =' src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R4 gate pair action on detail'
[feature/159-mobile-no-collar-states-pingo f4f48736] feat(mobile-no-collar-states): #159 R4 gate pair action on detail
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 5 insertions(+), 1 deletion(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

## Sonda S4a

HEAD: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-s4a.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 108 passed, 109 total
exit=1

  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón al dueño de una mascota con collar
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S4b

HEAD: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-s4b.txt 2>&1; echo "exit=$?"
Tests:       3 failed, 106 passed, 109 total
exit=1

  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S4c

HEAD: `f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-s4c.txt 2>&1; echo "exit=$?"
Tests:       4 failed, 105 passed, 109 total
exit=1

  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve error
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve unreachable
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón si el detalle resuelve missing-config
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón mientras el detalle carga
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c9

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-r5.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 50 passed, 53 total
exit=1
```

```text
  ● #159 R5: Zonas seguras sin seguimiento presentan a Pingo › pinta la pose del collar, el título y la frase de Pingo, sin tarjeta

    expect(received).toBe(expected) // Object.is equality

    Expected: "items-center gap-3 py-8"
    Received: "rounded-card border border-border bg-surface p-4 shadow-sm items-center py-8"
```

```text
  ● #159 R5: Zonas seguras sin seguimiento presentan a Pingo › pinta el título y la frase en inglés

    Unable to find an element with testID: geofences-no-tracking-title
```

```text
  ● #159 R5: Zonas seguras sin seguimiento presentan a Pingo › queda en el sitio de la tarjeta que sustituye

    Unable to find an element with testID: geofences-no-tracking-pose
```

Cadena literal del handoff c9:
```text
grep -qE '^Tests: +3 failed, 50 passed, 53 total$' /tmp/159-r5.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r5.txt)" = 3 \
    && grep -qF 'Unable to find an element with testID: geofences-no-tracking-title' /tmp/159-r5.txt \
    && grep -qF 'Unable to find an element with testID: geofences-no-tracking-pose' /tmp/159-r5.txt \
    && grep -qF 'items-center gap-3 py-8' /tmp/159-r5.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r5.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/geofences/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/geofences/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 14e76905] test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 34 insertions(+), 9 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `14e76905 test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state`.

## c10

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g5.txt 2>&1; echo "exit=$?"
Test Suites: 3 passed, 3 total
Tests:       162 passed, 162 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g5-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c10:
```text
grep -qE '^Tests: +162 passed, 162 total$' /tmp/159-g5.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g5-guardas.txt \
    && test "$(grep -cF "t('geofences.needsCollar')" src/screens/geofences/index.tsx)" = 0 \
    && test "$(grep -cF "t('geofences.needsCollar')" src/screens/geofence-editor/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/components/__tests__/empty-state.test.tsx src/screens/geofences/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/geofences/index.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state'
[feature/159-mobile-no-collar-states-pingo 176d9d45] feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 4 files changed, 5 insertions(+), 6 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `176d9d45 feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state`.

## c11

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-g6.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       58 passed, 58 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g6-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c11:
```text
grep -qE '^Tests: +58 passed, 58 total$' /tmp/159-g6.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g6-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/geofences/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/geofences/index.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones'
[feature/159-mobile-no-collar-states-pingo cc53c018] test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 18 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones`.

## Sonda S6a

HEAD: `cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-s6a.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 57 passed, 58 total
exit=1

  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a owner
$ git checkout HEAD -- src/screens/geofences/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S6b

HEAD: `cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones`.

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-s6b.txt 2>&1; echo "exit=$?"
Tests:       4 failed, 54 passed, 58 total
exit=1

  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a family
  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a walker
  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción a vet
  ● #159 R6: en Zonas seguras nadie ve el botón de emparejar › no ofrece acción si el detalle falla
$ git checkout HEAD -- src/screens/geofences/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c12

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofence-editor/index.test.tsx > /tmp/159-r7-ed.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 66 passed, 68 total
exit=1
```

```text
  ● #146 R6: el editor pinta el formulario sobre el mapa y sus estados › pinta el 402 sin Reintentar

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Las zonas seguras necesitan un collar con plan activo.
    Received:
      Las zonas seguras requieren un collar
```

```text
  ● #146 R8: Guardar crea o actualiza la zona y vuelve a la lista › pinta no-tracking bajo Guardar y conserva el borrador

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      Las zonas seguras necesitan un collar con plan activo.
    Received:
      Las zonas seguras requieren un collar
```

```text
$ FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/159-r7-lp.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 23 passed, 24 total
exit=1
```

```text
  ● #41 R1: el catálogo trae las once claves de zonas seguras › registra las once claves en los dos idiomas y en la tabla de la spec de idioma

    expect(received).toBe(expected) // Object.is equality

    Expected: "Safe zones need a collar with an active plan."
    Received: "Safe zones require a collar"
```

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r7-es.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 80 passed, 81 total
exit=1
```

```text
  ● #159 R7: la guarda del editor sigue en texto y dice la verdad › geofences.needsCollar tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `geofences.needsCollar` | `Safe zones need a collar with an active plan.` | `Las zonas seguras necesitan un collar con plan activo.` | ← cambiada por #159 (R7) |"
    Received string:    "### §2.23 — Añadidos por #159 — Pingo sin collar·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `map.noTrackingTitle` | `No live location` | `Sin ubicación en vivo` | ← añadida por #159 (R1) |
    | — | `map.noTrackingBody` | `Once your pet has a collar with an active plan, I'll show you where they are.` | `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingTitle` | `Safe zones unavailable` | `Zonas seguras no disponibles` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingBody` | `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.` | `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.` | ← añadida por #159 (R1) |
    | — | `map.trackingNeedsCollar` ← retirada por #159 (R2) | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    "
```

Cadena literal del handoff c12:
```text
grep -qE '^Tests: +2 failed, 66 passed, 68 total$' /tmp/159-r7-ed.txt \
    && grep -qE '^Tests: +1 failed, 23 passed, 24 total$' /tmp/159-r7-lp.txt \
    && grep -qE '^Tests: +1 failed, 80 passed, 81 total$' /tmp/159-r7-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-ed.txt)" = 2 \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-lp.txt)" = 1 \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-es.txt)" = 1 \
    && ! grep -qF 'Unable to find' /tmp/159-r7-ed.txt /tmp/159-r7-lp.txt /tmp/159-r7-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r7-ed.txt /tmp/159-r7-lp.txt /tmp/159-r7-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/geofence-editor/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R7 red truthful editor guard'
[feature/159-mobile-no-collar-states-pingo c3312097] test(mobile-no-collar-states): #159 R7 red truthful editor guard
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 3 files changed, 15 insertions(+), 3 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `c3312097 test(mobile-no-collar-states): #159 R7 red truthful editor guard`.

## c13

```text
$ FORCE_COLOR=0 bunx jest src/screens/geofence-editor/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g7.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       203 passed, 203 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g7-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c13:
```text
grep -qE '^Tests: +203 passed, 203 total$' /tmp/159-g7.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g7-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R7 truthful editor guard copy'
[feature/159-mobile-no-collar-states-pingo 92d9a59b] feat(mobile-no-collar-states): #159 R7 truthful editor guard copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 3 insertions(+), 2 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `92d9a59b feat(mobile-no-collar-states): #159 R7 truthful editor guard copy`.

## Sonda S7

HEAD: `92d9a59b feat(mobile-no-collar-states): #159 R7 truthful editor guard copy`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s7.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 80 passed, 81 total
exit=1

  ● #159 R7: la guarda del editor sigue en texto y dice la verdad › el editor abre <Card testID="geofence-editor-no-tracking"> una sola vez y no usa EmptyState
$ git checkout HEAD -- src/screens/geofence-editor/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c14

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/159-r8-home.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       3 failed, 218 passed, 221 total
exit=1
```

```text
  ● R9: summary degrada con gracia › explains that activity tracking requires a collar

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      La actividad necesita un collar con plan activo
    Received:
      La actividad requiere un collar
```

```text
  ● #77 R1: el peso se pinta aunque la actividad no esté disponible › pinta un guion y la nota cuando el perfil tampoco resuelve

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      La actividad necesita un collar con plan activo
    Received:
      La actividad requiere un collar
```

```text
  ● #77 R2: sin actividad, la fila es la celda de peso seguida de la nota › sin collar: compone la celda y la nota en una sola fila

    expect(instance).toHaveTextContent()

    Expected instance to have text content:
      La actividad necesita un collar con plan activo
    Received:
      La actividad requiere un collar
```

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r8-es.txt 2>&1; echo "exit=$?"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 83 passed, 85 total
exit=1
```

```text
  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar declara el literal nuevo en inglés y en español

    expect(received).toBe(expected) // Object.is equality

    Expected: "Activity needs a collar with an active plan"
    Received: "Activity tracking requires a collar"
```

```text
  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar tiene fila de #159 en mobile-ui-language

    expect(received).toContain(expected) // indexOf

    Expected substring: "| — | `home.activityNeedsCollar` | `Activity needs a collar with an active plan` | `La actividad necesita un collar con plan activo` | ← cambiada por #159 (R8) |"
    Received string:    "### §2.23 — Añadidos por #159 — Pingo sin collar·
    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `map.noTrackingTitle` | `No live location` | `Sin ubicación en vivo` | ← añadida por #159 (R1) |
    | — | `map.noTrackingBody` | `Once your pet has a collar with an active plan, I'll show you where they are.` | `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingTitle` | `Safe zones unavailable` | `Zonas seguras no disponibles` | ← añadida por #159 (R1) |
    | — | `geofences.noTrackingBody` | `Once your pet has a collar with an active plan, I'll let you know if they leave a safe zone.` | `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.` | ← añadida por #159 (R1) |
    | — | `map.trackingNeedsCollar` ← retirada por #159 (R2) | `Live tracking requires a collar` | `El rastreo en vivo requiere un collar` |
    | — | `geofences.needsCollar` | `Safe zones need a collar with an active plan.` | `Las zonas seguras necesitan un collar con plan activo.` | ← cambiada por #159 (R7) |
    "
```

Cadena literal del handoff c14:
```text
grep -qE '^Tests: +3 failed, 218 passed, 221 total$' /tmp/159-r8-home.txt \
    && grep -qE '^Tests: +2 failed, 83 passed, 85 total$' /tmp/159-r8-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r8-home.txt)" = 3 \
    && test "$(grep -cE '^  ● ' /tmp/159-r8-es.txt)" = 2 \
    && ! grep -qF 'Unable to find' /tmp/159-r8-home.txt /tmp/159-r8-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r8-home.txt /tmp/159-r8-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/home/index.test.tsx ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R8 red truthful activity note'
[feature/159-mobile-no-collar-states-pingo c6430e68] test(mobile-no-collar-states): #159 R8 red truthful activity note
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 28 insertions(+), 3 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `c6430e68 test(mobile-no-collar-states): #159 R8 red truthful activity note`.

## c15

```text
$ FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g8.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       360 passed, 360 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g8-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c15:
```text
grep -qE '^Tests: +360 passed, 360 total$' /tmp/159-g8.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g8-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'feat(mobile-no-collar-states): #159 R8 truthful activity note copy'
[feature/159-mobile-no-collar-states-pingo 1e45b478] feat(mobile-no-collar-states): #159 R8 truthful activity note copy
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 3 insertions(+), 2 deletions(-)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy`.

## Sonda S8a

HEAD: `1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s8a.txt 2>&1; echo "exit=$?"
Tests:       2 failed, 83 passed, 85 total
exit=1

  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar declara el literal nuevo en inglés y en español
  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › home.activityNeedsCollar no exclama, no lleva emoji y no termina en punto en los dos idiomas
$ git checkout HEAD -- src/i18n/catalog.ts
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S8b

HEAD: `1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s8b.txt 2>&1; echo "exit=$?"
Tests:       1 failed, 84 passed, 85 total
exit=1

  ● #159 R8: la nota de Inicio sigue en texto y dice la verdad › Inicio abre <Text testID="summary-note"> una sola vez
$ git checkout HEAD -- src/screens/home/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## c16

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-g9.txt 2>&1; echo "exit=$?"
Test Suites: 1 passed, 1 total
Tests:       95 passed, 95 total
exit=0
```

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-g9-guardas.txt 2>&1; echo "exit=$?"
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
exit=0
```

Cadena literal del handoff c16:
```text
grep -qE '^Tests: +95 passed, 95 total$' /tmp/159-g9.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g9-guardas.txt \
    && git diff --quiet f9fb79ed -- package.json bun.lock src/components/empty-state.tsx assets/ \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
    && git commit -m 'test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens'
[feature/159-mobile-no-collar-states-pingo 1c54b04d] test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 18 insertions(+)
exit=0
$ tsc --noEmit
```

Typecheck exit=0; lint sin caché exit=0; router ausente; lista stageada exacta y LIMPIO correctos.

Commit: `1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens`.

T9 (3):
```text
$ cd /home/claude/sites/Pet-Tracker-wt-159 && pwd
/home/claude/sites/Pet-Tracker-wt-159
$ git diff --quiet f9fb79ed -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/components/empty-state.tsx mobile-pet-tracker/assets/; echo "sin-diff=$?"
sin-diff=0
```

## Sonda S9a

HEAD: `1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s9a.txt 2>&1; echo "exit=$?"
Tests:       5 failed, 90 passed, 95 total
exit=1

  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene react-native-reanimated
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene \bAnimated\b
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene LayoutAnimation
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene entering=
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/map/index.tsx no contiene MOTION_
$ git checkout HEAD -- src/screens/map/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Sonda S9b

HEAD: `1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens`.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-s9b.txt 2>&1; echo "exit=$?"
Tests:       5 failed, 90 passed, 95 total
exit=1

  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene react-native-reanimated
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene \bAnimated\b
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene LayoutAnimation
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene entering=
  ● #159 R9: los estados sin collar no traen movimiento ni dependencias › src/screens/geofences/index.tsx no contiene MOTION_
$ git checkout HEAD -- src/screens/geofences/index.tsx
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

Todas las caídas son por aserción; sin errores de ejecución.

## Cierre — BASE final

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-final.txt 2>&1; echo "exit=$?"
Test Suites: 10 passed, 10 total
Tests:       749 passed, 749 total
exit=0
```

Comando BASE original en H0 (mismo filtro de 10 ficheros):
```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-base.txt 2>&1; echo "exit=$?"
Test Suites: 10 passed, 10 total
Tests:       699 passed, 699 total
exit=0
```

Antes de ALL final: `pgrep -af '[i]nit\.sh'` vacío (exit=1 esperado).

## Cierre — ALL final

```text
$ FORCE_COLOR=0 bunx jest > /tmp/159-all.txt 2>&1; echo "exit=$?"
Test Suites: 97 passed, 97 total
Tests:       2415 passed, 2415 total
exit=0
```

ALL final = 2365 + 50 = 2415 tests; 97 suites.

```text
$ bun run typecheck; echo "exit=$?"
exit=0
$ tsc --noEmit
```

```text
$ bunx expo lint --no-cache; echo "exit=$?"
exit=0
```

```text
$ git diff --stat f9fb79ed -- package.json bun.lock app.json src/theme
```
Salida vacía; exit=0.

## Anclas de cierre

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159 && pwd
/home/claude/sites/Pet-Tracker-wt-159
```

A1:
```text
$ test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok
ok
```

A2:
```text
$ git merge-base --is-ancestor 65f37841 HEAD && echo ok
ok
```

A3:
```text
$ grep -cF '+ 5, // #155 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
0
```

A4:
```text
$ grep -cF "['geofences.needsCollar', 'Safe zones require a collar', 'Las zonas seguras requieren un collar']," mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
0
```

A5:
```text
$ grep -cF 'expect(R4_MAP).toHaveLength(17 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts
0
```

A6:
```text
$ grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1); // +1 #155 R8' mobile-pet-tracker/src/__tests__/ui-language.test.ts
0
```

A7:
```text
$ grep -cF "{ file: 'src/screens/map/index.tsx', key: 'map.trackingNeedsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
0
```

A8:
```text
$ grep -cF "{ file: 'src/screens/geofences/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
0
```

A9:
```text
$ grep -cF "{ file: 'src/screens/geofence-editor/index.tsx', key: 'geofences.needsCollar' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

A10:
```text
$ grep -cF "['src/screens/map/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
0
```

A11:
```text
$ grep -cF "['src/screens/geofences/index.tsx', 1]," mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
0
```

A12:
```text
$ grep -cF "t('map.trackingNeedsCollar')" mobile-pet-tracker/src/screens/map/index.tsx
0
```

A13:
```text
$ grep -cF '<Text testID="map-no-tracking" className="text-center text-muted">' mobile-pet-tracker/src/screens/map/index.tsx
0
```

A14:
```text
$ grep -cF '<Card testID="geofences-no-tracking" className="items-center py-8">' mobile-pet-tracker/src/screens/geofences/index.tsx
0
```

A15:
```text
$ grep -cF "const canSetLostMode = selectedPet?.myRole === 'owner';" mobile-pet-tracker/src/screens/map/index.tsx
1
```

A16:
```text
$ grep -cF "'El rastreo en vivo requiere un collar'," mobile-pet-tracker/src/screens/map/index.test.tsx
0
```

A17:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
0
```

A18:
```text
$ grep -cF "it('pinta el 402 sin Reintentar'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

A19:
```text
$ grep -cF 'Las zonas seguras requieren un collar' mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
0
```

A20:
```text
$ grep -cF "'La actividad requiere un collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
0
```

A21:
```text
$ grep -cF 'const mockRouter = jest.mocked(router);' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

A22:
```text
$ grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' specs/mobile-ui-language/design.md
1
```

A23:
```text
$ grep -cF '### §2.23' specs/mobile-ui-language/design.md
1
```

A24:
```text
$ grep -cF '## 3. La infraestructura' specs/mobile-ui-language/design.md
1
```

A25:
```text
$ grep -cF 'el tab Map muestra `Live tracking requires a collar`' docs/verification.md
0
```

A26:
```text
$ grep -cF 'map.trackingNeedsCollar' mobile-pet-tracker/src/i18n/catalog.ts
0
```

A27:
```text
$ grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" mobile-pet-tracker/src/i18n/catalog.ts
8
```

A28:
```text
$ grep -cE "react-native-reanimated|\bAnimated\b|LayoutAnimation|entering=|MOTION_" mobile-pet-tracker/src/screens/map/index.tsx mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/map/index.tsx:0
mobile-pet-tracker/src/screens/geofences/index.tsx:0
```

H1:
```text
$ grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H2:
```text
$ grep -cF -- '- [ ] Prueba de humo R10 superada en dev build de Android (fecha: ____)' specs/mobile-no-collar-states-pingo/requirements.md
1
```

H3:
```text
$ grep -cF '"status": "in_progress"' feature_list.json
1
```

H4:
```text
$ grep -rlF '#159' mobile-pet-tracker/src | wc -l
6
```

H5:
```text
$ grep -cF "describe('#159" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
5
```

H6:
```text
$ grep -cF 'function makeDevice(connectivity: string | null): DeviceStatus {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H7:
```text
$ grep -cF 'function pending<T>(): Promise<T> {' mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H8:
```text
$ grep -cF "function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H9:
```text
$ grep -cF "function mount(language: Language = 'es', onUnauthorized?: () => void, seedRole = false) {" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H10:
```text
$ grep -cF "const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';" mobile-pet-tracker/src/screens/geofences/index.tsx
1
```

H11:
```text
$ grep -cF 'testID="summary-note"' mobile-pet-tracker/src/screens/home/index.tsx
1
```

H12:
```text
$ grep -cF 'testID={`${testID}-action`}' mobile-pet-tracker/src/components/empty-state.tsx
1
```

H13:
```text
$ grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/map/index.tsx
1
```

H14:
```text
$ grep -cF "router.push('/pairing')" mobile-pet-tracker/src/screens/map/index.tsx
1
```

H15:
```text
$ grep -cF 'function languageDesign(): string {' mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
1
```

H16:
```text
$ grep -cF "describe('R5: mascota free degrada sin mapa'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H17:
```text
$ grep -cF "it('shows the collar requirement without map, stats, lost mode, or polling'" mobile-pet-tracker/src/screens/map/index.test.tsx
1
```

H18:
```text
$ grep -cF "describe('#41 R5: la pantalla pinta la lista de zonas y sus estados'" mobile-pet-tracker/src/screens/geofences/index.test.tsx
1
```

H19:
```text
$ grep -cF "describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H20:
```text
$ grep -cF "describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
1
```

H21:
```text
$ grep -cF "it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma'" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

H22:
```text
$ grep -cF "it('explains that activity tracking requires a collar'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H23:
```text
$ grep -cF "it('pinta un guion y la nota cuando el perfil tampoco resuelve'" mobile-pet-tracker/src/screens/home/index.test.tsx
1
```

H24:
```text
$ grep -cE '<Card\s+testID="geofence-editor-no-tracking"' mobile-pet-tracker/src/screens/geofence-editor/index.tsx
1
```

H25:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/map/index.test.tsx
2
```

H26:
```text
$ grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/geofences/index.test.tsx
2
```

P1:
```text
$ grep -cF '<EmptyState' mobile-pet-tracker/src/screens/map/index.tsx
2
```

P2:
```text
$ grep -cF '<EmptyState' mobile-pet-tracker/src/screens/geofences/index.tsx
2
```

P3:
```text
$ grep -cF 'const canPairCollar =' mobile-pet-tracker/src/screens/map/index.tsx
1
```

P4:
```text
$ grep -cF 'detail.data.pet.device === null;' mobile-pet-tracker/src/screens/map/index.tsx
1
```

P5:
```text
$ grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/geofences/index.tsx
0
```

P6:
```text
$ grep -cF '+ 4 // #159 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

P7:
```text
$ grep -cF -- '- 1, // #159 R2' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
1
```

P8:
```text
$ grep -cF 'expect(R4_MAP).toHaveLength(17 + 2 + 1 + 1); // +2 #155 R4, +1 #159 R2, +1 #159 R3' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

P9:
```text
$ grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1 + 1); // +1 #155 R8, +1 #159 R5' mobile-pet-tracker/src/__tests__/ui-language.test.ts
1
```

P10:
```text
$ grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' specs/mobile-ui-language/design.md
1
```

P11:
```text
$ grep -cF 'el tab Map muestra a Pingo con `No live location`' docs/verification.md
1
```

P12:
```text
$ grep -cF "{ file: 'src/screens/map/index.tsx', key: 'home.pairCollar' }, // #159 R3" mobile-pet-tracker/src/__tests__/ui-copy-table.ts
1
```

## Cierre — diffs y alcance

```text
$ git diff --stat f9fb79ed -- backend-pet-tracker/ infra-pet-tracker/
```
exit=0. Salida vacía.

```text
$ git diff --name-only f9fb79ed HEAD -- docs/
docs/verification.md
```
exit=0.

```text
$ git diff --name-only f9fb79ed HEAD -- mobile-pet-tracker/ | LC_ALL=C sort
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
```
exit=0.

## Historial T1–T9 (16 commits, orden exacto)

```text
6906af80 test(mobile-no-collar-states): #159 R1 red no-collar copy
b77f23ff feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table
56918113 test(mobile-no-collar-states): #159 R2 red map no-tracking empty state
00755951 feat(mobile-no-collar-states): #159 R2 map no-tracking empty state
f346baf3 test(mobile-no-collar-states): #159 R3 red pair collar action
9b89f6c8 feat(mobile-no-collar-states): #159 R3 pair collar action on map
9506bd88 test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar
f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail
14e76905 test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state
176d9d45 feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state
cc53c018 test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones
c3312097 test(mobile-no-collar-states): #159 R7 red truthful editor guard
92d9a59b feat(mobile-no-collar-states): #159 R7 truthful editor guard copy
c6430e68 test(mobile-no-collar-states): #159 R8 red truthful activity note
1e45b478 feat(mobile-no-collar-states): #159 R8 truthful activity note copy
1c54b04d test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens
```

No hay decisiones de producto adicionales: se aplicaron las decisiones y los literales cerrados de la spec. No se ejecutó init.sh, ni se tocó Postgres o LocalStack; el gate de init.sh corresponde al leader. No se hizo push ni se abrió PR, según el guion.

## R10 — pasos listos para el humano

Desde `mobile-pet-tracker/`, ejecutar `bunx expo start --dev-client` y abrir un dev build de Android (nunca Expo Go). Entrar con cuenta de dueño y crear una mascota desde la app, que nace sin collar.

1. Seleccionar esa mascota y abrir Mapa: comprobar Pingo con el collar, `Sin ubicación en vivo`, `Cuando tu mascota tenga un collar con plan activo, te muestro dónde está.` y el botón `Vincular collar`.
2. Pulsar `Vincular collar`: comprobar que abre la pantalla de emparejar.
3. Abrir Perfil → Zonas seguras: comprobar Pingo con el collar, `Zonas seguras no disponibles` y `Cuando tu mascota tenga un collar con plan activo, te aviso si sale de una zona segura.`, sin botón.
4. Abrir Inicio: comprobar la nota `La actividad necesita un collar con plan activo` en la tarjeta de resumen.
5. Activar reduce motion en Ajustes de Android y repetir 1 y 3: deben verse igual y nada debe moverse.

El humano firma con fecha su casilla de R10 en requirements.md. La feature sigue in_progress hasta ese smoke.

R10: pendiente del smoke humano

## Lista cerrada (tras c17)

Commit c17: `434f4b9c docs(mobile-no-collar-states-pingo): #159 traceability`.

```text
$ git diff --name-only f9fb79ed HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-no-collar-states-pingo.md' ':!specs/mobile-no-collar-states-pingo/requirements.md' ':!specs/mobile-no-collar-states-pingo/design.md' ':!specs/mobile-no-collar-states-pingo/tasks.md' ':!progress/review_mobile-no-collar-states-pingo.md'
docs/verification.md
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.test.tsx
mobile-pet-tracker/src/screens/geofences/index.tsx
mobile-pet-tracker/src/screens/home/index.test.tsx
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
progress/impl_mobile-no-collar-states-pingo.md
specs/mobile-no-collar-states-pingo/traceability.md
specs/mobile-ui-language/design.md
```

Lista exacta: 15 ficheros, sin ficheros ajenos. Todos los Received de más de 20 líneas están recortados a sus primeras 20; se conserva el matcher y el Expected.

R10: pendiente del smoke humano

# Ronda 2 — Enmienda E1

## Base E1

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-159
$ git branch --show-current
feature/159-mobile-no-collar-states-pingo
$ git rev-parse --short HEAD
c8064d03
$ git status --short
```

H0E1: `c8064d03`; status vacío. Enmienda E1 firmada en `f3ca7b8e`. Ninguna skill cargada.

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
```

```text
$ git fetch origin; echo "exit=$?"
exit=0
```

```text
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
```

```text
$ git merge-base --is-ancestor 664b95a7 HEAD; echo "exit=$?"
exit=0
```

```text
$ git diff --quiet 664b95a7 HEAD -- .; echo "exit=$?"
exit=0
```

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

```text
$ test -d node_modules && echo presente
presente
```

## Anclas E1 en H0E1

A1 (esperado H0E1: 0; cierre: 1):
```text
$ grep -cF "it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'" src/screens/map/index.test.tsx
0
```

A2 (esperado H0E1: 0; cierre: 1):
```text
$ grep -cF "it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle'" src/screens/map/index.test.tsx
0
```

A3 (esperado H0E1: 0; cierre: 1):
```text
$ grep -cF "('no pinta el botón a %s aunque el listado diga owner'" src/screens/map/index.test.tsx
0
```

A4 (esperado H0E1: 0; cierre: 3):
```text
$ grep -cF 'aunque el listado' src/screens/map/index.test.tsx
0
```

A5 (esperado H0E1: 1; cierre: 3):
```text
$ grep -cF "within(action).getByText('Vincular collar')" src/screens/map/index.test.tsx
1
```

A6 (esperado H0E1: 1; cierre: 1):
```text
$ grep -cF "it('lleva a emparejar una sola vez'" src/screens/map/index.test.tsx
1
```

A7 (esperado H0E1: 1; cierre: 1):
```text
$ grep -cF "it('no pinta el botón mientras el detalle carga'" src/screens/map/index.test.tsx
1
```

A8 (esperado H0E1: 1; cierre: 1):
```text
$ grep -cF "it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s', async (role)" src/screens/map/index.test.tsx
1
```

A9 (esperado H0E1: 1; cierre: 1):
```text
$ grep -cF 'function noTrackingAfterDetail(detailState: PetState)' src/screens/map/index.test.tsx
1
```

A10 (esperado H0E1: 1; cierre: 1):
```text
$ grep -cF "selectedPet?.myRole === 'owner'" src/screens/map/index.tsx
1
```

A11 (esperado H0E1: 0; cierre: 0):
```text
$ grep -cF 'selectedPet?.device' src/screens/map/index.tsx
0
```

A12 (esperado H0E1: 1; cierre: 1):
```text
$ grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
1
```

A13 (esperado H0E1: 1; cierre: 1):
```text
$ grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx
1
```

A14 (esperado H0E1: exit=0; cierre: exit=0):
```text
$ git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
exit=0
```

## Base del Mapa E1 — PARADA

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-base.txt 2>&1; echo "exit=$?"
exit=1
Test Suites: 1 failed, 1 total
Tests:       1 failed, 108 passed, 109 total
```

Esperado: `exit=0` y `Tests:       109 passed, 109 total`.
Medido: `exit=1` y `Tests:       1 failed, 108 passed, 109 total`.
Salida completa: `/tmp/159-e1-base.txt`.

Fallo del test existente, antes de cualquier edición de tests o producción:

```text
  ● R4: map resuelve la mascota seleccionada › selects the first pet and loads its first position (#72 R2)

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "http://example.test/v1", "jwt-token", "pet-1"

    Number of calls: 0

      310 |     await renderMap();
      311 |
    > 312 |     await waitFor(() => {
          |                  ^
      313 |       expect(mockGetLastPosition).toHaveBeenCalledWith(
      314 |         apiUrl,
      315 |         'jwt-token',

      at Object.<anonymous> (src/screens/map/index.test.tsx:312:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

PARADA conforme a `== BASE ==` del handoff E1: la base no dio exactamente
109 tests pasados. No se recalculan las cuentas ni se reintenta. No se
escribieron los tests E1 ni se plantó la mutación versionada. Ninguna
cadena de commit ni sonda se ejecutó; no se creó ningún commit E1.
Ninguna skill cargada; no se lanzó `init.sh`, no hubo push ni PR.

```text
$ git rev-parse --short HEAD
c8064d03
```

```text
$ git diff --name-only
progress/impl_mobile-no-collar-states-pingo.md
```

```text
$ git status --short
 M progress/impl_mobile-no-collar-states-pingo.md
```

R10: pendiente del smoke humano

## Reanudación

Reanudación autorizada por el humano sin commit previo. H0E1 sigue siendo `c8064d03`. La sección «Base del Mapa E1 — PARADA» se conserva íntegra. El leader midió dos bases verdes (109 passed) y atribuye el fallo al flake por carga de #72 R2, fuera de alcance. No se modifica ese test. Antes de cada Jest se registra `uptime`. Solo se permite una repetición cuando la única desviación sea ese it con `Number of calls: 0`; una segunda desviación o cualquier otro fallo inesperado exige parar. Anclas iniciales ya medidas, no se repiten.

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
(en ejecución)
```

```text
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
```
Exit de la invocación: 0.

### Medida: 159-e1-base.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 21:52:03 up 16 days, 17:59,  4 users,  load average: 4.74, 6.02, 4.21
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-base.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1-base.txt
Test Suites: 1 passed, 1 total
Tests:       109 passed, 109 total
```

Medida exacta conforme al handoff.

### e1-1 — Preparación del rojo

Se añadieron los dos `it` literales al final del describe R3 y el `it.each` de los tres roles al final del describe R4. Ningún test existente, helper o import cambia. Mutación versionada limitada a las dos cláusulas de rol y collar de `canPairCollar`; la guarda `kind === ok` conserva su texto.

### Medida: 159-e1-r.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 21:52:40 up 16 days, 18:00,  4 users,  load average: 3.12, 5.49, 4.10
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-r.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=1
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1-r.txt
Test Suites: 1 failed, 1 total
Tests:       6 failed, 108 passed, 114 total
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle

    Unable to find an element with testID: map-no-tracking-action
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle

    Unable to find an element with testID: map-no-tracking-action
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón al dueño de una mascota con collar

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

Medida exacta conforme al handoff.

```text
$ grep -qE '^Tests: +6 failed, 108 passed, 114 total$' /tmp/159-e1-r.txt \
  && test "$(grep -cE '^  ● ' /tmp/159-e1-r.txt)" = 6 \
  && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'aunque el listado')" = 5 \
  && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'no pinta el botón al dueño de una mascota con collar')" = 1 \
  && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e1-r.txt)" = 2 \
  && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e1-r.txt)" = 4 \
  && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-e1-r.txt \
  && test "$(grep -cF "selectedPet?.myRole === 'owner'" src/screens/map/index.tsx)" = 2 \
  && test "$(grep -cF 'selectedPet?.device === null;' src/screens/map/index.tsx)" = 1 \
  && test "$(grep -cF 'detail.data.pet.myRole' src/screens/map/index.tsx)" = 0 \
  && test "$(grep -cF 'detail.data.pet.device' src/screens/map/index.tsx)" = 0 \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
  && git add src/screens/map/index.test.tsx src/screens/map/index.tsx \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/map/index.test.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list'

(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 1.

PARADA: Falló `grep -qE '^Tests: +6 failed, 108 passed, 114 total$' /tmp/159-e1-r.txt \
  && test "$(grep -cE '^  ● ' /tmp/159-e1-r.txt)" = 6 \
  && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'aunque el listado')" = 5 \
  && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'no pinta el botón al dueño de una mascota con collar')" = 1 \
  && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e1-r.txt)" = 2 \
  && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e1-r.txt)" = 4 \
  && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-e1-r.txt \
  && test "$(grep -cF "selectedPet?.myRole === 'owner'" src/screens/map/index.tsx)" = 2 \
  && test "$(grep -cF 'selectedPet?.device === null;' src/screens/map/index.tsx)" = 1 \
  && test "$(grep -cF 'detail.data.pet.myRole' src/screens/map/index.tsx)" = 0 \
  && test "$(grep -cF 'detail.data.pet.device' src/screens/map/index.tsx)" = 0 \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
  && git add src/screens/map/index.test.tsx src/screens/map/index.tsx \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/map/index.test.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list'
` (exit=1); salida registrada arriba.

R10: pendiente del smoke humano

### Diagnóstico del eslabón fallido de e1-1

El rojo coincidió exactamente: `exit=1`, `6 failed, 108 passed, 114 total`,
los seis títulos prescritos, dos consultas y cuatro matchers `toBeNull`.
No hubo desviación por #72 R2 y no se aplicó ninguna repetición.

La cadena literal terminó con exit=1 en este eslabón:

```text
$ test "$(grep -cF 'detail.data.pet.device' src/screens/map/index.tsx)" = 0
exit=1
$ grep -cF 'detail.data.pet.device' src/screens/map/index.tsx
2
```

Esperado por la cadena: 0. Medido: 2. Son referencias preexistentes fuera de
`canPairCollar`, conservadas sin cambios; no se modifica el guion ni esas
referencias para sortear el gate:

```text
$ rg -nF 'detail.data.pet.device' src/screens/map/index.tsx
235:      ? deviceConnectionState(detail.data.pet.device)
244:    ? detail.data.pet.device?.batteryPct ?? null
```

Los eslabones anteriores coinciden: grep del resumen exit=0; títulos 6;
«aunque el listado» 5; dueño con collar 1; consultas 2; matchers 4;
ningún error de ejecución prohibido; rol de selectedPet 2; collar de
selectedPet 1; rol de detail 0. La guarda del fichero router ausente da 0.

Typecheck, lint, git add y git commit NO llegaron a ejecutarse en la cadena.
No se creó e1-1, ni se inició e1-2, ni ninguna sonda ni el cierre.
Se dejan los cinco tests añadidos y la mutación roja sin commit; no se
restaura producción como un verde sin el rojo previo. HEAD sigue en H0E1.

```text
$ git diff --cached --name-only
(vacío)
$ git status --short
 M src/screens/map/index.test.tsx
 M src/screens/map/index.tsx
 M ../progress/impl_mobile-no-collar-states-pingo.md
$ git rev-parse --short HEAD
c8064d03
```

Ninguna skill cargada; no se lanzó init.sh, no hubo push, PR, merge ni rebase.
La sección de la parada previa y todo el contenido anterior a la reanudación
se conservan byte a byte.

R10: pendiente del smoke humano

## Reanudación 2

Reanudación autorizada por el humano sobre H0E1 `c8064d03`, sin commit previo.
Se conservan íntegros los tests y la mutación roja del árbol actual. No se
editan las referencias de conexión y batería ni el test #72 R2.

El humano confirma que el error estaba en el handoff y autoriza este único
cambio de eslabón en la cadena e1-1:

```text
  && test "$(grep -cF 'detail.data.pet.device === null' src/screens/map/index.tsx)" = 0 \
```

El leader midió esa cuenta en el árbol mutado (0), typecheck y lint (exit=0).
Se repetirá la medida roja y la cadena entera con ese único eslabón cambiado.
Sigue vigente la repetición única autorizada únicamente por el flake de
#72 R2 con `Number of calls: 0`. Antes de cada Jest se registra `uptime`.
Cualquier otra desviación exige parar. Ninguna skill cargada.

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-159
$ git branch --show-current
feature/159-mobile-no-collar-states-pingo
$ git rev-parse --short HEAD
c8064d03
$ git status --short
 M mobile-pet-tracker/src/screens/map/index.test.tsx
 M mobile-pet-tracker/src/screens/map/index.tsx
 M progress/impl_mobile-no-collar-states-pingo.md
```

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
(en ejecución)
```

```text
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
```
Exit de la invocación: 0.

### Medida: 159-e1-r.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 21:57:04 up 16 days, 18:04,  4 users,  load average: 4.46, 4.68, 4.08
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-r.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=1
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1-r.txt
Test Suites: 1 failed, 1 total
Tests:       6 failed, 108 passed, 114 total
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle

    Unable to find an element with testID: map-no-tracking-action
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle

    Unable to find an element with testID: map-no-tracking-action
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón al dueño de una mascota con collar

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

Medida exacta conforme al handoff.

```text
$ grep -qE '^Tests: +6 failed, 108 passed, 114 total$' /tmp/159-e1-r.txt \
  && test "$(grep -cE '^  ● ' /tmp/159-e1-r.txt)" = 6 \
  && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'aunque el listado')" = 5 \
  && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'no pinta el botón al dueño de una mascota con collar')" = 1 \
  && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e1-r.txt)" = 2 \
  && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e1-r.txt)" = 4 \
  && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-e1-r.txt \
  && test "$(grep -cF "selectedPet?.myRole === 'owner'" src/screens/map/index.tsx)" = 2 \
  && test "$(grep -cF 'selectedPet?.device === null;' src/screens/map/index.tsx)" = 1 \
  && test "$(grep -cF 'detail.data.pet.myRole' src/screens/map/index.tsx)" = 0 \
  && test "$(grep -cF 'detail.data.pet.device === null' src/screens/map/index.tsx)" = 0 \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
  && git add src/screens/map/index.test.tsx src/screens/map/index.tsx \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/map/index.test.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list'

(en ejecución)
```

```text
$ tsc --noEmit
[feature/159-mobile-no-collar-states-pingo 3224d502] test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 29 insertions(+), 2 deletions(-)
```
Exit de la invocación: 0.

Commit red: `3224d502`. Typecheck y lint: exit=0 (la cadena alcanzó el commit).

```text
$ git checkout 664b95a7 -- src/screens/map/index.tsx && git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

### Medida: 159-e1-g.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 21:58:38 up 16 days, 18:06,  4 users,  load average: 5.51, 5.17, 4.32
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-g.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1-g.txt
Test Suites: 1 passed, 1 total
Tests:       114 passed, 114 total
```

Medida exacta conforme al handoff.

### Medida: 159-e1-g-guardas.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 21:58:49 up 16 days, 18:06,  4 users,  load average: 4.96, 5.07, 4.30
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-e1-g-guardas.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1-g-guardas.txt
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Medida exacta conforme al handoff.

```text
$ grep -qE '^Tests: +114 passed, 114 total$' /tmp/159-e1-g.txt \
  && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-e1-g-guardas.txt \
  && git diff --quiet 664b95a7 -- src/screens/map/index.tsx \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
  && git add src/screens/map/index.tsx \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail' \
  && git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"

(en ejecución)
```

```text
$ tsc --noEmit
[feature/159-mobile-no-collar-states-pingo 203ea96e] fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 2 insertions(+), 2 deletions(-)
exit=0
```
Exit de la invocación: 0.

Commit green: `203ea96e`. Typecheck y lint: exit=0 (la cadena alcanzó el commit).

### Sonda E1a — Sin commit

```text
$ grep -cF "selectedPet?.myRole === 'owner' &&" src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

### Medida: 159-e1a.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 21:59:53 up 16 days, 18:07,  4 users,  load average: 4.56, 4.97, 4.32
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1a.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=1
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1a.txt
Test Suites: 1 failed, 1 total
Tests:       4 failed, 110 passed, 114 total
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle

    Unable to find an element with testID: map-no-tracking-action
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

Medida exacta conforme al handoff.

```text
$ git checkout HEAD -- src/screens/map/index.tsx
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 0.

```text
$ git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
(en ejecución)
```

```text
limpio=0
```
Exit de la invocación: 0.

Sonda E1a exacta y revertida, sin commit.

### Sonda E1b — Sin commit

```text
$ grep -cF "(selectedPet?.myRole === 'owner' || detail.data.pet.myRole === 'owner') &&" src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

### Medida: 159-e1b.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 22:00:15 up 16 days, 18:07,  4 users,  load average: 5.00, 5.05, 4.36
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1b.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=1
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1b.txt
Test Suites: 1 failed, 1 total
Tests:       3 failed, 111 passed, 114 total
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a family aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a walker aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón a vet aunque el listado diga owner

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

Medida exacta conforme al handoff.

```text
$ git checkout HEAD -- src/screens/map/index.tsx
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 0.

```text
$ git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
(en ejecución)
```

```text
limpio=0
```
Exit de la invocación: 0.

Sonda E1b exacta y revertida, sin commit.

### Sonda E1c — Sin commit

```text
$ grep -cF "selectedPet?.myRole === 'owner' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

### Medida: 159-e1c.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 22:00:28 up 16 days, 18:07,  4 users,  load average: 5.24, 5.10, 4.38
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1c.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=1
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1c.txt
Test Suites: 1 failed, 1 total
Tests:       1 failed, 113 passed, 114 total
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle

    Unable to find an element with testID: map-no-tracking-action
```

Medida exacta conforme al handoff.

```text
$ git checkout HEAD -- src/screens/map/index.tsx
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 0.

```text
$ git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
(en ejecución)
```

```text
limpio=0
```
Exit de la invocación: 0.

Sonda E1c exacta y revertida, sin commit.

### Sonda E1d — Sin commit

```text
$ grep -cF 'selectedPet?.device === null;' src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

### Medida: 159-e1d.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 22:00:42 up 16 days, 18:08,  4 users,  load average: 4.97, 5.04, 4.37
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1d.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=1
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1d.txt
Test Suites: 1 failed, 1 total
Tests:       2 failed, 112 passed, 114 total
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle

    Unable to find an element with testID: map-no-tracking-action
```

```text
  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón al dueño de una mascota con collar

    expect(received).toBeNull()

    Expected: null (matcher toBeNull)
    Received: <View accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": false, "expanded": undefined, "selected": undefined}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="pressable-feedback__root button__root button__root--variant-primary button__root--size-md rounded-xl bg-accent" collapsable={false} focusable={true} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"transform": [{"scale": 1}]}}} jestInlineStyle={[{"borderCurve": "continuous"}, [{"borderCurve": "continuous"}, undefined]]} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onLayout={[Function anonymous]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} style={[{"borderCurve": "continuous"}, {"transform": [{"scale": 1}]}, {"borderCurve": "continuous"}, undefined]} testID="map-no-tracking-action"><View className="pressable-feedback__highlight" collapsable={false} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {"backgroundColor": "invalid", "opacity": 0}}} jestInlineStyle={[undefined]} pointerEvents="none" style={[{"backgroundColor": "invalid", "opacity": 0}, undefined]} /><Text className="button__label button__label--variant-primary button__label--size-md font-bold text-accent-foreground">Vincular collar</Text></View>
```

Medida exacta conforme al handoff.

```text
$ git checkout HEAD -- src/screens/map/index.tsx
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 0.

```text
$ git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
(en ejecución)
```

```text
limpio=0
```
Exit de la invocación: 0.

Sonda E1d exacta y revertida, sin commit.

### Sonda E1e — Sin commit

```text
$ grep -cF 'selectedPet?.device === null && detail.data.pet.device === null;' src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

### Medida: 159-e1e.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 22:00:57 up 16 days, 18:08,  4 users,  load average: 4.84, 5.01, 4.37
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1e.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=1
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1e.txt
Test Suites: 1 failed, 1 total
Tests:       1 failed, 113 passed, 114 total
```

```text
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle

    Unable to find an element with testID: map-no-tracking-action
```

Medida exacta conforme al handoff.

```text
$ git checkout HEAD -- src/screens/map/index.tsx
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 0.

```text
$ git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
(en ejecución)
```

```text
limpio=0
```
Exit de la invocación: 0.

Sonda E1e exacta y revertida, sin commit.

### Cierre E1 — BASE

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
(en ejecución)
```

```text
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
```
Exit de la invocación: 0.

```text
$ pgrep -af '[i]nit\.sh'
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 1.

### Medida: 159-e1-final.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 22:01:19 up 16 days, 18:08,  4 users,  load average: 5.65, 5.17, 4.44
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-e1-final.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1-final.txt
Test Suites: 10 passed, 10 total
Tests:       754 passed, 754 total
```

```text
  ● Console

console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      Uniwind - We couldn't find your variable --theme. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:33:17)
          at Array.forEach (<anonymous>)
      at forEach (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:31:15)
      at getCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:46)
      at mountStateImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:5941:24)
      at mountState (node_modules/react-reconciler/cjs/react-reconciler.development.js:5962:22)
      at Object.useState (node_modules/react-reconciler/cjs/react-reconciler.development.js:17940:18)
      at Object.<anonymous>.process.env.NODE_ENV.exports.useState (node_modules/react/cjs/react.development.js:1263:34)
      at useCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:39)
      at useLibraryTheme (node_modules/heroui-native/src/helpers/internal/hooks/use-library-theme.ts:22:33)
      at useHasDefaultThemeBackground (node_modules/heroui-native/src/components/theme-background/theme-background.tsx:33:32)
      at HeroUINative.Button.Root (node_modules/heroui-native/src/components/button/button.tsx:84:65)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateForwardRef (node_modules/react-reconciler/cjs/react-reconciler.development.js:7278:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9602:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      The current testing environment is not configured to support act(...)

      165 |         refetchPets();
      166 |       } else {
    > 167 |         setLostModeFailed(true);
          |         ^
      168 |       }
      169 |     } finally {
      170 |       setLostModeBusy(false);

      at isConcurrentActEnvironment (node_modules/react-reconciler/cjs/react-reconciler.development.js:13990:17)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16304:7)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at dispatchSetStateInternal (node_modules/react-reconciler/cjs/react-reconciler.development.js:6784:13)
      at dispatchSetState (node_modules/react-reconciler/cjs/react-reconciler.development.js:6741:7)
      at setLostModeFailed (src/screens/map/index.tsx:167:9)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

    console.error
      The current testing environment is not configured to support act(...)

      168 |       }
      169 |     } finally {
    > 170 |       setLostModeBusy(false);
          |       ^
      171 |     }
      172 |   }, [baseUrl, lostModeBusy, refetchPets, selectedPet, token]);
      173 |

      at isConcurrentActEnvironment (node_modules/react-reconciler/cjs/react-reconciler.development.js:13990:17)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16304:7)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at dispatchSetStateInternal (node_modules/react-reconciler/cjs/react-reconciler.development.js:6784:13)
      at dispatchSetState (node_modules/react-reconciler/cjs/react-reconciler.development.js:6741:7)
      at setLostModeBusy (src/screens/map/index.tsx:170:7)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to MapScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to MapScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to MapScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      The current testing environment is not configured to support act(...)

      168 |       }
      169 |     } finally {
    > 170 |       setLostModeBusy(false);
          |       ^
      171 |     }
      172 |   }, [baseUrl, lostModeBusy, refetchPets, selectedPet, token]);
      173 |

      at isConcurrentActEnvironment (node_modules/react-reconciler/cjs/react-reconciler.development.js:13990:17)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16304:7)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at dispatchSetStateInternal (node_modules/react-reconciler/cjs/react-reconciler.development.js:6784:13)
      at dispatchSetState (node_modules/react-reconciler/cjs/react-reconciler.development.js:6741:7)
      at setLostModeBusy (src/screens/map/index.tsx:170:7)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

    console.error
      The current testing environment is not configured to support act(...)

      at isConcurrentActEnvironment (node_modules/react-reconciler/cjs/react-reconciler.development.js:13990:17)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16304:7)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

PASS src/screens/geofence-editor/index.test.tsx (20.378 s)
```

```text
  ● Console

console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to GeofenceEditorScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      Uniwind - We couldn't find your variable --color-foreground. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      16 |   const { theme } = useUniwind();
      17 |   const foreground =
    > 18 |     asColor(Uniwind.getCSSVariable('--color-foreground')) ??
         |                     ^
      19 |     (theme === 'dark' ? '#F7F8FA' : '#0D1117');
      20 |
      21 |   return tokens.map(

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:39:9)
      at UniwindConfigBuilder.getCSSVariable (node_modules/uniwind/src/core/config/config.common.ts:122:30)
      at getCSSVariable (src/theme/use-theme-colors.ts:18:21)
      at PetMap (src/components/pet-map.tsx:22:53)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateFunctionComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:7720:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9277:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

PASS src/providers/__tests__/language-provider.test.tsx
PASS src/components/__tests__/empty-state.test.tsx
```

```text
  ● Console

console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      Uniwind - We couldn't find your variable --theme. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:33:17)
          at Array.forEach (<anonymous>)
      at forEach (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:31:15)
      at getCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:46)
      at mountStateImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:5941:24)
      at mountState (node_modules/react-reconciler/cjs/react-reconciler.development.js:5962:22)
      at Object.useState (node_modules/react-reconciler/cjs/react-reconciler.development.js:17940:18)
      at Object.<anonymous>.process.env.NODE_ENV.exports.useState (node_modules/react/cjs/react.development.js:1263:34)
      at useCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:39)
      at useLibraryTheme (node_modules/heroui-native/src/helpers/internal/hooks/use-library-theme.ts:22:33)
      at useHasDefaultThemeBackground (node_modules/heroui-native/src/components/theme-background/theme-background.tsx:33:32)
      at HeroUINative.Button.Root (node_modules/heroui-native/src/components/button/button.tsx:84:65)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateForwardRef (node_modules/react-reconciler/cjs/react-reconciler.development.js:7278:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9602:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

PASS src/screens/geofences/index.test.tsx (7.88 s)
```

```text
  ● Console

console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to GeofencesScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      Uniwind - We couldn't find your variable --theme. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:33:17)
          at Array.forEach (<anonymous>)
      at forEach (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:31:15)
      at getCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:46)
      at mountStateImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:5941:24)
      at mountState (node_modules/react-reconciler/cjs/react-reconciler.development.js:5962:22)
      at Object.useState (node_modules/react-reconciler/cjs/react-reconciler.development.js:17940:18)
      at Object.<anonymous>.process.env.NODE_ENV.exports.useState (node_modules/react/cjs/react.development.js:1263:34)
      at useCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:39)
      at useLibraryTheme (node_modules/heroui-native/src/helpers/internal/hooks/use-library-theme.ts:22:33)
      at useHasDefaultThemeBackground (node_modules/heroui-native/src/components/theme-background/theme-background.tsx:33:32)
      at HeroUINative.Switch.Root (node_modules/heroui-native/src/components/switch/switch.tsx:86:67)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateForwardRef (node_modules/react-reconciler/cjs/react-reconciler.development.js:7278:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9602:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/home/index.test.tsx (90.479 s)
```

```text
  ● Console

console.warn
      Uniwind - We couldn't find your variable --color-foreground. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      16 |   const { theme } = useUniwind();
      17 |   const foreground =
    > 18 |     asColor(Uniwind.getCSSVariable('--color-foreground')) ??
         |                     ^
      19 |     (theme === 'dark' ? '#F7F8FA' : '#0D1117');
      20 |
      21 |   return tokens.map(

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:39:9)
      at UniwindConfigBuilder.getCSSVariable (node_modules/uniwind/src/core/config/config.common.ts:122:30)
      at getCSSVariable (src/theme/use-theme-colors.ts:18:21)
      at HomeScreen (src/screens/home/index.tsx:189:19)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateFunctionComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:7720:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9277:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      Encountered two children with the same key, `2026-08-21`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4179:23
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnOnInvalidKey (node_modules/react-reconciler/cjs/react-reconciler.development.js:4178:13)
      at reconcileChildrenArray (node_modules/react-reconciler/cjs/react-reconciler.development.js:4247:31)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4568:30)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.error
      An update to SelectedPetProvider inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      29 |   }
      30 |   const selectedPetId = selection.token === token ? selection.petId : null;
    > 31 |   const selectPet = useCallback((id: string) => setSelection({ token, petId: id }), [token]);
         |                                                 ^
      32 |   const value = useMemo(
      33 |     () => ({ selectedPetId, selectPet }),
      34 |     [selectPet, selectedPetId],

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at dispatchSetStateInternal (node_modules/react-reconciler/cjs/react-reconciler.development.js:6784:13)
      at dispatchSetState (node_modules/react-reconciler/cjs/react-reconciler.development.js:6741:7)
      at setSelection (src/providers/selected-pet-provider.tsx:31:49)
      at selectPet (src/hooks/use-pet-selection.ts:24:27)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17681:20)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at commitHookEffectListMount (node_modules/react-reconciler/cjs/react-reconciler.development.js:10861:29)
      at commitHookPassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:10948:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12979:13)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12999:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13213:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:12971:11)
      at recursivelyTraversePassiveMountEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:12934:11)
      at commitPassiveMountOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:13014:11)
      at flushPassiveEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:15982:9)
      at flushPendingEffects (node_modules/react-reconciler/cjs/react-reconciler.development.js:15892:14)
      at flushSpawnedWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15856:44)
      at commitRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:15587:9)
      at commitRootWhenReady (node_modules/react-reconciler/cjs/react-reconciler.development.js:14467:7)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14384:15)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      Encountered two children with the same key, `2026-08-21`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4179:23
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnOnInvalidKey (node_modules/react-reconciler/cjs/react-reconciler.development.js:4178:13)
      at reconcileChildrenArray (node_modules/react-reconciler/cjs/react-reconciler.development.js:4247:31)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4568:30)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "--color-accent-strong" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "--color-accent-strong" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "--color-accent-strong" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "--color-accent-strong" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7
      at runJobs (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:511:22)
      at doTickInner (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1311:29)
      at Immediate.nextPromiseTick [as _onImmediate] (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1373:25)

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7
      at runJobs (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:511:22)
      at doTickInner (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1311:29)
      at Immediate.nextPromiseTick [as _onImmediate] (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1373:25)

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7
      at runJobs (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:511:22)
      at doTickInner (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1311:29)
      at Immediate.nextPromiseTick [as _onImmediate] (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1373:25)

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7
      at runJobs (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:511:22)
      at doTickInner (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1311:29)
      at Immediate.nextPromiseTick [as _onImmediate] (node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1373:25)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "--color-accent-strong" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.warn
      "--color-muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performSyncWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:3350:7)
      at flushSyncWorkAcrossRoots_impl (node_modules/react-reconciler/cjs/react-reconciler.development.js:3192:21)
      at processRootScheduleInMicrotask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3231:9)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:3370:17
      at node_modules/test-renderer/src/reconciler.ts:479:7

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.error
      An update to HomeScreen inside a test was not wrapped in act(...).
      
      When testing, code that causes React state updates should be wrapped into act(...):
      
      act(() => {
        /* fire events that update state */
      });
      /* assert on the output */
      
      This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

      at node_modules/react-reconciler/cjs/react-reconciler.development.js:16307:19
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at warnIfUpdatesNotWrappedWithActDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:16306:9)
      at scheduleUpdateOnFiber (node_modules/react-reconciler/cjs/react-reconciler.development.js:14070:11)
      at forceStoreRerender (node_modules/react-reconciler/cjs/react-reconciler.development.js:5935:24)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:5920:11
      at node_modules/@tanstack/query-core/src/notifyManager.ts:73:11
      at notifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:21:5)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:44:13
          at Array.forEach (<anonymous>)
      at node_modules/@tanstack/query-core/src/notifyManager.ts:43:25
      at batchNotifyFn (node_modules/@tanstack/query-core/src/notifyManager.ts:24:5)
      at Timeout._onTimeout (node_modules/@tanstack/query-core/src/notifyManager.ts:42:9)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)
```

PARADA: Medida `/tmp/159-e1-final.txt` distinta de la esperada, intento 1; no se aplica otra repetición. Véanse resumen y fallos arriba.

R10: pendiente del smoke humano

### Corrección del registro auxiliar de BASE

BASE dio realmente `exit=0`, `Test Suites: 10 passed, 10 total` y
`Tests:       754 passed, 754 total`, exactamente lo pedido. No falló ningún it.
Los cinco encabezados `● Console` son bloques de salida de consola de suites
pasadas. Mi comprobador auxiliar los confundió con títulos de tests fallidos
y escribió la parada anterior por error. Se corrige el parser de ese auxiliar
en `/tmp/`, sin cambiar archivos de código ni repetir Jest. La medida BASE
se acepta por su exit y sus totales exactos; sigue el cierre con ALL.

### Cierre E1 — ALL

```text
$ pgrep -af '[i]nit\.sh'
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 1.

### Medida: 159-e1-all.txt, intento 1

```text
$ uptime
(en ejecución)
```

```text
 22:03:35 up 16 days, 18:11,  4 users,  load average: 4.04, 4.92, 4.46
```
Exit de la invocación: 0.

```text
$ FORCE_COLOR=0 bunx jest > /tmp/159-e1-all.txt 2>&1; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

```text
$ resumen de /tmp/159-e1-all.txt
Test Suites: 97 passed, 97 total
Tests:       2420 passed, 2420 total
```

Medida exacta conforme al handoff.

### Cierre E1 — Typecheck, lint, anclas y alcance

```text
$ bun run typecheck; echo "exit=$?"
(en ejecución)
```

```text
$ tsc --noEmit
exit=0
```
Exit de la invocación: 0.

```text
$ bunx expo lint --no-cache; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

A1 (esperado H0E1: 0; cierre: 1):

```text
$ grep -cF "it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'" src/screens/map/index.test.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A2 (esperado H0E1: 0; cierre: 1):

```text
$ grep -cF "it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle'" src/screens/map/index.test.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A3 (esperado H0E1: 0; cierre: 1):

```text
$ grep -cF "('no pinta el botón a %s aunque el listado diga owner'" src/screens/map/index.test.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A4 (esperado H0E1: 0; cierre: 3):

```text
$ grep -cF 'aunque el listado' src/screens/map/index.test.tsx
(en ejecución)
```

```text
3
```
Exit de la invocación: 0.

A5 (esperado H0E1: 1; cierre: 3):

```text
$ grep -cF "within(action).getByText('Vincular collar')" src/screens/map/index.test.tsx
(en ejecución)
```

```text
3
```
Exit de la invocación: 0.

A6 (esperado H0E1: 1; cierre: 1):

```text
$ grep -cF "it('lleva a emparejar una sola vez'" src/screens/map/index.test.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A7 (esperado H0E1: 1; cierre: 1):

```text
$ grep -cF "it('no pinta el botón mientras el detalle carga'" src/screens/map/index.test.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A8 (esperado H0E1: 1; cierre: 1):

```text
$ grep -cF "it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s', async (role)" src/screens/map/index.test.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A9 (esperado H0E1: 1; cierre: 1):

```text
$ grep -cF 'function noTrackingAfterDetail(detailState: PetState)' src/screens/map/index.test.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A10 (esperado H0E1: 1; cierre: 1):

```text
$ grep -cF "selectedPet?.myRole === 'owner'" src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A11 (esperado H0E1: 0; cierre: 0):

```text
$ grep -cF 'selectedPet?.device' src/screens/map/index.tsx
(en ejecución)
```

```text
0
```
Exit de la invocación: 1.

A12 (esperado H0E1: 1; cierre: 1):

```text
$ grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A13 (esperado H0E1: 1; cierre: 1):

```text
$ grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx
(en ejecución)
```

```text
1
```
Exit de la invocación: 0.

A14 (esperado H0E1: exit=0; cierre: exit=0):

```text
$ git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

```text
$ git diff --stat c8064d03 HEAD -- package.json bun.lock app.json src/theme
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 0.

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159 && pwd
(en ejecución)
```

```text
/home/claude/sites/Pet-Tracker-wt-159
```
Exit de la invocación: 0.

```text
$ git log --oneline c8064d03..HEAD
(en ejecución)
```

```text
203ea96e fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail
3224d502 test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list
```
Exit de la invocación: 0.

```text
$ git diff --name-only c8064d03 HEAD -- mobile-pet-tracker/
(en ejecución)
```

```text
mobile-pet-tracker/src/screens/map/index.test.tsx
```
Exit de la invocación: 0.

```text
$ git diff --stat c8064d03 HEAD -- backend-pet-tracker/ infra-pet-tracker/ docs/
(en ejecución)
```

```text
(vacío)
```
Exit de la invocación: 0.

### e1-3 — Trazabilidad y lista cerrada

Solo las filas R3 y R4 se actualizaron con los tests E1, sondas E1a-E1e y hashes rojo→verde. Producción idéntica a `664b95a7`; ninguna decisión adicional de producto. No se cargaron skills ni se ejecutaron init.sh, push, PR, merge o rebase.

```text
$ Cadena e1-3 que se ejecutará tras la lista cerrada
git add specs/mobile-no-collar-states-pingo/traceability.md progress/impl_mobile-no-collar-states-pingo.md \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-no-collar-states-pingo.md specs/mobile-no-collar-states-pingo/traceability.md ' \
  && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" \
  && git commit -m 'docs(mobile-no-collar-states-pingo): #159 E1 traceability'
```

```text
$ git diff --name-only c8064d03 -- . ':!feature_list.json' ':!progress/current.md' ':!progress/review_mobile-no-collar-states-pingo.md' ':!specs/mobile-no-collar-states-pingo/requirements.md' ':!specs/mobile-no-collar-states-pingo/design.md' ':!specs/mobile-no-collar-states-pingo/tasks.md' | LC_ALL=C sort
(en ejecución)
```

```text
mobile-pet-tracker/src/screens/map/index.test.tsx
progress/impl_mobile-no-collar-states-pingo.md
specs/mobile-no-collar-states-pingo/traceability.md
```
Exit de la invocación: 0.

```text
$ test -z "$(git ls-files --others --exclude-standard)"; echo "exit=$?"
(en ejecución)
```

```text
exit=0
```
Exit de la invocación: 0.

R10: pendiente del smoke humano

# Ronda 3 — Enmienda E2

## Base E2

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-159
$ git branch --show-current
feature/159-mobile-no-collar-states-pingo
$ git rev-parse --short HEAD
48363132
$ git status --short
(vacío)
```

H0E2: `48363132`. Enmienda E2 firmada en `4146ac24`. Ninguna skill cargada.
Las rondas 1 y 2 se conservan íntegras; solo se añade al final del impl.
Se sigue literalmente el handoff E2. No se crean comprobadores propios de Jest.

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
$ git fetch origin; echo "exit=$?"
exit=0
```

## Comprobaciones iniciales E2

```text
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
```

```text
$ git merge-base --is-ancestor 340967ba HEAD; echo "exit=$?"
exit=0
```

```text
$ git diff --quiet 340967ba HEAD -- .; echo "exit=$?"
exit=0
```

```text
$ git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
exit=0
```

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
```

```text
$ test -d node_modules && echo presente
presente
```

## Anclas E2 en H0E2

A1 (esperado H0E2: 1; cierre: 0):
```text
$ grep -cF "it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'" src/screens/map/index.test.tsx
1
```

A2 (esperado H0E2: 0; cierre: 1):
```text
$ grep -cF 'aunque el listado diga $role $collar: manda el rol y el collar del detalle' src/screens/map/index.test.tsx
0
```

A3 (esperado H0E2: 0; cierre: 6):
```text
$ grep -cE "^    \{ role: '(family|walker|vet)', collar: '(sin|con) collar', device: (null|makeDevice\('online'\)) \},$" src/screens/map/index.test.tsx
0
```

A4 (esperado H0E2: 0; cierre: 1):
```text
$ grep -cF "mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: role, device })] });" src/screens/map/index.test.tsx
0
```

A5 (esperado H0E2: 3; cierre: 3):
```text
$ grep -cF 'aunque el listado' src/screens/map/index.test.tsx
3
```

A6 (esperado H0E2: 3; cierre: 3):
```text
$ grep -cF "within(action).getByText('Vincular collar')" src/screens/map/index.test.tsx
3
```

A7 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle'" src/screens/map/index.test.tsx
1
```

A8 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "('no pinta el botón a %s aunque el listado diga owner'" src/screens/map/index.test.tsx
1
```

A9 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "it('lleva a emparejar una sola vez'" src/screens/map/index.test.tsx
1
```

A10 (esperado H0E2: 0; cierre: 0):
```text
$ grep -cF 'selectedPet?.myRole !==' src/screens/map/index.tsx
0
```

A11 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
1
```

A12 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx
1
```

A13 (esperado H0E2: exit=0; cierre: exit=0):
```text
$ git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
exit=0
```

## Base del Mapa E2

```text
$ uptime
 22:58:30 up 16 days, 19:05,  4 users,  load average: 2.32, 2.14, 2.94
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2-base.txt 2>&1; echo "exit=$?"
```

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       114 passed, 114 total
```

## e2-1 — Rojo

Se sustituyó únicamente el it indicado por el it.each literal de seis filas. Mutación versionada: dos líneas añadidas en canPairCollar; ninguna otra línea de producción cambia.

```text
$ uptime
 22:59:06 up 16 days, 19:06,  4 users,  load average: 4.10, 2.62, 3.08
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2-r.txt 2>&1; echo "exit=$?"
```

```text
exit=1
$ rg '^(Test Suites:|Tests:|  ● .+ › )|Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2-r.txt
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga walker sin collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga walker con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga vet sin collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga vet con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
Test Suites: 1 failed, 1 total
Tests:       4 failed, 115 passed, 119 total
```

Cadena e2-1 literal, con `<LIMPIO>` expandido:
```sh
grep -qE '^Tests: +4 failed, 115 passed, 119 total$' /tmp/159-e2-r.txt \
  && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2-r.txt)" = 4 \
  && test "$(grep -E '^  ● .+ › ' /tmp/159-e2-r.txt | grep -cE 'aunque el listado diga (walker|vet) (sin|con) collar: manda el rol y el collar del detalle')" = 4 \
  && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2-r.txt)" = 4 \
  && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-e2-r.txt \
  && test "$(grep -cF "selectedPet?.myRole !== 'walker' &&" src/screens/map/index.tsx)" = 1 \
  && test "$(grep -cF "selectedPet?.myRole !== 'vet' &&" src/screens/map/index.tsx)" = 1 \
  && test "$(grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx)" = 1 \
  && test "$(grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx)" = 1 \
  && test "$(git diff --numstat 664b95a7 -- src/screens/map/index.tsx | cut -f1,2 | tr '\t' ' ')" = '2 0' \
  && test "$(git diff --numstat HEAD -- src/screens/map/index.test.tsx | cut -f1,2 | tr '\t' ' ')" = '9 2' \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
  && git add src/screens/map/index.test.tsx src/screens/map/index.tsx \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/map/index.test.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'test(mobile-no-collar-states): #159 E2 red pair action obeys list role except family'
```

```text
$ tsc --noEmit
[feature/159-mobile-no-collar-states-pingo 43e712b3] test(mobile-no-collar-states): #159 E2 red pair action obeys list role except family
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 2 files changed, 11 insertions(+), 2 deletions(-)
exit=0
```

Commit e2-1: `43e712b3`. Typecheck: exit=0. Lint: exit=0; ambos están encadenados antes del commit.

## e2-2 — Verde

```text
$ git checkout 664b95a7 -- src/screens/map/index.tsx && git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"
exit=0
```

```text
$ uptime
 23:01:12 up 16 days, 19:08,  3 users,  load average: 10.04, 5.23, 3.97
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2-g.txt 2>&1; echo "exit=$?"
```

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       119 passed, 119 total
```

```text
$ uptime
 23:01:38 up 16 days, 19:09,  3 users,  load average: 8.49, 5.26, 4.02
$ FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-e2-g-guardas.txt 2>&1; echo "exit=$?"
```

```text
exit=0
Test Suites: 4 passed, 4 total
Tests:       174 passed, 174 total
```

Cadena e2-2 literal, con `<LIMPIO>` expandido:
```sh
grep -qE '^Tests: +119 passed, 119 total$' /tmp/159-e2-g.txt \
  && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-e2-g-guardas.txt \
  && git diff --quiet 664b95a7 -- src/screens/map/index.tsx \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
  && git add src/screens/map/index.tsx \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'fix(mobile-no-collar-states): #159 E2 revert list role probe, pair action locked to detail role' \
  && git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
```

```text
$ tsc --noEmit
[feature/159-mobile-no-collar-states-pingo 15fa23e4] fix(mobile-no-collar-states): #159 E2 revert list role probe, pair action locked to detail role
 Committer: Claude <claude@srv1178023.hstgr.cloud>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly:

    git config --global user.name "Your Name"
    git config --global user.email you@example.com

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 1 file changed, 2 deletions(-)
exit=0
```

Commit e2-2: `15fa23e4`. Typecheck: exit=0. Lint: exit=0. Diff final de producción contra 664b95a7: exit=0.

## Sonda E2a — Sin commit

```text
$ grep -cF "selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
1
```
Esperado: 1.

```text
$ uptime
 23:03:24 up 16 days, 19:10,  3 users,  load average: 5.57, 5.03, 4.06
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2a.txt 2>&1; echo "exit=$?"
```

```text
exit=1
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga walker sin collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga walker con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
Test Suites: 1 failed, 1 total
Tests:       2 failed, 117 passed, 119 total
```

```text
$ grep -qE '^Tests: +2 failed, 117 passed, 119 total$' /tmp/159-e2a.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2a.txt)" = 2 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2a.txt | grep -cE 'aunque el listado diga walker (sin|con) collar: ')" = 2 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2a.txt)" = 2; echo "sonda=$?"
sonda=0
```

```text
$ git checkout HEAD -- src/screens/map/index.tsx && git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
limpio=0
```

## Sonda E2b — Sin commit

```text
$ grep -cF "selectedPet?.myRole !== 'vet' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
1
```
Esperado: 1.

```text
$ uptime
 23:04:16 up 16 days, 19:11,  3 users,  load average: 4.63, 4.86, 4.05
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2b.txt 2>&1; echo "exit=$?"
```

```text
exit=1
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga vet sin collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga vet con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
Test Suites: 1 failed, 1 total
Tests:       2 failed, 117 passed, 119 total
```

```text
$ grep -qE '^Tests: +2 failed, 117 passed, 119 total$' /tmp/159-e2b.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2b.txt)" = 2 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2b.txt | grep -cE 'aunque el listado diga vet (sin|con) collar: ')" = 2 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2b.txt)" = 2; echo "sonda=$?"
sonda=0
```

```text
$ git checkout HEAD -- src/screens/map/index.tsx && git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
limpio=0
```

## Sonda E2c — Sin commit

```text
$ grep -cF "selectedPet?.myRole !== 'family' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
1
```
Esperado: 1.

```text
$ uptime
 23:04:54 up 16 days, 19:12,  3 users,  load average: 5.03, 4.97, 4.13
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2c.txt 2>&1; echo "exit=$?"
```

```text
exit=1
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga family sin collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga family con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
Test Suites: 1 failed, 1 total
Tests:       2 failed, 117 passed, 119 total
```

```text
$ grep -qE '^Tests: +2 failed, 117 passed, 119 total$' /tmp/159-e2c.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2c.txt)" = 2 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2c.txt | grep -cE 'aunque el listado diga family (sin|con) collar: ')" = 2 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2c.txt)" = 2; echo "sonda=$?"
sonda=0
```

```text
$ git checkout HEAD -- src/screens/map/index.tsx && git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
limpio=0
```

## Sonda E2d — Sin commit

```text
$ grep -cF "(selectedPet?.myRole === 'owner' || selectedPet?.device === null) && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
1
```
Esperado: 1.

```text
$ uptime
 23:05:31 up 16 days, 19:12,  3 users,  load average: 4.49, 4.89, 4.13
$ FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2d.txt 2>&1; echo "exit=$?"
```

```text
exit=1
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga family con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga walker con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
  ● #159 R3: el dueño sin collar puede ir a emparejar › pinta Vincular collar aunque el listado diga vet con collar: manda el rol y el collar del detalle
    Unable to find an element with testID: map-no-tracking-action
Test Suites: 1 failed, 1 total
Tests:       3 failed, 116 passed, 119 total
```

```text
$ grep -qE '^Tests: +3 failed, 116 passed, 119 total$' /tmp/159-e2d.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2d.txt)" = 3 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2d.txt | grep -cE 'aunque el listado diga (family|walker|vet) con collar: ')" = 3 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2d.txt)" = 3; echo "sonda=$?"
sonda=0
```

```text
$ git checkout HEAD -- src/screens/map/index.tsx && git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
limpio=0
```

## Cierre E2 — BASE

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
/home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
```

```text
$ pgrep -af '[i]nit\.sh'
(vacío)
```
Exit de pgrep: 1.

```text
$ uptime
 23:06:21 up 16 days, 19:13,  3 users,  load average: 3.42, 4.53, 4.05
$ FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-e2-final.txt 2>&1; echo "exit=$?"
```

```text
exit=0
Test Suites: 10 passed, 10 total
Tests:       759 passed, 759 total
```

## Cierre E2 — ALL

```text
$ pgrep -af '[i]nit\.sh'
(vacío)
```
Exit de pgrep: 1.

```text
$ uptime
 23:07:17 up 16 days, 19:14,  3 users,  load average: 4.64, 4.60, 4.10
$ FORCE_COLOR=0 bunx jest > /tmp/159-e2-all.txt 2>&1; echo "exit=$?"
```

```text
exit=0
Test Suites: 97 passed, 97 total
Tests:       2425 passed, 2425 total
```

## Cierre E2 — Typecheck y lint

```text
$ bun run typecheck; echo "exit=$?"
```

```text
$ tsc --noEmit
exit=0
$ bunx expo lint --no-cache; echo "exit=$?"
```

```text
exit=0
```

## Anclas E2 en el cierre

A1 (esperado H0E2: 1; cierre: 0):
```text
$ grep -cF "it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'" src/screens/map/index.test.tsx
0
```

A2 (esperado H0E2: 0; cierre: 1):
```text
$ grep -cF 'aunque el listado diga $role $collar: manda el rol y el collar del detalle' src/screens/map/index.test.tsx
1
```

A3 (esperado H0E2: 0; cierre: 6):
```text
$ grep -cE "^    \{ role: '(family|walker|vet)', collar: '(sin|con) collar', device: (null|makeDevice\('online'\)) \},$" src/screens/map/index.test.tsx
6
```

A4 (esperado H0E2: 0; cierre: 1):
```text
$ grep -cF "mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: role, device })] });" src/screens/map/index.test.tsx
1
```

A5 (esperado H0E2: 3; cierre: 3):
```text
$ grep -cF 'aunque el listado' src/screens/map/index.test.tsx
3
```

A6 (esperado H0E2: 3; cierre: 3):
```text
$ grep -cF "within(action).getByText('Vincular collar')" src/screens/map/index.test.tsx
3
```

A7 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle'" src/screens/map/index.test.tsx
1
```

A8 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "('no pinta el botón a %s aunque el listado diga owner'" src/screens/map/index.test.tsx
1
```

A9 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "it('lleva a emparejar una sola vez'" src/screens/map/index.test.tsx
1
```

A10 (esperado H0E2: 0; cierre: 0):
```text
$ grep -cF 'selectedPet?.myRole !==' src/screens/map/index.tsx
0
```

A11 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx
1
```

A12 (esperado H0E2: 1; cierre: 1):
```text
$ grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx
1
```

A13 (esperado H0E2: exit=0; cierre: exit=0):
```text
$ git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
exit=0
```

## Alcance e historial del cierre E2

```text
$ git diff --stat 48363132 HEAD -- package.json bun.lock app.json src/theme
(vacío)
```

```text
$ cd /home/claude/sites/Pet-Tracker-wt-159 && pwd
/home/claude/sites/Pet-Tracker-wt-159
```

```text
$ git log --oneline 48363132..HEAD
15fa23e4 fix(mobile-no-collar-states): #159 E2 revert list role probe, pair action locked to detail role
43e712b3 test(mobile-no-collar-states): #159 E2 red pair action obeys list role except family
```

```text
$ git diff --numstat 48363132 HEAD -- mobile-pet-tracker/
9	2	mobile-pet-tracker/src/screens/map/index.test.tsx
```

```text
$ git diff --quiet 664b95a7 HEAD -- mobile-pet-tracker/src/screens/map/index.tsx; echo "exit=$?"
exit=0
```

```text
$ git diff --stat 48363132 HEAD -- backend-pet-tracker/ infra-pet-tracker/ docs/
(vacío)
```

## e2-3 — Trazabilidad

Solo se actualizó la fila R3, copiada literalmente del handoff con `43e712b3` y `15fa23e4`.

```text
$ git diff -U0 -- specs/mobile-no-collar-states-pingo/traceability.md | grep -E '^[-+]\|' | cut -c1-8
-| R3 | 
+| R3 | 
```

```text
$ grep -cF '; E2: ' specs/mobile-no-collar-states-pingo/traceability.md
1
```

Todas las medidas coincidieron sin repetición: no apareció el flake de #72 R2. No se añadieron decisiones de producto; se copió el bloque literal de tasks.md. Dependencias presentes (comando de node_modules exit=0). Ninguna skill cargada; no se lanzó init.sh ni se hizo push, PR, rebase o merge. Las rondas 1 y 2 del impl se conservaron y todo el registro E2 se añadió al final.

Cadena e2-3 que se ejecutará tras comprobar la lista cerrada:
```sh
git add specs/mobile-no-collar-states-pingo/traceability.md progress/impl_mobile-no-collar-states-pingo.md \
  && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-no-collar-states-pingo.md specs/mobile-no-collar-states-pingo/traceability.md ' \
  && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" \
  && git commit -m 'docs(mobile-no-collar-states-pingo): #159 E2 traceability'
```

## Lista cerrada E2

```text
$ git diff --name-only 48363132 -- . ':!feature_list.json' ':!progress/current.md' ':!progress/review_mobile-no-collar-states-pingo.md' ':!specs/mobile-no-collar-states-pingo/requirements.md' ':!specs/mobile-no-collar-states-pingo/design.md' ':!specs/mobile-no-collar-states-pingo/tasks.md' | LC_ALL=C sort
mobile-pet-tracker/src/screens/map/index.test.tsx
progress/impl_mobile-no-collar-states-pingo.md
specs/mobile-no-collar-states-pingo/traceability.md
```

```text
$ test -z "$(git ls-files --others --exclude-standard)"; echo "exit=$?"
exit=0
```

R10: pendiente del smoke humano
