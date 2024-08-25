import { getUpstreamUrl } from '$lib/Config';

export async function load({ params }) {
	const { type } = params;
	const upstreamUrl = getUpstreamUrl();

	// Construct the killList URL on the server
	const killListUrl = `${upstreamUrl}/api/killlist/${type}`;

	return {
		type,
		killListUrl,
		upstreamUrl // Pass upstreamUrl so it can be used for dynamic updates in the component
	};
}
