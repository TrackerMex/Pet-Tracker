import { render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';
import type { ComponentType } from 'react';

import FoodScreen from '../food';
import HomeScreen from '../home';
import MapScreen from '../map';
import ProfileScreen from '../profile';

describe('R5: placeholders de tabs', () => {
  it.each<{
    Screen: ComponentType;
    testID: string;
    title: string;
  }>([
    { Screen: HomeScreen, testID: 'screen-home', title: 'Home' },
    { Screen: MapScreen, testID: 'screen-map', title: 'Map' },
    { Screen: FoodScreen, testID: 'screen-food', title: 'Food' },
    { Screen: ProfileScreen, testID: 'screen-profile', title: 'Profile' },
  ])('renders the $title placeholder', async ({ Screen, testID, title }) => {
    await render(<Screen />, { wrapper: HeroUINativeProvider });

    expect(screen.getByTestId(testID)).toBeVisible();
    expect(screen.getByText(title)).toBeVisible();
  });
});
