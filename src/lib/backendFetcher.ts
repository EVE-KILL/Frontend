export async function backendFetch(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	return fetch(url, options);
}
