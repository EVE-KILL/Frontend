<script lang="ts">
    import { onMount } from 'svelte';
    import type { Killmail } from '../../../types/Killmail.ts';
    import { setMeta } from '$lib/Meta.ts';

    import Attackers from '../../../components/Kill/Attackers.svelte';
    import Comments from '../../../components/Kill/Comments.svelte';
    import FittingWheel from '../../../components/Kill/FittingWheel.svelte';
    import Items from '../../../components/Kill/Items.svelte';
    import InformationBox from '../../../components/Kill/InformationBox.svelte';

    export let data;
    let killmail: Killmail;

    // Set custom meta tags for this page
    setMeta({
        title: data.siteName,
        description: data.description,
        image: data.image,
        hasCustomMeta: true
    }, { append: true });

    onMount(() => {
        killmail = data.killmail;
        // Additional client-side logic if needed
    });

    function generateDescription(killmail) {
        let description = `${killmail.victim.character_name} (${killmail.victim.corporation_name}) lost their ${killmail.victim.ship_name} in ${killmail.system_name} (${killmail.region_name}). `;
        description += `Final Blow by `;
        // Loop through attackers to find the one with final_blow: true
        for (let i = 0; i < killmail.attackers.length; i++) {
            if (killmail.attackers[i].final_blow) {
                description += `${killmail.attackers[i].character_name} (${killmail.attackers[i].corporation_name}) flying in a ${killmail.attackers[i].ship_name}. `;
                break;
            }
        }
        description += `Total Value: ${killmail.total_value} ISK`;

        return description;
    }
</script>


{#if killmail}
    <div class="container flex p-2 pt-4 gap-2">
        <!-- Left Container -->
        <div class="w-full text-white p-4 rounded-lg shadow-lg">
            <div class="flex">
                <!-- Fitting Wheel -->
                <FittingWheel {killmail} />

                <!-- Kill Information -->
                <InformationBox
                    {killmail}
                />
            </div>

            <!-- Items -->
            <Items {killmail} />
        </div>

        <!-- Right Container -->
        <div class="w-2/4 text-white p-4 rounded-lg shadow-lg">
            <!-- <Comments /> -->
            <!-- Attackers -->
			<Attackers attackers={killmail.attackers} />
        </div>
    </div>
{/if}
