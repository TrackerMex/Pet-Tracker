const fs = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const { createHash } = jest.requireActual<typeof import('crypto')>('crypto');
const imagesRoot = join(process.cwd(), 'assets', 'images');
const specRoot = join(process.cwd(), '..', 'specs', 'mobile-orbit-cachorro-art');

const POSES = ['wave', 'wave-blink', 'talk', 'walk', 'celebrate', 'sleep', 'collar', 'health', 'food', 'clipboard'] as const;
const NEW_SHA = {
  wave: '329e54a136e9d96a3567e39cc5aa128566723815a5b7cbdc86251d299ee66cec',
  'wave-blink': '573277aa19494e1645a6738195518743be97e3eb9b947d219f71e6b588cf6a35',
  talk: 'b0e292c12012c2d9468146d5ca8a436b3ea5017ab09db908756d50f950136014',
  walk: '391db95f89c993be39263e8d81ddc8d899c2841aecf3436a4fb75895a7faba41',
  celebrate: 'dc04b17c2141975dc7f94f891fceee027d35ea641752b911430e7e2a7899f2f7',
  sleep: '29c241fdfaf29f91b0468b6c4332e59ccabec3f9bf6f475d92dac4045669790e',
  collar: 'e398800a813d36d2d2fc401dd298df41f72f856c253126ed98ff47b1fda8edc9',
  health: '77dcf90cbcada5d500692b4fd1e3bd2507fcd52971584c7fa14035de507c84d8',
  food: 'c7737dfe65188b16fb42f2e70ce59bfd6aec655d5c7cb3818c675d9ab5d93b13',
  clipboard: 'e2c3dec28c20ae6f45ae8fa488ba432f2da1c3d4d4f8a72645e6f9696d7e27f9',
};
const OLD_SHA = {
  wave: '66cd45cb7565be2d4364e705763710109b13a1ad1809a3711c23217026f5f306',
  'wave-blink': 'a6a44b702e395517f1d7875600cc106455a9972fab14bf871e3c5f4c155b8549',
  talk: 'af16821827af1d6ff432fd124e22d9c2121ce67c97c3c9d1335d4cda1ad275fb',
  walk: '12c52706e7b5cc7124a0974e04834e5e5c6c96a0549bcaacbbef10766cac9687',
  celebrate: 'b8e9745f73dedc6d72f89a588046a7440f32df4b2e9685e70fa96a2b70e3a254',
  sleep: 'e7fba39ad9c9d24c3520c82c26b2dc3055103f329b13a60715e15f6acba6938b',
  collar: '298e8a956c853a00b737ab05a0ba3497912cf7bf8f29f86d25bb515031d085b1',
  health: 'bc02bf6f4b67ba2834847b5c9dac919b66df227e918502238e2e9fe5884f3ccc',
  food: 'da68c5bbbe82b2bcb448f6a12d7da77774adc261e75d356c747c0a9614fb483f',
  clipboard: '363e1f6502912709570d7448abf5a80f7ac42258957309a04f5733bf513eda28',
};
const SOURCE_SHA = {
  wave: 'd24100ccea224165cda2632db653551a6f7131379460e60c0306e9b0fcf68ddc',
  'wave-blink': '4de88e6be17d9d2a342817b65688203f5a7f1f6a8fc5f393afa96babbc45777e',
  talk: 'ddf23c63c24f049c066f4413993f7d181e9ed62e3ac0108ae74c13d9a78c48bc',
  walk: 'a1f2e72a850f099c985aba55ea0e809137ec055fc9118ee4efd6f45203fe8d00',
  celebrate: 'a41f9391595cdb2b55c975a1544eba1fdd2b266e9ee13121ed44233ca038962e',
  sleep: '9929b377ffc90d53e3b392317768ca1a55a98cdef0d1a029d1dce85d428b1dca',
  collar: '4fc777280109bcfa96dbc3ad1a30f53f2c9db2c506ea6c16bdb12292005bc820',
  health: '2033fa59f8bbf0b4e3dafd64f99fc87cc5de592d282b3a18bccebbd8ddbd3b1a',
  food: 'dd61cf8121382a41b87fd6b161207bf479b9df5b5943cda63c2410c8af748760',
  clipboard: '74d31328a60ec053482dcc21f089074120a298aaef58436c8345e9e0b04c473b',
  'reference-a-sit': 'f280494ba7150945b07bfed5642fa52e3f8f7432766cf19404fbafbd65e88377',
};

it('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos', () => {
  expect(fs.readdirSync(imagesRoot).filter(name => /^orbit-.*\.webp$/.test(name)).sort())
    .toEqual(POSES.map(pose => `orbit-${pose}.webp`).sort());
});

it.each(POSES)('#243 R1: las diez poses orbit-*.webp son las únicas y son WebP válidos (%s)', pose => {
  const path = join(imagesRoot, `orbit-${pose}.webp`);
  expect(fs.existsSync(path)).toBe(true);
  const bytes = fs.readFileSync(path);
  expect({
    riff: bytes.toString('ascii', 0, 4),
    webp: bytes.toString('ascii', 8, 12),
    chunk: bytes.toString('ascii', 12, 16),
    alpha: (bytes[20] & 0x10) !== 0,
    animated: (bytes[20] & 0x02) !== 0,
    width: bytes.readUIntLE(24, 3) + 1,
    height: bytes.readUIntLE(27, 3) + 1,
  }).toEqual({ riff: 'RIFF', webp: 'WEBP', chunk: 'VP8X', alpha: true, animated: false, width: 1024, height: 1024 });
  expect(bytes.length).toBeLessThanOrEqual(100000);
});

it.each(POSES)('#243 R2: cada pose tiene el sha256 del arte nuevo (%s)', pose => {
  const bytes = fs.readFileSync(join(imagesRoot, `orbit-${pose}.webp`));
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(NEW_SHA[pose]);
});

it('#243 R2: ningún fichero de assets/images conserva el arte viejo', () => {
  for (const name of fs.readdirSync(imagesRoot)) {
    const path = join(imagesRoot, name);
    if (!fs.statSync(path).isFile()) continue;
    const hash = createHash('sha256').update(fs.readFileSync(path)).digest('hex');
    expect(Object.values(OLD_SHA)).not.toContain(hash);
  }
});

it.each(Object.entries(SOURCE_SHA))('#243 R3: las fuentes PNG están congeladas (%s)', (pose, hash) => {
  const png = fs.readFileSync(join(specRoot, 'design-src', `orbit-${pose}.png`));
  expect(createHash('sha256').update(png).digest('hex')).toBe(hash);
  expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(png.toString('ascii', 12, 16)).toBe('IHDR');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1024, 1024]);
  expect(png[25]).toBe(6);
});

it('#243 R3: el script de conversión está en la spec con sus parámetros', () => {
  const path = join(specRoot, 'convert-orbit.py');
  expect(fs.existsSync(path)).toBe(true);
  const script = fs.readFileSync(path, 'utf8');
  expect(script).toContain('pillow==13.0.0');
  expect(script).toContain('quality=80, method=6');
  expect(script).toContain('def clean(');
});
