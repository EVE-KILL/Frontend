<script lang="ts">
	import { onMount } from 'svelte';
	import type { Character } from '$lib/types/Character.ts';
	import Dashboard from './dashboard.svelte';
	import CorporationHistory from './corporationHistory.svelte';
	import Stats from './Stats.svelte';
	import StatusTop from './statusTop.svelte';
	import KillList from '$lib/components/KillList.svelte';

	import { useKillmails } from '$lib/models/useKillmails';
	const { setFilterPreset } = useKillmails();

	export let data;
	let character: Character = data.character;

	let currentTab = 'dashboard';

	const TAB_IDS = {
		dashboard: 'dashboard',
		killFeed: 'killFeed',
		corporationHistory: 'corporationHistory',
		stats: 'stats'
	};

	const switchTab = async (tabId: string) => {
		currentTab = tabId;

		// we also want to set the hashtag in the URL
		window.location.hash = tabId;
	};

	onMount(() => {
		switchTab(window.location.hash.replace('#', '') || 'dashboard');
		setFilterPreset('character', { id: character.character_id, name: character.name });
	});
</script>

{#if character}
	<div class="mx-auto p-4 text-white">
		<!-- Character Profile Component -->
		<StatusTop {character} />

		<!-- Navbar -->
		<div class="flex gap-4 bg-semi-transparent text-white py-2 px-4 rounded">
			<button
				class="hover:underline"
				style={currentTab === TAB_IDS.dashboard ? 'text-decoration: underline' : ''}
				on:click|preventDefault={() => switchTab(TAB_IDS.dashboard)}
			>
				Dashboard
			</button>
			<button
				class="hover:underline"
				style={currentTab === TAB_IDS.killFeed ? 'text-decoration: underline' : ''}
				on:click|preventDefault={() => switchTab(TAB_IDS.killFeed)}
			>
				Kill Feed
			</button>

			<button
				class="hover:underline"
				style={currentTab === TAB_IDS.corporationHistory ? 'text-decoration: underline' : ''}
				on:click|preventDefault={() => switchTab(TAB_IDS.corporationHistory)}
			>
				Corporation History
			</button>

			<button
				class="hover:underline"
				style={currentTab === TAB_IDS.stats ? 'text-decoration: underline' : ''}
				on:click|preventDefault={() => switchTab(TAB_IDS.stats)}
			>
				Stats
			</button>
		</div>

		<!-- Main content -->
		<div class="mt-4 rounded">
			{#if currentTab === TAB_IDS.dashboard}
				<Dashboard {data} />
			{:else if currentTab === TAB_IDS.killFeed}
				<KillList withFilters victimId={character.character_id} withKillLossColors />
			{:else if currentTab === TAB_IDS.corporationHistory}
				<CorporationHistory {data} />
			{:else if currentTab === TAB_IDS.stats}
				<Stats {data} />
			{/if}
		</div>
	</div>
{/if}
