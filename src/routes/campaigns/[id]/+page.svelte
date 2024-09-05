<script lang="ts">
    import { tick } from 'svelte';
    import { page } from '$app/stores';

    // Components (Placeholders for now)
    import Information from './Information.svelte';

    // Campaign data passed into the component
    export let data;
    let campaign = data.campaign;

    // Active component state
    let activeComponent = Information;
    let currentHash = '#information'; // Default tab is '#information'

    // Function to map hash to component
    const hashToComponent = {
        '#information': Information, // Only Information for now
        // Add other components here as you develop them
    };

    // Load the appropriate component based on the URL hash
    function loadComponentFromHash(hash) {
        if (!hash || hash === '#') {
            activeComponent = Information; // Load Information by default
            currentHash = '#information';
        } else {
            const component = hashToComponent[hash];
            activeComponent = component || Information;
            currentHash = hash;
        }
    }

    function loadComponent(component, hash) {
        activeComponent = component;
        window.location.hash = hash;
        currentHash = hash;
    }

    // Watch for URL changes to update the active component
    page.subscribe(async ($page) => {
        loadComponentFromHash($page.url.hash);
        await tick(); // Ensure DOM updates
    });
</script>

<!-- Description Section -->
<div class="p-4 text-white flex justify-between items-center shadow-lg">
    <div>
        <h1 class="text-2xl font-bold">{campaign.name}</h1>
        <p class="text-sm text-gray-400">{campaign.description}</p>
    </div>
    <div>
        <span class="text-sm">Campaign ID: {campaign.campaign_id}</span>
    </div>
</div>

<!-- Navbar -->
<div class="mt-4">
    <nav class="bg-semi-transparent text-white py-2 px-4 rounded">
        <ul class="flex space-x-4">
            <li>
                <a
                    href="#information"
                    class="hover:underline {currentHash === '#information' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Information, '#information')}
                >
                    Information
                </a>
            </li>
            <!-- Add more tabs here later -->
        </ul>
    </nav>
</div>

<!-- Main Content -->
<div class="container mt-4 p-4 rounded bg-semi-transparent text-white shadow-lg">
    {#if activeComponent}
        <svelte:component this={activeComponent} {campaign} />
    {/if}
</div>

<style>
    .active {
        text-decoration: underline;
    }
</style>
