import { and, inArray, isNull } from 'drizzle-orm';
import type { DrizzleTx } from '@/db/drizzle-tx';
import { petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { releaseDeviceTx } from '@/modules/devices/infrastructure/repositories/release-device.tx';

export async function deletePetsTx(
  tx: DrizzleTx,
  petIds: readonly string[],
): Promise<void> {
  if (petIds.length === 0) return;
  const assignments = await tx
    .select({ id: petDevices.id, deviceId: petDevices.deviceId })
    .from(petDevices)
    .where(
      and(inArray(petDevices.petId, petIds), isNull(petDevices.releasedAt)),
    );
  for (const assignment of assignments)
    await releaseDeviceTx(tx, assignment.id, assignment.deviceId);
  await tx.delete(pets).where(inArray(pets.id, petIds));
}
