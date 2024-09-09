<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Store the selected background image
	const selectedBackground = writable('/images/bg1.jpg');

	// Background image options
	const backgroundImages = [
		{ src: '/images/bg1.jpg', name: 'bg1.jpg' },
		{ src: '/images/bg2.png', name: 'bg2.png' },
		{ src: '/images/bg3.png', name: 'bg3.png' },
		{ src: '/images/bg4.png', name: 'bg4.png' },
		{ src: '/images/bg5.png', name: 'bg5.png' },
		{ src: '/images/bg6.png', name: 'bg6.png' }
	];

	// Local state for dropdown visibility
	let isDropdownOpen = false;
	let closeDropdownTimeout = 0;

	function openDropdown() {
		clearTimeout(closeDropdownTimeout);
		isDropdownOpen = true;
	}

	function closeDropdown() {
		closeDropdownTimeout = setTimeout(() => {
			isDropdownOpen = false;
		}, 200);
	}

	// Function to set the selected background
	function setBackground(image) {
		selectedBackground.set(image.src);
		localStorage.setItem('selectedBackground', image.name);
		const backgroundStyle = `
			url('${image.src}') no-repeat center fixed,
			radial-gradient(circle, transparent, black 80%)`;
		document.documentElement.style.background = backgroundStyle;
		document.documentElement.style.backgroundSize = 'cover';
		document.documentElement.style.backgroundColor = 'black';
	}

	// Set the background on load
	onMount(() => {
		const savedBackground = localStorage.getItem('selectedBackground');
		const backgroundImage = backgroundImages.find((img) => img.name === savedBackground) || backgroundImages[0];
		setBackground(backgroundImage);
	});
</script>

<div class="relative">
	<button class="text-white hover:text-background-400 focus:outline-none" on:mouseenter={openDropdown} on:mouseleave={closeDropdown}>
		<i class="fas fa-image text-background-500 hover:text-background-400" style="font-size: 32px;"></i>
	</button>
	{#if isDropdownOpen}
		<ul
			class="absolute mt-2 bg-background-800 rounded-md shadow-lg z-10"
			style="min-width: 6rem;"
			on:mouseenter={openDropdown}
			on:mouseleave={closeDropdown}
		>
			{#each backgroundImages as image}
				<li>
					<button on:click={() => setBackground(image)} class="block px-4 py-2 text-sm text-white hover:bg-background-700">
						<img src={image.src} alt={image.name} class="w-16 h-16 object-cover mx-auto opacity-75 hover:opacity-100" />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
