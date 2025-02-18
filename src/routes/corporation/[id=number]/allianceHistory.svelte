<script lang="ts">
	import { backendFetch } from '$lib/backendFetcher';
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '$lib/types/Corporation.ts';
	import { onMount } from 'svelte';

	export let corporation: Corporation;
	let allianceHistory = [];
	const upstreamUrl = getUpstreamUrl();
	let allianceHistoryUrl = `${upstreamUrl}/api/corporations/${corporation.corporation_id}/alliancehistory`;

	onMount(async () => {
		const response = await backendFetch(allianceHistoryUrl);
		allianceHistory = await response.json();
	});
</script>

{#if allianceHistory.length > 0}
	<div class="overflow-x-auto" role="table">
		<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
			<thead>
				<tr class="bg-darker text-white uppercase text-xs leading-normal">
					<th class="px-2 py-1" scope="col">Alliance</th>
					<th class="px-2 py-1" scope="col">Join Date</th>
					<th class="px-2 py-1" scope="col">Leave Date</th>
				</tr>
			</thead>
			<tbody class="text-background-300 text-sm">
				{#each allianceHistory as history}
					{#if history.alliance_id}
						<tr
							class="border-b border-background-700 hover:bg-background-600 transition-colors duration-300"
							on:click={(window.location.href = `/alliance/${history.alliance_id}`)}
						>
							<td class="px-2 py-1">{history.alliance_name}</td>
							<td class="px-2 py-1">{history.start_date}</td>
							<td class="px-2 py-1">
								{#if history.end_date}
									{history.end_date}
								{/if}
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{/if}
