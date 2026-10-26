---
feature: "mobile-vaccine-create"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-vaccine-create]] (#208)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Toda decisión de UI se rige por `docs/ui-guidelines.md`.

## Dependencia de #220 (bloqueante)

#208 usa `DateField` y `utils/civil-date.ts` de #220 (`mobile-date-field`).

- **El handoff a Codex no se emite hasta que #220 esté mergeada en `dev`.**
- El primer paso de Codex es `git fetch origin && git merge origin/dev` en
  `feature/208-mobile-vaccine-create`. **Nunca `rebase`**: invalida los hashes
  de trazabilidad.
- Tras el merge, el leader **re-mide** las anclas marcadas **[#220]** en
  [[requirements]] y los agregados que #220 mueve:
  - `ALL_USES`, `SCREEN_FILES` y los `blocks` de `#194 R5` (ui-copy-table)
  - la suma de `#194 R1` (language-provider)
  - los inventarios de `chunky-cta-canvas-fidelity` y `consistency-classnames`

  Los deltas de #208 son **sumandos** (`+ N // #208 R<n>`), así que no cambian.
  Cambia solo la base sobre la que se suman.
- **Bloque de copy.** #220 ocupa `R18_DATE_FIELD`. #208 usa `R19_VACCINE_CREATE`
  aunque #220 se mergee después; el nombre no depende del orden.

## Decisiones técnicas

- **Ruta propia bajo la mascota** (`app/pets/[petId]/vaccines/new.tsx`,
  R4).
  - Sigue la forma de `geofences` y `docs-upload`: route delgado más
    `screens/vaccine-create/`.
  - Es un detalle con `headerShown: false` y `ScreenHeader`, igual que
    `weight-log`.
- **Clientes en `api/health-records.ts`** (R1). Ese fichero ya contiene
  `listVaccines` y `createWeight`; el mapeo de estados copia `CreateWeightState`.
- **Suma de meses en un fichero nuevo** `utils/vaccine-dates.ts` (R2). Así no
  choca con `civil-date.ts`, que es propiedad de #220. Replica la regla de
  recorte de `addCalendarMonths` del backend, de modo que la propuesta del
  cliente coincide con la que calcularía el servidor.
- **Siempre se envía `nextDoseAt` con catálogo** (R14).
  - Si se omite, el backend recalcula y pisaría una fecha elegida a mano.
  - `null` no se admite, así que «Otra vacuna» sin fecha **omite** la clave.
- **El rol sale de `listPets`**, que Salud ya consulta (R5, R6). No hace falta
  un endpoint nuevo ni un contexto.
- **Recordatorio desde la respuesta del 201** (R15), no desde el formulario.
  - El servidor es la fuente de verdad de `nextDoseAt`.
  - Hora 09:00 local del dispositivo con `combineDateAndTime`, como
    `add-reminder`.
  - `advanceMinutes: 0`, porque el copy promete «ese día a las 09:00».
- **Sin rollback** (R16). Si el recordatorio falla, la vacuna ya está guardada
  y se informa con el aviso ámbar.
  - El plan decía «toast de error». El artboard `SaludVacunaSinRecordatorio`
    lo concreta como aviso persistente con acción «Crear ahora», y manda el
    artboard aprobado en G1.
- **Aviso en un almacén de módulo con `useSyncExternalStore`** (R16).
  - Sigue el precedente de `hooks/use-push-registration.ts`.
  - El aviso cruza de la pantalla de alta a Salud, y sobrevive al
    `router.back()` y a las invalidaciones de react-query.
- **Chips en el orden de la API** (R8). Los artboards muestran Rabia primero
  como ilustración. La API ordena por nombre, y la app no reordena en cliente
  para no duplicar criterio.
- **Error del catálogo sin copy nueva** (R8): queda solo «Otra vacuna». El alta
  sigue siendo posible y no hace falta un artboard más.
- **400 sin texto crudo** (R18, regla #186): `appliedAt` da un mensaje de campo
  y cualquier otro path da `validation.checkDetails`.
- **Semilla en `init.config.sh`** (R22). `seed:vaccines` es idempotente: hace
  upsert por especie y nombre y conserva los ids.
  - La FK `pet_vaccines.catalog_id` no tiene `onDelete`. El script solo borra
    filas no canónicas; si una ya estuviera referenciada, el borrado fallaría
    y `init.sh` se pararía. En las bases de desarrollo solo hay filas canónicas,
    y la suite e2e siembra por su cuenta.

## Desviaciones del canvas (aceptadas)

| Elemento | Canvas | App | Motivo |
|---|---|---|---|
| Alto de `DateField` | 52 | 48 (`h-12`) | Contrato de #220. Un componente compartido no se bifurca por pantalla. |
| CTA del vacío (`vaccines-empty-action`) | 52 / 16 | 56 / 17 (`h-14`, `text-17`) | Receta global de primario, carta §13 y #177. |
| Orden de chips | Rabia primero | Orden de la API (Leptospirosis primero en perro) | Ver decisiones. |

## Archivos afectados

Todos en la capa de presentación móvil, salvo la línea de `init.config.sh`.

**Nuevos:**
- `mobile-pet-tracker/src/app/pets/[petId]/vaccines/new.tsx`: route delgado (R4).
- `mobile-pet-tracker/src/screens/vaccine-create/index.tsx`: pantalla (R7–R18).
- `mobile-pet-tracker/src/screens/vaccine-create/index.test.tsx`: tests de pantalla (R4, R7–R18).
- `mobile-pet-tracker/src/utils/vaccine-dates.ts`: `addCalendarMonthsIso` (R2).
- `mobile-pet-tracker/src/utils/__tests__/vaccine-dates.test.ts` (R2).
- `mobile-pet-tracker/src/hooks/vaccine-reminder-notice.ts`: almacén del aviso (R16).

**Modificados:**
- `mobile-pet-tracker/src/api/health-records.ts`: `getVaccineCatalog` y `createVaccine` (R1).
- `mobile-pet-tracker/src/api/types.ts`: `VaccineCatalogEntry` y `CreateVaccineInput` (R1).
- `mobile-pet-tracker/src/api/query-keys.ts`: `healthKeys.vaccineCatalog` (R1).
- `mobile-pet-tracker/src/api/__tests__/health-records.test.ts` (R1).
- `mobile-pet-tracker/src/utils/form-rules.ts` y `src/utils/form-rules.test.ts`: `validateVaccine` (R3).
- `mobile-pet-tracker/src/app/_layout.tsx`, `src/app/__tests__/layout.test.tsx` y `src/app/__tests__/detail-stack.guard.test.tsx` (R4).
- `mobile-pet-tracker/src/screens/health/index.tsx` y `index.test.tsx`: cabecera con CTA, vacío del owner y aviso ámbar (R5, R6, R16).
- `mobile-pet-tracker/src/i18n/catalog.ts` y `src/providers/__tests__/language-provider.test.tsx` (R19).
- `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts` (R20).
- `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts`, `consistency-classnames.test.ts` y `design-drift.test.ts` (R21).
- `init.config.sh` e `init-e2e-gate.test.mjs`, en la raíz (R22).

**No cambia:** `backend-pet-tracker/` y `init.sh`.

## Alternativas descartadas

- **Abrir el alta como hoja sobre Salud o con params en la pestaña `/health`.**
  La semántica de params en una pestaña es ambigua (persisten entre visitas),
  y el patrón del repo para altas de detalle es la ruta propia.
- **Guardar el aviso en la caché de react-query.** La invalidación de
  `petKeys.list()` y `healthKeys.vaccines` tras el 201 lo borraría, o
  requeriría excepciones.
- **No preseleccionar ningún chip.** Haría falta copy de «elige una vacuna» que
  el canvas no tiene, y el artboard `AltaVacuna` dibuja un chip seleccionado.
- **Calcular la próxima dosis solo en el servidor (omitir `nextDoseAt`).** Se
  perdería la fecha editada a mano y el subtexto del recordatorio no podría
  mostrar la fecha antes de guardar.
- **Rollback de la vacuna si falla el recordatorio.** Decisión cerrada del
  plan: la vacuna es el dato valioso y el recordatorio se puede rehacer.
- **Usar la zona del perfil para las 09:00.** Diverge de `add-reminder`; queda
  fuera de alcance.

## Handoff a Codex: skills

Codex tiene `expo@openai-curated` v1.0.2. En el handoff se nombran **sus**
nombres:

- `building-native-ui`: pantalla, formulario y KAV
- `native-data-fetching`: queries y mutación con react-query
- `expo-ui-swift-ui` y `expo-ui-jetpack-compose`: el picker de `@expo/ui`,
  dentro de `DateField`
- `expo-tailwind-setup`: clases NativeWind/uniwind

Codex **no** tiene `expo-overview` ni una skill de animación. Esta feature no
anima nada.
