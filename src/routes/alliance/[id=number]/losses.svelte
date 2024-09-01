<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Alliance } from '../../../types/Alliance.ts';
	import KillList from '../../../components/KillList.svelte';
	export let alliance: Alliance;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/victim.alliance_id/${alliance.alliance_id}`;
	let subscriptionTopic = `alliance.${alliance.alliance_id}`;
	let filter = { field: 'victim.alliance_id', value: alliance.alliance_id };
</script>

<KillList url={killlistUrl} subscriptionTopic={subscriptionTopic} filter={filter} />
