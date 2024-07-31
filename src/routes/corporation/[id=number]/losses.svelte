<script lang="ts">
	import { getUpstreamUrl } from '$lib/Config';
	import type { Corporation } from '../../../types/Corporation.ts';
	import KillList from '../../../components/KillList.svelte';
	export let corporation: Corporation;
	const upstreamUrl = getUpstreamUrl();
	let killlistUrl = `${upstreamUrl}/api/killlist/victim.corporation_id/${corporation.corporation_id}`;
	let wsFilter = {
		'victim.corporation_id': corporation.corporation_id
	};
</script>

<KillList url={killlistUrl} {wsFilter} />
