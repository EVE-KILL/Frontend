<script lang="ts">
	import { onMount } from 'svelte';
	import type { System } from '$lib/types/Top/System';
	import { backendFetch } from '$lib/backendFetcher';

	export let url: string;
	export let count: number = 10;
	export let days: number = 7;
	let systems: System[] = [];

	onMount(async () => {
		const response = await backendFetch(url);
		systems = await response.json();
	});
</script>

<div class="text-sm font-bold text-center bg-background-900">
	Top {count} Systems
</div>

{#each systems as system (system.system_id)}
	<button
		class="grid grid-cols-2 items-center bg-semi-transparent border-b-2 border-background-800 w-full py-1"
		on:click={() => (window.location.href = `/system/${system.system_id}`)}
	>
		<div class="flex items-center">
			<img src={`/map.png`} loading="lazy" alt="System: {system.name}" class="w-7" />

			<div class="text-sm text-left text-primary-400 whitespace-nowrap ml-2">{system.name}</div>
		</div>

		<div class="text-sm text-right text-background-200 pr-4">{system.count}</div>
	</button>
{/each}

<div class="text-sm bg-semi-transparent text-center text-background-300 py-1 rounded-br-lg rounded-bl-lg">(Kills over last {days} days)</div>
