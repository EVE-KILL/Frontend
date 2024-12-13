import type { KillmailFilters } from '$lib/types/killmailFilters';
import type { Killmail } from '$lib/types/Killmail';
import { killmailFilters, killmails } from '$lib/stores/killmails';
import { backendFetch } from '$lib/backendFetcher';

export const useKillmails = () => {
	const setup = () => {
		let currentFilters: KillmailFilters;

		killmailFilters.subscribe((value) => {
			if(checkFilters(currentFilters, value)) {
				currentFilters = value;
				getKillmails(currentFilters);
			}
		});
	};

	const setFilters = (newFilters: KillmailFilters) => {
		killmailFilters.set(newFilters);
	};

	const getKillmails = async (currentFilters: KillmailFilters) => {
		try {
			const url = `https://eve-kill.com/api/killlist/latest/`;

			const response = await backendFetch(url, {
				method: 'POST',
				body: JSON.stringify(currentFilters),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data: Killmail[] = await response.json();

			killmails.set(data);
		} catch (error) {
			console.error(error);
		}
	};

	const checkFilters = (oldFilters: KillmailFilters, newFilters: KillmailFilters) => {
		// First up, the filters are the same, we return false

		if (oldFilters === newFilters) {
			return false;
		}

		return true;
	}


	return {
		setup,
		setFilters,
		getKillmails
	};
};
