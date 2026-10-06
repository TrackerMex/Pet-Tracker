/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

import appJson from './app.json';

function readIhdr(relativePath: string) {
  const buf = readFileSync(join(__dirname, relativePath));

  expect(buf.subarray(0, 8)).toEqual(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );

  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bitDepth: buf[24],
    colorType: buf[25],
  };
}

function readAlpha(relativePath: string) {
  const buf = readFileSync(join(__dirname, relativePath));
  const { width, height, bitDepth, colorType } = readIhdr(relativePath);

  expect([bitDepth, colorType, buf[28]]).toEqual([8, 6, 0]);

  const idat: Buffer[] = [];
  for (let at = 8; at < buf.length; at += 12 + buf.readUInt32BE(at)) {
    if (buf.toString('latin1', at + 4, at + 8) === 'IDAT') {
      idat.push(buf.subarray(at + 8, at + 8 + buf.readUInt32BE(at)));
    }
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let i = 0; i < stride; i++) {
      const a = i >= 4 ? px[y * stride + i - 4] : 0;
      const b = y > 0 ? px[(y - 1) * stride + i] : 0;
      const c = i >= 4 && y > 0 ? px[(y - 1) * stride + i - 4] : 0;
      const p = a + b - c;
      const paeth =
        Math.abs(p - a) <= Math.abs(p - b) && Math.abs(p - a) <= Math.abs(p - c)
          ? a
          : Math.abs(p - b) <= Math.abs(p - c)
            ? b
            : c;
      const predictor = [0, a, b, (a + b) >> 1, paeth][filter];
      px[y * stride + i] = (raw[y * (stride + 1) + 1 + i] + predictor) & 0xff;
    }
  }

  return (x: number, y: number) => px[(y * width + x) * 4 + 3];
}

function countAlpha(
  alpha: (x: number, y: number) => number,
  [x0, y0, x1, y1]: [number, number, number, number],
) {
  let count = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (alpha(x, y) > 0) count++;
    }
  }

  return count;
}

describe('#101 R2: icono de la app', () => {
  it('icon.png (expo.icon) mide 1024x1024 RGBA', () => {
    expect(readIhdr(appJson.expo.icon)).toEqual({
      width: 1024,
      height: 1024,
      bitDepth: 8,
      colorType: 6,
    });
  });
});

describe('#101 R8: favicon', () => {
  it('favicon.png (web.favicon) mide 48x48 RGBA', () => {
    expect(readIhdr(appJson.expo.web.favicon)).toEqual({
      width: 48,
      height: 48,
      bitDepth: 8,
      colorType: 6,
    });
  });
});

describe('#101 R3: foreground del adaptive icon', () => {
  it('android-icon-foreground.png (adaptiveIcon.foregroundImage) mide 1024x1024 RGBA', () => {
    expect(readIhdr(appJson.expo.android.adaptiveIcon.foregroundImage)).toEqual({
      width: 1024,
      height: 1024,
      bitDepth: 8,
      colorType: 6,
    });
  });
});

describe('#101 R4: monochrome del adaptive icon', () => {
  it('android-icon-monochrome.png (adaptiveIcon.monochromeImage) mide 1024x1024 RGBA', () => {
    expect(readIhdr(appJson.expo.android.adaptiveIcon.monochromeImage)).toEqual({
      width: 1024,
      height: 1024,
      bitDepth: 8,
      colorType: 6,
    });
  });
});

describe('#101 R5: fondo plano del adaptive icon', () => {
  it('android-icon-background.png ya no existe en assets/images', () => {
    expect(existsSync(join(__dirname, 'assets/images/android-icon-background.png'))).toBe(false);
  });
});

describe('#101 R6: splash con el perrito sobre violeta', () => {
  it('splash-icon.png (plugin expo-splash-screen) mide 1024x1024 RGBA', () => {
    const plugin = appJson.expo.plugins.find(
      (entry) => Array.isArray(entry) && entry[0] === 'expo-splash-screen',
    ) as [string, { image: string }];

    expect(readIhdr(plugin[1].image)).toEqual({
      width: 1024,
      height: 1024,
      bitDepth: 8,
      colorType: 6,
    });
  });
});

describe('#101 R7: icono de notificación blanco tintado', () => {
  it('pet-tracker-notification-96.png (plugin expo-notifications) mide 96x96 RGBA', () => {
    const plugin = appJson.expo.plugins.find(
      (entry) => Array.isArray(entry) && entry[0] === 'expo-notifications',
    ) as [string, { icon: string }];

    expect(plugin[1].icon).toBeDefined();
    expect(readIhdr(plugin[1].icon)).toEqual({
      width: 96,
      height: 96,
      bitDepth: 8,
      colorType: 6,
    });
  });
});

describe('#115 R10: el splash es la mascota sola sobre transparente', () => {
  it('no hay alfa fuera de la zona segura [174, 850)', () => {
    const alpha = readAlpha('assets/images/splash-icon.png');
    let count = 0;
    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        if ((x < 174 || x >= 850 || y < 174 || y >= 850) && alpha(x, y) > 0) {
          count++;
        }
      }
    }

    expect(count).toBe(0);
  });

  it('las cuatro esquinas del antiguo cuadrado son transparentes', () => {
    const alpha = readAlpha('assets/images/splash-icon.png');

    expect([
      countAlpha(alpha, [174, 174, 200, 200]),
      countAlpha(alpha, [824, 174, 850, 200]),
      countAlpha(alpha, [174, 824, 200, 850]),
      countAlpha(alpha, [824, 824, 850, 850]),
    ]).toEqual([0, 0, 0, 0]);
  });

  it('la punta del pin es transparente', () => {
    const alpha = readAlpha('assets/images/splash-icon.png');

    expect(countAlpha(alpha, [492, 790, 532, 830])).toBe(0);
  });

  it('la cara de la mascota es opaca', () => {
    const alpha = readAlpha('assets/images/splash-icon.png');

    expect(alpha(512, 560)).toBe(255);
  });
});
