<script lang="ts">
	import { onMount } from 'svelte';
	import type { Killmail } from '../../../types/Killmail.ts';

	import Attackers from '../../../components/Kill/Attackers.svelte';
	import Comments from '../../../components/Kill/Comments.svelte';
	import FittingWheel from '../../../components/Kill/FittingWheel.svelte';
	import Items from '../../../components/Kill/Items.svelte';
	import InformationBox from '../../../components/Kill/InformationBox.svelte';
	import Navbar from '../../../components/Kill/Navbar.svelte';

	export let data;
	let killmail: Killmail = data.killmail;

	let activeTab = 1; // Set Attackers as the default tab
	const tabs = [
		{ name: "Comments", count: killmail.comment_count || 0 }, // Initialize comment count to 0
		{ name: "Attackers", count: killmail.attackers.length }
	];

	// Callback to receive the comment count from the Comments component
	function updateCommentCount(count) {
		tabs[0].count = count; // Update the comment count in the tabs array
	}
</script>

{#if killmail}
    <!-- Navbar -->
    <Navbar killmail={killmail} />

    <div class="container flex p-2 pt-4 gap-2">
        <!-- Left Container -->
        <div class="w-full text-white p-4 rounded-lg shadow-lg">
            <div id="information-area" class="flex justify-around">
                <!-- Fitting Wheel -->
                <FittingWheel {killmail} />

                <!-- Kill Information -->
                <div class="information-box ml-5">
                    <InformationBox {killmail} />
                </div>
            </div>

            <!-- Items -->
            <Items {killmail} />
        </div>

        <!-- Right Container -->
        <div class="w-2/4 text-white p-4 rounded-lg shadow-lg" style="max-width: 500px;">
            <!-- Tabs -->
            <div class="tab-container">
                {#each tabs as tab, index}
                    <button
                        class="tab-btn"
                        class:active-tab={activeTab === index}
                        on:click={() => (activeTab = index)}
                    >
                        {tab.name} {#if tab.count}({tab.count}){/if}
                    </button>
                {/each}
            </div>

            <!-- Tab content -->
            {#if activeTab === 0}
                <Comments identifier="kill:{killmail.killmail_id}" on:count={e => updateCommentCount(e.detail)} />
            {/if}
            {#if activeTab === 1}
                <Attackers attackers={killmail.attackers} />
            {/if}
        </div>
    </div>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: row;
	}

	.tab-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.tab-btn {
		cursor: pointer;
		background-color: transparent;
		color: #a0aec0;
		padding: 0.5rem 1rem;
		border: none;
		outline: none;
		transition: color 0.3s ease;
	}

	.tab-btn:hover,
	.active-tab {
		color: #edf2f7;
	}

	.active-tab {
		border-bottom: 2px solid #edf2f7;
		font-weight: bold;
	}
</style>
