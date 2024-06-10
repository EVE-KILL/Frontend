<script>
    let isKillsDropdownOpen = false;
    let isInformationDropdownOpen = false;
    let closeKillsDropdownTimeout = 0;
    let closeInformationDropdownTimeout = 0;

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
</script>

<nav class="bg-gray-800 p-4">
    <div class="flex justify-between items-center">
        <div class="flex items-left">
            <ul class="flex items-center space-x-4">
                <li>
                    <a href="#" class="text-white hover:text-gray-400">Home</a>
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
                            <ul class="absolute left-0 mt-2 w-96 bg-gray-800 rounded-md shadow-lg z-10 grid grid-cols-3 gap-y-1"
                                on:mouseenter={openKillsDropdown}
                                on:mouseleave={closeKillsDropdown}
                            >
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Latest</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Abyssal</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">W-Space</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Highsec</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Lowsec</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Nullsec</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Big</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Solo</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">NPC</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">+5b</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">+10b</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Citadels</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">T1</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">T2</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">T3</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Frigate</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Destroyers</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Cruisers</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Battlecruisers</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Battleships</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Capitals</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Freighters</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Supercarriers</a>
                                </li>
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500">Titans</a>
                                </li>
                                <!-- Add more items as needed -->
                            </ul>
                        {/if}
                    </div>
                </li>
                <li>
                    <a href="#" class="text-white hover:text-gray-400">About</a>
                </li>
                <li>
                    <a href="#" class="text-white hover:text-gray-400">Contact</a>
                </li>
            </ul>
        </div>
        <div class="flex items-center justify-center w-80">
            <form class="max-w-full">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search"
                           class="block w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search..." />
                </div>
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
                            <ul class="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10"
                                on:mouseenter={openInformationDropdown}
                                on:mouseleave={closeInformationDropdown}
                            >
                                <li><a href="#"
                                       class="block px-4 py-2 text-sm text-white hover:bg-gray-700">Information</a></li>
                                <li><a href="#" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">Stats</a>
                                </li>
                                <li><a href="#" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">FAQ</a>
                                </li>
                            </ul>
                        {/if}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>
