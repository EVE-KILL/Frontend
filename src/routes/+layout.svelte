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
		<nav class="navbar navbar-expand-lg" id="main-horizontal-navigation">
			<div class="container-xl">
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#eve-killboard-nav"
					aria-controls="eve-killboard-nav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>

				<div class="collapse navbar-collapse" id="eve-killboard-nav">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<a class="nav-link active" aria-current="page" href="#">HOME</a>
						</li>
						<li class="nav-item dropdown">
							<a href="#" class="nav-link">Kills</a>
							<div class="dropdown-content">
								<!-- dropdown content here -->
								<table>
									<tr>
										<th><a class="link" href="/latest/">Latest</a></th>
										<th><a class="link" href="/bigkills/">Big</a></th>
										<th><a class="link" href="/wspace/">W-Space</a></th>
									</tr>
									<tr>
										<th><a class="link" href="/highsec/">HighSec</a></th>
										<th><a class="link" href="/lowsec/">LowSec</a></th>
										<th><a class="link" href="/nullsec/">NullSec</a></th>
									</tr>
									<tr>
										<th><a class="link" href="/solo/">Solo</a></th>
										<th><a class="link" href="/npc/">NPC</a></th>
									</tr>
									<tr>
										<th><a class="link" href="/5b/">+5b</a></th>
										<th><a class="link" href="/10b/">+10b</a></th>
										<th><a class="link" href="/citadels/">Citadels</a></th>
									</tr>
									<tr>
										<th><a class="link" href="/t1/">T1</a></th>
										<th><a class="link" href="/t2/">T2</a></th>
										<th><a class="link" href="/t3/">T3</a></th>
									</tr>
									<tr>
										<th><a class="link" href="/frigates/">Frigates</a></th>
										<th><a class="link" href="/destroyers/">Destroyers</a></th>
										<th><a class="link" href="/cruisers/">Cruisers</a></th>
									</tr>
									<tr>
										<th><a class="link" href="/battlecruisers/">BattleCruisers</a></th>
										<th><a class="link" href="/battleships/">BattleShips</a></th>
										<th><a class="link" href="/capitals/">Capitals</a></th>
									</tr>
									<tr>
										<th><a class="link" href="/freighters/">Freighters</a></th>
										<th><a class="link" href="/supercarriers/">SuperCarriers</a></th>
										<th><a class="link" href="/titans/">Titans</a></th>
									</tr>
								</table>
							</div>
						</li>

						<li class="nav-item">
							<a class="nav-link" href="#">BATTLES</a>
						</li>

						<li class="nav-item">
							<a class="nav-link" href="#">WARS</a>
						</li>

						<li class="nav-item">
							<a class="nav-link" href="#">MAP</a>
						</li>

						<li class="nav-item">
							<a class="nav-link" href="#">TOP</a>
						</li>
					</ul>
					<form class="d-flex" role="search">
						<input
							class="form-control me-2"
							id="searchBox"
							type="search"
							placeholder="Search"
							aria-label="Search"
						/>
					</form>
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<a class="nav-link" href="#">LOGIN</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="#">INFORMATION</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>

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
