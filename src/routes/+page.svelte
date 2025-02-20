<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import KillList from '$lib/components/KillList.svelte';
	import MostValuableKills from '$lib/components/MostValuableKills.svelte';
	import Characters from '$lib/components/TopBoxes/Characters.svelte';
	import Corporations from '$lib/components/TopBoxes/Corporations.svelte';
	import Alliances from '$lib/components/TopBoxes/Alliances.svelte';
	import Ships from '$lib/components/TopBoxes/Ships.svelte';
	import Systems from '$lib/components/TopBoxes/Systems.svelte';
	import Constellations from '$lib/components/TopBoxes/Constellations.svelte';
	import Regions from '$lib/components/TopBoxes/Regions.svelte';

	const upstreamUrl = getUpstreamUrl();

	const mostValuableKillsUrl = `${upstreamUrl}/api/stats?type=most_valuable_kills&days=7&limit=7`;
	const mostValuableShipKillsUrl = `${upstreamUrl}/api/stats?type=most_valuable_ships&days=7&limit=7`;
	const mostValuableStructureKillsUrl = `${upstreamUrl}/api/stats?type=most_valuable_structures&days=7&limit=7`;
	const killListUrl = `${upstreamUrl}/api/killlist?type=latest`;
	const topCharactersUrl = `${upstreamUrl}/api/stats?type=characters&limit=10`;
	const topCorporationsUrl = `${upstreamUrl}/api/stats?type=corporations&limit=10`;
	const topAlliancesUrl = `${upstreamUrl}/api/stats?type=alliances&limit=10`;
	const topShipsUrl = `${upstreamUrl}/api/stats?type=ships&limit=10`;
	const topSystemsUrl = `${upstreamUrl}/api/stats?type=solarsystems&limit=10`;
	const topConstellationsUrl = `${upstreamUrl}/api/stats?type=constellations&limit=10`;
	const topRegionsUrl = `${upstreamUrl}/api/stats?type=regions&limit=10`;
</script>

<div class="flex w-full">
	<MostValuableKills
		categories={[
			{ name: 'Most Valuable Kills', url: mostValuableKillsUrl },
			{ name: 'Most Valuable Structures', url: mostValuableStructureKillsUrl },
			{ name: 'Most Valuable Ships', url: mostValuableShipKillsUrl }
		]}
	/>
</div>

<div class="flex p-2 pt-4 gap-2">
	<div class="w-1/4">
		<div class="pb-5">
			<Characters url={topCharactersUrl} />
		</div>
		<div class="pb-5">
			<Corporations url={topCorporationsUrl} />
		</div>
		<div class="pb-5">
			<Alliances url={topAlliancesUrl} />
		</div>
		<div class="pb-5">
			<Ships url={topShipsUrl} />
		</div>
		<div class="pb-5">
			<Systems url={topSystemsUrl} />
		</div>
		<div class="pb-5">
			<Constellations url={topConstellationsUrl} />
		</div>
		<div class="pb-5">
			<Regions url={topRegionsUrl} />
		</div>
	</div>
	<div class="w-full">
		<KillList url={killListUrl} />
	</div>
</div>
