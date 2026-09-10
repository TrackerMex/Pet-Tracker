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

export type RenderWithProvidersResult = RenderResult & {
  queryClient: QueryClient;
};

export async function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions,
): Promise<RenderWithProvidersResult> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const CallerWrapper = options?.wrapper;
  const QueryWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {CallerWrapper ? <CallerWrapper>{children}</CallerWrapper> : children}
    </QueryClientProvider>
  );
  const result = await render(ui, { ...options, wrapper: QueryWrapper });

  return { ...result, queryClient };
}
