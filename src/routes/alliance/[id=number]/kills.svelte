<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Alliance } from '$lib/types/Alliance.ts';
	import KillList from '$lib/components/KillList.svelte';
	export let alliance: Alliance;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/attackers.alliance_id/${alliance.alliance_id}`;
	let subscriptionTopic = `alliance.${alliance.alliance_id}`;
	let filter = { field: 'attackers.alliance_id', value: alliance.alliance_id };
</script>

<KillList url={killlistUrl} {subscriptionTopic} {filter} />
