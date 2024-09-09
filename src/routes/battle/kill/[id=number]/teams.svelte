<script lang="ts">
	import { formatNumber, convertIskToBillions } from '$lib/Helpers';
	import { CollapsibleCard } from 'svelte-collapsible';

	export let blueTeamStats;
	export let redTeamStats;
	export let blueTeamAlliances;
	export let redTeamAlliances;
	export let blueTeamCorporations;
	export let redTeamCorporations;
</script>

<div class="grid grid-cols-2 gap-4">
	<!-- Blue Team -->
	<div>
		<div class="mb-2 text-lg font-bold">Blue Team</div>
		<div class="bg-background-800 p-2 rounded-lg shadow-lg">
			<div class="mb-2 text-lg font-bold">Blue Team</div>
			<div class="mb-2 text-sm text-gray-400">
				ISK Lost: {convertIskToBillions(blueTeamStats.iskLost)} ISK | Ships Lost: {blueTeamStats.shipsLost}
				| Damage Inflicted: {formatNumber(blueTeamStats.damageInflicted)}
			</div>
			<ul class="list-none">
				<!-- Alliances and their Corporations -->
				{#each blueTeamAlliances as alliance}
					<li class="mb-2">
						<CollapsibleCard open={false}>
							<div class="flex items-center cursor-pointer" slot="header">
								<span class="text-xl font-bold"
									>{alliance.name} ({blueTeamCorporations.filter((corp) => corp.alliance_id === alliance.id).length})</span
								>
							</div>
							<ul class="ml-4 mt-1 text-sm list-disc" slot="body">
								{#each blueTeamCorporations.filter((corp) => corp.alliance_id === alliance.id) as corp}
									<p>- {corp.name}</p>
								{/each}
							</ul>
						</CollapsibleCard>
					</li>
				{/each}

				<!-- Space between alliances and standalone corporations -->
				<li class="my-4"></li>

				<!-- Standalone Corporations -->
				{#if blueTeamCorporations.filter((corp) => !corp.alliance_id).length > 0}
					<li class="mt-4">
						<CollapsibleCard open={false}>
							<div class="flex items-center cursor-pointer" slot="header">
								<span class="font-bold text-lg">
									Standalone Corporations ({blueTeamCorporations.filter((corp) => !corp.alliance_id).length})
								</span>
							</div>
							<ul class="ml-4 mt-1 list-disc text-sm" slot="body">
								{#each blueTeamCorporations.filter((corp) => !corp.alliance_id) as corp}
									<p>- {corp.name}</p>
								{/each}
							</ul>
						</CollapsibleCard>
					</li>
				{/if}
			</ul>
		</div>
	</div>

	<!-- Red Team -->
	<div>
		<div class="mb-2 text-lg font-bold">Red Team</div>
		<div class="bg-background-800 p-2 rounded-lg shadow-lg">
			<div class="mb-2 text-lg font-bold">Red Team</div>
			<div class="mb-2 text-sm text-gray-400">
				ISK Lost: {convertIskToBillions(redTeamStats.iskLost)} ISK | Ships Lost: {redTeamStats.shipsLost}
				| Damage Inflicted: {formatNumber(redTeamStats.damageInflicted)}
			</div>
			<ul class="list-none">
				<!-- Alliances and their Corporations -->
				{#each redTeamAlliances as alliance}
					<li class="mb-2">
						<CollapsibleCard open={false}>
							<div class="flex items-center cursor-pointer" slot="header">
								<span class="text-xl font-bold"
									>{alliance.name} ({redTeamCorporations.filter((corp) => corp.alliance_id === alliance.id).length})</span
								>
							</div>
							<ul class="ml-4 mt-1 text-sm list-disc" slot="body">
								{#each redTeamCorporations.filter((corp) => corp.alliance_id === alliance.id) as corp}
									<p>- {corp.name}</p>
								{/each}
							</ul>
						</CollapsibleCard>
					</li>
				{/each}

				<!-- Space between alliances and standalone corporations -->
				<li class="my-4"></li>

				<!-- Standalone Corporations -->
				{#if redTeamCorporations.filter((corp) => !corp.alliance_id).length > 0}
					<li class="mt-4">
						<CollapsibleCard open={false}>
							<div class="flex items-center cursor-pointer" slot="header">
								<span class="font-bold text-lg">
									Standalone Corporations ({redTeamCorporations.filter((corp) => !corp.alliance_id).length})
								</span>
							</div>
							<ul class="ml-4 mt-1 list-disc text-sm" slot="body">
								{#each redTeamCorporations.filter((corp) => !corp.alliance_id) as corp}
									<p>- {corp.name}</p>
								{/each}
							</ul>
						</CollapsibleCard>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</div>

<style>
	.ml-4 {
		margin-left: 1rem;
	}
</style>
