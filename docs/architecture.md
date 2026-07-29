# Architecture — pet-tracker

> Este documento define qué significa "buen código" en este proyecto.
> Es la referencia obligatoria antes de implementar cualquier feature.

---

## Patrón base: Clean Architecture

Cada módulo/feature está dividido en 3 capas con dependencias unidireccionales:

```
domain (núcleo) ← application (casos de uso) ← infrastructure (ORM, HTTP, IO)
```

**Regla de dependencia**: siempre hacia adentro. La capa interna NO conoce a
las capas externas.

| Capa | Contiene | Reglas |
|---|---|---|
| `domain` | Entidades puras del negocio | Sin imports de ningún framework, ORM ni librería de infraestructura |
| `application` | Casos de uso / DTOs | Depende solo de interfaces definidas en `domain`, nunca de una implementación concreta |
| `infrastructure` | ORM, HTTP, colas, filesystem, integraciones externas | Implementa las interfaces de `domain`; es el único lugar que conoce el framework/ORM |

- El `domain` no sabe que existe una base de datos concreta.
- La `application` no sabe que existe un framework HTTP concreto.
- La `infrastructure` es reemplazable sin tocar `domain` ni `application`
  (ej: cambiar de PostgreSQL a MongoDB no debería tocar los casos de uso).

---

## Estructura de módulo en este proyecto (NestJS + Drizzle)

Persistencia: **PostgreSQL + Drizzle ORM** (ver `docs/data-model.md` para la
decisión). El schema Drizzle es infraestructura compartida: vive en
`src/db/schema/`, un archivo por módulo, porque `drizzle-kit` necesita un punto
de entrada único para generar migraciones.

```
backend-pet-tracker/src/
├── db/                                  ← infraestructura Drizzle compartida
│   ├── schema/
│   │   ├── index.ts                     ← barrel; drizzle.config.ts apunta aquí
│   │   └── <module>.schema.ts           ← pgTable(...) del módulo
│   ├── migrations/                      ← generadas por drizzle-kit, versionadas
│   └── drizzle.module.ts                ← provee pg Pool + cliente drizzle (token DRIZZLE)
│
└── modules/<feature>/
    ├── domain/
    │   ├── entities/<nombre>.entity.ts        ← clase pura, sin imports de framework/ORM
    │   ├── errors/<nombre>.errors.ts          ← errores de dominio tipados, sin @nestjs/common
    │   └── repositories/<nombre>.repository.ts ← interface + token de inyección
    ├── application/
    │   ├── dto/                               ← class-validator
    │   └── use-cases/<accion>-<nombre>.use-case.ts
    ├── infrastructure/
    │   ├── repositories/<nombre>.drizzle.repository.ts ← implementa la interface
    │   └── <nombre>.controller.ts             ← HTTP; mapea errores de dominio → HttpException
    └── <feature>.module.ts
```

Notas:
- `<module>.schema.ts` es la única pieza del módulo que vive fuera de su
  carpeta — es el precio de las migraciones centralizadas de drizzle-kit.
- El repositorio Drizzle convierte filas ↔ entidades de dominio; si la
  conversión crece, extraer `mappers/`.

---

## Decisiones de arquitectura

**Por qué domain sin decoradores/anotaciones de framework:**
Las entidades de dominio representan conceptos de negocio, no registros de
base de datos. Si cambia el motor de persistencia, el domain no debe cambiar.

**Por qué application depende de interfaces:**
Permite sustituir la implementación (ORM, servicio externo, mock de test) sin
tocar la lógica de negocio.

**Por qué casos de uso de responsabilidad única en lugar de servicios genéricos:**
Cada caso de uso hace una sola cosa. Es más testeable y más fácil de razonar.

**Por qué PostgreSQL + Drizzle:**
Workload de dominio relacional; Postgres es el default de menor riesgo.
Drizzle por ser SQL-first y ligero: el schema TypeScript espeja el DDL casi
1:1, drizzle-kit genera migraciones versionadas, y el cliente queda confinado
a `infrastructure`. La telemetría GPS va a DynamoDB (ver `docs/data-model.md`).

## Adaptación local de la arquitectura del plan

La arquitectura objetivo es la serverless AWS de `plans/README.md` (API
Gateway → Lambda NestJS, SQS, EventBridge, DynamoDB, Scheduler). **En local no
usamos AWS real**: todo corre contra Docker + LocalStack community. Mapa de
equivalencias:

| Plan (AWS real) | Local | Nota |
|---|---|---|
| Lambda NestJS + API Gateway | NestJS como servidor HTTP normal | Mismo monolito modular; serverless-express se añade solo al desplegar |
| Cognito | **Auth propia** (JWT + hash) | Cognito no existe en LocalStack community. El guard conserva el contrato (`@CurrentUser()`, `@Public()`) para swap futuro |
| Aurora Serverless v2 | Postgres 17 en Docker | Misma SQL; cambia solo la connection string |
| DynamoDB `positions` | DynamoDB en LocalStack | Idéntico (endpoint desde `AWS_ENDPOINT_URL`) |
| SQS / EventBridge | SQS / EventBridge en LocalStack | Idéntico |
| Lambda poller/processor/engine/notifier | Workers en el mismo proceso NestJS: cron de `@nestjs/schedule` + consumidores SQS (`src/workers/`) | La lógica vive en funciones puras (`src/pipeline/`) — portarla a Lambdas después es empaquetado, no reescritura |
| EventBridge Scheduler (recordatorios) | No disponible en community — mecanismo local decidido en la spec de `pet-reminders` | Deviación documentada; el plan 008 vuelve a aplicar al desplegar |
| Expo Push real | `PUSH_ENABLED=false` (log estructurado) | El notifier queda cableado; push real requiere build EAS |

Regla: **ningún código apunta a AWS real** — todo cliente AWS SDK se
construye con `AWS_ENDPOINT_URL` del env.

---

## Apéndice ilustrativo: ejemplo NestJS + TypeORM

> Esta sección es un ejemplo concreto de cómo se ve la Clean Architecture
> anterior aplicada a NestJS + TypeORM. Se conserva como referencia
> ilustrativa — **no** es la estructura de este proyecto salvo que el stack
> elegido sea efectivamente NestJS.

```
src/modules/<nombre>/
├── domain/
│   ├── entities/
│   │   └── <nombre>.entity.ts       ← Clase pura. Solo propiedades y lógica de dominio.
│   │                                   SIN imports de TypeORM, SIN decoradores.
│   └── repositories/
│       └── <nombre>.repository.ts   ← Interface TypeScript. Define el contrato.
│                                       SIN implementación, SIN TypeORM.
│
├── application/
│   ├── dto/
│   │   ├── create-<nombre>.dto.ts   ← Validación de entrada (class-validator).
│   │   └── update-<nombre>.dto.ts   ← Campos opcionales para PATCH.
│   └── use-cases/
│       └── <accion>-<nombre>.usecase.ts  ← Lógica de negocio. Depende de la interface
│                                            del repositorio, nunca de la implementación.
│
├── infrastructure/
│   ├── entities/
│   │   └── <nombre>.orm-entity.ts   ← @Entity de TypeORM. Solo persistencia.
│   ├── repositories/
│   │   └── <nombre>.typeorm.repository.ts ← Implementa la interface del domain.
│   ├── mappers/                     (opcional, si la conversión es compleja)
│   │   └── <nombre>.mapper.ts       ← Convierte OrmEntity ↔ DomainEntity
│   └── controller/
│       └── <nombre>.controller.ts   ← HTTP layer. Sin lógica de negocio.
│                                       Llama use-cases, devuelve respuestas.
│
└── <nombre>.module.ts               ← Registra providers. Usa tokens string.
```

```typescript
// domain/entities/booking.entity.ts — entidad pura
export class Booking {
  constructor(
    public readonly id: number | null,
    public roomId: number,
    public status: 'pending' | 'confirmed' | 'cancelled',
  ) {}

  isActive(): boolean {
    return this.status !== 'cancelled';
  }
}

// domain/repositories/booking.repository.ts — interface, sin implementación
export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: number): Promise<Booking | null>;
}

// application/use-cases/create-booking.usecase.ts — depende de la interface
@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject('BookingRepository')   // el token debe coincidir con module.ts
    private readonly bookingRepo: BookingRepository,
  ) {}

  async execute(payload: CreateBookingDto): Promise<Booking> {
    const booking = new Booking(null, payload.roomId, 'pending');
    return this.bookingRepo.create(booking);
  }
}

// booking.module.ts — el token 'BookingRepository' debe ser IDÉNTICO al @Inject
@Module({
  providers: [
    CreateBookingUseCase,
    { provide: 'BookingRepository', useClass: BookingTypeOrmRepository },
  ],
})
export class BookingModule {}
```
