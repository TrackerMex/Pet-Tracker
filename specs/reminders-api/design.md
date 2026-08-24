---
feature: "reminders-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Diseño — [[reminders-api]]

> Ver [[requirements]] (R1–R3) y `docs/architecture.md` para las capas.
> Feature 100% backend; nace del gate humano de #39 (listado y borrado
> real fuera de la feature móvil).

## Decisiones técnicas

- **D1 — GET devuelve todos los status, orden `dueAt` asc, sin
  paginación**: la UI de #39 necesita los inactivos (pills
  Active/This week/Inactive y filas atenuadas del diseño). El volumen por
  mascota es de decenas como mucho — paginar sería YAGNI. Orden en SQL
  (no en el use case) porque el repo ya ordena así en `findDue`. Sirve a R1.

- **D2 — DELETE duro es seguro sin limpieza externa** (verificado
  2026-08-24): el despacho es un interval in-process
  (`RemindersSchedulerService`) que llama
  `RemindersDispatchService.dispatchOnce()` → `findDue()` → SQS.
  `scheduleName` es un metadato de fila, NO un recurso de EventBridge: no
  hay nada que des-provisionar al borrar. Carrera aceptada: si el borrado
  ocurre entre `findDue` y el envío a SQS puede salir un mensaje huérfano y
  el `markEnqueued` posterior actualiza 0 filas sin lanzar — mismo
  comportamiento tolerante que ya tiene `markSent` (`where status =
  'scheduled'`). No se añade lock. Sirve a R2.
  <!-- ponytail: mensaje SQS huérfano posible en la ventana de despacho;
       transacción findDue+enqueue si alguna vez importa. -->

- **D3 — Firmas exactas** (para el handoff a Codex):
  ```ts
  // domain/repositories/reminder.repository.ts (añadir a la interface)
  listByPet(petId: string): Promise<Reminder[]>;
  deleteByPetAndId(petId: string, id: string): Promise<boolean>;

  // application/use-cases/list-reminders.use-case.ts (nuevo)
  @Injectable()
  export class ListRemindersUseCase {
    constructor(@Inject(REMINDER_REPOSITORY) private readonly reminders: ReminderRepository) {}
    execute(petId: string): Promise<Reminder[]>;   // delega en listByPet
  }

  // application/use-cases/delete-reminder.use-case.ts (nuevo)
  @Injectable()
  export class DeleteReminderUseCase {
    constructor(@Inject(REMINDER_REPOSITORY) private readonly reminders: ReminderRepository) {}
    async execute(petId: string, reminderId: string): Promise<void>;
    // deleteByPetAndId === false → throw new ReminderNotFoundError(reminderId)
  }

  // infrastructure/reminders.controller.ts — PetRemindersController (añadir)
  @Get()
  async list(@Req() request: PetAccessRequest): Promise<ReminderResponse[]>;
  // → (await this.listReminders.execute(request.petMembership.petId)).map(toReminderResponse)

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePetRole('owner')
  async remove(@Req() request: PetAccessRequest, @Param('id') id: string): Promise<void>;
  // id !UUID_PATTERN → throw new NotFoundException();
  // try { await this.deleteReminder.execute(petMembership.petId, id) }
  // catch (e) { throw mapReminderError(e) }
  ```
  El constructor de `PetRemindersController` pasa a inyectar los tres use
  cases (create + list + delete); `reminders.module.ts` registra los dos
  nuevos en `providers`. `UUID_PATTERN` ya existe en el archivo del
  controller — se reutiliza, no se duplica.

- **D4 — Ruta anidada `DELETE /pets/:petId/reminders/:id`** (no
  `DELETE /reminders/:id` plano): reutiliza `PetAccessGuard` +
  `@RequirePetRole('owner')` declarativos en vez de re-verificar membresía
  a mano en el use case como hace el PATCH plano. Es el patrón de
  `vaccines.controller.ts` y el que la spec de #39 consume. El PATCH plano
  existente no se migra (fuera de alcance).

- **D5 — Sin DTO nuevo ni cambio de mapper/errores**: GET y DELETE no
  tienen body; se reutilizan `ReminderResponse`, `toReminderResponse`,
  `ReminderNotFoundError` y `mapReminderError` tal cual.

## Archivos afectados

Todo en `backend-pet-tracker/`, capas indicadas:

- `src/modules/reminders/domain/repositories/reminder.repository.ts` —
  añade `listByPet` y `deleteByPetAndId` a la interface (domain).
- `src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts`
  — implementa ambos (infrastructure).
- `src/modules/reminders/application/use-cases/list-reminders.use-case.ts`
  + `.spec.ts` — nuevos (application).
- `src/modules/reminders/application/use-cases/delete-reminder.use-case.ts`
  + `.spec.ts` — nuevos (application).
- `src/modules/reminders/infrastructure/reminders.controller.ts` —
  `@Get()` y `@Delete(':id')` en `PetRemindersController`
  (infrastructure).
- `src/modules/reminders/reminders.module.ts` — registra los dos use
  cases.
- `test/pet-reminders.e2e-spec.ts` — casos R1/R2 (solo adiciones).

## Alternativas descartadas

- **Soft-delete (status `cancelled`)**: era el default de la spec inicial
  de #39; el humano pidió borrado real en el gate (2026-08-24).
- **`DELETE /reminders/:id` plano** como el PATCH: obliga a duplicar la
  verificación de membresía/rol en el use case; la ruta anidada la da el
  guard (D4).
- **Filtro `?status=` y paginación**: YAGNI (D1).
- **Limpieza de EventBridge al borrar**: no existe tal recurso — el
  scheduler es in-process (D2).
