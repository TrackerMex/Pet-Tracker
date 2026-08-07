import { z } from 'zod';

/**
 * Contrato **congelado** del mensaje de la cola `notifications` (#12 R15/D5),
 * consumido tal cual: sin envoltorio EventBridge (es un `SendMessageCommand`
 * directo) y sin `type` de alerta — `title`/`body` ya vienen redactados y
 * `data` es el deep-link (R7 y §Fuera de alcance).
 *
 * `z.object` y no `z.strictObject`: `version` literal ya cierra la puerta a
 * un contrato futuro incompatible, y una clave extra añadida por el productor
 * no debe mandar la cola entera a la DLQ. La asimetria con R4/R17
 * (strictObject) es deliberada: alli el input es de un cliente, aqui de otro
 * worker del mismo repo.
 */
export const notificationMessageSchema = z.object({
  version: z.literal(1),
  kind: z.enum(['alert', 'alert_resolved']),
  alertId: z.uuid(),
  petId: z.uuid(),
  title: z.string(),
  body: z.string(),
  data: z.object({
    petId: z.uuid(),
    alertId: z.uuid(),
  }),
});

export type NotificationMessage = z.infer<typeof notificationMessageSchema>;
