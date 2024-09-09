<script lang="ts">
	import type Killmail from '$lib/types/Killmail.ts';
	import { formatNumber, convertIskToBillions } from '$lib/Helpers.ts';

	export let blueTeamKills: Killmail[] = [];
	export let redTeamKills: Killmail[] = [];

	function truncateString(str: string, num: number) {
		return str.length <= num ? str : str.slice(0, num) + '...';
	}
</script>

<!-- Kills List -->
<div class="mt-4 grid grid-cols-2 gap-4">
	<!-- Blue Team Kills -->
	<div>
		<div class="mb-2 text-lg font-bold">Blue Team Losses</div>
		<div class="overflow-x-auto" role="table">
			<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
				<thead>
					<tr class="bg-darker text-white uppercase text-xs leading-normal">
						<th class="px-2 py-1 w-[64px]" scope="col"></th>
						<th class="px-2 py-1" scope="col">Ship</th>
						<th class="px-2 py-1 w-[64px]" scope="col"></th>
						<th class="px-2 py-1" scope="col">Victim</th>
						<th class="px-2 py-1" scope="col">Final Blow</th>
					</tr>
				</thead>
				<tbody class="text-gray-300 text-sm">
					{#each blueTeamKills as kill}
						<tr
							class="border-b border-gray-700 hover:bg-background-600 transition-colors duration-300"
							on:click={() => (window.location.href = `/kill/${kill.killmail_id}`)}
						>
							<td class="px-2 py-1">
								<img src="{kill.victim.ship_image_url}?size=64" alt="Ship: {kill.victim.ship_name}" class="w-10 rounded" />
							</td>
							<td class="px-2 py-1">
								{truncateString(kill.victim.ship_name, 20)}<br />
								{#if kill.total_value > 50}
									<span class="text-gray-400">{formatNumber(kill.total_value)} ISK</span>
								{/if}
							</td>
							<td class="px-2 py-1">
								<img src="{kill.victim.character_image_url}?size=64" alt="Character: {kill.victim.character_name}" class="w-10 rounded" />
							</td>
							<td class="px-2 py-1"
								>{kill.victim.character_name}<br /><span class="text-gray-400">{truncateString(kill.victim.corporation_name, 22)}</span></td
							>
							<td class="px-2 py-1">
								{#if Array.isArray(kill.attackers)}
									{#each kill.attackers as attacker}
										{#if attacker.final_blow}
											{#if kill.is_npc}
												{attacker.faction_name}<br /><span class="text-gray-400">{truncateString(attacker.ship_group_name, 22)}</span>
											{:else}
												{attacker.character_name}<br /><span class="text-gray-400">{truncateString(attacker.corporation_name, 22)}</span>
											{/if}
										{/if}
									{/each}
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Red Team Kills -->
	<div>
		<div class="mb-2 text-lg font-bold">Red Team Losses</div>
		<div class="overflow-x-auto" role="table">
			<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
				<thead>
					<tr class="bg-darker text-white uppercase text-xs leading-normal">
						<th class="px-2 py-1 w-[64px]" scope="col"></th>
						<th class="px-2 py-1" scope="col">Ship</th>
						<th class="px-2 py-1 w-[64px]" scope="col"></th>
						<th class="px-2 py-1" scope="col">Victim</th>
						<th class="px-2 py-1" scope="col">Final Blow</th>
					</tr>
				</thead>
				<tbody class="text-gray-300 text-sm">
					{#each redTeamKills as kill}
						<tr
							class="border-b border-gray-700 hover:bg-background-600 transition-colors duration-300"
							on:click={() => (window.location.href = `/kill/${kill.killmail_id}`)}
						>
							<td class="px-2 py-1">
								<img src="{kill.victim.ship_image_url}?size=64" alt="Ship: {kill.victim.ship_name}" class="w-10 rounded" />
							</td>
							<td class="px-2 py-1">
								{truncateString(kill.victim.ship_name, 20)}<br />
								{#if kill.total_value > 50}
									<span class="text-gray-400">{formatNumber(kill.total_value)} ISK</span>
								{/if}
							</td>
							<td class="px-2 py-1">
								<img src="{kill.victim.character_image_url}?size=64" alt="Character: {kill.victim.character_name}" class="w-10 rounded" />
							</td>
							<td class="px-2 py-1"
								>{kill.victim.character_name}<br /><span class="text-gray-400">{truncateString(kill.victim.corporation_name, 22)}</span></td
							>
							<td class="px-2 py-1">
								{#if Array.isArray(kill.attackers)}
									{#each kill.attackers as attacker}
										{#if attacker.final_blow}
											{#if kill.is_npc}
												{attacker.faction_name}<br /><span class="text-gray-400">{truncateString(attacker.ship_group_name, 22)}</span>
											{:else}
												{attacker.character_name}<br /><span class="text-gray-400">{truncateString(attacker.corporation_name, 22)}</span>
											{/if}
										{/if}
									{/each}
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
