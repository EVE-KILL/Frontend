<script>
	import { onMount } from 'svelte';
	export let isShortcutPanelOpen = false;
	export let closeShortcutPanel;

	function handleKeydown(event) {
		if (isShortcutPanelOpen && event.key === 'Escape') {
			event.preventDefault();
			closeShortcutPanel();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if isShortcutPanelOpen}
	<div
		class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
		on:click={closeShortcutPanel}
		aria-hidden="true"
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
				<li><strong>s</strong>: Focus on the search box</li>
				<li><strong>?</strong>: Open this shortcuts panel</li>
				<li><strong>Arrow Up/Down</strong>: Navigate search results</li>
				<li><strong>Enter</strong>: Select search result</li>
				<li><strong>Esc</strong>: Close this panel</li>
			</ul>
			<h2>Killmail</h2>
			<ul class="list-disc pl-5">
				<li><strong>c</strong>: Focus on the comment box</li>
			</ul>
			<button
				class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
				on:click={closeShortcutPanel}>Close</button
			>
		</div>
	</div>
{/if}

<style>
</style>
