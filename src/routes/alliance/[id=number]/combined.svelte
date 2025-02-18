<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Alliance } from '$lib/types/Alliance.js';
	import KillList from '$lib/components/KillList.svelte';
	export let alliance: Alliance;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/combined/alliance/${alliance.alliance_id}`;
</script>

<KillList url={killlistUrl} combinedKillsAndLosses={true} combinedVictimType="alliance" combinedVictimId={alliance.alliance_id} wsFilter={`alliance.${alliance.alliance_id}`} />
