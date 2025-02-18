<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '$lib/types/Corporation.ts';
	import KillList from '$lib/components/KillList.svelte';
	export let corporation: Corporation;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/losses/corporation/${corporation.corporation_id}`;
</script>

<KillList url={killlistUrl} wsFilter={`corporation.${corporation.corporation_id}`} />
