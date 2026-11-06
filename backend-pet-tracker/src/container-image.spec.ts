import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
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
