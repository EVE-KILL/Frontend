<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import HelpBox from './Navbar/HelpBox.svelte';
	import Information from './Navbar/Information.svelte';
	import Menu from './Navbar/Menu.svelte';
	import Search from './Navbar/Search.svelte';
	import UserMenu from './Navbar/UserMenu.svelte';
	import BackgroundSelector from './Navbar/BackgroundSelector.svelte';
</script>

<nav class="bg-transparent p-2 relative">
	<div class="flex justify-between items-center relative">
		<div class="flex items-left">
			<Menu />
		</div>
		<div class="absolute left-1/2 transform -translate-x-1/2">
			<Search />
		</div>
		<div class="flex items-right justify-center">
			<ul class="flex items-center space-x-4">
				<li class="mt-1">
					<UserMenu />
				</li>
				<li>
					<Information />
				</li>
				<li>
					<BackgroundSelector />
				</li>
				<li>
					<HelpBox />
				</li>
			</ul>
		</div>
	</div>
</nav>

<style>
	.hover\:bg-gray-700:hover {
		background-color: #4a4a4a;
	}
	nav {
		position: relative;
	}
	nav > div > .absolute {
		left: 50%;
		transform: translateX(-50%);
	}
</style>
