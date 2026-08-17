import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { AppModule } from '@/app.module';
import { seedSimulatedDevices } from '../scripts/seed-devices';

describe('Device subscriptions (e2e)', () => {
  let app: INestApplication;
  let db: NodePgDatabase;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    db = app.get<NodePgDatabase>(DRIZZLE);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('R1 (device-subscriptions #25): device_subscriptions schema', () => {
    it('has the exact columns, primary key, foreign key and checks', async () => {
      const columns = await db.execute<{
        column_name: string;
        data_type: string;
        is_nullable: 'YES' | 'NO';
      }>(sql`
        select column_name, data_type, is_nullable
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'device_subscriptions'
        order by ordinal_position
      `);

      expect(columns.rows).toEqual([
        { column_name: 'device_id', data_type: 'uuid', is_nullable: 'NO' },
        {
          column_name: 'status',
          data_type: 'character varying',
          is_nullable: 'NO',
        },
        {
          column_name: 'plan_code',
          data_type: 'character varying',
          is_nullable: 'NO',
        },
        {
          column_name: 'current_period_end',
          data_type: 'timestamp with time zone',
          is_nullable: 'NO',
        },
        {
          column_name: 'created_at',
          data_type: 'timestamp with time zone',
          is_nullable: 'NO',
        },
        {
          column_name: 'updated_at',
          data_type: 'timestamp with time zone',
          is_nullable: 'NO',
        },
      ]);

      const constraints = await db.execute<{
        constraint_name: string;
        constraint_type: string;
        definition: string;
      }>(sql`
        select
          con.conname as constraint_name,
          con.contype as constraint_type,
          pg_get_constraintdef(con.oid) as definition
        from pg_constraint con
        join pg_class rel on rel.oid = con.conrelid
        join pg_namespace nsp on nsp.oid = rel.relnamespace
        where nsp.nspname = 'public'
          and rel.relname = 'device_subscriptions'
        order by con.conname
      `);

      expect(constraints.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            constraint_type: 'p',
            definition: 'PRIMARY KEY (device_id)',
          }),
          expect.objectContaining({
            constraint_type: 'f',
            definition: expect.stringMatching(
              /^FOREIGN KEY \(device_id\) REFERENCES devices\(id\)$/,
            ),
          }),
          expect.objectContaining({
            constraint_name: 'device_subscriptions_status_check',
            constraint_type: 'c',
          }),
          expect.objectContaining({
            constraint_name: 'device_subscriptions_plan_code_check',
            constraint_type: 'c',
          }),
        ]),
      );
    });
  });

  describe('R17 (device-subscriptions #25): grandfather existing devices', () => {
    it('backfills every device present when the migration runs', async () => {
      const missing = await db.execute<{ count: string }>(sql`
        select count(*)::text as count
        from devices d
        left join device_subscriptions s on s.device_id = d.id
        where s.device_id is null
      `);

      expect(missing.rows[0].count).toBe('0');
    });

    it('seeds one idempotent grandfathered subscription per simulated device', async () => {
      await seedSimulatedDevices(db);
      await seedSimulatedDevices(db);

      const subscriptions = await db.execute<{
        esn: string;
        status: string;
        plan_code: string;
        current_period_end: Date;
      }>(sql`
        select d.esn, s.status, s.plan_code, s.current_period_end
        from devices d
        inner join device_subscriptions s on s.device_id = d.id
        where d.esn in ('SIM-001', 'SIM-002', 'SIM-003')
        order by d.esn
      `);

      expect(subscriptions.rows).toHaveLength(3);
      expect(
        subscriptions.rows.map(({ esn, status, plan_code }) => ({
          esn,
          status,
          plan_code,
        })),
      ).toEqual([
        { esn: 'SIM-001', status: 'active', plan_code: 'grandfathered' },
        { esn: 'SIM-002', status: 'active', plan_code: 'grandfathered' },
        { esn: 'SIM-003', status: 'active', plan_code: 'grandfathered' },
      ]);
      expect(
        subscriptions.rows.every(
          ({ current_period_end }) =>
            new Date(current_period_end).toISOString() ===
            '2099-12-31T00:00:00.000Z',
        ),
      ).toBe(true);
    });
  });
});
