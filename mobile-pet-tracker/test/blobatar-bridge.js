const { execFileSync } = require('child_process');
const { join } = require('path');

const projectRoot = join(__dirname, '..');
const cache = new Map();
const script = [
  "import { blobatar } from 'blobatar';",
  "process.stdout.write(blobatar(process.argv[1] ?? ''));",
].join('\n');

function blobatar(seed) {
  if (!cache.has(seed)) {
    cache.set(
      seed,
      execFileSync(process.execPath, ['--input-type=module', '-e', script, seed], {
        cwd: projectRoot,
        encoding: 'utf8',
      }),
    );
  }

  return cache.get(seed);
}

module.exports = { blobatar };
