const killListURL = 'https://eve-kill.com/api/killlist/latest';
const pageId = 1;

export async function fetchKillList(pageNumber = 1) {
    const url = `${killListURL}/${pageNumber}`;

    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching kill list:', error);
    }
}
