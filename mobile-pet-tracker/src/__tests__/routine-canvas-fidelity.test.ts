import { readFileSync } from 'fs';
import { join } from 'path';

const artboard = (name: string) =>
  readFileSync(join(process.cwd(), '..', `specs/mobile-canvas-routine/canvas/${name}.dc.html`), 'utf8');
const source = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

// Abre en `marker` y cierra en el primer `>` que no es de una flecha: el tag de apertura del nodo.
const openingTag = (text: string, marker: string) => {
  const start = text.indexOf(marker);
  expect(start).toBeGreaterThanOrEqual(0);
  const rest = text.slice(start);
  return rest.slice(0, rest.search(/[^=]>/) + 1);
};

type Production = { file: string; literals: string[]; tag?: string };
type Row = [name: string, board: string, canvas: string[], production: Production[]];

const REMINDERS = 'src/screens/reminders/index.tsx';
const ADD_REMINDER = 'src/screens/add-reminder/index.tsx';
const DOCS = 'src/screens/docs/index.tsx';
const CSS = 'src/theme/global.css';
const FRAME = 'padding: 56px 20px 32px';
const FRAME_TOP = 'paddingTop: insets.top + 12,';

const rows: Row[] = [
  ['marco de Recordatorios', 'Recordatorios', [FRAME], [{ file: REMINDERS, literals: [FRAME_TOP] }]],
  ['marco de Agregar', 'NuevoRecordatorio', [FRAME], [{ file: ADD_REMINDER, literals: [FRAME_TOP] }]],
  ['marco de Documentos', 'Documentos', [FRAME], [{ file: DOCS, literals: [FRAME_TOP] }]],
  [
    'título de 24',
    'NuevoRecordatorio',
    ['font-size: 24px; font-weight: 900; letter-spacing: -0.02em'],
    [{ file: ADD_REMINDER, literals: ['size={24}'] }],
  ],
  [
    'borde próximo',
    'Recordatorios',
    ['border: 2px solid var(--amber)', '--amber:#FFF7ED'],
    [
      { file: REMINDERS, literals: ['border-2 border-category-amber'] },
      { file: CSS, literals: ['--color-category-amber: #FFF7ED'] },
    ],
  ],
  [
    'badge próximo',
    'Recordatorios',
    ['background: var(--amber); color: var(--amber-s)', '--amber-s:#A55E07'],
    [
      {
        file: REMINDERS,
        tag: 'testID={`reminder-upcoming-${reminder.id}`}',
        literals: ['CATEGORY_SLOTS.amber.surface', 'CATEGORY_SLOTS.amber.ink'],
      },
      { file: CSS, literals: ['--color-category-amber-strong: #A55E07'] },
    ],
  ],
  [
    '«Eliminar» de fila',
    'Recordatorios',
    [
      'height: 44px; padding: 0 10px; border: 0; border-radius: 14px; background: var(--rose); color: var(--danger)',
      '--rose:#FFF0F3',
    ],
    [
      {
        file: REMINDERS,
        literals: [
          'h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}',
          '<Text className="text-13 font-extrabold text-danger">',
        ],
      },
      { file: CSS, literals: ['--color-category-rose: #FFF0F3'] },
    ],
  ],
  [
    'labio del destructivo',
    'Recordatorios',
    ['box-shadow: 0 4px 0 #9F1F15'],
    [
      { file: REMINDERS, tag: 'testID="reminders-delete-confirm"', literals: ['style={chunkyLip.danger}'] },
      { file: 'src/theme/chunky-lip.ts', literals: ['danger: lipStyle({ offsetY: 4, color: lipDanger }),'] },
      { file: CSS, literals: ['--color-lip-danger: #9F1F15'] },
    ],
  ],
  [
    'escalón de Recordatorios',
    'Recordatorios',
    ['animation: rise 400ms ease-out both', 'rise 400ms ease-out 70ms', 'rise 400ms ease-out 140ms'],
    [
      { file: REMINDERS, literals: ['delayMs={i * MOTION_REMINDERS_STAGGER_MS}'] },
      { file: 'src/theme/motion.ts', literals: ['export const MOTION_REMINDERS_STAGGER_MS = 70;'] },
    ],
  ],
  [
    'escalón de Documentos',
    'Documentos',
    ['rise 400ms ease-out 60ms', 'rise 400ms ease-out 180ms'],
    [
      { file: DOCS, literals: ['delayMs={index * MOTION_STAGGER_MS}'] },
      { file: 'src/theme/motion.ts', literals: ['export const MOTION_STAGGER_MS = 60;'] },
    ],
  ],
  [
    '«Guardar» al pie',
    'NuevoRecordatorio',
    ['margin-top: auto; height: 56px'],
    [{
      file: ADD_REMINDER,
      literals: ['className="mt-auto h-14 rounded-16 bg-accent" style={chunkyLip.primary}', 'flexGrow: 1'],
    }],
  ],
];

describe('#204 R15: fidelidad al canvas congelado', () => {
  it.each(rows)('#204 R15: %s sigue al canvas', (_name, board, canvasLiterals, productions) => {
    const canvas = artboard(board);
    for (const literal of canvasLiterals) expect(canvas).toContain(literal);
    for (const { file, literals, tag } of productions) {
      const text = tag === undefined ? source(file) : openingTag(source(file), tag);
      for (const literal of literals) expect(text).toContain(literal);
    }
  });
});
