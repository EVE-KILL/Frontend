<!-- src/lib/components/NavBar.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { session, logout } from '$lib/stores/Session.ts';
	import { page } from '$app/stores';
	import { getEVEAuthLoginUrl } from '$lib/Auth.ts';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import HelpBox from './HelpBox.svelte';
	import ssoLightSmall from '../images/sso-light-small.png';
	import ssoDarkSmall from '../images/sso-dark-small.png';
	import ssoLightLarge from '../images/sso-light-large.png';
	import ssoDarkLarge from '../images/sso-dark-large.png';

	let isKillsDropdownOpen = false;
	let isInformationDropdownOpen = false;
	let isAccountDropdownOpen = false;
	let isSearchDropdownOpen = false;
	let isSearchBoxFocused = false;
	let isShortcutPanelOpen = false;
	let closeKillsDropdownTimeout = 0;
	let closeInformationDropdownTimeout = 0;
	let closeAccountDropdownTimeout = 0;

	let searchTerm = '';
	let searchResults = [];
	let selectedIndex = -1;
	let eveSSOLoginUrl: string;

	const upstreamUrl = getUpstreamUrl();

	let user: {
		character_name: string;
		character_id: number;
		expiration: string;
		identifier: string;
	} | null = null;

	$: session.subscribe((value) => {
		user = value.user;
	});

	async function handleReauth() {
		if (user) {
			try {
				const response = await fetch(`${upstreamUrl}/api/auth/reauth/${user.identifier}`);
				if (response.ok) {
					const data = await response.json();
					user = {
						character_name: data.character_name,
						character_id: data.character_id,
						expiration: data.expiration,
						identifier: data.identifier
					};
					session.set({ user });
				} else if (response.status === 401) {
					console.warn('Reauthentication failed, logging out.');
					logout();
				} else {
					console.error('Failed to reauthenticate');
				}
			} catch (error) {
				console.error('Error reauthenticating:', error);
				logout();
			}
		}
	}

	function openKillsDropdown() {
		clearTimeout(closeKillsDropdownTimeout);
		isKillsDropdownOpen = true;
	}

	function closeKillsDropdown() {
		closeKillsDropdownTimeout = setTimeout(() => {
			isKillsDropdownOpen = false;
		}, 200);
	}

	function openInformationDropdown() {
		clearTimeout(closeInformationDropdownTimeout);
		isInformationDropdownOpen = true;
	}

	function closeInformationDropdown() {
		closeInformationDropdownTimeout = setTimeout(() => {
			isInformationDropdownOpen = false;
		}, 200);
	}

	function openAccountDropdown() {
		clearTimeout(closeAccountDropdownTimeout);
		isAccountDropdownOpen = true;
	}

	function closeAccountDropdown() {
		closeAccountDropdownTimeout = setTimeout(() => {
			isAccountDropdownOpen = false;
		}, 200);
	}

	async function handleSearch(event) {
		searchTerm = event.target.value;
		if (searchTerm.length > 2) {
			const response = await fetch(`${upstreamUrl}/api/search/${searchTerm}`);
			let results = await response.json();
			searchResults = results.hits;
			isSearchDropdownOpen = searchResults.length > 0;
			selectedIndex = -1;
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

	function handleKeydown(event) {
		if (event.key === 's' && !isSearchBoxFocused) {
			event.preventDefault();
			document.getElementById('search').focus();
		}

		if (event.key === '?') {
			event.preventDefault();
			toggleShortcutPanel();
		}

		if (isSearchDropdownOpen) {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				selectedIndex = (selectedIndex + 1) % searchResults.length;
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				selectedIndex = (selectedIndex - 1 + searchResults.length) % searchResults.length;
			} else if (event.key === 'Enter') {
				if (selectedIndex >= 0) {
					window.location.href = `/${searchResults[selectedIndex].type}/${searchResults[selectedIndex].id}`;
				} else if (searchResults.length > 0) {
					window.location.href = `/${searchResults[0].type}/${searchResults[0].id}`;
				}
			}
		}
	}

	function toggleShortcutPanel() {
		isShortcutPanelOpen = !isShortcutPanelOpen;
	}

	function closeShortcutPanel() {
		isShortcutPanelOpen = false;
	}

	onMount(async () => {
		eveSSOLoginUrl = await getEVEAuthLoginUrl();
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function handleFocus() {
		isSearchBoxFocused = true;
	}

	function handleBlur() {
		isSearchBoxFocused = false;
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
										href="/kills/latest"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Latest</a
									>
								</li>
								<li>
									<a
										href="/kills/abyssal"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Abyssal</a
									>
								</li>
								<li>
									<a
										href="/kills/wspace"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>W-Space</a
									>
								</li>
								<li>
									<a
										href="/kills/highsec"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Highsec</a
									>
								</li>
								<li>
									<a
										href="/kills/lowsec"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Lowsec</a
									>
								</li>
								<li>
									<a
										href="/kills/nullsec"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Nullsec</a
									>
								</li>
								<li>
									<a
										href="/kills/big"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Big</a
									>
								</li>
								<li>
									<a
										href="/kills/solo"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Solo</a
									>
								</li>
								<li>
									<a
										href="/kills/npc"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>NPC</a
									>
								</li>
								<li>
									<a
										href="/kills/5b"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>+5b</a
									>
								</li>
								<li>
									<a
										href="/kills/10b"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>+10b</a
									>
								</li>
								<li>
									<a
										href="/kills/citadels"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Citadels</a
									>
								</li>
								<li>
									<a
										href="/kills/t1"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>T1</a
									>
								</li>
								<li>
									<a
										href="/kills/t2"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>T2</a
									>
								</li>
								<li>
									<a
										href="/kills/t3"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>T3</a
									>
								</li>
								<li>
									<a
										href="/kills/frigate"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Frigate</a
									>
								</li>
								<li>
									<a
										href="/kills/destroyers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Destroyers</a
									>
								</li>
								<li>
									<a
										href="/kills/cruisers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Cruisers</a
									>
								</li>
								<li>
									<a
										href="/kills/battlecruisers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Battlecruisers</a
									>
								</li>
								<li>
									<a
										href="/kills/battleships"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Battleships</a
									>
								</li>
								<li>
									<a
										href="/kills/capitals"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Capitals</a
									>
								</li>
								<li>
									<a
										href="/kills/freighters"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Freighters</a
									>
								</li>
								<li>
									<a
										href="/kills/supercarriers"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Supercarriers</a
									>
								</li>
								<li>
									<a
										href="/kills/titans"
										class="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-500"
										>Titans</a
									>
								</li>
							</ul>
						{/if}
					</div>
				</li>
			</ul>
		</div>
		<div class="flex items-center justify-center">
			<form class="max-w-full relative">
				<div class="relative">
					<div
						class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
					>
						<svg
							class="w-4 h-4 text-gray-500 dark:text-gray-400"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<input
						type="search"
						id="search"
						bind:value={searchTerm}
						on:input={handleSearch}
						on:focus={handleFocus}
						on:blur={handleBlur}
						class="search block w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search..."
					/>
				</div>
				{#if isSearchDropdownOpen}
					<div class="absolute bg-gray-800 rounded-lg shadow-lg mt-2 w-full">
						<div class="overflow-y-auto max-h-64">
							<table class="table-auto w-full">
								<tbody class="text-gray-300 text-sm">
									{#each searchResults as result, index}
										<tr
											class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300 {selectedIndex ===
											index
												? 'bg-gray-600'
												: ''}"
											on:click={() =>
												(window.location.href = `/${result.type}/${result.id}`)}
										>
											<td class="h-16 w-16 rounded-md">
												{#if result.type === 'character'}
													<img
														src={`https://images.evetech.net/characters/${result.id}/portrait?size=64`}
														alt={result.name}
														class="h-16 w-16 rounded-md"
													/>
												{:else if result.type === 'corporation'}
													<img
														src={`https://images.evetech.net/corporations/${result.id}/logo?size=64`}
														alt={result.name}
														class="h-16 w-16 rounded-md"
													/>
												{:else if result.type === 'alliance'}
													<img
														src={`https://images.evetech.net/alliances/${result.id}/logo?size=64`}
														alt={result.name}
														class="h-16 w-16 rounded-md"
													/>
												{/if}
											</td>
											<td class="px-2 py-2">{result.name}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</form>
		</div>
		<div class="flex items-right -ml-20">
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
									>
										Information
									</a>
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
			<div class="flex items-right ml-5">
				<ul class="flex items-center space-x-4">
					<li>
						<div class="relative">
							<button
								class="text-white hover:text-gray-400 focus:outline-none"
								on:mouseenter={openAccountDropdown}
								on:mouseleave={closeAccountDropdown}
							>
								<img
									src={user
										? `https://images.evetech.net/characters/${user.character_id}/portrait?size=32`
										: 'https://images.evetech.net/characters/1/portrait?size=32'}
									alt="User avatar"
									class="rounded-full"
								/>
							</button>
							{#if isAccountDropdownOpen}
								<ul
									class="absolute right-0 mt-2 w-72 bg-gray-800 rounded-md shadow-lg z-10"
									on:mouseenter={openAccountDropdown}
									on:mouseleave={closeAccountDropdown}
								>
									{#if user}
										<li class="p-2">
											<div class="text-gray-300 text-sm">
												Character: {user.character_name}
											</div>
											<div class="text-gray-500 text-xs mt-2">
												ID: {user.character_id}
											</div>
											<div class="text-gray-500 text-xs mt-2">
												Expiration: {user.expiration}
											</div>
											<div class="text-gray-500 text-xs mt-2">
												<button
													on:click={handleReauth}
													class="text-blue-500 hover:text-blue-300"
													>Reauthenticate</button
												>
											</div>
										</li>
										<li class="p-2 border-t border-gray-700">
											<div class="text-gray-300 text-sm">Settings</div>
											<div class="text-gray-500 text-xs mt-2">
												<label class="flex items-center">
													<input
														type="checkbox"
														class="form-checkbox h-4 w-4 text-blue-500"
													/>
													<span class="ml-2">Placeholder Toggle</span>
												</label>
											</div>
										</li>
										<li class="p-2 border-t border-gray-700">
											<button
												on:click={logout}
												class="text-red-500 hover:text-red-300"
												>Logout</button
											>
										</li>
									{:else}
										<li class="p-2">
											<a href={eveSSOLoginUrl}>
												<img
													src={ssoLightLarge}
													alt="Login"
													class="w-full"
												/>
											</a>
										</li>
										<li class="p-2 rounded-b-md">
											<div class="text-gray-500 text-xs mt-2 text-left">
												Scopes:<br />
												- esi-killmails.read_corporation_killmails.v1<br />
												- esi-killmails.read_killmails.v1<br />
												- publicData
											</div>
										</li>
									{/if}
								</ul>
							{/if}
						</div>
					</li>
				</ul>
			</div>
			<div class="ml-5 relative">
				<button
					class="text-gray-500 text-xs mt-2 text-right cursor-pointer"
					on:click={toggleShortcutPanel}
					type="button"
				>
					?
				</button>
			</div>
		</div>
	</div>
	<HelpBox {isShortcutPanelOpen} {toggleShortcutPanel} {closeShortcutPanel} />
</nav>

<style>
	.search {
		min-width: 30rem;
	}

	.hover\:bg-gray-600:hover {
		background-color: #4a4a4a;
	}

	.table-auto {
		table-layout: auto;
	}

	.bg-gray-600 {
		background-color: #4a4a4a;
	}
</style>
