export const AUDIT_LOGGER = Symbol('AuditLogger');

export interface AuditLogEntry {
  /** Actor de la accion; null para acciones de sistema sin usuario. */
  userId: string | null;
  /** Accion en formato `<entidad>.<verbo>`, ej. `user.register`. */
  action: string;
  entity: string;
  entityId: string;
  meta?: Record<string, unknown>;
}

/**
 * Puerto de auditoria compartido por todos los modulos (docs/data-model.md,
 * fila `audit_log`). Vive en `src/audit/` y no dentro de un modulo concreto
 * porque la tabla es transversal: auth, pets y devices escriben en ella.
 */
export interface AuditLogger {
  record(entry: AuditLogEntry): Promise<void>;
}
