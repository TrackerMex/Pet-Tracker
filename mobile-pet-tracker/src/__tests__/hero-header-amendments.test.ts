declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: 'utf8') => string;
};

declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { readFileSync } = require('fs');
const { join } = require('path');

const REPOSITORY_ROOT = join(process.cwd(), '..');

const SIGNATURE_LINE = '- [ ] Enmienda aprobada por humano';

/**
 * Los cinco documentos que la tabla A1–A9 de [[requirements]] §R10 enmienda,
 * con el marcador de la edición en prosa que cada uno debe llevar además del
 * bloque de firma.
 */
const AMENDED_DOCS: {
  file: string;
  feature: string;
  change: string;
  marker: string;
}[] = [
  {
    file: 'specs/mobile-figma-polish/design.md',
    feature: 'mobile-figma-polish',
    change: 'enmiendas A1, A3, A4 y A6 de la tabla de #67 §R10',
    marker: '### 5. Sin gradientes ni headers hero — restricción de alcance (§5 enmendada por #67)',
  },
  {
    file: 'specs/mobile-figma-polish/requirements.md',
    feature: 'mobile-figma-polish',
    change: 'enmiendas A2 y A5 de la tabla de #67 §R10',
    marker: '**Resuelto por #67 (A2)**',
  },
  {
    file: 'specs/mobile-pets-profile/requirements.md',
    feature: 'mobile-pets-profile',
    change: 'enmienda A7 de la tabla de #67 §R10',
    marker: '**Enmendado por #67 (A7)**',
  },
  {
    file: 'docs/ui-guidelines.md',
    feature: 'docs/ui-guidelines.md',
    change: 'enmiendas A8 y A9 de la tabla de #67 §R10',
    marker: '**Enmendado por #67 (A8) — corrección de un hecho falso.**',
  },
  {
    file: 'docs/conventions.md',
    feature: 'docs/conventions.md',
    change: 'enmienda A9 de la tabla de #67 §R10',
    marker: '**Excepción nombrada (enmienda A9 de #67, 2026-09-07)**',
  },
];

/**
 * El literal vive en `specs/mobile-pet-hero-header/design.md` §9 y se lee de
 * ahí, no de una copia: la spec sigue siendo la única fuente. Misma técnica que
 * `ui-language.test.ts`.
 */
function canonicalAmendment(feature: string, change: string): string {
  const design = readFileSync(
    join(REPOSITORY_ROOT, 'specs', 'mobile-pet-hero-header', 'design.md'),
    'utf8',
  );
  const fence = '```markdown\n## Enmienda #67 — cabecera fotográfica compartida';
  const start = design.indexOf(fence);

  expect(start).toBeGreaterThan(-1);

  const body = design.slice(start + '```markdown\n'.length);
  const block = body
    .slice(0, body.indexOf('\n```'))
    .replace('<FEATURE>', feature)
    .replace('<QUÉ CAMBIA>', change);

  // La línea de firma la marca el humano, así que no forma parte del bloque
  // que entrega el agente: se comprueba aparte, marcada o no.
  return block.slice(0, block.indexOf(SIGNATURE_LINE)).trimEnd();
}

describe('R10: las specs enmendadas por #67 llevan su bloque', () => {
  it('inserta el bloque literal de design.md §9 en los cinco documentos', () => {
    expect(AMENDED_DOCS).toHaveLength(5);

    for (const { file, feature, change } of AMENDED_DOCS) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');

      expect({
        file,
        hasAmendment: source.includes(canonicalAmendment(feature, change)),
      }).toEqual({ file, hasAmendment: true });
    }
  });

  it('deja en cada documento su línea de firma, marcada o no', () => {
    for (const { file } of AMENDED_DOCS) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');
      const signed = source.includes('- [X] Enmienda aprobada por humano');

      expect({
        file,
        hasSignatureLine: source.includes(SIGNATURE_LINE) || signed,
      }).toEqual({ file, hasSignatureLine: true });
    }
  });

  it('aplica además la edición en prosa que la tabla A1–A9 prescribe', () => {
    for (const { file, marker } of AMENDED_DOCS) {
      // El markdown reparte la prosa en varias líneas: se compara con los
      // espacios colapsados, no byte a byte.
      const flowed = readFileSync(join(REPOSITORY_ROOT, file), 'utf8').replace(
        /\s+/g,
        ' ',
      );

      expect({
        file,
        hasMarker: flowed.includes(marker.replace(/\s+/g, ' ')),
      }).toEqual({ file, hasMarker: true });
    }
  });
});


const SIGNATURE_LINE_168 = '- [ ] Enmienda #168 aprobada por humano';

const AMENDED_DOCS_168 = [
  {
    file: 'specs/mobile-health-make-parity/requirements.md',
    feature: 'mobile-health-make-parity',
    change: 'R2 y R3: Salud abre con el título grande, sin hero',
    marker: '**Enmendado por #168 (B1)**: Salud ya no abre con el hero a sangre; abre con el título grande y el PetSwitcher como primer hijo de health-content (#168 R1, R2).',
  },
  {
    file: 'specs/mobile-pet-hero-header/requirements.md',
    feature: 'mobile-pet-hero-header',
    change: 'R6: Profile deja el hero compartido; Home lo conserva',
    marker: '**Enmendado por #168 (B2)**: Profile deja el hero compartido y pinta profile-pet-card con PetAvatar circular; profile-hero-skeleton conserva su nombre y pasa a h-52 (#168 R4).',
  },
  {
    file: 'specs/mobile-kcal-consumed-bar/requirements.md',
    feature: 'mobile-kcal-consumed-bar',
    change: 'R2, R4 y R7: el anillo sustituye a la barra',
    marker: '**Enmendado por #168 (B3)**: la barra y el tile ForkKnife se sustituyen por el anillo food-plan-ring; R4 y R7 se reescriben sobre el anillo; R3 y R5 no cambian (#168 R8-R10).',
  },
  {
    file: 'docs/ui-guidelines.md',
    feature: 'docs/ui-guidelines.md',
    change: 'regla N1: título grande en Salud, Nutrición y Perfil; hero solo en Inicio',
    marker: '**Regla N1 (enmienda #196)**: Inicio y Perfil abren con PetHeroHeader a sangre; Salud y Nutrición abren con el título grande. En Perfil el título «Perfil» y «Añadir mascota» van en el slot superior del hero y el nombre con los chips en su pie. Devolver el hero a Salud o a Nutrición, o quitárselo a Inicio o a Perfil, es una enmienda a #196.',
  },
];

function canonicalAmendment168(feature: string, change: string): string {
  const design = readFileSync(
    join(REPOSITORY_ROOT, 'specs', 'mobile-tab-headers-canvas', 'design.md'),
    'utf8',
  );
  const fence = '```markdown\n## Enmienda #168 — título grande en Salud, Nutrición y Perfil';
  const start = design.indexOf(fence);

  expect(start).toBeGreaterThan(-1);

  const body = design.slice(start + '```markdown\n'.length);
  const block = body
    .slice(0, body.indexOf('\n```'))
    .replace('<FEATURE>', feature)
    .replace('<QUÉ CAMBIA>', change);

  return block.slice(0, block.indexOf(SIGNATURE_LINE_168)).trimEnd();
}

describe('#168 R11: las specs enmendadas por #168 llevan su bloque', () => {
  it('inserta el bloque literal de design.md §2 en los cuatro documentos', () => {
    expect(AMENDED_DOCS_168).toHaveLength(4);

    for (const { file, feature, change } of AMENDED_DOCS_168) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');
      expect({
        file,
        hasAmendment: source.includes(canonicalAmendment168(feature, change)),
      }).toEqual({ file, hasAmendment: true });
    }
  });

  it('deja en cada documento su línea de firma propia, marcada o no', () => {
    for (const { file } of AMENDED_DOCS_168) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');
      const signed = source.includes('- [X] Enmienda #168 aprobada por humano');
      expect({
        file,
        hasSignatureLine: source.includes(SIGNATURE_LINE_168) || signed,
      }).toEqual({ file, hasSignatureLine: true });
    }
  });

  it('aplica además el marcador en prosa que la tabla R11.2 prescribe (enmendado por #196 R11)', () => {
    for (const { file, marker } of AMENDED_DOCS_168) {
      const flowed = readFileSync(join(REPOSITORY_ROOT, file), 'utf8').replace(/\s+/g, ' ');
      expect({
        file,
        hasMarker: flowed.includes(marker.replace(/\s+/g, ' ')),
      }).toEqual({ file, hasMarker: true });
    }
  });
});


const SIGNATURE_LINE_222 = '- [ ] Enmienda #222 aprobada por humano';

const AMENDED_DOCS_222 = [
  {
    file: 'specs/mobile-tab-headers-canvas/requirements.md',
    feature: 'mobile-tab-headers-canvas',
    change: 'R1: el título grande sale de Salud, Nutrición y Perfil',
    marker: '**Enmendado por #222 (C1)**: las tres pestañas ya no pintan el título grande; conservan un encabezado oculto para lectores de pantalla (#222 R3, R4, R5, R7). El literal de R1.3 solo sigue en la celebración.',
  },
  {
    file: 'specs/mobile-profile-photo-hero-canvas/requirements.md',
    feature: 'mobile-profile-photo-hero-canvas',
    change: 'R2: el slot superior del hero lleva el selector y la cápsula, sin título',
    marker: '**Enmendado por #222 (C2)**: el slot superior del hero ya no lleva el título «Perfil»; lleva el selector glass a la izquierda y la cápsula «Añadir mascota» a la derecha (#222 R5, R6).',
  },
  {
    file: 'specs/mobile-canvas-health-weight/requirements.md',
    feature: 'mobile-canvas-health-weight',
    change: 'R12 y R13: Salud sin título, con cabecera fija de avatares',
    marker: '**Enmendado por #222 (C3)**: health-header y health-title desaparecen; el selector avatars vive en la cabecera fija health-pet-header (#222 R3).',
  },
  {
    file: 'specs/mobile-canvas-nutrition/requirements.md',
    feature: 'mobile-canvas-nutrition',
    change: 'R2: Nutrición sin fila de título, con cabecera fija de avatares',
    marker: '**Enmendado por #222 (C4)**: food-title-row y food-title desaparecen; el selector avatars vive en la cabecera fija food-pet-header (#222 R4).',
  },
  {
    file: 'specs/mobile-canvas-foundations/requirements.md',
    feature: 'mobile-canvas-foundations',
    change: 'R4: el título de las pestañas ya no usa tracking-title',
    marker: '**Enmendado por #222 (C5)**: el literal text-3xl font-black tracking-title text-foreground solo sigue en components/celebration.tsx (#222 R9, L4).',
  },
  {
    file: 'specs/mobile-tab-screens-canvas-fidelity/requirements.md',
    feature: 'mobile-tab-screens-canvas-fidelity',
    change: 'R4 y R5: avatars deja las pantallas y la cápsula pierde el título',
    marker: '**Enmendado por #222 (C6)**: variant="avatars" solo vive en components/tab-pet-header.tsx y la cápsula profile-add-pet ya no sigue a un título (#222 R2, R5, R9 L5).',
  },
];

function canonicalAmendment222(feature: string, change: string): string {
  const design = readFileSync(
    join(REPOSITORY_ROOT, 'specs', 'mobile-tab-avatar-header', 'design.md'),
    'utf8',
  );
  const fence = '```markdown\n## Enmienda #222 — avatares fijos y sin título en las pestañas';
  const start = design.indexOf(fence);

  expect(start).toBeGreaterThan(-1);

  const body = design.slice(start + '```markdown\n'.length);
  const block = body
    .slice(0, body.indexOf('\n```'))
    .replace('<FEATURE>', feature)
    .replace('<QUÉ CAMBIA>', change);

  return block.slice(0, block.indexOf(SIGNATURE_LINE_222)).trimEnd();
}

describe('#222 R11: las specs enmendadas por #222 llevan su bloque', () => {
  it('#222 R11: inserta el bloque literal de design.md §2 en los siete documentos', () => {
    expect(AMENDED_DOCS_222).toHaveLength(6);
    for (const { file, feature, change } of AMENDED_DOCS_222) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');
      expect({ file, hasAmendment: source.includes(canonicalAmendment222(feature, change)) }).toEqual({ file, hasAmendment: true });
    }
  });

  it('#222 R11: deja en cada documento su línea de firma propia, marcada o no', () => {
    for (const { file } of AMENDED_DOCS_222) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8');
      expect({ file, hasSignatureLine: source.includes(SIGNATURE_LINE_222) || source.includes('- [X] Enmienda #222 aprobada por humano') }).toEqual({ file, hasSignatureLine: true });
    }
  });

  it('#222 R11: aplica además el marcador en prosa de la tabla R11.1', () => {
    for (const { file, marker } of AMENDED_DOCS_222) {
      const source = readFileSync(join(REPOSITORY_ROOT, file), 'utf8').replace(/\s+/g, ' ');
      expect({ file, hasMarker: source.includes(marker.replace(/\s+/g, ' ')) }).toEqual({ file, hasMarker: true });
    }
  });
});
