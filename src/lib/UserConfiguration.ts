export function get(key: string): any {
	// Retrieve the value from localStorage
	const value = localStorage.getItem(key);

	// Parse and return the value if it's a valid JSON string
	try {
		return value ? JSON.parse(value) : null;
	} catch (error) {
		console.error(`Error parsing localStorage value for key "${key}":`, error);
		return null;
	}
}

export function set(key: string, value: any): void {
	// Convert the value to a JSON string and store it in localStorage
	try {
		const stringValue = JSON.stringify(value);
		localStorage.setItem(key, stringValue);
	} catch (error) {
		console.error(`Error setting localStorage value for key "${key}":`, error);
	}
}

export function remove(key: string): void {
	// Remove the item from localStorage
	localStorage.removeItem(key);
}

export function clear(): void {
	// Clear all items from localStorage
	localStorage.clear();
}
