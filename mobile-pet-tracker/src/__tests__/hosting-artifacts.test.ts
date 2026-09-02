/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import appJson from '../../app.json';

interface AssetLinksStatement {
  relation: string[];
  target: {
    namespace: string;
    package_name: string;
    sha256_cert_fingerprints: string[];
  };
}

const hostingRoot = join(__dirname, '..', '..', '..', 'hosting');

describe('R9: assetlinks.json delega el dominio en el paquete Android de la app', () => {
  it('publica un unico statement para el package y fingerprint esperados', () => {
    const statements = JSON.parse(
      readFileSync(
        join(hostingRoot, '.well-known', 'assetlinks.json'),
        'utf8',
      ),
    ) as AssetLinksStatement[];

    expect(statements).toHaveLength(1);
    expect(statements[0]).toMatchObject({
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: appJson.expo.android.package,
      },
    });

    const fingerprints = statements[0]?.target.sha256_cert_fingerprints;
    expect(fingerprints).toHaveLength(1);
    expect(
      fingerprints?.every(
        (fingerprint) =>
          fingerprint === 'REPLACE_WITH_DEV_BUILD_SHA256' ||
          /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(fingerprint),
      ),
    ).toBe(true);
  });
});

describe('R10: la pagina fallback no consume el token y ofrece abrir la app', () => {
  it('solo procesa el query local y no contiene primitivas ni recursos de red', () => {
    const html = readFileSync(
      join(hostingRoot, 'reset-password', 'index.html'),
      'utf8',
    );

    expect(html).toContain('mobilepettracker://reset-password');
    expect(html).toContain('URLSearchParams');
    expect(html).toContain('Abrir en la app');
    expect(html).toMatch(/1 hora/i);
    expect(html).not.toMatch(/\bfetch\s*\(/i);
    expect(html).not.toMatch(/\bXMLHttpRequest\b/i);
    expect(html).not.toMatch(/\bsendBeacon\b/i);
    expect(html).not.toMatch(/https?:\/\//i);
    expect(html).not.toMatch(/<form\b[^>]*\baction\s*=/i);
    expect(html).not.toMatch(/<(?:img|script|link)\b[^>]*(?:src|href)\s*=/i);
  });
});
