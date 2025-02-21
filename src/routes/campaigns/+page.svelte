<script lang="ts">
	import Modal from '$lib/components/Campaigns/Modal.svelte';
	import ListCampaigns from '$lib/components/Campaigns/ListCampaigns.svelte';

	let user: any = null;
	let showModal = false;
</script>

<div class="mt-4">
	<!-- Only show the create campaign button if the user is logged in -->
	{#if user}
		<nav class="bg-semi-transparent text-white py-2 px-4 rounded flex justify-end">
			<button
				class="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all"
				on:click={() => (showModal = true)}
			>
				Create Campaign
			</button>
		</nav>
	{/if}
</div>

<!-- Modal -->
<Modal {showModal} />

<!-- ListCampaigns -->
<ListCampaigns />
