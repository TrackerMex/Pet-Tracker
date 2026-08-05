---
feature: "geofences-crud"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[geofences-crud]]

> Ver [[requirements]] para los requisitos que este diseño implementa
> (incluidas las decisiones abiertas **D1-D5**, todas pendientes de
> confirmación humana en el gate) y
> [[../../docs/architecture|architecture]] para las reglas de capas del
> proyecto.

## Decisiones técnicas

- **`geofences` en un `src/db/schema/geofences.schema.ts` propio** — sirve a
  R1 (**D5**). Convención de `docs/conventions.md`: un `<module>.schema.ts`
  por módulo, re-export en el barrel `index.ts`, migración con
  `drizzle-kit generate`. CHECK de `type` reducido a `('safe_circle')` —
  desviación deliberada y documentada de la lista más amplia de
  `docs/data-model.md` (`safe_circle, safe_polygon, restricted, home, park,
  vet, daycare`): ninguno de esos otros valores es alcanzable por el CRUD de
  esta feature (**D1**), así que no se reserva espacio en la base para filas
  que la aplicación nunca puede producir; se amplía con `ALTER TABLE` cuando
  una feature futura implemente el tipo correspondiente. Índice único
  `(pet_id, name)` nuevo, no listado en `docs/data-model.md` — mismo
  criterio que D4 de devices-claim (UNIQUE que un caso de uso real necesita
  aunque el doc de referencia no lo liste).

- **`geometry` jsonb con discriminador propio (`shape`), desacoplado de la
  columna `type`** — sirve a R16, R17 (**D1**). Tipos del núcleo puro:

  ```typescript
  export interface CircleGeometry {
    shape: 'circle';
    centerLat: number;
    centerLng: number;
    radiusM: number;
  }
  export interface PolygonGeometry {
    shape: 'polygon';
    points: Array<{ lat: number; lng: number }>;
  }
  export type GeofenceGeometry = CircleGeometry | PolygonGeometry;
  ```

  Para el único tipo que el CRUD produce hoy, `geometry` persiste
  `{shape: 'circle', centerLat, centerLng, radiusM}`. `geometry.shape` es un
  eje técnico (forma geométrica) distinto de `geofences.type` (taxonomía de
  negocio: por qué existe la geocerca) — hoy coinciden 1:1 (`safe_circle` ⇒
  `shape: 'circle'`), pero `docs/data-model.md` ya anticipa tipos
  (`restricted`/`home`/`vet`/...) que no fijan forma en el nombre; mantener
  los ejes desacoplados evita que una futura feature tenga que migrar el
  significado de `type`. `isInside()` recibe la unión completa —
  autodescriptiva, no necesita que el caller le pase el `type` de la fila —
  y queda utilizable por un test unitario de polígono sin ningún CRUD detrás
  (R17).

- **`evaluate()` tipado solo para `CircleGeometry`, no la unión completa** —
  sirve a R18-R24 (**D1**, **D3**). La histéresis (`radius × 1.1/0.9`) no
  tiene un análogo obvio para polígono (¿desplazar cada arista hacia
  adentro/afuera una distancia fija? esta feature no lo pide) y el CRUD no
  puede crear una geocerca de polígono (**D1**): tipar
  `evaluate(previous, geometry: CircleGeometry, ...)` hace que la pregunta
  "¿qué histéresis usa un polígono?" ni siquiera compile todavía, en vez de
  resolverla a medias. `isInside()` sigue siendo general (bullet anterior);
  `evaluate()` es la pieza más estrecha, con el círculo como único caso
  resuelto.

- **`geofence_state` como columna jsonb en la propia fila de `geofences`,
  no una tabla aparte** — sirve a R1, R9 (**D2**). Cada geocerca ya
  pertenece a una sola mascota (`pet_id` FK): no existe el producto
  cartesiano "mascota × geocerca" que justificaría una tabla de estado
  separada — el estado de "esta mascota respecto a esta geocerca" ES el
  estado de la fila. Shape `{state: 'unknown' | 'inside' | 'outside',
  updatedAt: string | null}` (ISO-8601), default
  `{state: 'unknown', updatedAt: null}` al crear. Esta feature nunca escribe
  un valor distinto del default (ningún caso de uso llama a `evaluate()`,
  ver [[requirements]] §Fuera de alcance): `alerts-engine` (#12) leerá y
  escribirá esta misma columna cuando conecte el worker de posiciones, sin
  migración adicional ni cambio de shape.

- **`GEOFENCE_EXIT_RADIUS_MULTIPLIER`, `GEOFENCE_ENTER_RADIUS_MULTIPLIER`,
  `GEOFENCE_EXIT_MAX_ACCURACY_M` en `pipeline/constants.ts`, reutilizando
  `FLAG_LOW_ACCURACY` existente** — sirve a R19-R24 (**D3**). El propio
  encabezado de `constants.ts` ya declara ser la fuente única que "#11
  (geocercas)... importan de aquí". El gate de "low_accuracy no cambia
  estado" (R22) reutiliza el flag que `validate-positions.ts` ya calcula
  (accuracy > 100 m o < 4 sats, #8) — no se reimplementa ese umbral. La
  accuracy específica de salida (≤ 50 m, R19/R21) es una constante nueva y
  más estricta: exigir mejor precisión para declarar que la mascota escapó
  que para simplemente no descartar el punto (asimetría deliberada: una
  falsa alarma de salida cuesta más que una entrada tardía).
  `accuracyM === undefined` se trata como accuracy aceptable (mismo criterio
  "fail-open" que `hasLowAccuracy` en `validate-positions.ts`: la ausencia
  de dato no es evidencia de mala calidad).

- **`evaluate()` recibe `position: Pick<ProcessedPosition, 'lat' | 'lng' |
  'accuracyM' | 'flags'>`, no un tipo propio** — sirve a R18-R24 (**D3**).
  El futuro worker de #12 leerá `ProcessedPosition` de DynamoDB y se lo
  pasará tal cual; inventar un tipo paralelo solo para geocercas obligaría a
  un mapeo adicional en #12 sin ninguna ganancia.

- **CRUD de geocercas en un módulo nuevo `src/modules/geofences/`,
  controller único a nivel de `pets/:petId/geofences` con guard de clase** —
  sirve a R2-R15 (**D4**). Mismo patrón que `pet-device.controller.ts` de
  #7: `@Controller('pets/:petId/geofences')` + `@UseGuards(PetAccessGuard)`
  a nivel de clase (las cinco rutas llevan `:petId`, a diferencia de
  `pets.controller.ts` donde solo las rutas con `:petId` lo llevan).
  `@RequirePetRole('owner')` por método en `POST`, `PATCH`, `DELETE`; `GET`
  (list y detail) sin decorador. `GeofencesModule` importa `PetsModule`
  (que exporta guard + decorador) — no necesita `PET_REPOSITORY`: el
  `petId` ya validado llega vía `request.petMembership`.

- **`:geofenceId` se valida como UUID en el use case antes de consultar** —
  sirve a R9, R12, R15. Postgres lanza un error de sintaxis
  ("invalid input syntax for type uuid") si se compara una columna `uuid`
  contra un string no-UUID — dejar que la excepción cruda llegue al cliente
  violaría `docs/conventions.md` ("nunca dejar que un error de Drizzle/pg
  llegue crudo"). El use case repite el mismo patrón de regex que
  `PetAccessGuard.canActivate()` (sin exportarlo desde `pets/`: R26 prohíbe
  tocar `src/modules/pets/**`, así que la duplicación de una línea de regex
  es forzada, no una elección) y trata un `:geofenceId` malformado como
  "no encontrado" (`404`), igual que un UUID bien formado pero inexistente.

- **Máximo de 5 y nombre único verificados en el use case, no en un trigger
  de base** — sirve a R6, R7 (**D5**). El use case de creación hace
  `countByPet` y `findByNameAndPet` antes de `create` (misma orquestación
  que `ClaimDeviceUseCase`: membresía → rol → disponibilidad → escritura).
  El índice único `(pet_id, name)` es el candado real contra la carrera de
  nombres duplicados (mismo patrón `23505` → error de dominio que R8 de
  devices-claim); el máximo de 5 no tiene un candado equivalente a nivel de
  base (Postgres no expone un CHECK que cuente filas hermanas sin trigger).
  `ponytail: COUNT + INSERT sin transacción serializable — dos creaciones
  concurrentes podrían dejar 6 filas si compiten en el mismo instante;
  upgrade path: trigger de base o advisory lock por pet_id si la creación
  concurrente deja de ser un escenario improbable (una familia gestionando
  geocercas de una mascota, normalmente desde una sesión a la vez).`

- **Errores de dominio → HTTP en un mapper de infraestructura** — sirve a
  R5-R7, R9, R12, R15. En `domain/errors/geofence.errors.ts`, sin imports de
  `@nestjs/common`:

  | Error de dominio | HTTP | Código en body |
  |---|---|---|
  | `MaxGeofencesReachedError` | 400 | `MAX_GEOFENCES_REACHED` |
  | `GeofenceNameTakenError` | 409 | `GEOFENCE_NAME_TAKEN` |
  | `GeofenceNotFoundError` | 404 | `GEOFENCE_NOT_FOUND` |

  El `404` de mascota inexistente/ajena (R2) y el `403` de rol insuficiente
  (R3) los produce el guard/decorador existentes de #5, no un error propio
  de este módulo — no aparecen en la tabla por la misma razón que en
  devices-claim: se listan solo los que este módulo introduce.

- **DTO zod `z.strictObject`, create y update comparten schema base** —
  sirve a R5, R10, R11. `GeofenceFieldsSchema` (`name`, `centerLat`,
  `centerLng`, `radiusM`, `active`) con los límites de R5 inline (mismo
  estilo que `PetFieldsSchema`: sin constantes nombradas para bounds de DTO
  que solo el propio schema consume). `CreateGeofenceSchema =
  GeofenceFieldsSchema.extend({type: z.literal('safe_circle')}).strict()`;
  `UpdateGeofenceSchema = GeofenceFieldsSchema.partial().strict()` — sin
  `type`: la forma de una geocerca no se migra por `PATCH`, se borra y
  recrea. `z.strictObject`/`.strict()` rechaza claves desconocidas como
  `400` (precedente más reciente: R17 de trips-activity) en vez del zod por
  defecto, que las descartaría en silencio — así `type` en un `PATCH`, o un
  typo como `radius` en vez de `radiusM`, son errores visibles y no
  ediciones fantasma.

- **Respuesta con `state` anidado, distinto de `updatedAt` de la fila** —
  sirve a R9. `{id, petId, name, type, centerLat, centerLng, radiusM,
  active, state: {value, updatedAt}, createdAt, updatedAt}`: el `updatedAt`
  de primer nivel (fila) cambia con cada `PATCH` de configuración;
  `state.updatedAt` (evaluación) permanece `null` hasta que #12 llame
  `evaluate()` por primera vez. Nombrarlos igual habría confundido dos
  relojes con significados distintos.

- **Auditoría después de cada escritura, meta mínima** — sirve a R4, R10,
  R14. `geofence.create` / `geofence.update` / `geofence.delete`,
  `entity: 'geofence'`, `entityId` = id de la geocerca, `meta: {petId}`
  (create/delete) o `meta: {petId, fields: [...]}` (update, solo nombres —
  mismo criterio de privacidad que `update-pet.use-case.ts`: nunca los
  valores).

## Estructura de capas

```
backend-pet-tracker/src/
├── pipeline/
│   ├── constants.ts                        [EDITADO: +3 umbrales geocercas]
│   └── geofence-eval.ts (+ .spec.ts)       [nuevo: isInside, evaluate, tipos]
│
├── db/
│   ├── schema/geofences.schema.ts          [nuevo: tabla geofences]
│   ├── schema/index.ts                     [editado: +1 línea de re-export]
│   └── migrations/0006_*.sql               [generado por drizzle-kit]
│
└── modules/geofences/                      [módulo nuevo completo]
    ├── domain/
    │   ├── entities/geofence.entity.ts     ← Geofence (clase pura)
    │   ├── errors/geofence.errors.ts       ← tabla de arriba
    │   └── repositories/geofence.repository.ts ← interface + GEOFENCE_REPOSITORY
    ├── application/
    │   ├── dto/create-geofence.dto.ts      ← CreateGeofenceSchema + UpdateGeofenceSchema
    │   └── use-cases/
    │       ├── create-geofence.use-case.ts ← countByPet + findByNameAndPet + create + audit
    │       ├── list-geofences.use-case.ts
    │       ├── get-geofence.use-case.ts
    │       ├── update-geofence.use-case.ts ← no-op si no hay campos + audit
    │       └── delete-geofence.use-case.ts ← delete + audit
    ├── infrastructure/
    │   ├── mappers/geofence-error.mapper.ts
    │   ├── mappers/geofence-response.mapper.ts  ← lista explícita de campos, sin spread
    │   ├── repositories/geofence.drizzle.repository.ts
    │   └── geofences.controller.ts         ← pets/:petId/geofences (guard de clase, D4)
    ├── geofences.constants.ts              ← GEOFENCE_MAX_PER_PET = 5
    └── geofences.module.ts                 ← importa PetsModule; providers + controller
```

## Archivos afectados

- `backend-pet-tracker/src/pipeline/constants.ts` — editado: solo se añaden
  `GEOFENCE_EXIT_RADIUS_MULTIPLIER`, `GEOFENCE_ENTER_RADIUS_MULTIPLIER`,
  `GEOFENCE_EXIT_MAX_ACCURACY_M` (R19, R21, R24); los exports existentes no
  se tocan.
- `backend-pet-tracker/src/pipeline/geofence-eval.ts` (+ `.spec.ts`) —
  nuevo, núcleo puro (R16-R25).
- `backend-pet-tracker/src/db/schema/geofences.schema.ts` — nuevo (R1);
  `src/db/schema/index.ts` — **una línea** de re-export.
- `backend-pet-tracker/src/db/migrations/0006_*.sql` + `meta/` — generados
  por `pnpm run db:generate`.
- `backend-pet-tracker/src/modules/geofences/**` — módulo nuevo completo,
  tres capas (R2-R15). Todo import que cruza de capa o de módulo usa el
  alias `@/` (`docs/conventions.md` §Imports); relativo solo intra-capa.
- `backend-pet-tracker/src/app.module.ts` — **una línea**: importa
  `GeofencesModule`.
- `backend-pet-tracker/test/geofences.e2e-spec.ts` — nuevo: CRUD completo
  (201/400/403/404/409), IDOR entre mascotas (R2, R9/R12/R15), máximo de 5
  (R6), nombre duplicado (R7), no-op de `PATCH` vacío (R13).
- `docs/data-model.md`, `docs/wialon-module.md` — R26.
- `progress/impl_geofences-crud.md` — reporte del implementer;
  `specs/geofences-crud/traceability.md` — completado por el implementer.

Sin dependencias nuevas (`uuidv7`, `zod`, `drizzle-orm` ya están instalados)
y sin variables de entorno nuevas.

## Alternativas descartadas

- **Permitir `type: 'safe_polygon'` en el CRUD ya en esta feature**:
  descartado (**D1**) — el plan 007 paso 1-2 y la description de
  `feature_list.json` dicen explícitamente "MVP type=safe_circle"; nada pide
  todavía un editor de vértices ni la validación de un polígono simple (no
  auto-intersectante) en el cliente.
- **Tabla `geofence_states` separada (`pet_id, geofence_id, state,
  updated_at`)**: descartada (**D2**) — `geofences.pet_id` ya fija la
  mascota; una tabla aparte solo añadiría un JOIN sin resolver ningún caso
  nuevo (a diferencia de `pet_devices`, que sí necesita historial de varias
  filas por par).
- **`evaluate()` aceptando la unión `CircleGeometry | PolygonGeometry`**:
  descartado (**D1**, **D3**) — la histéresis de polígono no está definida
  por esta feature; forzar el tipo a `CircleGeometry` evita implementar una
  rama a medias que nadie puede ejercitar todavía.
- **Sin restricción de nombre duplicado**: descartada (**D5**) — un family
  viendo dos geocercas "Casa" sin poder distinguirlas es peor UX que un
  `409` al crear.
- **Trigger de Postgres para el máximo de 5**: descartado (**D5**) — el
  proyecto no tiene precedente de triggers; un `COUNT` en el use case es la
  misma técnica que el resto del código ya usa para reglas de negocio, con
  una carrera documentada y aceptada (`ponytail`).
- **`MAX_GEOFENCES_REACHED` como `409`**: descartado pese a ser más
  "correcto" en términos REST — el criterio de aceptación de
  `feature_list.json` pide `400` explícitamente para la sexta geocerca.
- **Ampliar `GeofenceRepository` con un método `updateState` para que #12
  persista `evaluate()`**: descartado — ningún caso de uso de esta feature
  lo llama; mismo criterio que D1 de trips-activity (no reabrir/adivinar un
  contrato para un consumidor que todavía no existe). #12 decidirá su propio
  mecanismo de lectura/escritura de estado cuando se implemente.
- **`?active=` o `?type=` en el `GET` de listado**: descartado — nadie lo
  pidió, el cliente ya recibe el flag `active` por fila y puede filtrar del
  lado del cliente.
- **Extender `PetAccessGuard` o `PetRepository` para las necesidades de este
  módulo**: descartado — este módulo no necesita nada que el guard no
  provea ya vía `request.petMembership`; no hay razón para tocar contratos
  cerrados de #5.
