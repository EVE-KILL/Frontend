import type { KillmailFilters } from '$lib/types/killmailFilters';
import type { Killmail } from '$lib/types/Killmail';
import { killmailFilters, killmails } from '$lib/stores/Killmails';

export const useKillmails = () => {
	const setup = () => {
		let currentFilters: KillmailFilters;

		killmailFilters.subscribe((value) => {
			currentFilters = value;
			getKillmails(currentFilters);
		});
	};

	const setFilters = (newFilters: KillmailFilters) => {
		killmailFilters.set(newFilters);
	};

	const getKillmails = async (currentFilters: KillmailFilters) => {
		try {
			const url = `https://esi.evetech.net/latest/killmails/`;

			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(currentFilters),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data: Killmail = await response.json();

			killmails.set(data);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		setup,
		setFilters,
		getKillmails
	};
};
