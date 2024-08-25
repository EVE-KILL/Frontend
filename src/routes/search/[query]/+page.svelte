<script lang="ts">
    export let data;

    let { query, searchResults, error } = data;

    function handleResultClick(result: any) {
        window.location.href = `/${result.type}/${result.id}`;
    }
</script>

{#if error}
    <div class="flex justify-center items-center h-screen text-white">
        <p class="text-lg">{error}</p>
    </div>
{:else if searchResults.length > 1}
    <div class="flex justify-between w-full p-4 text-white">
        <!-- Left Column for Search Results -->
        <div class="w-1/2 pr-4">
            <div class="rounded-lg p-4">
                <h2 class="text-xl font-bold mb-4">Search results for "{query}":</h2>
                <div class="overflow-x-auto" role="table">
                    <table class="min-w-full bg-semi-transparent rounded-lg">
                        <thead>
                            <tr>
                                <th class="py-2 px-4 bg-gray-900 text-left">Image</th>
                                <th class="py-2 px-4 bg-gray-900 text-left">Name</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 text-sm">
                            {#each searchResults as result}
                                <tr class="hover:bg-gray-600 transition-colors duration-300 cursor-pointer" on:click={() => handleResultClick(result)}>
                                    <td class="flex items-center space-x-2 py-2 px-4">
                                        {#if result.type === 'character'}
                                            <img src={`https://images.evetech.net/characters/${result.id}/portrait?size=64`} alt={result.name} class="w-16 h-16 rounded"/>
                                        {:else if result.type === 'corporation'}
                                            <img src={`https://images.evetech.net/corporations/${result.id}/logo?size=64`} alt={result.name} class="w-16 h-16 rounded"/>
                                        {:else if result.type === 'alliance'}
                                            <img src={`https://images.evetech.net/alliances/${result.id}/logo?size=64`} alt={result.name} class="w-16 h-16 rounded"/>
                                        {:else if result.type === 'item'}
                                            <img src={`https://images.evetech.net/types/${result.id}/${result.name.includes('Blueprint') ? 'bp' : 'icon'}`} alt={result.name} class="w-16 h-16 rounded"/>
                                        {:else if result.type === 'system' || result.type === 'region'}
                                            <img src="https://eve-kill.com/map.png" alt={result.name} class="w-16 h-16 rounded"/>
                                        {/if}
                                    </td>
                                    <td class="py-2 px-4">
                                        <div class="text-sm">
                                            <span class="text-blue-400">{result.name}</span>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Right Column Placeholder for Additional Data -->
        <div class="w-1/2 pl-4">
            <div class="rounded-lg p-4">
                <!-- You can add more content or components here -->
            </div>
        </div>
    </div>
{:else if searchResults.length === 0}
    <div class="flex justify-center items-center h-full">
        <p class="text-lg">No results found for "{query}".</p>
    </div>
{/if}
