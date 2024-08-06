<script lang="ts">
    import { getUpstreamUrl } from '$lib/Config';
    import { onMount } from 'svelte';

    export let killmail_id: number;
    let inBattle: boolean = false;
    const upstreamUrl = getUpstreamUrl();

    onMount(async () => {
        let relatedCheckUrl = `${upstreamUrl}/api/killmail/${killmail_id}/inbattle`;
        const response = await fetch(relatedCheckUrl);
        inBattle = await response.json();
    })

</script>

<div class="mt-4">
    <nav class="bg-semi-transparent text-white py-2 px-4 rounded">
        <ul class="flex space-x-4 justify-end">
            {#if inBattle}
                <li>
                    <a href="/battle/kill/{killmail_id}">Battle Info</a>
                </li>
            {/if}
        </ul>
    </nav>
</div>
