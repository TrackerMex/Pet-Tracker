/// <reference types="node" />

import { readFileSync } from 'node:fs';
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
