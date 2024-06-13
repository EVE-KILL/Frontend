<script lang="ts">
    import type { Alliance } from '../../../types/Alliance.ts';
    import { onMount } from 'svelte';
    import Kills from './kills.svelte';
    import Losses from './losses.svelte';

    export let data;
    let alliance: Alliance
    let activeComponent = null;

    onMount(async () => {
        const response = await fetch(`https://eve-kill.com/api/alliances/${data.id}`);
        alliance = await response.json();
        if (alliance.error) {
            window.location.href = '/';
        }
    });

    function loadComponent(component: any) {
        activeComponent = component;
    }
</script>

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
                            <td class="font-bold text-right p-2">Alliance:</td>
                            <td>{alliance.name}</td>
                        </tr>
                        <tr on:click={(window.location.href = `/faction/${alliance.faction_id}`)}>
                            <td class="font-bold text-right p-2">Faction:</td>
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
                    <li class="hover:underline" on:click|preventDefault={() => loadComponent(Kills)}>Kills</li>
                    <li class="hover:underline" on:click|preventDefault={() => loadComponent(Losses)}>Losses</li>
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
