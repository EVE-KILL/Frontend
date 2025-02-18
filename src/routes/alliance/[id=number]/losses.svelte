<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Alliance } from '$lib/types/Alliance.ts';
	import KillList from '$lib/components/KillList.svelte';
	export let alliance: Alliance;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/losses/alliance/${alliance.alliance_id}`;
</script>

<KillList url={killlistUrl} />
