<script lang="ts">
	import type { Killmail } from '../types/Killmail';
	import { formatNumber } from '$lib/Helpers.ts';
	import { onMount } from 'svelte';
	export let url: string;
	let kills: Killmail[] = [];

	onMount(async () => {
		const response = await fetch(url);
		kills = await response.json();
	});
</script>

<table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
	<tbody class="text-gray-300 text-sm">
		<tr class="bg-darker text-white uppercase text-xs leading-normal">
			<th class="px-2 py-1" scope="col">Most Valuable Kills</th>
		</tr>
		<tr class="flex items-center justify-center">
			{#each kills as kill (kill.killmail_id)}
				<td
					class="flex flex-col items-center justify-center p-6"
					on:click={(window.location.href = `/kill/${kill.killmail_id}`)}
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
			<td>(Over last 7 days)</td>
		</tr>
	</tbody>
</table>
