import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

describe('R1: build/test toolchain has drizzle-orm and pg available', () => {
  it('resolves drizzle-orm/node-postgres and pg as installed dependencies', () => {
    expect(drizzle).toBeDefined();
    expect(Pool).toBeDefined();
  });
});
