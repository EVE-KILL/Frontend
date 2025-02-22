<script lang="ts">
    import moment from 'moment-timezone';
    import { formatNumber } from '$lib/Helpers.ts';
    import { useColors } from '$lib/models/useColors';
	import { getUpstreamUrl } from '$lib/Config';
    const { getSecurityColor } = useColors();

    export let kill;
    export let combinedKillsAndLosses: boolean = false;
    export let combinedVictimType: string = 'character';
    export let combinedVictimId: number | null = null;

	function truncateString(str: any, num: number) {
		let stringifiedStr = String(str);
		return stringifiedStr.length <= num ? stringifiedStr : stringifiedStr.slice(0, num) + '...';
	}

	function isCombinedLoss(kill: KillList): boolean {
		if (combinedKillsAndLosses && kill.victim[`${combinedVictimType}_id`] === combinedVictimId) {
			return true;
		}
		return false;
	}

	function handleClick(event: MouseEvent, killmailId: number) {
		if (event.ctrlKey || event.metaKey || event.button === 1) {
			event.preventDefault();
			window.open(`/kill/${killmailId}`, '_blank');
		} else {
			window.location.href = `/kill/${killmailId}`;
		}
	}
</script>

<button
    class="grid grid-cols-8 items-center border-b bg-semi-transparent border-background-700 hover:bg-background-800 transition-colors duration-300 cursor-pointer w-full {isCombinedLoss(kill) ? 'bg-darkred' : ''}" on:click={(event) => handleClick(event, kill.killmail_id)}>
    <div class="flex items-center col-span-2 mx-2 py-1 w-fit">
        <img src="https://images.eve-kill.com/types/{kill.victim.ship_id}/render?size=64" loading="lazy" alt="Ship: {kill.victim.ship_name}" class="rounded w-10" />
        <div class="flex flex-col items-start ml-1 whitespace-nowrap">
            <span class="text-sm">{truncateString(kill.victim.ship_name, 20)}</span>
            {#if kill.total_value > 50}
                <span class="text-background-400 text-xs">
                    {formatNumber(kill.total_value)} ISK
                </span>
            {/if}
        </div>
    </div>

    <div class="flex items-center col-span-2 px-2 py-1">
        <img src="https://images.eve-kill.com/characters/{kill.victim.character_id}/portrait?size=64" loading="lazy" alt="Character: {kill.victim.character_name}" class="rounded w-10" />
        <div class="flex flex-col items-start ml-1">
            <span class="text-sm">{kill.victim.character_name}</span>
            <span class="text-background-400 text-xs whitespace-nowrap">
                {truncateString(kill.victim.corporation_name, 22)}
            </span>
        </div>
    </div>

    <div class="flex items-center col-span-2 px-2 py-1 whitespace-nowrap">
        {#if !kill.is_npc}
            <img src="https://images.eve-kill.com/characters/{kill.finalblow.character_id}/portrait?size=64" loading="lazy" alt="Character: {kill.victim.character_name}" class="rounded w-10" />
        {:else}
            <img src="https://images.eve-kill.com/characters/0/portrait?size=128" alt="Unknown" class="rounded w-10" />
        {/if}

        <div class="flex flex-col items-start ml-1">
            <span class="text-sm">
                {#if kill.is_npc}
                    {kill.finalblow.faction_name}
                {:else}
                    {kill.finalblow.character_name}
                {/if}
            </span>
            <span class="text-background-400 text-xs">
                {truncateString(kill.finalblow.ship_group_name, 22)}
            </span>
        </div>
    </div>

    <div class="flex flex-col items-start px-2 py-1 text-sm">
        <div class="flex flex-col items-start">
            <span class="text-sm whitespace-nowrap">{kill.region_name}</span>
            <div class="text-background-400 text-xs whitespace-nowrap">
                <span>{kill.system_name}</span>
                (<span style="color: {getSecurityColor(kill.system_security)}">{formatNumber(kill.system_security)}</span>)
            </div>
        </div>
    </div>

    <div class="flex flex-col items-end px-2 py-1 text-sm whitespace-nowrap">
        <div class="text-background-500">{moment.utc(kill.kill_time).fromNow()}</div>
        <div class="flex gap-1 items-center">
            <span class="text-background-400">{kill.attackerCount}</span>
            <img src="/img/involved.png" alt="{kill.attackerCount} Involved" />
            <span class="text-background-400">{kill.commentCount || 0}</span>
            <img src="/img/comment.gif" alt="{kill.attackerCount} Involved" />
        </div>
    </div>
</button>

<style>
	.bg-darkred {
		background-color: rgb(40, 0, 0);
	}
</style>
