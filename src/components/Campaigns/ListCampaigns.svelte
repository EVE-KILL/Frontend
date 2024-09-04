<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getUpstreamUrl } from '$lib/Config';

    let campaigns = [];
    let page = 1;
    let loading = false;
    let upstreamUrl = getUpstreamUrl();
    const campaignsPerPage = 100;

    // Fetch campaigns from API
    const fetchCampaigns = async () => {
        if (loading) return;
        loading = true;
        try {
            const response = await fetch(`${upstreamUrl}/api/campaigns/${page}`);
            const data = await response.json();
            campaigns = data || [];

            console.log(campaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            loading = false;
        }
    };

    // Change page and reload campaigns
    const changePage = (newPage) => {
        if (newPage > 0) {
            page = newPage;
            fetchCampaigns();
            updateURL();
        }
    };

    // Update URL to reflect the current page
    const updateURL = () => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('campaignPage', String(page));
        goto(newUrl.toString(), { replaceState: true });
    };

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('campaignPage');
        if (pageParam) {
            page = parseInt(pageParam, 10);
        }
        fetchCampaigns();
    });
</script>

<!-- Pagination Control at the Top -->
<div class="flex justify-between items-center mb-4">
    <button
        on:click={() => changePage(page - 1)}
        disabled={page === 1 || loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Previous
    </button>
    <span class="text-white">Page {page}</span>
    <button
        on:click={() => changePage(page + 1)}
        disabled={loading || campaigns.length < campaignsPerPage}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Next
    </button>
</div>

<!-- Campaigns Table -->
<div class="overflow-x-auto" role="table">
    <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
        <thead>
            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                <th class="px-4 py-2 w-1/6 text-left" scope="col">Name</th>
                <th class="px-4 py-2 w-1/3 text-left" scope="col">Description</th>
                <th class="px-4 py-2 w-1/12 text-right" scope="col">Kills</th>
                <th class="px-4 py-2 w-1/12 text-right" scope="col">Active Pilots</th>
                <th class="px-4 py-2 w-1/12 text-right" scope="col">Active Corporations</th>
                <th class="px-4 py-2 w-1/12 text-right" scope="col">Active Alliances</th>
                <th class="px-4 py-2 w-1/6 text-left" scope="col">Last Modified</th>
            </tr>
        </thead>

        <tbody class="text-gray-300 text-sm">
            {#each campaigns as campaign (campaign.campaign_id)}
                <tr
                    class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                    on:click={() => { window.location.href = `/campaigns/${campaign.campaign_id}`; }}
                >
                    <td class="px-4 py-2 w-1/6 text-left">
                        {campaign.name}
                    </td>
                    <td class="px-4 py-2 w-1/3 text-left">
                        {campaign.description ? campaign.description : "No description"}
                    </td>
                    <td class="px-4 py-2 w-1/12 text-right">
                        {campaign.stats.totalKills}
                    </td>
                    <td class="px-4 py-2 w-1/12 text-right">
                        {campaign.stats.foeActivePilots + campaign.stats.friendlyActivePilots}
                    </td>
                    <td class="px-4 py-2 w-1/12 text-right">
                        {campaign.stats.foeActiveCorporations + campaign.stats.friendlyActiveCorporations}
                    </td>
                    <td class="px-4 py-2 w-1/12 text-right">
                        {campaign.stats.foeActiveAlliances + campaign.stats.friendlyActiveAlliances}
                    </td>
                    <td class="px-4 py-2 w-1/6 text-left">
                        {campaign.last_modified}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- Pagination Control at the Bottom -->
<div class="flex justify-between items-center mt-4">
    <button
        on:click={() => changePage(page - 1)}
        disabled={page === 1 || loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Previous
    </button>
    <span class="text-white">Page {page}</span>
    <button
        on:click={() => changePage(page + 1)}
        disabled={loading || campaigns.length < campaignsPerPage}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Next
    </button>
</div>
