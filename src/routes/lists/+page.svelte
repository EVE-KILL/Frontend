<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { page } from '$app/stores';
    import { getUpstreamUrl } from '$lib/Config';
    import Top20 from '../../components/Lists/Top20.svelte';
    import Alliances from '../../components/Lists/Alliances.svelte';
    import Corporations from '../../components/Lists/Corporations.svelte';
    import Characters from '../../components/Lists/Characters.svelte';
    import Ships from '../../components/Lists/Ships.svelte';
    import Systems from '../../components/Lists/Systems.svelte';
    import Regions from '../../components/Lists/Regions.svelte';

    let activeComponent = Top20;
    let currentHash = '#top20'; // Default to '#top20'
    const upstreamUrl = getUpstreamUrl();

    // Function to map hash to component
    const hashToComponent = {
        '#top20': Top20,
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
            activeComponent = Top20; // Load Top20 by default if no hash or empty hash is present
            currentHash = '#top20';
        } else {
            const component = hashToComponent[hash];
            activeComponent = component || Top20;
            currentHash = hash;
        }
    }

    onMount(() => {
        // Check if the URL has a hash, if not, add #top20 and replace history
        if (!window.location.hash || window.location.hash === '#') {
            history.replaceState(null, '', `${window.location.pathname}#top20`);
            loadComponentFromHash('#top20');
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
                    href="#top20"
                    class="hover:underline {currentHash === '#top20' ? 'active' : ''}"
                    on:click|preventDefault={() => loadComponent(Top20, '#top20')}
                >
                    Top 20
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
