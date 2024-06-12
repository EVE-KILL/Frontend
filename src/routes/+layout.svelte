<script lang="ts">
	import '../app.css';
	import Navbar from '../components/Navbar.svelte';
</script>

<div id="content" class="content flex flex-col mx-auto max-w-7xl">
	<div id="inner-content" class="inner-content">
		<Navbar />
		<slot />
	</div>
</div>

<style>
	.content {
		background-color: rgba(21, 21, 21, 0.7);
		border: 2px solid #252525;
		border-radius: 10px;
	}
</style>
