import { render, screen } from '@testing-library/react-native';

import ProfileRoute from '../profile';

jest.mock('../../../screens/profile', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>(
    'react-native',
  );

  return {
    ProfileScreen: () => React.createElement(View, { testID: 'profile-screen-body' }),
  };
});

describe('R2: route Profile delgada', () => {
  it('only delegates rendering to the screen body', () => {
    render(<ProfileRoute />);

    expect(screen.getByTestId('profile-screen-body')).toBeVisible();
  });
});
