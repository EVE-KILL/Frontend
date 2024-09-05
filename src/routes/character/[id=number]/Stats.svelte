<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '../../../types/Character.ts';
	import Ships from '../../../components/TopBoxes/Ships.svelte';
	import Systems from '../../../components/TopBoxes/Systems.svelte';
	import Regions from '../../../components/TopBoxes/Regions.svelte';

	export let data: any;
	let character: Character = data.character;
	const upstreamUrl = getUpstreamUrl();
	const top10ShipsUrl = `${upstreamUrl}/api/characters/${character.character_id}/top/ships`;
	const top10SystemsUrl = `${upstreamUrl}/api/characters/${character.character_id}/top/systems`;
	const top10RegionsUrl = `${upstreamUrl}/api/characters/${character.character_id}/top/regions`;
</script>

<div class="container flex p-2 pt-4 gap-2">
	<div class="flex-1 pb-5">
		<Ships url={top10ShipsUrl} />
	</div>
	<div class="flex-1 pb-5">
		<Systems url={top10SystemsUrl} />
	</div>
	<div class="flex-1 pb-5">
		<Regions url={top10RegionsUrl} />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
	}
	.flex-1 {
		flex: 1 1 0;
	}
</style>
