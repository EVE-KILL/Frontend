<div id="main_menu" class="flex-container">
	<ul class="flex-items">
		<div class="navigation-section">
			<li><a class="link" href="/">Home</a></li>
			<li class="dropdown">Kills
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
			<li><a class="link" href="/battles/">Battles</a></li>
			<li><a class="link" href="#">Wars</a></li>
			<li><a class="link" href="#">Map</a></li>
			<li><a class="link" href="#">Top</a></li>

			<li class="flex-grow">
				<form class="searchBox" method="get" action="#">
					<input class="typeahead" type="text" name="searchAutocomplete" id="searchBox" size="29" placeholder="Search" tabindex="1">
				</form>
			</li>

			<!-- Align right -->
			<li><a class="link" href="#">Login</a></li>
			<li class="dropdown">Information
				<div class="dropdown-content">
					<!-- dropdown content here -->
				</div>
			</li>
		</div>
	</ul>
</div>

<style>
    .flex-container {
        display: flex;
    }

    .flex-items {
        display: flex;
        flex-wrap: nowrap;
        padding: 0;
        margin: 0;
    }

    .flex-grow {
        flex-grow: 1;
    }

    .flex-grow input {
        width: 100%;
    }
</style>