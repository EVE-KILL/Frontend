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
    });
</script>

{#if killmail}
    <div class="container flex p-2 pt-4 gap-2">
        <!-- Left Container -->
        <div class="w-full text-white p-4 rounded-lg shadow-lg">
            <div id="information-area" class="flex">
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
