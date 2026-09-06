import { config as loadDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// NOTE (accepted exception to R6): drizzle-kit runs as a standalone CLI tool
// outside the NestJS/ConfigService runtime, so ConfigService is not
// available here. Reading `process.env.DATABASE_URL` directly in this file
// is the one documented exception to "always use ConfigService.get(...)"
// (see specs/db-setup-drizzle/design.md, "Alternativas descartadas"). No
// other file under src/** may read process.env.DATABASE_URL directly — see
// the R6 static check in src/db/database-url-source.spec.ts.
//
// Because it runs outside Nest, nothing loads the root `.env` for it: this
// file loads it explicitly with dotenv (same pattern as
// scripts/provision-local.ts, relative to the `backend-pet-tracker/` cwd from
// which `pnpm db:migrate` runs) and aborts if DATABASE_URL is still missing,
// instead of letting drizzle-kit connect with an empty string.
loadDotenv({ path: '../.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Falta DATABASE_URL: drizzle-kit la lee del .env de la raíz del repo ' +
      '(../.env desde backend-pet-tracker/). Copia .env.example a .env en la ' +
      'raíz — ahí está el valor local — o exporta DATABASE_URL antes de correr ' +
      'pnpm db:migrate.',
  );
}

export default defineConfig({
  schema: 'src/db/schema/index.ts',
  out: 'src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
