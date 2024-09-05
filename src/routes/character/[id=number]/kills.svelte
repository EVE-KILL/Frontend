<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Character } from '../../../types/Character.ts';
	import KillList from '../../../components/KillList.svelte';
	export let data: any;
	let character: Character = data.character;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/attackers.character_id/${character.character_id}`;
	let subscriptionTopic = `character.${character.character_id}`;
	let filter = { field: 'attackers.character_id', value: character.character_id };
</script>

<KillList url={killlistUrl} subscriptionTopic={subscriptionTopic} filter={filter} />
