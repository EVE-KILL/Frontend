<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '$lib/types/Character.js';
	import KillList from '$lib/components/KillList.svelte';
	export let data: any;
	let character: Character = data.character;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/combined/character_id/${character.character_id}`;
	let subscriptionTopic = `character.${character.character_id}`;
	let filter = { field: 'victim.character_id', value: character.character_id };
</script>

<KillList
	url={killlistUrl}
	{subscriptionTopic}
	{filter}
	combinedKillsAndLosses={true}
	combinedVictimType="character"
	combinedVictimId={character.character_id}
/>
