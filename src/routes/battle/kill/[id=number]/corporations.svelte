<script lang="ts">
	import { convertIskToBillions } from '$lib/Helpers.ts';
	export let blueTeamCorporations;
	export let redTeamCorporations;
</script>

<div class="mt-4 grid grid-cols-2 gap-4">
	<!-- Blue Team Corporations -->
	<div>
		<div class="mb-2 text-lg font-bold">Blue Team Corporations</div>
		<div class="overflow-x-auto" role="table">
			<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
				<thead>
					<tr class="bg-darker text-white uppercase text-xs leading-normal">
						<th class="px-2 py-1" scope="col">Corporation</th>
						<th class="px-2 py-1" scope="col">Kills</th>
						<th class="px-2 py-1" scope="col">Total Value</th>
					</tr>
				</thead>
				<tbody class="text-gray-300 text-sm">
					{#each blueTeamCorporations as corporation}
						<tr class="border-b border-gray-700 hover:bg-background-600 transition-colors duration-300">
							<td class="px-2 py-1">{corporation.name}</td>
							<td class="px-2 py-1">{corporation.kills}</td>
							<td class="px-2 py-1">{convertIskToBillions(corporation.totalValue)} ISK</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Red Team Corporations -->
	<div>
		<div class="mb-2 text-lg font-bold">Red Team Corporations</div>
		<div class="overflow-x-auto" role="table">
			<table class="table-auto min-w-full bg-semi-transparent bg-background-800 rounded-lg shadow-lg">
				<thead>
					<tr class="bg-darker text-white uppercase text-xs leading-normal">
						<th class="px-2 py-1" scope="col">Corporation</th>
						<th class="px-2 py-1" scope="col">Kills</th>
						<th class="px-2 py-1" scope="col">Total Value</th>
					</tr>
				</thead>
				<tbody class="text-gray-300 text-sm">
					{#each redTeamCorporations as corporation}
						<tr class="border-b border-gray-700 hover:bg-background-600 transition-colors duration-300">
							<td class="px-2 py-1">{corporation.name}</td>
							<td class="px-2 py-1">{corporation.kills}</td>
							<td class="px-2 py-1">{convertIskToBillions(corporation.totalValue)} ISK</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
