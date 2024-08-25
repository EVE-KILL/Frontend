<script lang="ts">
	import KillList from '../../../components/KillList.svelte';
	import { page } from '$app/stores'; // Import the page store to detect route changes

	export let data;

	let { type, killListUrl } = data;

	// Function to capitalize the first letter of a string
	function upperCaseFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Subscribe to the page store to detect when the URL changes
	page.subscribe(($page) => {
		// When the route changes, update the type and killListUrl
		if ($page.params.type !== type) {
			type = $page.params.type;
			killListUrl = `${data.upstreamUrl}/api/killlist/${type}`;
		}
	});
</script>

<div class="container flex p-2 pt-4 gap-2">
	<div class="w-full">
		<KillList url={killListUrl} title={upperCaseFirstLetter(type)} enableWs={false} />
	</div>
</div>
