export function formatNumber(value: number) {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return formatter.format(value);
}

export function truncateString(str: string, num: number): string {
    return str.length <= num ? str : str.slice(0, num) + '...';
}

/**
 * Converts EVE HTML blobs to properly formatted HTML.
 * - Converts color codes to proper HTML colors.
 * - Updates `showinfo` links to a new format.
 * - Converts newlines to `<br>` tags.
 * - Handles escaped single quotes.
 *
 * @param {string} html - The EVE HTML blob to convert.
 * @returns {string} - The converted HTML.
 */
export function convertEveHtml(html: string): string {
    if (!html) return '';

    // Replace escaped single quotes
    html = html.replace(/\\'/g, "'");

    // Replace color tags
    html = html.replace(/<color='0x([A-Fa-f0-9]{8})'>/g, (_, hex) => {
        const color = `#${hex.slice(2)}`;
        return `<span style="color:${color}">`;
    });

    // Replace showinfo links
    html = html.replace(/<a href=showinfo:(\d+)>/g, '<a href="/item/$1">');

    // Close span tags properly
    html = html.replace(/<\/color>/g, '</span>');

    // Replace font tags
    html = html.replace(/<font[^>]*color="#([A-Fa-f0-9]{8})"[^>]*>/g, (_, hex) => {
        const color = `#${hex.slice(2)}`;
        return `<span style="color:${color}">`;
    });
    html = html.replace(/<\/font>/g, '</span>');

    // Replace newlines with <br> tags
    html = html.replace(/\n/g, '<br>');

    return html;
}
