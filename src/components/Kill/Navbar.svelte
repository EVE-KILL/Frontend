<script lang="ts">
    import { getUpstreamUrl } from '$lib/Config';
    import { onMount } from 'svelte';
	import type { Killmail } from '../../types/Killmail';

    export let killmail: Killmail;
    let inBattle: boolean = false;
    const upstreamUrl = getUpstreamUrl();

    onMount(async () => {
        let relatedCheckUrl = `${upstreamUrl}/api/killmail/${killmail.killmail_id}/inbattle`;
        const response = await fetch(relatedCheckUrl);
        let json = await response.json();
        inBattle = json.inBattle;
    });

    let isExternalDropDownOpen = false;
    let closeExternalDropdownTimeout = 0;

    function openExternalDropdown() {
        clearTimeout(closeExternalDropdownTimeout);
        isExternalDropDownOpen = true;
    }

    function closeExternalDropdown() {
        closeExternalDropdownTimeout = setTimeout(() => {
            isExternalDropDownOpen = false;
        }, 200);
    }
</script>

<div class="mt-4">
    <nav class="bg-semi-transparent text-white py-2 px-4 rounded">
        <!-- Combine both menus into the same flex container -->
        <ul class="flex space-x-4 justify-between w-full">
            <!-- Left aligned items (External dropdown) -->
            <li class="relative">
                <button class="text-white hover:text-gray-400 focus:outline-none" on:mouseenter={openExternalDropdown} on:mouseleave={closeExternalDropdown}>
                    External
                </button>
                {#if isExternalDropDownOpen}
                    <ul class="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10" on:mouseenter={openExternalDropdown} on:mouseleave={closeExternalDropdown}>
                        <li class="px-4 py-2 text-sm text-gray-300">DOTLAN</li>
                        <li><a href="https://evemaps.dotlan.net/system/{killmail.system_name}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.system_name}</a></li>
                        <li><a href="https://evemaps.dotlan.net/region/{killmail.region_name}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.region_name}</a></li>
                        <li class="px-4 py-2 text-sm text-gray-300">EVEEye</li>
                        <li><a href="https://eveeye.com/?m={killmail.region_name}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.region_name}</a></li>
                        <li class="px-4 py-2 text-sm text-gray-300">EVE Missioneer</li>
                        <li><a href="https://evemissioneer.com/s/{killmail.system_id}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.system_name}</a></li>
                        <li><a href="https://evemissioneer.com/r/{killmail.region_id}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.region_name}</a></li>
                        {#if killmail.region_id >= 11000001 && killmail.region_id <= 11000033}
                            <li class="px-4 py-2 text-sm text-gray-300">Anoik.is</li>
                            <li><a href="http://anoik.is/systems/{killmail.system_name}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.system_name}</a></li>
                        {/if}
                        <li class="px-4 py-2 text-sm text-gray-300">EveShip.fit</li>
                        <li><a href="https://eveship.fit/?fit=killmail:{killmail.killmail_id}/{killmail.hash}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">ESF</a></li>
                        <li class="px-4 py-2 text-sm text-gray-300">EVE Ref</li>
                        <li><a href="https://everef.net/groups/{killmail.victim.ship_group_id}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.victim.ship_group_name}</a></li>
                        <li><a href="https://everef.net/type/{killmail.victim.ship_id}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.victim.ship_name}</a></li>
                        <li class="px-4 py-2 text-sm text-gray-300">Jita.space</li>
                        <li><a href="https://www.jita.space/system/{killmail.system_id}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.system_name}</a></li>
                        <li><a href="https://www.jita.space/region/{killmail.region_id}" target="_blank" class="block px-4 py-2 hover:bg-gray-700">{killmail.region_name}</a></li>
                    </ul>
                {/if}
            </li>

            <!-- Right aligned items (Battle Info) -->
            {#if inBattle}
                <li class="ml-auto">
                    <a href="/battle/kill/{killmail.killmail_id}" class="text-white hover:text-gray-400">Battle Info</a>
                </li>
            {/if}
        </ul>
    </nav>
</div>
