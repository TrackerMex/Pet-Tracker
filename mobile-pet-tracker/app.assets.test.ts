/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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
