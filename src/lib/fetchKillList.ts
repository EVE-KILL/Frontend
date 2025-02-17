import { backendFetch } from "./backendFetcher";

export async function fetchKillList(url: string = 'https://eve-kill.com/api/killlist?type=latest', pageNumber: number = 1) {
	const fetchUrl = `${url}&page=${pageNumber}`;
	let response = await backendFetch(fetchUrl);
	return await response.json();
}
