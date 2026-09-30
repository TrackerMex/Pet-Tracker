/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs';
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
const repositoryRoot = join(hostingRoot, '..');

function readRepositoryFile(...segments: string[]): string {
  return readFileSync(join(repositoryRoot, ...segments), 'utf8');
}

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

describe('R12: la configuracion y los gates manuales quedan documentados', () => {
  it.each([
    ['.env.example'],
    ['mobile-pet-tracker', '.env.example'],
  ])(
    'declara RESET_LINK_HOST vacio y sin versionar un dominio real en %p',
    (...path) => {
      const example = readRepositoryFile(...path);

      expect(example).toMatch(/^RESET_LINK_HOST=$/m);
      expect(example).toMatch(/host pelado/i);
      expect(example).toMatch(/sin esquema ni path/i);
    },
  );

  it('incluye RESET_LINK_HOST en la tabla de variables', () => {
    const conventions = readRepositoryFile('docs', 'conventions.md');

    expect(conventions).toMatch(/^\| `RESET_LINK_HOST` \|/m);
  });

  it('documenta G1-G4 y el comando keytool en la seccion Feature 59', () => {
    const verification = readRepositoryFile('docs', 'verification.md');
    const feature59 =
      verification
        .split('### Feature 59 — auth-reset-deep-link')[1]
        ?.split(/^### Feature /m)[0] ?? '';

    expect(feature59).toContain('G1');
    expect(feature59).toContain('G2');
    expect(feature59).toContain('G3');
    expect(feature59).toContain('G4');
    expect(feature59).toContain('keytool -list -v');
    expect(feature59).toContain('REPLACE_WITH_DEV_BUILD_SHA256');
    expect(feature59).toContain('Hostinger');
    expect(feature59).toContain('dev build');
  });

  it('anade hosting al mapa de navegacion del repositorio', () => {
    const agents = readRepositoryFile('AGENTS.md');

    expect(agents).toMatch(/^\| `hosting\/` \|/m);
  });
});

describe('#60 R8: apple-app-site-association delega /reset-password en la app de iOS', () => {
  const aasaPath = join(hostingRoot, '.well-known', 'apple-app-site-association');

  it('#60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset', () => {
    expect(existsSync(aasaPath)).toBe(true);
    const aasa = JSON.parse(readFileSync(aasaPath, 'utf8')) as {
      applinks: { details: { appIDs: string[]; components: unknown[] }[] };
    };

    expect(Object.keys(aasa)).toEqual(['applinks']);
    expect(Object.keys(aasa.applinks)).toEqual(['details']);
    expect(aasa.applinks.details).toHaveLength(1);
    expect(Object.keys(aasa.applinks.details[0] ?? {})).toEqual(['appIDs', 'components']);
    expect(aasa.applinks.details[0]?.appIDs).toHaveLength(1);
    expect(aasa.applinks.details[0]?.appIDs[0]).toMatch(
      /^(?:REPLACE_WITH_APPLE_TEAM_ID|[A-Z0-9]{10})\.com\.trackermex\.pettracker$/,
    );
    expect(aasa.applinks.details[0]?.components).toEqual([
      { '/': '/reset-password*' },
    ]);
  });

  it('#60 R8: fuerza application/json solo para el fichero sin extensión', () => {
    const htaccessPath = join(hostingRoot, '.well-known', '.htaccess');

    expect(existsSync(htaccessPath)).toBe(true);
    expect(
      readFileSync(htaccessPath, 'utf8')
        .trim()
        .split('\n')
        .map((line) => line.trim()),
    ).toEqual([
      '<Files "apple-app-site-association">',
      'ForceType application/json',
      '</Files>',
    ]);
  });
});
