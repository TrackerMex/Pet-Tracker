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

## Estructura de módulo en NestJS + TypeScript + pnpm + LocalStack (AWS local)

<!-- Rellenar con la convención de carpetas/archivos real de este proyecto,
     análoga a la de la sección "Estructura de módulo" del framework elegido.
     Ejemplo de estructura genérica esperada por capa: -->

```
<module>/
├── domain/
│   ├── entities/
│   └── repositories/       ← interfaces, sin implementación
├── application/
│   ├── dto/
│   └── use-cases/
└── infrastructure/
    ├── entities/           ← modelos del ORM/DB concreto
    ├── repositories/       ← implementación de las interfaces de domain
    └── controller/ o handlers/
```

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
