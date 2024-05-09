<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Navbar from './Navbar.svelte';
	import './new_styles.css';

	onMount(async () => {
		if (!browser) return;

		// this is enough for most components
		await import('bootstrap');

		// some components require a bootstrap instance, to fulfil their job. In that case, use this:
		// const bootstrap = await import("bootstrap");
		// sample usage:
		// const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
	});
</script>

<h1 class="page-heading"><a href="#">EVE-KILL</a></h1>
<div class="container content-wrap-outer">
	<section>
        <Navbar></Navbar>

		<section>
			<headerkb>
				<h1>PAGETITLE</h1>
			</headerkb>

			<div id="boardmessage">SOME MESSAGE</div>

			<div id="content" style="width: 100%">content here!</div>

			<div id="context">context!</div>

			<div id="footerarea">
				<br />
				<div class="counter"></div>
				<br />
				<div>
					<a
						href="http://evekb.org/forum/viewtopic.php?f=1033&amp;t=18159"
						data-svelte-h="svelte-h5ok1i">EVE+</a
					>
					theme by
					<a href="http://gate.eveonline.com/profile/vecati" data-svelte-h="svelte-1wtuk02"
						>Vecati</a
					>
					<br />
					Modified for Thessia by Karbowiak
				</div>
			</div>
		</section>
	</section>
</div>
