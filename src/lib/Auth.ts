import { backendFetch } from './backendFetcher.ts';
import { getUpstreamUrl } from './Config.ts';

export async function getEVEAuthLoginUrl() {
	const baseUrl = getUpstreamUrl();
	const fetchUrl = `${baseUrl}/api/auth/eve/getloginurl`;

	try {
		const response = await backendFetch(fetchUrl);
		let resp = await response.json();

		return resp.url;
	} catch (error) {
		console.error('Error fetching EVE auth login url:', error);
	}
}

export async function getEVEAuthLoginUrlNoScope() {
	const baseUrl = getUpstreamUrl();
	const fetchUrl = `${baseUrl}/api/auth/eve/getloginurl?noscope=true	`;

	try {
		const response = await backendFetch(fetchUrl);
		let resp = await response.json();

		return resp.url;
	} catch (error) {
		console.error('Error fetching EVE auth login url:', error);
	}
}
