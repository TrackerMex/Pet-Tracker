import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react-native';
import type { QueryClient } from '@tanstack/react-query';
import type { ReactElement } from 'react';

export type RenderWithProvidersResult = RenderResult & {
  queryClient: QueryClient;
};

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions,
): Promise<RenderWithProvidersResult> {
  return render(ui, options) as Promise<RenderWithProvidersResult>;
}
