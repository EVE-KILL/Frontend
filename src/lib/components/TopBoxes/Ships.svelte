<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ship } from '$lib/types/Top/Ship';
	import { backendFetch } from '$lib/backendFetcher';
	import { getUpstreamUrl } from '$lib/Config';

	export let url: string;
	export let count: number = 10;
	export let days: number = 7;
	let ships: Ship[] = [];

	onMount(async () => {
		const response = await backendFetch(url);
		ships = await response.json();
	});
</script>

<div class="text-sm font-bold text-center bg-background-900">
	Top {count} Ships
</div>

{#each ships as ship (ship.type_id)}
	<button
		class="grid grid-cols-2 items-center bg-semi-transparent border-b-2 border-background-800 w-full py-1"
		on:click={() => (window.location.href = `/item/${ship.type_id}`)}
	>
		<div class="flex items-center">
			<img src={`${getUpstreamUrl()}/images/types/${ship.type_id}/render?size=64`} alt="Ship: {ship.name}" class="w-7" />

			<div class="text-sm text-left text-primary-400 whitespace-nowrap ml-2">{ship.name}</div>
		</div>

		<div class="text-sm text-right text-background-200 pr-4">{ship.count}</div>
	</button>
{/each}

<div class="text-sm bg-semi-transparent text-center text-background-300 py-1 rounded-br-lg rounded-bl-lg">(Kills over last {days} days)</div>
