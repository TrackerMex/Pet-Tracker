import { render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import { EmptyState } from '../empty-state';

const mockUseReducedMotion = jest.fn<boolean, []>(() => false);

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  __esModule: true,
  useReducedMotion: () => mockUseReducedMotion(),
}));

type ProbeOptions = {
  variant?: 'default' | 'hero';
  action?: { label: string; onPress: () => void };
};

async function renderProbe(options: ProbeOptions = { variant: 'hero' }) {
  return render(
    <HeroUINativeProvider>
      <EmptyState testID="home-empty" pose="talk" title="Título de prueba" body="Cuerpo de prueba." {...options} />
    </HeroUINativeProvider>,
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  mockUseReducedMotion.mockReturnValue(false);
});
afterEach(() => jest.useRealTimers());

it('#176 R1: sin variant y con default conserva el vacío sin escenario ni icono (NV)', async () => {
  for (const options of [{}, { variant: 'default' as const }]) {
    const result = await renderProbe({ ...options, action: { label: 'Acción', onPress: jest.fn() } });
    expect(screen.getByTestId('home-empty-pose')).toBeOnTheScreen();
    for (const suffix of ['stage', 'action-wrap', 'action-icon']) {
      expect(screen.queryByTestId(`home-empty-${suffix}`)).toBeNull();
    }
    await result.unmount();
  }
});
