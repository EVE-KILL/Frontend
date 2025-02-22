<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';

	export let blueTeamCharacters;
	export let redTeamCharacters;

	import { convertIskToBillions } from '$lib/Helpers';
</script>

<div class="mt-4 grid grid-cols-2 gap-4">
	<!-- Blue Team Characters -->
	<div>
		<div class="mb-2 text-lg font-bold">Blue Team Characters</div>
		<div class="overflow-x-auto" role="table">
			<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
				<thead>
					<tr class="bg-darker text-white uppercase text-xs leading-normal">
						<th class="px-2 py-1" scope="col">Portrait</th>
						<th class="px-2 py-1" scope="col">Name</th>
						<th class="px-2 py-1" scope="col">Kills</th>
						<th class="px-2 py-1" scope="col">Total Value</th>
					</tr>
				</thead>
				<tbody class="text-background-300 text-sm">
					{#each blueTeamCharacters as character}
						<tr class="border-b border-background-700 hover:bg-background-600 transition-colors duration-300">
							<td class="px-2 py-1">
								<img
									src={`https://images.eve-kill.com/characters/${character.id}/portrait?size=64`}
									alt="Character: {character.name}"
									class="w-8 h-8 rounded-full"
								/>
							</td>
							<td class="px-2 py-1">{character.name}</td>
							<td class="px-2 py-1">{character.kills}</td>
							<td class="px-2 py-1">{convertIskToBillions(character.totalValue)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Red Team Characters -->
	<div>
		<div class="mb-2 text-lg font-bold">Red Team Characters</div>
		<div class="overflow-x-auto" role="table">
			<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
				<thead>
					<tr class="bg-darker text-white uppercase text-xs leading-normal">
						<th class="px-2 py-1" scope="col">Portrait</th>
						<th class="px-2 py-1" scope="col">Name</th>
						<th class="px-2 py-1" scope="col">Kills</th>
						<th class="px-2 py-1" scope="col">Total Value</th>
					</tr>
				</thead>
				<tbody class="text-background-300 text-sm">
					{#each redTeamCharacters as character}
						<tr class="border-b border-background-700 hover:bg-background-600 transition-colors duration-300">
							<td class="px-2 py-1">
								<img
									src={`https://images.eve-kill.com/characters/${character.id}/portrait?size=64`}
									alt="Character: {character.name}"
									class="w-8 h-8 rounded-full"
								/>
							</td>
							<td class="px-2 py-1">{character.name}</td>
							<td class="px-2 py-1">{character.kills}</td>
							<td class="px-2 py-1">{convertIskToBillions(character.totalValue)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
