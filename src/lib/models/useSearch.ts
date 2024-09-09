import { getUpstreamUrl } from '$lib/Config.ts';

export const useSearch = () => {
  const search = async (searchTerm: string) => {
    // Perform search
    const upstreamUrl = getUpstreamUrl();

    const response = await fetch(`${upstreamUrl}/api/search/${searchTerm}`);
    const results = await response.json();

    return results.hits;
  }

  return {
    search,
  }
}