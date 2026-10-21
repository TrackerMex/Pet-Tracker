const { readFileSync, readdirSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');
const sourceRoot = join(process.cwd(), 'src');
const repositoryRoot = join(process.cwd(), '..');
const readSource = (path: string) => readFileSync(join(sourceRoot, path), 'utf8');
function sourceFiles(directory = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}
it('#180 R4.4: el ping es local y Welcome no exporta su PingRing', () => {
  expect(readSource('screens/alert-detail/ping-ring.tsx')).not.toContain('welcome');
  expect(readSource('screens/welcome/index.tsx')).not.toMatch(/export\s+(?:function\s+PingRing|\{[^}]*PingRing)/);
});
it('#180 R4.5: ping-ring.tsx no usa MOTION_PING_TIMING ni escribe 1800', () => {
  expect(readSource('screens/alert-detail/ping-ring.tsx')).not.toMatch(/MOTION_PING_TIMING|1800/);
});
it('#180 R13.2: el ping queda grep-limpio sin emoji ni escapes', () => {
  expect(readSource('screens/alert-detail/ping-ring.tsx')).not.toMatch(/\p{Extended_Pictographic}|\\u[\da-fA-F{]/u);
});

it('#180 R5.6: solo la barra de pestañas y el detalle importan expo-blur (enmendado por #189 R9)', () => {
  expect(sourceFiles().filter(path => path.endsWith('.tsx') && readFileSync(path, 'utf8').includes("from 'expo-blur'"))
    .map(path => path.slice(sourceRoot.length + 1)).sort()).toEqual(['components/floating-tab-bar.tsx', 'screens/alert-detail/index.tsx', 'screens/geofence-editor/index.tsx']);
});

it('#180 R3.7: el fichero no nombra las clases de la pantalla anterior', () => {
  const source = readSource('screens/alert-detail/index.tsx');
  expect([...source.matchAll(/rounded-card|min-h-44|text-lg|text-2xs|text-sm|h-52([^.0-9]|$)|min-h-11/g)]).toEqual([]);
  expect(source.match(/bg-default/g)).toHaveLength(1);
});

const AMENDED_DOCS = [
  [
    "docs/ui-guidelines.md",
    "ui-guidelines",
    "§13: el ack del detalle de alerta es primario con labio, h-14 rounded-16 (sale de «Sin labio»); §12: línea nominal de rounded-24 para el mapa y de rounded-16 para los botones del detalle (#180)"
  ],
  [
    "specs/mobile-alert-detail-screen/requirements.md",
    "mobile-alert-detail-screen",
    "#100 R3: la tarjeta es un héroe centrado (disco de 72, píldora, tipo, mascota, fecha con mes corto), sin borde ni cabecera en fila; #100 R4: título en el contenido, esqueleto h-58 y reintento h-13"
  ],
  [
    "specs/mobile-alerts-grouped-and-detail-map/requirements.md",
    "mobile-alerts-grouped-and-detail-map",
    "#170 R6: severidad en el héroe (color por tipo, sin borde); #170 R8: mapa h-52.5 rounded-24; #170 R10: la distancia es una píldora de cristal con desenfoque dentro del mapa; #170 R15: la CTA lleva el icono Map, h-13 y rounded-16"
  ],
  [
    "specs/mobile-reminders-alerts-to-stack/requirements.md",
    "mobile-reminders-alerts-to-stack",
    "#114 R4: el detalle declara title vacío; #114 R6: el detalle usa padding lateral 20, gap 14 y paddingBottom insets.bottom + 40"
  ],
  [
    "specs/mobile-chunky-cta/requirements.md",
    "mobile-chunky-cta",
    "#166 R2: el ack del detalle de alerta es primario sólido con labio (h-14 rounded-16, border-b-4, border-black/25) y queda fuera del inventario de rounded-xl bg-accent; #166 R3: «Ver en el mapa» del detalle pasa a rounded-16"
  ],
  [
    "specs/mobile-tab-screens-canvas-fidelity/requirements.md",
    "mobile-tab-screens-canvas-fidelity",
    "#173 R2.2/R2.4: el detalle de alerta entra en los inventarios de text-13, text-22 y text-26; #173 R3.3: Perfil y el detalle de alerta son los consumidores de Card hero"
  ],
  [
    "specs/mobile-alerts-canvas-fidelity/requirements.md",
    "mobile-alerts-canvas-fidelity",
    "#174 R11: la frase de §13 «confirmar alerta en el detalle» deja de existir; #174 R12: los inventarios de text-15 y tracking-title suman el detalle"
  ]
] as const;
const ANCHORS = [
  [
    "mobile-alert-detail-screen",
    [
      "### R3 — El detalle pinta la alerta desde la caché del listado",
      "### R4 — Carga, error y salida sin la alerta"
    ]
  ],
  [
    "mobile-alerts-grouped-and-detail-map",
    [
      "- **R6 — Severidad en el detalle.**",
      "- **R8 — Mini-mapa.**",
      "- **R10 — Distancia a la zona.**",
      "- **R15 — CTA «Ver en el mapa».**"
    ]
  ],
  [
    "mobile-reminders-alerts-to-stack",
    [
      "### R4 — Cabecera nativa con el look de #95",
      "### R6 — Métricas bajo cabecera nativa (A11)"
    ]
  ],
  [
    "mobile-chunky-cta",
    [
      "### R2. Todo primario sólido lleva el labio",
      "### R3. El secundario neutro lleva el labio gris"
    ]
  ],
  [
    "mobile-tab-screens-canvas-fidelity",
    [
      "- **R2.2**",
      "- **R2.4**",
      "- **R3.3**"
    ]
  ],
  [
    "mobile-alerts-canvas-fidelity",
    [
      "### R11 — Enmiendas a la carta y a specs aprobadas",
      "### R12 — Candados agregados y grep-limpio"
    ]
  ]
] as const;
const NOMINAL = "Fuera de la escala, por fidelidad al canvas (#180): `rounded-24` (24 px), mapa del detalle de alerta, que es un View y no un Card; `rounded-16` (16 px), ack y «Ver en el mapa» del detalle de alerta.";
const BULLET = "Primario del detalle de alerta (#180): ack con labio, h-14 rounded-16, etiqueta text-17 font-extrabold; el secundario «Ver en el mapa» es h-13 rounded-16 con el icono Map.";

function canonicalAmendment(feature: string, change: string) {
  const design = readFileSync(join(repositoryRoot, 'specs/mobile-alert-detail-canvas-fidelity/design.md'), 'utf8');
  const fence = '```markdown\n';
  const start = design.indexOf(fence);
  expect(start).toBeGreaterThan(-1);
  const end = design.indexOf('\n```', start + fence.length);
  expect(end).toBeGreaterThan(start);
  return design.slice(start + fence.length, end).replace('<FEATURE>', feature).replace('<QUÉ CAMBIA>', change)
    .replace(/\n- \[[ xX]\] Enmienda #180 aprobada por humano\s*$/, '').trimEnd();
}
describe('#180 R12: enmiendas', () => {
  it.each(AMENDED_DOCS)('#180 R12.1: bloque canónico en %s', (file, feature, change) => {
    const content = readFileSync(join(repositoryRoot, file), 'utf8');
    expect(content.split(canonicalAmendment(feature, change)).length - 1).toBe(1);
    expect(content).toMatch(/- \[[ xX]\] Enmienda #180 aprobada por humano/);
  });
  it.each(ANCHORS)('#180 R12.1: marcadores de %s', (feature, anchors) => {
    const content = readFileSync(join(repositoryRoot, 'specs', feature, 'requirements.md'), 'utf8').replace(/\s+/g, ' ');
    for (const anchor of anchors) {
      if (feature === 'mobile-alerts-grouped-and-detail-map') {
        expect(content).toContain(anchor + ' _(Enmendado por #180.)_');
      } else {
        const previous = anchor === '### R3. El secundario neutro lleva el labio gris'
          ? ' > Enmendado por #174 (ver «Enmienda #174» al final).' : '';
        expect(content).toContain(anchor + previous + ' > Enmendado por #180 (ver «Enmienda #180» al final).');
      }
    }
  });
  it('#180 R12.2: la carta declara los dos radios y los labios del detalle (enmendado por E1)', () => {
    const charter = readFileSync(join(repositoryRoot, 'docs/ui-guidelines.md'), 'utf8');
    expect(charter).not.toContain('confirmar alerta en el detalle');
    expect(charter).toContain('(reintentos).');
    expect(charter.split(NOMINAL).length - 1).toBe(1);
    expect(charter.split(BULLET).length - 1).toBe(1);
  });
  it('#180 R12.3: registra el título en contenido y mapLabel en §2.35', () => {
    const design = readFileSync(join(repositoryRoot, 'specs/mobile-ui-language/design.md'), 'utf8');
    expect(design.split('### §2.35 — Añadidos por #180').length - 1).toBe(1);
    const section = design.split('### §2.35 — Añadidos por #180')[1].split('## 3.')[0];
    expect(section).toContain('`alerts.mapLabel`');
    expect(section).toContain('`alerts.detailTitle` se pinta ahora en `src/screens/alert-detail/index.tsx`');
  });
});
