<script>
    let isKillsDropdownOpen = false;
    let isInformationDropdownOpen = false;
    let closeKillsDropdownTimeout = 0;
    let closeInformationDropdownTimeout = 0;
    let searchTerm = '';
    let searchResults = [];
    let isSearchDropdownOpen = false;

    function openKillsDropdown() {
        clearTimeout(closeKillsDropdownTimeout);
        isKillsDropdownOpen = true;
    }

    function closeKillsDropdown() {
        closeKillsDropdownTimeout = setTimeout(() => {
            isKillsDropdownOpen = false;
        }, 200); // Adjust the delay as needed
    }

    function openInformationDropdown() {
        clearTimeout(closeInformationDropdownTimeout);
        isInformationDropdownOpen = true;
    }

    function closeInformationDropdown() {
        closeInformationDropdownTimeout = setTimeout(() => {
            isInformationDropdownOpen = false;
        }, 200); // Adjust the delay as needed
    }

    async function handleSearch(event) {
        searchTerm = event.target.value;
        if (searchTerm.length > 2) {
            const response = await fetch(`https://eve-kill.com/api/search/${searchTerm}`);
            let results = await response.json();
            searchResults = results.hits;
            isSearchDropdownOpen = true;
        } else {
            isSearchDropdownOpen = false;
            searchResults = [];
        }
    }

    function closeSearchDropdown() {
        setTimeout(() => {
            isSearchDropdownOpen = false;
        }, 200);
    }
</script>

<nav class="bg-transparent p-2">
	<div class="flex justify-between items-center">
		<div class="flex items-left">
			<ul class="flex items-center space-x-4">
				<li>
					<a href="/" class="text-white hover:text-gray-400">Home</a>
				</li>
				<li>
					<div class="relative">
						<button
							class="text-white hover:text-gray-400 focus:outline-none"
							on:mouseenter={openKillsDropdown}
							on:mouseleave={closeKillsDropdown}
						>
							Kills
						</button>
						{#if isKillsDropdownOpen}
							<ul
								class="absolute left-0 mt-2 w-96 bg-gray-800 rounded-md shadow-lg z-10 grid grid-cols-3 gap-y-1"
								on:mouseenter={openKillsDropdown}
								on:mouseleave={closeKillsDropdown}
							>
								<li>
									<a
										href="/latest"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Latest</a
									>
								</li>
								<li>
									<a
										href="/abyssal"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Abyssal</a
									>
								</li>
								<li>
									<a
										href="/wspace"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>W-Space</a
									>
								</li>
								<li>
									<a
										href="/highsec"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Highsec</a
									>
								</li>
								<li>
									<a
										href="/lowsec"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Lowsec</a
									>
								</li>
								<li>
									<a
										href="/nullsec"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Nullsec</a
									>
								</li>
								<li>
									<a
										href="/big"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Big</a
									>
								</li>
								<li>
									<a
										href="/solo"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Solo</a
									>
								</li>
								<li>
									<a
										href="/npc"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>NPC</a
									>
								</li>
								<li>
									<a
										href="/5b"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>+5b</a
									>
								</li>
								<li>
									<a
										href="/10b"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>+10b</a
									>
								</li>
								<li>
									<a
										href="/citadels"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Citadels</a
									>
								</li>
								<li>
									<a
										href="/t1"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>T1</a
									>
								</li>
								<li>
									<a
										href="/t2"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>T2</a
									>
								</li>
								<li>
									<a
										href="/t3"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>T3</a
									>
								</li>
								<li>
									<a
										href="/frigate"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Frigate</a
									>
								</li>
								<li>
									<a
										href="/destroyers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Destroyers</a
									>
								</li>
								<li>
									<a
										href="/cruisers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Cruisers</a
									>
								</li>
								<li>
									<a
										href="/battlecruisers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Battlecruisers</a
									>
								</li>
								<li>
									<a
										href="/battleships"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Battleships</a
									>
								</li>
								<li>
									<a
										href="/capitals"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Capitals</a
									>
								</li>
								<li>
									<a
										href="/freighters"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Freighters</a
									>
								</li>
								<li>
									<a
										href="/supercarriers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Supercarriers</a
									>
								</li>
								<li>
									<a
										href="/titans"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Titans</a
									>
								</li>
								<!-- Add more items as needed -->
							</ul>
						{/if}
					</div>
				</li>
			</ul>
		</div>
        <div class="flex items-center justify-center w-80">
            <form class="max-w-full relative">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" bind:value={searchTerm} on:input={handleSearch}
                           class="block w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search..." />
                </div>
                {#if isSearchDropdownOpen}
                    <ul class="absolute left-0 mt-2 w-full bg-gray-800 rounded-md shadow-lg z-10"
                        on:mouseleave={closeSearchDropdown}>
                        {#each searchResults as result}
                            <li class="block px-4 py-2 text-sm text-white hover:bg-gray-700" on:click={window.location.href=`/${result.type}/${result.id}`}>
                                {result.name}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </form>
        </div>
		<div class="flex items-right">
			<ul class="flex items-center space-x-4">
				<li>
					<div class="relative">
						<button
							class="text-white hover:text-gray-400 focus:outline-none"
							on:mouseenter={openInformationDropdown}
							on:mouseleave={closeInformationDropdown}
						>
							Information
						</button>
						{#if isInformationDropdownOpen}
							<ul
								class="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10"
								on:mouseenter={openInformationDropdown}
								on:mouseleave={closeInformationDropdown}
							>
								<li>
									<a
										href="/information"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700"
										>Information</a
									>
								</li>
								<li>
									<a
										href="/stats"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700"
										>Stats</a
									>
								</li>
								<li>
									<a
										href="/faq"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700"
										>FAQ</a
									>
								</li>
							</ul>
						{/if}
					</div>
				</li>
			</ul>
		</div>
	</div>
</nav>
