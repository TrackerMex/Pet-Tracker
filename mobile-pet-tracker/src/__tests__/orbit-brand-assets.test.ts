const fs = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const { createHash } = jest.requireActual<typeof import('crypto')>('crypto');
const assetsRoot = join(process.cwd(), 'assets');
const specRoot = join(process.cwd(), '..', 'specs', 'mobile-orbit-splash-icono');

const NEW_SHA = {
  'images/icon.png': 'e393931e24bcd95bd695c3b34f0ed25ab0b16d56363cbd7ed50b70510ed58248',
  'images/android-icon-foreground.png': '6b4d36aa533c64535d7a165b7864aabaf3182c79bfb2155b6d88420839772828',
  'images/android-icon-monochrome.png': '472bbcc7cd8337a04fae481f5c17bcc8a375f436941cc76bdd18cdce44b13fa1',
  'images/splash-icon.png': 'b2b69eb940cc6e000fdda432479d6aeb6004e7ffd78718e532a37d89544dc6d5',
  'images/favicon.png': 'd3ff4cf57f6200a8217bd424ca740e7b13e4714b4428bcf60db70e330450a976',
  'images/pet-tracker-notification-96.png': '6639fc98b1d9fd02df99a5ed77c37cfbdd69b327d145a55a68996ee169c7174e',
  'images/pet-tracker-notification-color-96.png': 'e3bc99a9567b0b43c93dcfe7c60b5080b8c50e397ca2c2360a949dbfd4f63c3b',
  'expo.icon/Assets/orbit.png': '6b4d36aa533c64535d7a165b7864aabaf3182c79bfb2155b6d88420839772828',
};
const OLD_SHA = {
  'images/icon.png': '397688b0222b690ba0677febfe9d7ba94f00f1cd35a434b94301e1046efa657b',
  'images/android-icon-foreground.png': '8767ad5e565a736a433627a3b9f0f96f7c888e68b023338dd9d0b59efacf2913',
  'images/android-icon-monochrome.png': 'a3cb3c85ebf3b23bb3c40e630207b3e56abec6e076d12bafac1cb2e30ea3a8ac',
  'images/splash-icon.png': '087c1eaa69e8324ac46e98073897ddc261d3f25b764f00d6216fb5014c05e56d',
  'images/favicon.png': 'f85e1808a74971adc6cc2deffedf2845b73724ef614e3cb742dc38cbb3e266fa',
  'images/pet-tracker-notification-96.png': '3a2d6cd4b288c513a3f12e3ce24bbb978c7e4d119ca7b319b2fa4f43c78c927a',
  'images/pet-tracker-notification-color-96.png': 'dcfa119998974c0b11d0c9bcd523ab87530248f8c3b617db8a9a168374bb9f20',
  'images/pet-tracker-app-icon.png': 'b802f32fb47d54b706b84883c687ab3abb8f8824ae1f536900a420b4149b2f02',
  'images/pet-tracker-notification-monochrome-original.png': '4c1ed33cc0bfeb824d5f41863b4abe72c11fde7a7cbcc4c402ffe0757268b356',
  'expo.icon/Assets/expo-symbol 2.svg': 'ad117d20fd819f4ec71876ce09c0e8b9275b1f20c5ec3c9d7d1914977ceffec6',
  'expo.icon/Assets/grid.png': '8247d79a2b31328fe4e330a973e6fae16924ed9aebd72c64d464d6856ab18c72',
};
const LOGO_GLOW_SHA = 'bbd98a3f3c12d090f4df6065b7462fcdf6bc266209d002b4ef5fe554c245f66c';
const SOURCE_SHA = {
  'orbit-icon.png': { sha: '4e01caec86196198fcd6afc662f3df7076e2f36fd323a460eafc402778a422e8', colorType: 2 },
  'orbit-icon-fg.png': { sha: 'd02da10d4823c81cdd0c0eecfd0407a868b204a3627b9135f037e13b69fe620b', colorType: 6 },
  'orbit-splash.png': { sha: '4b2118767678ea273c49ce8245b6d0622e6db6ac2058a0002318c388c31a6ee8', colorType: 6 },
};
const SCRIPT_SHA = 'ad655780a53befadceafd7cfa7cfb9cadb94f49587089a77c94146116fe53f41';
const RETIRED = [
  'assets/images/pet-tracker-app-icon.png',
  'assets/images/pet-tracker-notification-monochrome-original.png',
  'assets/expo.icon/Assets/expo-symbol 2.svg',
  'assets/expo.icon/Assets/grid.png',
  'scripts/make-icons.mjs',
];

function sha256(path: string) {
  return createHash('sha256').update(fs.readFileSync(path)).digest('hex');
}

it.each(Object.entries(NEW_SHA))('#244 R1: cada PNG de marca tiene el sha256 del arte de Orbit (%s)', (name, hash) => {
  const path = join(assetsRoot, ...name.split('/'));
  expect(fs.existsSync(path)).toBe(true);
  expect(sha256(path)).toBe(hash);
});

it('#244 R1: logo-glow.png no cambia', () => {
  const path = join(assetsRoot, 'images', 'logo-glow.png');
  expect(fs.existsSync(path)).toBe(true);
  expect(sha256(path)).toBe(LOGO_GLOW_SHA);
});

it('#244 R2: ningún fichero de assets conserva el arte del robot', () => {
  function checkDirectory(directory: string) {
    for (const name of fs.readdirSync(directory)) {
      const path = join(directory, name);
      if (fs.statSync(path).isDirectory()) {
        checkDirectory(path);
      } else if (fs.statSync(path).isFile()) {
        expect(Object.values(OLD_SHA)).not.toContain(sha256(path));
      }
    }
  }
  checkDirectory(assetsRoot);
});

it.each(RETIRED)('#244 R2: el fichero retirado ya no existe (%s)', name => {
  expect(fs.existsSync(join(process.cwd(), ...name.split('/')))).toBe(false);
});

it.each(Object.entries(SOURCE_SHA))('#244 R3: las fuentes PNG están congeladas (%s)', (name, { sha, colorType }) => {
  const path = join(specRoot, 'design-src', name);
  expect(fs.existsSync(path)).toBe(true);
  expect(sha256(path)).toBe(sha);
  const png = fs.readFileSync(path);
  expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(png.toString('ascii', 12, 16)).toBe('IHDR');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1024, 1024]);
  expect(png[25]).toBe(colorType);
});

it('#244 R3: el script de conversión es el de la spec', () => {
  const path = join(specRoot, 'convert-orbit-icons.py');
  expect(fs.existsSync(path)).toBe(true);
  expect(sha256(path)).toBe(SCRIPT_SHA);
  const script = fs.readFileSync(path, 'utf8');
  for (const literal of ['pillow==13.0.0', 'SAFE_RADIUS = 338', 'SPLASH_SCALE = 799', 'DARK_CUTOFF = 60']) {
    expect(script).toContain(literal);
  }
});

it('#244 R8: icon.json compone solo a Orbit sobre el violeta de marca', () => {
  const path = join(assetsRoot, 'expo.icon', 'icon.json');
  expect(fs.existsSync(path)).toBe(true);
  expect(JSON.parse(fs.readFileSync(path, 'utf8'))).toEqual({
    fill: { 'automatic-gradient': 'extended-srgb:0.58039,0.37647,0.98824,1.00000' },
    groups: [{
      layers: [{ 'image-name': 'orbit.png', name: 'orbit' }],
      shadow: { kind: 'neutral', opacity: 0.5 },
      translucency: { enabled: true, value: 0.5 },
    }],
    'supported-platforms': { circles: ['watchOS'], squares: 'shared' },
  });
});

it('#244 R8: expo.icon/Assets contiene solo orbit.png', () => {
  const path = join(assetsRoot, 'expo.icon', 'Assets');
  expect(fs.existsSync(path)).toBe(true);
  expect(fs.readdirSync(path).sort()).toEqual(['orbit.png']);
});

it('#244 R10: la carta lleva la Enmienda #244 una sola vez, con la marca de Orbit', () => {
  const charter = fs.readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
  const heading = '## Enmienda #244 — ';
  expect(charter.split(heading).length - 1).toBe(1);
  const section = charter.slice(charter.indexOf(heading) + heading.length);
  const nextHeading = section.indexOf('\n## ');
  const body = nextHeading === -1 ? section : section.slice(0, nextHeading);
  for (const literal of ['Orbit', 'icono adaptativo', 'splash', 'radio 338', '#9460FC', 'Enmienda #243', 'rebuild']) {
    expect(body).toContain(literal);
  }
  expect(body).toMatch(/- \[[ xX]\] Enmienda #244 aprobada por humano/);
  for (const followingHeading of section.match(/^## .+$/gm) ?? []) {
    expect(followingHeading).toMatch(/^## Enmienda #/);
  }
});
