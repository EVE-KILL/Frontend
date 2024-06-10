<script>
	import "../app.css";
	import Navbar from '../components/Navbar.svelte';
</script>

<div id="content" class="content flex flex-col h-screen mx-auto max-w-7xl">
	<div id="inner-content" class="inner-content">
		<Navbar/>

		<div class="container mx-auto mt-10">
			<slot/>
		</div>
	</div>
</div>