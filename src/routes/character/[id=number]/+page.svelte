<script lang="ts">
    import { tick } from 'svelte';
    import { page } from '$app/stores';
    import type { Character } from '../../../types/Character.ts';
    import Dashboard from './dashboard.svelte';
    import Kills from './kills.svelte';
    import Losses from './losses.svelte';
    import CorporationHistory from './corporationHistory.svelte';
    import Stats from './Stats.svelte';
    import { formatNumber } from '$lib/Helpers.ts';

    export let data;
    let character: Character = data.character;
    let activeComponent = Dashboard;
    let currentHash = '#dashboard'; // Default to '#dashboard'

    // Function to map hash to component
    const hashToComponent = {
        '#dashboard': Dashboard,
        '#kills': Kills,
        '#losses': Losses,
        '#corporation-history': CorporationHistory,
        '#stats': Stats,
    };

    // Load the appropriate component based on the URL hash
    function loadComponentFromHash(hash) {
        if (!hash || hash === '#') {
            activeComponent = Dashboard; // Load Dashboard by default if no hash or empty hash is present
            currentHash = '#dashboard';
        } else {
            const component = hashToComponent[hash];
            activeComponent = component || Dashboard;
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

{#if character}
    <div class="container mx-auto  p-4 text-white">
        <!-- Profile Section -->
        <div class="flex items-start bg-semi-transparent p-4 ">
            <!-- Profile Image with Additional Images -->
            <div class="flex items-center">
                <img
                    src="https://images.evetech.net/characters/{character.character_id}/portrait?size=256"
                    alt="Character: {character.name}"
                    class="rounded-full"
                />
                <div class="flex flex-col space-x-2 space-y-2">
                    <img
                        src="https://images.evetech.net/corporations/{character.corporation_id}/logo?size=64"
                        alt="Corporation: {character.corporation_name}"
                        class="rounded-full"
                    />
                    <img
                        src="https://images.evetech.net/alliances/{character.alliance_id}/logo?size=64"
                        alt="Alliance: {character.alliance_name}"
                        class="rounded-full"
                    />
                    <img
                        src="https://images.evetech.net/corporations/{character.faction_id}/logo?size=64"
                        alt="Faction: {character.faction_name}"
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
                                <td class="font-bold text-right p-1">Character:</td>
                                <td>{character.name}</td>
                            </tr>
                            <tr>
                                <td class="font-bold text-right p-1">Corporation:</td>
                                <td><a href="/corporation/{character.corporation_id}">{character.corporation_name}</a></td>
                            </tr>
                            {#if character.title}
                            <tr>
                                <td class="font-bold text-right p-1">Title:</td>
                                <td>{character.title}</td>
                            </tr>
                            {/if}
                            {#if character.alliance_id}
                            <tr>
                                <td class="font-bold text-right p-1">Alliance:</td>
                                <td><a href="/alliance/{character.alliance_id}">{character.alliance_name}</a></td>
                            </tr>
                            {/if}
                            {#if character.faction_id}
                            <tr>
                                <td class="font-bold text-right p-1">Faction:</td>
                                <td><a href="/faction/{character.faction_id}">{character.faction_name}</a></td>
                            </tr>
                            {/if}
                            <tr>
                                <td class="font-bold text-right p-1">Sec. Status:</td>
                                <td>{character.security_status.toFixed(3)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <table class="table-auto">
                        <tbody>
                            <tr>
                                <td class="font-bold text-right p-1">Kills:</td>
                                <td>{formatNumber(character.kills, 0)}</td>
                            </tr>
                            <tr>
                                <td class="font-bold text-right p-1">Losses:</td>
                                <td>{formatNumber(character.losses, 0)}</td>
                            </tr>
                            <tr>
                                <td class="font-bold text-right p-1">Points:</td>
                                <td>{formatNumber(character.points, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Navbar -->
        <div>
            <nav class="bg-semi-transparent text-white py-2 px-4 rounded">
                <ul class="flex space-x-4">
                    <li>
                        <a
                            href="#dashboard"
                            class="hover:underline {currentHash === '#dashboard' ? 'active' : ''}"
                            on:click|preventDefault={() => loadComponent(Dashboard, '#dashboard')}
                        >
                            Dashboard
                        </a>
                    </li>
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
                            href="#corporation-history"
                            class="hover:underline {currentHash === '#corporation-history' ? 'active' : ''}"
                            on:click|preventDefault={() =>
                                loadComponent(CorporationHistory, '#corporation-history')}
                        >
                            Corporation History
                        </a>
                    </li>
                    <li>
                        <a
                            href="#stats"
                            class="hover:underline {currentHash === '#stats' ? 'active' : ''}"
                            on:click|preventDefault={() =>
                                loadComponent(Stats, '#stats')}
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
                <svelte:component this={activeComponent} data={{ character }} />
            {/if}
        </div>
    </div>
{/if}
