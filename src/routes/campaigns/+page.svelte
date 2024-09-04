<script lang="ts">
  import { onMount } from 'svelte';
  import { session } from '$lib/stores/Session';
  import Modal from '../../components/Campaigns/Modal.svelte';
  import ListCampaigns from '../../components/Campaigns/ListCampaigns.svelte';

  let user: any = null;
  let showModal = false;
	// Subscribe to the session to get the user data
	$: session.subscribe((value) => {
		user = value.user;
	});
</script>

<div class="mt-4">
	<!-- Only show the create campaign button if the user is logged in -->
	{#if user}
		<nav class="bg-semi-transparent text-white py-2 px-4 rounded flex justify-end">
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all"
				on:click={() => (showModal = true)}
			>
				Create Campaign
			</button>
		</nav>
	{/if}
</div>

<!-- Modal -->
<Modal showModal={showModal} />

<!-- ListCampaigns -->
<ListCampaigns />
