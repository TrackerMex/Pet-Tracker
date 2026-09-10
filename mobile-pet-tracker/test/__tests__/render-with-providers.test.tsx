import { screen } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { renderWithProviders } from '../render-with-providers';

function Probe() {
  const query = useQuery({
    queryKey: ['probe'],
    queryFn: async () => 'ok',
  });

  return <Text testID="probe">{query.data ?? '…'}</Text>;
}

function CustomWrapper({ children }: { children: ReactNode }) {
  return <View testID="custom-wrapper">{children}</View>;
}

describe('#87 R3: el helper monta el QueryClientProvider y devuelve su cliente', () => {
  it('resolves a query while preserving the caller wrapper', async () => {
    await renderWithProviders(<Probe />, { wrapper: CustomWrapper });

    expect(await screen.findByTestId('probe')).toHaveTextContent('ok');
    expect(screen.getByTestId('custom-wrapper')).toBeVisible();
  });

  it('returns the same client used by the rendered tree', async () => {
    const result = await renderWithProviders(<Probe />);

    await screen.findByText('ok');
    expect(result.queryClient.getQueryData(['probe'])).toBe('ok');
  });

  it('creates an isolated client for every render', async () => {
    const first = await renderWithProviders(<Probe />);
    await screen.findByText('ok');

    const second = await renderWithProviders(<Text>second</Text>);

    expect(second.queryClient).not.toBe(first.queryClient);
    expect(second.queryClient.getQueryData(['probe'])).toBeUndefined();
  });
});
