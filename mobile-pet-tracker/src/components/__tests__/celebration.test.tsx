const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');

describe('#171 R1: la pose celebrate', () => {
  it('pingo-celebrate.webp es WebP con alfa, sin animación, 1024 × 1024 y como mucho 100000 bytes', () => {
    const bytes = readFileSync(join(process.cwd(), 'assets', 'images', 'pingo-celebrate.webp'));
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
    expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');
    expect(bytes[20] & 0x10).not.toBe(0);
    expect(bytes[20] & 0x02).toBe(0);
    expect(bytes.readUIntLE(24, 3) + 1).toBe(1024);
    expect(bytes.readUIntLE(27, 3) + 1).toBe(1024);
    expect(bytes.length).toBeLessThanOrEqual(100000);
  });
});
