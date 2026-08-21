export type GetResult =
  | { kind: 'response'; response: Response }
  | { kind: 'unreachable'; message: string };

export function apiUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}${path}`;
}

export async function getJson(
  baseUrl: string,
  path: string,
  token: string,
  fetchFn: typeof fetch,
): Promise<GetResult> {
  try {
    const response = await fetchFn(apiUrl(baseUrl, path), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { kind: 'response', response };
  } catch (error) {
    return {
      kind: 'unreachable',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}
