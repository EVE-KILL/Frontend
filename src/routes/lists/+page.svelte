<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { page } from '$app/stores';
    import { getUpstreamUrl } from '$lib/Config';
    import Top207d from '../../components/Lists/Top207d.svelte';
    import Top2030d from '../../components/Lists/Top2030d.svelte';
    import Alliances from '../../components/Lists/Alliances.svelte';
    import Corporations from '../../components/Lists/Corporations.svelte';
    import Characters from '../../components/Lists/Characters.svelte';
    import Ships from '../../components/Lists/Ships.svelte';
    import Systems from '../../components/Lists/Systems.svelte';
    import Regions from '../../components/Lists/Regions.svelte';

    let activeComponent = Top207d;
    let currentHash = '#top207d'; // Default to '#top207d'
    const upstreamUrl = getUpstreamUrl();

    // Function to map hash to component
    const hashToComponent = {
        '#top207d': Top207d,
        '#top2030d': Top2030d,
        '#alliances': Alliances,
        '#corporations': Corporations,
        '#characters': Characters,
        '#ships': Ships,
        '#systems': Systems,
        '#regions': Regions,
    };

    // Load the appropriate component based on the URL hash
    function loadComponentFromHash(hash) {
        if (!hash || hash === '#') {
            activeComponent = Top207d; // Load Top20 by default if no hash or empty hash is present
            currentHash = '#top207d';
        } else {
            const component = hashToComponent[hash];
            activeComponent = component || Top207d;
            currentHash = hash;
        }
    }

    onMount(() => {
        // Check if the URL has a hash, if not, add #top207d and replace history
        if (!window.location.hash || window.location.hash === '#') {
            history.replaceState(null, '', `${window.location.pathname}#top207d`);
            loadComponentFromHash('#top207d');
        } else {
            // Load the component based on the current hash
            loadComponentFromHash(window.location.hash);
        }
    });

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

<style>
    .active {
        text-decoration: underline;
    }
</style>

<!-- Navbar -->
<div class="mt-4">
    <nav class="bg-semi-transparent text-white py-2 px-4 rounded">
        <ul class="flex space-x-4">
            <li>
                <a
                    href="#top207d"
                    class="hover:underline {currentHash === '#top207d' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Top207d, '#top207d')}
                >
                    Top 20 (7 days)
                </a>
            </li>
            <li>
                <a
                    href="#top2030d"
                    class="hover:underline {currentHash === '#top2030d' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Top2030d, '#top2030d')}
                >
                    Top 20 (30 days)
                </a>
            </li>
            <li>
                <a
                    href="#alliances"
                    class="hover:underline {currentHash === '#alliances' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Alliances, '#alliances')}
                >
                    Alliances
                </a>
            </li>
            <li>
                <a
                    href="#corporations"
                    class="hover:underline {currentHash === '#corporations' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Corporations, '#corporations')}
                >
                    Corporations
                </a>
            </li>
            <li>
                <a
                    href="#characters"
                    class="hover:underline {currentHash === '#characters' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Characters, '#characters')}
                >
                    Characters
                </a>
            </li>
            <li>
                <a
                    href="#ships"
                    class="hover:underline {currentHash === '#ships' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Ships, '#ships')}
                >
                    Ships
                </a>
            </li>
            <li>
                <a
                    href="#systems"
                    class="hover:underline {currentHash === '#systems' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Systems, '#systems')}
                >
                    Systems
                </a>
            </li>
            <li>
                <a
                    href="#regions"
                    class="hover:underline {currentHash === '#regions' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Regions, '#regions')}
                >
                    Regions
                </a>
            </li>
        </ul>
    </nav>
</div>

<!-- Main content -->
<div class="container mt-4 p-4 rounded">
    {#if activeComponent}
        <svelte:component this={activeComponent} />
    {/if}
</div>
