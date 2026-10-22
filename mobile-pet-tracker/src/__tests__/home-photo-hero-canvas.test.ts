import { readFileSync } from 'fs';
import { join } from 'path';

const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

describe('#195 R11: una sola resolución del copy compartido', () => {
  it('resuelve profile.addPet una vez en Inicio', () => {
    expect(read('src/screens/home/index.tsx').match(/t\('profile\.addPet'/g)).toHaveLength(1);
  });
});
