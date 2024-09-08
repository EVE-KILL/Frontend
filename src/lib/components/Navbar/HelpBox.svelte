<script lang="ts">
	import { onMount } from 'svelte';

	let isShortcutPanelOpen = false;

	// Function to toggle the visibility of the shortcut panel
	function toggleShortcutPanel() {
		isShortcutPanelOpen = !isShortcutPanelOpen;
	}

	// Function to close the shortcut panel
	function closeShortcutPanel() {
		isShortcutPanelOpen = false;
	}

	// Handle keydown events
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeShortcutPanel();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
	});
</script>

<!-- Button to toggle the shortcut panel -->
<button class="text-gray-500 text-xs mt-2 text-right cursor-pointer" on:click={toggleShortcutPanel}>
	?
</button>

<!-- Shortcut panel -->
{#if isShortcutPanelOpen}
	<div
		class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
		aria-hidden="true"
		on:click={closeShortcutPanel}
	>
		<div
			name="helpbox"
			class="bg-black text-white p-5 rounded shadow-lg"
			on:click|stopPropagation
			aria-hidden="true"
		>
			<h2 class="text-lg font-bold mb-4">Keyboard Shortcuts</h2>
			<h2>Global</h2>
			<ul class="list-disc pl-5">
				<li><strong>alt+s (or meta+s)</strong>: Focus on the search box</li>
				<li><strong>?</strong>: Open this shortcuts panel</li>
				<li><strong>Arrow Up/Down</strong>: Navigate search results</li>
				<li><strong>Enter</strong>: Select search result</li>
				<li><strong>Esc</strong>: Close this panel</li>
			</ul>
			<h2>Killmail</h2>
			<ul class="list-disc pl-5">
				<li><strong>c</strong>: Focus on the comment box</li>
			</ul>
		</div>
	</div>
{/if}
