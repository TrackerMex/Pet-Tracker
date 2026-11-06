import { spawnSync } from 'node:child_process';
function runScript(file: string, args: string[]) {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: 'production',
    DATABASE_URL: 'postgresql://pet:pet@127.0.0.1:1/none-245',
    PGPASSWORD: 'pass-sentinel-245',
    SIM_MODE: 'false',
    WIALON_TOKEN: 'wialon-sentinel-245',
    WIALON_BASE_URL: 'http://127.0.0.1:1/wialon-245',
  };
  for (const key of ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'DB_POOL_MAX'])
    delete env[key];
  return spawnSync(
    process.execPath,
    ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register', file, ...args],
    { cwd: process.cwd(), encoding: 'utf8', env, timeout: 50_000 },
  );
}
describe('R22: los scripts de operación conectan con buildPoolConfig', () => {
  it('R22: provision-device en producción sin PGHOST falla con DatabaseConfigError antes de conectar', () => {
    const result = runScript('scripts/provision-device.ts', [
      '--unit-id',
      'unit-245',
    ]);
    expect(result.error).toBeUndefined();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('DatabaseConfigError');
    expect(result.stderr).toContain('PGHOST');
    expect(result.stderr).not.toContain('ECONNREFUSED');
    expect(result.stdout + result.stderr).not.toContain('pass-sentinel-245');
    expect(result.stdout + result.stderr).not.toContain('wialon-sentinel-245');
  }, 60_000);
  it('R22: set-device-subscription en producción sin PGHOST falla con DatabaseConfigError antes de conectar', () => {
    const result = runScript('scripts/set-device-subscription.ts', [
      '--unit-id',
      'unit-245',
    ]);
    expect(result.error).toBeUndefined();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('DatabaseConfigError');
    expect(result.stderr).toContain('PGHOST');
    expect(result.stderr).not.toContain('ECONNREFUSED');
    expect(result.stdout + result.stderr).not.toContain('pass-sentinel-245');
    expect(result.stdout + result.stderr).not.toContain('wialon-sentinel-245');
  }, 60_000);
});
