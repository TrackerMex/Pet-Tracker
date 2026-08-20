import { render, screen } from '@testing-library/react-native';
import { Button, HeroUINativeProvider } from 'heroui-native';

describe('R1: HeroUI Button con className renderiza en jest', () => {
  it('renders the spike button', () => {
    render(
      <HeroUINativeProvider>
        <Button testID="spike-button" className="bg-accent">
          Spike
        </Button>
      </HeroUINativeProvider>,
    );

    expect(screen.getByTestId('spike-button')).toBeTruthy();
  });
});
