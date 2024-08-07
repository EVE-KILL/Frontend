<script lang="ts">
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

    // Set custom meta tags for this page
    setMeta({
        title: data.siteName,
        description: data.description,
        image: data.image,
        hasCustomMeta: true
    }, { append: true });

    onMount(() => {
        killmail = data.killmail;

        // Check for 'comments' parameter in the URL
        const params = new URLSearchParams(window.location.search);
        showComments = params.get('comments') === 'true';
    });
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
