<script lang="ts">
    import { formatNumber } from '$lib/Helpers.ts';
    import { itemSlotTypes } from '$lib/Killmail.ts';
    import { onMount } from 'svelte';

    export let killmail;
    let groupedItems = [];

    onMount(async () => {
        const slotTypes = itemSlotTypes();
        groupedItems = Object.keys(slotTypes).map((slotType) => {
            return {
                slotType,
                items: groupByQty(killmail.items.filter((item) => slotTypes[slotType].includes(item.flag)))
            };
        });
    });

    function groupByQty(items) {
        const grouped = items.reduce((acc, item) => {
            const key = `${item.type_id}_${item.qty_dropped || 0}_${item.qty_destroyed || 0}`;
            if (!acc[key]) {
                acc[key] = { ...item, qty_dropped: 0, qty_destroyed: 0 };
            }
            acc[key].qty_dropped += item.qty_dropped || 0;
            acc[key].qty_destroyed += item.qty_destroyed || 0;
            return acc;
        }, {});
        return Object.values(grouped);
    }
</script>

<div class="w-full rounded-lg shadow-lg custom-space-x mt-4">
    <div class="overflow-x-auto" role="table">
        <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
            <thead>
                <tr class="bg-darker text-white uppercase text-xs leading-normal">
                    <th class="px-2 py-1" scope="col"></th>
                    <th class="px-2 py-1" scope="col">Name</th>
                    <th class="px-2 py-1" scope="col">Destroyed</th>
                    <th class="px-2 py-1" scope="col">Dropped</th>
                    <th class="px-2 py-1" scope="col">Value (ISK)</th>
                </tr>
            </thead>
            <tbody class="text-gray-300 text-sm">
                {#each groupedItems as group}
                    {#if group.items.length > 0}
                        <tr class="bg-gray-700 text-white">
                            <td colspan="5" class="px-2 py-1 font-bold">{group.slotType}</td>
                        </tr>
                    {/if}
                    {#each group.items as item}
                        <tr class={`border-b border-gray-700 hover:bg-gray-600 transition-colors duration-30 ${item.qty_dropped > 0 ? 'dropped-items' : item.qty_destroyed > 0 ? 'destroyed-items' : ''}`}>
                            <td class="px-2 py-1">
                                <img
                                    src={`https://images.evetech.net/types/${item.type_id}/icon?size=32`}
                                    alt={item.type_name}
                                    class="h-8 w-8 rounded-md"
                                />
                            </td>
                            <td class="px-2 py-1">
                                <a href={`/item/${item.type_id}`} class="hover:underline">
                                    {item.type_name}
                                </a>
                            </td>
                            <td class="px-2 py-1">{item.qty_destroyed}</td>
                            <td class="px-2 py-1">{item.qty_dropped}</td>
                            <td class="px-2 py-1">
                                {formatNumber(item.value * (item.qty_destroyed + item.qty_dropped))}
                            </td>
                        </tr>
                    {/each}
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .dropped-items {
        background-color: rgba(21, 255, 0, 0.1);
    }

    .destroyed-items {
        background-color: rgba(255, 0, 0, 0.117);
    }
</style>
