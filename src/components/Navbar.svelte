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

<nav class="bg-transparent p-2">
	<div class="flex justify-between items-center">
		<div class="flex items-left">
			<Menu />
		</div>
		<div class="flex items-center justify-center">
			<Search />
		</div>
		<div class="flex items-right -ml-24">
			<ul class="flex items-center space-x-4">
				<li>
					<Information />
				</li>
				<li>
					<UserMenu />
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
</style>
