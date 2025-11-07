
/**
 * Global API fetcher for SWR or for general purpose.
 *
 * This fetcher automatically:
 * - Includes credentials (like cookies) for authenticated requests.
 * - Sets the 'Content-Type' header to 'application/json'.
 * - Throws an error if the response is not ok, which is required for SWR's error handling.
 *
 * @param url The URL to fetch data from.
 * @param options Optional `fetch` options.
 * @returns The response data as JSON.
 */
export async function apiFetcher<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(`An error occurred while fetching the data. Status: ${res.status}`);
    // Attempt to get more info from the response body.
    try {
      (error as any).info = await res.json();
    } catch (e) {
      (error as any).info = res.statusText;
    }
    (error as any).status = res.status;
    throw error;
  }
  
  // If the response has no content, return null.
  if (res.status === 204) {
      return null as T;
  }

  return res.json();
}
