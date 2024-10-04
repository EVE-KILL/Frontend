<script lang="ts">
	import { onMount } from 'svelte';
	import type { Corporation } from '$lib/types/Top/Corporation';

	export let url: string;
	export let count: number = 10;
	export let days: number = 7;
	let corporations: Corporation[] = [];

	onMount(async () => {
		const response = await fetch(url);
		corporations = await response.json();
	});
</script>

<div class="text-sm font-bold text-center bg-background-900">
	Top {count} Corporations
</div>

{#each corporations as corporation (corporation.corporation_id)}
	<button
		class="grid grid-cols-2 items-center bg-semi-transparent border-b-2 border-background-800 w-full py-1"
		on:click={() => (window.location.href = `/corporation/${corporation.corporation_id}`)}
	>
		<div class="flex items-center">
			<img src="https://images.eve-kill.com/corporations/{corporation.corporation_id}/logo?size=64" alt="Character: {corporation.name}" class="w-7" />

			<div class="text-sm text-left text-primary-400 whitespace-nowrap ml-2">{corporation.name}</div>
		</div>

		<div class="text-sm text-right text-background-200 pr-4">{corporation.count}</div>
	</button>
{/each}

<div class="text-sm bg-semi-transparent text-center text-background-300 py-1 rounded-br-lg rounded-bl-lg">(Kills over last {days} days)</div>
