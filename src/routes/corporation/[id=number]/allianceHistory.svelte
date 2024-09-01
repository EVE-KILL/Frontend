<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '../../../types/Corporation.ts';
	import { onMount } from 'svelte';

	export let corporation: Corporation;
	let allianceHistory = [];
	const upstreamUrl = getUpstreamUrl();
	let allianceHistoryUrl = `${upstreamUrl}/api/corporations/${corporation.corporation_id}/alliancehistory`;

	onMount(async () => {
		const response = await fetch(allianceHistoryUrl);
		allianceHistory = await response.json();
	});
</script>

{#if allianceHistory.length > 0}
	<div class="overflow-x-auto" role="table">
		<table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
			<thead>
				<tr class="bg-darker text-white uppercase text-xs leading-normal">
					<th class="px-2 py-1" scope="col">Alliance</th>
					<th class="px-2 py-1" scope="col">Join Date</th>
					<th class="px-2 py-1" scope="col">Leave Date</th>
				</tr>
			</thead>
			<tbody class="text-gray-300 text-sm">
				{#each allianceHistory as history}
					<tr
						class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
						on:click={(window.location.href = `/alliance/${history.alliance_id}`)}
					>
						<td class="px-2 py-1">{history.name}</td>
						<td class="px-2 py-1">{history.join_date}</td>
						<td class="px-2 py-1">
							{#if history.leave_date}
								{history.leave_date}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
