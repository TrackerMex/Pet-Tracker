import { render, screen } from '@testing-library/react-native';
import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';

type LipStyles = Record<'danger' | 'hero' | 'neutral' | 'neutralCompact' | 'primary' | 'primaryCompact' | 'summary' | 'tileAmber' | 'tileBlue' | 'tileViolet' | 'violet', ViewStyle>;
const { useChunkyLip } = jest.requireActual<{ useChunkyLip: () => LipStyles }>('../chunky-lip');

let mockResolvedColors: string[] | undefined;
const mockUseThemeColors = jest.fn((tokens: readonly string[]) =>
  mockResolvedColors ?? tokens.map(token => `--color-${token}`),
);

jest.mock('../use-theme-colors', () => ({
  useThemeColors: (tokens: readonly string[]) => mockUseThemeColors(tokens),
}));

let latest: LipStyles;
function Probe() {
  const styles = useChunkyLip();
  useEffect(() => { latest = styles; }, [styles]);
  return <View testID="lip-probe" />;
}

beforeEach(() => {
  mockResolvedColors = undefined;
  mockUseThemeColors.mockClear();
});

it('#177 R2.1: pide los dos tokens del labio (enmendado por #197 R6)', async () => {
  await render(<Probe />);
  expect(screen.getByTestId('lip-probe')).toBeOnTheScreen();
  expect(mockUseThemeColors).toHaveBeenCalledWith(['lip', 'lip-gray', 'lip-danger', 'lip-violet', 'lip-tile-violet', 'lip-tile-amber', 'lip-tile-blue']);
  expect(Object.keys(latest).sort()).toEqual(['danger', 'hero', 'neutral', 'neutralCompact', 'primary', 'primaryCompact', 'summary', 'tileAmber', 'tileBlue', 'tileViolet', 'violet']);
});

it('#177 R2.2: forma de primary', async () => {
  await render(<Probe />);
  expect(latest.primary).toEqual({ boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: '--color-lip' }] });
});

it('#177 R2.3: forma de primaryCompact', async () => {
  await render(<Probe />);
  expect(latest.primaryCompact).toEqual({ boxShadow: [{ offsetX: 0, offsetY: 3, blurRadius: 0, spreadDistance: 0, color: '--color-lip' }] });
});

it('#177 R2.4: forma de neutral', async () => {
  await render(<Probe />);
  expect(latest.neutral).toEqual({ boxShadow: [{ offsetX: 0, offsetY: 4, blurRadius: 0, spreadDistance: 0, color: '--color-lip-gray' }] });
});

it('#177 R2.5: conserva la referencia aunque la lista de colores sea nueva', async () => {
  const view = await render(<Probe />);
  const first = latest;
  await view.rerender(<Probe />);
  expect(latest).toBe(first);
});

it('#177 R2.6: re-resuelve los estilos cuando cambian los colores', async () => {
  const view = await render(<Probe />);
  const first = latest;
  mockResolvedColors = ['dark-lip', 'dark-lip-gray'];
  await view.rerender(<Probe />);
  expect(latest).not.toBe(first);
  expect(latest.primary).toMatchObject({ boxShadow: [{ color: 'dark-lip' }] });
  expect(latest.primaryCompact).toMatchObject({ boxShadow: [{ color: 'dark-lip' }] });
  expect(latest.neutral).toMatchObject({ boxShadow: [{ color: 'dark-lip-gray' }] });
});

it('#177 R2.7: tolera una lista de colores corta', async () => {
  mockResolvedColors = [];
  await render(<Probe />);
  expect(screen.getByTestId('lip-probe')).toBeOnTheScreen();
  for (const style of Object.values(latest)) {
    expect(style).toMatchObject({ boxShadow: [{ color: undefined }] });
  }
});

describe('#197 R6: catálogo ampliado de labios', () => {
  it.each([
    ['danger', 4, '--color-lip-danger', false],
    ['hero', 6, '--color-lip', false],
    ['neutralCompact', 3, '--color-lip-gray', false],
    ['summary', 5, '--color-lip', false],
    ['tileAmber', -4, '--color-lip-tile-amber', true],
    ['tileBlue', -4, '--color-lip-tile-blue', true],
    ['tileViolet', -4, '--color-lip-tile-violet', true],
    ['violet', 4, '--color-lip-violet', false],
  ] as const)('#197 R6: forma de %s', async (key, offsetY, color, inset) => {
    await render(<Probe />);
    expect(latest[key]).toEqual({ boxShadow: [{ offsetX: 0, offsetY, blurRadius: 0, spreadDistance: 0, color, ...(inset ? { inset: true } : {}) }] });
  });
});
