<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { backendFetch } from "$lib/backendFetcher";
	import { browser } from '$app/environment';
	import type { KillList } from '$lib/types/KillList';
	import Row from './KillList/Row.svelte';
	import NextPreviousButtons from './KillList/NextPreviousButtons.svelte';

	// Exports
	export let url: string;
    export let combinedKillsAndLosses: boolean = false;
    export let combinedVictimType: string = 'character';
    export let combinedVictimId: number | null = null;

	let kills: KillList[] = [];
	let page: number = 1;
	let loading: boolean = false;

	async function fetchKillList(url: string = 'https://eve-kill.com/api/killlist?type=latest', pageNumber: number = 1) {
		const fetchUrl = url.includes('?') ? `${url}&page=${pageNumber}` : `${url}?page=${pageNumber}`;
		let response = await backendFetch(fetchUrl);
		return await response.json();
	}

	async function loadKills() {
		if (loading) return;
		loading = true;

		const fetchedKills: KillList[] = await fetchKillList(url, page);
		if (!fetchedKills.error) {
			kills = fetchedKills.slice(0, 100) || [];
		}
		loading = false;
	}

	// Updated changePage function with a flag for updating history
	function changePage(newPage: number, updateHistory: boolean = true) {
		if (newPage > 0) {
			page = newPage;
			loadKills();

			if(updateHistory){
				const newUrl = new URL(window.location.href);
				newUrl.searchParams.set('killlistPage', String(page));
				history.pushState({}, '', newUrl.toString());
			}
		}
	}

	// Handle browser history navigation
	function handlePopState() {
		const currentUrl = new URL(window.location.href);
		const newPage = parseInt(currentUrl.searchParams.get('killlistPage') || '1', 10);
		// Avoid pushing history since this is a navigation event
		changePage(newPage, false);
	}

	onMount(() => {
		loadKills();
		if (browser) {
			window.addEventListener('popstate', handlePopState);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('popstate', handlePopState);
		}
	});
</script>

<!-- Add Next/Prev buttons at the top of the killlist -->
<NextPreviousButtons page={page} loading={loading} changePage={changePage} />

<div class="overflow-x-auto mt-2 mb-2" role="table">
	<div class="grid grid-cols-8 bg-background-800 text-white uppercase text-xs py-1">
		<div class="pl-2 col-span-2">Ship</div>
		<div class="pl-2 col-span-2">Victim</div>
		<div class="pl-2 col-span-2">Final Blow</div>
		<div class="pl-2">Location</div>
		<div class="text-right pr-2">Details</div>
	</div>

	<!-- For each kill generate a row for it -->
	{#each kills as kill (kill.killmail_id)}
		<Row kill={kill} combinedKillsAndLosses={combinedKillsAndLosses} combinedVictimType={combinedVictimType} combinedVictimId={combinedVictimId} />
	{/each}
</div>

<!-- Add Next/Prev buttons at the bottom of the killlist -->
<NextPreviousButtons page={page} loading={loading} changePage={changePage} />
