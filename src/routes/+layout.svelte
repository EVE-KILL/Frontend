<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import Navbar from '../components/Navbar.svelte';
</script>

<div id="content" class="content flex flex-col mx-auto">
	<div id="inner-content" class="inner-content">
		<Navbar />
		<slot />
	</div>
</div>

<style>
	.content {
		max-width: 90rem;
		background-color: rgba(21, 21, 21, 0.4);
		border: 2px solid #252525;
		padding: 5px;
		border-radius: 10px;
	}

	#content > #inner-content {
		display: block;
		border: 5px solid rgba(0, 0, 0, 0.5);
		padding: 0px 20px 20px 20px;
		background: rgba(0, 0, 0, 0.8);
		margin-bottom: 5px;
	}
</style>
