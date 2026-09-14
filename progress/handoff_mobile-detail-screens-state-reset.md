# Handoff a Codex CLI — #63 `mobile-detail-screens-state-reset`

> Escrito por el leader el 2026-09-14, tras la firma humana de la spec
> (`1a9fef11`). El humano corre este prompt en su terminal de Codex CLI, en el
> worktree `/home/claude/sites/Pet-Tracker`.
>
> Mientras Codex implementa, la sesión de Claude **no toca**
> `mobile-pet-tracker/`: solo `docs/`, `specs/`, `progress/` y
> `feature_list.json`.

---

## Prompt (copiar de aquí abajo)

```
Feature: mobile-detail-screens-state-reset (#63)
Branch: feature/63-mobile-detail-screens-state-reset (ya existe y está pusheada;
        trabaja sobre ella, no abras otra y no commitees a main)
Worktree: /home/claude/sites/Pet-Tracker

Spec APROBADA por humano el 2026-09-14 (commit 1a9fef11, status: approved):
  specs/mobile-detail-screens-state-reset/requirements.md   ← R1..R7, es el contrato
  specs/mobile-detail-screens-state-reset/design.md         ← D1..D5 y la auditoría
  specs/mobile-detail-screens-state-reset/tasks.md          ← el orden de trabajo, síguelo
  specs/mobile-detail-screens-state-reset/traceability.md   ← actualízala tras cada commit

Empieza por tasks.md §0 (Precondiciones) y no te saltes su orden: cada R-id
crea el sujeto que el siguiente aserta.

Antes de escribir código, carga las skills del plugin expo (ya instalado):
expo-overview primero, después expo-router. Lo manda docs/ui-guidelines.md.

QUÉ SE ARREGLA
Las pantallas de detalle viven bajo src/app/(tabs)/, así que Expo Router las
trata como rutas de tab: salir con router.back() o por la barra de tabs cambia
de pantalla pero NO desmonta el componente, y su useState local sobrevive. Al
reentrar, el formulario aparece con lo de la vez anterior.

VÍA DECIDIDA Y FIRMADA (D1): reset local en el cleanup de useFocusEffect.
NO saques ninguna ruta a un Stack. No toques (tabs)/_layout.tsx, ni el Redirect
a /login, ni el SelectedPetProvider, ni el FloatingTabBar. La vía del Stack se
evaluó, se midió y quedó registrada como deuda aparte (#95). Si te parece mejor
idea, no la implementes: está decidida por escrito y firmada.

ARCHIVOS A MODIFICAR
  mobile-pet-tracker/src/screens/add-reminder/index.tsx        (R1)
  mobile-pet-tracker/src/screens/add-pet/index.tsx             (R2)
  mobile-pet-tracker/src/app/(tabs)/weight-log.tsx             (R3)
  mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx          (R4)
  mobile-pet-tracker/src/screens/pairing/index.tsx             (R5, R6)
  + sus ficheros de test correspondientes
  mobile-pet-tracker/src/screens/docs/index.tsx NO se toca: auditado, cero
  useState, no tiene el defecto.

REGLAS CRÍTICAS
- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md.
  UI móvil: docs/ui-guidelines.md.
- TDD por requisito: test ROJO que nombra su R-id en el título del describe,
  luego verde, luego refactor.
- UN COMMIT POR REQUISITO COMO MÍNIMO, y el commit del test rojo ANTES que el
  de su implementación. Un único commit con implementación + tests + docs
  incumple C4 de CHECKPOINTS.md. Esto ya pasó en #19; no se repite.
  Convención: test(<scope>): <desc> (R1)  →  feat(<scope>): <desc> (R1)
- Actualiza specs/mobile-detail-screens-state-reset/traceability.md tras cada
  commit: fichero::nombre del test, hash y mensaje. El reviewer no aprueba con
  filas en "pendiente".

NO EJECUTES ./init.sh
El Postgres de Docker está compartido con otra sesión trabajando en otro
worktree, y dos corridas a la vez se borran filas y dan e2e rojos falsos. El
gate completo lo corre el reviewer, coordinado. Durante la implementación usa
el comando dirigido de requirements.md §Verificación:

  cd mobile-pet-tracker && npx jest src/screens/add-reminder src/screens/add-pet \
    src/screens/pairing src/screens/docs "src/app/(tabs)/__tests__/weight-log" \
    "src/app/(tabs)/__tests__/meal-schedule" src/providers/__tests__/language-provider

Más npx tsc --noEmit y npx expo lint en mobile-pet-tracker/.

CUATRO COSAS QUE ROMPEN EL GATE SI LAS IGNORAS
1. R7 NO es "resetea todo". submitting, claiming y releasing son guardas de
   petición en vuelo y DEBEN sobrevivir al blur: su único camino a false sigue
   siendo el finally que ya existe. Si los reseteas, al volver se puede disparar
   un segundo POST sobre una petición viva. R7 se cierra por mutación en DOS
   sitios (setSubmitting(false) en AddReminderContent, setClaiming(false) en
   resetPairingState): planta cada mutación, comprueba que pone rojo por
   aserción, y revierte dejando git diff vacío. Ambas salidas van al reporte.
2. Cero claves nuevas de copy. Esta feature no añade ni renombra nada en
   src/i18n/catalog.ts, así que
   src/providers/__tests__/language-provider.test.tsx:55 debe quedar BYTE A BYTE
   idéntica. Si tu diff la toca, te saliste del alcance.
3. C8: ni una className nueva, ni un hex, ni un token, ni una dimensión, ni una
   animación. El grep-clean y src/__tests__/consistency-classnames.test.ts salen
   idénticos.
4. pairing/index.test.tsx mockea useFocusEffect como jest.fn(). El test nuevo
   tiene que CAPTURAR el callback registrado y ejecutar su función de limpieza a
   mano; no esperes que el mock la llame solo.

NO SE DELEGA
No crees recursos AWS ni corras cdk deploy. No toques backend-pet-tracker/.
La prueba de humo en dev build de Android la hace el humano, no tú.

CRITERIOS DE ACEPTACIÓN: R1, R2, R3, R4, R5, R6 y R7 de
specs/mobile-detail-screens-state-reset/requirements.md.

AL TERMINAR
Escribe el resultado en progress/impl_mobile-detail-screens-state-reset.md:
qué commit cierra cada R-id, la salida de las dos mutaciones de R7, el
resultado del comando dirigido, de tsc y de lint, y cualquier decisión que
hayas tenido que tomar que la spec no cubriera. No cierres progress/current.md
— de eso se encarga el leader.
```
