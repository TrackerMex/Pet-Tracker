describe('R1: build/test toolchain has drizzle-orm and pg available', () => {
  it('resolves drizzle-orm/node-postgres and pg as installed dependencies', () => {
    expect(() => require('drizzle-orm/node-postgres')).not.toThrow();
    expect(() => require('pg')).not.toThrow();
  });
});
