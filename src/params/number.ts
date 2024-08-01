/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param: string): boolean {
	// If the param matches integer it's a valid match
	return /^\d+$/.test(param);
}
