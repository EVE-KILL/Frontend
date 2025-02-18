<script lang="ts">
    export let page: number;
    export let loading: boolean;
    export let changePage: (page: number) => void;
</script>

<div class="flex justify-between items-center mb-4">
	<button
		on:click={() => changePage(page - 1)}
		disabled={page === 1 || loading}
		class="px-4 py-2 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
	>
		Previous
	</button>
	<span class="text-white">Page {page}</span>
	<button
		on:click={() => changePage(page + 1)}
		disabled={loading}
		class="px-4 py-2 text-sm font-medium text-white bg-background-800 rounded-md hover:bg-background-700 disabled:opacity-50"
	>
		Next
	</button>
</div>
