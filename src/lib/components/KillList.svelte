<script lang="ts">
	import type { Attacker } from './../types/Killmail/Attacker.ts';
	import { onMount, onDestroy } from 'svelte';
	import { backendFetch } from "$lib/backendFetcher";
	import { browser } from '$app/environment';
	import type { KillList } from '$lib/types/KillList';
	import Row from './KillList/Row.svelte';
	import NextPreviousButtons from './KillList/NextPreviousButtons.svelte';
	import type { Killmail } from '$lib/types/Killmail';

	// Exports
	export let url: string;
	export let title: string = '';
	export let wsFilter: string = 'all';
    export let combinedKillsAndLosses: boolean = false;
    export let combinedVictimType: string = 'character';
    export let combinedVictimId: number | null = null;

	let kills: KillList[] = [];
	let page: number = 1;
	let loading: boolean = false;
	let socket: WebSocket;

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

	// Updated function to format Killmail into KillList, guarding against undefined attackers
	function formatKillmail(killmail: Killmail): KillList {
		let finalBlowAttacker: Attacker | undefined = killmail.attackers.find(attacker => attacker.final_blow);
		return {
			killmail_id: killmail.killmail_id,
			total_value: killmail.total_value,
			system_id: killmail.system_id,
			system_name: killmail.system_name,
			system_security: killmail.system_security,
			region_id: killmail.region_id,
			region_name: killmail.region_name,
			kill_time: killmail.kill_time,
			attackerCount: killmail.attackers.length,
			commentCount: 0, // Assuming no comments in Killmail
			is_npc: killmail.is_npc,
			is_solo: killmail.is_solo,
			victim: {
				ship_id: killmail.victim.ship_id,
				ship_name: killmail.victim.ship_name,
				character_id: killmail.victim.character_id,
				character_name: killmail.victim.character_name,
				corporation_id: killmail.victim.corporation_id,
				corporation_name: killmail.victim.corporation_name,
				alliance_id: killmail.victim.alliance_id || 0,
				alliance_name: killmail.victim.alliance_name || '',
				faction_id: killmail.victim.faction_id || 0,
				faction_name: killmail.victim.faction_name || '',
			},
			finalblow: {
				character_id: finalBlowAttacker?.character_id || 0,
				character_name: finalBlowAttacker?.character_name || '',
				corporation_id: finalBlowAttacker?.corporation_id || 0,
				corporation_name: finalBlowAttacker?.corporation_name || '',
				alliance_id: finalBlowAttacker?.alliance_id || 0,
				alliance_name: finalBlowAttacker?.alliance_name || '',
				faction_id: finalBlowAttacker?.faction_id || 0,
				faction_name: finalBlowAttacker?.faction_name || '',
				ship_group_name: finalBlowAttacker?.ship_group_name || '',
			}
		};
	}

	// New function to connect to the WebSocket and handle messages
	function connectWebSocket() {
		socket = new WebSocket('wss://eve-kill.com/killmails');

		socket.addEventListener('open', () => {
			// If filter is latest, make it all to get all killmails
			if (wsFilter === 'latest') wsFilter = 'all';
			console.log('Sending WS filter:', wsFilter);
			socket.send(wsFilter);
		});

		socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			if (data.type !== 'killmail') return;
			const killmail: Killmail = data.data;
			const formattedKill = formatKillmail(killmail);

			// Add the formatted kill to the list of kills on the page, if the kill is newer than the latest kill in the list
			if (kills.length > 0 && formattedKill.kill_time <= kills[0].kill_time) return;
			kills = [formattedKill, ...kills];
		});

		socket.addEventListener('error', (error) => {
			console.error('WebSocket error:', error);
		});
	}

	onMount(async () => {
		await loadKills();
		if (browser) {
			window.addEventListener('popstate', handlePopState);
			// Initialize websocket connection
			connectWebSocket();
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('popstate', handlePopState);
			// Close the websocket connection
			socket.close();
		}
	});
</script>

{#if title !== undefined}
	<h1 class="text-white">{title}</h1>
{/if}

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
