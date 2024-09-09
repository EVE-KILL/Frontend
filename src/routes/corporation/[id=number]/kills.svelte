<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '$lib/types/Corporation.ts';
	import KillList from '$lib/components/KillList.svelte';
	export let corporation: Corporation;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/attackers.corporation_id/${corporation.corporation_id}`;
	let subscriptionTopic = `corporation.${corporation.corporation_id}`;
	let filter = { field: 'attackers.corporation_id', value: corporation.corporation_id };
</script>

<KillList url={killlistUrl} {subscriptionTopic} {filter} />
