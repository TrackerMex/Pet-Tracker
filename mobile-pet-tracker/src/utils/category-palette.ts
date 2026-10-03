/**
 * Paleta pastel categórica (#64). Los valores viven en src/theme/global.css;
 * aquí solo vive el reparto categoría → hueco y el nombre de clase.
 *
 * Los nombres de clase se escriben ENTEROS y como literales: el escáner de
 * utilidades de Tailwind solo genera las clases que ve escritas, así que
 * `bg-category-${slot}` produciría estilo vacío en tiempo de ejecución.
 */
export type CategorySlot =
  | 'blue'
  | 'amber'
  | 'green'
  | 'violet'
  | 'rose'
  | 'neutral';

export const CATEGORY_SLOTS: Record<
  CategorySlot,
  { surface: string; ink: string }
> = {
  blue: { surface: 'bg-category-blue', ink: 'text-category-blue-strong' },
  amber: { surface: 'bg-category-amber', ink: 'text-category-amber-strong' },
  green: { surface: 'bg-category-green', ink: 'text-category-green-strong' },
  violet: { surface: 'bg-category-violet', ink: 'text-category-violet-strong' },
  rose: { surface: 'bg-category-rose', ink: 'text-category-rose-strong' },
  neutral: { surface: 'bg-default', ink: 'text-muted' },
};

/**
 * El tipo de documento es texto libre en el contrato del backend
 * (create-pet-document.dto.ts: z.string().trim().min(1).max(40)), no un enum:
 * la tabla cubre los tipos que el diseño nombra, en los dos idiomas en que
 * pueden llegar por API, y todo lo demás cae en `neutral`.
 */
const DOCUMENT_TYPE_SLOTS: Record<string, CategorySlot> = {
  'vacunación': 'blue',
  'vacunacion': 'blue',
  'vacuna': 'blue',
  'vaccination': 'blue',
  'vaccine': 'blue',
  'consulta': 'green',
  'consultation': 'green',
  'checkup': 'green',
  'desparasitación': 'amber',
  'desparasitacion': 'amber',
  'deworming': 'amber',
  'análisis': 'violet',
  'analisis': 'violet',
  'analysis': 'violet',
  'lab': 'violet',
};

export function documentCategory(type: string): CategorySlot {
  return DOCUMENT_TYPE_SLOTS[type.trim().toLowerCase()] ?? 'neutral';
}
