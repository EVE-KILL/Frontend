<script lang="ts">
	import type { Killmail } from '../types/Killmail';
	import { formatNumber } from '$lib/Helpers.ts';
	import { onMount } from 'svelte';

	export let categories: { name: string; url: string }[] = [];

	let kills: Killmail[] = [];
	let activeTab = 0;

	// Fetch kills when the component mounts or when the active tab changes
	$: if (categories.length > 0) {
		onMount(fetchKills);
	}

	$: if (activeTab >= 0 && activeTab < categories.length) {
		fetchKills();
	}

	async function fetchKills() {
		const response = await fetch(categories[activeTab].url);
		kills = await response.json();
	}
</script>

<table class="table-auto min-w-full bg-semi-transparent rounded-lg shadow-lg">
	<thead>
		<tr class="bg-semi-transparent text-white uppercase text-xs leading-normal">
			<th class="px-2 py-1 flex justify-center" scope="col" colspan={categories.length}>
				{#each categories as category, index}
					<button
						class="tab-btn"
						class:active-tab={activeTab === index}
						on:click={() => (activeTab = index)}
					>
						{category.name}
					</button>
				{/each}
			</th>
		</tr>
	</thead>
	<tbody class="text-gray-300 text-sm">
		<tr class="flex items-center justify-center">
			{#each kills as kill (kill.killmail_id)}
				<td
					class="flex flex-col items-center justify-center p-6"
					on:click={() => (window.location.href = `/kill/${kill.killmail_id}`)}
				>
					<img
						src="{kill.victim.ship_image_url}?size=128"
						alt="Ship: {kill.victim.ship_name}"
						class="rounded"
					/>
					<div class="text-center">
						{kill.victim.ship_name}
						<br />
						{formatNumber(kill.total_value)} ISK
					</div>
				</td>
			{/each}
		</tr>
		<tr class="text-center py-2 text-gray-400">
			<td colspan={categories.length}>(Over last 7 days)</td>
		</tr>
	</tbody>
</table>

<style>
	.table-auto {
		width: 100%;
	}

	.tab-btn {
		cursor: pointer;
		background-color: transparent;
		color: #a0aec0;
		padding: 0.5rem 1rem;
		border: none;
		outline: none;
		transition: color 0.3s ease;
	}

	.tab-btn:hover,
	.active-tab {
		color: #edf2f7;
	}

	.active-tab {
		border-bottom: 2px solid #edf2f7;
		font-weight: bold;
	}
</style>
