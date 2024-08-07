<script lang="ts">
    import { getUpstreamUrl } from '$lib/Config';
    import { formatNumber } from '$lib/Helpers.js';
    import { onMount } from 'svelte';
    import type { Killmail } from '../../../types/Killmail.ts';
    import { setMeta } from '$lib/Meta.ts';

    import Attackers from '../../../components/Kill/Attackers.svelte';
    import Comments from '../../../components/Kill/Comments.svelte';
    import FittingWheel from '../../../components/Kill/FittingWheel.svelte';
    import Items from '../../../components/Kill/Items.svelte';
    import InformationBox from '../../../components/Kill/InformationBox.svelte';
    import Navbar from '../../../components/Kill/Navbar.svelte';

    export let data;
    let killmail: Killmail;
    let showComments: boolean = false;
    const upstreamUrl = getUpstreamUrl();

    onMount(async () => {
        const response = await fetch(`${upstreamUrl}/api/killmail/${data.id}`);
        killmail = await response.json();

        // Set custom meta tags for this page
        console.log(generateDescription(killmail));
        setMeta({
            title: `Killmail #${killmail.killmail_id}`,
            description: generateDescription(killmail),
            image: `https://images.evetech.net/types/${killmail.victim.ship_id}/render?size=128`,
            hasCustomMeta: true
        }, { append: true });

        // Check for 'comments' parameter in the URL
        const params = new URLSearchParams(window.location.search);
        showComments = params.get('comments') === 'true';
    });

    function generateDescription(killmail: Killmail): string
    {
        let description = `${killmail.victim.character_name} (${killmail.victim.corporation_name}) lost their ${killmail.victim.ship_name} in ${killmail.system_name} (${killmail.region_name}). `;
        description += `Final Blow by `;
        // Loop through attackers to find the one with final_blow: true
        for (let i = 0; i < killmail.attackers.length; i++) {
            if (killmail.attackers[i].final_blow) {
                description += `${killmail.attackers[i].character_name} (${killmail.attackers[i].corporation_name}) flying in a ${killmail.attackers[i].ship_name}. `;
                break;
            }
        }
        description += `Total Value: ${formatNumber(killmail.total_value, 0)} ISK`;
        return description;
    }
</script>

{#if killmail}
    <!-- Navbar -->
    <Navbar killmail_id={killmail.killmail_id} />

    <div class="container flex p-2 pt-4 gap-2">
        <!-- Left Container -->
        <div class="w-full text-white p-4 rounded-lg shadow-lg">
            <div id="information-area" class="flex justify-around">
                <!-- Fitting Wheel -->
                <FittingWheel {killmail} />

                <!-- Kill Information -->
                <div class="information-box ml-5">
                <InformationBox
                    {killmail}
                />
                </div>
            </div>

            <!-- Items -->
            <Items {killmail} />
        </div>

        <!-- Right Container -->
        <div class="w-2/4 text-white p-4 rounded-lg shadow-lg">
            {#if showComments}
                <Comments />
            {/if}
            <!-- Attackers -->
            <Attackers attackers={killmail.attackers} />
        </div>
    </div>
{/if}
