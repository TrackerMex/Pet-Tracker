import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react-native';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

import { createQueryClient } from '../src/providers/query-provider';

export type RenderWithProvidersResult = RenderResult & {
  queryClient: QueryClient;
};

export type RenderWithProvidersOptions = RenderOptions & {
  onUnauthorized?: () => void;
};

export async function renderWithProviders(
  ui: ReactElement,
  options?: RenderWithProvidersOptions,
): Promise<RenderWithProvidersResult> {
  const { onUnauthorized, ...renderOptions } = options ?? {};
  const queryClient = createQueryClient(onUnauthorized, 0);
  const CallerWrapper = renderOptions.wrapper;
  const QueryWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {CallerWrapper ? <CallerWrapper>{children}</CallerWrapper> : children}
    </QueryClientProvider>
  );
  const result = await render(ui, {
    ...renderOptions,
    wrapper: QueryWrapper,
  });

  return { ...result, queryClient };
}
