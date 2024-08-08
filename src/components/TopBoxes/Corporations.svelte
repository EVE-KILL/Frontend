<script lang="ts">
	import { onMount } from 'svelte';
	import type { Corporation } from '../../types/Top/Corporation';

	export let url: string;
	export let count: number = 10;
	export let days: number = 7;
	let corporations: Corporation[] = [];

	onMount(async () => {
		const response = await fetch(url);
		corporations = await response.json();
	});
</script>

<div class="overflow-x-auto" role="table">
	<table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
		<thead>
			<tr class="bg-darker text-white uppercase text-xs leading-normal">
				<th class="px-2 py-1" scope="col" colspan="3">Top {count} Corporations</th>
			</tr>
		</thead>
		<tbody class="text-gray-300 text-sm">
			{#each corporations as corporation (corporation.corporation_id)}
				<tr
					class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
					on:click={(window.location.href = `/corporation/${corporation.corporation_id}`)}
				>
					<td class="px2 py-1">
						<img
							src="https://images.evetech.net/corporations/{corporation.corporation_id}/logo?size=32"
							alt="Corporation: {corporation.name}"
						/>
					</td>
					<td class="px-2 py-1">
						<div class="flex items-center">
							<div>
								<div class="text-blue-400">{corporation.name}</div>
							</div>
						</div>
					</td>
					<td class="px-2 py-1">
						<span class="ml-2">{corporation.count}</span>
					</td>
				</tr>
			{/each}
			<tr>
				<td colspan="4" class="text-center py-2 text-gray-400">(Kills over last {days} days)</td>
			</tr>
		</tbody>
	</table>
</div>
