import { parseArgs } from 'node:util';
import { config as loadDotenv } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { devices } from '@/db/schema/devices.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import {
  DEVICE_SUBSCRIPTION_PLAN_CODES,
  DEVICE_SUBSCRIPTION_STATUSES,
  DeviceSubscriptionPlanCode,
  DeviceSubscriptionStatus,
} from '@/modules/subscriptions/domain/subscription.constants';
import { SubscriptionDrizzleRepository } from '@/modules/subscriptions/infrastructure/repositories/subscription.drizzle.repository';

const DEFAULT_PERIOD_DAYS = 30;

export interface SetDeviceSubscriptionInput {
  deviceId?: string;
  unitId?: string;
  status?: string;
  planCode?: string;
  periodEnd?: string;
}

export interface SetDeviceSubscriptionResult {
  deviceId: string;
  status: DeviceSubscriptionStatus;
  planCode: DeviceSubscriptionPlanCode;
  currentPeriodEnd: Date;
  entitled: boolean;
  watermarkReset: boolean;
}

export async function setDeviceSubscription(
  db: NodePgDatabase,
  input: SetDeviceSubscriptionInput,
): Promise<SetDeviceSubscriptionResult> {
  if (!input.deviceId && !input.unitId) {
    throw new Error('provide --device-id or --unit-id');
  }
  if (input.deviceId && input.unitId) {
    throw new Error('provide only one of --device-id or --unit-id');
  }

  const status = input.status ?? 'active';
  if (
    !DEVICE_SUBSCRIPTION_STATUSES.includes(status as DeviceSubscriptionStatus)
  ) {
    throw new Error(`invalid --status: ${status}`);
  }

  const planCode = input.planCode ?? 'track_monthly';
  if (
    !DEVICE_SUBSCRIPTION_PLAN_CODES.includes(
      planCode as DeviceSubscriptionPlanCode,
    )
  ) {
    throw new Error(`invalid --plan: ${planCode}`);
  }

  const now = new Date();
  const currentPeriodEnd = input.periodEnd
    ? new Date(input.periodEnd)
    : new Date(now.getTime() + DEFAULT_PERIOD_DAYS * 24 * 60 * 60_000);
  if (Number.isNaN(currentPeriodEnd.getTime())) {
    throw new Error(`invalid --period-end: ${input.periodEnd}`);
  }

  const [device] = await db
    .select({ id: devices.id })
    .from(devices)
    .where(
      input.deviceId
        ? eq(devices.id, input.deviceId)
        : eq(devices.wialonUnitId, input.unitId as string),
    )
    .limit(1);
  if (!device) {
    const selector = input.deviceId ? '--device-id' : '--unit-id';
    throw new Error(`device not found for ${selector}`);
  }

  await db
    .insert(deviceSubscriptions)
    .values({
      deviceId: device.id,
      status: status as DeviceSubscriptionStatus,
      planCode: planCode as DeviceSubscriptionPlanCode,
      currentPeriodEnd,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: deviceSubscriptions.deviceId,
      set: {
        status: status as DeviceSubscriptionStatus,
        planCode: planCode as DeviceSubscriptionPlanCode,
        currentPeriodEnd,
        updatedAt: now,
      },
    });

  const entitled = await new SubscriptionDrizzleRepository(db).isDeviceEntitled(
    device.id,
  );

  return {
    deviceId: device.id,
    status: status as DeviceSubscriptionStatus,
    planCode: planCode as DeviceSubscriptionPlanCode,
    currentPeriodEnd,
    entitled,
    watermarkReset: false,
  };
}

async function main(): Promise<void> {
  loadDotenv({ path: '../.env' });
  const { values } = parseArgs({
    args: process.argv.slice(2).filter((arg) => arg !== '--'),
    options: {
      'device-id': { type: 'string' },
      'unit-id': { type: 'string' },
      status: { type: 'string' },
      plan: { type: 'string' },
      'period-end': { type: 'string' },
    },
  });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const result = await setDeviceSubscription(drizzle(pool), {
      deviceId: values['device-id'],
      unitId: values['unit-id'],
      status: values.status,
      planCode: values.plan,
      periodEnd: values['period-end'],
    });
    console.log(
      `subscription:set deviceId=${result.deviceId} status=${result.status} planCode=${result.planCode} currentPeriodEnd=${result.currentPeriodEnd.toISOString()} entitled=${result.entitled} watermarkReset=${result.watermarkReset}`,
    );
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error('subscription:set failed:', error);
    process.exitCode = 1;
  });
}
