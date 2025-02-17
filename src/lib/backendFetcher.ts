export async function backendFetch(url: string, options: any[] = []): Promise<Response> {
	// Generate a fetch url with the provided options
	if (options.length > 0) {
		url = `${url}?${options.join('&')}`;
	}

	console.log(`Fetching url: ${url}`);
	return fetch(url);
}
