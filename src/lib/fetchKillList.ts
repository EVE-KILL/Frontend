export async function fetchKillList(
	url: string = 'https://eve-kill.com/api/killlist/latest',
	pageNumber: number = 1
) {
	const fetchUrl = `${url}/${pageNumber}`;

	try {
		const response = await fetch(fetchUrl);
		return await response.json();
	} catch (error) {
		console.error('Error fetching kill list:', error);
	}
}
