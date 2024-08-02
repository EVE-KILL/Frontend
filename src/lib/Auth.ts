import { getUpstreamUrl } from './Config.ts';

export async function getEVEAuthLoginUrl() {
	const baseUrl = getUpstreamUrl();
	const fetchUrl = `${baseUrl}/api/auth/eve/getloginurl`;

	try {
		const response = await fetch(fetchUrl);
		let resp = await response.json();

		return resp.url;
	} catch (error) {
		console.error('Error fetching kill list:', error);
	}
}
