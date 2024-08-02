<script lang="ts">
	import KillList from '../../../components/KillList.svelte';
	import { getUpstreamUrl } from '$lib/Config';
	import { onMount, afterUpdate } from 'svelte';

	export let data;
	const upstreamUrl = getUpstreamUrl();
	let killListUrl: string;
	let type: string;
	let isReady = false;

	afterUpdate(async() => {
		type = data.type;
		killListUrl = `${upstreamUrl}/api/killlist/${type}`;
	});

	onMount(async () => {
		type = data.type;
		killListUrl = `${upstreamUrl}/api/killlist/${type}`;
		isReady = true;
	});

	function upperCaseFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

</script>

{#if isReady}
	<div class="container flex p-2 pt-4 gap-2">
		<div class="w-full">
			<KillList url={killListUrl} title={upperCaseFirstLetter(type)} />
		</div>
	</div>
{/if}
