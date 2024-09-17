import locationData from '$lib/data/locations.json';

import { getUpstreamUrl } from '$lib/Config.ts';

export const useSearch = () => {
	const search = async (searchTerm: string) => {
		// Perform search
		const upstreamUrl = getUpstreamUrl();

		const response = await fetch(`${upstreamUrl}/api/search/${searchTerm}`);
		const results = await response.json();

		return results.hits;
	};

	const searchLocations = async (searchTerm: string) => {
		// Perform search
		const results = locationData.filter((location: any) => {
			return location.name.toLowerCase().includes(searchTerm.toLowerCase());
		});

		return results;
	};

	return {
		search,
		searchLocations
	};
};
