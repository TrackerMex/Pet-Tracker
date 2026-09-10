import { createQueryClient } from '../query-provider';

describe('#87 R2: el QueryClient fija sus cinco mandos', () => {
  const queries = createQueryClient().getDefaultOptions().queries;

  it('keeps every query immediately stale', () => {
    expect(queries?.staleTime).toBe(0);
  });

  it('keeps unused data for five minutes', () => {
    expect(queries?.gcTime).toBe(5 * 60 * 1000);
  });

  it('does not retry resolved API result kinds', () => {
    expect(queries?.retry).toBe(false);
  });

  it('does not promise browser focus refetching in React Native', () => {
    expect(queries?.refetchOnWindowFocus).toBe(false);
  });

  it('does not promise reconnect refetching without NetInfo', () => {
    expect(queries?.refetchOnReconnect).toBe(false);
  });

  it('does not carry data between query keys', () => {
    expect(queries?.placeholderData).toBeUndefined();
  });
});
