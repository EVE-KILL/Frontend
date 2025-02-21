<script lang="ts">
	import { browser } from '$app/environment';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import { onMount } from 'svelte';

	let isAccountDropdownOpen = false;
	let closeAccountDropdownTimeout = 0;
	let user = null;
	export let eveLoginUrl = '';

	function openAccountDropdown() {
		clearTimeout(closeAccountDropdownTimeout);
		isAccountDropdownOpen = true;
	}

	function closeAccountDropdown() {
		closeAccountDropdownTimeout = setTimeout(() => {
			isAccountDropdownOpen = false;
		}, 200);
	}

	function logout() {
		if (browser) {
			localStorage.removeItem('authentication');
			user = null;
		}
	}

	onMount(async () => {
		if (browser) {
			// Is there a key in local storage called authentication?
			if (localStorage.getItem('authentication')) {
				// If so, parse it and set user
				const authData = localStorage.getItem('authentication');
				if (authData) {
					user = JSON.parse(authData);
				}
			}
		}
	});
</script>

<div class="relative">
	<button class="text-white hover:text-background-400 focus:outline-none" on:mouseenter={openAccountDropdown} on:mouseleave={closeAccountDropdown}>
		<a href={user ? `/character/${user.characterId}` : '#'}>
			<img
				src={user
					? `${getUpstreamUrl()}/images/characters/${user.characterId}/portrait?size=32`
					: '/img/portrait.webp'}
				alt="User avatar"
				class="rounded"
			/>
		</a>
	</button>
	{#if isAccountDropdownOpen}
		<ul
			class="absolute right-0 mt-2 w-72 bg-background-800 rounded-md shadow-lg z-10"
			on:mouseenter={openAccountDropdown}
			on:mouseleave={closeAccountDropdown}
		>
			{#if user}
				<li class="p-2 border-t border-background-700">
					<div class="text-background-300 text-sm">Settings</div>
					<div class="text-background-500 text-xs mt-2">
						<label class="flex items-center">
							<input type="checkbox" class="form-checkbox h-4 w-4 text-primary-500" />
							<span class="ml-2">Placeholder Toggle</span>
						</label>
					</div>
				</li>
				<li class="p-2 border-t border-background-700">
					<button on:click={logout} class="text-red-500 hover:text-red-300">Logout</button>
				</li>
			{:else}
				<li class="p-2">
					<a href='{eveLoginUrl}'>
						<img src="/img/sso-light-large.png" alt="Login" class="w-full" />
					</a>
				</li>
				<li class="p-2 rounded-b-md">
					<div class="text-background-500 text-xs mt-2 text-left">
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
