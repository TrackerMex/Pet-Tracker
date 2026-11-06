import { X509Certificate } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { MIGRATIONS_FOLDER } from './db/migrate';
function readOrEmpty(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
function parseDockerfile(raw: string) {
  const firstLine = raw.split('\n')[0];
  const lines = raw
    .replace(/\\\r?\n/g, ' ')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.replace(/\s+/g, ' '));
  const stages: string[][] = [];
  for (const line of lines) {
    if (line.startsWith('FROM ')) stages.push([line]);
    else stages[stages.length - 1]?.push(line);
  }
  return { firstLine, lines, stages };
}
const docker = parseDockerfile(
  readOrEmpty(join(__dirname, '..', 'Dockerfile')),
);
function stage(name: string): string[] {
  return docker.stages.find((lines) => lines[0].endsWith(` AS ${name}`)) ?? [];
}
function ordered(lines: string[], expected: string[]): void {
  let previous = -1;
  for (const line of expected) {
    const index = lines.indexOf(line);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeGreaterThan(previous);
    previous = index;
  }
}
describe('R16: Dockerfile multi-etapa sin herramientas de build ni root', () => {
  it('R16: la primera línea es # syntax=docker/dockerfile:1', () => {
    expect(docker.firstLine).toBe('# syntax=docker/dockerfile:1');
  });
  it('R16: tres etapas deps, build y runtime sobre node:24-bookworm-slim, sin --platform', () => {
    expect(docker.lines.filter((line) => line.startsWith('FROM '))).toEqual([
      'FROM node:24-bookworm-slim AS deps',
      'FROM node:24-bookworm-slim AS build',
      'FROM node:24-bookworm-slim AS runtime',
    ]);
  });
  it('R16: cada etapa fija WORKDIR /app antes de su primer COPY', () => {
    expect(docker.stages).toHaveLength(3);
    for (const lines of docker.stages) {
      expect(lines).toContain('WORKDIR /app');
      const copy = lines.findIndex((line) => line.startsWith('COPY '));
      expect(copy).toBeGreaterThan(lines.indexOf('WORKDIR /app'));
    }
  });
  it('R16: deps instala solo dependencias de producción con el lockfile congelado', () => {
    ordered(stage('deps'), [
      'RUN npm install -g pnpm@10',
      'COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./',
      'RUN pnpm install --prod --frozen-lockfile',
    ]);
  });
  it('R16: build instala todo, copia el contexto y compila', () => {
    ordered(stage('build'), [
      'RUN npm install -g pnpm@10',
      'COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./',
      'RUN pnpm install --frozen-lockfile',
      'COPY . .',
      'RUN pnpm build',
    ]);
  });
  it('R16: runtime no tiene RUN y solo copia desde otras etapas', () => {
    const runtime = stage('runtime');
    expect(runtime).toContain(
      'COPY --from=deps /app/node_modules ./node_modules',
    );
    expect(runtime).toContain('COPY --from=build /app/dist ./dist');
    expect(runtime.some((line) => line.startsWith('RUN '))).toBe(false);
    expect(
      runtime
        .filter((line) => line.startsWith('COPY '))
        .every((line) => line.startsWith('COPY --from=')),
    ).toBe(true);
    expect(
      runtime.filter(
        (line) => line.startsWith('COPY ') && line.includes('node_modules'),
      ),
    ).toEqual(['COPY --from=deps /app/node_modules ./node_modules']);
  });
  it('R16: runtime fija NODE_ENV, expone 3000, corre como node y arranca dist/src/main.js', () => {
    const runtime = stage('runtime');
    expect(runtime).toContain('ENV NODE_ENV=production');
    expect(runtime).toContain('EXPOSE 3000');
    expect(runtime.filter((line) => line.startsWith('USER '))).toEqual([
      'USER node',
    ]);
    const lastCopy = runtime.reduce(
      (last, line, index) => (/^(COPY|ADD) /.test(line) ? index : last),
      -1,
    );
    expect(runtime.indexOf('USER node')).toBeGreaterThan(lastCopy);
    expect(runtime.at(-1)).toBe('CMD ["node", "dist/src/main.js"]');
  });
  it('R16: hay tres etapas y ninguna línea es ENTRYPOINT', () => {
    expect(docker.stages).toHaveLength(3);
    expect(docker.lines.some((line) => /^ENTRYPOINT(?:\s|$)/.test(line))).toBe(
      false,
    );
  });
});

function pemBlocks(raw: string): string[] {
  return (
    raw.match(
      /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g,
    ) ?? []
  );
}
describe('R17: la etapa runtime trae el bundle de CA de RDS versionado', () => {
  it('R17: certs/rds-global-bundle.pem es un bundle X.509 que cubre us-east-2 y mx-central-1', () => {
    const blocks = pemBlocks(
      readOrEmpty(join(__dirname, '..', 'certs', 'rds-global-bundle.pem')),
    );
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks)
      expect(() => new X509Certificate(block)).not.toThrow();
    const subjects = blocks.map((block) => new X509Certificate(block).subject);
    expect(subjects.some((subject) => subject.includes('us-east-2'))).toBe(
      true,
    );
    expect(subjects.some((subject) => subject.includes('mx-central-1'))).toBe(
      true,
    );
  });
  it('R17: runtime copia el PEM con 0444 y NODE_EXTRA_CA_CERTS apunta a su destino, ambos antes de USER', () => {
    const runtime = stage('runtime');
    const copy =
      'COPY --from=build --chmod=0444 /app/certs/rds-global-bundle.pem /etc/ssl/certs/rds-global-bundle.pem';
    const env = 'ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/rds-global-bundle.pem';
    expect(runtime).toContain(copy);
    expect(runtime).toContain(env);
    expect(runtime.indexOf(copy)).toBeLessThan(runtime.indexOf('USER node'));
    expect(runtime.indexOf(env)).toBeLessThan(runtime.indexOf('USER node'));
    const foundCopy = runtime.find(
      (line) =>
        line.startsWith('COPY ') && line.includes('rds-global-bundle.pem'),
    );
    const foundEnv = runtime.find((line) =>
      line.startsWith('ENV NODE_EXTRA_CA_CERTS='),
    );
    expect(foundEnv?.split('=')[1]).toBe(foundCopy?.split(' ').at(-1));
  });
  it('R17: ninguna instrucción ADD descarga de una URL', () => {
    expect(stage('runtime')).toContain(
      'COPY --from=build --chmod=0444 /app/certs/rds-global-bundle.pem /etc/ssl/certs/rds-global-bundle.pem',
    );
    expect(docker.lines.some((line) => /^ADD\s.*https?:\/\//.test(line))).toBe(
      false,
    );
  });
});

describe('R18: las migraciones viajan junto a migrate.js', () => {
  it('R18: runtime copia src/db/migrations a dist/src/db/migrations, que es MIGRATIONS_FOLDER compilado', () => {
    expect(stage('runtime')).toContain(
      'COPY --from=build /app/src/db/migrations ./dist/src/db/migrations',
    );
    expect(relative(__dirname, MIGRATIONS_FOLDER)).toBe(
      join('db', 'migrations'),
    );
  });
});

function ignoreLines(): string[] {
  return readOrEmpty(join(__dirname, '..', '.dockerignore'))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}
describe('R19: ningún .env entra en la imagen', () => {
  it('R19: .dockerignore excluye .env, node_modules, dist y coverage, y el Dockerfile no nombra .env', () => {
    expect(ignoreLines()).toEqual(
      expect.arrayContaining([
        '**/.env',
        '**/.env.*',
        'node_modules',
        'dist',
        'coverage',
      ]),
    );
    expect(docker.lines.some((line) => line.includes('.env'))).toBe(false);
  });
  it('R19: .dockerignore no excluye el PEM de R17', () => {
    const lines = ignoreLines();
    expect(lines).toContain('**/.env');
    expect(
      lines.some((line) => line.includes('certs') || line.includes('pem')),
    ).toBe(false);
  });
});

function packageScripts(): Record<string, string> {
  return (
    JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    }
  ).scripts;
}
describe('R20: start:prod arranca el main compilado', () => {
  it('R20: scripts.start:prod es node dist/src/main.js', () => {
    expect(packageScripts()['start:prod']).toBe('node dist/src/main.js');
  });
});

describe('R21: provision-device y set-device-subscription sin dotenv en código', () => {
  it('R21: ninguno de los dos scripts contiene dotenv', () => {
    for (const file of ['provision-device.ts', 'set-device-subscription.ts']) {
      const source = readFileSync(
        join(__dirname, '..', 'scripts', file),
        'utf8',
      );
      expect(source).toContain('parseArgs');
      expect(source).not.toContain('dotenv');
    }
  });
  it('R21: provision:device y subscription:set cargan ../.env con --env-file-if-exists', () => {
    expect(packageScripts()['provision:device']).toBe(
      'node --env-file-if-exists=../.env -r ts-node/register -r tsconfig-paths/register scripts/provision-device.ts',
    );
    expect(packageScripts()['subscription:set']).toBe(
      'node --env-file-if-exists=../.env -r ts-node/register -r tsconfig-paths/register scripts/set-device-subscription.ts',
    );
  });
});
