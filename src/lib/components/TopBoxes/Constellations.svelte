<script lang="ts">
	import { onMount } from 'svelte';
	import type { Constellation } from '$lib/types/Top/Constellation';
	import { backendFetch } from '$lib/backendFetcher';

	export let url: string;
	export let count: number = 10;
	export let days: number = 7;
	let constellations: Constellation[] = [];

	onMount(async () => {
		const response = await backendFetch(url);
		constellations = await response.json();
	});
</script>

<div class="text-sm font-bold text-center bg-background-900">
	Top {count} Constellations
</div>

{#each constellations as constellation (constellation.constellation_id)}
	<button
		class="grid grid-cols-2 items-center bg-semi-transparent border-b-2 border-background-800 w-full py-1"
		on:click={() => (window.location.href = `/constellation/${constellation.constellation_id}`)}
	>
		<div class="flex items-center">
			<img src={`/map.png`} alt="Constellation: {constellation.name}" class="w-7" />

			<div class="text-sm text-left text-primary-400 whitespace-nowrap ml-2">{constellation.name}</div>
		</div>

		<div class="text-sm text-right text-background-200 pr-4">{constellation.count}</div>
	</button>
{/each}

<div class="text-sm bg-semi-transparent text-center text-background-300 py-1 rounded-br-lg rounded-bl-lg">(Kills over last {days} days)</div>
