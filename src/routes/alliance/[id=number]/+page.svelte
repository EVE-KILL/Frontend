<script lang="ts">
    import { tick } from 'svelte';
    import { page } from '$app/stores';
    import type { Alliance } from '../../../types/Alliance.ts';
    import Kills from './kills.svelte';
    import Losses from './losses.svelte';
    import Corporations from './corporations.svelte';
    import Members from './members.svelte';
    import Stats from './Stats.svelte';

    export let data;
    let alliance: Alliance = data.alliance;
    let activeComponent = Kills;
    let currentHash = '#kills'; // Default to '#kills'

    // Function to map hash to component
    const hashToComponent = {
        '#kills': Kills,
        '#losses': Losses,
        '#corporations': Corporations,
        '#members': Members,
        '#stats': Stats
    };

    // Load the appropriate component based on the URL hash
    function loadComponentFromHash(hash) {
        if (!hash || hash === '#') {
            activeComponent = Kills; // Load Kills by default if no hash or empty hash is present
            currentHash = '#kills';
        } else {
            const component = hashToComponent[hash];
            activeComponent = component || Kills;
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

<style>
    .active {
        text-decoration: underline;
    }
</style>

{#if alliance}
    <div class="container mx-auto p-4 text-white">
        <!-- Profile Section -->
        <div class="flex items-start">
            <!-- Profile Image with Additional Images -->
            <div class="flex items-center">
                <img
                    src="https://images.evetech.net/alliances/{alliance.alliance_id}/logo?size=256"
                    alt="Alliance: {alliance.name}"
                    class="rounded-full"
                />
                <div class="flex flex-col space-x-2 space-y-2">
                    <img
                        src="https://images.evetech.net/corporations/{alliance.faction_id}/logo?size=64"
                        alt="Faction: {alliance.faction_name}"
                        class="rounded-full"
                    />
                </div>
            </div>

            <!-- Profile Information Tables -->
            <div class="w-2/3 flex justify-between ml-5">
                <!-- First Table next to the image -->
                <div>
                    <table class="table-auto">
                        <tbody>
                            <tr>
                                <td class="font-bold text-right p-1">Alliance:</td>
                                <td>{alliance.name}</td>
                            </tr>
                            <tr>
                                <td class="font-bold text-right p-1">Ticker:</td>
                                <td>{alliance.ticker}</td>
                            </tr>
                            <tr on:click={() => window.location.href = `/faction/${alliance.faction_id}`}>
                                <td class="font-bold text-right p-1">Faction:</td>
                                <td>{alliance.faction_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="hidden">
                    <table class="table-auto">
                        <tbody>
                            <tr>
                                <td class="font-bold">Hidden:</td>
                                <td>More Info?</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Navbar -->
        <div class="mt-4">
            <nav class="bg-semi-transparent text-white py-2 px-4 rounded">
                <ul class="flex space-x-4">
                    <li>
                        <a
                            href="#kills"
                            class="hover:underline {currentHash === '#kills' ? 'active' : ''}"
                            on:click|preventDefault={() => loadComponent(Kills, '#kills')}
                        >
                            Kills
                        </a>
                    </li>
                    <li>
                        <a
                            href="#losses"
                            class="hover:underline {currentHash === '#losses' ? 'active' : ''}"
                            on:click|preventDefault={() => loadComponent(Losses, '#losses')}
                        >
                            Losses
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
                            href="#members"
                            class="hover:underline {currentHash === '#members' ? 'active' : ''}"
                            on:click|preventDefault={() => loadComponent(Members, '#members')}
                        >
                            Members
                        </a>
                    </li>
                    <li>
                        <a
                            href="#stats"
                            class="hover:underline {currentHash === '#stats' ? 'active' : ''}"
                            on:click|preventDefault={() => loadComponent(Stats, '#stats')}
                        >
                            Stats
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Main content -->
        <div class="container mt-4 p-4 rounded">
            {#if activeComponent}
                <svelte:component this={activeComponent} {alliance} />
            {/if}
        </div>
    </div>
{/if}
