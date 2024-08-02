<script lang="ts">
	import { page } from '$app/stores';
	import { getUpstreamUrl } from '$lib/Config';
	import { formatNumber } from '$lib/Helpers.ts';
	import { generateEveShipFit, itemSlotTypes } from '$lib/Killmail.ts';
	import { onMount } from 'svelte';
	import type { Killmail } from '../../../types/Killmail.ts';
	import type { Fitting } from '../../../types/Killmail/Fitting.ts';
	import {
		ShipFit,
		CurrentCharacterProvider,
		DefaultCharactersProvider,
		EveDataProvider,
		DogmaEngineProvider,
		CurrentFitProvider,
		StatisticsProvider,
		useImportEveShipFit
	} from '@eveshipfit/react';

	export let data;
	let killmail: Killmail;
	let fit: Fitting;
	let totalDamage: number;
	let sortedComments = [];
	let newComment = '';
	// Make it so users can pass ?comments=true to the URL to enable comments, but default is false
	let commentsEnabled = false;
	page.subscribe(($page) => {
		if ($page.url.searchParams.get('comments') === 'true') {
			commentsEnabled = true;
		}
	});
	// This is a placeholder, and should be populated by the onMount and an API in the background
	// Remember to add websocket to it as well so newly posted comments are automatically populated and shown
	let comments = [
		{
			id: 1,
			character: {
				name: 'John Doe',
				image_url: 'https://via.placeholder.com/128',
				corporation_name: 'Corp A',
				alliance_name: 'Alliance A'
			},
			body: 'This is the best killmail ever!',
			date: new Date().toISOString(),
			rating: 5
		},
		{
			id: 2,
			character: {
				name: 'Alice Johnson',
				image_url: 'https://via.placeholder.com/128',
				corporation_name: 'Corp C',
				alliance_name: 'Alliance C'
			},
			body: "This is a placeholder comment. It's not very interesting.",
			date: new Date().toISOString(),
			rating: 7
		},
		{
			id: 3,
			character: {
				name: 'Bob Brown',
				image_url: 'https://via.placeholder.com/128',
				corporation_name: 'Corp D',
				alliance_name: 'Alliance D'
			},
			body: 'Yet another placeholder comment.',
			date: new Date().toISOString(),
			rating: 2
		}
	];
	const upstreamUrl = getUpstreamUrl();

	let groupedItems = [];

	onMount(async () => {
		const response = await fetch(`${upstreamUrl}/api/killmail/${data.id}`);
		killmail = await response.json();
		console.log(killmail);

		// Generate the ESF for the killmail
		fit = await generateEveShipFit(killmail);

		// Group items by slot type
		const slotTypes = itemSlotTypes();
		groupedItems = Object.keys(slotTypes).map((slotType) => {
			return {
				slotType,
				items: groupByQty(
					killmail.items.filter((item) => slotTypes[slotType].includes(item.flag))
				)
			};
		});

		// Calculate the total damage done
		totalDamage = calculateTotalDamage(killmail.attackers);

		// Sort comments by date
		sortComments('date'); // Default sorting by date

		console.log(comments);
	});

	function groupByQty(items) {
		const grouped = items.reduce((acc, item) => {
			const key = `${item.type_id}_${item.qty_dropped || 0}_${item.qty_destroyed || 0}`;
			if (!acc[key]) {
				acc[key] = { ...item, qty_dropped: 0, qty_destroyed: 0 };
			}
			acc[key].qty_dropped += item.qty_dropped || 0;
			acc[key].qty_destroyed += item.qty_destroyed || 0;
			return acc;
		}, {});

		return Object.values(grouped);
	}

	function itemDroppedIsk(items) {
		let total = 0;
		items.forEach((item) => {
			if (item.qty_dropped > 0) {
				total += item.value * item.qty_dropped;
			}
		});
		return total;
	}

	function itemDestroyedIsk(items) {
		let total = 0;
		items.forEach((item) => {
			if (item.qty_destroyed > 0) {
				total += item.value * item.qty_destroyed;
			}
		});
		return total;
	}

	function calculateTotalDamage(attackers) {
		return attackers.reduce((total, attacker) => total + attacker.damage_done, 0);
	}

	// Function to get gradient color based on security status
	function getSecurityColor(status) {
		// Convert the range from -1 to 1 to 0 to 1
		const normalizedStatus = (status + 1) / 2;
		// Calculate the red and green values
		const red = Math.round(255 * (1 - normalizedStatus));
		const green = Math.round(255 * normalizedStatus);
		return `rgb(${red}, ${green}, 0)`;
	}

	function sortComments(criteria) {
		if (criteria === 'date') {
			sortedComments = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));
		} else if (criteria === 'rating') {
			sortedComments = [...comments].sort((a, b) => b.rating - a.rating);
		} else if (criteria === 'id') {
			sortedComments = [...comments].sort((a, b) => a.id - b.id);
		}
	}

	function getColorFromRating(rating) {
		const clampedRating = Math.max(-10, Math.min(10, rating));
		const red = Math.round(255 * (1 - (clampedRating + 10) / 20));
		const green = Math.round(255 * ((clampedRating + 10) / 20));
		return `rgb(${red}, ${green}, 0)`;
	}

	function postComment() {
		if (newComment.trim() !== '') {
			const comment = {
				id: sortedComments.length + 1,
				character: {
					name: 'Current User',
					image_url: 'https://via.placeholder.com/128',
					corporation_name: 'Current Corp',
					alliance_name: 'Current Alliance'
				},
				body: newComment,
				date: new Date().toISOString(),
				rating: 0
			};
			sortedComments = [comment, ...sortedComments];
			newComment = '';
		}
	}
</script>

{#if killmail && fit}
	<div class="container flex p-2 pt-4 gap-2">
		<!-- Left Container -->
		<div class="w-full text-white p-4 rounded-lg shadow-lg">
			<div class="flex">
				<!-- Fitting Wheel -->
				<div class="fitting-wheel mr-4">
					<react:CurrentFitProvider initialFit={fit}>
						<react:EveDataProvider dataUrl="https://eve-kill.com/sde/">
							<react:DogmaEngineProvider>
								<react:DefaultCharactersProvider>
									<react:CurrentCharacterProvider>
										<react:StatisticsProvider>
											<react:ShipFit withStats />
										</react:StatisticsProvider>
									</react:CurrentCharacterProvider>
								</react:DefaultCharactersProvider>
							</react:DogmaEngineProvider>
						</react:EveDataProvider>
					</react:CurrentFitProvider>
				</div>

				<!-- Kill Information -->
				<div>
					<div class="w-full flex flex-col items-start mb-4">
						<div class="flex justify-start items-start mb-2">
							<!-- Character and Corporation Info -->
							<a href={`/character/${killmail.victim.character_id}/`} class="mr-2">
								<img
									src={`https://images.evetech.net/characters/${killmail.victim.character_id}/portrait?size=128`}
									alt={killmail.victim.character_name}
									class="h-32 w-32 rounded-md"
								/>
							</a>
							<div class="flex flex-col justify-center">
								<a href={`/corporation/${killmail.victim.corporation_id}/`}>
									<img
										src={`https://images.evetech.net/corporations/${killmail.victim.corporation_id}/logo?size=64`}
										alt={killmail.victim.corporation_name}
										class="h-16 w-16 rounded-md"
									/>
								</a>
								{#if killmail.victim.alliance_id > 0}
									<a href={`/alliance/${killmail.victim.alliance_id}/`}>
										<img
											src={`https://images.evetech.net/alliances/${killmail.victim.alliance_id}/logo?size=64`}
											alt={killmail.victim.alliance_name}
											class="h-16 w-16 rounded-md"
										/>
									</a>
								{/if}
								{#if killmail.victim.faction_id > 0}
									<a href={`/faction/${killmail.victim.faction_id}/`}>
										<img
											src={`https://images.evetech.net/corporations/${killmail.victim.faction_id}/logo?size=64`}
											alt={killmail.victim.faction_name}
											class="h-16 w-16 rounded-md"
										/>
									</a>
								{/if}
							</div>
						</div>
					</div>
					<table class="table-auto w-full text-left mt-4 text-sm">
						<tbody>
							<tr>
								<th class="p-1">Character:</th>
								<td class="p-1">
									<a
										href={`/character/${killmail.victim.character_id}/`}
										class="text-lg font-bold"
									>
										{killmail.victim.character_name}
									</a>
								</td>
							</tr>
							<tr>
								<th class="p-1">Corporation:</th>
								<td class="p-1">
									<a
										href={`/corporation/${killmail.victim.corporation_id}/`}
										class="text-sm"
									>
										{killmail.victim.corporation_name}
									</a>
								</td>
							</tr>
							{#if killmail.victim.alliance_id > 0}
								<tr>
									<th class="p-1">Alliance:</th>
									<td class="p-1">
										<a
											href={`/alliance/${killmail.victim.alliance_id}/`}
											class="text-sm"
										>
											{killmail.victim.alliance_name}
										</a>
									</td>
								</tr>
							{/if}
							{#if killmail.victim.faction_id > 0}
								<tr>
									<th class="p-1">Faction:</th>
									<td class="p-1">
										<a
											href={`/faction/${killmail.victim.faction_id}/`}
											class="text-sm"
										>
											{killmail.victim.faction_name}
										</a>
									</td>
								</tr>
							{/if}
							<tr>
								<th class="p-1">Ship:</th>
								<td class="p-1">
									<a
										href={`/ship/${killmail.victim.ship_id}/`}
										class="text-blue-500"
									>
										{killmail.victim.ship_name}
									</a>
									<small class="text-gray-500">
										(
										<a
											href={`/group/${killmail.victim.ship_group_id}/`}
											class="text-blue-500"
										>
											{killmail.victim.ship_group_name}
										</a>
										)
									</small>
								</td>
							</tr>
							<tr>
								<th class="p-1">System:</th>
								<td class="p-1">
									<a
										href={`/system/${killmail.system_id}/`}
										class="text-blue-500"
									>
										{killmail.system_name}
									</a>
									<span class="text-gray-500">
										(<span
											style={`color: ${getSecurityColor(killmail.system_security)}`}
										>
											{formatNumber(killmail.system_security)}
										</span>)
									</span>
								</td>
							</tr>
							<tr>
								<th class="p-1">Region:</th>
								<td class="p-1">
									<a
										href={`/region/${killmail.region_id}/`}
										class="text-blue-500"
									>
										{killmail.region_name}
									</a>
								</td>
							</tr>
							{#if killmail.near != ''}
								<tr>
									<th class="p-1">Location:</th>
									<td class="p-1">{killmail.near}</td>
								</tr>
							{/if}
							<tr>
								<th class="p-1">Time:</th>
								<td class="p-1">{killmail.kill_time}</td>
							</tr>
							<tr>
								<th class="p-1">Points:</th>
								<td class="p-1">{killmail.point_value}</td>
							</tr>
							<tr>
								<th class="p-1">Damage:</th>
								<td class="p-1">{formatNumber(killmail.victim.damage_taken)}</td>
							</tr>
							<tr>
								<th class="p-1">Dropped:</th>
								<td class="p-1 font-bold"
									>{formatNumber(itemDroppedIsk(killmail.items))} ISK</td
								>
							</tr>
							<tr>
								<th class="p-1">Destroyed:</th>
								<td class="p-1 font-bold"
									>{formatNumber(itemDestroyedIsk(killmail.items))} ISK</td
								>
							</tr>
							<tr>
								<th class="p-1">Total:</th>
								<td class="p-1 font-bold"
									>{formatNumber(killmail.total_value)} ISK</td
								>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Items -->
			<div class="w-full rounded-lg shadow-lg custom-space-x mt-4">
				<div class="overflow-x-auto" role="table">
					<table
						class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg"
					>
						<thead>
							<tr class="bg-darker text-white uppercase text-xs leading-normal">
								<th class="px-2 py-1" scope="col"></th>
								<th class="px-2 py-1" scope="col">Name</th>
								<th class="px-2 py-1" scope="col">Destroyed</th>
								<th class="px-2 py-1" scope="col">Dropped</th>
								<th class="px-2 py-1" scope="col">Value (ISK)</th>
							</tr>
						</thead>
						<tbody class="text-gray-300 text-sm">
							{#each groupedItems as group}
								{#if group.items.length > 0}
									<tr class="bg-gray-700 text-white">
										<td colspan="5" class="px-2 py-1 font-bold"
											>{group.slotType}</td
										>
									</tr>
								{/if}
								{#each group.items as item}
									<tr
										class={`border-b border-gray-700 hover:bg-gray-600 transition-colors duration-30 ${
											item.qty_dropped > 0
												? 'dropped-items'
												: item.qty_destroyed > 0
													? 'destroyed-items'
													: ''
										}`}
									>
										<td class="px-2 py-1">
											<img
												src={`https://images.evetech.net/types/${item.type_id}/icon?size=32`}
												alt={item.type_name}
												class="h-8 w-8 rounded-md"
											/>
										</td>
										<td class="px-2 py-1">{item.type_name}</td>
										<td class="px-2 py-1">{item.qty_destroyed}</td>
										<td class="px-2 py-1">{item.qty_dropped}</td>
										<td class="px-2 py-1">
											{formatNumber(
												item.value * (item.qty_destroyed + item.qty_dropped)
											)}
										</td>
									</tr>
								{/each}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Right Container -->
		<div class="w-2/4 text-white p-4 rounded-lg shadow-lg">
			{#if commentsEnabled === true}
				<!-- Comments Section -->
				<div class="overflow-x-auto" role="table">
					<table
						class="table-auto bg-semi-transparent bg-gray-800 rounded-lg shadow-lg w-full"
					>
						<thead>
							<tr class="bg-darker text-white uppercase text-xs leading-normal">
								<th scope="col"></th>
								<th scope="col">Sorting</th>
								<th scope="col">
									<button
										class="sort-button"
										on:click={() => sortComments('rating')}>Rating</button
									>
								</th>
								<th scope="col">
									<button class="sort-button" on:click={() => sortComments('id')}
										>Posted</button
									>
								</th>
								<th scope="col">
									<button
										class="sort-button"
										on:click={() => sortComments('date')}>Date</button
									>
								</th>
							</tr>
						</thead>
						<tbody class="text-gray-300 text-sm">
							{#each sortedComments as comment}
								<tr
									class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
								>
									<td class="px-1 py-1">
										<div class="comment-actions flex flex-col items-center">
											<button class="upvote flex items-center justify-center">
												<i class="fas fa-arrow-up"></i>
											</button>
											<div
												class="votes my-2"
												style="color: {getColorFromRating(comment.rating)}"
											>
												{comment.rating}
											</div>
											<button
												class="downvote flex items-center justify-center"
											>
												<i class="fas fa-arrow-down"></i>
											</button>
										</div>
									</td>

									<td class="px-1 py-1">
										<img
											src={comment.character.image_url}
											alt={comment.character.name}
											class="h-16 w-16 rounded-md"
										/>
									</td>
									<td class="px-1 py-1" colspan="3">
										<div class="text-left text-xs">
											{comment.character.name} <br />
											<div class="text-gray-500">
												{comment.character.corporation_name} / {comment
													.character.alliance_name}
											</div>
										</div>

										<div class="mt-2">{comment.body}</div>
										<div class="text-gray-500 text-xs mt-2 text-right">
											{comment.date}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<!-- Comment Input Box -->
					<div class="bg-semi-transparent bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
						<div class="flex items-start">
							<img
								src="https://via.placeholder.com/128"
								alt="Current User"
								class="h-16 w-16 rounded-md mr-4"
							/>
							<textarea
								class="w-full bg-gray-700 text-white rounded-md p-2"
								rows="4"
								placeholder="Write a comment..."
								bind:value={newComment}
							></textarea>
						</div>
						<div class="flex justify-end mt-2">
							<button class="post-button" on:click={postComment}>Post Comment</button>
						</div>
					</div>
				</div>
			{/if}
			<!-- Attackers -->
			<div class="overflow-x-auto" role="table">
				<table class="table-auto bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
					<thead>
						<tr class="bg-darker text-white uppercase text-xs leading-normal">
							<th class="px-2 py-1" scope="col"></th>
							<th class="px-2 py-1" scope="col"></th>
							<th class="px-2 py-1" scope="col"></th>
							<th class="px-2 py-1" scope="col">Damage</th>
						</tr>
					</thead>
					<tbody class="text-gray-300 text-sm">
						{#each killmail.attackers as attacker}
							<tr
								class="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300"
							>
								<td class="px-2 py-1">
									<a href={`/character/${attacker.character_id}`}>
										<img
											src={`${attacker.character_image_url}?size=128`}
											alt={attacker.character_name}
											class="h-16 w-16 rounded-md"
										/>
									</a>
								</td>
								<td class="px-2 py-1">
									<img
										src={attacker.ship_image_url}
										alt={attacker.ship_name}
										class="h-8 w-8 rounded-md"
									/>
									<img
										src={`https://images.evetech.net/types/${attacker.weapon_type_id}/icon?size=64`}
										alt={attacker.weapon_type_name}
										class="h-8 w-8 rounded-md"
									/>
								</td>
								<td class="px-2 py-1">
									<div>
										<a
											href={`/character/${attacker.character_id}`}
											class="text-blue-400 hover:underline"
										>
											{attacker.character_name}
										</a>
									</div>
									<div>
										<a
											href={`/corporation/${attacker.corporation_id}`}
											class="text-blue-400 hover:underline"
										>
											{attacker.corporation_name}
										</a>
									</div>
									<div>
										<a
											href={`/alliance/${attacker.alliance_id}`}
											class="text-blue-400 hover:underline"
										>
											{attacker.alliance_name}
										</a>
									</div>
								</td>
								<td class="px-2 py-1">
									<div>{attacker.damage_done}</div>
									<div>
										{((attacker.damage_done / totalDamage) * 100).toFixed(1)}%
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.dropped-items {
		background-color: rgba(21, 255, 0, 0.1);
	}

	.destroyed-items {
		background-color: rgba(255, 0, 0, 0.117);
	}

	.fitting-wheel {
		position: relative;
		top: 0;
		right: 0;
		width: 600px;
		height: 600px;
		min-width: 600px;
		min-height: 600px;
	}

	.custom-space-x {
		margin-right: 25px;
	}

	.comment-actions {
		display: flex;
		align-items: center;
	}

	.upvote,
	.downvote {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.sort-button {
		background-color: #4a4a4a;
		color: white;
		border: none;
		padding: 5px 10px;
		margin-right: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.sort-button:hover {
		background-color: #6a6a6a;
	}
</style>
