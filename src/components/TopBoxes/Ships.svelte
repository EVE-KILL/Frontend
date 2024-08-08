<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ship } from '../../types/Top/Ship';

	export let url: string;
	export let count: number = 10;
	export let days: number = 7;
	let ships: Ship[] = [];

	onMount(async () => {
		const response = await fetch(url);
		ships = await response.json();
	});
</script>

<div class="overflow-x-auto" role="table">
	<table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
		<thead>
			<tr class="bg-darker text-white uppercase text-xs leading-normal">
				<th class="px-2 py-1" scope="col" colspan="3">Top {count} Ships</th>
			</tr>
		</thead>
		<tbody class="text-gray-300 text-sm">
			{#each ships as ship (ship.type_id)}
				<tr
					class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
					on:click={() => (window.location.href = `/item/${ship.type_id}`)}
				>
					<td class="px2 py-1">
						<img
							src={`https://images.evetech.net/types/${ship.type_id}/render?size=32`}
							alt="Ship: {ship.name}"
						/>
					</td>
					<td class="px-2 py-1">
						<div class="flex items-center">
							<div>
								<div class="text-blue-400">{ship.name}</div>
							</div>
						</div>
					</td>
					<td class="px-2 py-1">
						<span class="ml-2">{ship.count}</span>
					</td>
				</tr>
			{/each}
			<tr>
				<td colspan="4" class="text-center py-2 text-gray-400">(Kills over last {days} days)</td>
			</tr>
		</tbody>
	</table>
</div>
