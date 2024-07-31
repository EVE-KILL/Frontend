<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '../../../types/Character.ts';
	import type { Corporation } from '../../../types/Corporation.ts';
	import { onMount } from 'svelte';

	export let corporation: Corporation;
	export let members: Character[];
	const upstreamUrl = getUpstreamUrl();
	let url = `${upstreamUrl}/api/corporations/${corporation.corporation_id}/members`;

	onMount(async () => {
		const res = await fetch(url);
		members = await res.json();
	});
</script>

{#if members}
	<div class="overflow-x-auto" role="table">
		<table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
			<thead>
				<tr class="bg-darker text-white uppercase text-xs leading-normal">
					<th class="px-2 py-1 text-center" scope="col">Character</th>
				</tr>
			</thead>
			<tbody class="text-gray-300 text-sm">
				{#each members as member}
					<tr
						class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
						on:click={(window.location.href = `/character/${member.character_id}`)}
					>
						<td class="px-2 py-1 text-center">{member.name}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
