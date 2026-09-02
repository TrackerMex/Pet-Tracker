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
