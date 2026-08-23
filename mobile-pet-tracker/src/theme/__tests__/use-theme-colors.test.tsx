import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { useThemeColors } from '../use-theme-colors';

let mockTheme: 'light' | 'dark' = 'light';
const mockGetCSSVariable = jest.fn((name: string) => {
  if (name === '--color-warning') {
    return mockTheme === 'dark' ? '#FBBF24' : '#F59E0B';
  }
  if (name === '--warning') {
    return mockTheme === 'dark' ? '#FBBF24' : '#F59E0B';
  }
  if (name === '--color-foreground') {
    return mockTheme === 'dark' ? '#F7F8FA' : '#0D1117';
  }
  return undefined;
});

jest.mock('uniwind', () => ({
  Uniwind: {
    getCSSVariable: (name: string) => mockGetCSSVariable(name),
  },
  useUniwind: () => ({ theme: mockTheme, hasAdaptiveThemes: false }),
}));

function ThemeColorProbe() {
  const [warning] = useThemeColors(['warning']);

  return <Text testID="theme-color-probe">{warning}</Text>;
}

describe('R2: colores JS reaccionan al tema activo', () => {
  beforeEach(() => {
    mockTheme = 'light';
    mockGetCSSVariable.mockClear();
  });

  it('re-resuelve el token cuando una pantalla montada cambia a dark', () => {
    const view = render(<ThemeColorProbe />);

    expect(screen.getByTestId('theme-color-probe')).toHaveTextContent('#F59E0B');

    mockTheme = 'dark';
    view.rerender(<ThemeColorProbe />);

    expect(screen.getByTestId('theme-color-probe')).toHaveTextContent('#FBBF24');
    expect(mockGetCSSVariable).toHaveBeenCalledWith('--color-warning');
  });
});
