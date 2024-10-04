<script lang="ts">
	import { session, logout } from '$lib/stores/Session.ts';
	import { getEVEAuthLoginUrl, getEVEAuthLoginUrlNoScope } from '$lib/Auth.ts';
	import { getUpstreamUrl } from '$lib/Config.ts';
	import { onMount } from 'svelte';

	let isAccountDropdownOpen = false;
	let closeAccountDropdownTimeout = 0;
	let user = null;
	let eveSSOLoginUrl = '';
	let eveSSOLoginUrlNoScope = '';
	const upstreamUrl = getUpstreamUrl();

	const REAUTH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds
	let reauthIntervalId = null; // Store the interval ID

	$: session.subscribe((value) => {
		user = value.user;

		// If the user logs out, clear the reauth interval
		if (!user && reauthIntervalId) {
			clearInterval(reauthIntervalId);
			reauthIntervalId = null;
		}
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
					localStorage.setItem('lastReauthTime', Date.now().toString());
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

	function checkAndReauth() {
		const lastReauthTime = parseInt(localStorage.getItem('lastReauthTime') || '0');
		const currentTime = Date.now();

		if (currentTime - lastReauthTime > REAUTH_INTERVAL) {
			handleReauth();
		}
	}

	function startReauthTimer() {
		if (user) {
			reauthIntervalId = setInterval(() => {
				handleReauth();
			}, REAUTH_INTERVAL);
		}
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

	onMount(async () => {
		eveSSOLoginUrl = await getEVEAuthLoginUrl();
		eveSSOLoginUrlNoScope = await getEVEAuthLoginUrlNoScope();
		if (user) {
			checkAndReauth();
			startReauthTimer();
		}
	});
</script>

<div class="relative">
	<button class="text-white hover:text-background-400 focus:outline-none" on:mouseenter={openAccountDropdown} on:mouseleave={closeAccountDropdown}>
		<a href={user ? `/character/${user.character_id}` : '#'}>
			<img
				src={user
					? `https://images.eve-kill.com/characters/${user.character_id}/portrait?size=32`
					: 'https://images.eve-kill.com/characters/1/portrait?size=32'}
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
					<a href={eveSSOLoginUrl}>
						<img src="/images/sso-light-large.png" alt="Login" class="w-full" />
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
				<!--<li class="p-2 mt-4">
					<a href={eveSSOLoginUrlNoScope}>
						<img src="/images/sso-dark-large.png" alt="Login" class="w-full" />
					</a>
				</li>
				<li class="p-2 rounded-b-md">
					<div class="text-background-500 text-xs mt-2 text-left">
						Scopes:<br />
						- publicData
					</div>
				</li>-->
			{/if}
		</ul>
	{/if}
</div>
