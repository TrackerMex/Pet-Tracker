import { eq } from 'drizzle-orm';
import type { DrizzleTx } from '@/db/drizzle-tx';
import { devices, petDevices } from '@/db/schema/devices.schema';

export async function releaseDeviceTx(
  tx: DrizzleTx,
  assignmentId: string,
  deviceId: string,
): Promise<void> {
  await tx
    .update(petDevices)
    .set({ releasedAt: new Date() })
    .where(eq(petDevices.id, assignmentId));
  await tx
    .update(devices)
    .set({ status: 'available', updatedAt: new Date() })
    .where(eq(devices.id, deviceId));
}
