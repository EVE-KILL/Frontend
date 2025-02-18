<script lang="ts">
	import KillList from '$lib/components/KillList.svelte';
	import { page } from '$app/stores'; // Import the page store

	// Reactive statements to update data and type when the route changes
	$: data = $page.data;
	$: type = $page.params.type;

	// Function to capitalize the first letter of a string
	function upperCaseFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Reactive statement to update killListUrl when data or type changes
	$: killListUrl = `${data.upstreamUrl}/api/killlist?type=${type}`;
</script>

<div class="container flex p-2 pt-4 gap-2">
	<div class="w-full">
		{#key type}
		<KillList
			url={killListUrl}
			title={upperCaseFirstLetter(type)}
			wsFilter={type}
		/>
		{/key}
	</div>
</div>
