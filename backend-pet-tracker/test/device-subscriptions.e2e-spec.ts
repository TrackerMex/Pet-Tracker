import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { AppModule } from '@/app.module';

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
});
