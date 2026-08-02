import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { pets } from '@/db/schema/pets.schema';
import type { LastPositionReader } from '@/modules/positions/domain/repositories/last-position.reader';

/**
 * Cache `pets.last_position` (R3). Un unico SELECT de la columna jsonb, sin
 * traer la fila entera: la ruta del mapa la consulta por polling cada 15 s
 * por mascota. Devuelve el valor crudo — quien decide si es utilizable es el
 * caso de uso (R5).
 */
@Injectable()
export class LastPositionDrizzleReader implements LastPositionReader {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async findLastPosition(petId: string): Promise<unknown> {
    const rows = await this.db
      .select({ lastPosition: pets.lastPosition })
      .from(pets)
      .where(eq(pets.id, petId))
      .limit(1);

    return rows[0]?.lastPosition ?? null;
  }
}
