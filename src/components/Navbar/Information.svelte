<!-- src/lib/components/Information.svelte -->
<script lang="ts">
	let isInformationDropdownOpen = false;
	let closeInformationDropdownTimeout = 0;

	function openInformationDropdown() {
		clearTimeout(closeInformationDropdownTimeout);
		isInformationDropdownOpen = true;
	}

	function closeInformationDropdown() {
		closeInformationDropdownTimeout = setTimeout(() => {
			isInformationDropdownOpen = false;
		}, 200);
	}
</script>

<div class="relative">
	<button class="text-white hover:text-gray-400 focus:outline-none" on:mouseenter={openInformationDropdown} on:mouseleave={closeInformationDropdown}>
		<i class="fas fa-circle-info text-gray-500 hover:text-gray-400" style="font-size: 32px;"></i>
	</button>
	{#if isInformationDropdownOpen}
		<ul class="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10" on:mouseenter={openInformationDropdown} on:mouseleave={closeInformationDropdown}>
			<li>
				<a href="/information" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">Information</a>
			</li>
			<li>
				<a href="/docs/apidocs" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">API Docs</a>
			</li>
			<li>
				<a href="/docs/stomp" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">STOMP Docs</a>
			</li>
			<li>
				<a href="/stats" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">Stats</a>
			</li>
			<li>
				<a href="/faq" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">FAQ</a>
			</li>
		</ul>
	{/if}
</div>
