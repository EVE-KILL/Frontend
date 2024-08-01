/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param: string): boolean {
	// If the param matches alliance, corporation, character, system or region it's a valid match
	return /^(alliance|corporation|character|system|region)$/.test(param);
}
