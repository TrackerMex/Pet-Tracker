import { defineConfig } from 'drizzle-kit';

// NOTE (accepted exception to R6): drizzle-kit runs as a standalone CLI tool
// outside the NestJS/ConfigService runtime, so ConfigService is not
// available here. Reading `process.env.DATABASE_URL` directly in this file
// is the one documented exception to "always use ConfigService.get(...)"
// (see specs/db-setup-drizzle/design.md, "Alternativas descartadas"). No
// other file under src/** may read process.env.DATABASE_URL directly — see
// the R6 static check in src/db/database-url-source.spec.ts.
export default defineConfig({
  schema: 'src/db/schema/index.ts',
  out: 'src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
