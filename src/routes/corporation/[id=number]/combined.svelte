<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '$lib/types/Corporation.js';
	import KillList from '$lib/components/KillList.svelte';
	export let corporation: Corporation;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/combined/corporation/${corporation.corporation_id}`;
</script>

<KillList url={killlistUrl} combinedKillsAndLosses={true} combinedVictimType="corporation" combinedVictimId={corporation.corporation_id} wsFilter={`corporation.${corporation.corporation_id}`} />
