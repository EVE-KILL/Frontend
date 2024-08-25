import { getUpstreamUrl } from '$lib/Config.ts';

export async function load({ params }) {
    const { query } = params;
    const upstreamUrl = getUpstreamUrl();

    if (query && query.length > 2) {
        try {
            const response = await fetch(`${upstreamUrl}/api/search/${query}`);
            const results = await response.json();
            return {
                query,
                searchResults: results.hits
            };
        } catch (error) {
            return {
                query,
                searchResults: [],
                error: "Failed to fetch search results."
            };
        }
    } else {
        return {
            query,
            searchResults: [],
            error: "Invalid search term."
        };
    }
}
