<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '$lib/types/Character.js';
	import KillList from '$lib/components/KillList.svelte';
	export let data: any;
	let character: Character = data.character;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/combined/character/${character.character_id}`;
</script>

<KillList url={killlistUrl} combinedKillsAndLosses={true} combinedVictimType="character" combinedVictimId={character.character_id} />
